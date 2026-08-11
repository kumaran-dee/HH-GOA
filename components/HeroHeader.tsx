"use client";

import { motion } from "framer-motion";
import { Camera, Zap, ShieldCheck } from "lucide-react";

export default function HeroHeader() {
  return (
    <div className="relative text-center max-w-4xl mx-auto space-y-4 pt-4 pb-2">
      {/* Top Event Tag Pill */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#054726] border border-[#FFDE00] text-xs sm:text-sm font-extrabold shadow-xl text-[#FFDE00]"
      >
        <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF007F] animate-ping" />
        <span>HACKER HOUSE GOA 2026</span>
        <span className="text-slate-400">•</span>
        <span className="text-white">28 - 31 OCT 2026</span>
      </motion.div>

      {/* Main Headline with Hot Pink Devanagari Accent Badge */}
      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight flex flex-col items-center justify-center gap-2"
      >
        <span className="text-[#FFDE00] font-serif tracking-wider">HACKER HOUSE</span>
        <div className="inline-flex items-center gap-3">
          <span className="px-4 py-1 rounded-2xl bg-[#FF007F] text-white font-extrabold text-2xl sm:text-3xl border-2 border-white shadow-lg">
            गोवा
          </span>
          <span className="text-white">Social Badges</span>
        </div>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
      >
        Upload your photo to instantly create your branded <strong className="text-[#FFDE00]">PFP Frame</strong> or official <strong className="text-white">Builder Pass Badge</strong>. Download in high-res & share on X with <span className="text-[#FF007F] font-black">#FrameInGoa</span>.
      </motion.p>

      {/* Highlights Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-emerald-200"
      >
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#054726]/80 border border-[#FFDE00]/40">
          <Zap className="w-3.5 h-3.5 text-[#FFDE00]" />
          <span>Auto Face Centering</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#054726]/80 border border-[#FFDE00]/40">
          <Camera className="w-3.5 h-3.5 text-pink-400" />
          <span>Supports iPhone HEIC</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#054726]/80 border border-[#FFDE00]/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Signup Required</span>
        </div>
      </motion.div>
    </div>
  );
}
