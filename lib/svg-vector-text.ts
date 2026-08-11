/**
 * Pure SVG Vector Path Typography Renderer
 * Converts text strings into pure SVG <path> elements so they render 100% identically
 * on ALL servers (Windows, Linux, Vercel, Sharp, macOS) without relying on system fonts.
 */

// 12x18 Grid Vector Definitions for Bold Sans-Serif Letters
const VECTOR_GLYPHS: Record<string, string> = {
  A: "M 1 18 L 6 1 L 11 18 M 3 11 H 9",
  B: "M 1 1 H 7 Q 11 1 11 5.5 Q 11 9.5 7 9.5 H 1 V 18 H 8 Q 12 18 12 13.5 Q 12 9.5 7.5 9.5 M 1 9.5 H 7.5",
  C: "M 11 4.5 Q 8 1 5.5 1 Q 1 1 1 9.5 Q 1 18 5.5 18 Q 8 18 11 14.5",
  D: "M 1 1 H 6.5 Q 12 1 12 9.5 Q 12 18 6.5 18 H 1 Z",
  E: "M 11 1 H 1 V 18 H 11 M 1 9.5 H 9",
  F: "M 11 1 H 1 V 18 M 1 9.5 H 9",
  G: "M 11 4.5 Q 8 1 5.5 1 Q 1 1 1 9.5 Q 1 18 5.5 18 Q 9.5 18 11 12 H 6 V 8.5 H 11.5 V 18",
  H: "M 1 1 V 18 M 11 1 V 18 M 1 9.5 H 11",
  I: "M 3 1 H 9 M 6 1 V 18 M 3 18 H 9",
  J: "M 8 1 V 13.5 Q 8 18 4 18 Q 1 18 1 14",
  K: "M 1 1 V 18 M 10.5 1 L 1 10.5 L 11 18",
  L: "M 1 1 V 18 H 11",
  M: "M 1 18 V 1 L 6 11 L 11 1 V 18",
  N: "M 1 18 V 1 L 11 18 V 1",
  O: "M 5.5 1 Q 1 1 1 9.5 Q 1 18 5.5 18 Q 10.5 18 10.5 9.5 Q 10.5 1 5.5 1 Z",
  P: "M 1 18 V 1 H 7.5 Q 11.5 1 11.5 5.5 Q 11.5 10 7.5 10 H 1",
  Q: "M 5.5 1 Q 1 1 1 9.5 Q 1 18 5.5 18 Q 10.5 18 10.5 9.5 Z M 7.5 13.5 L 12 18",
  R: "M 1 18 V 1 H 7.5 Q 11.5 1 11.5 5.5 Q 11.5 10 7.5 10 H 1 M 6 10 L 11.5 18",
  S: "M 11 4 Q 9 1 6 1 Q 1.5 1 1.5 5.5 Q 1.5 9.5 6 10 Q 10.5 10.5 10.5 14 Q 10.5 18 5.5 18 Q 2 18 1 14",
  T: "M 1 1 H 11 M 6 1 V 18",
  U: "M 1 1 V 13.5 Q 1 18 6 18 Q 11 18 11 13.5 V 1",
  V: "M 1 1 L 6 18 L 11 1",
  W: "M 1 1 L 3.5 18 L 6 7 L 8.5 18 L 11 1",
  X: "M 1 1 L 11 18 M 11 1 L 1 18",
  Y: "M 1 1 L 6 9.5 V 18 M 11 1 L 6 9.5",
  Z: "M 1 1 H 11 L 1 18 H 11",
  "0": "M 5.5 1 Q 1 1 1 9.5 Q 1 18 5.5 18 Q 10.5 18 10.5 9.5 Q 10.5 1 5.5 1 Z M 9.5 3.5 L 2.5 15.5",
  "1": "M 3.5 4.5 L 6.5 1 V 18 M 3 18 H 10",
  "2": "M 1 4.5 Q 3.5 1 6.5 1 Q 11 1 11 5.5 Q 11 9.5 1 18 H 11.5",
  "3": "M 1 1.5 H 11 L 5.5 9 Q 11 9 11 13.5 Q 11 18 5.5 18 Q 2 18 1 14.5",
  "4": "M 8.5 18 V 1 M 8.5 1 L 1 12 H 11.5",
  "5": "M 10.5 1 H 1.5 V 8.5 H 6.5 Q 11 8.5 11 13 Q 11 18 6 18 Q 2 18 1 14.5",
  "6": "M 9.5 2.5 Q 6.5 1 4.5 1 Q 1 1 1 9.5 Q 1 18 5.5 18 Q 10.5 18 10.5 12 Q 10.5 8 5.5 8 Q 1 8 1 9.5",
  "7": "M 1 1 H 11.5 L 5 18",
  "8": "M 5.5 1 Q 1.5 1 1.5 5.5 Q 1.5 9.5 5.5 9.5 Q 9.5 9.5 9.5 5.5 Q 9.5 1 5.5 1 Z M 5.5 9.5 Q 1 9.5 1 14 Q 1 18 5.5 18 Q 10 18 10 14 Q 10 9.5 5.5 9.5 Z",
  "9": "M 10 9.5 Q 10 8 5.5 8 Q 1 8 1 12 Q 1 18 5.5 18 Q 10 18 10 9.5 Q 10 1 5.5 1 Q 1 1 2 4.5",
  "#": "M 3.5 1 L 2 18 M 8.5 1 L 7 18 M 0.5 6.5 H 11.5 M 0 12.5 H 11",
  "•": "M 4.5 9.5 A 2 2 0 1 1 4.5 9.49 Z",
  "-": "M 1 9.5 H 10",
  "/": "M 1 18 L 10 1",
  ":": "M 5 5 A 1.5 1.5 0 1 1 5 4.99 Z M 5 14 A 1.5 1.5 0 1 1 5 13.99 Z",
};

interface RenderVectorTextOptions {
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  letterSpacing?: number;
  align?: "left" | "center" | "right";
}

/**
 * Renders SVG group containing vector paths for the specified text string
 */
export function renderVectorText(options: RenderVectorTextOptions): string {
  const {
    text,
    x,
    y,
    fontSize = 24,
    fill = "#FFFFFF",
    stroke = fill,
    strokeWidth = 2.5,
    letterSpacing = 4,
    align = "center",
  } = options;

  const chars = text.toUpperCase().split("");
  const scale = fontSize / 18;
  const charWidth = 12 * scale;
  const spacing = letterSpacing * scale;
  const totalWidth = chars.length * charWidth + Math.max(0, chars.length - 1) * spacing;

  let startX = x;
  if (align === "center") {
    startX = x - totalWidth / 2;
  } else if (align === "right") {
    startX = x - totalWidth;
  }

  let svgPaths = "";
  let currentX = startX;

  chars.forEach((char) => {
    if (char === " ") {
      currentX += charWidth + spacing;
      return;
    }

    const pathData = VECTOR_GLYPHS[char];
    if (pathData) {
      svgPaths += `
        <g transform="translate(${currentX.toFixed(1)}, ${y.toFixed(1)}) scale(${scale.toFixed(3)})">
          <path d="${pathData}" fill="none" stroke="${stroke}" stroke-width="${(strokeWidth / scale).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />
        </g>`;
    }
    currentX += charWidth + spacing;
  });

  return `<g class="vector-text">${svgPaths}</g>`;
}
