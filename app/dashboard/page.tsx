'use client';

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { getGroceryHistory, GroceryPlan } from '../data/dataStore';
import { supabase } from '../supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

type Goal = {
  id: string;
  description: string;
  type: string;
  target: number;
  current: number;
  completed: boolean;
  trophy: string;
};

const MAX_HEARTS = 6;

const getDayDiff = (a: Date, b: Date) => {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};

export default function Dashboard() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('');
  const [userAgeDays, setUserAgeDays] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [nutrients, setNutrients] = useState<number>(0);
  const [history, setHistory] = useState<GroceryPlan[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [hearts, setHearts] = useState<number>(MAX_HEARTS);

  const { RiveComponent: Broccoli } = useRive({
    src: '/broccoli.riv',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    autoplay: true,
  });

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUserId(user.id);
      const nameFromMeta = (user.user_metadata?.full_name || user.user_metadata?.name || '').trim();
      const fallbackName = (user.email || 'Suzy').split('@')[0];
      setDisplayName(nameFromMeta || fallbackName || 'Suzy');

      const createdAt = user.created_at ? new Date(user.created_at) : new Date();
      setUserAgeDays(Math.max(0, getDayDiff(createdAt, new Date())));

      const { data: plans } = await getGroceryHistory(user.id);
      if (plans) setHistory(plans);
      setLoadingHistory(false);

      const planStored = localStorage.getItem('groceryPlan');
      if (planStored) {
        const plan = JSON.parse(planStored);
        if (plan.goals) setGoals(plan.goals);
      }
      const points = Number(localStorage.getItem('userPoints') || '2000');
      setNutrients(points);

      const heartKey = `hearts_${user.id}`;
      const lastKey = `hearts_last_${user.id}`;
      const today = new Date();
      const savedHearts = Number(localStorage.getItem(heartKey) || `${MAX_HEARTS}`);
      const lastStr = localStorage.getItem(lastKey);
      if (!lastStr) {
        setHearts(savedHearts);
        localStorage.setItem(lastKey, today.toISOString());
        localStorage.setItem(heartKey, `${savedHearts}`);
        return;
      }
      const last = new Date(lastStr);
      const daysMissed = getDayDiff(last, today);
      if (daysMissed > 0) {
        const decayed = Math.max(0, savedHearts - daysMissed);
        setHearts(decayed);
        localStorage.setItem(heartKey, `${decayed}`);
      } else {
        setHearts(savedHearts);
      }
      localStorage.setItem(lastKey, today.toISOString());
    };
    init();
  }, [router]);

  const handleWater = () => {
    if (!userId) return;
    const heartKey = `hearts_${userId}`;
    const updated = Math.min(MAX_HEARTS, hearts + 1);
    setHearts(updated);
    localStorage.setItem(heartKey, `${updated}`);
  };

  const handleFertilizer = () => {
    if (!userId) return;
    const heartKey = `hearts_${userId}`;
    const updated = Math.min(MAX_HEARTS, hearts + 1);
    setHearts(updated);
    localStorage.setItem(heartKey, `${updated}`);
  };

  const heartIcons = useMemo(() => {
    return Array.from({ length: MAX_HEARTS }).map((_, i) => {
      const filled = i < hearts;
      return (
        <svg key={i} aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" className={`${filled ? 'text-rose-500' : 'text-rose-200'} drop-shadow`}>
          <path fill="currentColor" d="M12 21s-6.716-4.35-9.428-7.062C.686 12.053.686 8.947 2.572 7.062 4.457 5.177 7.563 5.177 9.448 7.062L12 9.614l2.552-2.552c1.885-1.885 4.991-1.885 6.876 0 1.885 1.885 1.885 4.991 0 6.876C18.716 16.65 12 21 12 21z"/>
        </svg>
      );
    });
  }, [hearts]);

  return (
    <div className="min-h-screen bg-[#EEE7D2] w-full max-w-md mx-auto pb-28">
      <div className="bg-[#CFE9E1] px-5 pt-8 pb-4 rounded-b-[28px] shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[#1B2A2A] text-3xl font-extrabold">{displayName || 'Suzy'}</div>
            <div className="text-[#375654] text-sm font-semibold mt-1">{userAgeDays} days old</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/80 rounded-full px-3 py-1.5 flex items-center gap-2" role="status" aria-label="Life hearts">
              {heartIcons}
            </div>
            <button aria-label="Settings" className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center active:scale-95">
              <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#1B2A2A]"><path fill="currentColor" d="M19.14,12.94a7.43,7.43,0,0,0,.05-1,7.43,7.43,0,0,0-.05-1l2-1.55a.5.5,0,0,0,.12-.64l-1.9-3.29a.5.5,0,0,0-.61-.22l-2.35,1a7.28,7.28,0,0,0-1.73-1l-.36-2.49A.5.5,0,0,0,12.8,2H9.2a.5.5,0,0,0-.5.42L8.34,4.91a7.28,7.28,0,0,0-1.73,1l-2.35-1a.5.5,0,0,0-.61.22L1.75,8.39a.5.5,0,0,0,.12.64l2,1.55a7.43,7.43,0,0,0-.05,1,7.43,7.43,0,0,0,.05,1l-2,1.55a.5.5,0,0,0-.12.64l1.9,3.29a.5.5,0,0,0,.61.22l2.35-1a7.28,7.28,0,0,0,1.73,1l.36,2.49a.5.5,0,0,0,.5.42h3.6a.5.5,0,0,0,.5-.42l.36-2.49a7.28,7.28,0,0,0,1.73-1l2.35,1a.5.5,0,0,0,.61-.22l1.9-3.29a.5.5,0,0,0-.12-.64Zm-7.14,2.06A3,3,0,1,1,15,12,3,3,0,0,1,12,15Z"/></svg>
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center">
          <div className="w-36 h-28">
            <Broccoli />
          </div>
        </div>
      </div>

      <div className="bg-[#1F3A37] -mt-2 px-5 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleWater} onKeyDown={(e)=>{if(e.key==='Enter') handleWater();}} tabIndex={0} aria-label="Water plant" className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white text-xl">💧</span>
              </div>
              <span className="text-white text-[10px] mt-1">water</span>
            </button>
            <button onClick={handleFertilizer} onKeyDown={(e)=>{if(e.key==='Enter') handleFertilizer();}} tabIndex={0} aria-label="Fertilize plant" className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white text-xl">🧪</span>
              </div>
              <span className="text-white text-[10px] mt-1">fertilizer</span>
            </button>
          </div>
          <div className="rounded-full bg-[#54A78F] text-white px-4 py-2 font-extrabold text-lg flex items-center gap-2">
            <span>{nutrients}</span>
            <span className="uppercase text-sm">nt</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#2F4746] text-white rounded-2xl p-4">
            <div className="text-2xl font-extrabold">+50%</div>
            <div className="text-xs opacity-90 mt-1">in total savings</div>
          </div>
          <div className="bg-[#56A38B] text-white rounded-2xl p-4">
            <div className="text-2xl font-extrabold">$500</div>
            <div className="text-xs opacity-90 mt-1">saved this month</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#1B2A2A] text-lg font-extrabold">Ongoing Trips</h3>
            <Link href="/brocoli" className="rounded-full bg-[#2F4746] text-white text-sm font-bold px-4 py-2">Add Trip</Link>
          </div>
          {loadingHistory ? (
            <div className="text-gray-500 text-sm">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-gray-600 text-sm">No trips yet. Start one from The Pod.</div>
          ) : (
            <div className="space-y-3">
              {history.map((plan) => (
                <Link key={plan.id} href={`/pod-details?id=${plan.id}`} className="block rounded-2xl bg-white shadow border border-[#E7E2CF] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-[10px] text-[#2F4746] font-bold">{new Date(plan.created_at).toLocaleDateString(undefined, { day:'numeric', month:'short', year:'numeric' })}</div>
                      <div className="text-[#1B2A2A] font-extrabold truncate">{plan.prompt || 'Bulking up'}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-[#1B2A2A] font-extrabold">${plan.budget.toFixed(0)}</div>
                      <div className="rounded-full bg-[#E7F4EF] text-[#2F4746] text-xs font-extrabold px-3 py-1">
                        {nutrients} NT
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
}