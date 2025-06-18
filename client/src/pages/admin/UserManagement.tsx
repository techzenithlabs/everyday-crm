import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { sendUserInvite, getRoles } from "../../services/adminService";

const UserManagement = () => {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", role_id: "" });
 const [roles, setRoles] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.first_name || !form.email || !form.role_id) {
      return toast.error("Please fill in all required fields");
    }

    try {
      const res = await sendUserInvite(form);
      toast.success(res.message || "Invitation sent!");
      setForm({ first_name: "", last_name: "", email: "", role_id: "" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to send invite.");
    }
  };

  useEffect(() => {
  const loadRoles = async () => {
    try {
      const res = await getRoles(); // Your API call
      console.log("Roles response:", res);
      setRoles(res.roles); // ✅ Extract the 'roles' array
    } catch (err) {
      console.error("Error loading roles", err);
    }
  };
  loadRoles();
}, []);


  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Invite New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <select
          value={form.role_id}
          onChange={(e) => setForm({ ...form, role_id: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Role</option>
          {roles.map((role: any) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Send Invite
        </motion.button>
      </form>
    </div>
  );
};

export default UserManagement;
