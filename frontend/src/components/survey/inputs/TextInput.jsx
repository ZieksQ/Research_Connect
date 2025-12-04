/**
 * TextInput - Short text input component for surveys
 * @param {Object} props
 * @param {string} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.hasError - Whether field has validation error
 * @param {string} props.placeholder - Input placeholder
 */
export default function TextInput({ value, onChange, hasError, placeholder = 'Your answer' }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`input input-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900 placeholder-gray-400 text-base lg:text-lg p-2 lg:p-3 ${
        hasError ? 'input-error' : 'border-gray-300'
      }`}
      placeholder={placeholder}
    />
  );
}
