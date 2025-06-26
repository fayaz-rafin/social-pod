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
          content: `You are Mr. Brocoli, a helpful grocery planning assistant. Given a user's dietary goal and budget, generate a detailed grocery plan that includes:
          
          1. A brief summary of the plan
          2. A detailed ingredient list with approximate prices
          3. Total estimated cost
          
          Format your response as JSON with this structure:
          {
            "summary": "Brief description of the grocery plan",
            "ingredients": [
              {
                "name": "Ingredient name",
                "quantity": "Amount needed",
                "price": "Estimated price in dollars",
                "category": "Food category (protein, vegetable, grain, etc.)"
              }
            ],
            "totalCost": "Total estimated cost",
            "tips": ["Helpful shopping or meal prep tips"]
          }
          
          Keep prices realistic and within the user's budget. If budget is tight, suggest budget-friendly alternatives.`
        },
        {
          role: "user",
          content: `My goal: ${prompt}\nMy budget: $${budget}\n\nPlease create a grocery plan for me.`
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("No response from Groq");
    }

    // Try to parse as JSON, fallback to text response if parsing fails
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      parsedResponse = {
        summary: responseContent,
        ingredients: [],
        totalCost: budget,
        tips: ["Check the full response above for detailed information"]
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