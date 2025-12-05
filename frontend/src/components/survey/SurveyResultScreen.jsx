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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 rounded-xl shadow-lg bg-white max-w-lg w-[90%] mx-4">
        {submitResult.success ? (
          <>
            <MdCheckCircle 
              className="mx-auto mb-4 text-6xl text-custom-green" 
            />
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Response Submitted!
            </h2>
            <p className="mb-6 text-gray-600">
              {submitResult.message || 'Thank you for completing this survey. Your response has been recorded.'}
            </p>
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm mb-4 text-gray-500">
                {surveyTitle}
              </p>
              <button
                onClick={onGoHome}
                className="btn gap-2 bg-custom-blue border-custom-blue text-white hover:bg-blue-800 hover:border-blue-800"
              >
                <MdHome className="text-xl" />
                Back to Home
              </button>
            </div>
          </>
        ) : (
          <>
            <MdError 
              className="mx-auto mb-4 text-6xl text-red-600" 
            />
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Submission Failed
            </h2>
            <p className="mb-2 text-gray-600">
              {Array.isArray(submitResult.message) 
                ? submitResult.message.join(', ') 
                : submitResult.message || 'Something went wrong. Please try again.'}
            </p>
            {submitResult.extraMsg && (
              <p className="text-sm mb-4 text-red-600">
                {submitResult.extraMsg}
              </p>
            )}
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={onTryAgain}
                className="btn bg-custom-blue border-custom-blue text-white hover:bg-blue-800 hover:border-blue-800"
              >
                Try Again
              </button>
              <button
                onClick={onGoHome}
                className="btn btn-outline border-custom-blue text-custom-blue hover:bg-blue-50 hover:border-custom-blue"
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
