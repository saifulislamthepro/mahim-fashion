import { NextResponse, NextRequest } from "next/server";
import User from "@/models/User";
import {connectDB} from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {

  const data = await req.json();
  const newRole = data.role;
  await connectDB();

  // params is now a Promise
  const { email } = await params;

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  user.role = newRole;
  await user.save();

  return NextResponse.json({ message: "User upgraded to admin" });
}
