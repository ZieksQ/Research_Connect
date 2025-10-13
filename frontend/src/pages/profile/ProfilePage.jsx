import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ProfilePicture from "../../components/profile/ProfilePicture.jsx";
import Stats from "../../components/profile/Stats.jsx";
import ProfileInfo from "../../components/profile/ProfileInfo.jsx";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <section className="profile-container mx-auto mt-4">
      {/* Left Side - Profile & Navigation */}
      <div className="row-span-5 flex flex-col gap-4 p-4">
        <div className="flex space-x-2 lg:flex-col">
          <ProfilePicture />
          <ProfileInfo />
        </div>
        <Stats />
      </div>

      {/* Main Section */}
      <main className="col-span-4 row-span-5 flex flex-col gap-4 p-4">
        <nav className="flex justify-between">
          <NavLink to={"/home/profile/my-survey"} className="btn w-[49%]">
            My Surveys
          </NavLink>
          <NavLink to={"/home/profile/user-info"} className="btn w-[49%]">Profile Information</NavLink>
        </nav>
        <section>
          <Outlet />
        </section>
      </main>
    </section>
  );
};

export default ProfilePage;
