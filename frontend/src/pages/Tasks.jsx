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
    } catch {
      toast.error("Failed to load tasks");
    } finally {
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
      } else {
        await fetchClient("/tasks", {
          method: "POST",
          body: JSON.stringify(data),
        });
        toast.success("Task created successfully! 🎉");
      }
      setModalOpen(false);
      setEditingTask(null);
      loadData();
    } catch {
      toast.error(`Failed to ${editingTask ? "update" : "create"} task`);
    } finally {
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
    } catch {
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
    } catch {
      toast.error("Failed to verify task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const deleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetchClient(`/tasks/${id}`, { method: "DELETE" });
      toast.success("Task deleted successfully");
      loadData();
    } catch {
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

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <Layout>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              ✅ Tasks
            </h1>
            {user?.role === "user" && (
              <p className="text-sm text-gray-500 mt-1">Showing only tasks assigned to you · {tasks.length} total</p>
            )}
            {(user?.role === "moderator" || user?.role === "admin") && (
              <p className="text-sm text-gray-500 mt-1">Managing all tasks · {tasks.length} total</p>
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
              New Task
            </button>
          )}
        </div>

        {/* Search and View Toggle */}
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
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            />
          </div>

          {/* View Toggle */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode("board")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === "board"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Board
              </span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === "table"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Table
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading tasks...</p>
        </div>
      ) : (
        <>
          {/* Board View */}
          {viewMode === "board" && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📊 Workflow Board
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {["open", "in-progress", "resolved", "verified"].map((status) => (
                  <div key={status} className={`bg-gradient-to-br ${getStatusGradient(status)} rounded-2xl p-4 shadow-lg`}>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 mb-3">
                      <h3 className="font-bold text-black capitalize flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="text-2xl">{getStatusIcon(status)}</span>
                          {status.replace("-", " ")}
                        </span>
                        <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm">
                          {grouped[status].length}
                        </span>
                      </h3>
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {grouped[status].map((t) => (
                        <div
                          key={t._id}
                          className={`bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 ${getPriorityColor(t.priority)}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-800 flex-1 pr-2">{t.title}</h4>
                            {t.priority && (
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                t.priority === "high" ? "bg-red-100 text-red-700" :
                                t.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                                "bg-green-100 text-green-700"
                              }`}>
                                {t.priority}
                              </span>
                            )}
                          </div>
                          {t.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {t.description}
                            </p>
                          )}
                          <div className="space-y-1 text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <span>📁</span>
                              <span>{t.project?.title || "N/A"}</span>
                            </div>
                            <div className={`flex items-center gap-1 ${canInteractWithTask(t) ? "font-medium text-blue-600" : ""}`}>
                              <span>👤</span>
                              <span>{t.assignedTo?.name || "Unassigned"}</span>
                              {canInteractWithTask(t) && <span className="ml-1 text-blue-600">✓</span>}
                            </div>
                            {t.dueDate && (
                              <div className="flex items-center gap-1">
                                <span>📅</span>
                                <span>{new Date(t.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          {t.resolvedNote && (
                            <div className="bg-orange-50 border border-orange-200 p-2 rounded-lg text-xs text-gray-700 mb-3">
                              <strong className="text-orange-700">Note:</strong> {t.resolvedNote}
                            </div>
                          )}
                          {t.verifiedBy && (
                            <div className="text-xs text-green-600 font-medium mb-3 flex items-center gap-1">
                              <span>✓</span>
                              <span>Verified by {t.verifiedBy.name}</span>
                            </div>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            {user?.role === "user" && canInteractWithTask(t) && (
                              <>
                                {status === "open" && (
                                  <button
                                    onClick={() => updateStatus(t._id, "in-progress")}
                                    className="flex-1 text-xs bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                                  >
                                    ▶ Start
                                  </button>
                                )}
                                {status === "in-progress" && (
                                  <button
                                    onClick={() => {
                                      const note = prompt("Add a resolved note:");
                                      if (note !== null) updateStatus(t._id, "resolved", note);
                                    }}
                                    className="flex-1 text-xs bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                                  >
                                    ✅ Resolve
                                  </button>
                                )}
                              </>
                            )}
                            {canModify && (
                              <>
                                {status === "resolved" && (
                                  <button
                                    onClick={() => verifyTask(t._id)}
                                    className="flex-1 text-xs bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                                  >
                                    🎯 Verify
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEdit(t)}
                                  className="text-xs bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => deleteTask(t._id)}
                                  className="text-xs bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                                >
                                  🗑️
                                </button>
                              </>
                            )}
                            {user?.role === "user" && !canInteractWithTask(t) && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <span>👁️</span>
                                View Only
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {grouped[status].length === 0 && (
                        <div className="bg-white bg-opacity-50 p-8 rounded-xl text-center">
                          <p className="text-black text-sm">No tasks</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm">
                    <tr>
                      <th className="p-4 font-bold">Title</th>
                      <th className="p-4 font-bold">Project</th>
                      <th className="p-4 font-bold">Assigned</th>
                      <th className="p-4 font-bold">Priority</th>
                      <th className="p-4 font-bold">Due Date</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((t) => (
                      <tr 
                        key={t._id} 
                        className={`border-t hover:bg-blue-50 transition ${
                          canInteractWithTask(t) ? "bg-blue-50 bg-opacity-50" : ""
                        }`}
                      >
                        <td className="p-4 font-semibold text-gray-800">{t.title}</td>
                        <td className="p-4 text-gray-600">
                          {t.project?.title || "N/A"}
                        </td>
                        <td className="p-4 text-gray-600">
                          {t.assignedTo?.name || "Unassigned"}
                          {canInteractWithTask(t) && (
                            <span className="ml-1 text-xs text-blue-600 font-bold">✓ You</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            t.priority === "high" ? "bg-red-100 text-red-700" :
                            t.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">
                          {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {user?.role === "user" && canInteractWithTask(t) && (
                              <>
                                {t.status === "open" && (
                                  <button
                                    onClick={() => updateStatus(t._id, "in-progress")}
                                    className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                                  >
                                    Start
                                  </button>
                                )}
                                {t.status === "in-progress" && (
                                  <button
                                    onClick={() => {
                                      const note = prompt("Add a resolved note:");
                                      if (note !== null) updateStatus(t._id, "resolved", note);
                                    }}
                                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                                  >
                                    Resolve
                                  </button>
                                )}
                              </>
                            )}
                            {canModify && (
                              <>
                                {t.status === "resolved" && (
                                  <button
                                    onClick={() => verifyTask(t._id)}
                                    className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                                  >
                                    Verify
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEdit(t)}
                                  className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteTask(t._id)}
                                  className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                            {user?.role === "user" && !canInteractWithTask(t) && (
                              <span className="text-xs text-gray-400">View Only</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-500 font-medium">
                      {searchQuery
                        ? "No tasks found matching your search"
                        : user?.role === "user" 
                          ? "No tasks assigned to you yet"
                          : "No tasks found"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Modal */}
      {canModify && (
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          title={editingTask ? "Edit Task" : "Create New Task"}
        >
          <TaskForm
            projects={projects}
            users={users}
            initialData={editingTask}
            onSubmit={handleCreateOrUpdateTask}
            loading={saving}
          />
        </Modal>
      )}
    </Layout>
  );
};

export default Tasks;