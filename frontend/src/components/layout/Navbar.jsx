import { useAuth } from "../../context/AuthContext";
import { LogOut, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">

      {/* Left - Title */}
      <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Project Management Dashboard
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* Notification Icon */}
        <button className="relative text-gray-600 hover:text-gray-900 transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
          >
            {/* Avatar */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>

            {/* Name + Role */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || "member"}
              </p>
            </div>

            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
