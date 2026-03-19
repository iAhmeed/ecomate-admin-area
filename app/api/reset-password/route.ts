import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Password_reset from "../../../models/Password_reset";
import Admin from "../../../models/Admin";
import bcrypt from "bcrypt";

export async function PUT(req: NextRequest) {
    try {
        const { token, newPassword } = await req.json();
        if (!token || !newPassword) {
            return NextResponse.json({ status: "FAILED", message: "A required data field is missing !" }, { status: 400 });
        }
        await dbConnect();
        await Password_reset.deleteMany({ expiresAt: { $lte: new Date() } }); // Clean up expired tokens
        const resetRecord = await Password_reset.findOne({ token });
        if (!resetRecord) {
            return NextResponse.json({ status: "FAILED", message: "Invalid or expired token" }, { status: 400 });
        }

        const email = resetRecord.email;
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await Admin.findOneAndUpdate({ email }, { password: hashedPassword, $inc: { tokenVersion: 1 } });
        await Password_reset.deleteOne({ token });

        return NextResponse.json({ status: "SUCCESS", message: "Password reset successfully" }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ status: "FAILED", message: err.message }, { status: 500 });
    }
}
