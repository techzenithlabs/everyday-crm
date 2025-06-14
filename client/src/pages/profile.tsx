import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { getProfile, updateProfile } from "../services/auth";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice"; // existing
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    current_password: "",
    password: "",
    password_confirmation: "", // must match
  });

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then((res) => {
          console.log("Profile API Response:", res); // ✅ See exactly what you're getting
          const { first_name, last_name, email } = res;
          setForm((prev) => ({ ...prev, first_name, last_name, email }));
        })
        .catch((err) => toast.error(err.message));
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await updateProfile(token!, form);

      // Check response
      if (response.status === false) {
        toast.error(response.message || "Failed to update profile");
        return;
      }

      // Clear password fields
      setForm((prev) => ({
        ...prev,
        current_password: "",
        password: "",
        password_confirmation: "",
      }));

      // If password updated, force logout
      if (form.current_password) {
        toast.success("Password updated. Please login again.");
        dispatch(logout());
        navigate("/login");
      } else {
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string; errors?: any }>;

      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors)
          .flat()
          .forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(err.response?.data?.message || "Something went wrong.");
      }
    }
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          👤 Your Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <hr className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="password"
            name="current_password"
            value={form.current_password}
            onChange={handleChange}
            placeholder="Current Password"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
