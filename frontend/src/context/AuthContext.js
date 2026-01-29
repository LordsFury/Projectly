import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchClient } from "../api/fetchClient";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const data = await fetchClient("/auth/me");
                    setUser(data);
                }
                catch (error) {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);
    const login = async (email, password) => {
        const data = await fetchClient("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        localStorage.setItem("token", data.token);
        setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
    };
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, login, logout, loading }, children: !loading && children }));
};
export const useAuth = () => useContext(AuthContext);
