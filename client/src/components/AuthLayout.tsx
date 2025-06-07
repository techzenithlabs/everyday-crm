import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Everyday CRM</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
