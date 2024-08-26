import nodemailer from "nodemailer";
import { envs } from "../../config";


export interface SendMailOptions {
    to: string | string[],
    subject: string,
    htmlBody: string,
    attachments?: Attachment[]
}

export interface Attachment {
    fileName: string,
    path: string
}

export class EmailService {

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    });

    async sendEmail(options: SendMailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachments = [] } = options;

        try {
            const sentInformation = await this.transporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments
            });

            return true;
        } catch (error) {
            return false;
        }
    }

    async sendEmailToRecoverPassword(to: string | string[], token: string) {
        const subject = 'Retrieve your password';

        const htmlBody = `
            <h3>Hi ${to}, for recovering your password, clic the following link:</h3>
            <a href="http://localhost:4200/recover-password/${token}"> Reset password.</a>
            
            <p>Please ignore the message, if you did not require it</p>
        `;


        return await this.sendEmail({ to, subject, htmlBody });
    }

    async sendEmailToValidateAccount(to: string | string[], token: any) {
        const subject = 'Validate your account';

        const htmlBody = `
            <h3>Hi ${to}, for confirming your user, clic the following link:</h3>
            <a href="http://localhost:4200/validate-account/${token}"> Validate account.</a>
            
            <p>Please ignore the message, if you did not require it</p>
        `;


        return await this.sendEmail({ to, subject, htmlBody });
    }




}



