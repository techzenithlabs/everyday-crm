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
