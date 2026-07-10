import { LogOut } from 'lucide-react';
import { MobileNav } from '@/components/MobileNav';
import { SidebarNav } from '@/components/SidebarNav';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
            <MobileNav />

            {/* Sidebar */}
            <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <h1 className="text-xl font-bold text-slate-800">Rent Reminder</h1>
                </div>

                <SidebarNav />

                <div className="p-4 border-t border-slate-200">
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="flex w-full items-center px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 group cursor-pointer"
                        >
                            <LogOut className="mr-3 h-4 w-4 text-slate-400 group-hover:text-slate-500" />
                            Sign out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
