/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/server';
import { RentClient } from './RentClient';

export default async function RentPage() {
    const supabase = await createClient();

    const query = supabase
        .from('rent_cycles')
        .select(`*, rent_payments(amount_paid), tenants(name, phone_number, properties(name))`)
        .order('due_date', { ascending: false });

    const { data: rentCycles } = await query;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Rent Tracking
                </h2>
                <p className="text-slate-500 mt-2">
                    Track all rent dues and payments across your properties.
                </p>
            </div>

            <RentClient rentCycles={rentCycles || []} />
        </div>
    );
}
