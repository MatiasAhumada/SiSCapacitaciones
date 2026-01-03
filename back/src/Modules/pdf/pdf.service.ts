import { Injectable, NotFoundException } from '@nestjs/common';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  generarPdfAsistencia(comision: any, alumnos: any[]): Buffer {
    const doc = new jsPDF({ orientation: 'landscape' });

    // Header con fondo azul
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, doc.internal.pageSize.width, 50, 'F');

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Registro de Asistencias', 14, 20);

    // Información de la comisión
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Comisión: ${comision.name}`, 14, 30);
    doc.text(
      `Profesor: ${comision.profesor.name} ${comision.profesor.apellido}`,
      14,
      37,
    );
    doc.text(`Horario: ${comision.hour.start} - ${comision.hour.end}`, 14, 44);
    doc.text(`Días: ${comision.day}`, 150, 37);

    const fechas = Array.from(
      new Set(
        alumnos.flatMap((item) =>
          item.asistencias.map((a) => new Date(a.fecha).toLocaleDateString()),
        ),
      ),
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const headers = ['Alumno', 'DNI', 'Teléfono', ...fechas];

    const rows = alumnos.map((item) => {
      const row = [item.alumno.name, item.alumno.dni, item.alumno.tel];
      fechas.forEach((fecha) => {
        const asistencia = item.asistencias.find(
          (a) => new Date(a.fecha).toLocaleDateString() === fecha,
        );
        row.push(asistencia ? (asistencia.presente ? 'P' : 'A') : 'A');
      });
      return row;
    });

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 55,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        halign: 'center',
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 50 },
        1: { halign: 'center', cellWidth: 25 },
        2: { halign: 'center', cellWidth: 25 },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index > 2) {
          if (data.cell.text[0] === 'P') {
            data.cell.styles.textColor = [34, 197, 94];
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [220, 252, 231];
          } else if (data.cell.text[0] === 'A') {
            data.cell.styles.textColor = [239, 68, 68];
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [254, 226, 226];
          }
        }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    return Buffer.from(doc.output('arraybuffer'));
  }

  async generarComprobantePDF(pago: any): Promise<Buffer> {
    try {
      const comprobante = pago.comprobante;
      const alumno = pago.alumnoComision?.alumno;

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([1190, 1684]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

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

      page.drawText(numeroComprobante, {
        x: 760,
        y: 1508,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      page.drawText(fecha, {
        x: 840,
        y: 1468,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      page.drawText(apellidoNombre, {
        x: 375,
        y: 1300,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(dni, {
        x: 725,
        y: 1300,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(domicilio, {
        x: 880,
        y: 1270,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(iva, {
        x: 200,
        y: 1250,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(fecha, {
        x: 40,
        y: 1125,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(formaPago, {
        x: 220,
        y: 1125,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(observacion, {
        x: 370,
        y: 1125,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`$${pago.monto}`, {
        x: 1030,
        y: 1125,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`$${pago.monto}`, {
        x: 1053,
        y: 1088,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(fecha, {
        x: 60,
        y: 960,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(tipoComprobante, {
        x: 380,
        y: 960,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(numero, {
        x: 740,
        y: 960,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`$${pago.monto}`, {
        x: 1030,
        y: 960,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`$${pago.monto}`, {
        x: 1053,
        y: 920,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
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

      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Error generando comprobante PDF:', error);
      throw new Error(`Error al generar comprobante: ${error.message}`);
    }
  }

  async generarInscripcionPDF(inscripcion: any): Promise<Buffer> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA DE INSCRIPCIÓN', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('SIS CAPACITACIONES', pageWidth / 2, 25, { align: 'center' });

    doc.setFillColor(59, 130, 246);
    doc.rect(10, 45, pageWidth - 20, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DE INSCRIPCIÓN', 12, 51);

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    let y = 60;

    doc.text(`Asesor: ${inscripcion.vendedor?.name || '-'}`, 12, y);
    doc.text(
      `Fecha: ${new Date(inscripcion.fechaRegistro).toLocaleDateString('es-AR')}`,
      120,
      y,
    );
    y += 7;
    doc.text(`Curso: ${inscripcion.comision?.name || '-'}`, 12, y);
    y += 7;
    doc.text(`Sede: ${inscripcion.sucursal?.name || '-'}`, 12, y);

    y += 10;
    doc.setFillColor(59, 130, 246);
    doc.rect(10, y, pageWidth - 20, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN PERSONAL', 12, y + 6);

    y += 15;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Nombre y Apellido: ${inscripcion.alumno?.name || '-'}`,
      12,
      y,
    );
    y += 7;
    doc.text(`DNI: ${inscripcion.alumno?.dni || '-'}`, 12, y);
    doc.text(
      `Fecha de Nac.: ${inscripcion.alumno?.fechaNacimiento ? new Date(inscripcion.alumno.fechaNacimiento).toLocaleDateString('es-AR') : '-'}`,
      120,
      y,
    );
    y += 7;
    doc.text(`Teléfono: ${inscripcion.alumno?.tel || '-'}`, 12, y);
    y += 7;
    doc.text(`E-Mail: ${inscripcion.alumno?.email || '-'}`, 12, y);
    y += 7;
    doc.text(`Dirección: ${inscripcion.alumno?.address || '-'}`, 12, y);
    y += 7;
    doc.text(`Localidad: ${inscripcion.alumno?.localidad || '-'}`, 12, y);
    doc.text(`Provincia: ${inscripcion.alumno?.provincia || '-'}`, 120, y);
    y += 7;
    doc.text(`Nacionalidad: ${inscripcion.alumno?.nacionalidad || '-'}`, 12, y);

    const logoPath = path.join(process.cwd(), 'assets', 'completo.png');
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      const logoImage = doc.addImage(logoBytes, 'PNG', 12, pageHeight - 40, 50, 25);
    }

    doc.setDrawColor(0, 0, 0);
    doc.line(pageWidth - 70, pageHeight - 20, pageWidth - 10, pageHeight - 20);
    doc.setFontSize(8);
    doc.text('FIRMA ALUMNO', pageWidth - 40, pageHeight - 15, { align: 'center' });

    return Buffer.from(doc.output('arraybuffer'));
  }
}
