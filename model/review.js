import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    AddedBy: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },//auto
    trip: {
        type: Types.ObjectId,
        ref: "trip",
        required: true,
    },
    reviewContent: {
        type: String,
        required: true,
    },//added by user
    rate: {
        type: Number,
        required: true,
        max: 5,
        min: 1
    }//added by user
}, {
    timestamps: true
})
const reviewModel = mongoose.model("review", reviewSchema)
export default reviewModel