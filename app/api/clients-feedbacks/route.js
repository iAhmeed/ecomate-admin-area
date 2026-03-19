import dbConnect from "../../../lib/mongoose"
import Feedback from "../../../models/Feedback"
export async function GET(req) {
    try {
        await dbConnect();
        const feedbacks = await Feedback.find({})
        return Response.json({ status: "SUCCESS", message: "Feedbacks found", feedbacks }, { status: 200 });
    } catch (error) {
        return Response.json({ status: "FAILED", message: error.message }, { status: 500 });
    }
}