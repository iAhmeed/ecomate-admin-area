import dbConnect from "../../../lib/mongoose"
import Brand from "../../../models/Brand"
export async function POST(req) {
    try {
        await dbConnect();
        const { name, image } = await req.json();
        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            return Response.json({ status: "FAILED", message: "A partner with this name already exists !" }, {
                status: 400,
            });
        }
        const brand = new Brand({ name, image });
        await brand.save();
        return Response.json({ status: "SUCCESS", message: "Partner added successfully !", brand }, {
            status: 200,
        });
    } catch (error) {
        return Response.json({ status: "FAILED", message: error.message }, {
            status: 500,
        });
    }
}
export async function GET() {
    try {
        await dbConnect();
        const brands = await Brand.find({});
        return Response.json({ status: "SUCCESS", message: "Partners found", brands }, { status: 200 });
    } catch (error) {
        return Response.json({ status: "FAILED", message: error.message }, { status: 500 });
    }
}