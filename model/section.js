import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema;
const sectionSchema = new Schema({
    customId: String,
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    customId: String,
    AddedBy: {
        type: Types.ObjectId,
        ref: "user"
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: "user"
    },
    categories: [
        {
            type: Types.ObjectId,
            ref: "category",
        }
    ],
    trips: [
        {
            type: Types.ObjectId,
            ref: "trip",
        }
    ],
    images:
        [
            {
                secure_url: {
                    type: String,
                },
                public_id: {
                    type: String,
                }
            }
        ]
}, { timestamps: true, toJSON: { virtuals: true } })
const sectionModel = mongoose.model("section", sectionSchema);
export default sectionModel