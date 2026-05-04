import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Injectable({
 providedIn: 'root',
})

export class ExceljsService {
 constructor() {}
 public exportAsExcelFile(json: any[], fileName: string): void {
   if (!json || json.length === 0) {
     console.warn('No hay datos para exportar.');
     return;
   }
   const workbook = new ExcelJS.Workbook();
   const worksheet = workbook.addWorksheet('Datos');
   // Obtener encabezados 
   const headers = Object.keys(json[0]);
   // Agregar encabezados como primera fila
   worksheet.addRow(headers);
   // Agregar datos
   json.forEach((item) => {
     const row = headers.map((key) => item[key]);
     worksheet.addRow(row);
   });
   // Estilo para encabezado
   const headerRow = worksheet.getRow(1);
   headerRow.eachCell((cell) => {
     cell.font = { bold: true };
     cell.fill = {
       type: 'pattern',
       pattern: 'solid',
       fgColor: { argb: 'D3D3D3' }, // Gris claro
     };
   });
   // Ajustar ancho de columnas automáticamente
   worksheet.columns.forEach((column) => {
     let maxLength = 10;
     column.eachCell?.({ includeEmpty: true }, (cell) => {
       const value = cell.value?.toString() || '';
       maxLength = Math.max(maxLength, value.length + 2);
     });
     column.width = maxLength;
   });
   // Guardar archivo
   workbook.xlsx.writeBuffer().then((buffer) => {
     const blob = new Blob([buffer], {
       type:
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
     });
     FileSaver.saveAs(blob, `${fileName}.xlsx`);
   });
 }
}