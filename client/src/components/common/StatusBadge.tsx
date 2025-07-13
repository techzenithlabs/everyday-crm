const statusColors: Record<string, string> = {
  todo: "bg-gray-300 text-gray-800",
  in_progress: "bg-yellow-200 text-yellow-800",
  review: "bg-purple-200 text-purple-800",
  blocked: "bg-red-200 text-red-800",
  completed: "bg-green-200 text-green-800",
};

const StatusBadge = ({ status }: { status: string }) => {
  const style = statusColors[status] || "bg-gray-100 text-gray-700";
  return (
    <span className={`text-xs px-2 py-1 rounded font-semibold ${style}`}>
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
};

export default StatusBadge;
