import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExcelService } from '../../../../../Services/General/excel.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { MiListaProductosService } from '../../../../../Services/Informes/mi-lista-productos.service';
import moment from 'moment';
import { DetalleCartera } from "../../../../../Models/Informes/MisProductos/mis-producto.model";
import {   
  LogMisProductos,
  DatosProductos,
  MesxYear
} from "../../../../../Models/Informes/MisProductos/mis-producto.model";
import swal from "sweetalert2";
import { AlertService } from '../../../../../Services/Alert/alert.service';
import { LoadingService } from '../../../../../Services/shared/loading.service';

const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
// import internal = require('assert');

@Component({
  selector: 'app-cartera-tab',
  templateUrl: './cartera-tab.component.html',
  styleUrls: ['./cartera-tab.component.css'],
  providers: [ExcelService],
  standalone : false
})
export class CarteraTabComponent implements OnInit {
  //#region Variables
  @ViewChild('ModalFormatosMovimientosCr', { static: true }) ModalFormatosMovimientosCr!: NgForm;
  @ViewChild('ModalCalificacion', { static: true }) private ModalCalificacion!: ElementRef;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public fechaAperturaCuenta: any;
  public fechaAperturaActualDisabled: any;
  public NombreProducto: any;
  public TipoProducto: any;
  public FechaMayorAmenor: Boolean = false;
  public inicioNoValida: Boolean = false;
  public validaPlantillla: Boolean = false;
  public carteraInfo = new DetalleCartera();
  public finNoValida: Boolean = false;
  public NombrePersonaExtracto: any;
  public NumeroDocumento: any;
  public Cuenta: any;
  public FechasMovimientos: any;
  public DescripcionProducto: any;
  public estado: any;
  public TipoAlerta: any;
  public saldoInicio_: any;
  public Consignaciones_: any;
  public RetirosyND_: any;
  public Intereses_: any;
  public SaldoFinal_: any;
  public oficinaMatricula: any;
  public valueFechaFinal: any;
  public valueFechaInicial: any;
  public page: number = 0;
  public SelectionExtOrMov: any;
  public fechaFinC: any;
  public fechaInicioC: any;
  public today: any;
  public DetallesExtractoCartera: any[] = [];
  public DetallesMovimientosCartera: any[] = [];
  public CalificaAnualmente12Mes: any;
  public ResumenAnual: any[] = [];
  public MontoExtCarter: any;
  public FechaAperturaExtCartera: any;
  public PlazoExtCartera: any;
  public VenceExtCartera: any;
  public FormaPagoExtCartera: any;
  public ModalidadExtCartera: any;
  public InteresExtCartera: any;
  public linkPdf: string = "";
  public year: any;
  public month: any;
  public SelectionMonth: any;
  public SelectionYear: any;
  public ColorAnterior: any;
  public ColorAnterior2: any;
  public ColorAnterior3: any;
  public ColorAnterior4: any;
  public ColorAnterior5: any;
  public ColorAnterior6: any;
  public ColorAnterior7: any;
  public ColorAnterior8: any;
  public ColorAnterior9: any;
  public ColorAnterior10: any;
  public ColorAnterior90: any;
  public ColorAnterior100: any;
  public ColorAnterior11: any;
  public ColorAnterior12: any;
  public ColorAnterior13: any;
  public ColorAnterior14: any;
  public ColorAnterior15: any;
  public ColorAnterior16: any;
  public cuentaAnterior: any;
  public CalificaAnterior: any;
  public yearOpen: any;
  public MonthOpen: any;
  public FilePDFXLS: any;
  public InicioVacida: Boolean = false;
  public FinVacida: Boolean = false;
  public FechaMenorMayor: Boolean = false;
  public LstResumenCalificaciones: any[] = [];
  public nuevoObjetoCalifica: any[] = [];
  public nuevoObjetoCalifica1: any[] = [];
  public CuentasHijas: any[] = [];
  public CreditoComercialActivos: any[] = [];
  public CreditoConsumoActivos: any[] = [];
  public CreditoViviendaActivos: any[] = [];
  public MicrocreditoEmpActivos: any[] = [];
  public CreditoComercialCancelados: any[] = [];
  public CreditoConsumoCancelados: any[] = [];
  public CreditoViviendaCancelados: any[] = [];
  public MicrocreditoEmpCancelados: any[] = [];
  public ReferenciasFamPer: any[] = [];
  public ReferencasFinCom: any[] = [];
  public lstCalificacion: any[] = [];
  public lstAnalisisCalificacion: any[] = [];
  public lstReestructuracion: any[] = [];
  public lstReliquidacion: any[] = [];
  public lstCodeudores: any[] = [];
  public lstGarantias: any[] = [];
  public lstDeducibles: any[] = [];
  public lstCoutasCalculadas: any[] = [];
  public lstProvisiones: any[] = [];
  public ValidadorCheck: boolean = true;
  public ValidadorCheckHijas: boolean = true;
  public ValidaTarjetaDebito: boolean = true;
  public ValidaNoAplicaHija = false;
  public lstanos: any[] = [];
  public validaHija: boolean = false;
  public validaCuentaNormalCupo: boolean = false;
  public CarteraForm!: FormGroup;
  public lstCuentasHijasActivas: any[] = [];
  public lstCuentasHijasCanceladas: any[] = [];
  public TDForm: boolean = false;
  private lngTercero: number = 0;
  private lngCuenta: number = 0;
  public CuotasPendientesCalculo: number = 0;
  public TipoCliente: number = 0;
  public ValidaPactado: boolean = true;
  public CancelaCreditoCartera: boolean = false;
  public CalculaCreditoCartera: boolean = false;
  public SaldoCancelaCredito: any;
  public InteresesCCancelaCredito: any;
  public InteresesMoraCancelaCredito: any;
  public DiferidosCancelaCredito: any;
  public CostasJudicialesCancelaCredito: any;
  public mostrardt: boolean = false;
  public DatosExtractoTD: any[] = [];
  public DatosMovimientoTD: any[] = [];
  public ExtractoTarjetaDebito: any[] = [];
  public objfull: Boolean = false;
  public valueSlect: any;
  public selectedEstadoCartera : any;
  public selectedyearCartera : any;
  public selectedmonthCartera : any;
  public ExtactoCartera!: FormGroup;
  public ExtactoCarteraTD!: FormGroup;
  public SelectErroneo: Boolean = false;
  public SelectmesErroneo: Boolean = false;
  public SelectanoErroneo: Boolean = false;
  public validaHijaTD: Boolean = false;
  public Extractos: any[] = [];
  public Movimientos: any[] = [];
  public HabilitaMensate: any = 0;
  public NoRegistros: any = 0;
  public Enero: any;
  public Febrero: any;
  public Marzo : any;
  public Abril : any;
  public Mayo : any;
  public Junio : any;
  public Julio : any;
  public Agosto : any;
  public Septiembre : any;
  public Octubre : any;
  public Noviembre : any;
  public Diciembre : any;
  public MesActual : any;
  public SelectMonthfirstOpen: Boolean = true;
  public SeleccionMonthOpen: any;
  public validaForm: Boolean = false;
  public validaAnoInicial: Boolean = false;
  public validaAnoFinal: Boolean = false;
  public validaMesInicial: Boolean = false;
  public validaMesFinal: Boolean = false;
  public SeleccionExt: number = 2;
  public yearInit: any;
  public yearEnd: any;
  public MesInit: any;
  public MesEnd: any;
  public yearInicial: any;
  public mesxYear: MesxYear[] = [];
  public mesxYearEnd: MesxYear[] = [];
  public mesInicial: any;
  public YearsxMes: any[] = [];
  public yearActual: any;
  public MostrarDetalleCartera: Boolean = false;
  public MostrarExtractoCartera: Boolean = false;
  public MostrarCalificacionCartera: Boolean = false;
  public MostrarCuentasHijas: Boolean = false;

  public SeleccionMovimientosCartera = [
    {
      "selector": "Movimientos",
      "value": 1
    },
    {
      "selector": "Extractos",
      "value": 2
    }
  ];
  public SeleccionMovimientosCarteraTD = [
    {
      "selector": "Movimientos",
      "value": 1
    },
    {
      "selector": "Extractos",
      "value": 2
    },
    {
      "selector": "Extracto cupo tarjeta",
      "value": 3
    }
  ];
  public arrayMesesCuenta = [
    {
      "selector": "--Seleccionar--",
      "value": 0
    }
  ];
  public SeleccionMesesCartera = [
    {
      "selector": "Enero",
      "value": 1
    },
    {
      "selector": "Febrero",
      "value": 2
    },
    {
      "selector": "Marzo",
      "value": 3
    },
    {
      "selector": "Abril",
      "value": 4
    },
    {
      "selector": "Mayo",
      "value": 5
    },
    {
      "selector": "Junio",
      "value": 6
    },
    {
      "selector": "Julio",
      "value": 7
    },
    {
      "selector": "Agosto",
      "value": 8
    },
    {
      "selector": "Septiembre",
      "value": 9
    },
    {
      "selector": "Octubre",
      "value": 10
    },
    {
      "selector": "Noviembre",
      "value": 11
    },
    {
      "selector": "Diciembre",
      "value": 12
    }
  ];

  //#endregion
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  public USERS = [
    {
      "id": 1,
      "name": "Leanne Graham",
      "email": "sincere@april.biz",
      "phone": "1-770-736-8031 x56442"
    },
    {
      "id": 2,
      "name": "Ervin Howell",
      "email": "shanna@melissa.tv",
      "phone": "010-692-6593 x09125"
    },
    {
      "id": 3,
      "name": "Clementine Bauch",
      "email": "nathan@yesenia.net",
      "phone": "1-463-123-4447",
    },
    {
      "id": 4,
      "name": "Patricia Lebsack",
      "email": "julianne@kory.org",
      "phone": "493-170-9623 x156"
    },
    {
      "id": 5,
      "name": "Chelsey Dietrich",
      "email": "lucio@annie.ca",
      "phone": "(254)954-1289"
    },
    {
      "id": 6,
      "name": "Mrs. Dennis",
      "email": "karley@jasper.info",
      "phone": "1-477-935-8478 x6430"
    }
  ];
  titulo = 'Generar PDF con Angular JS 5';
  constructor(private excelService: ExcelService,
    private notif: AlertService,
    private MiListaProductosService: MiListaProductosService, changeDetectorRef: ChangeDetectorRef,
    private loading: LoadingService) { }

  ngOnInit() {
    this.FormCarteraTag();
    this.FormExtracto();
    this.FormExtractoTD();
    this.CancelaCreditoCartera = false;
    this.CalculaCreditoCartera = false;
    this.HabilitaMensate == 0;
    this.ResumenAnual.length = 0;
    this.CalificaAnualmente12Mes = 0;
    this.LstResumenCalificaciones.length = 0;
    this.selectedEstadoCartera = "-";
    this.selectedyearCartera = "-";
    this.selectedmonthCartera = "-";
    this.NombreProducto = "";
    this.TipoProducto = "";
    this.ExtactoCartera.get('MovExtSelectorCartera')?.setValue('-');
    this.ExtactoCartera.get('MovExtYearCartera')?.setValue('-');
    this.ExtactoCartera.get('MovExtMonthCartera')?.setValue('-');

    this.ExtactoCarteraTD.get('MovExtSelectorCartera')?.setValue('-');
    this.ExtactoCarteraTD.get('MovExtYearCartera')?.setValue('-');
    this.ExtactoCarteraTD.get('MovExtMonthCartera')?.setValue('-');

  }

  generarEXCEL(): void {

  const sel1 = Number($(".SelectedMovimiento_Cartera").val());

  if (sel1 === 1) {

    const fechaInicio = $("#fechaInicartera").val();
    const fechaFin = $("#fechaendcartera").val();

    this.loading.show();

    this.MiListaProductosService
      .GenerarXlxsMovimientoCartera(
        this.lngCuenta,
        fechaInicio,
        fechaFin
      )
      .subscribe(
        result => {

          try {

            const base64 = result;

            const linkSource =
              `data:application/xlsx;base64,${base64}`;

            const downloadLink =
              document.createElement("a");

            const fileName =
              `Movimiento_${this.NumeroDocumento}.xlsx`;

            downloadLink.href = linkSource;
            downloadLink.download = fileName;

            downloadLink.click();

          } catch (e) {

            console.error(e);

            this.notif.onDanger(
              "Error",
              "No fue posible generar el archivo Excel."
            );

          } finally {

            this.loading.hide();
          }
        },
        error => {

          this.loading.hide();

          console.log(error);

          this.notif.onDanger(
            "Error",
            "Ocurrió un error al generar el archivo."
          );
        }
      );
  }

  const selec = Number($(".SelectedExtracto_Cartera").val());

  if (selec === 2) {

    const data = localStorage.getItem("Data");

    const dataLocalStorage = JSON.parse(
      window.atob(data != null ? data : "")
    );

    const yearInicial =
      Number($(".yearInit_Cartera").val());

    const yearFinal =
      Number($(".yearEnd_Cartera").val());

    const mesInicial =
      Number($(".MesInit_Cartera").val());

    const mesFinal =
      Number($(".MesEnd_Cartera").val());

    const fechaInicio =
      yearInicial + "-" + mesInicial + "-1";

    this.loading.show();

    this.MiListaProductosService
      .GenerarXlsxCartera(
        this.lngCuenta,
        fechaInicio,
        yearFinal,
        mesFinal,
        dataLocalStorage.Oficina
      )
      .subscribe(
        result => {

          try {

            const base64 = result;

            const linkSource =
              `data:application/xlsx;base64,${base64}`;

            const downloadLink =
              document.createElement("a");

            const fileName =
              `Extracto_${this.NumeroDocumento}.xlsx`;

            downloadLink.href = linkSource;
            downloadLink.download = fileName;

            downloadLink.click();

          } catch (e) {

            console.error(e);

            this.notif.onDanger(
              "Error",
              "No fue posible generar el archivo Excel."
            );

          } finally {

            this.loading.hide();
          }
        },
        error => {

          this.loading.hide();

          console.log(error);

          this.notif.onDanger(
            "Error",
            "Ocurrió un error al generar el archivo."
          );
        }
      );
  }
  }

  opcionSelectedFechasVidaTD(value : number) {
    var FechaInicio = $("#fechaInicarteraTD").val();
    var FechaFin = $("#fechaendcarteraTD").val();

    if (value == 1) {
      var numCaracteres = this.valueFechaInicial.length;
      if (numCaracteres == 10) {
        if (
          this.valueFechaInicial >= this.fechaAperturaCuenta &&
          this.valueFechaInicial <= this.fechaAperturaActualDisabled
        ) {
          if ( FechaFin != null && this.valueFechaInicial > FechaFin) {
            this.FechaMenorMayor = false;
            this.InicioVacida = false;
            this.inicioNoValida = false;
            this.FechaMayorAmenor = true;
            this.Extractos.length = 0;
            this.Movimientos.length = 0;
            this.DetallesMovimientosCartera.length = 0;
            this.DetallesExtractoCartera.length = 0;
            this.DatosExtractoTD.length = 0;
            this.DatosMovimientoTD.length = 0;
            this.ExtractoTarjetaDebito.length = 0;
            return 1;
          } else {
            this.inicioNoValida = false;
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = false;
            this.InicioVacida = false;
          }
        } else if ( FechaInicio != null &&
          FechaInicio < this.fechaAperturaCuenta || FechaInicio != null &&
          FechaInicio > this.fechaAperturaActualDisabled || FechaInicio != null && FechaFin != null &&
          FechaInicio > FechaFin
        ) {
          this.inicioNoValida = true;
          this.FechaMenorMayor = false;
          this.FechaMayorAmenor = false;
          this.FinVacida = false;
          this.Extractos.length = 0;
          this.Movimientos.length = 0;
          this.DetallesMovimientosCartera.length = 0;
          this.DetallesExtractoCartera.length = 0;
          this.DatosExtractoTD.length = 0;
          this.DatosMovimientoTD.length = 0;
          this.ExtractoTarjetaDebito.length = 0;

        } else {
          this.inicioNoValida = false;
          this.finNoValida = false;
          this.FechaMayorAmenor = false;
          this.FechaMenorMayor = false;
          this.FinVacida = false;
        }
      }

      //validar consulta fechas
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
            this.DetallesMovimientosCartera.length = 0;
            this.DetallesExtractoCartera.length = 0;
            this.DatosExtractoTD.length = 0;
            this.DatosMovimientoTD.length = 0;
            this.ExtractoTarjetaDebito.length = 0;
            return 1;
          } else {
            this.FinVacida = false;
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
          this.DetallesMovimientosCartera.length = 0;
          this.DetallesExtractoCartera.length = 0;
          this.DatosExtractoTD.length = 0;
          this.DatosMovimientoTD.length = 0;
          this.ExtractoTarjetaDebito.length = 0;

        } else {
          this.FinVacida = false;
          this.finNoValida = false;
          this.inicioNoValida = false;
          this.FechaMayorAmenor = false;
          this.FechaMenorMayor = false;
        }
      }
    }
    return null;
  }

  ConsultarExtracto() {

  const yearInicial = Number($(".yearInit_Cartera").val());
  const yearFinal = Number($(".yearEnd_Cartera").val());
  const MesInicial = Number($(".MesInit_Cartera").val());
  const MesFinal = Number($(".MesEnd_Cartera").val());
  const selExtracto = $(".SelectedExtracto_Cartera").val();

  if (selExtracto == '-') {

    this.SelectErroneo = true;
    this.validaAnoInicial = false;
    this.validaAnoFinal = false;
    this.validaMesInicial = false;
    this.validaMesFinal = false;

  } else if (yearInicial > yearFinal) {

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

  } else if (
    (MesInicial > MesFinal) &&
    yearInicial == yearFinal
  ) {

    this.validaAnoInicial = false;
    this.validaAnoFinal = false;
    this.validaMesInicial = true;
    this.validaMesFinal = false;
    this.SelectErroneo = false;

  } else if (
    (MesFinal < MesInicial) &&
    yearInicial == yearFinal
  ) {

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

    this.loading.show();

    const data = localStorage.getItem("Data");

    const dataLocalStorage = JSON.parse(
      window.atob(data != null ? data : "")
    );

    const FechaInicio =
      yearInicial + "-" + MesInicial + "-1";

    const Oficina =
      dataLocalStorage.Oficina;

    this.MiListaProductosService.getExtractosCartera(
      this.lngCuenta,
      FechaInicio,
      yearFinal,
      MesFinal,
      Oficina
    ).subscribe(
      result => {

        this.loading.hide();

        this.MapeaEncabezadoExtracto(result);

        if (result.Detalles !== null) {

          this.MiListaProductosService.GenerarPdfCartera(
            this.lngCuenta,
            FechaInicio,
            yearFinal,
            MesFinal,
            Oficina
          ).subscribe(
            resultPdf => {

              try {

                const pdfinBase64 =
                  resultPdf?.FileStream?._buffer;

                if (!pdfinBase64) {
                  throw new Error("PDF vacío.");
                }

                const byteArray = new Uint8Array(
                  atob(pdfinBase64)
                    .split('')
                    .map(char =>
                      char.charCodeAt(0)
                    )
                );

                const newBlob = new Blob(
                  [byteArray],
                  {
                    type: 'application/pdf'
                  }
                );

                this.linkPdf =
                  URL.createObjectURL(newBlob);

                const url =
                  window.URL.createObjectURL(
                    newBlob
                  );

                document
                  .getElementById('objepdfExtCartera')
                  ?.setAttribute("data", url);

                document
                  .getElementById('objepdfExtCartera')
                  ?.setAttribute(
                    "type",
                    "application/pdf"
                  );

                $("#objepdfExtCartera").show();
                $("#objepdfmovimientoCartera").hide();

              } catch (e) {

                console.error(
                  "Error procesando PDF",
                  e
                );

                this.notif.onDanger(
                  "Error",
                  "No fue posible visualizar el PDF."
                );
              }
            },
            error => {

              console.log(error);

              this.notif.onDanger(
                "Error",
                "Error generando el PDF."
              );
            }
          );

        } else {

          this.DetallesExtractoCartera.length = 0;
          this.DetallesMovimientosCartera.length = 0;
        }

        //#region Guarda log

        const dataLog = localStorage.getItem("Data");

        const dataLocalStorageLog = JSON.parse(
          window.atob(dataLog != null ? dataLog : "")
        );

        const LogMisProductosData =
          new LogMisProductos();

        const nuevoItem =
          new DatosProductos();

        LogMisProductosData.IdOficina =
          parseInt(
            dataLocalStorageLog.NumeroOficina
          );

        LogMisProductosData.IdModulo = 69;
        LogMisProductosData.IdOperacion = 50;
        LogMisProductosData.IdOpcion = 3;
        LogMisProductosData.IdTercero =
          this.lngTercero;

        LogMisProductosData.IdUsuarioERP =
          dataLocalStorageLog.IdUsuario;

        LogMisProductosData.IdCuenta =
          this.lngCuenta;

        nuevoItem.NumeroCuenta =
          result.Encabezado.Cuenta;

        nuevoItem.CuentaHija =
          this.validaHijaTD;

        nuevoItem.FechaInicial =
          yearInicial.toString() +
          "/" +
          MesInicial.toString();

        nuevoItem.FechaFinal =
          yearFinal.toString() +
          "/" +
          MesFinal.toString();

        LogMisProductosData.DatosProductos =
          nuevoItem;

        this.setLogMisProductos(
          LogMisProductosData
        );

        //#endregion
      },
      error => {

        this.loading.hide();

        console.log(error);

        this.notif.onDanger(
          "Error",
          "Error consultando el extracto."
        );
      }
    );
  }
  }

  SendMailSeguros() {
    if (this.validaPlantillla == true) {
      this.loading.show();
      var yearInicial = Number($(".yearInit_Cartera").val());
      var yearFinal = Number($(".yearEnd_Cartera").val());
      var MesInicial = Number($(".MesInit_Cartera").val());
      var MesFinal = Number($(".MesEnd_Cartera").val());
      let data = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(data != null ? data : ""));
      var Oficina = dataLocalStorage.Oficina;
      var FechaInicio = yearInicial + "-" + MesInicial + "-1";

      var Tercero = Number($("#TerceroPrincipal").val());

      this.MiListaProductosService.sendMailCartera(this.lngCuenta, "Coogranada",Oficina,this.NombreProducto,"Cartera",FechaInicio,yearFinal,MesFinal,null).subscribe(
        result => {
          this.loading.hide();
          this.Response(result);

          //#region Guarda log
          let data = localStorage.getItem("Data");
          var dataLocalStorage = JSON.parse(window.atob(data != null ? data : ""));
          var LogMisProductosData = new LogMisProductos();
          var nuevoItem = new DatosProductos();
          LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
          LogMisProductosData.IdModulo = 69;
          LogMisProductosData.IdOperacion = 50;
          LogMisProductosData.IdOpcion = 12; // Envio correo 
          LogMisProductosData.IdTercero = Tercero;
          LogMisProductosData.IdCuenta = this.lngCuenta
          LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
          nuevoItem.FechaInicial = "";
          nuevoItem.FechaFinal = "";
          LogMisProductosData.DatosProductos = nuevoItem;
          this.setLogMisProductos(LogMisProductosData);
          // #endregion
        },
        error => {
          this.loading.hide();
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
      this.loading.hide();
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

  SendMailCpM() {

    if (this.validaPlantillla == true) {
      this.loading.show();
      var yearInicial = Number($(".yearInit_Cartera").val());
      var yearFinal = Number($(".yearEnd_Cartera").val());
      var MesInicial = Number($(".MesInit_Cartera").val());
      var MesFinal = Number($(".MesEnd_Cartera").val());
      let data = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(data != null ? data : ""));
      var Oficina = dataLocalStorage.Oficina;
      var FechaInicio = yearInicial + "-" + MesInicial + "-1";

       var Tercero = Number($("#TerceroPrincipal").val());

      this.MiListaProductosService.sendMailCartera(this.lngCuenta, "Coogranada",Oficina,this.NombreProducto,"CarteraPadre",FechaInicio,yearFinal,MesFinal,null).subscribe(
        result => {
          this.loading.hide();
          this.Response(result);

          //#region Guarda log
          let data = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(data != null ? data : ""));
          var LogMisProductosData = new LogMisProductos();
          var nuevoItem = new DatosProductos();
          LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
          LogMisProductosData.IdModulo = 69;
          LogMisProductosData.IdOperacion = 50;
          LogMisProductosData.IdOpcion = 12; // Envio correo 
          LogMisProductosData.IdTercero = Tercero;
          LogMisProductosData.IdCuenta = this.lngCuenta
          LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
          nuevoItem.FechaInicial = "";
          nuevoItem.FechaFinal = "";
          LogMisProductosData.DatosProductos = nuevoItem;
          this.setLogMisProductos(LogMisProductosData);
          // #endregion
        },
        error => {
          this.loading.hide();
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
      this.loading.hide();
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

  opcionSelectedYearInit(year : string) {
    $(".yearInit_Cartera").val(Number(year));
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
        var AñoFinal = $(".yearEnd_Cartera").val();
        if (Number(year) > Number(AñoFinal)) {
          this.validaAnoInicial = true;
          this.validaAnoFinal = false;
          this.DatosExtractoTD.length = 0;
          this.DetallesExtractoCartera.length = 0;
          this.ExtractoTarjetaDebito.length = 0;
          return null;
        } else {
          this.validaAnoInicial = false;
          this.validaAnoFinal = false;
          setTimeout(() => {
            $(".MesInit_Cartera").prop('selectedIndex', 0);
          }, 400);
        }

        //#endregion
    console.log(this.mesxYear)
    return null;
  }

  ConsultaYears() {
    this.MiListaProductosService.ConsultarYearMes(this.lngCuenta).subscribe(
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

  MesSelected(mes : string) {
    $(".MesInit_Cartera").val(Number(mes));
    var AñoFinal = Number($(".yearEnd_Cartera").val());
    var añoInicial = Number($(".yearInit_Cartera").val());
    var mesFinal = $(".MesEnd_Cartera").val();
    if ((Number(mes) > Number(mesFinal)) && añoInicial == AñoFinal) {
      this.validaMesInicial = true;
      this.validaMesFinal = false;
      this.DatosExtractoTD.length = 0;
      this.DetallesExtractoCartera.length = 0;
      this.ExtractoTarjetaDebito.length = 0;
      return null;
    }  else {
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }
    return null;
  }

  seleccioneTodo() {
    $(".yearInit_Cartera").prop('selectedIndex', 0);
    $(".yearEnd_Cartera").prop('selectedIndex', 0);
    $(".MesInit_Cartera").prop('selectedIndex', 0);
    $(".MesEnd_Cartera").prop('selectedIndex', 0);
  }

  MesSelectedEnd(mes : string) {
    $(".MesEnd_Cartera").val(Number(mes));
    var mesInicial = $(".MesInit_Cartera").val();
    var AñoFinal = Number($(".yearEnd_Cartera").val());
    var añoInicial = Number($(".yearInit_Cartera").val());
    if ((Number(mes) < Number(mesInicial)) && AñoFinal == añoInicial) {
      this.validaMesFinal = true;
      this.validaMesInicial = false;
      this.DatosExtractoTD.length = 0;
      this.DetallesExtractoCartera.length = 0;
      this.ExtractoTarjetaDebito.length = 0;
      return null;
    } else {
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }
    return null;
  }

  opcionSelectedYearEnd(year : string) {
    var añoInicial = $(".yearInit_Cartera").val();
    $(".yearEnd_Cartera").val(Number(year));

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
    for (var index = MesFinal; index >= MesInicial; index--){
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
    //#region validaciones de campo
    if (Number(year) < Number(añoInicial)) {
      this.validaAnoFinal = true;
      this.validaAnoInicial = false;
      this.DatosExtractoTD.length = 0;
      this.DetallesExtractoCartera.length = 0;
      this.ExtractoTarjetaDebito.length = 0;
      return null;
    } else {
      this.validaAnoFinal = false;
      this.validaAnoInicial = false;
      setTimeout(() => {
        $(".MesEnd_Cartera").prop('selectedIndex', 0);
      }, 400);
    }
    //#endregion
    console.log(this.mesxYearEnd)
    return null;
  }

  opcionSelectedFechasCR(value : number) {
    var FechaFin = $("#fechaendcartera").val();
    var FechaInicio = $("#fechaInicartera").val();

    if (value == 1) {
      var numCaracteres = this.valueFechaInicial.length;
      if (numCaracteres == 10) {
        if (
          this.valueFechaInicial >= this.fechaAperturaCuenta &&
          this.valueFechaInicial <= this.fechaAperturaActualDisabled
        ) {
          if (FechaFin != null && this.valueFechaInicial > FechaFin) {
            this.FechaMenorMayor = false;
            this.InicioVacida = false;
            this.inicioNoValida = false;
            this.FechaMayorAmenor = true;
            this.Extractos.length = 0;
            this.Movimientos.length = 0;
            this.DetallesMovimientosCartera.length = 0;
            this.DetallesExtractoCartera.length = 0;
            this.DatosExtractoTD.length = 0;
            this.DatosMovimientoTD.length = 0;
            this.ExtractoTarjetaDebito.length = 0;
            return 1;
          } else {
            this.inicioNoValida = false;
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = false;
            this.InicioVacida = false;
          }
        } else if ( FechaInicio != null && 
          FechaInicio < this.fechaAperturaCuenta || FechaInicio != null && 
          FechaInicio > this.fechaAperturaActualDisabled || FechaInicio != null &&  FechaFin != null && 
          FechaInicio > FechaFin
        ) {
          this.inicioNoValida = true;
          this.FechaMenorMayor = false;
          this.FechaMayorAmenor = false;
          this.FinVacida = false;
          this.Extractos.length = 0;
          this.Movimientos.length = 0;
          this.DetallesMovimientosCartera.length = 0;
          this.DetallesExtractoCartera.length = 0;
          this.DatosExtractoTD.length = 0;
          this.DatosMovimientoTD.length = 0;
          this.ExtractoTarjetaDebito.length = 0;
        } else {
          this.inicioNoValida = false;
          this.finNoValida = false;
          this.FechaMayorAmenor = false;
          this.FechaMenorMayor = false;
          this.FinVacida = false;
        }
      }

      //validar consulta fechas
    } else if (value == 2) {
      var numCaracteresFin = this.valueFechaFinal.length;

      if (numCaracteresFin == 10) {
        if (
          this.valueFechaFinal <= this.fechaAperturaActualDisabled &&
          this.valueFechaFinal >= this.fechaAperturaCuenta
        ) {
          if ( FechaInicio != null && this.valueFechaFinal < FechaInicio) {
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = true;
            this.finNoValida = false;
            this.Extractos.length = 0;
            this.Movimientos.length = 0;
            this.DetallesMovimientosCartera.length = 0;
            this.DetallesExtractoCartera.length = 0;
            this.DatosExtractoTD.length = 0;
            this.DatosMovimientoTD.length = 0;
            this.ExtractoTarjetaDebito.length = 0;

            return 1;
          } else {
            this.FinVacida = false;
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
          this.DetallesMovimientosCartera.length = 0;
          this.DetallesExtractoCartera.length = 0;
          this.DatosExtractoTD.length = 0;
          this.DatosMovimientoTD.length = 0;
          this.ExtractoTarjetaDebito.length = 0;

        } else {
          this.FinVacida = false;
          this.finNoValida = false;
          this.inicioNoValida = false;
          this.FechaMayorAmenor = false;
          this.FechaMenorMayor = false;
        }
      }
    }
    return null;
  }

 generarPDF(): void {

  this.SelectionExtOrMov = Number(
    $(".SelectedMovimiento_Cartera").val()
  );

  const fechaInicio = $("#fechaInicartera").val();
  const fechaFin = $("#fechaendcartera").val();

  const selecMovimiento = Number(
    $(".SelectedMovimiento_Cartera").val()
  );

  if (selecMovimiento === 1) {

    this.loading.show();

    this.MiListaProductosService
      .GenerarPdfMovimientoCartera(
        this.lngCuenta,
        fechaInicio,
        fechaFin
      )
      .subscribe(
        result => {

          try {

            const base64 =
              result?.FileStream?._buffer;

            if (!base64) {
              throw new Error("PDF vacío");
            }

            const linkSource =
              `data:application/pdf;base64,${base64}`;

            const downloadLink =
              document.createElement("a");

            const fileName =
              `Movimiento_${this.NumeroDocumento}.pdf`;

            downloadLink.href = linkSource;
            downloadLink.download = fileName;

            downloadLink.click();

          } catch (e) {

            console.error(e);

            this.notif.onDanger(
              "Error",
              "No fue posible generar el PDF."
            );

          } finally {

            this.loading.hide();
          }
        },
        error => {

          this.loading.hide();

          console.log(error);

          this.notif.onDanger(
            "Error",
            "Ocurrió un error al generar el PDF."
          );
        }
      );
  }

  const selecExtracto = Number(
    $(".SelectedExtracto_Cartera").val()
  );

  if (selecExtracto === 2) {

    const data = localStorage.getItem("Data");

    const dataLocalStorage = JSON.parse(
      window.atob(data != null ? data : "")
    );

    const yearInicial =
      Number($(".yearInit_Cartera").val());

    const yearFinal =
      Number($(".yearEnd_Cartera").val());

    const mesInicial =
      Number($(".MesInit_Cartera").val());

    const mesFinal =
      Number($(".MesEnd_Cartera").val());

    const fechaInici =
      yearInicial + "-" + mesInicial + "-1";

    this.loading.show();

    this.MiListaProductosService
      .GenerarPdfCartera(
        this.lngCuenta,
        fechaInici,
        yearFinal,
        mesFinal,
        dataLocalStorage.Oficina
      )
      .subscribe(
        result => {

          try {

            const base64 =
              result?.FileStream?._buffer;

            if (!base64) {
              throw new Error("PDF vacío");
            }

            const linkSource =
              `data:application/pdf;base64,${base64}`;

            const downloadLink =
              document.createElement("a");

            const fileName =
              `Extracto_${this.NumeroDocumento}.pdf`;

            downloadLink.href = linkSource;
            downloadLink.download = fileName;

            downloadLink.click();

          } catch (e) {

            console.error(e);

            this.notif.onDanger(
              "Error",
              "No fue posible generar el PDF."
            );

          } finally {

            this.loading.hide();
          }
        },
        error => {

          this.loading.hide();

          console.log(error);

          this.notif.onDanger(
            "Error",
            "Ocurrió un error al generar el PDF."
          );
        }
      );
  }
}

  getCartera(tercero : any, numerodocumento : any) {
    this.NumeroDocumento = numerodocumento;
    this.SetlngTercero(tercero);
    this.MiListaProductosService.GetDataCartera(tercero).subscribe(
      result => {
        var ContComercial = 0;
        var ContConsumo = 0;
        var ContVivineda = 0;
        var ContEmpresarial = 0;
        var ContComercialCancela = 0;
        var ContConsumoCancela = 0;
        var ContVivinedaCancela = 0;
        var ContEmpresarialCancela = 0;
        if (result.CreditoComercial.length > 0) {
          for (var i = 0; i < result.CreditoComercial.length; i++) {
            if ((result.CreditoComercial[i].FechaCancela != null) && (result.CreditoComercial[i].Estado != "Anulada")) {
              this.CreditoComercialCancelados[ContComercialCancela] = result.CreditoComercial[i];
              ContComercialCancela++;
            } else if ((result.CreditoComercial[i].FechaCancela == null || result.CreditoComercial[i].FechaCancela == "")) {
              this.CreditoComercialActivos[ContComercial] = result.CreditoComercial[i];
              ContComercial++;
            }
          }
        }
        if (result.CreditoConsumo.length > 0) {
          for (var i = 0; i < result.CreditoConsumo.length; i++) {
            if ((result.CreditoConsumo[i].FechaCancela != null) && (result.CreditoConsumo[i].Estado != "Anulada")) {
              this.CreditoConsumoCancelados[ContConsumoCancela] = result.CreditoConsumo[i];
              ContConsumoCancela++;
            } else if ((result.CreditoConsumo[i].FechaCancela == null || result.CreditoConsumo[i].FechaCancela == "")) {
              this.CreditoConsumoActivos[ContConsumo] = result.CreditoConsumo[i];
              ContConsumo++;
            }
          }
        }
        if (result.CreditoVivienda.length > 0) {
          for (var i = 0; i < result.CreditoVivienda.length; i++) {
            if ((result.CreditoVivienda[i].FechaCancela != null) && (result.CreditoVivienda[i].Estado != "Anulada")) {
              this.CreditoViviendaCancelados[ContVivinedaCancela] = result.CreditoVivienda[i];
              ContVivinedaCancela++;
            } else if ((result.CreditoVivienda[i].FechaCancela == null || result.CreditoVivienda[i].FechaCancela == "")) {
              this.CreditoViviendaActivos[ContVivineda] = result.CreditoVivienda[i];
              ContVivineda++;
            }
          }
        }
        if (result.MicroCreditoEmp.length > 0) {
          for (var i = 0; i < result.MicroCreditoEmp.length; i++) {
            if ((result.MicroCreditoEmp[i].FechaCancela != null) && (result.MicroCreditoEmp[i].Estado != "Anulada")) {
              this.MicrocreditoEmpCancelados[ContEmpresarialCancela] = result.MicroCreditoEmp[i];
              ContEmpresarialCancela++;
            } else if ((result.MicroCreditoEmp[i].FechaCancela == null || result.MicroCreditoEmp[i].FechaCancela == "")) {
              this.MicrocreditoEmpActivos[ContEmpresarial] = result.MicroCreditoEmp[i];
              ContEmpresarial++;
            }
          }
        }

      }, error => {

      }
    )
  }

  getReetructuracionReliquidacion() {
    if ($("#ac-cr-8").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);
      this.MiListaProductosService.getReestructuracionReliquidacion(this.lngCuenta).subscribe(
        result => {
          var Reestr = 0;
          var Reli = 0;
          if (result.Reestructuracion !== null) {
            for (var i = 0; i < result.Reestructuracion.length; i++) {
              this.lstReestructuracion[Reestr] = result.Reestructuracion[i];
              Reestr++;
            }

          }
           if (result.Reliquidacion !== null) {
            for (var i = 0; i < result.Reliquidacion.length; i++) {
              this.lstReliquidacion[Reli] = result.Reliquidacion[i];
              Reli++;
            }

          }



        },
        error => {

        }
      )

    }


  }

  FormCarteraTag() {
    const Cuenta = new FormControl('', [Validators.required]);
    const Producto = new FormControl('', []);
    const Oficina = new FormControl('', []);
    const Estado = new FormControl('', []);
    const Linea = new FormControl('', []);
    const Pagare = new FormControl('', []);
    const Radicado = new FormControl('', []);
    const Asesor = new FormControl('', []);
    const AsesorExterno = new FormControl('', []);
    const covid19 = new FormControl('', []);
    //Saldos
    const AbonoCanje = new FormControl('', []);
    const InteresAnticipado = new FormControl('', []);
    const InteresContingente = new FormControl('', []);
    const SaldoProyectado = new FormControl('', []);
    const CoutasPagas = new FormControl('', []);
    const CapitalMora = new FormControl('', []);
    const InteresCorriente = new FormControl('', []);
    const SaldoCapital = new FormControl('', []);
    const CoutasPendientes = new FormControl('', []);
    const InteresCorrienteMora = new FormControl('', []);
    const TotalInteres = new FormControl('', []);
    const SaldoDeuda = new FormControl('', []);
    const CoutasMora = new FormControl('', []);
    const InteresMora = new FormControl('', []);

    // Datos
    const Sistema = new FormControl('', []);
    const PeriodoCapital = new FormControl('', []);
    const PeriodoInteres = new FormControl('', []);
    const Plazo = new FormControl('', []);
    const Garantia = new FormControl('', []);
    const TipoGarantia = new FormControl('', []);
    const Monto = new FormControl('', []);
    const Cuota = new FormControl('', []);
    const PeriodoGracia = new FormControl('', []);
    const FormaPago = new FormControl('', []);
    const EstadoDatos = new FormControl('', []);
    const CuotaLibranza = new FormControl('', []);

    const TasaPeriodicaL = new FormControl('', []);
    const TasaPeriodicaP = new FormControl('', []);

    const TasaPactada = new FormControl('', []);
    const TasaLiquidada = new FormControl('', []);

    const EfecticaPactada = new FormControl('', []);
    const EfectivaLiquidada = new FormControl('', []);

    const CuotasMoraPre = new FormControl('', []);
    const VecesPre = new FormControl('', []);
    const SaldoCapitalPre = new FormControl('', []);
    const FechaMatriculaPre = new FormControl('', []);
    const FechaRetiroPre = new FormControl('', []);
    const EstadoJuridico = new FormControl('', []);
    const Abogado = new FormControl('', []);
    const SaldoJuridico = new FormControl('', []);
    const CostasJudiciales = new FormControl('', []);
    const CuotasMoraJuridico = new FormControl('', []);
    const VecesJuridico = new FormControl('', []);
    const FechaMatriculaJuridico = new FormControl('', []);
    const FechaRetiroJuridico = new FormControl('', []);
    const IntMoraCastigo = new FormControl('', []);
    const CorrientesCatigo = new FormControl('', []);
    const SaldoCapitalCastigo = new FormControl('', []);
    const CostasJudicialesCastigo = new FormControl('', []);
    const FechaCastigo = new FormControl('', []);
    const NumNombreJuzgado = new FormControl('', []);
    //
    const AperturaF = new FormControl('', []);
    const UltTransaccionF = new FormControl('', []);
    const VencimientoF = new FormControl('', []);
    const CancelacionF = new FormControl('', []);
    const CambioFechaPago = new FormControl('', []);
    const InicioPeriodoGracia = new FormControl('', []);
    const CartaPrejuridico = new FormControl('', []);
    const EntradaPrejuridico = new FormControl('', []);
    const ProximoPago = new FormControl('', []);
    const ContingenciaF = new FormControl('', []);
    const CambioTasa = new FormControl('', []);
    const CancelaCredito = new FormControl('', []);
    const ACuotas = new FormControl('', []);
    const NCoutas = new FormControl('', []);
    //CalculaCuota
    const TotalCapitalCC = new FormControl('', []);
    const TotalInteresCC = new FormControl('', []);
    const TotalMoraCC = new FormControl('', []);
    const ToltalDiferidosCC = new FormControl('', []);
    const ToltalaPagarCC = new FormControl('', []);
    //Cuentas Hijas
    const CuentaPadre = new FormControl('', []);
    const CuentasHijasActiva = new FormControl('', []);
    const CuentasHijasCanceladas = new FormControl('', []);


    //boton Resumen
    const TotalCreComerciaCartera = new FormControl('', []);
    const TotalCreConsumoCartera = new FormControl('', []);
    const TotalMicroEmpCartera = new FormControl('', []);
    const TotalCreViviendaCartera = new FormControl('', []);
    //saldos totales cuenta padres
    const AbonoCanjeTotal = new FormControl('', []);
    const InteresAnticipadoTotal = new FormControl('', []);
    const InteresContigenciaTotal = new FormControl('', []);
    const SaldoProyectadoCP = new FormControl('', []);
    const SaldoCapitalCP = new FormControl('', []);
    const CapitalMoraCP = new FormControl('', []);
    const InteresCorrienteCP = new FormControl('', []);
    const TotalInteresesCP = new FormControl('', []);
    const SaldoDeudaCP = new FormControl('', []);
    const InteresMoraCP = new FormControl('', []);
    //Cupos Creditos Comunes
    const NumeroCupoCN = new FormControl('', []);
    const CupoAprobadoCN = new FormControl('', []);
    const CupoUtilizadoCN = new FormControl('', []);
    const CupoDisponibleCN = new FormControl('', []);
    const DtmMatriculaCN = new FormControl('', []);
    const DtmAprobacionCupo = new FormControl('', []);
    const DtmVencimientoCN = new FormControl('', []);
    const DtmRetiroCN = new FormControl('', []);
    const DtmActualizacionCN = new FormControl('', []);
    const DtmDocumentacionCN = new FormControl('', []);
    const BloqueosCN = new FormControl('', []);

    //Cupos Creditos TD
    const CupoAprobadoTD = new FormControl('', []);
    const CupoUtilizadoTD = new FormControl('', []);
    const CupoDisponibleTD = new FormControl('', []);
    const DtmFechaDocumentacionTD = new FormControl('', []);

    const DtmFechaDocumentacionTD_ = new FormControl('', []);
    const DtmFechaUltimaTd = new FormControl('', []);

    const DtmAperturaTD = new FormControl('', []);
    const DtmCancelacionTd = new FormControl('', []);




    //btnSeguro
    const btnSeguro = new FormControl('', []);

    const chkReestructurado = new FormControl('', []);
    const chkReliquidado = new FormControl('', []);
    const chkAbogado = new FormControl('', []);
    const chkCastigada = new FormControl('', []);




    this.CarteraForm = new FormGroup({
      Cuenta: Cuenta,
      Producto: Producto,
      Estado: Estado,
      Oficina: Oficina,
      Linea: Linea,
      Pagare: Pagare,
      Radicado: Radicado,
      Asesor: Asesor,
      AsesorExterno: AsesorExterno,
      covid19: covid19,
      //Saldos
      AbonoCanje: AbonoCanje,
      InteresAnticipado: InteresAnticipado,
      InteresContingente: InteresContingente,
      SaldoProyectado: SaldoProyectado,
      CoutasPagas: CoutasPagas,
      CapitalMora: CapitalMora,
      InteresCorriente: InteresCorriente,
      SaldoCapital: SaldoCapital,
      CoutasPendientes: CoutasPendientes,
      InteresCorrienteMora: InteresCorrienteMora,
      TotalInteres: TotalInteres,
      SaldoDeuda: SaldoDeuda,
      CoutasMora: CoutasMora,
      InteresMora: InteresMora,
      //Datos
      Sistema: Sistema,
      PeriodoCapital: PeriodoCapital,
      PeriodoInteres: PeriodoInteres,
      Plazo: Plazo,
      Garantia: Garantia,
      TipoGarantia: TipoGarantia,
      Monto: Monto,
      Cuota: Cuota,
      PeriodoGracia: PeriodoGracia,
      FormaPago: FormaPago,
      EstadoDatos: EstadoDatos,
      CuotaLibranza: CuotaLibranza,

      TasaPeriodicaL: TasaPeriodicaL,
      TasaPeriodicaP: TasaPeriodicaP,
      TasaPactada: TasaPactada,
      TasaLiquidada: TasaLiquidada,
      EfectivaPactada: EfecticaPactada,
      EfectivaLiquidada: EfectivaLiquidada,
      //Cobros
      CuotasMoraPre: CuotasMoraPre,
      VecesPre: VecesPre,
      SaldoCapitalPre: SaldoCapitalPre,
      FechaMatriculaPre: FechaMatriculaPre,
      FechaRetiroPre: FechaRetiroPre,
      EstadoJuridico: EstadoJuridico,
      Abogado: Abogado,
      SaldoJuridico: SaldoJuridico,
      CostasJudiciales: CostasJudiciales,
      CuotasMoraJuridico: CuotasMoraJuridico,
      VecesJuridico: VecesJuridico,
      FechaMatriculaJuridico: FechaMatriculaJuridico,
      FechaRetiroJuridico: FechaRetiroJuridico,
      IntMoraCastigo: IntMoraCastigo,
      CorrientesCatigo: CorrientesCatigo,
      SaldoCapitalCastigo: SaldoCapitalCastigo,
      CostasJudicialesCastigo: CostasJudicialesCastigo,
      FechaCastigo: FechaCastigo,
      NumNombreJuzgado: NumNombreJuzgado,

      //FechasCartera
      AperturaF: AperturaF,
      UltTransaccionF: UltTransaccionF,
      VencimientoF: VencimientoF,
      CancelacionF: CancelacionF,
      CambioFechaPago: CambioFechaPago,
      InicioPeriodoGracia: InicioPeriodoGracia,
      CartaPrejuridico: CartaPrejuridico,
      EntradaPrejuridico: EntradaPrejuridico,
      ProximoPago: ProximoPago,
      ContingenciaF: ContingenciaF,
      CambioTasa: CambioTasa,
      CancelaCredito: CancelaCredito,
      ACuotas: ACuotas,
      NCoutas: NCoutas,
      //CalculaCuota
      TotalCapitalCC: TotalCapitalCC,
      TotalInteresCC: TotalInteresCC,
      TotalMoraCC: TotalMoraCC,
      ToltalDiferidosCC: ToltalDiferidosCC,
      ToltalaPagarCC: ToltalaPagarCC,
      //cuentas hijas
      CuentaPadre: CuentaPadre,
      CuentasHijasActiva: CuentasHijasActiva,
      CuentasHijasCanceladas: CuentasHijasCanceladas,
      //boton resumen
      TotalCreComerciaCartera: TotalCreComerciaCartera,
      TotalCreConsumoCartera: TotalCreConsumoCartera,
      TotalMicroEmpCartera: TotalMicroEmpCartera,
      TotalCreViviendaCartera: TotalCreViviendaCartera,
      //Totales Cuenta Padre
      AbonoCanjeTotal: AbonoCanjeTotal,
      InteresAnticipadoTotal: InteresAnticipadoTotal,
      InteresContigenciaTotal: InteresContigenciaTotal,
      SaldoProyectadoCP: SaldoProyectadoCP,
      SaldoCapitalCP: SaldoCapitalCP,
      CapitalMoraCP: CapitalMoraCP,
      InteresCorrienteCP: InteresCorrienteCP,
      TotalInteresesCP: TotalInteresesCP,
      SaldoDeudaCP: SaldoDeudaCP,
      InteresMoraCP: InteresMoraCP,
      //Cupos creditos comunes
      NumeroCupoCN: NumeroCupoCN,
      CupoAprobadoCN: CupoAprobadoCN,
      CupoUtilizadoCN: CupoUtilizadoCN,
      CupoDisponibleCN: CupoDisponibleCN,
      DtmMatriculaCN: DtmMatriculaCN,
      DtmAprobacionCupo: DtmAprobacionCupo,
      DtmVencimientoCN: DtmVencimientoCN,
      DtmRetiroCN: DtmRetiroCN,
      DtmActualizacionCN: DtmActualizacionCN,
      DtmDocumentacionCN: DtmDocumentacionCN,
      BloqueosCN: BloqueosCN,
      // cupos creditos TD
      CupoAprobadoTD: CupoAprobadoTD,
      CupoUtilizadoTD: CupoUtilizadoTD,
      CupoDisponibleTD: CupoDisponibleTD,
      DtmFechaDocumentacionTD: DtmFechaDocumentacionTD,
      DtmAperturaTD: DtmAperturaTD,
      DtmCancelacionTd: DtmCancelacionTd,
      DtmFechaDocumentacionTD_: DtmFechaDocumentacionTD_,
      DtmFechaUltimaTd: DtmFechaUltimaTd,

      btnSeguro: btnSeguro,
      chkReestructurado: chkReestructurado,
      chkReliquidado: chkReliquidado,
      chkAbogado: chkAbogado,
      chkCastigada: chkCastigada
    });
  }

  getFechasCartera() {
    if ($("#ac-cr-9").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-3").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);
      this.MiListaProductosService.getFechasCartera(this.lngCuenta).subscribe(
        result => {
          if (result !== null) {
            this.CarteraForm.get('AperturaF')?.setValue(result.Apertura);
            this.CarteraForm.get('UltTransaccionF')?.setValue(result.UltTransaccion);
            this.CarteraForm.get('VencimientoF')?.setValue(result.Vencimiento);
            this.CarteraForm.get('CancelacionF')?.setValue(result.Cancelacion);
            this.CarteraForm.get('CambioFechaPago')?.setValue(result.CambioFechaPago);
            this.CarteraForm.get('InicioPeriodoGracia')?.setValue(result.InicioPeriodoGracia);
            this.CarteraForm.get('CartaPrejuridico')?.setValue(result.CartaPrejuridico);
            this.CarteraForm.get('EntradaPrejuridico')?.setValue(result.EntradaPrejuridico);
            this.CarteraForm.get('ProximoPago')?.setValue(result.ProximoPago);
            this.CarteraForm.get('ContingenciaF')?.setValue(result.Contingencia);
            this.CarteraForm.get('CambioTasa')?.setValue(result.CambioTasa);
          }

        },
        error => {
        }
      )
    }

    if ($("#ac-cr-119").prop("checked")) {

      $("#ac-cr-112").prop("checked", false);
      $("#ac-cr-110").prop("checked", false);
      $("#ac-cr-100").prop("checked", false);
      $("#ac-cr-101").prop("checked", false);
      $("#ac-cr-315").prop("checked", false);

      this.MiListaProductosService.getFechasCartera(this.lngCuenta).subscribe(
        result => {
          if (result !== null) {
            this.CarteraForm.get('AperturaF')?.setValue(result.Apertura);
            this.CarteraForm.get('UltTransaccionF')?.setValue(result.UltTransaccion);
            this.CarteraForm.get('VencimientoF')?.setValue(result.Vencimiento);
            this.CarteraForm.get('CancelacionF')?.setValue(result.Cancelacion);
            this.CarteraForm.get('CambioFechaPago')?.setValue(result.CambioFechaPago);
            this.CarteraForm.get('InicioPeriodoGracia')?.setValue(result.InicioPeriodoGracia);
            this.CarteraForm.get('CartaPrejuridico')?.setValue(result.CartaPrejuridico);
            this.CarteraForm.get('EntradaPrejuridico')?.setValue(result.EntradaPrejuridico);
            this.CarteraForm.get('ProximoPago')?.setValue(result.ProximoPago);
            this.CarteraForm.get('ContingenciaF')?.setValue(result.Contingencia);
            this.CarteraForm.get('CambioTasa')?.setValue(result.CambioTasa);
            this.CarteraForm.get('DtmFechaUltimaTd')?.setValue(result.dtmUltimaTransTD);
            this.CarteraForm.get('DtmFechaDocumentacionTD_')?.setValue(result.dtmDoumentaTD);
          }
        },
        error => {
        }
      )
    }





  }

  DetallesCartera(data : any, cuentahija?: number) {
    this.ValidaNoAplicaHija = false;
    $("#MinimizarTD").click();
    this.ValidaPactado = false;
    if (data.Tcuenta === 1) {
      if (data.TieneCupo) {
        this.validaCuentaNormalCupo = true;
        this.ValidaTarjetaDebito = false;
        this.validaHija = false;
      } else {
        this.validaCuentaNormalCupo = false;
      }
    } else {
      this.validaCuentaNormalCupo = false;
    }

    if (data.Tcuenta === 2) {
      this.ValidaTarjetaDebito = true;
      this.validaCuentaNormalCupo = false;
      this.validaHija = false;
    } else {
      this.ValidaTarjetaDebito = false;
    }

    if (data.Tcuenta === 3) {
      this.validaHija = true;
      this.ValidaTarjetaDebito = false;
      this.validaCuentaNormalCupo = false;
      this.ValidaNoAplicaHija = true;
    } else {
      this.validaHija = false;
    }// prueba



    this.CarteraForm.get('Cuenta')?.setValue(data.Cuenta);
    this.CarteraForm.get('Producto')?.setValue(data.NombreProducto);
    this.CarteraForm.get('Oficina')?.setValue(data.Oficina);
    this.CarteraForm.get('Estado')?.setValue(data.Estado);
    this.CarteraForm.get('Linea')?.setValue(data.Linea);
    this.CarteraForm.get('Pagare')?.setValue(data.Pagare);
    this.CarteraForm.get('Radicado')?.setValue(data.radicado);
    this.CarteraForm.get('Asesor')?.setValue(data.Asesor);
    this.CarteraForm.get('AsesorExterno')?.setValue(data.AsesorExerno);
    this.CarteraForm.get('covid19')?.setValue(data.Marcaccion);
    this.lngCuenta = data.lngcuenta;
    this.CuotasPendientesCalculo = data.CuotasPendientes;




    this.MiListaProductosService.SetCheckCartera(this.lngCuenta).subscribe(
      result => {
        this.CarteraForm.get('chkReestructurado')?.setValue(result.Reestructurado);
        this.CarteraForm.get('chkReliquidado')?.setValue(result.Reliquidado);
        this.CarteraForm.get('chkAbogado')?.setValue(false);
        this.CarteraForm.get('chkCastigada')?.setValue(result.Catigada);
      },
      error => {
      }
    )
    this.MiListaProductosService.getDatosCartera(this.lngCuenta).subscribe(
      result => {
        this.CarteraForm.get('btnSeguro')?.setValue(result.ChecSeguro);
      },
      error => {

      }
    )



    //#region Guarda log
    let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas != null ? datas : ""));
    var LogMisProductosData = new LogMisProductos();
    var nuevoItem = new DatosProductos();
    if (cuentahija == 1) {
      nuevoItem.CuentaHija = true;
    }
    LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
    LogMisProductosData.IdModulo = 69;
    LogMisProductosData.IdOperacion = 50;
    LogMisProductosData.IdOpcion = 1; // Detalle
    LogMisProductosData.IdTercero = this.lngTercero;
    LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
    LogMisProductosData.IdCuenta = data.lngcuenta;
    nuevoItem.NumeroCuenta = this.CarteraForm.get("Cuenta")?.value;
    nuevoItem.FechaInicial = "";
    nuevoItem.FechaFinal = "";
    LogMisProductosData.DatosProductos = nuevoItem;
    this.setLogMisProductos(LogMisProductosData);
    // #endregion

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

  CerrarAcordeones(data : number) {
    switch (data) {
      case 0: {
        $("#ac-1c").prop("checked", false);
        $("#ac-2c").prop("checked", false);
        $("#ac-3c").prop("checked", false);
        break;
      }
      case 1: {
        $("#ac-0c").prop("checked", false);
        $("#ac-2c").prop("checked", false);
        $("#ac-3c").prop("checked", false);
        break;
      }
      case 2: {
        $("#ac-0c").prop("checked", false);
        $("#ac-1c").prop("checked", false);
        $("#ac-3c").prop("checked", false);
        break;
      }
      case 3: {
        $("#ac-0c").prop("checked", false);
        $("#ac-2c").prop("checked", false);
        $("#ac-1c").prop("checked", false);
        break;
      }
      default: {
        $("#ac-0c").prop("checked", false);
        $("#ac-2c").prop("checked", false);
        $("#ac-1c").prop("checked", false);
        $("#ac-3c").prop("checked", false);
        break;
      }
    }
  }
  
  ListaReferencias() {
    this.ReferenciasFamPer.length = 0;
    this.ReferencasFinCom.length = 0;

    if ($("#ac-cr-10").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-3").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);


      this.MiListaProductosService.GetReferenciasCartera(this.lngTercero, this.TipoCliente).subscribe(
        result => {
          var refFam = 0;
          var refCom = 0;
          for (var i = 0; i < result.length; i++) {

            if (this.TipoCliente === 0 && (result[i].TipoReferencia === 4 || result[i].TipoReferencia === 2)) {
              this.ReferenciasFamPer[refFam] = result[i];
              refFam++;
            }

            if (this.TipoCliente === 0 && (result[i].TipoReferencia === 1 || result[i].TipoReferencia === 3)) {
              this.ReferencasFinCom[refCom] = result[i];
              refCom++;
            }

            if (this.TipoCliente === 1 && (result[i].TipoReferencia === 1)) {
              this.ReferenciasFamPer[refFam] = result[i];
              refFam++;
            }

            if (this.TipoCliente === 1 && (result[i].TipoReferencia === 3)) {
              this.ReferencasFinCom[refCom] = result[i];
              refCom++;
            }

          }
        },
        error => {

        }
      )
    }


    if ($("#ac-cr-110").prop("checked")) {
      $("#ac-cr-112").prop("checked", false);
      $("#ac-cr-100").prop("checked", false);
      $("#ac-cr-315").prop("checked", false);
      $("#ac-cr-119").prop("checked", false);
      $("#ac-cr-101").prop("checked", false);

      this.MiListaProductosService.GetReferenciasCartera(this.lngTercero,this.TipoCliente).subscribe(
        result => {
          var refFam = 0;
          var refCom = 0;
          for (var i = 0; i < result.length; i++) {

            // if ((result[i].TipoReferencia === 4) || (result[i].TipoReferencia === 2)) {
            //   this.ReferenciasFamPer[refFam] = result[i];
            //   refFam++;
            // } else if ((result[i].TipoReferencia === 1) || (result[i].TipoReferencia === 3)) {
            //   this.ReferencasFinCom[refCom] = result[i];
            //   refCom++
            // }

            if (this.TipoCliente === 0 && (result[i].TipoReferencia === 4 || result[i].TipoReferencia === 2)) {
              this.ReferenciasFamPer[refFam] = result[i];
              refFam++;
            }

            if (this.TipoCliente === 0 && (result[i].TipoReferencia === 1 || result[i].TipoReferencia === 3)) {
              this.ReferencasFinCom[refCom] = result[i];
              refCom++;
            }

            if (this.TipoCliente === 1 && (result[i].TipoReferencia === 1)) {
              this.ReferenciasFamPer[refFam] = result[i];
              refFam++;
            }

            if (this.TipoCliente === 1 && (result[i].TipoReferencia === 3)) {
              this.ReferencasFinCom[refCom] = result[i];
              refCom++;
            }


          }
        },
        error => {

        }
      )
    }


  }

  ListaCodeudores() {
    if ($("#ac-cr-3").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);
      this.lstCodeudores.length = 0;
      this.lstGarantias.length = 0;
      this.MiListaProductosService.GetGarantiaCodeudorCuenta(this.lngCuenta).subscribe(
        result => {
          var cod = 0;
          var Gar = 0;
          if (result.lstCodeudores !== null) {
            for (var i = 0; i < result.lstCodeudores.length; i++) {
              this.lstCodeudores[cod] = result.lstCodeudores[i];
              cod++;
            }
          }

          if (result.lstGarantiaReal !== null) {
            for (var i = 0; i < result.lstGarantiaReal.length; i++) {
              this.lstGarantias[Gar] = result.lstGarantiaReal[i];
              Gar++;
            }
          }
        },
        error => {

        }
      )
    }

    if ($("#ac-cr-315").prop("checked")) {

      $("#ac-cr-112").prop("checked", false);
      $("#ac-cr-110").prop("checked", false);
      $("#ac-cr-100").prop("checked", false);
      $("#ac-cr-119").prop("checked", false);
      $("#ac-cr-101").prop("checked", false);

      this.lstGarantias.length = 0;
      this.lstCodeudores.length = 0;
      this.MiListaProductosService.GetGarantiaCodeudorCuenta(this.lngCuenta).subscribe(
        result => {
          var cod = 0;
          var Gar = 0;
          if (result.lstCodeudores !== null) {
            for (var i = 0; i < result.lstCodeudores.length; i++) {
              this.lstCodeudores[cod] = result.lstCodeudores[i];
              cod++;
            }
          }

          if (result.lstGarantiaReal !== null) {
            for (var i = 0; i < result.lstGarantiaReal.length; i++) {
              this.lstGarantias[Gar] = result.lstGarantiaReal[i];
              Gar++;
            }
          }
        },
        error => {

        }
      )
    }

  }

  ListaDiferidos() {
    if ($("#ac-cr-4").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-3").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);
      this.lstDeducibles.length = 0;
      this.MiListaProductosService.getlstDiferidos(this.lngCuenta).subscribe(
        result => {
          var dif = 0;
          if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
              this.lstDeducibles[dif] = result[i];
              dif++;
            }
          }
        },
        error => {
        }
      )
    }

  }

  getCobrosCartera() {
    if ($("#ac-cr-7").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-3").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);
      this.MiListaProductosService.getCobrosCartera(this.lngCuenta).subscribe(
        result => {
          if (result.Prejuridicos !== null) {
            this.CarteraForm.get('CuotasMoraPre')?.setValue(result.Prejuridicos.CoutasMora);
            this.CarteraForm.get('VecesPre')?.setValue(result.Prejuridicos.Veces);
            this.carteraInfo.SaldoCapitalPre = result.Prejuridicos.SaldoCapital;
            this.CarteraForm.get('FechaMatriculaPre')?.setValue(result.Prejuridicos.FechaMatricula);
            this.CarteraForm.get('FechaRetiroPre')?.setValue(result.Prejuridicos.FechaRetiro);
          } else {
            this.carteraInfo.SaldoCapitalPre = 0;
          }
          if (result.Juridicos !== null) {
            this.CarteraForm.get('EstadoJuridico')?.setValue(result.Juridicos.Estado);
            this.CarteraForm.get('Abogado')?.setValue(result.Juridicos.Abogado);
            // this.CarteraForm.get('SaldoJuridico')?.setValue(result.Juridicos.Saldo);
            this.carteraInfo.SaldoJuridico = result.Juridicos.Saldo;
            this.carteraInfo.CostasJudiciales = result.Juridicos.CostasJudiciales;
            this.CarteraForm.get('CuotasMoraJuridico')?.setValue(result.Juridicos.CoutasMora);
            this.CarteraForm.get('VecesJuridico')?.setValue(result.Juridicos.Veces);
            this.CarteraForm.get('FechaMatriculaJuridico')?.setValue(result.Juridicos.FechaMatricula);
            this.CarteraForm.get('FechaRetiroJuridico')?.setValue(result.Juridicos.FechaRetiro);//
            this.CarteraForm.get('NumNombreJuzgado')?.setValue(result.Juridicos.Juzgado);
          } else {
            this.carteraInfo.SaldoJuridico = 0;
            this.carteraInfo.CostasJudiciales = 0;
          }
          if (result.Castigos !== null) {
            this.carteraInfo.IntMoraCastigo = result.Castigos.IntMora;
            this.carteraInfo.CorrientesCatigo = result.Castigos.Corrientes;
            this.carteraInfo.SaldoCapitalCastigo = result.Castigos.SaldoCapital;
            this.carteraInfo.CostasJudicialesCastigo = result.Castigos.CostasJudiciales;
            this.CarteraForm.get('FechaCastigo')?.setValue(result.Castigos.FechaCastigo);
          } else {
            this.carteraInfo.IntMoraCastigo = 0;
            this.carteraInfo.CorrientesCatigo = 0;
            this.carteraInfo.SaldoCapitalCastigo = 0;
            this.carteraInfo.CostasJudicialesCastigo = 0;
            //validar por ultima vez cartera ojito
          }
        },
        error => {
        }
      )

    }

  }

  obtieneCalificacion() {
    if ($("#ac-cr-5").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-3").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);
      this.MiListaProductosService.getCalificacion(this.lngCuenta).subscribe(
        result => {

          var cal = 0;
          var ancal = 0;
          for (var i = 0; i < result.Calificacion.length; i++) {
            this.lstCalificacion[cal] = result.Calificacion[i];
            cal++;
          }
          for (var i = 0; i < result.Analisis.length; i++) {
            this.lstAnalisisCalificacion[ancal] = result.Analisis[i];
            ancal++;
          }
        },
        error => {
        }
      )

    }

  }
  obtieneDatosCuenta() {
    if ($("#ac-cr-1").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-3").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);

      this.MiListaProductosService.getDatosCartera(this.lngCuenta).subscribe(
        result => {
          this.CarteraForm.get('Sistema')?.setValue(result.Sistema);
          this.CarteraForm.get('PeriodoCapital')?.setValue(result.PeriodoCapital);
          this.CarteraForm.get('PeriodoInteres')?.setValue(result.PeriodoInteres);
          this.CarteraForm.get('Plazo')?.setValue(result.Plazo);
          this.CarteraForm.get('Garantia')?.setValue(result.Garantia);
          this.CarteraForm.get('TipoGarantia')?.setValue(result.TipoGarantia);

          this.carteraInfo.Monto = result.Monto;
          this.carteraInfo.Cuota = result.Cuota;

          this.CarteraForm.get('PeriodoGracia')?.setValue(result.PeriodoGracia);
          this.CarteraForm.get('FormaPago')?.setValue(result.FormaPago);
          this.CarteraForm.get('EstadoDatos')?.setValue(result.Estado);

          this.carteraInfo.CuotaLibranza = result.CuotaLibranza;

          this.CarteraForm.get('TasaPeriodicaL')?.setValue(result.TasaPeriodicaL);
          this.CarteraForm.get('TasaLiquidada')?.setValue(result.TasaLiquidada);
          this.CarteraForm.get('EfectivaLiquidada')?.setValue(result.TasaEfectivaL);
          this.CarteraForm.get('TasaPeriodicaP')?.setValue(result.TasaPeriodicaP);
          this.CarteraForm.get('TasaPactada')?.setValue(result.TasaPactada);
          this.CarteraForm.get('EfectivaPactada')?.setValue(result.TasaEfectivaP);
          this.CarteraForm.get('btnSeguro')?.setValue(result.ChecSeguro);
          this.CarteraForm.get('covid19')?.setValue(result.Marcaccion);
        },
        error => {

        }
      )



    }
    if ($("#ac-cr-101").prop("checked")) {
      $("#ac-cr-112").prop("checked", false);
      $("#ac-cr-110").prop("checked", false);
      $("#ac-cr-100").prop("checked", false);
      $("#ac-cr-315").prop("checked", false);
      $("#ac-cr-119").prop("checked", false);

      this.MiListaProductosService.getDatosCartera(this.lngCuenta).subscribe(
        result => {
          this.CarteraForm.get('Sistema')?.setValue(result.Sistema);
          this.CarteraForm.get('PeriodoCapital')?.setValue(result.PeriodoCapital);
          this.CarteraForm.get('PeriodoInteres')?.setValue(result.PeriodoInteres);
          this.CarteraForm.get('Plazo')?.setValue(result.Plazo);
          this.CarteraForm.get('Garantia')?.setValue(result.Garantia);
          this.CarteraForm.get('TipoGarantia')?.setValue(result.TipoGarantia);
          this.carteraInfo.Monto = result.Monto;
          this.carteraInfo.Cuota = result.Cuota;
          this.CarteraForm.get('PeriodoGracia')?.setValue(result.PeriodoGracia);
          this.CarteraForm.get('FormaPago')?.setValue(result.FormaPago);
          this.CarteraForm.get('EstadoDatos')?.setValue(result.Estado);
          this.carteraInfo.CuotaLibranza = result.CuotaLibranza;
          this.CarteraForm.get('TasaPeriodicaL')?.setValue(result.TasaPeriodicaL);
          this.CarteraForm.get('TasaLiquidada')?.setValue(result.TasaLiquidada);
          this.CarteraForm.get('EfectivaLiquidada')?.setValue(result.TasaEfectivaL);
          this.CarteraForm.get('TasaPeriodicaP')?.setValue(result.TasaPeriodicaP);
          this.CarteraForm.get('TasaPactada')?.setValue(result.TasaPactada);
          this.CarteraForm.get('EfectivaPactada')?.setValue(result.TasaEfectivaP);
          this.CarteraForm.get('btnSeguro')?.setValue(result.ChecSeguro);
          this.CarteraForm.get('covid19')?.setValue(result.Marcaccion);
        },
        error => {

        }
      )

      this.MiListaProductosService.obtieneCuposCreditosAhocreditos(this.lngCuenta).subscribe(
        result => {

          this.carteraInfo.CupoAprobadoTD = result.CupoAprobado;
          this.carteraInfo.CupoUtilizadoTD = result.CupoUtilizado;
          this.carteraInfo.CupoDisponibleTD = result.CupoDisponible;

          this.CarteraForm.get('DtmFechaDocumentacionTD')?.setValue(result.FechaDocumentacion);
          this.CarteraForm.get('DtmAperturaTD')?.setValue(result.FechaApertura);
          this.CarteraForm.get('DtmCancelacionTd')?.setValue(result.FechaCancelacion);
        },
        error => {
        });

    }

  }

  obtieneSaldosCuenta() {
    if ($("#ac-cr-2").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-3").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);
      this.MiListaProductosService.getSaldos(this.lngCuenta).subscribe(
        result => {

          this.carteraInfo.AbonoCanje = result.AbonoCanje;
          this.carteraInfo.InteresAnticipado = result.InteresAnticipado;
          this.carteraInfo.InteresContingente = result.InteresContingente;
          this.carteraInfo.SaldoProyectado = result.SaldoProyectado;
          this.carteraInfo.InteresCorriente = result.InteresCorriente;
          this.carteraInfo.CapitalMora = result.CapitalMora;
          this.carteraInfo.SaldoCapital = result.SaldoCapital;
          this.carteraInfo.InteresCorrienteMora = result.InteresCorrienteMora;
          this.carteraInfo.TotalInteres = result.TotalInteres;
          this.carteraInfo.SaldoDeuda = result.SaldoDeuda;
          this.carteraInfo.InteresMora = result.InteresMora;

          // this.CarteraForm.get('AbonoCanje')?.setValue(result.AbonoCanje);
          // this.CarteraForm.get('InteresAnticipado')?.setValue(result.InteresAnticipado);
          // this.CarteraForm.get('InteresContingente')?.setValue(result.InteresContingente);
          // this.CarteraForm.get('SaldoProyectado')?.setValue(result.SaldoProyectado);

          this.CarteraForm.get('CoutasPagas')?.setValue(result.CuotasPagas);

          // this.CarteraForm.get('CapitalMora')?.setValue(result.CapitalMora);

          // this.CarteraForm.get('InteresCorriente')?.setValue(result.InteresCorriente);
          // this.CarteraForm.get('SaldoCapital')?.setValue(result.SaldoCapital);
          this.CarteraForm.get('CoutasPendientes')?.setValue(result.CuotasPendientes);
          // this.CarteraForm.get('InteresCorrienteMora')?.setValue(result.InteresCorrienteMora);
          // this.CarteraForm.get('TotalInteres')?.setValue(result.TotalInteres);
          // this.CarteraForm.get('SaldoDeuda')?.setValue(result.SaldoDeuda);

          this.CarteraForm.get('CoutasMora')?.setValue(result.CuotasMora);
          // this.CarteraForm.get('InteresMora')?.setValue(result.InteresMora);
        },
        error => {

        }
      )

    }

  }


  SetlngTercero(lngTercero: number) {
    this.lngTercero = lngTercero;
  }

  ResetModal() {

    if (this.lstCuentasHijasActivas.length > 0  || this.lstCuentasHijasCanceladas.length > 0
      ) {
      $("#CuentasHijasBottom").click();
    }

    this.ReferencasFinCom.length = 0;
    this.ReferenciasFamPer.length = 0;
    this.lngCuenta = 0;
    this.lstCodeudores.length = 0;
    this.lstReestructuracion.length = 0;
    this.lstReliquidacion.length = 0;
    this.lstDeducibles.length = 0;
    this.lstGarantias.length = 0;
    this.lstAnalisisCalificacion.length = 0;
    this.lstCalificacion.length = 0;
    this.lstProvisiones.length = 0;

    $(".ac-input-cr").prop("checked", false);
    this.CancelaCreditoCartera = false;
    this.CalculaCreditoCartera = false;
    this.CarteraForm.get('ACuotas')?.setValue(false);
    this.CarteraForm.get('CancelaCredito')?.setValue(false);


    this.CarteraForm.get('CuotasMoraPre')?.setValue("");
    this.CarteraForm.get('VecesPre')?.setValue("");
    this.carteraInfo.SaldoCapitalPre = 0;

    // this.CarteraForm.get('SaldoCapitalPre')?.setValue("");
    this.CarteraForm.get('FechaMatriculaPre')?.setValue("");
    this.CarteraForm.get('FechaRetiroPre')?.setValue("");

    this.CarteraForm.get('EstadoJuridico')?.setValue("");
    this.CarteraForm.get('Abogado')?.setValue("");

    this.carteraInfo.SaldoJuridico = 0;
    // this.CarteraForm.get('SaldoJuridico')?.setValue("");

    this.carteraInfo.CostasJudiciales = 0;

    // this.CarteraForm.get('CostasJudiciales')?.setValue("");

    this.CarteraForm.get('CuotasMoraJuridico')?.setValue("");
    this.CarteraForm.get('VecesJuridico')?.setValue("");
    this.CarteraForm.get('FechaMatriculaJuridico')?.setValue("");
    this.CarteraForm.get('FechaRetiroJuridico')?.setValue("");

    // this.CarteraForm.get('IntMoraCastigo')?.setValue("");
    this.carteraInfo.IntMoraCastigo = 0;

    // this.CarteraForm.get('CorrientesCatigo')?.setValue("");
    this.carteraInfo.CorrientesCatigo = 0;
    this.carteraInfo.SaldoCapitalCastigo = 0;
    this.carteraInfo.CostasJudicialesCastigo = 0;
    this.CarteraForm.get('FechaCastigo')?.setValue("");



    this.CarteraForm.get('AbonoCanjeTotal')?.setValue("");
    this.CarteraForm.get('InteresAnticipadoTotal')?.setValue("");
    this.CarteraForm.get('InteresContigenciaTotal')?.setValue("");
    this.CarteraForm.get('SaldoProyectadoCP')?.setValue("");
    this.CarteraForm.get('SaldoCapitalCP')?.setValue("");
    this.CarteraForm.get('CapitalMoraCP')?.setValue("");
    this.CarteraForm.get('InteresCorrienteCP')?.setValue("");
    this.CarteraForm.get('TotalInteresesCP')?.setValue("");
    this.CarteraForm.get('SaldoDeudaCP')?.setValue("");
    this.CarteraForm.get('InteresMoraCP')?.setValue("");

    this.CarteraForm.get('NumeroCupoCN')?.setValue("");


    this.carteraInfo.CupoAprobadoCN = 0;
    this.carteraInfo.CupoUtilizadoCN = 0;
    this.carteraInfo.CupoDisponibleCN = 0;


    this.CarteraForm.get('DtmMatriculaCN')?.setValue("");
    this.CarteraForm.get('DtmAprobacionCupo')?.setValue("");
    this.CarteraForm.get('DtmVencimientoCN')?.setValue("");
    this.CarteraForm.get('DtmRetiroCN')?.setValue("");
    this.CarteraForm.get('DtmActualizacionCN')?.setValue("");
    this.CarteraForm.get('DtmDocumentacionCN')?.setValue("");
    this.CarteraForm.get('BloqueosCN')?.setValue("");

  }
  ResetModalExtractos() {
    this.DetallesExtractoCartera.length = 0;
    this.DetallesMovimientosCartera.length = 0;
    this.HabilitaMensate = 0;
    if (this.lstCuentasHijasActivas.length > 0  || this.lstCuentasHijasCanceladas.length > 0
      ) {
      $("#CuentasHijasBottom").click();
    }
    this.TDForm = false;
    this.ExtactoCartera.get('MovExtSelectorCartera')?.setValue('-');
    this.ExtactoCarteraTD.get('MovExtSelectorCartera')?.setValue('-');
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.NoRegistros = 1;
    this.HabilitaMensate = 0;
    this.ExtactoCartera.get('MovExtYearCartera')?.setValue('-');
    this.ExtactoCartera.get('MovExtMonthCartera')?.setValue('-');
    this.ExtactoCarteraTD.get('MovExtYearCartera')?.setValue('-');
    this.ExtactoCarteraTD.get('MovExtMonthCartera')?.setValue('-');
    this.FechaMenorMayor = false;
    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.InicioVacida = false;
    this.FinVacida = false;
    this.SelectmesErroneo = false;
    this.SelectanoErroneo = false;
    this.DatosExtractoTD.length = 0;
    this.DatosMovimientoTD.length = 0;
    this.ExtractoTarjetaDebito.length = 0;
    this.FilePDFXLS = null;
    this.objfull = true;
    $("#ExtractosCarteraTD").hide();
    $("#objepdfExtCartera").hide();
    $("#objepdfmovimientoCartera").hide();
    $("#MovimientosCarteraTD").hide();
    this.validaForm = false;
    this.validaMesFinal = false;
    this.validaMesInicial = false;
    this.validaAnoFinal = false;
    this.validaAnoFinal = false;
    this.seleccioneTodo();
  }

  ValidarSeleccion(data : any) {
    if (data === 'si' || data == true) {
      this.CarteraForm.get('ACuotas')?.setValue(false);
      this.CancelaCreditoCartera = true;
      this.CalculaCreditoCartera = false;
      $("#Ncuotas").prop("disabled", true);
      document.getElementById("BlockNcoutasB")!.style.visibility = 'hidden';
      document.getElementById("BlockNcoutas")!.style.visibility = 'hidden';
      const b = this.CancelaCreditoCartera;
      const c = this.lngCuenta;
      this.calcularCuota(c, b, 0);
    } else {
      this.lstCoutasCalculadas.length = 0;
      const a = this.CarteraForm.get("NCoutas")?.value;
      const b = this.CancelaCreditoCartera;
      const c = this.lngCuenta;
      this.CalculaCreditoCartera = true;
      this.CancelaCreditoCartera = false;
      this.calcularCuota(c, b, a);

    }

  }

  calcularCuota(lngCuenta: number, Cancela: boolean, Ncoutas: number) {
    this.MiListaProductosService.getCalculaCuota(lngCuenta, Cancela, Ncoutas).subscribe(
      result => {
        this.carteraInfo.TotalCapitalCal = result.DatosGenerales.TotalCapitalCal;
        this.carteraInfo.TotalInteresesCal = result.DatosGenerales.TotalInteresesCal;
        this.carteraInfo.TotalMoraCal = result.DatosGenerales.TotalMoraCal;
        this.carteraInfo.TotalDiferidosCal = result.DatosGenerales.TotalDiferidosCal;
        this.carteraInfo.TotalPagarCal = result.DatosGenerales.TotalPagarCal;
        if (result.TablaCoutas !== null) {
          var Cou = 0;
          for (var i = 0; i < result.TablaCoutas.length; i++) {
            this.lstCoutasCalculadas[Cou] = result.TablaCoutas[i];
            Cou++;
          }
        }
        if (result.TablaCancela !== null) {
          this.SaldoCancelaCredito = result.TablaCancela.SaldoCapitalCredito;
          this.InteresesCCancelaCredito = result.TablaCancela.IntCorrientes;
          this.InteresesMoraCancelaCredito = result.TablaCancela.IntMora;
          this.DiferidosCancelaCredito = result.TablaCancela.SaldoDiferidos;
          this.CostasJudicialesCancelaCredito = result.TablaCancela.CostesJudiciales;
        }

      },
      error => {
      }
    )
  }
  CambiaVistaCuotas() {
    this.CarteraForm.get('NCoutas')?.setValue("1");

    document.getElementById("BlockNcoutasB")!.style.visibility = 'visible';
    document.getElementById("BlockNcoutas")!.style.visibility = 'visible';
    this.CarteraForm.get('CancelaCredito')?.setValue(false);
    this.CancelaCreditoCartera = false;
    $("#Ncuotas").prop("disabled", false);
    this.carteraInfo.TotalCapitalCal = 0;
    this.carteraInfo.TotalInteresesCal = 0;
    this.carteraInfo.TotalMoraCal = 0;
    this.carteraInfo.TotalDiferidosCal = 0;
    this.carteraInfo.TotalPagarCal = 0;

  }

  Cambiavistatasas() {
    if (this.ValidaPactado) {
      this.ValidaPactado = false;
    } else {
      this.ValidaPactado = true;
    }

  }

  limpiacampos() {

    if (!$("#ac-cr-0").prop("checked")) {
      this.carteraInfo.TotalCapitalCal = 0;
      this.carteraInfo.TotalInteresesCal = 0;
      this.carteraInfo.TotalMoraCal = 0;
      this.carteraInfo.TotalDiferidosCal = 0;
      this.carteraInfo.TotalPagarCal = 0;
      this.CarteraForm.get('NCoutas')?.setValue("");
      this.CarteraForm.get('ACuotas')?.setValue(false);
      this.CarteraForm.get('CancelaCredito')?.setValue(false);
      //$("#Cancela").prop("checked", false);
      //$("#Coutasc").prop("checked", false);
      this.CancelaCreditoCartera = false;
      this.CalculaCreditoCartera = false;
      document.getElementById("BlockNcoutasB")!.style.visibility = 'hidden';
      document.getElementById("BlockNcoutas")!.style.visibility = 'hidden';
    } else {
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
    }

  }

  getProvisionesCartera() {
    if ($("#ac-cr-6").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-3").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);
      this.MiListaProductosService.getProvisionesCartera(this.lngCuenta).subscribe(
        result => {
          if (result !== null) {
            var Pro = 0;
            for (var i = 0; i < result.length; i++) {
              this.lstProvisiones[Pro] = result[i];
              Pro++;
            }
          }


        },
        error => {

        }
      )
    }

  }

  FormExtracto() {
    const FechaIniciocartera = new FormControl('', []);
    const FechaFincartera = new FormControl('', []);
    const NumeroCuenta = new FormControl('', []);
    const yearInit = new FormControl("", []);
    const yearEnd = new FormControl("", []);
    const MesInit = new FormControl("", []);
    const MesEnd = new FormControl("", []);
    const Usuario = new FormControl("", []);
    const Oficina = new FormControl("", []);
    const MovExtSelectorCartera = new FormControl('', [Validators.required]);
    const MovExtMonthCartera = new FormControl('', [Validators.required]);
    const MovExtYearCartera = new FormControl('', [Validators.required]);
    const IdTercero = new FormControl('', [Validators.required]);
    const consecutivo = new FormControl('', [Validators.required]);
    this.ExtactoCartera = new FormGroup({
      FechaIniciocartera: FechaIniciocartera,
      FechaFincartera: FechaFincartera,
      MovExtSelectorCartera: MovExtSelectorCartera,
      MovExtMonthCartera: MovExtMonthCartera,
      MovExtYearCartera: MovExtYearCartera,
      NumeroCuenta: NumeroCuenta,
      IdTercero: IdTercero,
      consecutivo: consecutivo,
      yearInit: yearInit,
      yearEnd: yearEnd,
      MesInit: MesInit,
      MesEnd: MesEnd,
      Usuario: Usuario,
      Oficina: Oficina
    });
  }

  FormExtractoTD() {
    const FechaIniciocartera = new FormControl('', []);
    const FechaFincartera = new FormControl('', []);
    const NumeroCuenta = new FormControl('', []);
    const yearInit = new FormControl("", []);
    const yearEnd = new FormControl("", []);
    const MesInit = new FormControl("", []);
    const MesEnd = new FormControl("", []);
    const Usuario = new FormControl("", []);
    const Oficina = new FormControl("", []);
    const MovExtSelectorCartera = new FormControl('', [Validators.required]);
    const MovExtMonthCartera = new FormControl('', [Validators.required]);
    const MovExtYearCartera = new FormControl('', [Validators.required]);
    const IdTercero = new FormControl('', [Validators.required]);
    const consecutivo = new FormControl('', [Validators.required]);
    this.ExtactoCarteraTD = new FormGroup({
      FechaIniciocartera: FechaIniciocartera,
      FechaFincartera: FechaFincartera,
      MovExtSelectorCartera: MovExtSelectorCartera,
      MovExtMonthCartera: MovExtMonthCartera,
      MovExtYearCartera: MovExtYearCartera,
      NumeroCuenta: NumeroCuenta,
      IdTercero: IdTercero,
      consecutivo: consecutivo,
      yearInit: yearInit,
      yearEnd: yearEnd,
      MesInit: MesInit,
      MesEnd: MesEnd,
      Usuario: Usuario,
      Oficina: Oficina
    });
  }

  opcionSelectedmes() {
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.HabilitaMensate = 0;
    this.DetallesMovimientosCartera.length = 0;
    this.DetallesExtractoCartera.length = 0;

    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.InicioVacida = false;
    this.FinVacida = false;
    this.SelectmesErroneo = false;
    this.SelectanoErroneo = false;

    this.DatosExtractoTD.length = 0;
    this.DatosMovimientoTD.length = 0;
    this.ExtractoTarjetaDebito.length = 0;
    this.objfull = true;
    $("#ExtractosCarteraTD").hide();
    $("#objepdfExtCartera").hide();
    $("#objepdfmovimientoCartera").hide();
    $("#MovimientosCarteraTD").hide();
    this.FilePDFXLS = null;

  }


  SendEmailCartera() {
    this.loading.show();
    this.ValidaPlantillaMail();
    setTimeout(() => {
      this.SendMailSeguros();
    }, 5000);
  }


  SendEmailCp() {
    this.loading.show();
    this.ValidaPlantillaMail();
    setTimeout(() => {
      this.SendMailCpM();
    }, 5000);
  }


  opcionSelectedTD(valueSlect : number)  {

    this.arrayMesesCuenta.length = 0;
    this.arrayMesesCuenta = [
      {
        "selector": "--Seleccionar--",
        "value": 0
      }
    ];
    this.validaAnoInicial = false;
    this.validaAnoFinal = false;
    this.validaMesInicial = false;
    this.validaMesFinal = false;

    this.FechaMayorAmenor = false;

    this.inicioNoValida = false;
    this.finNoValida = false;
    this.FinVacida = false;
    this.InicioVacida = false;
    this.FechaMenorMayor = false;

    if (valueSlect == 2) {
      this.SeleccionExt = 2;
      this.validaForm = true;
      this.valueSlect = '2';
      this.SelectErroneo = false;
      this.TDForm = false;
      setTimeout(() => {
        this.seleccioneTodo();
      }, 500);
      $(".SelectedExtracto_CarteraTD").prop('selectedIndex', 2);
    } else if (Number(valueSlect) == 3) {
      this.TDForm = true;
      this.validaForm = false;
      this.SelectErroneo = false;
      this.SeleccionExt = 3;
      this.valueSlect = '3';
      setTimeout(() => {
        this.seleccioneTodo();
        $(".SelectedMovimiento_CarteraTD").prop('selectedIndex', 3);
      }, 400);
    } else if (valueSlect.toString() === "-") {
      this.SelectErroneo = true;
      //no se hace nada
    } else {
      this.SelectErroneo = false;
      this.SeleccionExt = 1;
      this.valueSlect = '1';
      this.validaForm = false;
      this.TDForm = false;
      setTimeout(() => {
        $(".SelectedMovimiento_CarteraTD").prop('selectedIndex', 1);
      }, 400);
    }
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.HabilitaMensate = 0;
    this.DetallesMovimientosCartera.length = 0;
    this.DetallesExtractoCartera.length = 0;
    this.FechaMayorAmenor = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.InicioVacida = false;
    this.FinVacida = false;
    this.SelectmesErroneo = false;
    this.SelectanoErroneo = false;
    this.DatosExtractoTD.length = 0;
    this.DatosMovimientoTD.length = 0;
    this.ExtractoTarjetaDebito.length = 0;
    this.objfull = true;
    $("#ExtractosCarteraTD").hide();
    $("#objepdfExtCartera").hide();
    $("#objepdfmovimientoCartera").hide();
    $("#MovimientosCarteraTD").hide();
    this.FilePDFXLS = null;
    this.SelectionYear = this.ExtactoCarteraTD.get('MovExtYearCartera')?.value;
    var numero = parseInt(this.MonthOpen);
    if (this.SelectionYear == this.yearOpen) {
      this.CargarlstMeses(numero, this.yearOpen);
    } else {
      this.CargarlstMeses(0, this.SelectionYear);
    }

  }

  opcionSelected(valueSlect : number ) {
    if (Number(valueSlect) == 3) {
      this.TDForm = true;
    }else{
      this.TDForm = false;
    }
    this.arrayMesesCuenta.length = 0;
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

    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.HabilitaMensate = 0;
    this.DetallesMovimientosCartera.length = 0;
    this.DetallesExtractoCartera.length = 0;
    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.InicioVacida = false;
    this.FinVacida = false;
    this.SelectmesErroneo = false;
    this.SelectanoErroneo = false;
    this.DatosExtractoTD.length = 0;
    this.DatosMovimientoTD.length = 0;
    this.ExtractoTarjetaDebito.length = 0;
    this.objfull = true;
    $("#ExtractosCarteraTD").hide();
    $("#objepdfExtCartera").hide();
    $("#objepdfmovimientoCartera").hide();
    $("#MovimientosCarteraTD").hide();
    this.FilePDFXLS = null;
    this.SelectionYear = this.ExtactoCartera.get('MovExtYearCartera')?.value;
    var numero = parseInt(this.MonthOpen);
    if (valueSlect == 2) {
      this.SeleccionExt = 2;
      this.validaForm = true;
      this.SelectErroneo = false;
      this.valueSlect = '2';
      setTimeout(() => {
        this.seleccioneTodo();
      }, 500);
      $(".SelectedExtracto_Cartera").prop('selectedIndex', 2);
    } else if (valueSlect.toString() == '-') {
      this.SelectErroneo = true;
      // no hace nada
    }else {
      this.SeleccionExt = 1;
      this.valueSlect = '1';
      this.validaForm = false;
      this.SelectErroneo = false;
      setTimeout(() => {
        $(".SelectedMovimiento_Cartera").prop('selectedIndex', 1);
      }, 400);
      $("#fechaInicartera").val(this.fechaAperturaCuenta);
      $("#fechaendcartera").val(this.fechaAperturaActualDisabled);
    }
    if (this.SelectionYear == this.yearOpen) {
      this.CargarlstMeses(numero, this.yearOpen);
    } else {
      this.CargarlstMeses(0, this.SelectionYear);
    }

  }


  DetalleMovimiento(data : any, cuentaHija = 0) {
    this.ExtactoCartera.get('MovExtSelectorCartera')?.setValue('-');
    $(".rangoFechas").hide();
    this.lngCuenta = data.lngcuenta;
    this.NombreProducto = data.Linea;
    this.selectedEstadoCartera = '-';
    $("#MinimizarTD").click();
    this.fechaAperturaCuenta = moment(new Date(data.FechaMatricula)).format('YYYY-MM-DD');
    this.fechaAperturaActualDisabled = moment(new Date()).format('YYYY-MM-DD');
    $("#fechaInicartera").val(this.fechaAperturaCuenta);
    $("#fechaendcartera").val(this.fechaAperturaActualDisabled);
    this.DetallesMovimientosCartera.length = 0;
    this.DetallesExtractoCartera.length = 0;
    if (cuentaHija === 1) {
      this.validaHijaTD = true;
    } else {
      this.validaHijaTD = false;
    }
    this.ConsultaYears();

  }

  Consultar() {

  this.SelectionExtOrMov =
    this.ExtactoCartera.get('MovExtSelectorCartera')?.value;

  const FechaInicio = $("#fechaInicartera").val();
  const FechaFin = $("#fechaendcartera").val();

  this.fechaInicioC = FechaInicio;
  this.fechaFinC = FechaFin;

  this.today = new Date();

  if (FechaInicio == "") {

    this.InicioVacida = true;
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    return;
  }

  if (FechaFin == "") {

    this.FinVacida = true;
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    return;
  }

  if (
    FechaInicio != null &&
    FechaFin != null &&
    FechaInicio > FechaFin
  ) {

    this.FechaMayorAmenor = true;
    this.InicioVacida = false;
    this.FinVacida = false;

    this.Extractos.length = 0;
    this.Movimientos.length = 0;

    return;
  }

  if (
    this.SelectionExtOrMov == "-" ||
    this.SelectionExtOrMov == undefined
  ) {

    this.SelectErroneo = true;
    this.FechaMayorAmenor = false;

    return;
  }

  if (
    FechaInicio != null &&
    FechaInicio < this.fechaAperturaCuenta
  ) {

    this.inicioNoValida = true;
    this.SelectErroneo = false;
    this.FechaMayorAmenor = false;

    return;
  }

  if (
    FechaFin != null &&
    FechaFin > this.fechaAperturaActualDisabled
  ) {

    this.finNoValida = true;
    this.inicioNoValida = false;
    this.SelectErroneo = false;
    this.FechaMayorAmenor = false;

    return;
  }

  this.FechaMayorAmenor = false;
  this.SelectErroneo = false;
  this.inicioNoValida = false;
  this.finNoValida = false;

  const data = localStorage.getItem("Data");

  const dataLocalStorage = JSON.parse(
    window.atob(data != null ? data : "")
  );

  //#region EXTRACTOS

  if (
    this.SelectionExtOrMov == 2 &&
    FechaInicio != null &&
    FechaFin != null
  ) {

    this.ExtactoCartera.get('FechaIniciocartera')
      ?.setValue(FechaInicio);

    this.ExtactoCartera.get('FechaFincartera')
      ?.setValue(FechaFin);

    const yearInicial =
      Number($(".yearInit_Cartera").val());

    const yearFinal =
      Number($(".yearEnd_Cartera").val());

    const MesInicial =
      Number($(".MesInit_Cartera").val());

    const MesFinal =
      Number($(".MesEnd_Cartera").val());

    const FechaInici =
      yearInicial + "-" + MesInicial + "-1";

    this.loading.show();

    this.MiListaProductosService
      .getExtractosCartera(
        this.lngCuenta,
        FechaInici,
        yearFinal,
        MesFinal,
        dataLocalStorage.Oficina
      )
      .subscribe(
        result => {

          this.loading.hide();

          this.MapeaEncabezadoExtracto(result);

          if (result.Detalles !== null) {

            this.MiListaProductosService
              .GenerarPdfCartera(
                this.lngCuenta,
                FechaInici,
                yearFinal,
                MesFinal,
                dataLocalStorage.Oficina
              )
              .subscribe(
                resultPdf => {

                  try {

                    const pdfinBase64 =
                      resultPdf?.FileStream?._buffer;

                    if (!pdfinBase64) {
                      throw new Error("PDF vacío");
                    }

                    const byteArray =
                      new Uint8Array(
                        atob(pdfinBase64)
                          .split('')
                          .map(char =>
                            char.charCodeAt(0)
                          )
                      );

                    const newBlob = new Blob(
                      [byteArray],
                      {
                        type: 'application/pdf'
                      }
                    );

                    this.linkPdf =
                      URL.createObjectURL(newBlob);

                    const url =
                      URL.createObjectURL(newBlob);

                    document
                      .getElementById('objepdfExtCartera')
                      ?.setAttribute("data", url);

                    document
                      .getElementById('objepdfExtCartera')
                      ?.setAttribute(
                        "type",
                        "application/pdf"
                      );

                    $("#objepdfExtCartera").show();
                    $("#objepdfmovimientoCartera").hide();

                  } catch (e) {

                    console.error(e);
                  }
                },
                error => {

                  console.log(error);
                }
              );

          } else {

            this.DetallesExtractoCartera.length = 0;
            this.DetallesMovimientosCartera.length = 0;
          }

          //#region LOG

          const log = new LogMisProductos();
          const nuevoItem = new DatosProductos();

          log.IdOficina = parseInt(
            dataLocalStorage.NumeroOficina
          );

          log.IdModulo = 69;
          log.IdOperacion = 50;
          log.IdOpcion = 3;
          log.IdTercero = this.lngTercero;
          log.IdUsuarioERP = dataLocalStorage.IdUsuario;
          log.IdCuenta = this.lngCuenta;

          nuevoItem.NumeroCuenta =
            result.Encabezado.Cuenta;

          nuevoItem.CuentaHija =
            this.validaHijaTD;

          nuevoItem.FechaInicial =
            FechaInicio?.toString() || "";

          nuevoItem.FechaFinal =
            FechaFin?.toString() || "";

          log.DatosProductos = nuevoItem;

          this.setLogMisProductos(log);

          //#endregion
        },
        error => {

          this.loading.hide();

          console.log(error);

          $("#objepdfExtCartera").hide();
          $("#objepdfmovimientoCartera").hide();
        }
      );
  }

  //#region MOVIMIENTOS

  else if (
    this.SelectionExtOrMov == 1 &&
    FechaInicio != null &&
    FechaFin != null
  ) {

    this.ExtactoCartera.get('FechaIniciocartera')
      ?.setValue(FechaInicio);

    this.ExtactoCartera.get('FechaFincartera')
      ?.setValue(FechaFin);

    this.loading.show();

    this.MiListaProductosService
      .getMovimientosCartera(
        this.lngCuenta,
        FechaInicio,
        FechaFin
      )
      .subscribe(
        result => {

          // ELIMINADO loading.show()

          this.MapeaEncabezadoExtractoMovimientos(result);

          if (result.Detalles !== null) {

            this.MiListaProductosService
              .GenerarPdfMovimientoCartera(
                this.lngCuenta,
                FechaInicio,
                FechaFin
              )
              .subscribe(
                resultPdf => {

                  this.loading.hide();

                  const pdfinBase64 =
                    resultPdf.FileStream._buffer;

                  const byteArray =
                    new Uint8Array(
                      atob(pdfinBase64)
                        .split('')
                        .map(char =>
                          char.charCodeAt(0)
                        )
                    );

                  const newBlob = new Blob(
                    [byteArray],
                    {
                      type: 'application/pdf'
                    }
                  );

                  this.linkPdf =
                    URL.createObjectURL(newBlob);

                  const url =
                    URL.createObjectURL(newBlob);

                  document
                    .getElementById('objepdfmovimientoCartera')
                    ?.setAttribute("data", url);

                  document
                    .getElementById('objepdfmovimientoCartera')
                    ?.setAttribute(
                      "type",
                      "application/pdf"
                    );

                  $("#objepdfExtCartera").hide();
                  $("#objepdfmovimientoCartera").show();

                },
                error => {

                  this.loading.hide();

                  console.log(error);

                  $("#objepdfExtCartera").hide();
                  $("#objepdfmovimientoCartera").hide();
                }
              );

          } else {

            this.loading.hide();

            this.DetallesMovimientosCartera.length = 0;

            this.HabilitaMensate = 1;

            $("#objepdfExtCartera").hide();
            $("#objepdfmovimientoCartera").hide();
          }

          //#region LOG

          const log = new LogMisProductos();
          const nuevoItem = new DatosProductos();

          log.IdOficina = parseInt(
            dataLocalStorage.NumeroOficina
          );

          log.IdModulo = 69;
          log.IdOperacion = 50;
          log.IdOpcion = 2;
          log.IdTercero = this.lngTercero;
          log.IdUsuarioERP = dataLocalStorage.IdUsuario;
          log.IdCuenta = this.lngCuenta;

          nuevoItem.NumeroCuenta =
            result.Encabezado.Cuenta;

          nuevoItem.CuentaHija =
            this.validaHijaTD;

          nuevoItem.FechaInicial =
            FechaInicio?.toString() || "";

          nuevoItem.FechaFinal =
            FechaFin?.toString() || "";

          log.DatosProductos = nuevoItem;

          this.setLogMisProductos(log);

          //#endregion
        },
        error => {

          this.loading.hide();

          console.log(error);

          $("#objepdfExtCartera").hide();
          $("#objepdfmovimientoCartera").hide();
        }
      );
  }
}



  
  Limpiar() {
    this.ExtactoCartera.get('MovExtSelectorCartera')?.setValue('-');
    this.ExtactoCartera.get('MovExtYearCartera')?.setValue('-');
    this.ExtactoCarteraTD.get('MovExtSelectorCartera')?.setValue('-');
    this.ExtactoCarteraTD.get('MovExtYearCartera')?.setValue('-');

    this.SeleccionMonthOpen = 0;
    $("#fechaInicartera").val("");
    $("#fechaendcartera").val("");
    $("#fechaInicarteraTD").val("");
    $("#fechaendcarteraTD").val("");
    this.DetallesMovimientosCartera.length = 0;
    this.Movimientos.length = 0;
    this.HabilitaMensate = 0;
    this.TDForm = false;
    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.SelectanoErroneo = false;
    this.SelectmesErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.InicioVacida = false;
    this.FinVacida = false;
    this.ColorAnterior8 = null;

    this.DatosExtractoTD.length = 0;
    this.DetallesExtractoCartera.length = 0;
    this.ExtractoTarjetaDebito.length = 0;

    this.DatosMovimientoTD.length = 0;
    this.objfull = true;
    $("#ExtractosCarteraTD").hide();
    $("#objepdfExtCartera").hide();
    $("#objepdfmovimientoCartera").hide();
    $("#MovimientosCarteraTD").hide();
    this.FilePDFXLS = null;
    this.HabilitaMensate = 0;
    this.LstResumenCalificaciones.length = 0;
    this.LimpiarVariablesCali();
    this.seleccioneTodo();
  }

  MapeaEncabezadoExtracto(data : any) {

    this.NombrePersonaExtracto = data.Encabezado.Nombrecompleto;
    this.NumeroDocumento = data.Encabezado.NumeroDocumento;
    this.FechasMovimientos = data.Encabezado.Movimientode;
    this.Cuenta = data.Encabezado.Cuenta;
    this.DescripcionProducto = data.Encabezado.Producto;
    this.oficinaMatricula = data.Encabezado.Oficina;
    this.estado = data.Encabezado.Estado;

    var det = 0;
    if (data.Detalles.length > 1) {
      for (var i = 0; i < data.Detalles.length; i++) {
        this.DetallesExtractoCartera[det] = data.Detalles[i];
        det++;
      }
      this.HabilitaMensate = 0;
      this.MontoExtCarter = data.Resumen.Monto;
      this.FechaAperturaExtCartera = data.Resumen.FechaApertura;
      this.PlazoExtCartera = data.Resumen.Plazo;
      this.VenceExtCartera = data.Resumen.vence;
      this.FormaPagoExtCartera = data.Resumen.Formapago;
      this.ModalidadExtCartera = data.Resumen.Modalidad;
      this.InteresExtCartera = data.Resumen.Interes;

    } else {
      this.DetallesExtractoCartera.length = 0;
      this.HabilitaMensate = 1
    }

  }

  MapeaEncabezadoExtractoMovimientos(data : any) {

    this.NombrePersonaExtracto = data.Encabezado.Nombrecompleto;
    this.NumeroDocumento = data.Encabezado.NumeroDocumento;
    this.FechasMovimientos = data.Encabezado.Movimientode;
    this.Cuenta = data.Encabezado.Cuenta;
    this.DescripcionProducto = data.Encabezado.Producto;
    this.oficinaMatricula = data.Encabezado.Oficina;
    this.estado = data.Encabezado.Estado;

    var det = 0;
    if (data.Detalles !== null) {
      if (data.Detalles.length > 0) {
        for (var i = 0; i < data.Detalles.length; i++) {
          this.DetallesMovimientosCartera[det] = data.Detalles[i];
          det++;
        }
        this.HabilitaMensate = 0

      } else {
        this.DetallesMovimientosCartera.length == 0;
        this.HabilitaMensate = 1
      }


    } else {
      this.DetallesMovimientosCartera.length == 0;
      this.HabilitaMensate = 1
    }
  }

  ValidaPendientes() {
    var CuotasSolicitadas : any = $("#Ncuotas").val();
    if ( CuotasSolicitadas > this.CuotasPendientesCalculo) {
      this.CarteraForm.get('NCoutas')?.setValue(this.CuotasPendientesCalculo);
    }
  }


  DetalleCuentasHijas(data : any) {
    this.CarteraForm.get('CuentaPadre')?.setValue(data.Cuenta);
    this.lngCuenta = data.lngcuenta;
    this.CarteraForm.get('CuentasHijasActiva')?.setValue(true);

    this.MiListaProductosService.GetlstCuentasHijas(this.lngCuenta).subscribe(
      result => {

        var act = 0;
        var can = 0;
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            if ((result[i].FechaCancela != null) && (result[i].Estado != "Anulada")) {
              this.lstCuentasHijasCanceladas[can] = result[i];
              can++;
            } else if ((result[i].FechaCancela == null || result[i].FechaCancela == "")) {
              this.lstCuentasHijasActivas[act] = result[i];
              act++;
            }
          }
        }
      },
      error => {
      }
    )

        //#region Guarda log
        let datas = localStorage.getItem("Data");
        var dataLocalStorage = JSON.parse(window.atob(datas != null ? datas : ""));
        var LogMisProductosData = new LogMisProductos();
        var nuevoItem = new DatosProductos();
        LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
        LogMisProductosData.IdModulo = 69;
        LogMisProductosData.IdOperacion = 50;
        LogMisProductosData.IdOpcion = 4; // Ver ctas hijas
        LogMisProductosData.IdTercero = this.lngTercero;
        LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
        LogMisProductosData.IdCuenta = data.lngcuenta;
        nuevoItem.NumeroCuenta = data.Cuenta;
        nuevoItem.FechaInicial = "";
        nuevoItem.FechaFinal = "";
        LogMisProductosData.DatosProductos = nuevoItem;
        this.setLogMisProductos(LogMisProductosData);
        // #endregion

  }


  ValidarSeleccionCHijas(data : any) {
    if (data === 'si' || data == true) {
      this.ValidadorCheckHijas = true;
      this.CarteraForm.get('CuentasHijasActiva')?.setValue(true);
      // $("#HijasActivas").prop("disabled", true);
      //$("#HijasCanceladas").prop("disabled", false);
      this.CarteraForm.get('CuentasHijasCanceladas')?.setValue(false);

    } else {
      this.ValidadorCheckHijas = false;
      // $("#HijasActivas").prop("disabled", false);
      // $("#HijasCanceladas").prop("disabled", true);
      this.CarteraForm.get('CuentasHijasActiva')?.setValue(false);
      this.CarteraForm.get('CuentasHijasCanceladas')?.setValue(true);
    }
  }

  resetModalHijas() {
    this.CarteraForm.get('CuentasHijasActiva')?.setValue(true);
    this.CarteraForm.get('CuentasHijasCanceladas')?.setValue(false);
    this.ValidadorCheckHijas = true;
    this.lstCuentasHijasActivas.length = 0;
    this.lstCuentasHijasCanceladas.length = 0;
    this.seleccioneTodo();
  }
  ConsultaResumen() {
    this.carteraInfo.TotalCreComerciaCartera = 0;
    this.carteraInfo.TotalCreConsumoCartera = 0;
    this.carteraInfo.TotalMicroEmpCartera = 0;
    this.carteraInfo.TotalCreViviendaCartera = 0;

    this.MiListaProductosService.getResumen(this.lngTercero).subscribe(
      result => {   
        if (result !== null) {
          // this.ModalCalificacion.nativeElement.click();
          if (this.ValidadorCheck) {
            this.carteraInfo.TotalCreComerciaCartera = result.TotalCreComerciales;
            this.carteraInfo.TotalCreConsumoCartera = result.TotalesCreConsumo;
            this.carteraInfo.TotalMicroEmpCartera = result.TotalesMicroEmp;
            this.carteraInfo.TotalCreViviendaCartera = result.TotalesCreVivienda;
          } else {
            this.carteraInfo.TotalCreComerciaCartera = result.TotalCreComerciales;
            this.carteraInfo.TotalCreConsumoCartera = result.TotalesCreConsumo;
            this.carteraInfo.TotalMicroEmpCartera = result.TotalesMicroEmp;
            this.carteraInfo.TotalCreViviendaCartera = result.TotalesCreVivienda;
          }  
        } else {
          
        }
          
      
          
      },
      error => {
      });
      this.ResumenAnual.length = 0;
      this.CalificaAnualmente12Mes = 0;
      this.LstResumenCalificaciones.length = 0;
    //LstResumenCalificaciones
    this.MiListaProductosService.getAnalisis(this.lngTercero).subscribe(
      result => {
        if (result.length !== 0) {
          this.ModalCalificacion.nativeElement.click();

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
          let data = localStorage.getItem("Data");
          var dataLocalStorage = JSON.parse(window.atob(data != null ? data : ""));
          var LogMisProductosData = new LogMisProductos();
          var nuevoItem = new DatosProductos();
          LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
          LogMisProductosData.IdModulo = 69;
          LogMisProductosData.IdOperacion = 50;
          LogMisProductosData.IdOpcion = 5; //  Ver resumen
          LogMisProductosData.IdTercero = this.lngTercero;
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
  daclick(){
    $(".Cali_0").click()
  }
  obtieneCuposCreditosCrecreditos() {

    if ($("#ac-cr-13").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-3").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);
      this.MiListaProductosService.obtieneCuposCreditosCrecreditos(this.lngCuenta).subscribe(
        result => {
          this.CarteraForm.get('NumeroCupoCN')?.setValue(result.NumeroCupo);

          // this.CarteraForm.get('CupoAprobadoCN')?.setValue(result.CupoAprobado);
          // this.CarteraForm.get('CupoUtilizadoCN')?.setValue(result.CupoUtilizado);
          // this.CarteraForm.get('CupoDisponibleCN')?.setValue(result.CupoDisponible);
          this.carteraInfo.CupoAprobadoCN = result.CupoAprobado;
          this.carteraInfo.CupoUtilizadoCN = result.CupoUtilizado;
          this.carteraInfo.CupoDisponibleCN = result.CupoDisponible;
          this.CarteraForm.get('DtmMatriculaCN')?.setValue(result.DtmMatricula);
          this.CarteraForm.get('DtmVencimientoCN')?.setValue(result.DtmVencimiento);
          this.CarteraForm.get('DtmRetiroCN')?.setValue(result.DtmRetiro);
          this.CarteraForm.get('DtmActualizacionCN')?.setValue(result.DtmActualizacion);
          this.CarteraForm.get('DtmDocumentacionCN')?.setValue(result.DtmDocumentacion);
          this.CarteraForm.get('DtmAprobacionCupo')?.setValue(result.DtmAprobacionCupo);
          this.CarteraForm.get('BloqueosCN')?.setValue(result.Bloqueos);
        },
        error => {
        });

    }
  }

  obtieneCuposCreditosAhocreditos() {

    if ($("#ac-cr-12").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-3").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-11").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);
      this.MiListaProductosService.obtieneCuposCreditosAhocreditos(this.lngCuenta).subscribe(
        result => {
          this.carteraInfo.CupoAprobadoTD = result.CupoAprobado;
          this.carteraInfo.CupoUtilizadoTD = result.CupoUtilizado;
          this.carteraInfo.CupoDisponibleTD = result.CupoDisponible;
          this.CarteraForm.get('DtmFechaDocumentacionTD')?.setValue(result.FechaDocumentacion);
          this.CarteraForm.get('DtmAperturaTD')?.setValue(result.FechaApertura);
          this.CarteraForm.get('DtmCancelacionTd')?.setValue(result.FechaCancelacion);

        },
        error => {
        });
    }
  }

  CerrarAcordeonesIniciales() {
    $("#ac-0c").prop("checked", false);
    $("#ac-1c").prop("checked", false);
    $("#ac-2c").prop("checked", false);
    $("#ac-3c").prop("checked", false);
  }

  ComboAno(year : string) {
    var numero = parseInt(year);
    numero = numero + 1;

    //year = year + 1;
    var n = (new Date()).getFullYear()
    var lo = 0;
    for (var i = n; i >= numero; i--) {
      this.lstanos[lo] = i;
      lo++;
    }

  }

  DetallesMovimientoCuentaPadre(data : any) {
    this.lngCuenta = data.lngcuenta;
    this.NombreProducto = data.Linea;
    this.fechaAperturaCuenta = moment(new Date(data.FechaMatricula)).format('YYYY-MM-DD');
    this.fechaAperturaActualDisabled = moment(new Date()).format('YYYY-MM-DD');
    $("#fechaInicarteraTD").val(this.fechaAperturaCuenta);
    $("#fechaendcarteraTD").val(this.fechaAperturaActualDisabled);
    this.DetallesMovimientosCartera.length = 0;
    this.DetallesExtractoCartera.length = 0;
    this.ExtactoCarteraTD.get("NumeroCuenta")?.setValue(data.Cuenta);
    this.ConsultaYears();

  }

  CargarlstMeses(mescreaccion: number, selectecyearsr : any) {

    if (selectecyearsr == this.yearOpen) {
      var cont = 1;
      for (var i = mescreaccion - 1; i < this.SeleccionMesesCartera.length; i++) {
        this.arrayMesesCuenta[cont] = this.SeleccionMesesCartera[i];
        cont++;
      }
      this.SeleccionMonthOpen = mescreaccion;
      this.SelectMonthfirstOpen = true;
    } else if (selectecyearsr != this.yearOpen) {
      var cont = 1;
      for (var i = mescreaccion; i < this.SeleccionMesesCartera.length; i++) {
        this.arrayMesesCuenta[cont] = this.SeleccionMesesCartera[i];
        cont++;
      }
      this.SeleccionMonthOpen = 0;
      this.SelectMonthfirstOpen = false;
    }
  }

  ConsultarTD() {
    this.SelectionExtOrMov = this.ExtactoCarteraTD.get('MovExtSelectorCartera')?.value;
    var FechaInicio = $("#fechaInicarteraTD").val();
    var FechaFin = $("#fechaendcarteraTD").val();

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
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
    }else if (FechaInicio != null && FechaFin != null && FechaInicio > FechaFin) {
      this.FechaMayorAmenor = true;
      this.InicioVacida = false;
      this.FinVacida = false;
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
    } else if ((this.SelectionExtOrMov == "-") || (this.SelectionExtOrMov == undefined)) {
      this.SelectErroneo = true;
      this.FechaMayorAmenor = false;
    } else if (FechaInicio != null && FechaInicio < this.fechaAperturaCuenta) {
      this.inicioNoValida = true;
      this.SelectErroneo = false;
      this.FechaMayorAmenor = false;
    } else if (FechaFin != null && FechaFin > this.fechaAperturaActualDisabled) {
      this.finNoValida = true;
      this.inicioNoValida = false;
      this.SelectErroneo = false;
      this.FechaMayorAmenor = false;
    }
    else {
      this.FechaMayorAmenor = false;
      this.SelectErroneo = false;
      this.inicioNoValida = false;
      this.finNoValida = false;
      if (this.SelectionExtOrMov == 2 && FechaInicio != null && FechaFin != null) {
        this.ExtactoCarteraTD.get('FechaIniciocartera')?.setValue(FechaInicio);
        this.ExtactoCarteraTD.get('FechaFincartera')?.setValue(FechaFin);
        this.loading.show();
        let datas = localStorage.getItem("Data");
        var dataLocalStorage = JSON.parse(window.atob(datas != null ? datas : ""));
        var yearInicial = Number($(".yearInit_Cartera").val());
        var yearFinal = Number($(".yearEnd_Cartera").val());
        var MesInicial = Number($(".MesInit_Cartera").val());
        var MesFinal = Number($(".MesEnd_Cartera").val());
        var FechaInicio_ = yearInicial + "-" + MesInicial + "-1";
        var Oficina = dataLocalStorage.Oficina;
        this.MiListaProductosService.listItemExtCarteraTD(this.lngCuenta, FechaInicio_, yearFinal,MesFinal,Oficina).subscribe(
          result => {
            var item = 0
            if (result != null) {
              if (result.length > 0) {
                this.HabilitaMensate = 0;
                for (var i = 0; i < result.length; i++) {
                  this.DatosExtractoTD[item] = result[i];
                  item++;
                }
                this.MiListaProductosService.GenerarPdfCarteraTD(this.lngCuenta, FechaInicio_, yearFinal,MesFinal,Oficina).subscribe(
                  result => {
                    if (result != null) {
                      this.FilePDFXLS = result.FileStream;
                      this.loading.hide();
                      this.objfull = true;
                      const pdfinBase64 = result.FileStream._buffer;
                      const byteArray = new Uint8Array(atob(pdfinBase64).split('').map(char => char.charCodeAt(0)));
                      const newBolb = new Blob([byteArray], { type: 'application/pdf' });
                      this.linkPdf = URL.createObjectURL(newBolb);
                      const url = window.URL.createObjectURL(newBolb);
                      document.getElementById('ExtractosCarteraTD')?.setAttribute("data", url);
                      document.getElementById('ExtractosCarteraTD')?.setAttribute("type", "application/pdf");
                      this.objfull = true;
                    } else {
                      this.DatosExtractoTD.length = 0;
                      this.objfull = false;
                      this.HabilitaMensate = 1;
                      $("#ExtractosCarteraTD").hide();
                    }
                  },
                  error => {
                    this.loading.hide();
                    console.log(error);
                    $("#ExtractosCarteraTD").hide();
                  });
              }
              else {
                this.HabilitaMensate = 1;
                this.loading.hide();
                this.DatosExtractoTD.length = 0;
                this.objfull = false;
                $("#ExtractosCarteraTD").hide();
              }
            }
            else {
              this.HabilitaMensate = 1;
              this.loading.hide();
              this.DatosExtractoTD.length = 0;
              this.objfull = false;
              $("#ExtractosCarteraTD").hide();
            }
          });

        $("#ExtractosCarteraTD").show();

        //#region Guarda log
        let data = localStorage.getItem("Data");
        var dataLocalStorage = JSON.parse(window.atob(data != null ? data : ""));
        var LogMisProductosData = new LogMisProductos();
        var nuevoItem = new DatosProductos();
        LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
        LogMisProductosData.IdModulo = 69;
        LogMisProductosData.IdOperacion = 50;
        LogMisProductosData.IdOpcion = 3; // Extrato
        LogMisProductosData.IdTercero = this.lngTercero;
        LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
        LogMisProductosData.IdCuenta = this.lngCuenta;
        nuevoItem.NumeroCuenta = this.ExtactoCarteraTD.get("NumeroCuenta")?.value;
        if (!this.TDForm) {
          nuevoItem.FechaInicial = FechaInicio.toString();
          nuevoItem.FechaFinal = FechaFin.toString();
        }

        LogMisProductosData.DatosProductos = nuevoItem;
        this.setLogMisProductos(LogMisProductosData);
        // #endregion

      } else if (this.SelectionExtOrMov == 1 && FechaInicio != null && FechaFin != null) {
        this.loading.show();
        this.MiListaProductosService.ListaItemMovimimientoCarteraTd(this.lngCuenta, FechaInicio, FechaFin).subscribe(
          result => {
            var item = 0
            if (result != null) {
              if (result.length > 0) {
                this.HabilitaMensate = 0;
                for (var i = 0; i < result.length; i++) {
                  this.DatosMovimientoTD[item] = result[i];
                  item++;
                }
                this.MiListaProductosService.GeneraPdfMovimientoCarteraCuentaPadre(this.lngCuenta, FechaInicio, FechaFin).subscribe(
                  result => {
                    if (result != null) {
                      this.FilePDFXLS = result.FileStream;
                      this.loading.hide();
                      this.objfull = true;
                      const pdfinBase64 = result.FileStream._buffer;
                      const byteArray = new Uint8Array(atob(pdfinBase64).split('').map(char => char.charCodeAt(0)));
                      const newBolb = new Blob([byteArray], { type: 'application/pdf' });
                      this.linkPdf = URL.createObjectURL(newBolb);
                      const url = window.URL.createObjectURL(newBolb);
                      document.getElementById('MovimientosCarteraTD')?.setAttribute("data", url);
                      document.getElementById('MovimientosCarteraTD')?.setAttribute("type", "application/pdf");
                    } else {
                      this.DatosMovimientoTD.length = 0;
                      this.objfull = false;
                      $("#MovimientosCarteraTD").hide();
                    }
                  },
                  error => {
                    this.loading.hide();
                    console.log(error);
                    $("#MovimientosCarteraTD").hide();
                  });
              }
              else {
                this.loading.hide();
                this.DatosMovimientoTD.length = 0;
                this.objfull = false;
                this.HabilitaMensate = 1;
                $("#MovimientosCarteraTD").hide();
              }
            }
            else {
              this.loading.hide();
              this.DatosMovimientoTD.length = 0;
              this.objfull = false;
              this.HabilitaMensate = 1;
              $("#MovimientosCarteraTD").hide();
            }
          });
        $("#MovimientosCarteraTD").show();


        //#region Guarda log
        let data = localStorage.getItem("Data");
        var dataLocalStorage = JSON.parse(window.atob(data != null ? data : ""));
        var LogMisProductosData = new LogMisProductos();
        var nuevoItem = new DatosProductos();
        LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
        LogMisProductosData.IdModulo = 69;
        LogMisProductosData.IdOperacion = 50;
        LogMisProductosData.IdOpcion = 2; // Movimiento
        LogMisProductosData.IdTercero = this.lngTercero;
        LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
        LogMisProductosData.IdCuenta = this.lngCuenta;
        nuevoItem.NumeroCuenta = this.ExtactoCarteraTD.get("NumeroCuenta")?.value;
        if (!this.TDForm) {
          nuevoItem.FechaInicial = FechaInicio.toString();
          nuevoItem.FechaFinal = FechaFin.toString();
        }

        LogMisProductosData.DatosProductos = nuevoItem;
        this.setLogMisProductos(LogMisProductosData);
        // #endregion

      } else if (Number(this.SelectionExtOrMov) == 3) {
        let data = localStorage.getItem("Data");
        var dataLocalStorage = JSON.parse(window.atob(data != null ? data : ""));
        this.loading.show();
        this.MiListaProductosService.getDetalleTarjetaDebito(this.lngCuenta).subscribe(
          result => {
            this.loading.hide();
            var item = 0;
            if (result != null) {
              if (result.length > 0) {
                this.HabilitaMensate = 0;
                for (var i = 0; i < result.length; i++) {
                  this.ExtractoTarjetaDebito[item] = result[i];
                  item++;
                }
                this.objfull = true;

              this.MiListaProductosService.GenerarPDFTarjetaDebito(this.lngCuenta, dataLocalStorage.Usuario, dataLocalStorage.Oficina).subscribe(
                result => {
                  if (result != null) {
                    this.FilePDFXLS = result.FileStream;
                    this.loading.hide();
                    this.objfull = true;
                    const pdfinBase64 = result.FileStream._buffer;
                    const byteArray = new Uint8Array(atob(pdfinBase64).split('').map(char => char.charCodeAt(0)));
                    const newBolb = new Blob([byteArray], { type: 'application/pdf' });
                    this.linkPdf = URL.createObjectURL(newBolb);
                    const url = window.URL.createObjectURL(newBolb);
                    document.getElementById('ExtractoTarjetaDebito')?.setAttribute("data", url);
                    document.getElementById('ExtractoTarjetaDebito')?.setAttribute("type", "application/pdf");
                    this.objfull = true;
                  } else {
                    this.ExtractoTarjetaDebito.length = 0;
                    this.objfull = false;
                  }
                },
                error => {
                  this.loading.hide();
                  console.log(error);
                });
              } else {
                this.HabilitaMensate = 1;
                this.ExtractoTarjetaDebito.length = 0;
                $("#ExtractoTarjetaDebito").hide();
                this.objfull = false;
                // no ha registros
              }

                  //#region Guarda log


              console.log("this info localstorage")
              console.log(dataLocalStorage);
                  var LogMisProductosData = new LogMisProductos();
                  var nuevoItem = new DatosProductos();
                  LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
                  LogMisProductosData.IdModulo = 69;
                  LogMisProductosData.IdOperacion = 50;
                  LogMisProductosData.IdOpcion = 8; // Extrato td 
                  LogMisProductosData.IdTercero = this.lngTercero;
                  LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
                  LogMisProductosData.IdCuenta = this.lngCuenta;
                  nuevoItem.NumeroCuenta = this.ExtactoCarteraTD.get("NumeroCuenta")?.value;
                  if (!this.TDForm) {
                    nuevoItem.FechaInicial = FechaInicio == null ? "" : FechaInicio.toString();
                    nuevoItem.FechaFinal = FechaFin == null ? "" : FechaFin.toString();
                  }
                  LogMisProductosData.DatosProductos = nuevoItem;
                  this.setLogMisProductos(LogMisProductosData);
                  // #endregion

            }
            this.loading.hide();
          }, error => {
            this.loading.hide();

          });
      }

    }


  }

  ConsultarTDext() {
    var yearInicial = Number($(".yearInit_Cartera").val());
    var yearFinal = Number($(".yearEnd_Cartera").val());
    var MesInicial = Number($(".MesInit_Cartera").val());
    var MesFinal = Number($(".MesEnd_Cartera").val());
    var selExtracto = $(".SelectedExtracto_Cartera").val();

    if (selExtracto == '-') {
      this.SelectErroneo = true;
      this.validaAnoInicial = false;
      this.validaAnoFinal = false;
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }else if (yearInicial > yearFinal) {
      this.validaAnoInicial = true;
      this.SelectErroneo = false;
      this.validaAnoFinal = false;
      this.validaMesInicial = false;
      this.validaMesFinal = false;
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
      let data = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));

      var FechaInicio = yearInicial + "-" + MesInicial + "-1";
      var Oficina = dataLocalStorage.Oficina;
      this.loading.show();
      this.MiListaProductosService.listItemExtCarteraTD(this.lngCuenta, FechaInicio, yearFinal,MesFinal,Oficina).subscribe(
        result => {
          var item = 0
          if (result != null) {
            if (result.length > 0) {
              this.HabilitaMensate = 0;
              for (var i = 0; i < result.length; i++) {
                this.DatosExtractoTD[item] = result[i];
                item++;
              }
              this.MiListaProductosService.GenerarPdfCarteraTD(this.lngCuenta, FechaInicio, yearFinal,MesFinal,Oficina).subscribe(
                result => {
                  if (result != null) {
                    this.FilePDFXLS = result.FileStream;
                    this.loading.hide();
                    this.objfull = true;
                    const pdfinBase64 = result.FileStream._buffer;
                    const byteArray = new Uint8Array(atob(pdfinBase64).split('').map(char => char.charCodeAt(0)));
                    const newBolb = new Blob([byteArray], { type: 'application/pdf' });
                    this.linkPdf = URL.createObjectURL(newBolb);
                    const url = window.URL.createObjectURL(newBolb);
                    document.getElementById('ExtractosCarteraTD')?.setAttribute("data", url);
                    document.getElementById('ExtractosCarteraTD')?.setAttribute("type", "application/pdf");
                    this.objfull = true;
                  } else {
                    this.DatosExtractoTD.length = 0;
                    this.objfull = false;
                    this.HabilitaMensate = 1;
                    $("#ExtractosCarteraTD").hide();
                  }
                },
                error => {
                  this.loading.hide();
                  console.log(error);
                  $("#ExtractosCarteraTD").hide();
                });
            }
            else {
              this.HabilitaMensate = 1;
              this.loading.hide();
              this.DatosExtractoTD.length = 0;
              this.objfull = false;
              $("#ExtractosCarteraTD").hide();
            }
          }
          else {
            this.HabilitaMensate = 1;
            this.loading.hide();
            this.DatosExtractoTD.length = 0;
            this.objfull = false;
            $("#ExtractosCarteraTD").hide();
          }
          });

          $("#ExtractosCarteraTD").show();

          //#region Guarda log
          let datas = localStorage.getItem("Data");
          var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
          var LogMisProductosData = new LogMisProductos();
          var nuevoItem = new DatosProductos();
          LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
          LogMisProductosData.IdModulo = 69;
          LogMisProductosData.IdOperacion = 50;
          LogMisProductosData.IdOpcion = 3; // Extrato
          LogMisProductosData.IdTercero = this.lngTercero;
          LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
          LogMisProductosData.IdCuenta = this.lngCuenta;
          nuevoItem.NumeroCuenta = this.ExtactoCarteraTD.get("NumeroCuenta")?.value;
          // nuevoItem.FechaInicial = FechaInicio.toString();
          // nuevoItem.FechaFinal = yearFinal.toString() + "/"+ MesFinal.toString();
          LogMisProductosData.DatosProductos = nuevoItem;
          this.setLogMisProductos(LogMisProductosData);
          // #endregion

    }
  }

  generarPDFTD() {
    var baseg4 = this.FilePDFXLS;
    const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
    const downloadLink = document.createElement("a");
    const fileName = "MovExt_" + this.NumeroDocumento + ".pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    this.loading.hide();
    downloadLink.click();
  }

  sendTD() {
    let data = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));

    this.loading.show();
    //falta validar si existe la plantilla
    this.MiListaProductosService.sendMailCartera(this.lngCuenta, dataLocalStorage.Usuario, dataLocalStorage.Oficina,this.NombreProducto,"TD",null,null,null,null).subscribe(
      result => {
        this.loading.hide();
        this.Response(result);

        var Tercero = Number($("#TerceroPrincipal").val());

        //#region Guarda log
        let data = localStorage.getItem("Data");
        var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
        var LogMisProductosData = new LogMisProductos();
        var nuevoItem = new DatosProductos();
        LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
        LogMisProductosData.IdModulo = 69;
        LogMisProductosData.IdOperacion = 50;
        LogMisProductosData.IdOpcion = 12; // Envio correo 
        LogMisProductosData.IdTercero = Tercero;
        LogMisProductosData.IdCuenta = this.lngCuenta
        LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
        nuevoItem.FechaInicial = "";
        nuevoItem.FechaFinal = "";
        LogMisProductosData.DatosProductos = nuevoItem;
        this.setLogMisProductos(LogMisProductosData);
          // #endregion
      },
      error => {
        this.loading.hide();
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
  }

  ValidaPlantillaMail() {

    this.validaPlantillla = false;

    this.MiListaProductosService.getImagenesGestionMail().subscribe(
      (result : any[]) => {
        result.forEach((element : any) => {
          var TipoMail = element.IdTipoMail;
          if (TipoMail == 3) {
              this.validaPlantillla = true;
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );

  }

  SendEmailCertificateSaldos() {
    this.loading.show();
    this.ValidaPlantillaMail();
    setTimeout(() => {
      this.sendTD();
    }, 7000);
  }


  generarEXCELTD(): void {
    var select1 = Number($(".SelectedMovimiento_CarteraTD").val());
    this.SelectionExtOrMov = this.ExtactoCarteraTD.get('MovExtSelectorCartera')?.value;
    this.SelectionMonth = this.ExtactoCarteraTD.get('MovExtMonthCartera')?.value;
    this.SelectionYear = this.ExtactoCarteraTD.get('MovExtYearCartera')?.value;
    var temporada = this.SelectionYear + "/" + this.SelectionMonth + "/" + "2";
    var fechaInicio = $("#fechaInicarteraTD").val();
    var fechaFin =  $("#fechaendcarteraTD").val();

    if (select1 == 1) {
      this.loading.show();

      this.MiListaProductosService.GenerarXlxsMovimientoCarteraCuentaPadre(this.lngCuenta, fechaInicio,fechaFin).subscribe(
        result => {
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Movimiento_" + this.NumeroDocumento + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        error => {
          this.loading.hide();
          console.log(error);
        }
      )
    }
      var selec = Number($(".SelectedExtracto_CarteraTD").val());
    if (selec == 2) {
      this.SelectionExtOrMov = selec;
        this.loading.show();


      var yearInicial = Number($(".yearInit_Cartera").val());
      var yearFinal = Number($(".yearEnd_Cartera").val());
      var MesInicial = Number($(".MesInit_Cartera").val());
      var MesFinal = Number($(".MesEnd_Cartera").val());
      var FechaInici = yearInicial + "-" + MesInicial + "-1";

      this.MiListaProductosService.GenerarXlxsExtractoCarteraCuentaPadre(this.lngCuenta,FechaInici,yearFinal,MesFinal).subscribe(
        result => {
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        error => {
          this.loading.hide();
          console.log(error);
        }
      )
    }
  }


  ConsultaPagoMinPagoTotal() {
    if ($("#ac-cr-11").prop("checked")) {
      $("#ac-cr-0").prop("checked", false);
      $("#ac-cr-1").prop("checked", false);
      $("#ac-cr-2").prop("checked", false);
      $("#ac-cr-3").prop("checked", false);
      $("#ac-cr-4").prop("checked", false);
      $("#ac-cr-5").prop("checked", false);
      $("#ac-cr-6").prop("checked", false);
      $("#ac-cr-7").prop("checked", false);
      $("#ac-cr-8").prop("checked", false);
      $("#ac-cr-9").prop("checked", false);
      $("#ac-cr-10").prop("checked", false);
      $("#ac-cr-12").prop("checked", false);
      $("#ac-cr-13").prop("checked", false);
      $("#ac-cr-14").prop("checked", false);
      this.MiListaProductosService.ConsultaPagoMinPagoTotal(this.lngCuenta).subscribe(
        result => {
          this.carteraInfo.PagoTotal = result.PagoTotal;
          this.carteraInfo.PagoMini = result.PagoMini;
        }, error => {
          this.loading.hide();
          console.log(error);
        });
    }

    if ($("#ac-cr-100").prop("checked")) {
      $("#ac-cr-112").prop("checked", false);
      $("#ac-cr-110").prop("checked", false);
      $("#ac-cr-119").prop("checked", false);
      $("#ac-cr-101").prop("checked", false);
      $("#ac-cr-315").prop("checked", false);
      this.MiListaProductosService.ConsultaPagoMinPagoTotal(this.lngCuenta).subscribe(
        result => {
          this.carteraInfo.PagoTotal = result.PagoTotal;
          this.carteraInfo.PagoMini = result.PagoMini;
        }, error => {
          this.loading.hide();
          console.log(error);
        });
    }

  }

  CambiarColor(fil : number, producto : number) {
    if (producto === 1) {

        $(".fil_" + this.ColorAnterior).css("background", "#FFFFFF");
        $(".fil_" + fil).css("background", "#e5e5e5");
        $(".colorStrCuenta_" + this.ColorAnterior).css("background", "#FFFFFF");
        $(".colorStrCuenta_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior = fil;
      // limpia sombreado anterior
      $(".fil2_" + this.ColorAnterior2).css("background", "#FFFFFF");
      $(".colorStrCuenta2_" + this.ColorAnterior2).css("background", "#FFFFFF");

      $(".colorStrCuenta3_" + this.ColorAnterior3).css("background", "#FFFFFF");
      $(".fil3_" + this.ColorAnterior3).css("background", "#FFFFFF");

      $(".fil4_" + this.ColorAnterior4).css("background", "#FFFFFF");
      $(".colorStrCuenta4_" + this.ColorAnterior4).css("background", "#FFFFFF");

      this.ColorAnterior2 = null;
      this.ColorAnterior3 = null;
      this.ColorAnterior4 = null;
      this.ColorAnterior5 = null;
    }else if (producto === 2) {

        $(".fil2_" + this.ColorAnterior2).css("background", "#FFFFFF");
        $(".fil2_" + fil).css("background", "#e5e5e5");
        $(".colorStrCuenta2_" + this.ColorAnterior2).css("background", "#FFFFFF");
        $(".colorStrCuenta2_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior2 = fil;

      // limpia sombreado anterior
      $(".fil_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".colorStrCuenta_" + this.ColorAnterior).css("background", "#FFFFFF");

      $(".colorStrCuenta3_" + this.ColorAnterior3).css("background", "#FFFFFF");
      $(".fil3_" + this.ColorAnterior3).css("background", "#FFFFFF");

      $(".fil4_" + this.ColorAnterior4).css("background", "#FFFFFF");
      $(".colorStrCuenta4_" + this.ColorAnterior4).css("background", "#FFFFFF");

      this.ColorAnterior = null;
      this.ColorAnterior3 = null;
      this.ColorAnterior4 = null;
      this.ColorAnterior5 = null;
    }else if (producto === 3) {

        $(".fil3_" + this.ColorAnterior3).css("background", "#FFFFFF");
        $(".fil3_" + fil).css("background", "#e5e5e5");
        $(".colorStrCuenta3_" + this.ColorAnterior3).css("background", "#FFFFFF");
        $(".colorStrCuenta3_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior3 = fil;

      // limpia sombreado anterior
      $(".fil_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".colorStrCuenta_" + this.ColorAnterior).css("background", "#FFFFFF");

      $(".fil2_" + this.ColorAnterior2).css("background", "#FFFFFF");
      $(".colorStrCuenta2_" + this.ColorAnterior2).css("background", "#FFFFFF");

      $(".fil4_" + this.ColorAnterior4).css("background", "#FFFFFF");
      $(".colorStrCuenta4_" + this.ColorAnterior4).css("background", "#FFFFFF");

      this.ColorAnterior = null;
      this.ColorAnterior2 = null;
      this.ColorAnterior4 = null;
      this.ColorAnterior5 = null;
    }else if (producto === 4) {

        $(".fil4_" + this.ColorAnterior4).css("background", "#FFFFFF");
        $(".fil4_" + fil).css("background", "#e5e5e5");
        $(".colorStrCuenta4_" + this.ColorAnterior4).css("background", "#FFFFFF");
        $(".colorStrCuenta4_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior4 = fil;

      // limpia sombreado anterior
      $(".fil_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".colorStrCuenta_" + this.ColorAnterior).css("background", "#FFFFFF");

      $(".fil2_" + this.ColorAnterior2).css("background", "#FFFFFF");
      $(".colorStrCuenta2_" + this.ColorAnterior2).css("background", "#FFFFFF");

      $(".colorStrCuenta3_" + this.ColorAnterior3).css("background", "#FFFFFF");
      $(".fil3_" + this.ColorAnterior3).css("background", "#FFFFFF");

      this.ColorAnterior = null;
      this.ColorAnterior2 = null;
      this.ColorAnterior3 = null;
      this.ColorAnterior5 = null;

    }else if (producto === 5) {

      $(".fil5_" + this.ColorAnterior5).css("background", "#FFFFFF");
      $(".fil5_" + fil).css("background", "#e5e5e5");
      $(".colorStrCuenta5_" + this.ColorAnterior5).css("background", "#FFFFFF");
      $(".colorStrCuenta5_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior5 = fil;

      // limpia sombreado anterior



    }else if (producto === 6) {
      $(".Prov" + this.ColorAnterior6).css("background", "#FFFFFF");
      $(".Prov" + fil).css("background", "#e5e5e5");
      $(".strfecha" + this.ColorAnterior6).css("background", "#FFFFFF");
      $(".strfecha" + fil).css("background", "#e5e5e5");
      this.ColorAnterior6 = fil;
      // limpia sombreado anterior
    }else if (producto === 7) {
      $(".ahoCumpli_" + this.ColorAnterior7).css("background", "#FFFFFF");
      $(".ahoCumpli_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior7 = fil;
      // limpia sombreado anterior
    }else if (producto === 8) {
      $(".ahoCalid_" + this.ColorAnterior8).css("background", "#FFFFFF");
      $(".ahoCalid_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior8 = fil;
      // limpia sombreado anterior
    }else if (producto === 9) {
      $(".filCond_" + this.ColorAnterior9).css("background", "#FFFFFF");
      $(".filCond_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior9 = fil;
    } else if (producto === 90) {   
      $(".filGara_" + this.ColorAnterior90).css("background", "#FFFFFF");
      $(".filGara_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior90 = fil;
    } else if (producto === 10) {
      $(".filCond_" + this.ColorAnterior10).css("background", "#FFFFFF");
      $(".filCond_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior10 = fil;
    } else if (producto === 100) {
      $(".filGara_" + this.ColorAnterior100).css("background", "#FFFFFF");
      $(".filGara_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior100 = fil;
    }
    else if (producto === 11) {
      $(".filfijo_" + this.ColorAnterior11).css("background", "#FFFFFF");
      $(".filfijo_" + fil).css("background", "#e5e5e5");
      $(".filDif_" + this.ColorAnterior11).css("background", "#FFFFFF");
      $(".filDif_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior11 = fil;
    }
    else if (producto === 12) {
      $(".filRes_" + this.ColorAnterior12).css("background", "#FFFFFF");
      $(".filRes_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior12 = fil;
    }
    else if (producto === 13) {
      $(".filRef_" + this.ColorAnterior13).css("background", "#FFFFFF");
      $(".filRef_" + fil).css("background", "#e5e5e5");      
      this.ColorAnterior13 = fil;
    }
    else if (producto === 14) {      
      $(".filReff_" + this.ColorAnterior14).css("background", "#FFFFFF");
      $(".filReff_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior14 = fil;
    }
    else if (producto === 15) {
      $(".filRefd_" + this.ColorAnterior15).css("background", "#FFFFFF");
      $(".filRefd_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior15 = fil;
    }
    else if (producto === 16) {
      $(".filReffd_" + this.ColorAnterior16).css("background", "#FFFFFF");
      $(".filReffd_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior16 = fil;
    }


  }

  LimpiarVariablesCali() {
    this.CalificaAnterior = null;
  }

  LimpiarVariables() {
    this.ColorAnterior = null;
    this.ColorAnterior2 = null;
    this.ColorAnterior3 = null;
    this.ColorAnterior4 = null;
    this.ColorAnterior5 = null;
    this.ColorAnterior6 = null;
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

      $(".Cali_" + this.CalificaAnterior).css("background", "#FFFFFF");
      $(".Cali_" + fil).css("background", "#e5e5e5");
    }
    this.CalificaAnterior = fil;

  }
}


