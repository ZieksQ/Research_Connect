import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { deleteSurvey } from '../../services/survey/survey.service'
import { useNavigate } from 'react-router-dom'
import { MdAccessTime, MdPeople, MdMoreVert, MdShare, MdDelete, MdCheck } from 'react-icons/md'

// Posts section in Profile Page
const ProfilePostsPage = () => {
  const { userInfo, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRefs = useRef({});

  const userPosts = userInfo?.message?.user_posts || [];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (openMenuId !== null) {
        const menuRef = menuRefs.current[openMenuId];
        if (menuRef && !menuRef.contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleShare = async (postId) => {
    const shareUrl = `${window.location.origin}/form/response/${postId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(postId);
      setTimeout(() => {
        setCopiedId(null);
        setOpenMenuId(null);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
      setOpenMenuId(null);
    }
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteSurvey({ id: postToDelete.pk_survey_id });
      // Refetch user data to update the posts list
      if (refreshUser) {
        await refreshUser();
      }
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      console.error('Error deleting survey:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  if (!userInfo) {
    return (
      <section className="py-6">
        <div className="text-center text-text-secondary">User data not loaded yet.</div>
      </section>
    );
  }

  return (
    <>
      <section className="space-y-4">
        {userPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', marginBottom: '1rem', opacity: 0.3 }}>📭</div>
            <p className="text-text-secondary">You have not published any surveys yet.</p>
          </div>
        ) : (
          userPosts.map((post) => (
            <article
              key={post.pk_survey_id}
              className="rounded-xl shadow-sm hover:shadow-md transition-shadow"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-shade-primary)',
                padding: 'clamp(1.25rem, 2vw, 1.5rem)'
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="avatar">
                    <div
                      className="rounded-full"
                      style={{
                        width: 'clamp(2.5rem, 4vw, 3rem)',
                        height: 'clamp(2.5rem, 4vw, 3rem)'
                      }}
                    >
                      <img src={post.user_profile} alt={post.user_username} className="object-cover w-full h-full rounded-full" />
                    </div>
                  </div>

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
                <div className="relative" ref={(el) => (menuRefs.current[post.pk_survey_id] = el)}>
                  <button
                    onClick={() => setOpenMenuId(openMenuId === post.pk_survey_id ? null : post.pk_survey_id)}
                    className="btn btn-ghost btn-sm btn-circle"
                    style={{
                      color: 'var(--color-text-secondary)',
                      minHeight: 'clamp(2rem, 3vw, 2.5rem)',
                      width: 'clamp(2rem, 3vw, 2.5rem)',
                      height: 'clamp(2rem, 3vw, 2.5rem)'
                    }}
                  >
                    <MdMoreVert style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }} />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === post.pk_survey_id && (
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
                          onClick={() => handleShare(post.pk_survey_id)}
                          className="w-full flex items-center gap-3 hover:bg-gray-50 transition-colors"
                          style={{
                            fontSize: '0.875rem',
                            padding: '0.75rem 1rem',
                            color: copiedId === post.pk_survey_id ? '#22c55e' : 'var(--color-primary-color)'
                          }}
                        >
                          {copiedId === post.pk_survey_id ? (
                            <>
                              <MdCheck style={{ fontSize: '1.25rem', color: '#22c55e' }} />
                              Link Copied!
                            </>
                          ) : (
                            <>
                              <MdShare style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)' }} />
                              Copy Link
                            </>
                          )}
                        </button>
                        <div style={{ height: '1px', backgroundColor: 'var(--color-shade-primary)', margin: '0.25rem 0' }} />
                        <button
                          onClick={() => handleDeleteClick(post)}
                          className="w-full flex items-center gap-3 hover:bg-red-50 transition-colors"
                          style={{
                            fontSize: '0.875rem',
                            padding: '0.75rem 1rem',
                            color: '#dc2626'
                          }}
                        >
                          <MdDelete style={{ fontSize: '1.25rem' }} />
                          Delete Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div style={{ marginBottom: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
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

                <p className="text-text-secondary" style={{ marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
                  {post.survey_content}
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.survey_category?.map((tag, i) => (
                    <div
                      key={i}
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

              {/* Footer */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MdAccessTime style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', color: '#22c55e' }} />
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)' }}>
                      {post.survey_date_created ? new Date(post.survey_date_created).toLocaleDateString() : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MdPeople style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', color: 'var(--color-accent-100)' }} />
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)' }} title={post.survey_target_audience?.join(', ')}>
                      {post.survey_target_audience?.join(', ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/form/result/${post.pk_survey_id}`)}
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
                  View Results
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={handleCancelDelete}
          />
          
          {/* Modal */}
          <div 
            className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
            style={{
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--color-primary-color)' }}
            >
              Delete Post
            </h3>
            <p 
              className="mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Are you sure you want to delete "<strong>{postToDelete?.survey_title}</strong>"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="btn btn-ghost"
                disabled={isDeleting}
                style={{
                  color: 'var(--color-text-secondary)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn"
                disabled={isDeleting}
                style={{
                  backgroundColor: '#dc2626',
                  borderColor: '#dc2626',
                  color: '#ffffff'
                }}
              >
                {isDeleting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfilePostsPage
