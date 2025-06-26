'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useState, useEffect } from 'react';

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

export default function PlanPage() {
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
      setBudget(parsed.budget || BUDGET);
      setGoals(parsed.goals || []);
      setPlan(parsed);
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

  const total = Number(groceries.reduce((sum: number, item: any) => sum + (item.price || 0), 0)) || 0;
  const points = Math.floor((typeof total === 'number' ? total : Number(total || 0)) * 44.44);
  const savings = (typeof budget === 'number' ? budget : Number(budget || 0)) - (typeof total === 'number' ? total : Number(total || 0));

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

  const handleFinalizePlan = () => {
    const planToSave = {
      groceries,
      total,
      budget,
      prompt,
      goals,
      date: new Date().toISOString(),
    };
    localStorage.setItem('groceryPlan', JSON.stringify(planToSave));
    // Save to history
    const history = JSON.parse(localStorage.getItem('groceryHistory') || '[]');
    history.push(planToSave);
    localStorage.setItem('groceryHistory', JSON.stringify(history));
    router.push('/pod-details');
  };

  return (
    <div className="min-h-screen bg-[#FDE500] flex flex-col pb-32">
      {/* Header */}
      <div className="rounded-b-3xl bg-[#FDE500] px-6 pt-8 pb-4 flex flex-col gap-2 relative">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-black text-black leading-none mb-2">Plan</h1>
            <p className="text-xl font-bold text-black mb-2">{prompt}</p>
          </div>
          <div style={{ width: '100px', height: '100px' }}>
            <RiveComponent />
          </div>
        </div>
      </div>

      {/* Price/Points Section */}
      <div className="bg-black text-white px-6 py-6 flex items-center justify-between">
        <div className="text-6xl font-black">${typeof total === 'number' ? total.toFixed(2) : Number(total || 0).toFixed(2)}</div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-lg font-bold">{typeof points === 'number' ? points : Number(points || 0)} PC points</div>
          <div className="text-lg font-bold">{savings >= 0 ? `$${typeof savings === 'number' ? savings.toFixed(2) : Number(savings || 0).toFixed(2)} saved` : `$${typeof savings === 'number' ? Math.abs(savings).toFixed(2) : Math.abs(Number(savings || 0)).toFixed(2)} over budget`}</div>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="px-6 mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-full px-4 py-2 text-black bg-white border border-gray-200 focus:outline-none"
          placeholder="Search for more groceries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="bg-black text-white rounded-full px-4 py-2 font-bold">Search</button>
      </form>
      {searchLoading && <div className="px-6 mt-2 text-black">Searching...</div>}
      {searchResults.length > 0 && (
        <div className="px-6 mt-2 flex flex-col gap-2">
          {searchResults.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl shadow p-3">
              <img src={item.image_front_url || '/noname.png'} alt={item.product_name} className="w-10 h-10 rounded object-contain bg-gray-100" />
              <div className="flex-1">
                <div className="font-bold text-black">{item.product_name || 'Unknown'}</div>
                <div className="text-xs text-gray-500">{item.quantity || ''}</div>
              </div>
              <button
                className="bg-[#FDE500] text-black rounded-full px-3 py-1 font-bold"
                onClick={() => handleAddGrocery(item)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Grocery Grid */}
      <div className="flex-1 px-3 py-6 grid grid-cols-2 gap-4">
        {groceries.map((item: any, i: number) => (
          <div key={i} className="bg-white rounded-2xl shadow-md flex flex-col items-center p-4 relative">
            <button
              className="absolute top-2 right-2 w-7 h-7 bg-[#FDE500] rounded-full flex items-center justify-center text-2xl font-black text-black"
              onClick={() => setGroceries(groceries.filter((_, idx) => idx !== i))}
              aria-label="Remove item"
            >
              -
            </button>
            <img src={item.img} alt={item.name} width={80} height={80} className="mb-2 rounded object-contain bg-gray-100" />
            <div className="text-sm font-bold text-black text-center mb-1">{item.name}</div>
            <div className="text-xs text-black text-center">{item.size || item.quantity}</div>
          </div>
        ))}
      </div>

      {/* Goals List */}
      {goals && goals.length > 0 && (
        <div className="px-6 mt-6">
          <h2 className="text-2xl font-black mb-2">Your Goals</h2>
          <div className="flex flex-col gap-4">
            {goals.map((goal: any) => (
              <div key={goal.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">{goal.description}</div>
                  <div className="text-sm text-gray-500">{goal.current} / {goal.target}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-[#FDE500] h-2 rounded-full"
                      style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center ml-4">
                  {goal.completed ? (
                    <span className="text-3xl">{goal.trophy}</span>
                  ) : (
                    <span className="text-xs text-gray-400">In Progress</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finalize Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pb-8">
        <button
          className="w-full bg-black text-white text-2xl font-bold py-4 rounded-full shadow-lg active:scale-95 transition-transform"
          onClick={handleFinalizePlan}
        >
          Finalize Plan
        </button>
      </div>
    </div>
  );
} 