import { MdCheckCircle } from 'react-icons/md';

export default function PublishConfirmModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="p-8 rounded-xl shadow-xl text-center bg-white max-w-md w-[90%]">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
          <MdCheckCircle className="text-4xl text-custom-blue" />
        </div>
        <h2 className="text-xl font-bold mb-3 text-gray-900">
          Publish Survey?
        </h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to publish this survey? Once submitted, it will be sent for admin approval.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="btn btn-ghost text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-custom-blue hover:bg-blue-700 text-white border-none"
          >
            Yes, Continue
          </button>
        </div>
      </div>
    </div>
  );
}
