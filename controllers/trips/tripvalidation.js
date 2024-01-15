import Joi from "joi";
export const addtripSchema = {
    query: Joi.object({
        title: Joi.string().required(), sectionID: Joi.string().required(), categoryID: Joi.string().required(), description: Joi.string().required(), price: Joi.number().required(), numberOfNights: Joi.number(), startsAt: Joi.string(), endsAt: Joi.string()
    }).required()
}

export const updatetripSchema = {
    query: Joi.object({
        title: Joi.string(), sectionID: Joi.string(), categoryID: Joi.string(), description: Joi.string(), price: Joi.number(), numberOfNights: Joi.number(), startsAt: Joi.date(), endsAt: Joi.date()
    }),
    params: Joi.object({
        tripID: Joi.string().required()
    })
}
export const deletetripSchema = {
    body: Joi.object({
        title: Joi.string().required()
    })
}
export const getAlltripsSchema = {
    query: Joi.object({
        page: Joi.number().required(),
        size: Joi.number()
    }).required()
}