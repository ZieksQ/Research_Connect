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
      className={`textarea textarea-bordered w-full ${hasError ? 'textarea-error' : ''}`}
      rows={rows}
      style={{
        backgroundColor: 'var(--color-background)',
        borderColor: hasError ? '#dc2626' : 'var(--color-shade-primary)',
        color: 'var(--color-primary-color)'
      }}
      placeholder={placeholder}
    />
  );
}
