import dbConnect from "../../../lib/mongoose"
import Admin from "../../../models/Admin";
import bcrypt from "bcrypt"


async function isValidEmail(email) {
    const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`);
    const data = await response.json();

    return data.is_valid_format.value && data.deliverability === "DELIVERABLE";
}

export async function POST(req) {
    try {
        if (req.headers.get("authorization") !== `Bearer ${process.env.SIGNUP_SECRET}`) {
            return Response.json({ status: "FAILED", message: "Unauthorized !" }, { status: 401 });
        }
        await dbConnect();
        const adminsCount = await Admin.countDocuments();
        if (adminsCount > 0) {
            return Response.json({ status: "FAILED", message: "Only one admin is allowed !" }, { status: 400 });
        }

        const { email, password } = await req.json();
        if (!email || !password) {
            return Response.json({ status: "FAILED", message: "Email and password are required!" }, { status: 400 });
        }

        if (!isValidEmail(email)) {
            return Response.json({ status: "FAILED", message: "This email is invalid !" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        await Admin.create({
            email,
            password: hashedPassword
        })
        return Response.json({ status: "SUCCESS", message: "Admin created successfully!" });
    } catch (error) {
        return Response.json({ status: "FAILED", message: error.message }, { status: 500 });
    }
}
