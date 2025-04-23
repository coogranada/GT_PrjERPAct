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

  ngOnInit() {
    this.FormExtracto();
    this.FormExtractoSeg();
    this.selectedEstado = "-";
    this.obtenerToken();
  }

  obtenerToken() {
    this.MiListaProductosService.getToken().subscribe(
      (result : any[]) => {
        if (result.length == 1) {
          if (result[0].Token == null || result[0].Horas >= 24) {
            this.MiListaProductosService.AutenticacionOlivos(result[0].Usuario, result[0].Clave).pipe(
              retry(3),
              delay(1000)
            ).subscribe(
              result => {
                this.MiListaProductosService.setToken(result).subscribe(
                  result => {
                    console.log("Se generó un nuevo Token");
                  }
                )
                this.token = result;
              },
              error => {
                console.log(error);
                this.countErrors += 1;
                if (this.countErrors >= 3) {
                  this.falloOlivos = true;
                }
              }
            );
          }
          else {
            this.token = result[0].Token;
          }
        }
      },
      error => {
        console.log(error)
      }
    )
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

  getCarteraAfiliados(tercero : string) {
    this.countErrors = 0;
    const FechaActual = new Date();
    FechaActual.setDate(1)
    const Hoy = new DatePipe('en-CO').transform(FechaActual, 'yyyy-MM-ddT00:00:00');
    this.dataUserOlivos = [];
    this.infoModalVencidos = [];
    this.MiListaProductosService.getCarteraAfiliadosV2(this.token, tercero)
    .subscribe(
      (result : any[]) => {
        this.carteraReal = {};
        //foreach para buscar los datos de saldos y saldos vencidos
        result.forEach(element => {
          let contrato = element.contrato;
          if (this.carteraReal[contrato]) {
            this.carteraReal[contrato]["saldo"] += element.saldo;
            if (Hoy != null && Hoy >= element.inicio_vigencia) {
              this.carteraReal[contrato]["saldoVencido"] += element.saldo;
            }
          } else {
            let saldoV = 0;
            if ( Hoy != null && Hoy >= element.inicio_vigencia) {
              saldoV = element.saldo;
            }
            this.carteraReal[contrato] = {
              saldo: element.saldo,
              saldoVencido: saldoV,
            };

          }
        });

        //foreach para organizar el detalle
        result.forEach(element => {
            if (this.infoModalVencidos.length == 0) {
              let infoModal = {
                contrato: element.contrato,
                fechaInicio: element.inicio_vigencia,
                saldo: element.saldo,
                abonado: element.abonado,
              }
              this.infoModalVencidos.push(infoModal);
            } else {
              let count = 0;
              this.infoModalVencidos.forEach(item => {
                if (element.inicio_vigencia == item.fechaInicio && element.contrato == item.contrato) { // se agrega validacion con contrato ysalazar / jherrera 2024.04.19
                  item.saldo += element.saldo;
                  item.abonado += element.abonado;
                } else {
                  count += 1;
                }
              });
              if (count == this.infoModalVencidos.length) {
                let infoModal = {
                  contrato: element.contrato,
                  fechaInicio: element.inicio_vigencia,
                  saldo: element.saldo,
                  abonado: element.abonado,
                }
                this.infoModalVencidos.push(infoModal);
              }
          }
        });
        this.getLosOlivos(tercero);
      },
      error => {
        if (error._body == "Tercero " +tercero+ " sin cartera") {
          this.carteraReal["estado"] = 0;
          this.getLosOlivos(tercero);
        }
      }
    );
  }

  getContratosOlivos(tercero : string) {
    this.contratosOlivos = [];
    this.MiListaProductosService.getDataOlivos(this.token, tercero).subscribe(
      result => {
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            if (this.ValidadaActivo) {
              if (result[i].renovacion == 'R' || result[i].renovacion == 'A' || result[i].renovacion == 'O' || result[i].renovacion == 'T' || result[i].renovacion == 'X') {
                if (result[i].nit_grupal == "890981912") {
                  this.contratosOlivos.push(result[i].contrato);
                }
              }
            } else {
              if (result[i].renovacion == 'C' || result[i].renovacion == 'B' || result[i].renovacion == 'M' || result[i].renovacion == 'P') {
                if (result[i].nit_grupal == "890981912") {
                  this.contratosOlivos.push(result[i].contrato);
                }
              }
            }
          }
        }
      }
    )
  }

  getLosOlivos(tercero : string) {
    this.MiListaProductosService.getDataOlivos(this.token, tercero).subscribe(
      async result => {

        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            let toSlash = 0;
            for (let index = 0; index < result[i].nombre_agencia.length; index++) {
              if (result[i].nombre_agencia[index] != "/") {
                toSlash++;
              } else {
                toSlash++;
                index = result[i].nombre_agencia.length + 1;
              }
            }
            if (this.ValidadaActivo) {
              if (result[i].renovacion == 'R' || result[i].renovacion == 'A' || result[i].renovacion == 'O' || result[i].renovacion == 'T' || result[i].renovacion == 'X') {
                if (result[i].nombre_agencia.includes('Coogranada') || result[i].nit_grupal == "890981912") {
                  let Oficina = result[i].nombre_agencia.substring(toSlash, result[i].nombre_agencia.length);
                  result[i].nombre_agencia = Oficina.replace(/([A-Z])/g, " $1").replace(/^./, function (str : string) { return str.toUpperCase(); });
                  if (result[i].renovacion == "A") result[i].renovacion = "Activo";
                  if (result[i].renovacion == "O") result[i].renovacion = "Obsequio";
                  if (result[i].renovacion == "R") result[i].renovacion = "Renovación";
                  if (result[i].renovacion == "T") result[i].renovacion = "Traslado";
                  if (result[i].renovacion == "X") result[i].renovacion = "Reactivación";
                  this.getContrato(result[i]);
                }
              }
            } else {
              if (result[i].renovacion == 'C' || result[i].renovacion == 'B' || result[i].renovacion == 'M' || result[i].renovacion == 'P') {
                if (result[i].nombre_agencia.includes('Coogranada') || result[i].nit_grupal == "890981912") {
                  let Oficina = result[i].nombre_agencia.substring(toSlash, result[i].nombre_agencia.length);
                  result[i].nombre_agencia = Oficina.replace(/([A-Z])/g, " $1").replace(/^./, function (str : string) { return str.toUpperCase(); });
                  if (result[i].renovacion == "B") result[i].renovacion = "Aplazado";
                  if (result[i].renovacion == "C") result[i].renovacion = "No activo";
                  if (result[i].renovacion == "M") result[i].renovacion = "Cambio";
                  if (result[i].renovacion == "P") result[i].renovacion = "Pendiente";
                  this.getContrato(result[i]);
                }
              }
            }
          }
        }
      },
      error => {
        console.log(error);
      }
    );    
  }

  getContrato(contrato : any) {
    const FechaActual = new Date();
    FechaActual.setDate(1);
    let NewFecha = new DatePipe('en-CO').transform(FechaActual, 'yyyy-MM-ddT00:00:00')
    this.MiListaProductosService.getDataContratoOlivos(this.token, contrato.contrato).subscribe(
      result => {
        let cuota = 0;
        let saldo = 0;
        let saldoVencido = 0;
        if (result.caracteristicas.length > 0) {
          if ("descripcion_coberturas" in result.caracteristicas[0]) {
            contrato.servicio = result.caracteristicas[0].descripcion_coberturas;
          }
        }
        if ("servicio" in contrato) {
          if (contrato.servicio == "Exequial Personas") {
            contrato.servicio = "Plan de protección integral";
          }
        } else {
          contrato["servicio"] = "Plan de protección integral";
        }

        !("servicio" in contrato) ? contrato["servicio"] = "Plan de protección integral" : contrato.servicio = contrato.servicio;

        for (let i = 0; i < result.primas.length; i++) {
          let newActualDate = new Date();
          // Inicio se agregan variables  ysalazar / jherrera 2024.04.17
          let fecha = new Date(result.primas[i].fecha)
          let dia = fecha.getDate()
          let mes = fecha.getMonth()
          // fin 
          if(result.primas[i].forma_pago == 180){
            if (FechaActual.getMonth() > 6) {
              newActualDate.setMonth(mes,dia);//
              NewFecha = new DatePipe('en-CO').transform(newActualDate, 'yyyy-MM-ddT00:00:00')
            } else {
              newActualDate.setMonth(mes,dia);//
              NewFecha = new DatePipe('en-CO').transform(newActualDate, 'yyyy-MM-ddT00:00:00')
            }
          }else if(result.primas[i].forma_pago == 360){
            newActualDate.setMonth(mes,dia);//
            NewFecha = new DatePipe('en-CO').transform(newActualDate, 'yyyy-MM-ddT00:00:00')
          } 
          if (result.primas[i].fecha == NewFecha) {
            cuota = cuota + result.primas[i].prima;
            //INICIO: Se anexa validación para forma_pago = 30, ya que no hay fecha de apertura fija [2024/03/11]
          } else if(result.primas[i].forma_pago === 30) {
            let fechaPrima = result.primas[i].fecha;
            let fecha = new Date(fechaPrima);
            let mes = fecha.getMonth();
            let year = fecha.getFullYear();
            if (mes == newActualDate.getMonth() && year == newActualDate.getFullYear()) {
              cuota = cuota + result.primas[i].prima;
              i = result.primas.length + 1;
            }
            //FIN: ajuste [2024/03/11]
          }
        }

        contrato["saldo"] = cuota;
        contrato["detalleVencidos"] = this.infoModalVencidos;
        contrato["mostrarModal"] = true;

        if ("estado" in this.carteraReal || cuota == 0) {
          contrato["cartera"] = 0;
          contrato["saldoVencido"] = 0;
          contrato["mostrarModal"] = false;
        } else {
          for (let i = 0; i < result.carteraControl.length; i++) {
            if (this.contratosOlivos.includes(result.carteraControl[i].contrato)) {
              saldoVencido = saldoVencido + result.carteraControl[i].saldo;
            }
          }
          contrato.saldoVencido = saldoVencido;
          for (let i = 0; i < result.primas.length; i++) {
            if (NewFecha != null && result.primas[i].fecha > NewFecha) {
              saldo = saldo + result.primas[i].prima;
            }
          }
          contrato.cartera = saldo + saldoVencido;
          if (contrato.contrato in this.carteraReal) {
            contrato.cartera = this.carteraReal[contrato.contrato]["saldo"];
            contrato.SaldoVencido = this.carteraReal[contrato.contrato]["saldoVencido"];
          }
        
          // Inicio correccion boton modal detalle saldo  ysalazar / jherrera 2024.04.19
          if (contrato.cartera == 0) {
            contrato["mostrarModal"] = false;
          }
            // Inicio correccion boton modal detalle saldo  ysalazar / jherrera 2024.04.19
      }
      }, error => {
        console.log(error);
      }
    );

    this.MiListaProductosService.getDataContratoOlivos(this.token, contrato.contrato).subscribe(
      result => {
        if (result.asegurados.length > 0 || result.asegurados_animales.length > 0) {
          contrato["detalleBeneficiarios"] = true;
        } else {
          contrato["detalleBeneficiarios"] = false;
        }
      },
      error => {
        contrato["dataMascotas"]=[];
        contrato["dataBeneficiarios"]=[];
      }
    );
    this.dataUserOlivos.push(contrato);
  }

  getCuota(contrato : any) {
    this.MiListaProductosService.getDataCuotaOlivos(contrato.identificacion).subscribe(
      result => {
        console.log(result[0].Cartera);
        contrato.cartera = result[0].Cartera;
      }
    )
    this.dataUserOlivos.push(contrato);
  }

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
        this.getContratosOlivos(NumeroDocumento!.toString());
        this.getCarteraAfiliados(NumeroDocumento!.toString());
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

  getInfoBeneficiarios(contrato : string) {
    this.countErrors = 0;
    this.dataBeneficiariosOlivos.length = 0;
    this.dataBeneficiariosMascotasOlivos.length = 0;
    this.MiListaProductosService.getDataContratoOlivos(this.token, contrato).pipe(
      retry(1),
      delay(1000)
    )
    .subscribe(
      result => {
        if (result.asegurados.length > 0) {
          for (let i = 0; i < result.asegurados.length; i++) {
            var data = new dataBeneficiariosOlivos();
            var nombreCompleto = "";
            var nombre = result.asegurados[i].primer_nombre.toLowerCase();
            nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
            var apellido1 = result.asegurados[i].primer_apellido.toLowerCase();
            apellido1 = apellido1.charAt(0).toUpperCase() + apellido1.slice(1);
            var apellido2 = result.asegurados[i].segundo_apellido;
            if (typeof apellido2 === 'string' ) {
              apellido2 = apellido2.toLowerCase();
              apellido2 = apellido2.charAt(0).toUpperCase() + apellido2.slice(1);
            } else {
              apellido2 = "";
            }
            if (result.asegurados[i].segundo_nombre != null || result.asegurados[i].segundo_nombre != undefined) {
              var segundonombre = result.asegurados[i].segundo_nombre.toLowerCase();
              segundonombre = segundonombre.charAt(0).toUpperCase() + segundonombre.slice(1);
            } else {
              segundonombre = "";
            }
            nombreCompleto = `${nombre} ${segundonombre} ${apellido1} ${apellido2}`
            var tipoIdentificacion = "";
            if (result.asegurados[i].tipo_identificacion == "11") tipoIdentificacion = "Registro civil";
            else if (result.asegurados[i].tipo_identificacion == "12") tipoIdentificacion = "Tarjeta de iden";
            else if (result.asegurados[i].tipo_identificacion == "13") tipoIdentificacion = "Cédula";
            else if (result.asegurados[i].tipo_identificacion == "21") tipoIdentificacion = "Tarjeta de extr";
            else if (result.asegurados[i].tipo_identificacion == "22") tipoIdentificacion = "Cédula de extra";
            else if (result.asegurados[i].tipo_identificacion == "31") tipoIdentificacion = "NIT";
            else if (result.asegurados[i].tipo_identificacion == "41") tipoIdentificacion = "Pasaporte";
            else if (result.asegurados[i].tipo_identificacion == "42") tipoIdentificacion = "Tipo de documento extranjero";
            else if (result.asegurados[i].tipo_identificacion == "47") tipoIdentificacion = "Permiso Especial de Permanencia";
            var parentesco = "";
            if (result.asegurados[i].parentesco == "0") parentesco = "Conyuge";
            else if (result.asegurados[i].parentesco == "1") parentesco = "Padre";
            else if (result.asegurados[i].parentesco == "2") parentesco = "Madre";
            else if (result.asegurados[i].parentesco == "3") parentesco = "Hermano(a)";
            else if (result.asegurados[i].parentesco == "4") parentesco = "Suegro(a)";
            else if (result.asegurados[i].parentesco == "5") parentesco = "Hijo(a)";
            else if (result.asegurados[i].parentesco == "6") parentesco = "No Familia";
            else if (result.asegurados[i].parentesco == "7") parentesco = "Titular";
            else if (result.asegurados[i].parentesco == "8") parentesco = "C.C.";
            else if (result.asegurados[i].parentesco == "9") parentesco = "Perro";
            else if (result.asegurados[i].parentesco == "10") parentesco = "Yerno/Nuera";
            else if (result.asegurados[i].parentesco == "11") parentesco = "Cuñado";
            else if (result.asegurados[i].parentesco == "12") parentesco = "Tío(a)";
            else if (result.asegurados[i].parentesco == "13") parentesco = "Sobrino(a)";
            else if (result.asegurados[i].parentesco == "14") parentesco = "Nieto(a)";
            else if (result.asegurados[i].parentesco == "15") parentesco = "Abuelo(a)";
            else if (result.asegurados[i].parentesco == "16") parentesco = "Hijastro(a)";
            else if (result.asegurados[i].parentesco == "17") parentesco = "Padrastro";
            else if (result.asegurados[i].parentesco == "18") parentesco = "Madrastra";
            else if (result.asegurados[i].parentesco == "19") parentesco = "Titular Gratis";
            else if (result.asegurados[i].parentesco == "20") parentesco = "Primo(a)";
            else if (result.asegurados[i].parentesco == "21") parentesco = "Ex_Exposo(a)";
            else if (result.asegurados[i].parentesco == "22") parentesco = "Domestico(a)";
            else if (result.asegurados[i].parentesco == "23") parentesco = "Bisnieto(a)";
            else if (result.asegurados[i].parentesco == "24") parentesco = "Bisabuelo(a)";
            else if (result.asegurados[i].parentesco == "25") parentesco = "Compañero(a)";
            else if (result.asegurados[i].parentesco == "26") parentesco = "Titular Ahorrador";
            else if (result.asegurados[i].parentesco == "27") parentesco = "Gato";
            else if (result.asegurados[i].parentesco == "28") parentesco = "Perro premium";
            else if (result.asegurados[i].parentesco == "29") parentesco = "Gato premium";
            else if (result.asegurados[i].parentesco == "30") parentesco = "Hermanastro(a)";
            else if (result.asegurados[i].parentesco == "31") parentesco = "Beneficiario mayor";
            else if (result.asegurados[i].parentesco == "32") parentesco = "Asistencia Personas";
            else if (result.asegurados[i].parentesco == "33") parentesco = "Asistencia Perro";
            else if (result.asegurados[i].parentesco == "34") parentesco = "Combo (Exequias + Asistencia) Perro";
            else if (result.asegurados[i].parentesco == "35") parentesco = "Combo (Exequias + Asistencia) Perro Premium";
            else if (result.asegurados[i].parentesco == "36") parentesco = "Combo (Exequias + Asistencia) Gato";
            else if (result.asegurados[i].parentesco == "37") parentesco = "Combo (Exequias + Asistencia) Gato Premium";
            else if (result.asegurados[i].parentesco == "38") parentesco = "Asistencia Gato";
            else if (result.asegurados[i].parentesco == "39") parentesco = "Asistencia Fidelización personas";
            else if (result.asegurados[i].parentesco == "41") parentesco = "Asistencia Fidelización Perro";
            else if (result.asegurados[i].parentesco == "42") parentesco = "Asistencia Fidelización Gato";
            else if (result.asegurados[i].parentesco == "43") parentesco = "Perro - Resto del pais";
            else if (result.asegurados[i].parentesco == "44") parentesco = "Titular - Premium";
            else if (result.asegurados[i].parentesco == "45") parentesco = "Perro - Medellin Premium";
            else if (result.asegurados[i].parentesco == "46") parentesco = "Perro - Medellin Plus";
            else if (result.asegurados[i].parentesco == "47") parentesco = "Gato - Medellin Plus";
            else if (result.asegurados[i].parentesco == "48") parentesco = "Gato - Resto del pais";
            else if (result.asegurados[i].parentesco == "49") parentesco = "Gato - Medellin Premium";
            else if (result.asegurados[i].parentesco == "50") parentesco = "Titular - Plus";
            else if (result.asegurados[i].parentesco == "51") parentesco = "Perro Club de Amigos";
            else if (result.asegurados[i].parentesco == "52") parentesco = "Gato Club de Amigos";
            else if (result.asegurados[i].parentesco == "99") parentesco = "Otro";

            data.FechaAfiliacion = result.asegurados[i].fecha_afiliacion;
            data.TipoDocumento = tipoIdentificacion;
            data.NumeroDocumento = result.asegurados[i].identificacion;
            data.Nombre = nombreCompleto;
            data.parentesco = parentesco;
            data.FechaNacimiento = result.asegurados[i].fecha_nacimiento;
            data.FechaFallecimiento = result.asegurados[i].fecha_fallecio;
            data.FechaRetiro = result.asegurados[i].fecha_retiro;
            this.dataBeneficiariosOlivos.push(data);

          }
        }
        if (result.asegurados_animales.length > 0) {
          for (let i = 0; i < result.asegurados_animales.length; i++) {
            var datas = new dataBeneficiariosMascotasOlivos();
            var nombre = result.asegurados_animales[i].nombres.toLowerCase();
            nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

            var raza = "";
            if (result.asegurados_animales[i].raza == 1) raza = "Criollo";
            else if (result.asegurados_animales[i].raza == 2) raza = "Pincher";
            else if (result.asegurados_animales[i].raza == 3) raza = "Pitbull";
            else if (result.asegurados_animales[i].raza == 4) raza = "Labrador";
            else if (result.asegurados_animales[i].raza == 5) raza = "French Poodle";
            else if (result.asegurados_animales[i].raza == 6) raza = "Macho";
            else if (result.asegurados_animales[i].raza == 7) raza = "Hembra";
            else if (result.asegurados_animales[i].raza == 8) raza = "Pug";
            else if (result.asegurados_animales[i].raza == 9) raza = "Beagle";
            else if (result.asegurados_animales[i].raza == 10) raza = "Schnauzer";
            else if (result.asegurados_animales[i].raza == 11) raza = "Shitzu";
            else if (result.asegurados_animales[i].raza == 12) raza = "Pastor Aleman";
            else if (result.asegurados_animales[i].raza == 13) raza = "Angora";
            else if (result.asegurados_animales[i].raza == 14) raza = "Bulldog Frances";
            else if (result.asegurados_animales[i].raza == 15) raza = "Persa";
            else if (result.asegurados_animales[i].raza == 16) raza = "Bulldog";
            else if (result.asegurados_animales[i].raza == 17) raza = "Cocker Spaniel";
            else if (result.asegurados_animales[i].raza == 18) raza = "Golden Retriever";
            else if (result.asegurados_animales[i].raza == 19) raza = "Yorkie";
            else if (result.asegurados_animales[i].raza == 20) raza = "Pomerania";
            else if (result.asegurados_animales[i].raza == 21) raza = "Fox Terrier";
            else if (result.asegurados_animales[i].raza == 22) raza = "Lobo Siberiano";
            else if (result.asegurados_animales[i].raza == 23) raza = "Bulldog Ingles";
            else if (result.asegurados_animales[i].raza == 24) raza = "Otro";
            else if (result.asegurados_animales[i].raza == 25) raza = "Cruce";
            else if (result.asegurados_animales[i].raza == 26) raza = "Chihuahua";
            else if (result.asegurados_animales[i].raza == 27) raza = "Siames";
            else if (result.asegurados_animales[i].raza == 28) raza = "Bichon Maltes";
            else if (result.asegurados_animales[i].raza == 29) raza = "Mestizo";
            else if (result.asegurados_animales[i].raza == 30) raza = "Boston Terrier";
            else if (result.asegurados_animales[i].raza == 31) raza = "Bull Terrier";
            else if (result.asegurados_animales[i].raza == 32) raza = "Husky Siberiano";
            else if (result.asegurados_animales[i].raza == 33) raza = "Rottweiler";
            else if (result.asegurados_animales[i].raza == 34) raza = "Salchicha";
            else if (result.asegurados_animales[i].raza == 35) raza = "Samoyedo";
            else if (result.asegurados_animales[i].raza == 36) raza = "Americano";
            else if (result.asegurados_animales[i].raza == 37) raza = "Border Collie";
            else if (result.asegurados_animales[i].raza == 38) raza = "Yorkshire";
            else if (result.asegurados_animales[i].raza == 39) raza = "Boxer";
            else if (result.asegurados_animales[i].raza == 40) raza = "Malamute Alaska";
            else if (result.asegurados_animales[i].raza == 41) raza = "Mini Toy";
            else if (result.asegurados_animales[i].raza == 42) raza = "Dalmata";

            var color = "";
            if (result.asegurados_animales[i].color == 1) color = "Negro";
            else if (result.asegurados_animales[i].color == 2) color = "Café";
            else if (result.asegurados_animales[i].color == 3) color = "Blanco";
            else if (result.asegurados_animales[i].color == 4) color = "Gris";
            else if (result.asegurados_animales[i].color == 5) color = "Amarillo";
            else if (result.asegurados_animales[i].color == 6) color = "Dorado";
            else if (result.asegurados_animales[i].color == 7) color = "Tricolor";
            else if (result.asegurados_animales[i].color == 8) color = "Beige";
            else if (result.asegurados_animales[i].color == 9) color = "Chocolate";
            else if (result.asegurados_animales[i].color == 10) color = "Canela";
            else if (result.asegurados_animales[i].color == 11) color = "Dorada";
            else if (result.asegurados_animales[i].color == 12) color = "Blanco Y Negro";
            else if (result.asegurados_animales[i].color == 13) color = "Cafe Y Blanco";
            else if (result.asegurados_animales[i].color == 14) color = "Caramelo";
            else if (result.asegurados_animales[i].color == 15) color = "Miel";
            else if (result.asegurados_animales[i].color == 16) color = "Cafe Y Negro";
            else if (result.asegurados_animales[i].color == 17) color = "Blanco Y Amarillo";
            else if (result.asegurados_animales[i].color == 18) color = "Barcino";
            else if (result.asegurados_animales[i].color == 19) color = "Crema";
            else if (result.asegurados_animales[i].color == 20) color = "Arena";
            else if (result.asegurados_animales[i].color == 21) color = "Pardo";
            else if (result.asegurados_animales[i].color == 22) color = "Negro Y Amarillo";
            else if (result.asegurados_animales[i].color == 23) color = "Dorado";
            else if (result.asegurados_animales[i].color == 24) color = "Negro Y Cafe";
            else if (result.asegurados_animales[i].color == 25) color = "Naranja";
            else if (result.asegurados_animales[i].color == 26) color = "Otro";
            else if (result.asegurados_animales[i].color == 27) color = "Blanco Con Gris";

            var animal = "";
            if (result.asegurados_animales[i].animal == 1) animal = "Gato";
            else if (result.asegurados_animales[i].animal == 2) animal = "Perro premium";
            else if (result.asegurados_animales[i].animal == 3) animal = "Gato premium";
            else if (result.asegurados_animales[i].animal == 4) animal = "Asistencia Perro";
            else if (result.asegurados_animales[i].animal == 5) animal = "Combo (Exequias + Asistencia) Perro";
            else if (result.asegurados_animales[i].animal == 6) animal = "Combo (Exequias + Asistencia) Perro Premium";
            else if (result.asegurados_animales[i].animal == 7) animal = "Combo (Exequias + Asistencia) Gato";
            else if (result.asegurados_animales[i].animal == 8) animal = "Combo (Exequias + Asistencia) Gato Premium";
            else if (result.asegurados_animales[i].animal == 9) animal = "Asistencia Gato";
            else if (result.asegurados_animales[i].animal == 10) animal = "Asistencia Fidelización Perro";
            else if (result.asegurados_animales[i].animal == 11) animal = "Asistencia Fidelización Gato";
            else if (result.asegurados_animales[i].animal == 12) animal = "Perro - Resto del pais";
            else if (result.asegurados_animales[i].animal == 13) animal = "Perro - Medellin Premium";
            else if (result.asegurados_animales[i].animal == 14) animal = "Perro - Medellin Plus";
            else if (result.asegurados_animales[i].animal == 15) animal = "Gato - Medellin Plus";
            else if (result.asegurados_animales[i].animal == 16) animal = "Gato - Resto del pais";
            else if (result.asegurados_animales[i].animal == 17) animal = "Gato - Medellin Premium";
            else if (result.asegurados_animales[i].animal == 18) animal = "Perro";
            else if (result.asegurados_animales[i].animal == 19) animal = "Perro Club de Amigos";
            else if (result.asegurados_animales[i].animal == 20) animal = "Gato Club de Amigos";
            else if (result.asegurados_animales[i].animal == 21) animal = "Gato - Protección Exequial";
            else if (result.asegurados_animales[i].animal == 22) animal = "Perro - Protección Exequial";

            datas.FechaAfiliacion = result.asegurados_animales[i].fecha_afiliacion;
            datas.Nombre = nombre;
            datas.raza = raza;
            datas.color = color;
            datas.animal = animal;
            datas.FechaFallecimiento = result.asegurados_animales[i].fecha_fallecio;
            datas.FechaRetiro = result.asegurados_animales[i].fecha_retiro;
            this.dataBeneficiariosMascotasOlivos.push(datas)
          }
        }
        //se pone el titular de primeras
        this.dataBeneficiariosOlivos.forEach(element => {
          let posicion = this.dataBeneficiariosOlivos.indexOf(element);
          if (posicion > 0) {
            if (element.parentesco == "Titular") {
              let auxiliar = this.dataBeneficiariosOlivos[0];
              this.dataBeneficiariosOlivos[posicion] = auxiliar;
              this.dataBeneficiariosOlivos[0] = element;
            }
          }
        });
        this.dataBeneficiariosOlivosTable = this.dataBeneficiariosOlivos;
      },
      error => {
        /* if (error._body == "Usuario no autorizado") {
          if (this.countErrors == 2) {
            this.obtenerToken(false);
          }
          this.countErrors += 1;

        } */
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
    nuevoItem.FechaInicial = "";
    nuevoItem.FechaFinal = "";
    LogMisProductosData.DatosProductos = nuevoItem;
    this.setLogMisProductos(LogMisProductosData);
        // #endregion
  }

  DetalleOlivosSaldosVencidos(item : any,saldo : string) {
    this.detalleModalSaldosVencidos = [];
    item["detalleVencidos"].forEach((element : any) => {
      if (item.contrato == element.contrato) {
        let datos = element;
        datos["cuota"] = item.saldo;
        this.detalleModalSaldosVencidos.push(datos);
      }
    });
    //#region Guarda log
    let data = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
    var LogMisProductosData = new LogMisProductos();
    var nuevoItem = new DatosProductos();
    LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
    LogMisProductosData.IdModulo = 69;
    LogMisProductosData.IdOperacion = 80;
    LogMisProductosData.IdOpcion = 9; // Detalle saldo
    LogMisProductosData.IdTercero = this.terceroId;
    LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
    nuevoItem.FechaInicial = "";
    nuevoItem.FechaFinal = "";
    LogMisProductosData.DatosProductos = nuevoItem;
    this.setLogMisProductos(LogMisProductosData);
        // #endregion
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
}
