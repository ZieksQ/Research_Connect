import { useState, useEffect } from 'react';
import CreatePostBar from './CreatePostBar';
import CategoryFilter from './CategoryFilter';
import PostsList from './PostsList';
import { getAllSurvey } from '../../../services/survey/survey.service';
import { useNavigate } from 'react-router-dom';
// import { postsData } from '../../../static/postsData.js';

export default function MainContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Filter posts based on search and category
  const filteredPosts = (Array.isArray(posts) ? posts : []).filter((post) => {
    const title = post?.survey_title || '';
    const username = post?.user_username || '';
    const categories = Array.isArray(post?.survey_category) ? post.survey_category : [];

    const q = searchQuery || '';
    const matchesSearch =
      title.toLowerCase().includes(q.toLowerCase()) ||
      username.toLowerCase().includes(q.toLowerCase()) ||
      categories.some((tag) => String(tag).toLowerCase().includes(q.toLowerCase()));

    const matchesCategory =
      activeCategory === 'all' ||
      categories.some((cat) => String(cat).toLowerCase() === activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
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
        {/* Search Bar */}
        {/* <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter Surveys"
        /> */}

        {/* Create Post Bar */}
        <CreatePostBar onCreateClick={handleCreateClick} />

        {/* Category Filter */}
        <CategoryFilter 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Posts List */}
        {/* - for filtering post */}
        <PostsList posts={filteredPosts} isLoading={isLoading} />
      </div>
    </div>
  );
}
