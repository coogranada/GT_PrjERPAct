import { Component, OnInit } from '@angular/core';
import { MiListaProductosService } from '../../../../../Services/Informes/mi-lista-productos.service'

@Component({
  selector: 'app-otros-conp-tab',
  templateUrl: './otros-conp-tab.component.html',
  styleUrls: ['./otros-conp-tab.component.css'],
  standalone : false
})
export class OtrosConpTabComponent implements OnInit {

  private lngTercero: number = 0;
  public ListTagOtrosConcep: any[] = [];
  public ColorAnterior: any;
  constructor(private MiListaProductosService: MiListaProductosService) { }

  ngOnInit() {
  }


  getOtrosConceptos(lngtercero : number) {
    this.ListTagOtrosConcep.length = 0;
    this.MiListaProductosService.GetConsultaOtrosConceptosMisProdu(this.lngTercero).subscribe(
      result => {
        var item = 0
        if (result != null) {
          if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
              this.ListTagOtrosConcep[item] = result[i];
              item++;
            }
          }
        }
      }, error => {

        console.log(error);
      });
  }

  SetlngTercero(lngTercero: number) {
    this.lngTercero = lngTercero;
  }


  CambiarColor(fil : number) {

    $(".filOtrs" + this.ColorAnterior).css("background", "#FFFFFF");
    $(".filOtrs" + fil).css("background", "#e5e5e5");
    $(".strcuentaConta" + this.ColorAnterior).css("background", "#FFFFFF");
    $(".strcuentaConta" + fil).css("background", "#e5e5e5");
    this.ColorAnterior = fil;
    // limpia sombreado anterior

  }
}
