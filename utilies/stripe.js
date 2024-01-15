import { Stripe } from "stripe"
export const paymentFunc = async ({
    payment_method_types = ['card'],
    mode = "payment",
    customer_email = "",
    metadata = {},
    successURL,
    cancelURL,
    trips = [],
    currency
}) => {
    const STRIPE = new Stripe(process.env.STRIPEPASS)
    const paymentDATA = await STRIPE.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        metadata,
        successURL,
        cancelURL,
        trips,
        currency
    })
    return paymentDATA
}