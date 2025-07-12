import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import type { RootState } from "../redux/store";
import { getProfile, updateProfile } from "../services/auth";
import { logout, updateUser } from "../redux/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    current_password: "",
    password: "",
    password_confirmation: "",
    city: "",
    state: "",
    postal_code: "",
  });

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then((res) => {
          const { first_name, last_name, email, info } = res;
          const {
            phone = "",
            address = "",
            city = "",
            state = "",
            postal_code = "",
          } = info || {};

          setForm((prev) => ({
            ...prev,
            first_name,
            last_name,
            email,
            phone,
            address,
            city,
            state,
            postal_code,
          }));
        })
        .catch((err) => toast.error(err.message));
    }
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    // ✅ Client-side password logic
    if (form.password) {
      if (!form.current_password) {
        toast.error("Current password is required to change your password");
        return;
      }

      if (form.password !== form.password_confirmation) {
        toast.error("New password and confirm password do not match");
        return;
      }
    }

    try {
      const response = await updateProfile(token!, form);

      if (response.status === false) {
        toast.error(response.message || "Failed to update profile");
        return;
      }

      // ✅ Update redux state with all fields
      dispatch(
        updateUser({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          postal_code: form.postal_code,
        })
      );

      // Clear password fields
      setForm((prev) => ({
        ...prev,
        current_password: "",
        password: "",
        password_confirmation: "",
      }));

      if (form.password) {
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
          .forEach((msg) => toast.error(String(msg)));
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
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            onChange={handleChange}
            placeholder="Email"
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />
          <input
            type="password"
            name="current_password"
            value={form.current_password}
            onChange={handleChange}
            placeholder="Current Password"
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password"
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />

          {form.password && (
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="border border-gray-300 px-4 py-2 rounded-lg"
            />
          )}
        </div>

        <hr className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="border border-gray-300 px-4 py-2 rounded-lg h-[44px] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />
          <input
            type="number"
            name="postal_code"
            value={form.postal_code}
            onChange={handleChange}
            placeholder="Postal Code"
            className="border border-gray-300 px-4 py-2 rounded-lg"
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
