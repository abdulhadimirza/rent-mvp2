"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Upload, FileText, Wallet } from 'lucide-react';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/tenants', label: 'Tenants & Properties', icon: Users },
    { href: '/rent', label: 'Rent Tracking', icon: Wallet },
    { href: '/bills', label: 'Utility Bills', icon: FileText, prefetch: false },
    { href: '/upload', label: 'Upload Bill', icon: Upload },
];

export function SidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/dashboard' 
                    ? pathname === '/dashboard'
                    : pathname?.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        prefetch={item.prefetch}
                        className={`flex items-center px-3 py-2 rounded-md transition-colors group ${
                            isActive 
                                ? 'bg-slate-200/80 font-semibold text-slate-900' 
                                : 'text-slate-700 hover:bg-slate-100/70'
                        }`}
                    >
                        <Icon 
                            className={`mr-3 h-5 w-5 ${
                                isActive ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'
                            }`} 
                        />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
