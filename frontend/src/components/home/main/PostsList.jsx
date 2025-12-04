import PostCard from './PostCard';
import { FiInbox, FiCheckCircle } from 'react-icons/fi';

export default function PostsList({ posts, isLoading, isLoadingMore, hasMore, loadMoreRef }) {
  if (isLoading) {
    return (
      <div className="text-center rounded-xl bg-white border border-gray-200 p-12 lg:p-16">
        <span className="loading loading-spinner loading-lg text-custom-blue"></span>
        <p className="text-gray-600 text-sm lg:text-lg mt-4">
          Loading surveys...
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
        <PostCard key={post.pk_survey_id} post={post} />
      ))}
      
      {/* Load More Trigger / Loading Indicator */}
      <div ref={loadMoreRef} className="min-h-[20px] mt-4">
        {isLoadingMore && (
          <div className="text-center rounded-xl bg-white border border-gray-200 p-6 lg:p-8">
            <span className="loading loading-spinner loading-md text-custom-blue"></span>
            <p className="text-gray-600 text-xs lg:text-sm mt-2">
              Loading more surveys...
            </p>
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
