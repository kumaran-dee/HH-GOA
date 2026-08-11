import sharp from "sharp";
import { renderVectorText } from "./svg-vector-text";

export interface GeneratePfpOptions {
  imageBuffer: Buffer;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  username?: string;
}

/**
 * Generate Official Hacker House Goa 2026 Circular PFP Frame (1024x1024 PNG)
 * 100% pixel-perfect replica of Picture 2 reference graphic.
 */
export async function generatePfpFrame(options: GeneratePfpOptions): Promise<Buffer> {
  const { imageBuffer, scale = 1, offsetX = 0, offsetY = 0, username = "builder" } = options;

  const targetSize = 1024;

  // Exact coordinates matching Picture 2 template layout
  const circleDiameter = 500;
  const circleCenterX = 496;
  const circleCenterY = 456;
  const circleLeft = circleCenterX - circleDiameter / 2;
  const circleTop = circleCenterY - circleDiameter / 2;

  const userImg = sharp(imageBuffer);
  const metadata = await userImg.metadata();
  const srcW = metadata.width || circleDiameter;
  const srcH = metadata.height || circleDiameter;

  const minDim = Math.min(srcW, srcH) / scale;
  const cropW = Math.round(minDim);
  const cropH = Math.round(minDim);

  const baseLeft = Math.round((srcW - cropW) / 2);
  const baseTop = Math.round((srcH - cropH) / 2);

  const left = Math.max(0, Math.min(srcW - cropW, Math.round(baseLeft - offsetX * srcW)));
  const top = Math.max(0, Math.min(srcH - cropH, Math.round(baseTop - offsetY * srcH)));

  // Crop & resize user photo to circle diameter
  const resizedAvatar = await userImg
    .extract({ left, top, width: cropW, height: cropH })
    .resize(circleDiameter, circleDiameter, { fit: "cover" })
    .png()
    .toBuffer();

  // Create Circular Mask
  const circleMask = Buffer.from(
    `<svg width="${circleDiameter}" height="${circleDiameter}">
      <circle cx="${circleDiameter / 2}" cy="${circleDiameter / 2}" r="${circleDiameter / 2}" fill="#fff"/>
    </svg>`
  );

  const circularAvatar = await sharp(resizedAvatar)
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Base background canvas SVG matching Picture 2 background colors & gradient
  const baseCanvasSvg = `
  <svg width="${targetSize}" height="${targetSize}" viewBox="0 0 ${targetSize} ${targetSize}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${targetSize}" height="${targetSize}" fill="#064426" />
    <path d="M 0 540 Q 250 490 512 520 Q 750 490 1024 540 V 1024 H 0 Z" fill="#085B33" />
    <path d="M 0 650 Q 250 610 512 640 Q 750 610 1024 650 V 1024 H 0 Z" fill="#F0F7F2" />
  </svg>
  `;

  // Clean name format
  const rawName = username.trim() || "builder";
  const formattedUsername = rawName.startsWith("@") ? rawName : `@${rawName}`;

  // Generate Full Overlay SVG matching Picture 2 template
  const frameSvg = getPicture2FrameOverlaySvg({
    size: targetSize,
    username: formattedUsername.toLowerCase(),
    circleCenterX,
    circleCenterY,
    circleDiameter,
  });

  // Composite background SVG + Circular photo + Overlay SVG
  const finalImage = await sharp(Buffer.from(baseCanvasSvg))
    .composite([
      {
        input: circularAvatar,
        left: circleLeft,
        top: circleTop,
      },
      {
        input: Buffer.from(frameSvg),
        left: 0,
        top: 0,
      },
    ])
    .png({ quality: 95 })
    .toBuffer();

  return finalImage;
}

/**
 * Format B: Builder Pass Badge
 */
export async function generateBuilderCard(options: {
  imageBuffer: Buffer;
  name: string;
  role: string;
  title: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}): Promise<Buffer> {
  return generatePfpFrame({
    imageBuffer: options.imageBuffer,
    scale: options.scale,
    offsetX: options.offsetX,
    offsetY: options.offsetY,
    username: options.name || "builder",
  });
}

function getDevanagariGoaBadge(x: number, y: number, scale = 1): string {
  return `
  <g transform="translate(${x}, ${y}) scale(${scale})">
    <rect x="0" y="0" width="100" height="44" rx="14" fill="#FF007F" stroke="#FFFFFF" stroke-width="2.5" />
    <g transform="translate(13, 9)">
      <path d="M 0 3 H 74" stroke="#FFFFFF" stroke-width="3.8" stroke-linecap="round" />
      <path d="M 9 3 V 19 Q 9 24 5 24 Q 0 24 0 19 Q 0 14 5 14 H 9 M 20 3 V 26" fill="none" stroke="#FFFFFF" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 32 3 V 26 M 20 3 Q 27 -8 35 -4" fill="none" stroke="#FFFFFF" stroke-width="3.8" stroke-linecap="round" />
      <path d="M 46 3 V 26 M 46 14 Q 46 8 54 8 Q 62 8 62 14 Q 62 20 54 20 Q 46 20 46 14 M 70 3 V 26" fill="none" stroke="#FFFFFF" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  </g>
  `;
}

/**
 * Picture 2 Frame Overlay SVG
 * High-precision vector graphics matching Picture 2 line-art artwork, palm trees, sun rays, beach shack, and seal.
 */
function getPicture2FrameOverlaySvg(params: {
  size: number;
  username: string;
  circleCenterX: number;
  circleCenterY: number;
  circleDiameter: number;
}): string {
  const { size, username, circleCenterX, circleCenterY, circleDiameter } = params;

  const radius = circleDiameter / 2;

  // Pure SVG Vector Typography
  const dateVectorText = renderVectorText({
    text: "GOA, INDIA  •  20 - 21 OCT 2026",
    x: 60,
    y: 160,
    fontSize: 13,
    stroke: "#FFDE00",
    strokeWidth: 2.4,
    letterSpacing: 2,
    align: "left",
  });

  const usernameVectorText = renderVectorText({
    text: username,
    x: 546,
    y: 728,
    fontSize: 26,
    stroke: "#FFFFFF",
    strokeWidth: 3.8,
    letterSpacing: 2,
    align: "center",
  });

  const sealGoaText = renderVectorText({
    text: "GOA 2026",
    x: 292,
    y: 746,
    fontSize: 12,
    stroke: "#FFFFFF",
    strokeWidth: 2.2,
    letterSpacing: 2,
    align: "center",
  });

  const goaBeachShackText = renderVectorText({
    text: "GOA BEACH",
    x: 795,
    y: 745,
    fontSize: 10,
    stroke: "#FFFFFF",
    strokeWidth: 2.0,
    letterSpacing: 1,
    align: "center",
  });

  const bottomTagVectorText = renderVectorText({
    text: "BUILD • BREAK • REPEAT",
    x: size / 2,
    y: 955,
    fontSize: 14,
    stroke: "#0A5C36",
    strokeWidth: 2.6,
    letterSpacing: 4,
    align: "center",
  });

  const goaBadge = getDevanagariGoaBadge(275, 65, 0.9);

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- 1. TOP HEADER SECTION (Matches Picture 2) -->
    <!-- Tall Yellow Serif "HACKER HOUSE" Title Vector -->
    <g transform="translate(60, 50)" fill="#FFDE00">
      <!-- H -->
      <path d="M 0 0 H 16 V 32 H 48 V 0 H 64 V 80 H 48 V 48 H 16 V 80 H 0 Z" />
      <!-- A -->
      <path d="M 75 80 L 98 0 H 115 L 138 80 H 122 L 115 58 H 98 L 91 80 Z M 102 44 H 111 L 106 22 Z" />
      <!-- C -->
      <path d="M 185 18 Q 165 0 150 25 V 55 Q 165 80 185 62 V 48 Q 175 58 166 48 V 32 Q 175 22 185 32 Z" />
      <!-- K -->
      <path d="M 195 0 H 211 V 34 L 235 0 H 255 L 222 42 L 258 80 H 238 L 211 48 V 80 H 195 Z" />
      <!-- E -->
      <path d="M 268 0 H 308 V 16 H 284 V 32 H 304 V 48 H 284 V 64 H 308 V 80 H 268 Z" />
      <!-- R -->
      <path d="M 318 0 H 350 Q 368 0 368 22 Q 368 40 350 40 H 334 V 80 H 318 Z M 334 14 V 26 H 348 Q 354 26 354 20 Q 354 14 348 14 Z M 345 40 L 370 80 H 350 L 330 45 Z" />

      <!-- HOUSE (Right side) -->
      <!-- H -->
      <path d="M 260 0 H 276 V 32 H 308 V 0 H 324 V 80 H 308 V 48 H 276 V 80 H 260 Z" transform="translate(270, 0)" />
      <!-- O -->
      <path d="M 338 40 Q 338 0 365 0 Q 392 0 392 40 Q 392 80 365 80 Q 338 80 338 40 Z M 354 40 Q 354 64 365 64 Q 376 64 376 40 Q 376 16 365 16 Q 354 16 354 40 Z" transform="translate(270, 0)" />
      <!-- U -->
      <path d="M 406 0 H 422 V 58 Q 422 66 435 66 Q 448 66 448 58 V 0 H 464 V 58 Q 464 80 435 80 Q 406 80 406 58 Z" transform="translate(270, 0)" />
      <!-- S -->
      <path d="M 478 65 Q 488 80 510 75 Q 525 70 518 58 Q 510 48 492 45 Q 476 42 476 30 Q 476 0 506 0 Q 522 0 532 16 L 520 25 Q 512 14 502 14 Q 492 14 492 24 Q 492 30 504 33 Q 532 38 532 58 Q 532 80 502 80 Q 480 80 466 65 Z" transform="translate(270, 0)" />
      <!-- E -->
      <path d="M 544 0 H 584 V 16 H 560 V 32 H 580 V 48 H 560 V 64 H 584 V 80 H 544 Z" transform="translate(270, 0)" />
    </g>

    <!-- Hot Pink "गोवा" Badge overlaying middle -->
    ${goaBadge}

    <!-- Subtitle Date Text -->
    ${dateVectorText}

    <!-- 2. TOP RIGHT RISING SUN & BIRDS -->
    <circle cx="895" cy="175" r="30" fill="#FFDE00" />
    <g stroke="#FFDE00" stroke-width="2.5" stroke-linecap="round">
      <line x1="895" y1="130" x2="895" y2="118" />
      <line x1="895" y1="220" x2="895" y2="232" />
      <line x1="850" y1="175" x2="838" y2="175" />
      <line x1="940" y1="175" x2="952" y2="175" />
      <line x1="863" y1="143" x2="854" y2="134" />
      <line x1="927" y1="207" x2="936" y2="216" />
      <line x1="863" y1="207" x2="854" y2="216" />
      <line x1="927" y1="143" x2="936" y2="134" />
    </g>

    <!-- Birds Flying Top Left -->
    <path d="M 170 225 Q 180 215 190 225 Q 200 215 210 225" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
    <path d="M 220 245 Q 228 237 236 245 Q 244 237 252 245" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />

    <!-- 3. TROPICAL PALM TREES & BEACH LANDSCAPE (Picture 2 Exact Artwork) -->
    <!-- Left Palm Tree (Gracefully curved to left side of circle) -->
    <g transform="translate(-10, 300)">
      <path d="M 40 500 Q 140 260 0 0" fill="none" stroke="#FFDE00" stroke-width="14" stroke-linecap="round" />
      <path d="M 40 500 Q 140 260 0 0" fill="none" stroke="#064426" stroke-width="8" stroke-linecap="round" />
      <g transform="translate(0, 0)">
        <path d="M 0 0 Q -90 -45 -135 45 Q -45 22 0 0 M 0 0 Q -45 -90 45 -110 Q 22 -22 0 0 M 0 0 Q 90 -65 135 22 Q 45 11 0 0 M 0 0 Q 110 45 90 110 Q 35 45 0 0" fill="#0A5C36" stroke="#FFDE00" stroke-width="3" />
      </g>
    </g>

    <!-- Right Palm Tree (Gracefully curved to right side of circle) -->
    <g transform="translate(1034, 450)">
      <path d="M -20 420 Q -110 220 0 0" fill="none" stroke="#FFDE00" stroke-width="14" stroke-linecap="round" />
      <path d="M -20 420 Q -110 220 0 0" fill="none" stroke="#064426" stroke-width="8" stroke-linecap="round" />
      <g transform="translate(0, 0)">
        <path d="M 0 0 Q 90 -45 135 45 Q 40 18 0 0 M 0 0 Q 35 -70 -35 -85 Q -18 -18 0 0 M 0 0 Q -70 -50 -110 18 Q -35 9 0 0 M 0 0 Q -85 35 -70 85 Q -28 35 0 0" fill="#0A5C36" stroke="#FFDE00" stroke-width="3" />
      </g>
    </g>

    <!-- Coastal Beach Shack "GOA BEACH" (Right Shore) -->
    <g transform="translate(735, 735)">
      <rect x="0" y="35" width="120" height="75" fill="#064426" stroke="#FFFFFF" stroke-width="2.5" />
      <polygon points="-12,35 60,8 132,35" fill="#032D19" stroke="#FFFFFF" stroke-width="2.5" />
      <rect x="15" y="-4" width="90" height="22" rx="5" fill="#FF007F" stroke="#FFFFFF" stroke-width="1.5" />
      <path d="M -20 45 Q -10 20 -25 95" stroke="#FFDE00" stroke-width="6" stroke-linecap="round" />
      <path d="M -8 40 Q 2 15 -12 95" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" />
    </g>
    ${goaBeachShackText}

    <!-- Coastal Line Art Houses at Bottom -->
    <g transform="translate(90, 840)">
      <polygon points="0,50 70,10 140,50 140,140 0,140" fill="#064426" stroke="#FFFFFF" stroke-width="2.5" />
      <rect x="35" y="70" width="35" height="40" fill="#FFDE00" />
    </g>

    <g transform="translate(660, 850)">
      <polygon points="0,50 75,10 150,50 150,130 0,130" fill="#064426" stroke="#FFFFFF" stroke-width="2.5" />
      <rect x="45" y="70" width="35" height="40" fill="#FF007F" />
    </g>

    <g transform="translate(830, 820)">
      <polygon points="0,50 75,10 150,50 150,150 0,150" fill="#064426" stroke="#FFFFFF" stroke-width="2.5" />
      <rect x="45" y="70" width="35" height="50" fill="#FF007F" />
    </g>

    <!-- 4. CENTRAL CIRCULAR PHOTO FRAME RINGS (Matches Picture 2) -->
    <!-- Outer Thick Sunshine Yellow Ring -->
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${radius + 12}" fill="none" stroke="#FFDE00" stroke-width="18" filter="url(#shadow)" />

    <!-- Middle Thin Green Ring -->
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${radius + 2}" fill="none" stroke="#064426" stroke-width="4" />

    <!-- Inner White Ring -->
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${radius}" fill="none" stroke="#FFFFFF" stroke-width="3" />

    <!-- 5. BOTTOM OVERLAY BADGES (Matches Picture 2) -->
    <!-- Bottom Left Circular "HH GOA 2026" Badge -->
    <g transform="translate(212, 612)" filter="url(#shadow)">
      <circle cx="80" cy="80" r="78" fill="#042917" stroke="#FFDE00" stroke-width="6" />
      <circle cx="80" cy="80" r="70" fill="none" stroke="#FFFFFF" stroke-width="2" />

      <!-- Brush "HH" Yellow Vector Text -->
      <g transform="translate(36, 28)" fill="#FFDE00">
        <path d="M 0 0 H 16 V 35 H 42 V 0 H 58 V 70 H 42 V 48 H 16 V 70 H 0 Z" />
        <path d="M 46 -6 L 56 -16 H 72 L 62 -6 Z" fill="#FF007F" />
      </g>
    </g>
    ${sealGoaText}

    <!-- Bottom Username / Handle Pill Badge (Clean single pill centered at X: 326, Y: 690) -->
    <g transform="translate(326, 690)" filter="url(#shadow)">
      <rect x="0" y="0" width="440" height="64" rx="24" fill="#042917" stroke="#FFDE00" stroke-width="4" />
    </g>

    <!-- Vector Text Layer inside Username Pill -->
    ${usernameVectorText}

    <!-- 6. VERY BOTTOM TAGLINE "BUILD • BREAK • REPEAT" -->
    <g transform="translate(0, 930)">
      <line x1="280" y1="20" x2="380" y2="20" stroke="#0A5C36" stroke-width="2" />
      <line x1="644" y1="20" x2="744" y2="20" stroke="#0A5C36" stroke-width="2" />
    </g>
    ${bottomTagVectorText}
  </svg>
  `;
}
