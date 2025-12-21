import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/db";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const uploadDirectory = process.env.UPLOADS_DIRECTORY;

export async function GET() {
  await connectDB();
  const products = await Product.find({});
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.formData();

    // ✅ GLOBAL uploads directory (outside Next.js)
    const uploadDir = `${uploadDirectory}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
  // Handle image uploads
  const images = data.getAll("images") as File[];
  const savedImagePaths: string[] = [];

for (const image of images) {
  const bytes = Buffer.from(await image.arrayBuffer());
  const filename = `${Date.now()}-${image.name.replace(/\s/g, "-")}`;
  const filepath = path.join(uploadDir, filename);

  // Save original image
  await fs.promises.writeFile(filepath, bytes);
  savedImagePaths.push(`/uploads/${filename}`);
}
  // Generate single thumbnail from first image
  let thumbnail = null;
  if (savedImagePaths.length > 0) {
    // Extract the filename from the URL
    const firstImageFilename = savedImagePaths[0].split("/").pop()!;
    const firstImagePath = path.join(uploadDir, firstImageFilename);
  
    // Thumb filename: add "thumb-" at start, keep rest of name intact
    const thumbFilename = `thumb-${firstImageFilename}.webp`;
    const thumbPath = path.join(uploadDir, thumbFilename);
  
    // Generate thumbnail
    await sharp(firstImagePath)
      .resize({ width: 300 })
      .webp({ quality: 100 })
      .toFile(thumbPath);
  
    thumbnail = `/uploads/${thumbFilename}`;
  }

  // Parse stock
  let stock = [];
  const stockRaw = data.get("stock");

  if (stockRaw) {
    try {
      stock = JSON.parse(stockRaw.toString());
    } catch (err) {
      console.error("❌ Invalid stock format:", err);
      return NextResponse.json(
        { error: "Invalid stock format. Must be valid JSON array." },
        { status: 400 }
      );
    }
  }

  const product = new Product({
    title: data.get("title"),
    category: data.get("category"),
    price: Number(data.get("price")),
    productId: data.get('productId'),
    stock, // ← properly parsed array
    images: savedImagePaths,
    description: data.get("description"),
    featured: false,
    thumbnail
  });

  await product.save();

  return NextResponse.json(product, { status: 201 });
}
