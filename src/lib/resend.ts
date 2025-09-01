import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email: string, subject: string, html: string) => {
    try {
        const data = await resend.emails.send({
            from: 'Jade Maria <onboarding@clubintimo.shop>',
            to: email,
            subject: subject,
            html: html,
        });
        return data;
    } catch (error) {
        return error;
    }
}