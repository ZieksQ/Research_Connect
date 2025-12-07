import { useState, useEffect, useRef, useCallback } from 'react';
import CreatePostBar from './CreatePostBar';
import CategoryFilter from './CategoryFilter';
import PostsList from './PostsList';
import { getPaginationSurvey } from '../../../services/survey/survey.service';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../../context/SearchProvider';
// import { postsData } from '../../../static/postsData.js';

const POSTS_PER_PAGE = 10;

export default function MainContent() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  
  const { searchResults, isSearching, searchQuery } = useSearch();
  const navigate = useNavigate();
  
  // Ref for intersection observer
  const observerRef = useRef();
  const loadMoreRef = useRef(null);

  // Initial fetch
  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    // Don't observe if we're searching or no more posts
    if (searchResults !== null || !hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, isLoading, searchResults, page]);

  const normalizePosts = (message) => {
    if (!message) return [];
    if (Array.isArray(message)) return message;
    if (typeof message === 'object') {
      if (Array.isArray(message.message)) return message.message;
      return Object.values(message);
    }
    return [];
  };

  const fetchPosts = async (pageNum = 1, isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
      setError(null);
    }
    try {
      const data = await getPaginationSurvey(pageNum, POSTS_PER_PAGE);
      const newPosts = normalizePosts(data?.message);
      
      if (isInitial) {
        setPosts(newPosts);
        setPage(1);
      }
      
      // Check if there are more posts to load
      if (newPosts.length < POSTS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (isInitial) {
        setPosts([]);
        setError(error);
      }
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const data = await getPaginationSurvey(nextPage, POSTS_PER_PAGE);
      const newPosts = normalizePosts(data?.message);
      
      if (newPosts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setPage(nextPage);
      }
      
      // Check if there are more posts to load
      if (newPosts.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, isLoadingMore, hasMore]);

  const handleCreateClick = () => {
    navigate("/form/new");
  };

  // Determine which posts to display - search results or all posts
  const displayPosts = searchResults !== null ? searchResults : posts;

  // Filter posts based on category only (search is handled by API)
  const filteredPosts = (Array.isArray(displayPosts) ? displayPosts : []).filter((post) => {
    const categories = Array.isArray(post?.survey_category) ? post.survey_category : [];

    const matchesCategory =
      activeCategory === 'all' ||
      categories.some((cat) => String(cat).toLowerCase() === activeCategory.toLowerCase());

    return matchesCategory;
  });

  return (
    <div className="bg-background p-6 lg:p-10 min-h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="mb-4 p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm">
              {isSearching ? (
                'Searching...'
              ) : (
                <>
                  Showing results for "<strong className="text-custom-blue">{searchQuery}</strong>" 
                  <span className="ml-2">({filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'})</span>
                </>
              )}
            </p>
          </div>
        )}

        {/* Create Post Bar */}
        <CreatePostBar onCreateClick={handleCreateClick} />

        {/* Category Filter */}
        <CategoryFilter 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Posts List */}
        <PostsList 
          posts={filteredPosts} 
          isLoading={isLoading || isSearching}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore && searchResults === null}
          loadMoreRef={loadMoreRef}
          error={error}
          onRefresh={() => fetchPosts(1, true)}
        />
      </div>
    </div>
  );
}
