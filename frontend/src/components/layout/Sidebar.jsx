import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Menu, 
  X 
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const baseLink =
    "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10";
  const activeLink =
    "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-inner border border-white/10";

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-900 text-white p-2 rounded-xl shadow-lg"
      >
        <Menu size={22} />
      </button>

      {/* Overlay (Mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950
          backdrop-blur-xl
          border-r border-white/10
          p-6 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Projectly
          </h2>

          {/* Close button (mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2">

          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""}`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
            <span className="ml-auto h-2 w-2 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition" />
          </NavLink>

          <NavLink
            to="/projects"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""}`
            }
          >
            <FolderKanban size={20} />
            <span>Projects</span>
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ""}`
            }
          >
            <CheckSquare size={20} />
            <span>Tasks</span>
          </NavLink>

          {user?.role === "admin" && (
            <NavLink
              to="/users"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              <Users size={20} />
              <span>Users</span>
            </NavLink>
          )}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-white/10 text-sm text-gray-400">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-white font-medium">{user?.name || "User"}</p>
              <p className="text-xs capitalize text-gray-400">{user?.role || "member"}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
