import { Injectable } from '@nestjs/common';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable()
export class PdfService {
  generarPdfAsistencia(comision: any, alumnos: any[]): Buffer {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(12);
    doc.text(`Profesor: ${comision.profesor.name} ${comision.profesor.apellido}`, 14, 20);
    doc.text(`Horario: ${comision.hour.start} - ${comision.hour.end}`, 14, 28);
    doc.text(`Días: ${comision.day}`, 14, 36);

    const fechas = Array.from(
      new Set(
        alumnos.flatMap((item) =>
          item.asistencias.map((a) => new Date(a.fecha).toLocaleDateString())
        )
      )
    );

    const headers = ['Alumno', 'DNI', 'Telefono', ...fechas];

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
      startY: 42,
    });

    return Buffer.from(doc.output('arraybuffer'));
  }
}
