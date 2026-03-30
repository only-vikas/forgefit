"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Lenis from "lenis";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen">
      {/* ── Cinematic Overlay ── */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,183,255,0.1),transparent_50%)]" />
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8)_80%)]" />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 animate-pulse" />
          <span className="text-xl font-bold tracking-tight font-space-grotesk text-white">FORGEFIT</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-white/50 tracking-wider uppercase">
          <a href="#" className="hover:text-cyan-400 transition-colors">Protocol</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Archive</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Vault</a>
        </div>
        <button className="px-5 py-2.5 rounded-full border border-white/10 glass text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-all text-white">
          Access Mode
        </button>
      </nav>

      {/* ── Hero Section ── */}
      <main className="container mx-auto px-6 pt-64 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="max-w-4xl"
        >
          <div className="flex items-center gap-2 mb-6 text-cyan-400 text-xs font-bold tracking-[0.5em] uppercase animate-pulse">
             System Status: Optimized
          </div>
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter font-space-grotesk mb-8 leading-none">
             FORGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-white/20">YOUR</span> DESTINY.
          </h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-2xl leading-relaxed mb-12">
             Unlock elite-level athletic architecture through cinematic-grade data visualization and neuro-integrated training protocols.
          </p>
          <div className="flex items-center gap-6">
            <button className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-lg hover:scale-105 active:scale-95 transition-transform">
              Initiate Routine
            </button>
            <button className="px-8 py-4 border border-white/20 glass text-white font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white/5 transition-colors">
              Operational Specs
            </button>
          </div>
        </motion.div>

        {/* ── Stats Reel ── */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 pb-32">
          {[
            { label: "BPM Readiness", value: "112", status: "Optimal" },
            { label: "Sync Latency", value: "0ms", status: "Active" },
            { label: "Power Output", value: "85%", status: "High" },
            { label: "Neuro Link", value: "99.9%", status: "Locked" },
          ].map((stat, i) => (
             <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 1 }}
                className="p-6 glass rounded-xl group hover:border-cyan-400/50 transition-colors"
             >
                <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-3xl font-bold mb-2 font-space-grotesk">{stat.value}</div>
                <div className="text-cyan-400/50 text-[10px] font-bold uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{stat.status}</div>
             </motion.div>
          ))}
        </div>
      </main>

      {/* ── Dynamic Scanlines ── */}
      <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-20 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
}
