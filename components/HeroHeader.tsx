"use client";

import { motion } from "framer-motion";

export default function HeroHeader() {
  return (
    <div className="relative text-center max-w-4xl mx-auto space-y-3 pt-4 pb-2">
      {/* Main Headline with Hot Pink Devanagari Accent Badge */}
      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
      >
        Upload your photo to instantly create your branded <strong className="text-[#FFDE00]">PFP Frame</strong> or official <strong className="text-white">Builder Pass Badge</strong>. Download in high-res & share on X with <span className="text-[#FF007F] font-black">#FrameInGoa</span>.
      </motion.p>
    </div>
  );
}
