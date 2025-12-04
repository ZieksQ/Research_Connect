/**
 * SurveyNotFound - Displays message when survey is not found
 * @param {Object} props
 * @param {string} props.message - Custom message to display
 */
export default function SurveyNotFound({ message = 'Survey not found' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <p className="text-gray-500 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}
