import { MdCheckCircle, MdError, MdClose } from 'react-icons/md';

export default function PublishResultModal({ isOpen, success, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="p-8 rounded-xl shadow-xl text-center bg-white max-w-md w-[90%]">
        {success ? (
          <>
            <MdCheckCircle className="mx-auto mb-4 text-6xl text-custom-green" />
            <h2 className="text-xl font-bold mb-3 text-gray-900">
              Success!
            </h2>
            <p className="mb-4 text-gray-600">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to home in 3 seconds...
            </p>
          </>
        ) : (
          <>
            <MdError className="mx-auto mb-4 text-6xl text-red-600" />
            <h2 className="text-xl font-bold mb-3 text-gray-900">
              Publishing Failed
            </h2>
            <p className="mb-4 text-gray-600">
              {message}
            </p>
            <button
              onClick={onClose}
              className="btn bg-custom-blue hover:bg-blue-700 text-white border-none"
            >
              <MdClose className="mr-1" /> Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
