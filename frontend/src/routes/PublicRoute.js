import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    const token = localStorage.getItem("token");
    if (user || token) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return children;
};
export default PublicRoute;
