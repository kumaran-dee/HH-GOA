"use client";

import { motion } from "framer-motion";

export default function HeroHeader() {
  return (
    <div className="relative text-center max-w-4xl mx-auto space-y-3 pt-2 sm:pt-4 pb-2 px-2">
      {/* Main Headline: HACKER [गोवा] HOUSE Social Badges */}
      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-6xl font-black tracking-tight text-white leading-tight flex flex-col items-center justify-center gap-1.5 sm:gap-2"
      >
        {/* Line 1: HACKER [गोवा] HOUSE */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-[#FFDE00] font-serif tracking-wider text-3xl sm:text-6xl">
            HACKER
          </span>
          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-2xl bg-[#FF007F] text-white font-extrabold text-xl sm:text-3xl border-2 border-white shadow-lg inline-block transform -rotate-3 hover:rotate-0 transition-transform">
            गोवा
          </span>
          <span className="text-[#FFDE00] font-serif tracking-wider text-3xl sm:text-6xl">
            HOUSE
          </span>
        </div>

        {/* Line 2: Social Badges */}
        <div className="text-white text-xl sm:text-4xl font-extrabold tracking-wide">
          Social Badges
        </div>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-emerald-100 text-sm sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed px-2"
      >
        Upload your photo to instantly create your branded <strong className="text-[#FFDE00]">PFP Frame</strong> or official <strong className="text-white">Builder Pass Badge</strong>. Download in high-res & share on X with <span className="text-[#FF007F] font-black">#FrameInGoa</span>.
      </motion.p>
    </div>
  );
}
