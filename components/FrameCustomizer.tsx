"use client";

import { Palette } from "lucide-react";

export type FrameStyleOption = "emerald-goa" | "sunshine-yellow" | "sunset-pink" | "vip-beach";

interface FrameCustomizerProps {
  selectedStyle: FrameStyleOption;
  onSelectStyle: (style: FrameStyleOption) => void;
}

const FRAME_PRESETS: { id: FrameStyleOption; name: string; gradient: string }[] = [
  {
    id: "emerald-goa",
    name: "Emerald Goa",
    gradient: "from-[#054726] via-[#FFDE00] to-[#FF007F]",
  },
  {
    id: "sunshine-yellow",
    name: "Sunshine Yellow",
    gradient: "from-[#FFDE00] via-[#FFE600] to-[#0A5C36]",
  },
  {
    id: "sunset-pink",
    name: "Sunset Pink",
    gradient: "from-[#FF007F] via-[#FF1493] to-[#FFDE00]",
  },
  {
    id: "vip-beach",
    name: "VIP Beach",
    gradient: "from-[#00F2FE] via-[#0A5C36] to-[#FF007F]",
  },
];

export default function FrameCustomizer({
  selectedStyle,
  onSelectStyle,
}: FrameCustomizerProps) {
  return (
    <div className="w-full glass-card rounded-3xl p-5 space-y-4 border border-[#FFDE00]/40 bg-[#042917]/90">
      <div className="flex items-center gap-2 border-b border-emerald-800/80 pb-3">
        <Palette className="w-4 h-4 text-[#FFDE00]" />
        <h4 className="text-sm font-extrabold text-[#FFDE00]">Frame Color Theme</h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FRAME_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectStyle(preset.id)}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
              selectedStyle === preset.id
                ? "bg-[#054726] border-[#FFDE00] shadow-md ring-2 ring-[#FFDE00]/60"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80"
            }`}
          >
            <div className={`w-full h-8 rounded-xl bg-gradient-to-r ${preset.gradient} shadow-sm border border-white/20`} />
            <span className="text-xs font-bold text-white">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
