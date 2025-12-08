/**
 * SurveyHeader - Displays the survey title, description, and estimated time
 * @param {Object} props
 * @param {string} props.title - Survey title
 * @param {string} props.description - Survey description/content
 * @param {string} props.approxTime - Estimated time to complete
 */
export default function SurveyHeader({ title, description, approxTime }) {
  return (
    <div className="rounded-xl shadow-lg mb-6 border-t-8 border-custom-blue bg-white p-8 lg:p-14">
      <h1 className="text-gray-900 text-2xl lg:text-4xl font-bold mb-4 lg:mb-6">
        {title}
      </h1>
      <p className="text-gray-600 text-sm lg:text-lg mb-4 lg:mb-6 leading-relaxed">
        {description}
      </p>
      {approxTime && (
        <div className="flex items-center gap-2">
          <div className="badge bg-gray-100 text-custom-blue border-none px-3 py-3 text-xs lg:text-sm font-medium">
            ⏱️ {approxTime}
          </div>
        </div>
      )}
    </div>
  );
}
