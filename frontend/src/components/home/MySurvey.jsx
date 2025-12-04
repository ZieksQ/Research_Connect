import React from "react";

const MySurvey = () => {
  return (
    <div className="p-3 hover:bg-gray-50 rounded-lg text-sm border border-gray-200 transition-colors cursor-pointer group">
      <h3 className="font-semibold text-gray-900 group-hover:text-custom-blue transition-colors">Survey Title</h3>
      <p className="text-gray-500 text-xs mt-1 line-clamp-1">Survey Description...</p>
    </div>
  );
};

export default MySurvey;
