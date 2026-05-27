import { Component, OnInit, ViewChild } from '@angular/core';
import { OperacionesService } from '../../../../../Services/Maestros/operaciones.service';
import { MiListaProductosService } from '../../../../../Services/Informes/mi-lista-productos.service';
import {
  DetalleContractualModel,
  DetalleDisponibleModel,
  SaldosContractuales,
  AutorizadosModel,
  SaldosDisponibles,
  encabezadoAhoTermino,
  NegociacionAtermino,
  SaldosAtermino,
  FechasAtermino,
  Libreta,
  Tarjeta,
  Cupo,
  LogMisProductos,
  DatosProductos,
  MesxYear
} from "../../../../../Models/Informes/MisProductos/mis-producto.model";
import moment from 'moment';
import swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../../../../Services/Alert/alert.service';
import { LoadingService } from '../../../../../Services/shared/loading.service';
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
@Component({
  selector: "app-ahorros-tab",
  templateUrl: "./ahorros-tab.component.html",
  styleUrls: ["./ahorros-tab.component.css"],
  providers: [OperacionesService],
  standalone: false
})
export class AhorrosTabComponent implements OnInit {
  //#region Variables Bloqueo
  private resultDataStore : any = {};

  private moduloLocal = 69;
  public arrayExample : any[] = []; 
  public mesxYear: MesxYear[] = [];
  public mesxYearEnd: MesxYear[] = [];
  public ActivaCargando: Boolean = false;
  public dataOperaciones: any;
  public DataDisponible: any[] = [];
  public cargandoAutorizaods: Boolean = false;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public valueSlect: any;
  public FormTasas!: FormGroup;
  public FormTasaT!: FormGroup;
  public DataDisponibleCancelado: any[] = [];
  public AutorizadosAhorros: any[] = [];
  public AutorizadosAhorrosCancelados: any[] = [];
  public ActiveNotRegisterAutorizados: Boolean = false;
  public ActiveNotRegisterAutorizados_: Boolean = false;
  public dataObjet: any;
  public idCuenta: any;
  public DataContractual: any[] = [];
  public PuntosAdici: any[] = [];
  public SelectionExtOrMov: any;
  public fechaInicioC: any;
  public fechaFinC: any;
  public today: any;
  public page: number = 0;
  public selectedEstado : any;
  public terceroId: any;
  public valortitulo: any;
  public linkPdf: any;
  public ActiveNotRegisterHistorial: Boolean = false;
  public ActiveRegisterHistorial: Boolean = false;
  public FechaMayorAmenor: Boolean = false;
  public finNoValida: Boolean = false;
  public DataContractualCancelado: any[] = [];
  public DataATermino: any[] = [];
  public DataATerminoCancelado: any[] = [];
  public ExtactoAportes!: FormGroup;
  public ExtractoDisponible!: FormGroup;
  public ExtractoAtermino!: FormGroup;
  public telOficina: any;
  public validaJuridico: Boolean = false;
  public mostrarDetalle: boolean = false;
  public mostraExtracto: boolean = false;
  public dataHistorialDisponible: any[] = [];
  public Canales: any[] = [];
  public DetalleContracModel = new DetalleContractualModel();
  public saldosContractual = new SaldosContractuales();
  public saldosDisponibles = new SaldosDisponibles();
  public DetalleDispoModel = new DetalleDisponibleModel();
  public EncabezadoAhoTermino = new encabezadoAhoTermino();
  public negociacionAtermino = new NegociacionAtermino();
  public SaldosAtermino = new SaldosAtermino();
  public FechasAtermino = new FechasAtermino();
  public LibretaBoolean: Boolean = false;
  public validaCupo: Boolean = false;
  public ValidadaActivo: boolean = true;
  public validaMostrar: any = 0;
  public TasasDtos: any[] = [];
  public AutorizadosTitular: any[] = [];
  public BeneficiariosAtermino: any[] = [];
  public AutorizadosAtermino: any[] = [];
  public Renovaciones: any[] = [];
  public AutorizadosTitularDisponible: any[] = [];
  public AutorizadosModel = new AutorizadosModel();
  public esconderNotRegistros: boolean = false;
  public HabilitaMensate: any = 0;
  public Extractos: any[] = [];
  public Movimientos: any[] = [];
  public NoRegistros: any = 0;
  public inicioNoValida: Boolean = false;
  public SelectErroneo: Boolean = false;
  public fechaAperturaCuenta: any;
  public fechaAperturaActualDisabled: any;
  public TipoAlerta: any;
  public consecutivo: any;
  public loadingtwo: Boolean = false;
  public validaMail: Boolean = false;
  public NombrePersonaExtracto: any;
  public NumeroDocumento: any;
  public Cuenta: any;
  public ActiveDivExtracto: Boolean = false;
  public ActiveDivMovimiento: Boolean = false;
  public oficinaMatricula: any;
  public FechasMovimientos: any;
  public DescripcionProducto: any;
  public estado: any;
  public saldoInicio_: any;
  public Consignaciones_: any;
  public noRegistros: Boolean = false;
  public RetirosyND_: any;
  public Intereses_: any;
  public SaldoFinal_: any;
  public SaldoInicial: any;
  public resumenExtracto: any[] = [];
  public ExtractoDisponibleDtos: any[] = [];
  public MovimientoDisponibleDtos: any[] = [];
  public ExtractosAtermino: any[] = [];
  public MovimientoAtermino: any[] = [];
  public Libreta = new Libreta();
  public Tarjeta = new Tarjeta();
  public Cupo = new Cupo();
  public MontoPlan: number = 0;
  public PlazoAhorro: number = 0;
  public Cuota: number = 0;
  public saldosAcordeon: Boolean = false;
  public saldoMesAnteriorAcordeon: Boolean = false;
  public autorizadosAcordeon: Boolean = false;
  public fechasAcordeon: Boolean = false;
  public yearInicial: any;
  public LibretaAcordeon: Boolean = false;
  public TarjetaAcordeon: Boolean = false;
  public CanalesAcordeon: Boolean = false;
  public CuposAcordeon: Boolean = false;
  public GarantiasAcordeon: Boolean = false;
  public HistorialAcordeon: Boolean = false;
  public validaForm: Boolean = false;
  public negociacionContractualA: Boolean = false;
  public saldosContractualA: Boolean = false;
  public AutorizadosAContractualA: Boolean = false;
  public FechasContractualA: Boolean = false;
  public ahoDisponiblesA: Boolean = false;
  public AhoContractualesA: Boolean = false;
  public ahoAterminoA: Boolean = false;
  public AutorizadosAhorrosA: Boolean = false;
  public uno: Boolean = false;
  public dos: Boolean = false;
  public tres: Boolean = false;
  public cuatro: Boolean = false;
  public cinco: Boolean = false;
  public seis: Boolean = false;
  public ActivosContractuales: any;
  public canceladosContractuales: any;
  public ActivosDisponibles: any;
  public CanceladosDisponibles: any;
  public ActivosAtermino: any;
  public canceladosAtermino: any;
  public TasaNominal: string = "";
  public TasaEfectiva: string = "";
  public NumeroTitulo: any;
  public RetenconFnte: any;
  public InicioVacida: any;
  public FinVacida: any;
  public valueFechaInicial: any;
  public valueFechaFinal: any;
  public intTercero: any;
  public FechaMenorMayor: Boolean = false;
  public lstCodeudores: any[] = [];
  public lstGarantias: any[] = [];
  public ColorAnterior: any;
  public ColorAnterior2: any;
  public ColorAnterior3: any;
  public ColorAnterior4: any;
  public ColorAnterior5: any;
  public cuentaAnterior: any;
  public SeleccionExt: number = 2;
  public yearInit: any;
  public yearEnd: any;
  public MesInit: any;
  public MesEnd: any;
  public mesInicial: any;
  public YearsxMes: any[] = [];
  public yearActual: any;
  //variables validan formulario de extracto
  public validaAnoInicial: Boolean = false;
  public validaAnoFinal: Boolean = false;
  public validaMesInicial: Boolean = false;
  public validaMesFinal: Boolean = false;
  public ColorBeneficiario: any;
  public ColorRenovacion: any;
  public ColorMovimientos: any;
  public ColorAutorizado: any;
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
  public mostrarDetalleAhorros: Boolean = false;
  public mostrarExtractoAhorros: Boolean = false;

  //#endregion
  constructor(
    private operacionesService: OperacionesService,
    private notif: AlertService,
    private MiListaProductosService: MiListaProductosService,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    let data = localStorage.getItem("Data");
    this.resultDataStore = JSON.parse(window.atob(data == null ? "" : data));
    this.arrayExample = [
      {
        IdModulo: this.moduloLocal,
        IdUsuario: this.resultDataStore.IdUsuario,
        IdPerfil: this.resultDataStore.UsuarioPerfil,
      },
    ];
    this.GetOperaciones();
    $("#NotHaveReg").show();
    $("#noregistraContraActual").show();
    $("#NoregistraAtermino").show();
    this.FormExtracto();
    this.FormExtractoDisponibles();
    this.FormAtermino();
    this.selectedEstado = "-";
    this.ExtractoDisponible.get("tipoTitulo")?.setValue(1);
    this.FormTasasA();
    this.FormTasasTermino();
  }

  setTercero(intTercero : number) {
    this.intTercero = intTercero;
  }

  opcionSelected(valueSlect : any) {
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.MovimientoDisponibleDtos.length = 0;
    this.MovimientoAtermino.length = 0;
    this.ExtractoDisponibleDtos.length = 0;
    this.ExtractosAtermino.length = 0;

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
    this.HabilitaMensate = 0;

    if (valueSlect == 2) {
      this.SeleccionExt = 2;
      this.validaForm = true;
      this.valueSlect = '2';
      this.SelectErroneo = false;
      setTimeout(() => {
        this.seleccioneTodo();
      }, 500);
      $(".SelectedExtracto_Ahorro").prop('selectedIndex', 2);
    } else if (valueSlect.toString() == '-') {
      this.SelectErroneo = true;
      this.Extractos.length = 0;
      this.ExtractoDisponibleDtos.length = 0;
      this.ExtractosAtermino.length = 0;
      //no hace nada
    } else {
      this.SeleccionExt = 1;
      this.valueSlect = '1';
      this.SelectErroneo = false;
      this.validaForm = false;
      setTimeout(() => {
        $(".SelectedMovimiento_Ahorro").prop('selectedIndex', 1);
      }, 400);
    }

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



  opcionSelectedYearInit(year : number) {

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
     var AñoFinal = $(".yearEnd_Ahorro").val();
     if (Number(year) > Number(AñoFinal)) {
       this.validaAnoInicial = true;
       this.validaAnoFinal = false;
       this.Extractos.length = 0;
       this.ExtractoDisponibleDtos.length = 0;
       this.ExtractosAtermino.length = 0;
       return null;
     } else {
       this.validaAnoInicial = false;
       this.validaAnoFinal = false;
       setTimeout(() => {
         $(".MesInit_Ahorro").prop('selectedIndex', 0);
       }, 400);
     }
     return null;
     //#endregion
  }

  opcionSelectedYearEnd(year : number ) {

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
    for (var index = MesFinal ; index >= MesInicial; index--){
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
    var añoInicial = $(".yearInit_Ahorro").val();
    //#region validaciones de campo
    if (Number(year) < Number(añoInicial)) {
      this.validaAnoFinal = true;
      this.validaAnoInicial = false;
      this.Extractos.length = 0;
      this.ExtractoDisponibleDtos.length = 0;
      this.ExtractosAtermino.length = 0;
      return null;
    } else {
      this.validaAnoFinal = false;
      this.validaAnoInicial = false;
      setTimeout(() => {
        $(".MesEnd_Ahorro").prop('selectedIndex', 0);
      }, 400);
    }
    return null;
  }

  MesSelected(mes : any) {
    var AñoFinal = Number($(".yearEnd_Ahorro").val());
    var añoInicial = Number($(".yearInit_Ahorro").val());
    var mesFinal = $(".MesEnd_Ahorro").val();
    if ((Number(mes) > Number(mesFinal)) && añoInicial == AñoFinal) {
      this.validaMesInicial = true;
      this.validaMesFinal = false;
      this.Extractos.length = 0;
      this.ExtractoDisponibleDtos.length = 0;
      this.ExtractosAtermino.length = 0;
      return null;
    }  else {
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }
    return null;
  }


  MesSelectedEnd(mes : any) {
    var mesInicial = $(".MesInit_Ahorro").val();
    var AñoFinal = Number($(".yearEnd_Ahorro").val());
    var añoInicial = Number($(".yearInit_Ahorro").val());
    if ((Number(mes) < Number(mesInicial)) && AñoFinal == añoInicial) {
      this.validaMesFinal = true;
      this.validaMesInicial = false;
      this.Extractos.length = 0;
      this.ExtractoDisponibleDtos.length = 0;
      this.ExtractosAtermino.length = 0;
      return null;
    } else {
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }
    return null;
  }

  seleccioneTodo() {
    $(".yearInit_Ahorro").prop('selectedIndex', 0);
    $(".yearEnd_Ahorro").prop('selectedIndex', 0);
    $(".MesInit_Ahorro").prop('selectedIndex', 0);
    $(".MesEnd_Ahorro").prop('selectedIndex', 0);
  }

  ConsultarDisponiblesExtracto() {
    var yearInicial = Number($(".yearInit_Ahorro").val());
    var yearFinal = Number($(".yearEnd_Ahorro").val());
    var MesInicial = Number($(".MesInit_Ahorro").val());
    var MesFinal = Number($(".MesEnd_Ahorro").val());
    var selExtracto = $(".SelectedExtracto_Ahorro").val();

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
      let data = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
      this.ExtractoDisponible.get("yearInit")?.setValue(yearInicial);
      this.ExtractoDisponible.get("yearEnd")?.setValue(yearFinal);
      this.ExtractoDisponible.get("MesInit")?.setValue(MesInicial);
      this.ExtractoDisponible.get("MesEnd")?.setValue(MesFinal);
      this.ExtractoDisponible.get("Usuario")?.setValue(dataLocalStorage.Usuario);
      this.ExtractoDisponible.get("Oficina")?.setValue(dataLocalStorage.Oficina);

      this.MiListaProductosService.getExtracto(
        this.ExtractoDisponible.value
      ).subscribe(
      (result) => {
        this.loading.hide();
        this.MapearEncabezadoTabla(result, 1);
       //#region Guarda log
       let data = localStorage.getItem("Data");
       var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
        var LogMisProductosData = new LogMisProductos();
        var nuevoItem = new DatosProductos();
        LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
        LogMisProductosData.IdModulo = 69;
        LogMisProductosData.IdOperacion = 49;
        LogMisProductosData.IdOpcion = 3; // Extrato
        LogMisProductosData.IdTercero = this.terceroId;
        LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
        LogMisProductosData.IdCuenta = this.idCuenta;
        nuevoItem.NumeroCuenta = this.ExtactoAportes.get("NumeroCuenta")?.value;
        nuevoItem.FechaInicial = yearInicial.toString() +"/"+ MesInicial.toString();
        nuevoItem.FechaFinal = yearFinal.toString() +"/"+ MesFinal.toString();
        LogMisProductosData.DatosProductos = nuevoItem;
        this.setLogMisProductos(LogMisProductosData);
        //#endregion
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
      );
    }
  }

  cerrarAhorros(value : number) {
    if (value == 1) {
      this.ahoDisponiblesA = true;
      $(".ahoContractualesA").prop("checked", false);
      $(".ahoAtermino").prop("checked", false);
      $(".autoizaAho").prop("checked", false);
    }
    if (value == 2) {
      this.AhoContractualesA = true;
      $(".ahoDisponibles").prop("checked", false);
      $(".ahoAtermino").prop("checked", false);
      $(".autoizaAho").prop("checked", false);
    }
    if (value == 3) {
      this.ahoAterminoA = true;
      $(".ahoDisponibles").prop("checked", false);
      $(".ahoContractualesA").prop("checked", false);
      $(".autoizaAho").prop("checked", false);
    }
    if (value == 4) {
      this.AutorizadosAhorrosA = true;
      $(".ahoDisponibles").prop("checked", false);
      $(".ahoContractualesA").prop("checked", false);
      $(".ahoAtermino").prop("checked", false);
    }
  }

  opcionSelectedFechas(value : number) {
    var FechaFin = $("#fechaFinal_").val();
    var FechaInicio = $("#fechainicio_").val();

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
            return 1;
          } else {
            this.inicioNoValida = false;
            this.FechaMayorAmenor = false;
            this.FechaMenorMayor = false;
          }
        } else if ( FechaInicio != null &&
          FechaInicio < this.fechaAperturaCuenta ||  FechaInicio != null &&
          FechaInicio > this.fechaAperturaActualDisabled ||  FechaInicio != null && FechaFin != null &&
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

  opcionSelectedFechasDispo(value : any) {
    var FechaFin = $("#fechaFinalDispo").val();
    var FechaInicio = $("#fechainicioDispo").val();

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
            this.ExtractoDisponibleDtos.length = 0;
            this.MovimientoDisponibleDtos.length = 0;
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
          this.ExtractoDisponibleDtos.length = 0;
          this.MovimientoDisponibleDtos.length = 0;
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
            this.ExtractoDisponibleDtos.length = 0;
            this.MovimientoDisponibleDtos.length = 0;
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
          this.ExtractoDisponibleDtos.length = 0;
          this.MovimientoDisponibleDtos.length = 0;
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

  opcionSelectedFechasTermino(value : number) {
    var FechaFin = $("#FechaFinalAtermino").val();
    var FechaInicio = $("#fechaInicioAtermino").val();

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
            this.ExtractosAtermino.length = 0;
            this.MovimientoAtermino.length = 0;
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
          this.ExtractosAtermino.length = 0;
          this.MovimientoAtermino.length = 0;
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
            this.ExtractosAtermino.length = 0;
            this.MovimientoAtermino.length = 0;
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
          this.ExtractosAtermino.length = 0;
          this.MovimientoAtermino.length = 0;
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

  getAutorizados(tercero : number) {
    this.cargandoAutorizaods = true;
    this.AutorizadosAhorros.length = 0;
    this.AutorizadosAhorrosCancelados.length = 0;

    this.MiListaProductosService.getAutorizados(tercero).subscribe(
      result => {
        if (result.length == 0) {
          this.AutorizadosAhorros = [];
          this.AutorizadosAhorrosCancelados = [];
          $("#NoregistraAutorizaAho").show();
          $("#NoregistraAutorizaAho_").hide();
        } else {
          var activDisp = 0;
          var CancelDisp = 0;
          this.AutorizadosAhorrosCancelados[CancelDisp] = [];
          this.AutorizadosAhorros[activDisp] = [];
          for (var i = 0; i < result.length; i++) {
            if (
              result[i].dtmCancela != "" &&
              result[i].idEstado != 10
            ) {
              $("#NoregistraAutorizaAho").hide();
              $("#NoregistraAutorizaAho_").hide();
              this.AutorizadosAhorrosCancelados[CancelDisp] = result[i];
              CancelDisp++;
            } else if (
              result[i].dtmCancela == null ||
              result[i].dtmCancela == ""
            ) {
              $("#NoregistraAutorizaAho").hide();
              $("#NoregistraAutorizaAho_").hide();
              this.AutorizadosAhorros[activDisp] = result[i];
              activDisp++;
            }
          }

          if (this.ValidadaActivo == true && activDisp == 0) {
            this.AutorizadosAhorros.length = 0;
            $("#NoregistraAutorizaAho_").show();
            $("#NoregistraAutorizaAho").hide();
            this.noRegistros = true;
          }

          if (this.ValidadaActivo == false && CancelDisp == 0) {
            this.AutorizadosAhorrosCancelados.length = 0;
            $("#NoregistraAutorizaAho_").show();
            $("#NoregistraAutorizaAho").hide();
            this.noRegistros = true;
          }
        }

        this.cargandoAutorizaods = false;
      },
      error => {
        console.log(error);
        this.cargandoAutorizaods = false;
      }
    )
  }

  MostrarAhoTermino(datos : any) {
    this.EncabezadoAhoTermino.NumeroCuenta = datos.strCuenta;
    this.EncabezadoAhoTermino.NombreProducto = datos.NameProducto;
    this.EncabezadoAhoTermino.EstadoProducto = datos.NameEstado;
    this.EncabezadoAhoTermino.OficinaProducto = datos.NameOficina;
    this.EncabezadoAhoTermino.OperacionPermitida = datos.OperaPermitida;
    this.EncabezadoAhoTermino.Asesor = datos.Asesor;

    //#region Guarda log
    let data = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
    var LogMisProductosData = new LogMisProductos();
    var nuevoItem = new DatosProductos();
    LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
    LogMisProductosData.IdModulo = 69;
    LogMisProductosData.IdOperacion = 49;
    LogMisProductosData.IdOpcion = 1; // Detalles
    LogMisProductosData.IdTercero = this.intTercero;
    LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
    LogMisProductosData.IdCuenta = datos.lngIdCuenta;
    nuevoItem.NumeroCuenta = datos.strCuenta;
    nuevoItem.FechaInicial = "";
    nuevoItem.FechaFinal = "";
    LogMisProductosData.DatosProductos = nuevoItem;
    this.setLogMisProductos(LogMisProductosData);
    // #endregion

    var cuentaChar = datos.strCuenta.split("-");
    var oficina = cuentaChar[0];
    var digito = cuentaChar[3];
    var consecutivo = cuentaChar[2];
    var producto = cuentaChar[1];
    var tercero = $("#TerceroPrincipal").val();
    this.MiListaProductosService.getInfoAhoTerminos(
      consecutivo,
      Number(tercero),
      producto,
      oficina,
      digito
    ).subscribe(
      (result) => {
        this.validaJuridico = result.validaJuridico;
        this.EncabezadoAhoTermino.Edad = result.edad;
        if (result.Liquidacion) {
          $("#liquidated").prop("checked", true);
        } else {
          $("#liquidated").prop("checked", false);
        }
        this.EncabezadoAhoTermino.NumeroTitulo = result.NumeroTitulo;
        this.EncabezadoAhoTermino.FechaConstitucion = result.edad;
        //datos negociación
        this.negociacionAtermino.CuentaAhorros = result.CuentaAhorros;
        this.negociacionAtermino.DestinoIntereses = result.DestinoIntereses;
        this.negociacionAtermino.FrecuenciaPago = result.FrecuenciaPago;

        if (
          result.AsesorExterno != null &&
          result.AsesorExterno != undefined &&
          result.AsesorExterno != ""
        ) {
          this.MiListaProductosService.ConsultaAsesorExt(
            result.AsesorExterno
          ).subscribe(
            (resultA) => {
              this.EncabezadoAhoTermino.AsesorExterno = resultA;
            },
            (errr) => {
              console.log(errr);
            }
          );
        }

        if (
          result.intIndicador != null &&
          result.intIndicador != undefined &&
          result.intIndicador != ""
        ) {
          this.MiListaProductosService.ConsultarIndicador(
            result.intIndicador
          ).subscribe(
            (resultb) => {
              this.negociacionAtermino.Indicador = resultb;
            },
            (err) => {
              console.log(err);
            }
          );
        }
        var countBenef = 0;
        this.BeneficiariosAtermino.length = 0;
        if (result.beneficiariosDtos.length > 0) {
          for (var j = 0; j < result.beneficiariosDtos.length; j++) {
            this.BeneficiariosAtermino[countBenef] =
              result.beneficiariosDtos[j];
            countBenef++;
          }
          $("#NotHaveBenef").hide();
          $("#haveBenef").show();
        } else {
          $("#NotHaveBenef").show();
          $("#haveBenef").hide();
        }
        var countAut = 0;
        this.AutorizadosAtermino.length = 0;
        if (result.autorizadosDtos.length > 0) {
          for (var j = 0; j < result.autorizadosDtos.length; j++) {
            // if (
            //   result.autorizadosDtos[j].TipoFirma ==
            //     "Firmas independientes :" ||
            //   result.autorizadosDtos[j].TipoFirma == "Firmas conjuntas :"
            // ) {
            //   result.autorizadosDtos[j].TipoFirma = result.autorizadosDtos[
            //     j
            //   ].TipoFirma.replace(":", "");
            // }
            this.AutorizadosAtermino[countAut] = result.autorizadosDtos[j];
            countAut++;
          }
          $("#haveAut").show();
          $("#NotHaveAut").hide();
        } else {
          $("#haveAut").hide();
          $("#NotHaveAut").show();
        }
        var CountRenova = 0;
        this.Renovaciones.length = 0;
        if (result.renovacions.length > 0) {
          for (var i = 0; i < result.renovacions.length; i++) {
            this.Renovaciones[CountRenova] = result.renovacions[i];
            CountRenova++;
          }
          $("#haveRenova").show();
          $("#NotHaveRenova").hide();
        } else {
          $("#haveRenova").hide();
          $("#NotHaveRenova").show();
        }

        this.negociacionAtermino.Puntos = result.Puntos;
        this.negociacionAtermino.PuntosAdicionales = result.PuntosAdicionales;
        this.FormTasaT.get('TasaEfectiva')?.setValue(result.TasaEfectiva);
        this.FormTasaT.get('TasaNominal')?.setValue(result.TasaNominal);
        this.FormTasaT.get('tasaAdicional')?.setValue(result.tasaAdicional);
        this.valortitulo = result.ValorTitulo;
        this.negociacionAtermino.intPlazo = result.intPlazo;
        this.negociacionAtermino.tasaAdicional = result.tasaAdicional

        //datos saldos
        this.SaldosAtermino.RetencionFuentePeriodo = result.RetencionFuentePeriodo;
        this.SaldosAtermino.curCanje = result.curCanje;
        this.SaldosAtermino.curEfectivo = result.curEfectivo;
        this.SaldosAtermino.SaldoTotal = result.SaldoTotal;
        this.SaldosAtermino.curIntCausado = result.curIntCausado;
        this.SaldosAtermino.curIntxPagar = result.curIntxPagar;
        this.SaldosAtermino.interesPagado = result.interesPagado;
        //fin datos saldos

        //fechas
        this.FechasAtermino.Apertura = result.FechaMatricula;
        this.FechasAtermino.UltimaTransaccion = result.UltimaTrans;
        this.FechasAtermino.Cancela = result.FechaCancela;
        this.FechasAtermino.dtmUltLiquidacion = result.dtmUltLiquidacion;
        this.FechasAtermino.dtmProLiquidacion = result.dtmProLiquidacion;
        this.FechasAtermino.dtmVencimiento = result.dtmVencimiento;
        //fin fechas
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cerrarAcordeon(value : number) {
    if (value == 1) {
      this.saldosAcordeon = true;

      // $(".saldosDisponibble").prop("checked", false);
      $(".mesAnteriorDisponible").prop("checked", false);
      $(".autorizadosDisponible").prop("checked", false);
      $(".fechasDisponible").prop("checked", false);
      $(".Libreta").prop("checked", false);
      $(".Canales").prop("checked", false);
      $(".Tarjeta").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".Garantias").prop("checked", false);
      $(".Cupos").prop("checked", false);

    }
    if (value == 2) {
      this.saldoMesAnteriorAcordeon = true;
      $(".saldosDisponibble").prop("checked", false);
      // $(".mesAnteriorDisponible").prop("checked", false);
      $(".autorizadosDisponible").prop("checked", false);
      $(".fechasDisponible").prop("checked", false);
      $(".Libreta").prop("checked", false);
      $(".Canales").prop("checked", false);
      $(".Tarjeta").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".Garantias").prop("checked", false);
      $(".Cupos").prop("checked", false);
    }
    if (value == 3) {
      this.autorizadosAcordeon = true;
      $(".saldosDisponibble").prop("checked", false);
      $(".mesAnteriorDisponible").prop("checked", false);
      // $(".autorizadosDisponible").prop("checked", false);
      $(".fechasDisponible").prop("checked", false);
      $(".Libreta").prop("checked", false);
      $(".Canales").prop("checked", false);
      $(".Tarjeta").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".Garantias").prop("checked", false);
      $(".Cupos").prop("checked", false);
    }
    if (value == 4) {
      this.fechasAcordeon = true;
      $(".saldosDisponibble").prop("checked", false);
      $(".mesAnteriorDisponible").prop("checked", false);
      $(".autorizadosDisponible").prop("checked", false);
      // $(".fechasDisponible").prop("checked", false);
      $(".Libreta").prop("checked", false);
      $(".Canales").prop("checked", false);
      $(".Tarjeta").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".Garantias").prop("checked", false);
      $(".Cupos").prop("checked", false);
    }

    if (value == 5) {
      this.LibretaAcordeon = true;
      $(".saldosDisponibble").prop("checked", false);
      $(".mesAnteriorDisponible").prop("checked", false);
      $(".autorizadosDisponible").prop("checked", false);
      $(".fechasDisponible").prop("checked", false);
      // $(".Libreta").prop("checked", false);
      $(".Canales").prop("checked", false);
      $(".Tarjeta").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".Garantias").prop("checked", false);
      $(".Cupos").prop("checked", false);
    }
    if (value == 6) {
      this.TarjetaAcordeon = true;
      $(".saldosDisponibble").prop("checked", false);
      $(".mesAnteriorDisponible").prop("checked", false);
      $(".autorizadosDisponible").prop("checked", false);
      $(".fechasDisponible").prop("checked", false);
      $(".Libreta").prop("checked", false);
      $(".Canales").prop("checked", false);
      // $(".Tarjeta").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".Garantias").prop("checked", false);
      $(".Cupos").prop("checked", false);
    }
    if (value == 7) {
      this.CanalesAcordeon = true;
      $(".saldosDisponibble").prop("checked", false);
      $(".mesAnteriorDisponible").prop("checked", false);
      $(".autorizadosDisponible").prop("checked", false);
      $(".fechasDisponible").prop("checked", false);
      $(".Libreta").prop("checked", false);
      // $(".Canales").prop("checked", false);
      $(".Tarjeta").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".Garantias").prop("checked", false);
      $(".Cupos").prop("checked", false);
    }
    if (value == 8) {
      this.CuposAcordeon = true;
      $(".saldosDisponibble").prop("checked", false);
      $(".mesAnteriorDisponible").prop("checked", false);
      $(".autorizadosDisponible").prop("checked", false);
      $(".fechasDisponible").prop("checked", false);
      $(".Libreta").prop("checked", false);
      $(".Canales").prop("checked", false);
      $(".Tarjeta").prop("checked", false);
      $(".Historial").prop("checked", false);
      $(".Garantias").prop("checked", false);
      // $(".Cupos").prop("checked", false);
    }
    if (value == 9) {
      this.GarantiasAcordeon = true;
      $(".saldosDisponibble").prop("checked", false);
      $(".mesAnteriorDisponible").prop("checked", false);
      $(".autorizadosDisponible").prop("checked", false);
      $(".fechasDisponible").prop("checked", false);
      $(".Libreta").prop("checked", false);
      $(".Canales").prop("checked", false);
      $(".Tarjeta").prop("checked", false);
      $(".Historial").prop("checked", false);
      // $(".Garantias").prop("checked", false);
      $(".Cupos").prop("checked", false);
    }
    if (value == 10) {
      this.HistorialAcordeon = true;
      $(".saldosDisponibble").prop("checked", false);
      $(".mesAnteriorDisponible").prop("checked", false);
      $(".autorizadosDisponible").prop("checked", false);
      $(".fechasDisponible").prop("checked", false);
      $(".Libreta").prop("checked", false);
      $(".Canales").prop("checked", false);
      $(".Tarjeta").prop("checked", false);
      // $(".Historial").prop("checked", false);
      $(".Garantias").prop("checked", false);
      $(".Cupos").prop("checked", false);
    }
  }

  cerrarAcordeonCheck() {
    if (this.saldosAcordeon) {
      $(".saldosDisponibble").prop("checked", false);
    }
    if (this.saldoMesAnteriorAcordeon) {
      $(".mesAnteriorDisponible").prop("checked", false);
    }
    if (this.autorizadosAcordeon) {
      $(".autorizadosDisponible").prop("checked", false);
    }
    if (this.fechasAcordeon) {
      $(".fechasDisponible").prop("checked", false);
    }
    if (this.LibretaAcordeon) {
      $(".Libreta").prop("checked", false);
    }
    if (this.TarjetaAcordeon) {
      $(".Tarjeta").prop("checked", false);
    }
    if (this.CuposAcordeon) {
      $(".Cupos").prop("checked", false);
    }
    if (this.GarantiasAcordeon) {
      $(".Garantias").prop("checked", false);
    }
    if (this.HistorialAcordeon) {
      $(".Historial").prop("checked", false);
    }
    if (this.CanalesAcordeon) {
      $(".Canales").prop("checked", false);
    }
  }

  cerraraTermino(value : number) {
    if (value == 1) {
      this.uno = true;
      $(".dos").prop("checked", false);
      $(".tres").prop("checked", false);
      $(".cuatro").prop("checked", false);
      $(".cinco").prop("checked", false);
      $(".seis").prop("checked", false);
    }
    if (value == 2) {
      this.dos = true;
      $(".uno").prop("checked", false);
      $(".tres").prop("checked", false);
      $(".cuatro").prop("checked", false);
      $(".cinco").prop("checked", false);
      $(".seis").prop("checked", false);
    }
    if (value == 3) {
      this.tres = true;
      $(".uno").prop("checked", false);
      $(".dos").prop("checked", false);
      $(".cuatro").prop("checked", false);
      $(".cinco").prop("checked", false);
      $(".seis").prop("checked", false);
    }
    if (value == 4) {
      this.cuatro = true;
      $(".uno").prop("checked", false);
      $(".dos").prop("checked", false);
      $(".tres").prop("checked", false);
      $(".cinco").prop("checked", false);
      $(".seis").prop("checked", false);
    }
    if (value == 5) {
      this.cinco = true;
      $(".uno").prop("checked", false);
      $(".dos").prop("checked", false);
      $(".tres").prop("checked", false);
      $(".cuatro").prop("checked", false);
      $(".seis").prop("checked", false);
    }
    if (value == 6) {
      this.seis = true;
      $(".uno").prop("checked", false);
      $(".dos").prop("checked", false);
      $(".tres").prop("checked", false);
      $(".cuatro").prop("checked", false);
      $(".cinco").prop("checked", false);
    }
  }

  cerrarAcordeonAtermino() {
    if (this.uno) {
      $(".uno").prop("checked", false);
    }
    if (this.dos) {
      $(".dos").prop("checked", false);
    }
    if (this.tres) {
      $(".tres").prop("checked", false);
    }
    if (this.cuatro) {
      $(".cuatro").prop("checked", false);
    }
    if (this.cinco) {
      $(".cinco").prop("checked", false);
    }
    if (this.seis) {
      $(".seis").prop("checked", false);
    }
  }

  ocultarAcordeon(value : number) {
    if (value == 1) {
      this.negociacionContractualA = true;
      $(".saldoContractual").prop("checked", false);
      $(".autorizadosContractuales").prop("checked", false);
      $(".fechasContractuales").prop("checked", false);
    }
    if (value == 2) {
      this.saldosContractualA = true;
      $(".negociacionContractual").prop("checked", false);
      $(".autorizadosContractuales").prop("checked", false);
      $(".fechasContractuales").prop("checked", false);
    }
    if (value == 3) {
      this.AutorizadosAContractualA = true;
      $(".saldoContractual").prop("checked", false);
      $(".fechasContractuales").prop("checked", false);
      $(".negociacionContractual").prop("checked", false);
    }
    if (value == 4) {
      this.FechasContractualA = true;
      $(".autorizadosContractuales").prop("checked", false);
      $(".negociacionContractual").prop("checked", false);
      $(".saldoContractual").prop("checked", false);
    }
  }

  CerrarAcordeonContractual() {
    if (this.negociacionContractualA) {
      $(".negociacionContractual").prop("checked", false);
    }
    if (this.saldosContractualA) {
      $(".saldoContractual").prop("checked", false);
    }
    if (this.AutorizadosAContractualA) {
      $(".autorizadosContractuales").prop("checked", false);
    }
    if (this.FechasContractualA) {
      $(".fechasContractuales").prop("checked", false);
    }
  }

  GetOperaciones() {
    this.operacionesService
      .OperacionesPermitidas(JSON.stringify(this.arrayExample[0]))
      .subscribe(
        (result) => {
          this.dataOperaciones = result;
          this.ValidarOperaciones(this.dataOperaciones);
        },
        (error) => {
          this.notif.onDanger(
            "Error",
            error);
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
  }

  GetDisponiblesActivos(infoCofig : any) {
    this.terceroId = infoCofig;

    this.MiListaProductosService.GetDataAhorrosActivos(infoCofig).subscribe(
      (result) => {
        this.ActivaCargando = false;

        // //separación activos e inactivos  de Disponibles
        if (result.lstAhorros.length == 0) {
          this.DataDisponible = [];
          this.DataDisponibleCancelado = [];
          $("#NotHaveReg").show();
          $("#NotHaveReg_").hide();
        } else {
          var activDisp = 0;
          var CancelDisp = 0;
          this.DataDisponibleCancelado[CancelDisp] = [];
          this.DataDisponible[activDisp] = [];
          for (var i = 0; i < result.lstAhorros.length; i++) {
            if (
              result.lstAhorros[i].dtmCancela != "" &&
              result.lstAhorros[i].intEstado != 10
            ) {
              $("#NotHaveReg").hide();
              $("#NotHaveReg_").hide();
              this.DataDisponibleCancelado[CancelDisp] = result.lstAhorros[i];
              CancelDisp++;
            } else if (
              result.lstAhorros[i].dtmCancela == null ||
              result.lstAhorros[i].dtmCancela == ""
            ) {
              $("#NotHaveReg").hide();
              $("#NotHaveReg_").hide();
              this.DataDisponible[activDisp] = result.lstAhorros[i];
              activDisp++;
            }
          }

          if (this.ValidadaActivo == true && activDisp == 0) {
            this.DataDisponible.length = 0;
            $("#NotHaveReg_").show();
            $("#NotHaveReg").hide();
            this.noRegistros = true;
          }

          if (this.ValidadaActivo == false && CancelDisp == 0) {
            this.DataDisponibleCancelado.length = 0;
            $("#NotHaveReg_").show();
            $("#NotHaveReg").hide();
            this.noRegistros = true;
          }
        }

        //separación activos e inactivos  de ContraActuales
        if (result.lstContractual.length == 0) {
          this.DataContractual = [];
          this.DataContractualCancelado = [];
          $("#noregistraContraActual").show();
          $("#noregistraContraActual_").hide();
        } else {
          var activContraAct = 0;
          var CancelContraAct = 0;
          for (var i = 0; i < result.lstContractual.length; i++) {
            if (
              result.lstContractual[i].dtmCancela != "" &&
              result.lstContractual[i].intEstado != 10
            ) {
              $("#noregistraContraActual").hide();
              $("#noregistraContraActual_").hide();
              this.DataContractualCancelado[CancelContraAct] =
                result.lstContractual[i];
              CancelContraAct++;
            } else if (
              result.lstContractual[i].dtmCancela == null ||
              result.lstContractual[i].dtmCancela == ""
            ) {
              $("#noregistraContraActual").hide();
              $("#noregistraContraActual_").hide();
              this.DataContractual[activContraAct] = result.lstContractual[i];
              activContraAct++;
            }
            if (this.ValidadaActivo == true && activContraAct == 0) {
              this.DataContractual.length = 0;
              $("#noregistraContraActual_").show();
              $("#noregistraContraActual").hide();
              this.noRegistros = true;
            }
            if (this.ValidadaActivo == false && CancelContraAct == 0) {
              this.DataContractualCancelado.length = 0;
              $("#noregistraContraActual_").show();
              $("#noregistraContraActual").hide();
              this.noRegistros = true;
            }
            this.ActivosContractuales = activContraAct;
          }
        }

        // //separación activos e inactivos  de ContraActuales
        if (result.lstTermino.length == 0) {
          this.DataATermino = [];
          this.DataATerminoCancelado = [];
          $("#NoregistraAtermino").show();
          $("#NoregistraAtermino_").hide();
        } else {
          var activDisponi = 0;
          var CancelDisponi = 0;
          for (var i = 0; i < result.lstTermino.length; i++) {
            if (
              result.lstTermino[i].dtmCancela != "" &&
              result.lstTermino[i].intEstado != 10
            ) {
              $("#NoregistraAtermino").hide();
              $("#NoregistraAtermino_").hide();
              this.DataATerminoCancelado[CancelDisponi] = result.lstTermino[i];
              CancelDisponi++;
            } else if (
              result.lstTermino[i].dtmCancela == null ||
              result.lstTermino[i].dtmCancela == ""
            ) {
              $("#NoregistraAtermino").hide();
              $("#NoregistraAtermino_").hide();
              this.DataATermino[activDisponi] = result.lstTermino[i];
              activDisponi++;
            }

            if (this.ValidadaActivo == true && activDisponi == 0) {
              this.DataATermino.length = 0;
              $("#NoregistraAtermino").hide();
              $("#NoregistraAtermino_").show();
              this.noRegistros = true;
            }

            if (this.ValidadaActivo == false && CancelDisponi == 0) {
              this.DataATerminoCancelado.length = 0;
              $("#NoregistraAtermino").hide();
              $("#NoregistraAtermino_").show();
              this.noRegistros = true;
            }
          }
        }

        $("#loading").hide();
      },
      (error) => {
        this.ActivaCargando = false;
      }
    );
  }

  ocultarMostrarAhorros() {
    $("#NotHaveReg_").hide();
    $("#noregistraContraActual_").hide();
    $("#NoregistraAtermino_").hide();

    if (
      this.DataATermino.length <= 0 ||
      this.DataATerminoCancelado.length <= 0
    ) {
      if (this.ValidadaActivo == true && this.DataATermino.length > 0) {
        // no hace nada
        $("#NoregistraAtermino_").hide();
      } else if (
        this.ValidadaActivo == false &&
        this.DataATerminoCancelado.length > 0
      ) {
        $("#NoregistraAtermino_").hide();
      } else {
        $("#NoregistraAtermino_").show();
      }
    }

    if (
      this.DataContractual.length <= 0 ||
      this.DataContractualCancelado.length <= 0
    ) {
      if (this.ValidadaActivo == true && this.DataContractual.length > 0) {
        // no hace nada
        $("#noregistraContraActual_").hide();
      } else if (
        this.ValidadaActivo == false &&
        this.DataContractualCancelado.length > 0
      ) {
        $("#noregistraContraActual_").hide();
      } else {
        $("#noregistraContraActual_").show();
      }
    }

    if (
      this.DataDisponible.length <= 0 ||
      this.DataDisponibleCancelado.length <= 0
    ) {
      if (this.ValidadaActivo == true && this.DataDisponible.length > 0) {
        // no hace nada
        $("#NotHaveReg_").hide();
      } else if (
        this.ValidadaActivo == false &&
        this.DataDisponibleCancelado.length > 0
      ) {
        $("#NotHaveReg_").hide();
      } else {
        $("#NotHaveReg_").show();
      }
    }
  }

  GetDisponiblesInActivos(infoCofig : any) {
    this.MiListaProductosService.GetDataAhorrosCancelados(infoCofig).subscribe(
      (result) => {
        if (result.lstAhorros === null) {
          this.DataDisponible = [];
        } else {
          this.DataDisponible = result.lstAhorros;
        }
      },
      (error) => {

      }
    );
  }

  GetContractualesActivos(infoCofig : any) {
    this.MiListaProductosService.GetDataContractualActivos(infoCofig).subscribe(
      (result) => {
        this.DataContractual = result.lstContractual;
      },
      (error) => {}
    );
  }

  GetContractualesInActivos(infoCofig : any) {
    this.MiListaProductosService.GetDataContractualCancelados(
      infoCofig
    ).subscribe(
      (result) => {
        this.DataContractual = result.lstContractual;
      },
      (error) => {}
    );
  }

  GetATerminoActivos(infoCofig : any) {
    this.MiListaProductosService.GetDataATerminoActivos(infoCofig).subscribe(
      (result) => {
        this.DataATermino = result.lstTermino;
      },
      (error) => {}
    );
  }

  GetATerminoInActivos(infoCofig : any) {
    this.MiListaProductosService.GetDataATerminoCancelados(infoCofig).subscribe(
      (result) => {
        this.DataATermino = result.lstTermino;
      },
      (error) => {}
    );
  }

  ObtenerHistorial(idOficina : string, idProducto : string, consecutivo : string, digito : string) {
    this.loading.show();
    this.MiListaProductosService.ObtenerHistorial(
      idOficina,
      idProducto,
      consecutivo,
      digito
    ).subscribe(
      (result) => {
        this.loading.hide();
        this.dataHistorialDisponible = result;
      },
      (error) => {
        this.loading.hide();
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  DetalleDisponible(data : any) {
    this.DetalleDispoModel = new DetalleDisponibleModel();
    this.saldosDisponibles = new SaldosDisponibles();
    this.Libreta = new Libreta();
    this.Tarjeta = new Tarjeta();
    this.Cupo = new Cupo();
    this.dataObjet = null;
    this.DetalleDispoModel.Cuenta = data.strCuenta;
    this.DetalleDispoModel.Producto = data.NameProducto;
    this.DetalleDispoModel.Estado = data.NameEstado;
    this.DetalleDispoModel.Oficina = data.NameOficina;
    this.DetalleDispoModel.OperacionPermitida = data.OperaPermitida;
    this.DetalleDispoModel.Asesor = data.Asesor;

    //#region Guarda log
    let datas = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
    var LogMisProductosData = new LogMisProductos();
    var nuevoItem = new DatosProductos();
    LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
    LogMisProductosData.IdModulo = 69;
    LogMisProductosData.IdOperacion = 49;
    LogMisProductosData.IdOpcion = 1; // Detalle
    LogMisProductosData.IdTercero = this.intTercero;
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
        this.saldosDisponibles.RetirosPeriodos = result.RetirosPeriodos;
        this.saldosDisponibles.AliasCuenta = result.AliasCuenta;
        if (result.IdMedioPago == 0) {
          this.LibretaBoolean = true;

          this.Libreta.curInicial = "";
          this.Libreta.curFinal = "";
          if (this.dataObjet.Talonarios.length !== 0) {
            var CobroTotal = 0;
            this.dataObjet.Talonarios.forEach((elementCobro : any) => {
              CobroTotal = (CobroTotal + elementCobro.CobroLibreta);
            });
            this.saldosDisponibles.tarjetaoPlastico = CobroTotal.toString();
            this.Libreta.curInicial = result.Talonarios[0].Inicial;
            this.Libreta.curFinal = result.Talonarios[0].Final;
            this.saldosDisponibles.moraCuotaManejo = "0";
          }
          else
          {
            this.saldosDisponibles.tarjetaoPlastico = "0";
            this.saldosDisponibles.moraCuotaManejo = "0";
          }


          // if (result.Talonarios[0] != null && result.Talonarios[0] != undefined) {
          //   if (
          //     result.Talonarios[0].CobroLibreta == null ||
          //     result.Talonarios[0].CobroLibreta == undefined ||
          //     result.Talonarios[0].CobroLibreta == ""
          //   ) {
          //     this.saldosDisponibles.tarjetaoPlastico = "0";
          //   } else {
          //     this.saldosDisponibles.tarjetaoPlastico = CobroTotal.toString();
          //   }
          // } else {
          //   this.saldosDisponibles.tarjetaoPlastico = "0";
          //   this.saldosDisponibles.moraCuotaManejo = "0";
          // }

        } else if (result.IdMedioPago == 10 || result.IdMedioPago == 50 || result.IdMedioPago == 60 || result.IdMedioPago == 70) {
          this.LibretaBoolean = false;
          if (result.IdMedioPago == 50 || result.IdMedioPago == '50' || result.IdMedioPago == 70 || result.IdMedioPago == '70') {
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

            this.ConvenioTarjetas(this.Tarjeta.IdConvenio);
            this.DiaCortePago(
              this.Tarjeta.IdConvenio,
              this.Tarjeta.intDiaCorte
            );

            this.Canales = result.Canales;

            if(result?.Cupo){
              this.Cupo.CupoAprobado = result?.Cupo?.CupoAprobado ?? 0;
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
  
            }

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
          $("#activa").prop("checked", true);
        } else {
          $("#activa").prop("checked", false);
        }

        if (result.Exenta == true) {
          $("#exento").prop("checked", true);
        } else {
          $("#exento").prop("checked", false);
        }

        if (result.ExoneradaGmf == true) {
          $("#exonera").prop("checked", true);
        } else {
          $("#exonera").prop("checked", false);
        }

        if (result.TibrarComentario == true) {
          $("#timbra").prop("checked", true);
        } else {
          $("#timbra").prop("checked", false);
        }

        this.DetalleDispoModel.FechaMatricula = result.FechaApertura;
        this.DetalleDispoModel.FechaUltimaTransaccion = result.FechaUltimaTrans;
        this.DetalleDispoModel.FechaCancela = result.FechaCancelacion;
        var nombreAsesorExterno =
          result.PrimerApellidoAsesorE +
          " " +
          result.SegundoApellidoAsesorE +
          " " +
          result.PrimerNombreAsesorE +
          " " +
          result.SegundoNombreAsesoreE;
        this.DetalleDispoModel.AsesorExt = nombreAsesorExterno;

        var FormaPago = result.IdFormaPago;
        if (FormaPago == 0) {
          this.DetalleDispoModel.FormaPago = "Caja";
        } else if (FormaPago == 1) {
          this.DetalleDispoModel.FormaPago = "Débito";
        } else if (FormaPago == 2) {
          this.DetalleDispoModel.FormaPago = "Nómina";
        } else {
          this.DetalleDispoModel.FormaPago = "";
        }

        var medioPago = +result.IdMedioPago;
        if (medioPago == 0) {
          this.DetalleDispoModel.MedioPago = "Libretas";
        } else if (medioPago == 10) {
          this.DetalleDispoModel.MedioPago = "Sin Cupo";
        } else if (medioPago == 50) {
          this.DetalleDispoModel.MedioPago = "Con Cupo";
        } else if (medioPago == 60) {
          this.DetalleDispoModel.MedioPago = "Sin Tarjeta Sin Cupo";
        } else if (medioPago == 70) {
          this.DetalleDispoModel.MedioPago = "Sin Tarjeta Con Cupo";
        } else {
          this.DetalleDispoModel.MedioPago = "";
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
        this.saldosDisponibles.GMFAdescontar = result.GMFAdescontar;
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
    this.DetalleDispoModel.Timbrar = data.TibrarComentario;
  }

  ConvenioTarjetas(idConvenio : number) {
    this.MiListaProductosService.ConveniosTarjetas().subscribe(
      (result) => {
        //
        result.forEach((element : any) => {
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

  DiaCortePago(Convenio : any, IntDia : number) {
    this.MiListaProductosService.DiaCortePago(Convenio).subscribe(
      (result) => {
        result.forEach((element : any) => {
          if (element.intDiaCorte === IntDia) {
            this.Tarjeta.DiaCortePago =
              element.intDiaCorte + " - " + element.intDiaPago;
          }
        });
      },
      (error) => {
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
        this.loading.hide();
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  DetalleContractual(data : any) {


    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var idOficina = cuentaArray[0];
    var idProducto = cuentaArray[1];
    var consecutivo = cuentaArray[2];
    var digito = cuentaArray[3];


    //#region Guarda log
    let datas = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
    var LogMisProductosData = new LogMisProductos();
    var nuevoItem = new DatosProductos();
    LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
    LogMisProductosData.IdModulo = 69;
    LogMisProductosData.IdOperacion = 49;
    LogMisProductosData.IdOpcion = 1; // Detalle
    LogMisProductosData.IdTercero = this.intTercero;
    LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
    LogMisProductosData.IdCuenta = data.lngIdCuenta;
    nuevoItem.NumeroCuenta = data.strCuenta;
    nuevoItem.FechaInicial = "";
    nuevoItem.FechaFinal = "";
    LogMisProductosData.DatosProductos = nuevoItem;
    this.setLogMisProductos(LogMisProductosData);
    // #endregion

    this.DetalleContracModel = new DetalleContractualModel();
    this.DetalleContracModel.Cuenta = data.strCuenta;
    this.DetalleContracModel.Producto = data.NameProducto;
    this.DetalleContracModel.Estado = data.NameEstado;
    this.DetalleContracModel.Oficina = data.NameOficina;
    this.DetalleContracModel.OperacionPermitida = data.OperaPermitida;
    this.DetalleContracModel.Asesor = data.Asesor;
    this.MiListaProductosService.DetalleProductoContraActual(
      idOficina,
      idProducto,
      consecutivo,
      digito
    ).subscribe(
      (result) => {
        var indicador = result.IdIndicador;
        var periodo = result.IdPeriodo;
        var destino = result.IdLiquidacion;
        var FormaPago = result.IdFormaPago;

        //datos encabezado

        this.DetalleContracModel.NroSorteo = result.Sorteo;
        this.DetalleContracModel.NroTitulo = result.NroTitulo;
        var nombreAsesorExterno =
          result.PrimerApellidoAsesorE +
          " " +
          result.SegundoApellidoAsesorE +
          " " +
          result.PrimerNombreAsesorE +
          " " +
          result.SegundoNombreAsesoreE;
        this.DetalleContracModel.AsesorExt = nombreAsesorExterno;
        var posactivos = 0;
        this.AutorizadosTitular.length = 0;
        for (var j = 0; j < result.Titulares.length; j++) {
          if (
            result.Titulares[j].TipoFirma == "Firmas independientes :  " ||
            result.Titulares[j].TipoFirma == "Firmas conjuntas:   "
          ) {
            result.Titulares[j].TipoFirma = result.Titulares[
              j
            ].TipoFirma.replace(":", "");
          }
          this.AutorizadosTitular[posactivos] = result.Titulares[j];
          posactivos++;
        }

        this.DetalleContracModel.FechaMatricula = result.FechaApertura;
        this.DetalleContracModel.FechaUltimaTransaccion =
          result.FechaUltimaTrans;
        this.DetalleContracModel.FechaVencimiento = result.FechaVencimiento;
        this.DetalleContracModel.FechaCancela = result.FechaCancelacion;
        this.DetalleContracModel.Plazo = result.Plazo;
        this.DetalleContracModel.CuotaMes = result.CuotaMes;
        this.DetalleContracModel.ValorPlan = result.ValorPlan;
        this.DetalleContracModel.cuentaAhorros = result.CuentaDestino;
        this.DetalleContracModel.Puntos = result.Puntos;
        this.PuntosAdici = result.PuntosA;
        if (this.PuntosAdici != null && this.PuntosAdici != undefined) {
          for (var i in this.PuntosAdici) {
            const element = this.PuntosAdici[i];
            this.DetalleContracModel.PuntosAdicionales = element;
          }
        } else {
          this.DetalleContracModel.PuntosAdicionales = "";
        }
        this.TasasDtos = result.ltTasa;

        this.TasasDtos.forEach((element) => {
          var tasaEfectiva = element.TasaEfectiva;
          var tasaNominal = element.TasaNominal;
          this.FormTasas.get("TasaNominal")?.setValue(tasaNominal);
          this.FormTasas.get("TasaEfectiva")?.setValue(tasaEfectiva);
        });

        if (this.AutorizadosTitular.length <= 0) {
          this.ActiveNotRegisterAutorizados = true;
        } else {
          this.ActiveNotRegisterAutorizados = false;
        }

        if (FormaPago == 0) {
          this.DetalleContracModel.FormaPago = "Caja";
        } else if (FormaPago == 1) {
          this.DetalleContracModel.FormaPago = "Débito";
        } else if (FormaPago == 2) {
          this.DetalleContracModel.FormaPago = "Nómina";
        } else {
          this.DetalleContracModel.FormaPago = "";
        }

        if (destino == 0) {
          this.DetalleContracModel.TipoCuentaDestino = "Cuenta x Pagar";
        } else if (destino == 1) {
          this.DetalleContracModel.TipoCuentaDestino = "Cuenta de Ahorros";
        } else {
          this.DetalleContracModel.TipoCuentaDestino = "";
        }

        //fin datos encabezado

        //datos de saldos
        this.saldosContractual = new SaldosContractuales();
        this.saldosContractual.RetencioFuente = result.Retencion;
        this.saldosContractual.InteresCausado = result.InteresCausado;
        this.saldosContractual.SaldoMinimo = result.SaldoMinimo;
        this.saldosContractual.InteresXPagar = result.InteresxPagar;
        this.saldosContractual.SaldoCanje = result.Canje;
        if (
          result.ValorSorteo == null ||
          result.ValorSorteo == "" ||
          result.ValorSorteo == undefined
        ) {
          this.saldosContractual.ValorXSorteo = "0";
        } else {
          this.saldosContractual.ValorXSorteo = result.ValorSorteo;
        }
        if (
          result.InteresxPuntos == null ||
          result.InteresxPuntos == "" ||
          result.InteresxPuntos == undefined
        ) {
          this.saldosContractual.InteresXPuntos = "0";
        } else {
          this.saldosContractual.InteresXPuntos = result.InteresxPuntos;
        }
        this.saldosContractual.InteresLiquidado = result.InteresLiquidado;
        this.saldosContractual.SaldoEfectivo = result.Efectivo;
        this.saldosContractual.SaldoTotal = result.Canje + result.Efectivo;

        //fin mapeo datos de saldos

        if (periodo == 30 || periodo == 31) {
          this.DetalleContracModel.Periodo = "Mes";
        }
        //consulta indicador
        if (indicador != null && indicador != "" && indicador != undefined) {
          this.MiListaProductosService.ConsultarIndicador(indicador).subscribe(
            (result) => {
              this.DetalleContracModel.Indicador = result;
            },
            (error) => {
              console.log(error);
            }
          );
        } else {
          this.DetalleContracModel.Indicador = "";
        }
      },
      (error) => {}
    );
  }

  DetalleMovimientoDisponible(data : any) {
    this.HabilitaMensate = 0;
    this.ExtractoDisponible.get("IdTercero")?.setValue(this.terceroId);
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var consecutivo = cuentaArray[2];
    var consecutivoSinCeros = Number(consecutivo);
    this.ExtractoDisponible.get("consecutivo")?.setValue(consecutivoSinCeros);
    this.ExtractoDisponible.get("NumeroCuenta")?.setValue(cuenta);
    this.Cuota = data.curCuota;
    this.idCuenta = data.lngIdCuenta;
    this.consecutivo = consecutivo;
    var consecutivo = cuentaArray[2];
    this.ExtractoDisponible.get("NombreProducto")?.setValue(data.NameProducto);
    this.ExtractoDisponible.get("TipoProducto")?.setValue("Disponible");
    //Setear fecha inicial y final para los movimientos
    this.fechaAperturaCuenta = moment(new Date(data.dtmMatricula)).format('YYYY-MM-DD');
    this.fechaAperturaActualDisabled = moment(new Date()).format('YYYY-MM-DD');
    $("#fechainicioDispo").val(this.fechaAperturaCuenta);
    $("#fechaFinalDispo").val(this.fechaAperturaActualDisabled);
    this.ConsultaYears();
  }

  DetalleMovimientoContractual(data : any) {
    this.HabilitaMensate = 0;
    this.ExtactoAportes.get("IdTercero")?.setValue(this.terceroId);
    var cuenta = data.strCuenta;
    this.ExtactoAportes.get("NumeroCuenta")?.setValue(cuenta);
    var cuentaArray = cuenta.split("-");
    var consecutivo = cuentaArray[2];
    var consecutivoSinCeros = Number(consecutivo);
    this.ExtactoAportes.get("consecutivo")?.setValue(consecutivoSinCeros);
    this.ExtactoAportes.get("NombreProducto")?.setValue(data.NameProducto);
    this.ExtactoAportes.get("TipoProducto")?.setValue("Contractual");
    this.Cuota = data.curCuota;
    this.consecutivo = consecutivo;
    var idOficina = cuentaArray[0];
    var idProducto = cuentaArray[1];
    var consecutivo = cuentaArray[2];
    var digito = cuentaArray[3];
    this.idCuenta = data.lngIdCuenta;
    this.fechaAperturaCuenta = moment(new Date(data.dtmMatricula)).format('YYYY-MM-DD');
    this.fechaAperturaActualDisabled = moment(new Date()).format('YYYY-MM-DD');
    $("#fechainicio_").val(this.fechaAperturaCuenta);
    $("#fechaFinal_").val(this.fechaAperturaActualDisabled);
    this.ConsultaYears();

    this.MiListaProductosService.DetalleProductoContraActual(
      idOficina,
      idProducto,
      consecutivo,
      digito
    ).subscribe(
      (result) => {
        this.PlazoAhorro = result.Plazo;
        this.MontoPlan = this.Cuota * this.PlazoAhorro;
        this.ExtactoAportes.get("valorPlan")?.setValue(this.MontoPlan);
      },
      (error) => {
        console.log(error);
      }
    );

    this.ExtactoAportes.get("CuotaMes")?.setValue(this.Cuota);
  }

  detalleMovimientoAtermino(data : any) {
    this.HabilitaMensate = 0;
    this.idCuenta = data.lngIdCuenta;
    this.ExtractoAtermino.get("IdTercero")?.setValue(this.terceroId);
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var consecutivo = cuentaArray[2];
    var consecutivoSinCeros = Number(consecutivo);
    this.ExtractoAtermino.get("consecutivo")?.setValue(consecutivoSinCeros);
    this.ExtractoAtermino.get("NumeroCuenta")?.setValue(cuenta);
    this.ExtractoAtermino.get("NombreProducto")?.setValue(data.NameProducto);
    this.ExtractoAtermino.get("TipoProducto")?.setValue("Atermino");
    this.Cuota = data.curCuota;
    this.consecutivo = consecutivo;
    var consecutivo = cuentaArray[2];
    this.fechaAperturaCuenta = moment(new Date(data.dtmMatricula)).format('YYYY-MM-DD');
    this.fechaAperturaActualDisabled = moment(new Date()).format('YYYY-MM-DD');
    $("#fechaInicioAtermino").val(this.fechaAperturaCuenta);
    $("#FechaFinalAtermino").val(this.fechaAperturaActualDisabled);
    this.ConsultaYears();
  }

  FormExtracto() {
    const FechaInicio = new FormControl("", []);
    const FechaFin = new FormControl("", []);
    const yearInit = new FormControl("", []);
    const yearEnd = new FormControl("", []);
    const MesInit = new FormControl("", []);
    const MesEnd = new FormControl("", []);
    const Usuario = new FormControl("", []);
    const Oficina = new FormControl("", []);
    const NombreProducto = new FormControl("", []);
    const TipoProducto = new FormControl("", []);
    const MovExtSelector = new FormControl("", [Validators.required]);
    const IdTercero = new FormControl("", [Validators.required]);
    const consecutivo = new FormControl("", [Validators.required]);
    const CuotaMes = new FormControl("", [Validators.required]);
    const valorPlan = new FormControl("", [Validators.required]);
    const NumeroCuenta = new FormControl("", [Validators.required]);

    this.ExtactoAportes = new FormGroup({
      FechaInicio: FechaInicio,
      FechaFin: FechaFin,
      MovExtSelector: MovExtSelector,
      IdTercero: IdTercero,
      consecutivo: consecutivo,
      CuotaMes: CuotaMes,
      valorPlan: valorPlan,
      NumeroCuenta: NumeroCuenta,
      yearInit: yearInit,
      yearEnd: yearEnd,
      MesInit: MesInit,
      MesEnd: MesEnd,
      Usuario: Usuario,
      Oficina: Oficina,
      NombreProducto: NombreProducto,
      TipoProducto: TipoProducto
    });
  }

  FormTasasA(){
    const TasaNominal = new FormControl("", []);
    const TasaEfectiva = new FormControl("", []);
    this.FormTasas = new FormGroup({
      TasaNominal: TasaNominal,
      TasaEfectiva: TasaEfectiva
    });
  }

  FormTasasTermino() {
    const TasaNominal = new FormControl("", []);
    const TasaEfectiva = new FormControl("", []);
    const tasaAdicional = new FormControl("", []);
    this.FormTasaT = new FormGroup({
      TasaNominal: TasaNominal,
      TasaEfectiva: TasaEfectiva,
      tasaAdicional: tasaAdicional
    });
  }

  FormExtractoDisponibles() {
    const FechaInicio = new FormControl("", []);
    const FechaFin = new FormControl("", []);
    const yearInit = new FormControl("", []);
    const yearEnd = new FormControl("", []);
    const MesInit = new FormControl("", []);
    const MesEnd = new FormControl("", []);
    const Usuario = new FormControl("", []);
    const Oficina = new FormControl("", []);
    const NombreProducto = new FormControl("", []);
    const TipoProducto = new FormControl("", []);
    const MovExtSelector = new FormControl("", [Validators.required]);
    const IdTercero = new FormControl("", [Validators.required]);
    const consecutivo = new FormControl("", [Validators.required]);
    const NumeroCuenta = new FormControl("", [Validators.required]);
    const tipoTitulo = new FormControl("", []);
    this.ExtractoDisponible = new FormGroup({
      FechaInicio: FechaInicio,
      FechaFin: FechaFin,
      MovExtSelector: MovExtSelector,
      IdTercero: IdTercero,
      consecutivo: consecutivo,
      tipoTitulo: tipoTitulo,
      NumeroCuenta: NumeroCuenta,
      yearInit: yearInit,
      yearEnd: yearEnd,
      MesInit: MesInit,
      MesEnd: MesEnd,
      Usuario: Usuario,
      Oficina: Oficina,
      TipoProducto: TipoProducto,
      NombreProducto: NombreProducto
    });
  }

  FormAtermino() {
    const FechaInicio = new FormControl("", []);
    const FechaFin = new FormControl("", []);
    const yearInit = new FormControl("", []);
    const yearEnd = new FormControl("", []);
    const MesInit = new FormControl("", []);
    const MesEnd = new FormControl("", []);
    const Usuario = new FormControl("", []);
    const Oficina = new FormControl("", []);
    const NombreProducto = new FormControl("", []);
    const TipoProducto = new FormControl("", []);
    const MovExtSelector = new FormControl("", [Validators.required]);
    const IdTercero = new FormControl("", [Validators.required]);
    const consecutivo = new FormControl("", [Validators.required]);
    const NumeroCuenta = new FormControl("", [Validators.required]);
    this.ExtractoAtermino = new FormGroup({
      FechaInicio: FechaInicio,
      FechaFin: FechaFin,
      MovExtSelector: MovExtSelector,
      IdTercero: IdTercero,
      consecutivo: consecutivo,
      NumeroCuenta: NumeroCuenta,
      yearInit: yearInit,
      yearEnd: yearEnd,
      MesInit: MesInit,
      MesEnd: MesEnd,
      Usuario: Usuario,
      Oficina: Oficina,
      NombreProducto: NombreProducto,
      TipoProducto: TipoProducto
    });
  }

  ResetModal() {
    this.ExtactoAportes.get("MovExtSelector")?.setValue("-");
    this.ExtractoDisponible.get("MovExtSelector")?.setValue("-");
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.MovimientoDisponibleDtos.length = 0;
    this.ExtractoDisponibleDtos.length = 0;
    this.MovimientoAtermino.length = 0;
    this.ExtractosAtermino.length = 0;

    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.FinVacida = false;
    this.InicioVacida = false;
    this.FechaMenorMayor = false;

    this.valueFechaFinal = "";
    this.valueFechaInicial = "";
    this.NoRegistros = 1;
    this.validaForm = false;
    this.validaMesFinal = false;
    this.validaMesInicial = false;
    this.validaAnoFinal = false;
    this.validaAnoFinal = false;
    this.seleccioneTodo();
  }

  Consultar() {
    this.SelectionExtOrMov = this.ExtactoAportes.get("MovExtSelector")?.value;
    var FechaInicio = $("#fechainicio_").val();
    var FechaFin = $("#fechaFinal_").val();
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
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
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
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
    } else {
      this.FechaMayorAmenor = false;
      this.SelectErroneo = false;
      this.inicioNoValida = false;
      this.finNoValida = false;
      this.FinVacida = false;
      this.InicioVacida = false;
      if (
        this.SelectionExtOrMov == 2 &&
        FechaInicio != null &&
        FechaFin != null
      ) {
        this.ExtactoAportes.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtactoAportes.get("FechaFin")?.setValue(FechaFin);
        this.loading.show();
        this.MiListaProductosService.getExtracto(
          this.ExtactoAportes.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            this.MapearEncabezadoTabla(result, 2);
              //#region Guarda log
              let data = localStorage.getItem("Data");
              var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
              var LogMisProductosData = new LogMisProductos();
              var nuevoItem = new DatosProductos();
              LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
              LogMisProductosData.IdModulo = 69;
              LogMisProductosData.IdOperacion = 49;
              LogMisProductosData.IdOpcion = 3; // Extrato
              LogMisProductosData.IdTercero = this.terceroId;
              LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
              LogMisProductosData.IdCuenta = this.idCuenta;
              nuevoItem.NumeroCuenta = this.ExtactoAportes.get("NumeroCuenta")?.value;
              nuevoItem.FechaInicial = FechaInicio != null ? FechaInicio.toString() : "";
              nuevoItem.FechaFinal = FechaFin != null ? FechaFin.toString() : "";
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
        this.ExtactoAportes.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtactoAportes.get("FechaFin")?.setValue(FechaFin);
        this.loading.show();
        this.MiListaProductosService.getMovimiento(
          this.ExtactoAportes.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            this.MapearEncabezadoTablaMov(result, 2);
            //#region Guarda log
            let data = localStorage.getItem("Data");
            var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 49;
            LogMisProductosData.IdOpcion = 2; // Movimiento
            LogMisProductosData.IdTercero = this.terceroId;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            LogMisProductosData.IdCuenta = this.idCuenta;
            nuevoItem.NumeroCuenta = this.ExtactoAportes.get("NumeroCuenta")?.value;
            nuevoItem.FechaInicial = FechaInicio != null ?FechaInicio.toString() : "";
            nuevoItem.FechaFinal = FechaFin != null ? FechaFin.toString() : "";
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
  ConsultarExtractoContract() {
    var yearInicial = Number($(".yearInit_Ahorro").val());
    var yearFinal = Number($(".yearEnd_Ahorro").val());
    var MesInicial = Number($(".MesInit_Ahorro").val());
    var MesFinal = Number($(".MesEnd_Ahorro").val());
    var selExtracto = $(".SelectedExtracto_Ahorro").val();

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
      let data = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
      this.ExtactoAportes.get("yearInit")?.setValue(yearInicial);
      this.ExtactoAportes.get("yearEnd")?.setValue(yearFinal);
      this.ExtactoAportes.get("MesInit")?.setValue(MesInicial);
      this.ExtactoAportes.get("MesEnd")?.setValue(MesFinal);
      this.ExtactoAportes.get("Usuario")?.setValue(dataLocalStorage.Usuario);
      this.ExtactoAportes.get("Oficina")?.setValue(dataLocalStorage.Oficina);

      this.MiListaProductosService.getExtracto(
        this.ExtactoAportes.value
      ).subscribe(
      (result) => {
        this.loading.hide();
        this.MapearEncabezadoTabla(result, 2);
          //#region Guarda log
          let data = localStorage.getItem("Data");
          var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
          var LogMisProductosData = new LogMisProductos();
          var nuevoItem = new DatosProductos();
          LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
          LogMisProductosData.IdModulo = 69;
          LogMisProductosData.IdOperacion = 49;
          LogMisProductosData.IdOpcion = 3; // Extrato
          LogMisProductosData.IdTercero = this.terceroId;
          LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
          LogMisProductosData.IdCuenta = this.idCuenta;
          nuevoItem.NumeroCuenta = this.ExtactoAportes.get("NumeroCuenta")?.value;
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

  SendEmail() {
    this.loading.show();
    this.validaMail = true;
    // this.ValidaPlantillaMail();
    // setTimeout(() => {
      this.SendMailAhorros();
    // }, 5000);
  }

  SendEmailContactual() {
    this.loading.show();
    this.validaMail = true;
    // this.ValidaPlantillaMail();
    // setTimeout(() => {
      this.SendMailContractual();
    // }, 5000);
  }

  SendEmailATermino() {
    this.loading.show();
    this.validaMail = true;
    // this.ValidaPlantillaMail();
    // setTimeout(() => {
      this.SendMailAtermino();
    // }, 5000);
  }

  SendMailAhorros() {
    if (this.validaMail == true) {
      this.loading.show();
      this.MiListaProductosService.sendMailProductos(this.ExtractoDisponible.value).subscribe(
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
          LogMisProductosData.IdOperacion = 49;
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

  SendMailContractual() {
    if (this.validaMail == true) {
      this.loading.show();
      this.MiListaProductosService.sendMailProductos(this.ExtactoAportes.value).subscribe(
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
          LogMisProductosData.IdOperacion = 49;
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

  SendMailAtermino() {
    if (this.validaMail == true) {
      this.loading.show();
      this.MiListaProductosService.sendMailProductos(this.ExtractoAtermino.value).subscribe(
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
          LogMisProductosData.IdOperacion = 49;
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
      (result) => {
        result.forEach((element : any) => {
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

  ConsultarAterminoExtracto() {
    var yearInicial = Number($(".yearInit_Ahorro").val());
    var yearFinal = Number($(".yearEnd_Ahorro").val());
    var MesInicial = Number($(".MesInit_Ahorro").val());
    var MesFinal = Number($(".MesEnd_Ahorro").val());
    var selExtracto = $(".SelectedExtracto_Ahorro").val();

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
      let data = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
      this.ExtractoAtermino.get("yearInit")?.setValue(yearInicial);
      this.ExtractoAtermino.get("yearEnd")?.setValue(yearFinal);
      this.ExtractoAtermino.get("MesInit")?.setValue(MesInicial);
      this.ExtractoAtermino.get("MesEnd")?.setValue(MesFinal);
      this.ExtractoAtermino.get("Usuario")?.setValue(dataLocalStorage.Usuario);
      this.ExtractoAtermino.get("Oficina")?.setValue(dataLocalStorage.Oficina);

      this.loading.show();
      this.MiListaProductosService.getExtracto(
        this.ExtractoAtermino.value
      ).subscribe(
        (result) => {
          this.loading.hide();
          this.MapearEncabezadoTabla(result, 3);
          //#region Guarda log
          let data = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
          var LogMisProductosData = new LogMisProductos();
          var nuevoItem = new DatosProductos();
          LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
          LogMisProductosData.IdModulo = 69;
          LogMisProductosData.IdOperacion = 49;
          LogMisProductosData.IdOpcion = 3; // Extrato
          LogMisProductosData.IdTercero = this.terceroId;
          LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
          LogMisProductosData.IdCuenta = this.idCuenta;
          nuevoItem.NumeroCuenta = this.ExtractoAtermino.get("NumeroCuenta")?.value;
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

  ConsultarDisponibles() {
    this.SelectionExtOrMov =
      this.ExtractoDisponible.get("MovExtSelector")?.value;
    var FechaInicio = $("#fechainicioDispo").val();
    var FechaFin = $("#fechaFinalDispo").val();
    this.fechaInicioC = FechaInicio;
    this.fechaFinC = FechaFin;
    var fecha = new Date();
    this.today = fecha;
    if (FechaInicio == "") {
      this.InicioVacida = true;
      this.ExtractoDisponibleDtos.length = 0;
      this.MovimientoDisponibleDtos.length = 0;
    } else if (FechaFin == "") {
      this.FinVacida = true;
      this.InicioVacida = false;
      this.ExtractoDisponibleDtos.length = 0;
      this.MovimientoDisponibleDtos.length = 0;
    } else if (this.SelectionExtOrMov == "-") {
      this.SelectErroneo = true;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FechaMenorMayor = false;
      this.ExtractoDisponibleDtos.length = 0;
      this.MovimientoDisponibleDtos.length = 0;
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
      this.ExtractoDisponibleDtos.length = 0;
      this.MovimientoDisponibleDtos.length = 0;
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
      this.ExtractoDisponibleDtos.length = 0;
      this.MovimientoDisponibleDtos.length = 0;
    } else {
      this.FechaMayorAmenor = false;
      this.SelectErroneo = false;
      this.inicioNoValida = false;
      this.finNoValida = false;
      this.FinVacida = false;
      this.InicioVacida = false;
      if (
        this.SelectionExtOrMov == 2 &&
        FechaInicio != null &&
        FechaFin != null
      ) {
        this.ExtractoDisponible.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtractoDisponible.get("FechaFin")?.setValue(FechaFin);
        this.loading.show();
        this.MiListaProductosService.getExtracto(
          this.ExtractoDisponible.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            this.MapearEncabezadoTabla(result, 1);
            //#region Guarda log
            let data = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 49;
            LogMisProductosData.IdOpcion = 3; // Extrato
            LogMisProductosData.IdTercero = this.terceroId;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            LogMisProductosData.IdCuenta = this.idCuenta;
            nuevoItem.NumeroCuenta = this.ExtractoDisponible.get("NumeroCuenta")?.value;
            nuevoItem.FechaInicial =  FechaInicio != null ? FechaInicio.toString() : "";
            nuevoItem.FechaFinal = FechaFin != null ? FechaFin.toString() : "";
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
        this.ExtractoDisponible.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtractoDisponible.get("FechaFin")?.setValue(FechaFin);
        this.loading.show();
        this.MiListaProductosService.getMovimiento(
          this.ExtractoDisponible.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            this.MapearEncabezadoTablaMov(result, 1);
            //#region Guarda log
            let data = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 49;
            LogMisProductosData.IdOpcion = 2; //Movimiento
            LogMisProductosData.IdTercero = this.terceroId;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            LogMisProductosData.IdCuenta = this.idCuenta;
            nuevoItem.NumeroCuenta = this.ExtractoDisponible.get("NumeroCuenta")?.value;
            nuevoItem.FechaInicial = FechaInicio != null ? FechaInicio.toString() : "";
            nuevoItem.FechaFinal = FechaFin != null ? FechaFin.toString() : "";
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

  ConsultarAtermino() {
    this.SelectionExtOrMov = this.ExtractoAtermino.get("MovExtSelector")?.value;
    var FechaInicio = $("#fechaInicioAtermino").val();
    var FechaFin = $("#FechaFinalAtermino").val();
    this.fechaInicioC = FechaInicio;
    this.fechaFinC = FechaFin;
    var fecha = new Date();
    this.today = fecha;

    if (FechaInicio == "") {
      this.InicioVacida = true;
      this.ExtractosAtermino.length = 0;
      this.MovimientoAtermino.length = 0;
    } else if (FechaFin == "") {
      this.FinVacida = true;
      this.InicioVacida = false;
      this.ExtractosAtermino.length = 0;
      this.MovimientoAtermino.length = 0;
    } else if (this.SelectionExtOrMov == "-") {
      this.SelectErroneo = true;
      this.FechaMayorAmenor = false;
      this.InicioVacida = false;
      this.FechaMenorMayor = false;
      this.ExtractosAtermino.length = 0;
      this.MovimientoAtermino.length = 0;
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
      this.ExtractosAtermino.length = 0;
      this.MovimientoAtermino.length = 0;
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
      this.ExtractosAtermino.length = 0;
      this.MovimientoAtermino.length = 0;
    } else {
      this.FechaMayorAmenor = false;
      this.SelectErroneo = false;
      this.inicioNoValida = false;
      this.finNoValida = false;
      this.FinVacida = false;
      this.InicioVacida = false;
      if (
        this.SelectionExtOrMov == 2 &&
        FechaInicio != null &&
        FechaFin != null
      ) {
        this.ExtractoAtermino.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtractoAtermino.get("FechaFin")?.setValue(FechaFin);
        this.loading.show();
        this.MiListaProductosService.getExtracto(
          this.ExtractoAtermino.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            this.MapearEncabezadoTabla(result, 3);
            //#region Guarda log
            let data = localStorage.getItem("Data");
      var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 49;
            LogMisProductosData.IdOpcion = 3; // Extrato
            LogMisProductosData.IdTercero = this.terceroId;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            LogMisProductosData.IdCuenta = this.idCuenta;
            nuevoItem.NumeroCuenta = this.ExtractoAtermino.get("NumeroCuenta")?.value;
            nuevoItem.FechaInicial = FechaInicio != null ? FechaInicio.toString() : "";
            nuevoItem.FechaFinal = FechaFin != null ? FechaFin.toString() : "";
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
        this.ExtractoAtermino.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtractoAtermino.get("FechaFin")?.setValue(FechaFin);
        this.loading.show();
        this.MiListaProductosService.getMovimiento(
          this.ExtractoAtermino.value
        ).subscribe(
          (result) => {
            this.loading.hide();
            this.MapearEncabezadoTablaMov(result, 3);
            //#region Guarda log
            let data = localStorage.getItem("Data");
            var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 49;
            LogMisProductosData.IdOpcion = 2; // Movimiento
            LogMisProductosData.IdTercero = this.terceroId;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            LogMisProductosData.IdCuenta = this.idCuenta;
            nuevoItem.NumeroCuenta = this.ExtractoAtermino.get("NumeroCuenta")?.value;
            nuevoItem.FechaInicial = FechaInicio != null ? FechaInicio.toString() : "";
            nuevoItem.FechaFinal = FechaFin != null ? FechaFin.toString() : "";
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

  MapearEncabezadoTablaMov(datos : any, pdfTipo : any) {
    this.TipoAlerta = datos.TipoAlerta;

    if (this.TipoAlerta == "3") {
      $("#extractosDtos").hide();
      $("#movimientosDtos").hide();
      $("#extractosDtosDisponible").hide();
      $("#movimientosDtosDisponible").hide();
      $("#MovimientoAterminoId").hide();
      $("#extractosDtosAtermino").hide();
      $("#pdf").hide();
      $("#xlsx").hide();
      this.HabilitaMensate = 1;
      this.Movimientos.length = 0;
      this.MovimientoDisponibleDtos.length = 0;
      this.MovimientoAtermino.length = 0;
    } else {
      this.loading.show();
      if (pdfTipo == 1) {
        $("#movimientosDtosDisponible").show();
        this.MiListaProductosService.GenerarPDFMovimientoAportes(
          this.ExtractoDisponible.value
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
            document.getElementById("movimientosDtosDisponible")?.setAttribute("data", url);
            document.getElementById("movimientosDtosDisponible")?.setAttribute("name", "Movimientos");
            // document.getElementById("movimientosDtosDisponible").type = "application/pdf";
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.MovimientoDisponibleDtos = datos.DescribeMovimiento;
      } else if (pdfTipo == 2) {
        $("#movimientosDtos").show();
        this.MiListaProductosService.GenerarPdfMovimientoContractual(
          this.ExtactoAportes.value
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
            document.getElementById("movimientosDtos")?.setAttribute("data", url);
            document.getElementById("movimientosDtos")?.setAttribute("name", "Extracto");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.Movimientos = datos.DescribeMovimiento;
      } else if (pdfTipo == 3) {
        $("#MovimientoAterminoId").show();
        this.MiListaProductosService.GenerarPdfMvtoAtermino(
          this.ExtractoAtermino.value
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
            document.getElementById("MovimientoAterminoId")?.setAttribute("data", url);
            document.getElementById("MovimientoAterminoId")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.MovimientoAtermino = datos.DescribeMovimiento;
      }

      $("#pdf").show();
      $("#xlsx").show();
      this.HabilitaMensate = 0;
      this.NoRegistros = 1;
      this.Extractos.length = 0;
      this.ExtractoDisponibleDtos.length = 0;
      this.ExtractosAtermino.length = 0;

      this.NombrePersonaExtracto = datos.Nombre;
      this.NumeroDocumento = datos.NumeroDocumento;
      this.Cuenta = datos.Cuenta;
      this.oficinaMatricula = datos.oficinaMatricula;
      this.telOficina = datos.TelefonoOfice;
      this.FechasMovimientos = datos.FechasMovimientos;
      this.DescripcionProducto = datos.DescripcionProducto;
      this.estado = datos.estado;
      this.NumeroTitulo = datos.NumeroTitulo;
      this.TipoAlerta = datos.TipoAlerta;
    }
  }

  MapearEncabezadoTabla(datos : any, tipoPdf : number) {
    this.TipoAlerta = datos.TipoAlerta;
    if (this.TipoAlerta == "3") {
      $("#extractosDtos").hide();
      $("#extractosDtosDisponible").hide();
      $("#movimientosDtosDisponible").hide();
      $("#movimientosDtos").hide();
      $("#MovimientoAterminoId").hide();
      $("#extractosDtosAtermino").hide();
      $("#pdf").hide();
      $("#xlsx").hide();
      $(".rangoFechas").show();
      this.HabilitaMensate = 1;
      this.Extractos.length = 0;
      this.ExtractoDisponibleDtos.length = 0;
      this.ExtractosAtermino.length = 0;
    } else {
      this.HabilitaMensate = 0;
      this.NoRegistros = 1;
      this.loading.show();
      if (tipoPdf == 1) {
        $("#extractosDtosDisponible").show();
        this.MiListaProductosService.GenerarPdfAhorroDisponible(
          this.ExtractoDisponible.value
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
            document.getElementById("extractosDtosDisponible")?.setAttribute("data", url);
            document.getElementById("extractosDtosDisponible")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.ExtractoDisponibleDtos = datos.DescribeExtracto;
      } else if (tipoPdf == 2) {
        $("#extractosDtos").show();
        this.MiListaProductosService.GenerarPdfAhorro(
          this.ExtactoAportes.value
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
            document.getElementById("extractosDtos")?.setAttribute("data", url);
            document.getElementById("extractosDtos")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.Extractos = datos.DescribeExtracto;
      } else if (tipoPdf == 3) {
        $("#extractosDtosAtermino").show();
        this.MiListaProductosService.GenerarPdfAhorrTermino(
          this.ExtractoAtermino.value
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
            document.getElementById("extractosDtosAtermino")?.setAttribute("data", url);
            document.getElementById("extractosDtosAtermino")?.setAttribute("name", "movimiento");
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          }
        );
        this.ExtractosAtermino = datos.DescribeExtracto;
      }

      $("#pdf").show();
      $("#xlsx").show();
      $(".rangoFechas").show();
      this.Movimientos.length = 0;
      this.MovimientoDisponibleDtos.length = 0;
      this.MovimientoAtermino.length = 0;

      this.NombrePersonaExtracto = datos.Nombre;
      this.NumeroDocumento = datos.NumeroDocumento;
      this.Cuenta = datos.Cuenta;
      this.oficinaMatricula = datos.oficinaMatricula;
      this.FechasMovimientos = datos.FechasMovimientos;
      this.DescripcionProducto = datos.DescripcionProducto;
      this.estado = datos.estado;
      this.telOficina = datos.telefonoOfice;
      this.resumenExtracto = datos.resumenTables;

      this.resumenExtracto.forEach((element) => {
        this.saldoInicio_ = element.SaldoAnterior;
        this.Consignaciones_ = element.Consignaciones;
        this.RetirosyND_ = element.RetirosyND;
        this.Intereses_ = element.Intereses;
        this.NumeroTitulo = datos.NumeroTitulo;
        this.SaldoFinal_ = element.SaldoFinal;
        this.SaldoInicial = element.Inicial;
        this.RetenconFnte = element.RetencionFte;
      });
    }
  }

  Limpiar(value?:number) {
    this.ExtactoAportes.get("MovExtSelector")?.setValue("-");
    $("#fechainicio_").val("");
    $("#fechaFinal_").val("");
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.FinVacida = false;
    this.InicioVacida = false;
    this.HabilitaMensate = 0;
    this.valueFechaFinal = "";
    this.valueFechaInicial = "";
    this.FechaMenorMayor = false;
    if (value == 1) {
      this.ConsultaYears();
      setTimeout(() => {
        this.seleccioneTodo();
        this.validaAnoInicial = false;
        this.validaAnoFinal = false;
        this.validaMesInicial = false;
        this.validaMesFinal = false;
        $(".SelectedExtracto_Ahorro").prop('selectedIndex', 2);
      }, 500);
    }

  }
  LimpiarDisponible(value?:number) {
    this.ExtractoDisponibleDtos.length = 0;
    this.MovimientoDisponibleDtos.length = 0;
    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.InicioVacida = false;
    this.FinVacida = false;
    this.valueFechaFinal = "";
    this.valueFechaInicial = "";
    this.FechaMenorMayor = false;
    this.ExtractoDisponible.get("MovExtSelector")?.setValue("-");
    $("#fechainicioDispo").val("");
    $("#fechaFinalDispo").val("");
    //limpiar mes y año inicial
    if (value == 1) {
      this.ConsultaYears();
      setTimeout(() => {
        this.seleccioneTodo();
        this.validaAnoInicial = false;
        this.validaAnoFinal = false;
        this.validaMesInicial = false;
        this.validaMesFinal = false;
        $(".SelectedExtracto_Ahorro").prop('selectedIndex', 2);

      }, 500);

    }


    //fin
  }

  LimpiarAtermino() {
    this.ExtractosAtermino.length = 0;
    this.MovimientoAtermino.length = 0;
    this.ExtractoAtermino.get("MovExtSelector")?.setValue("-");
    $("#fechaInicioAtermino").val("");
    $("#FechaFinalAtermino").val("");
    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.FinVacida = false;
    this.InicioVacida = false;
    this.valueFechaFinal = "";
    this.valueFechaInicial = "";
    this.FechaMenorMayor = false;
    //limpiar mes y año inicial
    this.seleccioneTodo();
    this.validaAnoInicial = false;
    this.validaAnoFinal = false;
    this.validaMesInicial = false;
    this.validaMesFinal = false;
  }

  generarPDFDisponible() {
    var select1 = Number($(".SelectedMovimiento_Ahorro").val());
    if (select1 == 1) {
      //pdf movimiento
      this.loading.show();
      this.MiListaProductosService.GenerarPDFMovimientoAportes(
        this.ExtractoDisponible.value
      ).subscribe(
        (result) => {
          this.loading.hide();
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Movimiento_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
    var select = Number($(".SelectedExtracto_Ahorro").val());
    if (select == 2) {
      //pdf Extracto
      this.loading.show();

      this.MiListaProductosService.GenerarPdfAhorroDisponible(
        this.ExtractoDisponible.value
      ).subscribe(
        (result) => {
          this.loading.hide();

          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();

          console.log(error);
        }
      );
    }
  }


  generarPDFTermino() {
    var select1 = Number($(".SelectedMovimiento_Ahorro").val());
    if (select1 == 1) {
      //pdf movimiento
      this.loading.show();
      this.MiListaProductosService.GenerarPdfMvtoAtermino(
        this.ExtractoAtermino.value
      ).subscribe(
        (result) => {
          this.loading.hide();
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Movimiento_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
    var select = Number($(".SelectedExtracto_Ahorro").val());
    if (select== 2) {
      //pdf Extracto
      this.loading.show();

      this.MiListaProductosService.GenerarPdfAhorrTermino(
        this.ExtractoAtermino.value
      ).subscribe(
        (result) => {
          this.loading.hide();

          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();

          console.log(error);
        }
      );
    }
  }

  generarPDF() {
    var select1 = Number($(".SelectedMovimiento_Ahorro").val());
    if (select1 == 1) {
      //pdf movimiento
      this.loading.show();
      this.MiListaProductosService.GenerarPdfMovimientoContractual(
        this.ExtactoAportes.value
      ).subscribe(
        (result) => {
          this.loading.hide();
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Movimiento_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
    var select = Number($(".SelectedExtracto_Ahorro").val());
    if (select == 2) {
      //pdf Extracto
      this.loading.show();
      this.MiListaProductosService.GenerarPdfAhorro(
        this.ExtactoAportes.value
      ).subscribe(
        (result) => {
          this.loading.hide();
          var baseg4 = result.FileStream;
          const linkSource = `data:application/pdf;base64,${baseg4._buffer}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();

          console.log(error);
        }
      );
    }
  }

  generarEXCELDisponible(): void {
    var select1 = Number($(".SelectedMovimiento_Ahorro").val());
    if (select1 == 1) {
      this.loading.show();
      this.MiListaProductosService.GenerarXlsMovimientosContractuales(
        this.ExtractoDisponible.value
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
    var sel = Number($(".SelectedExtracto_Ahorro").val());
    if (sel == 2) {
      this.loading.show();
      this.MiListaProductosService.GenerarXlsxAhorroDisponible(
        this.ExtractoDisponible.value
      ).subscribe(
        (result) => {
          this.loading.hide();
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
  }

  generarEXCELAhoTermino(): void {
    var select1 = Number($(".SelectedMovimiento_Ahorro").val());
    if (select1 == 1) {
      this.loading.show();
      this.MiListaProductosService.GenerarXlsMovimientosContractuales(
        this.ExtractoAtermino.value
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
    var select = Number($(".SelectedExtracto_Ahorro").val());
    if (select== 2) {
      this.loading.show();
      this.MiListaProductosService.GenerarXlsxAhorroTermino(
        this.ExtractoAtermino.value
      ).subscribe(
        (result) => {
          this.loading.hide();
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
  }

  generarEXCEL(): void {
    var select1 = Number($(".SelectedMovimiento_Ahorro").val());
    if (select1 == 1) {
      this.loading.show();
      this.MiListaProductosService.GenerarXlsMovimientosContractuales(
        this.ExtactoAportes.value
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
    var select = Number($(".SelectedExtracto_Ahorro").val());
    if (select == 2) {
      this.loading.show();
      this.MiListaProductosService.GenerarXlsxAhorro(
        this.ExtactoAportes.value
      ).subscribe(
        (result) => {
          this.loading.hide();
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "Extracto_" + this.NumeroDocumento + ".xlsx";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        }
      );
    }
  }

  CambiarColor(fil: number, producto : number) {
    if (producto === 1) {

      $(".filAho_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filAho_" + fil).css("background", "#e5e5e5");
      $(".strCuentaAho_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".strCuentaAho_" + fil).css("background", "#e5e5e5");

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
    }
  }

  cambiarColorRenovacion(fil : number) {
    $(".filRenovacAt_" + this.ColorRenovacion).css("background", "#FFFFFF");
    $(".filRenovacAt_" + fil).css("background", "#e5e5e5");
    this.ColorRenovacion = fil;
  }

  cambiarColorAutorizados(fil : number) {
    $(".filAutoriAt_" + this.ColorBeneficiario).css("background", "#FFFFFF");
    $(".filAutoriAt_" + fil).css("background", "#e5e5e5");
    this.ColorBeneficiario = fil;
  }

  cambiarColorAutBenef(fil : number) {
    $(".filAutoriAtBen_" + this.ColorAutorizado).css("background", "#FFFFFF");
    $(".filAutoriAtBen_" + fil).css("background", "#e5e5e5");
    this.ColorAutorizado = fil;
  }

  setLogMisProductos(LogMisProductos_: LogMisProductos) {
    this.MiListaProductosService.setLogMisProductos(LogMisProductos_).subscribe(
      result => {

      },
      error => {
        // console.log(error);
      }
    )
  }



  private returnFormatNum(num : string): string {
    num = num.toString();
    num = num.slice(0, num.indexOf(".") + 4);
    return num;
  }

  ValidarOperaciones(operaciones : any[])  {
    operaciones.forEach((element) => {
      if (element.IdOperaciones == 59) {
        // detalle ahorro
        this.mostrarDetalle = true;
      }
      // if (element.IdOperaciones == 58) { // detalle aportes
      //   this.mostrarTabAhorros = true;
      // }
      // if (element.IdOperaciones == 60) { // detalle cartera
      //   this.mostrarTabAhorros = true;
      // }
      // if (element.IdOperaciones == 63) { // detalle otro
      //   this.mostrarTabAhorros = true;
      // }
      // if (element.IdOperaciones == 62) { // detalle radicado
      //   this.mostrarTabAhorros = true;
      // }
      // if (element.IdOperaciones == 61) { // detalle seguro
      //   this.mostrarTabAhorros = true;
      // }
      if (element.IdOperaciones == 65) {
        // extracto ahorro
        this.mostraExtracto = true;
      }
      // if (element.IdOperaciones == 64) { // extracto aporte
      //   this.mostrarTabAhorros = true;
      // }
      // if (element.IdOperaciones == 66) { // extracto cartera
      //   this.mostrarTabAhorros = true;
      // }
      // if (element.IdOperaciones == 69) { // extracto otros
      //   this.mostrarTabAhorros = true;
      // }
      // if (element.IdOperaciones == 68) { // extracto radicados
      //   this.mostrarTabAhorros = true;
      // }
      // if (element.IdOperaciones == 67) { // extractos seguros
      //   this.mostrarTabAhorros = true;
      // }

      // if (element.IdOperaciones == 70) { // Ver calificaciones
      //   this.mostrarTabAhorros = true;
      // }
      // if (element.IdOperaciones == 71) { // Ver ficha
      //   this.mostrarTabAhorros = true;
      // }
    });
  }
}
