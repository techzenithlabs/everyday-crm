import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import logo from "../../assets/every-day-crm-png.png";
import { toast } from "react-toastify";
import { loginUser } from "../../services/auth";
import { login } from "../../redux/slices/authSlice";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { startLoading, stopLoading } from "../../redux/slices/loadingSlice";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean }>({});
  const buttonControls = useAnimation();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

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

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      if (newErrors.email && emailRef.current) emailRef.current.focus();
      else if (newErrors.password && passwordRef.current) passwordRef.current.focus();
      return;
    }

    dispatch(startLoading());
    try {
      const data = await loginUser(form.email, form.password);
      dispatch(login({ token: data.token, user: data.user }));
      toast.success("Login successfully!");
      navigate("/dashboard");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
     if (err.response && typeof err.response.data?.message === "string") {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleSocialLogin = (provider: "google" | "slack" | "microsoft" | "apple") => {
    const backendBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    window.location.href = `${backendBaseURL}/auth/${provider}`;
  };

  useEffect(() => {
    buttonControls
      .start({ opacity: 1, y: 0, transition: { duration: 0.4, delay: 1.3 } })
      .then(() => {
        buttonControls.start({
          x: [0, -5, 5, -3, 3, 0],
          transition: { duration: 0.6, ease: "easeInOut" },
        });
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Logo & Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <img src={logo} alt="Everyday CRM Logo" className="h-10 mx-auto mb-2" />
          <h2 className="text-xl font-semibold text-gray-800">Log in to continue</h2>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            ref={emailRef}
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (errors.email) setErrors((prev) => ({ ...prev, email: false }));
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
              errors.email ? "border-red-500 focus:ring-red-300" : "border-gray-300"
            }`}
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />

          <motion.input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              if (errors.password) setErrors((prev) => ({ ...prev, password: false }));
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
              errors.password ? "border-red-500 focus:ring-red-300" : "border-gray-300"
            }`}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          />

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="remember" className="cursor-pointer" />
            <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            initial={{ opacity: 0, y: 30 }}
            animate={buttonControls}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with:</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <button onClick={() => handleSocialLogin("google")} className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-50">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
            Google
          </button>
          {/* <button onClick={() => handleSocialLogin("microsoft")} className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-50">
            <img src="https://img.icons8.com/color/16/000000/microsoft.png" alt="Microsoft" />
            Microsoft
          </button> */}
          <button  className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-50">
            <img src="https://img.icons8.com/ios-filled/16/000000/mac-os.png" alt="Apple" />
            Apple
          </button>
          {/* <button onClick={() => handleSocialLogin("slack")} className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-50">
            <img src="https://img.icons8.com/color/16/000000/slack-new.png" alt="Slack" />
            Slack
          </button> */}
        </motion.div>

        {/* Footer Links */}
        <div className="text-sm mt-6 text-center text-gray-600">
          <Link to="/reset-password" className="text-blue-600 hover:underline mr-2">
            Can’t log in?
          </Link>{" "}
          ·
        </div>
        <div className="text-xs text-center text-gray-400 mt-6">
          <p>© 2025 Everyday CRM</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
