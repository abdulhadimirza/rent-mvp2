"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Users, Upload, LogOut, FileText, Wallet, Menu, X } from "lucide-react";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 shrink-0 relative z-50">
            <h1 className="text-xl font-bold text-slate-800">Rent MVP</h1>
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
                        <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-3 text-slate-700 rounded-md hover:bg-slate-100 group">
                            <Home className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                            Dashboard
                        </Link>
                        <Link href="/tenants" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-3 text-slate-700 rounded-md hover:bg-slate-100 group">
                            <Users className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                            Tenants & Properties
                        </Link>
                        <Link href="/rent" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-3 text-slate-700 rounded-md hover:bg-slate-100 group">
                            <Wallet className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                            Rent Tracking
                        </Link>
                        <Link href="/bills" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-3 text-slate-700 rounded-md hover:bg-slate-100 group">
                            <FileText className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                            Utility Bills
                        </Link>
                        <Link href="/upload" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-3 text-slate-700 rounded-md hover:bg-slate-100 group">
                            <Upload className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                            Upload Bill
                        </Link>
                        
                        <div className="pt-2 mt-2 border-t border-slate-200 pb-2">
                            <form action="/auth/signout" method="post">
                                <button type="submit" className="flex w-full items-center px-3 py-3 text-slate-700 rounded-md hover:bg-slate-100 group">
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
