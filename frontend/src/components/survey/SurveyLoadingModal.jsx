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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="p-8 rounded-xl shadow-xl text-center" style={{ backgroundColor: '#ffffff', maxWidth: '300px' }}>
        <span className="loading loading-spinner loading-lg" style={{ color: 'var(--color-accent-100)' }}></span>
        <p className="mt-4 font-medium" style={{ color: 'var(--color-primary-color)' }}>
          {message}
        </p>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
          {subMessage}
        </p>
      </div>
    </div>
  );
}
