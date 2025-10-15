import React from "react";
import Photo from "../../assets/icons/photo.svg";

const ProfilePicture = () => {
  return (
    <div className="avatar rounded-full overflow-hidden self-center">
      <div className="profile-pic">
        <img
          src="https://preview.redd.it/who-and-what-is-ado-v0-kve8mhe2j7ee1.jpeg?width=735&auto=webp&s=faf454230620917a2aff0e0e11642b846ad1343a"
          alt="Profile Picture"
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
