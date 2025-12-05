import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import futuristicBanner from "../assets/e-learning-online-education-futuristic-banner-vector.jpeg";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://127.0.0.1:8000/users/signup", {
        email,
        password,
      });

      setMessage("Account created successfully! Redirecting to login...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Signup failed. Please try again.");
      setMessageType("error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-5xl bg-white shadow-lg rounded-3xl grid md:grid-cols-2 overflow-hidden">


        {/* LEFT — SIGNUP FORM */}
        <div className="px-10 py-12 flex flex-col justify-center">

          {/* Branding */}
          <h2 className="font-semibold text-sm text-blue-600 mb-2">InsightHub</h2>

          <h1 className="text-2xl font-bold text-gray-900">
            Create your account
          </h1>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Join us and start learning with personalized AI courses.
          </p>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  placeholder=" Create a strong password"
                  className="mt-1 w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Use at least 8 characters with letters + numbers
              </p>
            </div>

            {/* Message box */}
            {message && (
              <div
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  messageType === "success"
                    ? "bg-green-100 border border-green-300"
                    : "bg-red-100 border border-red-300"
                }`}
              >
                {messageType === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span
                  className={`text-sm ${
                    messageType === "success" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {message}
                </span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <UserPlus className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Already have an account? */}
          <p className="text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* RIGHT — IMAGE */}
        <div className="hidden md:block">
          <img
            src={futuristicBanner}
            alt="Signup graphic"
            className="w-full h-full object-cover object-[100%_center]"
          />
        </div>
      </div>
    </div>
  );
}
