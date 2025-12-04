/**
 * CheckboxInput - Checkbox/multiple choice input component for surveys
 * @param {Object} props
 * @param {Array} props.value - Currently selected values
 * @param {Function} props.onChange - Change handler (receives optionId)
 * @param {Array} props.options - Array of options (string or { pk_option_id, option_text })
 * @param {number} props.minChoice - Minimum selections required
 * @param {number} props.maxChoice - Maximum selections allowed
 */
export default function CheckboxInput({ value = [], onChange, options, minChoice = 1, maxChoice = 1 }) {
  if (!options || options.length === 0) {
    return <p className="text-gray-500 italic">No options available</p>;
  }

  const selectedCount = value.length;

  return (
    <div>
      {maxChoice > 1 && (
        <p className="text-xs mb-3 text-gray-500 font-medium">
          Select {minChoice === maxChoice 
            ? `exactly ${maxChoice}`
            : `${minChoice} to ${maxChoice}`} option(s)
          {selectedCount > 0 && ` (${selectedCount} selected)`}
        </p>
      )}
      <div className="space-y-2">
        {options.map((option, idx) => {
          const optionId = typeof option === 'string' ? option : option.pk_option_id;
          const optionText = typeof option === 'string' ? option : option.option_text;
          const isSelected = value.includes(optionId);
          return (
            <label
              key={optionId || idx}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                isSelected 
                  ? 'bg-custom-blue/10 border-custom-blue' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onChange(optionId)}
                className="checkbox checkbox-sm border-gray-300 checked:border-custom-blue [--chkbg:theme(colors.custom-blue)] [--chkfg:white]"
              />
              <span className={`text-base ${isSelected ? 'text-custom-blue font-medium' : 'text-gray-700'}`}>
                {optionText}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
