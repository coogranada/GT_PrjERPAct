import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlToService {

  constructor() { }

  async HtmlToPdf(html: string, orientation: "p" | "portrait" | "l" | "landscape", format: number[]) {

  try {

    const { default: jsPDF } = await import('jspdf');

    const doc = new jsPDF({
      orientation: orientation,
      unit: 'px',
      format: format
    });

    const content = document.getElementById(html);

    if (content) {

      doc.setFontSize(12);

      doc.html(content, {
        callback: (doc: any) => {
          doc.save(html + '.pdf');
        }
      });

    } else {
      console.error("Elemento HTML no encontrado");
    }

  } catch (error) {
    console.error("Error generando PDF", error);
  }

 }
}
