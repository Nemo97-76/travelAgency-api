import Joi from "joi";
export const AddOrderSchema = {
}
export const successOrderSchema = {
params:Joi.object({
token:Joi.string().required()
}).required()
}

export const cancelOrderSchema = {
params:Joi.object({
token:Joi.string().required()
}).required()
}
