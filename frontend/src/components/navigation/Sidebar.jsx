import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiLogOut, FiSettings, FiUser, FiX, FiArchive, FiFileText, FiChevronDown, FiChevronRight, FiXCircle } from "react-icons/fi";
import { logoutUser } from "../../services/auth";

const Sidebar = ({ onClose, navLinks = [] }) => {
  const { userInfo, setUserInfo } = useAuth();
  const navigate = useNavigate();
  const [postsExpanded, setPostsExpanded] = useState(false);
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
    <div className="bg-white flex h-full flex-col border-r border-gray-200">
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
      <ul className="menu w-full text-gray-700 flex-1 space-y-[clamp(8px,1vw,12px)] p-[clamp(12px,2vw,20px)] text-[clamp(14px,1vw,16px)]">
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-[clamp(10px,1.5vw,14px)] p-[clamp(10px,1vw,14px)] rounded-lg transition-colors ${
                    link.isBackLink 
                      ? 'hover:bg-gray-100 hover:text-gray-900' 
                      : isActive 
                        ? 'bg-custom-blue text-white shadow-md hover:bg-blue-700' 
                        : 'hover:bg-blue-50 hover:text-custom-blue'
                  }`
                }
              >
                <IconComponent className="w-[clamp(18px,1.2vw,22px)] h-[clamp(18px,1.2vw,22px)]" />
                <span>{link.label}</span>
              </NavLink>
            </li>
          );
        })}
        
        {/* Profile NavLink */}
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-[clamp(10px,1.5vw,14px)] p-[clamp(10px,1vw,14px)] rounded-lg transition-colors ${
                isActive 
                  ? 'bg-custom-blue text-white shadow-md hover:bg-blue-700' 
                  : 'hover:bg-blue-50 hover:text-custom-blue'
              }`
            }
          >
            <FiUser className="w-[clamp(18px,1.2vw,22px)] h-[clamp(18px,1.2vw,22px)]" />
            <span>Profile</span>
          </NavLink>
        </li>

        {/* Collapsible Posts Section */}
        <li>
          <button
            onClick={() => setPostsExpanded(!postsExpanded)}
            className="flex items-center justify-between w-full gap-[clamp(10px,1.5vw,14px)] p-[clamp(10px,1vw,14px)] rounded-lg transition-colors hover:bg-blue-50 hover:text-custom-blue"
          >
            <div className="flex items-center gap-[clamp(10px,1.5vw,14px)]">
              <FiFileText className="w-[clamp(18px,1.2vw,22px)] h-[clamp(18px,1.2vw,22px)]" />
              <span>Posts</span>
            </div>
            {postsExpanded ? (
              <FiChevronDown className="w-[clamp(16px,1vw,20px)] h-[clamp(16px,1vw,20px)]" />
            ) : (
              <FiChevronRight className="w-[clamp(16px,1vw,20px)] h-[clamp(16px,1vw,20px)]" />
            )}
          </button>
          
          {postsExpanded && (
            <ul className="ml-[clamp(20px,2vw,28px)] mt-[clamp(4px,0.5vw,8px)] space-y-[clamp(4px,0.5vw,8px)]">
              <li>
                <NavLink
                  to="/archived"
                  className={({ isActive }) =>
                    `flex items-center gap-[clamp(8px,1vw,12px)] p-[clamp(8px,0.8vw,12px)] rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-custom-blue text-white shadow-md' 
                        : 'hover:bg-blue-50 hover:text-custom-blue'
                    }`
                  }
                >
                  <FiArchive className="w-[clamp(16px,1vw,20px)] h-[clamp(16px,1vw,20px)]" />
                  <span>Archived</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/rejected"
                  className={({ isActive }) =>
                    `flex items-center gap-[clamp(8px,1vw,12px)] p-[clamp(8px,0.8vw,12px)] rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-custom-blue text-white shadow-md' 
                        : 'hover:bg-blue-50 hover:text-custom-blue'
                    }`
                  }
                >
                  <FiXCircle className="w-[clamp(16px,1vw,20px)] h-[clamp(16px,1vw,20px)]" />
                  <span>Rejected</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Profile Section at Bottom */}
      <div className="border-gray-200 border-t p-[clamp(12px,2vw,20px)]">
        <div className="dropdown dropdown-top w-full">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost hover:bg-gray-100 h-auto w-full justify-start p-[clamp(8px,1vw,12px)]"
          >
            <div className="flex w-full items-center gap-[clamp(10px,1.5vw,14px)]">
              <div className="avatar">
                <div className="w-[clamp(36px,3vw,48px)] rounded-full ring ring-custom-blue ring-offset-base-100 ring-offset-2">
                  <img
                    src={profile_pic_url || "https://via.placeholder.com/150"}
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <span className="w-full truncate text-[clamp(13px,0.9vw,15px)] font-semibold text-gray-800">
                  {username || "User"}
                </span>
                <span className="text-gray-500 w-full truncate text-[clamp(11px,0.7vw,13px)]">
                  {school || "Unknown School"}
                </span>
              </div>
            </div>
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-white rounded-box z-[1] mb-2 w-full p-[clamp(8px,1vw,12px)] shadow-lg border border-gray-200 text-[clamp(13px,0.9vw,15px)]"
          >
            <li>
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-[clamp(8px,1vw,12px)] hover:bg-gray-50 text-gray-700"
              >
                <FiSettings className="w-[clamp(14px,1vw,18px)] h-[clamp(14px,1vw,18px)]" />
                <span>Settings</span>
              </button>
            </li>
            {/* <div className="divider my-1"></div> */}
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:bg-red-50 flex items-center gap-[clamp(8px,1vw,12px)]"
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
