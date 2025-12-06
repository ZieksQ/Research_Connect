import React, { useEffect, useState } from 'react';
import { getRejectedPosts } from '../../services/survey/survey.service';
import { MdAccessTime, MdPeople, MdInfo } from 'react-icons/md';

const RejectedPostCard = ({ post }) => {
  const [showReasonModal, setShowReasonModal] = useState(false);

  const handleReasonClick = () => {
    setShowReasonModal(true);
  };

  return (
    <>
      <div className="rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white border border-gray-200 p-5 lg:p-7 mb-4 lg:mb-5">
        {/* Header with Avatar, User Info - No Menu */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            {/* Avatar */}
            <div className="avatar">
              <div className="rounded-full w-10 h-10 lg:w-12 lg:h-12">
                <img src={post.user_profile} alt={post.user_username} />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-gray-900 text-sm lg:text-lg font-semibold">
                  {post.user_username}
                </h3>
                {/* Status Badge */}
                {post.status && (
                  <span 
                    className={`badge badge-sm text-white border-none text-[10px] lg:text-xs capitalize ${
                      post.status === 'approved' ? 'bg-custom-green' : 
                      post.status === 'pending' ? 'bg-yellow-500' : 
                      post.status === 'rejected' ? 'bg-red-600' : 'bg-gray-500'
                    }`}
                  >
                    {post.status}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-[11px] lg:text-[13px] uppercase tracking-wide mt-1">
                {post.user_program || 'None'}
              </p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4 lg:mb-5">
          <p className="text-gray-900 text-sm lg:text-base leading-relaxed mb-2 lg:mb-3 font-medium">
            {post.survey_title}
          </p>

          {/* Survey Content */}
          {post.survey_content && (
            <p className="text-gray-600 text-xs lg:text-sm leading-relaxed mb-3 lg:mb-4">
              {post.survey_content}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.survey_category?.map((tag, index) => (
              <div
                key={index}
                className="badge badge-sm bg-gray-100 text-custom-blue border-none text-[11px] lg:text-[13px] px-2.5 py-2 font-medium"
              >
                #{tag}
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Time, Audience, and Button */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Time Approx */}
            <div className="flex items-center gap-1">
              <MdAccessTime className="text-base lg:text-lg text-custom-green" />
              <span className="text-gray-500 text-xs lg:text-sm">
                {new Date(post.survey_date_created).toLocaleDateString()}
              </span>
            </div>

            {/* Target Audience */}
            <div className="flex items-center gap-1">
              <MdPeople className="text-base lg:text-lg text-custom-blue shrink-0" />
              <div className="tooltip" data-tip={post.survey_target_audience?.join(', ')}>
                <span 
                  className="text-gray-500 text-xs lg:text-sm block max-w-[150px] truncate text-left"
                >
                  {post.survey_target_audience?.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Reject Reason Button */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleReasonClick}
              className="btn btn-sm bg-red-600 border-red-600 text-white text-xs lg:text-sm px-4 lg:px-6 font-semibold h-auto min-h-[2rem] lg:min-h-[2.5rem] rounded-lg hover:bg-red-700 hover:border-red-700 flex items-center gap-2"
            >
              <MdInfo className="text-lg" />
              Reject Reason
            </button>
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdInfo className="text-3xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Rejection Reason</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {post.rejection_msg || 'No rejection reason provided.'}
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowReasonModal(false)}
                  className="btn bg-custom-blue hover:bg-blue-700 text-white border-none px-6"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const RejectedPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRejectedPosts();
  }, []);

  const fetchRejectedPosts = async () => {
    setIsLoading(true);
    try {
      const response = await getRejectedPosts();
      if (response.ok) {
        setPosts(response.message || []);
      }
    } catch (error) {
      console.error("Error fetching rejected posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-margin mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rejected Posts</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-custom-blue"></span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdInfo className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No rejected posts</h3>
          <p className="text-gray-500 mt-1">Posts that are rejected will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <RejectedPostCard 
              key={post.pk_survey_id} 
              post={post} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RejectedPage;
