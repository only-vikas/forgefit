"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SessionDrawer.tsx  –  Sliding Glass Side Drawer with Session Details
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * A sliding glass drawer that opens from the right when a day with a
 * scheduled session is selected. Contains:
 *   • Session metadata (day, type, duration estimate)
 *   • Movement stack (exercises with sets/reps)
 *   • AI suggestion panel with tips
 *   • INITIATE button to launch the session
 *
 * Props:
 *   isOpen: boolean
 *   onClose: () => void
 *   dayNumber: number | null
 *   session: SessionData | null
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

/* ── Data types ── */
export interface MovementItem {
  name: string;
  sets: number;
  reps: string;
  muscleGroup: string;
}

export interface SessionData {
  title: string;
  type: string;
  estimatedMinutes: number;
  movements: MovementItem[];
  aiSuggestions: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number | null;
  session: SessionData | null;
}

export default function SessionDrawer({ isOpen, onClose, dayNumber, session }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);

  /* ── GSAP stagger on movement items ── */
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;
    const items = drawerRef.current.querySelectorAll("[data-movement]");
    if (items.length === 0) return;

    gsap.fromTo(
      items,
      { opacity: 0, x: 20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.3,
      }
    );
  }, [isOpen, session]);

  return (
    <AnimatePresence>
      {isOpen && session && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[101] w-full max-w-md overflow-y-auto"
            style={{
              background: "rgba(12,12,12,0.95)",
              backdropFilter: "blur(24px)",
              borderLeft: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="p-6">
              {/* ── Close button ── */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C8FF00]/40 mb-1">
                    Day {dayNumber} · Scheduled
                  </div>
                  <h2 className="text-xl font-extrabold font-space-grotesk tracking-tight">
                    {session.title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/[0.04] transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* ── Session metadata ── */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { label: "Type", value: session.type },
                  { label: "Duration", value: `~${session.estimatedMinutes}m` },
                  { label: "Movements", value: String(session.movements.length) },
                ].map((meta, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl text-center"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div className="text-[8px] font-bold tracking-[0.3em] uppercase text-white/20 mb-1">
                      {meta.label}
                    </div>
                    <div className="text-sm font-bold font-mono">{meta.value}</div>
                  </div>
                ))}
              </div>

              {/* ── Movement Stack ── */}
              <div className="mb-8">
                <div className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/25 mb-4">
                  Movement Stack
                </div>

                <div className="space-y-2">
                  {session.movements.map((mov, i) => (
                    <div
                      key={i}
                      data-movement
                      className="group p-4 rounded-xl flex items-center justify-between transition-all duration-300 hover:border-[#C8FF00]/20"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Index */}
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold"
                          style={{
                            background: "rgba(200,255,0,0.06)",
                            border: "1px solid rgba(200,255,0,0.12)",
                            color: "rgba(200,255,0,0.5)",
                          }}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <div className="text-sm font-bold">{mov.name}</div>
                          <div className="text-[9px] text-white/25 tracking-widest uppercase font-bold">
                            {mov.muscleGroup}
                          </div>
                        </div>
                      </div>

                      {/* Sets x Reps */}
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono">
                          {mov.sets} × {mov.reps}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── AI Suggestion Panel ── */}
              <div
                className="rounded-xl p-5 mb-8"
                style={{
                  background: "rgba(200,255,0,0.03)",
                  border: "1px solid rgba(200,255,0,0.08)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🧠</span>
                  <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C8FF00]/40">
                    AI Coach Insights
                  </span>
                </div>
                <ul className="space-y-2">
                  {session.aiSuggestions.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#C8FF00]/30 mt-2 shrink-0" />
                      <span className="text-sm text-white/40 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── INITIATE Button ── */}
              <a
                href="/logger"
                className="group w-full block text-center px-8 py-4 rounded-xl text-sm font-extrabold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "#C8FF00",
                  color: "#080808",
                  boxShadow: "0 0 30px rgba(200,255,0,0.2)",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Initiate Session
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>

              {/* ── Spacer for bottom scroll ── */}
              <div className="h-8" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
