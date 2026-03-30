"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PlannerCalendar.tsx  –  Premium Monthly Calendar Grid
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Full monthly calendar with:
 *   • Clickable day cells
 *   • Highlighted session days (accent color dot)
 *   • Today indicator
 *   • Month navigation (prev/next)
 *   • Glass panel aesthetic with noise overlay
 *
 * Props:
 *   selectedDay: number | null            – currently selected day
 *   onDaySelect: (day: number) => void    – callback when a day is clicked
 *   sessionDays: number[]                 – days that have scheduled sessions
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Props {
  selectedDay: number | null;
  onDaySelect: (day: number) => void;
  sessionDays: number[];
}

export default function PlannerCalendar({ selectedDay, onDaySelect, sessionDays }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  /* ── Build calendar grid ── */
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    /* Monday = 0 alignment (ISO) */
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const cells: (number | null)[] = [];

    /* Leading blanks */
    for (let i = 0; i < startDow; i++) cells.push(null);

    /* Day numbers */
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    /* Trailing blanks to fill last row */
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  }, [year, month]);

  const today = now.getDate();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  /* ── Navigation ── */
  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* ── Month navigator ── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/[0.04] transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-xl font-extrabold font-space-grotesk tracking-tight">
            {MONTH_NAMES[month]}
          </h2>
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mt-0.5">
            {year}
          </div>
        </div>

        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/[0.04] transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Weekday headers ── */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[9px] font-bold tracking-[0.3em] uppercase text-white/20 py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          if (day === null) {
            return <div key={`blank-${i}`} className="aspect-square" />;
          }

          const isToday = isCurrentMonth && day === today;
          const isSelected = day === selectedDay;
          const hasSession = sessionDays.includes(day);

          return (
            <motion.button
              key={day}
              onClick={() => onDaySelect(day)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center relative
                text-sm font-bold transition-all duration-200
                ${isSelected
                  ? "bg-[#C8FF00]/10 border border-[#C8FF00]/40 text-[#C8FF00]"
                  : isToday
                    ? "bg-white/[0.04] border border-white/10 text-white"
                    : "hover:bg-white/[0.03] border border-transparent text-white/40"
                }
              `}
            >
              <span className={`font-mono text-sm ${isSelected ? "font-extrabold" : ""}`}>
                {day}
              </span>

              {/* Session indicator dot */}
              {hasSession && (
                <span
                  className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full"
                  style={{
                    background: isSelected ? "#C8FF00" : "rgba(200,255,0,0.4)",
                    boxShadow: isSelected ? "0 0 6px #C8FF00" : "none",
                  }}
                />
              )}

              {/* Today ring */}
              {isToday && !isSelected && (
                <span className="absolute inset-0 rounded-xl border border-white/10" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C8FF00]/40" />
          <span className="text-[9px] font-bold tracking-widest uppercase text-white/20">
            Session Scheduled
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white/10 border border-white/20" />
          <span className="text-[9px] font-bold tracking-widest uppercase text-white/20">
            Today
          </span>
        </div>
      </div>
    </div>
  );
}
