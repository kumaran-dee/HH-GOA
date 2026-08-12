/**
 * Converts HEIC/HEIF files to standard JPEG Blobs using heic2any on the client side.
 */
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  const isHeic = file.name.toLowerCase().endsWith(".heic") || 
                 file.name.toLowerCase().endsWith(".heif") || 
                 file.type.toLowerCase().includes("heic") ||
                 file.type.toLowerCase().includes("heif");

  if (!isHeic) {
    return file;
  }

  try {
    // Dynamic import to avoid SSR window errors
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.98,
    });

    if (Array.isArray(converted)) {
      return converted[0];
    }
    return converted;
  } catch (error) {
    console.error("HEIC conversion failed:", error);
    throw new Error("Unable to convert HEIC image. Please upload a JPG or PNG file.");
  }
}
