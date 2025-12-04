/**
 * LongTextInput - Textarea component for surveys
 * @param {Object} props
 * @param {string} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.hasError - Whether field has validation error
 * @param {string} props.placeholder - Input placeholder
 * @param {number} props.rows - Number of rows
 */
export default function LongTextInput({ 
  value, 
  onChange, 
  hasError, 
  placeholder = 'Your answer',
  rows = 5 
}) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`textarea textarea-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900 placeholder-gray-400 ${
        hasError ? 'textarea-error' : 'border-gray-300'
      }`}
      rows={rows}
      placeholder={placeholder}
    />
  );
}
