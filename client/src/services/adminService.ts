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

export const getInvitedUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data.users; // Assuming API returns { users: [...] }
};
