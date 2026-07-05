/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { editBill } from './actions';

export function EditBillModal({
    bill,
    onClose,
}: {
    bill: any;
    onClose: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setDirtyFields({});
    }, [bill.id]);

    const handleFieldChange = (fieldName: string) => {
        setDirtyFields((prev) => ({ ...prev, [fieldName]: true }));
    };

    async function handleSave(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const rawFormData = new FormData(e.currentTarget);
        const filteredFormData = new FormData();
        filteredFormData.append('id', bill.id);

        let hasChanges = false;
        if (dirtyFields['amount_due']) {
            filteredFormData.append('amount_due', rawFormData.get('amount_due') as string);
            hasChanges = true;
        }
        if (dirtyFields['due_date']) {
            filteredFormData.append('due_date', rawFormData.get('due_date') as string);
            hasChanges = true;
        }
        if (dirtyFields['bill_type']) {
            filteredFormData.append('bill_type', rawFormData.get('bill_type') as string);
            hasChanges = true;
        }
        if (dirtyFields['billing_month']) {
            filteredFormData.append('billing_month', rawFormData.get('billing_month') as string);
            hasChanges = true;
        }

        if (hasChanges) {
            const result = await editBill(filteredFormData);
            if (result.error) {
                alert(result.error);
                setLoading(false);
                return;
            }
        }

        setLoading(false);
        onClose();
    }

    const formattedDate = bill.due_date
        ? new Date(bill.due_date).toISOString().split('T')[0]
        : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">
                    Edit Bill
                </h3>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Bill Type
                        </label>
                        <select
                            required
                            name="bill_type"
                            defaultValue={bill.bill_type as string}
                            onChange={() => handleFieldChange('bill_type')}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                        >
                            <option value="">Select Bill Type</option>
                            <option value="Electricity">Electricity</option>
                            <option value="Gas">Gas</option>
                            <option value="Water">Water</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Billing Month
                        </label>
                        <input
                            required
                            name="billing_month"
                            defaultValue={bill.billing_month as string}
                            onChange={() => handleFieldChange('billing_month')}
                            maxLength={50}
                            pattern="^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$"
                            title="Billing month must be in MMM-YYYY format (e.g., May-2026)"
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                            placeholder="e.g. May-2026"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Amount Due (Rs. )
                        </label>
                        <input
                            required
                            name="amount_due"
                            type="number"
                            step="1"
                            min="0"
                            defaultValue={bill.amount_due}
                            onChange={() => handleFieldChange('amount_due')}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Due Date
                        </label>
                        <input
                            required
                            name="due_date"
                            type="date"
                            defaultValue={formattedDate}
                            onChange={() => handleFieldChange('due_date')}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
                        />
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
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
