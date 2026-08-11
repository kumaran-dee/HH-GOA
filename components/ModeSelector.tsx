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
            ? "glass-card border-[#FF3B00] shadow-lg shadow-orange-500/20 ring-2 ring-[#FF3B00]/50"
            : "glass-card-interactive hover:border-slate-600 opacity-80 hover:opacity-100"
        }`}
      >
        {mode === "pfp" && (
          <div className="absolute top-4 right-4 text-[#FF3B00]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-3 rounded-xl ${mode === "pfp" ? "bg-gradient-goa text-white" : "bg-slate-800 text-slate-400"}`}>
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Format A</span>
            <h3 className="text-lg font-bold text-white leading-tight">PFP Frame</h3>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Square 1024x1024 profile picture with face auto-centering & branded HH Goa 2026 frame.
        </p>
      </button>

      {/* Format B: Builder ID Card */}
      <button
        type="button"
        onClick={() => onSelectMode("builder-card")}
        className={`relative text-left p-5 rounded-2xl transition-all duration-300 ${
          mode === "builder-card"
            ? "glass-card border-[#00F2FE] shadow-lg shadow-cyan-500/20 ring-2 ring-[#00F2FE]/50"
            : "glass-card-interactive hover:border-slate-600 opacity-80 hover:opacity-100"
        }`}
      >
        {mode === "builder-card" && (
          <div className="absolute top-4 right-4 text-[#00F2FE]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-3 rounded-xl ${mode === "builder-card" ? "bg-cyan-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"}`}>
            <IdCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Format B</span>
            <h3 className="text-lg font-bold text-white leading-tight">Builder ID Card</h3>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Social media event pass (1200x630) featuring your name, stack, photo, and fun builder title.
        </p>
      </button>
    </div>
  );
}
