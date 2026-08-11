"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Move, RotateCcw, Sparkles } from "lucide-react";
import { detectFaceCrop } from "@/lib/face-detection";

interface FaceAdjusterProps {
  imageSrc: string;
  scale: number;
  offsetX: number;
  offsetY: number;
  onChangeScale: (scale: number) => void;
  onChangeOffsetX: (x: number) => void;
  onChangeOffsetY: (y: number) => void;
  isBuilderCard?: boolean;
}

export default function FaceAdjuster({
  imageSrc,
  scale,
  offsetX,
  offsetY,
  onChangeScale,
  onChangeOffsetX,
  onChangeOffsetY,
  isBuilderCard = false,
}: FaceAdjusterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      renderCanvas();
    };
  }, [imageSrc]);

  useEffect(() => {
    if (imgRef.current) {
      renderCanvas();
    }
  }, [scale, offsetX, offsetY, isBuilderCard]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = isBuilderCard ? 600 : 500;
    const canvasHeight = isBuilderCard ? 315 : 500;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Render User Photo with scale & offsets
    const srcW = img.naturalWidth || img.width;
    const srcH = img.naturalHeight || img.height;

    const minDim = Math.min(srcW, srcH) / scale;
    const cropW = minDim;
    const cropH = isBuilderCard ? minDim * (315 / 600) : minDim;

    const baseLeft = (srcW - cropW) / 2;
    const baseTop = (srcH - cropH) / 2;

    const left = Math.max(0, Math.min(srcW - cropW, baseLeft - offsetX * srcW));
    const top = Math.max(0, Math.min(srcH - cropH, baseTop - offsetY * srcH));

    ctx.drawImage(img, left, top, cropW, cropH, 0, 0, canvasWidth, canvasHeight);
  };

  const handleAutoDetectFace = async () => {
    if (!imgRef.current) return;
    setIsDetecting(true);
    setDetectionMessage("Analyzing facial landmarks...");

    try {
      const cropResult = await detectFaceCrop(imgRef.current);
      onChangeScale(cropResult.scale);
      onChangeOffsetX(cropResult.offsetX);
      onChangeOffsetY(cropResult.offsetY);
      setDetectionMessage("Face centered successfully!");
    } catch (err) {
      setDetectionMessage("Center crop applied.");
    } finally {
      setIsDetecting(false);
      setTimeout(() => setDetectionMessage(null), 2500);
    }
  };

  const handleReset = () => {
    onChangeScale(1.0);
    onChangeOffsetX(0);
    onChangeOffsetY(0);
  };

  return (
    <div className="w-full glass-card rounded-3xl p-5 space-y-5 border border-[#FFDE00]/40 bg-[#042917]/90">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#FFDE00] flex items-center gap-2">
          <Move className="w-4 h-4 text-[#FF007F]" /> Crop & Position Controls
        </h4>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoDetectFace}
            disabled={isDetecting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF007F]/20 border border-[#FF007F]/40 text-pink-300 text-xs font-bold hover:bg-[#FF007F]/30 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isDetecting ? "animate-spin" : ""}`} />
            <span>{isDetecting ? "Detecting..." : "Auto-Center Face"}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset Pan & Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {detectionMessage && (
        <div className="text-xs font-semibold text-emerald-400 animate-pulse">
          {detectionMessage}
        </div>
      )}

      {/* Interactive Live Canvas */}
      <div className="relative w-full max-h-[360px] flex items-center justify-center bg-[#021C0E] rounded-2xl overflow-hidden border border-[#FFDE00]/30 p-2">
        <canvas
          ref={canvasRef}
          className="max-h-[340px] w-auto object-contain rounded-xl shadow-md"
        />
      </div>

      {/* Manual Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Zoom Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-200 font-semibold">
            <span className="flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5 text-[#FFDE00]" /> Zoom
            </span>
            <span>{Math.round(scale * 100)}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="2.2"
            step="0.05"
            value={scale}
            onChange={(e) => onChangeScale(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FFDE00]"
          />
        </div>

        {/* Pan X Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-200 font-semibold">
            <span>Horizontal Shift</span>
            <span>{Math.round(offsetX * 100)}</span>
          </div>
          <input
            type="range"
            min="-0.4"
            max="0.4"
            step="0.02"
            value={offsetX}
            onChange={(e) => onChangeOffsetX(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FF007F]"
          />
        </div>

        {/* Pan Y Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-200 font-semibold">
            <span>Vertical Shift</span>
            <span>{Math.round(offsetY * 100)}</span>
          </div>
          <input
            type="range"
            min="-0.4"
            max="0.4"
            step="0.02"
            value={offsetY}
            onChange={(e) => onChangeOffsetY(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FF007F]"
          />
        </div>
      </div>
    </div>
  );
}
