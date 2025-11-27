import { MdStar, MdStarBorder } from 'react-icons/md';

/**
 * RatingInput - Star rating input component for surveys
 * @param {Object} props
 * @param {number} props.value - Current rating value
 * @param {Function} props.onChange - Change handler
 * @param {number} props.maxRating - Maximum rating value (default: 5)
 */
export default function RatingInput({ value, onChange, maxRating = 5 }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="btn btn-ghost btn-lg p-0"
          style={{ color: 'var(--color-accent-100)' }}
        >
          {value >= star ? (
            <MdStar 
              style={{ 
                fontSize: 'clamp(2rem, 4vw, 2.5rem)'
              }} 
            />
          ) : (
            <MdStarBorder 
              style={{ 
                fontSize: 'clamp(2rem, 4vw, 2.5rem)'
              }} 
            />
          )}
        </button>
      ))}
      {value && (
        <span 
          className="ml-3 self-center" 
          style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
          }}
        >
          {value} / {maxRating}
        </span>
      )}
    </div>
  );
}
