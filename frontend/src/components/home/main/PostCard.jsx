import { MdMoreVert, MdAccessTime, MdPeople, MdBookmarkBorder, MdShare, MdFlag, MdCheck, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { likePost } from '../../../services/survey/survey.service';

export default function PostCard({ post }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [isLiking, setIsLiking] = useState(false);
  const [likeCount, setLikeCount] = useState(post.num_of_likes || 0);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (action) => {
    console.log(`${action} clicked for post ${post.pk_survey_id}`);
    setShowMenu(false);
  };

  const handleShare = async () => {
    const shareUrl = `http://localhost:5173/form/response/${post.pk_survey_id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
      setShowMenu(false);
    }
  };

  const handleTakeSurvey = () => {
    navigate(`/form/response/${post.pk_survey_id}`);
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await likePost(post.pk_survey_id);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (err) {
      console.error('Failed to like/unlike post:', err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white border border-gray-200 p-5 lg:p-7 mb-4 lg:mb-5">
      {/* Header with Avatar, User Info, and Menu */}
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

        {/* Three Dots Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn btn-ghost btn-sm btn-circle text-gray-500 w-8 h-8 lg:w-10 lg:h-10 min-h-0"
          >
            <MdMoreVert className="text-xl lg:text-2xl" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 z-10 rounded-xl shadow-xl overflow-hidden bg-white border border-gray-200 min-w-[180px] mt-2 animate-[fadeIn_0.15s_ease-out]">
              <div className="py-1">
                <button 
                  onClick={() => handleMenuClick('Save')}
                  className="w-full flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm p-3 text-gray-900"
                >
                  <MdBookmarkBorder className="text-xl text-gray-500" />
                  Save Post
                </button>
                <button 
                  onClick={handleShare}
                  className={`w-full flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm p-3 ${copied ? 'text-custom-green' : 'text-gray-900'}`}
                >
                  {copied ? (
                    <>
                      <MdCheck className="text-xl text-custom-green" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <MdShare className="text-xl text-gray-500" />
                      Share
                    </>
                  )}
                </button>
                <div className="h-px bg-gray-200 my-1" />
                <button 
                  onClick={() => handleMenuClick('Report')}
                  className="w-full flex items-center gap-3 hover:bg-red-50 transition-colors text-sm p-3 text-red-600"
                >
                  <MdFlag className="text-xl" />
                  Report
                </button>
              </div>
            </div>
          )}
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
            <MdPeople className="text-base lg:text-lg text-custom-blue" />
            <div>
              <span 
                className="text-gray-500 text-xs lg:text-sm"
                title={post.survey_target_audience?.join(', ')}
              >
                {post.survey_target_audience?.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Take Survey Button */}
        <div className="flex items-center gap-2">
          {/* Like Button with Count */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`btn btn-sm btn-ghost flex items-center gap-1 text-xs lg:text-sm px-2 lg:px-3 h-auto min-h-[2rem] lg:min-h-[2.5rem] rounded-lg transition-all ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            {isLiked ? (
              <MdFavorite className="text-xl lg:text-2xl" />
            ) : (
              <MdFavoriteBorder className="text-xl lg:text-2xl" />
            )}
            {likeCount > 0 && (
              <span className="text-xs lg:text-sm">
                {likeCount}
              </span>
            )}
          </button>

          {/* Responses Count */}
          <div className="flex items-center gap-1 text-gray-500 text-xs lg:text-sm px-2 lg:px-3">
            <MdPeople className="text-lg lg:text-xl" />
            <span>{post.num_of_responses || 0} responses</span>
          </div>

          <button
            onClick={handleTakeSurvey}
            className="btn btn-sm bg-custom-blue border-custom-blue text-white text-xs lg:text-sm px-4 lg:px-6 font-semibold h-auto min-h-[2rem] lg:min-h-[2.5rem] rounded-lg hover:bg-blue-800 hover:border-blue-800"
          >
            Take Survey
          </button>
        </div>
      </div>
    </div>
  );
}
