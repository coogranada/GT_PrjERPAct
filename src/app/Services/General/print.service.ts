import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  constructor() {}

  printArea(elementId: string, dimensiones: string): void {
    const element = document.getElementById(elementId);

    if (element) {
      // Crear un iframe oculto para la impresión
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px'; // Colocarlo fuera de la vista
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      document.body.appendChild(iframe);

      // Obtener los estilos globales para aplicar en el iframe
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules || [])
              .map(rule => rule.cssText)
              .join(' ');
          } catch (e) {
            return '';
          }
        })
        .join(' ');

      // Acceder al documento del iframe y escribir el contenido de la modal
      const iframeDocument = iframe.contentWindow!.document;
      iframeDocument.open();
      iframeDocument.write('<html><head><title>Impresión</title>');
      iframeDocument.write('<style>' + styles + '</style>');
      iframeDocument.write('</head><body>');
      iframeDocument.write(element.innerHTML); 
      iframeDocument.write('</body></html>');
      iframeDocument.close();

      iframe.contentWindow!.print();

      iframe.remove();
    }
  }
}
