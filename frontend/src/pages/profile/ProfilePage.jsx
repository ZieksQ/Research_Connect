import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ProfilePicture from "../../components/profile/ProfilePicture.jsx";
import ProfileInfo from "../../components/profile/ProfileInfo.jsx";
import ChangeProfilePicture from "../../components/profile/ChangeProfilePicture.jsx";
import Settings from "../../components/settings/Settings.jsx";
import { getUserData } from "../../services/user.js";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Run once on mount
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    const data = await getUserData();
    setUserData(data);
    setIsLoading(false);
  };

  // optional chaining prevents crash before data loads
  const profilePicUrl = userData?.message?.user_info?.profile_pic_url;
  // const username = userData?.message?.user_info?.username;

  return (
    <section className="page-margin lg:mx-auto lg:max-w-4xl">
      {/* Profile Header Card */}
      <div className="bg-base-100 border-base-200 overflow-hidden rounded-2xl border shadow-sm">
        {/* Cover/Background Area */}
        <div className="from-custom-blue/70 via-custom-green/40 to-custom-maroon/30 h-32 bg-gradient-to-br"></div>

        {/* Profile Content */}
        <div className="-mt-16 px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Left side: Profile Picture */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <div
                className={`ring-base-100 rounded-full ring-4 ${isLoading ? "skeleton" : ""}`}
              >
                <ProfilePicture src={profilePicUrl} />
              </div>
              <div className="mb-2">
                <ProfileInfo data={userData} isLoading={isLoading} />
              </div>
            </div>

            {/* Right side: Action Buttons */}
            <div className="sm:mb-2 flex gap-2">
              <ChangeProfilePicture />
            </div>
          </div>

          {/* Stats Section (if needed) */}
          {/* <div className="mt-6">
            <Stats />
          </div> */}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav role="tablist" className="tabs tabs-border mt-6 mb-6">
        <NavLink to="/home/profile/posts" role="tab" className={`tab`}>
          Posts
        </NavLink>
        <NavLink to="/home/profile/about" role="tab" className={`tab`}>
          About
        </NavLink>
      </nav>

      {/* Content Area */}
      <Outlet />
    </section>
  );
};

export default ProfilePage;
