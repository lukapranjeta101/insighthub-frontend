// frontend/src/pages/Login.jsx

import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
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

      // ⭐ SECURITY: Store ONLY the JWT token, never store personal data
      localStorage.setItem("token", res.data.token);

      navigate("/courses");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Login failed.");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        // Send to backend for authentication
        const res = await axios.post("http://127.0.0.1:8000/users/google-login", {
          email: userInfo.data.email,
          name: userInfo.data.name,
          google_id: userInfo.data.sub,
        });

        localStorage.setItem("token", res.data.token);
        navigate("/courses");
      } catch (err) {
        setMessage(err.response?.data?.detail || "Google login failed.");
      }
    },
    onError: () => setMessage("Google login failed. Please try again."),
  });

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

          {/* Google Login Button */}
          <button 
            onClick={handleGoogleLogin}
            type="button"
            className="w-full border border-gray-300 rounded-lg py-2.5 flex items-center justify-center gap-3 bg-white hover:bg-gray-100 hover:border-gray-400 hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-in-out"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-semibold text-gray-700">Sign in with Google</span>
          </button>

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
