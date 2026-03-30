"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * app/planner/page.tsx  –  Training Planner Route
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Renders PlannerCalendar + SessionDrawer in a premium two-panel layout.
 * The calendar occupies the main area; selecting a day with a session
 * opens the glass side drawer with full session details.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useCallback } from "react";
import Lenis from "lenis";
import PlannerCalendar from "@/components/planner/PlannerCalendar";
import SessionDrawer, { type SessionData } from "@/components/planner/SessionDrawer";

/* ── Demo session database keyed by day-of-month ── */
const SESSION_DB: Record<number, SessionData> = {
  1: {
    title: "Push Hypertrophy",
    type: "Hypertrophy",
    estimatedMinutes: 65,
    movements: [
      { name: "Barbell Bench Press", sets: 4, reps: "8-10", muscleGroup: "Chest" },
      { name: "Incline DB Press", sets: 3, reps: "10-12", muscleGroup: "Upper Chest" },
      { name: "Cable Flyes", sets: 3, reps: "12-15", muscleGroup: "Chest" },
      { name: "OHP", sets: 3, reps: "8-10", muscleGroup: "Shoulders" },
      { name: "Lateral Raises", sets: 3, reps: "15-20", muscleGroup: "Side Delts" },
      { name: "Tricep Pushdown", sets: 3, reps: "12-15", muscleGroup: "Triceps" },
    ],
    aiSuggestions: [
      "Progressive overload: add 2.5kg to bench if you hit 10 reps across all sets last week.",
      "Prioritise chest stretch at bottom of flyes for hypertrophy stimulus.",
      "Consider super-setting lateral raises with tricep pushdowns to save time.",
    ],
  },
  3: {
    title: "Pull Strength",
    type: "Strength",
    estimatedMinutes: 70,
    movements: [
      { name: "Deadlift", sets: 5, reps: "3-5", muscleGroup: "Posterior Chain" },
      { name: "Barbell Row", sets: 4, reps: "6-8", muscleGroup: "Back" },
      { name: "Weighted Chin-Ups", sets: 3, reps: "5-8", muscleGroup: "Lats / Biceps" },
      { name: "Face Pulls", sets: 3, reps: "15-20", muscleGroup: "Rear Delts" },
      { name: "Barbell Curl", sets: 3, reps: "8-12", muscleGroup: "Biceps" },
    ],
    aiSuggestions: [
      "Warm up with 2–3 progressive deadlift sets before working weight.",
      "Keep chin-up tempo slow on eccentric for lat engagement.",
      "Face pulls are non-negotiable for shoulder health—don't skip.",
    ],
  },
  5: {
    title: "Legs Power",
    type: "Power / Hypertrophy",
    estimatedMinutes: 75,
    movements: [
      { name: "Back Squat", sets: 5, reps: "5", muscleGroup: "Quads / Glutes" },
      { name: "Romanian Deadlift", sets: 4, reps: "8-10", muscleGroup: "Hamstrings" },
      { name: "Leg Press", sets: 3, reps: "12-15", muscleGroup: "Quads" },
      { name: "Walking Lunges", sets: 3, reps: "12/leg", muscleGroup: "Quads / Glutes" },
      { name: "Calf Raises", sets: 4, reps: "15-20", muscleGroup: "Calves" },
    ],
    aiSuggestions: [
      "Box squat warm-ups can improve depth confidence.",
      "RDLs: push hips back, keep bar close. Feel the stretch in hamstrings.",
      "High-rep calf work (15-20) with full ROM yields best results.",
    ],
  },
  8: {
    title: "Upper Body Volume",
    type: "Volume",
    estimatedMinutes: 60,
    movements: [
      { name: "DB Shoulder Press", sets: 4, reps: "10-12", muscleGroup: "Shoulders" },
      { name: "Cable Row", sets: 4, reps: "10-12", muscleGroup: "Back" },
      { name: "Chest Dips", sets: 3, reps: "AMRAP", muscleGroup: "Chest / Triceps" },
      { name: "Hammer Curls", sets: 3, reps: "12-15", muscleGroup: "Biceps" },
    ],
    aiSuggestions: [
      "Use rest-pause on final set of dips for extra volume.",
      "Cable rows: squeeze shoulder blades at contraction.",
    ],
  },
  10: {
    title: "Active Recovery",
    type: "Recovery",
    estimatedMinutes: 40,
    movements: [
      { name: "Foam Rolling", sets: 1, reps: "10min", muscleGroup: "Full Body" },
      { name: "Band Pull-Aparts", sets: 3, reps: "20", muscleGroup: "Rear Delts" },
      { name: "Yoga Flow", sets: 1, reps: "20min", muscleGroup: "Mobility" },
    ],
    aiSuggestions: [
      "Focus on hip flexors and thoracic spine during foam rolling.",
      "Light movement promotes blood flow and recovery between heavy sessions.",
    ],
  },
  12: {
    title: "Push Strength",
    type: "Strength",
    estimatedMinutes: 65,
    movements: [
      { name: "Pause Bench Press", sets: 5, reps: "3-5", muscleGroup: "Chest" },
      { name: "Strict OHP", sets: 4, reps: "5-8", muscleGroup: "Shoulders" },
      { name: "Close-Grip Bench", sets: 3, reps: "8-10", muscleGroup: "Triceps" },
      { name: "Skull Crushers", sets: 3, reps: "10-12", muscleGroup: "Triceps" },
    ],
    aiSuggestions: [
      "2-second pause on chest for bench. No bouncing.",
      "OHP: brace core hard, squeeze glutes, strict form.",
    ],
  },
  15: {
    title: "Pull Hypertrophy",
    type: "Hypertrophy",
    estimatedMinutes: 60,
    movements: [
      { name: "Lat Pulldown", sets: 4, reps: "10-12", muscleGroup: "Lats" },
      { name: "Seated Cable Row", sets: 4, reps: "10-12", muscleGroup: "Back" },
      { name: "DB Reverse Flyes", sets: 3, reps: "15-20", muscleGroup: "Rear Delts" },
      { name: "Incline DB Curl", sets: 3, reps: "10-12", muscleGroup: "Biceps" },
      { name: "Preacher Curl", sets: 3, reps: "12-15", muscleGroup: "Biceps" },
    ],
    aiSuggestions: [
      "Initiate pulldowns with scapular depression before pulling.",
      "Use a V-grip for seated rows to target mid-back thickness.",
    ],
  },
  17: {
    title: "Legs Hypertrophy",
    type: "Hypertrophy",
    estimatedMinutes: 70,
    movements: [
      { name: "Hack Squat", sets: 4, reps: "10-12", muscleGroup: "Quads" },
      { name: "Leg Curl", sets: 4, reps: "10-12", muscleGroup: "Hamstrings" },
      { name: "Bulgarian Split Squat", sets: 3, reps: "10/leg", muscleGroup: "Quads / Glutes" },
      { name: "Leg Extension", sets: 3, reps: "15-20", muscleGroup: "Quads" },
      { name: "Seated Calf Raise", sets: 4, reps: "15-20", muscleGroup: "Calves" },
    ],
    aiSuggestions: [
      "Drop set on final leg extension set for maximum quad pump.",
      "Bulgarian split squats: keep torso upright for quad emphasis.",
    ],
  },
  20: {
    title: "Deload Upper",
    type: "Deload",
    estimatedMinutes: 45,
    movements: [
      { name: "Light Bench Press", sets: 3, reps: "10 @60%", muscleGroup: "Chest" },
      { name: "Light Row", sets: 3, reps: "10 @60%", muscleGroup: "Back" },
      { name: "Band Work", sets: 3, reps: "15-20", muscleGroup: "Shoulders" },
    ],
    aiSuggestions: [
      "Deload week: reduce intensity to 60% 1RM. Focus on form and recovery.",
      "This is NOT a waste of a week—it's what enables the next phase of growth.",
    ],
  },
  22: {
    title: "Push Power",
    type: "Power",
    estimatedMinutes: 55,
    movements: [
      { name: "Push Press", sets: 5, reps: "3", muscleGroup: "Shoulders" },
      { name: "Speed Bench", sets: 5, reps: "3 @65%", muscleGroup: "Chest" },
      { name: "Weighted Dips", sets: 3, reps: "5-8", muscleGroup: "Chest / Triceps" },
    ],
    aiSuggestions: [
      "Explosive concentric, controlled eccentric on push press.",
      "Speed bench: bar should move as fast as possible. Focus on force production.",
    ],
  },
  25: {
    title: "Full Body Conditioning",
    type: "Conditioning",
    estimatedMinutes: 50,
    movements: [
      { name: "Kettlebell Swings", sets: 5, reps: "15", muscleGroup: "Posterior Chain" },
      { name: "Burpee Pull-Ups", sets: 4, reps: "8", muscleGroup: "Full Body" },
      { name: "DB Thrusters", sets: 4, reps: "10", muscleGroup: "Full Body" },
      { name: "Battle Ropes", sets: 3, reps: "30s", muscleGroup: "Upper Body" },
    ],
    aiSuggestions: [
      "Aim for minimal rest between movements (circuit style).",
      "Heart rate target: 75-85% max HR for conditioning benefit.",
    ],
  },
  28: {
    title: "Pull Strength",
    type: "Strength",
    estimatedMinutes: 70,
    movements: [
      { name: "Deadlift", sets: 5, reps: "3", muscleGroup: "Posterior Chain" },
      { name: "Pendlay Row", sets: 4, reps: "5", muscleGroup: "Back" },
      { name: "Weighted Pull-Ups", sets: 4, reps: "5-8", muscleGroup: "Lats" },
      { name: "Barbell Shrug", sets: 3, reps: "10-12", muscleGroup: "Traps" },
    ],
    aiSuggestions: [
      "Heavy pulling day. Ensure grip strength isn't the limiter—use chalk if needed.",
      "Pendlay rows: full dead stop on floor each rep. Explosive pull.",
    ],
  },
};

const SESSION_DAYS = Object.keys(SESSION_DB).map(Number);

export default function PlannerPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<SessionData | null>(null);

  useEffect(() => {
    setMounted(true);

    /* Lenis smooth scroll */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  /* ── Handle day selection ── */
  const handleDaySelect = useCallback((day: number) => {
    setSelectedDay(day);
    const session = SESSION_DB[day] || null;
    setActiveSession(session);
    if (session) setDrawerOpen(true);
    else setDrawerOpen(false);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#080808] text-white relative">
      {/* ── Noise overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] mix-blend-overlay opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Top bar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between"
        style={{
          background: "rgba(8,8,8,0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.04] transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <div>
            <h1 className="text-sm font-bold font-space-grotesk tracking-tight">
              TRAINING PLANNER
            </h1>
            <p className="text-[9px] text-white/25 tracking-widest uppercase font-bold">
              Phase 3 · Hypertrophy Block
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[9px] font-bold tracking-widest uppercase text-white/20">
              Sessions This Month
            </div>
            <div className="text-sm font-bold font-mono">
              <span style={{ color: "#C8FF00" }}>{SESSION_DAYS.length}</span>
              <span className="text-white/20"> scheduled</span>
            </div>
          </div>
          <a
            href="/logger"
            className="px-4 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-[0.15em] transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(200,255,0,0.1)",
              border: "1px solid rgba(200,255,0,0.2)",
              color: "#C8FF00",
            }}
          >
            Quick Log →
          </a>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-8">
          <div className="text-[10px] font-bold tracking-[0.5em] uppercase mb-2" style={{ color: "rgba(200,255,0,0.4)" }}>
            Monthly Overview
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-space-grotesk tracking-tight">
            Your Training Architecture
          </h2>
          <p className="text-sm text-white/25 mt-2 max-w-lg">
            Select a highlighted day to view session details, AI-powered suggestions, and launch your workout.
          </p>
        </div>

        {/* Calendar */}
        <PlannerCalendar
          selectedDay={selectedDay}
          onDaySelect={handleDaySelect}
          sessionDays={SESSION_DAYS}
        />

        {/* Quick stats below calendar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          {[
            { label: "Total Volume", value: "—", icon: "📊" },
            { label: "Avg Duration", value: "~62m", icon: "⏱" },
            { label: "Consistency", value: "92%", icon: "🔥" },
            { label: "Next Session", value: "Tomorrow", icon: "→" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div className="text-lg mb-2 opacity-40">{stat.icon}</div>
              <div className="text-[8px] font-bold tracking-[0.3em] uppercase text-white/20 mb-1">
                {stat.label}
              </div>
              <div className="text-lg font-bold font-mono">{stat.value}</div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Session Drawer ── */}
      <SessionDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        dayNumber={selectedDay}
        session={activeSession}
      />
    </div>
  );
}
