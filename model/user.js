import Types from "joi";
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    Name: {
        type: String,
    },
    userImage:
    {
        secure_url: {
            type: String,
        },
        public_id: {
            type: String,
        }
    }
    ,
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: "order"
    }],
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isConfirm: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true }
    },
)
const UserModel = mongoose.model("user", UserSchema);
export default UserModel