import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial, sans-serif;">
    <table width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:480px;background:white;border-radius:12px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h2 style="color:#FF7D29;margin:0;font-size:22px;">Password Reset Request</h2>
              </td>
            </tr>
            <tr>
              <td style="color:#555;font-size:16px;line-height:24px;">
                <p>Hello,</p>
                <p>You requested a password reset. Use the code below to continue:</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:25px 0;">
                <div style="font-size:32px;font-weight:bold;letter-spacing:5px;background:#FFF3E6;color:#FF7D29;padding:15px 25px;border-radius:8px;border:1px solid #FFD2B3;display:inline-block;">
                  {{OTP}}
                </div>
              </td>
            </tr>
            <tr>
              <td style="color:#555;font-size:15px;line-height:24px;padding-bottom:20px;">
                <p>This OTP expires in <strong>10 minutes</strong>.</p>
                <p>If you didn’t request this, simply ignore the email.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="color:#777;font-size:13px;padding-top:15px;border-top:1px solid #eee;">
                <p style="margin-top:10px;">Need help? Just reply to this email.</p>
                <p style="font-size:12px;color:#aaa;">&copy; 2025 Your Company Name. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export async function GET(req: NextRequest, {params}: { params: Promise<{ email: string }> }) {
    await connectDB();
    const param = await params;

    const user = await User.findOne({email: param.email})

    if (!user) {
        return NextResponse.json({account: false})
    } else {
        // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetOtp = crypto.createHash("sha256").update(otp).digest("hex");
  user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save();

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"smart" <${process.env.EMAIL_USER}>`,
    to: param.email,
    subject: "Your Password Reset OTP",
    html: htmlTemplate.replace("{{OTP}}", otp),
  });

    return NextResponse.json({ message: "OTP sent successfully", account: true });
    }
}