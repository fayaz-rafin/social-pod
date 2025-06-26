'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data?.user?.email || 'user@email.com');
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-32 max-w-md mx-auto">
      {/* Black Header */}
      <div className="bg-black rounded-b-3xl h-40 w-full"></div>

      {/* Broccoli Avatar */}
      <div className="-mt-20 flex justify-center">
        <div className="w-40 h-40 rounded-full bg-[#FDE500] flex items-center justify-center shadow-lg">
          <Image src="/brocoli.svg" alt="Broccoli" width={120} height={120} />
        </div>
      </div>

      {/* Name and Email */}
      <div className="flex flex-col items-center mt-6">
        <h1 className="text-5xl font-black text-black">Mr Broccoli</h1>
        <p className="text-2xl font-bold text-black mt-2">
          <span className="text-black">{email.split('@')[0]}</span>
          <span className="text-black">@{email.split('@')[1]}</span>
        </p>
      </div>

      {/* Logout Button */}
      <div className="flex flex-col items-center mt-16">
        <button
          onClick={handleLogout}
          className="w-3/4 bg-[#FDE500] text-black text-2xl font-bold py-4 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          Logout
        </button>
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