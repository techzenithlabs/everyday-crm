import AuthLayout from "../../components/AuthLayout";
import { Link } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register data:", form);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md">
          Register
        </button>
        <p className="text-center text-sm">
          Already have an account? <Link to="/login" className="text-green-600">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
