"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroHeader from "@/components/HeroHeader";
import ImageUploader from "@/components/ImageUploader";
import FaceAdjuster from "@/components/FaceAdjuster";
import FrameCustomizer, { FrameStyleOption } from "@/components/FrameCustomizer";
import GraphicPreview from "@/components/GraphicPreview";
import { ArrowRight, Loader2, Wand2 } from "lucide-react";

export default function HomePage() {
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Crop & Positioning State
  const [scale, setScale] = useState(1.0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // Frame Options
  const [frameStyle, setFrameStyle] = useState<FrameStyleOption>("sunset-cyber");

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
          imageBase64: selectedImageSrc,
          frameStyle,
          scale,
          offsetX,
          offsetY,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate PFP graphic.");
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
                  {/* Interactive Crop & Position */}
                  <FaceAdjuster
                    imageSrc={selectedImageSrc}
                    scale={scale}
                    offsetX={offsetX}
                    offsetY={offsetY}
                    onChangeScale={setScale}
                    onChangeOffsetX={setOffsetX}
                    onChangeOffsetY={setOffsetY}
                    frameStyle={frameStyle}
                    isBuilderCard={false}
                  />

                  {/* Frame Style Customizer */}
                  <FrameCustomizer
                    selectedStyle={frameStyle}
                    onSelectStyle={setFrameStyle}
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
                      className="w-full py-4 px-8 rounded-2xl bg-gradient-goa font-extrabold text-white text-lg shadow-xl shadow-orange-500/20 hover:bg-gradient-goa-hover hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin text-white" />
                          <span>Generating Hacker House Goa Frame...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-6 h-6" />
                          <span>Generate HH Goa 2026 Frame</span>
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
