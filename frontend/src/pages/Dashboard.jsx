import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { fetchClient } from "../api/fetchClient";
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
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const data = await fetchClient("/dashboard");
      setStats(data);
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
        <p className="text-gray-500">Loading dashboard...</p>
      </Layout>
    );
  }

  const statusChartData = stats.tasksByStatus.map((s) => ({
    name: s._id,
    value: s.count,
  }));

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Analytics Dashboard 📊
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card title="Projects" value={stats.totalProjects} />
        <Card title="Tasks" value={stats.totalTasks} />
        <Card title="Completed" value={stats.completedTasks} />
        <Card title="Pending" value={stats.pendingTasks} />
        <Card title="Users" value={stats.totalUsers} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Tasks by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusChartData} dataKey="value" nameKey="name">
                {statusChartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Tasks Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

const Card = ({ title, value }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
    </div>
  );
};

export default Dashboard;
