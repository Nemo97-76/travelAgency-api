import express from "express";
import { asyncHandler } from "../utilies/errorHandling.js";
import { isAuth } from "../middelwares/Authraized.js";
import * as RC from "../controllers/reviews/reviewsController.js";
import * as validators from '../controllers/reviews/reviewValidation.js'
import { validationCoreFunction } from "../middelwares/validationCoreFunc.js";
const reviewRoutes = express.Router()
reviewRoutes.post("/:tripID", isAuth(), validationCoreFunction(validators.addreviewSchema), asyncHandler(RC.Addreview))
reviewRoutes.delete("/:tripID", isAuth(), validationCoreFunction(validators.deletereviewSchema), asyncHandler(RC.deletereview))
reviewRoutes.put("/:tripID", isAuth(), validationCoreFunction(validators.updateReviewSchema), asyncHandler(RC.updateReview))
export default reviewRoutes