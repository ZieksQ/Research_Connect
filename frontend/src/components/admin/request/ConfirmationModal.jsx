import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'approve' }) => {
  if (!isOpen) return null;

  const isApprove = type === 'approve';

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg flex items-center gap-2">
          {isApprove ? (
            <FaCheckCircle className="text-success" />
          ) : (
            <FaTimesCircle className="text-error" />
          )}
          {title}
        </h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${isApprove ? 'btn-success' : 'btn-error'}`}
          >
            {isApprove ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ConfirmationModal;
