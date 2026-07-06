import { createClient } from '@/lib/server';
import { BillsClient } from './BillsClient';

export default async function BillsPage(props: {
    searchParams: Promise<{ status?: string; month?: string }>;
}) {
    const searchParams = await props.searchParams;
    const supabase = await createClient();

    let query = supabase
        .from('bills')
        .select(`*, bill_payments(id, amount_paid, payment_date, created_at), tenants(name, phone_number, properties(name))`)
        .order('due_date', { ascending: false });

    if (searchParams.status && searchParams.status !== 'all') {
        query = query.eq('status', searchParams.status);
    }
    if (searchParams.month && searchParams.month !== 'all') {
        query = query.eq('billing_month', searchParams.month);
    }

    const { data: bills } = await query;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Bills
                </h2>
                <p className="text-slate-500 mt-2">
                    Track all electricity, water, and gas bills across your properties.
                </p>
            </div>

            <BillsClient bills={bills || []} />
        </div>
    );
}
