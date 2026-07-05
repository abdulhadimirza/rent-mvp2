/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { processPayment } from './actions';
import { formatRupees } from '@/lib/utils';

export function PaymentModal({
    bill,
    onClose,
}: {
    bill: any;
    onClose: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [amountPaidStr, setAmountPaidStr] = useState('0');
    const paid = bill.payments.reduce(
        (acc: number, p: any) => acc + Number(p.amount_paid),
        0,
    );
    const remaining = Math.max(0, Number(bill.amount_due) - paid);
    const isPaid = remaining <= 0;
    const isOverpaid = paid > Number(bill.amount_due);

    const amountPaid = Number(amountPaidStr) || 0;
    const totalPaidAfterThisPayment = paid + amountPaid;
    let calculatedStatus = 'unpaid';
    if (totalPaidAfterThisPayment >= Number(bill.amount_due)) {
        calculatedStatus = 'paid';
    } else if (totalPaidAfterThisPayment > 0) {
        calculatedStatus = 'partial';
    }

    async function handleSave(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append('bill_id', bill.id);

        const result = await processPayment(formData);

        if (result.success) {
            onClose();
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">
                    Record Payment
                </h3>
                <div className="mb-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100">
                    <p>
                        <strong>Tenant:</strong> {bill.tenants.name}
                    </p>
                    <p>
                        <strong>Bill Type:</strong> {bill.bill_type}
                    </p>
                    <p>
                        <strong>Total Due:</strong> {formatRupees(bill.amount_due)}
                    </p>
                    <p>
                        <strong>Remaining:</strong> {isOverpaid ? `Overpaid by ${formatRupees(paid - Number(bill.amount_due))}` : formatRupees(remaining)}
                    </p>

                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Bill Status (Automatic)
                        </label>
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900 font-semibold capitalize">
                            {calculatedStatus}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Amount Paid
                        </label>
                        <input
                            required={!isPaid}
                            disabled={isPaid}
                            name="amount_paid"
                            type="number"
                            step="1"
                            min={isPaid ? 0 : 1}
                            max={remaining}
                            value={isPaid ? '0' : amountPaidStr}
                            onChange={(e) => {
                                const val = e.target.value;
                                const num = Number(val) || 0;
                                if (num > remaining) {
                                    setAmountPaidStr(remaining.toString());
                                } else if (num < 0) {
                                    setAmountPaidStr('1');
                                } else {
                                    setAmountPaidStr(val);
                                }
                            }}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 disabled:bg-slate-100 disabled:opacity-50"
                        />
                        {isPaid ? (
                            <p className="text-xs text-emerald-600 font-semibold mt-1">
                                {isOverpaid
                                    ? `This bill is already overpaid by ${formatRupees(paid - Number(bill.amount_due))}.`
                                    : 'This bill is already fully paid.'
                                }
                            </p>
                        ) : (
                            <p className="text-xs text-slate-500 mt-1">
                                This will be added to the total collected payments for this bill.
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            disabled={loading || isPaid}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
