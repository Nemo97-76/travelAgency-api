import UserModel from '../model/user.js'
import { generation, verifyToken } from '../utilies/TokenFunc.js'
export const isAuth = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers
            if (!authorization) {
                return next(new Error('Please signin first', { cause: 400 }))
            }

            if (!authorization.startsWith('project')) {
                return next(new Error('invalid token prefix', { cause: 400 }))
            }

            const splitedToken = authorization.split(' ')[1]

            try {
                const decodedData = verifyToken({
                    token: splitedToken,
                    signature: process.env.SIGN_IN_SIGNATURE,
                })
                const findUser = await UserModel.findById(
                    decodedData._id
                )
                if (!findUser) {
                    return next(new Error('Please SignUp', { cause: 400 }))
                }
                req.authUser = findUser
                next()
            } catch (error) {
                if (error == 'TokenExpiredError: jwt expired') {
                    const user = await UserModel.findOne({ token: splitedToken })
                    if (!user) {
                        return next(new Error('invalid token', { cause: 400 }))
                    }
                    const userToken = generation({
                        payload: {
                            email: user.email,
                            _id: user._id,
                        },
                        signature: process.env.SIGN_IN_SIGNATURE,
                        expiresIn: '1h',
                    })

                    if (!userToken) {
                        return next(
                            new Error('fail to generate token, payload canot be empty', {
                                cause: 400,
                            }),
                        )
                    }
                    await UserModel.findOneAndUpdate(
                        { token: splitedToken },
                        { token: userToken },
                    )
                    return res.status(200).json({ message: 'Token refreshed', userToken })
                }
                return next(new Error('invalid token', { cause: 500 }))
            }
        } catch (error) {
            console.log(error)
            next(new Error('catch error in auth', { cause: 500 }))
        }
    }
}