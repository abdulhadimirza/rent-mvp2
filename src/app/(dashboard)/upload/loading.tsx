export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Title & Subtitle */}
            <div>
                <div className="h-9 bg-slate-200 rounded-md w-36" />
                <div className="h-4 bg-slate-200 rounded-md w-80 mt-2" />
            </div>

            {/* Grid layout with Upload Zone and Guidelines Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Guidelines Card Skeleton */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-8 flex flex-col justify-between h-[320px]">
                    <div className="space-y-6">
                        <div className="h-5 bg-slate-200 rounded w-40" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="h-5 w-5 bg-slate-200 rounded-full shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-slate-200 rounded w-24" />
                                        <div className="h-3 bg-slate-200 rounded w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mt-auto" />
                </div>

                {/* Upload Zone Skeleton */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-white p-10 flex flex-col items-center justify-center text-center h-[320px]">
                    <div className="h-12 w-12 bg-slate-200 rounded-full mb-4" />
                    <div className="h-4 bg-slate-200 rounded w-48 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-64" />
                </div>
            </div>
        </div>
    );
}
