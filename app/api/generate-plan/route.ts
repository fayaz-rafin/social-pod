import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Initialize Supabase client for server-side auth
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Rate limiting storage - in production, use Redis or a database
const rateLimitStore = new Map<string, { count: number; resetTime: number; hourlyCount: number; hourlyResetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_PER_MINUTE = 3; // 3 requests per minute
const RATE_LIMIT_PER_HOUR = 15;  // 15 requests per hour
const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;

// Get user ID from authorization header
async function getUserId(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    return user.id;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

function getRateLimitKey(userId: string): string {
  return `user_rate_limit:${userId}`;
}

function checkRateLimit(key: string): { allowed: boolean; message?: string; resetTime?: number } {
  const now = Date.now();
  const data = rateLimitStore.get(key) || { 
    count: 0, 
    resetTime: now + MINUTE_IN_MS,
    hourlyCount: 0,
    hourlyResetTime: now + HOUR_IN_MS
  };
  
  // Reset minute counter if time window expired
  if (now > data.resetTime) {
    data.count = 0;
    data.resetTime = now + MINUTE_IN_MS;
  }
  
  // Reset hourly counter if time window expired
  if (now > data.hourlyResetTime) {
    data.hourlyCount = 0;
    data.hourlyResetTime = now + HOUR_IN_MS;
  }
  
  // Check minute limit
  if (data.count >= RATE_LIMIT_PER_MINUTE) {
    return {
      allowed: false,
      message: `You've reached your request limit. Maximum ${RATE_LIMIT_PER_MINUTE} plan generations per minute allowed per user. Try again in ${Math.ceil((data.resetTime - now) / 1000)} seconds.`,
      resetTime: data.resetTime
    };
  }
  
  // Check hourly limit
  if (data.hourlyCount >= RATE_LIMIT_PER_HOUR) {
    return {
      allowed: false,
      message: `Hourly plan generation limit exceeded. Maximum ${RATE_LIMIT_PER_HOUR} plan generations per hour allowed per user. Try again in ${Math.ceil((data.hourlyResetTime - now) / (1000 * 60))} minutes.`,
      resetTime: data.hourlyResetTime
    };
  }
  
  // Increment counters
  data.count++;
  data.hourlyCount++;
  rateLimitStore.set(key, data);
  
  return { allowed: true };
}

// Clean up old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.hourlyResetTime) {
      rateLimitStore.delete(key);
    }
  }
}, HOUR_IN_MS); // Clean up every hour

export async function POST(request: NextRequest) {
  try {
    // Authentication check - get user ID
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { 
          error: "Authentication required. Please log in to generate meal plans.",
          type: "AUTHENTICATION_REQUIRED"
        },
        { status: 401 }
      );
    }

    // Rate limiting check (per user)
    const rateLimitKey = getRateLimitKey(userId);
    const rateLimitResult = checkRateLimit(rateLimitKey);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: rateLimitResult.message,
          type: "RATE_LIMIT_EXCEEDED"
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.resetTime ? Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString() : '60'
          }
        }
      );
    }

    const { prompt, budget } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are Mr. Brocoli, a helpful grocery planning assistant. You MUST respond with ONLY valid JSON, no additional text.

          Generate a grocery plan with this EXACT JSON structure:
          {
            "summary": "Brief description of the grocery plan",
            "ingredients": [
              {
                "name": "Ingredient name",
                "quantity": "Amount needed",
                "price": "5.99",
                "category": "Protein"
              }
            ],
            "totalCost": "45.50",
            "tips": ["Helpful tip 1", "Helpful tip 2", "Meal suggestion 1", "Meal suggestion 2"]
          }

          Rules:
          - Respond ONLY with valid JSON
          - Analyze the user's goal to determine if they mentioned a specific dish or general dietary goal
          - If NO specific dish is mentioned (goals like "bulk up", "lose weight", "eat healthy", "save money"):
            * Select versatile ingredients that support their goal
            * Include 2-3 specific MEAL SUGGESTIONS in the tips array (e.g., "Try making chicken stir-fry with these ingredients", "Make protein smoothies with the protein powder and fruits")
          - If a SPECIFIC dish is mentioned, focus ingredients on that dish
          - Consider the budget level:
            * Low budget ($10-30): Focus on budget-friendly staples, bulk items, seasonal produce
            * Medium budget ($30-80): Include some premium ingredients, variety of proteins
            * High budget ($80+): Include premium/organic options, variety of fresh ingredients
          - Include 6-10 ingredients based on budget
          - Price should be number as string (e.g., "5.99")
          - Categories: Protein, Vegetable, Grain, Dairy, Pantry, Herb/Spice, Fruit
          - Make sure total cost is 85-95% of the budget to leave room for extras
          - Always include practical shopping and meal prep tips`
        },
        {
          role: "user",
          content: `Goal: ${prompt}
Budget: $${budget}
Budget Level: ${budget <= 30 ? 'Low - Focus on budget-friendly essentials' : budget <= 80 ? 'Medium - Balance of quality and value' : 'High - Premium options available'}

Create a grocery plan JSON response that matches my goal and budget level.`
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 800,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("No response from Groq");
    }

    console.log("Raw Groq response:", responseContent);

    // Clean up the response - remove any markdown formatting or extra text
    let cleanedResponse = responseContent.trim();
    
    // Remove markdown json code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '');
    cleanedResponse = cleanedResponse.replace(/```\s*/g, '');
    
    // Find JSON object boundaries
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd);
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
      
      // Validate the structure
      if (!parsedResponse.summary || !parsedResponse.ingredients || !Array.isArray(parsedResponse.ingredients)) {
        throw new Error("Invalid JSON structure");
      }
      
      // Ensure totalCost is a string
      if (typeof parsedResponse.totalCost === 'number') {
        parsedResponse.totalCost = parsedResponse.totalCost.toString();
      }
      
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      console.error("Cleaned response:", cleanedResponse);
      
      // Extract information manually if JSON parsing fails
      const summaryMatch = cleanedResponse.match(/"summary":\s*"([^"]+)"/);
      const summary = summaryMatch ? summaryMatch[1] : "A grocery plan has been created for your dietary goals.";
      
      // Create a fallback structured response based on goal and budget
      const isLowBudget = budget <= 30;
      const isHighBudget = budget > 80;
      const isBulkingGoal = prompt.toLowerCase().includes('bulk') || prompt.toLowerCase().includes('muscle') || prompt.toLowerCase().includes('gain');
      const isWeightLossGoal = prompt.toLowerCase().includes('lose') || prompt.toLowerCase().includes('diet') || prompt.toLowerCase().includes('lean');
      
      let fallbackIngredients = [
        {
          name: isLowBudget ? "Chicken Thighs" : "Chicken Breast",
          quantity: "1 lb",
          price: isLowBudget ? "3.99" : "6.99",
          category: "Protein"
        },
        {
          name: isLowBudget ? "Brown Rice" : isHighBudget ? "Quinoa" : "Rice",
          quantity: isLowBudget ? "3 lbs" : "2 lbs",
          price: isLowBudget ? "2.49" : isHighBudget ? "5.99" : "3.49",
          category: "Grain"
        },
        {
          name: isLowBudget ? "Frozen Mixed Vegetables" : "Fresh Broccoli",
          quantity: isLowBudget ? "2 bags" : "2 heads",
          price: isLowBudget ? "2.99" : "3.99",
          category: "Vegetable"
        },
        {
          name: "Olive Oil",
          quantity: "1 bottle",
          price: isHighBudget ? "7.99" : "4.99",
          category: "Pantry"
        }
      ];
      
      if (isBulkingGoal && !isLowBudget) {
        fallbackIngredients.push({
          name: "Greek Yogurt",
          quantity: "32 oz",
          price: "5.99",
          category: "Dairy"
        });
      }
      
      if (isWeightLossGoal) {
        fallbackIngredients.push({
          name: "Spinach",
          quantity: "5 oz bag",
          price: "2.99",
          category: "Vegetable"
        });
      }
      
      const mealSuggestions = isBulkingGoal 
        ? ["Try making protein-rich stir-fry with chicken and rice", "Make Greek yogurt parfaits for extra protein"]
        : isWeightLossGoal 
        ? ["Make large salads with spinach and grilled chicken", "Try roasted vegetable bowls with minimal oil"]
        : ["Make simple one-pot meals with these ingredients", "Try meal prepping for the week"];
      
      parsedResponse = {
        summary: summary || `A ${budget <= 30 ? 'budget-friendly' : budget > 80 ? 'premium' : 'balanced'} grocery plan for your ${isBulkingGoal ? 'muscle-building' : isWeightLossGoal ? 'weight-loss' : 'healthy eating'} goals.`,
        ingredients: fallbackIngredients,
        totalCost: (budget * 0.9).toFixed(2),
        tips: [
          isLowBudget ? "Shop at discount stores for better prices" : "Look for sales on premium items",
          "Buy in bulk for non-perishables to save money",
          ...mealSuggestions
        ]
      };
    }

    return NextResponse.json(parsedResponse);
    
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
} 