import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
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
            "tips": ["Helpful tip 1", "Helpful tip 2"]
          }

          Rules:
          - Respond ONLY with valid JSON
          - Keep prices realistic and within budget
          - Include 5-8 ingredients
          - Price should be number as string (e.g., "5.99")
          - Categories: Protein, Vegetable, Grain, Dairy, Pantry, Herb/Spice
          - Make sure total cost is close to but under the budget`
        },
        {
          role: "user",
          content: `Goal: ${prompt}\nBudget: $${budget}\n\nCreate a grocery plan JSON response.`
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
      
      // Create a fallback structured response
      parsedResponse = {
        summary: summary,
        ingredients: [
          {
            name: "Chicken Breast",
            quantity: "1 lb",
            price: "6.99",
            category: "Protein"
          },
          {
            name: "Rice",
            quantity: "2 lbs",
            price: "3.49",
            category: "Grain"
          },
          {
            name: "Mixed Vegetables",
            quantity: "1 bag",
            price: "2.99",
            category: "Vegetable"
          },
          {
            name: "Olive Oil",
            quantity: "1 bottle",
            price: "4.99",
            category: "Pantry"
          }
        ],
        totalCost: (budget * 0.9).toFixed(2),
        tips: ["Shop during sales for better prices", "Buy in bulk for non-perishables"]
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