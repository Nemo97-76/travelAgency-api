import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    customId: String,
    updatedBy: {
        type: Types.ObjectId,
        ref: "user",
    },
    AddedBy: {
        type: Types.ObjectId,
        ref: "user",
    },
    sectionID: {
        type: Types.ObjectId,
        ref: "section"
    },
    images:
        [{
            secure_url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            }
        }],
    trips: [
        {
            type: Types.ObjectId,
            ref: "trip"
        }
    ]
}, {
    timestamps: true
})
const categoryModel = mongoose.model("category", categorySchema)

export default categoryModel