import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { fetchClient } from "../api/fetchClient";
import toast from "react-hot-toast";
import Modal from "../components/common/Modal";
import ProjectForm from "../components/projects/ProjectForm";
import { useAuth } from "../context/AuthContext";
const Projects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const canModify = user?.role === "moderator" || user?.role === "admin";
    const canDelete = user?.role === "admin";
    const loadProjects = async () => {
        try {
            const queryParam = filterStatus !== "all" ? `?status=${filterStatus}` : "";
            const res = await fetchClient(`/projects${queryParam}`);
            setProjects(res);
        }
        catch {
            toast.error("Failed to load projects");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadProjects();
    }, [filterStatus]);
    const handleCreateOrUpdate = async (data) => {
        try {
            setSaving(true);
            if (editingProject) {
                await fetchClient(`/projects/${editingProject._id}`, {
                    method: "PUT",
                    body: JSON.stringify(data),
                });
                toast.success("Project updated successfully! 🎉");
            }
            else {
                await fetchClient("/projects", {
                    method: "POST",
                    body: JSON.stringify(data),
                });
                toast.success("Project created successfully! 🚀");
            }
            setModalOpen(false);
            setEditingProject(null);
            loadProjects();
        }
        catch {
            toast.error(`Failed to ${editingProject ? "update" : "create"} project`);
        }
        finally {
            setSaving(false);
        }
    };
    const handleEdit = (project) => {
        setEditingProject(project);
        setModalOpen(true);
    };
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone."))
            return;
        try {
            await fetchClient(`/projects/${id}`, {
                method: "DELETE",
            });
            toast.success("Project deleted successfully");
            loadProjects();
        }
        catch {
            toast.error("Failed to delete project");
        }
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingProject(null);
    };
    const isProjectMember = (project) => {
        return project.members?.some(member => member._id === user?._id);
    };
    // Filter projects by search query
    const filteredProjects = projects.filter(project => project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const activeCount = projects.filter(p => p.status === "active").length;
    const completedCount = projects.filter(p => p.status === "completed").length;
    return (_jsxs(Layout, { children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: "\uD83D\uDCC1 Projects" }), user?.role === "user" && (_jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Showing only projects you're a member of" })), (user?.role === "moderator" || user?.role === "admin") && (_jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Managing all projects \u00B7 ", projects.length, " total"] }))] }), canModify && (_jsxs("button", { onClick: () => setModalOpen(true), className: "bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), "New Project"] }))] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsx("input", { type: "text", placeholder: "Search projects...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => setFilterStatus("all"), className: `px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === "all"
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"}`, children: ["All ", _jsxs("span", { className: "ml-1 text-xs opacity-75", children: ["(", projects.length, ")"] })] }), _jsxs("button", { onClick: () => setFilterStatus("active"), className: `px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === "active"
                                            ? "bg-green-600 text-white shadow-md"
                                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"}`, children: ["Active ", _jsxs("span", { className: "ml-1 text-xs opacity-75", children: ["(", activeCount, ")"] })] }), _jsxs("button", { onClick: () => setFilterStatus("completed"), className: `px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === "completed"
                                            ? "bg-gray-600 text-white shadow-md"
                                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"}`, children: ["Completed ", _jsxs("span", { className: "ml-1 text-xs opacity-75", children: ["(", completedCount, ")"] })] })] })] })] }), loading ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [_jsx("div", { className: "w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" }), _jsx("p", { className: "text-gray-500 font-medium", children: "Loading projects..." })] })) : filteredProjects.length === 0 ? (_jsxs("div", { className: "bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCCB" }), _jsx("h3", { className: "text-xl font-bold text-gray-700 mb-2", children: searchQuery ? "No projects found" : user?.role === "user"
                            ? "You're not assigned to any projects yet"
                            : "No projects found" }), _jsx("p", { className: "text-gray-500 mb-6", children: searchQuery
                            ? "Try adjusting your search terms"
                            : canModify
                                ? "Get started by creating your first project"
                                : "Contact your administrator to be added to a project" }), canModify && !searchQuery && (_jsxs("button", { onClick: () => setModalOpen(true), className: "bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition inline-flex items-center gap-2 font-medium", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), "Create Your First Project"] }))] })) : (_jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: filteredProjects.map((project) => (_jsxs("div", { className: "bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100 overflow-hidden group", children: [_jsx("div", { className: "bg-gradient-to-r from-blue-500 to-blue-600 p-4", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h3", { className: "text-lg font-bold text-white flex-1 pr-2", children: project.title }), _jsx("span", { className: `px-3 py-1 text-xs font-medium rounded-full ${project.status === "active"
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-700"}`, children: project.status })] }) }), _jsxs("div", { className: "p-6", children: [project.description && (_jsx("p", { className: "text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]", children: project.description })), _jsxs("div", { className: "space-y-3 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-blue-600", children: "\uD83D\uDC64" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Moderator" }), _jsx("p", { className: "text-gray-800 font-medium", children: project.moderator?.name || "Unknown" })] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("div", { className: "w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-purple-600", children: "\uD83D\uDC65" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Team Members" }), _jsxs("p", { className: "text-gray-800 font-medium", children: [project.members?.length || 0, " member", project.members?.length !== 1 ? 's' : ''] })] })] })] }), project.members && project.members.length > 0 && (_jsxs("div", { className: "mb-4 pb-4 border-b border-gray-100", children: [_jsx("p", { className: "text-xs text-gray-500 mb-2 font-medium", children: "Team:" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [project.members.slice(0, 4).map((member) => (_jsxs("span", { className: `px-3 py-1 text-xs font-medium rounded-full ${member._id === user?._id
                                                        ? "bg-blue-100 text-blue-700 ring-2 ring-blue-300"
                                                        : "bg-gray-100 text-gray-700"}`, children: [member.name, " ", member._id === user?._id && "✓"] }, member._id))), project.members.length > 4 && (_jsxs("span", { className: "px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium", children: ["+", project.members.length - 4, " more"] }))] })] })), canModify && (_jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => handleEdit(project), className: "flex-1 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }), "Edit"] }), canDelete && (_jsxs("button", { onClick: () => handleDelete(project._id), className: "px-4 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium flex items-center justify-center gap-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), "Delete"] }))] })), user?.role === "user" && (_jsx("div", { className: "pt-4 border-t border-gray-100", children: _jsxs("div", { className: "flex items-center justify-center gap-2 text-gray-500 bg-gray-50 py-2 rounded-lg", children: [_jsxs("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }), _jsx("span", { className: "text-xs font-medium", children: "View Only - Team Member" })] }) }))] })] }, project._id))) })), canModify && (_jsx(Modal, { isOpen: modalOpen, onClose: handleCloseModal, title: editingProject ? "Edit Project" : "Create New Project", children: _jsx(ProjectForm, { initialData: editingProject, onSubmit: handleCreateOrUpdate, loading: saving }) }))] }));
};
export default Projects;
