"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Upload, LogOut, FileText, Wallet, Menu, X } from "lucide-react";

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/tenants', label: 'Tenants & Properties', icon: Users },
    { href: '/rent', label: 'Rent Tracking', icon: Wallet },
    { href: '/bills', label: 'Utility Bills', icon: FileText, prefetch: false },
    { href: '/upload', label: 'Upload Bill', icon: Upload },
];

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 shrink-0 relative z-50">
            <h1 className="text-xl font-bold text-slate-800">Rent Reminder</h1>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-slate-600 hover:text-slate-800 focus:outline-none"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 flex flex-col shadow-lg">
                    <nav className="flex flex-col py-2 px-4 space-y-1">
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
                                    onClick={() => setIsOpen(false)} 
                                    className={`flex items-center px-3 py-3 rounded-md transition-colors group ${
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
                        
                        <div className="pt-2 mt-2 border-t border-slate-200 pb-2">
                            <form action="/auth/signout" method="post">
                                <button type="submit" className="flex w-full items-center px-3 py-3 text-slate-700 rounded-md hover:bg-slate-100 group cursor-pointer">
                                    <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
