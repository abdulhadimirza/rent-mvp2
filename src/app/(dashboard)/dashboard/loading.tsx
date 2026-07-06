export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Title & Subtitle */}
            <div>
                <div className="h-9 bg-slate-200 rounded-md w-48" />
                <div className="h-4 bg-slate-200 rounded-md w-80 mt-2" />
            </div>

            {/* Quick Actions Panel */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="h-10 bg-slate-200 rounded-md w-36" />
                <div className="h-10 bg-slate-200 rounded-md w-36" />
                <div className="h-10 bg-slate-200 rounded-md w-36" />
                <div className="h-10 bg-slate-200 rounded-md w-36" />
            </div>

            {/* KPI Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                        <div className="flex flex-row items-center justify-between pb-2">
                            <div className="h-4 bg-slate-200 rounded w-28" />
                            <div className="h-4 w-4 bg-slate-200 rounded" />
                        </div>
                        <div className="h-8 bg-slate-200 rounded w-32 mt-1" />
                        <div className="h-3 bg-slate-200 rounded w-44 mt-2" />
                    </div>
                ))}
            </div>

            {/* Lower Split Screen */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Outstanding Payments Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <div className="h-6 bg-slate-200 rounded w-48" />
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Type</th>
                                    <th className="px-6 py-3 font-medium">Tenant & Property</th>
                                    <th className="px-6 py-3 font-medium">Due Date</th>
                                    <th className="px-6 py-3 font-medium">Balance</th>
                                    <th className="px-6 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {[1, 2, 3].map((row) => (
                                    <tr key={row}>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-slate-200 rounded w-16" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="h-4 bg-slate-200 rounded w-32" />
                                                <div className="h-3 bg-slate-200 rounded w-24" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-slate-200 rounded w-20" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-slate-200 rounded w-24" />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="h-4 bg-slate-200 rounded w-16 ml-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                        <div className="w-5 h-5 bg-slate-200 rounded-full" />
                        <div className="h-6 bg-slate-200 rounded w-32" />
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="px-6 py-4">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="h-4 bg-slate-200 rounded w-28" />
                                    <div className="h-4 bg-slate-200 rounded w-16" />
                                </div>
                                <div className="flex justify-between items-center text-xs mt-2">
                                    <div className="h-3 bg-slate-200 rounded w-16" />
                                    <div className="h-3 bg-slate-200 rounded w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
