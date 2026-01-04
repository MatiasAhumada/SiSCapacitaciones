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
    const margin = 12;
    const contentWidth = pageWidth - margin * 2;

    // Header con degradado
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont('times', 'bold');
    doc.text('FICHA DE INSCRIPCIÓN', pageWidth / 2, 22, { align: 'center' });

    doc.setFontSize(13);
    doc.setFont('courier', 'bold');
    doc.text('SIS CAPACITACIONES', pageWidth / 2, 33, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Fecha de emisión: ${new Date(inscripcion.fechaRegistro).toLocaleDateString('es-AR')}`,
      pageWidth / 2,
      42,
      { align: 'center' },
    );

    let y = 55;

    // Sección: Datos de Inscripción
    doc.setFillColor(30, 58, 138);
    doc.roundedRect(margin, y, contentWidth, 14, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('DATOS DE INSCRIPCION', margin + 6, y + 9);

    y += 20;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 48, 3, 3, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 48, 3, 3, 'S');

    const fontSize = 11;

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(fontSize);
    doc.setFont('courier', 'bold');
    doc.text('ASESOR:', margin + 10, y + 12);
    doc.setFont('times', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(inscripcion.vendedor?.name || '-', margin + 35, y + 12);

    doc.setTextColor(51, 65, 85);
    doc.setFont('courier', 'bold');
    doc.text('SEDE:', pageWidth / 2 + 15, y + 12);
    doc.setFont('times', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(inscripcion.sucursal?.name || '-', pageWidth / 2 + 35, y + 12);

    doc.setTextColor(51, 65, 85);
    doc.setFont('courier', 'bold');
    doc.text('CURSO:', margin + 10, y + 24);
    doc.setFont('times', 'normal');
    doc.setTextColor(15, 23, 42);
    const cursoText = inscripcion.comision?.name || '-';
    doc.text(cursoText, margin + 35, y + 24, { maxWidth: contentWidth - 50 });

    doc.setTextColor(51, 65, 85);
    doc.setFont('courier', 'bold');
    doc.text('HORARIO:', margin + 10, y + 36);
    doc.setFont('times', 'normal');
    doc.setTextColor(15, 23, 42);
    const horario = inscripcion.comision?.hour
      ? `${inscripcion.comision.day} - ${inscripcion.comision.hour.start} a ${inscripcion.comision.hour.end}`
      : '-';
    doc.text(horario, margin + 35, y + 36);

    y += 55;

    // Sección: Información Personal
    doc.setFillColor(30, 58, 138);
    doc.roundedRect(margin, y, contentWidth, 14, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('INFORMACION PERSONAL', margin + 6, y + 9);

    y += 20;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 115, 3, 3, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 115, 3, 3, 'S');

    const drawField = (
      label: string,
      value: string,
      xPos: number,
      yPos: number,
      width?: number,
    ) => {
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(fontSize);
      doc.setFont('courier', 'bold');
      doc.text(label, xPos, yPos);
      doc.setFont('times', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(value, xPos, yPos + 8, { maxWidth: width || 85 });
    };

    drawField(
      'NOMBRE Y APELLIDO',
      inscripcion.alumno?.name || '-',
      margin + 10,
      y + 10,
      80,
    );

    drawField(
      'FECHA DE NACIMIENTO',
      inscripcion.alumno?.fNac
        ? new Date(inscripcion.alumno.fNac).toLocaleDateString('es-AR')
        : '-',
      pageWidth / 2 + 8,
      y + 10,
    );

    drawField('DNI', inscripcion.alumno?.dni || '-', margin + 10, y + 28);

    drawField(
      'EDAD',
      inscripcion.alumno?.age?.toString() || '-',
      pageWidth / 2 + 8,
      y + 28,
    );

    drawField(
      'EMAIL',
      inscripcion.alumno?.email || '-',
      margin + 10,
      y + 46,
      80,
    );

    drawField(
      'TELEFONO',
      inscripcion.alumno?.tel || '-',
      pageWidth / 2 + 8,
      y + 46,
    );

    drawField(
      'DIRECCION',
      inscripcion.alumno?.address || '-',
      margin + 10,
      y + 64,
      80,
    );

    drawField(
      'GENERO',
      inscripcion.alumno?.gender || '-',
      pageWidth / 2 + 8,
      y + 64,
    );

    drawField(
      'LOCALIDAD',
      inscripcion.alumno?.locality || '-',
      margin + 10,
      y + 82,
    );

    drawField(
      'PROVINCIA',
      inscripcion.alumno?.province || '-',
      pageWidth / 2 + 8,
      y + 82,
    );

    drawField(
      'NACIONALIDAD',
      inscripcion.alumno?.nationality || '-',
      margin + 10,
      y + 100,
    );

    drawField(
      'OCUPACION',
      inscripcion.alumno?.ocupation || '-',
      pageWidth / 2 + 8,
      y + 100,
    );

    y += 115;

    // Sección: Firma
    doc.setDrawColor(71, 85, 105);
    doc.setLineWidth(0.8);

    if (inscripcion.firmaBase64 && inscripcion.firmado) {
      // Insertar imagen de firma
      doc.addImage(
        inscripcion.firmaBase64,
        'PNG',
        pageWidth - margin - 70,
        y,
        58,
        15,
      );

      // Fecha de firma
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Firmado el: ${new Date(inscripcion.fechaFirma).toLocaleDateString('es-AR')}`,
        pageWidth - margin - 41,
        y + 15,
        { align: 'center' },
      );
    } else {
      // Línea para firma manual
      doc.line(
        pageWidth - margin - 70,
        y + 15,
        pageWidth - margin - 12,
        y + 15,
      );
    }

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    doc.setFont('courier', 'bold');
    doc.text('FIRMA DEL ALUMNO', pageWidth - margin - 41, y + 20, {
      align: 'center',
    });

    // Footer (sin fondo)
    const logoPath = path.join(process.cwd(), 'assets', 'completo.png');
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      doc.addImage(logoBytes, 'PNG', margin + 3, pageHeight - 30, 70, 20);
    }

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.text(
      '© 2025 SIS Capacitaciones - Desarrollado por Matias Ahumada | Tel: +54 9 381 3528-658',
      pageWidth / 2,
      pageHeight - 3,
      { align: 'center' },
    );

    // Agregar segunda hoja
    doc.addPage();
    this.agregarSegundaHojaContrato(doc, inscripcion);

    return Buffer.from(doc.output('arraybuffer'));
  }

  agregarSegundaHojaContrato(doc: jsPDF, inscripcion: any): void {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 12;

    // Header
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('courier', 'bold');
    doc.text('SIS CAPACITACIONES', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(20);
    doc.setFont('times', 'bold');
    doc.text('IMPORTANTE - NORMATIVA', pageWidth / 2, 27, { align: 'center' });

    // Términos y condiciones
    const terminos = [
      'Cupo mínimo 12 alumnos. En caso de no completarse el cupo la fecha de inicio de clases se postergará hasta el próximo mes. De no completarse el cupo en tres meses consecutivos, se realizará la devolución, según lo establecido en el ítem 3.',
      'Las cuotas se abonarán por adelantado hasta el 15 de cada mes. Posterior a esa fecha tendrán un recargo de $4000 (pesos cuatro mil). El valor de cuota está sujeto a modificación con previo aviso por medio de los grupos de WhatsApp informativos y con un mínimo de 10 días antes de su vencimiento.',
      {
        titulo: 'No se realizarán devoluciones bajo ningún concepto.',
        subitems: [
          'En caso de que el alumno no pueda cursar en el horario y día elegido o disponible por la institución, pierde el importe abonado.',
          'En caso de corresponder devolución, sólo por causa de entera responsabilidad de la institución la misma se realizará mediante la liberación de nota de crédito correspondiente.',
        ],
      },
      'El pago de las cuotas no incluye materiales, derecho de examen ni certificación (excepto promociones vigentes).',
      'Todos los materiales e insumos a utilizar en esta capacitación son de costo del estudiante y en ningún caso queda comprendido dentro del monto de la matrícula y/o arancel de esta capacitación.',
      'Programas de capacitaciones sujetos a modificaciones sin previo aviso.',
      'Promociones no acumulativas y con vigencia únicamente si el alumno está cursando y con las cuotas abonadas al día.',
      'Las señas o cuotas abonadas no pueden ser transferidas a terceros, sólo se realizarán devoluciones en caso de corresponder según lo establecido en el ítem 3.',
      'El alumno que adeude 2 cuotas consecutivas o alternadas no podrá asistir a clases hasta saldar lo adeudado. Si el alumno deja de asistir al curso y mantiene una deuda con la institución, esa deuda debe ser abonada en su totalidad con los recargos e intereses punitorios pertinentes.',
      'La institución se reserva poder cambiar o unificar horarios de los cursos, como así también finalizarlos con anticipación, en el caso que los asistentes y abonados no superen los 10 alumnos en la comisión y grupo, o por fuerza mayor y casos o eventos especiales, propios o ajenos.',
      'La promoción de certificación y derecho de examen, gratis es válida solo con todas las cuotas pagadas completas hasta el 10 de cada mes, vencido ese plazo se pierde la promoción y debe abonarse derecho de examen y certificación sin excepción, correspondiendo $12.000 de derecho de examen y $18.000 de certificación.',
      'El instituto se reserva el derecho de admisión y permanencia.',
      'Las clases de días feriados, asuetos y días no laborales no se recuperan.',
      'El instituto no se responsabiliza por pérdidas de elementos personales dentro de la institución.',
      'Para realización de prácticas, en caso de corresponder, los alumnos serán evaluados antes de acceder a las mismas, y sólo los aprobados estarán en condiciones de realizarlas. El alumno debe abonar el seguro correspondiente para salir fuera de la institución, como así también debe estar al día con las cuotas vigentes.',
      'Requisitos para la certificación: cuotas abonadas, asistencia 80%, evaluación final aprobada con el 60%.',
      'La certificación tiene una demora máxima de 90 días hábiles desde el momento de finalización efectiva del curso y pago del arancel de certificación si correspondiese.',
    ];

    const footerY = pageHeight - 35;
    let yPos = 45;
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.setTextColor(15, 23, 42);

    let itemNumber = 1;
    terminos.forEach((termino) => {
      if (typeof termino === 'string') {
        const lines = doc.splitTextToSize(
          `${itemNumber}. ${termino}`,
          pageWidth - margin * 2 - 4,
        );
        lines.forEach((line) => {
          if (yPos > footerY - 10) return;
          doc.text(line, margin + 2, yPos);
          yPos += 4.5;
        });
        yPos += 1.5;
        itemNumber++;
      } else {
        const lines = doc.splitTextToSize(
          `${itemNumber}. ${termino.titulo}`,
          pageWidth - margin * 2 - 4,
        );
        lines.forEach((line) => {
          if (yPos > footerY - 10) return;
          doc.text(line, margin + 2, yPos);
          yPos += 4.5;
        });
        yPos += 1.5;
        termino.subitems.forEach((subitem, subIndex) => {
          const subLines = doc.splitTextToSize(
            `   ${itemNumber}.${subIndex + 1}. ${subitem}`,
            pageWidth - margin * 2 - 4,
          );
          subLines.forEach((line) => {
            if (yPos > footerY - 10) return;
            doc.text(line, margin + 2, yPos);
            yPos += 4.5;
          });
          yPos += 1.5;
        });
        itemNumber++;
      }
    });

    // Espacio para términos y condiciones

    // Footer con firmas
    const firmaWidth = 45;

    // Texto de aceptación en negrita
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(
      'Entiendo y acepto los términos, condiciones y firmo en conformidad.',
      margin + 2,
      footerY - 25,
    );

    // Logo
    const logoPath = path.join(process.cwd(), 'assets', 'completo.png');
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      doc.addImage(logoBytes, 'PNG', margin, footerY, 50, 15);
    }

    // Sección de firmas
    const col1X = margin + 80;
    const col2X = col1X + firmaWidth + 10;

    doc.setDrawColor(71, 85, 105);
    doc.setLineWidth(0.5);

    // Firma Alumno
    if (inscripcion.firmaBase64 && inscripcion.firmado) {
      doc.addImage(inscripcion.firmaBase64, 'PNG', col1X, footerY - 18, 45, 10);
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Firmado el: ${new Date(inscripcion.fechaFirma).toLocaleDateString('es-AR')}`,
        col1X + firmaWidth / 2,
        footerY - 5,
        { align: 'center' },
      );
    } else {
      doc.line(col1X, footerY - 5, col1X + firmaWidth, footerY - 5);
    }
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7);
    doc.setFont('courier', 'bold');
    doc.text('FIRMA ALUMNO', col1X + firmaWidth / 2, footerY - 1, {
      align: 'center',
    });

    doc.line(col1X, footerY + 5, col1X + firmaWidth, footerY + 5);
    doc.text('ACLARACIÓN', col1X + firmaWidth / 2, footerY + 9, {
      align: 'center',
    });

    doc.line(col1X, footerY + 15, col1X + firmaWidth, footerY + 15);
    doc.text('DNI', col1X + firmaWidth / 2, footerY + 19, { align: 'center' });

    // Firma Tutor
    doc.line(col2X, footerY - 5, col2X + firmaWidth, footerY - 5);
    doc.text('FIRMA TUTOR', col2X + firmaWidth / 2, footerY - 1, {
      align: 'center',
    });

    doc.line(col2X, footerY + 5, col2X + firmaWidth, footerY + 5);
    doc.text('ACLARACIÓN', col2X + firmaWidth / 2, footerY + 9, {
      align: 'center',
    });

    doc.line(col2X, footerY + 15, col2X + firmaWidth, footerY + 15);
    doc.text('DNI', col2X + firmaWidth / 2, footerY + 19, { align: 'center' });

    // Copyright
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'italic');
    doc.text(
      '© 2025 SIS Capacitaciones - Desarrollado por Matias Ahumada | Tel: +54 9 381 3528-658',
      pageWidth / 2,
      pageHeight - 3,
      { align: 'center' },
    );
  }
}
