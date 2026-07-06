export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Title & Subtitle */}
            <div>
                <div className="h-9 bg-slate-200 rounded-md w-36" />
                <div className="h-4 bg-slate-200 rounded-md w-80 mt-2" />
            </div>

            {/* Grid layout with Upload Zone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border-2 border-dashed border-slate-200 rounded-xl bg-white p-10 flex flex-col items-center justify-center text-center h-64">
                    <div className="h-12 w-12 bg-slate-200 rounded-full mb-4" />
                    <div className="h-4 bg-slate-200 rounded w-48 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-64" />
                </div>
            </div>
        </div>
    );
}
