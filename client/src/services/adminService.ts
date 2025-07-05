import api from "../api";

export const getRoles = async () => {
  const res = await api.get("/admin/roles");
  return res.data?.roles; // Or res.data.roles if wrapped
};

export const sendUserInvite = async (data: {
  first_name: string;
  last_name?: string;
  email: string;
  role_id: string | number;
}) => {
  const res = await api.post("/admin/invite-user", data);
  return res.data;
};

//Get list of invited users
export const getInvitedUsers = async ({
  page = 1,
  perPage = 10,
  search = "",
  sortBy = "created_at",
  sortOrder = "desc",
} = {}) => {
  try {
    const res = await api.get("/admin/users", {
      params: {
        page,
        per_page: perPage,
        search,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    });

    if (!res.data.status) {
      throw new Error(res.data.message || "Failed to fetch users");
    }

    return res.data.data;
  } catch (error) {
    console.error("Error fetching invited users:", error);
    throw error;
  }
};

//Get list of all menus for Superadmin
export const getUserMenus = async () => {
  const res = await api.get("/menus");
  return res.data?.menus || [];
};

export const getModules= async () => {
  const res = await api.get("/admin/modules");
  return res.data.modules; // make sure `modules` key exists in backend
};


export const getAllPermissions = async () => {
  const res = await api.get("/admin/permissions/grouped");
  if (!res.data.status) {
    throw new Error(res.data.message || "Failed to fetch permissions");
  }
  return res.data.data; // This should be an array of grouped permissions
};

// ✅ Get Sidebar Menus (ordered list)
export const getSidebarMenus = async () => {
  try {
    const res = await api.get("/admin/sidebar-menus");
    if (!res.data.status) throw new Error("Failed to fetch sidebar menus");
    return res.data.menus;
  } catch (error) {
    console.error("Error fetching sidebar menus:", error);
    throw error;
  }
};

// ✅ Update Sort Order
export const updateMenuOrder = async (menuIds: number[]) => {
  try {
    const res = await api.post("/admin/update-menu-order", {
      menu_order: menuIds,
    });

    if (!res.data.status) throw new Error("Failed to update menu order");
    return res.data;
  } catch (error) {
    console.error("Error updating menu order:", error);
    throw error;
  }
};



