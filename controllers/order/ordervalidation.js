import Joi from "joi";
export const AddOrderSchema = {
body:Joi.object({
tripID:Joi.string().required(),
numberOfMembers:Joi.number().required(),
paymentMethod:Joi.string().required()
}).required()
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
