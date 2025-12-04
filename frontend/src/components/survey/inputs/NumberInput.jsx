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
      className={`input input-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900 placeholder-gray-400 text-base lg:text-lg p-2 lg:p-3 ${
        hasError ? 'input-error' : 'border-gray-300'
      }`}
      placeholder={placeholder}
    />
  );
}
