import express from "express"
import { asyncHandler } from '../utilies/errorHandling.js'
import * as UC from "../controllers/Users/userController.js"
import * as validators from "../controllers/Users/userValidations.js"
import { validationCoreFunction } from "../middelwares/validationCoreFunc.js"
import { multerCloudFunction } from "../servies/multerCloudinary.js"
import { allowedExtentions } from "../utilies/allawedExtentions.js"

const userRoutes = express.Router()
userRoutes.post("/signup", validationCoreFunction(validators.signUpSchema), multerCloudFunction(allowedExtentions.image).single("image"), asyncHandler(UC.SignUp))
userRoutes.get("/signup/confirm/:token", validationCoreFunction(validators.confirmSchema), asyncHandler(UC.confirmEmail))
userRoutes.post("/signin", validationCoreFunction(validators.signInSchema), asyncHandler(UC.signin))
userRoutes.post("/forgetPass", validationCoreFunction(validators.forgetPassSchema), asyncHandler(UC.forgetPass))
userRoutes.post("/restPass/:token", validationCoreFunction(validators.confirmSchema), asyncHandler(UC.restPass))
export default userRoutes

//TODO:user upload profile pic route with cloudinary