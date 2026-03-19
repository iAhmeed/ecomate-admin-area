// app/api/upload/route.js

export const runtime = "nodejs"; // Ensures it's not Edge
export const maxDuration = 60;   // Prevents Vercel timeout

import { NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || typeof file.arrayBuffer !== "function") {
            return NextResponse.json({ error: "No file uploaded or file invalid." }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString("base64")}`, {
            folder: "maison-web"
        });


        return NextResponse.json({ status: "SUCCESS", result });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ status: "ERROR", message: err?.message || String(err) }, { status: 500 });
    }
}
