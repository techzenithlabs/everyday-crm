import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const buttonControls = useAnimation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login data:", form);
  };

  // Full animation including fade + shake after delay
  useEffect(() => {
    buttonControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 1.3 },
    }).then(() => {
      buttonControls.start({
        x: [0, -5, 5, -3, 3, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      });
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Everyday CRM</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          />

          <motion.input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          />

          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            initial={{ opacity: 0, y: 20 }}
            animate={buttonControls}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </motion.button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-700 font-medium hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
