import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Menu, X } from "lucide-react";
import { useState } from "react";
const Sidebar = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const baseLink = "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10";
    const activeLink = "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-inner border border-white/10";
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setOpen(true), className: "fixed top-4 left-4 z-50 md:hidden bg-gray-900 text-white p-2 rounded-xl shadow-lg", children: _jsx(Menu, { size: 22 }) }), open && (_jsx("div", { onClick: () => setOpen(false), className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" })), _jsxs("aside", { className: `
          fixed top-0 left-0 z-50 h-screen w-64
          bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950
          backdrop-blur-xl
          border-r border-white/10
          p-6 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `, children: [_jsxs("div", { className: "flex items-center justify-between mb-10", children: [_jsx("h2", { className: "text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent", children: "Projectly" }), _jsx("button", { onClick: () => setOpen(false), className: "md:hidden text-gray-400 hover:text-white", children: _jsx(X, { size: 22 }) })] }), _jsxs("nav", { className: "flex flex-col gap-2", children: [_jsxs(NavLink, { to: "/dashboard", onClick: () => setOpen(false), className: ({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`, children: [_jsx(LayoutDashboard, { size: 20 }), _jsx("span", { children: "Dashboard" }), _jsx("span", { className: "ml-auto h-2 w-2 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition" })] }), _jsxs(NavLink, { to: "/projects", onClick: () => setOpen(false), className: ({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`, children: [_jsx(FolderKanban, { size: 20 }), _jsx("span", { children: "Projects" })] }), _jsxs(NavLink, { to: "/tasks", onClick: () => setOpen(false), className: ({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`, children: [_jsx(CheckSquare, { size: 20 }), _jsx("span", { children: "Tasks" })] }), user?.role === "admin" && (_jsxs(NavLink, { to: "/users", onClick: () => setOpen(false), className: ({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`, children: [_jsx(Users, { size: 20 }), _jsx("span", { children: "Users" })] }))] }), _jsx("div", { className: "mt-auto pt-6 border-t border-white/10 text-sm text-gray-400", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white", children: user?.name?.charAt(0) || "U" }), _jsxs("div", { children: [_jsx("p", { className: "text-white font-medium", children: user?.name || "User" }), _jsx("p", { className: "text-xs capitalize text-gray-400", children: user?.role || "member" })] })] }) })] })] }));
};
export default Sidebar;
