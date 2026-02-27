import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      userId,
      items,
      subtotal,
      shippingCost,
      total,
      firstName,
      lastName,
      phone,
      email,
      address,
      notes,
      shippingZone,
      paymentMethod,
      tran_id,
      city,
      state,
      postcode
    } = body;

    // -------------------------
    // VALIDATION
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items array is required" },
        { status: 400 }
      );
    }

    if (!firstName || !phone || !address) {
      return NextResponse.json(
        { error: "Missing required customer details" },
        { status: 400 }
      );
    }

    // -------------------------
    // CREATE ORDER
    // -------------------------
    const order = await Order.create({
      items,
      userId,
      subtotal,
      shippingCost,
      total,
      firstName,
      lastName,
      phone,
      email,
      city,
      state,
      postcode,
      address,
      notes,
      shippingZone,
      status: "pending",
      paymentMethod,
      tran_id,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("ORDER API ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();

  const orders = await Order.find()
  .sort({ createdAt: -1 });

  return NextResponse.json(orders);
}