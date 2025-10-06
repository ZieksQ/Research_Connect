import React from "react";

// Reusable components for radio buttons in forms
const RadioButton = ({ Name, Id, Label }) => {
  return (
    <label
      htmlFor={Id}
      className="scale-transition hover:bg-neutral-content active:bg-primary-content flex cursor-pointer items-center rounded-md border-1 p-2 shadow"
    >
      <input
        type="radio"
        name={Name}
        id={Id}
        value={Id}
        className="radio radio-sm hover:radio-neutra-content mr-2"
      />
      {Label}
    </label>
  );
};

export default RadioButton;
