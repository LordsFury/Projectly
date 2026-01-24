import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const linkClass = "px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition";
  const activeClass = "bg-gray-800 text-white";

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white flex flex-col p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-8 text-blue-400">InstechSol</h2>
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          📊 Dashboard
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          📁 Projects
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          ✅ Tasks
        </NavLink>
        {user?.role === "admin" && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            👤 Users
          </NavLink>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;