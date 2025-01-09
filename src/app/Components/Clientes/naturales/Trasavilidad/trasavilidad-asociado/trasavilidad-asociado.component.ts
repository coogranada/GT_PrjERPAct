import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ClientesGetListService } from '../../../../../Services/Clientes/clientesGetList.service';
declare var $: any;
@Component({
  selector: 'app-trasavilidad-asociado',
  templateUrl: './trasavilidad-asociado.component.html',
  styleUrls: ['./trasavilidad-asociado.component.css'],
  providers: [ClientesGetListService],
  standalone : false
})
export class TrasavilidadAsociadoComponent implements OnInit, AfterViewInit {
  @Output() messageEvent = new EventEmitter<string>();
  public dataTrasabilidad: any[] = [];
  public ColorAnterior: any;
  constructor(private clientesGetListService: ClientesGetListService) { }

  ngOnInit() {
    const getStorageTra = localStorage.getItem('trasabilidad');
    if (getStorageTra !== null) {
        let trasabilidad : string | null = localStorage.getItem('trasabilidad')
        const documentoConsulta = JSON.parse(window.atob(trasabilidad == null ? "" : trasabilidad));
        this.ConsultarTrasabilidad(documentoConsulta);
    }
  }
  ngAfterViewInit() {
    
  }

  ConsultarTrasabilidad(documento : string) {
    this.clientesGetListService.GetConsultarTrasabilida(documento, 11).subscribe(
      result => {
        this.dataTrasabilidad = result;
      }, error => {
        console.error("Error al consultar la trasabilidad -  ERRROR: " + error);
    })
  }

  CambiarColor(fil : any, producto : any) {
    if (producto === 1) {

      $(".filtrasa_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filtrasa_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior = fil;
    }
  }
}
