import sharp from "sharp";
import path from "path";
import fs from "fs";
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
 * Uses the exact official reference template artwork image (`public/hh-goa-template.jpg`)
 * for 100% pixel-perfect graphic rendering!
 */
export async function generatePfpFrame(options: GeneratePfpOptions): Promise<Buffer> {
  const { imageBuffer, scale = 1, offsetX = 0, offsetY = 0, username = "builder" } = options;

  const targetSize = 1024;

  // Path to official reference template image asset
  const templatePath = path.join(process.cwd(), "public", "hh-goa-template.jpg");
  
  let baseTemplateBuffer: Buffer;
  if (fs.existsSync(templatePath)) {
    baseTemplateBuffer = await sharp(templatePath)
      .resize(targetSize, targetSize, { fit: "fill" })
      .toBuffer();
  } else {
    // Fallback base background if file not found
    baseTemplateBuffer = await sharp({
      create: {
        width: targetSize,
        height: targetSize,
        channels: 4,
        background: { r: 6, g: 68, b: 38, alpha: 1 },
      },
    }).png().toBuffer();
  }

  // Exact coordinates matching the circular frame in the template image
  const circleDiameter = 512;
  const circleCenterX = 512;
  const circleCenterY = 472;
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

  // Crop & resize user photo to circle size
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

  // Clean username handle format
  const rawName = username.trim() || "builder";
  const formattedUsername = rawName.startsWith("@") ? rawName : `@${rawName}`;

  // Generate SVG Overlay to place over the template image:
  // 1. Covers "2:47 PM STUDIO" at top right with dark green rect
  // 2. Covers default username pill with a clean green pill containing ONLY @username in bold vector text
  // 3. Applies inner yellow/white accent ring around circular photo
  const overlaySvg = getTemplateOverlaySvg({
    size: targetSize,
    username: formattedUsername.toLowerCase(),
    circleCenterX,
    circleCenterY,
    circleDiameter,
  });

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

  // Step 2: Composite SVG Overlay (clean username pill & ring frame) on top
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

function getTemplateOverlaySvg(params: {
  size: number;
  username: string;
  circleCenterX: number;
  circleCenterY: number;
  circleDiameter: number;
}): string {
  const { size, username, circleCenterX, circleCenterY, circleDiameter } = params;

  const radius = circleDiameter / 2;

  // Vector Typography for Username
  const usernameVectorText = renderVectorText({
    text: username,
    x: 546,
    y: 730,
    fontSize: 26,
    stroke: "#FFFFFF",
    strokeWidth: 3.8,
    letterSpacing: 2,
    align: "center",
  });

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- 1. REMOVE TIME TEXT "2:47 PM STUDIO" (Cover top right with matching forest green fill) -->
    <rect x="800" y="55" width="180" height="35" fill="#064426" />

    <!-- 2. CIRCULAR FRAME INNER RINGS -->
    <!-- Yellow Outer Ring -->
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${radius + 10}" fill="none" stroke="#FFDE00" stroke-width="16" />

    <!-- Green Inner Line -->
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${radius + 2}" fill="none" stroke="#064426" stroke-width="4" />

    <!-- White Inner Line -->
    <circle cx="${circleCenterX}" cy="${circleCenterY}" r="${radius}" fill="none" stroke="#FFFFFF" stroke-width="3" />

    <!-- 3. CLEAN USERNAME PILL BADGE (Covering old pill & removing "LIVE AT 8:00 PM") -->
    <g transform="translate(326, 690)" filter="url(#shadow)">
      <rect x="0" y="0" width="440" height="64" rx="24" fill="#042917" stroke="#FFDE00" stroke-width="4" />
    </g>

    <!-- Vector Text Layer for Username -->
    ${usernameVectorText}
  </svg>
  `;
}
