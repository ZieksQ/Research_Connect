import React from "react";
import { LuLayoutDashboard } from "react-icons/lu";
// import { MdOutlineTask } from "react-icons/md";
import { MdOutlineTaskAlt } from "react-icons/md";
import { AiOutlineQrcode } from "react-icons/ai";

const Sidebar = () => {
  return (
    <aside className="drawer lg:drawer-open fixed">
      <input
        id="my-drawer-1"
        type="checkbox"
        className="drawer-toggle lg:hidden"
      />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer-1" className="btn drawer-button lg:hidden">
          Open drawer
        </label>
      </div>
      <div className="drawer-side relative">
        <label
          htmlFor="my-drawer-1"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4 text-[1rem] font-normal">
          {/* Sidebar content here */}
          <li>
            <a>
              <LuLayoutDashboard className="size-5"/>
              Dashboard
            </a>
          </li>
          <li>
            <a>
              <MdOutlineTaskAlt className="size-5" />
              Request
            </a>
          </li>
          <li>
            <a>
              <AiOutlineQrcode className="size-5" />
              Generate Code
            </a>
          </li>
          <li className="mt-auto mb-18">
            <a className="flex flex-row">
              <div class="avatar">
                <div class="w-8 rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="m-0 p-0 text-sm font-semibold">Name</h3>
                <span className="m-0 p-0 text-xs font-normal">
                  School Name...
                </span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
