import Joi from "joi";
export const addreviewSchema = {
    params: Joi.object({
        tripID: Joi.string().required()
    }).required()
    , body: Joi.object({
        reviewContent: Joi.string().required(),
        rate: Joi.number().required()
    }).required()
}
export const deletereviewSchema = {
    params: Joi.object({
        tripID: Joi.string().required()
    }).required()
}
export const updateReviewSchema = {
    params: Joi.object({
        tripID: Joi.string().required()
    }).required(),
    body: Joi.object({
        reviewContent: Joi.string(),
        rate: Joi.number()
    }).required()
}

