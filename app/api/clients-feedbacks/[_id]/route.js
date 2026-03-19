import dbConnect from "../../../../lib/mongoose";
import Feedback from "../../../../models/Feedback";
export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { _id } = await params;
        const feedback = await Feedback.findById(_id);
        if (!feedback) {
            return Response.json({ status: "FAILED", message: "Feedback not found" }, { status: 404 });
        }
        feedback.approved = !feedback.approved; // Toggle the approval status
        await feedback.save();
        return Response.json({ status: "SUCCESS", message: "Feedback approved !", feedback }, { status: 200 });
    } catch (error) {
        return Response.json({ status: "FAILED", message: error.message }, { status: 500 });
    }
}
export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { _id } = await params;
        const feedback = await Feedback.findByIdAndDelete(_id);
        if (!feedback) {
            return Response.json({ status: "FAILED", message: "Feedback not found" }, { status: 404 });
        }
        return Response.json({ status: "SUCCESS", message: "Feedback deleted !" }, { status: 200 });
    } catch (error) {
        return Response.json({ status: "FAILED", message: error.message }, { status: 500 });
    }
}