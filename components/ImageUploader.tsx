"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, Camera, FileImage, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { convertHeicToJpeg } from "@/lib/heic-converter";

interface ImageUploaderProps {
  onImageSelected: (imageSrc: string, file: File) => void;
  selectedImageSrc: string | null;
  onClearImage: () => void;
}

export default function ImageUploader({
  onImageSelected,
  selectedImageSrc,
  onClearImage,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMessage(null);

    // Max size check: 10 MB = 10 * 1024 * 1024 bytes
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage("File size exceeds 10 MB. Please upload a smaller image.");
      return;
    }

    try {
      let finalFile: Blob = file;

      // Handle iPhone HEIC files
      if (
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif") ||
        file.type.toLowerCase().includes("heic") ||
        file.type.toLowerCase().includes("heif")
      ) {
        setIsConverting(true);
        finalFile = await convertHeicToJpeg(file);
        setIsConverting(false);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onImageSelected(result, new File([finalFile], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" }));
        }
      };
      reader.readAsDataURL(finalFile);
    } catch (err: any) {
      setIsConverting(false);
      setErrorMessage(err.message || "Failed to process image file.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="w-full space-y-3">
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {selectedImageSrc ? (
        <div className="relative group glass-card rounded-2xl p-3 flex flex-col items-center justify-center gap-3">
          <div className="relative w-full max-h-[280px] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImageSrc}
              alt="Uploaded photo preview"
              className="max-h-[260px] w-auto object-contain rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between w-full px-2 text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Photo Loaded Successfully
            </span>
            <button
              type="button"
              onClick={onClearImage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Change Photo
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer glass-card rounded-3xl p-8 sm:p-10 border-2 border-dashed text-center transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
            isDragging
              ? "border-[#00F2FE] bg-cyan-950/20 scale-[1.01]"
              : "border-slate-700/80 hover:border-slate-500 hover:bg-slate-900/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif"
            onChange={handleFileChange}
            className="hidden"
          />

          {isConverting ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <RefreshCw className="w-10 h-10 text-[#00F2FE] animate-spin" />
              <p className="text-sm font-semibold text-slate-200">
                Converting iPhone HEIC image...
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-[#00F2FE] shadow-xl group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Drop your photo here, or <span className="text-[#00F2FE] underline">browse</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Supports JPG, PNG & iPhone HEIC (Up to 10 MB)
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <FileImage className="w-3 h-3 text-emerald-400" /> High-Res Render
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Camera className="w-3 h-3 text-orange-400" /> Mobile & Gallery
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
