'use client';
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface Ingredient {
  name: string;
  quantity: string;
  price: string;
  category: string;
  img?: string;
}

interface GroceryPlan {
  summary: string;
  ingredients: Ingredient[];
  totalCost: string;
  tips: string[];
  goals: {
    id: string;
    description: string;
    type: string;
    target: number;
    current: number;
    completed: boolean;
    trophy: string;
  }[];
}

// Random quotes for the speech bubble
const speechBubbleQuotes = [
  "Tell me what we are cooking today, and your needs",
  "What's on the menu today?",
  "Let's plan something delicious!",
  "Ready to create your perfect meal plan?",
  "What culinary adventure awaits?",
  "Time to build your grocery list!",
  "Let's make cooking fun and easy!",
  "What flavors are calling you today?"
];

export default function BrocoliPage() {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [budget, setBudget] = useState(50);
  const [groceryPlan, setGroceryPlan] = useState<GroceryPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingImages, setIsFetchingImages] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const router = useRouter();

  // Set random quote on component mount
  useEffect(() => {
    const randomQuote = speechBubbleQuotes[Math.floor(Math.random() * speechBubbleQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  // Auto-resize textareas when prompt changes
  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      textarea.style.height = 'auto';
      const minHeight = window.innerWidth >= 768 ? 80 : 60; // Different min heights for desktop/mobile
      textarea.style.height = Math.max(minHeight, textarea.scrollHeight) + 'px';
    });
  }, [prompt]);

  // Dedicated mobile broccoli component
  const { RiveComponent: MobileBroccoli } = useRive({
    src: '/broccoli.riv',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  // Dedicated desktop broccoli component
  const { RiveComponent: DesktopBroccoli } = useRive({
    src: '/broccoli.riv',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  // Dedicated plan step broccoli component
  const { RiveComponent: PlanBroccoli } = useRive({
    src: '/broccoli.riv',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  const fetchImagesForIngredients = async (ingredients: Ingredient[]) => {
    return await Promise.all(ingredients.map(async (item) => {
      try {
        const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(item.name)}&search_simple=1&action=process&json=1`);
        const data = await res.json();
        const image = data.products?.[0]?.image_front_url || "/noname.png";
        return { ...item, img: image };
      } catch {
        return { ...item, img: "/noname.png" };
      }
    }));
  };

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
      // Inject mock goals for demo/testing
      const mockGoals = [
        {
          id: 'protein_goal',
          description: 'Eat 100g protein/day',
          type: 'nutrition',
          target: 100,
          current: 0,
          completed: false,
          trophy: '🥇',
        },
        {
          id: 'veggie_variety',
          description: 'Buy 5 different vegetables',
          type: 'shopping',
          target: 5,
          current: 0,
          completed: false,
          trophy: '🥈',
        },
        {
          id: 'budget_master',
          description: 'Stay under $50 budget',
          type: 'budget',
          target: 1,
          current: 0,
          completed: false,
          trophy: '🥉',
        },
      ];
      setIsFetchingImages(true);
      // Fetch images for each ingredient
      const ingredientsWithImages = await fetchImagesForIngredients(plan.ingredients);
      setIsFetchingImages(false);
      setGroceryPlan({ ...plan, ingredients: ingredientsWithImages, goals: mockGoals });
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E9E9D8] w-full">
      {/* Desktop header */}
      <div className="hidden md:block p-8 lg:p-12">
        <Image
          src="/brocolli.svg"
          alt="Broccoli - Shopping made fun"
          width={240}
          height={80}
          className="h-12 lg:h-16 w-auto"
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:px-8 lg:px-12 max-w-md mx-auto md:max-w-none md:mx-0 md:w-full">
      {step === 1 ? (
        <>
          {/* Mobile Layout */}
          <div className="w-full max-w-sm md:hidden">
            {/* Broccoli and speech bubble */}
            <div className="w-full flex items-start gap-4 mb-8">
              <div className="flex-shrink-0">
                                 <div className="w-24 h-24 flex items-center justify-center">
                  <MobileBroccoli />
                </div>
              </div>
              <div className="relative bg-white rounded-2xl p-4 max-w-[240px] shadow-md flex-1">
                <p className="text-[#5B6470] font-semibold text-base leading-relaxed">
                  {currentQuote}
                </p>
                {/* Speech bubble tail */}
                <div className="absolute left-0 top-6 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-white -translate-x-4"></div>
              </div>
            </div>

            {/* Budget section */}
            <div className="w-full mb-8">
              <div className="flex items-baseline gap-2 mb-4">
                <span 
                  className="text-6xl font-extrabold text-[#375654]"
                  style={{
                    textShadow: '3px 3px 6px rgba(0,0,0,0.25), 2px 2px 4px rgba(0,0,0,0.15)',
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.15))'
                  }}
                >
                  ${budget}
                </span>
                <span 
                  className="text-xl font-semibold text-[#5B6470]"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2), 1px 1px 2px rgba(0,0,0,0.1)',
                    filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.15))'
                  }}
                >
                  Budget
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={5}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full h-6 rounded-full appearance-none cursor-pointer mobile-slider"
                  disabled={isLoading}
                />
                <style jsx>{`
                  .mobile-slider {
                    background: linear-gradient(
                      to right,
                      #5B6470 0%,
                      #5B6470 ${(budget - 10) / (500 - 10) * 100}%,
                      #f5f5f5 ${(budget - 10) / (500 - 10) * 100}%,
                      #f5f5f5 100%
                    );
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -1px 2px rgba(255,255,255,0.3);
                    border: 1px solid #d0d0d0;
                  }
                  .mobile-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #4F9A85;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.1);
                    position: relative;
                    z-index: 10;
                  }
                  .mobile-slider::-moz-range-thumb {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #4F9A85;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.1);
                  }
                `}</style>
              </div>
            </div>

            {/* Input area */}
            <form className="w-full flex flex-col space-y-4" onSubmit={generatePlan}>
              <div className="bg-white rounded-2xl p-4 shadow-md">
                <textarea
                  className="w-full text-[#5B6470] font-semibold text-lg bg-transparent placeholder:text-[#5B6470]/60 focus:outline-none resize-none overflow-hidden"
                  placeholder="I want to make pasta while bulking up"
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    // Auto-resize on change
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.max(60, target.scrollHeight) + 'px';
                  }}
                  disabled={isLoading}
                  rows={2}
                  style={{
                    minHeight: '60px',
                    height: prompt.length > 50 ? 'auto' : '60px'
                  }}
                />
              </div>

              {error && (
                <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full bg-[#375654] text-white text-lg font-bold py-4 rounded-full shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d4240]"
              >
                {isLoading ? 'Generating Plan...' : 'Generate A Plan'}
              </button>
            </form>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block w-full max-w-6xl mx-auto space-y-8 lg:space-y-12">
            {/* Top row: Broccoli + Speech bubble on left, Budget on right */}
            <div className="flex items-start justify-between gap-8 lg:gap-16">
              {/* Left side: Broccoli and speech bubble */}
              <div className="flex items-start gap-6 lg:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-[120px] h-[125px] lg:w-[140px] lg:h-[145px]">
                    <DesktopBroccoli />
                  </div>
                </div>
                <div className="relative bg-white rounded-2xl p-6 lg:p-8 max-w-[350px] lg:max-w-[400px] shadow-md">
                  <p className="text-[#5B6470] font-semibold text-lg lg:text-xl leading-relaxed">
                    {currentQuote}
                  </p>
                  {/* Speech bubble tail */}
                  <div className="absolute left-0 top-8 lg:top-10 w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-[20px] border-r-white -translate-x-5"></div>
                </div>
              </div>

              {/* Right side: Budget */}
              <div className="flex-shrink-0 min-w-[300px] lg:min-w-[400px]">
                <div className="flex items-baseline gap-4 mb-6">
                  <span 
                    className="text-6xl lg:text-7xl font-extrabold text-[#375654]"
                    style={{
                      textShadow: '4px 4px 8px rgba(0,0,0,0.25), 3px 3px 6px rgba(0,0,0,0.15)',
                      filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.15))'
                    }}
                  >
                    ${budget}
                  </span>
                  <span 
                    className="text-2xl lg:text-3xl font-semibold text-[#5B6470]"
                    style={{
                      textShadow: '3px 3px 6px rgba(0,0,0,0.2), 2px 2px 4px rgba(0,0,0,0.1)',
                      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.15))'
                    }}
                  >
                    Budget
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={5}
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="w-full h-8 lg:h-10 rounded-full appearance-none cursor-pointer desktop-slider"
                    disabled={isLoading}
                  />
                  <style jsx>{`
                    .desktop-slider {
                      background: linear-gradient(
                        to right,
                        #5B6470 0%,
                        #5B6470 ${(budget - 10) / (500 - 10) * 100}%,
                        #f5f5f5 ${(budget - 10) / (500 - 10) * 100}%,
                        #f5f5f5 100%
                      );
                      box-shadow: inset 0 3px 6px rgba(0,0,0,0.2), inset 0 -2px 3px rgba(255,255,255,0.3);
                      border: 1px solid #d0d0d0;
                    }
                    .desktop-slider::-webkit-slider-thumb {
                      appearance: none;
                      width: 40px;
                      height: 40px;
                      border-radius: 50%;
                      background: #4F9A85;
                      cursor: pointer;
                      border: none;
                      box-shadow: 0 6px 16px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.1);
                      position: relative;
                      z-index: 10;
                    }
                    @media (min-width: 1024px) {
                      .desktop-slider::-webkit-slider-thumb {
                        width: 48px;
                        height: 48px;
                        box-shadow: 0 8px 20px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.1);
                      }
                    }
                    .desktop-slider::-moz-range-thumb {
                      width: 40px;
                      height: 40px;
                      border-radius: 50%;
                      background: #4F9A85;
                      cursor: pointer;
                      border: none;
                      box-shadow: 0 6px 16px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.1);
                    }
                    @media (min-width: 1024px) {
                      .desktop-slider::-moz-range-thumb {
                        width: 48px;
                        height: 48px;
                        box-shadow: 0 8px 20px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.1);
                      }
                    }
                  `}</style>
                </div>
              </div>
            </div>

            {/* Bottom: Input and button */}
            <form className="w-full flex flex-col space-y-6 lg:space-y-8" onSubmit={generatePlan}>
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md">
                <textarea
                  className="w-full text-[#5B6470] font-semibold text-xl lg:text-2xl bg-transparent placeholder:text-[#5B6470]/60 focus:outline-none resize-none overflow-hidden"
                  placeholder="I want to buy groceries but i am on a budget and i want to make sure i get the best deal"
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    // Auto-resize on change
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.max(80, target.scrollHeight) + 'px';
                  }}
                  disabled={isLoading}
                  rows={2}
                  style={{
                    minHeight: '80px',
                    height: prompt.length > 50 ? 'auto' : '80px'
                  }}
                />
              </div>

              {error && (
                <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-base">
                  {error}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="bg-[#375654] text-white text-xl lg:text-2xl font-bold py-5 lg:py-6 px-16 lg:px-20 rounded-full shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d4240]"
                >
                  {isLoading ? 'Generating Plan...' : 'Generate A Plan'}
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="w-full max-w-sm md:max-w-lg lg:max-w-xl space-y-6 md:space-y-8">
          {/* Plan Step */}
          <div className="flex flex-row items-start justify-between w-full">
            <div className="flex flex-col items-start gap-1 md:gap-2">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-none text-[#5B6470]">Plan</h1>
              <p className="text-lg md:text-xl lg:text-2xl font-semibold text-[#5B6470]">Heaaar me out!</p>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className="w-[80px] h-[83px] md:w-[100px] md:h-[104px] lg:w-[120px] lg:h-[125px]">
                  <PlanBroccoli />
                </div>         
            </div>
          </div>

          
          <div className="w-full flex flex-col space-y-4 md:space-y-6 max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
            <div className="flex items-end gap-2 md:gap-4 mb-4 md:mb-6">
              <span className="text-7xl md:text-8xl lg:text-9xl font-extrabold text-[#5B6470]">${groceryPlan?.totalCost || budget}</span>
              <span className="text-lg md:text-xl lg:text-2xl font-bold text-[#5B6470] mb-1">Total Cost</span>
            </div>
            
            <div className="w-full min-h-[150px] md:min-h-[180px] lg:min-h-[200px] bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-md mb-4 flex items-center justify-center">
              <p className="font-extrabold text-black text-xl md:text-2xl lg:text-3xl text-center leading-relaxed">{groceryPlan?.summary || "Your grocery trip is going to be protein filled, with vegetables and meat"}</p>
            </div>

            {isFetchingImages && (
              <div className="w-full flex justify-center items-center my-4 md:my-6">
                <span className="text-[#5B6470] font-bold text-lg md:text-xl lg:text-2xl">Fetching grocery images...</span>
              </div>
            )}

            {groceryPlan?.ingredients && groceryPlan.ingredients.length > 0 && (
              <div className="w-full bg-white rounded-2xl p-4 shadow-md mb-4">
                <h3 className="font-bold text-black mb-3">Ingredients:</h3>
                <div className="space-y-2">
                  {groceryPlan.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <div className="flex items-center gap-3">
                        <img src={ingredient.img} alt={ingredient.name} className="w-10 h-10 rounded object-contain bg-gray-100" />
                        <div>
                          <p className="font-semibold text-black">{ingredient.name}</p>
                          <p className="text-sm text-gray-600">{ingredient.quantity} • {ingredient.category}</p>
                        </div>
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
                <div style={{ width: '80px', height: '83px' }}>
                  <PlanBroccoli />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 md:gap-4">
              <button
                onClick={() => setStep(1)}
                className="w-full bg-[#375654] text-white text-lg md:text-xl lg:text-2xl font-bold py-3 md:py-4 lg:py-5 rounded-full shadow-lg active:scale-95 transition-transform hover:bg-[#2d4240]"
              >
                Redo Plan
              </button>
              {groceryPlan && !isFetchingImages && (
                <button
                  className="w-full bg-[#375654] text-white text-lg md:text-xl lg:text-2xl font-bold py-3 md:py-4 lg:py-5 rounded-full shadow-lg active:scale-95 transition-transform hover:bg-[#2d4240]"
                  onClick={() => {
                    localStorage.setItem('groceryPlan', JSON.stringify(groceryPlan));
                    router.push(`/plan?prompt=${encodeURIComponent(prompt)}`);
                  }}
                >
                  Generate Grocery List
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
} 