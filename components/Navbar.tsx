"use client";

import Link from "next/link";
import { Sparkles, Compass, ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#042917]/90 border-b border-[#FFDE00]/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-[#FFDE00] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#054726] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FFDE00] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white group-hover:text-[#FFDE00] transition-colors">
                FrameIn<span className="text-[#FFDE00]">Goa</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FF007F] text-white text-[10px] font-extrabold border border-white">
                गोवा
              </span>
            </div>
            <p className="text-[10px] text-emerald-200 font-bold tracking-wide">
              HACKER HOUSE GOA 2026
            </p>
          </div>
        </Link>

        {/* Status Pill & Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#054726] border border-[#FFDE00]/50 text-xs font-bold text-[#FFDE00]">
            <Compass className="w-3.5 h-3.5" />
            <span>28 - 31 OCT 2026</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF007F]/20 border border-[#FF007F]/50 text-xs font-bold text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF007F]" />
            <span>No Signup Required</span>
          </div>
        </div>
      </div>
    </header>
  );
}
