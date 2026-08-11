"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function GoaBeachBackground() {
  // Smooth spring physics for fluid mouse & touch parallax movement
  const springConfig = { damping: 30, stiffness: 100 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  // Parallax displacement
  const translateX = useTransform(mouseX, [-0.5, 0.5], [-25, 25]);
  const translateY = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);

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
      {/* Base Deep Emerald Forest Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#021F11] via-[#04331C] to-[#02180D]" />

      {/* Ambient Radial Sunshine Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#FFDE00] rounded-full blur-[200px] opacity-15" />

      {/* Moveable Parallax Poster Artwork Container */}
      <motion.div
        style={{
          x: translateX,
          y: translateY,
          scale: 1.05,
        }}
        className="absolute inset-0 w-full h-full"
      >
        <svg
          className="w-full h-full object-cover opacity-50 sm:opacity-55"
          viewBox="0 0 1200 1400"
          preserveAspectRatio="xMidYMin slice"
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

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* TOP SECTION: OFFICIAL HACKER HOUSE GOA POSTER HEADER */}
          <g transform="translate(0, 60)">
            {/* Tall Yellow Serif "HACKER HOUSE" Title Vector */}
            <g fill="#FFDE00" filter="url(#softGlow)">
              {/* H */}
              <path d="M 60 40 H 90 V 100 H 150 V 40 H 180 V 180 H 150 V 120 H 90 V 180 H 60 Z" />
              {/* A */}
              <path d="M 200 180 L 245 40 H 275 L 320 180 H 290 L 278 140 H 242 L 230 180 Z M 250 115 H 270 L 260 80 Z" />
              {/* C */}
              <path d="M 400 65 Q 360 40 335 80 V 140 Q 360 180 400 155 V 125 Q 380 140 365 125 V 95 Q 380 80 400 95 Z" />
              {/* K */}
              <path d="M 425 40 H 455 V 100 L 495 40 H 530 L 475 110 L 535 180 H 500 L 455 120 V 180 H 425 Z" />
              {/* E */}
              <path d="M 550 40 H 620 V 68 H 580 V 95 H 615 V 122 H 580 V 152 H 620 V 180 H 550 Z" />
              {/* R */}
              <path d="M 640 40 H 695 Q 725 40 725 75 Q 725 105 695 105 H 670 V 180 H 640 Z M 670 65 V 85 H 692 Q 700 85 700 75 Q 700 65 692 65 Z M 690 105 L 730 180 H 698 L 665 115 Z" />

              {/* HOUSE (Right Block) */}
              {/* H */}
              <path d="M 750 40 H 780 V 100 H 840 V 40 H 870 V 180 H 840 V 120 H 780 V 180 H 750 Z" />
              {/* O */}
              <path d="M 890 110 Q 890 40 940 40 Q 990 40 990 110 Q 990 180 940 180 Q 890 180 890 110 Z M 920 110 Q 920 155 940 155 Q 960 155 960 110 Q 960 65 940 65 Q 920 65 920 110 Z" />
              {/* U */}
              <path d="M 1010 40 H 1040 V 135 Q 1040 155 1060 155 Q 1080 155 1080 135 V 40 H 1110 V 135 Q 1110 180 1060 180 Q 1010 180 1010 135 Z" />
              {/* S */}
              <path d="M 1130 150 Q 1145 180 1180 170 Q 1205 160 1195 135 Q 1185 115 1155 110 Q 1130 105 1130 80 Q 1130 40 1175 40 Q 1200 40 1215 65 L 1195 80 Q 1185 62 1170 62 Q 1155 62 1155 78 Q 1155 90 1175 95 Q 1220 105 1220 140 Q 1220 185 1170 185 Q 1135 185 1110 155 Z" />
            </g>

            {/* Hot Pink Central Devanagari Badge "गोवा" */}
            <g transform="translate(525, 65)">
              <rect x="0" y="0" width="150" height="70" rx="22" fill="#FF007F" stroke="#FFFFFF" strokeWidth="4" />
              <g transform="translate(22, 16)">
                <path d="M 0 4 H 108" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 14 4 V 28 Q 14 34 7 34 Q 0 34 0 28 Q 0 22 7 22 H 14 M 30 4 V 38" fill="none" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 46 4 V 38 M 30 4 Q 40 -10 50 -5" fill="none" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 68 4 V 38 M 68 22 Q 68 12 78 12 Q 88 12 88 22 Q 88 32 78 32 Q 68 32 68 22 M 100 4 V 38" fill="none" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>

            {/* Subtext: GOA, INDIA • 28 - 31 OCT 2026 */}
            <text x="60" y="225" fontFamily="monospace" fontWeight="700" fontSize="14" fill="#FFDE00" letterSpacing="2">
              GOA, INDIA  •  28 - 31 OCT 2026
            </text>
          </g>

          {/* BOTTOM SECTION: TROPICAL BEACH SUNSET ARTWORK */}
          <g transform="translate(0, 360)">
            {/* Rising Sun */}
            <circle cx="600" cy="450" r="180" fill="url(#sunGlow)" filter="url(#softGlow)" />

            {/* Sun Rays */}
            <g stroke="#FFDE00" strokeWidth="5" strokeLinecap="round">
              <line x1="600" y1="230" x2="600" y2="130" />
              <line x1="475" y1="275" x2="410" y2="200" />
              <line x1="725" y1="275" x2="790" y2="200" />
              <line x1="375" y1="375" x2="290" y2="335" />
              <line x1="825" y1="375" x2="910" y2="335" />
              <line x1="330" y1="510" x2="230" y2="510" />
              <line x1="870" y1="510" x2="970" y2="510" />
            </g>

            {/* Hills */}
            <path d="M 0 540 Q 300 480 600 520 Q 900 480 1200 540 V 1040 H 0 Z" fill="#054426" />

            {/* Ocean */}
            <path d="M 0 560 Q 300 540 600 560 Q 900 540 1200 560 V 1040 H 0 Z" fill="url(#oceanGrad)" />

            {/* Shoreline */}
            <path d="M 0 720 Q 300 680 600 710 Q 900 680 1200 720 V 1040 H 0 Z" fill="#F0F7F2" opacity="0.95" />
            <path d="M 0 720 Q 300 680 600 710 Q 900 680 1200 720" fill="none" stroke="#FFFFFF" strokeWidth="8" />

            {/* Beach Shack "GOA BEACH" */}
            <g transform="translate(760, 640)">
              <rect x="0" y="45" width="140" height="95" fill="#064426" stroke="#FFFFFF" strokeWidth="3" />
              <polygon points="-15,45 70,10 155,45" fill="#032D19" stroke="#FFFFFF" strokeWidth="3" />
              <rect x="20" y="-5" width="100" height="26" rx="6" fill="#FF007F" stroke="#FFFFFF" strokeWidth="2" />
              <text x="70" y="13" fontFamily="sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF" textAnchor="middle">GOA BEACH</text>
              <path d="M -25 55 Q -15 25 -30 115" stroke="#FFDE00" strokeWidth="9" strokeLinecap="round" />
              <path d="M -10 50 Q 0 20 -15 115" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
            </g>

            {/* Left Palm Trees */}
            <g transform="translate(60, 240)">
              <path d="M 60 520 Q 120 300 20 0" fill="none" stroke="#FFDE00" strokeWidth="16" strokeLinecap="round" />
              <path d="M 60 520 Q 120 300 20 0" fill="none" stroke="#064426" strokeWidth="9" strokeLinecap="round" />
              <g transform="translate(20, 0)">
                <path d="M 0 0 Q -90 -45 -135 45 Q -45 22 0 0 M 0 0 Q -45 -90 45 -110 Q 22 -22 0 0 M 0 0 Q 90 -65 135 22 Q 45 11 0 0 M 0 0 Q 110 45 90 110 Q 35 45 0 0" fill="#0A5C36" stroke="#FFDE00" strokeWidth="3.5" />
              </g>
            </g>

            {/* Right Palm Trees */}
            <g transform="translate(1040, 240)">
              <path d="M 20 520 Q -40 300 60 0" fill="none" stroke="#FFDE00" strokeWidth="16" strokeLinecap="round" />
              <path d="M 20 520 Q -40 300 60 0" fill="none" stroke="#064426" strokeWidth="9" strokeLinecap="round" />
              <g transform="translate(60, 0)">
                <path d="M 0 0 Q 90 -45 135 45 Q 45 22 0 0 M 0 0 Q 45 -90 -45 -110 Q -22 -22 0 0 M 0 0 Q -90 -65 -135 22 Q -45 11 0 0 M 0 0 Q -110 45 -90 110 Q -35 45 0 0" fill="#0A5C36" stroke="#FFDE00" strokeWidth="3.5" />
              </g>
            </g>

            {/* Beach Houses */}
            <g transform="translate(140, 720)">
              <polygon points="0,65 90,12 180,65 180,180 0,180" fill="#063E22" stroke="#FFFFFF" strokeWidth="3.5" />
              <rect x="45" y="90" width="45" height="55" fill="#FFDE00" />
            </g>

            <g transform="translate(540, 730)">
              <polygon points="0,65 95,12 190,65 190,170 0,170" fill="#063E22" stroke="#FFFFFF" strokeWidth="3.5" />
              <rect x="55" y="90" width="45" height="55" fill="#FF007F" />
            </g>
          </g>
        </svg>
      </motion.div>

      {/* Dark Vignette Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02190E]/60 via-[#04331C]/45 to-[#02180D]/70 backdrop-blur-[3px]" />
    </div>
  );
}
