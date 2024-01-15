import Joi from "joi";
export const addcateSchema = {
    query: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        sectionID: Joi.string().required()
    }).required()
}
export const updatecateSchema = {
    params: Joi.object({
        cateID: Joi.string().required()
    }).required(),
    query: Joi.object({
        title: Joi.string(),
        sectionID: Joi.string(),
        description: Joi.string()
    }).required()
}
export const deletecateSchema = {
    body: Joi.object({
        title: Joi.string().required()
    }).required()
}
export const GetAllcateSchema = {
    query: Joi.object({
        page: Joi.number().required(),
        size: Joi.number().required()
    }).required()
}
