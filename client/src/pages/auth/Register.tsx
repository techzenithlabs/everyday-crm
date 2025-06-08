import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import bgImage from "../../assets/bg-login.jpg";
import toast from "react-hot-toast";
import { registerUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
  }>({});
  const buttonControls = useAnimation();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: boolean; email?: boolean; password?: boolean } =
      {};
    if (!form.name) newErrors.name = true;
    if (!form.email) newErrors.email = true;
    if (!form.password) newErrors.password = true;
    setErrors(newErrors);

    const missingFields = Object.keys(newErrors);
    if (missingFields.length > 0) {
      if (missingFields.length === 3) {
        toast.error("Please fill in all fields.");
      } else {
        const fieldName =
          missingFields[0].charAt(0).toUpperCase() + missingFields[0].slice(1);
        toast.error(`Please fill in the ${fieldName}.`);
      }
      if (newErrors.name && nameRef.current) nameRef.current.focus();
      else if (newErrors.email && emailRef.current) emailRef.current.focus();
      else if (newErrors.password && passwordRef.current)
        passwordRef.current.focus();
      return;
    }

    try {
      await registerUser(form); // <- connect to service
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const geterror = err.response?.data;
      toast.error(
        geterror?.message || "Registration failed. Please try again."
      );
    }
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
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
            ref={nameRef}
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              if (errors.name && e.target.value.trim() !== "") {
                setErrors((prev) => ({ ...prev, name: false }));
              }
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
              errors.name
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300"
            }`}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          />

          <motion.input
            ref={emailRef}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (errors.email && e.target.value.trim() !== "") {
                setErrors((prev) => ({ ...prev, email: false }));
              }
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
              errors.email
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300"
            }`}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          />

          <motion.input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              if (errors.password && e.target.value.trim() !== "") {
                setErrors((prev) => ({ ...prev, password: false }));
              }
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
              errors.password
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300"
            }`}
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
