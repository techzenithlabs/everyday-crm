const DashboardCards = () => {
  const cards = [
    { title: "Leads", value: 6, meta: "Active: 5, Inactive: 1", border: "border-yellow-400" },
    { title: "Projects", value: 4, meta: "In Process: 2, Completed: 2", border: "border-green-400" },
    { title: "Invoices", value: 5, meta: "Due: 2, Received: 3", border: "border-purple-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-white p-6 rounded-lg shadow-sm border-t-4 ${card.border}`}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-2">{card.title}</h3>
          <p className="text-4xl font-bold text-gray-800 mb-2">{card.value}</p>
          <p className="text-sm text-gray-600 mt-1">{card.meta}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
