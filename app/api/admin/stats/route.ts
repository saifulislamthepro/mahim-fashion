// stats.controller.ts
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();

    // Assuming each order has a "totalPrice" field
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
    ]);
    const revenue = revenueAgg[0]?.totalRevenue || 0;

    return NextResponse.json({
      orders: ordersCount,
      revenue,
      users: usersCount,
      products: productsCount,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
};