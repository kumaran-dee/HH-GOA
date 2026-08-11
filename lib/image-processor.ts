import sharp from "sharp";

export interface GeneratePfpOptions {
  imageBuffer: Buffer;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  frameStyle?: "sunset-cyber" | "neon-palm" | "anjuna-wave" | "vip-gold";
}

/**
 * Generate HH Goa 2026 Profile Picture Frame (1024x1024 PNG)
 */
export async function generatePfpFrame(options: GeneratePfpOptions): Promise<Buffer> {
  const { imageBuffer, scale = 1, offsetX = 0, offsetY = 0, frameStyle = "sunset-cyber" } = options;

  const targetSize = 1024;

  // Load user image with Sharp to inspect metadata
  const userImg = sharp(imageBuffer);
  const metadata = await userImg.metadata();
  const srcW = metadata.width || targetSize;
  const srcH = metadata.height || targetSize;

  // Calculate crop dimensions for 1:1 ratio considering scale and offsets
  const minDim = Math.min(srcW, srcH) / scale;
  const cropW = Math.round(minDim);
  const cropH = Math.round(minDim);

  const baseLeft = Math.round((srcW - cropW) / 2);
  const baseTop = Math.round((srcH - cropH) / 2);

  // Apply user offset (-0.5 to 0.5 range mapped to pixels)
  const left = Math.max(0, Math.min(srcW - cropW, Math.round(baseLeft - offsetX * srcW)));
  const top = Math.max(0, Math.min(srcH - cropH, Math.round(baseTop - offsetY * srcH)));

  // Extract and resize cropped photo to 1024x1024
  const croppedUserBuffer = await userImg
    .extract({ left, top, width: cropW, height: cropH })
    .resize(targetSize, targetSize, { fit: "cover" })
    .png()
    .toBuffer();

  // Generate SVG Frame Overlay with guaranteed cross-platform vector typography
  const frameSvg = getFrameSvgOverlay(frameStyle, targetSize);

  // Composite user image + frame overlay
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
 * Generate SVG Overlay for 1024x1024 PFP Frames
 * Uses safe vector shapes, gradients, and font declarations for cross-platform rendering
 */
function getFrameSvgOverlay(style: string, size: number): string {
  const strokeWidth = 36;

  let gradientStops = `
    <stop offset="0%" stop-color="#FF3B00" />
    <stop offset="35%" stop-color="#FF8C00" />
    <stop offset="70%" stop-color="#00F2FE" />
    <stop offset="100%" stop-color="#9B51E0" />
  `;

  let badgeBorder = "#FF3B00";
  let tagBg = "#FF3B00";

  if (style === "neon-palm") {
    gradientStops = `
      <stop offset="0%" stop-color="#00F2FE" />
      <stop offset="50%" stop-color="#4FACFE" />
      <stop offset="100%" stop-color="#00E676" />
    `;
    badgeBorder = "#00F2FE";
    tagBg = "#00E676";
  } else if (style === "anjuna-wave") {
    gradientStops = `
      <stop offset="0%" stop-color="#7928CA" />
      <stop offset="50%" stop-color="#FF0080" />
      <stop offset="100%" stop-color="#FF8C00" />
    `;
    badgeBorder = "#FF0080";
    tagBg = "#FF0080";
  } else if (style === "vip-gold") {
    gradientStops = `
      <stop offset="0%" stop-color="#FFE000" />
      <stop offset="50%" stop-color="#FF8C00" />
      <stop offset="100%" stop-color="#00E676" />
    `;
    badgeBorder = "#FFE000";
    tagBg = "#FFE000";
  }

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        ${gradientStops}
      </linearGradient>

      <linearGradient id="badgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0B0F19" stop-opacity="0.96" />
        <stop offset="100%" stop-color="#1E293B" stop-opacity="0.96" />
      </linearGradient>

      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FF3B00" />
        <stop offset="50%" stop-color="#FF8C00" />
        <stop offset="100%" stop-color="#00F2FE" />
      </linearGradient>

      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="10" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <style>
      .title-text {
        font-family: 'DejaVu Sans', 'Liberation Sans', Arial, Helvetica, sans-serif;
        font-weight: 900;
        font-size: 32px;
        fill: #FFFFFF;
        letter-spacing: 1.5px;
      }
      .sub-text {
        font-family: 'DejaVu Sans', 'Liberation Sans', Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 16px;
        fill: #00F2FE;
        letter-spacing: 2px;
      }
      .tag-text {
        font-family: 'DejaVu Sans', 'Liberation Sans', Arial, Helvetica, sans-serif;
        font-weight: 900;
        font-size: 18px;
        fill: #FFFFFF;
      }
    </style>

    <!-- Outer Frame Border -->
    <rect x="${strokeWidth / 2}" y="${strokeWidth / 2}" width="${size - strokeWidth}" height="${size - strokeWidth}" 
          rx="52" fill="none" stroke="url(#frameGrad)" stroke-width="${strokeWidth}" />

    <!-- Corner Neon Vector Accents -->
    <path d="M 70 140 L 140 70" stroke="#00F2FE" stroke-width="8" stroke-linecap="round" />
    <path d="M ${size - 140} 70 L ${size - 70} 140" stroke="#FF3B00" stroke-width="8" stroke-linecap="round" />

    <!-- Top Badge Tag -->
    <g transform="translate(${size / 2 - 160}, 44)">
      <rect x="0" y="0" width="320" height="48" rx="24" fill="url(#badgeBg)" stroke="url(#frameGrad)" stroke-width="2" />
      <text x="160" y="31" class="sub-text" text-anchor="middle">
        🌴 GOA • NOV 2026
      </text>
    </g>

    <!-- Bottom Prominent Event Banner Badge -->
    <g transform="translate(${size / 2 - 340}, ${size - 155})" filter="url(#shadow)">
      <!-- Main Badge Container -->
      <rect x="0" y="0" width="680" height="110" rx="30" fill="url(#badgeBg)" stroke="url(#frameGrad)" stroke-width="4" />

      <!-- Palm Vector Icon -->
      <g transform="translate(30, 25)">
        <path d="M 28 50 Q 34 25 50 20 Q 42 42 28 50 M 28 50 Q 14 30 5 36 Q 20 45 28 50 M 28 50 Q 28 66 28 72" 
              fill="none" stroke="#00F2FE" stroke-width="4" stroke-linecap="round" />
      </g>

      <!-- Main Title: HACKER HOUSE GOA 2026 -->
      <text x="95" y="48" class="title-text">
        HACKER HOUSE GOA 2026
      </text>

      <!-- Subtitle: ANJUNA BEACH, GOA -->
      <text x="95" y="80" class="sub-text">
        ANJUNA BEACH • OFFICIAL ATTENDEE
      </text>

      <!-- Hashtag Pill -->
      <g transform="translate(485, 30)">
        <rect x="0" y="0" width="165" height="50" rx="18" fill="${tagBg}" />
        <text x="82" y="32" class="tag-text" text-anchor="middle">
          #FrameInGoa
        </text>
      </g>
    </g>
  </svg>
  `;
}
