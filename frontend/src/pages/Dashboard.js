import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { fetchClient } from "../api/fetchClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, LineChart, Line, CartesianGrid, } from "recharts";
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
        }
        catch (err) {
            toast.error("Failed to load dashboard data");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadStats();
    }, []);
    if (loading) {
        return (_jsx(Layout, { children: _jsx("div", { className: "flex items-center justify-center h-96", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" }), _jsx("p", { className: "text-gray-500 font-medium", children: "Loading your dashboard..." })] }) }) }));
    }
    const statusChartData = stats?.tasksByStatus?.map((s) => ({
        name: s._id.charAt(0).toUpperCase() + s._id.slice(1).replace("-", " "),
        value: s.count,
        color: COLORS[s._id] || "#6b7280",
    })) || [];
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12)
            return "Good morning";
        if (hour < 18)
            return "Good afternoon";
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
    return (_jsxs(Layout, { children: [_jsxs("div", { className: "mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-800 mb-2", children: [getGreeting(), ", ", user?.name, "! \uD83D\uDC4B"] }), _jsxs("p", { className: "text-gray-600", children: ["Here's what's happening with your ", user?.role === "user" ? "tasks" : "projects", " today."] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8", children: [_jsx(StatCard, { title: "Total Projects", value: stats?.totalProjects || 0, icon: "\uD83D\uDCC1", gradient: "from-blue-500 to-blue-600", trend: "+12%" }), _jsx(StatCard, { title: "Total Tasks", value: stats?.totalTasks || 0, icon: "\u2705", gradient: "from-purple-500 to-purple-600", trend: "+8%" }), _jsx(StatCard, { title: "Completed", value: stats?.completedTasks || 0, icon: "\uD83C\uDFAF", gradient: "from-green-500 to-green-600", trend: "+23%" }), _jsx(StatCard, { title: "Pending", value: stats?.pendingTasks || 0, icon: "\u23F3", gradient: "from-orange-500 to-orange-600", trend: "-5%" }), user?.role === "admin" && (_jsx(StatCard, { title: "Total Users", value: stats?.totalUsers || 0, icon: "\uD83D\uDC65", gradient: "from-pink-500 to-pink-600", trend: "+3" }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Task Distribution" }), _jsx("span", { className: "text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full", children: "By Status" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: statusChartData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 100, label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, labelLine: false, children: statusChartData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, index))) }), _jsx(Tooltip, {})] }) }), _jsx("div", { className: "mt-6 grid grid-cols-2 gap-3", children: statusChartData.map((item, idx) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: item.color } }), _jsxs("span", { className: "text-sm text-gray-600", children: [item.name, ": ", _jsx("span", { className: "font-semibold", children: item.value })] })] }, idx))) })] }), _jsxs("div", { className: "bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Task Overview" }), _jsx("span", { className: "text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full", children: "Comparison" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: statusChartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 12 } }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: "#fff",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                            } }), _jsx(Bar, { dataKey: "value", radius: [8, 8, 0, 0], children: statusChartData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, index))) })] }) })] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800", children: user?.role === "user" ? "My Recent Tasks" : "Recent Tasks" }), _jsxs("a", { href: "/tasks", className: "text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition", children: ["View All", _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] }), recentTasks.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCED" }), _jsx("p", { className: "text-gray-500", children: user?.role === "user" ? "No tasks assigned to you yet" : "No tasks available" })] })) : (_jsx("div", { className: "space-y-3", children: recentTasks.map((task) => (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-gray-200 to-white rounded-xl hover:from-blue-50 hover:to-white transition-all border border-gray-100 hover:border-blue-200 hover:shadow-md", children: [_jsxs("div", { className: "flex-1 mb-3 sm:mb-0", children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-1", children: task.title }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-sm text-gray-600", children: [_jsxs("span", { className: "flex items-center gap-1", children: ["\uD83D\uDCC1 ", task.project?.title || "N/A"] }), _jsxs("span", { className: "flex items-center gap-1", children: ["\uD83D\uDC64 ", task.assignedTo?.name || "Unassigned"] }), task.dueDate && (_jsxs("span", { className: "flex items-center gap-1", children: ["\uD83D\uDCC5 ", new Date(task.dueDate).toLocaleDateString()] }))] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [task.priority && (_jsx("span", { className: `px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`, children: task.priority })), _jsx("span", { className: `px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`, children: task.status.replace("-", " ") })] })] }, task._id))) }))] }), _jsx("div", { className: "mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "text-3xl", children: "\uD83D\uDCA1" }), _jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-blue-900 mb-2", children: ["Quick Tips for ", user?.role, "s"] }), _jsxs("ul", { className: "text-sm text-blue-800 space-y-1", children: [user?.role === "user" && (_jsxs(_Fragment, { children: [_jsx("li", { children: "\u2022 You can view projects you're a member of in the Projects section" }), _jsx("li", { children: "\u2022 Start working on tasks by clicking \"Start\" on open tasks" }), _jsx("li", { children: "\u2022 Mark tasks as resolved when you complete them" })] })), user?.role === "moderator" && (_jsxs(_Fragment, { children: [_jsx("li", { children: "\u2022 You can create and manage projects and tasks" }), _jsx("li", { children: "\u2022 Verify completed tasks from your team members" }), _jsx("li", { children: "\u2022 Assign tasks to users in your projects" })] })), user?.role === "admin" && (_jsxs(_Fragment, { children: [_jsx("li", { children: "\u2022 You have full access to manage users, projects, and tasks" }), _jsx("li", { children: "\u2022 Monitor team performance through the analytics dashboard" }), _jsx("li", { children: "\u2022 Delete projects and tasks when needed" })] }))] })] })] }) })] }));
};
const StatCard = ({ title, value, icon, gradient, trend }) => {
    return (_jsx("div", { className: `bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-white text-opacity-90 text-sm font-medium mb-1", children: title }), _jsx("h2", { className: "text-white text-3xl font-bold", children: value }), trend && (_jsxs("p", { className: "text-white text-opacity-80 text-xs mt-2", children: [trend.startsWith("+") ? "↗" : "↘", " ", trend, " from last month"] }))] }), _jsx("div", { className: "text-white text-4xl opacity-80", children: icon })] }) }));
};
export default Dashboard;
