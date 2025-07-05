import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import api from "../api";

// Icon imports
import {
  Home,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// Map backend icon names to actual components
const iconMap: Record<string, any> = {
  home: Home,
  users: Users,
  settings: Settings,
  "file-text": FileText,
};

const Sidebar = () => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const roleId = user?.role_id ?? 0;

  const [menus, setMenus] = useState<any[]>([]);
  const [openMenus, setOpenMenus] = useState<number[]>([]);

  // Toggle parent menus
  const toggleMenu = (id: number) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await api.get("/admin/sidebar-menus");
        if (res.data.status) {
          const flatMenus = res.data.menus;

          // Group into parent > children structure
          const grouped: any = {};
          flatMenus.forEach((menu: any) => {
            if (!menu.parent_id) {
              grouped[menu.id] = { ...menu, children: [] };
            }
          });
          flatMenus.forEach((menu: any) => {
            if (menu.parent_id && grouped[menu.parent_id]) {
              grouped[menu.parent_id].children.push(menu);
            }
          });

          // Convert to array and sort
          const sorted = Object.values(grouped).sort(
            (a: any, b: any) => a.sort_order - b.sort_order
          );
          setMenus(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch sidebar menus", error);
      }
    };

    fetchMenus();
  }, []);

  return (
    <div className="bg-[#1d2939] text-white w-64 flex flex-col p-4 min-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-teal-500">Everyday Patio</h2>

      <nav className="flex flex-col space-y-1">
        {menus.map((menu) => {
          const { id, path, name, icon, children, roleAccess = [] } = menu;
          const Icon = iconMap[icon?.toLowerCase()] ?? FileText;
          const hasAccess = roleId === 1 || roleAccess.includes(roleId);
          if (!hasAccess) return null;

          const isOpen = openMenus.includes(id);

          // 🔹 Render standalone menu
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

          // 🔹 Render parent with children
          return (
            <div key={id} className="w-full">
              <button
                onClick={() => toggleMenu(id)}
                className="flex items-center justify-between gap-3 px-4 py-3 w-full rounded text-left hover:bg-[#1de9b6]/20 transition duration-200"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{name}</span>
                </div>
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {isOpen && (
                <div className="ml-6 mt-1 flex flex-col space-y-1">
                  {children.map((child: any) => {
                    const childHasAccess =
                      roleId === 1 || child.roleAccess?.includes(roleId);
                    if (!childHasAccess) return null;

                    const ChildIcon =
                      iconMap[child.icon?.toLowerCase()] ?? FileText;

                    return (
                      <NavLink
                        key={child.id}
                        to={child.path}
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
