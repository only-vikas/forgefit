"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * app/progress/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import Lenis from "lenis";
import ProgressDashboard from "@/components/progress/ProgressDashboard";
import CustomCursor from "@/components/ui/CustomCursor";

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CustomCursor />
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex items-center justify-between backdrop-blur-md bg-[#080808]/60 border-b border-white/5">
        <a href="/" className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C8FF00] to-green-600 shadow-[0_0_15px_rgba(200,255,0,0.3)] flex items-center justify-center font-bold text-black" >F</div>
           <span className="text-xl font-bold tracking-tight font-space-grotesk text-white">FORGEFIT</span>
        </a>
      </nav>
      <ProgressDashboard />
    </>
  );
}
