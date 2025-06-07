import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import bgImage from "../../assets/bg-login.jpg";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const buttonControls = useAnimation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register data:", form);
  };

  useEffect(() => {
    buttonControls
      .start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: 1.3 },
      })
      .then(() => {
        buttonControls.start({
          x: [0, -5, 5, -3, 3, 0],
          transition: { duration: 0.6, ease: "easeInOut" },
        });
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register for Everyday CRM
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          />

          <motion.input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          />

          <motion.input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          />

          <motion.button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
            initial={{ opacity: 0, y: 20 }}
            animate={buttonControls}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Register
          </motion.button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-700 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
