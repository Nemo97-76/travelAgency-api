import express from "express";
import { isAuth } from "../middelwares/Authraized.js";
import { validationCoreFunction } from "../middelwares/validationCoreFunc.js";
import * as validators from '../controllers/order/ordervalidation.js'
import { asyncHandler } from "../utilies/errorHandling.js";
import * as OC from "../controllers/order/orderController.js"
const orderRoutes = express.Router()
orderRoutes.post("/", isAuth(), validationCoreFunction(validators.AddOrderSchema), asyncHandler(OC.AddOrder))
orderRoutes.post("/success/:token", isAuth(), validationCoreFunction(validators.successOrderSchema), asyncHandler(OC.successOrder))
orderRoutes.delete("/cancel/:token", isAuth(), validationCoreFunction(validators.cancelOrderSchema), asyncHandler(OC.cancelOrder))

export default orderRoutes