import React from "react";

const Organization = () => {
  return (
    <div className="p-3 rounded-lg flex items-center gap-3 border border-gray-200 bg-white hover:shadow-sm transition-shadow">
      <img
        src="https://www.ucarecdn.com/eaa6c79b-4dea-47d0-96f5-448fc0806446/-/preview/"
        alt="organization logo"
        className="w-10 h-10 rounded-full object-cover border border-gray-100"
      />
      <div className="flex-1 min-w-0 text-sm">
        <h3 className="font-semibold text-gray-900 line-clamp-1" title="Laguna State Polytechnic University">
          Laguna State Polytechnic University
        </h3>
        <p className="text-gray-500 text-xs">
          Followers: <span className="font-medium text-gray-700">2.4k</span>
        </p>
      </div>
      <button className="btn btn-xs bg-custom-blue border-custom-blue text-white hover:bg-blue-800 hover:border-blue-800 px-3">
        Follow
      </button>
    </div>
  );
};

export default Organization;
