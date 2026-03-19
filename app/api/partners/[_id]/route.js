import dbConnect from "../../../../lib/mongoose";
import Brand from "../../../../models/Partner";
export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { _id } = await params;
        const data = await request.json();
        const existingBrand = await Brand.findOne({ name: data.name, _id: { $ne: _id } });
        if (existingBrand) {
            return Response.json({ status: "FAILED", message: "A partner with this name already exists !" }, { status: 400 });
        }
        const brand = await Brand.findByIdAndUpdate(_id, data, { new: true });
        if (!brand) {
            return Response.json({ status: "FAILED", message: "Partner not found !" }, { status: 404 });
        }
        return Response.json({ status: "SUCCESS", message: "Partner updated successfully !", brand }, { status: 200 });
    } catch (error) {
        return Response.json({ status: "FAILED", message: error.message }, { status: 500 });
    }
}
export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { _id } = await params;
        const brand = await Brand.findByIdAndDelete(_id);
        if (!brand) {
            return Response.json({ status: "FAILED", message: "Partner not found !" }, { status: 404 });
        }
        return Response.json({ status: "SUCCESS", message: "Partner deleted successfully !" }, { status: 200 });
    } catch (error) {
        return Response.json({ status: "FAILED", message: error.message }, { status: 500 });
    }
}