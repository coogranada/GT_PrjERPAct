import { Component, OnInit } from '@angular/core';
import { MiListaProductosService } from '../../../../../Services/Informes/mi-lista-productos.service'

@Component({
  selector: 'app-contabilidad-tab',
  templateUrl: './contabilidad-tab.component.html',
  styleUrls: ['./contabilidad-tab.component.css'],
  standalone : false
})
export class ContabilidadTabComponent implements OnInit {

  constructor(private MiListaProductosService: MiListaProductosService) { }

  ngOnInit() {

  }
  private lngTercero: number = 0;
  public ListTagContabilidad: any[] = [];
  public ColorAnterior: any;

  getContabilidad(lngtercero : number) {
    this.ListTagContabilidad.length = 0;
    this.MiListaProductosService.GetConsultaContabilidadMisProdu(this.lngTercero).subscribe(
      result => {
        var item = 0
        if (result != null) {
          if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
              this.ListTagContabilidad[item] = result[i];
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

    $(".filconta" + this.ColorAnterior).css("background", "#FFFFFF");
    $(".filconta" + fil).css("background", "#e5e5e5");
    $(".strcuentaConta" + this.ColorAnterior).css("background", "#FFFFFF");
    $(".strcuentaConta" + fil).css("background", "#e5e5e5");

    this.ColorAnterior = fil;
    // limpia sombreado anterior

}

}
