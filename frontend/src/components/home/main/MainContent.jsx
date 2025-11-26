import { useState, useEffect } from 'react';
import CreatePostBar from './CreatePostBar';
import CategoryFilter from './CategoryFilter';
import PostsList from './PostsList';
import { getAllSurvey } from '../../../services/survey/survey.services';
// import { postsData } from '../../../static/postsData.js';

export default function MainContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSurvey();
      // Extract the message array from the API response
      setPosts(data?.message ?? []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    console.log('Create new research study clicked');
    // Navigate to survey creator or open modal
  };

  // Filter posts based on search and category
  const filteredPosts = (posts || []).filter((post) => {
    const matchesSearch = 
      post.survey_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.survey_category?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      activeCategory === 'all' || 
      post.survey_category?.some(cat => cat.toLowerCase() === activeCategory.toLowerCase());

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
