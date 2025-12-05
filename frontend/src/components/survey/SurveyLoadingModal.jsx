/**
 * SurveyLoadingModal - Loading overlay shown during survey submission
 * @param {Object} props
 * @param {boolean} props.isVisible - Whether to show the modal
 * @param {string} props.message - Main loading message
 * @param {string} props.subMessage - Secondary message
 */
export default function SurveyLoadingModal({ 
  isVisible, 
  message = 'Submitting your response...', 
  subMessage = 'Please wait' 
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="p-8 rounded-xl shadow-xl text-center bg-white max-w-xs w-full mx-4">
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
