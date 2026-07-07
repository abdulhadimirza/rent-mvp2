/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { RentPaymentForm } from '@/components/RentPaymentForm';
import { Modal } from '@/components/ui/modal';

export function RentPaymentModal({
    rentCycle,
    onClose,
}: {
    rentCycle: any;
    onClose: () => void;
}) {
    return (
        <Modal title="Record Rent Payment">
            <RentPaymentForm rentCycle={rentCycle} onClose={onClose} />
        </Modal>
    );
}
