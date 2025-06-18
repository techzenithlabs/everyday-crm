import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getInvitedUsers } from "../../services/adminService";
import { formatHumanDate } from './../../utils/dateHelpers';

const UserList = () => {
  const [users, setUsers] = useState([]);

 useEffect(() => {
  getInvitedUsers()
    .then(setUsers)
    .catch((err) => {
      console.error("Error fetching invited users:", err);
    });
}, []);

  const getStatus = (user: any) => {
    if (user.used) return "Registered";
    if (new Date(user.expires_at) < new Date()) return "Expired";
    return "Pending";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Invited Users</h2>
        <Link
          to="/admin/users/invite"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Invite User
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Sent At</th>           
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6">No invites sent yet.</td>
              </tr>
            )}
            {users.map((user: any) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.first_name} {user.last_name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role?.name || "—"}</td>
                <td className="px-4 py-2">{formatHumanDate(user.created_at)}</td>        
                <td className="px-4 py-2 font-medium">{getStatus(user)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
