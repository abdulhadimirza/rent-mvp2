/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RentPaymentModal } from './RentPaymentModal';
import { RentDetailsModal } from './RentDetailsModal';
import { EditRentModal } from './EditRentModal';
import { formatRupees } from '@/lib/utils';


export function RentClient({ rentCycles }: { rentCycles: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [paymentRentId, setPaymentRentId] = useState<string | null>(null);
    const [detailsRentId, setDetailsRentId] = useState<string | null>(null);
    const [editRentId, setEditRentId] = useState<string | null>(null);

    const paymentRent = rentCycles.find((r) => r.id === paymentRentId);
    const detailsRent = rentCycles.find((r) => r.id === detailsRentId);
    const editRent = rentCycles.find((r) => r.id === editRentId);

    return (
        <div>
            {/* Data Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Tenant</th>
                                <th className="px-6 py-3 font-medium">Property</th>
                                <th className="px-6 py-3 font-medium">Rent Period</th>
                                <th className="px-6 py-3 font-medium">Amount Due</th>
                                <th className="px-6 py-3 font-medium">Remaining</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {rentCycles.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-slate-500"
                                    >
                                        No rent cycles found.
                                    </td>
                                </tr>
                            ) : (
                                rentCycles.map((rentCycle) => {
                                    const payments = Array.isArray(rentCycle.rent_payments) ? rentCycle.rent_payments : (rentCycle.rent_payments ? [rentCycle.rent_payments] : []);
                                    const paid = payments.reduce(
                                        (acc: number, p: any) => acc + Number(p.amount_paid),
                                        0,
                                    );
                                    const remaining = Math.max(0, Number(rentCycle.amount_due) - paid);

                                    return (
                                        <tr
                                            key={rentCycle.id}
                                            onClick={() => setDetailsRentId(rentCycle.id)}
                                            className="hover:bg-slate-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {rentCycle.tenants?.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {rentCycle.tenants?.properties?.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {rentCycle.billing_month}
                                            </td>
                                            <td className="px-6 py-4 text-slate-900">
                                                {formatRupees(rentCycle.amount_due)}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                {formatRupees(remaining)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                           ${rentCycle.status === 'paid'
                                            ? 'bg-green-100 text-green-800'
                                            : rentCycle.status === 'partial'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }
                         `}
                                                >
                                                    {rentCycle.status}
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

            {paymentRent && (
                <RentPaymentModal
                    rentCycle={paymentRent}
                    onClose={() => setPaymentRentId(null)}
                />
            )}

            {detailsRent && (
                <RentDetailsModal
                    rentCycle={detailsRent}
                    onClose={() => setDetailsRentId(null)}
                    onRecordPayment={() => {
                        setPaymentRentId(detailsRent.id);
                        setDetailsRentId(null);
                    }}
                    onEditRent={() => {
                        setEditRentId(detailsRent.id);
                        setDetailsRentId(null);
                    }}
                />
            )}

            {editRent && (
                <EditRentModal
                    rentCycle={editRent}
                    onClose={() => setEditRentId(null)}
                />
            )}
        </div>
    );
}
