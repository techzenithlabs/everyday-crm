import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { getProfile } from "../../services/auth";
import { toast } from "react-toastify";
import { startLoading, stopLoading } from "../../redux/slices/loadingSlice";

const SocialSuccess = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSocialLogin = async () => {
      if (!token) {
        toast.error("No token received.");
        return navigate("/login");
      }
      dispatch(startLoading()); // 🌀 Show loader

      try {
        const user = await getProfile(token); // calls Laravel backend
        dispatch(login({ token, user }));
        toast.success("Logged in via social account!");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Failed to fetch user profile.");
        navigate("/login");
      }
      finally {
      dispatch(stopLoading()); // ✅ Hide loader
      }
    };

    handleSocialLogin();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-semibold text-gray-700">
        Logging you in via social login...
      </p>
    </div>
  );
};

export default SocialSuccess;
