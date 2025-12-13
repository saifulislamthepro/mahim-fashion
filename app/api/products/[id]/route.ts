import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/db";
import path from "path";
import fs from "fs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const param = await params;
  const product = await Product.findById(param.id);
  if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  const data = await req.formData();    
  
  // ✅ GLOBAL uploads directory (outside Next.js)
      const uploadDir = "/var/www/ravaa/uploads";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

  const images = data.getAll("images") as File[];
  const savedImagePaths: string[] = [];

  for (const image of images) {
    const bytes = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}-${image.name}`;
    const filepath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filepath, bytes);
    savedImagePaths.push(`/uploads/${filename}`);
  }

  // Keep old images if no new ones are uploaded
  const existingImages = JSON.parse(data.get("existingImages")?.toString() || "[]");
  const finalImages = [...existingImages, ...savedImagePaths];

  const stock = JSON.parse(data.get("stock")?.toString() || "[]");

  const param = await params;
  const updated = await Product.findByIdAndUpdate(
    param.id,
    {
      title: data.get("title"),
      category: data.get("category"),
      productId: data.get("productId"),
      price: Number(data.get("price")),
      description: data.get("description"),
      stock,
      images: finalImages,
      featured: Boolean( data.get("featured"))
    }
  );

  await updated.save();
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const param = await params;
  const product = await Product.findById(param.id);
  const imgUrls: string[] = product.images || [];

  // 3️⃣ Delete each image from folder
    imgUrls.forEach((url) => {
      try {
        // Extract filename only (public URL → file)
        const filename = url.split("/").pop();
        if (!filename) {
          console.log("⚠ Invalid URL format:", url);
          return;
        }  
  // ✅ GLOBAL uploads directory (outside Next.js)
      const uploadDir = "/var/www/ravaa/uploads";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
          const filepath = path.join(uploadDir, filename);

        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          console.log("🗑 Deleted file:", filename);
        } else {
          console.log("⚠ File not found:", filename);
        }
      } catch (error) {
        console.log("Error deleting image:", error);
      }
    });

   await Product.findByIdAndDelete(param.id);
   
  return NextResponse.json({ message: "Deleted successfully" });
}
