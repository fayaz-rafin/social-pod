'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  useEffect(() => {
    const stored = localStorage.getItem('groceryPlan');
    if (stored) setPlan(JSON.parse(stored));
  }, []);

  const groceries = plan ? plan.ingredients || plan.groceries : demoGroceries;
  const total = plan ? (plan.total || groceries.reduce((sum: any, item: any) => sum + (item.price || 0), 0)) : groceries.reduce((sum: any, item: any) => sum + (item.price || 0), 0);
  const budget = plan ? (plan.budget || BUDGET) : BUDGET;

  const handleFinalizePlan = () => {
    const planToSave = {
      groceries,
      total,
      budget,
      prompt,
    };
    localStorage.setItem('groceryPlan', JSON.stringify(planToSave));
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
          <Image src="/brocoli.svg" alt="Broccoli" width={64} height={64} className="ml-2" />
        </div>
      </div>

      {/* Price/Points Section */}
      <div className="bg-black text-white px-6 py-6 flex items-center justify-between">
        <div className="text-6xl font-black">$45</div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-lg font-bold">2000 PC points</div>
          <div className="text-lg font-bold">$5 saved</div>
        </div>
      </div>

      {/* Grocery Grid */}
      <div className="flex-1 px-3 py-6 grid grid-cols-2 gap-4">
        {groceries.map((item: any, i: number) => (
          <div key={i} className="bg-white rounded-2xl shadow-md flex flex-col items-center p-4 relative">
            <button className="absolute top-2 right-2 w-7 h-7 bg-[#FDE500] rounded-full flex items-center justify-center text-2xl font-black text-black">-</button>
            <img src={item.img} alt={item.name} width={80} height={80} className="mb-2 rounded object-contain bg-gray-100" />
            <div className="text-sm font-bold text-black text-center mb-1">{item.name}</div>
            <div className="text-xs text-black text-center">{item.size || item.quantity}</div>
          </div>
        ))}
      </div>

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