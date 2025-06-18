import {
  Home,
  CalendarDays,
  Users2,
  Zap,
  CheckSquare,
  FileText,
  Wallet,
} from "lucide-react"; 
import { NavLink,useLocation } from "react-router-dom";

const Sidebar = () => {
  {/*const [active, setActive] = useState("Dashboard");*/}
   const location = useLocation();
  const menuItems = [
    { name: "Home", icon: <Home className="h-5 w-5" />, path: "/dashboard" },
     {name: "Users", icon: <Users2 className="h-5 w-5" />, path: "/admin/users" },
    { name: "Calendar", icon: <CalendarDays className="h-5 w-5" />, path: "/calendar" },
    { name: "Clients", icon: <Users2 className="h-5 w-5" />, path: "/clients" },
    { name: "Leads", icon: <Zap className="h-5 w-5" />, path: "/leads" },
    { name: "Projects", icon: <CheckSquare className="h-5 w-5" />, path: "/projects" },
    { name: "Invoices", icon: <FileText className="h-5 w-5" />, path: "/invoices" },
    { name: "Payroll", icon: <Wallet className="h-5 w-5" />, path: "/payroll" },
  ];

   return (
    <div className="bg-[#1d2939] text-white w-64 flex flex-col p-4 min-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-teal-500">Everyday Patio</h2>
      <nav className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 w-full rounded text-left transition duration-200 ${
                isActive || location.pathname === item.path
                  ? "bg-teal-500 text-white font-semibold"
                  : "hover:bg-[#1de9b6]/20 text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
