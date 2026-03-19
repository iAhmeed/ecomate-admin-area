import dbConnect from "../../../lib/mongoose"
import Service from "../../../models/Service"
export async function GET() {
    try {
        await dbConnect()
        const services = await Service.find({})
        return Response.json({ status: "SUCCESS", message: "Services found", services }, { status: 200 })
    } catch (error) {
        console.error("Error fetching services:", error)
        return Response.json({ status: "FAILED", message: error.message }, { status: 500 })
    }
}
export async function POST(request) {
    try {
        await dbConnect()
        const data = await request.json()
        const existingService = await Service.findOne({ title: data.title })
        if (existingService) {
            return Response.json({ status: "FAILED", message: "A service with this title already exists !" }, { status: 400 })
        }
        const newService = new Service(data)
        await newService.save()
        return Response.json({ status: "SUCCESS", message: "Service added successfully !", service: newService }, { status: 200 })
    } catch (error) {
        return Response.json({ status: "FAILED", message: error.message }, { status: 500 })
    }
}
