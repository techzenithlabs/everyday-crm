import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInvitedUsers } from "../../services/adminService";
import { formatHumanDate } from "../../utils/dateHelpers";
import ReactPaginate from "react-paginate";
import EditUserModal from "../../components/modals/EditUserModal";
import ManageAccessModal from "../../components/modals/ManageAccessModal";
import { getAllPermissions } from "../../services/adminService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getInvitedUsers({
        page,
        perPage,
        search,
        sortBy,
        sortOrder,
      });
      setUsers(data.data);
      setTotalPages(data.last_page);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const permissions = await getAllPermissions(); // ✅ This returns grouped modules with children
      setAllPermissions(permissions); // Set into state
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, [page, perPage, search, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (key: string) => {
    if (sortBy !== key) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  const getRegistrationStatus = (user: any) => {
    if (user.used) {
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
          Registered
        </span>
      );
    } else if (new Date(user.expires_at) < new Date()) {
      return (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
          Expired
        </span>
      );
    } else {
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
          Pending
        </span>
      );
    }
  };

  const getActiveStatus = (user: any) => {
    return user.status === "inactive" ? (
      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
        Inactive
      </span>
    ) : (
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
        Active
      </span>
    );
  };

  const flattenPermissions = (grouped: Record<string | number, number[]>) => {
    const flat: number[] = [];
    Object.entries(grouped).forEach(([parentId, children]) => {
      flat.push(Number(parentId));
      if (Array.isArray(children)) {
        flat.push(...children);
      }
    });
    return [...new Set(flat)];
  };

  return (
    <div className="px-6 py-8">
      <h2 className="text-2xl font-bold mb-4">Team Management</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search team members..."
          className="border rounded px-4 py-2 w-full md:w-80 shadow-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Link
          to="/admin/users/invite"
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Add New Member
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow overflow-auto">
        <table className="min-w-[1000px] w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "Last Name", key: "last_name" },
                { label: "First Name", key: "first_name" },
                { label: "Role", key: "role.name" },
                { label: "Email", key: "email" },
                { label: "Address", key: "address" },
                { label: "Registration", key: "registration" },
                { label: "Permissions", key: "permissions_count" },
                { label: "Status", key: "status" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 font-medium text-gray-700 cursor-pointer select-none"
                >
                  {label}
                  {getSortIcon(key)}
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{user.last_name}</td>
                  <td className="px-4 py-3">{user.first_name}</td>
                  <td className="px-4 py-3">{user.role?.name || "—"}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.address || "N/A"}</td>
                  <td className="px-4 py-3">{getRegistrationStatus(user)}</td>
                  <td className="px-4 py-3 font-semibold">
                    {user.permission_count || 0}
                  </td>
                  <td className="px-4 py-3">{getActiveStatus(user)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setEditModalOpen(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setAccessModalOpen(true);
                        }}
                        className="text-indigo-600 hover:underline"
                      >
                        Manage Access
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <div>
          <label className="mr-2 text-sm">Rows per page:</label>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border px-2 py-1 rounded text-sm"
          >
            {[10, 20, 30, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <ReactPaginate
          previousLabel="←"
          nextLabel="→"
          breakLabel="..."
          pageCount={totalPages}
          forcePage={page - 1}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={({ selected }) => setPage(selected + 1)}
          containerClassName="flex items-center gap-1"
          pageClassName="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
          previousClassName="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
          nextClassName="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
          breakClassName="px-3 py-1 text-gray-500"
          activeClassName="bg-blue-600 text-white"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>

      {editModalOpen && selectedUser && (
        <EditUserModal
          isOpen={true}
          user={selectedUser}
          onClose={() => setEditModalOpen(false)}
          onSave={() => {
            setEditModalOpen(false);
            fetchUsers();
          }}
        />
      )}

      {accessModalOpen && selectedUser && (
        <ManageAccessModal
          isOpen={true}
          user={selectedUser}
          permissions={allPermissions}
          userPermissions={flattenPermissions(
            typeof selectedUser?.permissions === "string"
              ? JSON.parse(selectedUser.permissions || "{}")
              : selectedUser?.permissions || {}
          )}
          onClose={() => setAccessModalOpen(false)}
          onSave={(updatedPerms) => {
            setAccessModalOpen(false);
            fetchUsers(); // Refresh updated permission count
          }}
        />
      )}
    </div>
  );
};

export default UserList;
