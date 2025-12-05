import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Career-ready paths",
    description:
      "Follow curated tracks for data, product, and engineering roles with content that mirrors top programs.",
    icon: GraduationCap,
    color: "from-sky-500/20 to-indigo-500/10 text-sky-200 border-sky-400/30",
  },
  {
    title: "Bite-sized learning",
    description:
      "10-15 minute lessons with hands-on tasks so you can make progress between meetings.",
    icon: Clock3,
    color: "from-violet-500/20 to-fuchsia-500/10 text-violet-200 border-violet-400/30",
  },
  {
    title: "Guided projects",
    description:
      "Build portfolio-ready work with step-by-step walkthroughs, live sandboxes, and mentor tips.",
    icon: MonitorPlay,
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-200 border-emerald-400/30",
  },
  {
    title: "Team reporting",
    description:
      "See adoption, momentum, and completions with org-wide analytics and badges.",
    icon: Layers,
    color: "from-amber-500/20 to-orange-500/10 text-amber-100 border-amber-400/30",
  },
];

const paths = [
  {
    title: "AI Fundamentals",
    level: "Beginner",
    lessons: "8 lessons / 90 mins",
    badge: "Most popular",
    accent: "from-sky-500/15 to-blue-500/10 border-sky-500/30",
  },
  {
    title: "Product with GenAI",
    level: "Intermediate",
    lessons: "12 lessons / 2h",
    badge: "Teams",
    accent: "from-violet-500/15 to-purple-500/10 border-violet-500/30",
  },
  {
    title: "AI for Engineers",
    level: "Advanced",
    lessons: "10 lessons / 2h",
    badge: "New",
    accent: "from-emerald-500/15 to-teal-500/10 border-emerald-500/30",
  },
];

export default function Landing() {
  return (
    <div className="relative overflow-hidden">

  {/* --- FIXED GRADIENT BACKGROUND --- */}
  <div
    className="pointer-events-none absolute inset-0 
    bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_75%),
        radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.15),transparent_70%),
        radial-gradient(circle_at_40%_80%,rgba(34,197,94,0.14),transparent_75%)]"
  />
  {/* --- FIXED GLOW ORB --- */}
  <div className="pointer-events-none absolute -top-32 right-10 h-96 w-96 rounded-full bg-white/5 blur-[120px]" />

      {/* Hero */}
  <section className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center py-8 sm:py-12 lg:py-16">
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 shadow-lg shadow-indigo-950/30">
        <Sparkles className="w-4 h-4 text-indigo-300" />
        <span>Modern learning, Coursera quality</span>
      </div>

          <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-white">
          Learn AI skills with{" "}
          <span className="bg-gradient-to-r from-sky-300 via-indigo-200 to-pink-200 bg-clip-text text-transparent">
            trusted
          </span>{" "}
          guided paths.
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl">
          Inspired by Coursera's best experiences - credentialed instructors, structured journeys, and hands-on projects that fit into your workweek.
        </p>
      </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:brightness-110 transition"
            >
              Start for free
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-slate-50/90 hover:border-white/40 hover:text-white transition"
        >
              Log in
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            <Stat label="Learners" value="1k+" />
            <Stat label="Avg. course rating" value="4.8/5" />
            <Stat label="Completion boost" value="+38%" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-indigo-500/5 to-transparent blur-3xl" />
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.6)] space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-200 border-b border-white/10 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-700/40">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Structured programs</p>
                <p className="text-xs text-slate-400">
                  Certificates, checkpoints, and coach prompts.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {paths.map((path) => (
                <div
                  key={path.title}
                  className={`rounded-2xl border p-4 bg-gradient-to-br ${path.accent}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-300/80">
                        {path.level}
                      </p>
                      <h3 className="text-lg font-semibold text-white">
                        {path.title}
                      </h3>
                      <p className="text-sm text-slate-300/90">{path.lessons}</p>
                    </div>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-white/10 text-white border border-white/10">
                      {path.badge}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    Guided checkpoints included
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 flex items-center gap-3">
              <ShieldCheck className="w-10 h-10 text-emerald-300" />
              <div className="text-sm">
                <p className="font-semibold text-white">Built for teams</p>
                <p className="text-slate-400">
                  Admin controls, SSO, and progress exports included.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className={`rounded-2xl border p-5 bg-gradient-to-br ${feature.color} backdrop-blur-lg shadow-lg shadow-black/30`}
          >
            <feature.icon className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-200/80 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* Social proof */}
      <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] space-y-6">
          <div className="flex items-center gap-3 text-sm text-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-800/40">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Loved by teams</p>
              <p className="text-slate-300">Roll out in days, see adoption fast.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-50 shadow-lg shadow-emerald-900/30">
              "We migrated from long-form courses to these paths and completion rates jumped immediately."
              <p className="mt-3 font-semibold">- Joe, L&D Lead</p>
            </div>
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm text-indigo-50 shadow-lg shadow-indigo-900/30">
              "Exactly the polish and structure you expect from Coursera, but tuned for AI and faster teams."
              <p className="mt-3 font-semibold">- Aaron, Product Director</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            <Badge icon={ShieldCheck} label="Verified instructors" />
            <Badge icon={Sparkles} label="Weekly live sessions" />
            <Badge icon={BookOpen} label="Certificate-ready" />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-6">
          <div className="flex items-center gap-3 text-sm text-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-800/40">
              <MonitorPlay className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">What's inside</p>
              <p className="text-slate-300">Short videos, checkpoints, and labs.</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              "Weekly learning plans that auto-adjust to your pace.",
              "Checkpoint quizzes and peer notes for every module.",
              "Downloadable cheat-sheets for your team wiki.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 text-sm text-slate-200"
              >
                <div className="mt-1 rounded-full bg-white/10 p-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                </div>
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200/90">
            Ready to see the catalog?{" "}
            <Link
              to="/courses"
              className="font-semibold text-sky-200 hover:text-white inline-flex items-center gap-1"
            >
              Browse courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 mb-4">
        <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-r from-sky-600/40 via-indigo-600/50 to-purple-600/50 p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.07),transparent_25%)]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-white/70">
                Start today
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
                Give your team a modern learning hub with Coursera-level polish.
              </h2>
              <p className="text-slate-100/90 mt-2">
                Free to try for 14 days. Add teammates, import SSO, and launch your first path.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition"
              >
                Create account
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                View catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-black/30">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-300/80 mb-1">
        {label}
      </p>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Badge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 border border-white/10 text-xs text-slate-200">
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
}
