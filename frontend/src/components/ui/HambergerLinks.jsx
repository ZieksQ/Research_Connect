import React from "react";

// This Component is for the Menus inside the Hamburger Menu
// This is a reusable component can also be add to a drop down menu
// Add icon/logo, name of the button, function
const HambergerLinks = ({ icon, name, func }) => {
  return (
    <button
      onClick={func}
      className="flex items-center gap-2 rounded-md p-2 hover:bg-blue-50 hover:text-custom-blue active:bg-blue-100 transition-colors w-full text-left"
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
