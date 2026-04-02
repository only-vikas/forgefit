"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/lib/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <nav className="w-full px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Mobile Logo & Menu Toggle */}
        <div className="md:hidden flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C8FF00] text-black font-bold flex items-center justify-center">F</div>
            <span className="font-space-grotesk font-bold">FORGEFIT</span>
          </Link>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Desktop Breadcrumb / Title Area */}
        <div className="hidden md:flex items-center gap-4">
           {mounted && (
             <div className="text-sm font-mono tracking-widest text-[#C8FF00] uppercase font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" />
                {NAVIGATION.find(n => n.href === pathname)?.label || "HQ"}
             </div>
           )}
        </div>

        {/* Global Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
           <button className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-white/50 hover:text-[#C8FF00] transition-colors relative">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C8FF00]" />
           </button>
           <Link href="/login" className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-[#C8FF00]/50 text-[#C8FF00] bg-[#C8FF00]/10 hover:bg-[#C8FF00] hover:text-black transition-all">
              Initialize
           </Link>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-2 shadow-2xl">
           {NAVIGATION.map((item) => {
             const isActive = mounted && pathname === item.href;
             return (
               <Link 
                 key={item.href} 
                 href={item.href}
                 onClick={() => setMobileMenuOpen(false)}
                 className={`p-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all \${isActive ? "text-black bg-[#C8FF00]" : "text-white/60 hover:bg-white/5"}`}
               >
                 {item.label}
               </Link>
             )
           })}
        </div>
      )}
    </>
  );
}
