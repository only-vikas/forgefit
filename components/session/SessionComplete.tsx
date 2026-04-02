"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SessionComplete.tsx  –  Cinematic Post-Workout Celebration
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Implements a dynamic celebration screen:
 *   • Glowing "WORKOUT COMPLETE" headline
 *   • GSAP animated stat counters for Duration, Volume, Exercises, Sets
 *   • NEW PR badge with floating rocket
 *   • Share + Dashboard buttons
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function SessionComplete() {
  const statsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // GSAP Number counting interactions
    const ctx = gsap.context(() => {
      const counters = document.querySelectorAll('.stat-counter');
      counters.forEach(counter => {
         const target = parseInt(counter.getAttribute('data-target') || '0', 10);
         gsap.to(counter, {
           innerHTML: target,
           duration: 2.5,
           ease: "power4.out",
           snap: { innerHTML: 1 },
           onUpdate: function() {
              if (target > 500) {
                 counter.innerHTML = String(Math.floor(Number(counter.innerHTML))).replace(/(.)(?=(\d{3})+$)/g,'$1,');
              }
           }
         });
      });
      
      // Stagger stats fade-in
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)", delay: 0.3 }
        );
      }
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#080808] text-white relative overflow-hidden px-4">
       
       {/* ── Background Glow & Particles ── */}
       <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(200,255,0,0.1),transparent_60%)]" />
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-[#C8FF00]/10 blur-[150px] rounded-full pointer-events-none z-0 animate-pulse" />

       {/* Noise Overlay */}
       <div className="fixed inset-0 pointer-events-none z-[60] mix-blend-overlay opacity-[0.03]"
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }}
       />

       <motion.div 
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ type: "spring", stiffness: 100, damping: 20 }}
         className="relative z-10 text-center w-full max-w-3xl"
       >
          {/* Header */}
          <div className="mb-12">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8FF00]/10 border border-[#C8FF00]/20 text-[#C8FF00] text-[9px] font-bold tracking-[0.3em] uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-ping" />
                Protocol Terminated Successfully
             </div>
             <h1 className="text-5xl md:text-7xl font-extrabold font-space-grotesk tracking-tighter drop-shadow-[0_0_25px_rgba(200,255,0,0.3)]">
                WORKOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-[#C8FF00]">COMPLETE</span>
             </h1>
          </div>

          {/* NEW PR Badge */}
          <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.6 }}
             className="mx-auto w-fit mb-12 flex items-center gap-4 bg-gradient-to-r from-[#C8FF00]/10 to-transparent border border-[#C8FF00]/20 p-4 rounded-2xl glass"
          >
             <div className="text-3xl animate-bounce">🚀</div>
             <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-0.5">New Personal Record</div>
                <div className="text-xl font-bold font-space-grotesk text-[#C8FF00]">Bench Press · 130kg x 3</div>
             </div>
          </motion.div>

          {/* Stats Grid */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 text-left">
             {[
               { label: "Duration", target: "62", unit: "m" },
               { label: "Total Volume", target: "8450", unit: "kg" },
               { label: "Movements", target: "6", unit: "" },
               { label: "Sets Logged", target: "24", unit: "" }
             ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] glass hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
                  <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/40 mb-2">{stat.label}</div>
                  <div className="flex items-baseline gap-1">
                     <span className="stat-counter text-3xl font-extrabold font-mono text-white group-hover:text-[#C8FF00] transition-colors" data-target={stat.target}>0</span>
                     {stat.unit && <span className="text-sm font-mono text-white/30">{stat.unit}</span>}
                  </div>
                </div>
             ))}
          </div>

          {/* Action Buttons */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
             <a href="/progress" className="w-full sm:w-auto px-10 py-4 rounded-xl text-xs font-extrabold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-[#C8FF00] text-black shadow-[0_0_20px_rgba(200,255,0,0.2)] flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                View Dashboard
             </a>
             <button className="w-full sm:w-auto px-10 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] text-white flex items-center justify-center gap-2">
                <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share Report
             </button>
          </motion.div>

       </motion.div>
    </div>
  );
}
