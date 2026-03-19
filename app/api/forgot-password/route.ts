import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Password_reset from "../../../models/Password_reset";
import Admin from "../../../models/Admin";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ status: "FAILED", message: "Email is required !" }, { status: 400 });
        }

        await dbConnect();
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({ status: "FAILED", message: "Email not found !" }, { status: 404 });
        }
        let token
        token = crypto.randomBytes(32).toString("hex");
        let existingReset
        existingReset = await Password_reset.findOne({ token });
        while (existingReset) {
            token = crypto.randomBytes(32).toString("hex");
            existingReset = await Password_reset.findOne({ token });
        }
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        const newPasswordReset = new Password_reset({
            email,
            token,
            expiresAt,
        });
        await newPasswordReset.save();
        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
        await sendResetEmail(email, resetLink);

        return NextResponse.json({ status: "SUCCESS", message: "Reset link sent !" }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ status: "FAILED", message: err.message }, { status: 500 })
    }
}

async function sendResetEmail(email: string, resetLink: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🔐 Password reset - Ecomate Admin Area",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #07101f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #07101f; padding: 40px 20px; font-family: 'Inter', Arial, sans-serif;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="600px" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0a1628; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.15);">
                    
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <h1 style="font-family: 'Poppins', Arial, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; margin: 0;">
                                Eco<span style="color: #10B981;">Mate</span>
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding-bottom: 20px;">
                            <h2 style="font-family: 'Poppins', Arial, sans-serif; font-size: 20px; font-weight: 700; color: #ffffff; margin: 0 0 15px 0; text-align: center;">
                                Password Reset Request
                            </h2>
                            <p style="font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 15px 0;">
                                Hello,
                            </p>
                            <p style="font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0;">
                                We received a request to reset the password for your EcoMate account. Click the button below to securely create a new password.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 25px 0 35px 0;">
                            <a href="${resetLink}" style="display: inline-block; font-family: 'Poppins', Arial, sans-serif; background-color: #2563EB; color: #ffffff; padding: 14px 32px; font-size: 15px; font-weight: 700; border-radius: 12px; text-decoration: none; box-shadow: 0 0 20px rgba(37,99,235,0.4);">
                                Reset password
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding-bottom: 25px;">
                            <div style="display: inline-block; background-color: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); border-radius: 8px; padding: 10px 16px;">
                                <p style="font-size: 13px; font-weight: 600; color: #10B981; margin: 0;">
                                    This link will expire in 30 minutes.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style="font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.6; text-align: center; margin: 0;">
                                If you did not request this reset, please ignore this email or change your password immediately to protect your account.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding-top: 30px;">
                            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 0 0 25px 0;">
                            <p style="font-size: 12px; color: rgba(255,255,255,0.28); text-align: center; margin: 0;">
                                © ${new Date().getFullYear()} EcoMate — All rights reserved
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`,
    });

}
