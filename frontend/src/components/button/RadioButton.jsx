import React from "react";

const RadioButton = ({ name, id, label, value, checked, onChange }) => {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all duration-200 ${
        checked 
          ? 'bg-blue-50 border-custom-blue shadow-sm' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <input
        type="radio"
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        checked={checked}
        className="radio radio-sm radio-primary mr-3 border-gray-400 checked:border-custom-blue checked:bg-custom-blue"
      />
      <span className={`text-sm ${checked ? 'text-custom-blue font-medium' : 'text-gray-700'}`}>
        {label}
      </span>
    </label>
  );
};

export default RadioButton;
