/**
 * DropdownInput - Dropdown/select input component for surveys
 * @param {Object} props
 * @param {string} props.value - Currently selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.options - Array of options (string or { pk_option_id, option_text })
 * @param {boolean} props.hasError - Whether field has validation error
 * @param {string} props.placeholder - Placeholder text
 */
export default function DropdownInput({ 
  value, 
  onChange, 
  options, 
  hasError, 
  placeholder = 'Choose an option' 
}) {
  if (!options || options.length === 0) {
    return <p className="text-gray-500 italic">No options available</p>;
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`select select-bordered w-full bg-gray-50 focus:bg-white focus:border-custom-blue text-gray-900 ${
        hasError ? 'select-error' : 'border-gray-300'
      }`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option, idx) => {
        const optionId = typeof option === 'string' ? option : option.pk_option_id;
        const optionText = typeof option === 'string' ? option : option.option_text;
        return (
          <option key={optionId || idx} value={optionId}>
            {optionText}
          </option>
        );
      })}
    </select>
  );
}
