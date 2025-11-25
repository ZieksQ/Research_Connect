import React from "react";

// User Information for Profile Page
const ProfileInfo = ({ data, isLoading }) => {
  const username = data?.message?.user_info?.username;
  const program = data?.message?.user_info?.program;
  const school = data?.message?.user_info?.school;

  return (
    <div className="space-y-1">
      <h4 className={`text-xl font-extrabold ${isLoading ? "skeleton" : ""}`}>{username}</h4>
      <p className={`text-sm leading-tight tracking-tight text-text-secondary ${isLoading ? "skeleton" : ""}`}>
        {program != null ? program : "Unknown Program"}
      </p>
      <p className={`text-sm leading-tight tracking-tight text-text-secondary ${isLoading ? "skeleton" : ""}`}>
        {school != null ? school : "Unknown School"}
      </p>
      
    </div>
  );
};

export default ProfileInfo;
