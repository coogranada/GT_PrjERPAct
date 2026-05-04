import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  constructor() { }

  printArea(elementId: string, dimensiones: string): void {
    const element = document.getElementById(elementId);

    if (element) {
      // Crear un iframe oculto para la impresión
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px'; 
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
      iframeDocument.write('<html><head><title>Coogranada – Cooperativa de Ahorro y Crédito</title>');
      iframeDocument.write('<style>' + styles + '</style>');

      // FormatoDeServicios es impresión de jurídicos
      if(elementId=='FormatoDeServicios'){
        iframeDocument.write(`
          <style>
            @media print {
              .imgLogo {
                visibility: visible !important;
                display: inline-block !important;
                width: 200px !important;
              }

              body {
                  margin-right: 7px;
                  padding-right: 7px;
              }

              @page {
                  margin-right: 7px;
              }
          </style>
      `);

      }else{
        iframeDocument.write(`
          <style>
            @media print {
              .imgLogo {
                visibility: visible !important;
                display: inline-block !important;
                width: 200px !important;
              }

              body {
                  margin-right: 40px;
                  padding-right: 0;
              }

              @page {
                  margin-right: 0px;
              }
          </style>
      `);

      }
      
      iframeDocument.write('</head><body>');
      iframeDocument.write(element.innerHTML);
      iframeDocument.write('</body></html>');
      iframeDocument.close();

      iframe.contentWindow!.document.body.onload = () => {
        iframe.contentWindow!.print();
        setTimeout(() => {
          iframe.remove();
        }, 1000); 
      };
      
    }
  }
  
}