"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AchievementsGrid.tsx  –  Cinematic Fitness Badges & Leaderboards
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Implements a gamified achievements interface:
 *   • Scrollable category tabs
 *   • Grid of glowing/grayscale achievement badges
 *   • Leaderboard podium displaying top 3 active lifters
 *   • Scroll-triggered GSAP entrance animations with Stagger effects
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TABS = ["All", "Strength", "Consistency", "Volume", "Milestones"];

const ACHIEVEMENTS = [
  { id: 1, cat: "Strength", title: "Iron Core", desc: "Deadlift 200kg for a single", unlocked: true, date: "Oct 24", icon: "⚔️" },
  { id: 2, cat: "Consistency", title: "Relentless", desc: "Train 5 days/week for 4 weeks", unlocked: true, date: "Nov 02", icon: "🔥" },
  { id: 3, cat: "Volume", title: "Titan Load", desc: "Move 100,000kg in a single week", unlocked: false, progress: 85, icon: "🛡️" },
  { id: 4, cat: "Milestones", title: "Centurion", desc: "Log 100 workouts on ForgeFit", unlocked: false, progress: 42, icon: "💯" },
  { id: 5, cat: "Strength", title: "Gravity Defier", desc: "Squat 1.5x Bodyweight", unlocked: true, date: "Aug 15", icon: "🚀" },
  { id: 6, cat: "Volume", title: "Atlas Shoulder", desc: "Complete 1,000 reps of Overhead Press", unlocked: false, progress: 61, icon: "🌍" },
];

const LEADERBOARD = [
  { rank: 2, name: "K. Vance", pr: "210kg DL", score: 9240 },
  { rank: 1, name: "A. Sterling", pr: "245kg DL", score: 10450 },
  { rank: 3, name: "J. Matrix", pr: "195kg DL", score: 8890 },
];

export default function AchievementsGrid() {
  const [activeTab, setActiveTab] = useState("All");
  const containerRef = useRef<HTMLDivElement>(null);
  const podiumRef = useRef<HTMLDivElement>(null);

  const filtered = ACHIEVEMENTS.filter(a => activeTab === "All" || a.cat === activeTab);

  useEffect(() => {
    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
    
    ScrollTrigger.refresh();

    // Podium entrance
    if (podiumRef.current) {
      const pillars = podiumRef.current.querySelectorAll(".podium-pillar");
      gsap.fromTo(pillars, 
        { scaleY: 0, opacity: 0 },
        { 
          scaleY: 1, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.2, 
          ease: "elastic.out(1, 0.7)", 
          transformOrigin: "bottom",
          scrollTrigger: {
            trigger: podiumRef.current,
            start: "top 85%"
          }
        }
      );
    }
  }, [activeTab]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] text-white pt-24 pb-20 relative px-6 md:px-12">
      {/* ── Background Elements ── */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,255,160,0.05),transparent_50%)]" />
      <div 
        className="fixed inset-0 pointer-events-none z-[60] mix-blend-overlay opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* ── LEFT: Badges ── */}
        <div className="lg:col-span-8">
          <div className="mb-10">
             <div className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C8FF00]/60 mb-2">OPERATOR STATUS</div>
             <h1 className="text-4xl md:text-5xl font-extrabold font-space-grotesk tracking-tighter">TROPHY ROOM</h1>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 py-2">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${
                  activeTab === tab 
                  ? "bg-[#C8FF00]/10 border border-[#C8FF00]/40 text-[#C8FF00]" 
                  : "bg-white/[0.02] border border-white/5 text-white/40 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
               {filtered.map((badge, i) => (
                 <motion.div
                   key={badge.id}
                   layout
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ delay: i * 0.05 }}
                   className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex gap-4 \${badge.unlocked ? "border-[#C8FF00]/20 bg-[#C8FF00]/[0.02] hover:bg-[#C8FF00]/[0.04]" : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] grayscale opacity-60 hover:grayscale-0 hover:opacity-100"}`}
                 >
                   <div className="w-16 h-16 shrink-0 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-3xl shadow-inner relative">
                      {badge.unlocked && <div className="absolute inset-0 bg-[#C8FF00]/20 blur-xl rounded-full" />}
                      <span className="relative z-10">{badge.icon}</span>
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-space-grotesk font-bold ${badge.unlocked ? "text-[#C8FF00]" : "text-white"}`}>{badge.title}</h3>
                        {badge.unlocked ? (
                          <span className="text-[9px] font-mono tracking-widest text-[#C8FF00]/50 uppercase">{badge.date}</span>
                        ) : (
                          <span className="text-sm">🔒</span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 mb-3">{badge.desc}</p>
                      
                      {/* Progress Bar for Locked */}
                      {!badge.unlocked && (
                         <div className="w-full">
                           <div className="flex justify-between text-[8px] font-mono font-bold tracking-widest text-white/30 uppercase mb-1">
                             <span>Progress</span>
                             <span>{badge.progress}%</span>
                           </div>
                           <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-white/40 rounded-full" style={{ width: `${badge.progress}%` }} />
                           </div>
                         </div>
                      )}
                   </div>
                 </motion.div>
               ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT: Leaderboards ── */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="glass p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
             <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 mb-8 text-center flex items-center justify-center gap-2">
               <span className="w-2 h-2 rounded-full animate-pulse bg-red-500 shadow-[0_0_8px_red]" />
               Global Top 3 Vectors
             </h2>

             {/* Podium */}
             <div ref={podiumRef} className="flex justify-center items-end h-40 gap-2 mb-6 border-b border-white/10 pb-4">
                 {/* Rank 2 */}
                 <div className="podium-pillar flex flex-col items-center w-24">
                    <div className="text-[9px] font-mono tracking-widest uppercase text-white/50 mb-1">{LEADERBOARD[0].name}</div>
                    <div className="w-full h-20 bg-gradient-to-t from-white/10 to-transparent border border-white/20 rounded-t-lg relative flex justify-center">
                       <span className="absolute -top-3 text-lg opacity-80 shadow-2xl">🥈</span>
                       <span className="mt-4 text-3xl font-extrabold font-space-grotesk text-white/20">2</span>
                    </div>
                 </div>
                 {/* Rank 1 */}
                 <div className="podium-pillar flex flex-col items-center w-28">
                    <div className="text-[10px] font-bold font-mono tracking-widest uppercase text-[#C8FF00] mb-1">{LEADERBOARD[1].name}</div>
                    <div className="w-full h-28 bg-gradient-to-t from-[#C8FF00]/20 to-[#C8FF00]/5 border border-[#C8FF00]/40 rounded-t-lg relative flex justify-center">
                       <span className="absolute -top-4 text-2xl drop-shadow-[0_0_10px_#C8FF00]">👑</span>
                       <span className="mt-6 text-4xl font-extrabold font-space-grotesk text-[#C8FF00]/30">1</span>
                    </div>
                 </div>
                 {/* Rank 3 */}
                 <div className="podium-pillar flex flex-col items-center w-24">
                    <div className="text-[9px] font-mono tracking-widest uppercase text-white/50 mb-1">{LEADERBOARD[2].name}</div>
                    <div className="w-full h-16 bg-gradient-to-t from-orange-400/10 to-transparent border border-orange-400/20 rounded-t-lg relative flex justify-center">
                       <span className="absolute -top-3 text-lg opacity-80">🥉</span>
                       <span className="mt-3 text-2xl font-extrabold font-space-grotesk text-orange-400/20">3</span>
                    </div>
                 </div>
             </div>
             
             {/* Feed */}
             <div className="space-y-3">
               {LEADERBOARD.map((p, i) => (
                 <div key={p.name} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                   <div className="flex items-center gap-3">
                     <span className={`w-5 text-center font-mono font-bold text-xs ${i===1 ? 'text-[#C8FF00]' : 'text-white/40'}`}>
                       {p.rank}
                     </span>
                     <span className="text-xs font-bold font-mono">{p.name}</span>
                   </div>
                   <div className="text-right">
                     <div className="text-xs text-[#C8FF00] font-bold">{p.score}</div>
                     <div className="text-[8px] font-mono uppercase tracking-widest text-white/30">{p.pr}</div>
                   </div>
                 </div>
               ))}
             </div>

           </div>

        </div>
      </div>
    </div>
  );
}
