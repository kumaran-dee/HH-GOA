"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroHeader from "@/components/HeroHeader";
import ImageUploader from "@/components/ImageUploader";
import FaceAdjuster from "@/components/FaceAdjuster";
import GraphicPreview from "@/components/GraphicPreview";
import { ArrowRight, Loader2, Wand2, User, Sparkles } from "lucide-react";

export default function HomePage() {
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Username / Handle Input (Default set to "builder" as requested)
  const [username, setUsername] = useState("builder");

  // Crop & Positioning State
  const [scale, setScale] = useState(1.0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // Generation Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedOutput, setGeneratedOutput] = useState<{
    imageDataUri: string;
    shareUrl: string;
    fileName: string;
  } | null>(null);

  const handleImageSelected = (src: string, file: File) => {
    setSelectedImageSrc(src);
    setImageFile(file);
    setGeneratedOutput(null);
    setErrorMessage(null);
    // Reset crop state
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleClearImage = () => {
    setSelectedImageSrc(null);
    setImageFile(null);
    setGeneratedOutput(null);
  };

  const handleGenerate = async () => {
    if (!selectedImageSrc) return;

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: "pfp",
          imageBase64: selectedImageSrc,
          username: username || "builder",
          scale,
          offsetX,
          offsetY,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate PFP frame graphic.");
      }

      setGeneratedOutput({
        imageDataUri: data.imageDataUri,
        shareUrl: data.shareUrl,
        fileName: data.fileName,
      });
    } catch (err: any) {
      console.error("Generation error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      {/* Hero Header */}
      <HeroHeader />

      {/* Main Flow Section */}
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {generatedOutput ? (
          <GraphicPreview
            imageDataUri={generatedOutput.imageDataUri}
            shareUrl={generatedOutput.shareUrl}
            fileName={generatedOutput.fileName}
            format="pfp"
            onReset={() => setGeneratedOutput(null)}
          />
        ) : (
          <div className="space-y-6">
            {/* Step 1: Upload Photo */}
            <ImageUploader
              onImageSelected={handleImageSelected}
              selectedImageSrc={selectedImageSrc}
              onClearImage={handleClearImage}
            />

            {/* Step 2: Controls & Options (shown when photo is selected) */}
            <AnimatePresence>
              {selectedImageSrc && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 overflow-hidden"
                >
                  {/* Handle Input Card */}
                  <div className="glass-card rounded-3xl p-5 space-y-4 border border-[#FFDE00]/40 bg-[#042917]/90">
                    <div className="flex items-center gap-2 border-b border-emerald-800/80 pb-3">
                      <Sparkles className="w-4 h-4 text-[#FFDE00]" />
                      <h4 className="text-sm font-extrabold text-[#FFDE00]">Badge Text / Handle</h4>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#FF007F]" /> Your Text or Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. builder or Satoshi"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-semibold placeholder:text-slate-500 text-white bg-slate-900/60 border border-emerald-700/50"
                      />
                    </div>
                  </div>

                  {/* Interactive Crop & Position */}
                  <FaceAdjuster
                    imageSrc={selectedImageSrc}
                    scale={scale}
                    offsetX={offsetX}
                    offsetY={offsetY}
                    onChangeScale={setScale}
                    onChangeOffsetX={setOffsetX}
                    onChangeOffsetY={setOffsetY}
                    isBuilderCard={false}
                  />

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  {/* Generate Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full py-4 px-8 rounded-2xl bg-[#FFDE00] font-black text-slate-950 text-lg shadow-xl shadow-yellow-500/20 hover:bg-[#FFE600] hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 border-2 border-white"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
                          <span>Generating Official Hacker House Frame...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-6 h-6" />
                          <span>Generate Official PFP Frame</span>
                          <ArrowRight className="w-5 h-5 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
