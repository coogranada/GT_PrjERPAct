import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { ClientesGetListService } from '../../../../../Services/Clientes/clientesGetList.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { JuridicosComponent } from '../../juridicos.component';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var $: any;
@Component({
  selector: 'app-trazabilidad',
  templateUrl: './trazabilidad.component.html',
  styleUrls: ['./trazabilidad.component.css'],
  standalone : false
})
export class TrazabilidadComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  @ViewChild('juridicosComponent', { static: false }) juridicosComponent!: JuridicosComponent;
  public dataTrasabilidad: any[] = [];
   @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = true;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  constructor(private clientesGetListService: ClientesGetListService) { }
  public ColorAnterior: any;

  ngOnInit() {
    this.dataTrasabilidad = [];
    this.dataTrasabilidad.length = 0;
    let traza = localStorage.getItem('trasabilidad-juridico');
    const documentoConsulta = JSON.parse(JSON.parse(window.atob(traza == null ? "" : traza)));
    this.ConsultarTrasabilidad(documentoConsulta);
  }
 
  ConsultarTrasabilidad(documento : string) {
    this.dataTrasabilidad.length
    this.dataTrasabilidad = [];
    this.loading = true;
    this.clientesGetListService.GetConsultarTrasabilida(documento, 12).subscribe(
      result => {
        this.loading = false;
        this.dataTrasabilidad = result;
      }, error => {
        console.error("Error al consultar la trasabilidad juridicos - ERRROR: " + error);
      })
  }

  CambiarColor(fil : number, producto : number) {
    if (producto === 1) {

      $(".filTras_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filTras_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior = fil;
    }
  }
}
