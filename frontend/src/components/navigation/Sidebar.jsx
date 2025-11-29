import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiLogOut, FiSettings, FiUser, FiX } from "react-icons/fi";
import { logoutUser } from "../../services/auth";

const Sidebar = ({ onClose, navLinks = [] }) => {
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
      {/* Mobile Close Button */}
      <div className="lg:hidden flex justify-end p-[clamp(12px,3vw,16px)]">
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle"
          aria-label="Close sidebar"
        >
          <FiX size={20} />
        </button>
      </div>
      {/* Navigation Menu */}
      <ul className="menu w-full text-base-content flex-1 space-y-[clamp(8px,1vw,12px)] p-[clamp(12px,2vw,20px)] text-[clamp(14px,1vw,16px)]">
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-[clamp(10px,1.5vw,14px)] p-[clamp(10px,1vw,14px)] ${
                    link.isBackLink 
                      ? 'hover:bg-warning/20 hover:text-warning' 
                      : isActive 
                        ? 'active-navbar' 
                        : ''
                  }`
                }
              >
                <IconComponent className="w-[clamp(18px,1.2vw,22px)] h-[clamp(18px,1.2vw,22px)]" />
                <span>{link.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* Profile Section at Bottom */}
      <div className="border-base-300 border-t p-[clamp(12px,2vw,20px)]">
        <div className="dropdown dropdown-top w-full">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost hover:bg-base-300 h-auto w-full justify-start p-[clamp(8px,1vw,12px)]"
          >
            <div className="flex w-full items-center gap-[clamp(10px,1.5vw,14px)]">
              <div className="avatar">
                <div className="w-[clamp(36px,3vw,48px)] rounded-full">
                  <img
                    src={profile_pic_url || "https://via.placeholder.com/150"}
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <span className="w-full truncate text-[clamp(13px,0.9vw,15px)] font-semibold">
                  {username || "User"}
                </span>
                <span className="text-base-content/60 w-full truncate text-[clamp(11px,0.7vw,13px)]">
                  {school || "Unknown School"}
                </span>
              </div>
            </div>
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] mb-2 w-full p-[clamp(8px,1vw,12px)] shadow-lg text-[clamp(13px,0.9vw,15px)]"
          >
            <li>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-[clamp(8px,1vw,12px)]"
              >
                <FiUser className="w-[clamp(14px,1vw,18px)] h-[clamp(14px,1vw,18px)]" />
                <span>View Profile</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-[clamp(8px,1vw,12px)]"
              >
                <FiSettings className="w-[clamp(14px,1vw,18px)] h-[clamp(14px,1vw,18px)]" />
                <span>Settings</span>
              </button>
            </li>
            {/* <div className="divider my-1"></div> */}
            <li>
              <button
                onClick={handleLogout}
                className="text-error hover:bg-error/10 flex items-center gap-[clamp(8px,1vw,12px)]"
              >
                <FiLogOut className="w-[clamp(14px,1vw,18px)] h-[clamp(14px,1vw,18px)]" />
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
