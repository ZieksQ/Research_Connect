import React from "react";

// This is a reusable Button 
// Use this as Primary Button 
// To use it just import this component 
// <PrimaryButton Text={Your Text Here}>
// Style Props to add custom css to it because className Doesn't work
// Manually add size to it if you prefer custom width
const PrimaryButton = ({Text, Style}) => {
  return (
    <button className={`bg-accent-100 rounded-lg py-1 px-2 text-white shadow-sm/10 hover:shadow-accent-100 hover:shadow-md/30 ${Style}`}>
      {Text}
    </button>
  );
};

export default PrimaryButton;
