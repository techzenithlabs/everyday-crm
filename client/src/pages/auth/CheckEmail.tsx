import { Link } from "react-router-dom";
import Logo from "../../assets/every-day-crm-png.png";

const CheckEmail = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center">
        <img
          src={Logo} // optional icon
          alt="Check Email"
          className="w-16 h-16 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h2>
        <p className="text-gray-600 mb-4">
          We've sent a confirmation link to your email. Click the link to verify your account and get started.
        </p>
        <div className="text-sm text-gray-500">
          Didn’t receive the email?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Try logging in
          </Link>{" "}
          or check your spam folder.
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
