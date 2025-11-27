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
      className={`input input-bordered w-full ${hasError ? 'input-error' : ''}`}
      style={{
        backgroundColor: 'var(--color-background)',
        borderColor: hasError ? '#dc2626' : 'var(--color-shade-primary)',
        color: 'var(--color-primary-color)',
        fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
        padding: 'clamp(0.5rem, 1vw, 0.75rem)'
      }}
      placeholder={placeholder}
    />
  );
}
