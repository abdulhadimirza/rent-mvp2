'use client';

import { useState } from 'react';
import { getUnpaidRentCycles } from './actions';
import { RentPaymentForm } from '@/components/RentPaymentForm';
import { formatRupees } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';

interface Tenant {
    id: string;
    name: string;
    property_name: string;
}

interface RentPayment {
    id: string;
    amount_paid: number | string;
    payment_date?: string;
    created_at?: string;
}

interface RentCycle {
    id: string;
    billing_month: string;
    amount_due: number | string;
    rent_payments?: RentPayment | RentPayment[];
    [key: string]: unknown;
}

export function GlobalRentPaymentModal({
    tenants,
    onClose,
}: {
    tenants: Tenant[];
    onClose: () => void;
}) {
    const [selectedTenantId, setSelectedTenantId] = useState<string>('');
    const [rentCycles, setRentCycles] = useState<RentCycle[]>([]);
    const [selectedCycleId, setSelectedCycleId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCycles = async (tenantId: string) => {
        setLoading(true);
        setError(null);
        const res = await getUnpaidRentCycles(tenantId);
        if (res.error) {
            setError(res.error);
        } else if (res.data) {
            setRentCycles(res.data);
        }
        setLoading(false);
    };

    const handleTenantChange = (tenantId: string) => {
        setSelectedTenantId(tenantId);
        setRentCycles([]);
        setSelectedCycleId('');
        setError(null);
        if (tenantId) {
            fetchCycles(tenantId);
        }
    };

    const selectedCycle = rentCycles.find((c) => c.id === selectedCycleId);

    return (
        <Modal title="Record Rent Payment">
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
                            onChange={(e) => handleTenantChange(e.target.value)}
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
                            ) : error ? (
                                <div className="flex flex-col gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <div className="text-sm text-red-600">{error}</div>
                                    <button 
                                        type="button" 
                                        onClick={() => fetchCycles(selectedTenantId)}
                                        className="self-start px-3 py-1 bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 text-sm font-medium transition-colors"
                                    >
                                            Retry
                                    </button>
                                </div>
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
                                        const paid = payments.reduce((acc: number, p: RentPayment) => acc + Number(p.amount_paid), 0);
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
        </Modal>
    );
}
