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
 * Exact alignment fix:
 * 1. Composites circular photo into center window (left: 246, top: 202, diameter: 512px)
 * 2. Covers original pill in template image with a clean matching emerald green pill
 * 3. Renders ONLY @username centered inside pill (zero overlap, zero time text)
 * 4. Blends top right cleanly with zero patch artifacts
 */
export async function generatePfpFrame(options: GeneratePfpOptions): Promise<Buffer> {
  const { imageBuffer, scale = 1, offsetX = 0, offsetY = 0, username = "builder" } = options;

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
        background: { r: 6, g: 68, b: 38, alpha: 1 },
      },
    }).png().toBuffer();
  }

  // Exact coordinates matching circular photo area in hh-goa-template.jpg
  const circleDiameter = 512;
  const circleLeft = 246;
  const circleTop = 202;
  const circleCenterX = circleLeft + circleDiameter / 2;
  const circleCenterY = circleTop + circleDiameter / 2;

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

  // Clean username handle format
  const rawName = username.trim() || "builder";
  const formattedUsername = rawName.startsWith("@") ? rawName : `@${rawName}`;

  // Generate Clean Overlay SVG matching exact pill dimensions of template image
  const overlaySvg = getExactCleanOverlaySvg({
    size: targetSize,
    username: formattedUsername.toLowerCase(),
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

  // Step 2: Composite clean overlay on top to replace old pill & remove time text
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

function getExactCleanOverlaySvg(params: {
  size: number;
  username: string;
}): string {
  const { size, username } = params;

  // Vector Typography for Username (centered inside new pill)
  const usernameVectorText = renderVectorText({
    text: username,
    x: 512,
    y: 742,
    fontSize: 28,
    stroke: "#FFFFFF",
    strokeWidth: 4.0,
    letterSpacing: 2,
    align: "center",
  });

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <!-- 1. REMOVE "2:47 PM STUDIO" WITH SEAMLESS COLOR MATCH (#064426) -->
    <rect x="800" y="55" width="180" height="35" fill="#064426" />

    <!-- 2. CLEAN GREEN PILL OVERLAY (Completely covers old pill & LIVE AT 8:00 PM text) -->
    <g transform="translate(282, 694)">
      <!-- Main Green Pill Container -->
      <rect x="0" y="0" width="460" height="80" rx="30" fill="#04331C" stroke="#FFDE00" stroke-width="5" />
    </g>

    <!-- Vector Text Layer for Username -->
    ${usernameVectorText}
  </svg>
  `;
}
