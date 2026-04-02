"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * app/login/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import Lenis from "lenis";
import LoginPage from "@/components/auth/LoginPage";
import CustomCursor from "@/components/ui/CustomCursor";

export default function AuthPage() {
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
      <LoginPage />
    </>
  );
}
