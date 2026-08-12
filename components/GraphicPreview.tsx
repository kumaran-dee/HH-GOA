"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Download, Share2, Copy, Check, Sparkles, RefreshCw, Send } from "lucide-react";

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
  format = "id-card",
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

  // Mobile Native Web Share API
  const handleNativeShare = async () => {
    triggerConfetti();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Hacker House Goa 2026 Social Frame",
          text: "Ready for Hacker House Goa 2026 🚀 #FrameInGoa",
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to X share if user cancelled or system failed
      }
    } else {
      handleShareToX();
    }
  };

  const isNativeShareAvailable = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full glass-card rounded-3xl p-4 sm:p-8 space-y-5 flex flex-col items-center border border-slate-700/60 shadow-2xl"
    >
      {/* Top Tag Header */}
      <div className="flex items-center justify-between w-full border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FFDE00] shrink-0" />
          <h3 className="text-base sm:text-lg font-extrabold text-white">
            {format === "id-card" ? "Your Official Builder ID Card is Ready!" : "Your PFP Frame is Ready!"}
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#FFDE00]/10 border border-[#FFDE00]/30 text-[#FFDE00] text-[11px] sm:text-xs font-bold shrink-0">
          {format === "id-card" ? "1024x648 CR80 PNG" : "1024x1024 PNG"}
        </span>
      </div>

      {/* Generated Graphic Image */}
      <div className="relative w-full max-h-[360px] sm:max-h-[480px] overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 p-2 shadow-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageDataUri}
          alt="Hacker House Goa 2026 Profile Frame"
          className="max-h-[340px] sm:max-h-[440px] w-auto object-contain rounded-xl shadow-2xl"
        />
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-1">
        {/* One-Click Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center justify-center gap-2.5 px-5 py-3.5 sm:py-4 rounded-2xl bg-gradient-goa font-extrabold text-slate-950 text-base shadow-xl hover:bg-gradient-goa-hover hover:shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 border-2 border-white"
        >
          <Download className="w-5 h-5" /> Download {fileName}
        </button>

        {/* Mobile Native Share / Share to X Button */}
        {isNativeShareAvailable ? (
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2.5 px-5 py-3.5 sm:py-4 rounded-2xl bg-[#FF007F] font-extrabold text-white text-base shadow-xl hover:bg-[#E0006F] transition-all transform hover:-translate-y-0.5 active:scale-95 border-2 border-white"
          >
            <Send className="w-5 h-5 text-white" /> Share Graphic
          </button>
        ) : (
          <button
            type="button"
            onClick={handleShareToX}
            className="flex items-center justify-center gap-2.5 px-5 py-3.5 sm:py-4 rounded-2xl bg-black border border-slate-700 font-extrabold text-white text-base shadow-xl hover:bg-slate-900 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Share2 className="w-5 h-5 text-[#00F2FE]" /> Share to X (Twitter)
          </button>
        )}
      </div>

      {/* Secondary Share to X button if native share is active */}
      {isNativeShareAvailable && (
        <button
          type="button"
          onClick={handleShareToX}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-extrabold text-slate-300 hover:text-white transition-colors active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5 text-[#00F2FE]" /> Post directly on X (Twitter)
        </button>
      )}

      {/* Shareable Link Box */}
      <div className="w-full space-y-2 pt-1">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Unique Shareable Link</span>
          {copied && <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3"/> Copied!</span>}
        </label>
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent px-2 text-xs font-mono text-slate-300 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold transition-all shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#00F2FE]" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Start Over Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors py-1 px-3 rounded-lg bg-slate-900/60 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#FFDE00]" /> Create Another Frame
        </button>
      </div>
    </motion.div>
  );
}

