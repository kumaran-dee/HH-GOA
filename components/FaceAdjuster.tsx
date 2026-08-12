"use client";

import { useEffect, useRef, useState, MouseEvent, TouchEvent } from "react";
import { Move, RotateCcw, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
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
}: FaceAdjusterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag & Pinch tracking refs
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef<number>(scale);

  const imgRef = useRef<HTMLImageElement | null>(null);

  // Store current scale in a ref for non-passive event listeners
  const scaleRef = useRef(scale);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

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
  }, [scale, offsetX, offsetY]);

  // Non-passive wheel event listener to prevent webpage scrolling/zooming when scrolling over the circle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelNonPassive = (e: globalThis.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const zoomDelta = e.deltaY > 0 ? -0.08 : 0.08;
      const newScale = Math.max(1.0, Math.min(2.5, scaleRef.current + zoomDelta));
      onChangeScale(newScale);
    };

    container.addEventListener("wheel", handleWheelNonPassive, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheelNonPassive);
    };
  }, [onChangeScale]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasSize = 400; // High-DPI preview size
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    const srcW = img.naturalWidth || img.width;
    const srcH = img.naturalHeight || img.height;

    const minDim = Math.min(srcW, srcH) / scale;
    const cropW = minDim;
    const cropH = minDim;

    const baseLeft = (srcW - cropW) / 2;
    const baseTop = (srcH - cropH) / 2;

    const left = Math.max(0, Math.min(srcW - cropW, baseLeft - offsetX * srcW));
    const top = Math.max(0, Math.min(srcH - cropH, baseTop - offsetY * srcH));

    // Draw user photo with crop
    ctx.drawImage(img, left, top, cropW, cropH, 0, 0, canvasSize, canvasSize);
  };

  // Mouse Drag (Pan) Handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialOffsetRef.current = { x: offsetX, y: offsetY };
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const dx = (e.clientX - dragStartRef.current.x) / containerRef.current.clientWidth;
    const dy = (e.clientY - dragStartRef.current.y) / containerRef.current.clientHeight;

    const newX = Math.max(-0.45, Math.min(0.45, initialOffsetRef.current.x + dx * 1.2));
    const newY = Math.max(-0.45, Math.min(0.45, initialOffsetRef.current.y + dy * 1.2));

    onChangeOffsetX(newX);
    onChangeOffsetY(newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Helper for touch pinch distance
  const getTouchDistance = (e: TouchEvent<HTMLDivElement>) => {
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  };

  // Mobile Touch Drag & Pinch Handlers
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      initialOffsetRef.current = { x: offsetX, y: offsetY };
      initialPinchDistRef.current = null;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      initialPinchDistRef.current = getTouchDistance(e);
      initialPinchScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isDragging && containerRef.current) {
      const dx = (e.touches[0].clientX - dragStartRef.current.x) / containerRef.current.clientWidth;
      const dy = (e.touches[0].clientY - dragStartRef.current.y) / containerRef.current.clientHeight;

      const newX = Math.max(-0.45, Math.min(0.45, initialOffsetRef.current.x + dx * 1.2));
      const newY = Math.max(-0.45, Math.min(0.45, initialOffsetRef.current.y + dy * 1.2));

      onChangeOffsetX(newX);
      onChangeOffsetY(newY);
    } else if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
      const currentDist = getTouchDistance(e);
      const zoomFactor = currentDist / initialPinchDistRef.current;
      const newScale = Math.max(1.0, Math.min(2.5, initialPinchScaleRef.current * zoomFactor));
      onChangeScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    initialPinchDistRef.current = null;
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

  const zoomOut = () => {
    onChangeScale(Math.max(1.0, scale - 0.15));
  };

  const zoomIn = () => {
    onChangeScale(Math.min(2.5, scale + 0.15));
  };

  return (
    <div className="w-full glass-card rounded-3xl p-4 sm:p-5 space-y-4 border border-[#FFDE00]/40 bg-[#042917]/90">
      <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        <h4 className="text-sm font-extrabold text-[#FFDE00] flex items-center gap-2">
          <Move className="w-4 h-4 text-[#FF007F]" /> Photo Position & Zoom
        </h4>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAutoDetectFace}
            disabled={isDetecting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF007F]/20 border border-[#FF007F]/40 text-pink-300 text-xs font-bold hover:bg-[#FF007F]/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isDetecting ? "animate-spin" : ""}`} />
            <span>{isDetecting ? "Detecting..." : "Auto-Center"}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors active:scale-95"
            title="Reset Position & Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {detectionMessage && (
        <div className="text-xs font-semibold text-emerald-400 animate-pulse text-center">
          {detectionMessage}
        </div>
      )}

      {/* Interactive Circular Preview Container */}
      <div className="flex flex-col items-center justify-center py-2 space-y-4">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`relative w-64 h-64 xs:w-72 xs:h-72 sm:w-80 sm:h-80 rounded-full border-4 border-[#FFDE00] overflow-hidden shadow-2xl shadow-yellow-500/20 select-none bg-[#021C0E] ${
            isDragging ? "cursor-grabbing scale-[1.01]" : "cursor-grab"
          } transition-transform touch-none`}
        >
          <canvas ref={canvasRef} className="w-full h-full object-cover pointer-events-none" />

          {/* Drag Hint Overlay */}
          <div className="absolute inset-0 border-2 border-white/20 rounded-full pointer-events-none flex items-center justify-center">
            <div className="opacity-0 hover:opacity-100 transition-opacity bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
              Drag photo • Pinch to zoom
            </div>
          </div>
        </div>

        {/* Mobile & Desktop Dedicated Zoom Controls */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="flex items-center gap-1">
              <ZoomOut className="w-3.5 h-3.5 text-[#FFDE00]" /> Zoom Level
            </span>
            <span className="text-[#FFDE00] font-mono">{scale.toFixed(2)}x</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={zoomOut}
              disabled={scale <= 1.0}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 disabled:opacity-40 transition-colors active:scale-95 shrink-0"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.02"
              value={scale}
              onChange={(e) => onChangeScale(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer border border-emerald-800/80 accent-[#FFDE00]"
            />

            <button
              type="button"
              onClick={zoomIn}
              disabled={scale >= 2.5}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 disabled:opacity-40 transition-colors active:scale-95 shrink-0"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-[#FFDE00]" />
            </button>
          </div>

          {/* Preset Zoom Quick Buttons */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {[1.0, 1.3, 1.8, 2.2].map((presetScale) => (
              <button
                key={presetScale}
                type="button"
                onClick={() => onChangeScale(presetScale)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  Math.abs(scale - presetScale) < 0.08
                    ? "bg-[#FFDE00] text-slate-950 shadow-md scale-105"
                    : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800"
                }`}
              >
                {presetScale.toFixed(1)}x
              </button>
            ))}
          </div>
        </div>

        {/* User Interaction Guide */}
        <p className="text-[11px] sm:text-xs text-slate-300 font-semibold text-center flex items-center justify-center gap-1.5 bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-800/60 max-w-full">
          <span className="text-[#FFDE00]">💡 Tip:</span> Drag photo to center • Use zoom slider or pinch on mobile
        </p>
      </div>
    </div>
  );
}

