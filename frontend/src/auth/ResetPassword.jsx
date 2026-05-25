import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordService } from "../auth/auth.service";
import { showToast } from "../utils/showToast";
import Navbar from "../components/Navbar";

export default function ResetPassword() {
  const { token } = useParams(); // grabs token from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return showToast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      await resetPasswordService(token, formData.password);
      showToast.success("Password reset successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar/>
   
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-serif mb-2">Reset Password</h1>
      <p className="text-sm text-text/60 mb-6">Enter your new password below.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="password"
          placeholder="New Password"
          className="input"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          className="input"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-bg py-3 text-sm tracking-wide hover:opacity-90 transition"
        >
          {loading ? "Resetting..." : "RESET PASSWORD →"}
        </button>
      </form>
    </div>
     </div>
  );
}