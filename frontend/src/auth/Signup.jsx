import { useState } from "react";
import AuthLayout from "./AuthLayout";
import api from "../utils/axios.js";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
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

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/register", formData);

      console.log("Signup success:", res.data);

      // later → navigate("/login")
    } catch (error) {
      console.log(
        error.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <p className="text-xs tracking-widest text-primary/70 mb-2">
        STEP INTO EXCELLENCE
      </p>

      <h1 className="text-2xl md:text-3xl font-serif mb-6">
        Join the Atelier
      </h1>

      <p className="text-sm text-text/60 mb-8">
        Create your digital profile to experience exclusive collections.
      </p>

      <form onSubmit={handleSignup} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="input"
          value={formData.name}
          onChange={handleChange}
        />

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
          placeholder="Create Password"
          className="input"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-bg py-3 text-sm tracking-wide hover:opacity-90 transition"
        >
          {loading ? "Creating Account..." : "CREATE ACCOUNT →"}
        </button>
      </form>

      <p className="text-sm text-text/60 mt-6 text-center">
        Already a member?{" "}
        <span className="text-primary cursor-pointer">
          Sign In
        </span>
      </p>
    </AuthLayout>
  );
}