import joi from "joi";
export const signUpSchema = {
    query: joi.object({ Name: joi.string().min(5).required(), email: joi.string().required(), password: joi.string().min(8).required(), isAdmin: joi.boolean().required() }).required()
}
export const confirmSchema = {
    params: joi.object({
        token: joi.string().required()
    }).required()
}
export const signInSchema = {
    body: joi.object({ email: joi.string().required(), password: joi.string().required() }).required()
}
export const forgetPassSchema = {
    body: joi.object({
        email: joi.string().required()
    }).required()
}
