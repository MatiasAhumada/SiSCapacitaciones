import { Injectable } from '@nestjs/common';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    doc.text(`Profesor: ${comision.profesor.name} ${comision.profesor.apellido}`, 14, 37);
    doc.text(`Horario: ${comision.hour.start} - ${comision.hour.end}`, 14, 44);
    doc.text(`Días: ${comision.day}`, 150, 37);

    const fechas = Array.from(
      new Set(
        alumnos.flatMap((item) =>
          item.asistencias.map((a) => new Date(a.fecha).toLocaleDateString())
        )
      )
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const headers = ['Alumno', 'DNI', 'Teléfono', ...fechas];

    const rows = alumnos.map((item) => {
      const row = [item.alumno.name, item.alumno.dni, item.alumno.tel];
      fechas.forEach((fecha) => {
        const asistencia = item.asistencias.find(
          (a) => new Date(a.fecha).toLocaleDateString() === fecha
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
}
