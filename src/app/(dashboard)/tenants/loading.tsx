export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Title & Subtitle */}
            <div>
                <div className="h-9 bg-slate-200 rounded-md w-56" />
                <div className="h-4 bg-slate-200 rounded-md w-80 mt-2" />
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="h-10 bg-slate-200 rounded-md w-44" />
                <div className="h-10 bg-slate-200 rounded-md w-32" />
                <div className="h-10 bg-slate-200 rounded-md w-28" />
                <div className="h-10 bg-slate-200 rounded-md w-32" />
                <div className="h-10 bg-slate-200 rounded-md w-28" />
            </div>

            {/* Grid of Property Cards */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        {/* Card Header */}
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                            <div className="space-y-2 w-full">
                                <div className="h-5 bg-slate-200 rounded w-1/3" />
                                <div className="h-4 bg-slate-200 rounded w-2/3" />
                            </div>
                        </div>

                        {/* Card Body (Tenants List) */}
                        <div className="p-0 divide-y divide-slate-100">
                            {[1, 2].map((tenant) => (
                                <div
                                    key={tenant}
                                    className="px-6 py-4 flex justify-between items-center"
                                >
                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-32" />
                                        <div className="h-3 bg-slate-200 rounded w-24" />
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-16 ml-auto" />
                                        <div className="h-3 bg-slate-200 rounded w-20 ml-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
