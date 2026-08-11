import { NextRequest, NextResponse } from "next/server";
import { generatePfpFrame, generateBuilderCard } from "@/lib/image-processor";
import { saveGraphic } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let format: "pfp" | "builder-card" = "pfp";
    let imageBuffer: Buffer | null = null;
    let name = "";
    let role = "";
    let title = "";
    let frameStyle: "emerald-goa" | "sunshine-yellow" | "sunset-pink" | "vip-beach" = "emerald-goa";
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      format = (formData.get("format") as "pfp" | "builder-card") || "pfp";
      name = (formData.get("name") as string) || "";
      role = (formData.get("role") as string) || "";
      title = (formData.get("title") as string) || "";
      frameStyle = (formData.get("frameStyle") as any) || "emerald-goa";
      scale = parseFloat((formData.get("scale") as string) || "1");
      offsetX = parseFloat((formData.get("offsetX") as string) || "0");
      offsetY = parseFloat((formData.get("offsetY") as string) || "0");

      const file = formData.get("file") as File | null;
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
      }
    } else {
      const body = await req.json();
      format = body.format || "pfp";
      name = body.name || "";
      role = body.role || "";
      title = body.title || "";
      frameStyle = body.frameStyle || "emerald-goa";
      scale = body.scale || 1;
      offsetX = body.offsetX || 0;
      offsetY = body.offsetY || 0;

      if (body.imageBase64) {
        const base64Data = body.imageBase64.replace(/^data:image\/\w+;base64,/, "");
        imageBuffer = Buffer.from(base64Data, "base64");
      }
    }

    if (!imageBuffer) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    let generatedPngBuffer: Buffer;

    if (format === "builder-card") {
      generatedPngBuffer = await generateBuilderCard({
        imageBuffer,
        name,
        role,
        title,
        scale,
        offsetX,
        offsetY,
      });
    } else {
      generatedPngBuffer = await generatePfpFrame({
        imageBuffer,
        scale,
        offsetX,
        offsetY,
        frameStyle,
      });
    }

    const dataUri = `data:image/png;base64,${generatedPngBuffer.toString("base64")}`;

    // Store graphic for dynamic Open Graph X link sharing
    const id = saveGraphic({
      format,
      imageDataUri: dataUri,
      name,
      role,
      title,
    });

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const shareUrl = `${protocol}://${host}/share/${id}`;

    return NextResponse.json({
      success: true,
      id,
      shareUrl,
      imageDataUri: dataUri,
      fileName: format === "builder-card" ? "frameingoa-builder-card.png" : "frameingoa-pfp.png",
    });
  } catch (error: any) {
    console.error("Error generating graphic:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate graphic" },
      { status: 500 }
    );
  }
}
