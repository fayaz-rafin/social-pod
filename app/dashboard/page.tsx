'use client';

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { getGroceryHistory, GroceryPlan } from '../data/dataStore';
import { supabase } from '../supabaseClient';
import Link from 'next/link';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2"/>
    <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

type Goal = {
  id: string;
  description: string;
  type: string;
  target: number;
  current: number;
  completed: boolean;
  trophy: string;
};

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [history, setHistory] = useState<GroceryPlan[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [totalSpent, setTotalSpent] = useState<number>(0);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) {
        setHistory([]);
        setLoadingHistory(false);
        return;
      }
      const { data, error } = await getGroceryHistory(userId);
      if (data) setHistory(data);
      setLoadingHistory(false);
    };
    fetchHistory();
    const stored = localStorage.getItem('groceryPlan');
    if (stored) {
      const plan = JSON.parse(stored);
      if (plan.goals) setGoals(plan.goals);
    }
    const points = Number(localStorage.getItem('userPoints') || '0');
    setUserPoints(points);
    const h = JSON.parse(localStorage.getItem('groceryHistory') || '[]');
    setTotalSpent(h.reduce((sum: number, entry: any) => sum + (entry.total || 0), 0));
  }, []);

  return (
    <div className="min-h-screen bg-[#ffff] px-8 py-6 w-full max-w-md mx-auto">
      {/* Black Background Section */}
      <div className="bg-black pb-12 -mx-10 -mt-6 px-10 pt-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-white text-lg font-semibold mb-2 text-left">Good evening, Suzanna</div>
        </div>
      </div>

      {/* Points Card - positioned to hang over the black background */}
      <div className="text-center mb-8 -mt-16 flex justify-center">
        <div className="bg-[#EDDF5E] w-full rounded-2xl p-6 flex flex-row gap-2 items-center justify-center text-center shadow-lg border-2 border-[#FDE500]">
          <div className="text-black text-5xl font-black leading-none">{userPoints}</div>
          <div className="text-black text-sm font-semibold mt-1">points</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black rounded-xl p-4 shadow-md">
          <div className="text-white text-2xl font-bold">${totalSpent.toFixed(2)}</div>
          <div className="text-white text-sm">Total Spent</div>
        </div>
        <div className="bg-black rounded-xl p-4 shadow-md">
          <div className="text-white text-2xl font-bold">$213</div>
          <div className="text-white text-sm">Monthly</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-black font-semibold">Goals</span>
          <span className="text-black text-sm">68%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div className="bg-[#FDE500] h-3 rounded-full" style={{ width: '68%' }}></div>
        </div>
        <div className="text-black text-sm">Keep it up! You're doing great with your budget</div>
      </div>

      {/* History Section */}
      <div className="mb-8">
        <h3 className="text-black text-lg font-bold mb-4">History</h3>
        {loadingHistory ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : history.length === 0 ? (
          <div className="text-gray-400 text-sm">No grocery plans yet. Finalize a plan to see it here!</div>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map(plan => (
              <Link
                key={plan.id}
                href={`/pod-details?id=${plan.id}`}
                className="block bg-white rounded-xl shadow p-4 border border-gray-100 hover:border-[#FDE500] transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-black text-base truncate max-w-[60%]">{plan.prompt}</span>
                  <span className="text-xs text-gray-500">{new Date(plan.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-black text-sm">Budget: <span className="font-bold">${plan.budget.toFixed(2)}</span></div>
                <div className="text-black text-xs mt-1">{plan.groceries.length} items</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Trophies Section */}
      <div className="mb-6">
        <h3 className="text-black text-lg font-bold mb-4">Trophies</h3>
        <div className="flex gap-3 overflow-x-auto">
          {goals.length === 0 && (
            <div className="text-gray-400 text-sm">No achievements yet. Complete goals to earn trophies!</div>
          )}
          {goals.map((goal, i) => {
            let trophySrc = "/trophy-01.svg";
            if (goal.trophy === "🥇") trophySrc = "/trophy-01.svg";
            else if (goal.trophy === "🥈") trophySrc = "/trophy-02.svg";
            else if (goal.trophy === "🥉") trophySrc = "/trophy-03.svg";
            // fallback: use trophy-01 for any other
            return (
              <div
                key={goal.id}
                className={`flex flex-col items-center ${goal.completed ? 'bg-[#FDE500]' : 'bg-gray-200'} rounded-xl p-4 min-w-[100px] shadow-md transition-all`}
              >
                <Image
                  src={trophySrc}
                  alt="Trophy"
                  width={80}
                  height={80}
                  className={goal.completed ? '' : 'opacity-30 grayscale'}
                />
                <span className={`text-black text-xs font-semibold mt-2 text-center ${goal.completed ? '' : 'opacity-40'}`}>{goal.description}</span>
                <span className={`text-black text-xs text-center mt-1 ${goal.completed ? '' : 'opacity-40'}`}>{goal.current} / {goal.target}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meals Section */}
      <div className="mb-20">
        <h3 className="text-black text-lg font-bold mb-4">Meals of the Week</h3>
        <div className="flex gap-3 overflow-x-auto">
          <div className="flex flex-col items-center bg-white rounded-xl p-4 min-w-[100px] shadow-md">
            <div className="w-12 h-12 bg-[#FDE500] rounded-full flex items-center justify-center mb-2">
              <Image
                src="/brocoli.svg"
                alt="broccoli"
                width={24}
                height={24}
              />
            </div>
            <span className="text-black text-xs font-semibold text-center">Broccoli Stir Fry</span>
            <span className="text-black text-xs text-center mt-1">Healthy & Budget Friendly</span>
          </div>
          
          <div className="flex flex-col items-center bg-white rounded-xl p-4 min-w-[100px] shadow-md">
            <div className="w-12 h-12 bg-[#FDE500] rounded-full flex items-center justify-center mb-2">
              <Image
                src="/brocoli.svg"
                alt="broccoli"
                width={24}
                height={24}
              />
            </div>
            <span className="text-black text-xs font-semibold text-center">Green Smoothie</span>
            <span className="text-black text-xs text-center mt-1">Perfect breakfast choice</span>
          </div>
          
          <div className="flex flex-col items-center bg-white rounded-xl p-4 min-w-[100px] shadow-md">
            <div className="w-12 h-12 bg-[#FDE500] rounded-full flex items-center justify-center mb-2">
              <Image
                src="/brocoli.svg"
                alt="broccoli"
                width={24}
                height={24}
              />
            </div>
            <span className="text-black text-xs font-semibold text-center">Veggie Bowl</span>
            <span className="text-black text-xs text-center mt-1">Nutritious dinner</span>
          </div>
        </div>
      </div>


      <Navbar />
    </div>
  );
} 