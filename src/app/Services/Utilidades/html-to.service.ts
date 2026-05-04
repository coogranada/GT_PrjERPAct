import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class HtmlToService {

  constructor() { }
  HtmlToPdf(html : string,orientation : "p" | "portrait" | "l" | "landscape", format : number[]){
    const doc = new jsPDF({orientation : orientation,unit: 'px',format : format});

    const content = document.getElementById(html);
    if (content) {
      doc.setFontSize(12);
      doc.html(content, {
        callback: (doc : any) => {
          doc.save(html + '.pdf');
        }
      });
    }
  }
}
