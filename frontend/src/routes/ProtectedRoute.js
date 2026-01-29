import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const token = localStorage.getItem("token");
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "text-gray-500", children: "Loading..." }) }));
    }
    if (!user && !token) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // If allowedRoles is specified, check if user has permission
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "bg-white p-8 rounded-xl shadow-lg text-center max-w-md", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDEAB" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Access Denied" }), _jsx("p", { className: "text-gray-600 mb-4", children: "You don't have permission to access this page." }), _jsxs("div", { className: "bg-gray-50 p-3 rounded-lg mb-4", children: [_jsxs("p", { className: "text-sm text-gray-500", children: ["Required: ", allowedRoles.join(" or ")] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Your role: ", user.role] })] }), _jsx("button", { onClick: () => window.history.back(), className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition", children: "Go Back" })] }) }));
    }
    return children;
};
export default ProtectedRoute;
