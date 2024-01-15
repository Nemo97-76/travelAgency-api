import Joi from "joi";
export const addsecSchema = {
    query: Joi.object({
        title: Joi.string().required()
        , description: Joi.string().required()
    }).required()
}
export const updatesecSchema = {
    query: Joi.object({
        title: Joi.string()
        , description: Joi.string()
    }),
    params: Joi.object({
        sectionID: Joi.string().required()
    }).required()
}
export const deletesecSchema = {
    body: Joi.object({
        title: Joi.string().required()
    }).required()
}
export const getAllsec = {
    query: Joi.object({
        page: Joi.number().required(),
        size: Joi.number().required()
    }).required()
}