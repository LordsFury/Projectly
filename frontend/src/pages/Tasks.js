import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { fetchClient } from "../api/fetchClient";
import toast from "react-hot-toast";
import Modal from "../components/common/Modal";
import TaskForm from "../components/Tasks/TaskForm";
import StatusBadge from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
const Tasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [viewMode, setViewMode] = useState("board");
    const [searchQuery, setSearchQuery] = useState("");
    const canModify = user?.role === "moderator" || user?.role === "admin";
    const loadData = async () => {
        try {
            const [tasksRes, projectsRes, usersRes] = await Promise.all([
                fetchClient("/tasks"),
                fetchClient("/projects"),
                canModify ? fetchClient("/users") : Promise.resolve([]),
            ]);
            setTasks(tasksRes);
            setProjects(projectsRes);
            setUsers(usersRes);
        }
        catch {
            toast.error("Failed to load tasks");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData();
    }, []);
    const handleCreateOrUpdateTask = async (data) => {
        try {
            setSaving(true);
            if (editingTask) {
                await fetchClient(`/tasks/${editingTask._id}`, {
                    method: "PUT",
                    body: JSON.stringify(data),
                });
                toast.success("Task updated successfully! ✅");
            }
            else {
                await fetchClient("/tasks", {
                    method: "POST",
                    body: JSON.stringify(data),
                });
                toast.success("Task created successfully! 🎉");
            }
            setModalOpen(false);
            setEditingTask(null);
            loadData();
        }
        catch {
            toast.error(`Failed to ${editingTask ? "update" : "create"} task`);
        }
        finally {
            setSaving(false);
        }
    };
    const updateStatus = async (id, status, resolvedNote = "") => {
        try {
            await fetchClient(`/tasks/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status, resolvedNote }),
            });
            toast.success("Status updated! 🔄");
            loadData();
        }
        catch {
            toast.error("Failed to update task");
        }
    };
    const verifyTask = async (id) => {
        try {
            await fetchClient(`/tasks/${id}/verify`, {
                method: "PATCH",
            });
            toast.success("Task verified! ✅");
            loadData();
        }
        catch {
            toast.error("Failed to verify task");
        }
    };
    const handleEdit = (task) => {
        setEditingTask(task);
        setModalOpen(true);
    };
    const deleteTask = async (id) => {
        if (!confirm("Are you sure you want to delete this task?"))
            return;
        try {
            await fetchClient(`/tasks/${id}`, { method: "DELETE" });
            toast.success("Task deleted successfully");
            loadData();
        }
        catch {
            toast.error("Failed to delete task");
        }
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingTask(null);
    };
    const canInteractWithTask = (task) => {
        return task.assignedTo?._id === user?._id;
    };
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const grouped = {
        open: filteredTasks.filter((t) => t.status === "open"),
        "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
        resolved: filteredTasks.filter((t) => t.status === "resolved"),
        verified: filteredTasks.filter((t) => t.status === "verified"),
    };
    const getPriorityColor = (priority) => {
        const colors = {
            low: "border-l-4 border-green-500",
            medium: "border-l-4 border-yellow-500",
            high: "border-l-4 border-red-500",
        };
        return colors[priority] || colors.medium;
    };
    const getStatusIcon = (status) => {
        const icons = {
            open: "⭕",
            "in-progress": "🔄",
            resolved: "✅",
            verified: "🎯",
        };
        return icons[status] || "📋";
    };
    const getStatusGradient = (status) => {
        const gradients = {
            open: "from-blue-500 to-blue-600",
            "in-progress": "from-purple-500 to-purple-600",
            resolved: "from-orange-500 to-orange-600",
            verified: "from-green-500 to-green-600",
        };
        return gradients[status] || "from-gray-500 to-gray-600";
    };
    return (_jsxs(Layout, { children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: "\u2705 Tasks" }), user?.role === "user" && (_jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Showing only tasks assigned to you \u00B7 ", tasks.length, " total"] })), (user?.role === "moderator" || user?.role === "admin") && (_jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Managing all tasks \u00B7 ", tasks.length, " total"] }))] }), canModify && (_jsxs("button", { onClick: () => setModalOpen(true), className: "bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), "New Task"] }))] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsx("input", { type: "text", placeholder: "Search tasks...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white" })] }), _jsxs("div", { className: "flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm", children: [_jsx("button", { onClick: () => setViewMode("board"), className: `px-4 py-2 rounded-lg font-medium text-sm transition-all ${viewMode === "board"
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-600 hover:bg-gray-100"}`, children: _jsxs("span", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" }) }), "Board"] }) }), _jsx("button", { onClick: () => setViewMode("table"), className: `px-4 py-2 rounded-lg font-medium text-sm transition-all ${viewMode === "table"
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-600 hover:bg-gray-100"}`, children: _jsxs("span", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" }) }), "Table"] }) })] })] })] }), loading ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [_jsx("div", { className: "w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" }), _jsx("p", { className: "text-gray-500 font-medium", children: "Loading tasks..." })] })) : (_jsxs(_Fragment, { children: [viewMode === "board" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-6", children: _jsx("h2", { className: "text-xl font-bold text-gray-800 mb-4 flex items-center gap-2", children: "\uD83D\uDCCA Workflow Board" }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10", children: ["open", "in-progress", "resolved", "verified"].map((status) => (_jsxs("div", { className: `bg-gradient-to-br ${getStatusGradient(status)} rounded-2xl p-4 shadow-lg`, children: [_jsx("div", { className: "bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 mb-3", children: _jsxs("h3", { className: "font-bold text-black capitalize flex items-center justify-between", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: getStatusIcon(status) }), status.replace("-", " ")] }), _jsx("span", { className: "bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm", children: grouped[status].length })] }) }), _jsxs("div", { className: "space-y-3 max-h-[600px] overflow-y-auto pr-1", children: [grouped[status].map((t) => (_jsxs("div", { className: `bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 ${getPriorityColor(t.priority)}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h4", { className: "font-bold text-gray-800 flex-1 pr-2", children: t.title }), t.priority && (_jsx("span", { className: `text-xs px-2 py-1 rounded-full font-medium ${t.priority === "high" ? "bg-red-100 text-red-700" :
                                                                        t.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                                                                            "bg-green-100 text-green-700"}`, children: t.priority }))] }), t.description && (_jsx("p", { className: "text-sm text-gray-600 mb-3 line-clamp-2", children: t.description })), _jsxs("div", { className: "space-y-1 text-xs text-gray-500 mb-3", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { children: "\uD83D\uDCC1" }), _jsx("span", { children: t.project?.title || "N/A" })] }), _jsxs("div", { className: `flex items-center gap-1 ${canInteractWithTask(t) ? "font-medium text-blue-600" : ""}`, children: [_jsx("span", { children: "\uD83D\uDC64" }), _jsx("span", { children: t.assignedTo?.name || "Unassigned" }), canInteractWithTask(t) && _jsx("span", { className: "ml-1 text-blue-600", children: "\u2713" })] }), t.dueDate && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { children: "\uD83D\uDCC5" }), _jsx("span", { children: new Date(t.dueDate).toLocaleDateString() })] }))] }), t.resolvedNote && (_jsxs("div", { className: "bg-orange-50 border border-orange-200 p-2 rounded-lg text-xs text-gray-700 mb-3", children: [_jsx("strong", { className: "text-orange-700", children: "Note:" }), " ", t.resolvedNote] })), t.verifiedBy && (_jsxs("div", { className: "text-xs text-green-600 font-medium mb-3 flex items-center gap-1", children: [_jsx("span", { children: "\u2713" }), _jsxs("span", { children: ["Verified by ", t.verifiedBy.name] })] })), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [user?.role === "user" && canInteractWithTask(t) && (_jsxs(_Fragment, { children: [status === "open" && (_jsx("button", { onClick: () => updateStatus(t._id, "in-progress"), className: "flex-1 text-xs bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition font-medium", children: "\u25B6 Start" })), status === "in-progress" && (_jsx("button", { onClick: () => {
                                                                                const note = prompt("Add a resolved note:");
                                                                                if (note !== null)
                                                                                    updateStatus(t._id, "resolved", note);
                                                                            }, className: "flex-1 text-xs bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition font-medium", children: "\u2705 Resolve" }))] })), canModify && (_jsxs(_Fragment, { children: [status === "resolved" && (_jsx("button", { onClick: () => verifyTask(t._id), className: "flex-1 text-xs bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition font-medium", children: "\uD83C\uDFAF Verify" })), _jsx("button", { onClick: () => handleEdit(t), className: "text-xs bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition font-medium", children: "\u270F\uFE0F" }), _jsx("button", { onClick: () => deleteTask(t._id), className: "text-xs bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition font-medium", children: "\uD83D\uDDD1\uFE0F" })] })), user?.role === "user" && !canInteractWithTask(t) && (_jsxs("span", { className: "text-xs text-gray-400 flex items-center gap-1", children: [_jsx("span", { children: "\uD83D\uDC41\uFE0F" }), "View Only"] }))] })] }, t._id))), grouped[status].length === 0 && (_jsx("div", { className: "bg-white bg-opacity-50 p-8 rounded-xl text-center", children: _jsx("p", { className: "text-black text-sm", children: "No tasks" }) }))] })] }, status))) })] })), viewMode === "table" && (_jsx("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden", children: _jsxs("div", { className: "overflow-x-auto", children: [_jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm", children: _jsxs("tr", { children: [_jsx("th", { className: "p-4 font-bold", children: "Title" }), _jsx("th", { className: "p-4 font-bold", children: "Project" }), _jsx("th", { className: "p-4 font-bold", children: "Assigned" }), _jsx("th", { className: "p-4 font-bold", children: "Priority" }), _jsx("th", { className: "p-4 font-bold", children: "Due Date" }), _jsx("th", { className: "p-4 font-bold", children: "Status" }), _jsx("th", { className: "p-4 font-bold", children: "Actions" })] }) }), _jsx("tbody", { children: filteredTasks.map((t) => (_jsxs("tr", { className: `border-t hover:bg-blue-50 transition ${canInteractWithTask(t) ? "bg-blue-50 bg-opacity-50" : ""}`, children: [_jsx("td", { className: "p-4 font-semibold text-gray-800", children: t.title }), _jsx("td", { className: "p-4 text-gray-600", children: t.project?.title || "N/A" }), _jsxs("td", { className: "p-4 text-gray-600", children: [t.assignedTo?.name || "Unassigned", canInteractWithTask(t) && (_jsx("span", { className: "ml-1 text-xs text-blue-600 font-bold", children: "\u2713 You" }))] }), _jsx("td", { className: "p-4", children: _jsx("span", { className: `px-3 py-1 text-xs rounded-full font-medium ${t.priority === "high" ? "bg-red-100 text-red-700" :
                                                                t.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                                                                    "bg-green-100 text-green-700"}`, children: t.priority }) }), _jsx("td", { className: "p-4 text-gray-600 text-sm", children: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-" }), _jsx("td", { className: "p-4", children: _jsx(StatusBadge, { status: t.status }) }), _jsx("td", { className: "p-4", children: _jsxs("div", { className: "flex gap-2", children: [user?.role === "user" && canInteractWithTask(t) && (_jsxs(_Fragment, { children: [t.status === "open" && (_jsx("button", { onClick: () => updateStatus(t._id, "in-progress"), className: "px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium", children: "Start" })), t.status === "in-progress" && (_jsx("button", { onClick: () => {
                                                                                const note = prompt("Add a resolved note:");
                                                                                if (note !== null)
                                                                                    updateStatus(t._id, "resolved", note);
                                                                            }, className: "px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium", children: "Resolve" }))] })), canModify && (_jsxs(_Fragment, { children: [t.status === "resolved" && (_jsx("button", { onClick: () => verifyTask(t._id), className: "px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium", children: "Verify" })), _jsx("button", { onClick: () => handleEdit(t), className: "px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium", children: "Edit" }), _jsx("button", { onClick: () => deleteTask(t._id), className: "px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium", children: "Delete" })] })), user?.role === "user" && !canInteractWithTask(t) && (_jsx("span", { className: "text-xs text-gray-400", children: "View Only" }))] }) })] }, t._id))) })] }), filteredTasks.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCED" }), _jsx("p", { className: "text-gray-500 font-medium", children: searchQuery
                                                ? "No tasks found matching your search"
                                                : user?.role === "user"
                                                    ? "No tasks assigned to you yet"
                                                    : "No tasks found" })] }))] }) }))] })), canModify && (_jsx(Modal, { isOpen: modalOpen, onClose: handleCloseModal, title: editingTask ? "Edit Task" : "Create New Task", children: _jsx(TaskForm, { projects: projects, users: users, initialData: editingTask, onSubmit: handleCreateOrUpdateTask, loading: saving }) }))] }));
};
export default Tasks;
