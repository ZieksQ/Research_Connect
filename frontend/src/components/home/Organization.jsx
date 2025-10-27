import React from "react";

const Organization = () => {
  return (
    <div className="padding-sm rounded flex items-center gap-2 border border-gray-200">
      <img
        src="https://www.ucarecdn.com/eaa6c79b-4dea-47d0-96f5-448fc0806446/-/preview/"
        alt="organization logo"
        className="icon-xl rounded-full"
      />
      <div className="text-sm tracking-tight leading-4">
        <h3 className="font-semibold line-clamp-2">Laguna State Polytechnic University</h3>
        <p className="text-text-secondary">Follow: <span className="font-semibold">2.4k</span></p>
      </div>
      <button className="btn btn-sm btn-primary">Follow</button>
    </div>
  );
};

export default Organization;
