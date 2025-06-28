import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile";
import AppShell from "./layout/AppShell";
import Dashboard from "./pages/admin/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SocialSuccess from "./pages/auth/SocialSuccess";
import ResetPassword from "./pages/auth/ResetPassword";
import InviteUser from "./pages/admin/InviteUser";
import CheckEmail from "./pages/auth/CheckEmail";
import VerifyEmail from "./pages/auth/VerifyEmail";
import UserList from "./pages/admin/UserList";
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />{" "}
      {/*Toast Messages*/}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
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
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
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

        {/* ✅ Social login success route (public) */}
        <Route path="/social-success" element={<SocialSuccess />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppShell title=" Dashboard">
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

        {/* Admin Routes */}
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
          path="/admin/users/invite"
          element={
            <PrivateRoute>
              <AppShell title="Invite User">
                <InviteUser />
              </AppShell>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
