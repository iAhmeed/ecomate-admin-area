import dbConnect from "@/lib/mongoose";
import Admin from "@/models/Admin";

export async function POST(req) {
    const { adminId, tokenVersion } = await req.json();
    await dbConnect();

    const admin = await Admin.findById(adminId);

    // If admin doesn't exist or version doesn't match, session is invalid
    if (!admin || admin.tokenVersion !== tokenVersion) {
        return Response.json({ isValid: false });
    }

    return Response.json({ isValid: true });
}