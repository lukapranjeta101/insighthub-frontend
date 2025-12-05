import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AdminEditLesson() {
  const { id } = useParams();
  const lessonId = id;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prompt, setPrompt] = useState("");

  // ------------------------------
  // Fetch lesson details + prompt
  // ------------------------------
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/lessons/${lessonId}`);
        setLesson(res.data);

        const promptRes = await axios.get(
          `http://127.0.0.1:8000/lessons/${lessonId}/prompt`
        );
        setPrompt(promptRes.data.prompt || "");
      } catch (err) {
        console.error("Error loading lesson:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  // ------------------------------
  // Save lesson basic fields
  // ------------------------------
  const saveLesson = async () => {
    setSaving(true);

    try {
      await axios.put(`http://127.0.0.1:8000/lessons/${lessonId}`, {
        title: lesson.title,
        content: lesson.content,
        video_url: lesson.video_url,
        has_ai_chat: lesson.has_ai_chat,
      });

      alert("Lesson updated!");
    } catch (err) {
      console.error(err);
      alert("Error saving lesson");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------
  // Save AI prompt
  // ------------------------------
  const savePrompt = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/lessons/${lessonId}/prompt`,
        { prompt }
      );

      alert("AI Prompt saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving prompt");
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading lesson...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Edit Lesson #{lessonId}</h1>

      {/* -------------------------- */}
      {/*  Basic Lesson Information   */}
      {/* -------------------------- */}
      <div className="p-6 bg-white rounded-xl shadow space-y-5">
        <h2 className="text-xl font-semibold">Lesson Details</h2>

        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={lesson.title}
            onChange={(e) =>
              setLesson({ ...lesson, title: e.target.value })
            }
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="block font-medium mb-1">Video URL</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={lesson.video_url || ""}
            onChange={(e) =>
              setLesson({ ...lesson, video_url: e.target.value })
            }
          />
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            className="w-full border p-2 rounded h-40"
            value={lesson.content || ""}
            onChange={(e) =>
              setLesson({ ...lesson, content: e.target.value })
            }
          />
        </div>

        {/* AI Chat Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={lesson.has_ai_chat}
            onChange={(e) =>
              setLesson({ ...lesson, has_ai_chat: e.target.checked })
            }
          />
          <span className="font-medium">Enable AI Chat for this lesson</span>
        </div>

        <button
          onClick={saveLesson}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          {saving ? "Saving..." : "Save Lesson"}
        </button>
      </div>

      {/* -------------------------- */}
      {/*       AI Prompt Editor     */}
      {/* -------------------------- */}
      <div className="p-6 bg-white rounded-xl shadow space-y-5">
        <h2 className="text-xl font-semibold">AI Prompt Template</h2>
        <p className="text-gray-600 text-sm">
          This prompt controls how the AI behaves for **this specific lesson**.  
          Example: tutor mode, resume grader, scenario helper, etc.
        </p>

        <textarea
          className="w-full h-60 border p-3 rounded"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={savePrompt}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Save AI Prompt
        </button>
      </div>
    </div>
  );
}
