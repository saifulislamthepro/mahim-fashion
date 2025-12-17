import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const uploadDirectory = process.env.UPLOADS_DIRECTORY;

export async function DELETE(req: NextRequest) {
  const imgUrl = await req.json(); // URL of image, e.g., "/uploads/12345-image.png"

  // Extract just the filename
  const fileName = imgUrl.split("/").pop();
  if (!fileName) {
    return NextResponse.json({ success: false, message: "Invalid image URL" });
  }

  // Full path of original image
  const filePath = path.join(uploadDirectory!, fileName);

  // Attempt to delete original image
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("Image deleted:", fileName);
  }

  // Attempt to delete associated thumbnail
  const thumbName = `thumb-${fileName.split(".")[0]}.webp`; // assuming your thumbnail naming pattern
  const thumbPath = path.join(uploadDirectory!, thumbName);
  if (fs.existsSync(thumbPath)) {
    fs.unlinkSync(thumbPath);
    console.log("Thumbnail deleted:", thumbName);
  }

  return NextResponse.json({
    success: true,
    message: "Image and thumbnail deleted successfully",
    deleted: fileName,
  });
}
