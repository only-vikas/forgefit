"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LoadingScreen.tsx  –  Cinematic Route Loader
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Implements a global cinematic loader for slow network routes or initial load.
 * Features a spinning glowing orb / forge effect.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-[#080808] flex items-center justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center">
              {/* Spinning Orbital Glow */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-24 h-24 rounded-full border-t border-b border-[#C8FF00] opacity-30 shadow-[0_0_30px_#C8FF00]"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-l border-r border-[#C8FF00] opacity-50"
              />
              {/* Center Box */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#C8FF00] rounded shadow-[0_0_20px_#C8FF00] flex items-center justify-center">
                  <span className="text-black font-extrabold text-lg">F</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
               <motion.span 
                 animate={{ opacity: [1, 0.4, 1] }} 
                 transition={{ duration: 1.5, repeat: Infinity }}
                 className="text-[10px] font-mono tracking-widest text-[#C8FF00] uppercase"
               >
                 Initializing Forge OS
               </motion.span>
               <span className="flex items-end gap-0.5 ml-1">
                 {[1,2,3].map(i => (
                    <motion.div 
                      key={i} 
                      animate={{ y: [0, -3, 0] }} 
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1 h-1 bg-[#C8FF00] rounded-full" 
                    />
                 ))}
               </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
