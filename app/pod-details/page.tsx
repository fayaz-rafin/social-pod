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

type Goal = {
  id: string;
  description: string;
  type: string;
  target: number;
  current: number;
  completed: boolean;
  trophy: string;
};

type GroceryPlan = {
  groceries: GroceryItem[];
  total: number;
  budget: number;
  prompt: string;
  goals?: Goal[];
};

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

  // Handler to mark a goal as complete
  const handleCompleteGoal = (goalId: string) => {
    if (!plan || !plan.goals) return;
    const updatedGoals = plan.goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: true, current: goal.target } : goal
    );
    const updatedPlan = { ...plan, goals: updatedGoals };
    setPlan(updatedPlan);
    localStorage.setItem('groceryPlan', JSON.stringify(updatedPlan));
    // Award points for completed goal
    let userPoints = Number(localStorage.getItem('userPoints') || '0');
    // Only award points if this goal wasn't already completed
    const justCompleted = plan.goals.find(goal => goal.id === goalId && !goal.completed);
    if (justCompleted) {
      userPoints += 100;
      localStorage.setItem('userPoints', userPoints.toString());
    }
  };

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
      <div className="bg-black rounded-b-3xl px-6 pt-8 pb-6 flex items-center justify-between relative">
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
      <div className="px-6 -mt-8">
        <div className="bg-[#FDE500] rounded-2xl shadow-md p-6 flex items-center justify-between">
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
        <h2 className="text-2xl font-black mb-4 text-gray-300 font-bold">Grocery List</h2>
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

      {/* Dynamic Goals/Achievements */}
      <div className="px-6 mt-10">
        <h2 className="text-2xl font-black mb-2">Mr Broccoli Challenges</h2>
        {plan.goals && plan.goals.length > 0 ? (
          <div className="flex flex-col gap-4">
            {plan.goals.map((goal: any) => (
              <div key={goal.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <div className="flex-1">
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
                    <button
                      className="mt-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold"
                      onClick={() => handleCompleteGoal(goal.id)}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-sm mt-4">No goals found for this plan. Try generating a new plan with a more specific prompt!</div>
        )}
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