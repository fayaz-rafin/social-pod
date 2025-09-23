"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    render: (active: boolean) => (
      <div className="flex flex-col items-center" aria-label="Dashboard">
        <svg width="26" height="26" viewBox="0 0 24 24" className={`${active ? 'text-[#FDE500]' : 'text-white'}`}><path d="M3 10.25L12 4l9 6.25V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8.75Z" fill="none" stroke="currentColor" strokeWidth="2"/><rect x="7" y="14" width="4" height="4" rx="1" fill={active ? '#FDE500' : 'white'} /></svg>
        <span className={`${active ? 'text-[#FDE500]' : 'text-white'} text-[11px] font-bold mt-1`}>Dashboard</span>
      </div>
    )
  },
  {
    label: 'Rewards',
    href: '/plan',
    render: (active: boolean) => (
      <div className="flex flex-col items-center" aria-label="Rewards">
        <svg width="26" height="26" viewBox="0 0 24 24" className={`${active ? 'text-[#FDE500]' : 'text-white'}`}>
          <path d="M12 2l2.39 4.85L20 7.27l-3.6 3.51.85 4.97L12 13.77 6.75 15.75l.85-4.97L4 7.27l5.61-.42L12 2z" fill="currentColor"/></svg>
        <span className={`${active ? 'text-[#FDE500]' : 'text-white'} text-[11px] font-bold mt-1`}>Rewards</span>
      </div>
    )
  },
  {
    label: 'BrocoHub',
    href: '/grouppods',
    render: (active: boolean) => (
      <div className="flex flex-col items-center" aria-label="BrocoHub">
        <svg width="26" height="26" viewBox="0 0 24 24" className={`${active ? 'text-[#FDE500]' : 'text-white'}`}>
          <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 20c0-3.866 4.477-7 9-7s9 3.134 9 7" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
        <span className={`${active ? 'text-[#FDE500]' : 'text-white'} text-[11px] font-bold mt-1`}>BrocoHub</span>
      </div>
    )
  },
  {
    label: 'Profile',
    href: '/profile',
    render: (active: boolean) => (
      <div className="flex flex-col items-center" aria-label="Profile">
        <svg width="26" height="26" viewBox="0 0 24 24" className={`${active ? 'text-[#FDE500]' : 'text-white'}`}>
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 22c0-4.418 4.477-8 9-8s9 3.582 9 8" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
        <span className={`${active ? 'text-[#FDE500]' : 'text-white'} text-[11px] font-bold mt-1`}>Profile</span>
      </div>
    )
  }
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pb-8 z-50">
      <div className="relative w-full bg-black rounded-full flex items-center justify-between px-6 py-3">
        {navItems.slice(0,2).map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link href={item.href} key={item.label} className="flex-1 flex justify-start" aria-label={item.label}>
              {item.render(isActive)}
            </Link>
          );
        })}

        <Link href="/brocoli" aria-label="Add Trip" className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2F4746] flex items-center justify-center shadow-lg active:scale-95">
              <svg width="28" height="28" viewBox="0 0 24 24" className="text-white"><path fill="currentColor" d="M16 6h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="M9 10V7a3 3 0 0 1 6 0v3" fill="none" stroke="white" strokeWidth="2"/></svg>
            </div>
            <span className="text-white text-[11px] font-bold mt-1">Add Trip</span>
          </div>
        </Link>

        {navItems.slice(2).map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link href={item.href} key={item.label} className="flex-1 flex justify-end" aria-label={item.label}>
              {item.render(isActive)}
            </Link>
          );
        })}
      </div>
    </div>
  );
} 