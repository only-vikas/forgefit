"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * WorkoutLogger.tsx  –  Immersive Full-Screen Workout Logger
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The cinematic workout recording interface featuring:
 *   • Global session timer (top bar)
 *   • Exercise stepper showing progress
 *   • Active exercise card with editable sets table (weight / reps / RIR)
 *   • Performance tip card
 *   • 3D telemetry visual sidebar
 *   • Rest timer overlay triggered between sets
 *   • Glass panel UI with noise overlay
 *
 * Self-contained with all state managed internally via useState.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ExerciseStepper from "./ExerciseStepper";
import RestTimer from "./RestTimer";
import TelemetryVisual from "./TelemetryVisual";

/* ── Demo exercise data ── */
interface SetData {
  weight: string;
  reps: string;
  rir: string;
  completed: boolean;
}

interface Exercise {
  name: string;
  muscleGroup: string;
  targetSets: number;
  restSeconds: number;
  tip: string;
  sets: SetData[];
}

const DEMO_EXERCISES: Exercise[] = [
  {
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    targetSets: 4,
    restSeconds: 120,
    tip: "Retract scapulae, arch slightly. Drive feet into floor. Control eccentric 2-3s.",
    sets: Array.from({ length: 4 }, () => ({ weight: "", reps: "", rir: "", completed: false })),
  },
  {
    name: "Incline DB Press",
    muscleGroup: "Upper Chest",
    targetSets: 3,
    restSeconds: 90,
    tip: "30° incline. Keep elbows at 45°. Squeeze at the top for 1s.",
    sets: Array.from({ length: 3 }, () => ({ weight: "", reps: "", rir: "", completed: false })),
  },
  {
    name: "Cable Flyes",
    muscleGroup: "Chest",
    targetSets: 3,
    restSeconds: 60,
    tip: "Slight forward lean. Cross hands at peak contraction. Slow eccentric.",
    sets: Array.from({ length: 3 }, () => ({ weight: "", reps: "", rir: "", completed: false })),
  },
  {
    name: "Weighted Dips",
    muscleGroup: "Chest / Triceps",
    targetSets: 3,
    restSeconds: 90,
    tip: "Lean forward for chest emphasis. Full ROM. Add weight progressively.",
    sets: Array.from({ length: 3 }, () => ({ weight: "", reps: "", rir: "", completed: false })),
  },
  {
    name: "Tricep Pushdown",
    muscleGroup: "Triceps",
    targetSets: 3,
    restSeconds: 60,
    tip: "Lock elbows at sides. Full extension. Squeeze at bottom.",
    sets: Array.from({ length: 3 }, () => ({ weight: "", reps: "", rir: "", completed: false })),
  },
];

export default function WorkoutLogger() {
  /* ── State ── */
  const [activeIdx, setActiveIdx] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>(DEMO_EXERCISES);
  const [showRest, setShowRest] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isLogging, setIsLogging] = useState(true);

  /* Refs */
  const cardRef = useRef<HTMLDivElement>(null);

  const activeExercise = exercises[activeIdx];

  /* ── Global session timer ── */
  useEffect(() => {
    if (!isLogging) return;
    const interval = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isLogging]);

  /* ── Format timer ── */
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  /* ── GSAP entrance on exercise change ── */
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
    );
  }, [activeIdx]);

  /* ── Update set data ── */
  const updateSet = useCallback(
    (setIdx: number, field: keyof SetData, value: string) => {
      setExercises((prev) => {
        const next = [...prev];
        const ex = { ...next[activeIdx] };
        const sets = [...ex.sets];
        sets[setIdx] = { ...sets[setIdx], [field]: value };
        ex.sets = sets;
        next[activeIdx] = ex;
        return next;
      });
    },
    [activeIdx]
  );

  /* ── Complete set ── */
  const completeSet = useCallback(
    (setIdx: number) => {
      setExercises((prev) => {
        const next = [...prev];
        const ex = { ...next[activeIdx] };
        const sets = [...ex.sets];
        sets[setIdx] = { ...sets[setIdx], completed: true };
        ex.sets = sets;
        next[activeIdx] = ex;
        return next;
      });

      /* Show rest timer after completing a set (not the last set) */
      const allDone = exercises[activeIdx].sets.every((s, i) =>
        i === setIdx ? true : s.completed
      );
      if (!allDone) {
        setShowRest(true);
      }
    },
    [activeIdx, exercises]
  );

  /* ── Navigation ── */
  const goNext = () => {
    if (activeIdx < exercises.length - 1) setActiveIdx(activeIdx + 1);
  };

  const goPrev = () => {
    if (activeIdx > 0) setActiveIdx(activeIdx - 1);
  };

  /* ── Completed sets count ── */
  const completedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSets = exercises.reduce((acc, ex) => acc + ex.targetSets, 0);

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

      {/* ════════════════════════════════════════════════════
       *  TOP BAR — Global Timer + Session Info
       * ════════════════════════════════════════════════════ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between"
        style={{
          background: "rgba(8,8,8,0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Left: back + title */}
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
              WORKOUT LOGGER
            </h1>
            <p className="text-[9px] text-white/25 tracking-widest uppercase font-bold">
              Push Day · Phase 3 Hypertrophy
            </p>
          </div>
        </div>

        {/* Center: global timer */}
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#C8FF00", boxShadow: "0 0 8px #C8FF00" }}
          />
          <span className="text-2xl font-extrabold font-mono tracking-tight" style={{ color: "#C8FF00" }}>
            {formatTime(sessionSeconds)}
          </span>
        </div>

        {/* Right: progress */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[9px] font-bold tracking-widest uppercase text-white/25">
              Sets Completed
            </div>
            <div className="text-sm font-bold font-mono">
              <span style={{ color: "#C8FF00" }}>{completedSets}</span>
              <span className="text-white/20">/{totalSets}</span>
            </div>
          </div>
          <button
            onClick={() => setIsLogging(!isLogging)}
            className="px-4 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-[0.15em] transition-all duration-300"
            style={{
              background: isLogging ? "rgba(255,60,60,0.1)" : "rgba(200,255,0,0.1)",
              border: `1px solid ${isLogging ? "rgba(255,60,60,0.2)" : "rgba(200,255,0,0.2)"}`,
              color: isLogging ? "#ff3c3c" : "#C8FF00",
            }}
          >
            {isLogging ? "Pause" : "Resume"}
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════
       *  EXERCISE STEPPER
       * ════════════════════════════════════════════════════ */}
      <div className="pt-20 px-4 md:px-8">
        <ExerciseStepper
          exercises={exercises.map((e) => e.name)}
          activeIndex={activeIdx}
          onSelect={setActiveIdx}
        />
      </div>

      {/* ════════════════════════════════════════════════════
       *  MAIN CONTENT — 2 Column Layout
       * ════════════════════════════════════════════════════ */}
      <div className="px-4 md:px-8 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* ── LEFT COLUMN: Active Exercise Card ── */}
        <div className="lg:col-span-2 space-y-4">
          <div
            ref={cardRef}
            className="rounded-xl p-6"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Exercise header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C8FF00]/40 mb-1">
                  {activeExercise.muscleGroup}
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold font-space-grotesk tracking-tight">
                  {activeExercise.name}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-white/20">
                  {activeIdx + 1}/{exercises.length}
                </span>
              </div>
            </div>

            {/* ── Sets Table ── */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/20">
                    <th className="pb-3 text-left pl-3 w-14">Set</th>
                    <th className="pb-3 text-left">Weight (kg)</th>
                    <th className="pb-3 text-left">Reps</th>
                    <th className="pb-3 text-left">RIR</th>
                    <th className="pb-3 text-center w-24">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {activeExercise.sets.map((set, si) => (
                      <motion.tr
                        key={si}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: si * 0.05 }}
                        className={`border-t border-white/[0.03] ${
                          set.completed ? "opacity-50" : ""
                        }`}
                      >
                        {/* Set number */}
                        <td className="py-3 pl-3">
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold"
                            style={{
                              background: set.completed
                                ? "rgba(200,255,0,0.15)"
                                : "rgba(255,255,255,0.03)",
                              color: set.completed ? "#C8FF00" : "rgba(255,255,255,0.3)",
                              border: `1px solid ${
                                set.completed
                                  ? "rgba(200,255,0,0.25)"
                                  : "rgba(255,255,255,0.05)"
                              }`,
                            }}
                          >
                            {set.completed ? "✓" : si + 1}
                          </span>
                        </td>

                        {/* Weight input */}
                        <td className="py-3 pr-2">
                          <input
                            type="text"
                            value={set.weight}
                            onChange={(e) => updateSet(si, "weight", e.target.value)}
                            placeholder="—"
                            disabled={set.completed}
                            className="w-20 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-mono font-bold text-white placeholder-white/15 focus:border-[#C8FF00]/40 focus:outline-none transition-colors disabled:opacity-30"
                          />
                        </td>

                        {/* Reps input */}
                        <td className="py-3 pr-2">
                          <input
                            type="text"
                            value={set.reps}
                            onChange={(e) => updateSet(si, "reps", e.target.value)}
                            placeholder="—"
                            disabled={set.completed}
                            className="w-16 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-mono font-bold text-white placeholder-white/15 focus:border-[#C8FF00]/40 focus:outline-none transition-colors disabled:opacity-30"
                          />
                        </td>

                        {/* RIR input */}
                        <td className="py-3 pr-2">
                          <input
                            type="text"
                            value={set.rir}
                            onChange={(e) => updateSet(si, "rir", e.target.value)}
                            placeholder="—"
                            disabled={set.completed}
                            className="w-14 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-mono font-bold text-white placeholder-white/15 focus:border-[#C8FF00]/40 focus:outline-none transition-colors disabled:opacity-30"
                          />
                        </td>

                        {/* Complete button */}
                        <td className="py-3 text-center">
                          {!set.completed ? (
                            <button
                              onClick={() => completeSet(si)}
                              className="px-4 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-[0.1em] transition-all duration-300 hover:scale-105 active:scale-95"
                              style={{
                                background: "rgba(200,255,0,0.1)",
                                border: "1px solid rgba(200,255,0,0.2)",
                                color: "#C8FF00",
                              }}
                            >
                              Log
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-[#C8FF00]/40 tracking-widest uppercase">
                              Done
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.04]">
              <button
                onClick={goPrev}
                disabled={activeIdx === 0}
                className="px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all disabled:opacity-20"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                ← Previous
              </button>
              <button
                onClick={goNext}
                disabled={activeIdx === exercises.length - 1}
                className="px-5 py-2.5 rounded-lg text-[10px] font-extrabold uppercase tracking-[0.15em] transition-all hover:scale-105 disabled:opacity-20"
                style={{
                  background: "rgba(200,255,0,0.1)",
                  border: "1px solid rgba(200,255,0,0.2)",
                  color: "#C8FF00",
                }}
              >
                Next Exercise →
              </button>
            </div>
          </div>

          {/* ── Performance Tip Card ── */}
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-xl p-5"
            style={{
              background: "rgba(200,255,0,0.03)",
              border: "1px solid rgba(200,255,0,0.08)",
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">⚡</span>
              <div>
                <div className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C8FF00]/40 mb-1">
                  Performance Tip
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  {activeExercise.tip}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: 3D Telemetry ── */}
        <div className="space-y-4">
          <div
            className="rounded-xl overflow-hidden h-[340px]"
            style={{
              background: "rgba(255,255,255,0.01)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <TelemetryVisual
              activeExercise={activeExercise.name}
              isLogging={isLogging}
            />
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Volume", value: "—", unit: "kg" },
              { label: "Duration", value: formatTime(sessionSeconds), unit: "" },
              { label: "Rest Ratio", value: "—", unit: "%" },
              { label: "Intensity", value: "—", unit: "RPE" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="text-[8px] font-bold tracking-[0.3em] uppercase text-white/20 mb-1">
                  {stat.label}
                </div>
                <div className="text-lg font-bold font-mono">
                  {stat.value}
                  {stat.unit && (
                    <span className="text-[10px] text-white/20 ml-1">{stat.unit}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
       *  REST TIMER OVERLAY
       * ════════════════════════════════════════════════════ */}
      {showRest && (
        <RestTimer
          duration={activeExercise.restSeconds}
          onComplete={() => setShowRest(false)}
          onSkip={() => setShowRest(false)}
        />
      )}
    </div>
  );
}
