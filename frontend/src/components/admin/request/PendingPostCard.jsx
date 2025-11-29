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
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-base-200">
      <div className="card-body">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-10 h-10">
              {post.user_profile ? (
                <img src={post.user_profile} alt={post.user_username} />
              ) : (
                <FaUser className="w-5 h-5" />
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm">{post.user_username}</p>
            <div className="flex items-center gap-1 text-xs text-base-content/60">
              <FaCalendar className="w-3 h-3" />
              <span>{formatDate(post.survey_date_created)}</span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <h3 className="card-title text-lg mb-2">{post.survey_title}</h3>
        <p className="text-sm text-base-content/70 line-clamp-3 mb-4">
          {post.survey_content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.survey_category?.map((category, index) => (
            <span key={index} className="badge badge-primary badge-sm">
              {category}
            </span>
          ))}
          {post.survey_target_audience?.map((audience, index) => (
            <span key={index} className="badge badge-secondary badge-sm">
              {audience}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end gap-2">
          <button
            onClick={handleReview}
            className="btn btn-sm btn-ghost gap-2"
          >
            <FaEye />
            Review
          </button>
          <button
            onClick={() => onReject(post)}
            className="btn btn-sm btn-error btn-outline"
          >
            Reject
          </button>
          <button
            onClick={() => onApprove(post)}
            className="btn btn-sm btn-success"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingPostCard;
