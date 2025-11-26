import { MdMoreVert, MdAccessTime, MdPeople } from 'react-icons/md';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostCard({ post }) {
  const [showMenu, setShowMenu] = useState(false);
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

  const handleTakeSurvey = () => {
    navigate(`/form/response/${post.pk_survey_id}`);
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
            <h3 
              style={{ 
                color: 'var(--color-primary-color)',
                fontSize: 'clamp(0.9375rem, 1.5vw, 1.125rem)',
                fontWeight: '600',
                marginBottom: 'clamp(0.125rem, 0.25vw, 0.25rem)'
              }}
            >
              {post.user_username}
            </h3>
            <p 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'clamp(0.6875rem, 1.25vw, 0.8125rem)',
                textTransform: 'uppercase',
                letterSpacing: '0.025em'
              }}
            >
              {post.survey_category?.[0] || 'UNCATEGORIZED'}
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
              className="absolute right-0 z-10 rounded-lg shadow-lg"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-shade-primary)',
                minWidth: 'clamp(150px, 15vw, 180px)',
                marginTop: 'clamp(0.25rem, 0.5vw, 0.5rem)'
              }}
            >
              <ul className="menu menu-sm">
                <li>
                  <button 
                    onClick={() => handleMenuClick('Save')}
                    style={{
                      fontSize: 'clamp(0.8125rem, 1.25vw, 0.9375rem)',
                      padding: 'clamp(0.5rem, 1vw, 0.75rem)'
                    }}
                  >
                    Save Post
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleMenuClick('Share')}
                    style={{
                      fontSize: 'clamp(0.8125rem, 1.25vw, 0.9375rem)',
                      padding: 'clamp(0.5rem, 1vw, 0.75rem)'
                    }}
                  >
                    Share
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleMenuClick('Report')}
                    style={{
                      fontSize: 'clamp(0.8125rem, 1.25vw, 0.9375rem)',
                      padding: 'clamp(0.5rem, 1vw, 0.75rem)',
                      color: '#dc2626'
                    }}
                  >
                    Report
                  </button>
                </li>
              </ul>
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
            marginBottom: 'clamp(0.75rem, 1.25vw, 1rem)'
          }}
        >
          {post.survey_title}
        </p>

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
  );
}
