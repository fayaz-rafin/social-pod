'use client';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';

type GroceryItem = {
  name: string;
  size: string;
  img: string;
  price: number;
};

type GroceryPlan = {
  groceries: GroceryItem[];
  total: number;
  budget: number;
  prompt: string;
};

const challenges = [
  'Spend $20 on Grass-Fed Beef',
  'Buy 2 packs of cheese',
];

export default function PodDetailsPage() {
  const [plan, setPlan] = useState<GroceryPlan | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('groceryPlan');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.budget = Number(parsed.budget) || 0;
      if (parsed.groceries) {
        parsed.groceries = parsed.groceries.map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
        }));
        parsed.total = parsed.groceries.reduce((sum: number, item: any) => sum + item.price, 0);
      } else {
        parsed.total = 0;
      }
      setPlan(parsed);
    }
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-xl font-bold">No plan found. Please finalize a plan first.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-32 max-w-md mx-auto">
      {/* Black Header */}
      <div className="bg-black px-6 pt-8 pb-16 flex items-center justify-between relative z-10">
        <div className="text-white text-2xl font-bold leading-tight">
          {plan.prompt.split(/\n|<br\s*\/?>/).map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-md p-2">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#000" strokeWidth="2"/><path d="M8 2v4M16 2v4M8 18v4M16 18v4" stroke="#000" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* Points Card */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-[#EDDF5E] rounded-2xl shadow-md p-6 flex items-center justify-between">
          <span className="text-6xl font-black text-black">2000</span>
          <span className="text-xl font-bold text-black ml-2">pts earned</span>
        </div>
      </div>

      {/* Spending & Budget Cards */}
      <div className="px-6 mt-4 flex gap-4">
        <div className="flex-1 bg-green-500 rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">${typeof plan.total === 'number' ? plan.total.toFixed(2) : Number(plan.total || 0).toFixed(2)}</span>
          <span className="text-lg text-white">in spending</span>
        </div>
        <div className="flex-1 bg-black rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">${typeof plan.budget === 'number' ? plan.budget.toFixed(2) : Number(plan.budget || 0).toFixed(2)}</span>
          <span className="text-lg text-white">original budget</span>
        </div>
      </div>

      {/* Grocery List */}
      <div className="px-6 mt-8">
        <h2 className="text-2xl mb-4 text-black font-extrabold">Grocery List</h2>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-2">
          {plan.groceries.map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-white rounded-xl shadow p-3">
              <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-contain" />
              <div className="flex-1">
                <div className="text-lg font-bold text-black">{item.name}</div>
                <div className="text-xs text-gray-500">{item.size}</div>
              </div>
              <div className="text-lg font-bold text-black">${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price || 0).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <span className="text-xl font-black text-black">Total: ${typeof plan.total === 'number' ? plan.total.toFixed(2) : Number(plan.total || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Challenges */}
      <div className="px-6 mt-10">
        <h2 className="text-2xl font-black mb-2">Mr Broccoli Challenges</h2>
        <div className="relative mb-6">
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div className="bg-[#EDDF5E] h-8 rounded-full flex items-center justify-center" style={{width: '60%'}}>
              <span className="text-black font-bold text-lg">60% completed</span>
            </div>
          </div>
          <div className="absolute -right-8 -top-8">
            <div className="w-16 h-16 rounded-full bg-[#FDE500] flex items-center justify-center shadow-lg">
              <Image src="/brocoli.svg" alt="Broccoli" width={48} height={48} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {challenges.map((item, i) => (
            <label key={i} className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                <input type="checkbox" className="w-6 h-6 accent-black" />
              </span>
              <span className="text-xl font-bold text-black">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pb-8">
        <div className="w-full bg-black rounded-full flex justify-around items-center py-4">
          <div className="flex flex-col items-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 4l9 5.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5Z" stroke="#FDE500" strokeWidth="2"/><rect x="7" y="14" width="4" height="4" rx="1" fill="#FDE500"/></svg>
            <span className="text-[#FDE500] text-xs font-bold mt-1">Dashboard</span>
          </div>
          <div className="flex flex-col items-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2"/><path d="M8 8h8v8H8z" fill="white"/></svg>
            <span className="text-white text-xs font-bold mt-1">The Pod</span>
          </div>
          <div className="flex flex-col items-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="white" strokeWidth="2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2"/></svg>
            <span className="text-white text-xs font-bold mt-1">My Pantry</span>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
} 