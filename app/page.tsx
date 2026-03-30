"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * app/page.tsx  –  ForgeFit Phase 1 Main Page
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Layout sequence:
 *   1. BarbellSplash   — full-screen 3D splash (auto-dismiss / click to skip)
 *   2. Hero Section    — "FORGE YOUR LIMITS" + HeroAnatomicalBody (3D body)
 *   3. Stats Reel      — glassmorphism data cards
 *   4. CustomCursor    — global forge-hammer cursor
 *
 * Lenis handles smooth scrolling.
 * GSAP ScrollTrigger handles hero reveal animation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ── Components ── */
import CustomCursor from "@/components/ui/CustomCursor";
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
  const lenisRef = useRef<Lenis | null>(null);

  /* ── Splash complete handler ── */
  const onSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  /* ── Hydration guard ── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Lenis smooth scroll ── */
  useEffect(() => {
    if (!mounted || !splashDone) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    /* Sync Lenis with GSAP ScrollTrigger */
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [mounted, splashDone]);

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
    <div className="relative min-h-screen bg-[#080808]">
      {/* ════════════════════════════════════════════
       *  CUSTOM CURSOR (global)
       * ════════════════════════════════════════════ */}
      <CustomCursor />

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
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] mix-blend-overlay opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ════════════════════════════════════════════
       *  NAVBAR
       * ════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 w-full px-6 py-4 z-50 flex items-center justify-between border-b border-white/[0.04] backdrop-blur-xl"
        style={{
          background: "rgba(8,8,8,0.6)",
          opacity: splashDone ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #C8FF00 0%, #7aad00 100%)",
              boxShadow: "0 0 20px rgba(200,255,0,0.3)",
            }}
          >
            <span className="text-black text-sm font-extrabold">F</span>
          </div>
          <span className="text-lg font-bold tracking-tight font-space-grotesk text-white">
            FORGEFIT
          </span>
          <span className="text-[9px] ml-1 px-2 py-0.5 rounded-full border border-[#C8FF00]/20 text-[#C8FF00]/60 font-bold tracking-widest uppercase">
            OS
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold text-white/40 tracking-[0.25em] uppercase">
          <a href="#" className="hover:text-[#C8FF00] transition-colors duration-300">Protocol</a>
          <a href="#" className="hover:text-[#C8FF00] transition-colors duration-300">Archive</a>
          <a href="#" className="hover:text-[#C8FF00] transition-colors duration-300">Vault</a>
          <a href="#" className="hover:text-[#C8FF00] transition-colors duration-300">Neural</a>
        </div>

        <button
          className="px-5 py-2 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,255,0,0.3)]"
          style={{
            background: "rgba(200,255,0,0.08)",
            border: "1px solid rgba(200,255,0,0.2)",
            color: "#C8FF00",
          }}
        >
          Access
        </button>
      </nav>

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

            {/* CTA buttons */}
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
              <button
                className="px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-white/[0.06]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Operational Specs
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

            {/* Decorative glow behind the body */}
            <div
              className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-20"
              style={{
                background: "radial-gradient(circle, rgba(200,255,0,0.15) 0%, transparent 70%)",
              }}
            />
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
          {/* Section header */}
          <div className="mb-12">
            <div className="text-[10px] font-bold tracking-[0.5em] uppercase mb-3" style={{ color: "rgba(200,255,0,0.4)" }}>
              System Diagnostics
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-space-grotesk tracking-tight">
              Real-Time Telemetry
            </h2>
          </div>

          {/* Stat cards */}
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
                className="group relative p-6 rounded-xl transition-all duration-500 hover:border-[#C8FF00]/30"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(200,255,0,0.04) 0%, transparent 70%)",
                  }}
                />

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

      {/* ════════════════════════════════════════════
       *  SPACER (for scroll-driven body orbit)
       * ════════════════════════════════════════════ */}
      <div className="h-[50vh]" />
    </div>
  );
}
