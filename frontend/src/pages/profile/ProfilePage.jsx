import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ProfilePicture from "../../components/profile/ProfilePicture.jsx";
import Stats from "../../components/profile/Stats.jsx";
import ProfileInfo from "../../components/profile/ProfileInfo.jsx";
import ChangeProfilePicture from "../../components/profile/ChangeProfilePicture.jsx";
import { getUserData } from "../../services/user.js";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Run once on mount
    const fetchUserData = async () => {

      setIsLoading(true);
      const data = await getUserData(); // assume this returns JSON
      setUserData(data);
      setIsLoading(false);
    };
    fetchUserData();
  }, []);

  // optional chaining prevents crash before data loads
  const profilePicUrl = userData?.message?.user_indo?.profile_pic_url;
  const username = userData?.message?.user_indo?.username;

  return (
    <section className="page-margin lg:mx-auto lg:max-w-4xl">
      {/* Profile Header Card */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">
        {/* Cover/Background Area */}
        <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-base-200"></div>
        
        {/* Profile Content */}
        <div className="px-6 pb-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Left side: Profile Picture */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className={`ring-4 ring-base-100 rounded-full ${isLoading ? 'skeleton' : ''}`}>
                <ProfilePicture src={profilePicUrl}/>
              </div>
              <div className="mb-2">
                <ProfileInfo username={username} isLoading={isLoading}/>
              </div>
            </div>
            
            {/* Right side: Action Button */}
            <div className="sm:mb-2">
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
        <NavLink to='/home/profile/posts' role="tab" className={`tab`}>Posts</NavLink>
        <NavLink to="/home/profile/about" role="tab" className={`tab`}>About</NavLink>
      </nav>

      {/* Content Area */}
      <Outlet />
    </section>
  );
};

export default ProfilePage;