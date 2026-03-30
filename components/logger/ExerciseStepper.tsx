"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ExerciseStepper.tsx  –  Horizontal exercise stepper with active highlight
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Renders a horizontal stepper bar showing the workout exercise sequence.
 * The currently active exercise is highlighted with #C8FF00 accent and
 * a subtle glow pulse. Completed exercises show a check. Future exercises
 * are dimmed.
 *
 * Props:
 *   exercises: string[]         – list of exercise names
 *   activeIndex: number         – currently active exercise index
 *   onSelect: (i: number) => void – callback when user clicks a step
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface Props {
  exercises: string[];
  activeIndex: number;
  onSelect: (i: number) => void;
}

export default function ExerciseStepper({ exercises, activeIndex, onSelect }: Props) {
  const activeRef = useRef<HTMLButtonElement>(null);

  /* ── Pulse animation on active step ── */
  useEffect(() => {
    if (!activeRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        activeRef.current,
        { boxShadow: "0 0 0px rgba(200,255,0,0)" },
        {
          boxShadow: "0 0 20px rgba(200,255,0,0.35)",
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      );
    });
    return () => ctx.revert();
  }, [activeIndex]);

  return (
    <div className="w-full overflow-x-auto py-4 scrollbar-hide">
      <div className="flex items-center gap-2 min-w-max px-1">
        {exercises.map((name, i) => {
          const isActive = i === activeIndex;
          const isComplete = i < activeIndex;

          return (
            <div key={i} className="flex items-center">
              {/* Step button */}
              <button
                ref={isActive ? activeRef : undefined}
                onClick={() => onSelect(i)}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5 rounded-lg
                  text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300
                  ${isActive
                    ? "bg-[#C8FF00]/10 border border-[#C8FF00]/40 text-[#C8FF00]"
                    : isComplete
                      ? "bg-white/[0.03] border border-white/[0.06] text-white/50"
                      : "bg-white/[0.02] border border-white/[0.04] text-white/25"
                  }
                `}
              >
                {/* Step number / check */}
                <span
                  className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold
                    ${isActive
                      ? "bg-[#C8FF00] text-[#080808]"
                      : isComplete
                        ? "bg-white/10 text-[#C8FF00]"
                        : "bg-white/[0.04] text-white/30"
                    }
                  `}
                >
                  {isComplete ? "✓" : i + 1}
                </span>

                {/* Exercise name */}
                <span className="whitespace-nowrap">{name}</span>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
                )}
              </button>

              {/* Connector line */}
              {i < exercises.length - 1 && (
                <div
                  className={`w-6 h-px mx-1 ${
                    i < activeIndex ? "bg-[#C8FF00]/30" : "bg-white/[0.06]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
