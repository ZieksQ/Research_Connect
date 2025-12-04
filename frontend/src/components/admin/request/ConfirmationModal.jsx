import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'approve' }) => {
  if (!isOpen) return null;

  const isApprove = type === 'approve';

  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-white">
        <h3 className={`font-bold text-lg flex items-center gap-2 ${isApprove ? 'text-custom-green' : 'text-red-500'}`}>
          {isApprove ? (
            <FaCheckCircle />
          ) : (
            <FaTimesCircle />
          )}
          {title}
        </h3>
        <p className="py-4 text-gray-700">{message}</p>
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${isApprove ? 'bg-custom-green border-custom-green text-white hover:bg-green-600 hover:border-green-600' : 'bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600'}`}
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
