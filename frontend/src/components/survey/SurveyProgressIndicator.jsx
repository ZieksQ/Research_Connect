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
            className="h-2 rounded-full transition-all"
            style={{
              width: index === currentIndex ? '32px' : '8px',
              backgroundColor: index <= currentIndex
                ? 'var(--color-accent-100)'
                : 'var(--color-secondary-background)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
