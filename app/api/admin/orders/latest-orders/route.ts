import { NextRequest, NextResponse } from "next/server";


import Order from "@/models/Order";

export async function GET() {
      try {
    const orders = await Order.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(5) // assuming Order has a user reference

   return NextResponse.json(orders);
  } catch (err) {
   return NextResponse.json({ error: "Failed to fetch latest orders" });
  }

}