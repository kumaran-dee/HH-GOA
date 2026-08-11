"use client";

export default function GoaBeachBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Rich Forest Green Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06381F] via-[#084D2B] to-[#042816]" />

      {/* SVG Vector Illustration matching the official Hacker House Goa Beach Banner */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-35 sm:opacity-40"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#095B34" />
            <stop offset="100%" stopColor="#053B21" />
          </linearGradient>

          <linearGradient id="sunGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFDE00" />
            <stop offset="100%" stopColor="#FFA800" />
          </linearGradient>
        </defs>

        {/* Rising Sunshine Yellow Sun */}
        <circle cx="720" cy="420" r="160" fill="url(#sunGlow)" />
        
        {/* Radiating Sun Rays */}
        <g stroke="#FFDE00" strokeWidth="4" strokeLinecap="round">
          <line x1="720" y1="210" x2="720" y2="130" />
          <line x1="610" y1="250" x2="560" y2="190" />
          <line x1="830" y1="250" x2="880" y2="190" />
          <line x1="515" y1="340" x2="445" y2="305" />
          <line x1="925" y1="340" x2="995" y2="305" />
          <line x1="470" y1="465" x2="390" y2="465" />
          <line x1="970" y1="465" x2="1050" y2="465" />
        </g>

        {/* Distant Hills / Islands */}
        <path d="M 180 500 Q 340 450 480 490 Q 600 480 720 500 Q 900 460 1100 490 Q 1280 440 1440 490 V 900 H 0 Z" fill="#074426" />

        {/* Green Ocean Layer */}
        <path d="M 0 510 Q 360 490 720 510 Q 1080 490 1440 510 V 900 H 0 Z" fill="url(#oceanGrad)" />

        {/* Ocean Wave Reflections */}
        <path d="M 640 530 H 800 M 600 550 H 840 M 560 570 H 880 M 520 590 H 920 M 480 610 H 960" stroke="#FFDE00" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

        {/* White Sand Shoreline */}
        <path d="M 0 650 Q 360 610 720 640 Q 1080 610 1440 650 V 900 H 0 Z" fill="#E8F4EC" opacity="0.9" />

        {/* Shore Wave Outlines */}
        <path d="M 0 650 Q 360 610 720 640 Q 1080 610 1440 650" fill="none" stroke="#FFFFFF" strokeWidth="6" />

        {/* Coastal Beach Shack "GOA BEACH" */}
        <g transform="translate(920, 580)">
          {/* Shack Structure */}
          <rect x="0" y="40" width="130" height="90" fill="#074828" stroke="#FFFFFF" strokeWidth="3" />
          {/* Roof */}
          <polygon points="-15,40 65,10 145,40" fill="#042F1A" stroke="#FFFFFF" strokeWidth="3" />
          {/* Hot Pink Signboard */}
          <rect x="15" y="-5" width="100" height="25" rx="6" fill="#FF007F" stroke="#FFFFFF" strokeWidth="2" />
          <text x="65" y="12" fontFamily="sans-serif" fontWeight="900" fontSize="11" fill="#FFFFFF" textAnchor="middle">GOA BEACH</text>
          {/* Surfboards */}
          <path d="M -25 50 Q -15 20 -30 110" stroke="#FFDE00" strokeWidth="8" strokeLinecap="round" />
          <path d="M -10 45 Q 0 15 -15 110" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* Left Palm Trees */}
        <g transform="translate(40, 180)">
          {/* Palm Trunk */}
          <path d="M 60 480 Q 120 280 20 0" fill="none" stroke="#FFDE00" strokeWidth="14" strokeLinecap="round" />
          <path d="M 60 480 Q 120 280 20 0" fill="none" stroke="#074828" strokeWidth="8" strokeLinecap="round" />
          {/* Fronds */}
          <g transform="translate(20, 0)">
            <path d="M 0 0 Q -80 -40 -120 40 Q -40 20 0 0 M 0 0 Q -40 -80 40 -100 Q 20 -20 0 0 M 0 0 Q 80 -60 120 20 Q 40 10 0 0 M 0 0 Q 100 40 80 100 Q 30 40 0 0" fill="#0A5C36" stroke="#FFDE00" strokeWidth="3" />
          </g>
        </g>

        <g transform="translate(340, 440)">
          {/* Second Palm Trunk */}
          <path d="M 40 260 Q 80 140 10 0" fill="none" stroke="#FFDE00" strokeWidth="10" strokeLinecap="round" />
          <path d="M 40 260 Q 80 140 10 0" fill="none" stroke="#074828" strokeWidth="6" strokeLinecap="round" />
          {/* Fronds */}
          <g transform="translate(10, 0)">
            <path d="M 0 0 Q -60 -30 -90 30 Q -30 15 0 0 M 0 0 Q -30 -60 30 -75 Q 15 -15 0 0 M 0 0 Q 60 -45 90 15 Q 30 8 0 0" fill="#0A5C36" stroke="#FFDE00" strokeWidth="2.5" />
          </g>
        </g>

        {/* Right Palm Trees */}
        <g transform="translate(1260, 180)">
          {/* Palm Trunk */}
          <path d="M 20 480 Q -40 280 60 0" fill="none" stroke="#FFDE00" strokeWidth="14" strokeLinecap="round" />
          <path d="M 20 480 Q -40 280 60 0" fill="none" stroke="#074828" strokeWidth="8" strokeLinecap="round" />
          {/* Fronds */}
          <g transform="translate(60, 0)">
            <path d="M 0 0 Q 80 -40 120 40 Q 40 20 0 0 M 0 0 Q 40 -80 -40 -100 Q -20 -20 0 0 M 0 0 Q -80 -60 -120 20 Q -40 10 0 0 M 0 0 Q -100 40 -80 100 Q -30 40 0 0" fill="#0A5C36" stroke="#FFDE00" strokeWidth="3" />
          </g>
        </g>

        {/* Coastal Village Houses at Bottom */}
        <g transform="translate(120, 640)">
          <polygon points="0,60 80,10 160,60 160,160 0,160" fill="#063E22" stroke="#FFFFFF" strokeWidth="3" />
          <rect x="40" y="80" width="40" height="50" fill="#FFDE00" />
        </g>

        <g transform="translate(620, 650)">
          <polygon points="0,60 90,10 180,60 180,150 0,150" fill="#063E22" stroke="#FFFFFF" strokeWidth="3" />
          <rect x="50" y="80" width="40" height="50" fill="#FF007F" />
        </g>
      </svg>

      {/* Dark Vignette Overlay for Crisp Readability */}
      <div className="absolute inset-0 bg-[#06381F]/40 backdrop-blur-[2px]" />
    </div>
  );
}
