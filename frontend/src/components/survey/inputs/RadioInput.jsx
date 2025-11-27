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
    return <p style={{ color: 'var(--color-text-secondary)' }}>No options available</p>;
  }

  return (
    <div className="space-y-2">
      {options.map((option, idx) => {
        const optionId = typeof option === 'string' ? option : option.pk_option_id;
        const optionText = typeof option === 'string' ? option : option.option_text;
        return (
          <label
            key={optionId || idx}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-opacity-50 transition-colors"
            style={{
              backgroundColor: value === optionId
                ? 'rgba(80, 87, 233, 0.1)'
                : 'var(--color-background)'
            }}
          >
            <input
              type="radio"
              name={questionId}
              checked={value === optionId}
              onChange={() => onChange(optionId)}
              className="radio"
              style={{ borderColor: 'var(--color-accent-100)' }}
            />
            <span style={{ color: 'var(--color-primary-color)' }}>{optionText}</span>
          </label>
        );
      })}
    </div>
  );
}
