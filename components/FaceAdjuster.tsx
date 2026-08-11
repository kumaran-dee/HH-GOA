"use client";

import { useEffect, useRef, useState, WheelEvent, MouseEvent, TouchEvent } from "react";
import { Move, RotateCcw, Sparkles } from "lucide-react";
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

  // Drag tracking refs
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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
  }, [scale, offsetX, offsetY]);

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

  // Mouse Wheel (Zoom) Handler
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.08 : 0.08;
    const newScale = Math.max(1.0, Math.min(2.5, scale + zoomDelta));
    onChangeScale(newScale);
  };

  // Mobile Touch Drag Handlers
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      initialOffsetRef.current = { x: offsetX, y: offsetY };
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1 || !containerRef.current) return;

    const dx = (e.touches[0].clientX - dragStartRef.current.x) / containerRef.current.clientWidth;
    const dy = (e.touches[0].clientY - dragStartRef.current.y) / containerRef.current.clientHeight;

    const newX = Math.max(-0.45, Math.min(0.45, initialOffsetRef.current.x + dx * 1.2));
    const newY = Math.max(-0.45, Math.min(0.45, initialOffsetRef.current.y + dy * 1.2));

    onChangeOffsetX(newX);
    onChangeOffsetY(newY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
    <div className="w-full glass-card rounded-3xl p-5 space-y-4 border border-[#FFDE00]/40 bg-[#042917]/90">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-[#FFDE00] flex items-center gap-2">
          <Move className="w-4 h-4 text-[#FF007F]" /> Photo Position & Zoom
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
            title="Reset Position"
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

      {/* Interactive Circular Preview Container with Mouse & Touch Drag/Zoom */}
      <div className="flex flex-col items-center justify-center py-2 space-y-3">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-[#FFDE00] overflow-hidden shadow-2xl shadow-yellow-500/20 select-none bg-[#021C0E] ${
            isDragging ? "cursor-grabbing scale-[1.01]" : "cursor-grab"
          } transition-transform`}
        >
          <canvas ref={canvasRef} className="w-full h-full object-cover pointer-events-none" />

          {/* Interactive Drag Hint Overlay */}
          <div className="absolute inset-0 border-2 border-white/20 rounded-full pointer-events-none flex items-center justify-center">
            <div className="opacity-0 hover:opacity-100 transition-opacity bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
              Drag to move • Scroll to zoom
            </div>
          </div>
        </div>

        {/* User Interaction Guide */}
        <p className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
          <span className="text-[#FFDE00]">💡 Tip:</span> Click & drag photo to position • Scroll mouse wheel to zoom
        </p>
      </div>
    </div>
  );
}
