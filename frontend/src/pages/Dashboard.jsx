import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { fetchClient } from "../api/fetchClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const COLORS = {
  open: "#3b82f6",
  "in-progress": "#8b5cf6",
  resolved: "#f59e0b",
  verified: "#22c55e",
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const [statsData, tasksData] = await Promise.all([
        fetchClient("/dashboard"),
        fetchClient("/tasks"),
      ]);
      setStats(statsData);
      
      // Get recent tasks based on role
      const myTasks = user?.role === "user" 
        ? tasksData.filter(t => t.assignedTo?._id === user?._id)
        : tasksData;
      setRecentTasks(myTasks.slice(0, 5));
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const statusChartData = stats?.tasksByStatus?.map((s) => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1).replace("-", " "),
    value: s.count,
    color: COLORS[s._id] || "#6b7280",
  })) || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-blue-100 text-blue-700",
      "in-progress": "bg-purple-100 text-purple-700",
      resolved: "bg-orange-100 text-orange-700",
      verified: "bg-green-100 text-green-700",
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    };
    return colors[priority] || colors.medium;
  };

  return (
    <Layout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {getGreeting()}, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your {user?.role === "user" ? "tasks" : "projects"} today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon="📁"
          gradient="from-blue-500 to-blue-600"
          trend="+12%"
        />
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon="✅"
          gradient="from-purple-500 to-purple-600"
          trend="+8%"
        />
        <StatCard
          title="Completed"
          value={stats?.completedTasks || 0}
          icon="🎯"
          gradient="from-green-500 to-green-600"
          trend="+23%"
        />
        <StatCard
          title="Pending"
          value={stats?.pendingTasks || 0}
          icon="⏳"
          gradient="from-orange-500 to-orange-600"
          trend="-5%"
        />
        {user?.role === "admin" && (
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon="👥"
            gradient="from-pink-500 to-pink-600"
            trend="+3"
          />
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Task Distribution</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              By Status
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {statusChartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.name}: <span className="font-semibold">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Task Overview</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Comparison
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {statusChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {user?.role === "user" ? "My Recent Tasks" : "Recent Tasks"}
          </h2>
          <a
            href="/tasks"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {recentTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">
              {user?.role === "user" ? "No tasks assigned to you yet" : "No tasks available"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-gray-200 to-white rounded-xl hover:from-blue-50 hover:to-white transition-all border border-gray-100 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex-1 mb-3 sm:mb-0">
                  <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      📁 {task.project?.title || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      👤 {task.assignedTo?.name || "Unassigned"}
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {task.priority && (
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  )}
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {task.status.replace("-", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">
              Quick Tips for {user?.role}s
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              {user?.role === "user" && (
                <>
                  <li>• You can view projects you're a member of in the Projects section</li>
                  <li>• Start working on tasks by clicking "Start" on open tasks</li>
                  <li>• Mark tasks as resolved when you complete them</li>
                </>
              )}
              {user?.role === "moderator" && (
                <>
                  <li>• You can create and manage projects and tasks</li>
                  <li>• Verify completed tasks from your team members</li>
                  <li>• Assign tasks to users in your projects</li>
                </>
              )}
              {user?.role === "admin" && (
                <>
                  <li>• You have full access to manage users, projects, and tasks</li>
                  <li>• Monitor team performance through the analytics dashboard</li>
                  <li>• Delete projects and tasks when needed</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StatCard = ({ title, value, icon, gradient, trend }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-opacity-90 text-sm font-medium mb-1">
            {title}
          </p>
          <h2 className="text-white text-3xl font-bold">{value}</h2>
          {trend && (
            <p className="text-white text-opacity-80 text-xs mt-2">
              {trend.startsWith("+") ? "↗" : "↘"} {trend} from last month
            </p>
          )}
        </div>
        <div className="text-white text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};

export default Dashboard;