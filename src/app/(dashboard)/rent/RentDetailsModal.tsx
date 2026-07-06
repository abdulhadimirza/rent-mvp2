/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { formatRupees } from '@/lib/utils';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteRentPayment } from './actions';

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

    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDeletePayment = async (paymentId: string) => {
        if (!confirm('Are you sure you want to delete this payment?')) return;
        setIsDeleting(paymentId);
        const result = await deleteRentPayment(paymentId);
        if (result?.error) {
            alert(result.error);
        } else {
            //onClose(); // Optional: Close or just let the data refresh. But revalidatePath refreshes the background.
        }
        setIsDeleting(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
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

                {payments.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 border-b border-slate-100 pb-2">Payment History</h4>
                        <div className="space-y-3">
                            {payments.map((payment: any, index: number) => {
                                return (
                                    <div key={payment.id} className="flex items-center justify-between text-sm">
                                        <div>
                                            <p className="text-slate-900 font-medium">{formatRupees(payment.amount_paid)}</p>
                                            <p className="text-slate-500 text-xs">
                                                {new Date(payment.payment_date || payment.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeletePayment(payment.id)}
                                            disabled={isDeleting !== null}
                                            className="text-red-500 hover:text-red-700 disabled:opacity-50 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete payment"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

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
