  import { useState, useEffect } from "react";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import { motion } from "framer-motion";
  import toast from "react-hot-toast";
  import axios from "axios";
  import logo from "../../assets/every-day-crm-png.png";

  const Register = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_id: null,
    });

    useEffect(() => {
      if (!token) {
        toast.error("Token missing in URL");
        navigate("/login");
        return;
      }

      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/register/token-verify/${token}`)
        .then((res) => {
          if (res.data.valid) {
            const data = res.data.data;
            setForm((prev) => ({
              ...prev,
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              role_id: data.role_id,
            }));
          } else {
            toast.error("Invalid or expired token");
            navigate("/login");
          }
        })
        .catch(() => {
          toast.error("Invalid or expired token");
          navigate("/login");
        })
        .finally(() => setLoading(false));
    }, [token, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.password || form.password !== form.password_confirmation) {
        toast.error("Passwords do not match");
        return;
      }

      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, {
          token,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
        });

        toast.success("Registered successfully!");
        navigate("/check-email");
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || "Registration failed";
        toast.error(errorMsg);
      }
    };

    if (loading) {
      return <p className="text-center mt-10">Loading registration form...</p>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <img src={logo} alt="Everyday CRM" className="h-10 mx-auto mb-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Complete Your Registration
            </h2>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-md"
            />

            {/* Hidden role_id */}
            <input type="hidden" name="role_id" value={form.role_id ?? ""} />

            <motion.button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Register
            </motion.button>
          </form>

          <div className="text-sm mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </div>
        </div>
      </div>
    );
  };

  export default Register;
