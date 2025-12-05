import React from "react";
import Photo from "../../assets/icons/photo.svg";

const ProfilePicture = ({ src, isLoading }) => {
  return (
    <div className={`avatar ${isLoading ? "animate-pulse" : ""}`}>
      <div className="w-24 h-24 rounded-full ring ring-white ring-offset-base-100 ring-offset-2 overflow-hidden bg-gray-200">
        {src ? (
          <img src={src} alt="Profile" className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <img src={Photo} alt="Default" className="w-1/2 h-1/2 opacity-50" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
