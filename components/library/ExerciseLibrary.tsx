"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ExerciseLibrary.tsx  –  Cinematic Exercise Library
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Implements a visually rich exercise database:
 *   • Search bar with voice search icon
 *   • Horizontal scrolling filter chips
 *   • Responsive grid of 3D-style exercise cards
 *   • Flip animation (front: visual, back: data sheet)
 *   • Scroll-triggered GSAP entrance animations
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FILTERS = ["All", "Chest", "Back", "Legs", "Shoulders", "Barbell", "Dumbbell", "Machine", "Beginner", "Elite"];

const EXERCISES = [
  { id: 1, name: "Barbell Bench Press", target: "Chest", equip: "Barbell", level: "Intermediate", recVol: "3-5 sets x 5-8 reps" },
  { id: 2, name: "Deadlift", target: "Back", equip: "Barbell", level: "Elite", recVol: "3-5 sets x 3-5 reps" },
  { id: 3, name: "Hack Squat", target: "Legs", equip: "Machine", level: "Beginner", recVol: "3-4 sets x 10-15 reps" },
  { id: 4, name: "Overhead Press", target: "Shoulders", equip: "Barbell", level: "Intermediate", recVol: "3-4 sets x 6-10 reps" },
  { id: 5, name: "Incline DB Press", target: "Chest", equip: "Dumbbell", level: "Intermediate", recVol: "3-4 sets x 8-12 reps" },
  { id: 6, name: "Lat Pulldown", target: "Back", equip: "Machine", level: "Beginner", recVol: "3-4 sets x 10-15 reps" },
];

export default function ExerciseLibrary() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredExercises = EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || ex.target === activeFilter || ex.equip === activeFilter || ex.level === activeFilter;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (!gridRef.current) return;
    
    // Refresh ScrollTrigger after DOM updates
    ScrollTrigger.refresh();

    const cards = gridRef.current.querySelectorAll('.library-card');
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { y: 50, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.05, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          }
        }
      );
    }
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-20 relative px-6 md:px-12">
      {/* ── Background Elements ── */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(110,0,255,0.08),transparent_50%)]" />
      <div 
        className="fixed inset-0 pointer-events-none z-[60] mix-blend-overlay opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ── Headline ── */}
        <div className="mb-12">
          <div className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C8FF00]/60 mb-2">
            DATABASE ACCESS
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-space-grotesk tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-[#C8FF00]">ULTRAVIOLET</span> LIBRARY
          </h1>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 w-full relative z-20">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Query movement protocol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-12 pr-12 text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#C8FF00]/50 transition-colors"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C8FF00]/70 hover:text-[#C8FF00] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          {/* Chips */}
          <div className="flex-1 overflow-x-auto scrollbar-hide py-1">
            <div className="flex items-center gap-2 min-w-max">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                    activeFilter === f 
                    ? "bg-[#C8FF00]/10 border border-[#C8FF00]/40 text-[#C8FF00]" 
                    : "bg-white/[0.02] border border-white/[0.05] text-white/40 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          <AnimatePresence>
            {filteredExercises.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: any }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="library-card relative w-full h-80 perspective-1000 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden glass p-6 flex flex-col justify-end border border-white/[0.05]"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {/* 3D placeholder visual */}
          <div className="absolute inset-0 top-0 h-48 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-32 h-32 rounded-full border border-[#C8FF00]/20 flex items-center justify-center rotate-45">
              <div className="w-16 h-16 border border-violet-500/30 rotate-45" />
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex gap-2 mb-3">
              <span className="px-2 py-1 rounded bg-[#C8FF00]/10 text-[#C8FF00] text-[9px] font-bold tracking-widest uppercase">
                {exercise.target}
              </span>
              <span className="px-2 py-1 rounded bg-white/[0.05] text-white/50 text-[9px] font-bold tracking-widest uppercase">
                {exercise.equip}
              </span>
            </div>
            <h3 className="text-2xl font-bold font-space-grotesk">{exercise.name}</h3>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl p-6 border border-[#C8FF00]/20 flex flex-col justify-between"
          style={{ 
            background: "rgba(200,255,0,0.02)",
            transform: "rotateY(180deg)",
            backdropFilter: "blur(12px)"
          }}
        >
          <div>
            <h3 className="text-xl font-bold font-space-grotesk text-[#C8FF00] mb-4">{exercise.name}</h3>
            <div className="space-y-4">
              <div>
                <div className="text-[9px] tracking-[0.2em] font-bold uppercase text-white/30">Level</div>
                <div className="font-mono text-sm">{exercise.level}</div>
              </div>
              <div>
                <div className="text-[9px] tracking-[0.2em] font-bold uppercase text-white/30">Rec Volume</div>
                <div className="font-mono text-sm">{exercise.recVol}</div>
              </div>
            </div>
          </div>

          <button className="w-full py-3 mt-4 rounded-lg bg-[#C8FF00] text-black font-extrabold text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform">
            + Add to Protocol
          </button>
        </div>
      </motion.div>
    </div>
  );
}
