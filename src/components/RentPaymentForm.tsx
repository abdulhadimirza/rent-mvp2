/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { formatRupees } from '@/lib/utils';
import { processRentPayment } from '@/app/(dashboard)/rent/actions';

export function RentPaymentForm({
    rentCycle,
    onClose,
    onSuccess,
}: {
    rentCycle: any;
    onClose: () => void;
    onSuccess?: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [amountPaidStr, setAmountPaidStr] = useState('0');
    
    // Safety check for empty rentCycle
    if (!rentCycle) return null;

    const payments = Array.isArray(rentCycle.rent_payments) ? rentCycle.rent_payments : (rentCycle.rent_payments ? [rentCycle.rent_payments] : []);
    const paid = payments.reduce(
        (acc: number, p: any) => acc + Number(p.amount_paid),
        0,
    );
    const remaining = Math.max(0, Number(rentCycle.amount_due) - paid);
    const isPaid = remaining <= 0;
    const isOverpaid = paid > Number(rentCycle.amount_due);

    const amountPaid = Number(amountPaidStr) || 0;
    const totalPaidAfterThisPayment = paid + amountPaid;
    let calculatedStatus = 'unpaid';
    if (totalPaidAfterThisPayment >= Number(rentCycle.amount_due)) {
        calculatedStatus = 'paid';
    } else if (totalPaidAfterThisPayment > 0) {
        calculatedStatus = 'partial';
    }

    async function handleSave(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append('rent_cycle_id', rentCycle.id);

        const result = await processRentPayment(formData);

        if (result.success) {
            if (onSuccess) onSuccess();
            else onClose();
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    return (
        <>
            <div className="mb-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100">
                <p>
                    <strong>Tenant:</strong> {rentCycle.tenants?.name}
                </p>
                <p>
                    <strong>Rent Period:</strong> {rentCycle.billing_month}
                </p>
                <p>
                    <strong>Total Due:</strong> {formatRupees(rentCycle.amount_due)}
                </p>
                <p>
                    <strong>Remaining:</strong> {isOverpaid ? `Overpaid by ${formatRupees(paid - Number(rentCycle.amount_due))}` : formatRupees(remaining)}
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Rent Status (Automatic)
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
                                ? `This rent cycle is already overpaid by ${formatRupees(paid - Number(rentCycle.amount_due))}.`
                                : 'This rent cycle is already fully paid.'
                            }
                        </p>
                    ) : (
                        <p className="text-xs text-slate-500 mt-1">
                            This will be added to the total collected payments for this rent cycle.
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
        </>
    );
}
