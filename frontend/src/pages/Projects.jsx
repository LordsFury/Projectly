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
        toast.success("Project updated");
      } else {
        await fetchClient("/projects", {
          method: "POST",
          body: JSON.stringify(data),
        });
        toast.success("Project created");
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
    if (!confirm("Delete this project?")) return;

    try {
      await fetchClient(`/projects/${id}`, {
        method: "DELETE",
      });
      toast.success("Project deleted");
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

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            {user?.role === "user" && (
              <p className="text-sm text-gray-500 mt-1">Showing only projects you're a member of</p>
            )}
            {(user?.role === "moderator" || user?.role === "admin") && (
              <p className="text-sm text-gray-500 mt-1">Managing all projects</p>
            )}
          </div>
          {canModify && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + New Project
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === "completed"
                ? "bg-gray-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
          {user?.role === "user" 
            ? "You're not assigned to any projects yet 📋"
            : "No projects found 📋"
          }
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {project.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    project.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {project.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">Moderator:</span>
                  <span className="text-gray-700 font-medium">
                    {project.moderator?.name || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">Members:</span>
                  <span className="text-gray-700">
                    {project.members?.length || 0} member(s)
                  </span>
                </div>
              </div>

              {project.members && project.members.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Team:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.members.slice(0, 3).map((member) => (
                      <span
                        key={member._id}
                        className={`px-2 py-1 text-xs rounded ${
                          member._id === user?._id
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {member.name} {member._id === user?._id && "(You)"}
                      </span>
                    ))}
                    {project.members.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{project.members.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {canModify && (
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}

              {user?.role === "user" && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    👁️ View Only - Team Member
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {canModify && (
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          title={editingProject ? "Edit Project" : "Create Project"}
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