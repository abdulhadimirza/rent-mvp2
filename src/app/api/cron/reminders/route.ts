import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWhatsappReminder } from '@/lib/whatsapp';

export async function GET(request: Request) {
    // Validate Vercel Cron Secret
    const authHeader = request.headers.get('Authorization');

    if (
        process.env.NODE_ENV === 'production' &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
        return NextResponse.json(
            { error: 'Supabase credentials missing' },
            { status: 500 }
        );
    }

    // Use secret key to bypass RLS and read all tenants/landlords
    const supabase = createClient(
        supabaseUrl,
        supabaseSecretKey,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        }
    );

    // Calculate target dates
    const today = new Date();
    const dateToday = today.toISOString().split('T')[0];

    const datePlus3 = new Date(today);
    datePlus3.setDate(today.getDate() + 3);
    const dateStrPlus3 = datePlus3.toISOString().split('T')[0];

    const datePlus7 = new Date(today);
    datePlus7.setDate(today.getDate() + 7);
    const dateStrPlus7 = datePlus7.toISOString().split('T')[0];

    const targetDates = [dateToday, dateStrPlus3, dateStrPlus7];

    try {
        // Fetch pending reminders using RPC
        const { data: pendingReminders, error: rpcError } = await supabase
            .rpc('get_pending_reminders', {
                p_target_dates: targetDates
            });

        if (rpcError) throw rpcError;

        if (!pendingReminders || pendingReminders.length === 0) {
            return NextResponse.json({ message: 'No reminders to send today.' });
        }

        // Process each reminder and send message
        const sentReminders = [];
        const remindersToInsert = [];

        for (const pr of pendingReminders) {
            const tenantName = pr.tenant_name;
            const tenantPhoneNumber = pr.tenant_phone_number;
            const reminderType = pr.reminder_type;
            const tenantBills = pr.bills || [];

            // Construct WhatsApp message
            let message = `Hi ${tenantName},\n\nThis is a friendly reminder that your rent for ${pr.billing_month} of amount $${pr.amount_due} is due on ${pr.due_date}.\n`;

            if (tenantBills.length > 0) {
                message += `\nAdditionally, you have the following utility bills due:\n`;
                tenantBills.forEach((b: any) => {
                    message += `- ${b.bill_type}: $${b.amount_due}\n`;
                });
            }

            message += `\nPlease ensure your payments are made on time. Thank you!`;

            // Send the mock WhatsApp message
            if (tenantPhoneNumber) {
                await sendWhatsappReminder(tenantPhoneNumber, message);

                remindersToInsert.push({
                    tenant_id: pr.tenant_id,
                    rent_cycle_id: pr.rent_cycle_id,
                    reminder_type: reminderType,
                });

                sentReminders.push({ tenantId: pr.tenant_id, rentCycleId: pr.rent_cycle_id, type: reminderType });
            } else {
                console.warn(`Tenant ${tenantName} has no phone number.`);
            }
        }

        // Batch insert successfully sent reminders into the database
        if (remindersToInsert.length > 0) {
            const { error: insertError } = await supabase
                .from('reminders_sent')
                .insert(remindersToInsert);

            if (insertError) {
                console.error(`Failed to batch log sent reminders:`, insertError);
            }
        }

        return NextResponse.json({
            message: 'Reminders processed successfully',
            sentCount: sentReminders.length,
            details: sentReminders,
        });

    } catch (error: any) {
        console.error('Error processing reminders:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
