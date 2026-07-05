'use client';

import { useState, useEffect } from 'react';
import { getUnpaidRentCycles } from './actions';
import { RentPaymentForm } from '@/components/RentPaymentForm';
import { formatRupees } from '@/lib/utils';

export function GlobalRentPaymentModal({
    tenants,
    onClose,
}: {
    tenants: any[];
    onClose: () => void;
}) {
    const [selectedTenantId, setSelectedTenantId] = useState<string>('');
    const [rentCycles, setRentCycles] = useState<any[]>([]);
    const [selectedCycleId, setSelectedCycleId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setRentCycles([]);
        setSelectedCycleId('');

        if (!selectedTenantId) {
            return;
        }

        async function fetchCycles() {
            setLoading(true);
            const res = await getUnpaidRentCycles(selectedTenantId);
            if (res.data) {
                setRentCycles(res.data);
            }
            setLoading(false);
        }

        fetchCycles();
    }, [selectedTenantId]);

    const selectedCycle = rentCycles.find((c) => c.id === selectedCycleId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm w-screen h-screen">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">
                    Record Rent Payment
                </h3>

                {tenants.length === 0 ? (
                    <div className="text-slate-600 mb-4">No tenants available.</div>
                ) : (
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Select Tenant
                            </label>
                            <select
                                value={selectedTenantId}
                                onChange={(e) => setSelectedTenantId(e.target.value)}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                            >
                                <option value="">-- Select a tenant --</option>
                                {tenants.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} ({t.property_name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedTenantId && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Select Rent Cycle
                                </label>
                                {loading ? (
                                    <div className="text-sm text-slate-500">Loading rent cycles...</div>
                                ) : rentCycles.length === 0 ? (
                                    <div className="text-sm text-slate-500">No unpaid rent cycles found for this tenant.</div>
                                ) : (
                                    <select
                                        value={selectedCycleId}
                                        onChange={(e) => setSelectedCycleId(e.target.value)}
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                                    >
                                        <option value="">-- Select an unpaid rent cycle --</option>
                                        {rentCycles.map((c) => {
                                            const payments = Array.isArray(c.rent_payments) ? c.rent_payments : (c.rent_payments ? [c.rent_payments] : []);
                                            const paid = payments.reduce((acc: number, p: any) => acc + Number(p.amount_paid), 0);
                                            const remaining = Math.max(0, Number(c.amount_due) - paid);
                                            return (
                                                <option key={c.id} value={c.id}>
                                                    {c.billing_month} - {formatRupees(remaining)} remaining
                                                </option>
                                            );
                                        })}
                                    </select>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {selectedCycle ? (
                    <div className="border-t border-slate-200 pt-4">
                        <RentPaymentForm rentCycle={selectedCycle} onClose={onClose} />
                    </div>
                ) : (
                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
