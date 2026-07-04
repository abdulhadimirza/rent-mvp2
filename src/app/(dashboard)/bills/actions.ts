'use server';

import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import { formatRupees } from '@/lib/utils';

export async function processPayment(formData: FormData) {
    const supabase = await createClient();

    const { data: claimsData, error: authError } =
        await supabase.auth.getClaims();

    if (authError || !claimsData?.claims) return { error: 'Not authenticated' };

    const userId = claimsData.claims.sub;

    const bill_id = formData.get('bill_id') as string;
    const amount_paid = Number(formData.get('amount_paid'));
    const status = formData.get('status') as string;

    // Insert Payment
    const { error: paymentError } = await supabase.from('payments').insert({
        bill_id,
        amount_paid,
    });

    if (paymentError) return { error: paymentError.message };

    // Update Bill Status
    const { error: billError } = await supabase
        .from('bills')
        .update({ status })
        .eq('id', bill_id);

    if (billError) return { error: billError.message };

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
