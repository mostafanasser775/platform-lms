export default function Loading() {
    return (
        <div>
            {/* Page Header Skeleton */}
            <div className="flex justify-between items-center mb-4 animate-pulse">
                <div className="h-8 w-48 bg-gray-300 rounded"></div>
                <div className="h-10 w-32 bg-gray-300 rounded"></div>
            </div>
            <hr className="my-4" />

            {/* Table Skeleton */}
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-100 animate-pulse">
                        <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-8 bg-gray-300 rounded w-24"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
