import sharp from "sharp";
import path from "path";
import fs from "fs";
import { renderVectorText, calculateOptimalTypography } from "./svg-vector-text";

export interface GeneratePfpOptions {
  imageBuffer: Buffer;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  username?: string;
}

/**
 * Generate Official Hacker House Goa 2026 Circular PFP Frame (1024x1024 PNG)
 * 1. Perfectly fits user photo inside the circular frame window (left: 250, top: 194, diameter: 524px)
 * 2. Overlays pristine yellow & white frame rings for zero gap alignment
 * 3. Erases old pill shape & LIVE AT 8:00 PM with seamless ocean green fill (#085732)
 * 4. Renders user's custom input name (default "BUILDER") with dynamic font size & letter spacing
 */
export async function generatePfpFrame(options: GeneratePfpOptions): Promise<Buffer> {
  const { imageBuffer, scale = 1, offsetX = 0, offsetY = 0, username = "BUILDER" } = options;

  const targetSize = 1024;

  const templatePath = path.join(process.cwd(), "public", "hh-goa-template.jpg");
  
  let baseTemplateBuffer: Buffer;
  if (fs.existsSync(templatePath)) {
    baseTemplateBuffer = await sharp(templatePath)
      .resize(targetSize, targetSize, { fit: "fill" })
      .toBuffer();
  } else {
    baseTemplateBuffer = await sharp({
      create: {
        width: targetSize,
        height: targetSize,
        channels: 4,
        background: { r: 9, g: 91, b: 52, alpha: 1 },
      },
    }).png().toBuffer();
  }

  // Exact coordinates matching circular photo ring in template image
  const circleDiameter = 524;
  const circleLeft = 250;
  const circleTop = 194;
  const circleCenterX = 512;
  const circleCenterY = 456;

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

  // Clean username text (Capitalized)
  const rawName = (username.trim() || "BUILDER").toUpperCase();

  // Dynamic Typography calculation for perfect font size, letter spacing & vertical centering inside the pill badge
  const { fontSize, letterSpacing, strokeWidth, topY } = calculateOptimalTypography(rawName, 580, 720);

  // Pure SVG Vector Typography for User Name (100% font-independent, ZERO tofu boxes)
  const nameVectorPathSvg = renderVectorText({
    text: rawName,
    x: circleCenterX,
    y: topY,
    fontSize,
    stroke: "#FFFFFF",
    strokeWidth,
    letterSpacing,
    align: "center",
  });

  // Pristine Overlay SVG:
  // 1. Removes top right "2:47 PM STUDIO" with exact header green color match (#095B34)
  // 2. Overlays crisp circular frame rings over user photo (Yellow outer, Green mid, White inner)
  // 3. Seamless ocean green eraser patch (#085732) hiding old pill & LIVE AT 8:00 PM
  // 4. Symmetrical pill container (width: 684px, height: 104px, left: 170px, top: 668px)
  // 5. Renders user's entered name via SVG vector path
  const overlaySvg = `
  <svg width="${targetSize}" height="${targetSize}" viewBox="0 0 ${targetSize} ${targetSize}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="pillShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <filter id="ringShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- 1. REMOVE "2:47 PM STUDIO" (Cover top right seamlessly with EXACT header green color #095B34) -->
    <rect x="780" y="45" width="210" height="50" fill="#095B34" />

    <!-- 2. PRISTINE CIRCULAR FRAME RINGS OVER USER PHOTO (Zero gap alignment) -->
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${circleDiameter / 2 + 10}" fill="none" stroke="#FFDE00" stroke-width="16" filter="url(#ringShadow)" />
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${circleDiameter / 2 + 2}" fill="none" stroke="#064426" stroke-width="4" />
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${circleDiameter / 2}" fill="none" stroke="#FFFFFF" stroke-width="3" />

    <!-- 3. ERASE OLD PILL SHAPE & LIVE AT 8:00 PM (Seamless ocean green color match #085732) -->
    <rect x="230" y="745" width="560" height="55" fill="#085732" rx="14" />

    <!-- 4. LARGE SYMMETRICAL PILL CONTAINER (Covers HH Seal + Old Pill) -->
    <g transform="translate(170, 668)" filter="url(#pillShadow)">
      <rect x="0" y="0" width="684" height="104" rx="36" fill="#04351D" stroke="#FFDE00" stroke-width="5" />
    </g>

    <!-- 5. PURE SVG VECTOR PATH USER NAME (Renders exact input name e.g. "BUILDER") -->
    ${nameVectorPathSvg}
  </svg>
  `;

  // Step 1: Composite circular user photo onto base template image
  const avatarOnTemplate = await sharp(baseTemplateBuffer)
    .composite([
      {
        input: circularAvatar,
        left: circleLeft,
        top: circleTop,
      },
    ])
    .png()
    .toBuffer();

  // Step 2: Composite clean overlay on top
  const finalImage = await sharp(avatarOnTemplate)
    .composite([
      {
        input: Buffer.from(overlaySvg),
        left: 0,
        top: 0,
      },
    ])
    .png({ quality: 95 })
    .toBuffer();

  return finalImage;
}

export interface GenerateIdCardOptions {
  imageBuffer: Buffer;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  username?: string;
}

/**
 * Generate Official Hacker House Goa 2026 CR80 ID Card Badge (1024x648 PNG)
 * CR80 ID Card Aspect Ratio (1.58 : 1) with Lanyard Punch Hole & Gold Border
 */
export async function generateIdCardFrame(options: GenerateIdCardOptions): Promise<Buffer> {
  const { imageBuffer, scale = 1, offsetX = 0, offsetY = 0, username = "BUILDER" } = options;

  const cardW = 1024;
  const cardH = 648;

  const templatePath = path.join(process.cwd(), "public", "hh-goa-template.jpg");
  
  let baseTemplateBuffer: Buffer;
  if (fs.existsSync(templatePath)) {
    baseTemplateBuffer = await sharp(templatePath)
      .resize(cardW, cardH, { fit: "cover", position: "center" })
      .toBuffer();
  } else {
    baseTemplateBuffer = await sharp({
      create: {
        width: cardW,
        height: cardH,
        channels: 4,
        background: { r: 6, g: 68, b: 38, alpha: 1 },
      },
    }).png().toBuffer();
  }

  const circleDiameter = 340;
  const circleCenterX = 512;
  const circleCenterY = 270;
  const circleLeft = Math.round(circleCenterX - circleDiameter / 2);
  const circleTop = Math.round(circleCenterY - circleDiameter / 2);

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

  const resizedAvatar = await userImg
    .extract({ left, top, width: cropW, height: cropH })
    .resize(circleDiameter, circleDiameter, { fit: "cover" })
    .png()
    .toBuffer();

  const circleMask = Buffer.from(
    `<svg width="${circleDiameter}" height="${circleDiameter}">
      <circle cx="${circleDiameter / 2}" cy="${circleDiameter / 2}" r="${circleDiameter / 2}" fill="#fff"/>
    </svg>`
  );

  const circularAvatar = await sharp(resizedAvatar)
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const rawName = (username.trim() || "BUILDER").toUpperCase();

  const { fontSize, letterSpacing, strokeWidth, topY } = calculateOptimalTypography(rawName, 520, 510);

  const nameVectorPathSvg = renderVectorText({
    text: rawName,
    x: circleCenterX,
    y: topY,
    fontSize,
    stroke: "#FFFFFF",
    strokeWidth,
    letterSpacing,
    align: "center",
  });

  const overlaySvg = `
  <svg width="${cardW}" height="${cardH}" viewBox="0 0 ${cardW} ${cardH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="pillShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <filter id="ringShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#042917" />
        <stop offset="50%" stop-color="#064426" />
        <stop offset="100%" stop-color="#042917" />
      </linearGradient>
    </defs>

    <!-- 1. OVERLAY SHADOW RECTANGLE -->
    <rect x="0" y="0" width="${cardW}" height="${cardH}" fill="#042917" opacity="0.35" />

    <!-- 2. TOP ID BANNER -->
    <rect x="16" y="16" width="992" height="64" fill="url(#headerGrad)" rx="18" stroke="#FFDE00" stroke-width="2" />
    <text x="40" y="55" font-family="sans-serif" font-weight="900" font-size="20" fill="#FFDE00" letter-spacing="3">HACKER HOUSE</text>
    <rect x="235" y="36" width="55" height="24" rx="8" fill="#FF007F" stroke="#FFFFFF" stroke-width="1.5" />
    <text x="262.5" y="52.5" font-family="sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">गोवा</text>
    <text x="305" y="55" font-family="sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" letter-spacing="3">GOA 2026</text>
    
    <rect x="760" y="33" width="230" height="30" rx="10" fill="#FFDE00" />
    <text x="875" y="53" font-family="sans-serif" font-weight="900" font-size="12" fill="#042917" text-anchor="middle" letter-spacing="2">OFFICIAL BUILDER PASS</text>

    <!-- 3. LANYARD PUNCH SLOT (Top Center) -->
    <rect x="472" y="22" width="80" height="14" rx="7" fill="#02170C" stroke="#FFDE00" stroke-width="2" />

    <!-- 4. CIRCULAR FRAME RINGS OVER AVATAR PHOTO -->
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${circleDiameter / 2 + 8}" fill="none" stroke="#FFDE00" stroke-width="12" filter="url(#ringShadow)" />
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${circleDiameter / 2 + 2}" fill="none" stroke="#064426" stroke-width="3" />
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${circleDiameter / 2}" fill="none" stroke="#FFFFFF" stroke-width="2.5" />

    <!-- 5. SYMMETRICAL PILL CONTAINER FOR USER NAME -->
    <g transform="translate(212, 465)" filter="url(#pillShadow)">
      <rect x="0" y="0" width="600" height="90" rx="30" fill="#04351D" stroke="#FFDE00" stroke-width="4.5" />
    </g>

    <!-- 6. USER NAME VECTOR PATH -->
    ${nameVectorPathSvg}

    <!-- 7. BOTTOM ID CARD FOOTER BAR -->
    <rect x="16" y="572" width="992" height="58" fill="url(#headerGrad)" rx="16" stroke="#FFDE00" stroke-width="2" />
    <text x="512" y="607" font-family="sans-serif" font-weight="900" font-size="13" fill="#FFDE00" text-anchor="middle" letter-spacing="4">GOA, INDIA • 28 - 31 OCT 2026 • #FRAMEINGOA</text>

    <!-- 8. OUTER ID CARD CR80 BORDER WITH ROUNDED CORNERS -->
    <rect x="8" y="8" width="1008" height="632" rx="28" fill="none" stroke="#FFDE00" stroke-width="6" />
  </svg>
  `;

  const avatarOnTemplate = await sharp(baseTemplateBuffer)
    .composite([
      {
        input: circularAvatar,
        left: circleLeft,
        top: circleTop,
      },
    ])
    .png()
    .toBuffer();

  const finalImage = await sharp(avatarOnTemplate)
    .composite([
      {
        input: Buffer.from(overlaySvg),
        left: 0,
        top: 0,
      },
    ])
    .png({ quality: 95 })
    .toBuffer();

  return finalImage;
}

/**
 * Format B: Builder Pass Badge (ID Card Size)
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
  return generateIdCardFrame({
    imageBuffer: options.imageBuffer,
    scale: options.scale,
    offsetX: options.offsetX,
    offsetY: options.offsetY,
    username: options.name || "BUILDER",
  });
}
