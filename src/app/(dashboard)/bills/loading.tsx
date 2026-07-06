export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Title & Subtitle */}
            <div>
                <div className="h-9 bg-slate-200 rounded-md w-32" />
                <div className="h-4 bg-slate-200 rounded-md w-96 mt-2" />
            </div>

            {/* Filters Skeleton */}
            {/*<div className="flex gap-4 mb-6">
                <div>
                    <div className="h-4 bg-slate-200 rounded w-12 mb-1" />
                    <div className="h-10 bg-slate-200 rounded-md w-36" />
                </div>
                <div>
                    <div className="h-4 bg-slate-200 rounded w-24 mb-1" />
                    <div className="h-10 bg-slate-200 rounded-md w-36" />
                </div>
            </div>*/}

            {/* Data Grid Table Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Tenant</th>
                                <th className="px-6 py-3 font-medium">Property</th>
                                <th className="px-6 py-3 font-medium">Bill Type</th>
                                <th className="px-6 py-3 font-medium">Period</th>
                                <th className="px-6 py-3 font-medium">Amount Due</th>
                                <th className="px-6 py-3 font-medium">Remaining</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {[1, 2, 3, 4, 5].map((row) => (
                                <tr key={row}>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-slate-200 rounded w-28" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-slate-200 rounded w-32" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-slate-200 rounded w-20" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-slate-200 rounded w-24" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-slate-200 rounded w-16" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-slate-200 rounded w-16 font-semibold" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-6 bg-slate-200 rounded-full w-16" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
