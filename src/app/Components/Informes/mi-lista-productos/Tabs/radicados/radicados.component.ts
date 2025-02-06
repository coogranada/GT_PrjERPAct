import { Component, ElementRef, OnInit,ViewChild } from '@angular/core';
import { ExportExcelModelMovimientos } from '../../../../../Models/Clientes/Juridicos/ExportExcel.Model';
import { MiListaProductosService } from "../../../../../Services/Informes/mi-lista-productos.service";
import { OperacionesService } from '../../../../../Services/Maestros/operaciones.service';
import {
  EncabezadoRadicado,
  NegociacionRadicado,
  DecicionRadicado,
  LogMisProductos,
  DatosProductos
} from "../../../../../Models/Informes/MisProductos/mis-producto.model";
import { NgxToastService } from 'ngx-toast-notifier';

@Component({
  selector: "app-radicados",
  templateUrl: "./radicados.component.html",
  styleUrls: ["./radicados.component.css"],
  providers: [OperacionesService],
  standalone : false
})
export class RadicadosComponent implements OnInit {
  @ViewChild('ModalCalificacionRadicados', { static: true }) private ModalCalificacionRadicados!: ElementRef;

  public Radicado: any[] = [];
  public RadicadoCancelado: any[] = [];
  public encabezadoRadicado = new EncabezadoRadicado();
  public negociacionRadicado = new NegociacionRadicado();
  public DecisionRadicado = new DecicionRadicado();
  public DeduciblesRadicado: any[] = [];
  public SaldoVigenteRadicado: any[] = [];
  public CodeudoresRadicado: any[] = [];
  public ReferenciaRadicado: any[] = [];
  public nuevoObjetoCalifica: any[] = [];
  public Decision: any[] = [];
  public TelefonoAsociado: any;
  public MesActual : any;
  public ColorAnterior: any;
  public ColorAnterior8: any;
  public CalificaAnterior: any;
  public TipoCliente: number = 0;
  public Enero : any;
  public Febrero: any;
  public Marzo: any;
  public Abril: any;
  public Mayo: any;
  public Junio: any;
  public Julio: any;
  public Agosto: any;
  public Septiembre: any;
  public Octubre: any;
  public Noviembre: any;
  public Diciembre: any;
  public Deducciones: Number = 0;
  public CalificaAnualmente12Mes: any;
  public ResumenAnual: any[] = [];
  public saldoCancelar: any;
  public ValidadorCheck: any;
  public LstResumenCalificaciones: any[] = [];
  public idTercero: any;
  public totalCreComerciaCartera_: any;
  public totalCreConsumoCartera_: any;
  public totalCreViviendaCartera_: any;
  public totalMicroEmpCartera_: any;
  public MostarDetalleRadicado: Boolean = false;
  public MostrarResumenRadicado: Boolean = false;

  constructor(
    private MiListaProductosService: MiListaProductosService,
    private notif: NgxToastService,
  ) {}
  ngOnInit() {
    this.LstResumenCalificaciones.length = 0;
    this.CalificaAnualmente12Mes = 0;
    this.ResumenAnual.length = 0;
   }


  cerrarAcordeones() {
    $(".NegociaRadicado").prop('checked', false);
    $(".DeducibleRadicado").prop('checked', false);
    $(".saldosVigentesRadicado").prop('checked', false);
    $(".observacionesRadicado").prop('checked', false);
    $(".CodeudoresRadica").prop('checked', false);
    $(".ReferenciasRadica").prop('checked', false);
    $(".DesisionRadicado").prop('checked', false);
    $(".fechasRadicados").prop('checked', false);
  }

  cerrarAcordeone(value : number) {
    if (value == 1) {
      // $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 2) {
      $(".NegociaRadicado").prop('checked', false);
      // $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 3) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      // $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 4) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      // $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 5) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      // $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 6) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      // $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 7) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      // $(".DesisionRadicado").prop('checked', false);
      $(".fechasRadicados").prop('checked', false);
    }
    if (value == 8) {
      $(".NegociaRadicado").prop('checked', false);
      $(".DeducibleRadicado").prop('checked', false);
      $(".saldosVigentesRadicado").prop('checked', false);
      $(".observacionesRadicado").prop('checked', false);
      $(".CodeudoresRadica").prop('checked', false);
      $(".ReferenciasRadica").prop('checked', false);
      $(".DesisionRadicado").prop('checked', false);
      // $(".fechasRadicados").prop('checked', false);
    }
  }

  Limpiar() {
    this.LimpiarVariables();
    this.LstResumenCalificaciones.length = 0;

  }

  GetRadicados(tercero : number) {

    this.idTercero = tercero;
    this.MiListaProductosService.GetRadicados(tercero).subscribe(
      (result) => {
        if (result != null) {
          if (result.length == 0) {
            this.Radicado.length = 0;
          } else {
            this.Radicado = result;
            console.log(result);
          }
        }

      },
      (error) => {
        // this.ActivaCargando = false;
      }
    );
  }

  SeleccionaCalificacion(fil : number, lngIdCuenta : number) {

    if (this.CalificaAnterior == fil) {
      // no hace nada
    } else {
      this.CalificaAnualmente12Mes = 0;
      this.ResumenAnual.length = 0;

      this.MiListaProductosService.getCalificacionesAnuales(lngIdCuenta).subscribe(
      result => {
          this.CalificaAnualmente12Mes = result.Mes;
          this.Enero = result.Enero;
          this.Febrero = result.Febrero;
          this.Marzo = result.Marzo;
          this.Abril = result.Abril;
          this.Mayo = result.Mayo;
          this.Junio = result.Junio;
          this.Julio = result.Julio;
          this.Agosto = result.Agosto;
          this.Septiembre = result.Septiembre;
          this.Octubre = result.Octubre;
          this.Noviembre = result.Noviembre;
          this.Diciembre = result.Diciembre;
          this.MesActual = result.MesActual;
      }, error => {
        console.log(error);
      });

      this.MiListaProductosService.getCalificaAnualmente(lngIdCuenta).subscribe(
        result => {
            this.ResumenAnual = result;
        }, error => {
          console.log(error);
      });

      $(".Califi_" + this.CalificaAnterior).css("background", "#FFFFFF");
      $(".Califi_" + fil).css("background", "#e5e5e5");
    }
    this.CalificaAnterior = fil;
  }

  LimpiarVariables() {
    this.CalificaAnterior = null;
    this.ColorAnterior = null;
  }

  DetalleRadicados(data : any) {
    console.log(data);
    this.DeduciblesRadicado.length = 0;
    this.encabezadoRadicado.Estado = data.Estado;
    this.encabezadoRadicado.NombreLinea = data.NombreLinea;
    this.encabezadoRadicado.NombreProducto = data.NombreProducto;
    this.encabezadoRadicado.Oficina = data.Oficina;
    this.encabezadoRadicado.Radicado = data.Radicado;
    this.encabezadoRadicado.NombreAsesor = data.NombreAsesor;
    this.encabezadoRadicado.AsesorExterno = data.asesorExterno;
    this.encabezadoRadicado.Telefono = this.TelefonoAsociado;
    this.encabezadoRadicado.obsComite = data.obsComite;
    this.encabezadoRadicado.obsAsesor = data.obsAsesor;
    this.encabezadoRadicado.apertura = data.Apertura;
    this.encabezadoRadicado.cancelacion = data.Cancelacion;
    this.Decision.length = 0;
    this.MiListaProductosService.GetDetalleRadicados(data.Radicado,this.TipoCliente).subscribe(
      (result) => {
        console.log("Información de radicados")
        console.log(result);

        this.negociacionRadicado.FormaPago = result.Negociacion.FormaPago;
        this.negociacionRadicado.curCuota = result.Negociacion.curCuota;
        this.negociacionRadicado.curMonto = result.Negociacion.curMonto;

        this.negociacionRadicado.strGarantia = result.Negociacion.strGarantia;
        this.negociacionRadicado.strSistema = result.Negociacion.strSistema;
        this.negociacionRadicado.PeriodoInteres = result.Negociacion.PeriodoInteres;
        this.negociacionRadicado.PeriodoCapital = result.Negociacion.PeriodoCapital;
        this.negociacionRadicado.ValorDiferido = result.ValorDiferido;
        this.negociacionRadicado.ValorMensualDiferido = result.ValorMensualDiferido;

        this.negociacionRadicado.intDiasGracia = result.Negociacion.intDiasGracia;
        this.negociacionRadicado.intGarantia = result.Negociacion.intGarantia;
        this.negociacionRadicado.intPerCapital = result.Negociacion.intPerCapital;
        this.negociacionRadicado.intPerInteres = result.Negociacion.intPerInteres;
        this.negociacionRadicado.intPlazo = result.Negociacion.intPlazo;
        this.negociacionRadicado.intSistema = result.Negociacion.intSistema;
        this.negociacionRadicado.sngTasa = result.Negociacion.sngTasa;

        this.negociacionRadicado.Comite = result.Negociacion.Comite;
        this.negociacionRadicado.strUsuario = result.Negociacion.strUsuario;
        this.negociacionRadicado.dtmAprobacion = result.Negociacion.dtmAprobacion;

        this.saldoCancelar = result.SaldoCancelar;
        this.Decision = result.Decision;
        this.DecisionRadicado.NombreLinea = result.Decision.NombreLinea;
        this.DecisionRadicado.curCuota = result.Decision.curCuota;
        this.DecisionRadicado.curMonto = result.Decision.curMonto;
        this.DecisionRadicado.intDiasGracia = result.Decision.intDiasGracia;
        this.DecisionRadicado.intForPago = result.Decision.intForPago;
        this.DecisionRadicado.intGarantia = result.Decision.intGarantia;
        this.DecisionRadicado.intLinea = result.Decision.intLinea;
        this.DecisionRadicado.intPerCapital = result.Decision.intPerCapital;
        this.DecisionRadicado.intPlazo = result.Decision.intPlazo;
        this.DecisionRadicado.intProducto = result.Decision.intProducto;
        this.DecisionRadicado.sngTasa = result.Decision.sngTasa;

        this.DeduciblesRadicado = result.Deducibles;
        this.SaldoVigenteRadicado = result.SaldosVigentes;
        this.CodeudoresRadicado = result.codeudoresRadicado;
        this.ReferenciaRadicado = result.referencias;

      },
      (error) => {

        console.log(console.error());

      }
    )

    //#region Guarda log
    let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
    var LogMisProductosData = new LogMisProductos();
    var nuevoItem = new DatosProductos();
    LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
    LogMisProductosData.IdModulo = 69;
    LogMisProductosData.IdOperacion = 53;
    LogMisProductosData.IdOpcion = 1; // Detalle
    LogMisProductosData.IdTercero = this.idTercero;
    LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
    LogMisProductosData.IdCuenta = data.Radicado;
    nuevoItem.NumeroCuenta = data.Radicado.toString();
    nuevoItem.FechaInicial = "";
    nuevoItem.FechaFinal = "";
    LogMisProductosData.DatosProductos = nuevoItem;
    this.setLogMisProductos(LogMisProductosData);
    // #endregion


  }

  CambiarColor(fil : number) {

    $(".filRadica_" + this.ColorAnterior).css("background", "#FFFFFF");
    $(".filRadica_" + fil).css("background", "#e5e5e5");
    $(".intRadicado_" + this.ColorAnterior).css("background", "#FFFFFF");
    $(".intRadicado_" + fil).css("background", "#e5e5e5");

    this.ColorAnterior = fil;
    // limpia sombreado anterior

}
  cambiacolorAnalisis(fil : number) {
    $(".ahoCalidd_" + this.ColorAnterior8).css("background", "#FFFFFF");
    $(".ahoCalidd_" + fil).css("background", "#e5e5e5");
    this.ColorAnterior8 = fil;
    // limpia sombreado anterior
  }

  ConsultaResumen() {
    this.MiListaProductosService.getResumen(this.idTercero).subscribe(
      result => {
        if (this.ValidadorCheck) {
          this.totalCreComerciaCartera_ = result.TotalCreComerciales;
          this.totalCreConsumoCartera_  = result.TotalesCreConsumo;
          this.totalCreViviendaCartera_ = result.TotalesMicroEmp;
          this.totalMicroEmpCartera_    = result.TotalesCreVivienda;
        } else {
          this.totalCreComerciaCartera_ = result.TotalCreComercialesCancela;
          this.totalCreConsumoCartera_ = result.TotalesCreConsumoCancela;
          this.totalCreViviendaCartera_ = result.TotalesMicroEmpCancela;
          this.totalMicroEmpCartera_ = result.TotalesCreViviendaCancela;
        }
      },
      error => {
      });
    //LstResumenCalificaciones
    this.MiListaProductosService.getAnalisis(this.idTercero).subscribe(
      result => {
        if (result.length !== 0) {
          this.ModalCalificacionRadicados.nativeElement.click();

          this.ResumenAnual.length = 0;
          this.CalificaAnualmente12Mes = 0;
          this.LstResumenCalificaciones.length = 0;

          var cont = 0;
          for (var i = 0; i < result.length; i++) {
            this.LstResumenCalificaciones[cont] = result[i];
            cont++;
          }

          var cuenta = "Cuenta";
          var ont1 = 0

          for (var i = 0; i < this.LstResumenCalificaciones.length; i++) {
            if (!this.nuevoObjetoCalifica.hasOwnProperty(this.LstResumenCalificaciones[i])) {
              this.nuevoObjetoCalifica[ont1] = {
                Cuenta: this.LstResumenCalificaciones[i].Cuenta,
                Calificaciones: []
              }

              this.nuevoObjetoCalifica[ont1].Calificaciones.push({
                Calificacion: this.LstResumenCalificaciones[i].Calificacion,
                Numeroveces: this.LstResumenCalificaciones[i].NumeroVeces
              })
              ont1++;

            }
          }

          this.LstResumenCalificaciones.forEach(x => {
            if (!this.nuevoObjetoCalifica.hasOwnProperty(x.Cuenta)) {
              this.nuevoObjetoCalifica[x.Cuenta] = {
                Cuenta: x.Cuenta,
                Calificaciones: []
              }
            }

            this.nuevoObjetoCalifica[x.Cuenta].Calificaciones.push({
              Calificacion: x.Calificacion,
              Numeroveces: x.NumeroVeces
            })


          })
          setTimeout(() => {
            this.daclick();
          }, 800);
          ;

          //#region Guarda log
          let datas = localStorage.getItem("Data");
          var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
          var LogMisProductosData = new LogMisProductos();
          var nuevoItem = new DatosProductos();
          LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
          LogMisProductosData.IdModulo = 69;
          LogMisProductosData.IdOperacion = 53;
          LogMisProductosData.IdOpcion = 5; // Ver resumen
          LogMisProductosData.IdTercero = this.idTercero;
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

  setLogMisProductos(LogMisProductos_: LogMisProductos) {
    this.MiListaProductosService.setLogMisProductos(LogMisProductos_).subscribe(
      result => {
        //console.log("register",result);
      },
      error => {
        //console.log(error);
      }
    )
  }

  daclick(){
    $(".Califi_0").click()
  }

}
