import sharp from "sharp";
import path from "path";
import fs from "fs";

export interface GeneratePfpOptions {
  imageBuffer: Buffer;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  username?: string;
}

/**
 * Generate Official Hacker House Goa 2026 Circular PFP Frame (1024x1024 PNG)
 * Direct template compositing with clean overlay:
 * 1. Composites user photo into central circular window (left: 246, top: 202, diameter: 512px)
 * 2. Solid large pill patch (width: 490px, height: 92px) completely covering old pill & LIVE AT 8:00 PM
 * 3. Crisp solid white username text (fill: #FFFFFF)
 * 4. Seamless top right background blend removing 2:47 PM STUDIO
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

  // Exact coordinates matching circular photo area in template
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

  // Clean Overlay SVG:
  // - Covers top right "2:47 PM STUDIO" with exact background color (#064426)
  // - Large pill container (width: 490px, height: 92px) completely covering old pill and "LIVE AT 8:00 PM"
  // - Crisp solid white filled username text
  const overlaySvg = `
  <svg width="${targetSize}" height="${targetSize}" viewBox="0 0 ${targetSize} ${targetSize}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="pillShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- 1. REMOVE "2:47 PM STUDIO" (Cover top right seamlessly with exact header color) -->
    <rect x="780" y="50" width="200" height="40" fill="#064426" />

    <!-- 2. LARGE PILL CONTAINER (Completely hides old pill & LIVE AT 8:00 PM text) -->
    <g transform="translate(267, 686)" filter="url(#pillShadow)">
      <rect x="0" y="0" width="490" height="92" rx="34" fill="#04351D" stroke="#FFDE00" stroke-width="5" />
    </g>

    <!-- 3. CRISP SOLID WHITE USERNAME TEXT -->
    <text
      x="512"
      y="743"
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
      font-weight="900"
      font-size="30"
      fill="#FFFFFF"
      text-anchor="middle"
      letter-spacing="2"
    >${escapeXml(formattedUsername)}</text>
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

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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
