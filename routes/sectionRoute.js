import express from "express"
import { asyncHandler } from "../utilies/errorHandling.js"
import * as SC from "../controllers/sections/sectionController.js"
import { isAuth } from "../middelwares/Authraized.js"
import * as validators from "../controllers/sections/sectionValidation.js"
import { multerCloudFunction } from "../servies/multerCloudinary.js"
import { allowedExtentions } from "../utilies/allawedExtentions.js"
import { validationCoreFunction } from "../middelwares/validationCoreFunc.js"
const sectionRoutes = express.Router()
sectionRoutes.post("/addsec", isAuth(), validationCoreFunction(validators.addsecSchema), multerCloudFunction(allowedExtentions.image).array("image"), asyncHandler(SC.addsection))
sectionRoutes.get("/", isAuth(), validationCoreFunction(validators.getAllsec), asyncHandler(SC.getAllsecs))
sectionRoutes.delete("/deletesec", isAuth(), validationCoreFunction(validators.deletesecSchema), asyncHandler(SC.deletesec))
sectionRoutes.post("/updatesec", isAuth(), validationCoreFunction(validators.updatesecSchema), multerCloudFunction(allowedExtentions.image).array("image"), asyncHandler(SC.updatesec))


export default sectionRoutes