const DashboardCards = () => {
  const cards = [

    { title: "Leads", value: 6, statuslead1:"Active:", statuscount1:5, statuslead2:"InActive:",statuscount2:1, border: "border-yellow-400" },
    { title: "Projects", value: 4, statuslead1:"In Process:", statuscount1:2, statuslead2:"Completed:",statuscount2:1, border: "border-green-400" },
    { title: "Invoices", value: 5, statuslead1:"Due:", statuscount1:5, statuslead2:"Recieved:",statuscount2:1, border: "border-purple-400" },
  ];

  return (
    <div className="border-t border-gray-200 shadow-sm">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-white p-6 rounded-lg shadow-sm border-t-4 ${card.border}`}
        >
          <h3 className="text-base font-medium text-gray-500 mb-2">{card.title}</h3>
          <p className="text-5xl font-bold text-gray-800 mb-2">{card.value}</p>
          <div className="flex gap-20 text-sm text-gray-600 mt-2">
            <p>
              {card.statuslead1} <span className="font-semibold">{card.statuscount1}</span>
            </p>
            <p>
              {card.statuslead2} <span className="font-semibold">{card.statuscount2}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default DashboardCards;
