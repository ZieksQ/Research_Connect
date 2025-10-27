import React from "react";

// User Information for Profile Page
const ProfileInfo = ({ username, isLoading }) => {
  return (
    <div className="space-y-1">
      <h4 className={`text-xl font-extrabold ${isLoading ? "skeleton" : ""}`}>{username}</h4>
      <p className={`text-sm leading-tight tracking-tight text-text-secondary ${isLoading ? "skeleton" : ""}`}>
        BS Information Technology
      </p>
      <p className={`text-sm leading-tight tracking-tight text-text-secondary ${isLoading ? "skeleton" : ""}`}>
        Laguna State Polytechnic University
      </p>
      
    </div>
  );
};

export default ProfileInfo;
