/**
 * SurveyHeader - Displays the survey title, description, and estimated time
 * @param {Object} props
 * @param {string} props.title - Survey title
 * @param {string} props.description - Survey description/content
 * @param {string} props.approxTime - Estimated time to complete
 */
export default function SurveyHeader({ title, description, approxTime }) {
  return (
    <div 
      className="rounded-xl shadow-lg mb-6 border-t-8 border-primary" 
      style={{ 
        backgroundColor: '#ffffff',
        padding: 'clamp(2rem, 4vw, 3.5rem)'
      }}
    >
      <h1 
        style={{ 
          color: 'var(--color-primary-color)',
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          marginBottom: 'clamp(1rem, 2vw, 1.5rem)'
        }}
      >
        {title}
      </h1>
      <p 
        style={{ 
          color: 'var(--color-text-secondary)',
          fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
          marginBottom: 'clamp(1rem, 2vw, 1.5rem)'
        }}
      >
        {description}
      </p>
      {approxTime && (
        <div className="flex items-center gap-2">
          <div 
            className="badge" 
            style={{ 
              backgroundColor: 'var(--color-secondary-background)',
              color: 'var(--color-primary-color)',
              border: 'none',
              padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem)',
              fontSize: 'clamp(0.75rem, 1.25vw, 0.9375rem)'
            }}
          >
            ⏱️ {approxTime}
          </div>
        </div>
      )}
    </div>
  );
}
