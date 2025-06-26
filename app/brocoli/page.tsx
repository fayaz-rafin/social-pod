'use client';
import Image from "next/image";
import React, { useState } from "react";

interface Ingredient {
  name: string;
  quantity: string;
  price: string;
  category: string;
}

interface GroceryPlan {
  summary: string;
  ingredients: Ingredient[];
  totalCost: string;
  tips: string[];
}

export default function BrocoliPage() {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("I want to bulk up");
  const [budget, setBudget] = useState(50);
  const [groceryPlan, setGroceryPlan] = useState<GroceryPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          budget,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const plan: GroceryPlan = await response.json();
      setGroceryPlan(plan);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[#FDE500] px-4 pt-6 pb-6 w-full max-w-md mx-auto">
      {/* Top bar (fake status bar for mobile look) */}
      <div className="w-full flex justify-between items-center mb-2">
        <span className="text-xs font-semibold tracking-wide">9:41</span>
        <div className="flex gap-1 items-center">
          <span className="inline-block w-1.5 h-1.5 bg-black rounded-full"></span>
          <span className="inline-block w-1.5 h-1.5 bg-black rounded-full"></span>
          <span className="inline-block w-1.5 h-1.5 bg-black rounded-full"></span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="inline-block w-4 h-2 bg-black rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-black rounded-full"></span>
        </div>
      </div>
      {step === 1 ? (
        <>
          {/* Title and subtitle */}
          <div className="w-full flex flex-col items-start mt-2">
            <h1 className="text-5xl font-extrabold leading-none text-black">Create<br/>A Pod</h1>
            <p className="text-lg font-semibold text-black mt-2">Tell Mr Brocoli what you need</p>
          </div>
          {/* Mascot */}
          <div className="flex justify-center w-full my-6">
            <Image src="/brocoli.svg" alt="Mr Brocoli" width={132} height={137} priority />
          </div>
          {/* Input area */}
          <form className="w-full flex flex-col items-center flex-1" onSubmit={generatePlan}>
            <textarea
              className="w-full min-h-[120px] rounded-2xl p-4 text-lg font-semibold text-black bg-white placeholder:text-black/60 focus:outline-none resize-none shadow-md"
              placeholder="I want to bulk up"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              disabled={isLoading}
            />
            
            {/* Budget slider */}
            <div className="w-full mt-4">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-extrabold text-black">${budget}</span>
                <span className="text-sm font-bold text-black mb-1">Budget</span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-black h-2 rounded-lg appearance-none bg-white shadow-md"
                style={{ accentColor: '#171717' }}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="w-full mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full mt-8 bg-black text-white text-lg font-bold py-3 rounded-full shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating Plan...' : 'Generate a Plan'}
            </button>
          </form>
        </>
      ) : (
        <>
          {/* Plan Step */}
          <div className="w-full flex flex-col items-start mt-2">
            <h1 className="text-5xl font-extrabold leading-none text-black">Plan</h1>
            <p className="text-lg font-semibold text-black mt-2">Heaaar me out!</p>
          </div>
          
          <div className="w-full flex flex-col mt-6 flex-1 overflow-y-auto">
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-extrabold text-black">${groceryPlan?.totalCost || budget}</span>
              <span className="text-lg font-bold text-black mb-1">Total Cost</span>
            </div>
            
            <div className="w-full bg-white rounded-2xl p-4 shadow-md mb-4">
              <h3 className="font-bold text-black mb-2">Summary:</h3>
              <p className="text-black">{groceryPlan?.summary || "Your grocery trip is going to be protein filled, with vegetables and meat"}</p>
            </div>

            {groceryPlan?.ingredients && groceryPlan.ingredients.length > 0 && (
              <div className="w-full bg-white rounded-2xl p-4 shadow-md mb-4">
                <h3 className="font-bold text-black mb-3">Ingredients:</h3>
                <div className="space-y-2">
                  {groceryPlan.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <div>
                        <p className="font-semibold text-black">{ingredient.name}</p>
                        <p className="text-sm text-gray-600">{ingredient.quantity} • {ingredient.category}</p>
                      </div>
                      <span className="font-bold text-black">${ingredient.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groceryPlan?.tips && groceryPlan.tips.length > 0 && (
              <div className="w-full bg-white rounded-2xl p-4 shadow-md mb-4">
                <h3 className="font-bold text-black mb-2">Tips:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {groceryPlan.tips.map((tip, index) => (
                    <li key={index} className="text-black text-sm">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="relative mb-4">
              <div className="absolute right-0 bottom-0">
                <Image src="/brocoli.svg" alt="Mr Brocoli" width={80} height={83} />
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => setStep(1)}
                className="w-full bg-gray-600 text-white text-lg font-bold py-3 rounded-full shadow-lg active:scale-95 transition-transform"
              >
                Create New Plan
              </button>
              <button
                className="w-full bg-black text-white text-lg font-bold py-3 rounded-full shadow-lg active:scale-95 transition-transform"
              >
                Generate Grocery List
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 