import { useState } from "react";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    "Dashboard",
    "Calendar",
    "Clients",
    "Leads",
    "Projects",
    "Invoices",
  ];

  return (
    <div className="bg-[#243447] text-white h-screen w-64 flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Everyday Patio</h2>
      <nav className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <a
            key={item}
            href="#"
            onClick={() => setActive(item)}
            className={`block w-full px-4 py-2 rounded-sm transition duration-200 ${
              active === item
                ? "bg-[#1de9b6] text-white font-semibold"
                : "hover:bg-white/5 text-white"
            }`}
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
