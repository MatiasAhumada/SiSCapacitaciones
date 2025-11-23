import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { formatPostgresDate } from 'src/common/utils/date.utils';

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

    // Título principal
    const titleRow = worksheet.addRow(['REPORTE DE CAJA']);
    titleRow.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A1:K1');
    titleRow.height = 30;

    // Información del vendedor
    const vendedorRow = worksheet.addRow(['Vendedor:', sesion.vendedor?.name || '-']);
    vendedorRow.font = { bold: true };
    vendedorRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
    
    const fechaRow = worksheet.addRow(['Fecha de descarga:', formatPostgresDate(new Date())]);
    fechaRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
    
    worksheet.addRow([]);

    // Sección de totales
    const totalesTitle = worksheet.addRow(['TOTALES DE LA SESIÓN']);
    totalesTitle.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    totalesTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF70AD47' } };
    totalesTitle.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A5:K5');
    totalesTitle.height = 25;

    const totales = [
      ['Monto Apertura:', sesion.montoApertura || 0],
      ['Total Ingresos:', sesion.totalIngresos || 0],
      ['Total Egresos:', sesion.totalEgresos || 0],
      ['Total Efectivo:', sesion.totalEfectivo || 0],
      ['Total Crédito:', sesion.totalCredito || 0],
      ['Total Digital Javier:', sesion.totalDigitalJavier || 0],
      ['Total Digital Tobias:', sesion.totalDigitalTobias || 0],
      ['Total Ferro:', sesion.totalFerro || 0],
      ['Monto Cierre:', sesion.montoCierre || 0],
    ];

    totales.forEach((total) => {
      const row = worksheet.addRow(total);
      row.getCell(1).font = { bold: true };
      row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
      row.getCell(2).numFmt = '$#,##0.00';
      row.getCell(2).alignment = { horizontal: 'right' };
    });

    worksheet.addRow([]);

    // Encabezados de tabla
    const headers = [
      'Fecha',
      'Alumno',
      'DNI',
      'Tipo',
      'Método de Pago',
      'Descripción',
      'Monto',
      'Cuota',
      'Mes Cuota',
      'Categoría',
      'Subcategoría',
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    // Datos con formato alternado
    movimientos.forEach((mov, index) => {
      const row = worksheet.addRow([
        formatPostgresDate(mov.fecha),
        mov.alumnoComision?.alumno?.name || '-',
        mov.alumnoComision?.alumno?.dni || '-',
        mov.tipo,
        mov.metodoPago,
        mov.descripcion || '-',
        mov.monto,
        mov.cuota || '-',
        mov.mesCuota || '-',
        mov.subcategoria?.categoria?.nombre || '-',
        mov.subcategoria?.nombre || '-',
      ]);

      // Formato alternado de filas
      if (index % 2 === 0) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
      }

      // Formato de monto
      row.getCell(7).numFmt = '$#,##0.00';
      row.getCell(7).alignment = { horizontal: 'right' };

      // Bordes
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          right: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        };
      });
    });

    // Ajustar anchos de columnas
    worksheet.columns = [
      { width: 20 },
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 18 },
      { width: 30 },
      { width: 15 },
      { width: 10 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
    ];

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
