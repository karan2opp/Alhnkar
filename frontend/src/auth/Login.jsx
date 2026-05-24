import { useState } from "react";
import AuthLayout from "./AuthLayout";
import api from "../utils/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { showToast } from "../utils/showToast";
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

     
console.log(res);

    // ✅ Fix
const { user, accessToken } = res.data.data;
setUser(user, accessToken);
showToast.success(`Signed in as ${user.email}`);
      
      // Small delay so user sees toast before redirect
      setTimeout(() => navigate("/"), 1200);
    
      navigate("/");

    } catch (error) {
        const errorMsg = error.response?.data?.message || "Invalid email or password";
      showToast.error(errorMsg);
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
      <p className="text-sm text-text/60 mt-6 text-center cursor-pointer" onClick={()=>{navigate("/signup")}}>
        Don’t have an account?{" "}
        <span className="text-primary " >
          Create one
        </span>
      </p>
    </AuthLayout>
  );
}