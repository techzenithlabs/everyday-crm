import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import bgImage from "../../assets/bg-login.jpg";
import toast from "react-hot-toast";
import { loginUser } from "../../services/auth";
import { login } from "../../redux/slices/authSlice";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";



const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean }>(
    {}
  );
  const buttonControls = useAnimation();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  // Redirect to dashboard if already logged in 
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: boolean; password?: boolean } = {};
    if (!form.email) newErrors.email = true;
    if (!form.password) newErrors.password = true;
    setErrors(newErrors);

    const missingFields = Object.keys(newErrors);
    if (missingFields.length > 0) {
      if (missingFields.length === 2) {
        toast.error("Please fill in both email and password.");
      } else {
        const fieldName =
          missingFields[0].charAt(0).toUpperCase() + missingFields[0].slice(1);
        toast.error(`Please fill in the ${fieldName}.`);
      }
      if (newErrors.email && emailRef.current) emailRef.current.focus();
      else if (newErrors.password && passwordRef.current)
        passwordRef.current.focus();
      return;
    }

    try {
      const data = await loginUser(form.email, form.password);
      dispatch(login({ token: data.token, user: data.user }));
      toast.success("Login successfully!");
      navigate("/dashboard");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const geterror = err.response?.data;
      toast.error(geterror?.message || "Login failed. Please try again.");
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
          Everyday CRM
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
              errors.email
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300"
            }`}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
              errors.password
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300"
            }`}
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
          <Link
            to="/register"
            className="text-blue-700 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
