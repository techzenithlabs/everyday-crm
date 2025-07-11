const TaskCard = ({ task }: { task: any }) => {
  return (
    <div className="bg-gray-100 p-3 rounded shadow-sm hover:shadow">
      <p className="text-sm">{task.title || "Untitled Task"}</p>
    </div>
  );
};

export default TaskCard;
