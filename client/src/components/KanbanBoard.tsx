const KanbanBoard = () => {
  const hasItems = false;

  const columns = [
    { title: "Leads", items: ["Lead 1", "Lead 2"] },
    { title: "In Progress", items: ["Project 1"] },
    { title: "Completed", items: ["Project X"] },
  ];

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Schedule (Next 30 Days)</h2>

      <div className="bg-white shadow rounded-lg p-6">
        {hasItems ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col) => (
              <div key={col.title} className="bg-gray-50 rounded-md p-4 border">
                <h4 className="text-md font-semibold text-gray-700 mb-3">
                  {col.title}
                </h4>
                <div className="space-y-2">
                  {col.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white border rounded p-3 text-gray-600 shadow-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            No appointments or projects scheduled in the next 30 days.
          </p>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
