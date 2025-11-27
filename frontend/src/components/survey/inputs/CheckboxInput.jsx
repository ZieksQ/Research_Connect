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
    return <p style={{ color: 'var(--color-text-secondary)' }}>No options available</p>;
  }

  const selectedCount = value.length;

  return (
    <div>
      {maxChoice > 1 && (
        <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
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
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-opacity-50 transition-colors"
              style={{
                backgroundColor: isSelected
                  ? 'rgba(80, 87, 233, 0.1)'
                  : 'var(--color-background)'
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onChange(optionId)}
                className="checkbox"
                style={{ borderColor: 'var(--color-accent-100)' }}
              />
              <span style={{ color: 'var(--color-primary-color)' }}>{optionText}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
