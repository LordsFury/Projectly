const colors = {
  open: "bg-gray-200 text-gray-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  verified: "bg-purple-100 text-purple-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-gray-300 text-gray-700",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
