import React, { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { deleteSurvey } from '../../services/survey/survey.service'
import { useNavigate } from 'react-router-dom'
import { MdAccessTime, MdPeople, MdMoreVert, MdShare, MdDelete, MdCheck, MdArchive } from 'react-icons/md'

const ProfilePostSkeleton = () => (
  <div className="rounded-xl shadow-sm bg-white border border-gray-200 p-5 lg:p-6 mb-4">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-start gap-3 flex-1">
        <div className="skeleton w-10 h-10 lg:w-12 lg:h-12 rounded-full shrink-0"></div>
        <div className="flex-1">
          <div className="skeleton h-4 w-32 mb-2"></div>
          <div className="skeleton h-3 w-24"></div>
        </div>
      </div>
    </div>
    <div className="mb-4 lg:mb-5">
      <div className="skeleton h-4 w-3/4 mb-2"></div>
      <div className="skeleton h-4 w-1/2 mb-4"></div>
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full"></div>
        <div className="skeleton h-6 w-16 rounded-full"></div>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex gap-4">
         <div className="skeleton h-4 w-20"></div>
         <div className="skeleton h-4 w-20"></div>
      </div>
      <div className="skeleton h-8 w-24 rounded-lg"></div>
    </div>
  </div>
);

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
      <section className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <ProfilePostSkeleton key={i} />
        ))}
      </section>
    );
  }

  return (
    <>
      <section className="space-y-4">
        {userPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
            <div className="text-6xl mb-4 opacity-30 flex justify-center">📭</div>
            <p className="text-gray-500">You have not published any surveys yet.</p>
          </div>
        ) : (
          userPosts.map((post) => (
            <Suspense key={post.pk_survey_id} fallback={<ProfilePostSkeleton />}>
            <article
              className="rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white border border-gray-200 p-5 lg:p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="avatar">
                    <div className="rounded-full w-10 h-10 lg:w-12 lg:h-12">
                      <img src={post.user_profile} alt={post.user_username} className="object-cover w-full h-full rounded-full" />
                    </div>
                  </div>

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
                      {post.survey_category?.[0] || 'UNCATEGORIZED'}
                    </p>
                  </div>
                </div>

                {/* Three Dots Menu */}
                <div className="relative" ref={(el) => (menuRefs.current[post.pk_survey_id] = el)}>
                  <button
                    onClick={() => setOpenMenuId(openMenuId === post.pk_survey_id ? null : post.pk_survey_id)}
                    className="btn btn-ghost btn-sm btn-circle text-gray-500 w-8 h-8 lg:w-10 lg:h-10 min-h-0"
                  >
                    <MdMoreVert className="text-xl lg:text-2xl" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === post.pk_survey_id && (
                    <div className="absolute right-0 z-10 rounded-xl shadow-xl overflow-hidden bg-white border border-gray-200 min-w-[180px] mt-2 animate-[fadeIn_0.15s_ease-out]">
                      <div className="py-1">
                        <button
                          onClick={() => handleShare(post.pk_survey_id)}
                          className={`w-full flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm p-3 ${copiedId === post.pk_survey_id ? 'text-custom-green' : 'text-gray-900'}`}
                        >
                          {copiedId === post.pk_survey_id ? (
                            <>
                              <MdCheck className="text-xl text-custom-green" />
                              Link Copied!
                            </>
                          ) : (
                            <>
                              <MdShare className="text-xl text-gray-500" />
                              Copy Link
                            </>
                          )}
                        </button>
                        <div className="h-px bg-gray-200 my-1" />
                        <button
                          onClick={() => handleDeleteClick(post)}
                          className="w-full flex items-center gap-3 hover:bg-yellow-50 transition-colors text-sm p-3 text-yellow-600"
                        >
                          <MdArchive className="text-xl" />
                          Archive Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="mb-4 lg:mb-5">
                <p className="text-gray-900 text-sm lg:text-base leading-relaxed mb-2 lg:mb-3 font-medium">
                  {post.survey_title}
                </p>

                <p className="text-gray-600 text-xs lg:text-sm leading-relaxed mb-3 lg:mb-4">
                  {post.survey_content}
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.survey_category?.map((tag, i) => (
                    <div
                      key={i}
                      className="badge badge-sm bg-gray-100 text-custom-blue border-none text-[11px] lg:text-[13px] px-2.5 py-2 font-medium"
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
                    <MdAccessTime className="text-base lg:text-lg text-custom-green" />
                    <span className="text-gray-500 text-xs lg:text-sm">
                      {post.survey_date_created ? new Date(post.survey_date_created).toLocaleDateString() : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MdPeople className="text-base lg:text-lg text-custom-blue shrink-0" />
                    <div className="tooltip" data-tip={post.survey_target_audience?.join(', ')}>
                      <span className="text-gray-500 text-xs lg:text-sm block max-w-[150px] truncate text-left">
                        {post.survey_target_audience?.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/form/result/${post.pk_survey_id}`)}
                  className="btn btn-sm bg-custom-blue border-custom-blue text-white text-xs lg:text-sm px-4 lg:px-6 font-semibold h-auto min-h-[2rem] lg:min-h-[2.5rem] rounded-lg hover:bg-blue-800 hover:border-blue-800 ml-auto"
                >
                  View Results
                </button>
              </div>
            </article>
            </Suspense>
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
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Archive Post
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to archive "<strong>{postToDelete?.survey_title}</strong>"? It will be moved to your archived posts.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="btn btn-ghost text-gray-600"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn bg-yellow-600 border-yellow-600 text-white hover:bg-yellow-700 hover:border-yellow-700"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Archive'
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
