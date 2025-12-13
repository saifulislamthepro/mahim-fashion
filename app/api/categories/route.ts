import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import fs from "fs";
import path from "path";

// ✅ GET all categories
export async function GET() {
  await connectDB();
  const categories = await Category.find({}).sort({ createdAt: -1 });
  return NextResponse.json(categories);
}

// ✅ POST: Create category
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const data = await req.formData();
    const name = data.get("name")?.toString();
    const slug = data.get("slug")?.toString();
    const image = data.get("image") as File;

    if (!name || !slug || !image)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // ✅ GLOBAL uploads directory (outside Next.js)
    const uploadDir = "/root/ravaa/uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save image file
    const bytes = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}-${image.name}`;
    const filepath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filepath, bytes);

    const imagePath = `/uploads/${filename}`;

    const category = await new Category({ name, slug, image: imagePath });
    await category.save();
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("Error creating category:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
