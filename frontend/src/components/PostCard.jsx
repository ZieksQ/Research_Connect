import React, { useEffect, useRef, useState } from "react";
import PrimaryButton from "./button/PrimaryButton.jsx";

// Card Component for Survery Post's
const PostCard = () => {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  // if expanded is true this will set the height equal to the useRef Content's current
  // Scroll Height in px.
  // This will make the description collapsable
  useEffect(() => {
    if (expanded) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [expanded]);

  return (
    <div className="padding-h-lg card mx-4">
      {/* ========== Title and Expand/Compress Button ============ */}
      <header className="flex justify-between">
        <h3 className="text-lg font-bold">Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque ab laborum incidunt explicabo animi deserunt ullam tempore nobis amet voluptas!</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-accent-100 self-start"
        >
          {expanded ? (
            <span className="flex items-center gap-1">
              Less
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="icon-size"
                fill="#5057E9"
              >
                <path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" />
              </svg>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="icon-size"
                fill="#5057E9"
              >
                <path d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z" />
              </svg>
            </span>
          )}
        </button>
      </header>

      {/* Author, Tags and Description */}
      <div>
        <h6 className="text-secondary text-[12px] font-semibold">
          ZieksQ - BSIT
        </h6>
        <span className="bg-secondary rounded-lg px-2 text-sm text-white">
          Research
        </span>
        <p
          ref={contentRef}
          style={{ height }}
          className="overflow-hidden text-gray-700 transition-all duration-500 ease-in-out"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime odio
          veritatis assumenda corrupti quia sapiente, officiis in? Quia
          perspiciatis neque tempore vero officiis, nulla est, ea, non dolores
          expedita delectus.
        </p>
      </div>

      {/* Time, Target and Take Survey Button */}
      <div className="mt-2 flex items-center justify-between gap-1 text-sm">
        <p className="">🕒 6:06PM</p>
        <p className="mr-auto">🎯 All Students</p>
        <PrimaryButton
          Text={"Take Survey"}
          Style="w-[35%] max-w-[20vh] min-w-[12vh]"
        />
      </div>
    </div>
  );
};

export default PostCard;
