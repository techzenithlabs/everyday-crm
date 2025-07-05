import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import logo from "../../assets/every-day-crm-png.png";
import { resetPassword } from "../../services/auth"; // API call you define

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [form, setForm] = useState({
    token,
    email,
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({ password: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.password || form.password !== form.password_confirmation) {
      setErrors({ password: true });
      toast.error("Passwords must match and cannot be empty.");
      return;
    }

    try {
      const res = await resetPassword(form); // Call Laravel endpoint
      toast.success(res.message || "Password reset successful!");
      
      // Redirect to register with email pre-filled
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.message || "Reset failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="h-10 mx-auto mb-2" />
          <h2 className="text-xl font-semibold text-gray-800">Reset your password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            type="password"
            placeholder="New Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.password ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
            }`}
          />

          <motion.input
            type="password"
            placeholder="Confirm Password"
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.password ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
            }`}
          />

          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Password
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
