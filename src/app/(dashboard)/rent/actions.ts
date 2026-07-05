/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';

export async function processRentPayment(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
        await supabase.auth.getClaims();

    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const rent_cycle_id = formData.get('rent_cycle_id');
    if (typeof rent_cycle_id !== 'string' || rent_cycle_id.trim().length === 0) {
        return { error: 'Invalid or missing Rent Cycle ID.' };
    }

    const amountPaidRaw = formData.get('amount_paid');
    if (typeof amountPaidRaw !== 'string' || amountPaidRaw.trim().length === 0) {
        return { error: 'Payment amount is required.' };
    }

    const amount_paid = Number(amountPaidRaw);
    if (isNaN(amount_paid) || !Number.isInteger(amount_paid) || amount_paid <= 0) {
        return { error: 'Payment amount must be a positive integer.' };
    }

    const { data, error } = await supabase.rpc('process_rent_payment', {
        p_rent_cycle_id: rent_cycle_id,
        p_amount_paid: amount_paid
    });

    if (error) {
        console.error('Error calling process_rent_payment:', error);
        return { error: 'Failed to process payment. Please try again later.' };
    }

    if (data && typeof data === 'object' && 'error' in (data as any)) {
        return { error: (data as any).error };
    }

    revalidatePath('/rent');
    revalidatePath('/tenants');
    return { success: true };
}

export async function editRentCycle(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } = await supabase.auth.getClaims();
    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const id = formData.get('id');
    if (typeof id !== 'string' || id.trim().length === 0) {
        return { error: 'Rent Cycle ID is required.' };
    }

    const updateData: Record<string, unknown> = {};

    if (formData.has('amount_due')) {
        const amountRaw = formData.get('amount_due');
        if (typeof amountRaw !== 'string' || amountRaw.trim().length === 0) {
            return { error: 'Amount due is required if provided.' };
        }
        const amount_due = Number(amountRaw);
        if (isNaN(amount_due) || !Number.isInteger(amount_due) || amount_due < 0) {
            return { error: 'Amount due must be a valid non-negative whole number.' };
        }
        updateData.amount_due = amount_due;
    }

    if (formData.has('due_date')) {
        const dateRaw = formData.get('due_date');
        if (typeof dateRaw !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateRaw.trim())) {
            return { error: 'Due date must be in YYYY-MM-DD format.' };
        }
        updateData.due_date = dateRaw.trim();
    }

    if (formData.has('billing_month')) {
        const monthRaw = formData.get('billing_month');
        if (typeof monthRaw !== 'string' || !/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/.test(monthRaw.trim())) {
            return { error: 'Billing month must be in MMM-YYYY format (e.g., May-2026).' };
        }
        updateData.billing_month = monthRaw.trim();
    }

    if (Object.keys(updateData).length > 0) {
        const { data, error } = await supabase.rpc('edit_rent_cycle', {
            p_rent_cycle_id: id,
            p_update_data: updateData
        });

        if (error) {
            console.error('Error editing rent cycle:', error);
            return { error: 'Failed to update rent cycle. Please try again later.' };
        }
        
        if (data && typeof data === 'object' && 'error' in (data as any)) {
            return { error: (data as any).error };
        }
    }

    revalidatePath('/rent');
    return { success: true };
}
