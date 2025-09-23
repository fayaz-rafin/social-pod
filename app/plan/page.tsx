'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useState, useEffect, Suspense } from 'react';
import { saveGroceryPlan } from '../data/dataStore';
import { supabase } from '../supabaseClient';

const demoGroceries = [
  {
    name: "No Name's Diced Tomatoes",
    size: "700 g",
    img: "/diced-tomatoes.png",
    price: 5.99,
  },
  {
    name: "No Name's Farmer's Marble Cheese",
    size: "700 g",
    img: "/marble-cheese.png",
    price: 7.49,
  },
  {
    name: "No Name's 100% Pure Vegetable Oil",
    size: "946 ml",
    img: "/vegetable-oil.png",
    price: 4.29,
  },
  // Repeat for demo
  {
    name: "No Name's Diced Tomatoes",
    size: "700 g",
    img: "/diced-tomatoes.png",
    price: 5.99,
  },
  {
    name: "No Name's Farmer's Marble Cheese",
    size: "700 g",
    img: "/marble-cheese.png",
    price: 7.49,
  },
  {
    name: "No Name's 100% Pure Vegetable Oil",
    size: "946 ml",
    img: "/vegetable-oil.png",
    price: 4.29,
  },
  {
    name: "No Name's Diced Tomatoes",
    size: "700 g",
    img: "/diced-tomatoes.png",
    price: 5.99,
  },
  {
    name: "No Name's Farmer's Marble Cheese",
    size: "700 g",
    img: "/marble-cheese.png",
    price: 7.49,
  },
  {
    name: "No Name's 100% Pure Vegetable Oil",
    size: "946 ml",
    img: "/vegetable-oil.png",
    price: 4.29,
  },
];

const BUDGET = 45;

function PlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || 'List for cooking pasta for bulking';

  const [plan, setPlan] = useState<any>(null);
  const [groceries, setGroceries] = useState<any[]>(demoGroceries);
  const [budget, setBudget] = useState<number>(BUDGET);
  const [goals, setGoals] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('groceryPlan');
    if (stored) {
      const parsed = JSON.parse(stored);
      const loadedGroceries = parsed.ingredients || parsed.groceries || demoGroceries;
      setGroceries(loadedGroceries);
      
      // Get budget from the parsed plan - check multiple possible fields
      const planBudget = parsed.budget || parsed.totalBudget || parsed.originalBudget;
      if (planBudget && planBudget > 0) {
        setBudget(planBudget);
      } else {
        // If no budget in plan, try to get from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const budgetParam = urlParams.get('budget');
        if (budgetParam) {
          setBudget(Number(budgetParam));
        }
      }
      
      setGoals(parsed.goals || []);
      setPlan(parsed);
    } else {
      // If no stored plan, try to get budget from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const budgetParam = urlParams.get('budget');
      if (budgetParam) {
        setBudget(Number(budgetParam));
      }
    }
  }, []);

  // Add nutriments to groceries and check nutrition-based goals
  useEffect(() => {
    if (!goals || goals.length === 0) return;
    let updated = false;
    let awardedPoints = false;
    const updatedGoals = goals.map((goal: any) => {
      if (goal.type === 'nutrition' && !goal.completed) {
        // Example: protein goal
        let nutrientKey = '';
        if (goal.description.toLowerCase().includes('protein')) nutrientKey = 'proteins_100g';
        if (nutrientKey) {
          const totalNutrient = groceries.reduce((sum: number, item: any) => sum + (item.nutriments?.[nutrientKey] || 0), 0);
          if (totalNutrient >= goal.target) {
            updated = true;
            awardedPoints = true;
            return { ...goal, completed: true, current: totalNutrient };
          } else {
            return { ...goal, current: totalNutrient };
          }
        }
      }
      return goal;
    });
    if (updated) {
      setGoals(updatedGoals);
      // Also update localStorage plan if present
      const stored = localStorage.getItem('groceryPlan');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.goals = updatedGoals;
        localStorage.setItem('groceryPlan', JSON.stringify(parsed));
      }
    }
    // Award points if a goal was just completed
    if (awardedPoints) {
      let userPoints = Number(localStorage.getItem('userPoints') || '0');
      userPoints += 100;
      localStorage.setItem('userPoints', userPoints.toString());
    }
  }, [groceries]);

  const total = Number(groceries.reduce((sum: number, item: any) => sum + (Number(item.price) || 0), 0).toFixed(2)) || 0;
  const points = Math.floor(total * 44.44);
  const savings = Number((budget - total).toFixed(2));

  const { RiveComponent } = useRive({
    src: '/broccoli.riv',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  // Open Food Facts search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setSearchLoading(true);
    setSearchResults([]);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(search)}&search_simple=1&action=process&json=1`);
      const data = await res.json();
      setSearchResults(data.products?.slice(0, 5) || []);
    } catch {
      setSearchResults([]);
    }
    setSearchLoading(false);
  };

  const handleAddGrocery = (item: any) => {
    setGroceries(prev => [
      ...prev,
      {
        name: item.product_name || 'Unknown',
        size: item.quantity || '',
        img: item.image_front_url || '/noname.png',
        price: item.price ? Number(item.price) : 4.99, // fallback price
        nutriments: item.nutriments || {},
      }
    ]);
    setSearch('');
    setSearchResults([]);
  };

  const handleFinalizePlan = async () => {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Supabase session:', session);
    const userId = session?.user?.id;
    console.log('Supabase userId:', userId);
    if (!userId) {
      alert('You must be logged in to save your plan.');
      return;
    }
    const planToSave = {
      userId,
      prompt,
      groceries,
      budget,
      goals,
    };
    // Save to Supabase
    const { error } = await saveGroceryPlan(planToSave);
    if (error) {
      alert('Failed to save plan to database.');
    }
    // Also save to localStorage as fallback
    localStorage.setItem('groceryPlan', JSON.stringify(planToSave));
    // Save to history
    const history = JSON.parse(localStorage.getItem('groceryHistory') || '[]');
    history.push(planToSave);
    localStorage.setItem('groceryHistory', JSON.stringify(history));
    router.push('/pod-details');
  };

  return (
    <div className="min-h-screen bg-[#375654] flex flex-col">
      {/* Mobile Layout */}
      <div className="sm:hidden flex flex-col h-screen w-screen overflow-hidden">
        {/* Header Section */}
        <div className="px-3 pt-6 pb-3 flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl font-black text-white">${typeof total === 'number' ? total.toFixed(0) : Number(total || 0).toFixed(0)}</div>
            <div className="text-right text-white flex-shrink-0 ml-2 min-w-0">
              <div className="text-xs font-bold">
                {savings >= 0 ? `$${Math.abs(savings).toFixed(0)} saved` : `$${Math.abs(savings).toFixed(0)} over`}
              </div>
              <div className="text-xs font-bold">{points} Nu</div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 rounded-full px-3 py-2 text-black bg-white border-none focus:outline-none text-sm min-w-0"
              placeholder=""
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-[#B8860B] text-white rounded-full px-3 py-2 font-bold text-sm flex-shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searchLoading && <div className="px-3 text-white text-xs">Searching...</div>}
        {searchResults.length > 0 && (
          <div className="px-3 mb-2 flex flex-col gap-1 flex-shrink-0">
            {searchResults.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-xl shadow p-2">
                <img src={item.image_front_url || '/noname.png'} alt={item.product_name} className="w-8 h-8 rounded object-contain bg-gray-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-black text-xs truncate">{item.product_name || 'Unknown'}</div>
                  <div className="text-xs text-gray-500 truncate">{item.quantity || ''}</div>
                </div>
                <button
                  className="bg-[#375654] text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm flex-shrink-0"
                  onClick={() => handleAddGrocery(item)}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Grocery List */}
        <div className="flex-1 bg-white rounded-t-3xl px-3 py-3 overflow-y-auto min-h-0">
          <div className="space-y-2 pb-16">
            {groceries.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <img src={item.img} alt={item.name} className="w-8 h-8 rounded object-contain bg-gray-100 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-600">No Name's</div>
                    <div className="font-bold text-black text-xs leading-tight truncate">{item.name}</div>
                    <div className="text-xs text-gray-600 truncate">{item.size || item.quantity} • {item.category || 'Protein'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-bold text-black text-sm">${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price || 0).toFixed(2)}</span>
                  <button
                    className="w-6 h-6 bg-[#375654] rounded-full flex items-center justify-center text-white font-bold text-sm"
                    onClick={() => setGroceries(groceries.filter((_, idx) => idx !== i))}
                    aria-label="Remove item"
                  >
                    −
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Fixed Bottom Button */}
          <div className="fixed bottom-3 left-3 right-3">
            <button
              className="w-full bg-[#375654] text-white text-base font-bold py-2.5 rounded-xl shadow-lg active:scale-95 transition-transform"
              onClick={handleFinalizePlan}
            >
              Finalize Grocery List
            </button>
          </div>
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden sm:flex md:hidden flex-col min-h-screen">
        {/* Header Section */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-baseline justify-between mb-6">
            <div className="text-6xl font-black text-white">${typeof total === 'number' ? total.toFixed(0) : Number(total || 0).toFixed(0)}</div>
            <div className="text-right text-white">
              <div className="text-lg font-bold">
                {savings >= 0 ? `$${Math.abs(savings).toFixed(0)} saved` : `$${Math.abs(savings).toFixed(0)} over budget`}
              </div>
              <div className="text-lg font-bold">{points} Nutrients</div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input
              type="text"
              className="flex-1 rounded-full px-6 py-3 text-black bg-white border-none focus:outline-none text-lg"
              placeholder=""
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-[#B8860B] text-white rounded-full px-6 py-3 font-bold text-lg"
            >
              Search
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searchLoading && <div className="px-6 text-white">Searching...</div>}
        {searchResults.length > 0 && (
          <div className="px-6 mb-4 flex flex-col gap-2">
            {searchResults.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-2xl shadow p-4">
                <img src={item.image_front_url || '/noname.png'} alt={item.product_name} className="w-12 h-12 rounded-lg object-contain bg-gray-100" />
                <div className="flex-1">
                  <div className="font-bold text-black text-base">{item.product_name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{item.quantity || ''}</div>
                </div>
                <button
                  className="bg-[#375654] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl"
                  onClick={() => handleAddGrocery(item)}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Grocery List */}
        <div className="flex-1 bg-white rounded-t-3xl px-6 py-6 overflow-y-auto">
          <div className="space-y-4 pb-24">
            {groceries.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-contain bg-gray-100" />
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">No Name's</div>
                    <div className="font-bold text-black text-base">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.size || item.quantity} • {item.category || 'Grocery'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-black text-lg">${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price || 0).toFixed(2)}</span>
                  <button
                    className="w-10 h-10 bg-[#375654] rounded-full flex items-center justify-center text-white font-bold text-xl"
                    onClick={() => setGroceries(groceries.filter((_, idx) => idx !== i))}
                    aria-label="Remove item"
                  >
                    −
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Fixed Bottom Button */}
          <div className="fixed bottom-6 left-6 right-6">
            <button
              className="w-full bg-[#375654] text-white text-xl font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
              onClick={handleFinalizePlan}
            >
              Finalize Grocery List
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        <div className="flex-1 flex max-w-full">
          {/* Left Column - Header & Search */}
          <div className="w-1/2 px-8 lg:px-12 py-8 lg:py-12 flex flex-col">
            <div className="mb-6 lg:mb-8">
              <div className="flex items-baseline justify-between mb-6 lg:mb-8">
                <div className="text-6xl lg:text-7xl xl:text-8xl font-black text-white">${typeof total === 'number' ? total.toFixed(0) : Number(total || 0).toFixed(0)}</div>
                <div className="text-right text-white">
                  <div className="text-xl lg:text-2xl font-bold">
                    {savings >= 0 ? `$${Math.abs(savings).toFixed(0)} saved` : `$${Math.abs(savings).toFixed(0)} over budget`}
                  </div>
                  <div className="text-xl lg:text-2xl font-bold">{points} Nutrients</div>
                </div>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-3 lg:gap-4 mb-6 lg:mb-8">
                <input
                  type="text"
                  className="flex-1 rounded-full px-6 lg:px-8 py-3 lg:py-4 text-black bg-white border-none focus:outline-none text-lg lg:text-xl"
                  placeholder=""
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="bg-[#B8860B] text-white rounded-full px-6 lg:px-8 py-3 lg:py-4 font-bold text-lg lg:text-xl"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Search Results */}
            {searchLoading && <div className="text-white text-xl">Searching...</div>}
            {searchResults.length > 0 && (
              <div className="flex flex-col gap-3 overflow-y-auto">
                {searchResults.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 bg-white rounded-2xl shadow p-4 lg:p-6">
                    <img src={item.image_front_url || '/noname.png'} alt={item.product_name} className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg object-contain bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-black text-base lg:text-lg truncate">{item.product_name || 'Unknown'}</div>
                      <div className="text-sm lg:text-base text-gray-500 truncate">{item.quantity || ''}</div>
                    </div>
                    <button
                      className="bg-[#375654] text-white rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center font-bold text-xl lg:text-2xl flex-shrink-0"
                      onClick={() => handleAddGrocery(item)}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Grocery List */}
          <div className="w-1/2 bg-white rounded-l-3xl px-8 lg:px-12 py-8 lg:py-12 overflow-y-auto">
            <div className="space-y-4 lg:space-y-6 pb-24">
              {groceries.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-3 lg:py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
                    <img src={item.img} alt={item.name} className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg object-contain bg-gray-100 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm lg:text-base font-medium text-gray-600 mb-1">No Name's</div>
                      <div className="font-bold text-black text-lg lg:text-xl leading-tight">{item.name}</div>
                      <div className="text-sm lg:text-base text-gray-600">{item.size || item.quantity} • {item.category || 'Grocery'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0 ml-4">
                    <span className="font-bold text-black text-xl lg:text-2xl">${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price || 0).toFixed(2)}</span>
                    <button
                      className="w-10 h-10 lg:w-12 lg:h-12 bg-[#375654] rounded-full flex items-center justify-center text-white font-bold text-xl lg:text-2xl"
                      onClick={() => setGroceries(groceries.filter((_, idx) => idx !== i))}
                      aria-label="Remove item"
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-8 lg:bottom-12 right-8 lg:right-12 left-1/2">
              <button
                className="w-full bg-[#375654] text-white text-xl lg:text-2xl font-bold py-4 lg:py-6 rounded-2xl shadow-lg active:scale-95 transition-transform"
                onClick={handleFinalizePlan}
              >
                Finalize Grocery List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDE500] flex flex-col justify-center items-center gap-4">
        <h1 className="text-4xl font-black text-black">Generating your plan...</h1>
        <p className="text-xl font-bold text-black">Please wait a moment.</p>
      </div>
    }>
      <PlanContent />
    </Suspense>
  );
} 