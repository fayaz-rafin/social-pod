import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 4l9 5.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5Z" stroke="#FDE500" strokeWidth="2"/><rect x="7" y="14" width="4" height="4" rx="1" fill="#FDE500"/></svg>
    ),
    activeColor: 'text-[#FDE500]'
  },
  {
    label: 'The Pod',
    href: '/brocoli',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2"/><path d="M8 8h8v8H8z" fill="white"/></svg>
    ),
    activeColor: 'text-white'
  },
  {
    label: 'Group Pods',
    href: '/grouppods',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="10" r="3" stroke="white" strokeWidth="2"/><circle cx="17" cy="10" r="3" stroke="white" strokeWidth="2"/><circle cx="12" cy="17" r="3" stroke="#FDE500" strokeWidth="2"/><path d="M2 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="white" strokeWidth="2"/><path d="M7 13c-2.67 0-8 1.34-8 4v3h22v-3c0-2.66-5.33-4-8-4" stroke="white" strokeWidth="0"/></svg>
    ),
    activeColor: 'text-[#FDE500]'
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="white" strokeWidth="2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2"/></svg>
    ),
    activeColor: 'text-white'
  },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pb-8 z-50">
      <div className="w-full bg-black rounded-full flex justify-around items-center py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link href={item.href} key={item.label} className="flex flex-col items-center">
              {item.icon}
              <span className={`${isActive ? item.activeColor : 'text-white'} text-xs font-bold mt-1`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 