import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[#FDE500] px-6 py-8 w-full max-w-md mx-auto">
      {/* Top branding */}
      <div className="w-full flex justify-center mt-4">
        <Image
          src="/noname.svg"
          alt="no name"
          width={120}
          height={24}
          className="brightness-0"
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center text-center flex-1 justify-center">
        {/* Main title */}
        <h1 className="text-6xl font-black text-black mb-4 leading-none">
          socialpod
        </h1>

        {/* Subtitle */}
        <p className="text-2xl font-bold text-black mb-12">
          shopping made fun
        </p>

        {/* Team credits */}
        <div className="mb-12">
          <p className="text-lg font-bold text-black mb-2">presented by</p>
          <p className="text-3xl font-black text-black mb-4">no idea</p>
          <p className="text-lg font-semibold text-black">
            menghao, ayman, fayaz & suzanna
          </p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="w-full flex flex-col items-center">
        <Link href="/brocoli" className="w-full">
          <button className="w-full bg-black text-white text-xl font-bold py-4 rounded-full shadow-lg active:scale-95 transition-transform mb-4">
            Start My Pod
          </button>
        </Link>
        <Link href="/auth" className="text-black font-bold text-lg underline">
          or create account
        </Link>
      </div>
    </div>
  );
}
