import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Courses from "./pages/Courses.jsx";
import LessonPage from "./pages/LessonPage.jsx";
import Landing from "./pages/Landing.jsx";
import Navbar from "./components/Navbar.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminEditLesson from "./pages/AdminEditLesson";


console.log("App.jsx loaded");

function App() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.08),transparent_28%),radial-gradient(circle_at_60%_80%,rgba(52,211,153,0.08),transparent_35%)]" />
      <div className="pointer-events-none absolute -top-24 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="relative">
        <BrowserRouter>
          <Navbar />
          <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/lesson/:id" element={<LessonPage />} />
              {/* 🔐 ADMIN ONLY */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
