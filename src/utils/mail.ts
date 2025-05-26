import nodemailer from 'nodemailer';
import { asyncWrap } from './asyncWrap';
import { MAILID, MAILPASS } from '../config/config';

export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: MAILID,
            pass: MAILPASS
        },
    });

    // Setup email data
    let mailOptions = {
        from: MAILID,
        to: to,
        subject: subject,
        text: text,
        html: html || "",
    };

    // Send email with defined transport object
    let [err, info] = await asyncWrap(transporter.sendMail(mailOptions))

    if (err) {
        console.log(err)
    } else {
        console.log('Message sent: %s', info.messageId);
        return {
            success: true
        }
    }
}