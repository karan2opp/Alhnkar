import { useState } from "react";
import { forgotPasswordService } from "./auth.service";
import { showToast } from "../utils/showToast";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPasswordService(email);
      setSent(true);
      showToast.success("Reset link sent to your email");
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center p-8">
     

        <p className="text-xl font-serif mb-2">Check your inbox</p>
        <p className="text-sm text-text/60">
          We sent a password reset link to <strong>{email}</strong>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
    <div className="max-w-md mx-auto p-8">
       
      <h1 className="text-2xl font-serif mb-2">Forgot Password</h1>
      <p className="text-sm text-text/60 mb-6">
        Enter your email and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-bg py-3 text-sm tracking-wide hover:opacity-90 transition"
        >
          {loading ? "Sending..." : "SEND RESET LINK →"}
        </button>
      </form>
    </div>
    </div>

  );
}