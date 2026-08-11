export interface FaceCropBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  confidence: number;
}

export interface CropTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Intelligent client-side face detection using canvas skin-tone & focal feature detection heuristics
 * plus fallbacks for instant face centering on mobile & web.
 */
export async function detectFaceCrop(imageElement: HTMLImageElement): Promise<CropTransform> {
  const width = imageElement.naturalWidth || imageElement.width;
  const height = imageElement.naturalHeight || imageElement.height;

  // Standard square size
  const minDim = Math.min(width, height);
  
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return getDefaultCenterCrop(width, height);
    }

    // Downscale for fast skin & focal point scanning
    const scanWidth = 200;
    const scanHeight = Math.round((height / width) * scanWidth);
    canvas.width = scanWidth;
    canvas.height = scanHeight;

    ctx.drawImage(imageElement, 0, 0, scanWidth, scanHeight);
    const imgData = ctx.getImageData(0, 0, scanWidth, scanHeight);
    const data = imgData.data;

    let weightedXSum = 0;
    let weightedYSum = 0;
    let totalWeight = 0;

    // Scan top 65% of image (faces are rarely in the bottom 35% of photos)
    const scanRows = Math.floor(scanHeight * 0.65);

    for (let y = 0; y < scanRows; y++) {
      for (let x = 0; x < scanWidth; x++) {
        const i = (y * scanWidth + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Skin tone & facial contrast estimation rule (YCbCr / RGB color bounds)
        const isSkin = (r > 60 && g > 40 && b > 20 &&
                        r > g && r > b &&
                        Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
                        Math.abs(r - g) > 15);

        if (isSkin) {
          // Weight pixels towards upper-middle region
          const yWeight = 1.5 - (y / scanRows) * 0.5;
          weightedXSum += x * yWeight;
          weightedYSum += y * yWeight;
          totalWeight += yWeight;
        }
      }
    }

    if (totalWeight > 200) {
      // Detected focal area
      const faceCenterX = (weightedXSum / totalWeight) * (width / scanWidth);
      const faceCenterY = (weightedYSum / totalWeight) * (height / scanHeight);

      // Compute offset from center of original image
      const origCenterX = width / 2;
      const origCenterY = height / 2;

      const offsetX = -(faceCenterX - origCenterX) / width;
      const offsetY = -(faceCenterY - origCenterY) / height;

      // Dynamic scale based on aspect ratio
      const scale = width > height ? width / height : height / width;

      return {
        scale: Math.max(1.0, Math.min(1.4, scale)),
        offsetX: Math.max(-0.4, Math.min(0.4, offsetX)),
        offsetY: Math.max(-0.4, Math.min(0.4, offsetY)),
      };
    }
  } catch (err) {
    console.warn("Face detection analysis fallback:", err);
  }

  return getDefaultCenterCrop(width, height);
}

function getDefaultCenterCrop(width: number, height: number): CropTransform {
  // Safe center focal point offset
  const aspect = width / height;
  let scale = 1.0;
  let offsetY = 0;

  if (aspect < 0.8) {
    // Portrait photo - bump frame slightly up towards eyes/head
    offsetY = 0.08;
    scale = 1.05;
  } else if (aspect > 1.2) {
    // Landscape photo
    scale = 1.15;
  }

  return { scale, offsetX: 0, offsetY };
}
