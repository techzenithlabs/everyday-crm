import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";
import { getRoles,getModules} from "../../services/adminService";
import PermissionSelector from "../../components/permissions/PermissionSelector";
import type { Module } from "../../types";

const InviteUser = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role_id: "",
    // phone: "",
    // address: "",
    // city: "",
    // state: "",
    // pincode: "",
  });

  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModules, setSelectedModules] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRoles().then((data) => setRoles(data));
    getModules().then((data) => {
      if (Array.isArray(data)) setModules(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`${import.meta.env.VITE_API_BASE_URL}/admin/invite-user`, {
        ...form,
        permissions: selectedModules,
      });
      toast.success("User invited successfully");
      navigate("/admin/teams");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invite failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Invite New User</h2>
          <Link to="/admin/teams" className="text-sm text-blue-600 hover:underline">
            ← Back to Team
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["first_name", "last_name", "email"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                value={(form as any)[field]}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required={["first_name", "last_name", "email"].includes(field)}
              />
            ))}
            <select
              name="role_id"
              value={form.role_id}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Select Role</option>
              {roles.map((role: any) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <PermissionSelector
            modules={modules}
            selectedModules={selectedModules}
            onChange={setSelectedModules}
          />

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send Invite
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteUser;
