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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E9E9D8] w-full">
      {/* Mobile layout wrapper */}
      <div className="flex flex-col items-center justify-center h-full w-full max-w-md md:max-w-lg lg:max-w-xl px-6 py-8">
        {/* Main content */}
        <div className="flex flex-col items-center justify-center flex-1">
          {/* Logo */}
          <div className="mb-16">
            <Image
              src="/brocolli.svg"
              alt="broccoli logo"
              width={320}
              height={107}
              className="w-80 md:w-96 lg:w-[28rem] h-auto"
            />
          </div>
        </div>

        {/* Bottom actions */}
        <div className="w-full flex flex-col items-center">
          <button 
            onClick={handleGetStarted}
            className="w-full bg-[#375654] text-white text-xl font-bold py-4 rounded-full shadow-lg active:scale-95 transition-transform mb-4 hover:bg-[#2d4240]"
          >
            Start My Pod
          </button>
          <Link href="/auth/signup" className="text-[#375654] font-bold text-lg underline hover:text-[#2d4240]">
            or create account
          </Link>
        </div>
      </div>
    </div>
  );
}