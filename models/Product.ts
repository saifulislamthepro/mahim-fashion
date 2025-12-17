import mongoose, { Schema, Document, models } from "mongoose";

export interface ISize {
  name: string;
  stock: number;
}

export interface IProduct extends Document {
  title: string;
  price: number;
  productId: string;
  category: string;
  description: string;
  stock: ISize[];
  images: string[];
  thumbnail: string;
  featured: Boolean
}

const SizeSchema = new Schema<ISize>({
  name: { type: String, required: true },
  stock: { type: Number, required: true },
});

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  productId: { type: String, required: true},
  category: { type: String, required: true },
  description: { type: String },
  stock: [SizeSchema],
  images: [String],
  thumbnail: { type: String },
  featured: {type: Boolean, default: false}
});

export default models.Product || mongoose.model<IProduct>("Product", ProductSchema);
