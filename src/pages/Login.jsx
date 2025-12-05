// frontend/src/pages/Login.jsx

import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import futuristicBanner from "../assets/e-learning-online-education-futuristic-banner-vector.jpeg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      // ⭐ NEW — store user email for admin access
      localStorage.setItem("userEmail", res.data.email);

      navigate("/courses");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-3xl grid md:grid-cols-2 overflow-hidden">
        
        {/* LEFT — LOGIN FORM */}
        <div className="px-10 py-12 flex flex-col justify-center">
          
          {/* Logo / Brand */}
          <h2 className="font-semibold text-sm text-blue-600 mb-2">InsightHub</h2>
          <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Start your journey with us.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="example@email.com"
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow-sm transition"
            >
              Sign In
            </button>
          </form>

          {message && (
            <p className="text-sm text-red-500 mt-3">{message}</p>
          )}

          {/* OR */}
          <div className="flex items-center gap-2 my-6">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="text-xs text-gray-500">or sign in with</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c2/F_icon.svg"
                className="h-4"
              />
            </button>
            <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                className="h-4"
              />
            </button>
            <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                className="h-4"
              />
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* RIGHT — IMAGE */}
        <div className="hidden md:block">
          <img
            src={futuristicBanner}
            alt="Learning / Education graphic"
            className="w-full h-full object-cover object-[100%_center]"
          />
        </div>
      </div>
    </div>
  );
}
