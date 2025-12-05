/**
 * SurveyProgressIndicator - Visual progress dots for survey sections
 * @param {Object} props
 * @param {number} props.totalSections - Total number of sections
 * @param {number} props.currentIndex - Current section index (0-based)
 */
export default function SurveyProgressIndicator({ totalSections, currentIndex }) {
  return (
    <div className="mt-6">
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalSections }, (_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-custom-blue' 
                : index < currentIndex 
                  ? 'w-2 bg-custom-blue/50' 
                  : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
