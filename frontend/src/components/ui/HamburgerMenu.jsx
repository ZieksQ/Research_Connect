import React from "react";
import HambergerLinks from "./HambergerLinks.jsx";

const HambergerMenu = ({ isMenuShown, MenuList }) => {
  return (
    <div>
      {isMenuShown && (
        <div className="drop-down-menu top-15 rounded-md bg-[#EEEEEE]">
          {MenuList.map((e, index) => (
            <HambergerLinks key={index} icon={e.icon} name={e.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HambergerMenu;
