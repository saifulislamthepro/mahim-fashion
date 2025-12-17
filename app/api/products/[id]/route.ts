import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/db";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const uploadDirectory = process.env.UPLOADS_DIRECTORY;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const param = await params;
  const product = await Product.findById(param.id);
  if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const param = await params;

  const data = await req.formData();    
  const uploadDir = `${uploadDirectory}`;
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const images = data.getAll("images") as File[];
  const savedImagePaths: string[] = [];

  for (const image of images) {
    const bytes = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}-${image.name.replace(/\s/g, "-")}`;
    const filepath = path.join(uploadDir, filename);

    await fs.promises.writeFile(filepath, bytes);
    savedImagePaths.push(`/uploads/${filename}`);
  }

  // Keep old images if no new ones are uploaded
  const existingImages = JSON.parse(data.get("existingImages")?.toString() || "[]");
  const finalImages = [...existingImages, ...savedImagePaths];

  const stock = JSON.parse(data.get("stock")?.toString() || "[]");

  // Generate single thumbnail from first image
  let thumbnail = null;
  if (finalImages.length > 0) {
    const firstImagePath = path.join(uploadDir, finalImages[0].split("/").pop()!);
    const thumbFilename = `thumb-${Date.now()}.webp`;
    const thumbPath = path.join(uploadDir, thumbFilename);

    await sharp(firstImagePath).resize({ width: 300 }).webp({ quality: 100 }).toFile(thumbPath);
    thumbnail = `/uploads/${thumbFilename}`;
  }

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
      thumbnail,
      featured: Boolean(data.get("featured")),
    },
    { new: true }
  );

  if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
};


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const param = await params;
  const product = await Product.findById(param.id);

  if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const imgUrls: string[] = product.images || [];
  const thumbnailUrl: string | null = product.thumbnail || null;

  [...imgUrls, ...(thumbnailUrl ? [thumbnailUrl] : [])].forEach((url) => {
    try {
      const filename = url.split("/").pop();
      if (!filename) return;

      const filepath = path.join(uploadDirectory!, filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    } catch (err) {
      console.log("Error deleting file:", err);
    }
  });

  await Product.findByIdAndDelete(param.id);
  return NextResponse.json({ message: "Deleted successfully" });
};
