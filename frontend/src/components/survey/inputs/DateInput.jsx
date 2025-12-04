/**
 * DateInput - Date input component for surveys
 * @param {Object} props
 * @param {string} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.hasError - Whether field has validation error
 */
export default function DateInput({ value, onChange, hasError }) {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`input input-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900 ${
        hasError ? 'input-error' : 'border-gray-300'
      }`}
    />
  );
}
