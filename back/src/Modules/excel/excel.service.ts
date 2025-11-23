import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { formatPostgresDate } from '@common/utils/date.utils';

@Injectable()
export class ExcelService {
  async generateExcel(
    data: any[],
    columns: { header: string; key: string; width?: number }[],
    sheetName: string = 'Datos',
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns;

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    data.forEach((item) => {
      worksheet.addRow(item);
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generarExcelCaja(sesion: any, movimientos: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Movimientos de Caja');

    worksheet.addRow(['REPORTE DE CAJA']);
    worksheet.addRow(['Vendedor:', sesion.vendedor?.name || '-']);
    worksheet.addRow(['Fecha de descarga:', formatPostgresDate(new Date())]);
    worksheet.addRow([]);

    const headers = [
      'Fecha',
      'Alumno',
      'Tipo',
      'Método de Pago',
      'Descripción',
      'Monto',
      'Cuota',
      'Mes Cuota',
      'Categoría',
      'Subcategoría',
    ];
    worksheet.addRow(headers);

    movimientos.forEach((mov) => {
      worksheet.addRow([
        formatPostgresDate(mov.fecha),
        mov.alumnoComision?.alumno?.name || '-',
        mov.tipo,
        mov.metodoPago,
        mov.descripcion || '-',
        mov.monto,
        mov.cuota || '-',
        mov.mesCuota || '-',
        mov.subcategoria?.categoria?.nombre || '-',
        mov.subcategoria?.nombre || '-',
      ]);
    });

    const headerRow = worksheet.getRow(5);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    worksheet.columns.forEach((column) => {
      column.width = 30;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generarExcelCajaPerpetua(
    adminName: string,
    movimientos: any[],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Caja Perpetua ${adminName}`);

    worksheet.addRow([`REPORTE CAJA PERPETUA - ${adminName.toUpperCase()}`]);
    worksheet.addRow(['Fecha de descarga:', formatPostgresDate(new Date())]);
    worksheet.addRow(['Total movimientos:', movimientos.length]);
    worksheet.addRow([]);

    const headers = [
      'Fecha',
      'Alumno',
      'Tipo',
      'Método de Pago',
      'Descripción',
      'Monto',
      'Cuota',
      'Mes Cuota',
      'Vendedor',
    ];
    worksheet.addRow(headers);

    movimientos.forEach((mov) => {
      worksheet.addRow([
        formatPostgresDate(mov.fecha),
        mov.alumnoComision?.alumno?.name || '-',
        mov.tipo,
        mov.metodoPago,
        mov.descripcion || '-',
        mov.monto,
        mov.cuota || '-',
        mov.mesCuota || '-',
        mov.vendedor?.name || '-',
      ]);
    });

    const headerRow = worksheet.getRow(5);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    worksheet.columns.forEach((column) => {
      column.width = 30;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
