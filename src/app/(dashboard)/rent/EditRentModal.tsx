/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition } from 'react';
import { editRentCycle } from './actions';
import { Modal } from '@/components/ui/modal';

export function EditRentModal({
    rentCycle,
    onClose,
}: {
    rentCycle: any;
    onClose: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({});

    const handleFieldChange = (fieldName: string) => {
        setDirtyFields((prev) => ({ ...prev, [fieldName]: true }));
    };

    function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const rawFormData = new FormData(e.currentTarget);
        const filteredFormData = new FormData();
        filteredFormData.append('id', rentCycle.id);

        let hasChanges = false;
        if (dirtyFields['amount_due']) {
            filteredFormData.append('amount_due', rawFormData.get('amount_due') as string);
            hasChanges = true;
        }
        if (dirtyFields['due_date']) {
            filteredFormData.append('due_date', rawFormData.get('due_date') as string);
            hasChanges = true;
        }
        if (dirtyFields['billing_month']) {
            filteredFormData.append('billing_month', rawFormData.get('billing_month') as string);
            hasChanges = true;
        }

        if (hasChanges) {
            startTransition(async () => {
                const result = await editRentCycle(filteredFormData);
                if (result.error) {
                    alert(result.error);
                } else {
                    onClose();
                }
            });
        } else {
            onClose();
        }
    }

    const formattedDate = rentCycle.due_date
        ? new Date(rentCycle.due_date).toISOString().split('T')[0]
        : '';

    return (
        <Modal title="Edit Rent Cycle">
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                            Rent Month
                    </label>
                    <input
                        required
                        name="billing_month"
                        defaultValue={rentCycle.billing_month as string}
                        onChange={() => handleFieldChange('billing_month')}
                        maxLength={50}
                        pattern="^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$"
                        title="Rent month must be in MMM-YYYY format (e.g., May-2026)"
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
                        defaultValue={rentCycle.amount_due}
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
                        disabled={isPending}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
                    >
                            Close
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
