import { useState } from "react";
import AuthLayout from "./AuthLayout";
import api from "../utils/axios.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ Import toast directly
// import { showToast } from "../utils/showToast"; // ❌ Don't use for custom JSX

export default function Signup() {
  const navigate = useNavigate();
  
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

      // ✅ Use toast.success directly for custom JSX
      toast.success(
        <div className="flex items-start gap-3">
          <span className="text-xl">✉️</span>
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-primary)' }}>
              Verification Email Sent
            </p>
            <p className="text-sm opacity-80 mt-0.5">
              A verification link has been sent to <span className="font-medium">{formData.email}</span>. 
              Please verify your email before signing in.
            </p>
          </div>
        </div>,
        {
          className: "border-l-4 border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-lg rounded-lg font-[var(--font-serif)] py-3 px-4 min-w-[300px] max-w-md",
          duration: 6000,
          position: "top-right",
        }
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Signup failed. Please try again.";
      
      // ✅ For simple error messages, you can still use showToast OR toast directly
      toast.error(errorMsg, {
        className: "border-l-4 border-[var(--color-accent)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-lg rounded-lg font-[var(--font-serif)] py-3 px-4",
        duration: 4000,
        position: "top-right",
      });
      
      console.error("Signup Error:", error);
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
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="input"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          className="input"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-bg py-3 text-sm tracking-wide hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "CREATE ACCOUNT →"}
        </button>
      </form>

      <p className="text-sm text-text/60 mt-6 text-center cursor-pointer" onClick={()=> navigate("/login")}>
        Already a member?{" "}
        <span className="text-primary hover:underline">
          Sign In
        </span>
      </p>
    </AuthLayout>
  );
}