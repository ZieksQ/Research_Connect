/**
 * SurveyNotFound - Displays message when survey is not found
 * @param {Object} props
 * @param {string} props.message - Custom message to display
 */
export default function SurveyNotFound({ message = 'Survey not found' }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-center">
        <p style={{ color: 'var(--color-text-secondary)' }}>{message}</p>
      </div>
    </div>
  );
}
