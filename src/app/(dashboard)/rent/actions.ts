/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import { processRentPaymentSchema, editRentCycleSchema } from '@/lib/schemas';

export async function processRentPayment(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
        await supabase.auth.getClaims();

    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const parsed = processRentPaymentSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }
    const { rent_cycle_id, amount_paid } = parsed.data;

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

    const parsed = editRentCycleSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }
    const { id, ...updateDataRaw } = parsed.data;

    const updateData = Object.fromEntries(
        Object.entries(updateDataRaw).filter(([, v]) => v !== undefined)
    );

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

export async function deleteRentPayment(paymentId: string) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } = await supabase.auth.getClaims();
    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const { data, error } = await supabase.rpc('delete_rent_payment', {
        p_payment_id: paymentId,
    });

    if (error) {
        console.error('Error deleting rent payment:', error);
        return { error: 'Failed to delete payment. Please try again later.' };
    }

    if (data && typeof data === 'object' && 'error' in (data as any)) {
        return { error: (data as any).error };
    }

    revalidatePath('/rent');
    revalidatePath('/tenants');
    return { success: true };
}
