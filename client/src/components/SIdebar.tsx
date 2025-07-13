import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import api from "../api";
import type { MenuItem } from "@/types/menu";

import {
  Home,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

// ✅ Typed icon map using LucideIcon
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  settings: Settings,
  "file-text": FileText,
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const roleId = user?.role_id ?? 0;

  const [rehydrated, setRehydrated] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [openMenus, setOpenMenus] = useState<number[]>([]);

  // ✅ Wait for redux-persist hydration
  useEffect(() => {
    const interval = setInterval(() => {
      const persistRoot = localStorage.getItem("persist:root");
      if (persistRoot) {
        const parsed = JSON.parse(persistRoot);
        const auth = parsed.auth ? JSON.parse(parsed.auth) : null;
        if (auth?.token && auth?.user) {
          setRehydrated(true);
          clearInterval(interval);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch menus after hydration
  useEffect(() => {
    if (!rehydrated || !localStorage.getItem("token")) return;

    const fetchMenus = async () => {
      try {
        const res = await api.get("/admin/sidebar-menus");
        if (res.data.status) {
          const flatMenus: MenuItem[] = res.data.menus;

          // 👇 Group into parent -> children structure
          const grouped: Record<number, MenuItem> = {};
          flatMenus.forEach((menu) => {
            if (!menu.parent_id) {
              grouped[menu.id] = { ...menu, children: [] };
            }
          });
          flatMenus.forEach((menu) => {
            if (menu.parent_id && grouped[menu.parent_id]) {
              grouped[menu.parent_id].children.push(menu);
            }
          });

          // Convert to array & sort
          const sorted: MenuItem[] = Object.values(grouped).sort(
            (a, b) => a.sort_order - b.sort_order
          );

          setMenus(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch sidebar menus", error);
      }
    };

    fetchMenus();
  }, [rehydrated, user]);

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-[#1d2939] text-white w-64 flex flex-col p-4 min-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-teal-500">Everyday Patio</h2>

      <nav className="flex flex-col space-y-1">
        {menus.map((menu: MenuItem) => {
          const { id, path, name, icon, children, roleAccess = [] } = menu;
          const Icon = iconMap[icon?.toLowerCase()] ?? FileText;
          const hasAccess = roleId === 1 || roleAccess.includes(roleId);
          if (!hasAccess) return null;

          const isOpen = openMenus.includes(id);

          if (!children.length) {
            return (
              <NavLink
                key={id}
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
            );
          }

          return (
            <div key={id} className="w-full">
              <button
                onClick={() => {
                  toggleMenu(id);
                  if (path) navigate(path);
                }}
                className={`flex items-center justify-between gap-3 px-4 py-3 w-full rounded text-left transition duration-200 ${
                  location.pathname === path
                    ? "bg-teal-500 text-white font-semibold"
                    : "hover:bg-[#1de9b6]/20 text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{name}</span>
                </div>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {isOpen && (
                <div className="ml-6 mt-1 flex flex-col space-y-1">
                  {children.map((child: MenuItem) => {
                    const childHasAccess =
                      roleId === 1 || child.roleAccess?.includes(roleId);
                    if (!childHasAccess) return null;

                    const ChildIcon =
                      iconMap[child.icon?.toLowerCase()] ?? FileText;

                    return (
                      <NavLink
                        key={child.id}
                        to={
                          child.path.includes(":id")
                            ? child.path.replace(
                                ":id",
                                localStorage.getItem("currentProjectId") || "0"
                              )
                            : child.path
                        }
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 w-full rounded text-left transition duration-200 ${
                            isActive || location.pathname === child.path
                              ? "bg-teal-500 text-white font-semibold"
                              : "hover:bg-[#1de9b6]/20 text-white"
                          }`
                        }
                      >
                        <ChildIcon className="h-4 w-4" />
                        <span>{child.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
