import React from "react";
import HambergerLinks from "./HambergerLinks.jsx";

// This is the container of Menus from Hamburger Menu
// !TODO: Add more settings & Remove add button 
const HambergerMenu = ({ isMenuShown, MenuList, handleOpenMenu }) => {
  return (
    <div>
      {isMenuShown && (
        <div className="drop-down-menu top-15 left-4 rounded-md bg-secondary-background">
          {MenuList.map((e, index) => (
            <HambergerLinks key={index} icon={e.icon} name={e.name} func={handleOpenMenu}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default HambergerMenu;
