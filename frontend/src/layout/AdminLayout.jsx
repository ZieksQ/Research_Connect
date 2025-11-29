import React, { useState } from 'react';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';
import { Outlet } from 'react-router-dom';
import { FiClipboard, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import AdminUnauthorized from '../pages/admin/AdminUnauthorized';

const adminNavLinks = [
  { to: '/admin/request', label: 'Requests', icon: FiClipboard },
  { to: '/home', label: 'Go back to Homepage', icon: FiArrowLeft, isBackLink: true },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userInfo } = useAuth();
  const userRole = userInfo?.message?.user_info?.role;

  const closeSidebar = () => setIsSidebarOpen(false);

  // Check if user is admin
  if (userRole !== 'admin') {
    return <AdminUnauthorized />;
  }

  return (
    <div className="flex h-screen">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Fixed on mobile, static on desktop */}
      <aside
        className={`
          bg-base-200 transition-all duration-300 ease-in-out overflow-hidden
          fixed lg:static inset-y-0 left-0 z-50
          ${isSidebarOpen ? "w-[clamp(280px,80vw,320px)] lg:w-[clamp(280px,20vw,360px)]" : "w-0"}
        `}
      >
        <div className="w-[clamp(280px,80vw,320px)] lg:w-[clamp(280px,20vw,360px)] h-full">
          <Sidebar onClose={closeSidebar} navLinks={adminNavLinks} />
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

export default AdminLayout;
