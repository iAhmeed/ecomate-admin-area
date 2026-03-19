import dbConnect from "../../../lib/mongoose";
import Admin from "../../../models/Admin";
import bcrypt from "bcrypt"
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const { email, password } = await req.json()
        if (!email || !password) {
            return Response.json({ status: "FAILED", message: "Email and password are required !" }, { status: 400 })
        }
        await dbConnect();
        const admin = await Admin.findOne({ email })
        if (!admin) {
            return Response.json({ status: "FAILED", message: "Admin not found !" }, { status: 404 })
        }

        const hashedPassword = admin.password
        const passwordMatch = await bcrypt.compare(password, hashedPassword)
        if (!passwordMatch) {
            return Response.json({ status: "FAILED", message: "Incorrect password !" }, { status: 401 })
        }

        const secretKey = process.env.SESSION_SECRET;
        if (!secretKey) {
            return Response.json({ status: "FAILED", message: "Server error : session secret not configured" }, { status: 500 })
        }
        const encodedKey = new TextEncoder().encode(secretKey);

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  // token expires after 7 days
        const adminId = String(admin._id)
        const tokenVersion = admin.tokenVersion || 0
        const session = await new SignJWT({ adminId, tokenVersion }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(encodedKey);

        (await cookies()).set("session", session, {
            httpOnly: true,
            secure: true,
            expires: expiresAt
        })

        return Response.json({ status: "SUCCESS", message: "Authenticated successfully !", userData: admin, token: session }, { status: 200 })

    } catch (err) {
        return Response.json({ status: "FAILED", message: err.message }, { status: 500 })
    }
}
