import React from 'react';
import { FaUser, FaCalendar, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PendingPostCard = ({ post, onApprove, onReject }) => {
  const navigate = useNavigate();

  const handleReview = () => {
    navigate(`/admin/request/review/${post.pk_survey_id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200">
      <div className="card-body">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar placeholder">
            <div className="bg-custom-blue text-white rounded-full w-10 h-10">
              {post.user_profile ? (
                <img src={post.user_profile} alt={post.user_username} />
              ) : (
                <FaUser className="w-5 h-5" />
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">{post.user_username}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FaCalendar className="w-3 h-3" />
              <span>{formatDate(post.survey_date_created)}</span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <h3 className="card-title text-lg mb-2 text-gray-800">{post.survey_title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {post.survey_content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.survey_category?.map((category, index) => (
            <span key={index} className="badge bg-custom-blue text-white border-none badge-sm">
              {category}
            </span>
          ))}
          {post.survey_target_audience && post.survey_target_audience.length > 0 && (
            <div className="tooltip" data-tip={post.survey_target_audience.join(', ')}>
              <span className="badge bg-custom-maroon text-white border-none badge-sm max-w-[150px] truncate block">
                {post.survey_target_audience.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end gap-2">
          <button
            onClick={handleReview}
            className="btn btn-sm btn-ghost gap-2 text-custom-blue hover:bg-blue-50"
          >
            <FaEye />
            Review
          </button>
          <button
            onClick={() => onReject(post)}
            className="btn btn-sm bg-transparent border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600"
          >
            Reject
          </button>
          <button
            onClick={() => onApprove(post)}
            className="btn btn-sm bg-custom-green border-custom-green text-white hover:bg-green-600 hover:border-green-600"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingPostCard;
