import { useState, useEffect } from 'react';
import CreatePostBar from './CreatePostBar';
import CategoryFilter from './CategoryFilter';
import PostsList from './PostsList';
import { getAllSurvey } from '../../../services/survey/survey.service';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../../context/SearchProvider';
// import { postsData } from '../../../static/postsData.js';

export default function MainContent() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { searchResults, isSearching, searchQuery } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSurvey();
      // Normalize the API response into an array of posts
      const normalizePosts = (message) => {
        if (!message) return [];
        if (Array.isArray(message)) return message;
        if (typeof message === 'object') {
          if (Array.isArray(message.message)) return message.message;
          return Object.values(message);
        }
        return [];
      };

      setPosts(normalizePosts(data?.message));
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div 
      className=""
      style={{
        backgroundColor: 'var(--color-background)',
        padding: 'clamp(1.5rem, 2.5vw, 2.5rem)',
        overflowY: 'auto',
        minHeight: '100vh'
      }}
    >
      <div 
        style={{ 
          maxWidth: 'clamp(600px, 70vw, 900px)',
          margin: '0 auto'
        }}
      >
        {/* Search Results Indicator */}
        {searchQuery && (
          <div 
            className="mb-4 p-3 rounded-lg"
            style={{
              backgroundColor: 'var(--color-secondary-background)',
              border: '1px solid var(--color-shade-primary)',
            }}
          >
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(0.8rem, 1.25vw, 0.9rem)' }}>
              {isSearching ? (
                'Searching...'
              ) : (
                <>
                  Showing results for "<strong style={{ color: 'var(--color-primary-color)' }}>{searchQuery}</strong>" 
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
        <PostsList posts={filteredPosts} isLoading={isLoading || isSearching} />
      </div>
    </div>
  );
}
