"use client";

import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#07090e]/90 mt-16 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-black text-white text-base tracking-tight">
              FrameIn<span className="gradient-text-goa">Goa</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold">
              HH GOA 2026
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Official Social Frame & Builder ID Card Generator for Hacker House Goa 2026.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            Anjuna Beach, Goa <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Nov 2026
          </span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="text-orange-400 font-bold">#FrameInGoa</span>
        </div>
      </div>
    </footer>
  );
}
