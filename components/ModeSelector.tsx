"use client";

import { motion } from "framer-motion";
import { UserCheck, IdCard, CheckCircle2 } from "lucide-react";

export type GenerationMode = "pfp" | "builder-card";

interface ModeSelectorProps {
  mode: GenerationMode;
  onSelectMode: (mode: GenerationMode) => void;
}

export default function ModeSelector({ mode, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Format A: Profile Picture Frame */}
      <button
        type="button"
        onClick={() => onSelectMode("pfp")}
        className={`relative text-left p-5 rounded-2xl transition-all duration-300 ${
          mode === "pfp"
            ? "glass-card border-[#FFDE00] shadow-lg shadow-yellow-500/20 ring-2 ring-[#FFDE00]/60 bg-[#054726]/90"
            : "glass-card-interactive hover:border-slate-600 opacity-80 hover:opacity-100 bg-slate-900/60"
        }`}
      >
        {mode === "pfp" && (
          <div className="absolute top-4 right-4 text-[#FFDE00]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-3 rounded-xl ${mode === "pfp" ? "bg-[#FFDE00] text-slate-950 font-bold" : "bg-slate-800 text-slate-400"}`}>
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#FFDE00] uppercase tracking-wider">Format A</span>
            <h3 className="text-lg font-extrabold text-white leading-tight">PFP Frame</h3>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Square 1024x1024 profile picture with face auto-centering & official Hacker House Goa 2026 frame.
        </p>
      </button>

      {/* Format B: Aadhaar Style Builder Pass */}
      <button
        type="button"
        onClick={() => onSelectMode("builder-card")}
        className={`relative text-left p-5 rounded-2xl transition-all duration-300 ${
          mode === "builder-card"
            ? "glass-card border-[#FF007F] shadow-lg shadow-pink-500/20 ring-2 ring-[#FF007F]/60 bg-[#054726]/90"
            : "glass-card-interactive hover:border-slate-600 opacity-80 hover:opacity-100 bg-slate-900/60"
        }`}
      >
        {mode === "builder-card" && (
          <div className="absolute top-4 right-4 text-[#FF007F]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-3 rounded-xl ${mode === "builder-card" ? "bg-[#FF007F] text-white font-bold" : "bg-slate-800 text-slate-400"}`}>
            <IdCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#FF007F] uppercase tracking-wider">Format B</span>
            <h3 className="text-lg font-extrabold text-white leading-tight">Aadhaar Builder Card</h3>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Official Aadhaar / National ID Card style event badge featuring photo, name, role, title & barcode.
        </p>
      </button>
    </div>
  );
}
