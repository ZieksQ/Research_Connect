import React, { useState, useEffect } from 'react';
import { getPendingPosts, approvePost, rejectPost } from '../../services/user/admin.service';
import {
  PendingPostCard,
  ConfirmationModal,
  RejectModal,
  ErrorModal,
  LoadingSpinner,
  EmptyState,
} from '../../components/admin/request';
import { FaClipboardList } from 'react-icons/fa';

const AdminRequest = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'approve' });
  const [rejectModal, setRejectModal] = useState({ isOpen: false });
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [processing, setProcessing] = useState(false);

  // Fetch pending posts on component mount
  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    setLoading(true);
    try {
      const response = await getPendingPosts();
      
      if (response.ok) {
        setPendingPosts(response.message || []);
      } else {
        setErrorModal({
          isOpen: true,
          message: response.message || 'Failed to fetch pending posts',
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'An error occurred while fetching pending posts',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (post) => {
    setSelectedPost(post);
    setConfirmModal({ isOpen: true, type: 'approve' });
  };

  const handleRejectClick = (post) => {
    setSelectedPost(post);
    setRejectModal({ isOpen: true });
  };

  const handleRejectConfirm = async (rejectReason) => {
    if (!selectedPost) return;

    setProcessing(true);
    setRejectModal({ isOpen: false });

    try {
      const response = await rejectPost(rejectReason, selectedPost.pk_survey_id);
      
      if (response.ok) {
        // Remove rejected post from list
        setPendingPosts((prev) =>
          prev.filter((post) => post.pk_survey_id !== selectedPost.pk_survey_id)
        );
        setSelectedPost(null);
      } else {
        setErrorModal({
          isOpen: true,
          message: response.message || 'Failed to reject post',
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'An error occurred while rejecting the post',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseRejectModal = () => {
    setRejectModal({ isOpen: false });
    setSelectedPost(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedPost) return;

    setProcessing(true);
    setConfirmModal({ isOpen: false, type: 'approve' });

    try {
      const response = await approvePost({ id: selectedPost.pk_survey_id });
      
      if (response.ok) {
        // Remove approved post from list
        setPendingPosts((prev) =>
          prev.filter((post) => post.pk_survey_id !== selectedPost.pk_survey_id)
        );
        setSelectedPost(null);
      } else {
        setErrorModal({
          isOpen: true,
          message: response.message || 'Failed to approve post',
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'An error occurred while processing the request',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseConfirmModal = () => {
    if (!processing) {
      setConfirmModal({ isOpen: false, type: 'approve' });
      setSelectedPost(null);
    }
  };

  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, message: '' });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaClipboardList className="text-3xl text-primary" />
          <h1 className="text-3xl font-bold">Pending Requests</h1>
        </div>
        <p className="text-base-content/60">
          Review and approve pending survey submissions
        </p>
        <div className="divider"></div>
      </div>

      {/* Content */}
      {pendingPosts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Stats */}
          <div className="stats shadow mb-6">
            <div className="stat">
              <div className="stat-title">Pending Posts</div>
              <div className="stat-value text-primary">{pendingPosts.length}</div>
              <div className="stat-desc">Awaiting review</div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPosts.map((post) => (
              <PendingPostCard
                key={post.pk_survey_id}
                post={post}
                onApprove={handleApproveClick}
                onReject={handleRejectClick}
              />
            ))}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmAction}
        type="approve"
        title="Approve Post"
        message={`Are you sure you want to approve "${selectedPost?.survey_title}"?`}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModal.isOpen}
        onClose={handleCloseRejectModal}
        onReject={handleRejectConfirm}
        postTitle={selectedPost?.survey_title}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={handleCloseErrorModal}
        message={errorModal.message}
      />

      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequest;
