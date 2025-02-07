import { Component, OnInit } from '@angular/core';
import { MiListaProductosService } from '../../../../../Services/Informes/mi-lista-productos.service'
@Component({
  selector: 'app-notificaciones-tab',
  templateUrl: './notificaciones-tab.component.html',
  styleUrls: ['./notificaciones-tab.component.css'],
  standalone : false
})
export class NotificacionesTabComponent implements OnInit {


  private lngTercero: number = 0;
  public ListNotificacionesMisPro: any[] = [];
  public ColorAnterior: any;
  constructor(private MiListaProductosService: MiListaProductosService) { }

  ngOnInit() {
  }

  getNotificaciones(lngtercero : number) {
    this.ListNotificacionesMisPro.length = 0;
    this.MiListaProductosService.GetConsultaNotificacionesMisProdu(this.lngTercero).subscribe(
      result => {
        var item = 0
        if (result != null) {
          if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
              this.ListNotificacionesMisPro[item] = result[i];
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

    $(".filNoti_" + this.ColorAnterior).css("background", "#FFFFFF");
    $(".filNoti_" + fil).css("background", "#e5e5e5");
    $(".strDes" + this.ColorAnterior).css("background", "#FFFFFF");
    $(".strDes" + fil).css("background", "#e5e5e5");

    this.ColorAnterior = fil;
    // limpia sombreado anterior
  }
}
