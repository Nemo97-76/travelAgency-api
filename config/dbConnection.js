import mongoose from "mongoose";
const dbConnect = async () => {
    return await mongoose.connect("mongodb://127.0.0.1:27017/project")
        .then((res) => console.log('DB connected successfully'))
        .catch((err) => console.log('connection faild', err))
}
export default dbConnect