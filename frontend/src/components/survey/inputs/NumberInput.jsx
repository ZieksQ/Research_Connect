/**
 * NumberInput - Number input component for surveys
 * @param {Object} props
 * @param {string|number} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.hasError - Whether field has validation error
 * @param {string} props.placeholder - Input placeholder
 */
export default function NumberInput({ value, onChange, hasError, placeholder = 'Enter a number' }) {
  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if ([46, 8, 9, 27, 13, 110, 190].includes(e.keyCode) ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39) ||
        // Allow: minus sign for negative numbers
        e.keyCode === 189 || e.keyCode === 109) {
      return;
    }
    // Ensure that it is a number and stop the keypress if not
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
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
