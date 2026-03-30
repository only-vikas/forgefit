"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * app/logger/page.tsx  –  Workout Logger Route
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Renders the full-screen immersive WorkoutLogger component.
 * Initialises Lenis for buttery scroll on this page.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import Lenis from "lenis";
import WorkoutLogger from "@/components/logger/WorkoutLogger";

export default function LoggerPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    /* Lenis smooth scroll for the logger page */
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

  if (!mounted) return null;

  return <WorkoutLogger />;
}
