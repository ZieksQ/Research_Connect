import React from "react";
import Photo from "../../assets/icons/photo.svg";

const ProfilePicture = ({ src, isLoading }) => {
  return (
    <div className={`avatar rounded-full overflow-hidden self-center `}>
      <div className={`profile-pic`}>
        <img
          src={src}
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
