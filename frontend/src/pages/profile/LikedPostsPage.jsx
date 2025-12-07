import React, { useEffect, useState } from 'react';
import { getLikedPosts } from '../../services/survey/survey.service';
import PostCard from '../../components/home/main/PostCard';
import { MdFavorite } from 'react-icons/md';

const LikedPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLikedPosts();
  }, []);

  const fetchLikedPosts = async () => {
    setIsLoading(true);
    try {
      const response = await getLikedPosts();
      if (response.ok) {
        setPosts(response.message || []);
      }
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-custom-blue"></span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdFavorite className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No liked posts</h3>
          <p className="text-gray-500 mt-1">Posts you like will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard 
              key={post.pk_survey_id} 
              post={post}
              onArchive={fetchLikedPosts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedPostsPage;
