import React from "react";

const RadioButton = ({ name, id, label, value, checked, onChange }) => {
  return (
    <label
      htmlFor={id}
      className="scale-transition hover:bg-neutral-content active:bg-primary-content flex cursor-pointer items-center rounded-md border-1 p-2 shadow"
    >
      <input
        type="radio"
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        checked={checked}
        className="radio radio-sm mr-2"
      />
      {label}
    </label>
  );
};

export default RadioButton;
