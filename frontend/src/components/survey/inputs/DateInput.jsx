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
      className={`input input-bordered w-full ${hasError ? 'input-error' : ''}`}
      style={{
        backgroundColor: 'var(--color-background)',
        borderColor: hasError ? '#dc2626' : 'var(--color-shade-primary)',
        color: 'var(--color-primary-color)'
      }}
    />
  );
}
