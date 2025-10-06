import React, { useRef } from "react";
import RadioButton from "../button/RadioButton";

// This Component is for Individual Cards in Survey
// TODO: Add Conditional Rendering for each Type of Questionaire
const SurveyCard = ({Title, Name, Options}) => {
  const formRef = useRef(null);

  const clearRadios = (e) => {
    e.preventDefault() // Prevents to reload the page when submit

    const radios = formRef.current.querySelectorAll('input[type="radio"]'); // Selects input radio type
    radios.forEach((r) => (r.checked = false)); // unchecks radio buttons
  };

  return (
    <div className="bg-base-100 flex h-auto w-full flex-col space-y-4 rounded-sm px-4 py-6 shadow">
      {/* ------------ TITLE -------------- */}
      <div>
        <h3 className="text-xl font-bold">{Title}</h3>
      </div>
      {/* ------------ BUTTONS -------------- */}
      {/* Conditional Rendering for each quentionaire type */}
      
      <div ref={formRef} className="flex flex-col space-y-2">
        {Options.map((e, index) => (
          <RadioButton key={index} Name={Name} Id={e.id} Label={e.Label} />
        ))}
      </div>
      <button onClick={clearRadios} className="btn btn-error w-[25%] ml-auto">
        Clear
      </button>
    </div>
  );
};

export default SurveyCard;
