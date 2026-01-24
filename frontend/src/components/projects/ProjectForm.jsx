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
      setSelectedMembers(
        initialData.members?.map((m) => m._id || m) || []
      );
    }
  }, [initialData]);

  const loadUsers = async () => {
    try {
      const data = await fetchClient("/users");
      setUsers(data);
      
      const modsAndAdmins = data.filter(
        (u) => u.role === "moderator" || u.role === "admin"
      );
      setModerators(modsAndAdmins);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleMemberToggle = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
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
    return <div className="text-center py-4 text-gray-500">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Title *
        </label>
        <input
          type="text"
          placeholder="Enter project title"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          placeholder="Enter project description"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Moderator *
        </label>
        <select
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={moderatorId}
          onChange={(e) => setModeratorId(e.target.value)}
          required
        >
          <option value="">Select a moderator</option>
          {moderators.map((mod) => (
            <option key={mod._id} value={mod._id}>
              {mod.name} ({mod.role})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Team Members
        </label>
        <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
          {users.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-2">
              No users available
            </p>
          ) : (
            users.map((user) => (
              <label
                key={user._id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(user._id)}
                  onChange={() => handleMemberToggle(user._id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {user.name}
                  <span className="text-gray-500 ml-1">({user.role})</span>
                </span>
              </label>
            ))
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {selectedMembers.length} member(s) selected
        </p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : initialData ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
};

export default ProjectForm;