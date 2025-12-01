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
        <div className="modal-box">
          <h3 className="font-bold text-lg flex items-center gap-2 text-error">
            <FaTimesCircle />
            Confirm Rejection
          </h3>
          <div className="py-4">
            <p className="mb-4">
              Are you sure you want to reject <strong>"{postTitle}"</strong>?
            </p>
            <div className="bg-base-200 p-4 rounded-lg">
              <p className="text-sm text-base-content/60 mb-1">Rejection reason:</p>
              <p className="text-sm">{rejectReason}</p>
            </div>
          </div>
          <div className="modal-action">
            <button onClick={handleBackToReason} className="btn btn-ghost">
              Back
            </button>
            <button onClick={handleConfirmReject} className="btn btn-error">
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
      <div className="modal-box">
        <h3 className="font-bold text-lg flex items-center gap-2 text-error">
          <FaTimesCircle />
          Reject Post
        </h3>
        <div className="py-4">
          <p className="mb-4">
            Please provide a reason for rejecting <strong>"{postTitle}"</strong>:
          </p>
          <textarea
            className="textarea textarea-bordered w-full h-32"
            placeholder="Enter the reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
        <div className="modal-action">
          <button onClick={handleClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            onClick={handleRejectClick}
            disabled={!rejectReason.trim()}
            className="btn btn-error"
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
