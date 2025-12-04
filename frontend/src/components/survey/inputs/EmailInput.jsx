/**
 * EmailInput - Email input component for surveys with validation
 * @param {Object} props
 * @param {string} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.hasError - Whether field has validation error
 * @param {string} props.placeholder - Input placeholder
 */

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function EmailInput({ value, onChange, hasError, placeholder = 'your.email@example.com' }) {
  const emailValue = value || '';
  const isEmailInvalid = emailValue && !isValidEmail(emailValue);

  return (
    <div>
      <label className={`input input-bordered flex items-center gap-2 w-full bg-gray-50 focus-within:bg-white focus-within:border-custom-blue ${
        hasError || isEmailInvalid ? 'input-error' : 'border-gray-300'
      }`}>
        <svg className="h-[1em] opacity-50 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </g>
        </svg>
        <input
          type="email"
          value={emailValue}
          onChange={(e) => onChange(e.target.value)}
          className="grow bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
          placeholder={placeholder}
        />
      </label>
      {isEmailInvalid && !hasError && (
        <p className="text-sm mt-2 flex items-center gap-1 text-red-600 font-medium">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
          </svg>
          Please enter a valid email address
        </p>
      )}
    </div>
  );
}

export { isValidEmail };
