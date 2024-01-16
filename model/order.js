import mongoose, { Schema, Types } from "mongoose";
const ordreScema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "user"
    },
    orderedTrip: [{
        type: Types.ObjectId,
        ref: "trip"
    }],
    paymentMethod: {
        type: String,
        enum: ["card", "cash"],
        default: "cash"
    },
    numberOfMembers: {
        type: Number,
        default: 1
    },
    paymentStatus: {
        type: String,
        default: "not paid",
        enum: ["not paid", "paid"]
    },
    currency: {
        type: String,
        default: "EGP",
    },
    totalPrice: Number,
    orderNumber: String,
    status: {
        type: String,
        default: "booked up",
        enum: ["booked up", "confirmed", "finished"]
    }
}, {
    toJSON: { virtuals: true },
    timestamps: true
})
const orderModel = mongoose.model("order", ordreScema)
export default orderModel
