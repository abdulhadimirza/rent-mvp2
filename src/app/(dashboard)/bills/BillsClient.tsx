/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaymentModal } from './PaymentModal';
import { BillDetailsModal } from './BillDetailsModal';
import { EditBillModal } from './EditBillModal';
import { formatRupees } from '@/lib/utils';


const statusColors: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    partial: 'bg-yellow-100 text-yellow-800',
    unpaid: 'bg-red-100 text-red-800',
};

export function BillsClient({ bills }: { bills: any[] }) {
    const searchParams = useSearchParams();

    const highlightId = searchParams.get('highlight');

    const [paymentBillId, setPaymentBillId] = useState<string | null>(null);
    const [detailsBillId, setDetailsBillId] = useState<string | null>(highlightId);
    const [editBillId, setEditBillId] = useState<string | null>(null);

    const [prevHighlightId, setPrevHighlightId] = useState(highlightId);
    if (highlightId !== prevHighlightId) {
        setPrevHighlightId(highlightId);
        setDetailsBillId(highlightId);
    }

    const paymentBill = bills.find((b) => b.id === paymentBillId);
    const detailsBill = bills.find((b) => b.id === detailsBillId);
    const editBill = bills.find((b) => b.id === editBillId);

    return (
        <div>
            {/* Filters
            <div className="flex gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Status
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="border border-slate-300 rounded-md px-3 py-2 text-slate-900 bg-white"
                    >
                        <option value="all">All Statuses</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Billing Month
                    </label>
                    <select
                        value={monthFilter}
                        onChange={(e) => handleFilterChange('month', e.target.value)}
                        className="border border-slate-300 rounded-md px-3 py-2 text-slate-900 bg-white"
                    >
                        <option value="all">All Months</option>
                        {Array.from(new Set(bills.map((b) => b.billing_month))).map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            */}

            {/* Data Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Tenant</th>
                                <th className="px-6 py-3 font-medium">Property</th>
                                <th className="px-6 py-3 font-medium">Bill Type</th>
                                <th className="px-6 py-3 font-medium">Period</th>
                                <th className="px-6 py-3 font-medium">Amount Due</th>
                                <th className="px-6 py-3 font-medium">Remaining</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {bills.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-8 text-center text-slate-500"
                                    >
                                        No bills found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                bills.map((bill) => {
                                    const paid = bill.bill_payments.reduce(
                                        (acc: number, p: any) => acc + Number(p.amount_paid),
                                        0,
                                    );
                                    const remaining = Math.max(0, Number(bill.amount_due) - paid);

                                    return (
                                        <tr
                                            key={bill.id}
                                            onClick={() => setDetailsBillId(bill.id)}
                                            className={`cursor-pointer transition-colors ${highlightId === bill.id ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'}`}
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {bill.tenants.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {bill.tenants.properties.name}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {bill.bill_type}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {bill.billing_month}
                                            </td>
                                            <td className="px-6 py-4 text-slate-900">
                                                {formatRupees(bill.amount_due)}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                {formatRupees(remaining)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[bill.status] || statusColors.unpaid}`}
                                                >
                                                    {bill.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {paymentBill && (
                <PaymentModal
                    bill={paymentBill}
                    onClose={() => setPaymentBillId(null)}
                />
            )}

            {detailsBill && (
                <BillDetailsModal
                    bill={detailsBill}
                    onClose={() => setDetailsBillId(null)}
                    onRecordPayment={() => {
                        setPaymentBillId(detailsBill.id);
                        setDetailsBillId(null);
                    }}
                    onEditBill={() => {
                        setEditBillId(detailsBill.id);
                        setDetailsBillId(null);
                    }}
                />
            )}

            {editBill && (
                <EditBillModal
                    bill={editBill}
                    onClose={() => setEditBillId(null)}
                />
            )}
        </div>
    );
}
