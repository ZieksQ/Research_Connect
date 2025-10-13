import React from "react";

const Stats = () => {
  return (
    <div className="stats lg:stats-vertical w-full shadow ">
      <div className="stat">
        <h4 className="stat-title">Survey Posted</h4>
        <span className="stat-value">13</span>
        <p className="stat-desc">Jan 2025 - today</p>
      </div>
      <div className="stat">
        <h4 className="stat-title">Total Responses</h4>
        <span className="stat-value">2.4k</span>
        <p className="stat-desc">↗︎ 400 (22%)</p>
      </div>
      <div className="stat">
        <h4 className="stat-title">Response Rate</h4>
        <span className="stat-value">92%</span>
        <p className="stat-desc">↘︎ 8%</p>
      </div>
    </div>
  );
};

export default Stats;
