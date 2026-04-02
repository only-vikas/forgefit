"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ── Components ── */
import BarbellSplash from "@/components/three/BarbellSplash";
import HeroAnatomicalBody from "@/components/three/HeroAnatomicalBody";

/* Register GSAP plugins */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  /* ── State ── */
  const [mounted, setMounted] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* ── Refs ── */
  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  /* ── Splash complete handler ── */
  const onSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  /* ── Hydration guard ── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── GSAP ScrollTrigger for hero reveal + scroll progress ── */
  useEffect(() => {
    if (!mounted || !splashDone) return;

    /* Hero entrance animation */
    if (heroTextRef.current) {
      gsap.fromTo(
        heroTextRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }

    /* Track scroll progress for the anatomical body camera orbit */
    const trigger = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [mounted, splashDone]);

  /* ── SSR guard ── */
  if (!mounted) return null;

  return (
    <div className="relative min-h-screen">
      {/* ════════════════════════════════════════════
       *  BARBELL SPLASH (full-screen overlay)
       * ════════════════════════════════════════════ */}
      {!splashDone && <BarbellSplash onComplete={onSplashComplete} />}

      {/* ════════════════════════════════════════════
       *  CINEMATIC OVERLAYS
       * ════════════════════════════════════════════ */}
      {/* Radial glow from top */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_-10%,rgba(200,255,0,0.06),transparent_60%)]" />
      {/* Bottom vignette */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_40%,rgba(8,8,8,0.95))]" />

      {/* ════════════════════════════════════════════
       *  HERO SECTION
       * ════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-screen flex items-center"
        style={{
          opacity: splashDone ? 1 : 0,
          transition: "opacity 1s ease 0.2s",
        }}
      >
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 lg:pt-0">
          {/* ── Left: Hero Text ── */}
          <div ref={heroTextRef} className="max-w-2xl">
            {/* Status indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#C8FF00", boxShadow: "0 0 8px #C8FF00" }}
              />
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase" style={{ color: "rgba(200,255,0,0.6)" }}>
                System Status: Optimized
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter font-space-grotesk mb-6 leading-[0.9]">
              FORGE{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #C8FF00 0%, #ffffff 50%, rgba(255,255,255,0.2) 100%)",
                }}
              >
                YOUR
              </span>
              <br />
              LIMITS.
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-white/35 max-w-lg leading-relaxed mb-10 font-light">
              Unlock elite-level athletic architecture through cinematic-grade
              data visualization and neuro-integrated training protocols.
            </p>

            {/* CTA buttons (now updated to use Link in future if needed, but keeping for UX) */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                className="group px-8 py-4 rounded-lg text-sm font-extrabold uppercase tracking-[0.15em] transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: "#C8FF00",
                  color: "#080808",
                  boxShadow: "0 0 30px rgba(200,255,0,0.2)",
                }}
              >
                <span className="flex items-center gap-2">
                  Initiate Protocol
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Micro stats row */}
            <div className="mt-14 flex items-center gap-8">
              {[
                { val: "2.4K", label: "Active Operators" },
                { val: "99.9%", label: "Uptime" },
                { val: "< 1ms", label: "Latency" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-lg font-bold font-space-grotesk" style={{ color: "#C8FF00" }}>
                    {s.val}
                  </div>
                  <div className="text-[9px] text-white/25 tracking-widest uppercase font-bold">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: 3D Anatomical Body ── */}
          <div className="relative h-[600px] lg:h-[700px]">
            <HeroAnatomicalBody scrollProgress={scrollProgress} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
       *  STATS REEL
       * ════════════════════════════════════════════ */}
      <section
        className="relative z-10 py-24"
        style={{
          opacity: splashDone ? 1 : 0,
          transition: "opacity 1s ease 0.6s",
        }}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "BPM Readiness", value: "112", status: "Optimal", icon: "♥" },
              { label: "Sync Latency", value: "0ms", status: "Active", icon: "⚡" },
              { label: "Power Output", value: "85%", status: "High", icon: "🔥" },
              { label: "Neuro Link", value: "99.9%", status: "Locked", icon: "🧠" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-6 rounded-xl transition-all duration-500 hover:border-[#C8FF00]/30 glass"
              >
                <div className="text-lg mb-3 opacity-40 group-hover:opacity-80 transition-opacity">
                  {stat.icon}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1">
                  {stat.label}
                </div>
                <div className="text-3xl md:text-4xl font-bold font-space-grotesk mb-2">
                  {stat.value}
                </div>
                <div
                  className="text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-[#C8FF00]"
                  style={{ color: "rgba(200,255,0,0.35)" }}
                >
                  {stat.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-[20vh]" />
    </div>
  );
}
