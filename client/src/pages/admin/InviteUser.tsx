import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../api";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { getRoles } from "../../services/adminService";

const InviteUser = () => {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", role_id: "" });
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRoles()
        .then((data) => { 
        setRoles(data); // or data.roles based on your service
        })
        .catch(() => toast.error("Failed to load roles"));
    }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post(`${import.meta.env.VITE_API_BASE_URL}/admin/invite-user`, form);
      toast.success("Invite sent successfully!");
      navigate("/admin/users");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send invite");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Invite New User</h2>
        <Link
          to="/admin/users"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Users
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md space-y-4">
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
          className="w-full border px-4 py-2 rounded"
          required
        />
        <select
          value={form.role_id}
          onChange={(e) => setForm({ ...form, role_id: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Role</option>
          {roles.map((role: any) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Send Invite
        </button>
      </form>
    </div>
  );
};

export default InviteUser;
