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
    <div 
      className="rounded-xl shadow-sm hover:shadow-md transition-shadow"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-shade-primary)',
        padding: 'clamp(1.25rem, 2vw, 1.75rem)',
        marginBottom: 'clamp(1rem, 1.5vw, 1.25rem)'
      }}
    >
      {/* Header with Avatar, User Info, and Menu */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="avatar">
            <div 
              className="rounded-full"
              style={{
                width: 'clamp(2.5rem, 4vw, 3rem)',
                height: 'clamp(2.5rem, 4vw, 3rem)'
              }}
            >
              <img src={post.user_profile} alt={post.user_username} />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 
                style={{ 
                  color: 'var(--color-primary-color)',
                  fontSize: 'clamp(0.9375rem, 1.5vw, 1.125rem)',
                  fontWeight: '600'
                }}
              >
                {post.user_username}
              </h3>
              {/* Status Badge */}
              {post.status && (
                <span 
                  className="badge badge-sm"
                  style={{
                    backgroundColor: post.status === 'approved' ? '#22c55e' : 
                                    post.status === 'pending' ? '#f59e0b' : 
                                    post.status === 'rejected' ? '#dc2626' : '#6b7280',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: 'clamp(0.6rem, 1vw, 0.7rem)',
                    textTransform: 'capitalize'
                  }}
                >
                  {post.status}
                </span>
              )}
            </div>
            <p 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'clamp(0.6875rem, 1.25vw, 0.8125rem)',
                textTransform: 'uppercase',
                letterSpacing: '0.025em',
                marginTop: 'clamp(0.125rem, 0.25vw, 0.25rem)'
              }}
            >
              {post.user_program || 'None'}
            </p>
          </div>
        </div>

        {/* Three Dots Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn btn-ghost btn-sm btn-circle"
            style={{
              color: 'var(--color-text-secondary)',
              minHeight: 'clamp(2rem, 3vw, 2.5rem)',
              width: 'clamp(2rem, 3vw, 2.5rem)',
              height: 'clamp(2rem, 3vw, 2.5rem)'
            }}
          >
            <MdMoreVert 
              style={{ 
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)'
              }} 
            />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div 
              className="absolute right-0 z-10 rounded-xl shadow-xl overflow-hidden"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-shade-primary)',
                minWidth: '180px',
                marginTop: '0.5rem',
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              <div className="py-1">
                <button 
                  onClick={() => handleMenuClick('Save')}
                  className="w-full flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.75rem 1rem',
                    color: 'var(--color-primary-color)'
                  }}
                >
                  <MdBookmarkBorder style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)' }} />
                  Save Post
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.75rem 1rem',
                    color: copied ? '#22c55e' : 'var(--color-primary-color)'
                  }}
                >
                  {copied ? (
                    <>
                      <MdCheck style={{ fontSize: '1.25rem', color: '#22c55e' }} />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <MdShare style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)' }} />
                      Share
                    </>
                  )}
                </button>
                <div style={{ height: '1px', backgroundColor: 'var(--color-shade-primary)', margin: '0.25rem 0' }} />
                <button 
                  onClick={() => handleMenuClick('Report')}
                  className="w-full flex items-center gap-3 hover:bg-red-50 transition-colors"
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.75rem 1rem',
                    color: '#dc2626'
                  }}
                >
                  <MdFlag style={{ fontSize: '1.25rem' }} />
                  Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div 
        style={{
          marginBottom: 'clamp(1rem, 1.5vw, 1.25rem)'
        }}
      >
        <p 
          style={{ 
            color: 'var(--color-primary-color)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            lineHeight: '1.6',
            marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)'
          }}
        >
          {post.survey_title}
        </p>

        {/* Survey Content */}
        {post.survey_content && (
          <p 
            style={{ 
              color: 'var(--color-text-secondary)',
              fontSize: 'clamp(0.8rem, 1.35vw, 0.9rem)',
              lineHeight: '1.6',
              marginBottom: 'clamp(0.75rem, 1.25vw, 1rem)'
            }}
          >
            {post.survey_content}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.survey_category?.map((tag, index) => (
            <div
              key={index}
              className="badge badge-sm"
              style={{
                backgroundColor: 'var(--color-secondary-background)',
                color: 'var(--color-accent-100)',
                border: 'none',
                fontSize: 'clamp(0.6875rem, 1.15vw, 0.8125rem)',
                padding: 'clamp(0.375rem, 0.75vw, 0.5rem) clamp(0.625rem, 1.25vw, 0.875rem)',
                fontWeight: '500'
              }}
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
            <MdAccessTime 
              style={{ 
                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                color: '#22c55e'
              }} 
            />
            <span 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'
              }}
            >
              {new Date(post.survey_date_created).toLocaleDateString()}
            </span>
          </div>

          {/* Target Audience */}
          <div className="flex items-center gap-1">
            <MdPeople 
              style={{ 
                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                color: 'var(--color-accent-100)'
              }} 
            />
            <div>
              <span 
                style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'
                }}
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
            className="btn btn-sm btn-ghost flex items-center gap-1"
            style={{
              color: isLiked ? '#ef4444' : 'var(--color-text-secondary)',
              fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)',
              height: 'auto',
              minHeight: 'clamp(2rem, 3vw, 2.5rem)',
              borderRadius: 'clamp(0.375rem, 0.75vw, 0.5rem)',
              transition: 'all 0.2s ease'
            }}
          >
            {isLiked ? (
              <MdFavorite style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }} />
            ) : (
              <MdFavoriteBorder style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }} />
            )}
            {likeCount > 0 && (
              <span style={{ fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)' }}>
                {likeCount}
              </span>
            )}
          </button>

          {/* Responses Count */}
          <div 
            className="flex items-center gap-1"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem)',
            }}
          >
            <MdPeople style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.25rem)' }} />
            <span>{post.num_of_responses || 0} responses</span>
          </div>

          <button
            onClick={handleTakeSurvey}
            className="btn btn-sm"
            style={{
              backgroundColor: 'var(--color-accent-100)',
              borderColor: 'var(--color-accent-100)',
              color: '#ffffff',
              fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)',
              padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(1rem, 1.75vw, 1.5rem)',
              fontWeight: '600',
              height: 'auto',
              minHeight: 'clamp(2rem, 3vw, 2.5rem)',
              borderRadius: 'clamp(0.375rem, 0.75vw, 0.5rem)'
            }}
          >
            Take Survey
          </button>
        </div>
      </div>
    </div>
  );
}
