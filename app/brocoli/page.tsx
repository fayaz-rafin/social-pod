'use client';
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { supabase } from '../supabaseClient';

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
  const [rateLimitRetryAfter, setRateLimitRetryAfter] = useState<number | null>(null);
  const router = useRouter();

  // Set random quote on component mount
  useEffect(() => {
    const randomQuote = speechBubbleQuotes[Math.floor(Math.random() * speechBubbleQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  // Handle rate limit countdown
  useEffect(() => {
    if (rateLimitRetryAfter === null) return;

    const interval = setInterval(() => {
      setRateLimitRetryAfter(prev => {
        if (prev === null || prev <= 1) {
          setError(null); // Clear error when countdown reaches 0
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimitRetryAfter]);

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
      // Get user session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please log in to generate meal plans.');
      }

      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt,
          budget,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 && errorData.type === 'AUTHENTICATION_REQUIRED') {
          throw new Error('Please log in to generate meal plans.');
        }
        if (response.status === 429 && errorData.type === 'RATE_LIMIT_EXCEEDED') {
          const retryAfter = response.headers.get('Retry-After');
          if (retryAfter) {
            setRateLimitRetryAfter(parseInt(retryAfter));
          }
          throw new Error(errorData.error || 'Too many requests. Please wait before trying again.');
        }
        throw new Error(errorData.error || 'Failed to generate plan');
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
                  {rateLimitRetryAfter && (
                    <div className="mt-2 text-xs font-semibold">
                      You can try again in {rateLimitRetryAfter} seconds...
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !prompt.trim() || rateLimitRetryAfter !== null}
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
                  {rateLimitRetryAfter && (
                    <div className="mt-2 text-sm font-semibold">
                      You can try again in {rateLimitRetryAfter} seconds...
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim() || rateLimitRetryAfter !== null}
                  className="bg-[#375654] text-white text-xl lg:text-2xl font-bold py-5 lg:py-6 px-16 lg:px-20 rounded-full shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d4240]"
                >
                  {isLoading ? 'Generating Plan...' : 'Generate A Plan'}
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <>
          {/* Mobile Layout */}
          <div className="w-full max-w-sm space-y-6 md:hidden">
            {/* Plan Header with Speech Bubble */}
            <div className="relative flex items-center justify-between">
              {/* Speech Bubble */}
              <div className="relative bg-white rounded-2xl p-6 shadow-md mr-4 speech-bubble">
                <div className="flex flex-col">
                  <h1 className="text-4xl font-extrabold leading-none text-[#5B6470]">Plan</h1>
                  <p className="text-base font-semibold text-[#5B6470] mt-1">Heaaar me out!</p>
                </div>
                {/* Speech bubble tail */}
                <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
                  <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent"></div>
                </div>
              </div>
              {/* Broccoli */}
              <div className="w-16 h-16 flex-shrink-0">
                <PlanBroccoli />
              </div>
            </div>

            {/* Description Card */}
            <div className="w-full bg-white rounded-2xl p-6 shadow-md">
              <p className="font-semibold text-[#5B6470] text-lg leading-relaxed text-center">{groceryPlan?.summary || "Grocery plan for bulking up with a balanced mix of quality and value"}</p>
            </div>

            {/* Total Cost */}
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-extrabold text-[#5B6470]">${groceryPlan?.totalCost || budget}</span>
              <span className="text-xl font-semibold text-[#5B6470]">Total Cost</span>
            </div>

            <div className="w-full flex flex-col space-y-4 max-h-[50vh] overflow-y-auto">
              {isFetchingImages && (
                <div className="w-full flex justify-center items-center my-4">
                  <span className="text-[#5B6470] font-bold text-lg">Fetching grocery images...</span>
                </div>
              )}

              {groceryPlan?.ingredients && groceryPlan.ingredients.length > 0 && (
                <div className="w-full bg-white rounded-2xl p-6 shadow-md">
                  <div className="space-y-4">
                    {groceryPlan.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={ingredient.img} alt={ingredient.name} className="w-12 h-12 rounded-lg object-contain bg-gray-100" />
                          <div>
                            <p className="text-sm font-medium text-[#5B6470] mb-1">No Name's</p>
                            <p className="font-semibold text-black text-base">{ingredient.name}</p>
                            <p className="text-sm text-[#5B6470]">{ingredient.quantity} • {ingredient.category}</p>
                          </div>
                        </div>
                        <span className="font-bold text-black text-lg">${ingredient.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Edit Grocery List Button */}
            {groceryPlan && !isFetchingImages && (
              <button
                className="w-full bg-[#4F9A85] text-white text-xl font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform hover:bg-[#3d7a68]"
                onClick={() => {
                  localStorage.setItem('groceryPlan', JSON.stringify(groceryPlan));
                  router.push(`/plan?prompt=${encodeURIComponent(prompt)}`);
                }}
              >
                Edit Grocery List
              </button>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex w-full max-w-7xl mx-auto gap-8 lg:gap-12">
            {/* Left Column - Ingredients List */}
            <div className="flex-1 max-w-md">
              {groceryPlan?.ingredients && groceryPlan.ingredients.length > 0 && (
                <div className="w-full bg-white rounded-2xl p-6 shadow-md max-h-[70vh] overflow-y-auto">
                  <div className="space-y-4">
                    {groceryPlan.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-4">
                          <img src={ingredient.img} alt={ingredient.name} className="w-14 h-14 rounded-lg object-contain bg-gray-100" />
                          <div>
                            <p className="text-sm font-medium text-[#5B6470] mb-1">No Name's</p>
                            <p className="font-semibold text-black text-lg">{ingredient.name}</p>
                            <p className="text-sm text-[#5B6470]">{ingredient.quantity} • {ingredient.category}</p>
                          </div>
                        </div>
                        <span className="font-bold text-black text-xl">${ingredient.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Plan Summary */}
            <div className="flex-1 max-w-md space-y-8">
              {/* Plan Header with Speech Bubble */}
              <div className="relative flex items-center justify-between">
                {/* Speech Bubble */}
                <div className="relative bg-white rounded-2xl p-8 shadow-md mr-6">
                  <div className="flex flex-col">
                    <h1 className="text-5xl font-extrabold leading-none text-[#5B6470]">Plan</h1>
                    <p className="text-lg font-semibold text-[#5B6470] mt-2">Heaaar me out!</p>
                  </div>
                  {/* Speech bubble tail */}
                  <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
                    <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent"></div>
                  </div>
                </div>
                {/* Broccoli */}
                <div className="w-20 h-20 flex-shrink-0">
                  <PlanBroccoli />
                </div>
              </div>

              {/* Total Cost */}
              <div className="flex items-baseline gap-6">
                <span className="text-7xl font-extrabold text-[#5B6470]">${groceryPlan?.totalCost || budget}</span>
                <span className="text-2xl font-semibold text-[#5B6470]">Total Cost</span>
              </div>

              {/* Description Card */}
              <div className="w-full bg-white rounded-2xl p-8 shadow-md">
                <p className="font-semibold text-[#5B6470] text-xl leading-relaxed">{groceryPlan?.summary || "Grocery plan for bulking up with a balanced mix of quality and value"}</p>
              </div>

              {/* Generate A Plan Button */}
              {groceryPlan && !isFetchingImages && (
                <button
                  className="w-full bg-[#4F9A85] text-white text-2xl font-bold py-5 rounded-2xl shadow-lg active:scale-95 transition-transform hover:bg-[#3d7a68]"
                  onClick={() => {
                    localStorage.setItem('groceryPlan', JSON.stringify(groceryPlan));
                    router.push(`/plan?prompt=${encodeURIComponent(prompt)}`);
                  }}
                >
                  Generate A Plan
                </button>
              )}
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
} 