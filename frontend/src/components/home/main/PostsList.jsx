import { lazy, Suspense } from 'react';
import { FiInbox, FiCheckCircle, FiWifiOff } from 'react-icons/fi';

const PostCard = lazy(() => import('./PostCard'));

const PostSkeleton = () => (
  <div className="rounded-xl shadow-sm bg-white border border-gray-200 p-5 lg:p-7 mb-4 lg:mb-5">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-start gap-3 flex-1">
        <div className="skeleton w-10 h-10 lg:w-12 lg:h-12 rounded-full shrink-0"></div>
        <div className="flex-1">
          <div className="skeleton h-4 w-32 mb-2"></div>
          <div className="skeleton h-3 w-24"></div>
        </div>
      </div>
    </div>
    <div className="mb-4 lg:mb-5">
      <div className="skeleton h-4 w-3/4 mb-2"></div>
      <div className="skeleton h-4 w-1/2 mb-4"></div>
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full"></div>
        <div className="skeleton h-6 w-16 rounded-full"></div>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex gap-4">
         <div className="skeleton h-4 w-20"></div>
         <div className="skeleton h-4 w-20"></div>
      </div>
      <div className="flex gap-2">
         <div className="skeleton h-8 w-8 rounded-lg"></div>
         <div className="skeleton h-8 w-24 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default function PostsList({ posts, isLoading, isLoadingMore, hasMore, loadMoreRef, error }) {
  if (isLoading) {
    return (
      <div>
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center rounded-xl bg-white border border-gray-200 p-12 lg:p-16">
        <div className="text-6xl lg:text-7xl mb-4 lg:mb-6 text-red-500 opacity-50 flex justify-center">
          <FiWifiOff />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Network Error</h3>
        <p className="text-gray-600 text-sm lg:text-lg">
          Unable to connect to the server. Please check your internet connection or try again later.
        </p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center rounded-xl bg-white border border-gray-200 p-12 lg:p-16">
        <div className="text-6xl lg:text-7xl mb-4 lg:mb-6 opacity-30 flex justify-center">
          <FiInbox />
        </div>
        <p className="text-gray-600 text-sm lg:text-lg">
          No surveys found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <Suspense key={post.pk_survey_id} fallback={<PostSkeleton />}>
          <PostCard post={post} />
        </Suspense>
      ))}
      
      {/* Load More Trigger / Loading Indicator */}
      <div ref={loadMoreRef} className="min-h-[20px] mt-4">
        {isLoadingMore && (
          <div>
             <PostSkeleton />
          </div>
        )}
        
        {!hasMore && posts.length > 0 && !isLoadingMore && (
          <div className="text-center p-4 lg:p-6 text-gray-600 text-xs lg:text-sm flex items-center justify-center gap-2">
            <FiCheckCircle className="text-custom-green" />
            You've reached the end of the surveys
          </div>
        )}
      </div>
    </div>
  );
}
