import { MdDashboard, MdCheckCircle, MdCode, MdExpandMore, MdHourglassEmpty, MdThumbUp, MdThumbDown } from 'react-icons/md';
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegSquareCheck } from "react-icons/fa6";


// Delete
export default function AdminSidebar() {
  return (
    <div className="drawer drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side">
        <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar Header */}
          {/* <div className="px-4 py-6 mb-4">
            <h2 className="text-primary">Admin Panel</h2>
          </div> */}
          
          <ul className="menu-compact space-y-2">
            {/* Dashboard */}
            <li>
              <a className="gap-3">
                <MdOutlineDashboard className="size-6" />
                <span>Dashboard</span>
              </a>
            </li>

            {/* Approval - Collapsible */}
            <li>
              <details open>
                <summary className="gap-3">
                  <FaRegSquareCheck className="size-6" />
                  <span>Approval</span>
                </summary>
                <ul>
                  <li>
                    <a className="gap-3">
                      <MdHourglassEmpty className="size-5" />
                      <span>Pending</span>
                    </a>
                  </li>
                  <li>
                    <a className="gap-3">
                      <MdThumbUp className="size-5" />
                      <span>Approved</span>
                    </a>
                  </li>
                  <li>
                    <a className="gap-3">
                      <MdThumbDown className="size-5" />
                      <span>Declined</span>
                    </a>
                  </li>
                </ul>
              </details>
            </li>

            {/* Generate Code */}
            <li>
              <a className="gap-3">
                <MdCode className="size-6" />
                <span>Generate Code</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}