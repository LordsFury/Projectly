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
        toast.success("Task updated");
      } else {
        await fetchClient("/tasks", {
          method: "POST",
          body: JSON.stringify(data),
        });
        toast.success("Task created");
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
      toast.success("Task updated");
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
      toast.success("Task verified");
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
    if (!confirm("Delete this task?")) return;
    try {
      await fetchClient(`/tasks/${id}`, { method: "DELETE" });
      toast.success("Task deleted");
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

  const grouped = {
    open: tasks.filter((t) => t.status === "open"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    resolved: tasks.filter((t) => t.status === "resolved"),
    verified: tasks.filter((t) => t.status === "verified"),
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "border-l-4 border-green-500",
      medium: "border-l-4 border-yellow-500",
      high: "border-l-4 border-red-500",
    };
    return colors[priority] || colors.medium;
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          {user?.role === "user" && (
            <p className="text-sm text-gray-500 mt-1">Showing only tasks assigned to you</p>
          )}
        </div>
        {canModify && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Task
          </button>
        )}
      </div>
      <h2 className="text-lg font-semibold mb-3">Workflow Board</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {["open", "in-progress", "resolved", "verified"].map((status) => (
          <div key={status} className="bg-gray-100 rounded-xl p-3">
            <h3 className="font-semibold mb-3 capitalize">
              {status.replace("-", " ")} ({grouped[status].length})
            </h3>
            <div className="space-y-3">
              {grouped[status].map((t) => (
                <div
                  key={t._id}
                  className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition ${getPriorityColor(t.priority)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{t.title}</h4>
                    {t.priority && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        t.priority === "high" ? "bg-red-100 text-red-700" :
                        t.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {t.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {t.description}
                  </p>
                  <div className="text-xs text-gray-500 mb-3">
                    <div>📁 {t.project?.title || "N/A"}</div>
                    <div className={canInteractWithTask(t) ? "font-medium text-blue-600" : ""}>
                      👤 {t.assignedTo?.name || "Unassigned"} 
                      {canInteractWithTask(t) && " (You)"}
                    </div>
                    {t.dueDate && (
                      <div>📅 {new Date(t.dueDate).toLocaleDateString()}</div>
                    )}
                  </div>
                  {t.resolvedNote && (
                    <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 mb-2">
                      <strong>Note:</strong> {t.resolvedNote}
                    </div>
                  )}
                  {t.verifiedBy && (
                    <div className="text-xs text-green-600 mb-2">
                      ✓ Verified by {t.verifiedBy.name}
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {user?.role === "user" && canInteractWithTask(t) && (
                      <>
                        {status === "open" && (
                          <button
                            onClick={() => updateStatus(t._id, "in-progress")}
                            className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                          >
                            Start
                          </button>
                        )}
                        {status === "in-progress" && (
                          <button
                            onClick={() => {
                              const note = prompt("Add a resolved note:");
                              if (note !== null) updateStatus(t._id, "resolved", note);
                            }}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            Resolve
                          </button>
                        )}
                      </>
                    )}
                    {canModify && (
                      <>
                        {status === "resolved" && (
                          <button
                            onClick={() => verifyTask(t._id)}
                            className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(t)}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(t._id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {user?.role === "user" && !canInteractWithTask(t) && (
                      <span className="text-xs text-gray-400">👁️ View Only</span>
                    )}
                  </div>
                </div>
              ))}
              {grouped[status].length === 0 && (
                <p className="text-sm text-gray-400 text-center">
                  No tasks
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-semibold mb-3">All Tasks (Table View)</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Project</th>
              <th className="p-4">Assigned</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr 
                key={t._id} 
                className={`border-t hover:bg-gray-50 transition ${
                  canInteractWithTask(t) ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-4 font-medium">{t.title}</td>
                <td className="p-4 text-gray-600">
                  {t.project?.title || "N/A"}
                </td>
                <td className="p-4 text-gray-600">
                  {t.assignedTo?.name || "Unassigned"}
                  {canInteractWithTask(t) && (
                    <span className="ml-1 text-xs text-blue-600 font-medium">(You)</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded ${
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
                            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
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
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
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
                            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(t)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(t._id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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
        {tasks.length === 0 && (
          <p className="text-center text-gray-500 p-6">
            {user?.role === "user" 
              ? "No tasks assigned to you yet 📭"
              : "No tasks found 📭"
            }
          </p>
        )}
      </div>
      
      {canModify && (
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          title={editingTask ? "Edit Task" : "Create Task"}
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