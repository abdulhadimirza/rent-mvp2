/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import { formatRupees } from '@/lib/utils';

export async function processPayment(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
        await supabase.auth.getClaims();

    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const bill_id = formData.get('bill_id');
    if (typeof bill_id !== 'string' || bill_id.trim().length === 0) {
        return { error: 'Invalid or missing Bill ID.' };
    }

    const amountPaidRaw = formData.get('amount_paid');
    if (typeof amountPaidRaw !== 'string' || amountPaidRaw.trim().length === 0) {
        return { error: 'Payment amount is required.' };
    }

    const amount_paid = Number(amountPaidRaw);
    if (isNaN(amount_paid) || !Number.isInteger(amount_paid) || amount_paid <= 0) {
        return { error: 'Payment amount must be a positive integer.' };
    }

    const { data, error } = await supabase.rpc('process_bill_payment', {
        p_bill_id: bill_id,
        p_amount_paid: amount_paid
    });

    if (error) {
        console.error('Error calling process_bill_payment:', error);
        return { error: 'Failed to process payment. Please try again later.' };
    }

    // The RPC returns a JSON object like { error: '...' } or { success: true }
    if (data && typeof data === 'object' && 'error' in (data as any)) {
        return { error: (data as any).error };
    }

    revalidatePath('/bills');
    return { success: true };
}

export async function sendWhatsAppReminder(billId: string) {
    const supabase = await createClient();

    // Fetch bill and tenant details
    const { data: bill } = await supabase
        .from('bills')
        .select('*, tenants(name, phone_number)')
        .eq('id', billId)
        .single();

    if (!bill) return { error: 'Bill not found' };

    const tenant = bill.tenants as any;
    const phone = tenant.phone_number;

    const payload = {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
            name: 'payment_reminder',
            language: { code: 'en_US' },
            components: [
                {
                    type: 'body',
                    parameters: [
                        { type: 'text', text: tenant.name },
                        { type: 'text', text: bill.bill_type },
                        { type: 'text', text: formatRupees(bill.amount_due) },

                        {
                            type: 'text',
                            text: new Date(bill.due_date).toLocaleDateString(),
                        },
                    ],
                },
            ],
        },
    };

    // Mocking the request as requested by the user
    console.log('--- WHATSAPP MOCK API REQUEST ---');
    console.log(
        `Endpoint: https://graph.facebook.com/v20.0/WHATSAPP_PHONE_NUMBER_ID/messages`,
    );
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('-----------------------------------');

    // Artificial delay to simulate network request
    await new Promise((resolve) => setTimeout(resolve, 800));

    return { success: true };
}

export async function editBill(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } = await supabase.auth.getClaims();
    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const id = formData.get('id');
    if (typeof id !== 'string' || id.trim().length === 0) {
        return { error: 'Bill ID is required.' };
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

    if (formData.has('bill_type')) {
        const typeRaw = formData.get('bill_type');
        if (typeof typeRaw !== 'string' || !['Electricity', 'Gas', 'Water'].includes(typeRaw.trim())) {
            return { error: 'Invalid bill type. Must be Electricity, Gas, or Water.' };
        }
        updateData.bill_type = typeRaw.trim();
    }

    if (formData.has('billing_month')) {
        const monthRaw = formData.get('billing_month');
        if (typeof monthRaw !== 'string' || !/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/.test(monthRaw.trim())) {
            return { error: 'Billing month must be in MMM-YYYY format (e.g., May-2026).' };
        }
        updateData.billing_month = monthRaw.trim();
    }

    if (Object.keys(updateData).length > 0) {
        const { data, error } = await supabase.rpc('edit_bill', {
            p_bill_id: id,
            p_update_data: updateData
        });

        if (error) {
            console.error('Error editing bill:', error);
            return { error: 'Failed to update bill. Please try again later.' };
        }
        
        if (data && typeof data === 'object' && 'error' in (data as any)) {
            return { error: (data as any).error };
        }
    }

    revalidatePath('/bills');
    return { success: true };
}

export async function deleteBillPayment(paymentId: string) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } = await supabase.auth.getClaims();
    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const { data, error } = await supabase.rpc('delete_bill_payment', {
        p_payment_id: paymentId,
    });

    if (error) {
        console.error('Error deleting bill payment:', error);
        return { error: 'Failed to delete payment. Please try again later.' };
    }

    if (data && typeof data === 'object' && 'error' in (data as any)) {
        return { error: (data as any).error };
    }

    revalidatePath('/bills');
    return { success: true };
}
