
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";



export async function DELETE(req: NextRequest) {

    const imgName = await req.json();
    
    
    // Extract just the filename from the URL
    const fileName = imgName.split("/").pop(); // e.g., image-123.png    
    // 
    
    // ✅ GLOBAL uploads directory (outside Next.js)
    const uploadDir = "/root/ravaa/uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Delete file if exists
    fs.unlink(uploadDir, (err) => {
      if (err) {
        console.log("File delete error:", err.message);
      } else {
        console.log("Image deleted:", fileName);
      }
    });

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
      deleted: fileName
    });

  }