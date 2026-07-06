import { createClient } from '@/lib/server';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
    const supabase = await createClient();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: dashboardData, error } = await supabase.rpc('get_dashboard_data', {
        p_start_of_month: startOfMonth.toISOString()
    });

    if (error) {
        console.error('Failed to fetch dashboard data:', error);
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Dashboard
                </h2>
                <p className="text-slate-500 mt-2">
                    Overview of your properties and collections.
                </p>
            </div>

            <DashboardClient data={dashboardData} />
        </div>
    );
}
