import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendReceiptEmail(to: string, alumnoName: string, pdfBuffer: Buffer) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Comprobante de Pago - SiSCapacitaciones',
      html: `
        <h2>Hola ${alumnoName},</h2>
        <p>Adjuntamos el comprobante de tu pago realizado.</p>
        <p>Gracias por confiar en SiSCapacitaciones.</p>
      `,
      attachments: [
        {
          filename: 'comprobante.pdf',
          content: pdfBuffer,
        },
      ],
    });
  }
}
