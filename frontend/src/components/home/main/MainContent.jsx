import { useState } from 'react';
import SearchBar from './SearchBar';
import CreatePostBar from './CreatePostBar';
import CategoryFilter from './CategoryFilter';
import PostsList from './PostsList';
import { postsData } from '../../../static/postsData.js';

export default function MainContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCreateClick = () => {
    console.log('Create new research study clicked');
    // Navigate to survey creator or open modal
  };

  // Filter posts based on search and category
  const filteredPosts = postsData.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      activeCategory === 'all' || 
      post.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="flex-1"
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
        <PostsList posts={filteredPosts} />
      </div>
    </div>
  );
}
