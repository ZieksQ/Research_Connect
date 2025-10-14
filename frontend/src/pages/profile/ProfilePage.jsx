import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ProfilePicture from "../../components/profile/ProfilePicture.jsx";
import Stats from "../../components/profile/Stats.jsx";
import ProfileInfo from "../../components/profile/ProfileInfo.jsx";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <section className="page-margin lg:mx-auto lg:max-w-4xl">
      <header className="flex items-center p-2 gap-2">
        <ProfilePicture />
        <ProfileInfo />
        {/* Stats then Button if user == user then you can edit your profile */}
      </header>

      <nav role="tablist" className="tabs tabs-border mt-6">
        <NavLink to='/home/profile/posts' role="tab" className={`tab`}>Posts</NavLink>
        <NavLink to="/home/profile/about" role="tab" className={`tab`}>About</NavLink>
      </nav>

      <div>
        <Outlet />
      </div>
    </section>
  );
};

export default ProfilePage;
