"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Download, Share2, Copy, Check, Sparkles, RefreshCw } from "lucide-react";

interface GraphicPreviewProps {
  imageDataUri: string;
  shareUrl: string;
  fileName: string;
  format?: string;
  onReset: () => void;
}

export default function GraphicPreview({
  imageDataUri,
  shareUrl,
  fileName,
  onReset,
}: GraphicPreviewProps) {
  const [copied, setCopied] = useState(false);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FF3B00", "#FF8C00", "#00F2FE", "#4FACFE"],
      });
    } catch (e) {
      // Fallback ignore
    }
  };

  const handleDownload = () => {
    triggerConfetti();
    const a = document.createElement("a");
    a.href = imageDataUri;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Pre-filled X (Twitter) tweet intent URL
  const tweetText = encodeURIComponent("Ready for Hacker House Goa 2026 🚀 #FrameInGoa");
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodedShareUrl}`;

  const handleShareToX = () => {
    triggerConfetti();
    window.open(twitterIntentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full glass-card rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col items-center border border-slate-700/60 shadow-2xl"
    >
      {/* Top Tag Header */}
      <div className="flex items-center justify-between w-full border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-extrabold text-white">Your PFP Frame is Ready!</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          High-Res 1024x1024 PNG
        </span>
      </div>

      {/* Generated Graphic Image */}
      <div className="relative w-full max-h-[480px] overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 p-2 shadow-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageDataUri}
          alt="Hacker House Goa 2026 Profile Frame"
          className="max-h-[440px] w-auto object-contain rounded-xl shadow-2xl"
        />
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2">
        {/* One-Click Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-goa font-extrabold text-white text-base shadow-xl hover:bg-gradient-goa-hover hover:shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          <Download className="w-5 h-5" /> Download {fileName}
        </button>

        {/* Share to X Button */}
        <button
          type="button"
          onClick={handleShareToX}
          className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-black border border-slate-700 font-extrabold text-white text-base shadow-xl hover:bg-slate-900 transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          <Share2 className="w-5 h-5 text-cyan-400" /> Share to X (Twitter)
        </button>
      </div>

      {/* Shareable Link Box */}
      <div className="w-full space-y-2 pt-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Unique Shareable Preview Link</span>
          {copied && <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3"/> Copied to Clipboard!</span>}
        </label>
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent px-3 text-xs font-mono text-slate-300 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </button>
        </div>
      </div>

      {/* Start Over Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Create Another Frame
        </button>
      </div>
    </motion.div>
  );
}
