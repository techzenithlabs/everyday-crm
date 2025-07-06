import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ✅ Auth-related pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CheckEmail from "./pages/auth/CheckEmail";
import VerifyEmail from "./pages/auth/VerifyEmail";
import SocialSuccess from "./pages/auth/SocialSuccess";

// ✅ Admin pages
import Dashboard from "./pages/admin/Dashboard";
import InviteUser from "./pages/admin/InviteUser";
import UserList from "./pages/admin/UserList";
import MenuSettings from "./pages/admin/MenuSettings";
import ReorderMenu from "./components/admin/ReorderMenu"; // in case used somewhere

// ✅ Common user pages
import Profile from "./pages/profile";

// ✅ Project module pages
import Projects from "./pages/projects/Projects";
import ProjectDetail from "./pages/projects/ProjectDetail";

// ✅ Layout & Route Wrappers
import AppShell from "./layout/AppShell";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

// ✅ Global providers and toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Redux hook
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";

function App() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <BrowserRouter>
      {/* ✅ Global Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* ✅ Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ✅ Public Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/check-email"
          element={
            <PublicRoute>
              <CheckEmail />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyEmail />
            </PublicRoute>
          }
        />
        <Route path="/social-success" element={<SocialSuccess />} />

        {/* ✅ Protected Common Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppShell title="Dashboard">
                <Dashboard />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AppShell title="Profile Management">
                <Profile />
              </AppShell>
            </PrivateRoute>
          }
        />

        {/* ✅ Admin Routes */}
        <Route
          path="/admin/users/invite"
          element={
            <PrivateRoute>
              <AppShell title="Invite User">
                <InviteUser />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/teams"
          element={
            <PrivateRoute>
              <AppShell title="User Management">
                <UserList />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/menu-settings"
          element={
            <PrivateRoute>
              <AppShell title="Menu Settings">
                <MenuSettings />
              </AppShell>
            </PrivateRoute>
          }
        />

        {/* ✅ Role-specific Admin Route (Super Admin Only) */}
        {user?.role_id === 1 && (
          <Route
            path="/admin/menu-settings"
            element={
              <PrivateRoute>
                <AppShell title="Menu Settings">
                  <MenuSettings />
                </AppShell>
              </PrivateRoute>
            }
          />
        )}

        {/* ✅ Project Module Routes */}
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <AppShell title="Projects">
                <Projects />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <PrivateRoute>
              <AppShell title="Project Details">
                <ProjectDetail />
              </AppShell>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
