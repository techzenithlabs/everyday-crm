import { useState, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import logo from "../../assets/every-day-crm-png.png";
import { forgotPassword } from "../../services/auth"; // You'll create this

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(true);
      toast.error("Please enter your email.");
      emailRef.current?.focus();
      return;
    }

    try {
      const res = await forgotPassword(email);
      toast.success(res.message || "Reset link sent to your email.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="h-10 mx-auto mb-2" />
          <h2 className="text-xl font-semibold text-gray-800">Can't log in?</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-700">We’ll send a recovery link to:</p>
          <motion.input
            ref={emailRef}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(false);
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
              error
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />

          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Recovery Link
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
