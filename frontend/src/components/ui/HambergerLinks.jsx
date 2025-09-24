import React from "react";

// This Component is for the Menus inside the Hamburger Menu
// This is a reusable component can also be add to a drop down menu
// Add icon/logo, name of the button, function
const HambergerLinks = ({ icon, name, func }) => {
  return (
    <button
      onClick={func}
      className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-200 active:bg-gray-300"
    >
      {/* Add New Button */}
      <svg xmlns={icon.xmlns} viewBox={icon.viewBox} className="icon-size">
        <path d={icon.d} />
      </svg>
      <span>{name}</span>
    </button>
  );
};

export default HambergerLinks;
