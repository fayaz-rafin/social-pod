'use client';
import Navbar from '../components/Navbar';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getGroceryPlanById, GroceryPlan as DBGroceryPlan } from '../data/dataStore';
import { supabase } from '../supabaseClient';

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

function PodDetailsContent() {
  const [plan, setPlan] = useState<GroceryPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('grocery');
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchPlan = async () => {
      if (id) {
        // Fetch from Supabase
        const { data, error } = await getGroceryPlanById(id);
        if (data) {
          // Convert DB plan to local plan shape
          const groceries = (data.groceries || []).map((item: any) => ({
            ...item,
            price: Number(item.price) || 0,
          }));
          const total = groceries.reduce((sum: number, item: any) => sum + item.price, 0);
          setPlan({
            groceries,
            total,
            budget: Number(data.budget) || 0,
            prompt: data.prompt,
            goals: data.goals || [],
          });
        }
        setLoading(false);
        return;
      }
      // Fallback: localStorage
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
      setLoading(false);
    };
    fetchPlan();
  }, [id]);

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

  const handleAddToNoFrillsCart = async () => {
    setApiLoading(true);
    setApiError(null);
    try {
      // Get user session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please log in to add items to cart.');
      }

      const res = await fetch('/api/add-to-nofrills-cart', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ groceries: plan?.groceries }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 401 && errorData.type === 'AUTHENTICATION_REQUIRED') {
          throw new Error('Please log in to add items to cart.');
        }
        if (res.status === 429 && errorData.type === 'RATE_LIMIT_EXCEEDED') {
          throw new Error(errorData.error || 'Too many cart requests. Please wait before trying again.');
        }
        throw new Error(errorData.error || 'Failed to add items to cart.');
      }

      const data = await res.json();
      if (data.success) {
        window.location.href = 'https://www.nofrills.ca/en';
      } else {
        setApiError(data.error || 'Failed to add items.');
      }
    } catch (err: any) {
      setApiError(err.message || 'Failed to add items.');
    }
    setApiLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-xl font-bold">Loading plan...</div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-xl font-bold">No plan found. Please finalize a plan first.</div>
      </div>
    );
  }

  const totalNutrients = 2000;
  const earnedNutrients = Math.floor(plan.total * 40); // Calculate based on spending

  return (
    <div className="min-h-screen bg-[#E9E9D8] flex flex-col pb-32">
      {/* Header */}
      <div className="bg-[#375654] px-4 pt-12 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h1 className="text-white text-xl font-bold leading-tight">
              {plan.prompt || 'List for cooking pasta for bulking'}
            </h1>
          </div>
          <div className="bg-[#EDDF5E] rounded-lg p-2 flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="6" height="6" rx="1" stroke="#000" strokeWidth="2"/>
              <rect x="14" y="4" width="6" height="6" rx="1" stroke="#000" strokeWidth="2"/>
              <rect x="4" y="14" width="6" height="6" rx="1" stroke="#000" strokeWidth="2"/>
              <rect x="14" y="14" width="6" height="6" rx="1" stroke="#000" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Nutrients Card */}
      <div className="px-4 -mt-4 mb-4">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-black text-black">{earnedNutrients}</span>
            <span className="text-gray-500 font-bold">/{totalNutrients}</span>
          </div>
          <p className="text-black font-bold text-base">nutrients earned</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-[#3F957F] h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (earnedNutrients / totalNutrients) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Spending & Budget Cards */}
      <div className="px-4 mb-4 flex gap-3">
        <div className="flex-1 bg-[#375654] rounded-2xl shadow-md p-4">
          <div className="text-2xl font-black text-white">${plan.total.toFixed(0)}</div>
          <div className="text-white font-medium text-sm">in spending</div>
        </div>
        <div className="flex-1 bg-[#3F957F] rounded-2xl shadow-md p-4">
          <div className="text-2xl font-black text-white">${plan.budget.toFixed(0)}</div>
          <div className="text-white font-medium text-sm">original budget</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4 flex gap-2">
        <button
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm ${
            activeTab === 'grocery'
              ? 'bg-[#375654] text-white'
              : 'bg-[#3F957F] text-white'
          }`}
          onClick={() => setActiveTab('grocery')}
        >
          Grocery List
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm ${
            activeTab === 'goals'
              ? 'bg-[#375654] text-white'
              : 'bg-[#3F957F] text-white'
          }`}
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </button>
      </div>

      {/* Content Area */}
      <div className="px-4 flex-1 bg-white mx-4 rounded-t-3xl pt-4 overflow-y-auto">
        {activeTab === 'grocery' ? (
          <div className="space-y-3 pb-6">
            {plan.groceries.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-contain bg-gray-100" />
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">No Name's</div>
                    <div className="font-bold text-black text-sm">{item.name}</div>
                    <div className="text-xs text-gray-600">{item.size} • Protein</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-black">${item.price.toFixed(2)}</div>
              </div>
            ))}
            
            {/* Add to Cart Button */}
            <div className="pt-4">
              <button
                className="w-full bg-[#375654] text-white text-lg font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
                onClick={() => setShowModal(true)}
              >
                Add Items to No Frills Cart
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {plan.goals && plan.goals.length > 0 ? (
              plan.goals.map((goal: any) => (
                <div key={goal.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-black text-sm">{goal.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{goal.current} / {goal.target}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-[#EDDF5E] h-2 rounded-full"
                          style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4">
                      {goal.completed ? (
                        <span className="text-2xl">{goal.trophy}</span>
                      ) : (
                        <button
                          className="px-3 py-1 bg-[#3F957F] text-white rounded-full text-xs font-bold"
                          onClick={() => handleCompleteGoal(goal.id)}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm text-center py-8">
                No goals available for this plan
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Navigation - Exact from NavBar.svg proportions */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div className="w-[350px] h-[61px] bg-[#263736] rounded-[30.5px] shadow-lg flex items-center justify-between px-6">
          {/* Dashboard */}
          <button 
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/dashboard')}
          >
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M48.1666 32.875V23.1094L46.2916 24.5417L45.0416 22.875L48.1666 20.4792V17.25H50.25V18.8906L56.5 14.125L67.9583 22.875L66.7083 24.5156L64.8333 23.1094V32.875H48.1666ZM50.25 30.7917H55.4583V26.625H57.5416V30.7917H62.75V21.5209L56.5 16.7552L50.25 21.5209V30.7917ZM48.1666 16.2084C48.1666 15.3403 48.4704 14.6025 49.0781 13.9948C49.6857 13.3872 50.4236 13.0834 51.2916 13.0834C51.5868 13.0834 51.8342 12.9835 52.0338 12.7839C52.2335 12.5842 52.3333 12.3368 52.3333 12.0417H54.4166C54.4166 12.9097 54.1128 13.6476 53.5052 14.2552C52.8975 14.8629 52.1597 15.1667 51.2916 15.1667C50.9965 15.1667 50.7491 15.2665 50.5494 15.4662C50.3498 15.6658 50.25 15.9132 50.25 16.2084H48.1666Z" fill="#EDDF5E"/>
            </svg>
            <span className="text-[10px] font-bold" style={{color:'#EDDF5E'}}>Dashboard</span>
          </button>

          {/* Social */}
          <button 
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/grouppods')}
          >
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M109.943 17.6666L112.859 13.8906C113.068 13.6128 113.315 13.4088 113.602 13.2786C113.888 13.1484 114.188 13.0833 114.5 13.0833C114.813 13.0833 115.112 13.1484 115.398 13.2786C115.685 13.4088 115.932 13.6128 116.141 13.8906L119.057 17.6666L123.484 19.151C123.936 19.2899 124.292 19.546 124.552 19.9193C124.813 20.2925 124.943 20.7048 124.943 21.1562C124.943 21.3646 124.912 21.5729 124.852 21.7812C124.791 21.9896 124.691 22.1892 124.552 22.3802L121.688 26.4427L121.792 30.7135C121.809 31.3212 121.609 31.8333 121.193 32.25C120.776 32.6666 120.29 32.875 119.734 32.875C119.7 32.875 119.509 32.8489 119.161 32.7969L114.5 31.4948L109.839 32.7969C109.752 32.8316 109.656 32.8533 109.552 32.862C109.448 32.8706 109.352 32.875 109.266 32.875C108.71 32.875 108.224 32.6666 107.807 32.25C107.391 31.8333 107.191 31.3212 107.208 30.7135L107.313 26.4166L104.474 22.3802C104.335 22.1892 104.235 21.9896 104.175 21.7812C104.114 21.5729 104.083 21.3646 104.083 21.1562C104.083 20.7222 104.209 20.3186 104.461 19.9453C104.713 19.572 105.064 19.3073 105.516 19.151L109.943 17.6666ZM111.219 19.4635L106.167 21.1302L109.396 25.7916L109.292 30.7656L114.5 29.3333L119.708 30.7916L119.604 25.7916L122.833 21.1823L117.781 19.4635L114.5 15.1666L111.219 19.4635Z" fill="white"/>
            </svg>
            <span className="text-[10px] font-bold" style={{color:'#E9E9D8'}}>Social</span>
          </button>

          {/* Center Active - Shopping (bag) */}
          <button 
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/brocoli')}
          >
            <div className="w-[58px] h-[51px] bg-[#3F957F] rounded-[10px] grid place-items-center shadow-md">
              <svg width="32" height="33" viewBox="0 0 32 33" fill="none" aria-hidden>
                <path d="M6.66667 29.8333C5.93333 29.8333 5.30556 29.5722 4.78333 29.05C4.26111 28.5278 4 27.9 4 27.1666V11.1666C4 10.4333 4.26111 9.80554 4.78333 9.28331C5.30556 8.76109 5.93333 8.49998 6.66667 8.49998H9.33333C9.33333 6.65554 9.98333 5.08331 11.2833 3.78331C12.5833 2.48331 14.1556 1.83331 16 1.83331C17.8444 1.83331 19.4167 2.48331 20.7167 3.78331C22.0167 5.08331 22.6667 6.65554 22.6667 8.49998H25.3333C26.0667 8.49998 26.6944 8.76109 27.2167 9.28331C27.7389 9.80554 28 10.4333 28 11.1666V27.1666C28 27.9 27.7389 28.5278 27.2167 29.05C26.6944 29.5722 26.0667 29.8333 25.3333 29.8333H6.66667ZM6.66667 27.1666H25.3333V11.1666H6.66667V27.1666ZM16 19.1666C17.8444 19.1666 19.4167 18.5166 20.7167 17.2166C22.0167 15.9166 22.6667 14.3444 22.6667 12.5H20C20 13.6111 19.6111 14.5555 18.8333 15.3333C18.0556 16.1111 17.1111 16.5 16 16.5C14.8889 16.5 13.9444 16.1111 13.1667 15.3333C12.3889 14.5555 12 13.6111 12 12.5H9.33333C9.33333 14.3444 9.98333 15.9166 11.2833 17.2166C12.5833 18.5166 14.1556 19.1666 16 19.1666ZM12 8.49998H20C20 7.38887 19.6111 6.44442 18.8333 5.66665C18.0556 4.88887 17.1111 4.49998 16 4.49998C14.8889 4.49998 13.9444 4.88887 13.1667 5.66665C12.3889 6.44442 12 7.38887 12 8.49998Z" fill="white"/>
              </svg>
            </div>
            {/* No label under the center tile per SVG */}
            <span className="text-[10px] font-bold opacity-0 select-none">.</span>
          </button>

          {/* BrocoHub (two users icon) */}
          <button 
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/grouppods')}
          >
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M224.042 31.8334V28.9167C224.042 28.3264 224.194 27.7839 224.497 27.2891C224.801 26.7943 225.205 26.4167 225.708 26.1563C226.785 25.6181 227.878 25.2144 228.99 24.9453C230.101 24.6762 231.229 24.5417 232.375 24.5417C233.521 24.5417 234.649 24.6762 235.76 24.9453C236.871 25.2144 237.965 25.6181 239.042 26.1563C239.545 26.4167 239.949 26.7943 240.253 27.2891C240.556 27.7839 240.708 28.3264 240.708 28.9167V31.8334H224.042ZM242.792 31.8334V28.7084C242.792 27.9445 242.579 27.211 242.154 26.5078C241.728 25.8047 241.125 25.2014 240.344 24.6979C241.229 24.8021 242.062 24.9801 242.844 25.2318C243.625 25.4835 244.354 25.7917 245.031 26.1563C245.656 26.5035 246.134 26.8898 246.463 27.3151C246.793 27.7405 246.958 28.2049 246.958 28.7084V31.8334H242.792ZM232.375 23.5C231.229 23.5 230.248 23.092 229.432 22.2761C228.616 21.4601 228.208 20.4792 228.208 19.3334C228.208 18.1875 228.616 17.2066 229.432 16.3906C230.248 15.5747 231.229 15.1667 232.375 15.1667C233.521 15.1667 234.502 15.5747 235.318 16.3906C236.134 17.2066 236.542 18.1875 236.542 19.3334C236.542 20.4792 236.134 21.4601 235.318 22.2761C234.502 23.092 233.521 23.5 232.375 23.5ZM242.792 19.3334C242.792 20.4792 242.384 21.4601 241.568 22.2761C240.752 23.092 239.771 23.5 238.625 23.5C238.434 23.5 238.191 23.4783 237.896 23.4349C237.601 23.3915 237.358 23.3438 237.167 23.2917C237.635 22.7361 237.996 22.1198 238.247 21.4427C238.499 20.7656 238.625 20.0625 238.625 19.3334C238.625 18.6042 238.499 17.9011 238.247 17.224C237.996 16.5469 237.635 15.9306 237.167 15.375C237.41 15.2882 237.653 15.2318 237.896 15.2057C238.139 15.1797 238.382 15.1667 238.625 15.1667C239.771 15.1667 240.752 15.5747 241.568 16.3906C240.752 17.2066 242.792 18.1875 242.792 19.3334ZM226.125 29.75H238.625V28.9167C238.625 28.7257 238.577 28.5521 238.482 28.3959C238.386 28.2396 238.26 28.1181 238.104 28.0313C237.167 27.5625 236.22 27.211 235.266 26.9766C234.311 26.7422 233.347 26.625 232.375 26.625C231.403 26.625 230.439 26.7422 229.484 26.9766C228.529 27.211 227.583 27.5625 226.646 28.0313C226.49 28.1181 226.364 28.2396 226.268 28.3959C226.173 28.5521 226.125 28.7257 226.125 28.9167V29.75ZM232.375 21.4167C232.948 21.4167 233.438 21.2127 233.846 20.8047C234.254 20.3967 234.458 19.9063 234.458 19.3334C234.458 18.7604 234.254 18.27 233.846 17.862C233.438 17.454 232.948 17.25 232.375 17.25C231.802 17.25 231.312 17.454 230.904 17.862C230.496 18.27 230.292 18.7604 230.292 19.3334C230.292 19.9063 230.496 20.3967 230.904 20.8047C231.312 21.2127 231.802 21.4167 232.375 21.4167Z" fill="#E9E9D8"/>
            </svg>
            <span className="text-[10px] font-bold" style={{color:'#E9E9D8'}}>BrocoHub</span>
          </button>

          {/* Profile (single user icon) */}
          <button 
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/profile')}
          >
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M282.042 31.8334V28.9167C282.042 28.3264 282.194 27.7839 282.497 27.2891C282.801 26.7943 283.205 26.4167 283.708 26.1563C284.785 25.6181 285.879 25.2144 286.99 24.9453C288.101 24.6762 289.229 24.5417 290.375 24.5417C291.521 24.5417 292.649 24.6762 293.76 24.9453C294.872 25.2144 295.965 25.6181 297.042 26.1563C297.545 26.4167 297.949 26.7943 298.253 27.2891C298.557 27.7839 298.708 28.3264 298.708 28.9167V31.8334H282.042ZM300.792 31.8334V28.7084C300.792 27.9445 300.579 27.211 300.154 26.5078C299.728 25.8047 299.125 25.2014 298.344 24.6979C299.229 24.8021 300.063 24.9801 300.844 25.2318C301.625 25.4835 302.354 25.7917 303.031 26.1563C303.656 26.5035 304.134 26.8898 304.464 27.3151C304.793 27.7405 304.958 28.2049 304.958 28.7084V31.8334H300.792ZM290.375 23.5C289.229 23.5 288.248 23.092 287.432 22.2761C286.616 21.4601 286.208 20.4792 286.208 19.3334C286.208 18.1875 286.616 17.2066 287.432 16.3906C288.248 15.5747 289.229 15.1667 290.375 15.1667C291.521 15.1667 292.502 15.5747 293.318 16.3906C294.134 17.2066 294.542 18.1875 294.542 19.3334C294.542 20.4792 294.134 21.4601 293.318 22.2761C292.502 23.092 291.521 23.5 290.375 23.5ZM300.792 19.3334C300.792 20.4792 300.384 21.4601 299.568 22.2761C298.752 23.092 297.771 23.5 296.625 23.5C296.434 23.5 296.191 23.4783 295.896 23.4349C295.601 23.3915 295.358 23.3438 295.167 23.2917C295.635 22.7361 295.996 22.1198 296.247 21.4427C296.499 20.7656 296.625 20.0625 296.625 19.3334C296.625 18.6042 296.499 17.9011 296.247 17.224C295.996 16.5469 295.635 15.9306 295.167 15.375C295.41 15.2882 295.653 15.2318 295.896 15.2057C296.139 15.1797 296.382 15.1667 296.625 15.1667C297.771 15.1667 298.752 15.5747 299.568 16.3906C300.384 17.2066 300.792 18.1875 300.792 19.3334ZM284.125 29.75H296.625V28.9167C296.625 28.7257 296.577 28.5521 296.482 28.3959C296.386 28.2396 296.26 28.1181 296.104 28.0313C295.167 27.5625 294.221 27.211 293.266 26.9766C292.311 26.7422 291.347 26.625 290.375 26.625C289.403 26.625 288.439 26.7422 287.484 26.9766C286.53 27.211 285.583 27.5625 284.646 28.0313C284.49 28.1181 284.364 28.2396 284.268 28.3959C284.173 28.5521 284.125 28.7257 284.125 28.9167V29.75ZM290.375 21.4167C290.948 21.4167 291.438 21.2127 291.846 20.8047C292.254 20.3967 292.458 19.9063 292.458 19.3334C292.458 18.7604 292.254 18.27 291.846 17.862C291.438 17.454 290.948 17.25 290.375 17.25C289.802 17.25 289.312 17.454 288.904 17.862C288.496 18.27 288.292 18.7604 288.292 19.3334C288.292 19.9063 288.496 20.3967 288.904 20.8047C289.312 21.2127 289.802 21.4167 290.375 21.4167Z" fill="#E9E9D8"/>
            </svg>
            <span className="text-[10px] font-bold" style={{color:'#E9E9D8'}}>Profile</span>
          </button>
        </div>
      </div>

      {/* Modal for Add to Cart */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-4 relative mx-4">
            <button
              className="absolute top-2 right-2 text-black text-2xl font-bold"
              onClick={() => { setShowModal(false); setApiError(null); }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-black text-black mb-2 text-center">Add Items to No Frills Cart</h2>
            {apiError && <div className="text-red-500 text-sm text-center">{apiError}</div>}
            <button
              className="w-full bg-[#375654] text-white text-lg font-bold py-3 rounded-full shadow-lg active:scale-95 transition-transform disabled:opacity-50"
              onClick={handleAddToNoFrillsCart}
              disabled={apiLoading}
            >
              {apiLoading ? 'Adding...' : 'Add to Cart'}
            </button>
            <div className="text-xs text-gray-500 text-center mt-2">
              You will be redirected to No Frills after adding items.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PodDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-xl font-bold">Loading plan details...</div>
      </div>
    }>
      <PodDetailsContent />
    </Suspense>
  );
} 