import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp, Search, X } from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/courses/")
      .then((res) => {
        const normalized = res.data.map((course) => ({
          ...course,
          lessons: course.lessons || [],
        }));
        setCourses(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading courses:", err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 animate-pulse">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="relative">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Available Courses
            </h1>
            <p className="text-slate-400 text-lg">
              Learn how AI actually works with short, practical lessons.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 mt-6 p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-300">
              <span className="font-semibold text-white">{courses.filter(c => 
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                c.description?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length}</span>{" "}
              Courses
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-slate-300">
              <span className="font-semibold text-white">Beginner Friendly</span>
            </span>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="mt-6 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses
          .filter(course => 
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            course.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((course, index) => (
          <div
            key={course.id}
            className="group bg-slate-900/70 border border-slate-800/60 rounded-2xl shadow-lg hover:shadow-blue-600/20 transition-all duration-300 hover:scale-[1.01] overflow-hidden backdrop-blur-lg h-80"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.5s ease-out forwards",
              opacity: 0,
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

              {/* LEFT SIDE */}
              <div className="p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="w-12 h-12 mb-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-600/20">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>

                  <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent line-clamp-2">
                    {course.title}
                  </h2>

                  <p className="text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {course.description}
                  </p>
                </div>

                {/* LESSON COUNT - FIXED POSITION */}
                <div className="mt-auto pt-4">
                  {course.lessons.length > 0 && (
                    <span className="inline-block px-4 py-1.5 text-sm rounded-full bg-blue-600/10 text-blue-400 border border-blue-600/20">
                      {course.lessons.length} lesson
                      {course.lessons.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE — FIXED BUTTON + IMAGE */}
              <div className="bg-slate-800/40 flex flex-col px-6 relative">      
                <div className="flex-1"></div>

                {/* FIXED HEIGHT IMAGE - INSET WITH ROUNDED BORDERS */}
                <div className="relative w-full h-40 overflow-hidden flex-shrink-0 px-2 py-4">
                  <img
                    src={
                      course.image_url
                        ? `http://127.0.0.1:8000${course.image_url}`
                        : `https://source.unsplash.com/random/800x600/?technology,ai,learning&sig=${course.id}`
                    }
                    alt="Course"
                    className="w-full h-full object-cover rounded-xl 
                               opacity-80 group-hover:opacity-100 transition-all duration-300
                               shadow-lg"
                  />
                </div>

                {/* BUTTON LOCKED TO BOTTOM */}
                <div className="p-6">
                  {course.lessons.length > 0 ? (
                    <Link
                      to={`/lesson/${course.lessons[0].id}`}
                      className="w-full block text-center px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                      hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl 
                      shadow-md shadow-blue-600/20 transition-all duration-300"
                    >
                      Start Course
                    </Link>
                  ) : (
                    <div className="w-full text-center px-5 py-3 bg-slate-800/60 text-slate-500 rounded-xl border border-slate-700">
                      No lessons yet
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {courses.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-800/50">
            <BookOpen className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-300">
            No courses available
          </h3>
          <p className="text-slate-500">Check back soon for new courses!</p>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}