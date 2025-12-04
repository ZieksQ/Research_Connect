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
    <div className="flex gap-2 flex-wrap items-center">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="btn btn-ghost btn-lg p-0 hover:bg-transparent"
        >
          {value >= star ? (
            <MdStar 
              className="text-yellow-400 text-4xl lg:text-5xl transition-transform hover:scale-110"
            />
          ) : (
            <MdStarBorder 
              className="text-gray-300 text-4xl lg:text-5xl transition-transform hover:scale-110 hover:text-yellow-200"
            />
          )}
        </button>
      ))}
      {value && (
        <span className="ml-3 text-gray-500 font-medium text-base lg:text-lg">
          {value} / {maxRating}
        </span>
      )}
    </div>
  );
}
