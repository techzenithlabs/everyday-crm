import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Logo from "../../assets/every-day-crm-png.png";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState<"success" | "error" | "loading">("loading");

  useEffect(() => {
    if (!token) {
      setMessage("Missing verification token.");
      setStatus("error");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/verify-email/${token}`)
      .then(() => {
        setMessage("✅ Your email has been verified successfully!");
        setStatus("success");
        toast.success("Email verified");
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch(() => {
        setMessage("❌ Verification link is invalid or expired.");
        setStatus("error");
        toast.error("Verification failed");
      });
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center">
        <img src={Logo} alt="CRM Logo" className="w-16 h-16 mx-auto mb-4" />
        <h2 className={`text-xl font-semibold mb-2 ${status === "error" ? "text-red-600" : "text-green-600"}`}>
          {message}
        </h2>
        <p className="text-gray-600">
          {status === "success"
            ? "Redirecting to login..."
            : status === "error"
            ? "Please contact support or try again."
            : "Please wait while we verify your email..."}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
