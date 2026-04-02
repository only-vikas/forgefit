"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/lib/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col h-full w-full p-6 text-white overflow-y-auto scrollbar-hide">
      
      {/* ── Brand / Logo ── */}
      <Link href="/" className="flex items-center gap-3 mb-16 group">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-black bg-[#C8FF00] shadow-[0_0_20px_rgba(200,255,0,0.3)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(200,255,0,0.5)]">
           F
        </div>
        <div>
          <div className="text-xl font-bold tracking-tight font-space-grotesk text-white leading-none">FORGEFIT</div>
          <div className="text-[8px] tracking-[0.3em] font-mono font-bold text-[#C8FF00] uppercase mt-1">OS V.1.0</div>
        </div>
      </Link>

      {/* ── Navigation Links ── */}
      <div className="flex-1 space-y-2">
        <div className="text-[10px] font-bold tracking-[0.3em] font-mono text-white/30 uppercase mb-4 pl-3">Modules</div>
        {NAVIGATION.map((item) => {
          const isActive = mounted && pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden group
                ${isActive ? "text-[#C8FF00] bg-[#C8FF00]/10 border border-[#C8FF00]/30" : "text-white/60 hover:text-white hover:bg-white/[0.05] border border-transparent"}`}
            >
              {/* Subtle active glow indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C8FF00] shadow-[0_0_10px_#C8FF00]" />
              )}
              
              <span className="relative z-10 uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* ── User Status / Footer ── */}
      <div className="mt-8 pt-8 border-t border-white/10">
         <div className="flex items-center gap-3 glass p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-colors">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-mono font-bold">A</div>
            <div className="flex-1">
               <div className="text-xs font-bold truncate">A. Sterling</div>
               <div className="text-[9px] font-mono text-[#C8FF00]">Elite Rank</div>
            </div>
         </div>
      </div>
    </div>
  );
}
