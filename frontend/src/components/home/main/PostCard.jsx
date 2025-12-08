import { MdMoreVert, MdAccessTime, MdPeople, MdBookmarkBorder, MdShare, MdFlag, MdCheck, MdFavorite, MdFavoriteBorder, MdArchive, MdCalendarToday } from 'react-icons/md';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { likePost, deleteSurvey } from '../../../services/survey/survey.service';
import { useAuth } from '../../../hooks/useAuth';

export default function PostCard({ post, onArchive }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [isLiking, setIsLiking] = useState(false);
  const [likeCount, setLikeCount] = useState(post.num_of_likes || 0);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const { userInfo } = useAuth();
  const isOwner = userInfo?.message?.user_info?.username === post.user_username;
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
    // console.log(`${action} clicked for post ${post.pk_survey_id}`);
    setShowMenu(false);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/form/response/${post.pk_survey_id}`;
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

  const handleArchiveClick = () => {
    setArchiveModalOpen(true);
    setShowMenu(false);
  };

  const handleConfirmArchive = async () => {
    setIsArchiving(true);
    try {
      await deleteSurvey({ id: post.pk_survey_id });
      setArchiveModalOpen(false);
      // Call callback to refresh posts instead of reloading
      if (onArchive) {
        onArchive();
      }
    } catch (err) {
      console.error('Failed to archive post:', err);
      alert('Failed to archive post. Please try again.');
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white border border-gray-200 p-5 lg:p-7 mb-4 lg:mb-5">
      {/* Header with Avatar, User Info, and Menu */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="avatar">
            <div className="rounded-full w-11 h-11 lg:w-14 lg:h-14">
              <img src={post.user_profile} alt={post.user_username} />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-gray-900 text-base lg:text-lg font-bold">
                {post.user_username}
              </h3>
              {/* Status Badge */}
              <span 
                className={`badge badge-sm text-white border-none text-[10px] lg:text-xs capitalize font-semibold ${
                  !post['approved`'] ? 'bg-gray-500' : 
                  post.status === 'open' ? 'bg-custom-blue' : 
                  post.status === 'close' ? 'bg-red-600' : 'bg-gray-500'
                }`}
              >
                {!post['approved`'] ? 'pending' : post.status}
              </span>
            </div>

            {/* User Program */}
            <p className="text-gray-500 text-[11px] lg:text-[13px] uppercase tracking-wide mt-0.5 font-medium">
              {post.user_program || 'None'}
            </p>
          </div>
        </div>

        {/* Menu Button */}
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
                {isOwner && (
                  <button 
                    onClick={handleArchiveClick}
                    className="w-full flex items-center gap-3 hover:bg-yellow-50 transition-colors text-sm p-3 text-yellow-600"
                  >
                    <MdArchive className="text-xl" />
                    Archive
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-5 lg:mb-6">
        <h2 className="text-gray-900 text-lg lg:text-xl leading-snug mb-2 lg:mb-2.5 font-bold tracking-tight">
          {post.survey_title}
        </h2>

        {/* Survey Content */}
        {post.survey_content && (
          <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4 lg:mb-5">
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-5 flex-wrap">
          {/* Approx Time */}
          <div className="flex items-center gap-1.5">
            <MdAccessTime className="text-lg lg:text-xl text-custom-green" />
            <span className="text-gray-600 text-xs lg:text-sm font-medium">
              {post.approx_time || 'N/A'}
            </span>
          </div>

          {/* Target Audience */}
          <div className="flex items-center gap-1.5">
            <MdPeople className="text-lg lg:text-xl text-custom-blue shrink-0" />
            <div className="tooltip" data-tip={post.survey_target_audience?.join(', ')}>
              <span 
                className="text-gray-600 text-xs lg:text-sm font-medium block max-w-[150px] truncate text-left"
              >
                {post.survey_target_audience?.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Take Survey Button */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Like Button with Count */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 transition-colors px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg ${
              isLiked ? 'text-custom-green hover:text-green-700' : 'text-gray-500 hover:text-custom-green'
            }`}
          >
            {isLiked ? (
              <MdFavorite className="text-xl lg:text-2xl" />
            ) : (
              <MdFavoriteBorder className="text-xl lg:text-2xl" />
            )}
            {likeCount > 0 && (
              <span className="text-xs lg:text-sm font-semibold">
                {likeCount}
              </span>
            )}
          </button>

          {/* Responses Count */}
          <div className="flex items-center gap-1.5 text-gray-600 text-xs lg:text-sm px-2 lg:px-3 font-medium">
            <MdPeople className="text-lg lg:text-xl" />
            <span>{post.num_of_responses || 0} responses</span>
          </div>

          <button
            onClick={() => navigate(`/form/response/${post.pk_survey_id}`)}
            className="btn btn-sm bg-custom-blue border-custom-blue text-white text-xs lg:text-sm px-4 lg:px-6 font-semibold h-auto min-h-[2rem] lg:min-h-[2.5rem] rounded-lg hover:bg-blue-800 hover:border-blue-800"
          >
            Take Survey
          </button>
        </div>
      </div>

      {/* Archive Confirmation Modal */}
      {archiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdArchive className="text-3xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Archive Post?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to archive this post? It will be moved to your archived posts and hidden from the feed.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setArchiveModalOpen(false)}
                  className="btn btn-ghost text-gray-500 hover:bg-gray-100"
                  disabled={isArchiving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmArchive}
                  className="btn bg-yellow-600 hover:bg-yellow-700 text-white border-none px-6"
                  disabled={isArchiving}
                >
                  {isArchiving ? 'Archiving...' : 'Archive'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
