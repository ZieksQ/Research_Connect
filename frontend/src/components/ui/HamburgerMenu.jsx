import React from "react";
<<<<<<< HEAD
import HambergerLinks from "./HambergerLinks.jsx";

const HambergerMenu = ({ isMenuShown, MenuList }) => {
  return (
    <div>
      {isMenuShown && (
        <div className="drop-down-menu top-15 rounded-md bg-[#EEEEEE]">
          {MenuList.map((e, index) => (
            <HambergerLinks key={index} icon={e.icon} name={e.name} />
=======
import { navbarLinks } from "../../static/navbarMenuLinks.js";
import HambergerLinks from "./HambergerLinks.jsx";
import { hamburgerMenuLinks } from "../../static/hamburgerMenuLinks.js";

const HambergerMenu = ({ isMenuShown, handleOpenMenu }) => {
  const icons = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 448 512",
    size: "4",
    d: "M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"
  }
  return (
    <div>
      {isMenuShown && (
        <div className="absolute top-15 flex h-auto w-[30dvh] flex-col rounded-md bg-[#EEEEEE]">
          {hamburgerMenuLinks.map((e, index) => (
            <HambergerLinks key={index} icon={e.icon} name={e.name}/>
>>>>>>> b9e6eaf (optimizing react reusable components | needs more tailwind and component optimization)
          ))}
        </div>
      )}
    </div>
  );
};

export default HambergerMenu;
