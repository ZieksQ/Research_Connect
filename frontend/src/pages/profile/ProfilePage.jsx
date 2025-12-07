import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ProfilePicture from "../../components/profile/ProfilePicture.jsx";
import ProfileInfo from "../../components/profile/ProfileInfo.jsx";
import ChangeProfilePicture from "../../components/profile/ChangeProfilePicture.jsx";
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
  const userInfo = userData?.message?.user_info;
  const profilePicUrl = userInfo?.profile_pic_url;

  // Stats
  const surveysAnswered = userInfo?.num_of_answered_survey || 0;
  const postsCreated = userInfo?.num_post_created || 0;
  const postsLiked = userInfo?.num_of_post_liked || 0;
  const totalResponses = userInfo?.total_num_of_responses || 0;

  return (
    <section className="page-margin mx-auto max-w-5xl px-4 py-8">
      
      {/* Top Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-custom-blue/20 to-custom-green/20"></div>
        
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-end -mt-12 gap-6">
            {/* Profile Picture */}
            <div className="rounded-full p-1 bg-white shrink-0">
              <ProfilePicture src={profilePicUrl} isLoading={isLoading} /> 
            </div>
            
            {/* User Info & Actions */}
            <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
              <div className="mb-1">
                <ProfileInfo data={userData} isLoading={isLoading} />
              </div>
              <div className="mb-1">
                <ChangeProfilePicture onUploadSuccess={fetchUserData} />
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-100 pt-6">
             <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">{surveysAnswered}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Surveys Answered</span>
             </div>
             <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">{postsCreated}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Posts Created</span>
             </div>
             <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">{postsLiked}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Posts Liked</span>
             </div>
             <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">{totalResponses}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Responses</span>
             </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-30 pt-2 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 inline-flex w-full sm:w-auto">
            <nav className="flex gap-1 p-1 w-full sm:w-auto">
              <NavLink 
                to="/profile/posts" 
                className={({ isActive }) => `flex-1 sm:flex-none text-center px-6 py-2 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-custom-blue text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
              >
                Posts
              </NavLink>
              <NavLink 
                to="/profile/liked" 
                className={({ isActive }) => `flex-1 sm:flex-none text-center px-6 py-2 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-custom-blue text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
              >
                Liked
              </NavLink>
              <NavLink 
                to="/profile/about" 
                className={({ isActive }) => `flex-1 sm:flex-none text-center px-6 py-2 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-custom-blue text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
              >
                About
              </NavLink>
            </nav>
         </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
         <Outlet />
      </div>

    </section>
  );
};

export default ProfilePage;
