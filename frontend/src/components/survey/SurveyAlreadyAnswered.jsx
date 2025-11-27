import { MdCheckCircle } from 'react-icons/md';

/**
 * SurveyAlreadyAnswered - Displays message when survey has already been completed
 * @param {Object} props
 * @param {string} props.message - Custom message to display
 */
export default function SurveyAlreadyAnswered({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-center p-8 rounded-xl shadow-lg" style={{ backgroundColor: '#ffffff', maxWidth: '500px' }}>
        <MdCheckCircle 
          className="mx-auto mb-4" 
          style={{ fontSize: '4rem', color: 'var(--color-accent-100)' }} 
        />
        <h2 
          className="text-2xl font-semibold mb-4" 
          style={{ color: 'var(--color-primary-color)' }}
        >
          Survey Already Completed
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {message || 'You have already answered this survey'}
        </p>
      </div>
    </div>
  );
}
