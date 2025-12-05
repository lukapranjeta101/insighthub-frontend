import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Play, BookOpen, Clock, CheckCircle } from "lucide-react";

// ⭐ ADD THESE
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ ADD — Chat state
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! After watching the video, type 'I'm done' and I'll give you a challenge." }
  ]);

  // ⭐ ADD — Chat sender function
  const sendMessage = async (text) => {
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/chat", {
        lesson_id: lesson.id,
        message: text,
      });

      const botMsg = { sender: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to AI tutor." },
      ]);
    }
  };

  // -------- Convert YouTube link → embed ----------
  function convertToEmbed(url) {
    if (!url) return "";
    if (url.includes("embed")) return url;

    let videoId = "";

    if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    if (!videoId) return url;

    return `https://www.youtube.com/embed/${videoId}`;
  }

  useEffect(() => {
    const fetchLessonAndCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`http://127.0.0.1:8000/lessons/${id}`);
        setLesson(res.data);

        const coursesRes = await axios.get("http://127.0.0.1:8000/courses/");
        const course = coursesRes.data.find(
          (c) => c.id === res.data.course_id
        );

        setCourseLessons(course?.lessons || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading lesson:", err);
        setError("Failed to load lesson. Please try again.");
        setLoading(false);
      }
    };

    fetchLessonAndCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 animate-pulse">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20">
            <BookOpen className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-300">Lesson not found</h2>
          <p className="text-slate-500">
            {error || "This lesson could not be loaded."}
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const numericId = Number(id);
  let currentIndex = -1;
  let prevLesson = null;
  let nextLesson = null;

  if (courseLessons.length > 0 && !Number.isNaN(numericId)) {
    currentIndex = courseLessons.findIndex((l) => l.id === numericId);
    if (currentIndex !== -1) {
      prevLesson = courseLessons[currentIndex - 1] || null;
      nextLesson = courseLessons[currentIndex + 1] || null;
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <button
        onClick={() => navigate("/courses")}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Courses</span>
      </button>

      {/* Lesson Header */}
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/50 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-600/20">
            <BookOpen className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {lesson.title}
            </h1>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 rounded-lg border border-blue-600/20">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">15 min read</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600/10 rounded-lg border border-green-600/20">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Beginner friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      {lesson.video_url && (
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center border border-purple-600/20">
              <Play className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold">Video Lesson</h2>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/50 bg-black">
            <iframe
              width="100%"
              height="500"
              src={convertToEmbed(lesson.video_url)}
              title="Lesson Video"
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* ⭐⭐⭐ CONDITIONAL AI CHAT MODULE ⭐⭐⭐ */}
      {lesson.has_ai_chat && (
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/50 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-4">
          <h2 className="text-xl font-semibold text-white">Interactive AI Tutor</h2>

          <div className="h-80 overflow-y-auto border border-slate-700 rounded-xl p-4 bg-slate-800/40">
            <ChatWindow messages={messages} />
          </div>

          <ChatInput onSend={sendMessage} />
        </div>
      )}

      {/* Content Section */}
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/50 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="prose prose-invert prose-slate max-w-none">
          <div className="text-slate-300 leading-relaxed whitespace-pre-line text-base sm:text-lg">
            {lesson.content}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-slate-400">Mark as complete</span>
        </div>

        <div className="flex gap-3">
          {prevLesson && (
            <button
              onClick={() => navigate(`/lesson/${prevLesson.id}`)}
              className="px-6 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-white font-medium rounded-xl transition-all duration-300 border border-slate-700/50"
            >
              Previous
            </button>
          )}

          {nextLesson && (
            <button
              onClick={() => navigate(`/lesson/${nextLesson.id}`)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
