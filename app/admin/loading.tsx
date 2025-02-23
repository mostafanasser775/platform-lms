// app/components/DashboardLandingSkeleton.tsx (Server Component)
export default function DashboardLandingSkeleton() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 shadow border rounded-md p-4 animate-pulse bg-white">
            <div>
              <div className="h-6 w-40 bg-gray-300 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded mt-2"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-40 bg-gray-200 rounded"></div>
              <div className="h-10 w-24 bg-gray-300 rounded"></div>
            </div>
          </div>
  
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Financial Overview Skeleton */}
            <div className="col-span-full xl:col-span-2 shadow border rounded-md p-4 bg-white animate-pulse">
              <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
  
            {/* Purchase Metrics Skeleton */}
            <div className="col-span-full xl:col-span-3 shadow border rounded-md p-4 bg-white animate-pulse">
              <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
  
            {/* Platform Stats Skeleton */}
            <div className="col-span-full shadow border rounded-md p-4 bg-white animate-pulse">
              <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
  
          {/* Tables Placeholder */}
          <div className="col-span-full shadow border rounded-md p-4 bg-white animate-pulse mt-6">
            <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  