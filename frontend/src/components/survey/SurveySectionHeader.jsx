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
    <div 
      className="rounded-xl shadow-lg mb-6" 
      style={{ 
        backgroundColor: '#ffffff',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 
          style={{ 
            color: 'var(--color-primary-color)',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)'
          }}
        >
          {title}
        </h2>
        <span 
          style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'clamp(0.75rem, 1.25vw, 0.9375rem)'
          }}
        >
          Section {currentIndex + 1} of {totalSections}
        </span>
      </div>
      {description && (
        <p 
          style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)'
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
