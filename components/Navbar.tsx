"use client";

import Link from "next/link";
import { Sparkles, Compass, ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#07090e]/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-goa p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FF8C00] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-[#00F2FE] transition-colors">
                FrameIn<span className="gradient-text-goa">Goa</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold text-orange-400">
                2026
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              HACKER HOUSE GOA
            </p>
          </div>
        </Link>

        {/* Status Pill & Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300">
            <Compass className="w-3.5 h-3.5 text-[#00F2FE]" />
            <span>Anjuna Beach, Goa</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>No Signup Needed</span>
          </div>
        </div>
      </div>
    </header>
  );
}
