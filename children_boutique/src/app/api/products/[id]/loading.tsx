// src/app/products/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
        
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
          </div>
          
          <div className="md:w-1/2 p-8">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            
            <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
            
            <div className="space-y-3 mb-8">
              <div className="h-4 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
            
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}