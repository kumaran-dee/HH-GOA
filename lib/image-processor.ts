import sharp from "sharp";
import { renderVectorText } from "./svg-vector-text";

export interface GeneratePfpOptions {
  imageBuffer: Buffer;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  username?: string;
  frameStyle?: string;
}

/**
 * Generate Official Hacker House Goa 2026 Circular PFP Frame (1024x1024 PNG)
 * Exact match to user template:
 * - Central circular photo frame
 * - Hot Pink "गोवा" Devanagari badge over yellow HACKER HOUSE title
 * - NO time text ("2:47 PM STUDIO" and "LIVE AT 8:00 PM" removed)
 * - HH GOA 2026 circular seal badge
 * - Green username pill badge showing ONLY @username
 * - Tropical beach sunset illustration
 */
export async function generatePfpFrame(options: GeneratePfpOptions): Promise<Buffer> {
  const { imageBuffer, scale = 1, offsetX = 0, offsetY = 0, username = "builder" } = options;

  const targetSize = 1024;
  const circleDiameter = 500;
  const circleCenterX = 512;
  const circleCenterY = 472;

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

  // Extract and resize cropped photo to circle size
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

  // Base canvas background SVG
  const baseCanvasSvg = getOfficialHhGoaBackgroundSvg(targetSize);

  // Generate Frame Overlay SVG (without any time text)
  const frameSvg = getOfficialHhGoaFrameOverlaySvg({
    size: targetSize,
    username: username.trim().startsWith("@") ? username.trim() : `@${username.trim()}`,
    circleCenterX,
    circleCenterY,
    circleDiameter,
  });

  // Composite background SVG + Circular photo + Overlay SVG
  const finalImage = await sharp(Buffer.from(baseCanvasSvg))
    .composite([
      {
        input: circularAvatar,
        left: circleCenterX - circleDiameter / 2,
        top: circleCenterY - circleDiameter / 2,
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
 * Format B: Builder ID Pass (1200x630 PNG)
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

/**
 * Base Background SVG
 */
function getOfficialHhGoaBackgroundSvg(size: number): string {
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#064426" />
    <path d="M 0 580 Q 250 530 512 560 Q 750 530 1024 580 V 1024 H 0 Z" fill="#0A5C36" />
    <path d="M 0 670 Q 250 630 512 660 Q 750 630 1024 670 V 1024 H 0 Z" fill="#F0F7F2" />
  </svg>
  `;
}

/**
 * Devanagari "गोवा" Hot Pink SVG Vector Badge Component
 */
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
 * Overlay SVG Frame for Official Hacker House Goa Template (Exact Match to User Image)
 * - NO time text ("2:47 PM STUDIO" and "LIVE AT 8:00 PM" removed completely)
 * - Single centered username text in green pill badge
 */
function getOfficialHhGoaFrameOverlaySvg(params: {
  size: number;
  username: string;
  circleCenterX: number;
  circleCenterY: number;
  circleDiameter: number;
}): string {
  const { size, username, circleCenterX, circleCenterY, circleDiameter } = params;

  const radius = circleDiameter / 2;

  // Vector Typography
  const dateVectorText = renderVectorText({
    text: "GOA, INDIA • 28 - 31 OCT 2026",
    x: 60,
    y: 160,
    fontSize: 13,
    stroke: "#FFDE00",
    strokeWidth: 2.4,
    letterSpacing: 2,
    align: "left",
  });

  // Username vector text (Centered inside pill badge with NO time subtext!)
  const usernameVectorText = renderVectorText({
    text: username,
    x: 520,
    y: 728,
    fontSize: 28,
    stroke: "#FFFFFF",
    strokeWidth: 4.0,
    letterSpacing: 2,
    align: "center",
  });

  const bottomTagVectorText = renderVectorText({
    text: "BUILD • BREAK • REPEAT",
    x: size / 2,
    y: 955,
    fontSize: 15,
    stroke: "#0A5C36",
    strokeWidth: 2.8,
    letterSpacing: 4,
    align: "center",
  });

  const goaBadge = getDevanagariGoaBadge(460, 68, 0.9);

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- 1. TOP HEADER SECTION -->
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
      <path d="M 520 0 H 536 V 32 H 568 V 0 H 584 V 80 H 568 V 48 H 536 V 80 H 520 Z" />
      <!-- O -->
      <path d="M 598 40 Q 598 0 625 0 Q 652 0 652 40 Q 652 80 625 80 Q 598 80 598 40 Z M 614 40 Q 614 64 625 64 Q 636 64 636 40 Q 636 16 625 16 Q 614 16 614 40 Z" />
      <!-- U -->
      <path d="M 666 0 H 682 V 58 Q 682 66 695 66 Q 708 66 708 58 V 0 H 724 V 58 Q 724 80 695 80 Q 666 80 666 58 Z" />
      <!-- S -->
      <path d="M 738 65 Q 748 80 770 75 Q 785 70 778 58 Q 770 48 752 45 Q 736 42 736 30 Q 736 0 766 0 Q 782 0 792 16 L 780 25 Q 772 14 762 14 Q 752 14 752 24 Q 752 30 764 33 Q 792 38 792 58 Q 792 80 762 80 Q 740 80 726 65 Z" />
      <!-- E -->
      <path d="M 804 0 H 844 V 16 H 820 V 32 H 840 V 48 H 820 V 64 H 844 V 80 H 804 Z" />
    </g>

    <!-- Hot Pink "गोवा" Badge overlaying middle -->
    ${goaBadge}

    <!-- Header Subtitle Text (NO 2:47 PM STUDIO time text!) -->
    ${dateVectorText}

    <!-- 2. SUNSHINE & BIRDS IN TOP BACKGROUND -->
    <!-- Top Right Yellow Sun -->
    <circle cx="880" cy="170" r="32" fill="#FFDE00" />
    <g stroke="#FFDE00" stroke-width="2.5" stroke-linecap="round">
      <line x1="880" y1="124" x2="880" y2="112" />
      <line x1="880" y1="216" x2="880" y2="228" />
      <line x1="834" y1="170" x2="822" y2="170" />
      <line x1="926" y1="170" x2="938" y2="170" />
      <line x1="847" y1="137" x2="838" y2="128" />
      <line x1="913" y1="203" x2="922" y2="212" />
      <line x1="847" y1="203" x2="838" y2="212" />
      <line x1="913" y1="137" x2="922" y2="128" />
    </g>

    <!-- Birds Flying in Top Left -->
    <path d="M 160 220 Q 170 210 180 220 Q 190 210 200 220" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
    <path d="M 210 240 Q 218 232 226 240 Q 234 232 242 240" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />

    <!-- 3. TROPICAL BEACH & PALM TREES ARTWORK -->
    <!-- Left Palm Tree -->
    <g transform="translate(0, 300)">
      <path d="M 40 450 Q 120 220 0 0" fill="none" stroke="#FFDE00" stroke-width="12" stroke-linecap="round" />
      <path d="M 40 450 Q 120 220 0 0" fill="none" stroke="#064426" stroke-width="7" stroke-linecap="round" />
      <g transform="translate(0, 0)">
        <path d="M 0 0 Q -80 -35 -120 35 Q -40 18 0 0 M 0 0 Q -35 -70 35 -85 Q 18 -18 0 0 M 0 0 Q 70 -50 110 18 Q 35 9 0 0 M 0 0 Q 85 35 70 85 Q 28 35 0 0" fill="#0A5C36" stroke="#FFDE00" stroke-width="2.5" />
      </g>
    </g>

    <!-- Right Palm Tree -->
    <g transform="translate(1024, 450)">
      <path d="M -20 400 Q -100 200 0 0" fill="none" stroke="#FFDE00" stroke-width="12" stroke-linecap="round" />
      <path d="M -20 400 Q -100 200 0 0" fill="none" stroke="#064426" stroke-width="7" stroke-linecap="round" />
      <g transform="translate(0, 0)">
        <path d="M 0 0 Q 80 -35 120 35 Q 40 18 0 0 M 0 0 Q 35 -70 -35 -85 Q -18 -18 0 0 M 0 0 Q -70 -50 -110 18 Q -35 9 0 0 M 0 0 Q -85 35 -70 85 Q -28 35 0 0" fill="#0A5C36" stroke="#FFDE00" stroke-width="2.5" />
      </g>
    </g>

    <!-- Coastal Beach Shack "GOA BEACH" (Right Shore) -->
    <g transform="translate(740, 720)">
      <rect x="0" y="35" width="120" height="75" fill="#064426" stroke="#FFFFFF" stroke-width="2.5" />
      <polygon points="-12,35 60,8 132,35" fill="#042816" stroke="#FFFFFF" stroke-width="2.5" />
      <rect x="15" y="-4" width="90" height="22" rx="5" fill="#FF007F" stroke="#FFFFFF" stroke-width="1.5" />
      <text x="60" y="11" font-family="sans-serif" font-weight="900" font-size="10" fill="#FFFFFF" text-anchor="middle">GOA BEACH</text>
    </g>

    <!-- Beach Houses at Bottom -->
    <g transform="translate(100, 830)">
      <polygon points="0,50 70,10 140,50 140,140 0,140" fill="#064426" stroke="#FFFFFF" stroke-width="2.5" />
      <rect x="35" y="70" width="35" height="40" fill="#FFDE00" />
    </g>

    <g transform="translate(680, 840)">
      <polygon points="0,50 75,10 150,50 150,130 0,130" fill="#064426" stroke="#FFFFFF" stroke-width="2.5" />
      <rect x="45" y="70" width="35" height="40" fill="#FF007F" />
    </g>

    <!-- 4. CENTRAL CIRCULAR PHOTO FRAME RINGS -->
    <!-- Outer Thick Sunshine Yellow Ring -->
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${radius + 12}" fill="none" stroke="#FFDE00" stroke-width="18" filter="url(#shadow)" />

    <!-- Middle Thin Green Ring -->
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${radius + 2}" fill="none" stroke="#064426" stroke-width="4" />

    <!-- Inner White Ring -->
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${radius}" fill="none" stroke="#FFFFFF" stroke-width="3" />

    <!-- 5. BOTTOM OVERLAY BADGES -->
    <!-- Bottom Left Circular "HH GOA 2026" Badge -->
    <g transform="translate(290, 685)" filter="url(#shadow)">
      <circle cx="85" cy="85" r="82" fill="#042917" stroke="#FFDE00" stroke-width="6" />
      <circle cx="85" cy="85" r="74" fill="none" stroke="#FFFFFF" stroke-width="2" />

      <!-- Brush "HH" Yellow Vector Text -->
      <g transform="translate(38, 30)" fill="#FFDE00">
        <path d="M 0 0 H 16 V 35 H 42 V 0 H 58 V 70 H 42 V 48 H 16 V 70 H 0 Z" />
        <path d="M 46 -6 L 56 -16 H 72 L 62 -6 Z" fill="#FF007F" />
      </g>

      <!-- Arc Subtext "GOA 2026" -->
      <text x="85" y="145" font-family="sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">GOA 2026</text>
    </g>

    <!-- Bottom Username / Handle Pill Badge (Clean single pill with NO time text!) -->
    <g transform="translate(330, 695)" filter="url(#shadow)">
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
