import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HtmlToService } from '../../../Services/Utilidades/html-to.service';

@Component({
  selector: 'app-formato-debitoautomatico',
  templateUrl: './formato-debitoautomatico.component.html',
  styleUrls: ['./formato-debitoautomatico.component.css'],
  standalone : false
})
export class FormatoDebitoAutomaticoComponent implements OnInit {

  @ViewChild('abrirFormatoDebitoAutomatico', { static: true }) private abrirFormatoDebitoAutomatico!: ElementRef;


  dataObjet: any[] = [];
  dataObjetActual: any[] = [];
  dataObjetRetiro: any[] = [];

  public Datos: any;
  public Fecha : Date = new Date();

  public Undefined = undefined;


  constructor( private htmlTo : HtmlToService) { }

  ngOnInit() {
  }
  AbrirFormato(resultDebitos: any) {
    this.abrirFormatoDebitoAutomatico.nativeElement.click();
    this.Fecha = new Date();
    this.Datos = resultDebitos;
    this.dataObjet.push({
      'CuentaOrigen': this.Datos[0].CuentaOrigen,
      'DocumentoOrigen': this.Datos[0].DocumentoOrigen,
      'NombreOrigen': this.Datos[0].NombreOrigen,
    });
    this.Datos.forEach((elementFiltro : any) => {
      if (elementFiltro.FechaRetiro === ' ') {
        this.dataObjetActual.push({
          'CuentaDestino': elementFiltro.CuentaDestino,
          'DocumentoDestino': elementFiltro.DocumentoDestino,
          'NombreDestino': elementFiltro.NombreDestino,
          'DescripcionPeriocidad': elementFiltro.DescripcionPeriocidad,
          'CuotaMes': elementFiltro.CuotaMes,
          'FechaMatricula': elementFiltro.FechaMatricula,
          'FechaVencimiento': elementFiltro.FechaVencimiento,
        });
      } else {
        this.dataObjetRetiro.push({
          'CuentaDestino': elementFiltro.CuentaDestino,
          'DocumentoDestino': elementFiltro.DocumentoDestino,
          'NombreDestino': elementFiltro.NombreDestino,
          'DescripcionPeriocidad': elementFiltro.DescripcionPeriocidad,
          'CuotaMes': elementFiltro.CuotaMes,
          'FechaRetiro': elementFiltro.FechaRetiro,
        });
      }
    });
  }
  limpiarModal() {
    this.Datos = undefined;
    this.dataObjet = [];
    this.dataObjetActual = [];
    this.dataObjetRetiro = []
  }
  print(){
    this.htmlTo.HtmlToPdf('FormatoDebitoAutomatico',"l",[898, 578])
  }
}
