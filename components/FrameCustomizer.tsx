"use client";

import { Sparkles, Palette } from "lucide-react";

export type FrameStyleOption = "sunset-cyber" | "neon-palm" | "anjuna-wave" | "vip-gold";

interface FrameCustomizerProps {
  selectedStyle: FrameStyleOption;
  onSelectStyle: (style: FrameStyleOption) => void;
}

const FRAME_PRESETS: { id: FrameStyleOption; name: string; gradient: string }[] = [
  {
    id: "sunset-cyber",
    name: "Sunset Cyber",
    gradient: "from-[#FF3B00] via-[#FF8C00] to-[#00F2FE]",
  },
  {
    id: "neon-palm",
    name: "Neon Palm",
    gradient: "from-[#00F2FE] via-[#4FACFE] to-[#00E676]",
  },
  {
    id: "anjuna-wave",
    name: "Anjuna Wave",
    gradient: "from-[#7928CA] via-[#FF0080] to-[#FF8C00]",
  },
  {
    id: "vip-gold",
    name: "VIP Gold",
    gradient: "from-[#FFE000] via-[#799F0C] to-[#00E676]",
  },
];

export default function FrameCustomizer({
  selectedStyle,
  onSelectStyle,
}: FrameCustomizerProps) {
  return (
    <div className="w-full glass-card rounded-3xl p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Palette className="w-4 h-4 text-[#FF8C00]" />
        <h4 className="text-sm font-bold text-slate-200">Frame Style Presets</h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FRAME_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectStyle(preset.id)}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
              selectedStyle === preset.id
                ? "bg-slate-900 border-[#FF3B00] shadow-md ring-2 ring-[#FF3B00]/40"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80"
            }`}
          >
            <div className={`w-full h-8 rounded-xl bg-gradient-to-r ${preset.gradient} shadow-sm`} />
            <span className="text-xs font-bold text-slate-200">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
