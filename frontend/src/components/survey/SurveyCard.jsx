import React, { useRef } from "react";
import RadioButton from "../button/RadioButton.jsx";

const SurveyCard = ({ data, value, onChange }) => {
  const { id, name, title, type, options } = data; // ✅ include name
  const formRef = useRef(null);

  const clearRadios = (e) => {
    e.preventDefault();
    const radios = formRef.current.querySelectorAll('input[type="radio"]');
    radios.forEach((r) => (r.checked = false));
    onChange(name, ""); // ✅ also clear the stored answer
  };

  return (
    <div className="bg-white border border-gray-200 flex h-auto w-full flex-col space-y-4 rounded-xl px-6 py-6 shadow-sm">
      <div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>

      <div ref={formRef} className="flex flex-col space-y-2">
        {options?.map((opt, index) => (
          <RadioButton
            key={index}
            name={name} // ✅ use question name here
            id={`${id}-${index}`}
            value={opt}
            label={opt}
            checked={value === opt}
            onChange={() => onChange(name, opt)} // ✅ safe callback
          />
        ))}
      </div>

      <button
        onClick={clearRadios}
        type="button"
        className="btn btn-sm btn-error text-white ml-auto"
      >
        Clear
      </button>
    </div>
  );
};

export default SurveyCard;
