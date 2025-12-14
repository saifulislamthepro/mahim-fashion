import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import fs from "fs";
import path from "path";

const uploadDirectory = process.env.UPLOADS_DIRECTORY;
// ✅ DELETE a category
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const param = await params;
  try {
    const category = await Category.findById(param.id);
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Remove image from public/uploads
    if (category.image) {
          // ✅ GLOBAL uploads directory (outside Next.js)
          const uploadDir = `${uploadDirectory}`;
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
      const imagePath = path.join(process.cwd(), uploadDir, category.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Category.findByIdAndDelete(param.id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// ✅ (Optional) PUT: Update category (change name/image)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const param = await params;
  try {
    const data = await req.formData();
    const name = data.get("name")?.toString();
    const slug = data.get("slug")?.toString();
    const image = data.get("image") as File | null;

    const category = await Category.findById(param.id);
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let imagePath = category.image;

    // If a new image is uploaded
    if (image) {    
      
      // ✅ GLOBAL uploads directory (outside Next.js)
        const uploadDir = `${uploadDirectory}`;
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

      const bytes = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}-${image.name}`;
      const filepath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filepath, bytes);

      // Delete old image
      if (category.image) {
        const oldPath = path.join(process.cwd(), uploadDir, category.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      imagePath = `/uploads/${filename}`;
    }

    category.name = name || category.name;
    category.slug = slug || category.slug;
    category.image = imagePath;

    await category.save();
    return NextResponse.json(category);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
