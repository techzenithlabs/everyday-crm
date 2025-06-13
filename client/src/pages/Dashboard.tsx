import { useState } from "react";
import Sidebar from "../components/SIdebar";
import DashboardCards from "../components/DashboardCards";
import KanbanBoard from "../components/KanbanBoard";
import { logout } from "../redux/slices/authSlice";
import { logoutUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

 const handleLogout = async () => {
  try {
    if (token) {
      await logoutUser(token); // Send token in header
    }
    dispatch(logout());
    navigate("/login", { replace: true });
    toast.success("Logged out successfully!");
  } catch (err) {
    toast.error("Logout failed!");
  }
};
    

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        {/* Header: Dashboard + Admin Dropdown */}
        <div className="flex justify-between items-center mb-4 relative">
          <h1 className="text-3xl font-bold text-gray-800">Home</h1>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="text-gray-700 font-medium flex items-center gap-2 hover:text-black focus:outline-none"
            >
              👤 Admin
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2 z-50 animate-fade-in"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Welcome to your Everyday CRM Dashboard!
        </p>

        <DashboardCards />
        <KanbanBoard />
      </div>
    </div>
  );
};
export default Dashboard;