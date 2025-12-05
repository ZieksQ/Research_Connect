/**
 * RadioInput - Radio button/single choice input component for surveys
 * @param {Object} props
 * @param {string} props.questionId - Question ID for grouping
 * @param {string|number} props.value - Currently selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.options - Array of options (string or { pk_option_id, option_text })
 */
export default function RadioInput({ questionId, value, onChange, options }) {
  if (!options || options.length === 0) {
    return <p className="text-gray-500 italic">No options available</p>;
  }

  return (
    <div className="space-y-2">
      {options.map((option, idx) => {
        const optionId = typeof option === 'string' ? option : option.pk_option_id;
        const optionText = typeof option === 'string' ? option : option.option_text;
        const isSelected = value === optionId;
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
              type="radio"
              name={questionId}
              checked={isSelected}
              onChange={() => onChange(optionId)}
              className="radio radio-sm border-gray-300 checked:border-custom-blue checked:bg-custom-blue"
            />
            <span className={`text-base ${isSelected ? 'text-custom-blue font-medium' : 'text-gray-700'}`}>
              {optionText}
            </span>
          </label>
        );
      })}
    </div>
  );
}
