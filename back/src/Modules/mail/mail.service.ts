import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    if (this.smtpMode === 'disabled') {
      return;
    }

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

  private get smtpMode(): 'disabled' | 'test' | 'production' {
    return (
      (process.env.SMTP_MODE as 'disabled' | 'test' | 'production') ||
      'production'
    );
  }

  private async sendMail(message: nodemailer.SendMailOptions) {
    if (this.smtpMode === 'disabled') {
      return;
    }

    const to =
      this.smtpMode === 'test' ? process.env.SMTP_TEST_RECIPIENT : message.to;
    if (!to) {
      throw new Error(
        'SMTP_TEST_RECIPIENT is required when SMTP_MODE is test.',
      );
    }

    await this.transporter.sendMail({ ...message, to });
  }

  async sendReceiptEmail(to: string, alumnoName: string, pdfBuffer: Buffer) {
    await this.sendMail({
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

  async sendContractSignRequest(
    to: string,
    alumnoName: string,
    inscripcionId: string,
    pdfBuffer: Buffer,
  ) {
    const signUrl = `${process.env.FRONTEND_URL}/firmar-contrato/${inscripcionId}`;
    await this.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Firma tu Contrato de Inscripción - SiSCapacitaciones',
      html: `
        <h2>Hola ${alumnoName},</h2>
        <p>Tu inscripción ha sido registrada exitosamente.</p>
        <p>Adjuntamos tu contrato de inscripción para que puedas leerlo con detenimiento.</p>
        <p>Una vez que lo hayas leído, por favor firma tu contrato haciendo clic en el siguiente enlace:</p>
        <a href="${signUrl}" style="display: inline-block; padding: 10px 20px; background-color: #1e3a8a; color: white; text-decoration: none; border-radius: 5px;">Firmar Contrato</a>
        <p>Este enlace es único y personal.</p>
        <p>Gracias por confiar en SiSCapacitaciones.</p>
      `,
      attachments: [
        {
          filename: 'contrato-inscripcion.pdf',
          content: pdfBuffer,
        },
      ],
    });
  }

  async sendSignedContract(to: string, alumnoName: string, pdfBuffer: Buffer) {
    await this.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Contrato de Inscripción Firmado - SiSCapacitaciones',
      html: `
        <h2>Hola ${alumnoName},</h2>
        <p>Tu contrato de inscripción ha sido firmado exitosamente.</p>
        <p>Adjuntamos una copia de tu contrato firmado para tus registros.</p>
        <p>Gracias por confiar en SiSCapacitaciones.</p>
      `,
      attachments: [
        {
          filename: 'contrato-inscripcion-firmado.pdf',
          content: pdfBuffer,
        },
      ],
    });
  }
}
