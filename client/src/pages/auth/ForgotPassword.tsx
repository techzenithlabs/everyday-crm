import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import toast from "react-hot-toast";
import logo from "../../assets/every-day-crm-png.png";
import { forgotPassword } from "../../services/auth"; // make sure this matches your file
import { AxiosError } from "axios";

const ForgotPassword = () => {
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState<{ email?: boolean }>({});
  const buttonControls = useAnimation();
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: boolean } = {};
    if (!form.email) newErrors.email = true;
    setErrors(newErrors);

    if (newErrors.email && emailRef.current) {
      emailRef.current.focus();
      toast.error("Please enter your email.");
      return;
    }

    try {
      const res = await forgotPassword(form.email);
      toast.success(res.message || "Reset password link sent to your email.");
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const geterror = error
        //toast.error(error.response?.data?.message || "Something went wrong.");
        if (geterror && !geterror.status && typeof geterror.message === 'string') {
            toast.error(geterror.message);
          }
      }
  };

  useEffect(() => {
    buttonControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 1.3 },
    });
  }, []);

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <div className="text-center mb-6">
        <img
          src={logo }
          alt="Everyday CRM Logo"
          className="h-10 mx-auto mb-2"
        />
        <h2 className="text-xl font-semibold text-gray-800">Can’t log in?</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-700">We’ll send a recovery link to</p>
        <motion.input
          ref={emailRef}
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            if (errors.email && e.target.value.trim() !== "") {
              setErrors((prev) => ({ ...prev, email: false }));
            }
          }}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
            errors.email
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />

        <motion.button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          initial={{ opacity: 0, y: 20 }}
          animate={buttonControls}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Send recovery link
        </motion.button>
      </form>

      <div className="text-sm mt-6 text-center text-gray-600">
        <Link to="/login" className="text-blue-600 hover:underline">
          Return to log in
        </Link>
      </div>

      <div className="text-xs text-center text-gray-400 mt-6 border-t pt-4">
        <p>© 2025 Everyday CRM</p>
        <div className="space-x-2">
          <Link to="#" className="hover:underline text-blue-600">Login help</Link>
          <span>·</span>
          <Link to="#" className="hover:underline text-blue-600">Contact Support</Link>
        </div>
      </div>
    </div>
  </div>
);

};

export default ForgotPassword;
