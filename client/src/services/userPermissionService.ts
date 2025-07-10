// client/src/services/userPermissionsService.ts

import api from "../api"; // Adjust the import path as necessary

export const getUserPermissions = (userId: number) => {
  return api.get(`/admin/users/${userId}/permissions`);
};

export const updateUserPermissions = (
  userId: number,
  permissions: Record<number, number[]>
) => {
  return api.post(`/admin/users/${userId}/permissions`, { permissions });
};
