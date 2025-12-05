/**
 * SurveySectionHeader - Displays the current section title and progress
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {number} props.currentIndex - Current section index (0-based)
 * @param {number} props.totalSections - Total number of sections
 */
export default function SurveySectionHeader({ title, description, currentIndex, totalSections }) {
  return (
    <div className="rounded-xl shadow-lg mb-6 bg-white p-6 lg:p-10 border-l-4 border-custom-green">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-900 text-xl lg:text-3xl font-semibold">
          {title}
        </h2>
        <span className="text-gray-500 text-xs lg:text-sm font-medium">
          Section {currentIndex + 1} of {totalSections}
        </span>
      </div>
      {description && (
        <p className="text-gray-600 text-sm lg:text-lg mt-2">
          {description}
        </p>
      )}
    </div>
  );
}
