import React from 'react';

/**
 * Loading skeleton for portfolio gallery
 * Shows placeholder cards while images are loading
 */
export const GalleryLoadingSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="relative"
          style={{
            animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
          }}
        >
          {/* Gold frame with shadow */}
          <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-1 rounded-lg border-2 border-amber-500/30">
            <div className="bg-black p-4 pb-20 rounded-lg relative overflow-hidden">
              {/* Image skeleton */}
              <div className="relative aspect-[4/5] overflow-hidden rounded">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse" />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* Caption area skeleton */}
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                {/* Title skeleton */}
                <div className="h-6 bg-gray-800 rounded-md animate-pulse w-3/4" />
                
                {/* Category skeleton */}
                <div className="h-4 bg-gray-800 rounded-md animate-pulse w-1/2" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Loading skeleton for category filter buttons
 */
export const CategoryLoadingSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="h-12 w-32 bg-gray-800/50 rounded-full animate-pulse"
        />
      ))}
    </div>
  );
};

/**
 * Minimal loading indicator for quick transitions
 */
export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-12 h-12 border-4 border-amber-500/20 rounded-full" />
          
          {/* Spinning ring */}
          <div className="absolute inset-0 w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
        
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
};

// Add this to your global CSS or tailwind.config.js
export const skeletonStyles = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

export default GalleryLoadingSkeleton;
