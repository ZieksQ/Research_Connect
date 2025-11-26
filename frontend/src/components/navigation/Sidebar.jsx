import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { logoutUser } from "../../services/auth";

const Sidebar = () => {
  const { userInfo, setUserInfo } = useAuth();
  const navigate = useNavigate();
  const profile_pic_url = userInfo?.message?.user_info?.profile_pic_url;
  const username = userInfo?.message?.user_info?.username;
  const school = userInfo?.message?.user_info?.school;

  const handleLogout = async () => {
    // Add your logout logic here
    const data = await logoutUser();
    
    if (!data) {
        console.error("Error", data.message);
        return;
    }

    setUserInfo(null);
    navigate("/login");
  };

  return (
    <div className="bg-base-200 flex h-full flex-col">
      {/* Navigation Menu */}
      <ul className="menu w-full text-base-content flex-1 space-y-2 p-4 ">
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? "active-navbar" : "")}
          >
            <span>Homepage</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/home/profile"
            className={({ isActive }) => (isActive ? "active-navbar" : "")}
          >
            <span>Profile</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "active-navbar" : "")}
          >
            <span>Settings</span>
          </NavLink>
        </li>
      </ul>

      {/* Profile Section at Bottom */}
      <div className="border-base-300 border-t p-4">
        <div className="dropdown dropdown-top w-full">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost hover:bg-base-300 h-auto w-full justify-start p-2"
          >
            <div className="flex w-full items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={profile_pic_url || "https://via.placeholder.com/150"}
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <span className="w-full truncate text-sm font-semibold">
                  {username || "User"}
                </span>
                <span className="text-base-content/60 w-full truncate text-xs">
                  {school || "Unknown School"}
                </span>
              </div>
            </div>
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] mb-2 w-full p-2 shadow-lg"
          >
            <li>
              <button
                onClick={() => navigate("/home/profile")}
                className="flex items-center gap-2"
              >
                <FiUser size={16} />
                <span>View Profile</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2"
              >
                <FiSettings size={16} />
                <span>Settings</span>
              </button>
            </li>
            {/* <div className="divider my-1"></div> */}
            <li>
              <button
                onClick={handleLogout}
                className="text-error hover:bg-error/10 flex items-center gap-2"
              >
                <FiLogOut size={16} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
