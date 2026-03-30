"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ProgressDashboard.tsx  –  Cinematic Data Visualization
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Implements an immersive progress tracking dashboard:
 *   • Hero volume stat with animated counter
 *   • Strength Progression GSAP SVG line chart
 *   • 7x7 Frequency heatmap
 *   • Personal Records glass table
 *   • Scroll-triggered entrance animations
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ProgressDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero Volume counter animation
      if (volumeRef.current) {
        gsap.to(volumeRef.current, {
          innerHTML: 286400,
          duration: 3,
          ease: "power3.out",
          snap: { innerHTML: 1 },
          onUpdate: function() {
            if (volumeRef.current) {
              volumeRef.current.innerHTML = String(Math.floor(Number(volumeRef.current.innerHTML))).replace(/(.)(?=(\d{3})+$)/g,'$1,');
            }
          }
        });
      }

      // Stagger stats entrance
      gsap.fromTo(".stat-card",
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "back.out(1.2)",
          scrollTrigger: ".stat-card"
        }
      );

      // SVG Line Chart Drawing Effect
      if (chartRef.current) {
        const lines = chartRef.current.querySelectorAll("path.chart-line");
        gsap.fromTo(lines, 
          { strokeDasharray: 2000, strokeDashoffset: 2000 },
          { 
            strokeDashoffset: 0, 
            duration: 2.5, 
            ease: "power2.inOut",
            stagger: 0.3,
            scrollTrigger: {
               trigger: chartRef.current,
               start: "top 80%"
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 📝 Helpers for Demo Data
  const PRs = [
    { lift: "Deadlift", exact: "210 kg", date: "Oct 24", badge: "Elite" },
    { lift: "Squat", exact: "185 kg", date: "Nov 02", badge: "Advanced" },
    { lift: "Bench Press", exact: "130 kg", date: "Sep 15", badge: "Advanced" },
    { lift: "Overhead Press", exact: "85 kg", date: "Nov 12", badge: "Intermediate" },
  ];

  const heatmap = Array.from({ length: 49 }, () => Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] text-white pt-24 pb-20 relative px-6 md:px-12">
      <div 
        className="fixed inset-0 pointer-events-none z-[60] mix-blend-overlay opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#C8FF00]/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ── Header ── */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C8FF00]/60 mb-2">NEURAL ANALYTICS</div>
            <h1 className="text-4xl md:text-6xl font-extrabold font-space-grotesk tracking-tighter">DATA TELEMETRY</h1>
          </div>
          <div className="text-right">
             <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">Total Kinetic Output</div>
             <div className="flex items-baseline gap-2 justify-end">
                <span ref={volumeRef} className="text-4xl md:text-5xl font-mono font-bold text-[#C8FF00]">0</span>
                <span className="text-white/40 font-mono">KG</span>
             </div>
             <div className="text-[#C8FF00] text-sm font-bold flex items-center justify-end gap-1 mt-1">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
               +23.4% v.s. Last Cycle
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* ── Primary Line Chart ── */}
          <div className="stat-card lg:col-span-2 glass rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-space-grotesk font-bold">Strength Vector Progression</h2>
              <div className="flex gap-4 text-[10px] font-mono tracking-widest uppercase">
                 <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#C8FF00]" /> Deadlift</div>
                 <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-violet-500" /> Squat</div>
                 <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Bench</div>
              </div>
            </div>
            <div className="w-full h-64 relative">
               <svg ref={chartRef} className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                  {/* Grid */}
                  <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="0" y1="250" x2="800" y2="250" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  
                  {/* Bench Press (Cyan) */}
                  <path className="chart-line" d="M0 250 Q100 240, 200 230 T400 210 T600 180 T800 160" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
                  {/* Squat (Violet) */}
                  <path className="chart-line" d="M0 200 Q150 180, 250 150 T450 120 T650 90 T800 60" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
                  {/* Deadlift (Lime) */}
                  <path className="chart-line" d="M0 160 Q200 140, 300 100 T550 50 T700 30 T800 10" fill="none" stroke="#C8FF00" strokeWidth="5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 10px rgba(200,255,0,0.5))' }} />
               </svg>
            </div>
          </div>

          {/* ── Heatmap ── */}
          <div className="stat-card glass rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
            <h2 className="text-lg font-space-grotesk font-bold mb-4">Frequency Matrix</h2>
            <div className="grid grid-cols-7 gap-1 h-56 content-start">
               {heatmap.map((val, i) => (
                 <div 
                   key={i} 
                   className="aspect-square rounded-[4px] transition-all hover:scale-110"
                   style={{
                     background: val === 0 ? "rgba(255,255,255,0.02)" 
                               : val === 1 ? "rgba(200,255,0,0.2)"
                               : val === 2 ? "rgba(200,255,0,0.4)"
                               : val === 3 ? "rgba(200,255,0,0.7)"
                               : "#C8FF00",
                     boxShadow: val > 2 ? "0 0 10px rgba(200,255,0,0.3)" : "none"
                   }}
                 />
               ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/40 uppercase">
              <span>Rest</span>
              <div className="flex gap-1">
                 <div className="w-3 h-3 rounded-[2px]" style={{ background: "rgba(255,255,255,0.02)" }} />
                 <div className="w-3 h-3 rounded-[2px]" style={{ background: "rgba(200,255,0,0.2)" }} />
                 <div className="w-3 h-3 rounded-[2px]" style={{ background: "rgba(200,255,0,0.4)" }} />
                 <div className="w-3 h-3 rounded-[2px]" style={{ background: "rgba(200,255,0,0.7)" }} />
                 <div className="w-3 h-3 rounded-[2px]" style={{ background: "#C8FF00" }} />
              </div>
              <span>Max</span>
            </div>
          </div>
        </div>

        {/* ── Lower Row: Metrics & PRs ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="stat-card glass rounded-2xl p-6 border border-white/5 bg-white/[0.02] flex flex-col justify-center">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-16 h-16 rounded-full border border-[#C8FF00]/40 flex items-center justify-center relative">
                 <div className="absolute inset-0 border-2 border-[#C8FF00] rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                 <span className="font-mono text-sm font-bold text-[#C8FF00]">12.4%</span>
               </div>
               <div>
                  <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 mb-1">Body Composition</div>
                  <div className="text-xl font-space-grotesk font-bold">Estimated Bodyfat</div>
               </div>
             </div>
             
             <div className="space-y-4">
                {[{ label: "Muscle Mass", val: "78.2kg", pct: 85 }, { label: "Fat Mass", val: "11.1kg", pct: 15 }, { label: "Water", val: "62%", pct: 62 }].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-bold font-mono uppercase tracking-widest mb-2">
                      <span className="text-white/60">{m.label}</span>
                      <span className="text-white">{m.val}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-white/80"
                         initial={{ width: 0 }}
                         whileInView={{ width: `${m.pct}%` }}
                         viewport={{ once: true }}
                         transition={{ duration: 1.5, ease: "easeOut" }}
                       />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="stat-card glass rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
            <h2 className="text-lg font-space-grotesk font-bold mb-6">Personal Records Archives</h2>
            <div className="space-y-3">
              {PRs.map((pr, i) => (
                <motion.div 
                  key={pr.lift}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex items-center justify-between p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-[#C8FF00]/30 transition-all cursor-crosshair"
                >
                  <div>
                    <div className="text-sm font-bold">{pr.lift}</div>
                    <div className="text-[9px] font-mono tracking-widest text-[#C8FF00]/60 uppercase">{pr.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-lg text-white group-hover:text-[#C8FF00] transition-colors">{pr.exact}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/30">{pr.badge}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
