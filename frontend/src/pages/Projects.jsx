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
    } catch {
      toast.error("Failed to load projects");
    } finally {
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
      } else {
        await fetchClient("/projects", {
          method: "POST",
          body: JSON.stringify(data),
        });
        toast.success("Project created successfully! 🚀");
      }
      setModalOpen(false);
      setEditingProject(null);
      loadProjects();
    } catch {
      toast.error(`Failed to ${editingProject ? "update" : "create"} project`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    try {
      await fetchClient(`/projects/${id}`, {
        method: "DELETE",
      });
      toast.success("Project deleted successfully");
      loadProjects();
    } catch {
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
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = projects.filter(p => p.status === "active").length;
  const completedCount = projects.filter(p => p.status === "completed").length;

  return (
    <Layout>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              📁 Projects
            </h1>
            {user?.role === "user" && (
              <p className="text-sm text-gray-500 mt-1">Showing only projects you're a member of</p>
            )}
            {(user?.role === "moderator" || user?.role === "admin") && (
              <p className="text-sm text-gray-500 mt-1">Managing all projects · {projects.length} total</p>
            )}
          </div>
          {canModify && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </button>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filterStatus === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All <span className="ml-1 text-xs opacity-75">({projects.length})</span>
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filterStatus === "active"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Active <span className="ml-1 text-xs opacity-75">({activeCount})</span>
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filterStatus === "completed"
                  ? "bg-gray-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Completed <span className="ml-1 text-xs opacity-75">({completedCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {searchQuery ? "No projects found" : user?.role === "user" 
              ? "You're not assigned to any projects yet"
              : "No projects found"
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? "Try adjusting your search terms"
              : canModify 
                ? "Get started by creating your first project"
                : "Contact your administrator to be added to a project"
            }
          </p>
          {canModify && !searchQuery && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition inline-flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
            >
              {/* Project Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white flex-1 pr-2">
                    {project.title}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      project.status === "active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Project Body */}
              <div className="p-6">
                {project.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {project.description}
                  </p>
                )}

                {/* Project Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Moderator</p>
                      <p className="text-gray-800 font-medium">
                        {project.moderator?.name || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600">👥</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Team Members</p>
                      <p className="text-gray-800 font-medium">
                        {project.members?.length || 0} member{project.members?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                {project.members && project.members.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Team:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.members.slice(0, 4).map((member) => (
                        <span
                          key={member._id}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            member._id === user?._id
                              ? "bg-blue-100 text-blue-700 ring-2 ring-blue-300"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {member.name} {member._id === user?._id && "✓"}
                        </span>
                      ))}
                      {project.members.length > 4 && (
                        <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                          +{project.members.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {canModify && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="px-4 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                )}

                {/* View Only Badge */}
                {user?.role === "user" && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-gray-500 bg-gray-50 py-2 rounded-lg">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-xs font-medium">View Only - Team Member</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {canModify && (
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          title={editingProject ? "Edit Project" : "Create New Project"}
        >
          <ProjectForm
            initialData={editingProject}
            onSubmit={handleCreateOrUpdate}
            loading={saving}
          />
        </Modal>
      )}
    </Layout>
  );
};

export default Projects;