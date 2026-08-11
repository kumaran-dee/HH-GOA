import sharp from "sharp";

export interface GeneratePfpOptions {
  imageBuffer: Buffer;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  frameStyle?: "sunset-cyber" | "neon-palm" | "anjuna-wave" | "vip-gold";
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

  // SVG Frame Overlay
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

  // Create circular mask for avatar
  const circleMask = Buffer.from(
    `<svg width="${avatarSize}" height="${avatarSize}">
      <circle cx="${avatarSize / 2}" cy="${avatarSize / 2}" r="${avatarSize / 2}" fill="#fff"/>
    </svg>`
  );

  const circularAvatar = await sharp(resizedAvatar)
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Build complete SVG Card Graphic layout
  const cardSvg = getBuilderCardSvg({
    width: cardW,
    height: cardH,
    name: name || "Anonymous Builder",
    role: role || "Full Stack",
    title: title || "Goa Hacker",
    avatarSize,
  });

  // Composite background card SVG + circular avatar photo + avatar glowing border
  const avatarLeft = 80;
  const avatarTop = 135;

  const avatarBorderSvg = Buffer.from(
    `<svg width="${avatarSize + 16}" height="${avatarSize + 16}">
      <defs>
        <linearGradient id="avatarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF3B00" />
          <stop offset="50%" stop-color="#FF8C00" />
          <stop offset="100%" stop-color="#00F2FE" />
        </linearGradient>
      </defs>
      <circle cx="${(avatarSize + 16) / 2}" cy="${(avatarSize + 16) / 2}" r="${(avatarSize + 12) / 2}" fill="none" stroke="url(#avatarGlow)" stroke-width="6"/>
    </svg>`
  );

  const finalCard = await sharp(Buffer.from(cardSvg))
    .composite([
      {
        input: avatarBorderSvg,
        left: avatarLeft - 8,
        top: avatarTop - 8,
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
 * Generate SVG Overlay for PFP Frames
 */
function getFrameSvgOverlay(style: string, size: number): string {
  const strokeWidth = 32;

  let gradientStops = `
    <stop offset="0%" stop-color="#FF3B00" />
    <stop offset="40%" stop-color="#FF8C00" />
    <stop offset="70%" stop-color="#00F2FE" />
    <stop offset="100%" stop-color="#9B51E0" />
  `;

  if (style === "neon-palm") {
    gradientStops = `
      <stop offset="0%" stop-color="#00F2FE" />
      <stop offset="50%" stop-color="#4FACFE" />
      <stop offset="100%" stop-color="#00E676" />
    `;
  } else if (style === "anjuna-wave") {
    gradientStops = `
      <stop offset="0%" stop-color="#7928CA" />
      <stop offset="50%" stop-color="#FF0080" />
      <stop offset="100%" stop-color="#FF8C00" />
    `;
  } else if (style === "vip-gold") {
    gradientStops = `
      <stop offset="0%" stop-color="#FFE000" />
      <stop offset="50%" stop-color="#799F0C" />
      <stop offset="100%" stop-color="#00E676" />
    `;
  }

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        ${gradientStops}
      </linearGradient>
      
      <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0F172A" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#1E293B" stop-opacity="0.95" />
      </linearGradient>

      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="12" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Outer Frame Border -->
    <rect x="${strokeWidth / 2}" y="${strokeWidth / 2}" width="${size - strokeWidth}" height="${size - strokeWidth}" 
          rx="48" fill="none" stroke="url(#frameGrad)" stroke-width="${strokeWidth}" />

    <!-- Corner Accents -->
    <path d="M 64 120 L 120 64" stroke="#00F2FE" stroke-width="6" stroke-linecap="round" />
    <path d="M ${size - 120} 64 L ${size - 64} 120" stroke="#FF3B00" stroke-width="6" stroke-linecap="round" />

    <!-- Bottom Event Banner Badge -->
    <g transform="translate(${size / 2 - 280}, ${size - 130})">
      <!-- Shadow & Backdrop -->
      <rect x="0" y="0" width="560" height="88" rx="24" fill="url(#badgeGrad)" stroke="url(#frameGrad)" stroke-width="3" filter="url(#glow)"/>

      <!-- Palm Vector Mini Icon -->
      <path d="M 36 50 Q 42 30 54 26 Q 50 42 36 50 M 36 50 Q 24 34 16 38 Q 28 46 36 50 M 36 50 Q 36 64 36 70" fill="none" stroke="#00F2FE" stroke-width="3" stroke-linecap="round" />

      <!-- Text HH GOA 2026 -->
      <text x="72" y="38" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" letter-spacing="1">
        HH GOA 2026
      </text>
      
      <text x="72" y="62" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#00F2FE" letter-spacing="2">
        BUILDER EDITION • ANJUNA BEACH
      </text>

      <!-- Hashtag Pill -->
      <rect x="400" y="24" width="136" height="40" rx="12" fill="#FF3B00" />
      <text x="468" y="49" font-family="Arial, sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle">
        #FrameInGoa
      </text>
    </g>
  </svg>
  `;
}

/**
 * Generate Builder Card Background SVG Layout
 */
function getBuilderCardSvg(params: {
  width: number;
  height: number;
  name: string;
  role: string;
  title: string;
  avatarSize: number;
}): string {
  const { width, height, name, role, title } = params;

  // Escape special XML characters
  const escapeXml = (str: string) =>
    str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "&": return "&amp;";
        case "'": return "&apos;";
        case '"': return "&quot;";
        default: return c;
      }
    });

  const safeName = escapeXml(name);
  const safeRole = escapeXml(role);
  const safeTitle = escapeXml(title);

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Dark Ocean Neon Background -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0B0F19" />
        <stop offset="50%" stop-color="#111827" />
        <stop offset="100%" stop-color="#0F172A" />
      </linearGradient>

      <!-- Neon Sunset Gradient -->
      <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FF3B00" />
        <stop offset="50%" stop-color="#FF8C00" />
        <stop offset="100%" stop-color="#00F2FE" />
      </linearGradient>

      <!-- Glass Card Gradient -->
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.9" />
      </linearGradient>

      <!-- Glow Filters -->
      <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Base Canvas Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Ambient Glowing Spheres -->
    <circle cx="100" cy="80" r="180" fill="#FF3B00" opacity="0.15" filter="url(#neonGlow)"/>
    <circle cx="${width - 100}" cy="${height - 100}" r="220" fill="#00F2FE" opacity="0.15" filter="url(#neonGlow)"/>

    <!-- Decorative Top & Bottom Border Strips -->
    <rect x="0" y="0" width="${width}" height="10" fill="url(#sunsetGrad)"/>
    <rect x="0" y="${height - 10}" width="${width}" height="10" fill="url(#sunsetGrad)"/>

    <!-- Glassmorphism Card Frame -->
    <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="32" fill="url(#glassGrad)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="2" />

    <!-- HH GOA 2026 Header Branding -->
    <g transform="translate(480, 85)">
      <text font-family="Arial, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" letter-spacing="2">
        HH GOA 2026
      </text>
      <rect x="0" y="14" width="230" height="4" fill="url(#sunsetGrad)" rx="2"/>
      <text x="250" y="12" font-family="Arial, sans-serif" font-weight="800" font-size="14" fill="#00F2FE" letter-spacing="3">
        OFFICIAL BUILDER PASS
      </text>
    </g>

    <!-- Builder Information Details Block -->
    <g transform="translate(480, 180)">
      <!-- Name -->
      <text y="30" font-family="Arial, sans-serif" font-weight="800" font-size="42" fill="#FFFFFF">
        ${safeName}
      </text>

      <!-- Stack / Role Badge Pill -->
      <g transform="translate(0, 50)">
        <rect width="180" height="42" rx="14" fill="#1E293B" stroke="#00F2FE" stroke-width="1.5" />
        <text x="90" y="26" font-family="Arial, sans-serif" font-weight="800" font-size="16" fill="#00F2FE" text-anchor="middle">
          ${safeRole}
        </text>
      </g>

      <!-- Fun Builder Title Badge -->
      <g transform="translate(0, 115)">
        <text y="0" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#94A3B8" letter-spacing="1.5">
          BUILDER TITLE
        </text>
        <rect y="12" width="600" height="54" rx="16" fill="#0F172A" stroke="url(#sunsetGrad)" stroke-width="2" />
        <text x="24" y="46" font-family="Arial, sans-serif" font-weight="800" font-size="22" fill="#FF8C00">
          ⚡ ${safeTitle}
        </text>
      </g>
    </g>

    <!-- Bottom Footer Meta Info inside Card -->
    <g transform="translate(80, 535)">
      <text y="0" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#64748B" letter-spacing="1">
        LOCATION: ANJUNA BEACH, GOA • NOV 2026
      </text>
    </g>

    <g transform="translate(${width - 260}, 535)">
      <rect x="-10" y="-22" width="170" height="34" rx="10" fill="#FF3B00" opacity="0.9"/>
      <text x="75" y="0" font-family="Arial, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">
        #FrameInGoa
      </text>
    </g>

    <!-- Verification Hologram Mark -->
    <g transform="translate(${width - 140}, 80)">
      <circle cx="24" cy="24" r="24" fill="none" stroke="url(#sunsetGrad)" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="24" y="29" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#00F2FE" text-anchor="middle">
        VERIFIED
      </text>
    </g>
  </svg>
  `;
}
