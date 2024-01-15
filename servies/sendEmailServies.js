import nodemailer from "nodemailer"
export const SendEmailServies = async ({
    to, subject, message, attachments = []
} = {}) => {

    const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 587,
        secure: false,
        service: 'gmail',
        auth: {
            user: 'tasneemyoussef61@gmail.com',
            pass: process.env.nodemailerPass
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    const emailInfo = transporter.sendMail({
        from: `Tasneem Youssef tasneemyoussef61@gmail.com`,
        to: to ? to : '',
        subject: subject ? subject : 'hello',
        html: message ? message : '',
        attachments,
    }, (error, info) => {
        error ? console.log("error sending email", error) : console.log("successful,ckeck your email");
    })
    return true
}