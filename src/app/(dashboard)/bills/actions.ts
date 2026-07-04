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

    // Fetch bill details, payments, and tenant/property to verify landlord ownership
    const { data: bill, error: billFetchError } = await supabase
        .from('bills')
        .select(`
            id,
            amount_due,
            status,
            payments (
                amount_paid
            ),
            tenants (
                id,
                property_id,
                properties (
                    id,
                    landlord_id
                )
            )
        `)
        .eq('id', bill_id)
        .single();

    if (billFetchError || !bill) {
        console.error('Error fetching bill details:', billFetchError);
        return { error: 'Bill not found or query failed.' };
    }

    // Verify landlord ownership
    const landlordId = (bill.tenants as any)?.properties?.landlord_id;
    if (landlordId !== userId) {
        return { error: 'Not authorized to record payment for this bill.' };
    }

    // Calculate existing payments
    const existingPaid = (bill.payments as any[] || []).reduce(
        (acc: number, p: any) => acc + Number(p.amount_paid),
        0
    );

    const balance = Number(bill.amount_due) - existingPaid;

    if (amount_paid > balance) {
        return { error: `Payment amount (${amount_paid}) cannot exceed the remaining balance (${balance}).` };
    }

    // Insert Payment
    const { error: paymentError } = await supabase.from('payments').insert({
        bill_id,
        amount_paid,
    });

    if (paymentError) return { error: paymentError.message };

    // Calculate the new status dynamically on the server
    const totalPaidAfterThisPayment = existingPaid + amount_paid;
    let calculatedStatus = 'unpaid';
    if (totalPaidAfterThisPayment >= Number(bill.amount_due)) {
        calculatedStatus = 'paid';
    } else if (totalPaidAfterThisPayment > 0) {
        calculatedStatus = 'partial';
    }

    // Update Bill Status
    const { error: billError } = await supabase
        .from('bills')
        .update({ status: calculatedStatus })
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
