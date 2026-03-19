import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
    },
    feedbackText: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    approved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);