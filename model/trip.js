import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema
const tripsSchema = new Schema({
    title: {
        type: String,
    },//Added by admin
    updatedBy: {
        type: Types.ObjectId,
        ref: "user",
    },//auto
    AddedBy: {
        type: Types.ObjectId,
        ref: "user",
    },//auto
    description: {
        type: String,
    },//added by admin
    customId: String,//auto
    images:
        [
            {
                secure_url: {
                    type: String,
                    default: ""
                },
                public_id: {
                    default: "",
                    type: String,
                }
            }
        ]
    ,//Added by admin
    reviews: [
        {
            reviewID: {
                type: Types.ObjectId,
                ref: "review"
            },
            reviewAddedby: {
                type: Types.ObjectId,
                ref: "user"
            },
        }
    ],//Added by user
    rate: {
        type: Number,
        default: 0
    }
    ,
    sectionID: {
        type: Types.ObjectId,
        ref: "section",
    },
    categoryID: {
        type: Types.ObjectId,
        ref: "category",
    },
    price: {
        type: Number,
    },//Added by admin
    numberOfNights: {
        type: Number,
    },//Added by admin
    startsAt: {
        type: String,
    },//Added by admin
    endsAt: {
        type: String,
    }//Added by admin
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})

const tripModel = mongoose.model("trip", tripsSchema)
export default tripModel