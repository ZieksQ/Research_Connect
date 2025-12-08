import React, { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { deleteSurvey, editPost } from '../../services/survey/survey.service'
import { useNavigate } from 'react-router-dom'
import { MdAccessTime, MdPeople, MdMoreVert, MdShare, MdDelete, MdCheck, MdArchive, MdEdit, MdLockOpen, MdLock, MdCalendarToday } from 'react-icons/md'

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    post_content: '',
    post_description: '',
    status: 'open'
  });
  const [confirmEditModalOpen, setConfirmEditModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
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

  const handleEditClick = (post) => {
    setPostToEdit(post);
    setEditFormData({
      title: post.survey_title || '',
      post_content: post.survey_content || '',
      post_description: post.survey_description || '',
      status: post.status || 'open'
    });
    setEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateEditForm = () => {
    const errors = {};
    
    // Count words in title
    const titleWords = editFormData.title.trim().split(/\s+/).filter(word => word.length > 0);
    if (titleWords.length < 5) {
      errors.title = 'Title must contain at least 5 words';
    }
    
    // Count words in content
    const contentWords = editFormData.post_content.trim().split(/\s+/).filter(word => word.length > 0);
    if (contentWords.length < 5) {
      errors.post_content = 'Content must contain at least 5 words';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (validateEditForm()) {
      setConfirmEditModalOpen(true);
    }
  };

  const handleConfirmEdit = async () => {
    if (!postToEdit) return;
    
    setIsEditing(true);
    setConfirmEditModalOpen(false);
    
    try {
      const response = await editPost({
        id: postToEdit.pk_survey_id,
        title: editFormData.title,
        post_content: editFormData.post_content,
        post_description: editFormData.post_description,
        status: editFormData.status
      });
      
      // Check if there's an error in the response
      if (response && response.ok === false) {
        setErrorMessage(response.message || 'An error occurred while updating the post');
        setErrorModalOpen(true);
        setIsEditing(false);
        return;
      }
      
      // Refetch user data to update the posts list
      if (refreshUser) {
        await refreshUser();
      }
      setEditModalOpen(false);
      setPostToEdit(null);
      setValidationErrors({});
    } catch (err) {
      console.error('Error editing survey:', err);
      setErrorMessage(err.message || 'An unexpected error occurred');
      setErrorModalOpen(true);
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setPostToEdit(null);
    setValidationErrors({});
    setEditFormData({
      title: '',
      post_content: '',
      post_description: '',
      status: 'open'
    });
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
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-start gap-3 flex-1">
                  <div className="avatar">
                    <div className="rounded-full w-11 h-11 lg:w-14 lg:h-14">
                      <img src={post.user_profile} alt={post.user_username} className="object-cover w-full h-full rounded-full" />
                    </div>
                  </div>

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
                    <p className="text-gray-500 text-[11px] lg:text-[13px] uppercase tracking-wide mt-0.5 font-medium">
                      {post.user_program || 'None'}
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
                          onClick={() => handleEditClick(post)}
                          className="w-full flex items-center gap-3 hover:bg-blue-50 transition-colors text-sm p-3 text-custom-blue"
                        >
                          <MdEdit className="text-xl" />
                          Edit Post
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
              <div className="mb-5 lg:mb-6">
                <h2 className="text-gray-900 text-lg lg:text-xl leading-snug mb-2 lg:mb-2.5 font-bold tracking-tight">
                  {post.survey_title}
                </h2>

                <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4 lg:mb-5">
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
                      <span className="text-gray-600 text-xs lg:text-sm font-medium block max-w-[150px] truncate text-left">
                        {post.survey_target_audience?.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  {/* Responses Count */}
                  <div className="flex items-center gap-1.5 text-gray-600 text-xs lg:text-sm px-2 lg:px-3 font-medium">
                    <MdPeople className="text-lg lg:text-xl" />
                    <span>{post.num_of_responses || 0} responses</span>
                  </div>

                  <button
                    onClick={() => navigate(`/form/result/${post.pk_survey_id}`)}
                    className="btn btn-sm bg-custom-blue border-custom-blue text-white text-xs lg:text-sm px-4 lg:px-6 font-semibold h-auto min-h-[2rem] lg:min-h-[2.5rem] rounded-lg hover:bg-blue-800 hover:border-blue-800"
                  >
                    View Results
                  </button>
                </div>
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

      {/* Edit Post Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={handleCancelEdit}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Edit Post
            </h3>
            
            <form onSubmit={handleSaveClick} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => handleEditFormChange('title', e.target.value)}
                  className={`input input-bordered w-full ${validationErrors.title ? 'border-red-500' : ''}`}
                  placeholder="Enter survey title"
                />
                {validationErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                )}
              </div>

              {/* Post Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Content
                </label>
                <input
                  type="text"
                  value={editFormData.post_content}
                  onChange={(e) => handleEditFormChange('post_content', e.target.value)}
                  className={`input input-bordered w-full ${validationErrors.post_content ? 'border-red-500' : ''}`}
                  placeholder="Enter post content"
                />
                {validationErrors.post_content && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.post_content}</p>
                )}
              </div>

              {/* Post Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Description
                </label>
                <textarea
                  value={editFormData.post_description}
                  onChange={(e) => handleEditFormChange('post_description', e.target.value)}
                  className="textarea textarea-bordered w-full h-32 resize-none"
                  placeholder="Enter post description"
                />
              </div>

              {/* Status - Only show if post is approved */}
              {postToEdit?.['approved`'] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Status
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Open Option */}
                    <label
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                        editFormData.status === 'open'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="open"
                        checked={editFormData.status === 'open'}
                        onChange={(e) => handleEditFormChange('status', e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            editFormData.status === 'open'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <MdLockOpen className="text-2xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Open</h4>
                          <p className="text-xs text-gray-600">
                            Survey is active and accepting responses from participants
                          </p>
                        </div>
                      </div>
                    </label>

                    {/* Close Option */}
                    <label
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                        editFormData.status === 'close'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="close"
                        checked={editFormData.status === 'close'}
                        onChange={(e) => handleEditFormChange('status', e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            editFormData.status === 'close'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <MdLock className="text-2xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Close</h4>
                          <p className="text-xs text-gray-600">
                            Survey is closed and no longer accepting new responses
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {!postToEdit?.['approved`'] && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Status cannot be edited while the post is pending approval.
                  </p>
                </div>
              )}
            
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-ghost text-gray-600"
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-custom-blue border-custom-blue text-white hover:bg-blue-800 hover:border-blue-800"
                  disabled={isEditing}
                >
                  {isEditing ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setConfirmEditModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Confirm Changes
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to save the changes to "<strong>{editFormData.title}</strong>"?
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmEditModalOpen(false)}
                className="btn btn-ghost text-gray-600"
                disabled={isEditing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEdit}
                className="btn bg-custom-blue border-custom-blue text-white hover:bg-blue-800 hover:border-blue-800"
                disabled={isEditing}
              >
                {isEditing ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setErrorModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Error
            </h3>
            <p className="mb-6 text-gray-600">
              {errorMessage}
            </p>
            
            <div className="flex justify-end">
              <button
                onClick={() => setErrorModalOpen(false)}
                className="btn bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfilePostsPage
