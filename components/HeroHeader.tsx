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
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm font-semibold shadow-xl"
      >
        <span className="flex h-2 w-2 rounded-full bg-[#FF3B00] animate-ping" />
        <span className="gradient-text-goa font-bold">HACKER HOUSE GOA 2026</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-300">Official Social PFP Frame Generator</span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight"
      >
        Hacker House Goa 2026 <br />
        <span className="gradient-text-goa">Profile Picture Frame</span> 🚀
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed"
      >
        Upload your photo to instantly create your branded <strong className="text-white">Hacker House Goa 2026</strong> profile picture frame. Download in high-res & flex on X with <span className="text-orange-400 font-bold">#FrameInGoa</span>.
      </motion.p>

      {/* Highlights Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400"
      >
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/50 border border-slate-800">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Auto Face Centering</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/50 border border-slate-800">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>Supports iPhone HEIC</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/50 border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Signup Required</span>
        </div>
      </motion.div>
    </div>
  );
}
