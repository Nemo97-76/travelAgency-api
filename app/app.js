import express from "express"
import dotenv from "dotenv"
dotenv.config()
import dbConnect from "../config/dbConnection.js"
import userRoutes from "../routes/userRoutes.js"
import { globalResponse } from "../utilies/errorHandling.js"
import tripRoutes from "../routes/tripRoutes.js"
import cateRoutes from "../routes/categoryRoutes.js"
import sectionRoutes from "../routes/sectionRoute.js"
import reviewRoutes from "../routes/reviewRoutes.js"
import orderRoutes from "../routes/orderRoutes.js"

const app = express()
app.use(express.json())
dbConnect()
app.use("/user", userRoutes)
app.use("/trips", tripRoutes)
app.use("/review", reviewRoutes)
app.use("/categories", cateRoutes)
app.use("/sections", sectionRoutes)
app.use("/order", orderRoutes)


app.all("*", (req, res) => {
    res.status(404).json({
        meessage: "404 page not found"
    })
})
app.use(globalResponse)
export default app