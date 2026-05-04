import { Component, OnInit,ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { retry, delay } from 'rxjs/operators';
import { MiListaProductosService } from '../../../../../Services/Informes/mi-lista-productos.service';
import {
  InfoSeguro, LogMisProductos,
  DatosProductos, MesxYear,
  dataBeneficiariosOlivos,
  dataBeneficiariosMascotasOlivos,
  DetalleDisponibleModel,
  SaldosDisponibles,
  Libreta,
  Tarjeta,
  Cupo
} from '../../../../../Models/Informes/MisProductos/mis-producto.model';
import { NgxLoadingComponent } from "ngx-loading";
import moment from 'moment';
import { DatePipe } from '@angular/common';
import swal from "sweetalert2";

//import { isString } from 'util';



const ColorPrimario = "rgb(13,165,80)";
const ColorSecundario = "rgb(13,165,80,0.7)";

@Component({
  selector: 'app-convenios',
  templateUrl: './convenios.component.html',
  styleUrls: ['./convenios.component.css'],
  providers: [MiListaProductosService],
  standalone : false
})

export class ConveniosComponent implements OnInit {

  constructor(private MiListaProductosService: MiListaProductosService) {

  }

  @ViewChild("ngxLoading", { static: false }) ngxLoadingComponent!: NgxLoadingComponent;

  public ServicioExequialData: any[] = [];
  public ServicioExequialCancelado: any[] = [];
  public ActivaCargando: boolean = false;
  public ActiveNotRegisterAutorizados_: Boolean = false;
  public ValidadaActivo: boolean = true;
  public ConvenioActivo: any[] = [];
  public ConvenioCancelado: any[] = [];
  public loading = false;
  public urlPdf: any;
  public desactiveExequial: boolean = false;
  public validaMail: boolean = false;
  public desactiveExequialOlivos: boolean = false;
  public desactiveConvenios: boolean = false;
  public InfoSeguroExequial = new InfoSeguro();
  public Tarjeta = new Tarjeta();
  public Canales: any[] = [];
  public Cupo = new Cupo();
  public Acordeon1: Boolean = false;
  public Acordeon2: Boolean = false;
  public Acordeon3: Boolean = false;
  public Acordeon4: Boolean = false;
  public Acordeon5: Boolean = false;
  public Acordeon6: Boolean = false;
  public Acordeon7: Boolean = false;
  public Acordeon8: Boolean = false;
  public validaMascota: Boolean = false;
  public InscritosSeguroExequial: any[] = [];
  public BeneficiariosSeguroExequial: any[] = [];
  public terceroId: any;
  public RenovacionSeguroExequial: any[] = [];
  public HistoricoSeguroExequial: any[] = [];
  public ExtractosConvenio: any[] = [];
  public MovimientosConvenio: any[] = [];
  public InfoConvenio = new InfoSeguro();
  public RenovacionConvenios: any[] = [];
  public InscritosConvenios: any[] = [];
  public HistoricoConvenios: any[] = [];
  public ExtractoConveniosForm!: FormGroup;
  public ExtractoSeguroForm!: FormGroup;
  public FechaMayorAmenor: Boolean = false;
  public NumeroDocumento: any;
  public FechaMenorMayor: Boolean = false;
  public fechaAperturaCuenta: any;
  public fechaAperturaActualDisabled: any;
  public inicioNoValida: Boolean = false;
  public finNoValida: Boolean = false;
  public SelectErroneo: Boolean = false;
  public InicioVacida: Boolean = false;
  public FinVacida: Boolean = false;
  public selectedEstado : any;
  public valueSlect: any;
  public FilePDFXLS: any;
  public valueFechaFinal: any;
  public valueFechaInicial: any;
  public Movimientos: any[] = [];
  public HabilitaMensate: any = 0;
  public Extractos: any[] = [];
  public consecutivo: any;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public SelectionExtOrMov: any;
  public fechaFinC: any;
  public fechaInicioC: any;
  public idCuenta: any;
  public NumeroCuenta: any;
  public ColorAnterior: any;
  public ColorAnteriorOlivos: any;
  public ColorAnterior2: any;
  public ColorAnterior3: any;
  public ColorAnterior4: any;
  public ColorAnterior5: any;
  public ColorAnterior6: any;
  public ColorAnterior7: any;
  public today: any;
  public validaForm: Boolean = false;
  public mesxYear: MesxYear[] = [];
  public mesxYearEnd: MesxYear[] = [];
  public SeleccionExt: number = 2;
  public yearInit: any;
  public yearEnd: any;
  public MesInit: any;
  public MesEnd: any;
  public mesInicial: any;
  public YearsxMes: any[] = [];
  public yearActual: any;
  public yearInicial: any;
  public DetalleConvenioModel = new DetalleDisponibleModel();
  public saldosDisponibles = new SaldosDisponibles();
  public Libreta = new Libreta();
  //variables validan formulario de ext
  public validaAnoInicial: Boolean = false;
  public validaAnoFinal: Boolean = false;
  public validaMesInicial: Boolean = false;
  public validaMesFinal: Boolean = false;
  public MostrarDetalleConvenio: Boolean = false;
  public MostrarExtractoConvenio: Boolean = false;
  public validaCupo: Boolean = false;
  public ColorBeneficiario: any;
  public ColorRenovacion: any;
  public ColorMovimientos: any;
  public AutorizadosTitularDisponible: any[] = [];
  public lstCodeudores: any[] = [];
  public dataHistorialDisponible: any[] = [];
  public lstGarantias: any[] = [];
  public dataObjet: any;
  public carteraReal: any = {};
  public contratosOlivos : any[] = [];
  public infoModalVencidos : any[] = [];
  public detalleModalSaldosVencidos : any[] = [];
  public countErrors: any = 0;
  public falloOlivos = false;
  public mostrarDetalle = false;
  public checkAcordeon = false;
  public saldosAcordeon: Boolean = false;
  public saldoMesAnteriorAcordeon: Boolean = false;
  public autorizadosAcordeon: Boolean = false;
  public fechasAcordeon: Boolean = false;
  public LibretaAcordeon: Boolean = false;
  public TarjetaAcordeon: Boolean = false;
  public CanalesAcordeon: Boolean = false;
  public CuposAcordeon: Boolean = false;
  public GarantiasAcordeon: Boolean = false;
  public HistorialAcordeon: Boolean = false;
  public ColorAutorizado: any;
  public LibretaBoolean: Boolean = false;
  public SeleccionMovimientos = [
    {
      selector: "Movimientos",
      value: 1,
    },
    {
      selector: "Extractos",
      value: 2,
    },
  ];

  public token: string = "";
  public dataUserOlivos: any[] = [];
  public dataBeneficiariosOlivos: dataBeneficiariosOlivos[] = [];
  public dataBeneficiariosOlivosTable: dataBeneficiariosOlivos[] = [];
  public dataBeneficiariosMascotasOlivos: dataBeneficiariosMascotasOlivos[] = [];

  public ListProducto: any[] = [];
  public ListCarteraConvenio: any[] = [];
  public ListInscritos: any[] = [];
  public ListMascotas: any[] = [];
  public selectedRow: any = null;

  ngOnInit() {
    this.FormExtracto();
    this.FormExtractoSeg();
    this.selectedEstado = "-";
  }

  cerrarAcordeonCheck() {
    if (this.saldosAcordeon) {
      $(".saldosDisponibbleCon").prop("checked", false);
    }
    if (this.saldoMesAnteriorAcordeon) {
      $(".mesAnteriorDisponibleCon").prop("checked", false);
    }
    if (this.autorizadosAcordeon) {
      $(".autorizadosDisponibleCon").prop("checked", false);
    }
    if (this.fechasAcordeon) {
      $(".fechasDisponibleCon").prop("checked", false);
    }
    if (this.LibretaAcordeon) {
      $(".LibretaCon").prop("checked", false);
    }
    if (this.TarjetaAcordeon) {
      $(".TarjetaCon").prop("checked", false);
    }
    if (this.CuposAcordeon) {
      $(".CuposCon").prop("checked", false);
    }
    if (this.GarantiasAcordeon) {
      $(".GarantiasCon").prop("checked", false);
    }
    if (this.HistorialAcordeon) {
      $(".Historial").prop("checked", false);
    }
    if (this.CanalesAcordeon) {
      $(".CanalesCon").prop("checked", false);
    }
  }

  DetalleCon(data : any) {
    this.DetalleConvenioModel = new DetalleDisponibleModel();
    this.saldosDisponibles = new SaldosDisponibles();
    this.Libreta = new Libreta();
    this.Tarjeta = new Tarjeta();
    this.Cupo = new Cupo();

    this.DetalleConvenioModel.Cuenta = data.strCuenta;
    this.DetalleConvenioModel.Producto = data.NameProducto;
    this.DetalleConvenioModel.Estado = data.NameEstado;
    this.DetalleConvenioModel.Oficina = data.NameOficina;
    this.DetalleConvenioModel.OperacionPermitida = data.OperaPermitida;
    this.DetalleConvenioModel.Asesor = data.Asesor;

    //#region Guarda log
    let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
    var LogMisProductosData = new LogMisProductos();
    var nuevoItem = new DatosProductos();
    LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
    LogMisProductosData.IdModulo = 69;
    LogMisProductosData.IdOperacion = 80;
    LogMisProductosData.IdOpcion = 1; // Destalle
    LogMisProductosData.IdTercero = this.terceroId;
    LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
    LogMisProductosData.IdCuenta = data.lngIdCuenta;
    nuevoItem.NumeroCuenta = data.strCuenta;
    nuevoItem.FechaInicial = "";
    nuevoItem.FechaFinal = "";
    LogMisProductosData.DatosProductos = nuevoItem;
    this.setLogMisProductos(LogMisProductosData);
    // #endregion
    this.Canales.length = 0;
    this.AutorizadosTitularDisponible.length = 0;
    this.lstCodeudores.length = 0;
    this.lstGarantias.length = 0;
    this.dataHistorialDisponible.length = 0;
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var idOficina = cuentaArray[0];
    var idProducto = cuentaArray[1];
    var consecutivo = cuentaArray[2];
    var digito = cuentaArray[3];

    this.MiListaProductosService.BuscarCuenta(
      idOficina,
      idProducto,
      consecutivo,
      digito
    ).subscribe(
      (result) => {
        //tarjeta
        this.dataObjet = result;
        this.saldosDisponibles.tarjetaoPlastico = "0";
        this.saldosDisponibles.moraCuotaManejo = "0";
        if (result.IdMedioPago == 0) {
          this.LibretaBoolean = true;

          this.Libreta.curInicial = "";
          this.Libreta.curFinal = "";

          if (result.Talonarios[0] != null && result.Talonarios[0] != undefined) {
            if (
              result.Talonarios[0].CobroLibreta == null ||
              result.Talonarios[0].CobroLibreta == undefined ||
              result.Talonarios[0].CobroLibreta == ""
            ) {
              this.saldosDisponibles.tarjetaoPlastico = "0";
            } else {
              this.saldosDisponibles.tarjetaoPlastico = result.Talonarios[0].CobroLibreta;
            }

            this.Libreta.curInicial = result.Talonarios[0].Inicial;
            this.Libreta.curFinal = result.Talonarios[0].Final;
            this.saldosDisponibles.moraCuotaManejo = "0";
          } else {
            this.saldosDisponibles.tarjetaoPlastico = "0";
            this.saldosDisponibles.moraCuotaManejo = "0";
          }

        } else if (result.IdMedioPago == 10 || result.IdMedioPago == 50) {
          this.LibretaBoolean = false;
          if (result.IdMedioPago == 50 || result.IdMedioPago == '50') {
            this.validaCupo = true;
          } else {
            this.validaCupo = false;
          }
          if (this.dataObjet.Tarjetas.length != 0) {
            this.Tarjeta.CobroTarjeta = result.Tarjetas.CobroTarjeta;
            this.Tarjeta.CuotaManejo = result.Tarjetas.CuotaManejo;
            this.Tarjeta.CuotaManejoMora = result.Tarjetas.CuotaManejoMora;
            this.Tarjeta.DescripcionConvenio = result.Tarjetas.DescripcionConvenio;
            this.Tarjeta.DiasVigencia = result.Tarjetas.DiasVigencia;
            this.Tarjeta.FechaCambioPlazo = result.Tarjetas.FechaCambioPlazo;
            this.Tarjeta.FechaRediferir = result.Tarjetas.FechaRediferir;
            this.Tarjeta.FechaVigencia = result.Tarjetas.FechaVigencia;
            this.Tarjeta.IdConvenio = result.Tarjetas.IdConvenio;
            this.Tarjeta.NumeroPagare = result.Tarjetas.NumeroPagare;
            this.Tarjeta.NumeroTarjeta = result.Tarjetas.NumeroTarjeta;
            this.Tarjeta.PagoTotal = result.Tarjetas.PagoTotal;
            this.Tarjeta.dtmCobro = result.Tarjetas.dtmCobro;
            this.Tarjeta.intDiaCorte = result.Tarjetas.intDiaCorte;
            this.Tarjeta.intDiaPago = result.Tarjetas.intDiaPago;
            this.Tarjeta.intPlazo = result.Tarjetas.intPlazo;

            this.ConvenioTarjetas(this.Tarjeta.IdConvenio.toString());
            this.DiaCortePago(
              this.Tarjeta.IdConvenio,
              this.Tarjeta.intDiaCorte
            );

            this.Canales = result.Canales;

            this.Cupo.CupoAprobado = result.Cupo.CupoAprobado;
            this.Cupo.CupoUtilizado = result.Cupo.CupoUtilizado;
            this.Cupo.Fecha = result.Cupo.Fecha;
            this.Cupo.IdCartera = result.Cupo.IdCartera;
            this.Cupo.IdLinea = result.Cupo.IdLinea;
            this.Cupo.NombreLinea = result.Cupo.NombreLinea;
            this.Cupo.NumeroPagare = result.Cupo.NumeroPagare;
            this.Cupo.Radicado = result.Cupo.Radicado;
            this.Cupo.intCodigo = result.Cupo.intCodigo;
            this.Cupo.PagoMinimo = result.PagoMinimo;
            this.Cupo.PagoTotal = result.PagoTotal;
            if (
              result.Cupo.IdOficina != null &&
              result.Cupo.IdOficina != "" &&
              result.Cupo.IdProducto != null &&
              result.Cupo.IdProducto != "" &&
              result.Cupo.IdConsecutivo != null &&
              result.Cupo.IdConsecutivo != "" &&
              result.Cupo.IdDigito != null &&
              result.Cupo.IdDigito != ""
            ) {
              this.GenerarCuentaCupo(
                result.Cupo.IdOficina,
                result.Cupo.IdProducto,
                result.Cupo.IdConsecutivo,
                result.Cupo.IdDigito
              );
            }

            this.lstCodeudores = result.Codeudor;
            this.lstGarantias = result.Real;

            if (
              this.dataObjet.Tarjetas.CobroTarjeta == null ||
              this.dataObjet.Tarjetas.CobroTarjeta == undefined ||
              this.dataObjet.Tarjetas.CobroTarjeta == ""
            ) {
              this.saldosDisponibles.tarjetaoPlastico = "0";
            } else {
              this.saldosDisponibles.tarjetaoPlastico = this.dataObjet.Tarjetas.CobroTarjeta;
            }
            this.saldosDisponibles.moraCuotaManejo = this.dataObjet.Tarjetas.CuotaManejoMora;

          } else {
            this.saldosDisponibles.tarjetaoPlastico = "0";
            this.saldosDisponibles.moraCuotaManejo = "0";
          }
        } else {
          this.saldosDisponibles.tarjetaoPlastico = "0";
          this.saldosDisponibles.moraCuotaManejo = "0";
        }
        this.ObtenerHistorial(idOficina, idProducto, consecutivo, digito);
        if (result.ActivaMovimiento == true) {
          $("#activaCon").prop("checked", true);
        } else {
          $("#activaCon").prop("checked", false);
        }

        if (result.Exenta == true) {
          $("#exentoCon").prop("checked", true);
        } else {
          $("#exentoCon").prop("checked", false);
        }

        if (result.ExoneradaGmf == true) {
          $("#exoneraCon").prop("checked", true);
        } else {
          $("#exoneraCon").prop("checked", false);
        }

        if (result.TibrarComentario == true) {
          $("#timbraCon").prop("checked", true);
        } else {
          $("#timbraCon").prop("checked", false);
        }

        this.DetalleConvenioModel.FechaMatricula = result.FechaApertura;
        this.DetalleConvenioModel.FechaUltimaTransaccion = result.FechaUltimaTrans;
        this.DetalleConvenioModel.FechaCancela = result.FechaCancelacion;
        var nombreAsesorExterno =
          result.PrimerApellidoAsesorE +
          " " +
          result.SegundoApellidoAsesorE +
          " " +
          result.PrimerNombreAsesorE +
          " " +
          result.SegundoNombreAsesoreE;
        this.DetalleConvenioModel.AsesorExt = nombreAsesorExterno;

        var FormaPago = result.IdFormaPago;
        if (FormaPago == 0) {
          this.DetalleConvenioModel.FormaPago = "Caja";
        } else if (FormaPago == 1) {
          this.DetalleConvenioModel.FormaPago = "Débito";
        } else if (FormaPago == 2) {
          this.DetalleConvenioModel.FormaPago = "Nómina";
        } else {
          this.DetalleConvenioModel.FormaPago = "";
        }

        var medioPago = result.IdMedioPago;
        if (medioPago == 0) {
          this.DetalleConvenioModel.MedioPago = "Libretas";
        } else if (medioPago == 10) {
          this.DetalleConvenioModel.MedioPago = "Sin Cupo";
        } else if (medioPago == 50) {
          this.DetalleConvenioModel.MedioPago = "Con Cupo";
        } else {
          this.DetalleConvenioModel.MedioPago = "";
        }

        this.saldosDisponibles.saldoInicial = result.SaldoInicial;
        this.saldosDisponibles.SaldoMinimo = result.SaldoMinimo;
        if (
          result.SaldoExonerado == null ||
          result.SaldoExonerado == undefined ||
          result.SaldoExonerado == ""
        ) {
          this.saldosDisponibles.SaldoExonerado = "0";
        } else {
          this.saldosDisponibles.SaldoExonerado = result.SaldoExonerado;
        }

        this.saldosDisponibles.SaldoCanje = result.Canje;
        this.saldosDisponibles.RetencioFuente = result.RetencionPeriodos;
        this.saldosDisponibles.SaldoEfectivo = result.Efectivo;
        this.saldosDisponibles.SaldoTotal = result.Canje + result.Efectivo;
        this.saldosDisponibles.SaldoPromedioMesAnterior = result.SaldoPromedioMesAnterior;
        this.saldosDisponibles.InteresMesAnterior = result.InteresMesAnterior;
        var posactivos = 0;

        if (result.Titulares.length > 0) {
          for (var j = 0; j < result.Titulares.length; j++) {
            if (
              result.Titulares[j].TipoFirma == "Firmas independientes :  " ||
              result.Titulares[j].TipoFirma == "Firmas conjuntas:   "
            ) {
              result.Titulares[j].TipoFirma = result.Titulares[
                j
              ].TipoFirma.replace(":", "");
            }
            this.AutorizadosTitularDisponible[posactivos] = result.Titulares[j];
            posactivos++;
          }
        } else {
          this.AutorizadosTitularDisponible.length = 0;
        }
        if (this.AutorizadosTitularDisponible.length <= 0) {
          this.ActiveNotRegisterAutorizados_ = true;
        } else {
          this.ActiveNotRegisterAutorizados_ = false;
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.DetalleConvenioModel.Timbrar = data.TibrarComentario;
  }

  cambiarColorAutBenef(fil : number) {
    $(".filAutoriAtBen_" + this.ColorAutorizado).css("background", "#FFFFFF");
    $(".filAutoriAtBen_" + fil).css("background", "#e5e5e5");
    this.ColorAutorizado = fil;
  }

  ObtenerHistorial(idOficina : string, idProducto : string, consecutivo : string, digito : string) {
    this.loading = true;
    this.MiListaProductosService.ObtenerHistorial(
      idOficina,
      idProducto,
      consecutivo,
      digito
    ).subscribe(
      (result) => {
        this.loading = false;
        this.dataHistorialDisponible = result;
      },
      (error) => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  GenerarCuentaCupo(IdOficina : string, IdProducto : string, IdConsecutivo : string, IdDigito : string) {
    this.MiListaProductosService.GenerarCuentaCupo(
      IdOficina,
      IdProducto,
      IdConsecutivo,
      IdDigito
    ).subscribe(
      (result) => {
        this.Cupo.CuentaCupo = result;
      },
      (error) => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  ConvenioTarjetas(idConvenio : string) {
    this.MiListaProductosService.ConveniosTarjetas().subscribe(
      (result : any[]) => {
        //
        result.forEach((element) => {
          if (element.IdConvenio === idConvenio) {
            this.Tarjeta.Convenio = element.DescripcionConvenio;
          }
        });
      },
      (error) => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  DiaCortePago(Convenio : number, IntDia : number) {
    this.MiListaProductosService.DiaCortePago(Convenio).subscribe(
      (result : any[]) => {
        result.forEach((element) => {
          if (element.intDiaCorte === IntDia) {
            this.Tarjeta.DiaCortePago = element.intDiaCorte + " - " + element.intDiaPago;
          }
        });
      },
      (error) => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  //DFRAMIREZ 05-02-2026: NUEVA IMPLEMENTACIÓN OLIVOS

  getProductosOlivos(Documento: string) {
    this.MiListaProductosService.ObtenerResumenContrato(Documento).subscribe(
      result => {
        this.ListProducto = result.Result;
      });
  }



  //FIN NUEVA IMPLEMENTACIÓN OLIVOS
  

 cerrarAcordeon(value : number, abre=false) {
    if (value == 1) {
      $(".con2").prop("checked", false);
      $(".con3").prop("checked", false);
      this.desactiveExequial = true;
    }
    else if (value == 2) {
      var NumeroDocumento = $("#NumeroDocumento").val();
      $(".con1").prop("checked", false);
      $(".con3").prop("checked", false);
      this.desactiveExequialOlivos = true;
      this.mostrarDetalle = false;

      if (abre != true) {
        this.getProductosOlivos(NumeroDocumento!.toString());
      }
      setTimeout(() => this.mostrarDetalle = true, 1000);
    }
    else if (value == 3) {
      $(".con2").prop("checked", false);
      $(".con1").prop("checked", false);
      this.desactiveConvenios = true;
    }
    //cerrarTodos
    else if (value == 4) {
      $(".con1").prop("checked", false);
      $(".con2").prop("checked", false);
      $(".con3").prop("checked", false);
      this.checkAcordeon = false;
    }
  }

  cerrarAcordeonCk(value : number) {
    if (value == 1) {
      this.saldosAcordeon = true;

      // $(".saldosDisponibbleCon").prop("checked", false);
      $(".mesAnteriorDisponibleCon").prop("checked", false);
      $(".autorizadosDisponibleCon").prop("checked", false);
      $(".fechasDisponibleCon").prop("checked", false);
      $(".LibretaCon").prop("checked", false);
      $(".CanalesCon").prop("checked", false);
      $(".TarjetaCon").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".GarantiasCon").prop("checked", false);
      $(".CuposCon").prop("checked", false);

    }
    if (value == 2) {
      this.saldoMesAnteriorAcordeon = true;
      $(".saldosDisponibbleCon").prop("checked", false);
      // $(".mesAnteriorDisponibleCon").prop("checked", false);
      $(".autorizadosDisponibleCon").prop("checked", false);
      $(".fechasDisponibleCon").prop("checked", false);
      $(".LibretaCon").prop("checked", false);
      $(".CanalesCon").prop("checked", false);
      $(".TarjetaCon").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".GarantiasCon").prop("checked", false);
      $(".CuposCon").prop("checked", false);
    }
    if (value == 3) {
      this.autorizadosAcordeon = true;
      $(".saldosDisponibbleCon").prop("checked", false);
      $(".mesAnteriorDisponibleCon").prop("checked", false);
      // $(".autorizadosDisponibleCon").prop("checked", false);
      $(".fechasDisponibleCon").prop("checked", false);
      $(".LibretaCon").prop("checked", false);
      $(".CanalesCon").prop("checked", false);
      $(".TarjetaCon").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".GarantiasCon").prop("checked", false);
      $(".CuposCon").prop("checked", false);
    }
    if (value == 4) {
      this.fechasAcordeon = true;
      $(".saldosDisponibbleCon").prop("checked", false);
      $(".mesAnteriorDisponibleCon").prop("checked", false);
      $(".autorizadosDisponibleCon").prop("checked", false);
      // $(".fechasDisponibleCon").prop("checked", false);
      $(".LibretaCon").prop("checked", false);
      $(".CanalesCon").prop("checked", false);
      $(".TarjetaCon").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".GarantiasCon").prop("checked", false);
      $(".CuposCon").prop("checked", false);
    }

    if (value == 5) {
      this.LibretaAcordeon = true;
      $(".saldosDisponibbleCon").prop("checked", false);
      $(".mesAnteriorDisponibleCon").prop("checked", false);
      $(".autorizadosDisponibleCon").prop("checked", false);
      $(".fechasDisponibleCon").prop("checked", false);
      // $(".LibretaCon").prop("checked", false);
      $(".CanalesCon").prop("checked", false);
      $(".TarjetaCon").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".GarantiasCon").prop("checked", false);
      $(".CuposCon").prop("checked", false);
    }
    if (value == 6) {
      this.TarjetaAcordeon = true;
      $(".saldosDisponibbleCon").prop("checked", false);
      $(".mesAnteriorDisponibleCon").prop("checked", false);
      $(".autorizadosDisponibleCon").prop("checked", false);
      $(".fechasDisponibleCon").prop("checked", false);
      $(".LibretaCon").prop("checked", false);
      $(".CanalesCon").prop("checked", false);
      // $(".TarjetaCon").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".GarantiasCon").prop("checked", false);
      $(".CuposCon").prop("checked", false);
    }
    if (value == 7) {
      this.CanalesAcordeon = true;
      $(".saldosDisponibbleCon").prop("checked", false);
      $(".mesAnteriorDisponibleCon").prop("checked", false);
      $(".autorizadosDisponibleCon").prop("checked", false);
      $(".fechasDisponibleCon").prop("checked", false);
      $(".LibretaCon").prop("checked", false);
      // $(".CanalesCon").prop("checked", false);
      $(".TarjetaCon").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".GarantiasCon").prop("checked", false);
      $(".CuposCon").prop("checked", false);
    }
    if (value == 8) {
      this.CuposAcordeon = true;
      $(".saldosDisponibbleCon").prop("checked", false);
      $(".mesAnteriorDisponibleCon").prop("checked", false);
      $(".autorizadosDisponibleCon").prop("checked", false);
      $(".fechasDisponibleCon").prop("checked", false);
      $(".LibretaCon").prop("checked", false);
      $(".CanalesCon").prop("checked", false);
      $(".TarjetaCon").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".GarantiasCon").prop("checked", false);
      // $(".CuposCon").prop("checked", false);
    }
    if (value == 9) {
      this.GarantiasAcordeon = true;
      $(".saldosDisponibbleCon").prop("checked", false);
      $(".mesAnteriorDisponibleCon").prop("checked", false);
      $(".autorizadosDisponibleCon").prop("checked", false);
      $(".fechasDisponibleCon").prop("checked", false);
      $(".LibretaCon").prop("checked", false);
      $(".CanalesCon").prop("checked", false);
      $(".TarjetaCon").prop("checked", false);
      $(".Historial").prop("checked", false);
      // $(".GarantiasCon").prop("checked", false);
      $(".CuposCon").prop("checked", false);
    }
    if (value == 10) {
      this.HistorialAcordeon = true;
      $(".saldosDisponibbleCon").prop("checked", false);
      $(".mesAnteriorDisponibleCon").prop("checked", false);
      $(".autorizadosDisponibleCon").prop("checked", false);
      $(".fechasDisponibleCon").prop("checked", false);
      $(".LibretaCon").prop("checked", false);
      $(".CanalesCon").prop("checked", false);
      $(".TarjetaCon").prop("checked", false);
      // $(".Historial").prop("checked", false);
      $(".GarantiasCon").prop("checked", false);
      $(".CuposCon").prop("checked", false);
    }
  }

  cerrarTodo() {
    if (this.desactiveExequial) {
      $(".con1").prop("checked", false);
    }
    if (this.desactiveExequialOlivos) {
      $(".con2").prop("checked", false);
    }
    if (this.desactiveConvenios) {
      $(".con3").prop("checked", false);
    }
  }

  cerrarSegExequiales(value : number) {
    if (value == 1) {
      //Closed first tab segur exequiales
      this.Acordeon1 = true;
      // $(".datosExequiales").prop("checked", false);
      $(".negociacionNegociacion").prop("checked", false);
      $(".saldosExequiales").prop("checked", false);
      $(".beneficiarioExequiales").prop("checked", false);
      $(".InscritosExequiales").prop("checked", false);
      $(".InscritosConvenio").prop("checked", false);
      $(".renovacionesExequiales").prop("checked", false);
      $(".movimientosExequiales").prop("checked", false);
      $(".fechasExequiales").prop("checked", false);
      //end exequiuales
    } else if (value == 2) {
      this.Acordeon2 = true;
      $(".datosExequiales").prop("checked", false);
      // $(".negociacionNegociacion").prop("checked", false);
      $(".InscritosConvenio").prop("checked", false);
      $(".saldosExequiales").prop("checked", false);
      $(".beneficiarioExequiales").prop("checked", false);
      $(".InscritosExequiales").prop("checked", false);
      $(".renovacionesExequiales").prop("checked", false);
      $(".movimientosExequiales").prop("checked", false);
      $(".fechasExequiales").prop("checked", false);
    } else if (value == 3) {
      this.Acordeon3 = true;
      $(".datosExequiales").prop("checked", false);
      $(".negociacionNegociacion").prop("checked", false);
      $(".InscritosConvenio").prop("checked", false);
      // $(".saldosExequiales").prop("checked", false);
      $(".beneficiarioExequiales").prop("checked", false);
      $(".InscritosExequiales").prop("checked", false);
      $(".renovacionesExequiales").prop("checked", false);
      $(".movimientosExequiales").prop("checked", false);
      $(".fechasExequiales").prop("checked", false);
    } else if (value == 4) {
      this.Acordeon4 = true;
      $(".datosExequiales").prop("checked", false);
      $(".negociacionNegociacion").prop("checked", false);
      $(".saldosExequiales").prop("checked", false);
      // $(".InscritosExequiales").prop("checked", false);
      $(".beneficiarioExequiales").prop("checked", false);
      $(".renovacionesExequiales").prop("checked", false);
      $(".movimientosExequiales").prop("checked", false);
      $(".fechasExequiales").prop("checked", false);
    } else if (value == 5) {
      this.Acordeon5 = true;
      $(".InscritosConvenio").prop("checked", false);
      $(".datosExequiales").prop("checked", false);
      $(".negociacionNegociacion").prop("checked", false);
      $(".saldosExequiales").prop("checked", false);
      $(".InscritosExequiales").prop("checked", false);
      // $(".beneficiarioExequiales").prop("checked", false);
      $(".renovacionesExequiales").prop("checked", false);
      $(".movimientosExequiales").prop("checked", false);
      $(".fechasExequiales").prop("checked", false);
    } else if (value == 6) {
      this.Acordeon6 = true;
      $(".InscritosConvenio").prop("checked", false);
      $(".datosExequiales").prop("checked", false);
      $(".negociacionNegociacion").prop("checked", false);
      $(".saldosExequiales").prop("checked", false);
      $(".beneficiarioExequiales").prop("checked", false);
      $(".InscritosExequiales").prop("checked", false);
      // $(".renovacionesExequiales").prop("checked", false);
      $(".movimientosExequiales").prop("checked", false);
      $(".fechasExequiales").prop("checked", false);
    } else if (value == 7) {
      this.Acordeon7 = true;
      $(".InscritosConvenio").prop("checked", false);
      $(".datosExequiales").prop("checked", false);
      $(".negociacionNegociacion").prop("checked", false);
      $(".saldosExequiales").prop("checked", false);
      $(".beneficiarioExequiales").prop("checked", false);
      $(".InscritosExequiales").prop("checked", false);
      $(".renovacionesExequiales").prop("checked", false);
      // $(".movimientosExequiales").prop("checked", false);
      $(".fechasExequiales").prop("checked", false);
    } else {
      this.Acordeon8 = true;
      $(".InscritosConvenio").prop("checked", false);
      $(".datosExequiales").prop("checked", false);
      $(".negociacionNegociacion").prop("checked", false);
      $(".saldosExequiales").prop("checked", false);
      $(".beneficiarioExequiales").prop("checked", false);
      $(".InscritosExequiales").prop("checked", false);
      $(".renovacionesExequiales").prop("checked", false);
      $(".movimientosExequiales").prop("checked", false);
      // $(".fechasExequiales").prop("checked", false);
    }
  }

  cerrarAcordeonSeguroExequial() {
    if (this.Acordeon2) {
      $(".negociacionNegociacion").prop("checked", false);
    }
    if (this.Acordeon3) {
      $(".saldosExequiales").prop("checked", false);
    }
    if (this.Acordeon4) {
      $(".InscritosExequiales").prop("checked", false);
      $(".InscritosConvenio").prop("checked", false);
      $(".beneficiarioExequiales").prop("checked", false);
    }
    if (this.Acordeon5) {
      $(".InscritosExequiales").prop("checked", false);
    }
    if (this.Acordeon6) {
      $(".renovacionesExequiales").prop("checked", false);
    }
    if (this.Acordeon7) {
      $(".movimientosExequiales").prop("checked", false);
    }
    if (this.Acordeon8) {
      $(".fechasExequiales").prop("checked", false);
    }
  }

  getConvenios(tercero : number) {
    this.terceroId = tercero;
    this.ConvenioActivo.length = 0;
    this.ServicioExequialData.length = 0;
    this.ServicioExequialCancelado.length = 0;
    this.ConvenioCancelado.length = 0;

    this.MiListaProductosService.GetDataSeguros(tercero).subscribe(
      (result) => {
        if (result.ServicioExequial.length == 0) {
          this.ServicioExequialData = [];
          this.ServicioExequialCancelado = [];
          $("#noregistraExequial").show();
          $("#noregistraExequial_").hide();
        } else {
          var activContraAct = 0;
          var CancelContraAct = 0;
          for (var i = 0; i < result.ServicioExequial.length; i++) {
            if (
              result.ServicioExequial[i].dtmCancela != "" &&
              result.ServicioExequial[i].intEstado != 10
            ) {
              $("#noregistraExequial").hide();
              $("#noregistraExequial_").hide();
              this.ServicioExequialCancelado[CancelContraAct] = result.ServicioExequial[i];
              CancelContraAct++;
            } else if (
              result.ServicioExequial[i].dtmCancela == null ||
              result.ServicioExequial[i].dtmCancela == ""
            ) {
              $("#noregistraExequial").hide();
              $("#noregistraExequial_").hide();
              this.ServicioExequialData[activContraAct] = result.ServicioExequial[i];
              activContraAct++;
            }

            if (this.ValidadaActivo == true && activContraAct == 0) {
              this.ServicioExequialData.length = 0;
              $("#noregistraExequial_").show();
              $("#noregistraExequial").hide();
            }
            if (this.ValidadaActivo == false && CancelContraAct == 0) {
              this.ServicioExequialCancelado.length = 0;
              $("#noregistraExequial_").show();
              $("#noregistraExequial").hide();
            }
          }

        }

        if (result.Convenio.length == 0) {
          this.ConvenioActivo = [];
          this.ConvenioCancelado = [];
          $("#noregistraConvenio").show();
          $("#noregistraConvenio_").hide();
        } else {
          var activContraAct = 0;
          var CancelContraAct = 0;
          for (var i = 0; i < result.Convenio.length; i++) {
            if (
              result.Convenio[i].dtmCancela != "" &&
              result.Convenio[i].intEstado != 10
            ) {
              $("#noregistraConvenio").hide();
              $("#noregistraConvenio_").hide();
              this.ConvenioCancelado[CancelContraAct] = result.Convenio[i];
              CancelContraAct++;
            } else if (
              result.Convenio[i].dtmCancela == null ||
              result.Convenio[i].dtmCancela == ""
            ) {
              $("#noregistraConvenio").hide();
              $("#noregistraConvenio_").hide();
              this.ConvenioActivo[activContraAct] = result.Convenio[i];
              activContraAct++;
            }
            if (this.ValidadaActivo == true && activContraAct == 0) {
              this.ConvenioActivo.length = 0;
              $("#noregistraConvenio_").show();
              $("#noregistraConvenio").hide();
            }
            if (this.ValidadaActivo == false && CancelContraAct == 0) {
              this.ConvenioCancelado.length = 0;
              $("#noregistraConvenio_").show();
              $("#noregistraConvenio").hide();
            }
          }
        }
        (error : any) => {
          console.log(error);
        }
      });


  }

  setLogMisProductos(LogMisProductos_: LogMisProductos) {
    this.MiListaProductosService.setLogMisProductos(LogMisProductos_).subscribe(
      result => {
        //console.log("register",result);
      },
      error => {
        console.log(error);
      }
    )
  }


  cambiarColorInscritos(fil : number) {
    $(".filInscrit_" + this.ColorRenovacion).css("background", "#FFFFFF");
    $(".filInscrit_" + fil).css("background", "#e5e5e5");
    this.ColorRenovacion = fil;
  }

  cambiarColorRenovaSeg(fil : number) {
    $(".filRenovt_" + this.ColorBeneficiario).css("background", "#FFFFFF");
    $(".filRenovt_" + fil).css("background", "#e5e5e5");
    this.ColorBeneficiario = fil;
  }

  cambiarColorMvto(fil : number) {
    $(".filMvtosC_" + this.ColorMovimientos).css("background", "#FFFFFF");
    $(".filMvtosC_" + fil).css("background", "#e5e5e5");
    this.ColorMovimientos = fil;
  }

  DetalleSeguroExequial(data : any) {
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var idOficina = cuentaArray[0];
    var idProducto = cuentaArray[1];
    var consecutivo = cuentaArray[2];
    this.InfoSeguroExequial.DescripcionProducto = data.NameProducto;
    this.InfoSeguroExequial.strCuenta = data.strCuenta;
    this.InfoSeguroExequial.DescribeEstado = data.NameEstado;
    this.InfoSeguroExequial.DescripcionProducto = data.NameProducto;
    this.InfoSeguroExequial.NombreAsesor = data.Asesor;
    this.InfoSeguroExequial.DescribeOficina = data.NameOficina;


    this.MiListaProductosService.GetDataSeguroVida(
      idOficina,
      idProducto,
      consecutivo,
      this.terceroId
    ).subscribe(
      (result) => {
        console.log(result);
        this.InfoSeguroExequial.validaJuridico = result.validaJuridico;
        this.InfoSeguroExequial.edad = result.edad;
        this.InfoSeguroExequial.FechaConstitucion = result.edad;
        this.InfoSeguroExequial.lngCertificado = result.lngCertificado;
        this.InfoSeguroExequial.lngPoliza = result.lngPoliza;
        this.InfoSeguroExequial.curCuota = result.curCuota;
        this.InfoSeguroExequial.intPlazo = result.intPlazo;
        this.InfoSeguroExequial.intMeses = result.intMeses;
        this.InfoSeguroExequial.dtmProximoPago = result.dtmProximoPago;
        this.InfoSeguroExequial.curProyectado = result.curProyectado;
        this.InfoSeguroExequial.curCargo = result.curCargo;
        this.InfoSeguroExequial.curSeguro = result.curSeguro;
        this.InfoSeguroExequial.curExento = result.curExento;
        this.InfoSeguroExequial.CapitalMora = result.CapitalMora;
        this.InfoSeguroExequial.curCuotaProyectada = result.curCuotaProyectada;
        if (
          result.curEfectivo == null ||
          result.curEfectivo == undefined ||
          result.curEfectivo == ""
        ) {
          result.curEfectivo = 0;
        }
        if (
          result.curSaldoAnterior == null ||
          result.curSaldoAnterior == undefined ||
          result.curSaldoAnterior == ""
        ) {
          result.curSaldoAnterior = 0;
        }
        this.InfoSeguroExequial.curPeriodo = result.curEfectivo;
        this.InfoSeguroExequial.curEfectivo = (
          result.curEfectivo + result.curSaldoAnterior
        ).toString();
        this.InfoSeguroExequial.intCuotasPagas = result.intCuotasPagas;
        this.InfoSeguroExequial.intCuotasMora = result.intCuotasMora;
        this.InfoSeguroExequial.CuotasPendientes = result.CuotasPendientes;
        this.InfoSeguroExequial.dtmCancela = result.dtmCancela;
        this.InfoSeguroExequial.dtmEnvioCarta = result.dtmEnvioCarta;
        this.InfoSeguroExequial.dtmMatricula = result.dtmMatricula;
        this.InfoSeguroExequial.dtmMora = result.dtmMora;
        this.InfoSeguroExequial.dtmNacimiento = result.dtmNacimiento;
        this.InfoSeguroExequial.dtmPagoMora = result.dtmPagoMora;
        this.InfoSeguroExequial.dtmUltimaTrans = result.dtmUltimaTrans;
        this.InfoSeguroExequial.dtmUltimoCargo = result.dtmUltimoCargo;
        this.InfoSeguroExequial.dtmVencimiento = result.dtmVencimiento;
        this.InfoSeguroExequial.curSaldoAnterior = result.curSaldoAnterior;
        this.InfoSeguroExequial.dtmPlazo = result.dtmPlazo;
        this.InfoSeguroExequial.curCanje = result.curCanje;
        this.InfoSeguroExequial.TarifaExequial = result.TarifaExequial;
        this.InfoSeguroExequial.CompaniaAseguradora =
          result.CompaniaAseguradora;
        this.InfoSeguroExequial.Numero = result.Numero;
        if (
          result.blnTarifaUnica == false &&
          result.blnPolizaColectiva == true &&
          result.curAnual > 0
        ) {
          this.InfoSeguroExequial.valorTotal =
            result.curSeguro * result.Numero * result.intPlazo;
        } else {
          this.InfoSeguroExequial.valorTotal =
            result.curCuota * result.intMeses;
        }

        var countBenef = 0;
        this.BeneficiariosSeguroExequial.length = 0;
        if (result.beneficiariosDta.length > 0) {
          for (var j = 0; j < result.beneficiariosDta.length; j++) {
            this.BeneficiariosSeguroExequial[countBenef] =
              result.beneficiariosDta[j];
            countBenef++;
          }
          $("#NotHaveBenefSeguroExequial").hide();
          $("#haveBenefSeguroExequial").show();
        } else {
          $("#NotHaveBenefSeguroExequial").show();
          $("#haveBenefSeguroExequial").hide();
        }

        var countInscritos = 0;
        this.validaMascota = result.validaMascota;
        this.InscritosSeguroExequial.length = 0;
        if (result.Inscritos.length > 0) {
          for (var x = 0; x < result.Inscritos.length; x++) {
            this.InscritosSeguroExequial[countInscritos] = result.Inscritos[x];
            countInscritos++;
          }
          $("#NotHaveExequialSegInsc").hide();
          $("#haveExequialInsc").show();
        } else {
          $("#NotHaveExequialSegInsc").show();
          $("#haveExequialInsc").hide();
        }

        var countRenovaciones = 0;
        this.RenovacionSeguroExequial.length = 0;
        if (result.RenovacionSeguro.length > 0) {
          for (var j = 0; j < result.RenovacionSeguro.length; j++) {
            this.RenovacionSeguroExequial[countRenovaciones] =
              result.RenovacionSeguro[j];
            countRenovaciones++;
          }
          $("#NotHaveRenovaSegExequial").hide();
          $("#HaveRenovaSegExequial").show();
        } else {
          $("#NotHaveRenovaSegExequial").show();
          $("#HaveRenovaSegExequial").hide();
        }

        var countHistorial = 0;
        this.HistoricoSeguroExequial.length = 0;
        if (result.hitoricoList.length > 0) {
          for (var i = 0; i < result.hitoricoList.length; i++) {
            this.HistoricoSeguroExequial[countHistorial] =
              result.hitoricoList[i];
            countHistorial++;
          }
          $("#HaveMovimientosExequiales").show();
          $("#NotHaveMovimientosExequiales").hide();
        } else {
          $("#HaveMovimientosExequiales").hide();
          $("#NotHaveMovimientosExequiales").show();
        }

        var FormaPago = result.intFormaPago;
        var periodoPago = result.intPeriodoPago;

        if (FormaPago == 0) {
          this.InfoSeguroExequial.FormaPago = "Caja";
        } else if (FormaPago == 1) {
          this.InfoSeguroExequial.FormaPago = "Débito";
        } else if (FormaPago == 2) {
          this.InfoSeguroExequial.FormaPago = "Nómina";
        } else {
          this.InfoSeguroExequial.FormaPago = "";
        }

        if (periodoPago == 30 || periodoPago == 31) {
          this.InfoSeguroExequial.Periodo = "Mes";
        }
      },
      (error) => {
        console.log(error);
      }
    );

    //#region Guarda log
    let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
    var LogMisProductosData = new LogMisProductos();
    var nuevoItem = new DatosProductos();
    LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
    LogMisProductosData.IdModulo = 69;
    LogMisProductosData.IdOperacion = 80;
    LogMisProductosData.IdOpcion = 1; // Detalle
    LogMisProductosData.IdTercero = this.terceroId;
    LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
    LogMisProductosData.IdCuenta = data.lngIdCuenta;
    nuevoItem.NumeroCuenta = data.strCuenta;
    nuevoItem.FechaInicial = "";
    nuevoItem.FechaFinal = "";
    LogMisProductosData.DatosProductos = nuevoItem;
    this.setLogMisProductos(LogMisProductosData);
    // #endregion

  }

  DetalleConvenio(data : any) {
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var idOficina = cuentaArray[0];
    var idProducto = cuentaArray[1];
    var consecutivo = cuentaArray[2];
    // this.infoSeguroVidaDta.

    this.InfoConvenio.DescripcionProducto = data.NameProducto;
    this.InfoConvenio.strCuenta = data.strCuenta;
    this.InfoConvenio.DescribeEstado = data.NameEstado;
    this.InfoConvenio.DescripcionProducto = data.NameProducto;
    this.InfoConvenio.NombreAsesor = data.Asesor;
    this.InfoConvenio.DescribeOficina = data.NameOficina;


      //#region Guarda log
      let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
      var LogMisProductosData = new LogMisProductos();
      var nuevoItem = new DatosProductos();
      LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
      LogMisProductosData.IdModulo = 69;
      LogMisProductosData.IdOperacion = 80;
      LogMisProductosData.IdOpcion = 1; // Detalle 
      LogMisProductosData.IdTercero = this.terceroId;
      LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
      LogMisProductosData.IdCuenta = data.lngIdCuenta;
      nuevoItem.NumeroCuenta = data.strCuenta;
      nuevoItem.FechaInicial = "";
      nuevoItem.FechaFinal = "";
      LogMisProductosData.DatosProductos = nuevoItem;
      this.setLogMisProductos(LogMisProductosData);
      // #endregion

    this.MiListaProductosService.GetDataSeguroVida(
      idOficina,
      idProducto,
      consecutivo,
      this.terceroId
    ).subscribe(
      (result) => {
        console.log(result);
        this.InfoConvenio.validaJuridico = result.validaJuridico;
        this.InfoConvenio.edad = result.edad;
        this.InfoConvenio.FechaConstitucion = result.edad;
        this.InfoConvenio.lngCertificado = result.lngCertificado;
        this.InfoConvenio.lngPoliza = result.lngPoliza;
        this.InfoConvenio.curCuota = result.curCuota;
        this.InfoConvenio.intPlazo = result.intPlazo;
        this.InfoConvenio.dtmProximoPago = result.dtmProximoPago;
        this.InfoConvenio.curProyectado = result.curProyectado;
        this.InfoConvenio.curCargo = result.curCargo;
        this.InfoConvenio.curSeguro = result.curSeguro;
        this.InfoConvenio.curExento = result.curExento;
        this.InfoConvenio.CapitalMora = result.CapitalMora;
        this.InfoConvenio.curCuotaProyectada = result.curCuotaProyectada;
        if (
          result.curEfectivo == null ||
          result.curEfectivo == undefined ||
          result.curEfectivo == ""
        ) {
          result.curEfectivo = 0;
        }
        if (
          result.curSaldoAnterior == null ||
          result.curSaldoAnterior == undefined ||
          result.curSaldoAnterior == ""
        ) {
          result.curSaldoAnterior = 0;
        }
        this.InfoConvenio.curPeriodo = result.curEfectivo;
        this.InfoConvenio.curEfectivo = (
          result.curEfectivo + result.curSaldoAnterior
        ).toString();
        this.InfoConvenio.intCuotasPagas = result.intCuotasPagas;
        this.InfoConvenio.intCuotasMora = result.intCuotasMora;
        this.InfoConvenio.CuotasPendientes = result.CuotasPendientes;
        this.InfoConvenio.dtmCancela = result.dtmCancela;
        this.InfoConvenio.dtmEnvioCarta = result.dtmEnvioCarta;
        this.InfoConvenio.dtmMatricula = result.dtmMatricula;
        this.InfoConvenio.dtmMora = result.dtmMora;
        this.InfoConvenio.dtmNacimiento = result.dtmNacimiento;
        this.InfoConvenio.dtmPagoMora = result.dtmPagoMora;
        this.InfoConvenio.dtmUltimaTrans = result.dtmUltimaTrans;
        this.InfoConvenio.dtmUltimoCargo = result.dtmUltimoCargo;
        this.InfoConvenio.dtmVencimiento = result.dtmVencimiento;
        this.InfoConvenio.curSaldoAnterior = result.curSaldoAnterior;
        this.InfoConvenio.dtmPlazo = result.dtmPlazo;
        this.InfoConvenio.curCanje = result.curCanje;
        this.InfoConvenio.TarifaExequial = result.TarifaExequial;
        this.InfoConvenio.CompaniaAseguradora = result.CompaniaAseguradora;
        this.InfoConvenio.Numero = result.Numero;
        this.InfoConvenio.valorTotal =
          result.curSeguro * result.Numero * result.intPlazo;
        var countBenef = 0;
        var countInscritos = 0;
        this.InscritosConvenios.length = 0;
        if (result.Inscritos.length > 0) {
          for (var x = 0; x < result.Inscritos.length; x++) {
            this.InscritosConvenios[countInscritos] = result.Inscritos[x];
            countInscritos++;
          }
          $("#NotHaveInscritosConvenio").hide();
          $("#haveInscritosConvenio").show();
        } else {
          $("#NotHaveInscritosConvenio").show();
          $("#haveInscritosConvenio").hide();
        }

        var countRenovaciones = 0;
        this.RenovacionConvenios.length = 0;
        if (result.RenovacionSeguro.length > 0) {
          for (var j = 0; j < result.RenovacionSeguro.length; j++) {
            this.RenovacionConvenios[countRenovaciones] =
              result.RenovacionSeguro[j];
            countRenovaciones++;
          }
          $("#NotHaveRenovaConvenio").hide();
          $("#HaveRenovaConvenio").show();
        } else {
          $("#NotHaveRenovaConvenio").show();
          $("#HaveRenovaConvenio").hide();
        }

        var countHistorial = 0;
        this.HistoricoConvenios.length = 0;
        if (result.hitoricoList.length > 0) {
          for (var i = 0; i < result.hitoricoList.length; i++) {
            this.HistoricoConvenios[countHistorial] = result.hitoricoList[i];
            countHistorial++;
          }
          $("#HaveMovimientosConvenios").show();
          $("#NotHaveMovimientosConvenios").hide();
        } else {
          $("#HaveMovimientosConvenios").hide();
          $("#NotHaveMovimientosConvenios").show();
        }

        var FormaPago = result.intFormaPago;
        var periodoPago = result.intPeriodoPago;

        if (FormaPago == 0) {
          this.InfoConvenio.FormaPago = "Caja";
        } else if (FormaPago == 1) {
          this.InfoConvenio.FormaPago = "Débito";
        } else if (FormaPago == 2) {
          this.InfoConvenio.FormaPago = "Nómina";
        } else {
          this.InfoConvenio.FormaPago = "";
        }

        if (periodoPago == 30 || periodoPago == 31) {
          this.InfoConvenio.Periodo = "Mes";
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  opcionSelected(valueSlect : any) {
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.ExtractosConvenio.length = 0;
    this.MovimientosConvenio.length = 0;


    this.validaAnoInicial = false;
    this.validaAnoFinal = false;
    this.validaMesInicial = false;
    this.validaMesFinal = false;

    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.FinVacida = false;
    this.InicioVacida = false;
    this.FechaMenorMayor = false;

    if (Number(valueSlect) == 2) {
      this.SeleccionExt = 2;
      this.validaForm = true;
      this.valueSlect = '2';
      this.SelectErroneo = false;

      setTimeout(() => {
        this.seleccioneTodo();
      }, 500);
      $(".SelectedExtracto_Convenio").prop('selectedIndex', 2);
    } else if (valueSlect.toString() == '-') {
      this.SelectErroneo = true;

      // no hace nada
    } else {
      this.validaForm = false;
      this.SeleccionExt = 1;
      this.valueSlect = '1';
      this.SelectErroneo = false;
      setTimeout(() => {
        $(".SelectedMovimiento_Convenio").prop('selectedIndex', 1);
        $("#fechaInitSeg").val(this.fechaAperturaCuenta);
        $("#fechaendSeg").val(this.fechaAperturaActualDisabled);
      }, 400);
    }

  }

  SendEmailSeguros() {
    this.loading = true;
    this.ValidaPlantillaMail();
    setTimeout(() => {
      this.SendMailSeguros();
    }, 5000);
  }

  SendEmailSegurosExe() {
    this.loading = true;
    this.ValidaPlantillaMail();
    setTimeout(() => {
      this.SendMailSegurosEx();
    }, 5000);
  }

  SendMailSeguros() {
    if (this.validaMail == true) {
      this.loading = true;

      var idProducto = Number($("#ProductoID").val());

      if (idProducto == 106) {
        this.MiListaProductosService.sendMailProductos(this.ExtractoConveniosForm.value).subscribe(
          result => {
            this.loading = false;
            this.Response(result);

            var Tercero = Number($("#TerceroPrincipal").val());
            //#region Guarda log
            let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 80;
            LogMisProductosData.IdOpcion = 12; // Envio correo 
            LogMisProductosData.IdTercero = Tercero;
            LogMisProductosData.IdCuenta = this.idCuenta;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            nuevoItem.FechaInicial = "";
            nuevoItem.FechaFinal = "";
            LogMisProductosData.DatosProductos = nuevoItem;
            this.setLogMisProductos(LogMisProductosData);
          // #endregion
          },
          error => {
            this.loading = false;
            swal.fire({
              title: "Error",
              text: "",
              html: "Ha ocurrido un error enviando el email.",
              icon: "error",
              showCancelButton: false,
              confirmButtonColor: "rgb(13,165,80)",
              cancelButtonColor: "rgb(160,0,87)",
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
          }
        )
      } else {
        this.MiListaProductosService.sendMailProductos(this.ExtractoConveniosForm.value).subscribe(
          result => {
            this.loading = false;
            this.Response(result);

            var Tercero = Number($("#TerceroPrincipal").val());
            //#region Guarda log
            let datas = localStorage.getItem("Data");
            var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 80;
            LogMisProductosData.IdOpcion = 12; // Envio correo 
            LogMisProductosData.IdTercero = Tercero;
            LogMisProductosData.IdCuenta = this.idCuenta;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            nuevoItem.FechaInicial = "";
            nuevoItem.FechaFinal = "";
            LogMisProductosData.DatosProductos = nuevoItem;
            this.setLogMisProductos(LogMisProductosData);
          // #endregion
          },
          error => {
            this.loading = false;
            swal.fire({
              title: "Error",
              text: "",
              html: "Ha ocurrido un error enviando el email.",
              icon: "error",
              showCancelButton: false,
              confirmButtonColor: "rgb(13,165,80)",
              cancelButtonColor: "rgb(160,0,87)",
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
          }
        )
      }
    } else {
      this.loading = false;
      swal.fire({
        title: "Info",
        text: "",
        html: "Por favor comunicarse con el administrador para gestionar la plantilla del email.",
        icon: "info",
        showCancelButton: false,
        confirmButtonColor: "rgb(13,165,80)",
        cancelButtonColor: "rgb(160,0,87)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }

  }

  SendMailSegurosEx() {
    if (this.validaMail == true) {
      this.loading = true;
      this.MiListaProductosService.sendMailProductos(this.ExtractoSeguroForm.value).subscribe(
        result => {
          this.loading = false;
          this.Response(result);

          var Tercero = Number($("#TerceroPrincipal").val());
          //#region Guarda log
          let datas = localStorage.getItem("Data");
          var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
          var LogMisProductosData = new LogMisProductos();
          var nuevoItem = new DatosProductos();
          LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
          LogMisProductosData.IdModulo = 69;
          LogMisProductosData.IdOperacion = 80;
          LogMisProductosData.IdOpcion = 12; // Envio correo 
          LogMisProductosData.IdTercero = Tercero;
          LogMisProductosData.IdCuenta = this.idCuenta;
          LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
          nuevoItem.FechaInicial = "";
          nuevoItem.FechaFinal = "";
          LogMisProductosData.DatosProductos = nuevoItem;
          this.setLogMisProductos(LogMisProductosData);
          // #endregion
        },
        error => {
          this.loading = false;
          swal.fire({
            title: "Error",
            text: "",
            html: "Ha ocurrido un error enviando el email.",
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "rgb(13,165,80)",
            cancelButtonColor: "rgb(160,0,87)",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        }
      )
    } else {
      this.loading = false;
      swal.fire({
        title: "Info",
        text: "",
        html: "Por favor comunicarse con el administrador para gestionar la plantilla del email.",
        icon: "info",
        showCancelButton: false,
        confirmButtonColor: "rgb(13,165,80)",
        cancelButtonColor: "rgb(160,0,87)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }

  }

  Response(value : any) {

    if (value == "0" ||  value == 0) {
      swal.fire({
        title: "Exitoso",
        text: "",
        html: "El email se envió correctamente.",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "rgb(13,165,80)",
        cancelButtonColor: "rgb(160,0,87)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }

    if (value == "1" || value == 1) {
      swal.fire({
        title: "Advertencia",
        text: "",
        html: "El asociado no tiene email.",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "rgb(13,165,80)",
        cancelButtonColor: "rgb(160,0,87)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }

    if (value == "3" || value == 3) {
      swal.fire({
        title: "Error",
        text: "",
        html: "Ha ocurrido un error enviando el email.",
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "rgb(13,165,80)",
        cancelButtonColor: "rgb(160,0,87)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }

  }

  ValidaPlantillaMail() {
    this.validaMail = false;
    this.MiListaProductosService.getImagenesGestionMail().subscribe(
      (result : any[]) => {
        result.forEach((element) => {
          var TipoMail = element.IdTipoMail;
          if (TipoMail == 3) {
              this.validaMail = true;
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  seleccioneTodo() {
    $(".yearInit_Convenio").prop('selectedIndex', 0);
    $(".yearEnd_Convenio").prop('selectedIndex', 0);
    $(".MesInit_Convenio").prop('selectedIndex', 0);
    $(".MesEnd_Convenio").prop('selectedIndex', 0);
  }

  ResetModal() {
    this.validaForm = false;
    this.validaMesFinal = false;
    this.validaMesInicial = false;
    this.validaAnoFinal = false;
    this.validaAnoFinal = false;
    this.seleccioneTodo();
    this.ExtractoConveniosForm.get("MovExtSelector")?.setValue("-");
    this.ExtractoSeguroForm.get("MovExtSelector")?.setValue("-");
    this.ExtractosConvenio.length = 0;
    this.MovimientosConvenio.length = 0;
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.FechaMenorMayor = false;
    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.InicioVacida = false;
    this.FinVacida = false;
  }

  opcionSelectedFechas(value : number) {
    var FechaFin = $("#fechaendSeg").val();
    var FechaInicio = $("#fechaInitSeg").val();

    if (value == 1) {
      var numCaracteres = this.valueFechaInicial.length;
      if (numCaracteres == 10) {
        if (
          this.valueFechaInicial >= this.fechaAperturaCuenta &&
          this.valueFechaInicial <= this.fechaAperturaActualDisabled
        ) {
          if ( FechaFin != null && this.valueFechaInicial > FechaFin) {
            this.FechaMenorMayor = false;
            this.inicioNoValida = false;
            this.FechaMayorAmenor = true;
            this.Extractos.length = 0;
            this.Movimientos.length = 0;
            return 1;
          } else {
            this.inicioNoValida = false;
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = false;
          }
        } else if ( FechaInicio != null &&
          FechaInicio < this.fechaAperturaCuenta || FechaInicio != null &&
          FechaInicio > this.fechaAperturaActualDisabled || FechaInicio != null && FechaFin != null &&
          FechaInicio > FechaFin
        ) {
          this.inicioNoValida = true;
          this.FechaMenorMayor = false;
          this.FechaMayorAmenor = false;
          this.Extractos.length = 0;
          this.Movimientos.length = 0;
        } else {
          this.inicioNoValida = false;
          this.finNoValida = false;
          this.FechaMayorAmenor = false;
          this.FechaMenorMayor = false;
        }
      }
    } else if (value == 2) {
      var numCaracteresFin = this.valueFechaFinal.length;

      if (numCaracteresFin == 10) {
        if (
          this.valueFechaFinal <= this.fechaAperturaActualDisabled &&
          this.valueFechaFinal >= this.fechaAperturaCuenta
        ) {
          if (FechaInicio != null && this.valueFechaFinal < FechaInicio) {
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = true;
            this.finNoValida = false;
            this.Extractos.length = 0;
            this.Movimientos.length = 0;
            return 1;
          } else {
            this.finNoValida = false;
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = false;
          }
        } else if (FechaFin != null &&
          FechaFin > this.fechaAperturaActualDisabled || FechaFin != null &&
          FechaFin < this.fechaAperturaCuenta || FechaFin != null && FechaInicio != null &&
          FechaFin < FechaInicio
        ) {
          this.finNoValida = true;
          this.FechaMenorMayor = false;
          this.FechaMayorAmenor = false;
          this.Extractos.length = 0;
          this.Movimientos.length = 0;
        } else {
          this.finNoValida = false;
          this.inicioNoValida = false;
          this.FechaMayorAmenor = false;
          this.FechaMenorMayor = false;
        }
      }
    }
    return null;
  }

  detalleExtracto(data : any) {
    this.HabilitaMensate = 0;
    this.ExtractoSeguroForm.get("MovExtSelector")?.setValue("-");

    this.ExtractoSeguroForm.get("IdTercero")?.setValue(this.terceroId);
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var consecutivo = cuentaArray[2];
    var intProducto = cuentaArray[1];
    var intOficina = cuentaArray[0];
    this.idCuenta = data.lngIdCuenta;
    this.NumeroCuenta = data.strCuenta;
    var consecutivoSinCeros = Number(consecutivo);
    this.ExtractoSeguroForm.get("consecutivo")?.setValue(consecutivoSinCeros);
    this.ExtractoSeguroForm.get("NumeroCuenta")?.setValue(cuenta);
    this.ExtractoSeguroForm.get("intProducto")?.setValue(intProducto);
    this.ExtractoSeguroForm.get("intOficina")?.setValue(intOficina);
    this.ExtractoSeguroForm.get("NombreProducto")?.setValue(data.NameProducto);
    this.ExtractoSeguroForm.get("TipoProducto")?.setValue("Seguro");
    this.consecutivo = consecutivo;
    var consecutivo = cuentaArray[2];

    this.fechaAperturaCuenta = moment(new Date(data.dtmMatricula)).format('YYYY-MM-DD');
    this.fechaAperturaActualDisabled = moment(new Date()).format('YYYY-MM-DD');
    $("#fechaInitSeg").val(this.fechaAperturaCuenta);
    $("#fechaendSeg").val(this.fechaAperturaActualDisabled);

    this.ConsultaYears();

  }
  MesSelected(mes : string) {
    var AñoFinal = Number($(".yearEnd_Convenio").val());
    var añoInicial = Number($(".yearInit_Convenio").val());
    var mesFinal = $(".MesEnd_Convenio").val();
    if ((Number(mes) > Number(mesFinal)) && añoInicial == AñoFinal) {
      this.validaMesInicial = true;
      this.validaMesFinal = false;
      this.Extractos.length = 0;
      this.ExtractosConvenio.length = 0;
      return null;
    }  else {
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }
    return null;
  }

  MesSelectedEnd(mes : string) {
    var mesInicial = $(".MesInit_Convenio").val();
    var AñoFinal = Number($(".yearEnd_Convenio").val());
    var añoInicial = Number($(".yearInit_Convenio").val());
    if ((Number(mes) < Number(mesInicial)) && AñoFinal == añoInicial) {
      this.validaMesFinal = true;
      this.validaMesInicial = false;
      this.Extractos.length = 0;
      this.ExtractosConvenio.length = 0;
      return null;
    } else {
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }
    return null;
  }

  ConsultaYears() {
    this.MiListaProductosService.ConsultarYearMes(this.idCuenta).subscribe(
      result => {
        this.YearsxMes = result;
        this.YearsxMes.forEach(elemt =>
          this.mesInicial = elemt.Mes
        );

        this.YearsxMes.forEach(elemt =>
          this.yearInicial = elemt.Year
        );
      },
      error => {
        console.log(error);
      }
    )

    setTimeout(() => {
      var date = new Date();
      this.yearActual = date.getFullYear();
      this.opcionSelectedYearEnd(this.yearActual);
      this.opcionSelectedYearInit(this.yearActual);
    }, 400);

  }

  ConsultarExtracto() {
    var yearInicial = Number($(".yearInit_Convenio").val());
    var yearFinal = Number($(".yearEnd_Convenio").val());
    var MesInicial = Number($(".MesInit_Convenio").val());
    var MesFinal = Number($(".MesEnd_Convenio").val());
    var selExtracto = $("#SelectedExtracto_Exequiales").val();

    if (selExtracto == '-') {
      this.SelectErroneo = true;
      this.validaAnoInicial = false;
      this.validaAnoFinal = false;
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }else if (yearInicial > yearFinal) {
      this.validaAnoInicial = true;
      this.validaAnoFinal = false;
      this.validaMesInicial = false;
      this.validaMesFinal = false;
      this.SelectErroneo = false;
    } else if (yearFinal < yearInicial) {
      this.validaAnoInicial = false;
      this.validaAnoFinal = true;
      this.validaMesInicial = false;
      this.validaMesFinal = false;
      this.SelectErroneo = false;
    } else if ((MesInicial > MesFinal) && yearInicial == yearFinal) {
      this.validaAnoInicial = false;
      this.validaAnoFinal = false;
      this.validaMesInicial = true;
      this.validaMesFinal = false;
      this.SelectErroneo = false;
    } else if ((MesFinal < MesInicial) && yearInicial == yearFinal) {
      this.validaAnoInicial = false;
      this.validaAnoFinal = false;
      this.validaMesInicial = false;
      this.validaMesFinal = true;
      this.SelectErroneo = false;
    } else {
      this.validaAnoInicial = false;
      this.validaAnoFinal = false;
      this.validaMesInicial = false;
      this.validaMesFinal = false;
      this.SelectErroneo = false;
      let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
      this.ExtractoSeguroForm.get("yearInit")?.setValue(yearInicial);
      this.ExtractoSeguroForm.get("yearEnd")?.setValue(yearFinal);
      this.ExtractoSeguroForm.get("MesInit")?.setValue(MesInicial);
      this.ExtractoSeguroForm.get("MesEnd")?.setValue(MesFinal);
      this.ExtractoSeguroForm.get("Usuario")?.setValue(dataLocalStorage.Usuario);
      this.ExtractoSeguroForm.get("Oficina")?.setValue(dataLocalStorage.Oficina);
      this.loading = true;


      this.MiListaProductosService.GetExtractoSeguros(
        this.ExtractoSeguroForm.value
      ).subscribe(
        (result) => {
          this.loading = false;
          if (result.TipoAlerta == "3") {
            $("#extractosSegExequiales").hide();
            $("#movimientosSegExequial").hide();
            $("#pdf").hide();
            $("#xlsx").hide();
            $(".rangoFechas").show();
            this.loading = false;
            this.HabilitaMensate = 1;
          } else {
            this.HabilitaMensate = 0;
            this.loading = true;
            $("#extractosSegExequiales").show();
            this.MiListaProductosService.GenerarPdfExtractoSeguros(
              this.ExtractoSeguroForm.value
            ).subscribe(
              (result) => {
                this.loading = false;
                this.urlPdf = result.FileStream;
                const pdfinBase64 = result.FileStream._buffer;
                const byteArray = new Uint8Array(
                  atob(pdfinBase64)
                    .split("")
                    .map((char) => char.charCodeAt(0))
                );
                const newBolb = new Blob([byteArray], { type: "application/pdf" });
                const url = window.URL.createObjectURL(newBolb);
                document.getElementById("extractosSegExequiales")?.setAttribute("data", url);
                document.getElementById("extractosSegExequiales")?.setAttribute("name", "movimiento");
              },
              (error) => {
                this.loading = false;
                console.log(error);
              }
            );
            this.Extractos = result.DescribeExtracto;
            this.NumeroDocumento = result.NumeroDocumento;
            $("#pdf").show();
            $("#xlsx").show();
            $(".rangoFechas").show();
            this.Movimientos.length = 0;

          }
        },
        (error) => {
          this.loading = false;
          console.log(error);
        }
      );

      //#region Guarda log
      let datass = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datass == null ? "" : datass));
      var LogMisProductosData = new LogMisProductos();
      var nuevoItem = new DatosProductos();
      LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
      LogMisProductosData.IdModulo = 69;
      LogMisProductosData.IdOperacion = 80;
      LogMisProductosData.IdOpcion = 3; // Estrato
      LogMisProductosData.IdTercero = this.terceroId;
      LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
      LogMisProductosData.IdCuenta = this.idCuenta;
      nuevoItem.NumeroCuenta = this.NumeroCuenta;
      nuevoItem.FechaInicial = yearInicial.toString() +"/"+MesInicial.toString();
      nuevoItem.FechaFinal = yearFinal.toString()+"/"+MesFinal.toString();
      LogMisProductosData.DatosProductos = nuevoItem;
      this.setLogMisProductos(LogMisProductosData);
      // #endregion
    }
  }

  ConsultarExtractoConvenio() {
    var yearInicial = Number($(".yearInit_Convenio").val());
    var yearFinal = Number($(".yearEnd_Convenio").val());
    var MesInicial = Number($(".MesInit_Convenio").val());
    var MesFinal = Number($(".MesEnd_Convenio").val());
    if (yearInicial > yearFinal) {
      this.validaAnoInicial = true;
      this.validaAnoFinal = false;
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    } else if (yearFinal < yearInicial) {
      this.validaAnoInicial = false;
      this.validaAnoFinal = true;
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    } else if ((MesInicial > MesFinal) && yearInicial == yearFinal) {
      this.validaAnoInicial = false;
      this.validaAnoFinal = false;
      this.validaMesInicial = true;
      this.validaMesFinal = false;
    } else if ((MesFinal < MesInicial) && yearInicial == yearFinal) {
      this.validaAnoInicial = false;
      this.validaAnoFinal = false;
      this.validaMesInicial = false;
      this.validaMesFinal = true;
    } else {
      this.loading = true;
      let datasq = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(datasq == null ? "" : datasq));
      this.ExtractoConveniosForm.get("yearInit")?.setValue(yearInicial);
      this.ExtractoConveniosForm.get("yearEnd")?.setValue(yearFinal);
      this.ExtractoConveniosForm.get("MesInit")?.setValue(MesInicial);
      this.ExtractoConveniosForm.get("MesEnd")?.setValue(MesFinal);
      this.ExtractoConveniosForm.get("Usuario")?.setValue(dataLocalStorage.Usuario);
      this.ExtractoConveniosForm.get("Oficina")?.setValue(dataLocalStorage.Oficina);

      var ProductoID = Number($("#ProductoID").val());
      if(ProductoID == 106){

        this.MiListaProductosService.getExtracto(
          this.ExtractoConveniosForm.value
        ).subscribe(
          (result) => {
            this.loading = false;
            if (result.TipoAlerta == "3") {
              $("#pdf").hide();
              $("#xlsx").hide();
              $(".rangoFechas").show();
              $("#movimientosConvenio").hide();
              $("#extractosConvenio").hide();
              this.loading = false;
              this.HabilitaMensate = 1;
            } else {
              $("#extractosConvenio").show();
              this.HabilitaMensate = 0;
              this.loading = true;
              this.MiListaProductosService.GenerarPdfAhorroDisponible(
                this.ExtractoConveniosForm.value
              ).subscribe(
                (result) => {
                  this.loading = false;
                  this.urlPdf = result.FileStream;
                  const pdfinBase64 = result.FileStream._buffer;
                  const byteArray = new Uint8Array(
                    atob(pdfinBase64)
                      .split("")
                      .map((char) => char.charCodeAt(0))
                  );
                  const newBolb = new Blob([byteArray], { type: "application/pdf" });
                  const url = window.URL.createObjectURL(newBolb);
                  document.getElementById("extractosConvenio")?.setAttribute("data", url);
                  document.getElementById("extractosConvenio")?.setAttribute("name", "movimiento");
                },
                (error) => {
                  this.loading = false;
                  console.log(error);
                }
              );

              this.ExtractosConvenio = result.DescribeExtracto;
              this.NumeroDocumento = result.NumeroDocumento;
              $("#pdf").show();
              $("#xlsx").show();
              $(".rangoFechas").show();
              this.MovimientosConvenio.length = 0;

        }
        },
        (error) => {
          this.loading = false;
          console.log(error);
        }
        );

      } else {
        this.MiListaProductosService.GetExtractoSeguros(
          this.ExtractoConveniosForm.value
        ).subscribe(
          (result) => {
            this.loading = false;
            if (result.TipoAlerta == "3") {
              $("#pdf").hide();
              $("#xlsx").hide();
              $(".rangoFechas").show();
              $("#movimientosConvenio").hide();
              $("#extractosConvenio").hide();
              this.loading = false;
              this.HabilitaMensate = 1;
            } else {
              $("#extractosConvenio").show();
              this.HabilitaMensate = 0;
              this.loading = true;

              this.MiListaProductosService.GenerarPdfExtractoSeguros(
                this.ExtractoConveniosForm.value
              ).subscribe(
                (result) => {
                  this.loading = false;
                  const pdfinBase64 = result.FileStream._buffer;
                  const byteArray = new Uint8Array(
                    atob(pdfinBase64)
                      .split("")
                      .map((char) => char.charCodeAt(0))
                  );
                  const newBolb = new Blob([byteArray], { type: "application/pdf" });
                  const url = window.URL.createObjectURL(newBolb);
                  document.getElementById("extractosConvenio")?.setAttribute("data", url);
                  document.getElementById("extractosConvenio")?.setAttribute("name", "movimiento");
                },
                (error) => {
                  this.loading = false;
                  console.log(error);
                }
              );
              this.ExtractosConvenio = result.DescribeExtracto;
              this.urlPdf = "";
              this.NumeroDocumento = result.NumeroDocumento;
              $("#pdf").show();
              $("#xlsx").show();
              $(".rangoFechas").show();
              this.MovimientosConvenio.length = 0;
            }
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );
      }



      //#region Guarda log
      let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
      var LogMisProductosData = new LogMisProductos();
      var nuevoItem = new DatosProductos();
      LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
      LogMisProductosData.IdModulo = 69;
      LogMisProductosData.IdOperacion = 80;
      LogMisProductosData.IdOpcion = 3; // Extratos
      LogMisProductosData.IdTercero = this.terceroId;
      LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
      LogMisProductosData.IdCuenta = this.idCuenta;
      nuevoItem.NumeroCuenta = this.NumeroCuenta;
      nuevoItem.FechaInicial = yearInicial.toString() +"/"+MesInicial.toString();
      nuevoItem.FechaFinal = yearFinal.toString()+"/"+MesFinal.toString();
      LogMisProductosData.DatosProductos = nuevoItem;
      this.setLogMisProductos(LogMisProductosData);
      // #endregion

    }
  }

  opcionSelectedYearEnd(year : string) {
    var date = new Date();
    var yearNow = date.getFullYear();
    var MonthNow = date.getMonth() + 1;
    var MesInicial = 1;
    var MesFinal = 12;
    this.mesxYearEnd.length = 0;
    if (Number(year) == Number(this.yearInicial)) {
      MesInicial = this.mesInicial;
    }
    if (Number(year) == Number(yearNow)) {
      MesFinal = MonthNow - 1;
    }
    for (var index =MesFinal; index >= MesInicial; index--){
      if (index == 1) {
        var nuevoItem = new MesxYear();
        nuevoItem.idMes = index;
        nuevoItem.DescripcionMes = "Enero";
        this.mesxYearEnd.push(nuevoItem);
      } else if (index == 2) {
        var nuevoItem1 = new MesxYear();
        nuevoItem1.idMes = index;
        nuevoItem1.DescripcionMes = "Febrero";
        this.mesxYearEnd.push(nuevoItem1);
      } else if (index == 3) {
        var nuevoItem2 = new MesxYear();
        nuevoItem2.idMes = index;
        nuevoItem2.DescripcionMes = "Marzo";
        this.mesxYearEnd.push(nuevoItem2);
      } else if (index == 4) {
        var nuevoItem3 = new MesxYear();
        nuevoItem3.idMes = index;
        nuevoItem3.DescripcionMes = "Abril";
        this.mesxYearEnd.push(nuevoItem3);
      } else if (index == 5) {
        var nuevoItem4 = new MesxYear();
        nuevoItem4.idMes = index;
        nuevoItem4.DescripcionMes = "Mayo";
        this.mesxYearEnd.push(nuevoItem4);
      } else if (index == 6) {
        var nuevoItem5 = new MesxYear();
        nuevoItem5.idMes = index;
        nuevoItem5.DescripcionMes = "Junio";
        this.mesxYearEnd.push(nuevoItem5);
      } else if (index == 7) {
        var nuevoItem6 = new MesxYear();
        nuevoItem6.idMes = index;
        nuevoItem6.DescripcionMes = "Julio";
        this.mesxYearEnd.push(nuevoItem6);
      } else if (index == 8) {
        var nuevoItem7 = new MesxYear();
        nuevoItem7.idMes = index;
        nuevoItem7.DescripcionMes = "Agosto";
        this.mesxYearEnd.push(nuevoItem7);
      } else if (index == 9) {
        var nuevoItem8 = new MesxYear();
        nuevoItem8.idMes = index;
        nuevoItem8.DescripcionMes = "Septiembre";
        this.mesxYearEnd.push(nuevoItem8);
      } else if (index == 10) {
        var nuevoItem9 = new MesxYear();
        nuevoItem9.idMes = index;
        nuevoItem9.DescripcionMes = "Octubre";
        this.mesxYearEnd.push(nuevoItem9);
      } else if (index == 11) {
        var nuevoItem10 = new MesxYear();
        nuevoItem10.idMes = index;
        nuevoItem10.DescripcionMes = "Noviembre";
        this.mesxYearEnd.push(nuevoItem10);
      } else if (index == 12) {
        var nuevoItem11 = new MesxYear();
        nuevoItem11.idMes = index;
        nuevoItem11.DescripcionMes = "Diciembre";
        this.mesxYearEnd.push(nuevoItem11);
      }

    }

    var añoInicial = $(".yearInit_Convenio").val();
    //#region validaciones de campo
    if (Number(year) < Number(añoInicial)) {
      this.validaAnoFinal = true;
      this.validaAnoInicial = false;
      this.Extractos.length = 0;
      this.ExtractosConvenio.length = 0;
      return null;
    } else {
      this.validaAnoFinal = false;
      this.validaAnoInicial = false;
      setTimeout(() => {
        $(".MesEnd_Convenio").prop('selectedIndex', 0);
      }, 400);
    }
    return null;
    console.log(this.mesxYearEnd)
  }

  opcionSelectedYearInit(year : string) {

    var date = new Date();
    var yearNow = date.getFullYear();
    var MonthNow = date.getMonth() + 1;
    var MesInicial = 1;
    var MesFinal = 12;
    this.mesxYear.length = 0;
    if (Number(year) == Number(this.yearInicial)) {
      MesInicial = this.mesInicial;
    }
    if (Number(year) == Number(yearNow)) {
      MesFinal = MonthNow - 1;
    }
    for (var index = MesInicial; index <= MesFinal; index++){
      if (index == 1) {
        var nuevoItem = new MesxYear();
        nuevoItem.idMes = index;
        nuevoItem.DescripcionMes = "Enero";
        this.mesxYear.push(nuevoItem);
      } else if (index == 2) {
        var nuevoItem1 = new MesxYear();
        nuevoItem1.idMes = index;
        nuevoItem1.DescripcionMes = "Febrero";
        this.mesxYear.push(nuevoItem1);
      } else if (index == 3) {
        var nuevoItem2 = new MesxYear();
        nuevoItem2.idMes = index;
        nuevoItem2.DescripcionMes = "Marzo";
        this.mesxYear.push(nuevoItem2);
      } else if (index == 4) {
        var nuevoItem3 = new MesxYear();
        nuevoItem3.idMes = index;
        nuevoItem3.DescripcionMes = "Abril";
        this.mesxYear.push(nuevoItem3);
      } else if (index == 5) {
        var nuevoItem4 = new MesxYear();
        nuevoItem4.idMes = index;
        nuevoItem4.DescripcionMes = "Mayo";
        this.mesxYear.push(nuevoItem4);
      } else if (index == 6) {
        var nuevoItem5 = new MesxYear();
        nuevoItem5.idMes = index;
        nuevoItem5.DescripcionMes = "Junio";
        this.mesxYear.push(nuevoItem5);
      } else if (index == 7) {
        var nuevoItem6 = new MesxYear();
        nuevoItem6.idMes = index;
        nuevoItem6.DescripcionMes = "Julio";
        this.mesxYear.push(nuevoItem6);
      } else if (index == 8) {
        var nuevoItem7 = new MesxYear();
        nuevoItem7.idMes = index;
        nuevoItem7.DescripcionMes = "Agosto";
        this.mesxYear.push(nuevoItem7);
      } else if (index == 9) {
        var nuevoItem8 = new MesxYear();
        nuevoItem8.idMes = index;
        nuevoItem8.DescripcionMes = "Septiembre";
        this.mesxYear.push(nuevoItem8);
      } else if (index == 10) {
        var nuevoItem9 = new MesxYear();
        nuevoItem9.idMes = index;
        nuevoItem9.DescripcionMes = "Octubre";
        this.mesxYear.push(nuevoItem9);
      } else if (index == 11) {
        var nuevoItem10 = new MesxYear();
        nuevoItem10.idMes = index;
        nuevoItem10.DescripcionMes = "Noviembre";
        this.mesxYear.push(nuevoItem10);
      } else if (index == 12) {
        var nuevoItem11 = new MesxYear();
        nuevoItem11.idMes = index;
        nuevoItem11.DescripcionMes = "Diciembre";
        this.mesxYear.push(nuevoItem11);
      }

    }

        //#region  validaciones de formulario
        var AñoFinal = $(".yearEnd_Convenio").val();
        if (Number(year) > Number(AñoFinal)) {
          this.validaAnoInicial = true;
          this.validaAnoFinal = false;
          this.Extractos.length = 0;
          this.ExtractosConvenio.length = 0;
          return null;
        } else {
          this.validaAnoInicial = false;
          this.validaAnoFinal = false;
          setTimeout(() => {
            $(".MesInit_Convenio").prop('selectedIndex', 0);
          }, 400);
        }

        //#endregion
    console.log(this.mesxYear)
    return null;
  }

  detalleExtractoConvenio(data : any) {
    this.HabilitaMensate = 0;
    this.ExtractoConveniosForm.get("MovExtSelector")?.setValue("-");
    this.ExtractoConveniosForm.get("IdTercero")?.setValue(this.terceroId);
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var consecutivo = cuentaArray[2];
    var intProducto = cuentaArray[1];
    var intOficina = cuentaArray[0];
    this.idCuenta = data.lngIdCuenta;
    this.NumeroCuenta = data.strCuenta;
    var consecutivoSinCeros = Number(consecutivo);
    this.ExtractoConveniosForm.get("consecutivo")?.setValue(consecutivoSinCeros);
    this.ExtractoConveniosForm.get("NumeroCuenta")?.setValue(cuenta);
    this.ExtractoConveniosForm.get("intProducto")?.setValue(intProducto);
    this.ExtractoConveniosForm.get("intOficina")?.setValue(intOficina);
    this.ExtractoConveniosForm.get("NombreProducto")?.setValue(data.NameProducto);
    this.ExtractoConveniosForm.get("TipoProducto")?.setValue("Seguro");
    this.consecutivo = consecutivo;
    var consecutivo = cuentaArray[2];

    this.fechaAperturaCuenta = moment(new Date(data.dtmMatricula)).format('YYYY-MM-DD');
    this.fechaAperturaActualDisabled = moment(new Date()).format('YYYY-MM-DD');
    $("#fechaInitSegConvenio").val(this.fechaAperturaCuenta);
    $("#fechaendConvenio").val(this.fechaAperturaActualDisabled);
    this.ConsultaYears();

  }

  CambiarColor(fil : number | any, producto : number) {
    if (producto === 1) {
      $(".filExe" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filExe" + fil).css("background", "#e5e5e5");
      $(".strCuentaExe" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".strCuentaExe" + fil).css("background", "#e5e5e5");
      $(".filOlivos_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filOlivos_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior = fil;
      // limpia sombreado anterior
      this.ColorAnterior2 = null;
      this.ColorAnterior3 = null;
      this.ColorAnterior4 = null;
      this.ColorAnterior5 = null;
    }
  }

  Consultar() {

    this.SelectionExtOrMov = this.ExtractoSeguroForm.get("MovExtSelector")?.value;
    var FechaInicio = $("#fechaInitSeg").val();
    var FechaFin = $("#fechaendSeg").val();
    this.fechaInicioC = FechaInicio;
    this.fechaFinC = FechaFin;
    var fecha = new Date();
    this.today = fecha;

    if (FechaInicio == "") {
      this.InicioVacida = true;
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
    } else if (FechaFin == "") {
      this.FinVacida = true;
      this.InicioVacida = false;
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
    } else if (this.SelectionExtOrMov == "-") {
      this.SelectErroneo = true;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FechaMenorMayor = false;
      this.FinVacida = false;
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
    } else if (FechaInicio != null &&
      FechaInicio < this.fechaAperturaCuenta || FechaInicio != null && FechaInicio > this.fechaAperturaActualDisabled || FechaInicio != null && FechaFin != null && FechaInicio > FechaFin
    ) {
      this.inicioNoValida = true;
      this.SelectErroneo = false;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FinVacida = false;
      this.FechaMenorMayor = false;
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
    } else if (FechaFin != null &&
      FechaFin > this.fechaAperturaActualDisabled || FechaFin != null && FechaFin < this.fechaAperturaCuenta || FechaFin != null && FechaInicio != null && FechaFin < FechaInicio
    ) {
      this.finNoValida = true;
      this.inicioNoValida = false;
      this.SelectErroneo = false;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FinVacida = false;
      this.FechaMenorMayor = false;
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
    } else {
      this.FechaMayorAmenor = false;
      this.SelectErroneo = false;
      this.inicioNoValida = false;
      this.finNoValida = false;
      this.FechaMenorMayor = false;
      this.InicioVacida = false;
      this.FinVacida = false;
      if (
        this.SelectionExtOrMov == 2 &&
        FechaInicio != null &&
        FechaFin != null
      ) {
        this.ExtractoSeguroForm.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtractoSeguroForm.get("FechaFin")?.setValue(FechaFin);
        this.loading = true;
        this.MiListaProductosService.GetExtractoSeguros(
          this.ExtractoSeguroForm.value
        ).subscribe(
          (result) => {
            this.loading = false;
            if (result.TipoAlerta == "3") {
              $("#extractosSegExequiales").hide();
              $("#movimientosSegExequial").hide();
              $("#pdf").hide();
              $("#xlsx").hide();
              $(".rangoFechas").show();
              this.loading = false;
              this.HabilitaMensate = 1;
            } else {
              this.HabilitaMensate = 0;
              this.loading = true;
              $("#extractosSegExequiales").show();
              this.MiListaProductosService.GenerarPdfExtractoSeguros(
                this.ExtractoSeguroForm.value
              ).subscribe(
                (result) => {
                  this.loading = false;
                  const pdfinBase64 = result.FileStream._buffer;
                  const byteArray = new Uint8Array(
                    atob(pdfinBase64)
                      .split("")
                      .map((char) => char.charCodeAt(0))
                  );
                  const newBolb = new Blob([byteArray], { type: "application/pdf" });
                  const url = window.URL.createObjectURL(newBolb);
                  document.getElementById("extractosSegExequiales")?.setAttribute("data", url);
                  document.getElementById("extractosSegExequiales")?.setAttribute("name", "movimiento");
                },
                (error) => {
                  this.loading = false;
                  console.log(error);
                }
              );
              this.Extractos = result.DescribeExtracto;
              this.NumeroDocumento = result.NumeroDocumento;
              $("#pdf").show();
              $("#xlsx").show();
              $(".rangoFechas").show();
              this.Movimientos.length = 0;

            }
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );

        //#region Guarda log
        let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
        var LogMisProductosData = new LogMisProductos();
        var nuevoItem = new DatosProductos();
        LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
        LogMisProductosData.IdModulo = 69;
        LogMisProductosData.IdOperacion = 80;
        LogMisProductosData.IdOpcion = 3; // Extrato
        LogMisProductosData.IdTercero = this.terceroId;
        LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
        LogMisProductosData.IdCuenta = this.idCuenta;
        nuevoItem.NumeroCuenta = this.NumeroCuenta;
        nuevoItem.FechaInicial = FechaInicio.toString();
        nuevoItem.FechaFinal = FechaFin.toString();
        LogMisProductosData.DatosProductos = nuevoItem;
        this.setLogMisProductos(LogMisProductosData);
        // #endregion
      } else if (
        this.SelectionExtOrMov == 1 &&
        FechaInicio != null &&
        FechaFin != null
      ) {
        this.ExtractoSeguroForm.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtractoSeguroForm.get("FechaFin")?.setValue(FechaFin);
        this.loading = true;
        this.MiListaProductosService.getMovimientoSeguro(
          this.ExtractoSeguroForm.value
        ).subscribe(
          (result) => {
            if (result.TipoAlerta == "3") {
              $("#extractosSegExequiales").hide();
              $("#movimientosSegExequial").hide();
              $("#pdf").hide();
              $("#xlsx").hide();
              $(".rangoFechas").show();
              this.loading = false;
              this.HabilitaMensate = 1;
            } else {
              this.loading = true;
              this.HabilitaMensate = 0;
              $("#movimientosSegExequial").show();
              this.MiListaProductosService.GenerarPDFMovimientoSeguro(
                this.ExtractoSeguroForm.value
              ).subscribe(
                (result) => {
                  this.loading = false;
                  const pdfinBase64 = result.FileStream._buffer;
                  const byteArray = new Uint8Array(
                    atob(pdfinBase64)
                      .split("")
                      .map((char) => char.charCodeAt(0))
                  );
                  const newBolb = new Blob([byteArray], { type: "application/pdf" });
                  const url = window.URL.createObjectURL(newBolb);
                  document.getElementById("movimientosSegExequial")?.setAttribute("data", url);
                  document.getElementById("movimientosSegExequial")?.setAttribute("name", "movimiento");
                },
                (error) => {
                  this.loading = false;
                  console.log(error);
                }
              );
              this.loading = false;
              this.Movimientos = result.DescribeMovimiento;
              this.NumeroDocumento = result.NumeroDocumento;
              $("#pdf").show();
              $("#xlsx").show();
              $(".rangoFechas").show();
              this.Extractos.length = 0;

            }
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );

        //#region Guarda log
        let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
        var LogMisProductosData = new LogMisProductos();
        var nuevoItem = new DatosProductos();
        LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
        LogMisProductosData.IdModulo = 69;
        LogMisProductosData.IdOperacion = 80;
        LogMisProductosData.IdOpcion = 2; //Movimiento
        LogMisProductosData.IdTercero = this.terceroId;
        LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
        LogMisProductosData.IdCuenta = this.idCuenta;
        nuevoItem.NumeroCuenta = this.NumeroCuenta;
        nuevoItem.FechaInicial = FechaInicio.toString();
        nuevoItem.FechaFinal = FechaFin.toString();
        LogMisProductosData.DatosProductos = nuevoItem;
        this.setLogMisProductos(LogMisProductosData);
        // #endregion

      }
    }
  }

  opcionSelectedFechasConvenio(value : number) {
    var FechaFin = $("#fechaendConvenio").val();
    var FechaInicio = $("#fechaInitSegConvenio").val();

    if (value == 1) {
      var numCaracteres = this.valueFechaInicial.length;
      if (numCaracteres == 10) {
        if (
          this.valueFechaInicial >= this.fechaAperturaCuenta &&
          this.valueFechaInicial <= this.fechaAperturaActualDisabled
        ) {
          if ( FechaFin != null && this.valueFechaInicial > FechaFin) {
            this.FechaMenorMayor = false;
            this.inicioNoValida = false;
            this.FechaMayorAmenor = true;
            this.Extractos.length = 0;
            this.Movimientos.length = 0;
            this.ExtractosConvenio.length = 0;
            this.MovimientosConvenio.length = 0;
            return 1;
          } else {
            this.inicioNoValida = false;
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = false;
          }
        } else if (FechaInicio != null &&
          FechaInicio < this.fechaAperturaCuenta || FechaInicio != null &&
          FechaInicio > this.fechaAperturaActualDisabled || FechaInicio != null && FechaFin != null &&
          FechaInicio > FechaFin
        ) {
          this.inicioNoValida = true;
          this.FechaMenorMayor = false;
          this.FechaMayorAmenor = false;
          this.Extractos.length = 0;
          this.Movimientos.length = 0;
          this.ExtractosConvenio.length = 0;
          this.MovimientosConvenio.length = 0;
        } else {
          this.inicioNoValida = false;
          this.finNoValida = false;
          this.FechaMayorAmenor = false;
          this.FechaMenorMayor = false;
        }
      }
    } else if (value == 2) {
      var numCaracteresFin = this.valueFechaFinal.length;

      if (numCaracteresFin == 10) {
        if (
          this.valueFechaFinal <= this.fechaAperturaActualDisabled &&
          this.valueFechaFinal >= this.fechaAperturaCuenta
        ) {
          if (FechaInicio != null && this.valueFechaFinal < FechaInicio) {
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = true;
            this.finNoValida = false;
            this.Extractos.length = 0;
            this.Movimientos.length = 0;
            this.ExtractosConvenio.length = 0;
            this.MovimientosConvenio.length = 0;
            return 1;
          } else {
            this.finNoValida = false;
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = false;
          }
        } else if ( FechaFin != null &&
          FechaFin > this.fechaAperturaActualDisabled || FechaFin != null &&
          FechaFin < this.fechaAperturaCuenta || FechaFin != null && FechaInicio != null &&
          FechaFin < FechaInicio
        ) {
          this.finNoValida = true;
          this.FechaMenorMayor = false;
          this.FechaMayorAmenor = false;
          this.Extractos.length = 0;
          this.Movimientos.length = 0;
          this.ExtractosConvenio.length = 0;
          this.MovimientosConvenio.length = 0;
        } else {
          this.finNoValida = false;
          this.inicioNoValida = false;
          this.FechaMayorAmenor = false;
          this.FechaMenorMayor = false;
        }
      }
    }
    return null;
  }

  generarPDFSeguroVida() {
    var sel1 = Number($(".SelectedMovimiento_Convenio").val());
    if (sel1 == 1) {
      //pdf movimiento
      var Product = Number($("#ProductoID").val());
      if (Product == 106) {
        const linkSource = `data:application/pdf;base64,${this.urlPdf._buffer}`;
        const downloadLink = document.createElement("a");
        const fileName = "Movimiento_" + this.NumeroDocumento + ".pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        this.loading = false;
        downloadLink.click();
       } else {
        this.loading = true;
        this.MiListaProductosService.GenerarPDFMovimientoSeguro(
          this.ExtractoConveniosForm.value
        ).subscribe(
          (result) => {
            var baseg4 = result.FileStream;
            const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
            const downloadLink = document.createElement("a");
            const fileName = "Movimiento_" + this.NumeroDocumento + ".pdf";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            this.loading = false;
            downloadLink.click();
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );
      }
      }

    var sel = Number($(".SelectedExtracto_Convenio").val());
    if (sel == 2) {
      var Product = Number($("#ProductoID").val());
      if (Product == 106) {
        const linkSource = `data:application/pdf;base64,${this.urlPdf._buffer}`;
        const downloadLink = document.createElement("a");
        const fileName = "Extracto_" + this.NumeroDocumento + ".pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        this.loading = false;
        downloadLink.click();
      }else{
        this.loading = true;
        this.MiListaProductosService.GenerarPdfExtractoSeguros(
          this.ExtractoConveniosForm.value
        ).subscribe(
          (result) => {
            var baseg4 = result.FileStream;
            const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
            const downloadLink = document.createElement("a");
            const fileName = "Extracto_" + this.NumeroDocumento + ".pdf";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            this.loading = false;
            downloadLink.click();
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );
      }
      //pdf Extracto

    }
  }

  generarPDFSeguroExequial() {
    var sel1 = Number($(".SelectedMovimiento_Convenio").val());
    if (sel1 == 1) {
      //pdf movimiento
      this.loading = true;
      this.MiListaProductosService.GenerarPDFMovimientoSeguro(
        this.ExtractoSeguroForm.value
      ).subscribe(
        (result) => {
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Movimiento_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading = false;
          downloadLink.click();
        },
        (error) => {
          this.loading = false;
          console.log(error);
        }
      );
    }
    var select = Number($(".SelectedExtracto_Convenio").val());
    if (select == 2) {
      //pdf Extracto
      this.loading = true;
      this.MiListaProductosService.GenerarPdfExtractoSeguros(
        this.ExtractoSeguroForm.value
      ).subscribe(
        (result) => {
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading = false;
          downloadLink.click();
        },
        (error) => {
          this.loading = false;
          console.log(error);
        }
      );
    }
  }



  generarEXCELSeguroConvenio(): void {

    var sel1 = Number($(".SelectedMovimiento_Convenio").val());
    if (sel1 == 1) {

      this.loading = true;

      var intProducto = Number($("#ProductoID").val());
      if (intProducto == 106) {
        this.MiListaProductosService.GenerarXlsMovimientosContractuales(
          this.ExtractoConveniosForm.value
        ).subscribe(
          (result) => {
            var baseg4 = result;
            const linkSource = `data:application/xlsx;base64,${baseg4}`;
            const downloadLink = document.createElement("a");
            const fileName = "Movimiento_" + this.NumeroDocumento + ".xlsx";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            this.loading = false;
            downloadLink.click();
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );
      } else {
        this.MiListaProductosService.GenerarXlsMovimientosSeguro(
          this.ExtractoConveniosForm.value
        ).subscribe(
          (result) => {
            var baseg4 = result;
            const linkSource = `data:application/xlsx;base64,${baseg4}`;
            const downloadLink = document.createElement("a");
            const fileName = "Movimiento_" + this.NumeroDocumento + ".xlsx";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            this.loading = false;
            downloadLink.click();
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );
      }



    }
    var select = Number($(".SelectedExtracto_Convenio").val());
    if (select == 2) {
      this.loading = true;
      var intProducto = Number($("#ProductoID").val());
      if (intProducto == 106) {
        this.MiListaProductosService.GenerarXlsxAhorroDisponible(
          this.ExtractoConveniosForm.value
        ).subscribe(
          (result) => {
            this.loading = false;
            var baseg4 = result;
            const linkSource = `data:application/xlsx;base64,${baseg4}`;
            const downloadLink = document.createElement("a");
            const fileName = "Extracto_" + this.NumeroDocumento + ".xlsx";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );
      } else {
        this.MiListaProductosService.GenerarXlsxSeguro(
          this.ExtractoConveniosForm.value
        ).subscribe(
          (result) => {
            var baseg4 = result;
            const linkSource = `data:application/xlsx;base64,${baseg4}`;
            const downloadLink = document.createElement("a");
            const fileName = "Extracto_" + this.NumeroDocumento + ".xlsx";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            this.loading = false;
            downloadLink.click();
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );
      }
    }
  }
  generarEXCELSeguroExequial(): void {

    var sel1 = Number($(".SelectedMovimiento_Convenio").val());
    if (sel1 == 1) {
      this.loading = true;
      this.MiListaProductosService.GenerarXlsMovimientosSeguro(
        this.ExtractoSeguroForm.value
      ).subscribe(
        (result) => {
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Movimiento_" + this.NumeroDocumento + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading = false;
          downloadLink.click();
        },
        (error) => {
          this.loading = false;
          console.log(error);
        }
      );
    }
    var select = Number($(".SelectedExtracto_Convenio").val());
    if (select == 2) {
      this.loading = true;
      this.MiListaProductosService.GenerarXlsxSeguro(
        this.ExtractoSeguroForm.value
      ).subscribe(
        (result) => {
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading = false;
          downloadLink.click();
        },
        (error) => {
          this.loading = false;
          console.log(error);
        }
      );
    }
  }

  Limpiar(value?:number) {
    this.ExtractoConveniosForm.get("MovExtSelector")?.setValue("-");
    this.ExtractoSeguroForm.get("MovExtSelector")?.setValue("-");


    $("#fechaInitSeg").val("");
    $("#fechaendSeg").val("");
    $("#fechaInitSegVehiculo").val("");
    $("#fechaendSegVehiculo").val("");
    $("#fechaInitSegVida").val("");
    $("#fechaendSegVida").val("");
    $("#fechaInitSegConvenio").val("");
    $("#fechaendConvenio").val("");
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.ExtractosConvenio.length = 0;
    this.MovimientosConvenio.length = 0;
    this.FechaMayorAmenor = false;
    this.FechaMenorMayor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.InicioVacida = false;
    this.FinVacida = false;
    if (value == 1) {
      this.ConsultaYears();
      setTimeout(() => {
        this.seleccioneTodo();
        this.validaAnoInicial = false;
        this.validaAnoFinal = false;
        this.validaMesInicial = false;
        this.validaMesFinal = false;
      }, 500);
    }
  }

  LimpiarRespuestas() {
    this.dataBeneficiariosMascotasOlivos.length = 0;
    this.dataBeneficiariosOlivos.length = 0;
    this.dataBeneficiariosOlivosTable.length = 0;
    this.dataUserOlivos= [];
    this.dataBeneficiariosOlivosTable = [];
    this.carteraReal = {};
    this.infoModalVencidos = [];
    this.detalleModalSaldosVencidos = [];
    this.checkAcordeon = false;
  }

  FormExtracto() {
    const FechaInicio = new FormControl("", []);
    const FechaFin = new FormControl("", []);
    const MovExtSelector = new FormControl("", [Validators.required]);
    const IdTercero = new FormControl("", [Validators.required]);
    const consecutivo = new FormControl("", [Validators.required]);
    const intProducto = new FormControl("", [Validators.required]);
    const intOficina = new FormControl("", [Validators.required]);
    const NumeroCuenta = new FormControl("", [Validators.required]);
    const yearInit = new FormControl("", []);
    const yearEnd = new FormControl("", []);
    const MesInit = new FormControl("", []);
    const MesEnd = new FormControl("", []);
    const Usuario = new FormControl("", []);
    const Oficina = new FormControl("", []);
    const NombreProducto = new FormControl("", []);
    const TipoProducto = new FormControl("", []);
    this.ExtractoConveniosForm = new FormGroup({
      FechaInicio: FechaInicio,
      FechaFin: FechaFin,
      MovExtSelector: MovExtSelector,
      IdTercero: IdTercero,
      consecutivo: consecutivo,
      intProducto: intProducto,
      intOficina: intOficina,
      NumeroCuenta: NumeroCuenta,
      yearInit: yearInit,
      yearEnd: yearEnd,
      MesInit: MesInit,
      MesEnd: MesEnd,
      Usuario: Usuario,
      Oficina: Oficina,
      NombreProducto: NombreProducto,
      TipoProducto: TipoProducto,
    });
  }

  FormExtractoSeg() {
    const FechaInicio = new FormControl("", []);
    const FechaFin = new FormControl("", []);
    const MovExtSelector = new FormControl("", [Validators.required]);
    const IdTercero = new FormControl("", [Validators.required]);
    const consecutivo = new FormControl("", [Validators.required]);
    const intProducto = new FormControl("", [Validators.required]);
    const intOficina = new FormControl("", [Validators.required]);
    const NumeroCuenta = new FormControl("", [Validators.required]);
    const yearInit = new FormControl("", []);
    const yearEnd = new FormControl("", []);
    const MesInit = new FormControl("", []);
    const MesEnd = new FormControl("", []);
    const Usuario = new FormControl("", []);
    const Oficina = new FormControl("", []);
    const NombreProducto = new FormControl("", []);
    const TipoProducto = new FormControl("", []);
    this.ExtractoSeguroForm = new FormGroup({
      FechaInicio: FechaInicio,
      FechaFin: FechaFin,
      MovExtSelector: MovExtSelector,
      IdTercero: IdTercero,
      consecutivo: consecutivo,
      intProducto: intProducto,
      intOficina: intOficina,
      NumeroCuenta: NumeroCuenta,
      yearInit: yearInit,
      yearEnd: yearEnd,
      MesInit: MesInit,
      MesEnd: MesEnd,
      Usuario: Usuario,
      Oficina: Oficina,
      NombreProducto: NombreProducto,
      TipoProducto: TipoProducto,
    });
  }

  ConsultarConvenio() {
    this.SelectionExtOrMov = this.ExtractoConveniosForm.get("MovExtSelector")?.value;
    var FechaInicio = $("#fechaInitSegConvenio").val();
    var FechaFin = $("#fechaendConvenio").val();
    this.fechaInicioC = FechaInicio;
    this.fechaFinC = FechaFin;
    var fecha = new Date();
    this.today = fecha;

    if (FechaInicio == "") {
      this.InicioVacida = true;
      this.ExtractosConvenio.length = 0;
      this.MovimientosConvenio.length = 0;
    } else if (FechaFin == "") {
      this.FinVacida = true;
      this.InicioVacida = false;
      this.ExtractosConvenio.length = 0;
      this.MovimientosConvenio.length = 0;
    } else if (this.SelectionExtOrMov == "-") {
      this.SelectErroneo = true;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FechaMenorMayor = false;
      this.FinVacida = false;
      this.ExtractosConvenio.length = 0;
      this.MovimientosConvenio.length = 0;
    } else if ( FechaInicio != null &&
      FechaInicio < this.fechaAperturaCuenta || FechaInicio != null &&
      FechaInicio > this.fechaAperturaActualDisabled || FechaInicio != null && FechaFin != null &&
      FechaInicio > FechaFin
    ) {
      this.inicioNoValida = true;
      this.SelectErroneo = false;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FinVacida = false;
      this.FechaMenorMayor = false;
      this.ExtractosConvenio.length = 0;
      this.MovimientosConvenio.length = 0;
    } else if ( FechaFin != null &&
      FechaFin > this.fechaAperturaActualDisabled || FechaFin != null &&
      FechaFin < this.fechaAperturaCuenta || FechaFin != null && FechaInicio != null &&
      FechaFin < FechaInicio
    ) {
      this.finNoValida = true;
      this.inicioNoValida = false;
      this.SelectErroneo = false;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FinVacida = false;
      this.FechaMenorMayor = false;
      this.ExtractosConvenio.length = 0;
      this.MovimientosConvenio.length = 0;
    } else {
      this.FechaMayorAmenor = false;
      this.SelectErroneo = false;
      this.inicioNoValida = false;
      this.finNoValida = false;
      this.FechaMenorMayor = false;
      this.InicioVacida = false;
      this.FinVacida = false;
      if (
        this.SelectionExtOrMov == 2 &&
        FechaInicio != null &&
        FechaFin != null
      ) {
        this.ExtractoConveniosForm.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtractoConveniosForm.get("FechaFin")?.setValue(FechaFin);
        this.loading = true;
        var IdProducto = Number($("#ProductoID"));
        if (IdProducto == 106) {

        } else {
        this.MiListaProductosService.GetExtractoSeguros(
          this.ExtractoConveniosForm.value
        ).subscribe(
          (result) => {
            this.loading = false;
            if (result.TipoAlerta == "3") {
              $("#pdf").hide();
              $("#xlsx").hide();
              $(".rangoFechas").show();
              $("#movimientosConvenio").hide();
              $("#extractosConvenio").hide();
              this.loading = false;
              this.HabilitaMensate = 1;
            } else {
              $("#extractosConvenio").show();
              this.HabilitaMensate = 0;
              this.loading = true;

              this.MiListaProductosService.GenerarPdfExtractoSeguros(
                this.ExtractoConveniosForm.value
              ).subscribe(
                (result) => {
                  this.loading = false;
                  const pdfinBase64 = result.FileStream._buffer;
                  const byteArray = new Uint8Array(
                    atob(pdfinBase64)
                      .split("")
                      .map((char) => char.charCodeAt(0))
                  );
                  const newBolb = new Blob([byteArray], { type: "application/pdf" });
                  const url = window.URL.createObjectURL(newBolb);
                  document.getElementById("extractosConvenio")?.setAttribute("data", url);
                  document.getElementById("extractosConvenio")?.setAttribute("name", "movimiento");
                },
                (error) => {
                  this.loading = false;
                  console.log(error);
                }
              );
              this.ExtractosConvenio = result.DescribeExtracto;

              this.loading = false;
              this.NumeroDocumento = result.NumeroDocumento;
              $("#pdf").show();
              $("#xlsx").show();
              $(".rangoFechas").show();
              this.MovimientosConvenio.length = 0;
            }
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );
        }

        //#region Guarda log
        let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
        var LogMisProductosData = new LogMisProductos();
        var nuevoItem = new DatosProductos();
        LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
        LogMisProductosData.IdModulo = 69;
        LogMisProductosData.IdOperacion = 80;
        LogMisProductosData.IdOpcion = 3; // Extrato
        LogMisProductosData.IdTercero = this.terceroId;
        LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
        LogMisProductosData.IdCuenta = this.idCuenta;
        nuevoItem.NumeroCuenta = this.NumeroCuenta;
        nuevoItem.FechaInicial = FechaInicio.toString();
        nuevoItem.FechaFinal = FechaFin.toString();
        LogMisProductosData.DatosProductos = nuevoItem;
        this.setLogMisProductos(LogMisProductosData);
        // #endregion

      } else if (
        this.SelectionExtOrMov == 1 &&
        FechaInicio != null &&
        FechaFin != null
      ) {
        this.ExtractoConveniosForm.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtractoConveniosForm.get("FechaFin")?.setValue(FechaFin);
        this.loading = true;
        var IdProducto = Number($("#ProductoID").val());
        if (IdProducto == 106) {
          this.MiListaProductosService.getMovimiento(
            this.ExtractoConveniosForm.value
          ).subscribe(
            (result) => {
              if (result.TipoAlerta == "3") {
                $("#pdf").hide();
                $("#xlsx").hide();
                $(".rangoFechas").show();
                $("#movimientosConvenio").hide();
                $("#extractosConvenio").hide();
                this.loading = false;
                this.HabilitaMensate = 1;
              } else {
                this.loading = true;
                this.HabilitaMensate = 0;
                $("#movimientosConvenio").show();
                this.MiListaProductosService.GenerarPDFMovimientoAportes(
                  this.ExtractoConveniosForm.value
                ).subscribe(
                  (result) => {
                    this.loading = false;
                    this.urlPdf = result.FileStream;

                    const pdfinBase64 = result.FileStream._buffer;
                    const byteArray = new Uint8Array(
                      atob(pdfinBase64)
                        .split("")
                        .map((char) => char.charCodeAt(0))
                    );
                    const newBolb = new Blob([byteArray], { type: "application/pdf" });
                    const url = window.URL.createObjectURL(newBolb);
                    document.getElementById("movimientosConvenio")?.setAttribute("data", url);
                    document.getElementById("movimientosConvenio")?.setAttribute("name", "Movimientos");
                  },
                  (error) => {
                    this.loading = false;
                    console.log(error);
                  }
                );
              }

              this.loading = false;
              this.NumeroDocumento = result.NumeroDocumento;
              $("#pdf").show();
              $("#xlsx").show();
              $(".rangoFechas").show();
              this.ExtractosConvenio.length = 0;
              this.MovimientosConvenio = result.DescribeMovimiento;

            },
            (error) => {
              this.loading = false;
              console.log(error);
            }
          );
        }else{
          this.MiListaProductosService.getMovimientoSeguro(
            this.ExtractoConveniosForm.value
          ).subscribe(
            (result) => {
              if (result.TipoAlerta == "3") {
                $("#pdf").hide();
                $("#xlsx").hide();
                $(".rangoFechas").show();
                $("#movimientosConvenio").hide();
                $("#extractosConvenio").hide();
                this.loading = false;
                this.HabilitaMensate = 1;
              } else {
                this.loading = true;
                this.HabilitaMensate = 0;
                $("#movimientosConvenio").show();
                this.MiListaProductosService.GenerarPDFMovimientoSeguro(
                  this.ExtractoConveniosForm.value
                ).subscribe(
                  (result) => {
                    this.loading = false;
                    const pdfinBase64 = result.FileStream._buffer;
                    const byteArray = new Uint8Array(
                      atob(pdfinBase64)
                        .split("")
                        .map((char) => char.charCodeAt(0))
                    );
                    const newBolb = new Blob([byteArray], { type: "application/pdf" });
                    const url = window.URL.createObjectURL(newBolb);
                    document.getElementById("movimientosConvenio")?.setAttribute("data", url);
                    document.getElementById("movimientosConvenio")?.setAttribute("name", "movimiento");
                  },
                  (error) => {
                    this.loading = false;
                    console.log(error);
                  }
                );
                this.urlPdf = "";

                this.loading = false;
                this.NumeroDocumento = result.NumeroDocumento;
                $("#pdf").show();
                $("#xlsx").show();
                $(".rangoFechas").show();
                this.ExtractosConvenio.length = 0;
                this.MovimientosConvenio = result.DescribeMovimiento;
              }
            },
            (error) => {
              this.loading = false;
              console.log(error);
            }
          );
        }
        this.loading = false;
        //#region Guarda log
        let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
        var LogMisProductosData = new LogMisProductos();
        var nuevoItem = new DatosProductos();
        LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
        LogMisProductosData.IdModulo = 69;
        LogMisProductosData.IdOperacion = 80;
        LogMisProductosData.IdOpcion = 3; // Estratos
         LogMisProductosData.IdTercero = this.terceroId;
        LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
        LogMisProductosData.IdCuenta = this.idCuenta;
        nuevoItem.NumeroCuenta = this.NumeroCuenta;
        nuevoItem.FechaInicial = FechaInicio.toString();
        nuevoItem.FechaFinal = FechaFin.toString();
        LogMisProductosData.DatosProductos = nuevoItem;
        this.setLogMisProductos(LogMisProductosData);
        // #endregion
      }
    }
  }

  cargarCarteraConvenio(i: any) {
    this.ListCarteraConvenio = [];
    this.ListCarteraConvenio = i.Saldos ?? [];
  }

  cargarInscritosConvenio(i: any) {
    this.ListInscritos = [] ;
    this.ListMascotas = [];

    this.ListInscritos = i.Inscritos ?? [];
    this.ListMascotas = i.Mascotas ?? [];
  }

  selectRow(parametro: any) {
    this.selectedRow = parametro;
  }
}
