import { useState } from "react";
import AuthLayout from "./AuthLayout";
import api from "../utils/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
// later
// import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setUser } = useAuthStore();
   const navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", formData);

      /*
        Expected backend response example:

        {
          user: {
            name: "Karan",
            email: "karan@gmail.com",
            role: "admin"
          }
        }
      */

      setUser(res.data.user);

      console.log("Login Success:", res.data);

      // later:
      navigate("/");

    } catch (error) {
      console.log(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Heading */}
      <p className="text-xs tracking-widest text-primary/70 mb-2">
        WELCOME BACK
      </p>

      <h1 className="text-2xl md:text-3xl font-serif mb-6">
        Sign In
      </h1>

      <p className="text-sm text-text/60 mb-8">
        Access your curated collection and orders.
      </p>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="input"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-bg py-3 text-sm tracking-wide hover:opacity-90 transition"
        >
          {loading ? "Signing In..." : "SIGN IN →"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-sm text-text/60 mt-6 text-center">
        Don’t have an account?{" "}
        <span className="text-primary cursor-pointer">
          Create one
        </span>
      </p>
    </AuthLayout>
  );
}