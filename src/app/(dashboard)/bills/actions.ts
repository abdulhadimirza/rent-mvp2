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
