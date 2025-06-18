import { useState, useEffect } from "react";
import api from "../../api";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { getRoles } from "../../services/adminService";

const InviteUser = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role_id: "",
  });
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRoles()
      .then((data) => {
        setRoles(data); // or data.roles based on your service
      })
      .catch(() => toast.error("Failed to load roles"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/invite-user`,
        form
      );
      toast.success("Invite sent successfully!");
      navigate("/admin/users");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send invite");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Invite New User</h2>
          <Link
            to="/admin/users"
            className="mt-2 sm:mt-0 text-sm text-blue-600 hover:underline text-right"
          >
            ← Back to Users
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full md:col-span-2 border px-4 py-2 rounded"
            required
          />
          <select
            value={form.role_id}
            onChange={(e) => setForm({ ...form, role_id: e.target.value })}
            className="w-full md:col-span-2 border px-4 py-2 rounded"
            required
          >
            <option value="">Select Role</option>
            {roles.map((role: any) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full"
          >
            Send Invite
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteUser;
