import React, { useState } from "react";
import Navbar from "../components/navigation/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";

const RootLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-base-200 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-80" : "w-0"
        } overflow-hidden`}
      >
        <div className="w-80 h-full">
          <Sidebar />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          sidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
