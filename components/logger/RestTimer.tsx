"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * RestTimer.tsx  –  Circular Animated Rest Countdown Overlay
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Full-overlay circular countdown timer that slides up from the bottom.
 * Uses GSAP to animate a circular SVG arc showing remaining rest time.
 * The ring depletes smoothly over the rest duration.
 *
 * Props:
 *   duration: number          – rest duration in seconds
 *   onComplete: () => void    – fired when timer reaches 0
 *   onSkip: () => void        – fired when user taps Skip
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

/* ── SVG arc parameters ── */
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  duration: number;
  onComplete: () => void;
  onSkip: () => void;
}

export default function RestTimer({ duration, onComplete, onSkip }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const [remaining, setRemaining] = useState(duration);

  /* ── Format seconds → mm:ss ── */
  const format = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const circle = circleRef.current;
    if (!overlay || !circle) return;

    /* Slide-up entrance */
    gsap.fromTo(overlay, { y: "100%" }, { y: "0%", duration: 0.5, ease: "power3.out" });

    /* Circle depletion animation */
    gsap.set(circle, { strokeDasharray: CIRCUMFERENCE, strokeDashoffset: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        /* Slide-down exit */
        gsap.to(overlay, {
          y: "100%",
          duration: 0.4,
          ease: "power3.in",
          onComplete,
        });
      },
    });

    tl.to(circle, {
      strokeDashoffset: CIRCUMFERENCE,
      duration: duration,
      ease: "none",
    });

    /* Countdown interval */
    let count = duration;
    const interval = setInterval(() => {
      count--;
      if (count >= 0) setRemaining(count);
      if (count <= 0) clearInterval(interval);
    }, 1000);

    return () => {
      tl.kill();
      clearInterval(interval);
    };
  }, [duration, onComplete]);

  const handleSkip = () => {
    gsap.to(overlayRef.current, {
      y: "100%",
      duration: 0.3,
      ease: "power3.in",
      onComplete: onSkip,
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        background: "rgba(8,8,8,0.92)",
        backdropFilter: "blur(20px)",
        transform: "translateY(100%)",
      }}
    >
      {/* Label */}
      <div className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/30 mb-8">
        Rest Period
      </div>

      {/* Circular timer */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
          {/* Background ring */}
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="4"
          />
          {/* Depleting accent ring */}
          <circle
            ref={circleRef}
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="#C8FF00"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 8px rgba(200,255,0,0.4))" }}
          />
        </svg>

        {/* Time display */}
        <span
          ref={timeRef}
          className="text-5xl font-extrabold font-mono tracking-tight"
          style={{ color: "#C8FF00" }}
        >
          {format(remaining)}
        </span>
      </div>

      {/* Motivational micro-text */}
      <p className="mt-6 text-sm text-white/20 font-light max-w-xs text-center">
        Recover. Breathe. Your next set demands everything.
      </p>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="mt-10 px-8 py-3 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white/[0.06]"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        Skip Rest →
      </button>
    </div>
  );
}
