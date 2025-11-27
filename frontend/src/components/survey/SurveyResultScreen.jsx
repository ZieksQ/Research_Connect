import { MdCheckCircle, MdError, MdHome } from 'react-icons/md';

/**
 * SurveyResultScreen - Displays success or error screen after survey submission
 * @param {Object} props
 * @param {Object} props.submitResult - { success: boolean, message: string, extraMsg?: string }
 * @param {string} props.surveyTitle - Title of the survey
 * @param {Function} props.onTryAgain - Callback when user clicks "Try Again"
 * @param {Function} props.onGoHome - Callback when user clicks "Go Home" or "Back to Home"
 */
export default function SurveyResultScreen({ submitResult, surveyTitle, onTryAgain, onGoHome }) {
  if (!submitResult) return null;

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-center p-8 rounded-xl shadow-lg" style={{ backgroundColor: '#ffffff', maxWidth: '500px', width: '90%' }}>
        {submitResult.success ? (
          <>
            <MdCheckCircle 
              className="mx-auto mb-4" 
              style={{ fontSize: '5rem', color: '#22c55e' }} 
            />
            <h2 
              className="text-2xl font-semibold mb-4" 
              style={{ color: 'var(--color-primary-color)' }}
            >
              Response Submitted!
            </h2>
            <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              {submitResult.message || 'Thank you for completing this survey. Your response has been recorded.'}
            </p>
            <div className="border-t pt-6" style={{ borderColor: 'var(--color-secondary-background)' }}>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {surveyTitle}
              </p>
              <button
                onClick={onGoHome}
                className="btn gap-2"
                style={{
                  backgroundColor: 'var(--color-accent-100)',
                  borderColor: 'var(--color-accent-100)',
                  color: '#ffffff'
                }}
              >
                <MdHome style={{ fontSize: '1.25rem' }} />
                Back to Home
              </button>
            </div>
          </>
        ) : (
          <>
            <MdError 
              className="mx-auto mb-4" 
              style={{ fontSize: '5rem', color: '#dc2626' }} 
            />
            <h2 
              className="text-2xl font-semibold mb-4" 
              style={{ color: 'var(--color-primary-color)' }}
            >
              Submission Failed
            </h2>
            <p className="mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              {Array.isArray(submitResult.message) 
                ? submitResult.message.join(', ') 
                : submitResult.message || 'Something went wrong. Please try again.'}
            </p>
            {submitResult.extraMsg && (
              <p className="text-sm mb-4" style={{ color: '#dc2626' }}>
                {submitResult.extraMsg}
              </p>
            )}
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={onTryAgain}
                className="btn"
                style={{
                  backgroundColor: 'var(--color-primary-color)',
                  borderColor: 'var(--color-primary-color)',
                  color: '#ffffff'
                }}
              >
                Try Again
              </button>
              <button
                onClick={onGoHome}
                className="btn btn-outline"
                style={{
                  borderColor: 'var(--color-primary-color)',
                  color: 'var(--color-primary-color)'
                }}
              >
                Go Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
