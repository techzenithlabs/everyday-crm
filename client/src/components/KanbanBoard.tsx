const KanbanBoard = () => {
  const columns = [
    { title: "Leads", items: ["Lead 1", "Lead 2"] },
    { title: "In Progress", items: ["Project 1"] },
    { title: "Completed", items: ["Project X"] }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      {columns.map((col) => (
        <div
          key={col.title}
          className="bg-white rounded-lg shadow-sm p-4 flex-1 min-w-[300px]"
        >
          <h4 className="text-md font-semibold mb-4 text-gray-800">{col.title}</h4>
          <div className="space-y-3">
            {col.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#ecf0f1] p-3 rounded-md shadow-sm text-gray-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
