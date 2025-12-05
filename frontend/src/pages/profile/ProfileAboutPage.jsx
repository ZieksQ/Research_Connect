import React from 'react'
import { MdOutlineEmail } from "react-icons/md";
import { IoSchoolOutline } from "react-icons/io5";
import { GoBook } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { useAuth } from '../../hooks/useAuth';

// About Section in Profile Page
const ProfileAboutPage = () => {
  const { userInfo, loading } = useAuth();

  const user = userInfo?.message?.user_info;

  const infoItems = [
    {
      icon: <CiUser className="w-5 h-5" />,
      title: "Username",
      value: user?.username || 'Not set',
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <MdOutlineEmail className="w-5 h-5" />,
      title: "Email",
      value: user?.email || 'No email linked',
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: <IoSchoolOutline className="w-5 h-5" />,
      title: "School",
      value: user?.school || 'Not set',
      gradient: "from-rose-500 to-red-600"
    },
    {
      icon: <GoBook className="w-5 h-5" />,
      title: "Program",
      value: user?.program || 'Not set',
      gradient: "from-cyan-500 to-teal-600"
    }
  ];

  if (loading) {
    return (
      <main className="flex flex-col gap-3 px-4 py-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-3 p-4 bg-base-200 rounded-xl">
            <div className="w-12 h-12 bg-base-300 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-base-300 rounded w-20"></div>
              <div className="h-4 bg-base-300 rounded w-32"></div>
            </div>
          </div>
        ))}
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-3 px-4 py-2">
      {infoItems.map((item, index) => (
        <div
          key={index}
          className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
        >
          {/* Icon Container */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-200`}
          >
            {item.icon}
          </div>

          {/* Text Content */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {item.title}
            </span>
            <span className="text-base font-semibold text-gray-900 truncate" title={item.value}>
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </main>
  );
}

export default ProfileAboutPage
