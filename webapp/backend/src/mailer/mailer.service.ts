import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendMail(to: string, subject: string, text: string): Promise<void> {
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY not found in environment variables!');
            throw new Error('Resend API key not configured');
        }

        try {
            const { data, error } = await this.resend.emails.send({
                from: process.env.RESEND_FROM || 'SINTONIA <onboarding@resend.dev>',
                to: [to],
                subject,
                text,
            });

            if (error) {
                console.error('Error sending email:', error);
                throw new Error(error.message);
            }

            console.log('Email sent successfully:', data?.id);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
