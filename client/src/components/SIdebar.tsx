import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { routesConfig } from "../routes/routesConfig";

const Sidebar = () => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const roleId = user?.role_id ?? 0;

  const allowedRoutes = routesConfig.filter((route) =>
    route.roleAccess.includes(roleId)
  );

  return (
    <div className="bg-[#1d2939] text-white w-64 flex flex-col p-4 min-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-teal-500">Everyday Patio</h2>
      <nav className="flex flex-col space-y-1">
        {allowedRoutes.map(({ path, name, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 w-full rounded text-left transition duration-200 ${
                isActive || location.pathname === path
                  ? "bg-teal-500 text-white font-semibold"
                  : "hover:bg-[#1de9b6]/20 text-white"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
