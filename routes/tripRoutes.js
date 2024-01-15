import express from "express"
import { asyncHandler } from "../utilies/errorHandling.js"
import * as TC from "../controllers/trips/tripController.js"
import { isAuth } from "../middelwares/Authraized.js"
import { validationCoreFunction } from "../middelwares/validationCoreFunc.js"
import * as validators from "../controllers/trips/tripvalidation.js"
import { multerCloudFunction } from "../servies/multerCloudinary.js"
import { allowedExtentions } from "../utilies/allawedExtentions.js"
const tripRoutes = express.Router()
tripRoutes.post('/addtrip', isAuth(), validationCoreFunction(validators.addtripSchema), multerCloudFunction(allowedExtentions.image).array("image"), asyncHandler(TC.Addtrip))//Admin //ckecked
tripRoutes.post('/updatetrip/:tripID', isAuth(), validationCoreFunction(validators.updatetripSchema), multerCloudFunction(allowedExtentions.image).array("image"), asyncHandler(TC.updatetrip))//Admin//checked
tripRoutes.delete('/deletetrip', isAuth(), validationCoreFunction(validators.deletetripSchema), asyncHandler(TC.deletetrip))//Admin//checked
tripRoutes.get('/', isAuth(), validationCoreFunction(validators.getAlltripsSchema), asyncHandler(TC.getAlltrips))//Admin//ckecke

export default tripRoutes