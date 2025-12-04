import PostCard from './PostCard';

export default function PostsList({ posts, isLoading, isLoadingMore, hasMore, loadMoreRef }) {
  if (isLoading) {
    return (
      <div 
        className="text-center rounded-xl"
        style={{
          padding: 'clamp(3rem, 5vw, 4rem)',
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-shade-primary)'
        }}
      >
        <span className="loading loading-spinner loading-lg"></span>
        <p 
          style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
            marginTop: '1rem'
          }}
        >
          Loading surveys...
        </p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div 
        className="text-center rounded-xl"
        style={{
          padding: 'clamp(3rem, 5vw, 4rem)',
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-shade-primary)'
        }}
      >
        <div 
          style={{ 
            fontSize: 'clamp(3rem, 5vw, 4rem)',
            marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
            opacity: 0.3
          }}
        >
          📭
        </div>
        <p 
          style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)'
          }}
        >
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
      <div ref={loadMoreRef} style={{ minHeight: '20px', marginTop: '1rem' }}>
        {isLoadingMore && (
          <div 
            className="text-center rounded-xl"
            style={{
              padding: 'clamp(1.5rem, 2.5vw, 2rem)',
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-shade-primary)'
            }}
          >
            <span className="loading loading-spinner loading-md"></span>
            <p 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)',
                marginTop: '0.5rem'
              }}
            >
              Loading more surveys...
            </p>
          </div>
        )}
        
        {!hasMore && posts.length > 0 && !isLoadingMore && (
          <div 
            className="text-center"
            style={{
              padding: 'clamp(1rem, 2vw, 1.5rem)',
              color: 'var(--color-text-secondary)',
              fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'
            }}
          >
            You've reached the end of the surveys 🎉
          </div>
        )}
      </div>
    </div>
  );
}
