import orderModel from "../../model/order.js";
import tripModel from "../../model/trip.js";
import UserModel from "../../model/user.js";
import { customAlphabet } from 'nanoid';
import { SendEmailServies } from "../../servies/sendEmailServies.js";
import createInvoice from "../../utilies/pdfkit.js";
import Stripe from "stripe";
import { emailTemplate } from "../../utilies/emailTemplate.js"
const nanoid = customAlphabet('123456ascbhdtel', 7)
export const AddOrder = async (req, res, next) => {
    const { _id } = req.authUser
    const user = await UserModel.findById({ _id })
    if (!user /* || user.isAdmin === true */) {
        return next(new Error("not authorized", { cause: 400 }))
    }
    const { tripID, numberOfMembers, paymentMethod } = req.body
    if (!tripID) {
        return next(new Error("please, pick trip", { cause: 400 }))
    }
    const trip = await tripModel.findById({ _id: tripID })
    if (!trip) {
        return next(new Error("trip not found", { cause: 400 }))
    }
    const price = trip.price
    const totalPrice = price * numberOfMembers
    const customId = nanoid()
    const orderObject = await orderModel.create({
        user: _id,
        orderedTrip: tripID,
        paymentMethod,
        numberOfMembers,
        orderNumber: customId,
        totalPrice,
    })
    user.orders.push(orderObject?._id)
    await user.save()
    const orederInvoice = {
        //invoice header data
        user: user.Name,
        InvoiceNumber: customId,
        date: orderObject.createdAt.toDateString(),
        //table data
        triptitle: trip.title,
        numberOfMembers: orderObject.numberOfMembers,
        startsAt: trip.startsAt,
        endsAt: trip.endsAt,
        totalPrice,
    }
    const pathVar = `../../${customId}.pdf`
    await createInvoice(orederInvoice, pathVar)
    const isEmailSent = SendEmailServies({
        to: user.email,
        subject: "Trip Invoice",
        message: emailTemplate({
            linkdata: "your invoice in the attachments",
            subject: "Trip Invoice",
            paragarph: `you have booked a trip with us "${trip.title}" successfully ,so heres your invoice , thanks for choosing us ,see you soon`
        }),
        attachments: [{
            path: `../../${customId}.pdf`
        }]
    })
    if (!isEmailSent) {
        return next(new Error("fail to send confirmation email,please try again later", { cause: 400 }))
    }
    const stripe = new Stripe(process.env.STRIPEPASS);
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price_data: {
                currency: "EGP",
                product_data: {
                    name: trip.title,
                    description: trip.description
                },
                unit_amount: trip.price * 100,
            },
            quantity: numberOfMembers
        },
        ],
        mode: "payment",
        success_url: "http://localhost:3120/order/success",
        cancel_url: "http://localhost:3120/order/cancel"
    })

    //payment webhook
    res.status(201).json({
        message: "order created see you soon",
        orderObject,
        url: session.url
    })
}
export const successOrder = async (req, res, next) => { }
export const cancelOrder = async (req, res, next) => { }