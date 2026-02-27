import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  await connectDB();

  const sales = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalSales: { $sum: "$total" }
      }
    },
    { $sort: { "createdAt": -1 } }
  ]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formatted = months.map((month, index) => {
    const found = sales.find(s => s._id === index + 1);
    return {
      month,
      amount: found ? found.totalSales : 0
    };
  });

  console.log(formatted);
  return NextResponse.json(formatted);
}
