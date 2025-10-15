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
    <div className="bg-base-100 border flex h-auto w-full flex-col space-y-4 rounded-sm px-4 py-6 shadow">
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
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
        className="btn btn-error text-white ml-auto w-[25%]"
      >
        Clear
      </button>
    </div>
  );
};

export default SurveyCard;
