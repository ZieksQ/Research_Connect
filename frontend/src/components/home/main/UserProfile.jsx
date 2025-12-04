import { MdExpandMore } from 'react-icons/md';

export default function UserProfile({ user }) {
  const defaultUser = user || {
    name: "Andy Sorne",
    email: "Inquira Beta Tester",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-all mt-auto mx-4 mb-4 border border-transparent hover:border-gray-200">
      {/* Avatar */}
      <div className="avatar">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full ring ring-white ring-offset-base-100 ring-offset-1">
          <img src={defaultUser.avatar} alt={defaultUser.name} />
        </div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0 hidden md:block">
        <p className="truncate text-sm font-semibold text-gray-900">
          {defaultUser.name}
        </p>
        <p className="truncate text-xs text-gray-500">
          {defaultUser.email}
        </p>
      </div>

      {/* Dropdown Icon */}
      <MdExpandMore className="text-xl text-gray-400 hidden md:block" />
    </div>
  );
}
