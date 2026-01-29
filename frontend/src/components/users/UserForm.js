import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const UserForm = ({ onSubmit, loading }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, email, password, role });
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", placeholder: "Full Name", className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: name, onChange: (e) => setName(e.target.value), required: true }), _jsx("input", { type: "email", placeholder: "Email", className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx("input", { type: "password", placeholder: "Password", className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsxs("select", { className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: role, onChange: (e) => setRole(e.target.value), children: [_jsx("option", { value: "user", children: "User" }), _jsx("option", { value: "moderator", children: "Moderator" }), _jsx("option", { value: "admin", children: "Admin" })] }), _jsx("button", { disabled: loading, className: "w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50", children: loading ? "Creating..." : "Create User" })] }));
};
export default UserForm;
