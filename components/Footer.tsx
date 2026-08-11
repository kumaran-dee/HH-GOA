"use client";

import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#FFDE00]/30 bg-[#04331C]/95 mt-16 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-black text-white text-base tracking-tight">
              FrameIn<span className="text-[#FFDE00]">Goa</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF007F] text-white font-extrabold border border-white">
              HACKER HOUSE GOA
            </span>
          </div>
          <p className="text-xs text-emerald-200">
            Official PFP Frame & Builder Pass Generator for Hacker House Goa 2026.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-semibold text-emerald-200">
          <span className="flex items-center gap-1.5 text-white font-bold">
            GOA, INDIA <Sparkles className="w-3.5 h-3.5 text-[#FFDE00]" /> 28 - 31 OCT 2026
          </span>
          <span className="hidden sm:inline text-emerald-600">•</span>
          <span className="text-[#FF007F] font-black text-sm">#FrameInGoa</span>
        </div>
      </div>
    </footer>
  );
}
