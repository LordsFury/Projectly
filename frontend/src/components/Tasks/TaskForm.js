import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const TaskForm = ({ projects, users, initialData, onSubmit, loading }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [project, setProject] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("open");
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setDescription(initialData.description || "");
            setProject(initialData.project?._id || initialData.project || "");
            setAssignedTo(initialData.assignedTo?._id || initialData.assignedTo || "");
            setPriority(initialData.priority || "medium");
            setStatus(initialData.status || "open");
            if (initialData.dueDate) {
                const date = new Date(initialData.dueDate);
                setDueDate(date.toISOString().split('T')[0]);
            }
        }
    }, [initialData]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            title,
            description,
            project,
            assignedTo,
            priority,
            status,
        };
        if (dueDate) {
            taskData.dueDate = dueDate;
        }
        onSubmit(taskData);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Task Title *" }), _jsx("input", { type: "text", placeholder: "Enter task title", className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: title, onChange: (e) => setTitle(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { placeholder: "Enter task description", className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none", rows: "3", value: description, onChange: (e) => setDescription(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Project *" }), _jsxs("select", { className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: project, onChange: (e) => setProject(e.target.value), required: true, children: [_jsx("option", { value: "", children: "Select Project" }), projects.map((p) => (_jsx("option", { value: p._id, children: p.title }, p._id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Assign To *" }), _jsxs("select", { className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: assignedTo, onChange: (e) => setAssignedTo(e.target.value), required: true, children: [_jsx("option", { value: "", children: "Select User" }), users.map((u) => (_jsxs("option", { value: u._id, children: [u.name, " (", u.role, ")"] }, u._id)))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Priority" }), _jsxs("select", { className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: priority, onChange: (e) => setPriority(e.target.value), children: [_jsx("option", { value: "low", children: "Low" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "high", children: "High" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Due Date" }), _jsx("input", { type: "date", className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: dueDate, onChange: (e) => setDueDate(e.target.value) })] })] }), initialData && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), _jsxs("select", { className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", value: status, onChange: (e) => setStatus(e.target.value), children: [_jsx("option", { value: "open", children: "Open" }), _jsx("option", { value: "in-progress", children: "In Progress" }), _jsx("option", { value: "resolved", children: "Resolved" }), _jsx("option", { value: "verified", children: "Verified" })] })] })), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? "Saving..." : initialData ? "Update Task" : "Create Task" })] }));
};
export default TaskForm;
