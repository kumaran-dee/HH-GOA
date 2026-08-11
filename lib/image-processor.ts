import sharp from "sharp";
import { renderVectorText } from "./svg-vector-text";

export interface GeneratePfpOptions {
  imageBuffer: Buffer;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  frameStyle?: "emerald-goa" | "sunshine-yellow" | "sunset-pink" | "vip-beach";
}

export interface GenerateBuilderCardOptions {
  imageBuffer: Buffer;
  name: string;
  role: string;
  title: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

/**
 * Generate Format A: HH Goa 2026 Profile Picture Frame (1024x1024 PNG)
 */
export async function generatePfpFrame(options: GeneratePfpOptions): Promise<Buffer> {
  const { imageBuffer, scale = 1, offsetX = 0, offsetY = 0, frameStyle = "emerald-goa" } = options;

  const targetSize = 1024;

  const userImg = sharp(imageBuffer);
  const metadata = await userImg.metadata();
  const srcW = metadata.width || targetSize;
  const srcH = metadata.height || targetSize;

  const minDim = Math.min(srcW, srcH) / scale;
  const cropW = Math.round(minDim);
  const cropH = Math.round(minDim);

  const baseLeft = Math.round((srcW - cropW) / 2);
  const baseTop = Math.round((srcH - cropH) / 2);

  const left = Math.max(0, Math.min(srcW - cropW, Math.round(baseLeft - offsetX * srcW)));
  const top = Math.max(0, Math.min(srcH - cropH, Math.round(baseTop - offsetY * srcH)));

  const croppedUserBuffer = await userImg
    .extract({ left, top, width: cropW, height: cropH })
    .resize(targetSize, targetSize, { fit: "cover" })
    .png()
    .toBuffer();

  const frameSvg = getPfpFrameSvg(frameStyle, targetSize);

  const finalImage = await sharp(croppedUserBuffer)
    .composite([
      {
        input: Buffer.from(frameSvg),
        top: 0,
        left: 0,
      },
    ])
    .png({ quality: 95 })
    .toBuffer();

  return finalImage;
}

/**
 * Generate Format B: HH Goa 2026 Builder ID Card (1200x630 PNG)
 */
export async function generateBuilderCard(options: GenerateBuilderCardOptions): Promise<Buffer> {
  const { imageBuffer, name, role, title, scale = 1, offsetX = 0, offsetY = 0 } = options;

  const cardW = 1200;
  const cardH = 630;

  // Process Avatar (360x360 circle crop)
  const avatarSize = 360;
  const userImg = sharp(imageBuffer);
  const metadata = await userImg.metadata();
  const srcW = metadata.width || avatarSize;
  const srcH = metadata.height || avatarSize;

  const minDim = Math.min(srcW, srcH) / scale;
  const cropW = Math.round(minDim);
  const cropH = Math.round(minDim);

  const baseLeft = Math.round((srcW - cropW) / 2);
  const baseTop = Math.round((srcH - cropH) / 2);

  const left = Math.max(0, Math.min(srcW - cropW, Math.round(baseLeft - offsetX * srcW)));
  const top = Math.max(0, Math.min(srcH - cropH, Math.round(baseTop - offsetY * srcH)));

  const resizedAvatar = await userImg
    .extract({ left, top, width: cropW, height: cropH })
    .resize(avatarSize, avatarSize, { fit: "cover" })
    .png()
    .toBuffer();

  const circleMask = Buffer.from(
    `<svg width="${avatarSize}" height="${avatarSize}">
      <circle cx="${avatarSize / 2}" cy="${avatarSize / 2}" r="${avatarSize / 2}" fill="#fff"/>
    </svg>`
  );

  const circularAvatar = await sharp(resizedAvatar)
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const cardSvg = getBuilderCardSvg({
    width: cardW,
    height: cardH,
    name: name || "BUILDER",
    role: role || "FULL STACK",
    title: title || "CHAI-POWERED CODE WIZARD",
  });

  const avatarLeft = 80;
  const avatarTop = 135;

  const avatarBorderSvg = Buffer.from(
    `<svg width="${avatarSize + 20}" height="${avatarSize + 20}">
      <circle cx="${(avatarSize + 20) / 2}" cy="${(avatarSize + 20) / 2}" r="${(avatarSize + 14) / 2}" fill="none" stroke="#FFDE00" stroke-width="8"/>
    </svg>`
  );

  const finalCard = await sharp(Buffer.from(cardSvg))
    .composite([
      {
        input: avatarBorderSvg,
        left: avatarLeft - 10,
        top: avatarTop - 10,
      },
      {
        input: circularAvatar,
        left: avatarLeft,
        top: avatarTop,
      },
    ])
    .png({ quality: 95 })
    .toBuffer();

  return finalCard;
}

/**
 * Devanagari "गोवा" Hot Pink SVG Vector Badge Component
 */
function getDevanagariGoaBadge(x: number, y: number, scale = 1): string {
  return `
  <g transform="translate(${x}, ${y}) scale(${scale})">
    <!-- Hot Pink Rounded Badge Container -->
    <rect x="0" y="0" width="130" height="52" rx="14" fill="#FF007F" stroke="#FFFFFF" stroke-width="3" />
    
    <!-- Devanagari Script 'गोवा' Vector Path -->
    <g transform="translate(18, 12)">
      <!-- शिरोरेखा (Top Bar) -->
      <path d="M 0 4 H 94" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" />

      <!-- 'ग' Character -->
      <path d="M 12 4 V 24 Q 12 30 6 30 Q 0 30 0 24 Q 0 18 6 18 H 12 M 26 4 V 32" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- 'ो' Matra -->
      <path d="M 40 4 V 32 M 26 4 Q 34 -8 42 -4" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" />

      <!-- 'वा' Character -->
      <path d="M 58 4 V 32 M 58 18 Q 58 10 68 10 Q 78 10 78 18 Q 78 26 68 26 Q 58 26 58 18 M 88 4 V 32" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  </g>
  `;
}

/**
 * Format A: SVG Overlay for PFP Frames (Official Emerald Green Theme)
 */
function getPfpFrameSvg(style: string, size: number): string {
  const strokeWidth = 36;

  let frameBorderColor = "#FFDE00"; // Official Sunshine Yellow
  let tagBgColor = "#FF007F";       // Hot Pink

  if (style === "sunshine-yellow") {
    frameBorderColor = "#FFDE00";
    tagBgColor = "#054726";
  } else if (style === "sunset-pink") {
    frameBorderColor = "#FF007F";
    tagBgColor = "#FFDE00";
  } else if (style === "vip-beach") {
    frameBorderColor = "#00F2FE";
    tagBgColor = "#FF007F";
  }

  // Pure SVG vector text elements
  const topVectorText = renderVectorText({
    text: "GOA, INDIA • 28 - 31 OCT 2026",
    x: size / 2,
    y: 56,
    fontSize: 16,
    stroke: "#FFDE00",
    strokeWidth: 2.8,
    letterSpacing: 3,
    align: "center",
  });

  const mainTitleVectorText = renderVectorText({
    text: "HACKER HOUSE",
    x: size / 2 - 270,
    y: size - 122,
    fontSize: 28,
    stroke: "#FFDE00",
    strokeWidth: 3.8,
    letterSpacing: 4,
    align: "left",
  });

  const subTitleVectorText = renderVectorText({
    text: "2:47 PM STUDIO • OFFICIAL ATTENDEE",
    x: size / 2 - 270,
    y: size - 82,
    fontSize: 14,
    stroke: "#FFFFFF",
    strokeWidth: 2.4,
    letterSpacing: 2,
    align: "left",
  });

  const tagVectorText = renderVectorText({
    text: "#FRAMEINGOA",
    x: size / 2 + 235,
    y: size - 105,
    fontSize: 16,
    stroke: "#FFFFFF",
    strokeWidth: 3.0,
    letterSpacing: 2,
    align: "center",
  });

  const goaBadge = getDevanagariGoaBadge(size / 2 - 40, size - 145, 1.1);

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Base Shadow -->
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Outer Frame Border (Official Sunshine Yellow / Hot Pink Theme) -->
    <rect x="${strokeWidth / 2}" y="${strokeWidth / 2}" width="${size - strokeWidth}" height="${size - strokeWidth}" 
          rx="52" fill="none" stroke="${frameBorderColor}" stroke-width="${strokeWidth}" />

    <!-- Corner Tropical Palm Leaves -->
    <g transform="translate(60, 60)">
      <path d="M 0 0 Q 30 10 50 40 Q 20 40 0 0 M 0 0 Q 10 30 40 50 Q 40 20 0 0" fill="#0A5C36" stroke="#FFDE00" stroke-width="3"/>
    </g>
    <g transform="translate(${size - 110}, 60)">
      <path d="M 50 0 Q 20 10 0 40 Q 30 40 50 0 M 50 0 Q 40 30 10 50 Q 10 20 50 0" fill="#0A5C36" stroke="#FFDE00" stroke-width="3"/>
    </g>

    <!-- Top Date Badge -->
    <g transform="translate(${size / 2 - 180}, 44)">
      <rect x="0" y="0" width="360" height="48" rx="24" fill="#054726" stroke="#FFDE00" stroke-width="2" />
    </g>
    ${topVectorText}

    <!-- Bottom Prominent Event Banner Badge -->
    <g transform="translate(${size / 2 - 340}, ${size - 155})" filter="url(#shadow)">
      <!-- Main Emerald Green Container -->
      <rect x="0" y="0" width="680" height="110" rx="30" fill="#063D23" stroke="#FFDE00" stroke-width="4" />

      <!-- Hashtag Pill -->
      <g transform="translate(470, 28)">
        <rect x="0" y="0" width="180" height="54" rx="20" fill="${tagBgColor}" stroke="#FFFFFF" stroke-width="2"/>
      </g>
    </g>

    <!-- Devanagari Hot Pink गोवा Badge -->
    ${goaBadge}

    <!-- Vector Typography Layer -->
    ${mainTitleVectorText}
    ${subTitleVectorText}
    ${tagVectorText}
  </svg>
  `;
}

/**
 * Format B: SVG Layout for Builder ID Card (Official Hacker House Goa Green Beach Theme)
 */
function getBuilderCardSvg(params: {
  width: number;
  height: number;
  name: string;
  role: string;
  title: string;
}): string {
  const { width, height, name, role, title } = params;

  const nameVectorText = renderVectorText({
    text: name,
    x: 480,
    y: 200,
    fontSize: 32,
    stroke: "#FFFFFF",
    strokeWidth: 4.0,
    letterSpacing: 2,
    align: "left",
  });

  const roleVectorText = renderVectorText({
    text: role,
    x: 560,
    y: 268,
    fontSize: 16,
    stroke: "#0A5C36",
    strokeWidth: 2.8,
    letterSpacing: 2,
    align: "center",
  });

  const titleHeaderVectorText = renderVectorText({
    text: "BUILDER TITLE",
    x: 480,
    y: 330,
    fontSize: 12,
    stroke: "#FFDE00",
    strokeWidth: 2.0,
    letterSpacing: 2,
    align: "left",
  });

  const titleVectorText = renderVectorText({
    text: `⚡ ${title}`,
    x: 504,
    y: 374,
    fontSize: 18,
    stroke: "#FFDE00",
    strokeWidth: 2.8,
    letterSpacing: 2,
    align: "left",
  });

  const footerDatesVectorText = renderVectorText({
    text: "GOA, INDIA • 28 - 31 OCT 2026",
    x: 80,
    y: 540,
    fontSize: 14,
    stroke: "#FFDE00",
    strokeWidth: 2.5,
    letterSpacing: 2,
    align: "left",
  });

  const tagVectorText = renderVectorText({
    text: "#FRAMEINGOA",
    x: width - 150,
    y: 538,
    fontSize: 16,
    stroke: "#FFFFFF",
    strokeWidth: 2.8,
    letterSpacing: 2,
    align: "center",
  });

  const headerTitleText = renderVectorText({
    text: "HACKER HOUSE",
    x: 480,
    y: 85,
    fontSize: 26,
    stroke: "#FFDE00",
    strokeWidth: 3.5,
    letterSpacing: 3,
    align: "left",
  });

  const headerSubText = renderVectorText({
    text: "OFFICIAL BUILDER PASS",
    x: 740,
    y: 125,
    fontSize: 12,
    stroke: "#FFFFFF",
    strokeWidth: 2.2,
    letterSpacing: 2,
    align: "left",
  });

  const goaBadge = getDevanagariGoaBadge(700, 60, 0.9);

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#042917" />
        <stop offset="50%" stop-color="#063D23" />
        <stop offset="100%" stop-color="#0A5C36" />
      </linearGradient>

      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#054726" opacity="0.95" />
        <stop offset="100%" stop-color="#022B17" opacity="0.95" />
      </linearGradient>
    </defs>

    <!-- Base Background: Official Emerald Green Theme -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Tropical Sun Ray Background Graphics -->
    <circle cx="200" cy="100" r="160" fill="#FFDE00" opacity="0.12" />
    <path d="M 0 500 Q 300 420 600 520 Q 900 600 1200 480 V 630 H 0 Z" fill="#0A5C36" opacity="0.4"/>

    <!-- Decorative Top & Bottom Borders -->
    <rect x="0" y="0" width="${width}" height="12" fill="#FFDE00" />
    <rect x="0" y="${height - 12}" width="${width}" height="12" fill="#FFDE00" />

    <!-- Main Glass Card Container -->
    <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="32" fill="url(#cardGrad)" stroke="#FFDE00" stroke-width="3" />

    <!-- Role Badge Pill -->
    <g transform="translate(480, 245)">
      <rect width="160" height="38" rx="14" fill="#FFDE00" />
    </g>

    <!-- Builder Title Container -->
    <g transform="translate(480, 345)">
      <rect width="610" height="52" rx="16" fill="#021C0E" stroke="#FF007F" stroke-width="2" />
    </g>

    <!-- Bottom Hashtag Pill -->
    <g transform="translate(${width - 240}, 515)">
      <rect width="180" height="42" rx="14" fill="#FF007F" stroke="#FFFFFF" stroke-width="2"/>
    </g>

    <!-- Devanagari Hot Pink गोवा Badge -->
    ${goaBadge}

    <!-- Vector Typography Layers -->
    ${headerTitleText}
    ${headerSubText}
    ${nameVectorText}
    ${roleVectorText}
    ${titleHeaderVectorText}
    ${titleVectorText}
    ${footerDatesVectorText}
    ${tagVectorText}
  </svg>
  `;
}
