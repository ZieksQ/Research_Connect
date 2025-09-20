import React from "react";

const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between bg-cyan-600 px-2 py-2">
      <div>
        {/* Logo */}
        <h3>Research Connect</h3>
      </div>

      {/* Navbar Menus */}
      <ul className="flex items-center justify-between gap-4">
        <li>
          <a href="#">Responses</a>
        </li>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Analytics</a>
        </li>
      </ul>

      <div className="flex content-center items-center gap-2">
        {/* Navbar User Profile Menu */}
        <h4>User Name</h4>
        {/* Placeholder Image Only */}
        <img
          src="https://i.pinimg.com/736x/45/b0/4b/45b04b86cf94aff2581d510f83e3fef8.jpg"
          alt="user profile"
          className="size-12 rounded-full cursor-pointer"
        />
      </div>
    </nav>
  );
};

export default Navbar;
