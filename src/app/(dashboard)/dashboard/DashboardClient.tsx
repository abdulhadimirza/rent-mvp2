'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp, Receipt, Home, FileText, Activity } from 'lucide-react';
import { formatRupees } from '@/lib/utils';
import Link from 'next/link';

interface OutstandingPayment {
    id: string;
    type: string;
    tenant_name: string;
    property_name: string;
    due_date: string;
    balance: number;
    link: string;
}

interface RecentActivity {
    id: string;
    type: string;
    tenant_name: string;
    amount: number;
    created_at: string;
}

interface DashboardData {
    active_portfolio: number;
    payments_received: number;
    pending_balance: number;
    outstanding_payments?: OutstandingPayment[];
    recent_activity?: RecentActivity[];
}

export function DashboardClient({ data }: { data: DashboardData }) {
    if (!data) return <div className="text-slate-500">Failed to load dashboard data.</div>;

    const {
        active_portfolio,
        payments_received,
        pending_balance,
        outstanding_payments = [],
        recent_activity = []
    } = data;

    return (
        <div className="space-y-8">
            {/* Quick Actions Panel */}
            <div className="flex flex-wrap items-center gap-3">
                <Link href="/rent" className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors shadow-sm font-medium">
                    <Home className="w-4 h-4 text-blue-600" />
                    Record Rent
                </Link>
                <Link href="/upload" className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors shadow-sm font-medium">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Upload Bill
                </Link>
                <Link href="/bills" className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors shadow-sm font-medium">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    View Bills
                </Link>
                <Link href="/tenants" className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors shadow-sm font-medium">
                    <Users className="w-4 h-4 text-slate-600" />
                    Manage Tenants
                </Link>
            </div>

            {/* KPI Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Pending Balance
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {formatRupees(pending_balance)}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Total remaining to be collected
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Payments Received
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {formatRupees(payments_received)}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Collected this month
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Active Portfolio
                        </CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {active_portfolio || 0}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Active tenants
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Outstanding Payments Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Outstanding Payments
                        </h3>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Type</th>
                                    <th className="px-6 py-3 font-medium">Tenant & Property</th>
                                    <th className="px-6 py-3 font-medium">Due Date</th>
                                    <th className="px-6 py-3 font-medium">Balance</th>
                                    <th className="px-6 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {outstanding_payments.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-12 text-center text-slate-500"
                                        >
                                            No outstanding balances. Great job!
                                        </td>
                                    </tr>
                                ) : (
                                    outstanding_payments.map((item: OutstandingPayment) => (
                                        <tr
                                            key={item.id + item.type}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                                {item.type}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-900 font-medium">{item.tenant_name}</div>
                                                <div className="text-slate-500 text-xs">{item.property_name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-24 inline-block">
                                                        {new Date(item.due_date).toLocaleDateString()}
                                                    </span>
                                                    {new Date(item.due_date) < new Date() && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                            Overdue
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                                                {formatRupees(item.balance)}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={item.link}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm whitespace-nowrap"
                                                >
                                                    View details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-slate-500" />
                        <h3 className="text-lg font-semibold text-slate-900">
                            Recent Activity
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {recent_activity.length === 0 ? (
                            <div className="px-6 py-12 text-center text-slate-500 text-sm">
                                No recent payments recorded.
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {recent_activity.map((activity: RecentActivity) => (
                                    <li key={activity.id + activity.type} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-slate-900 text-sm">{activity.tenant_name}</span>
                                            <span className="font-semibold text-green-600 text-sm">+{formatRupees(activity.amount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-slate-500">
                                            <span>{activity.type}</span>
                                            <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
