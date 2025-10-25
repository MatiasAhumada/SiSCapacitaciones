import { Injectable, NotFoundException } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ComprobanteGeneratorService {
  async generarComprobantePDF(pago: any): Promise<Buffer> {
    try {
      const comprobante = pago.comprobante;
      const alumno = pago.alumnoComision?.alumno;

      // Crear PDF con dimensiones que coincidan con la plantilla del frontend
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([1190, 1684]); // Dimensiones de la imagen original
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Cargar imagen de plantilla
      const plantillaPath = path.join(
        process.cwd(),
        'assets',
        'comprobanteSis.jpg',
      );
      if (!fs.existsSync(plantillaPath)) {
        throw new NotFoundException('Plantilla de comprobante no encontrada');
      }

      const imageBytes = fs.readFileSync(plantillaPath);
      const image = await pdfDoc.embedJpg(imageBytes);

      // Dibujar imagen de fondo con dimensiones completas
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: 1190,
        height: 1684,
      });

      const fecha = new Date(pago.fecha).toLocaleDateString('es-ES');
      const apellidoNombre = comprobante?.apellidoNombre || alumno?.name || '';
      const dni = comprobante?.dni || alumno?.dni || '';
      const domicilio =
        comprobante?.domicilioComercial || alumno?.address || '';
      const iva = comprobante?.iva || '-';
      const formaPago = comprobante?.formaPago || pago.metodoPago;
      const observacion = comprobante?.observacion || '';
      const numeroComprobante = comprobante?.numeroComprobante || '';
      const tipoComprobante = comprobante?.tipoComprobante || '';
      const numero = comprobante?.numero || '';

      // Usar las coordenadas exactas del frontend (convertidas de canvas a PDF)
      // Coordenada Y en PDF = altura total - coordenada Y del canvas
      // Número de comprobante - bold
      page.drawText(numeroComprobante, {
        x: 760,
        y: 1508,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      // Fecha (top) - bold
      page.drawText(fecha, {
        x: 840,
        y: 1468,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      // Apellido y Nombre
      page.drawText(apellidoNombre, {
        x: 375,
        y: 1300,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // DNI
      page.drawText(dni, {
        x: 725,
        y: 1300,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // Domicilio comercial
      page.drawText(domicilio, {
        x: 880,
        y: 1270,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // IVA
      page.drawText(iva, {
        x: 200,
        y: 1250,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // Fecha (primera posición)
      page.drawText(fecha, {
        x: 40,
        y: 1125,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // Forma de pago
      page.drawText(formaPago, {
        x: 220,
        y: 1125,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // Observación
      page.drawText(observacion, {
        x: 370,
        y: 1125,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // Monto (primera posición)
      page.drawText(`$${pago.monto}`, {
        x: 1030,
        y: 1125,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // Monto (segunda posición)
      page.drawText(`$${pago.monto}`, {
        x: 1053,
        y: 1088,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // Fecha (tercera posición)
      page.drawText(fecha, {
        x: 60,
        y: 960,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      // Tipo de comprobante
      page.drawText(tipoComprobante, {
        x: 380,
        y: 960,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      // Número
      page.drawText(numero, {
        x: 740,
        y: 960,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // Monto (tercera posición)
      page.drawText(`$${pago.monto}`, {
        x: 1030,
        y: 960,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // Monto (cuarta posición)
      page.drawText(`$${pago.monto}`, {
        x: 1053,
        y: 920,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      // Texto del footer (como en el frontend)
      page.drawText(
        'Controle el proceso de sus ventas utilizando SiSCapacitaciones',
        {
          x: 30,
          y: 40,
          size: 20,
          font,
          color: rgb(0.37, 0.36, 0.42),
        },
      );

      page.drawText(
        '2025 © Desarrollado por Matias Ahumada Desarrollador Tel: +54 9 381 352-8658',
        {
          x: 30,
          y: 15,
          size: 20,
          font,
          color: rgb(0.37, 0.36, 0.42),
        },
      );

      // Generar PDF buffer
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Error generando comprobante PDF:', error);
      throw new Error(`Error al generar comprobante: ${error.message}`);
    }
  }
}
