/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { RentPaymentForm } from '@/components/RentPaymentForm';

export function RentPaymentModal({
    rentCycle,
    onClose,
}: {
    rentCycle: any;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">
                    Record Rent Payment
                </h3>
                <RentPaymentForm rentCycle={rentCycle} onClose={onClose} />
            </div>
        </div>
    );
}
