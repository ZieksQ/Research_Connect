import React from "react";

const CardPost = ({Title, Description}) => {
  return (
    <div className="bg-base-100 card-sm shadow-base-300 card-border w-full shadow-md">
      <div className="card-body">
        <div className="collapse-arrow collapse ">
          <input type="checkbox" /> {/* required for toggle */}
          <div className="collapse-title card-title">{Title}</div>
          <div className="collapse-content text-md">
            <p className="text-base-content">
             {Description}
            </p>
          </div>
        </div>

        <span className="badge badge-neutral badge-sm font-bold mx-4 rounded-xl">Research</span>
        <div className="pl-4 pr-3 flex items-center justify-between">
          <span>Avg. ~10min</span>
          <button className="btn btn-primary btn-sm rounded-lg">
            Take Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardPost;
