import dbConnect from "../../../../lib/mongoose";
import Service from "../../../../models/Service";
export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { _id } = await params;
        const data = await req.json();
        const existingService = await Service.findOne({ title: data.title, _id: { $ne: _id } });
        if (existingService) {
            return Response.json({ status: "FAILED", message: "A service with this title already exists !" }, { status: 400 });
        }
        const updatedService = await Service.findByIdAndUpdate(_id, data, { new: true });
        if (!updatedService) {
            return Response.json({ status: "FAILED", message: "Service not found !" }, { status: 404 });
        }
        return Response.json({ status: "SUCCESS", message: "Service updated successfully !", service: updatedService }, { status: 200 });
    } catch (error) {
        return Response.json({ status: "FAILED", message: error.message }, { status: 500 });
    }
}
export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { _id } = await params;
        const deletedService = await Service.findByIdAndDelete(_id);
        if (!deletedService) {
            return Response.json({ status: "FAILED", message: "Service not found !" }, { status: 404 });
        }
        return Response.json({ status: "SUCCESS", message: "Service deleted successfully !" }, { status: 200 });
    } catch (error) {
        return Response.json({ status: "FAILED", message: error.message }, { status: 500 });
    }
}