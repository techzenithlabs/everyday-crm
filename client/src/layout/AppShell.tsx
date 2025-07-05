import type { ReactNode } from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar"; 
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { logoutUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface AppShellProps {
  children: ReactNode;
  title?: string;
}

export default function AppShell({
  children,
  title = "Dashboard",
}: AppShellProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user); // optional
  const userame = user?.first_name + " " + user?.last_name || "User";

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
      dispatch(logout());
      navigate("/login", { replace: true });
      toast.success("Logged out successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.message || "Logout failed!");
      console.log("check")
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 min-h-screen p-8">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight border-b pb-2 mb-4">
            {title}
          </h1>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="text-gray-700 font-medium flex items-center gap-2 hover:text-black focus:outline-none"
            >
              👤 {userame || "User"}
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
                className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2 z-50"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actual page content */}
        {children}
      </div>
    </div>
  );
}
