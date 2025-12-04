import React from "react";

// User Information for Profile Page
const ProfileInfo = ({ data, isLoading }) => {
  const username = data?.message?.user_info?.username;
  const program = data?.message?.user_info?.program;
  const school = data?.message?.user_info?.school;

  if (isLoading) {
    return (
      <div className="space-y-2 w-48">
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <h4 className="text-2xl font-bold text-gray-900 tracking-tight">
        {username || "User"}
      </h4>
      <p className="text-sm font-medium text-gray-500">
        {program || "No Program Set"}
      </p>
      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
        {school || "No School Set"}
      </p>
    </div>
  );
};

export default ProfileInfo;
