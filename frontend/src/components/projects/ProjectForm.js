import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchClient } from "../../api/fetchClient";
import toast from "react-hot-toast";
const ProjectForm = ({ initialData, onSubmit, loading }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("active");
    const [moderatorId, setModeratorId] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const [moderators, setModerators] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    useEffect(() => {
        loadUsers();
    }, []);
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || "");
            setStatus(initialData.status);
            setModeratorId(initialData.moderator?._id || initialData.moderator || "");
            setSelectedMembers(initialData.members?.map((m) => m._id || m) || []);
        }
    }, [initialData]);
    const loadUsers = async () => {
        try {
            const data = await fetchClient("/users");
            setUsers(data);
            const modsAndAdmins = data.filter((u) => u.role === "moderator" || u.role === "admin");
            setModerators(modsAndAdmins);
        }
        catch (error) {
            toast.error("Failed to load users");
        }
        finally {
            setLoadingUsers(false);
        }
    };
    const handleMemberToggle = (userId) => {
        setSelectedMembers((prev) => prev.includes(userId)
            ? prev.filter((id) => id !== userId)
            : [...prev, userId]);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!moderatorId) {
            toast.error("Please select a moderator");
            return;
        }
        onSubmit({
            title,
            description,
            status,
            moderator: moderatorId,
            members: selectedMembers,
        });
    };
    if (loadingUsers) {
        return _jsx("div", { className: "text-center py-4 text-gray-500", children: "Loading..." });
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Project Title *" }), _jsx("input", { type: "text", placeholder: "Enter project title", className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: title, onChange: (e) => setTitle(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { placeholder: "Enter project description", className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none", rows: "4", value: description, onChange: (e) => setDescription(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Moderator *" }), _jsxs("select", { className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: moderatorId, onChange: (e) => setModeratorId(e.target.value), required: true, children: [_jsx("option", { value: "", children: "Select a moderator" }), moderators.map((mod) => (_jsxs("option", { value: mod._id, children: [mod.name, " (", mod.role, ")"] }, mod._id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), _jsxs("select", { className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: status, onChange: (e) => setStatus(e.target.value), children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "completed", children: "Completed" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Team Members" }), _jsx("div", { className: "border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2", children: users.length === 0 ? (_jsx("p", { className: "text-gray-500 text-sm text-center py-2", children: "No users available" })) : (users.map((user) => (_jsxs("label", { className: "flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: selectedMembers.includes(user._id), onChange: () => handleMemberToggle(user._id), className: "w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" }), _jsxs("span", { className: "text-sm text-gray-700", children: [user.name, _jsxs("span", { className: "text-gray-500 ml-1", children: ["(", user.role, ")"] })] })] }, user._id)))) }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [selectedMembers.length, " member(s) selected"] })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? "Saving..." : initialData ? "Update Project" : "Create Project" })] }));
};
export default ProjectForm;
