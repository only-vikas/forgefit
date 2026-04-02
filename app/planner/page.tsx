"use client";

import { useEffect, useState, useCallback } from "react";
import PlannerCalendar from "@/components/planner/PlannerCalendar";
import SessionDrawer, { type SessionData } from "@/components/planner/SessionDrawer";

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
};

const SESSION_DAYS = Object.keys(SESSION_DB).map(Number);

export default function PlannerPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<SessionData | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDaySelect = useCallback((day: number) => {
    setSelectedDay(day);
    const session = SESSION_DB[day] || null;
    setActiveSession(session);
    if (session) setDrawerOpen(true);
    else setDrawerOpen(false);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full relative">
      <main className="py-12 md:py-24 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="text-[10px] font-bold tracking-[0.5em] uppercase mb-2 text-[#C8FF00]/40">
            Monthly Overview
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-space-grotesk tracking-tighter">
            TRAINING ARCHITECTURE
          </h2>
          <p className="text-sm text-white/40 mt-4 max-w-xl font-light leading-relaxed">
            Select a highlighted day to view session details, AI-powered suggestions, and launch your next high-performance protocol.
          </p>
        </div>

        <PlannerCalendar
          selectedDay={selectedDay}
          onDaySelect={handleDaySelect}
          sessionDays={SESSION_DAYS}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {[
            { label: "Total Volume", value: "82.4K kg", icon: "📊" },
            { label: "Avg Duration", value: "~62m", icon: "⏱" },
            { label: "Consistency", value: "92%", icon: "🔥" },
            { label: "Next Session", value: "Tomorrow", icon: "→" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl glass hover:border-[#C8FF00]/20 transition-all group"
            >
              <div className="text-2xl mb-4 opacity-40 group-hover:opacity-100 transition-opacity">{stat.icon}</div>
              <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/30 mb-1">
                {stat.label}
              </div>
              <div className="text-xl font-bold font-mono tracking-tight text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </main>

      <SessionDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        dayNumber={selectedDay}
        session={activeSession}
      />
    </div>
  );
}
