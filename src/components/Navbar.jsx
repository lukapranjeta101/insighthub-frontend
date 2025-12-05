import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail"); // NEW

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail"); // NEW
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`)
      ? "text-white bg-white/10"
      : "text-slate-300 hover:text-white hover:bg-white/5";

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-800/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent hidden sm:block">
              InsightHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActive(
                "/"
              )}`}
            >
              Home
            </Link>

            <Link
              to="/courses"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActive(
                "/courses"
              )}`}
            >
              {token ? "Courses" : "Catalog"}
            </Link>

            {/* ⭐ ADMIN BUTTON — ONLY FOR YOU */}
            {userEmail === "lukapranjeta18@gmail.com" && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-amber-400 hover:text-white hover:bg-amber-400/10 ${isActive(
                  "/admin"
                )}`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow-md shadow-sky-800/30 hover:brightness-110 transition"
                >
                  Start free
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/courses"
                  className="px-4 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-slate-800/50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 ${isActive(
                "/"
              )}`}
            >
              Home
            </Link>

            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 ${isActive(
                "/courses"
              )}`}
            >
              {token ? "Courses" : "Catalog"}
            </Link>

            {/* ⭐ ADMIN BUTTON MOBILE */}
            {userEmail === "lukapranjeta18@gmail.com" && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-amber-400 hover:text-white hover:bg-amber-400/10 transition-all duration-200"
              >
                Admin
              </Link>
            )}

            {!token ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 ${isActive(
                    "/login"
                  )}`}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 ${isActive(
                    "/signup"
                  )}`}
                >
                  Start free
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
