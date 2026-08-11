"use client";

import { User, Code2, Sparkles, Shuffle, Briefcase } from "lucide-react";
import { POPULAR_STACKS, getRandomBuilderTitle } from "@/lib/builder-titles";

interface BuilderCardFormProps {
  name: string;
  role: string;
  title: string;
  onChangeName: (name: string) => void;
  onChangeRole: (role: string) => void;
  onChangeTitle: (title: string) => void;
}

export default function BuilderCardForm({
  name,
  role,
  title,
  onChangeName,
  onChangeRole,
  onChangeTitle,
}: BuilderCardFormProps) {
  const handleShuffleTitle = () => {
    const newTitle = getRandomBuilderTitle();
    onChangeTitle(newTitle);
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 space-y-6 border border-[#FFDE00]/40 bg-[#042917]/90">
      <div className="flex items-center gap-2 border-b border-emerald-800/80 pb-4">
        <Sparkles className="w-5 h-5 text-[#FFDE00]" />
        <div>
          <h3 className="text-base font-extrabold text-white">Format B: Builder Pass Details</h3>
          <p className="text-xs text-emerald-200">Customized badge details for Hacker House Goa 2026</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#FFDE00] uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Full Name or Handle
          </label>
          <input
            type="text"
            placeholder="e.g. Satoshi Nakamoto or @builder"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm font-semibold placeholder:text-slate-500"
          />
        </div>

        {/* Stack / Role Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#FFDE00] uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#FF007F]" /> Stack / Primary Role
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_STACKS.map((stackItem) => (
              <button
                key={stackItem}
                type="button"
                onClick={() => onChangeRole(stackItem)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  role === stackItem
                    ? "bg-[#FFDE00] text-slate-950 shadow-md"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700"
                }`}
              >
                {stackItem}
              </button>
            ))}
          </div>
        </div>

        {/* Fun Builder Title Generator */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#FFDE00] uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-[#FF007F]" /> Generated Builder Title
            </label>
            <button
              type="button"
              onClick={handleShuffleTitle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF007F] text-white text-xs font-bold shadow-md hover:opacity-90 transition-all active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5" /> Shuffle Title
            </button>
          </div>

          <div className="relative group p-4 rounded-2xl bg-slate-950/80 border border-[#FF007F]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <span className="text-sm font-extrabold text-[#FFDE00]">
                {title || "Chai-Powered Code Wizard"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
