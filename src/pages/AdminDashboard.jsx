import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Trash2, Edit, Plus, Save, Image, Video, FileText, MessageSquare, X } from "lucide-react";


export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    image_url: "",
    image_file: null,
  });

  const [editingCourse, setEditingCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

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

    await axios.delete(`http://127.0.0.1:8000/courses/${id}`, {
      headers: getAuthHeader(),
    });

    loadCourses();
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
    loadCourses();
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
    await axios.put(
      `http://127.0.0.1:8000/lessons/${lessonId}`,
      editingLesson,
      { headers: getAuthHeader() }
    );

    setEditingLesson(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-indigo-100">Manage your courses and lessons</p>
        </div>

        {/* Create New Course Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Plus className="w-5 h-5" /> Create New Course
            </h2>
          </div>

          <div onSubmit={createCourse} className="p-6 space-y-5">
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

            <button onClick={createCourse} className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg hover:shadow-emerald-500/50">
              Create Course
            </button>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            All Courses ({courses.length})
          </h2>

          {courses.length === 0 && (
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
              <p className="text-slate-400 text-lg">No courses yet. Create your first course above!</p>
            </div>
          )}

          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl overflow-hidden transition hover:border-indigo-500/50"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-slate-400">{course.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <FileText className="w-4 h-4" />
                      <span>{course.lessons?.length || 0} lessons</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition group"
                      title="Delete course"
                    >
                      <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                    </button>

                    <button
                      onClick={() =>
                        setExpandedCourseId(
                          expandedCourseId === course.id ? null : course.id
                        )
                      }
                      className="p-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition group"
                      title={expandedCourseId === course.id ? "Collapse" : "Expand"}
                    >
                      {expandedCourseId === course.id ? (
                        <ChevronUp className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Editor */}
                {expandedCourseId === course.id && (
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
                    
                    {/* Edit Course Section */}
                    <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-5">
                      <h4 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
                        <Edit className="w-5 h-5 text-blue-400" />
                        Edit Course Details
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-slate-400 mb-1 block">Title</label>
                          <input
                            type="text"
                            defaultValue={course.title}
                            onChange={(e) =>
                              setEditingCourse({
                                ...course,
                                title: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-400 mb-1 block">Description</label>
                          <textarea
                            defaultValue={course.description}
                            onChange={(e) =>
                              setEditingCourse({
                                ...course,
                                description: e.target.value,
                              })
                            }
                            rows="3"
                            className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400 mb-1 block">Image</label>
                          <input
                            type="text"
                            defaultValue={course.image_url}
                            placeholder="Image URL"
                            onChange={(e) =>
                              setEditingCourse({
                                ...course,
                                image_url: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          />

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setEditingCourse({
                                ...course,
                                image_file: e.target.files[0],
                              })
                            }
                            className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                          />

                          {(editingCourse?.image_file || editingCourse?.image_url) && (
                            <img
                              src={
                                editingCourse.image_file
                                  ? URL.createObjectURL(editingCourse.image_file)
                                  : editingCourse.image_url
                              }
                              className="h-32 w-auto rounded-lg border border-slate-600 mt-2 shadow-lg"
                              alt="Course preview"
                            />
                          )}
                        </div>

                        <button
                          onClick={() => updateCourse(course.id)}
                          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                      </div>
                    </div>

                    {/* Lessons Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Video className="w-5 h-5 text-purple-400" />
                          Lessons ({course.lessons?.length || 0})
                        </h4>
                      </div>

                      {course.lessons?.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h5 className="font-semibold text-white text-lg mb-1">{lesson.title}</h5>
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                  {lesson.video_url && (
                                    <span className="flex items-center gap-1">
                                      <Video className="w-4 h-4" />
                                      Video included
                                    </span>
                                  )}
                                  {lesson.has_ai_chat && (
                                    <span className="flex items-center gap-1 text-emerald-400">
                                      <MessageSquare className="w-4 h-4" />
                                      AI Chat enabled
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingLesson(lesson)}
                                  className="p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition group"
                                  title="Edit lesson"
                                >
                                  <Edit className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                                </button>

                                <button
                                  onClick={() => deleteLesson(lesson.id)}
                                  className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition group"
                                  title="Delete lesson"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                                </button>
                              </div>
                            </div>

                            {editingLesson?.id === lesson.id && (
                              <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-slate-400 mb-1 block">Lesson Title</label>
                                  <input
                                    type="text"
                                    defaultValue={lesson.title}
                                    onChange={(e) =>
                                      setEditingLesson({
                                        ...editingLesson,
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                  />
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-slate-400 mb-1 block">Content</label>
                                  <textarea
                                    defaultValue={lesson.content}
                                    onChange={(e) =>
                                      setEditingLesson({
                                        ...editingLesson,
                                        content: e.target.value,
                                      })
                                    }
                                    rows="4"
                                    className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                                  />
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-slate-400 mb-1 block">Video URL</label>
                                  <input
                                    type="text"
                                    defaultValue={lesson.video_url}
                                    placeholder="https://..."
                                    onChange={(e) =>
                                      setEditingLesson({
                                        ...editingLesson,
                                        video_url: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                  />
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg border border-slate-700/50">
                                  <input
                                    type="checkbox"
                                    id={`ai-chat-${lesson.id}`}
                                    checked={editingLesson.has_ai_chat}
                                    onChange={(e) =>
                                      setEditingLesson({
                                        ...editingLesson,
                                        has_ai_chat: e.target.checked,
                                      })
                                    }
                                    className="w-4 h-4 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
                                  />
                                  <label htmlFor={`ai-chat-${lesson.id}`} className="text-slate-300 text-sm font-medium flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                                    Enable AI Chat for this lesson
                                  </label>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => updateLesson(lesson.id, course.id)}
                                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition shadow-lg flex items-center gap-2"
                                  >
                                    <Save className="w-4 h-4" />
                                    Save Lesson
                                  </button>
                                  <button
                                    onClick={() => setEditingLesson(null)}
                                    className="px-5 py-2 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition flex items-center gap-2"
                                  >
                                    <X className="w-4 h-4" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      <AddLessonForm courseId={course.id} onSubmit={createLesson} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
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