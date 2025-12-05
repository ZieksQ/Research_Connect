import React, { useState, useEffect, lazy, Suspense } from 'react';
import { getPendingPosts, approvePost, rejectPost } from '../../services/user/admin.service';
import {
  ConfirmationModal,
  RejectModal,
  ErrorModal,
  EmptyState,
} from '../../components/admin/request';
import { FaClipboardList } from 'react-icons/fa';

const PendingPostCard = lazy(() => import('../../components/admin/request/PendingPostCard'));

const PendingPostSkeleton = () => (
  <div className="card bg-white shadow-lg border border-gray-200">
    <div className="card-body">
      <div className="flex items-center gap-3 mb-3">
        <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
        <div>
          <div className="skeleton h-4 w-24 mb-1"></div>
          <div className="skeleton h-3 w-16"></div>
        </div>
      </div>
      <div className="skeleton h-6 w-3/4 mb-2"></div>
      <div className="skeleton h-4 w-full mb-1"></div>
      <div className="skeleton h-4 w-full mb-1"></div>
      <div className="skeleton h-4 w-2/3 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="skeleton h-5 w-16 rounded-full"></div>
        <div className="skeleton h-5 w-16 rounded-full"></div>
      </div>
      <div className="flex justify-end gap-2">
        <div className="skeleton h-8 w-20 rounded-lg"></div>
        <div className="skeleton h-8 w-20 rounded-lg"></div>
        <div className="skeleton h-8 w-20 rounded-lg"></div>
      </div>
    </div>
  </div>
);

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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaClipboardList className="text-3xl text-custom-blue" />
            <h1 className="text-3xl font-bold text-custom-blue">Pending Requests</h1>
          </div>
          <p className="text-gray-500">
            Review and approve pending survey submissions
          </p>
          <div className="divider"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <PendingPostSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaClipboardList className="text-3xl text-custom-blue" />
          <h1 className="text-3xl font-bold text-custom-blue">Pending Requests</h1>
        </div>
        <p className="text-gray-500">
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
          <div className="stats shadow mb-6 bg-white border border-gray-200">
            <div className="stat">
              <div className="stat-title text-gray-500">Pending Posts</div>
              <div className="stat-value text-custom-blue">{pendingPosts.length}</div>
              <div className="stat-desc text-gray-400">Awaiting review</div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPosts.map((post) => (
              <Suspense key={post.pk_survey_id} fallback={<PendingPostSkeleton />}>
                <PendingPostCard
                  post={post}
                  onApprove={handleApproveClick}
                  onReject={handleRejectClick}
                />
              </Suspense>
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
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <span className="loading loading-spinner loading-lg text-custom-blue"></span>
            <p className="mt-4 text-gray-700">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequest;
