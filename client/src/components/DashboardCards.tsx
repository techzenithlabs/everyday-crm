const DashboardCards = () => {
  const cards = [
    { title: "Upcoming Appointments", value: "No upcoming appointments." },
    { title: "New Leads", value: "3 new leads this week." },
    { title: "Active Projects", value: "5 projects in progress." }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
          <p className="text-gray-600">{card.value}</p>
        </div>
      ))}
    </div>
  );
};
export default DashboardCards;
