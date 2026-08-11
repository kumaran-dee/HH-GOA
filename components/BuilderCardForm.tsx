"use client";

import { useState } from "react";
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
  const [isCustomRole, setIsCustomRole] = useState(false);

  const handleShuffleTitle = () => {
    const newTitle = getRandomBuilderTitle();
    onChangeTitle(newTitle);
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <Sparkles className="w-5 h-5 text-[#00F2FE]" />
        <div>
          <h3 className="text-base font-bold text-white">Builder Badge Details</h3>
          <p className="text-xs text-slate-400">Customized badge details for HH Goa 2026</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-orange-400" /> Full Name or Handle
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
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> Stack / Primary Role
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_STACKS.map((stackItem) => (
              <button
                key={stackItem}
                type="button"
                onClick={() => {
                  setIsCustomRole(false);
                  onChangeRole(stackItem);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  role === stackItem && !isCustomRole
                    ? "bg-[#00F2FE] text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
                }`}
              >
                {stackItem}
              </button>
            ))}
          </div>
          {isCustomRole && (
            <input
              type="text"
              placeholder="Enter custom role/stack..."
              value={role}
              onChange={(e) => onChangeRole(e.target.value)}
              className="w-full mt-2 px-4 py-2.5 rounded-xl glass-input text-sm font-semibold placeholder:text-slate-500"
            />
          )}
        </div>

        {/* Fun Builder Title Generator */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-amber-400" /> Generated Builder Title
            </label>
            <button
              type="button"
              onClick={handleShuffleTitle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-goa text-white text-xs font-bold shadow-md hover:opacity-90 transition-all active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5" /> Shuffle Title
            </button>
          </div>

          <div className="relative group p-4 rounded-2xl bg-slate-900/90 border border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <span className="text-sm font-extrabold text-orange-400">
                {title || "Chai-Powered Code Wizard"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
