"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function GoaBeachBackground() {
  // Smooth spring physics for subtle mouse parallax movement
  const springConfig = { damping: 35, stiffness: 90 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  // Subtle normal-scale displacement
  const translateX = useTransform(mouseX, [-0.5, 0.5], [-18, 18]);
  const translateY = useTransform(mouseY, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const { innerWidth, innerHeight } = window;
        const x = e.touches[0].clientX / innerWidth - 0.5;
        const y = e.touches[0].clientY / innerHeight - 0.5;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Rich Forest Green Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#021D0E] via-[#04331C] to-[#02180D]" />

      {/* Ambient Sunshine Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-[#FFDE00] rounded-full blur-[220px] opacity-10" />

      {/* Moveable Normal Scale Parallax Artwork Container */}
      <motion.div
        style={{
          x: translateX,
          y: translateY,
          scale: 1.02,
        }}
        className="absolute inset-0 w-full h-full flex items-center justify-center"
      >
        <svg
          className="w-full h-full object-cover opacity-25 sm:opacity-30"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sunGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFDE00" />
              <stop offset="100%" stopColor="#FFA800" />
            </linearGradient>

            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#085B33" />
              <stop offset="100%" stopColor="#032D19" />
            </linearGradient>
          </defs>

          {/* RISING SUN & RAYS */}
          <g transform="translate(960, 520)">
            <circle cx="0" cy="0" r="140" fill="url(#sunGlow)" />
            <g stroke="#FFDE00" strokeWidth="4" strokeLinecap="round">
              <line x1="0" y1="-170" x2="0" y2="-230" />
              <line x1="-120" y1="-120" x2="-170" y2="-170" />
              <line x1="120" y1="-120" x2="170" y2="-170" />
              <line x1="-170" y1="0" x2="-230" y2="0" />
              <line x1="170" y1="0" x2="230" y2="0" />
            </g>
          </g>

          {/* HILLS */}
          <path d="M 0 620 Q 480 560 960 590 Q 1440 560 1920 620 V 1080 H 0 Z" fill="#054426" />

          {/* OCEAN */}
          <path d="M 0 650 Q 480 630 960 650 Q 1440 630 1920 650 V 1080 H 0 Z" fill="url(#oceanGrad)" />

          {/* SHORELINE */}
          <path d="M 0 780 Q 480 740 960 770 Q 1440 740 1920 780 V 1080 H 0 Z" fill="#F0F7F2" opacity="0.95" />
          <path d="M 0 780 Q 480 740 960 770 Q 1440 740 1920 780" fill="none" stroke="#FFFFFF" strokeWidth="6" />

          {/* BEACH SHACK "GOA BEACH" */}
          <g transform="translate(1220, 700)">
            <rect x="0" y="40" width="130" height="90" fill="#064426" stroke="#FFFFFF" strokeWidth="3" />
            <polygon points="-12,40 65,8 142,40" fill="#032D19" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="20" y="-5" width="90" height="24" rx="6" fill="#FF007F" stroke="#FFFFFF" strokeWidth="2" />
            <text x="65" y="12" fontFamily="sans-serif" fontWeight="900" fontSize="10" fill="#FFFFFF" textAnchor="middle">GOA BEACH</text>
            <path d="M -20 50 Q -10 20 -25 105" stroke="#FFDE00" strokeWidth="8" strokeLinecap="round" />
            <path d="M -8 45 Q 2 15 -12 105" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          </g>

          {/* LEFT PALM TREES */}
          <g transform="translate(120, 320)">
            <path d="M 60 520 Q 120 300 20 0" fill="none" stroke="#FFDE00" strokeWidth="16" strokeLinecap="round" />
            <path d="M 60 520 Q 120 300 20 0" fill="none" stroke="#064426" strokeWidth="9" strokeLinecap="round" />
            <g transform="translate(20, 0)">
              <path d="M 0 0 Q -90 -45 -135 45 Q -45 22 0 0 M 0 0 Q -45 -90 45 -110 Q 22 -22 0 0 M 0 0 Q 90 -65 135 22 Q 45 11 0 0 M 0 0 Q 110 45 90 110 Q 35 45 0 0" fill="#0A5C36" stroke="#FFDE00" strokeWidth="3.5" />
            </g>
          </g>

          {/* RIGHT PALM TREES */}
          <g transform="translate(1720, 320)">
            <path d="M 20 520 Q -40 300 60 0" fill="none" stroke="#FFDE00" strokeWidth="16" strokeLinecap="round" />
            <path d="M 20 520 Q -40 300 60 0" fill="none" stroke="#064426" strokeWidth="9" strokeLinecap="round" />
            <g transform="translate(60, 0)">
              <path d="M 0 0 Q 90 -45 135 45 Q 45 22 0 0 M 0 0 Q 45 -90 -45 -110 Q -22 -22 0 0 M 0 0 Q -90 -65 -135 22 Q -45 11 0 0 M 0 0 Q -110 45 -90 110 Q -35 45 0 0" fill="#0A5C36" stroke="#FFDE00" strokeWidth="3.5" />
            </g>
          </g>

          {/* HOUSES */}
          <g transform="translate(280, 780)">
            <polygon points="0,55 75,10 150,55 150,150 0,150" fill="#063E22" stroke="#FFFFFF" stroke-width="3" />
            <rect x="40" y="75" width="40" height="45" fill="#FFDE00" />
          </g>

          <g transform="translate(940, 790)">
            <polygon points="0,55 80,10 160,55 160,140 0,140" fill="#063E22" stroke="#FFFFFF" stroke-width="3" />
            <rect x="45" y="75" width="40" height="45" fill="#FF007F" />
          </g>
        </svg>
      </motion.div>

      {/* Dark Vignette Overlay for High Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#021D0E]/80 via-[#04331C]/60 to-[#02180D]/85 backdrop-blur-[2px]" />
    </div>
  );
}
