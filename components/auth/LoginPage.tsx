"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LoginPage.tsx  –  Atmospheric Split-layout Authentication
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Implements a high-end cinematic login portal:
 *   • Split layout structure
 *   • Left: Atmospheric backdrop with quote
 *   • Right: Glassmorphic form inputs + terminal options
 *   • Subtle scanline / glitch CSS overlays
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Proceed to auth flow
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#080808] text-white relative overflow-hidden">
       {/* ── Scanlines Overlay ── */}
       <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />

       {/* ── Left Atmospheric Panel ── */}
       <div className="hidden md:flex w-1/2 relative bg-black items-end p-16 overflow-hidden">
          {/* Backdrop Image / Gradient */}
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,255,0,0.1),transparent_70%)] opacity-50 z-0" />
             <img src="/placeholder-gym-dark.jpg" className="object-cover w-full h-full opacity-30 mix-blend-luminosity grayscale" alt="" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-20 max-w-sm"
          >
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8FF00] to-green-600 shadow-[0_0_30px_rgba(200,255,0,0.4)] flex items-center justify-center font-bold text-black text-2xl mb-8">F</div>
             <p className="text-3xl font-extrabold font-space-grotesk leading-tight text-white mb-4">
               “THE ONLY BAD WORKOUT IS THE ONE THAT DIDN’T HAPPEN.”
             </p>
             <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C8FF00]/50">
               ForgeFit Operator Network
             </div>
          </motion.div>
       </div>

       {/* ── Right Login Panel ── */}
       <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md p-8 md:p-12 rounded-3xl glass border border-white/5 bg-white/[0.01]"
          >
             <div className="md:hidden flex items-center gap-3 mb-8">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C8FF00] to-green-600 shadow-[0_0_20px_rgba(200,255,0,0.3)] flex items-center justify-center font-bold text-black" >F</div>
               <span className="text-xl font-bold tracking-tight font-space-grotesk text-white">FORGEFIT</span>
             </div>

             <div className="mb-10 text-center">
                <h2 className="text-3xl font-extrabold font-space-grotesk mb-2">ACCESS TERMINAL</h2>
                <p className="text-sm text-white/40">Authenticate to initialize operating system.</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest uppercase text-white/30 mb-2">Operator Identity</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="Enter email address"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/50 transition-all font-bold"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 mt-6 rounded-xl bg-[#C8FF00] text-black font-extrabold text-[11px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(200,255,0,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  Forge Ahead
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
             </form>

             <div className="mt-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/5" />
                <div className="text-[9px] font-bold tracking-widest text-white/20 uppercase">Or Protocol via</div>
                <div className="flex-1 h-px bg-white/5" />
             </div>

             <div className="mt-8 space-y-3">
                <button className="w-full p-4 rounded-xl border border-white/10 bg-white/[0.02] text-sm font-bold flex items-center justify-center gap-3 hover:bg-white/[0.05] transition-colors">
                  <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                  Google Network
                </button>
             </div>
          </motion.div>
       </div>

    </div>
  );
}
