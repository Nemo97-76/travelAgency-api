import express from "express";
import { asyncHandler } from "../utilies/errorHandling.js";
import * as CC from "../controllers/categories/categoryController.js"
import { isAuth } from "../middelwares/Authraized.js";
import { multerCloudFunction } from "../servies/multerCloudinary.js";
import { allowedExtentions } from "../utilies/allawedExtentions.js";
import * as validators from "../controllers/categories/categoryvalidation.js"
import { validationCoreFunction } from "../middelwares/validationCoreFunc.js"
const cateRoutes = express.Router()
cateRoutes.post("/addcate", isAuth(), validationCoreFunction(validators.addcateSchema), multerCloudFunction(allowedExtentions.image).array("image"), asyncHandler(CC.AddCate))
cateRoutes.post("/updatecate/:cateID", isAuth(), validationCoreFunction(validators.updatecateSchema), multerCloudFunction(allowedExtentions.image).array("image"), asyncHandler(CC.updatecate))
cateRoutes.delete("/deletecate", isAuth(), validationCoreFunction(validators.deletecateSchema), asyncHandler(CC.deletecate))
cateRoutes.get("/", isAuth(), validationCoreFunction(validators.GetAllcateSchema), asyncHandler(CC.getAllCates))
export default cateRoutes