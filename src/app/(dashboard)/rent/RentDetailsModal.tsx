/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { formatRupees } from '@/lib/utils';

export function RentDetailsModal({
    rentCycle,
    onClose,
    onRecordPayment,
    onEditRent,
}: {
    rentCycle: any;
    onClose: () => void;
    onRecordPayment: () => void;
    onEditRent: () => void;
}) {
    const payments = Array.isArray(rentCycle.rent_payments) ? rentCycle.rent_payments : (rentCycle.rent_payments ? [rentCycle.rent_payments] : []);
    const paid = payments.reduce(
        (acc: number, p: any) => acc + Number(p.amount_paid),
        0,
    );
    const remaining = Math.max(0, Number(rentCycle.amount_due) - paid);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">
                        Rent Details
                    </h3>
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
                </div>

                <div className="space-y-4 mb-8 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-slate-500 font-medium">Tenant</p>
                            <p className="text-slate-900 font-semibold">{rentCycle.tenants?.name}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium">Property</p>
                            <p className="text-slate-900 font-semibold">{rentCycle.tenants?.properties?.name}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                        <div>
                            <p className="text-slate-500 font-medium">Rent Period</p>
                            <p className="text-slate-900">{rentCycle.billing_month}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium">Due Date</p>
                            <p className="text-slate-900">
                                {rentCycle.due_date ? new Date(rentCycle.due_date).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                        <div>
                            <p className="text-slate-500 font-medium">Amount Due</p>
                            <p className="text-slate-900">{formatRupees(rentCycle.amount_due)}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium">Remaining</p>
                            <p className="text-slate-900 font-semibold">{formatRupees(remaining)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={onEditRent}
                        className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-md hover:bg-slate-50"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={onRecordPayment}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Record Payment
                    </button>
                </div>
            </div>
        </div>
    );
}
