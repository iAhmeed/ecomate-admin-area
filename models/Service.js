import mongoose from "mongoose";
import { ImageSchema } from "./Image.js";
const { Schema } = mongoose;

const serviceSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: ImageSchema,
}, {
    timestamps: true,
});

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);
