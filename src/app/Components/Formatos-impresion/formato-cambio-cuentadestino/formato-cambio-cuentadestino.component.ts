import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-formato-cambio-cuentadestino',
  templateUrl: './formato-cambio-cuentadestino.component.html',
  styleUrls: ['./formato-cambio-cuentadestino.component.css'],
  standalone : false
})
export class FormatoCambioCuentaDestinoComponent implements OnInit {

  @ViewChild('abrirFormatoCambioCuentaDestino', { static: true }) private abrirFormatoCambioCuentaDestino!: ElementRef;

  public Datos: any | null | undefined = null;
  public Fecha : Date | null = null;

  MostrarCuentaAhorros = true;
  MostrarCuentaPorPagar = true;

  constructor() { }

  ngOnInit() {
    }

    AbrirFormato(resultRegistroFirmas: any) {
      this.Datos = resultRegistroFirmas;
      this.Fecha = new Date();
      if (this.Datos.IdLiquidacion === 1) {
        this.abrirFormatoCambioCuentaDestino.nativeElement.click();
        this.MostrarCuentaAhorros = false;
      } else if (this.Datos.IdLiquidacion === 0) {
        this.abrirFormatoCambioCuentaDestino.nativeElement.click();
        this.MostrarCuentaPorPagar = false;
      }
    }

}
