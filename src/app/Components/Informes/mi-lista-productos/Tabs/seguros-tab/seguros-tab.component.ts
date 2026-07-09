import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MiListaProductosService } from '../../../../../Services/Informes/mi-lista-productos.service';
import { InfoSeguro,LogMisProductos,DatosProductos,MesxYear } from '../../../../../Models/Informes/MisProductos/mis-producto.model';
import {
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import moment from 'moment';
import swal from "sweetalert2";
import { LoadingService } from "../../../../../Services/shared/loading.service";

const ColorPrimario = "rgb(13,165,80)";
const ColorSecundario = "rgb(13,165,80,0.7)";
@Component({
  selector: "app-seguros-tab",
  templateUrl: "./seguros-tab.component.html",
  styleUrls: ["./seguros-tab.component.css"],
  providers: [MiListaProductosService],
  standalone : false
})
export class SegurosTabComponent implements OnInit {
  constructor(private MiListaProductosService: MiListaProductosService,
    private loading: LoadingService
  ) {}


  public terceroId: any;
  public DataSegurosCancelados: any[] = [];
  public DataSeguros: any[] = [];
  public SeguroVehiculo: any[] = [];
  public SeguroVehiculoCancelado: any[] = [];
  public ValidadaActivo: boolean = true;
  public ActivaCargando: Boolean = false;
  public noRegistros: Boolean = false;
  public HabilitaMensate: any = 0;
  public validaMail: Boolean = false;
  public MostrarDetalleSeguro: Boolean = false;
  public MostrarExtractoSeguro: Boolean = false;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public ColorAnterior: any;
  public ColorBeneficiario: any;
  public ColorRenovacion: any;
  public ColorMovimientos: any;
  public Extractos: any[] = [];
  public ExtractosVida: any[] = [];
  public ExtractosVehiculo: any[] = [];
  public ExtractosConvenio: any[] = [];
  public Movimientos: any[] = [];
  public MovimientosVida: any[] = [];
  public MovimientosVehiculo: any[] = [];
  public MovimientosConvenio: any[] = [];
  public Acordeon1: Boolean = false;
  public Acordeon2: Boolean = false;
  public Acordeon3: Boolean = false;
  public Acordeon4: Boolean = false;
  public Acordeon5: Boolean = false;
  public validaJuridico: Boolean = false;
  public ExtactoSeguro!: FormGroup;
  public ExtactoSeguroVhi!: FormGroup;
  public Acordeon6: Boolean = false;
  public Acordeon7: Boolean = false;
  public Acordeon8: Boolean = false;
  public AcordeonSegVida: Boolean = false;
  public AcordeonSegExequiales: Boolean = false;
  public AcordeonSegVehiculo: Boolean = false;
  public AcordeonSegConvenio: Boolean = false;
  public infoSeguroVidaDta = new InfoSeguro();
  public InfoSeguroExequial = new InfoSeguro();
  public InfoConvenio = new InfoSeguro();
  public InfoSeguroVehiculo = new InfoSeguro();
  public BeneficiariosSeguroVida: any[] = [];
  public RenovacionSeguroVida: any[] = [];
  public RenovacionSeguroExequiales: any[] = [];
  public PreexistenciaSeguroVida: any[] = [];
  public HistoricoSeguroVida: any[] = [];
  public HistoricoSeguroVehiculo: any[] = [];
  public RenovacionSeguroVehiculo: any[] = [];
  public BeneficiariosSeguroExequial: any[] = [];
  public RenovacionSeguroExequial: any[] = [];
  public RenovacionConvenios: any[] = [];
  public InscritosSeguroExequial: any[] = [];
  public InscritosConvenios: any[] = [];
  public HistoricoSeguroExequial: any[] = [];
  public HistoricoConvenios: any[] = [];
  public ConvenioActivo: any[] = [];
  public ConvenioCancelado: any[] = [];
  public SelectionExtOrMov: any;
  public fechaFinC: any;
  public fechaInicioC: any;
  public today: any;
  public InicioVacida: Boolean = false;
  public FinVacida: Boolean = false;
  public SelectErroneo: Boolean = false;
  public FechaMayorAmenor: Boolean = false;
  public FechaMenorMayor: Boolean = false;
  public fechaAperturaCuenta: any;
  public fechaAperturaActualDisabled: any;
  public inicioNoValida: Boolean = false;
  public finNoValida: Boolean = false;
  public valueFechaFinal: any;
  public valueFechaInicial: any;
  public valueSlect: any;
  public selectedEstado : any;
  public linkPdf: any;
  public consecutivo: any;
  public TipoAlerta: any;
  public NoRegistros: any = 0;
  public NumeroDocumento: any = 0;
  public idCuenta: any;
  public NumeroCuenta: any;
  public validaForm: Boolean = false;
  public SeleccionExt: number = 2;
  public yearInit: any;
  public yearEnd: any;
  public MesInit: any;
  public MesEnd: any;
  public mesInicial: any;
  public YearsxMes: any[] = [];
  public yearActual: any;
  public yearInicial: any;
  //variables validan formulario de extracto
  public validaAnoInicial: Boolean = false;
  public validaAnoFinal: Boolean = false;
  public validaMesInicial: Boolean = false;
  public validaMesFinal: Boolean = false;
  public mesxYear: MesxYear[] = [];
  public mesxYearEnd: MesxYear[] = [];
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

  ngOnInit() {
    this.FormExtracto();
    this.FormExtractoVhi();
    this.selectedEstado = "-";
  }



  detalleExtractoVida(data : any) {
    this.HabilitaMensate = 0;
    this.ExtactoSeguro.get("MovExtSelector")?.setValue("-");
    this.ExtactoSeguro.get("IdTercero")?.setValue(this.terceroId);
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var consecutivo = cuentaArray[2];
    var intProducto = cuentaArray[1];
    var intOficina = cuentaArray[0];
    this.idCuenta = data.lngIdCuenta;
    this.NumeroCuenta = data.strCuenta;
    var consecutivoSinCeros = Number(consecutivo);
    this.ExtactoSeguro.get("consecutivo")?.setValue(consecutivoSinCeros);
    this.ExtactoSeguro.get("NumeroCuenta")?.setValue(cuenta);
    this.ExtactoSeguro.get("intProducto")?.setValue(intProducto);
    this.ExtactoSeguro.get("intOficina")?.setValue(intOficina);
    this.ExtactoSeguro.get("NombreProducto")?.setValue(data.NameProducto);
    this.ExtactoSeguro.get("TipoProducto")?.setValue("Seguro");
    this.consecutivo = consecutivo;
    var consecutivo = cuentaArray[2];
    this.fechaAperturaCuenta = moment(new Date(data.dtmMatricula)).format('YYYY-MM-DD');
    this.fechaAperturaActualDisabled = moment(new Date()).format('YYYY-MM-DD');
    $("#fechaInitSegVida").val(this.fechaAperturaCuenta);
    $("#fechaendSegVida").val(this.fechaAperturaActualDisabled);
    this.ConsultaYears();
  }

  detalleExtractoVehiculo(data : any) {
    this.HabilitaMensate = 0;
    this.ExtactoSeguroVhi.get("IdTercero")?.setValue(this.terceroId);
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var consecutivo = cuentaArray[2];
    var intProducto = cuentaArray[1];
    var intOficina = cuentaArray[0];
    this.idCuenta = data.lngIdCuenta;
    this.NumeroCuenta = data.strCuenta;
    var consecutivoSinCeros = Number(consecutivo);
    this.ExtactoSeguroVhi.get("consecutivo")?.setValue(consecutivoSinCeros);
    this.ExtactoSeguroVhi.get("intProducto")?.setValue(intProducto);
    this.ExtactoSeguroVhi.get("intOficina")?.setValue(intOficina);
    this.ExtactoSeguroVhi.get("NumeroCuenta")?.setValue(cuenta);
    this.ExtactoSeguroVhi.get("NombreProducto")?.setValue(data.NameProducto);
    this.ExtactoSeguroVhi.get("TipoProducto")?.setValue("Seguro");
    this.consecutivo = consecutivo;
    var consecutivo = cuentaArray[2];
    this.ExtactoSeguroVhi.get("MovExtSelector")?.setValue("-");
    this.fechaAperturaCuenta = moment(new Date(data.dtmMatricula)).format('YYYY-MM-DD');
    this.fechaAperturaActualDisabled = moment(new Date()).format('YYYY-MM-DD');
    $("#fechaInitSegVehiculo").val(this.fechaAperturaCuenta);
    $("#fechaendSegVehiculo").val(this.fechaAperturaActualDisabled);
    this.ConsultaYears();
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





  Limpiar(value : number) {
    this.ExtactoSeguro.get("MovExtSelector")?.setValue("-");
    this.ExtactoSeguroVhi.get("MovExtSelector")?.setValue("-");
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
    this.ExtractosVehiculo.length = 0;
    this.MovimientosVehiculo.length = 0;
    this.ExtractosConvenio.length = 0;
    this.MovimientosConvenio.length = 0;
    this.ExtractosVida.length = 0;
    this.MovimientosVida.length = 0;
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

  cerraraSegVida(value : number) {
    if (value == 1) {
      this.Acordeon1 = true;
      //Closed first tab seguro de vida
      $(".negociacionVida").prop("checked", false);
      $(".saldosVida").prop("checked", false);
      $(".beneficiariosVida").prop("checked", false);
      $(".renovacionesVida").prop("checked", false);
      $(".movimientosVida").prop("checked", false);
      $(".fechasVida").prop("checked", false);
      //end first tab
    } else if (value == 2) {
      this.Acordeon2 = true;
      $(".datosVida").prop("checked", false);
      $(".saldosVida").prop("checked", false);
      $(".beneficiariosVida").prop("checked", false);
      $(".renovacionesVida").prop("checked", false);
      $(".movimientosVida").prop("checked", false);
      $(".fechasVida").prop("checked", false);
    } else if (value == 3) {
      this.Acordeon3 = true;
      $(".datosVida").prop("checked", false);
      $(".negociacionVida").prop("checked", false);
      $(".beneficiariosVida").prop("checked", false);
      $(".renovacionesVida").prop("checked", false);
      $(".movimientosVida").prop("checked", false);
      $(".fechasVida").prop("checked", false);
    } else if (value == 4) {
      this.Acordeon4 = true;
      $(".datosVida").prop("checked", false);
      $(".negociacionVida").prop("checked", false);
      $(".saldosVida").prop("checked", false);
      $(".renovacionesVida").prop("checked", false);
      $(".movimientosVida").prop("checked", false);
      $(".fechasVida").prop("checked", false);
    } else if (value == 5) {
      this.Acordeon5 = true;
      $(".datosVida").prop("checked", false);
      $(".negociacionVida").prop("checked", false);
      $(".saldosVida").prop("checked", false);
      $(".beneficiariosVida").prop("checked", false);
      // $(".renovacionesVida").prop('checked', false);
      $(".movimientosVida").prop("checked", false);
      $(".fechasVida").prop("checked", false);
    } else if (value == 6) {
      this.Acordeon6 = true;
      $(".datosVida").prop("checked", false);
      $(".negociacionVida").prop("checked", false);
      $(".saldosVida").prop("checked", false);
      $(".beneficiariosVida").prop("checked", false);
      $(".renovacionesVida").prop("checked", false);
      // $(".movimientosVida").prop('checked', false);
      $(".fechasVida").prop("checked", false);
    } else if (value == 7) {
      this.Acordeon7 = true;
      $(".datosVida").prop("checked", false);
      $(".negociacionVida").prop("checked", false);
      $(".saldosVida").prop("checked", false);
      $(".beneficiariosVida").prop("checked", false);
      $(".renovacionesVida").prop("checked", false);
      $(".movimientosVida").prop("checked", false);
    }
  }

  cerraraSegVehiculo(value : number) {
    if (value == 1) {
      this.Acordeon1 = true;

      //Closed first tab seguro de vida
      //$(".datosVehiculo").prop("checked", false);
      $(".negociacionViehiculo").prop("checked", false);
      $(".saldosVehiculo").prop("checked", false);
      $(".InscritosVehiculo").prop("checked", false);
      $(".beneficiariosVehiculo").prop("checked", false);
      $(".renovacionesVehiculo").prop("checked", false);
      $(".movimientosVehiculo").prop("checked", false);
      $(".fechasVehiculo").prop("checked", false);

      //end first tab
    } else if (value == 2) {
      this.Acordeon2 = true;
      $(".datosVehiculo").prop("checked", false);
      // $(".negociacionViehiculo").prop("checked", false);
      $(".saldosVehiculo").prop("checked", false);
      $(".InscritosVehiculo").prop("checked", false);
      $(".beneficiariosVehiculo").prop("checked", false);
      $(".renovacionesVehiculo").prop("checked", false);
      $(".movimientosVehiculo").prop("checked", false);
      $(".fechasVehiculo").prop("checked", false);
    } else if (value == 3) {
      this.Acordeon3 = true;
      $(".datosVehiculo").prop("checked", false);
      $(".negociacionViehiculo").prop("checked", false);
      //$(".saldosVehiculo").prop("checked", false);
      $(".InscritosVehiculo").prop("checked", false);
      $(".beneficiariosVehiculo").prop("checked", false);
      $(".renovacionesVehiculo").prop("checked", false);
      $(".movimientosVehiculo").prop("checked", false);
      $(".fechasVehiculo").prop("checked", false);
    } else if (value == 4) {
      this.Acordeon4 = true;
      $(".datosVehiculo").prop("checked", false);
      $(".negociacionViehiculo").prop("checked", false);
      $(".saldosVehiculo").prop("checked", false);
      //$(".InscritosVehiculo").prop("checked", false);
      $(".beneficiariosVehiculo").prop("checked", false);
      $(".renovacionesVehiculo").prop("checked", false);
      $(".movimientosVehiculo").prop("checked", false);
      $(".fechasVehiculo").prop("checked", false);
    } else if (value == 5) {
      this.Acordeon5 = true;
      $(".datosVehiculo").prop("checked", false);
      $(".negociacionViehiculo").prop("checked", false);
      $(".saldosVehiculo").prop("checked", false);
      $(".InscritosVehiculo").prop("checked", false);
      // $(".beneficiariosVehiculo").prop("checked", false);
      $(".renovacionesVehiculo").prop("checked", false);
      $(".movimientosVehiculo").prop("checked", false);
      $(".fechasVehiculo").prop("checked", false);
    } else if (value == 6) {
      this.Acordeon6 = true;
      $(".datosVehiculo").prop("checked", false);
      $(".negociacionViehiculo").prop("checked", false);
      $(".saldosVehiculo").prop("checked", false);
      $(".InscritosVehiculo").prop("checked", false);
      $(".beneficiariosVehiculo").prop("checked", false);
      //$(".renovacionesVehiculo").prop("checked", false);
      $(".movimientosVehiculo").prop("checked", false);
      $(".fechasVehiculo").prop("checked", false);
    } else if (value == 7) {
      this.Acordeon7 = true;
      $(".datosVehiculo").prop("checked", false);
      $(".negociacionViehiculo").prop("checked", false);
      $(".saldosVehiculo").prop("checked", false);
      $(".InscritosVehiculo").prop("checked", false);
      $(".beneficiariosVehiculo").prop("checked", false);
      $(".renovacionesVehiculo").prop("checked", false);
      //$(".movimientosVehiculo").prop("checked", false);
      $(".fechasVehiculo").prop("checked", false);
    } else if (value == 8) {
      this.Acordeon8 = true;
      $(".datosVehiculo").prop("checked", false);
      $(".negociacionViehiculo").prop("checked", false);
      $(".saldosVehiculo").prop("checked", false);
      $(".InscritosVehiculo").prop("checked", false);
      $(".beneficiariosVehiculo").prop("checked", false);
      $(".renovacionesVehiculo").prop("checked", false);
      $(".movimientosVehiculo").prop("checked", false);
      //$(".fechasVehiculo").prop("checked", false);
    }
  }

  opcionSelected(valueSlect : string) {
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.ExtractosVida.length = 0;
    this.MovimientosVida.length = 0;
    this.ExtractosVehiculo.length = 0;
    this.MovimientosVehiculo.length = 0;
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
      $(".SelectedExtracto_Seguro").prop('selectedIndex', 2);
    } else if (valueSlect.toString() == '-') {
      this.SelectErroneo = true;
      // no hace nada
    } else {
      this.SeleccionExt = 1;
      this.valueSlect = '1';
      this.validaForm = false;
      this.SelectErroneo = false;
      setTimeout(() => {
        $(".SelectedMovimiento_Seguro").prop('selectedIndex', 1);
        console.log("esta es la fecha actual disabled");
        console.log(this.fechaAperturaCuenta);
        console.log(this.fechaAperturaActualDisabled);
        $("#fechaInitSegVida").val(this.fechaAperturaCuenta);
        $("#fechaendSegVida").val(this.fechaAperturaActualDisabled);

      }, 400);
    }

  }

  opcionSelectedVhi(valueSlect : string) {
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.ExtractosVida.length = 0;
    this.MovimientosVida.length = 0;
    this.ExtractosVehiculo.length = 0;
    this.MovimientosVehiculo.length = 0;
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
      $(".SelectedExtracto_Seguro").prop('selectedIndex', 2);
    } else if (valueSlect.toString() == '-') {
      this.SelectErroneo = true;

      // no hace nada
    } else {
      this.SeleccionExt = 1;
      this.valueSlect = '1';
      this.SelectErroneo = false;
      this.validaForm = false;
      setTimeout(() => {
        $(".SelectedMovimiento_Seguro").prop('selectedIndex', 1);
        console.log("esta es la fecha actual disabled");
        console.log(this.fechaAperturaCuenta);
        console.log(this.fechaAperturaActualDisabled);
        $("#fechaInitSegVehiculo").val(this.fechaAperturaCuenta);
        $("#fechaendSegVehiculo").val(this.fechaAperturaActualDisabled);
      }, 400);
    }

  }

  SendEmailSeguros() {
    this.loading.show();
    this.ValidaPlantillaMail();
    setTimeout(() => {
      this.SendMailSeguros();
    }, 5000);
  }

  SendEmailSegurosVhi() {
    this.loading.show();
    this.ValidaPlantillaMail();
    setTimeout(() => {
      this.SendMailSegurosVhi();
    }, 5000);
  }

SendMailSeguros(): void {

  if (this.validaMail === true) {

    this.loading.show();

    this.MiListaProductosService
      .sendMailProductos(this.ExtactoSeguro.value)
      .subscribe(
        result => {

          try {

            this.Response(result);

            const tercero = Number(
              $("#TerceroPrincipal").val()
            );

            const datas = localStorage.getItem("Data");

            const dataLocalStorage = JSON.parse(
              window.atob(datas == null ? "" : datas)
            );

            //#region Guarda log

            const logMisProductosData =
              new LogMisProductos();

            const nuevoItem =
              new DatosProductos();

            logMisProductosData.IdOficina =
              parseInt(dataLocalStorage.NumeroOficina);

            logMisProductosData.IdModulo = 69;
            logMisProductosData.IdOperacion = 51;
            logMisProductosData.IdOpcion = 12; // Envío correo
            logMisProductosData.IdTercero = tercero;
            logMisProductosData.IdCuenta = this.idCuenta;
            logMisProductosData.IdUsuarioERP =
              dataLocalStorage.IdUsuario;

            nuevoItem.FechaInicial = "";
            nuevoItem.FechaFinal = "";

            logMisProductosData.DatosProductos =
              nuevoItem;

            this.setLogMisProductos(
              logMisProductosData
            );

            //#endregion

          } finally {

            this.loading.hide();
          }
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
      );

  } else {

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

  SendMailSegurosVhi(): void {
  if (this.validaMail === true) {
    this.loading.show();
    this.MiListaProductosService
      .sendMailProductos(this.ExtactoSeguroVhi.value)
      .subscribe(
        result => {
          try {
            this.Response(result);
            const tercero = Number(
              $("#TerceroPrincipal").val()
            );
            const datas = localStorage.getItem("Data");
            const dataLocalStorage = JSON.parse(
              window.atob(datas == null ? "" : datas)
            );
            //#region Guarda log
            const logMisProductosData =
              new LogMisProductos();

            const nuevoItem =
              new DatosProductos();

            logMisProductosData.IdOficina =
              parseInt(dataLocalStorage.NumeroOficina);

            logMisProductosData.IdModulo = 69;
            logMisProductosData.IdOperacion = 51;
            logMisProductosData.IdOpcion = 12;
            logMisProductosData.IdTercero = tercero;
            logMisProductosData.IdCuenta = this.idCuenta;
            logMisProductosData.IdUsuarioERP =
              dataLocalStorage.IdUsuario;

            nuevoItem.FechaInicial = "";
            nuevoItem.FechaFinal = "";

            logMisProductosData.DatosProductos =
              nuevoItem;

            this.setLogMisProductos(
              logMisProductosData
            );

            //#endregion

          } finally {

            this.loading.hide();
          }
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
      );

  } else {

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
    $(".yearInit_Seguro").prop('selectedIndex', 0);
    $(".yearEnd_Seguro").prop('selectedIndex', 0);
    $(".MesInit_Seguro").prop('selectedIndex', 0);
    $(".MesEnd_Seguro").prop('selectedIndex', 0);
  }

  MesSelected(mes : string) {
    var AñoFinal = Number($(".yearEnd_Seguro").val());
    var añoInicial = Number($(".yearInit_Seguro").val());
    var mesFinal = $(".MesEnd_Seguro").val();
    if ((Number(mes) > Number(mesFinal)) && añoInicial == AñoFinal) {
      this.validaMesInicial = true;
      this.validaMesFinal = false;
      this.ExtractosVida.length = 0;
      this.ExtractosVehiculo.length = 0;
      return null;
    }  else {
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }
    return null;
  }

  MesSelectedEnd(mes : string) {
    var mesInicial = $(".MesInit_Seguro").val();
    var AñoFinal = Number($(".yearEnd_Seguro").val());
    var añoInicial = Number($(".yearInit_Seguro").val());
    if ((Number(mes) < Number(mesInicial)) && AñoFinal == añoInicial) {
      this.validaMesFinal = true;
      this.validaMesInicial = false;
      this.ExtractosVida.length = 0;
      this.ExtractosVehiculo.length = 0;
      return null;
    } else {
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }
    return null;
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

    var añoInicial = $(".yearInit_Seguro").val();
    //#region validaciones de campo
    if (Number(year) < Number(añoInicial)) {
      this.validaAnoFinal = true;
      this.validaAnoInicial = false;
      this.ExtractosVida.length = 0;
      this.ExtractosVehiculo.length = 0;
      return null;
    } else {
      this.validaAnoFinal = false;
      this.validaAnoInicial = false;
      setTimeout(() => {
        $(".MesEnd_Seguro").prop('selectedIndex', 0);
      }, 400);
    }



    console.log(this.mesxYearEnd)
    return null;
  }

  opcionSelectedYearInit(year : string) {

    //#endregion
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
        var AñoFinal = $(".yearEnd_Seguro").val();
        if (Number(year) > Number(AñoFinal)) {
          this.validaAnoInicial = true;
          this.validaAnoFinal = false;
          this.ExtractosVida.length = 0;
          this.ExtractosVehiculo.length = 0;
          return null;
        } else {
          this.validaAnoInicial = false;
          this.validaAnoFinal = false;
          setTimeout(() => {
            $(".MesInit_Seguro").prop('selectedIndex', 0);
          }, 400);
        }

    console.log(this.mesxYear)
    return null;
  }

  ResetModal() {
    // this.HabilitaMensate = 1;
    this.ExtactoSeguro.get("MovExtSelector")?.setValue("-");
    this.ExtactoSeguroVhi.get("MovExtSelector")?.setValue("-");

    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.ExtractosVehiculo.length = 0;
    this.MovimientosVehiculo.length = 0;
    this.ExtractosVida.length = 0;
    this.MovimientosVida.length = 0;
    this.ExtractosConvenio.length = 0;
    this.MovimientosConvenio.length = 0;
    this.FechaMenorMayor = false;
    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.InicioVacida = false;
    this.FinVacida = false;

    this.validaForm = false;
    this.validaMesFinal = false;
    this.validaMesInicial = false;
    this.validaAnoFinal = false;
    this.validaAnoFinal = false;
    this.seleccioneTodo();


  }



  ConsultarExtractoSeg() {
    var yearInicial = Number($(".yearInit_Seguro").val());
    var yearFinal = Number($(".yearEnd_Seguro").val());
    var MesInicial = Number($(".MesInit_Seguro").val());
    var MesFinal = Number($(".MesEnd_Seguro").val());
    var selExtracto = $("#SelectedExtracto_SeguroVida").val();

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

      this.loading.show();
      let datas = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
      this.ExtactoSeguro.get("yearInit")?.setValue(yearInicial);
      this.ExtactoSeguro.get("yearEnd")?.setValue(yearFinal);
      this.ExtactoSeguro.get("MesInit")?.setValue(MesInicial);
      this.ExtactoSeguro.get("MesEnd")?.setValue(MesFinal);
      this.ExtactoSeguro.get("Usuario")?.setValue(dataLocalStorage.Usuario);
      this.ExtactoSeguro.get("Oficina")?.setValue(dataLocalStorage.Oficina);

      this.MiListaProductosService.GetExtractoSeguros(
        this.ExtactoSeguro.value
      ).subscribe(
        (result) => {
          this.loading.hide();
          this.MapearEncabezadoTabla(result, 1);

          //#region Guarda log
          let datas = localStorage.getItem("Data");
          var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
          var LogMisProductosData = new LogMisProductos();
          var nuevoItem = new DatosProductos();
          LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
          LogMisProductosData.IdModulo = 69;
          LogMisProductosData.IdOperacion = 51;
          LogMisProductosData.IdOpcion = 3; // Extrato
          LogMisProductosData.IdTercero = this.terceroId;
          LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
          LogMisProductosData.IdCuenta = this.idCuenta;
          nuevoItem.NumeroCuenta = result.Cuenta;
          nuevoItem.FechaInicial = yearInicial.toString() +"/"+ MesInicial.toString();
          nuevoItem.FechaFinal = yearFinal.toString() +"/"+ MesFinal.toString();
          LogMisProductosData.DatosProductos = nuevoItem;
          this.setLogMisProductos(LogMisProductosData);
          // #endregion
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
  }

  ConsultarExtractoVhi() {
    var yearInicial = Number($(".yearInit_Seguro").val());
    var yearFinal = Number($(".yearEnd_Seguro").val());
    var MesInicial = Number($(".MesInit_Seguro").val());
    var MesFinal = Number($(".MesEnd_Seguro").val());
    var selExtracto = $("#SelectedExtracto_Seguro").val();

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

      this.loading.show();
      let datas = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
      this.ExtactoSeguroVhi.get("yearInit")?.setValue(yearInicial);
      this.ExtactoSeguroVhi.get("yearEnd")?.setValue(yearFinal);
      this.ExtactoSeguroVhi.get("MesInit")?.setValue(MesInicial);
      this.ExtactoSeguroVhi.get("MesEnd")?.setValue(MesFinal);
      this.ExtactoSeguroVhi.get("Usuario")?.setValue(dataLocalStorage.Usuario);
      this.ExtactoSeguroVhi.get("Oficina")?.setValue(dataLocalStorage.Oficina);

      this.MiListaProductosService.GetExtractoSeguros(
        this.ExtactoSeguroVhi.value
      ).subscribe(
        (result) => {
          this.loading.hide();
          this.MapearEncabezadoTabla(result, 3);
          //#region Guarda log
          let datas = localStorage.getItem("Data");
          var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
          var LogMisProductosData = new LogMisProductos();
          var nuevoItem = new DatosProductos();
          LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
          LogMisProductosData.IdModulo = 69;
          LogMisProductosData.IdOperacion = 51;
          LogMisProductosData.IdOpcion = 3; // Extrato
          LogMisProductosData.IdTercero = this.terceroId;
          LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
          LogMisProductosData.IdCuenta = this.idCuenta;
          nuevoItem.NumeroCuenta = result.Cuenta;
          nuevoItem.FechaInicial = yearInicial.toString() +"/"+ MesInicial.toString();
          nuevoItem.FechaFinal = yearFinal.toString() +"/"+ MesFinal.toString();
          LogMisProductosData.DatosProductos = nuevoItem;
          this.setLogMisProductos(LogMisProductosData);
          // #endregion
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
  }

  ConsultarSegVida() {
    this.SelectionExtOrMov = this.ExtactoSeguro.get("MovExtSelector")?.value;
    var FechaInicio = $("#fechaInitSegVida").val();
    var FechaFin = $("#fechaendSegVida").val();
    this.fechaInicioC = FechaInicio;
    this.fechaFinC = FechaFin;
    var fecha = new Date();
    this.today = fecha;

    if (FechaInicio == "") {
      this.InicioVacida = true;
      this.ExtractosVida.length = 0;
      this.MovimientosVida.length = 0;
    } else if (FechaFin == "") {
      this.FinVacida = true;
      this.InicioVacida = false;
      this.ExtractosVida.length = 0;
      this.MovimientosVida.length = 0;
    } else if (this.SelectionExtOrMov == "-") {
      this.SelectErroneo = true;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FechaMenorMayor = false;
      this.FinVacida = false;
      this.ExtractosVida.length = 0;
      this.MovimientosVida.length = 0;
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
      this.ExtractosVida.length = 0;
      this.MovimientosVida.length = 0;
    } else if ( FechaFin != null &&
      FechaFin > this.fechaAperturaActualDisabled ||  FechaFin != null &&
      FechaFin < this.fechaAperturaCuenta ||  FechaFin != null &&  FechaInicio != null &&
      FechaFin < FechaInicio
    ) {
      this.finNoValida = true;
      this.inicioNoValida = false;
      this.SelectErroneo = false;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FinVacida = false;
      this.FechaMenorMayor = false;
      this.ExtractosVida.length = 0;
      this.MovimientosVida.length = 0;
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
        this.ExtactoSeguro.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtactoSeguro.get("FechaFin")?.setValue(FechaFin);
        this.loading.show();
        this.MiListaProductosService.GetExtractoSeguros(
          this.ExtactoSeguro.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            this.MapearEncabezadoTabla(result, 1);

            //#region Guarda log
            let datas = localStorage.getItem("Data");
            var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 51;
            LogMisProductosData.IdOpcion = 3; // Extrato
            LogMisProductosData.IdTercero = this.terceroId;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            LogMisProductosData.IdCuenta = this.idCuenta;
            nuevoItem.NumeroCuenta = result.Cuenta;
            nuevoItem.FechaInicial = FechaInicio == null ? "" :FechaInicio.toString();
            nuevoItem.FechaFinal = FechaFin == null ? "" : FechaFin.toString();
            LogMisProductosData.DatosProductos = nuevoItem;
            this.setLogMisProductos(LogMisProductosData);
            // #endregion
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
      } else if (
        this.SelectionExtOrMov == 1 &&
        FechaInicio != null &&
        FechaFin != null
      ) {
        this.ExtactoSeguro.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtactoSeguro.get("FechaFin")?.setValue(FechaFin);
        this.loading.show();
        this.MiListaProductosService.getMovimientoSeguro(
          this.ExtactoSeguro.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            this.MapearEncabezadoTablaMov(result, 2);
            //#region Guarda log
            let datas = localStorage.getItem("Data");
            var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 51;
            LogMisProductosData.IdOpcion = 2; // Movimiento
            LogMisProductosData.IdTercero = this.terceroId;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            LogMisProductosData.IdCuenta = this.idCuenta;
            nuevoItem.NumeroCuenta = result.Cuenta;
            nuevoItem.idOpcion = 1;
            nuevoItem.FechaInicial = FechaInicio == null ? "" : FechaInicio.toString();
            nuevoItem.FechaFinal = FechaFin == null ? "" : FechaFin.toString();
            LogMisProductosData.DatosProductos = nuevoItem;
            this.setLogMisProductos(LogMisProductosData);
            // #endregion
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
      }
    }
  }



  ConsultarSegVehiculo() {
    this.SelectionExtOrMov = this.ExtactoSeguroVhi.get("MovExtSelector")?.value;
    var FechaInicio = $("#fechaInitSegVehiculo").val();
    var FechaFin = $("#fechaendSegVehiculo").val();
    this.fechaInicioC = FechaInicio;
    this.fechaFinC = FechaFin;
    var fecha = new Date();
    this.today = fecha;

    if (FechaInicio == "") {
      this.InicioVacida = true;
      this.ExtractosVehiculo.length = 0;
      this.MovimientosVehiculo.length = 0;
    } else if (FechaFin == "") {
      this.FinVacida = true;
      this.InicioVacida = false;
      this.ExtractosVehiculo.length = 0;
      this.MovimientosVehiculo.length = 0;
    } else if (this.SelectionExtOrMov == "-") {
      this.SelectErroneo = true;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FechaMenorMayor = false;
      this.FinVacida = false;
      this.ExtractosVehiculo.length = 0;
      this.MovimientosVehiculo.length = 0;
    } else if ( FechaInicio != null && 
      FechaInicio < this.fechaAperturaCuenta || FechaInicio != null && 
      FechaInicio > this.fechaAperturaActualDisabled || FechaInicio != null &&  FechaFin != null && 
      FechaInicio > FechaFin
    ) {
      this.inicioNoValida = true;
      this.SelectErroneo = false;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FinVacida = false;
      this.FechaMenorMayor = false;
      this.ExtractosVehiculo.length = 0;
      this.MovimientosVehiculo.length = 0;
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
      this.ExtractosVehiculo.length = 0;
      this.MovimientosVehiculo.length = 0;
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
        this.ExtactoSeguroVhi.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtactoSeguroVhi.get("FechaFin")?.setValue(FechaFin);
        this.loading.show();
        this.MiListaProductosService.GetExtractoSeguros(
          this.ExtactoSeguroVhi.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            this.MapearEncabezadoTabla(result, 3);
            //#region Guarda log
            let datas = localStorage.getItem("Data");
            var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 51;
            LogMisProductosData.IdOpcion = 3; // Extrato
            LogMisProductosData.IdTercero = this.terceroId;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            LogMisProductosData.IdCuenta = this.idCuenta;
            nuevoItem.NumeroCuenta = result.Cuenta;
            nuevoItem.FechaInicial = FechaInicio == null ? "" : FechaInicio.toString();
            nuevoItem.FechaFinal = FechaFin == null ? "" : FechaFin.toString();
            LogMisProductosData.DatosProductos = nuevoItem;
            this.setLogMisProductos(LogMisProductosData);
            // #endregion
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
      } else if (
        this.SelectionExtOrMov == 1 &&
        FechaInicio != null &&
        FechaFin != null
      ) {
        this.ExtactoSeguroVhi.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtactoSeguroVhi.get("FechaFin")?.setValue(FechaFin);
        this.loading.show();
        this.MiListaProductosService.getMovimientoSeguro(
          this.ExtactoSeguroVhi.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            this.MapearEncabezadoTablaMov(result, 3);
            //#region Guarda log
            let datas = localStorage.getItem("Data");
          var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 51;
            LogMisProductosData.IdOpcion = 2; // Movimiento
            LogMisProductosData.IdTercero = this.terceroId;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            LogMisProductosData.IdCuenta = this.idCuenta;
            nuevoItem.NumeroCuenta = result.Cuenta;
            nuevoItem.FechaInicial = FechaInicio == null ? "" : FechaInicio.toString();
            nuevoItem.FechaFinal = FechaFin == null ? "" :FechaFin.toString();
            LogMisProductosData.DatosProductos = nuevoItem;
            this.setLogMisProductos(LogMisProductosData);
            // #endregion
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
      }
    }
  }

  MapearEncabezadoTabla(datos : any, tipoPdf : any) {
    this.TipoAlerta = datos.TipoAlerta;
    if (this.TipoAlerta == "3") {
      $("#extractosSegExequiales").hide();
      $("#extractosDtosDisponible").hide();
      $("#movimientosDtosDisponible").hide();
      $("#movimientosSegExequial").hide();
      $("#MovimientoAterminoId").hide();
      $("#extractosDtosAtermino").hide();
      $("#movimientosSegVehiculo").hide();
      $("#ExtractosSegVehiculo").hide();
      $("#pdf").hide();
      $("#xlsx").hide();
      $(".rangoFechas").show();
      this.HabilitaMensate = 1;
    } else {
      this.HabilitaMensate = 0;
      this.NoRegistros = 1;
      this.loading.show();
      if (tipoPdf == 1) {
        $("#extractosSegVida").show();
        this.MiListaProductosService.GenerarPdfExtractoSeguros(
          this.ExtactoSeguro.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            const pdfinBase64 = result.FileStream._buffer;
            const byteArray = new Uint8Array(
              atob(pdfinBase64)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const newBolb = new Blob([byteArray], { type: "application/pdf" });
            this.linkPdf = URL.createObjectURL(newBolb);
            const url = window.URL.createObjectURL(newBolb);
            document.getElementById("extractosSegVida")?.setAttribute("data", url);
            document.getElementById("extractosSegVida")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.ExtractosVida = datos.DescribeExtracto;
      } else if (tipoPdf == 2) {
        $("#extractosSegExequiales").show();
        this.MiListaProductosService.GenerarPdfExtractoSeguros(
          this.ExtactoSeguro.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            const pdfinBase64 = result.FileStream._buffer;
            const byteArray = new Uint8Array(
              atob(pdfinBase64)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const newBolb = new Blob([byteArray], { type: "application/pdf" });
            //this.linkPdf = URL.createObjectURL(newBolb);
            const url = window.URL.createObjectURL(newBolb);
            document.getElementById("extractosSegExequiales")?.setAttribute("data", url);
            document.getElementById("extractosSegExequiales")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.Extractos = datos.DescribeExtracto;
      } else if (tipoPdf == 3) {
        $("#ExtractosSegVehiculo").show();
        this.MiListaProductosService.GenerarPdfExtractoSeguros(
          this.ExtactoSeguroVhi.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            const pdfinBase64 = result.FileStream._buffer;
            const byteArray = new Uint8Array(
              atob(pdfinBase64)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const newBolb = new Blob([byteArray], { type: "application/pdf" });
            // this.linkPdf = URL.createObjectURL(newBolb);
            const url = window.URL.createObjectURL(newBolb);
            document.getElementById("ExtractosSegVehiculo")?.setAttribute("data", url);
            document.getElementById("ExtractosSegVehiculo")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.ExtractosVehiculo = datos.DescribeExtracto;
      }else if (tipoPdf == 4) {
        $("#extractosConvenio").show();
        this.MiListaProductosService.GenerarPdfExtractoSeguros(
          this.ExtactoSeguro.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            const pdfinBase64 = result.FileStream._buffer;
            const byteArray = new Uint8Array(
              atob(pdfinBase64)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const newBolb = new Blob([byteArray], { type: "application/pdf" });
            // this.linkPdf = URL.createObjectURL(newBolb);
            const url = window.URL.createObjectURL(newBolb);
            document.getElementById("extractosConvenio")?.setAttribute("data", url);
            document.getElementById("extractosConvenio")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.ExtractosConvenio = datos.DescribeExtracto;
      }
      this.NumeroDocumento = datos.NumeroDocumento;
      $("#pdf").show();
      $("#xlsx").show();
      $(".rangoFechas").show();
      this.Movimientos.length = 0;
      this.MovimientosVida.length = 0;
      this.MovimientosVehiculo.length = 0;
      this.MovimientosConvenio.length = 0;
    }
  }

  MapearEncabezadoTablaMov(datos : any, pdfTipo : any) {
    this.TipoAlerta = datos.TipoAlerta;
    if (this.TipoAlerta == "3") {
      $("#extractosSegExequiales").hide();
      $("#extractosDtosDisponible").hide();
      $("#movimientosDtosDisponible").hide();
      $("#movimientosSegExequial").hide();
      $("#MovimientoAterminoId").hide();
      $("#extractosDtosAtermino").hide();
      $("#movimientosSegVida").hide();
      $("#movimientosSegVehiculo").hide();
      $("#pdf").hide();
      $("#xlsx").hide();
      $(".rangoFechas").show();
      this.HabilitaMensate = 1;
    } else {
      this.loading.show();
      if (pdfTipo == 1) {
        $("#movimientosSegExequial").show();
        this.MiListaProductosService.GenerarPDFMovimientoSeguro(
          this.ExtactoSeguro.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            const pdfinBase64 = result.FileStream._buffer;
            const byteArray = new Uint8Array(
              atob(pdfinBase64)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const newBolb = new Blob([byteArray], { type: "application/pdf" });
            // this.linkPdf = URL.createObjectURL(newBolb);
            const url = window.URL.createObjectURL(newBolb);
            document.getElementById("movimientosSegExequial")?.setAttribute("data", url);
            document.getElementById("movimientosSegExequial")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.Movimientos = datos.DescribeMovimiento;
      } else if (pdfTipo == 2) {
        $("#movimientosSegVida").show();
        this.MiListaProductosService.GenerarPDFMovimientoSeguro(
          this.ExtactoSeguro.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            const pdfinBase64 = result.FileStream._buffer;
            const byteArray = new Uint8Array(
              atob(pdfinBase64)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const newBolb = new Blob([byteArray], { type: "application/pdf" });
            // this.linkPdf = URL.createObjectURL(newBolb);
            const url = window.URL.createObjectURL(newBolb);
            document.getElementById("movimientosSegVida")?.setAttribute("data", url);
            document.getElementById("movimientosSegVida")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.MovimientosVida = datos.DescribeMovimiento;
      } else if (pdfTipo == 3) {
        $("#movimientosSegVehiculo").show();
        this.MiListaProductosService.GenerarPDFMovimientoSeguro(
          this.ExtactoSeguroVhi.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            const pdfinBase64 = result.FileStream._buffer;
            const byteArray = new Uint8Array(
              atob(pdfinBase64)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const newBolb = new Blob([byteArray], { type: "application/pdf" });
            // this.linkPdf = URL.createObjectURL(newBolb);
            const url = window.URL.createObjectURL(newBolb);
            document.getElementById("movimientosSegVehiculo")?.setAttribute("data", url);
            document.getElementById("movimientosSegVehiculo")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.MovimientosVehiculo = datos.DescribeMovimiento;
      } else if (pdfTipo == 4) {
        $("#movimientosConvenio").show();
        this.MiListaProductosService.GenerarPDFMovimientoSeguro(
          this.ExtactoSeguro.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            const pdfinBase64 = result.FileStream._buffer;
            const byteArray = new Uint8Array(
              atob(pdfinBase64)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const newBolb = new Blob([byteArray], { type: "application/pdf" });
            // this.linkPdf = URL.createObjectURL(newBolb);
            const url = window.URL.createObjectURL(newBolb);
            document.getElementById("movimientosConvenio")?.setAttribute("data", url);
            document.getElementById("movimientosConvenio")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.MovimientosConvenio = datos.DescribeMovimiento;
      }
      $("#pdf").show();
      $("#xlsx").show();
      this.HabilitaMensate = 0;
      this.NoRegistros = 1;
      this.Extractos.length = 0;
      this.ExtractosVida.length = 0;
      this.ExtractosVehiculo.length = 0;
      this.ExtractosConvenio.length = 0;
      this.NumeroDocumento = datos.NumeroDocumento;
    }
  }

  generarPDFSeguroExequial() {
    if (this.SelectionExtOrMov == 1) {
      //pdf movimiento
      this.loading.show();
      this.MiListaProductosService.GenerarPDFMovimientoSeguro(
        this.ExtactoSeguro.value
      ).subscribe(
        (result) => {
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Movimiento_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
    if (this.SelectionExtOrMov == 2) {
      //pdf Extracto
      this.loading.show();
      this.MiListaProductosService.GenerarPdfExtractoSeguros(
        this.ExtactoSeguro.value
      ).subscribe(
        (result) => {
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
  }

  generarPDFSeguroVida() {
    var sel1 = Number($(".SelectedMovimiento_Seguro").val());
    if (sel1 == 1) {
      //pdf movimiento
      this.loading.show();
      this.MiListaProductosService.GenerarPDFMovimientoSeguro(
        this.ExtactoSeguro.value
      ).subscribe(
        (result) => {
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Movimiento_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
    var sel = Number($(".SelectedExtracto_Seguro").val());
    if (sel == 2) {
      //pdf Extracto
      this.loading.show();
      this.MiListaProductosService.GenerarPdfExtractoSeguros(
        this.ExtactoSeguro.value
      ).subscribe(
        (result) => {
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
  }
  generarPDFSeguroVhi() {
    var sel1 = Number($(".SelectedMovimiento_Seguro").val());
    if (sel1 == 1) {
      //pdf movimiento
      this.loading.show();
      this.MiListaProductosService.GenerarPDFMovimientoSeguro(
        this.ExtactoSeguroVhi.value
      ).subscribe(
        (result) => {
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Movimiento_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
    var sel = Number($(".SelectedExtracto_Seguro").val());
    if (sel == 2) {
      //pdf Extracto
      this.loading.show();
      this.MiListaProductosService.GenerarPdfExtractoSeguros(
        this.ExtactoSeguroVhi.value
      ).subscribe(
        (result) => {
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
  }
// validar que los pdf estan descargando
  generarEXCELSeguroExequial(): void {
    var sel1 = Number($(".SelectedMovimiento_Seguro").val());
    if (sel1 == 1) {
      this.loading.show();
      this.MiListaProductosService.GenerarXlsMovimientosSeguro(
        this.ExtactoSeguro.value
      ).subscribe(
        (result) => {
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Movimiento_" + this.NumeroDocumento + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
    var sel = Number($(".SelectedExtracto_Seguro").val());
    if (sel == 2) {
      this.loading.show();
      this.MiListaProductosService.GenerarXlsxSeguro(
        this.ExtactoSeguro.value
      ).subscribe(
        (result) => {
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
  }


  generarEXCELSeguroVhi(): void {
    var sel1 = Number($(".SelectedMovimiento_Seguro").val());
    if (sel1 == 1) {
      this.loading.show();
      this.MiListaProductosService.GenerarXlsMovimientosSeguro(
        this.ExtactoSeguroVhi.value
      ).subscribe(
        (result) => {
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Movimiento_" + this.NumeroDocumento + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
    var sel = Number($(".SelectedExtracto_Seguro").val());
    if (sel == 2) {
      this.loading.show();
      this.MiListaProductosService.GenerarXlsxSeguro(
        this.ExtactoSeguroVhi.value
      ).subscribe(
        (result) => {
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          this.loading.hide();
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
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
          if (FechaFin != null && this.valueFechaInicial > FechaFin) {
            this.FechaMenorMayor = false;
            this.inicioNoValida = false;
            this.FechaMayorAmenor = true;
            this.Extractos.length = 0;
            this.Movimientos.length = 0;
            this.ExtractosVida.length = 0;
            this.MovimientosVida.length = 0;
            this.ExtractosVehiculo.length = 0;
            this.MovimientosVehiculo.length = 0;
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
          this.ExtractosVida.length = 0;
          this.MovimientosVida.length = 0;
          this.ExtractosVehiculo.length = 0;
          this.MovimientosVehiculo.length = 0;
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
            this.ExtractosVida.length = 0;
            this.MovimientosVida.length = 0;
            this.ExtractosVehiculo.length = 0;
            this.MovimientosVehiculo.length = 0;
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
          this.ExtractosVida.length = 0;
          this.MovimientosVida.length = 0;
          this.ExtractosVehiculo.length = 0;
          this.MovimientosVehiculo.length = 0;
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

  opcionSelectedFechasVehiculo(value : number) {
    var FechaFin = $("#fechaendSegVehiculo").val();
    var FechaInicio = $("#fechaInitSegVehiculo").val();

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
            this.ExtractosVida.length = 0;
            this.MovimientosVida.length = 0;
            this.ExtractosVehiculo.length = 0;
            this.MovimientosVehiculo.length = 0;
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
          this.ExtractosVida.length = 0;
          this.MovimientosVida.length = 0;
          this.ExtractosVehiculo.length = 0;
          this.MovimientosVehiculo.length = 0;
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
            this.ExtractosVida.length = 0;
            this.MovimientosVida.length = 0;
            this.ExtractosVehiculo.length = 0;
            this.MovimientosVehiculo.length = 0;
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
          this.ExtractosVida.length = 0;
          this.MovimientosVida.length = 0;
          this.ExtractosVehiculo.length = 0;
          this.MovimientosVehiculo.length = 0;
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

  opcionSelectedFechasVida(value : number) {
    var FechaFin = $("#fechaendSegVida").val();
    var FechaInicio = $("#fechaInitSegVida").val();

    if (value == 1) {
      var numCaracteres = this.valueFechaInicial.length;
      if (numCaracteres == 10) {
        if (
          this.valueFechaInicial >= this.fechaAperturaCuenta &&
          this.valueFechaInicial <= this.fechaAperturaActualDisabled
        ) {
          if (FechaFin != null && this.valueFechaInicial > FechaFin) {
            this.FechaMenorMayor = false;
            this.inicioNoValida = false;
            this.FechaMayorAmenor = true;
            this.Extractos.length = 0;
            this.Movimientos.length = 0;
            this.ExtractosVida.length = 0;
            this.MovimientosVida.length = 0;
            this.ExtractosVehiculo.length = 0;
            this.MovimientosVehiculo.length = 0;
            return 1;
          } else {
            this.inicioNoValida = false;
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = false;
          }
        } else if (FechaInicio != null && 
          FechaInicio < this.fechaAperturaCuenta || FechaInicio != null && 
          FechaInicio > this.fechaAperturaActualDisabled || FechaInicio != null &&  FechaFin != null && 
          FechaInicio > FechaFin
        ) {
          this.inicioNoValida = true;
          this.FechaMenorMayor = false;
          this.FechaMayorAmenor = false;
          this.Extractos.length = 0;
          this.Movimientos.length = 0;
          this.ExtractosVida.length = 0;
          this.MovimientosVida.length = 0;
          this.ExtractosVehiculo.length = 0;
          this.MovimientosVehiculo.length = 0;
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
          if ( FechaInicio != null && this.valueFechaFinal < FechaInicio) {
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = true;
            this.finNoValida = false;
            this.Extractos.length = 0;
            this.Movimientos.length = 0;
            this.ExtractosVida.length = 0;
            this.MovimientosVida.length = 0;
            this.ExtractosVehiculo.length = 0;
            this.MovimientosVehiculo.length = 0;
            return 1;
          } else {
            this.finNoValida = false;
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = false;
          }
        } else if ( FechaFin != null &&
          FechaFin > this.fechaAperturaActualDisabled ||   FechaFin != null &&
          FechaFin < this.fechaAperturaCuenta ||  FechaFin != null &&  FechaInicio != null &&
          FechaFin < FechaInicio
        ) {
          this.finNoValida = true;
          this.FechaMenorMayor = false;
          this.FechaMayorAmenor = false;
          this.Extractos.length = 0;
          this.Movimientos.length = 0;
          this.ExtractosVida.length = 0;
          this.MovimientosVida.length = 0;
          this.ExtractosVehiculo.length = 0;
          this.MovimientosVehiculo.length = 0;
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

  cerrarSeguros(value : number) {
    if (value == 1) {
      this.AcordeonSegVida = true;
      //CLOSED ACORDEON
      $(".acordeon2").prop("checked", false);
      $(".acordeon3").prop("checked", false);
      $(".acordeon4").prop("checked", false);
      //////////////////////
    } else if (value == 2) {
      //CLOSED ACORDEON
      $(".acordeon1").prop("checked", false);
      $(".acordeon3").prop("checked", false);
      $(".acordeon4").prop("checked", false);
      //////////////////////
      this.AcordeonSegExequiales = true;
    } else if (value == 3) {
      //CLOSED ACORDEON
      $(".acordeon2").prop("checked", false);
      $(".acordeon1").prop("checked", false);
      $(".acordeon4").prop("checked", false);
      //////////////////////
      this.AcordeonSegVehiculo = true;
    } else if (value == 4) {
      //CLOSED ACORDEON FIRST
      $(".acordeon2").prop("checked", false);
      $(".acordeon3").prop("checked", false);
      $(".acordeon1").prop("checked", false);
      //////////////////////
      this.AcordeonSegConvenio = true;
    }
  }

  cerrarAcordeon() {
    if (this.AcordeonSegVida) {
      $(".acordeon1").prop("checked", false);
    }
    if (this.AcordeonSegExequiales) {
      $(".acordeon2").prop("checked", false);
    }
    if (this.AcordeonSegVehiculo) {
      $(".acordeon3").prop("checked", false);
    }
    if (this.AcordeonSegConvenio) {
      $(".acordeon4").prop("checked", false);
    }
  }



  cerrarAcordeonSeguroVida() {
    if (this.Acordeon1) {
      $(".datosVida").prop("checked", false);
    }
    if (this.Acordeon2) {
      $(".negociacionVida").prop("checked", false);
    }
    if (this.Acordeon3) {
      $(".saldosVida").prop("checked", false);
    }
    if (this.Acordeon4) {
      $(".beneficiariosVida").prop("checked", false);
    }
    if (this.Acordeon5) {
      $(".renovacionesVida").prop("checked", false);
    }
    if (this.Acordeon6) {
      $(".movimientosVida").prop("checked", false);
    }
    if (this.Acordeon7) {
      $(".fechasVida").prop("checked", false);
    }
  }

  cerrarAcordeonSeguroVehiculo() {
    if (this.Acordeon1) {
      $(".datosVehiculo").prop("checked", false);
    }
    if (this.Acordeon2) {
      $(".negociacionViehiculo").prop("checked", false);
    }
    if (this.Acordeon3) {
      $(".saldosVehiculo").prop("checked", false);
    }
    if (this.Acordeon4) {
      $(".InscritosVehiculo").prop("checked", false);
    }
    if (this.Acordeon5) {
      $(".beneficiariosVehiculo").prop("checked", false);
    }
    if (this.Acordeon6) {
      $(".renovacionesVehiculo").prop("checked", false);
    }
    if (this.Acordeon7) {
      $(".movimientosVehiculo").prop("checked", false);
    }
    if (this.Acordeon8) {
      $(".fechasVehiculo").prop("checked", false);
    }
  }

  DetalleSeguroVida(data : any) {
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var idOficina = cuentaArray[0];
    var idProducto = cuentaArray[1];
    var consecutivo = cuentaArray[2];
    // this.infoSeguroVidaDta.
    console.log("this is the data");
    console.log(data);
    this.infoSeguroVidaDta.DescripcionProducto = data.NameProducto;
    this.infoSeguroVidaDta.strCuenta = data.strCuenta;
    this.infoSeguroVidaDta.DescribeEstado = data.NameEstado;
    this.infoSeguroVidaDta.DescripcionProducto = data.NameProducto;
    this.infoSeguroVidaDta.NombreAsesor = data.Asesor;
    this.infoSeguroVidaDta.DescribeOficina = data.NameOficina;

    this.MiListaProductosService.GetDataSeguroVida(
      idOficina,
      idProducto,
      consecutivo,
      this.terceroId
    ).subscribe(
      (result) => {
        console.log(result);
        this.infoSeguroVidaDta.validaJuridico = result.validaJuridico;
        this.infoSeguroVidaDta.edad = result.edad;
        this.infoSeguroVidaDta.FechaConstitucion = result.edad;
        this.infoSeguroVidaDta.lngCertificado = result.lngCertificado;
        this.infoSeguroVidaDta.lngPoliza = result.lngPoliza;
        this.infoSeguroVidaDta.curCuota = result.curCuota;
        this.infoSeguroVidaDta.intPlazo = result.intPlazo;
        this.infoSeguroVidaDta.intMeses = result.intMeses;
        this.infoSeguroVidaDta.dtmProximoPago = result.dtmProximoPago;
        this.infoSeguroVidaDta.curProyectado = result.curProyectado;
        this.infoSeguroVidaDta.curCargo = result.curCargo;
        this.infoSeguroVidaDta.curExento = result.curExento;
        this.infoSeguroVidaDta.CapitalMora = result.CapitalMora;
        this.infoSeguroVidaDta.curCuotaProyectada = result.curCuotaProyectada;
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
        this.infoSeguroVidaDta.curPeriodo = result.curEfectivo;
        this.infoSeguroVidaDta.curEfectivo = (
          result.curEfectivo + result.curSaldoAnterior
        ).toString();
        this.infoSeguroVidaDta.intCuotasPagas = result.intCuotasPagas;
        this.infoSeguroVidaDta.intCuotasMora = result.intCuotasMora;
        this.infoSeguroVidaDta.CuotasPendientes = result.CuotasPendientes;
        this.infoSeguroVidaDta.dtmCancela = result.dtmCancela;
        this.infoSeguroVidaDta.dtmEnvioCarta = result.dtmEnvioCarta;
        this.infoSeguroVidaDta.dtmMatricula = result.dtmMatricula;
        this.infoSeguroVidaDta.dtmMora = result.dtmMora;
        this.infoSeguroVidaDta.dtmNacimiento = result.dtmNacimiento;
        this.infoSeguroVidaDta.dtmPagoMora = result.dtmPagoMora;
        this.infoSeguroVidaDta.dtmUltimaTrans = result.dtmUltimaTrans;
        this.infoSeguroVidaDta.dtmUltimoCargo = result.dtmUltimoCargo;
        this.infoSeguroVidaDta.dtmVencimiento = result.dtmVencimiento;
        this.infoSeguroVidaDta.curSaldoAnterior = result.curSaldoAnterior;
        this.infoSeguroVidaDta.dtmPlazo = result.dtmPlazo;
        this.infoSeguroVidaDta.curCanje = result.curCanje;
        this.infoSeguroVidaDta.Tarifa = result.Tarifa;
        this.infoSeguroVidaDta.curSeguro = result.curSeguro;
        this.infoSeguroVidaDta.valorTotal = result.curCuota * result.intPlazo;
        this.infoSeguroVidaDta.CompaniaAseguradora = result.CompaniaAseguradora;
        var countBenef = 0;
        this.BeneficiariosSeguroVida.length = 0;
        if (result.beneficiariosDta.length > 0) {
          for (var j = 0; j < result.beneficiariosDta.length; j++) {
            this.BeneficiariosSeguroVida[countBenef] =
              result.beneficiariosDta[j];
            countBenef++;
          }
          $("#NotHaveBenefSeguroVida").hide();
          $("#haveBenefSeguroVida").show();
        } else {
          $("#NotHaveBenefSeguroVida").show();
          $("#haveBenefSeguroVida").hide();
        }
        var countRenovaciones = 0;
        this.RenovacionSeguroVida.length = 0;
        if (result.RenovacionSeguro.length > 0) {
          for (var j = 0; j < result.RenovacionSeguro.length; j++) {
            this.RenovacionSeguroVida[countRenovaciones] =
              result.RenovacionSeguro[j];
            countRenovaciones++;
          }
          $("#NotHaveRenovaSegVida").hide();
          $("#HaveRenovaSegVida").show();
        } else {
          $("#NotHaveRenovaSegVida").show();
          $("#HaveRenovaSegVida").hide();
        }
        var countPreexistencia = 0;
        this.PreexistenciaSeguroVida.length = 0;
        if (result.Preexistencia.length > 0) {
          for (var i = 0; i < result.Preexistencia.length; i++) {
            this.PreexistenciaSeguroVida[countPreexistencia] =
              result.Preexistencia[i];
            countPreexistencia++;
          }
          $("#HaveDataPreexistencia").show();
          $("#NotHaveDataPreexistencia").hide();
        } else {
          $("#HaveDataPreexistencia").hide();
          $("#NotHaveDataPreexistencia").show();
        }

        var countHistorial = 0;
        this.HistoricoSeguroVida.length = 0;
        if (result.hitoricoList.length > 0) {
          for (var i = 0; i < result.hitoricoList.length; i++) {
            this.HistoricoSeguroVida[countHistorial] = result.hitoricoList[i];
            countHistorial++;
          }
          $("#HaveMovimientos").show();
          $("#NotHaveMovimientos").hide();
        } else {
          $("#HaveMovimientos").hide();
          $("#NotHaveMovimientos").show();
        }

        var FormaPago = result.intFormaPago;
        var periodoPago = result.intPeriodoPago;

        if (FormaPago == 0) {
          this.infoSeguroVidaDta.FormaPago = "Caja";
        } else if (FormaPago == 1) {
          this.infoSeguroVidaDta.FormaPago = "Débito";
        } else if (FormaPago == 2) {
          this.infoSeguroVidaDta.FormaPago = "Nómina";
        } else {
          this.infoSeguroVidaDta.FormaPago = "";
        }

        if (periodoPago == 30 || periodoPago == 31) {
          this.infoSeguroVidaDta.Periodo = "Mes";
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
    LogMisProductosData.IdOperacion = 51;
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

  setLogMisProductos(LogMisProductos_: LogMisProductos) {
    this.MiListaProductosService.setLogMisProductos(LogMisProductos_).subscribe(
      result => {
        //console.log("register",result);
      },
      error => {
        // console.log(error);
      }
    )
  }


  DetalleSeguroVehiculo(data : any) {
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var idOficina = cuentaArray[0];
    var idProducto = cuentaArray[1];
    var consecutivo = cuentaArray[2];
    // this.infoSeguroVidaDta.
    this.InfoSeguroVehiculo.DescripcionProducto = data.NameProducto;
    this.InfoSeguroVehiculo.strCuenta = data.strCuenta;
    this.InfoSeguroVehiculo.DescribeEstado = data.NameEstado;
    this.InfoSeguroVehiculo.DescripcionProducto = data.NameProducto;
    this.InfoSeguroVehiculo.NombreAsesor = data.Asesor;
    this.InfoSeguroVehiculo.DescribeOficina = data.NameOficina;

    this.MiListaProductosService.GetDataSeguroVida(
      idOficina,
      idProducto,
      consecutivo,
      this.terceroId
    ).subscribe(
      (result) => {
        console.log("Información del seguro vehículo");
        console.log(result);
        this.InfoSeguroVehiculo.validaJuridico = result.validaJuridico;
        this.InfoSeguroVehiculo.edad = result.edad;
        this.InfoSeguroVehiculo.FechaConstitucion = result.edad;
        this.InfoSeguroVehiculo.lngCertificado = result.lngCertificado;
        this.InfoSeguroVehiculo.lngPoliza = result.lngPoliza;
        this.InfoSeguroVehiculo.curCuota = result.curCuota;
        this.InfoSeguroVehiculo.intPlazo = result.intPlazo;
        this.InfoSeguroVehiculo.dtmProximoPago = result.dtmProximoPago;
        this.InfoSeguroVehiculo.curProyectado = result.curProyectado;
        this.InfoSeguroVehiculo.curCargo = result.curCargo;
        this.InfoSeguroVehiculo.curExento = result.curExento;
        this.InfoSeguroVehiculo.CapitalMora = result.CapitalMora;
        this.InfoSeguroVehiculo.curCuotaProyectada = result.curCuotaProyectada;
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
        this.InfoSeguroVehiculo.curPeriodo = result.curEfectivo;
        this.InfoSeguroVehiculo.curEfectivo = (
          result.curEfectivo + result.curSaldoAnterior
        ).toString();
        this.InfoSeguroVehiculo.intCuotasPagas = result.intCuotasPagas;
        this.InfoSeguroVehiculo.intCuotasMora = result.intCuotasMora;
        this.InfoSeguroVehiculo.CuotasPendientes = result.CuotasPendientes;
        this.InfoSeguroVehiculo.dtmCancela = result.dtmCancela;
        this.InfoSeguroVehiculo.dtmEnvioCarta = result.dtmEnvioCarta;
        this.InfoSeguroVehiculo.dtmMatricula = result.dtmMatricula;
        this.InfoSeguroVehiculo.intMeses = result.intMeses;
        this.InfoSeguroVehiculo.dtmMora = result.dtmMora;
        this.InfoSeguroVehiculo.dtmNacimiento = result.dtmNacimiento;
        this.InfoSeguroVehiculo.dtmPagoMora = result.dtmPagoMora;
        this.InfoSeguroVehiculo.dtmUltimaTrans = result.dtmUltimaTrans;
        this.InfoSeguroVehiculo.dtmUltimoCargo = result.dtmUltimoCargo;
        this.InfoSeguroVehiculo.dtmVencimiento = result.dtmVencimiento;
        this.InfoSeguroVehiculo.curSaldoAnterior = result.curSaldoAnterior;
        this.InfoSeguroVehiculo.dtmPlazo = result.dtmPlazo;
        this.InfoSeguroVehiculo.curCanje = result.curCanje;
        this.InfoSeguroVehiculo.TarifaExequial = result.TarifaExequial;
        this.InfoSeguroVehiculo.CompaniaAseguradora =
          result.CompaniaAseguradora;
        this.InfoSeguroVehiculo.strPlaca = result.strPlaca;
        this.InfoSeguroVehiculo.intModelo = result.intModelo;
        this.InfoSeguroVehiculo.curCobertura = result.curCobertura;
        this.InfoSeguroVehiculo.Marca = result.Marca;
        this.InfoSeguroVehiculo.strObservacion = result.strObservacion;
        this.InfoSeguroVehiculo.curSeguro = result.curSeguro;
        this.InfoSeguroVehiculo.valorTotal = result.curCuota * result.intPlazo;
        var countRenovaciones = 0;
        this.RenovacionSeguroVehiculo.length = 0;
        if (result.RenovacionSeguro.length > 0) {
          for (var j = 0; j < result.RenovacionSeguro.length; j++) {
            this.RenovacionSeguroVehiculo[countRenovaciones] =
              result.RenovacionSeguro[j];
            countRenovaciones++;
          }
          $("#NotHaveRenovaSegVehiculo").hide();
          $("#HaveRenovaSegVehiculo").show();
        } else {
          $("#NotHaveRenovaSegVehiculo").show();
          $("#HaveRenovaSegVehiculo").hide();
        }

        var countHistorial = 0;
        this.HistoricoSeguroVehiculo.length = 0;
        if (result.hitoricoList.length > 0) {
          for (var i = 0; i < result.hitoricoList.length; i++) {
            this.HistoricoSeguroVehiculo[countHistorial] =
              result.hitoricoList[i];
            countHistorial++;
          }
          $("#HaveMovimientosVehiculo").show();
          $("#NotHaveMovimientosVehiculo").hide();
        } else {
          $("#HaveMovimientosVehiculo").hide();
          $("#NotHaveMovimientosVehiculo").show();
        }

        var FormaPago = result.intFormaPago;
        var periodoPago = result.intPeriodoPago;

        if (FormaPago == 0) {
          this.InfoSeguroVehiculo.FormaPago = "Caja";
        } else if (FormaPago == 1) {
          this.InfoSeguroVehiculo.FormaPago = "Débito";
        } else if (FormaPago == 2) {
          this.InfoSeguroVehiculo.FormaPago = "Nómina";
        } else {
          this.InfoSeguroVehiculo.FormaPago = "";
        }

        if (periodoPago == 30 || periodoPago == 31) {
          this.InfoSeguroVehiculo.Periodo = "Mes";
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
    LogMisProductosData.IdOperacion = 51;
    LogMisProductosData.IdOpcion = 1; //Detalle
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

  GetSeguros(tercero : number) {
    this.terceroId = tercero;

    this.DataSeguros.length = 0;
    this.DataSegurosCancelados.length = 0;
    this.ConvenioActivo.length = 0;
    this.SeguroVehiculo.length = 0;
    this.SeguroVehiculoCancelado.length = 0;
    this.ConvenioCancelado.length = 0;

    this.MiListaProductosService.GetDataSeguros(tercero).subscribe(
      (result) => {
        this.ActivaCargando = false;
        console.log(result);
        var posactivos = 0;
        var posCancelados = 0;
        if (result.SeguroDeVida.length == 0) {
          this.DataSeguros = [];
          this.DataSegurosCancelados = [];
          $("#NotHaveRegSegVida").show();
          $("#NotHaveRegSegVida_").hide();
        } else {
          var activDisp = 0;
          var CancelDisp = 0;
          this.DataSegurosCancelados[CancelDisp] = [];
          this.DataSeguros[activDisp] = [];
          for (var i = 0; i < result.SeguroDeVida.length; i++) {
            if (
              result.SeguroDeVida[i].dtmCancela != "" &&
              result.SeguroDeVida[i].intEstado != 10
            ) {
              $("#NotHaveRegSegVida").hide();
              $("#NotHaveRegSegVida_").hide();
              this.DataSegurosCancelados[CancelDisp] = result.SeguroDeVida[i];
              CancelDisp++;
            } else if (
              result.SeguroDeVida[i].dtmCancela == null ||
              result.SeguroDeVida[i].dtmCancela == ""
            ) {
              $("#NotHaveRegSegVida").hide();
              $("#NotHaveRegSegVida_").hide();
              this.DataSeguros[activDisp] = result.SeguroDeVida[i];
              activDisp++;
            }
          }

          if (this.ValidadaActivo == true && activDisp == 0) {
            this.DataSeguros.length = 0;
            $("#NotHaveRegSegVida_").show();
            $("#NotHaveRegSegVida").hide();
            this.noRegistros = true;
          }

          if (this.ValidadaActivo == false && CancelDisp == 0) {
            this.DataSegurosCancelados.length = 0;
            $("#NotHaveRegSegVida_").show();
            $("#NotHaveRegSegVida").hide();
            this.noRegistros = true;
          }
        }

        // this.convenComponent.setConvenios(tercero);


        //seguro de vehículo
        if (result.SeguroVehiculo.length == 0) {
          this.SeguroVehiculo = [];
          this.SeguroVehiculoCancelado = [];
          $("#noregistraSeguro").show();
          $("#noregistraSeguro_").hide();
        } else {
          var activContraAct = 0;
          var CancelContraAct = 0;
          for (var i = 0; i < result.SeguroVehiculo.length; i++) {
            if (
              result.SeguroVehiculo[i].dtmCancela != "" &&
              result.SeguroVehiculo[i].intEstado != 10
            ) {
              $("#noregistraSeguro").hide();
              $("#noregistraSeguro_").hide();
              this.SeguroVehiculoCancelado[CancelContraAct] =
                result.SeguroVehiculo[i];
              CancelContraAct++;
            } else if (
              result.SeguroVehiculo[i].dtmCancela == null ||
              result.SeguroVehiculo[i].dtmCancela == ""
            ) {
              $("#noregistraSeguro").hide();
              $("#noregistraSeguro_").hide();
              this.SeguroVehiculo[activContraAct] = result.SeguroVehiculo[i];
              activContraAct++;
            }
            if (this.ValidadaActivo == true && activContraAct == 0) {
              this.SeguroVehiculo.length = 0;
              $("#noregistraSeguro_").show();
              $("#noregistraSeguro").hide();
              this.noRegistros = true;
            }
            if (this.ValidadaActivo == false && CancelContraAct == 0) {
              this.SeguroVehiculoCancelado.length = 0;
              $("#noregistraSeguro_").show();
              $("#noregistraSeguro").hide();
              this.noRegistros = true;
            }
          }
        }
        //Convenio
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
              this.noRegistros = true;
            }
            if (this.ValidadaActivo == false && CancelContraAct == 0) {
              this.ConvenioCancelado.length = 0;
              $("#noregistraConvenio_").show();
              $("#noregistraConvenio").hide();
              this.noRegistros = true;
            }
          }
        }
      },
      (error) => {
        this.ActivaCargando = false;
        // this.convenComponent.ActivaCargando = false;
      }
    );
  }

  FormExtracto() {

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
    const FechaInicio = new FormControl("", []);
    const FechaFin = new FormControl("", []);
    const NombreProducto = new FormControl("", []);
    const TipoProducto = new FormControl("", []);

    this.ExtactoSeguro = new FormGroup({
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
      FechaInicio: FechaInicio,
      FechaFin: FechaFin,
    });
  }

  FormExtractoVhi() {

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
    const FechaInicio = new FormControl("", []);
    const FechaFin = new FormControl("", []);
    const NombreProducto = new FormControl("", []);
    const TipoProducto = new FormControl("", []);

    this.ExtactoSeguroVhi = new FormGroup({
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
      FechaInicio: FechaInicio,
      FechaFin: FechaFin,
    });
  }

  CambiarColor(fil : number) {

      $(".Seg_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".Seg_" + fil).css("background", "#e5e5e5");
      $(".strCuentaSeg_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".strCuentaSeg_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior = fil;
      // limpia sombreado anterior
  }

  cambiarColorBeneficiario(fil : number) {
    $(".filBenefi_" + this.ColorBeneficiario).css("background", "#FFFFFF");
    $(".filBenefi_" + fil).css("background", "#e5e5e5");
    this.ColorBeneficiario = fil;
  }

  cambiarColorRenovacion(fil : number) {
    $(".filRenovac_" + this.ColorRenovacion).css("background", "#FFFFFF");
    $(".filRenovac_" + fil).css("background", "#e5e5e5");
    this.ColorRenovacion = fil;
  }

  cambiarColorMvto(fil : number) {
    $(".filMvtos_" + this.ColorMovimientos).css("background", "#FFFFFF");
    $(".filMvtos_" + fil).css("background", "#e5e5e5");
    this.ColorMovimientos = fil;
  }

}
