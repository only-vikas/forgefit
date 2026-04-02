"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AICoach.tsx  –  Immersive AI Chat Interface
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Implements a visually cinematic chat agent featuring:
 *   • Neural engine orb animation
 *   • Real-time biometric syncing status
 *   • Scroll-triggered chat streams with framer motion
 *   • Cinematic purple/violet accents
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const SUGGESTIONS = [
  "How's my recovery today?",
  "Adjust protocol for lower back pain",
  "Is my volume too high?",
];

const INITIAL_MESSAGES = [
  { id: 1, sender: "ai", text: "Operator authenticated. Scanning biometric feeds..." },
  { id: 2, sender: "ai", text: "Your HRV is down 12% today. I suggest reducing total volume on your Push session by 15% to optimize recovery." },
];

export default function AICoach() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), sender: "user", text };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setTyping(true);

    // AI typing simulation
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, sender: "ai", text: "Protocol adjustment logged. I have re-calibrated your upcoming session variables." }
      ]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#080808] text-white pt-24 px-4 md:px-8 max-w-5xl mx-auto relative group">
      
      {/* ── Background & Orb ── */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_70%)]" />

      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10 border-b border-white/[0.05] pb-6">
        <div>
          <div className="text-[10px] font-bold tracking-[0.5em] uppercase text-violet-400 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_#8b5cf6]" />
            Neural Engine Active
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-space-grotesk tracking-tighter">
            SYNTHETIC INTELLIGENCE
          </h1>
        </div>
        
        <div className="text-right flex items-center md:items-end flex-col gap-2">
           <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">Biometric Sync</div>
           <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#C8FF00]">Locked · 0ms</span>
              <svg className="w-4 h-4 text-[#C8FF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           </div>
        </div>
      </header>

      {/* ── Chat Stream ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32 relative z-10 space-y-6">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex \${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[85%] md:max-w-[70%] p-5 rounded-2xl border \${
                  msg.sender === "user" 
                  ? "bg-white/[0.04] border-white/10 ml-auto rounded-tr-sm" 
                  : "bg-violet-500/[0.05] border-violet-500/20 rounded-tl-sm shadow-[0_0_15px_rgba(139,92,246,0.05)]"
                }`}
                style={{ backdropFilter: "blur(12px)" }}
              >
                {msg.sender === "ai" && (
                  <div className="text-[9px] font-bold text-violet-400 tracking-widest uppercase mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Forge AI
                  </div>
                )}
                <p className="text-sm md:text-base leading-relaxed text-white/80">
                  {msg.text}
                </p>
              </div>
            </motion.div>
          ))}
          
          {typing && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex justify-start"
            >
              <div className="max-w-[85%] p-5 rounded-2xl border bg-violet-500/[0.05] border-violet-500/20 rounded-tl-sm flex gap-1.5">
                 {[1,2,3].map(i => (
                   <motion.div 
                     key={i}
                     animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                     transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                     className="w-1.5 h-1.5 bg-violet-400 rounded-full"
                   />
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* ── Input & Suggestions Area ── */}
      <div className="fixed bottom-0 left-0 w-full p-4 md:px-8 z-20" style={{ background: "linear-gradient(to top, rgba(8,8,8,1) 60%, transparent)" }}>
         <div className="max-w-5xl mx-auto flex flex-col gap-4">
            
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white/[0.03] border border-white/10 text-white/50 hover:text-violet-300 hover:border-violet-500/40 hover:bg-violet-500/10"
                >
                  {sug}
                </button>
              ))}
            </div>

            <div className="relative">
              <input 
                 type="text"
                 value={inputValue}
                 onChange={e => setInputValue(e.target.value)}
                 onKeyDown={e => e.key === "Enter" && handleSend(inputValue)}
                 placeholder="Communicate with Neural Engine..."
                 className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-4 pl-6 pr-16 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all backdrop-blur-md"
              />
              <button 
                 onClick={() => handleSend(inputValue)}
                 className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center hover:bg-violet-500 hover:text-white transition-all shadow-[0_0_10px_rgba(139,92,246,0.3)]"
              >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>

         </div>
      </div>

    </div>
  );
}
