import dbConnect from "../../../lib/mongoose";
import Admin from "../../../models/Admin";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
export async function PUT(req) {
    try {
        await dbConnect();
        const { oldPassword, newPassword } = await req.json();

        const cookieStore = await cookies();
        const session = cookieStore.get("session")?.value;

        if (!session) {
            return Response.json(
                { status: "FAILED", message: "Unauthorized" },
                { status: 401 }
            );
        }

        const secret = process.env.SESSION_SECRET;
        const encodedKey = new TextEncoder().encode(secret);

        const { payload } = await jwtVerify(session, encodedKey);
        const adminId = String(payload.adminId);

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return Response.json(
                { status: "FAILED", message: "Admin not found !" },
                { status: 404 }
            );
        }

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return Response.json(
                { status: "FAILED", message: "Incorrect old password !" },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        admin.password = hashedNewPassword;
        admin.tokenVersion += 1;
        await admin.save();
        return Response.json({
            status: "SUCCESS",
            message: "Password changed successfully !",
        });

    } catch (error) {
        return Response.json(
            { status: "FAILED", message: error.message },
            { status: 500 }
        );
    }
}
