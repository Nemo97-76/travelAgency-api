import UserModel from "../../model/user.js";
import pkg, { hashSync } from "bcrypt"
import { SendEmailServies } from "../../servies/sendEmailServies.js";
import { emailTemplate } from "../../utilies/emailTemplate.js";
import { generation, verifyToken } from "../../utilies/TokenFunc.js";
import cloudinary from "cloudinary"
//TODO:user upload profile pic


//sign up user
export const SignUp = async (req, res, next) => {
    const { Name, email, password, isAdmin } = req.query
    const isUserExsit = await UserModel.findOne({ email })
    if (isUserExsit) {
        return next(new Error("user aleardy exsit ,try to sign in", { cause: 400 }))
    }
    const hashedPassword = hashSync(password, +process.env.SALT_Rounds);
    const token = generation({
        payload: {
            email,
            Name,
        },
        signature: process.env.CONFIRMATION_EMAIL_SIGNATURE,
        expiresIn: '12h'
    })
    const confirmationLink = `${req.protocol}://${req.headers.host}/singup/confirm/${token}`
    const isEmailSent = SendEmailServies({
        to: email,
        subject: "Email confirmation",
        message: emailTemplate({
            link: confirmationLink,
            linkdata: "confirm email address",
            subject: "Please confirm your email address",
            paragarph: "To finish signing up, please confirm your email address. This ensures we have the right email in case we need to contact you."
        }),
    })
    if (!isEmailSent) {
        return next(new Error("fail to send confirmation email,please try again later", { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error("please upload your picture", { cause: 400 }))
    }
    try {
        var { secure_url, public_id } = await cloudinary.v2.uploader.upload(req.file.path, { folder: `${process.env.project_folder}/sections/${section.customId}/categories/${category.customId}/trips/${customId}` })
    } catch (error) {
        console.log(error);
    }
    const userObject = await UserModel.create({
        Name,
        email,
        password: hashedPassword,
        isAdmin,
        userImage: {
            secure_url,
            public_id
        }
    })
    res.status(201).json({
        message: ` ${Name} signed up ,please check your email to confirm `,
        userObject,
        token
    })
}
///////////////////////////////////////////////
//confirm email
export const confirmEmail = async (req, res, next) => {
    const { token } = req.params
    const decode = verifyToken({
        token,
        signature: process.env.CONFIRMATION_EMAIL_SIGNATURE
    })
    const user = await UserModel.findOneAndUpdate(
        { email: decode?.email, isConfirm: false },
        { isConfirm: true },
        { new: true }
    )
    if (!user) {
        return next(new Error('already confirmed', { cause: 400 }))
    }
    res.status(200).json({
        message: "confirmed , try to signin "
    })
}
///////////////////////////////////////////////////////////
//sign in
export const signin = async (req, res, next) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) {
        console.log(user);
        return next(new Error("wrong password or email", { cause: 400 }))
    }
    const decodedPass = pkg.compareSync(password, user.password)
    if (!decodedPass) {
        return next(new Error("wrong password or email", { cause: 400 }))
    }
    const token = generation({
        payload: {
            email,
            _id: user._id
        },
        signature: process.env.SIGN_IN_SIGNATURE,
        expiresIn: "12h"
    })
    res.status(200).json({
        message: `signed in, welcome ${user.Name}`,
        user, token
    })
}

/* ////////
//user profile
export const getUserProfile = async (req, res, next) => {
    const { Name } = req.params
    const user = await UserModel.findOne({ Name })
    if (!user) {
        return next(new Error('user not found ,please sign up first', { cause: 400 }))
    }
    res.status(200).json({
        message: `this is ${Name} porfile page`,
        user
    })
} */

//forget pass
export const forgetPass = async (req, res, next) => {
    const { email } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) {
        return next(new Error("invalid email", { cause: 400 }))
    }
    const token = generation({
        payload: {
            email,
            sentcode: hashedcode
        },
        signature: process.env.RESET_SIGNATURE,
        expiresIn: '12h'
    })
    const forgetPassLink = `${req.protocol}://${req.headers.host}/user/restPass/${token}`
    const isEmailSent = SendEmailServies({
        to: email,
        subject: "restore password",
        message: emailTemplate({
            link: forgetPassLink,
            linkdata: "rest your password",
            subject: "forget psasword",
            paragarph: "click below to restore your password,if you haven't requested to restore password ignore this email"
        })
    })
    if (!isEmailSent) {
        return next(new Error("fail to send email ,please try again later", { cause: 400 }))
    }
    res.status(200).json({
        message: "done you can rest your pass now"
    })
}
//restPass throughtEmail

export const restPass = async (req, res, next) => {
    const { token } = req.params
    const decoded = verifyToken({ token, signature: process.env.reset_signature })
    const user = await UserModel.findOne({ email: decoded?.email })
    const { newpassword } = req.body
    const newHashedPass = pkg.hashSync(newpassword, process.env.SALT_Rounds)
    user.password = newHashedPass
    const resetPassData = await user.save()
    if (!resetPassData) {
        return next(new Error("fail to rest password, plaese try again later", { cause: 400 }))
    }
    res.status(200).json({
        message: "done",
        resetPassData
    })
}
