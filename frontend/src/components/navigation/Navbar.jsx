import React from "react";
import InquiraIcon from "../../assets/icons/Inquira.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <header className="navbar bg-base-100 shadow-md border-b border-base-300">
      <div className="navbar-start">
        <button
          onClick={toggleSidebar}
          className="btn btn-square btn-ghost"
        >
          {sidebarOpen ? (
            <IoCloseSharp size={24} />
          ) : (
            <GiHamburgerMenu size={22} />
          )}
        </button>

        <Link to="/home" className="btn btn-ghost normal-case text-xl ml-2">
          <img src={InquiraIcon} alt="Inquira"/>
        </Link>
      </div>

      <div className="navbar-center">
        {/* Add search or other center content here */}
      </div>

      <div className="navbar-end">
        {/* Add profile menu or other end content here */}
      </div>
    </header>
  );
};

export default Navbar;
