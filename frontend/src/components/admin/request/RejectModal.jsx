import React, { useState } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

const RejectModal = ({ isOpen, onClose, onReject, postTitle }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const handleRejectClick = () => {
    if (!rejectReason.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirmReject = () => {
    onReject(rejectReason);
    setRejectReason('');
    setShowConfirmation(false);
  };

  const handleClose = () => {
    setRejectReason('');
    setShowConfirmation(false);
    onClose();
  };

  const handleBackToReason = () => {
    setShowConfirmation(false);
  };

  // Confirmation step
  if (showConfirmation) {
    return (
      <dialog className="modal modal-open">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg flex items-center gap-2 text-red-500">
            <FaTimesCircle />
            Confirm Rejection
          </h3>
          <div className="py-4">
            <p className="mb-4 text-gray-700">
              Are you sure you want to reject <strong>"{postTitle}"</strong>?
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Rejection reason:</p>
              <p className="text-sm text-gray-800">{rejectReason}</p>
            </div>
          </div>
          <div className="modal-action">
            <button onClick={handleBackToReason} className="btn btn-ghost text-gray-600 hover:bg-gray-100">
              Back
            </button>
            <button onClick={handleConfirmReject} className="btn bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600">
              Confirm Reject
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={handleClose}>
          <button>close</button>
        </form>
      </dialog>
    );
  }

  // Reason input step
  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg flex items-center gap-2 text-red-500">
          <FaTimesCircle />
          Reject Post
        </h3>
        <div className="py-4">
          <p className="mb-4 text-gray-700">
            Please provide a reason for rejecting <strong>"{postTitle}"</strong>:
          </p>
          <textarea
            className="textarea textarea-bordered w-full h-32 bg-white border-gray-300 focus:border-custom-blue focus:ring-custom-blue text-gray-800"
            placeholder="Enter the reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
        <div className="modal-action">
          <button onClick={handleClose} className="btn btn-ghost text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleRejectClick}
            disabled={!rejectReason.trim()}
            className="btn bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300"
          >
            Reject
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default RejectModal;
