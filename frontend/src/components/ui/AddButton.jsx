import React from "react";

const AddButton = () => {
  return (
    <>
      <button className="flex items-center gap-2">
        {/* Logo */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="size-5 ">
          <path d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z" />
        </svg>

        {/* Text */}
        <h3>Add</h3>
      </button>
    </>
  );
};

export default AddButton;
