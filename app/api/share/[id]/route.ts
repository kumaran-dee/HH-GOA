import { NextRequest, NextResponse } from "next/server";
import { getGraphic } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const graphic = getGraphic(id);

  if (!graphic || !graphic.imageDataUri) {
    return new NextResponse("Image not found", { status: 404 });
  }

  // Convert base64 data URI to raw buffer
  const base64Data = graphic.imageDataUri.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
