/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import { formatRupees } from '@/lib/utils';
import { processBillPaymentSchema, editBillSchema } from '@/lib/schemas';

export async function processPayment(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
        await supabase.auth.getClaims();

    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const parsed = processBillPaymentSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }
    const { bill_id, amount_paid } = parsed.data;

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

    const parsed = editBillSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }
    const { id, ...updateDataRaw } = parsed.data;

    // Filter out undefined values from updateData
    const updateData = Object.fromEntries(
        Object.entries(updateDataRaw).filter(([, v]) => v !== undefined)
    );

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
