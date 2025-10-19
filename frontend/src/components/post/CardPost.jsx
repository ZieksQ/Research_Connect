import React from "react";
import { useNavigate } from "react-router-dom";

const CardPost = ({Title, Description}) => {

  const navigate = useNavigate();

  return (
    <div className="bg-base-100 card-sm shadow-base-300 card-border w-full shadow-md">
      <div className="card-body">
        <div className="collapse-arrow collapse ">
          <input type="checkbox" /> {/* required for toggle */}
          <div className="collapse-title card-title">{Title}</div>
          <div className="collapse-content text-[16px]">
            <p className="text-base-content">
             {Description}
            </p>
          </div>
        </div>

        <span className="badge badge-neutral text-[10px] rounded-lg font-semibold mx-4">Research</span>
        <div className="pl-4 pr-3 flex items-end justify-between">
          <span>Avg. ~10min</span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/form/response')}>
            Take Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardPost;
