import sharp from "sharp";
import { renderVectorText, generateVectorBarcode } from "./svg-vector-text";

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
 * Generate Format B: Official Aadhaar / Government ID Style Builder Pass Card (1200x630 PNG)
 */
export async function generateBuilderCard(options: GenerateBuilderCardOptions): Promise<Buffer> {
  const { imageBuffer, name, role, title, scale = 1, offsetX = 0, offsetY = 0 } = options;

  const cardW = 1200;
  const cardH = 630;

  // Process Rectangular Portrait Photo for Aadhaar ID Card (300x380)
  const photoW = 300;
  const photoH = 380;

  const userImg = sharp(imageBuffer);
  const metadata = await userImg.metadata();
  const srcW = metadata.width || photoW;
  const srcH = metadata.height || photoH;

  const cropW = Math.round((photoW * (srcH / photoH)) / scale);
  const cropH = Math.round(srcH / scale);

  const baseLeft = Math.round((srcW - cropW) / 2);
  const baseTop = Math.round((srcH - cropH) / 2);

  const left = Math.max(0, Math.min(srcW - cropW, Math.round(baseLeft - offsetX * srcW)));
  const top = Math.max(0, Math.min(srcH - cropH, Math.round(baseTop - offsetY * srcH)));

  const resizedPhoto = await userImg
    .extract({ left, top, width: Math.min(srcW, cropW), height: Math.min(srcH, cropH) })
    .resize(photoW, photoH, { fit: "cover" })
    .png()
    .toBuffer();

  // Create Rounded Rectangle Mask for Photo
  const photoMask = Buffer.from(
    `<svg width="${photoW}" height="${photoH}">
      <rect width="${photoW}" height="${photoH}" rx="16" fill="#fff"/>
    </svg>`
  );

  const maskedPhoto = await sharp(resizedPhoto)
    .composite([{ input: photoMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const cardSvg = getAadhaarBuilderCardSvg({
    width: cardW,
    height: cardH,
    name: name || "BUILDER",
    role: role || "FULL STACK",
    title: title || "CHAI-POWERED CODE WIZARD",
  });

  const photoLeft = 80;
  const photoTop = 150;

  // Photo Border Frame
  const photoBorderSvg = Buffer.from(
    `<svg width="${photoW + 12}" height="${photoH + 12}">
      <rect width="${photoW + 12}" height="${photoH + 12}" rx="20" fill="none" stroke="#FFDE00" stroke-width="6"/>
    </svg>`
  );

  const finalCard = await sharp(Buffer.from(cardSvg))
    .composite([
      {
        input: photoBorderSvg,
        left: photoLeft - 6,
        top: photoTop - 6,
      },
      {
        input: maskedPhoto,
        left: photoLeft,
        top: photoTop,
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
    <rect x="0" y="0" width="130" height="52" rx="14" fill="#FF007F" stroke="#FFFFFF" stroke-width="3" />
    <g transform="translate(18, 12)">
      <path d="M 0 4 H 94" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 12 4 V 24 Q 12 30 6 30 Q 0 30 0 24 Q 0 18 6 18 H 12 M 26 4 V 32" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 40 4 V 32 M 26 4 Q 34 -8 42 -4" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" />
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

  let frameBorderColor = "#FFDE00";
  let tagBgColor = "#FF007F";

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
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Outer Frame Border -->
    <rect x="${strokeWidth / 2}" y="${strokeWidth / 2}" width="${size - strokeWidth}" height="${size - strokeWidth}" 
          rx="52" fill="none" stroke="${frameBorderColor}" stroke-width="${strokeWidth}" />

    <!-- Corner Tropical Accents -->
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

    <!-- Bottom Event Banner Badge -->
    <g transform="translate(${size / 2 - 340}, ${size - 155})" filter="url(#shadow)">
      <rect x="0" y="0" width="680" height="110" rx="30" fill="#063D23" stroke="#FFDE00" stroke-width="4" />
      <g transform="translate(470, 28)">
        <rect x="0" y="0" width="180" height="54" rx="20" fill="${tagBgColor}" stroke="#FFFFFF" stroke-width="2"/>
      </g>
    </g>

    ${goaBadge}

    ${mainTitleVectorText}
    ${subTitleVectorText}
    ${tagVectorText}
  </svg>
  `;
}

/**
 * Format B: Official Aadhaar / National ID Card Style Layout (Hacker House Goa Edition)
 */
function getAadhaarBuilderCardSvg(params: {
  width: number;
  height: number;
  name: string;
  role: string;
  title: string;
}): string {
  const { width, height, name, role, title } = params;

  // Header Banner Typography
  const headerGovText = renderVectorText({
    text: "HACKER HOUSE GOA 2026",
    x: 340,
    y: 55,
    fontSize: 22,
    stroke: "#FFDE00",
    strokeWidth: 3.2,
    letterSpacing: 3,
    align: "left",
  });

  const headerSubGovText = renderVectorText({
    text: "GOVERNMENT OF BUILDERS • OFFICIAL ID PASS",
    x: 340,
    y: 85,
    fontSize: 12,
    stroke: "#FFFFFF",
    strokeWidth: 2.2,
    letterSpacing: 2,
    align: "left",
  });

  // Card Content Labels & Values
  const nameLabelText = renderVectorText({
    text: "NAME / नाम:",
    x: 420,
    y: 165,
    fontSize: 12,
    stroke: "#FFDE00",
    strokeWidth: 2.0,
    letterSpacing: 2,
    align: "left",
  });

  const nameValText = renderVectorText({
    text: name,
    x: 420,
    y: 195,
    fontSize: 28,
    stroke: "#FFFFFF",
    strokeWidth: 3.8,
    letterSpacing: 2,
    align: "left",
  });

  const roleLabelText = renderVectorText({
    text: "STACK & ROLE / भूमिका:",
    x: 420,
    y: 250,
    fontSize: 12,
    stroke: "#FFDE00",
    strokeWidth: 2.0,
    letterSpacing: 2,
    align: "left",
  });

  const roleValText = renderVectorText({
    text: role,
    x: 420,
    y: 280,
    fontSize: 18,
    stroke: "#0A5C36",
    strokeWidth: 2.8,
    letterSpacing: 2,
    align: "left",
  });

  const titleLabelText = renderVectorText({
    text: "BUILDER TITLE / उपाधि:",
    x: 420,
    y: 335,
    fontSize: 12,
    stroke: "#FFDE00",
    strokeWidth: 2.0,
    letterSpacing: 2,
    align: "left",
  });

  const titleValText = renderVectorText({
    text: `⚡ ${title}`,
    x: 420,
    y: 365,
    fontSize: 16,
    stroke: "#FF007F",
    strokeWidth: 2.8,
    letterSpacing: 2,
    align: "left",
  });

  // Aadhaar ID Number Generator Format: 2026 8899 4411
  const aadhaarNumber = `2026  8899  ${Math.floor(1000 + Math.random() * 9000)}`;

  const numberValText = renderVectorText({
    text: aadhaarNumber,
    x: width / 2,
    y: 472,
    fontSize: 26,
    stroke: "#FFDE00",
    strokeWidth: 3.8,
    letterSpacing: 6,
    align: "center",
  });

  const datesFooterText = renderVectorText({
    text: "ANJUNA BEACH, GOA • 28 - 31 OCT 2026",
    x: 60,
    y: 565,
    fontSize: 12,
    stroke: "#FFFFFF",
    strokeWidth: 2.2,
    letterSpacing: 2,
    align: "left",
  });

  const tagFooterText = renderVectorText({
    text: "#FRAMEINGOA",
    x: width - 150,
    y: 565,
    fontSize: 14,
    stroke: "#FFFFFF",
    strokeWidth: 2.6,
    letterSpacing: 2,
    align: "center",
  });

  const goaBadge = getDevanagariGoaBadge(width - 200, 48, 0.9);
  const barcode = generateVectorBarcode(70, 460, 280, 40, "#FFDE00");

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#042917" />
        <stop offset="50%" stop-color="#063D23" />
        <stop offset="100%" stop-color="#0A5C36" />
      </linearGradient>

      <!-- Ashoka Emblem / Sun Emblem Gradient -->
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFDE00" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#042917" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Outer Card Background -->
    <rect width="${width}" height="${height}" fill="url(#cardBg)" />

    <!-- Card Outer Border -->
    <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="24" fill="none" stroke="#FFDE00" stroke-width="4" />

    <!-- Top Tricolor Banner Accent -->
    <rect x="24" y="24" width="${width - 48}" height="8" fill="#FFDE00" />
    <rect x="24" y="112" width="${width - 48}" height="4" fill="#FF007F" />

    <!-- Background Watermark Sun Emblem -->
    <circle cx="${width / 2}" cy="${height / 2}" r="220" fill="url(#sunGlow)" />

    <!-- Top Header Section Background -->
    <rect x="24" y="32" width="${width - 48}" height="80" fill="#021C0E" opacity="0.9" />

    <!-- Official Sun / Chakra Emblem Icon -->
    <g transform="translate(65, 42)">
      <circle cx="30" cy="30" r="28" fill="none" stroke="#FFDE00" stroke-width="3" stroke-dasharray="4,3" />
      <circle cx="30" cy="30" r="14" fill="none" stroke="#FFDE00" stroke-width="2" />
      <path d="M 30 2 L 30 58 M 2 30 L 58 30 M 10 10 L 50 50 M 10 50 L 50 10" stroke="#FFDE00" stroke-width="1.5" />
    </g>

    <!-- Role Value Pill Box -->
    <rect x="415" y="258" width="280" height="34" rx="10" fill="#FFDE00" />

    <!-- Barcode Section Background -->
    <rect x="40" y="440" width="${width - 80}" height="70" rx="16" fill="#021C0E" stroke="#FFDE00" stroke-width="2" />

    <!-- Bottom Footer Banner -->
    <rect x="24" y="535" width="${width - 48}" height="45" rx="0" fill="#FF007F" opacity="0.9" />

    <!-- Devanagari Hot Pink Goa Badge -->
    ${goaBadge}

    <!-- Barcode Vector -->
    ${barcode}

    <!-- Vector Text Layer -->
    ${headerGovText}
    ${headerSubGovText}
    ${nameLabelText}
    ${nameValText}
    ${roleLabelText}
    ${roleValText}
    ${titleLabelText}
    ${titleValText}
    ${numberValText}
    ${datesFooterText}
    ${tagFooterText}
  </svg>
  `;
}
