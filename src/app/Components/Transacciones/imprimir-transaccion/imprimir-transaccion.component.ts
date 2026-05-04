import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TransaccionesCajaService } from '../../../Services/Transacciones/TransaccionesCaja.service';
import { AlertService } from '../../../Services/Alert/alert.service';
import { LoadingService } from '../../../Services/shared/loading.service';

@Component({
  selector: 'app-imprimir-transaccion',
  templateUrl: './imprimir-transaccion.component.html',
  styleUrl: './imprimir-transaccion.component.css',
  standalone: false,
})
export class ImprimirTransaccionComponent {
  
  public pdfTransBase64: string = "";


  constructor(private fb: FormBuilder, private transaccionesCajaService: TransaccionesCajaService, private notif: AlertService, private loading: LoadingService) { }



  generarImpresion1() {
    this.transaccionesCajaService.GenerarPDFTransaccion(12486375, "DFRAMIREZ", "Administracion")
      .subscribe(result => {
        this.pdfTransBase64 = result;
        this.generarImpresion();
      }, error => {
        this.notif.onDanger('Error', 'No se pudo obtener el PDF.');
      });
  }

    generarImpresion() {
    if (!this.pdfTransBase64) {
      return;
    }

    const cleanBase64 = this.pdfTransBase64
      .replace(/^data:application\/pdf;base64,/, '')
      .replace(/\s/g, '');

    const pdfUrl = `data:application/pdf;base64,${cleanBase64}`;

    const iframe = document.getElementById("ImpresionTransaccion") as HTMLIFrameElement;

    if (iframe) {
      iframe.src = pdfUrl;
    }
  }

}
