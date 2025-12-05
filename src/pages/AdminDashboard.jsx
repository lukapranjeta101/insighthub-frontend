import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Trash2, Edit, Plus, Save, Image, Video, FileText, MessageSquare, X, Check, AlertCircle, GripVertical } from "lucide-react";


export default function AdminDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    image_url: "",
    image_file: null,
  });

  const [editingCourse, setEditingCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [modalCourse, setModalCourse] = useState(null);
  const [modalLesson, setModalLesson] = useState(null);

  useEffect(() => {
    verifyAdminAccess();
  }, []);

  // ⭐ SECURITY: Verify admin access with backend
  const verifyAdminAccess = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Try to access admin dashboard endpoint - backend will verify admin status
      const res = await axios.get("http://127.0.0.1:8000/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsAuthorized(true);
      loadCourses();
    } catch (err) {
      // Backend rejected - not an admin
      navigate("/");
    }
  };

  const loadCourses = () => {
    axios.get("http://127.0.0.1:8000/courses/").then((res) => {
      setCourses(res.data);
    });
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://127.0.0.1:8000/admin/upload-image",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data.url;
  };

  const createCourse = async (e) => {
    e.preventDefault();

    let imageUrl = newCourse.image_url;

    if (newCourse.image_file) {
      imageUrl = await uploadImage(newCourse.image_file);
    }

    const res = await axios.post(
      "http://127.0.0.1:8000/courses/",
      {
        title: newCourse.title,
        description: newCourse.description,
        image_url: imageUrl,
      },
      {
        headers: getAuthHeader(),
      }
    );

    setCourses([...courses, res.data]);
    setNewCourse({ title: "", description: "", image_url: "", image_file: null });
  };

  const deleteCourse = async (id) => {
    if (!confirm("Delete this course?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/courses/${id}`, {
        headers: getAuthHeader(),
      });

      loadCourses();
    } catch (err) {
      console.error("Delete course error:", err);
      alert(err.response?.data?.detail || "Failed to delete course");
    }
  };

  const updateCourse = async (courseId) => {
    let updatedImageUrl = editingCourse.image_url;

    if (editingCourse.image_file) {
      updatedImageUrl = await uploadImage(editingCourse.image_file);
    }

    await axios.put(
      `http://127.0.0.1:8000/courses/${courseId}`,
      {
        title: editingCourse.title,
        description: editingCourse.description,
        image_url: updatedImageUrl,
      },
      {
        headers: getAuthHeader(),
      }
    );

    setEditingCourse(null);
    setShowCourseModal(false);
    loadCourses();
  };

  const openCourseEditModal = (course) => {
    setModalCourse({ ...course });
    setShowCourseModal(true);
  };

  const openLessonEditModal = (lesson) => {
    setModalLesson({ ...lesson });
    setShowLessonModal(true);
  };

  const createLesson = async (courseId, lesson) => {
    await axios.post(
      "http://127.0.0.1:8000/lessons/",
      { ...lesson, course_id: courseId },
      { headers: getAuthHeader() }
    );

    loadCourses();
  };

  const updateLesson = async (lessonId, courseId) => {
    const lessonData = modalLesson || editingLesson;
    
    await axios.put(
      `http://127.0.0.1:8000/lessons/${lessonId}`,
      lessonData,
      { headers: getAuthHeader() }
    );

    setEditingLesson(null);
    setShowLessonModal(false);
    setModalLesson(null);
    loadCourses();
  };

  const deleteLesson = async (lessonId) => {
    if (!confirm("Delete this lesson?")) return;

    await axios.delete(`http://127.0.0.1:8000/lessons/${lessonId}`, {
      headers: getAuthHeader(),
    });

    loadCourses();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ⭐ SECURITY: Show loading or redirect if not authorized */}
        {!isAuthorized ? (
          <div className="text-center py-20">
            <p className="text-slate-300">Verifying admin access...</p>
          </div>
        ) : (
          <>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-indigo-100 text-sm sm:text-base">Manage your courses and lessons</p>
        </div>

        {/* Create New Course Section - Collapsible */}
        <CreateCourseCard 
          newCourse={newCourse}
          setNewCourse={setNewCourse}
          createCourse={createCourse}
        />

        {/* Courses List */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
            All Courses ({courses.length})
          </h2>

          {courses.length === 0 && (
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 sm:p-12 text-center">
              <p className="text-slate-400 text-base sm:text-lg">No courses yet. Create your first course above!</p>
            </div>
          )}

          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              expandedCourseId={expandedCourseId}
              setExpandedCourseId={setExpandedCourseId}
              deleteCourse={deleteCourse}
              openCourseEditModal={openCourseEditModal}
              createLesson={createLesson}
              updateLesson={updateLesson}
              deleteLesson={deleteLesson}
              openLessonEditModal={openLessonEditModal}
              editingLesson={editingLesson}
              setEditingLesson={setEditingLesson}
            />
          ))}
        </div>

        {/* Course Edit Modal */}
        {showCourseModal && modalCourse && (
          <CourseEditModal
            course={modalCourse}
            setModalCourse={setModalCourse}
            updateCourse={updateCourse}
            onClose={() => {
              setShowCourseModal(false);
              setModalCourse(null);
              setEditingCourse(null);
            }}
            uploadImage={uploadImage}
          />
        )}

        {/* Lesson Edit Modal */}
        {showLessonModal && modalLesson && (
          <LessonEditModal
            lesson={modalLesson}
            setModalLesson={setModalLesson}
            updateLesson={updateLesson}
            onClose={() => {
              setShowLessonModal(false);
              setModalLesson(null);
            }}
          />
        )}
          </>
        )}
      </div>
    </div>
  );
}

function AddLessonForm({ courseId, onSubmit }) {
  const [lesson, setLesson] = useState({
    title: "",
    content: "",
    video_url: "",
    has_ai_chat: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!lesson.title || !lesson.content) {
      alert("Please fill in lesson title and content");
      return;
    }
    onSubmit(courseId, lesson);
    setLesson({ title: "", content: "", video_url: "", has_ai_chat: false });
    setIsOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/30 overflow-hidden">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-4 text-left hover:bg-emerald-500/5 transition flex items-center gap-3 group"
        >
          <div className="p-2 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition">
            <Plus className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-semibold text-emerald-300 group-hover:text-emerald-200">Add New Lesson</span>
        </button>
      ) : (
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              Add New Lesson
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-700/50 transition"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 mb-1 block">Lesson Title</label>
            <input
              type="text"
              placeholder="Enter lesson title..."
              value={lesson.title}
              onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 mb-1 block">Content</label>
            <textarea
              placeholder="Enter lesson content..."
              value={lesson.content}
              onChange={(e) => setLesson({ ...lesson, content: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 mb-1 block">Video URL (Optional)</label>
            <input
              type="text"
              placeholder="https://..."
              value={lesson.video_url}
              onChange={(e) => setLesson({ ...lesson, video_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg border border-slate-700/50">
            <input
              type="checkbox"
              id="ai-chat-new"
              checked={lesson.has_ai_chat}
              onChange={(e) =>
                setLesson({ ...lesson, has_ai_chat: e.target.checked })
              }
              className="w-4 h-4 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
            />
            <label htmlFor="ai-chat-new" className="text-slate-300 text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Enable AI Chat for this lesson
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg"
          >
            Add Lesson
          </button>
        </div>
      )}
    </div>
  );
}

// Create Course Card Component
function CreateCourseCard({ newCourse, setNewCourse, createCourse }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.description) {
      alert("Please fill in course title and description");
      return;
    }
    createCourse(e);
    setIsOpen(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between hover:from-emerald-700 hover:to-teal-700 transition"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
          <Plus className="w-5 h-5" /> Create New Course
        </h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-white" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Course Title</label>
            <input
              type="text"
              placeholder="Enter course title..."
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Course Description</label>
            <textarea
              placeholder="Enter course description..."
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Image className="w-4 h-4" /> Course Image
            </label>

            <input
              type="text"
              placeholder="Or paste image URL..."
              value={newCourse.image_url}
              onChange={(e) =>
                setNewCourse({ ...newCourse, image_url: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    image_file: e.target.files[0],
                  })
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 file:cursor-pointer transition"
              />
            </div>

            {(newCourse.image_url || newCourse.image_file) && (
              <div className="relative inline-block">
                <img
                  src={
                    newCourse.image_file
                      ? URL.createObjectURL(newCourse.image_file)
                      : newCourse.image_url
                  }
                  className="h-40 w-auto rounded-lg border-2 border-slate-700 shadow-lg object-cover"
                  alt="Course preview"
                />
              </div>
            )}
          </div>

          <button 
            onClick={handleCreate} 
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg hover:shadow-emerald-500/50"
          >
            Create Course
          </button>
        </div>
      )}
    </div>
  );
}

// Course Card Component
function CourseCard({
  course,
  expandedCourseId,
  setExpandedCourseId,
  deleteCourse,
  openCourseEditModal,
  createLesson,
  updateLesson,
  deleteLesson,
  openLessonEditModal,
  editingLesson,
  setEditingLesson,
}) {
  const isExpanded = expandedCourseId === course.id;

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl overflow-hidden transition hover:border-indigo-500/50">
      <div className="p-4 sm:p-6">
        {/* Course Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {course.image_url && (
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-32 sm:h-40 object-cover rounded-lg mb-4 border border-slate-700"
              />
            )}
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 truncate">{course.title}</h3>
            <p className="text-slate-400 text-sm sm:text-base line-clamp-2">{course.description}</p>
            <div className="mt-3 flex items-center gap-4 text-xs sm:text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                {course.lessons?.length || 0} lessons
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <button
              onClick={() => openCourseEditModal(course)}
              className="p-2 sm:p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition group"
              title="Edit course"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:text-blue-300" />
            </button>

            <button
              onClick={() => deleteCourse(course.id)}
              className="p-2 sm:p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition group"
              title="Delete course"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 group-hover:text-red-300" />
            </button>

            <button
              onClick={() =>
                setExpandedCourseId(isExpanded ? null : course.id)
              }
              className="p-2 sm:p-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition group"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:text-indigo-300" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:text-indigo-300" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Lessons */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-400" />
              Lessons ({course.lessons?.length || 0})
            </h4>

            <div className="space-y-3">
              {course.lessons?.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  deleteLesson={deleteLesson}
                  openLessonEditModal={openLessonEditModal}
                />
              ))}
            </div>

            <AddLessonForm courseId={course.id} onSubmit={createLesson} />
          </div>
        )}
      </div>
    </div>
  );
}

// Lesson Item Component
function LessonItem({ lesson, deleteLesson, openLessonEditModal }) {
  return (
    <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-3 sm:p-4 hover:border-slate-600/50 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h5 className="font-semibold text-white text-sm sm:text-base mb-1 truncate">{lesson.title}</h5>
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-2">{lesson.content}</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400">
            {lesson.video_url && (
              <span className="flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded-md">
                <Video className="w-3 h-3" />
                Video
              </span>
            )}
            {lesson.has_ai_chat && (
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                <MessageSquare className="w-3 h-3" />
                AI Chat
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => openLessonEditModal(lesson)}
            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition group"
            title="Edit lesson"
          >
            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 group-hover:text-blue-300" />
          </button>

          <button
            onClick={() => deleteLesson(lesson.id)}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition group"
            title="Delete lesson"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 group-hover:text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Course Edit Modal Component
function CourseEditModal({ course, setModalCourse, updateCourse, onClose, uploadImage }) {
  const [localCourse, setLocalCourse] = useState({ ...course });
  const [previewImage, setPreviewImage] = useState(course.image_url);

  const handleImageFileChange = (file) => {
    setLocalCourse({ ...localCourse, image_file: file });
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setModalCourse(localCourse);
    await updateCourse(course.id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b border-blue-500/30">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Course
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Course Title</label>
            <input
              type="text"
              value={localCourse.title}
              onChange={(e) =>
                setLocalCourse({ ...localCourse, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
            <textarea
              value={localCourse.description}
              onChange={(e) =>
                setLocalCourse({ ...localCourse, description: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2">
              <Image className="w-4 h-4" />
              Course Image
            </label>

            <input
              type="text"
              placeholder="Or paste image URL..."
              value={localCourse.image_url}
              onChange={(e) => {
                setLocalCourse({ ...localCourse, image_url: e.target.value });
                setPreviewImage(e.target.value);
              }}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageFileChange(e.target.files[0])}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
            />

            {previewImage && (
              <div className="relative inline-block">
                <img
                  src={previewImage}
                  className="h-48 w-auto rounded-lg border-2 border-slate-600 shadow-lg object-cover"
                  alt="Preview"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lesson Edit Modal Component
function LessonEditModal({ lesson, setModalLesson, updateLesson, onClose }) {
  const [localLesson, setLocalLesson] = useState({ ...lesson });

  const handleSave = async () => {
    setModalLesson(localLesson);
    await updateLesson(lesson.id, lesson.course_id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between border-b border-purple-500/30">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Lesson
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Lesson Title</label>
            <input
              type="text"
              value={localLesson.title}
              onChange={(e) =>
                setLocalLesson({ ...localLesson, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Content</label>
            <textarea
              value={localLesson.content}
              onChange={(e) =>
                setLocalLesson({ ...localLesson, content: e.target.value })
              }
              rows="6"
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video URL (Optional)
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={localLesson.video_url || ""}
              onChange={(e) =>
                setLocalLesson({ ...localLesson, video_url: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <input
              type="checkbox"
              id="ai-chat-modal"
              checked={localLesson.has_ai_chat}
              onChange={(e) =>
                setLocalLesson({ ...localLesson, has_ai_chat: e.target.checked })
              }
              className="w-5 h-5 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
            />
            <label htmlFor="ai-chat-modal" className="text-slate-300 font-medium flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Enable AI Chat for this lesson
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}