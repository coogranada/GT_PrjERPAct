import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MiListaProductosService } from '../../../../../Services/Informes/mi-lista-productos.service';
import { LogMisProductos,DatosProductos } from '../../../../../Models/Informes/MisProductos/mis-producto.model';
import { AlertService } from '../../../../../Services/Alert/alert.service';


@Component({
  selector: 'app-coodeudor-tab',
  templateUrl: './coodeudor-tab.component.html',
  styleUrls: ['./coodeudor-tab.component.css'],
  standalone : false
})
export class CoodeudorTabComponent implements OnInit {
  @ViewChild('ModalCalificacionCodeudor', { static: true }) private ModalCalificacionCodeudor!: ElementRef;

  constructor(private miListaProductosService: MiListaProductosService,
    private notif: AlertService) { }
  public ActivosCodeudores: any[] = [];
  public CanceladosCodeudores: any[] = [];
  public LstResumenCalificaciones: any[] = [];
  public ValidadaActivo: boolean = true;
  public ActivaCargando: Boolean = false;
  public CreditoComercial: number = 0;
  public CreditoConsumo: number = 0;
  public CreditoVivienda: number= 0;
  public MicroCreditoEmpresarial: number= 0;
  public tercero: any;
  public ColorAnterior: any;
  public MostarResumenCodeudor: boolean = false;

  ngOnInit() {
  }

  setLogMisProductos(LogMisProductos_: LogMisProductos) {
    this.miListaProductosService.setLogMisProductos(LogMisProductos_).subscribe(
      result => {
        //console.log("register",result);
      },
      error => {
        //console.log(error);
      }
    )
  }

  getCodeudores(tercero : number) {
    this.ActivosCodeudores.length = 0;
    this.CanceladosCodeudores.length = 0;
    this.ActivaCargando = true;
    this.CreditoComercial = 0;
    this.CreditoConsumo = 0;
    this.CreditoVivienda = 0;
    this.MicroCreditoEmpresarial = 0;
    this.tercero = tercero;
    this.miListaProductosService.getCodeudores(tercero).subscribe(
      (result) => {
        this.ActivaCargando = false;
        console.log("This is dat of codeudoress");
        console.log(result);
        if (result==null) {
          this.ActivosCodeudores = [];
          this.CanceladosCodeudores = [];
        } else {
          var activCod = 0;
          var cancelCod = 0;
          this.CreditoComercial = result.CreditoComercial;
          this.CreditoConsumo = result.CreditoConsumo;
          this.CreditoVivienda = result.CreditoVivienda;
          this.MicroCreditoEmpresarial = result.MicroCreditoEmpresarial;
          var dtm = result.CodeudoresProductos;
          if (result.CodeudoresProductos != null) {
            if (result.CodeudoresProductos.length > 0) {
              for (var i = 0; i < result.CodeudoresProductos.length; i++) {
                var dtmCancela = result.CodeudoresProductos[i].dtmCancela;
                if (
                  result.CodeudoresProductos[i].dtmCancela == null ||
                  result.CodeudoresProductos[i].dtmCancela == ""
                ) {
                  this.ActivosCodeudores[activCod] = result.CodeudoresProductos[i];
                  activCod++;
                } else if (
                  result.CodeudoresProductos[i].dtmCancela != "" &&
                  result.CodeudoresProductos[i].intEstado != 10//anulados
                ) {
                  this.CanceladosCodeudores[cancelCod] = result.CodeudoresProductos[i];
                  cancelCod++;
                }

              }
            }
          }

          if (this.ValidadaActivo == true && activCod == 0) {
            this.ActivosCodeudores.length = 0;
          }

          if (this.ValidadaActivo == false && cancelCod == 0) {
            this.CanceladosCodeudores.length = 0;
          }
        }
      },
      (error) => {
        this.ActivaCargando = false;
        console.log(error);
      }
    )
  }

  ConsultaResumen() {
      //LstResumenCalificaciones
    this.LstResumenCalificaciones.length = 0;
    if (!this.ValidadaActivo) {
      this.CreditoComercial = 0;
      this.CreditoConsumo = 0;
      this.CreditoVivienda = 0;
      this.MicroCreditoEmpresarial = 0;
    }
      this.miListaProductosService.getResumenCalificacionesCodeudores(this.tercero).subscribe(
        result => {
          if (result !== null) {

            this.ModalCalificacionCodeudor.nativeElement.click();

            if (this.ValidadaActivo) {
              var cont = 0;
              for (var i = 0; i < result.length; i++) {
                if (result[i].Activa == true) {
                  this.LstResumenCalificaciones[cont] = result[i];
                  cont++;
                }
              }

            } else {
              var cont = 0;
              for (var i = 0; i < result.length; i++) {
                if (result[i].Activa == false) {
                  this.LstResumenCalificaciones[cont] = result[i];
                  cont++;
                }
              }
            }
            //#region Guarda log
            let data = localStorage.getItem("Data");
            var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 52;
            LogMisProductosData.IdOpcion = 5; // ver resumen
            LogMisProductosData.IdTercero = this.tercero;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            nuevoItem.FechaInicial = "";
            nuevoItem.FechaFinal = "";
            LogMisProductosData.DatosProductos = nuevoItem;
            this.setLogMisProductos(LogMisProductosData);
        // #endregion

          } else {
            this.notif.onWarning('Advertencia', 'Registro sin resumen.');
          }         
        },
        error => {
        });
  }

  CambiarColor(fil : number) {

      $(".filcODE_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filcODE_" + fil).css("background", "#e5e5e5");
      $(".strCuentaCode_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".strCuentaCode_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior = fil;
      // limpia sombreado anterior
  }
}
