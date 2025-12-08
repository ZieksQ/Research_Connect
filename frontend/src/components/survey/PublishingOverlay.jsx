export default function PublishingOverlay({ isOpen, message = 'Publishing your survey...', subMessage = 'Please wait' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="p-8 rounded-xl shadow-xl text-center bg-white max-w-xs w-full">
        <span className="loading loading-spinner loading-lg text-custom-blue"></span>
        <p className="mt-4 font-medium text-gray-900">
          {message}
        </p>
        <p className="text-sm mt-2 text-gray-500">
          {subMessage}
        </p>
      </div>
    </div>
  );
}
