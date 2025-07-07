'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const router = useRouter();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const handleGetStarted = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      router.push('/brocoli');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[#FDE500] px-6 py-8 w-full max-w-md mx-auto">


      {/* Main content */}
      <div className="flex flex-col items-start text-left flex-1 justify-center">
      
        <div className="flex flex-col flex-1 justify-center">
          {/* Top branding */}
            <div className="w-full flex justify-start mt-4">
              <Image
                src="/noname.svg"
                alt="no name"
                width={120}
                height={24}
                className="brightness-0"
              />
            </div>
          {/* Main title */}
          <h1 className="text-6xl font-black text-black mb-4 leading-none">
            social brocoli
          </h1>

          {/* Subtitle */}
          <p className="text-2xl font-bold text-black mb-12">
            shopping made fun
          </p>
  

        </div>        
      </div>


      {/* Bottom actions */}
      <div className="w-full flex flex-col items-center">
        
          {/* Team credits */}
          <div className="flex flex-col  gap-2 mb-6">
            <p className="text-lg font-bold text-black mb-1">presented by</p>
            <p className="text-3xl font-black text-black mb-2">by no idea®</p>
            <p className="text-lg font-semibold text-black">
              menghao, ayman, fayaz & suzanna
            </p>
          </div>
        <button 
          onClick={handleGetStarted}
          className="w-full bg-black text-white text-xl font-bold py-4 rounded-full shadow-lg active:scale-95 transition-transform mb-4"
        >
          Get Started
        </button>
        <Link href="/auth/signup" className="text-black font-bold text-lg underline">
          or create account
        </Link>
      </div>
    </div>
  );
}
