"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * app/session-complete/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import Lenis from "lenis";
import SessionComplete from "@/components/session/SessionComplete";
import CustomCursor from "@/components/ui/CustomCursor";

export default function SessionCompletePage() {
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
      <SessionComplete />
    </>
  );
}
