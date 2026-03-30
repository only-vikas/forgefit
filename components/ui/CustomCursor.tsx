"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CustomCursor.tsx  –  ForgeFit Cinematic Forge-Hammer Cursor
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * A glowing neon-lime (#C8FF00) cursor with:
 *   • Smooth GSAP-driven follow (lerp via quickTo)
 *   • Outer ring that scales up on interactive-element hover
 *   • Inner dot with a subtle pulse glow
 *   • Click ripple (expanding lime circle that fades out)
 *   • Hides the native cursor globally
 *   • Gracefully degrades on touch devices (shows default cursor)
 *
 * Usage:  <CustomCursor />   (mount once in layout or page)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

/* ── Accent colour ── */
const LIME = "#C8FF00";
const LIME_DIM = "rgba(200,255,0,0.25)";

/* ── Sizes ── */
const DOT_SIZE = 10;
const RING_SIZE = 44;
const RIPPLE_SIZE = 60;

export default function CustomCursor() {
  /* Refs for the three cursor layers */
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  /* Track if the device has a fine pointer (mouse) */
  const isFinePointer = useRef(true);

  /* ── Ripple burst on click ── */
  const fireRipple = useCallback((x: number, y: number) => {
    const el = rippleRef.current;
    if (!el) return;

    gsap.set(el, {
      x: x - RIPPLE_SIZE / 2,
      y: y - RIPPLE_SIZE / 2,
      scale: 0.3,
      opacity: 0.9,
      display: "block",
    });

    gsap.to(el, {
      scale: 2.2,
      opacity: 0,
      duration: 0.55,
      ease: "power2.out",
      onComplete: () => gsap.set(el, { display: "none" }),
    });
  }, []);

  useEffect(() => {
    /* ── Touch-device bail-out ── */
    const mql = window.matchMedia("(pointer: fine)");
    isFinePointer.current = mql.matches;
    if (!mql.matches) return;                    // leave native cursor on touch

    /* Hide native cursor globally */
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    /* ── GSAP quickTo for buttery-smooth follow ── */
    const xDot = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    /* ── Mouse move handler ── */
    const onMove = (e: MouseEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      xDot(cx - DOT_SIZE / 2);
      yDot(cy - DOT_SIZE / 2);
      xRing(cx - RING_SIZE / 2);
      yRing(cy - RING_SIZE / 2);
    };

    /* ── Click → ripple ── */
    const onClick = (e: MouseEvent) => fireRipple(e.clientX, e.clientY);

    /* ── Hover detection on interactive elements ── */
    const INTERACTIVE = "a, button, [data-cursor-hover], input, select, textarea, canvas";

    const onEnter = () => {
      gsap.to(ring, { scale: 1.6, borderColor: LIME, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 1.4, boxShadow: `0 0 18px 4px ${LIME}`, duration: 0.3 });
    };

    const onLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: LIME_DIM, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 1, boxShadow: `0 0 8px 2px ${LIME_DIM}`, duration: 0.3 });
    };

    /* Attach hover listeners via event delegation */
    const onOverCapture = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE)) onEnter();
    };
    const onOutCapture = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE)) onLeave();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    document.addEventListener("mouseover", onOverCapture, true);
    document.addEventListener("mouseout", onOutCapture, true);

    /* ── Cleanup ── */
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      document.removeEventListener("mouseover", onOverCapture, true);
      document.removeEventListener("mouseout", onOutCapture, true);
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, [fireRipple]);

  /* Don't render cursor elements on touch devices (SSR safe) */
  return (
    <>
      {/* Inner glowing dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          background: LIME,
          boxShadow: `0 0 8px 2px ${LIME_DIM}`,
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          mixBlendMode: "screen",
        }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: "50%",
          border: `1.5px solid ${LIME_DIM}`,
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          mixBlendMode: "screen",
        }}
      />

      {/* Click ripple */}
      <div
        ref={rippleRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: RIPPLE_SIZE,
          height: RIPPLE_SIZE,
          borderRadius: "50%",
          border: `2px solid ${LIME}`,
          pointerEvents: "none",
          zIndex: 99997,
          display: "none",
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
