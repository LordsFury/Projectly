import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { fetchClient } from "../api/fetchClient";
import toast from "react-hot-toast";
import Modal from "../components/common/Modal";
import UserForm from "../components/users/UserForm";
import { useAuth } from "../context/AuthContext";

const Users = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const loadUsers = async () => {
    try {
      const res = await fetchClient("/users");
      setUsers(res);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (data) => {
    try {
      setSaving(true);
      await fetchClient("/users", {
        method: "POST",
        body: JSON.stringify(data),
      });
      toast.success("User created successfully! 🎉");
      setModalOpen(false);
      loadUsers();
    } catch {
      toast.error("Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await fetchClient(`/users/${id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role }),
      });
      toast.success("Role updated successfully! ✅");
      loadUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      await fetchClient(`/users/${id}`, {
        method: "DELETE",
      });
      toast.success("User deleted successfully");
      loadUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  // Filter and search users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleCounts = () => ({
    all: users.length,
    admin: users.filter(u => u.role === "admin").length,
    moderator: users.filter(u => u.role === "moderator").length,
    user: users.filter(u => u.role === "user").length,
  });

  const counts = getRoleCounts();

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-700 ring-2 ring-red-300",
      moderator: "bg-purple-100 text-purple-700 ring-2 ring-purple-300",
      user: "bg-blue-100 text-blue-700 ring-2 ring-blue-300",
    };
    return colors[role] || colors.user;
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: "👑",
      moderator: "⭐",
      user: "👤",
    };
    return icons[role] || "👤";
  };

  if (user?.role !== "admin") {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-md border border-red-100">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              This page is only accessible to administrators.
            </p>
            <div className="bg-red-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-red-700">
                Required: Admin · Your role: {user?.role}
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              👥 Users Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage user accounts and permissions · {users.length} total users
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-2xl font-bold">{counts.all}</div>
            <div className="text-xs text-blue-100">Total Users</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
            <div className="text-2xl mb-1">👑</div>
            <div className="text-2xl font-bold">{counts.admin}</div>
            <div className="text-xs text-red-100">Admins</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-2xl font-bold">{counts.moderator}</div>
            <div className="text-xs text-purple-100">Moderators</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
            <div className="text-2xl mb-1">👤</div>
            <div className="text-2xl font-bold">{counts.user}</div>
            <div className="text-xs text-green-100">Regular Users</div>
          </div>
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            />
          </div>

          {/* Role Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterRole("all")}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                filterRole === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setFilterRole("admin")}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                filterRole === "admin"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              👑 Admin ({counts.admin})
            </button>
            <button
              onClick={() => setFilterRole("moderator")}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                filterRole === "moderator"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              ⭐ Moderator ({counts.moderator})
            </button>
            <button
              onClick={() => setFilterRole("user")}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                filterRole === "user"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              👤 User ({counts.user})
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {searchQuery ? "No users found" : "No users found"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? "Try adjusting your search terms"
              : "Get started by creating your first user"
            }
          </p>
          {!searchQuery && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition inline-flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First User
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="p-4 font-bold">User</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Role</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr 
                    key={u._id} 
                    className={`border-t hover:bg-blue-50 transition ${
                      u._id === user._id ? "bg-blue-50 bg-opacity-50" : ""
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          u.role === "admin" ? "bg-red-100" :
                          u.role === "moderator" ? "bg-purple-100" :
                          "bg-blue-100"
                        }`}>
                          {getRoleIcon(u.role)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 flex items-center gap-2">
                            {u.name}
                            {u._id === user._id && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        {u.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u._id, e.target.value)}
                        disabled={u._id === user._id}
                        className={`px-3 py-2 border-2 rounded-xl text-sm font-medium transition-all ${getRoleBadgeColor(u.role)} ${
                          u._id === user._id 
                            ? "cursor-not-allowed opacity-60" 
                            : "cursor-pointer hover:shadow-md"
                        }`}
                      >
                        <option value="user">👤 User</option>
                        <option value="moderator">⭐ Moderator</option>
                        <option value="admin">👑 Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        ● Active
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {u._id !== user._id ? (
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="px-4 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400 italic px-4 py-2">
                            Cannot delete yourself
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New User"
      >
        <UserForm onSubmit={createUser} loading={saving} />
      </Modal>
    </Layout>
  );
};

export default Users;