import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg flex items-center gap-2 text-red-500">
          <FaExclamationTriangle />
          Error
        </h3>
        <p className="py-4 text-gray-700">{message}</p>
        <div className="modal-action">
          <button onClick={onClose} className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 border-none">
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ErrorModal;
