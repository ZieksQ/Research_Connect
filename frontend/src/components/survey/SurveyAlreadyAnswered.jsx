import { MdCheckCircle } from 'react-icons/md';

/**
 * SurveyAlreadyAnswered - Displays message when survey has already been completed
 * @param {Object} props
 * @param {string} props.message - Custom message to display
 */
export default function SurveyAlreadyAnswered({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 rounded-xl shadow-lg bg-white max-w-lg w-full mx-4">
        <MdCheckCircle 
          className="mx-auto mb-4 text-6xl text-custom-green" 
        />
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Survey Already Completed
        </h2>
        <p className="text-gray-500">
          {message || 'You have already answered this survey'}
        </p>
      </div>
    </div>
  );
}
