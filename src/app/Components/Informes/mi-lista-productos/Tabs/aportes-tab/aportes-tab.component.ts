import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExcelService } from '../../../../../Services/General/excel.service';
import { MiListaProductosService } from '../../../../../Services/Informes/mi-lista-productos.service';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxLoadingComponent } from 'ngx-loading';
import { DatosProducto,LogMisProductos,DatosProductos,MesxYear }  from "../../../../../Models/Informes/MisProductos/mis-producto.model";
import swal from "sweetalert2";
import { AlertService } from '../../../../../Services/Alert/alert.service';

const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';

@Component({
  selector: "app-aportes-tab",
  templateUrl: "./aportes-tab.component.html",
  styleUrls: ["./aportes-tab.component.css"],
  providers: [ExcelService, MiListaProductosService],
  standalone : false
})
export class AportesTabComponent implements OnInit {
  @ViewChild("pdfTable", { static: false }) pdfTable!: ElementRef;
  @ViewChild("ngxLoading", { static: false })
  ngxLoadingComponent!: NgxLoadingComponent;
  public Extractos: any[] = [];
  public Movimientos: any[] = [];
  public loading = false;
  public validaMail: Boolean = false;
  public valueSlect: any;
  public yearInit: any;
  public yearEnd: any;
  public MesInit: any;
  public MesEnd: any;
  public valueFechaInicial: any;
  public mesxYear: MesxYear[] = [];
  public mesxYearEnd: MesxYear[] = [];
  public DatosAportes = new DatosProducto();
  public valueFechaFinal: any;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public ColorAnterior: any;
  public resumenExtracto: any[] = [];
  public YearsxMes: any[] = [];
  public MostrarDetalleAportes: Boolean = false;
  public MostrarExtractoAportes: Boolean = false;

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
  titulo = "Generar PDF con Angular JS 5";
  public page: number = 0;
  public DataAportes: any[] = [];
  public DataAportesCancelados: any[] = [];
  public aportesForm: any;
  public ExtactoAportes!: FormGroup;
  public dataBeneficiarios: any[] = [];
  public ValidadorCheck: boolean = true;
  public selectedEstado : any;
  public FechaMayorAmenor: Boolean = false;
  public FechaMenorMayor: Boolean = false;
  public consecutivo: any;
  public idCuenta: any;
  public terceroId: any;
  public today: any;
  public SelectErroneo: Boolean = false;
  public InicioVacida: Boolean = false;
  public FinVacida: Boolean = false;
  public NombrePersonaExtracto: any;
  public NumeroDocumento: any;
  public Cuenta: any;
  public ActiveDivExtracto: Boolean = false;
  public ActiveDivMovimiento: Boolean = false;
  public SelectionExtOrMov: any;
  public oficinaMatricula: any;
  public FechasMovimientos: any;
  public DescripcionProducto: any;
  public telOficina: any;
  public estado: any;
  public TipoAlerta: any;
  public saldoInicio_: any;
  public Consignaciones_: any;
  public RetirosyND_: any;
  public Intereses_: any;
  public SaldoFinal_: any;
  public fechaAperturaCuenta: any;
  public fechaAperturaActualDisabled: any;
  public NoRegistros: any = 0;
  public HabilitaMensate: any = 0;
  public fechaFinC: any;
  public fechaInicioC: any;
  public EfectivoCur: any;
  public CangeCur: any;
  public SaldoTotalSum_: any;
  public UltTrans: any;
  public Matricule: any;
  public FechCancela: any;
  public FechRevaloriza: any;
  public inicioNoValida: Boolean = false;
  public finNoValida: Boolean = false;
  public desactiveAcordeonSaldos: Boolean = false;
  public desactiveAcordeonBeneficiarios: Boolean = false;
  public desctiveAcordeonFechas: Boolean = false;
  public RetenconFnte: any;
  public mesInicial: any;
  public yearInicial: any;
  public yearActual: any;
  public linkPdf: any;
  public validaForm: Boolean = false;
  public SeleccionExt: number = 2;

  //variables validan formulario de extracto
  public validaAnoInicial: Boolean = false;
  public validaAnoFinal: Boolean = false;
  public validaMesInicial: Boolean = false;
  public validaMesFinal: Boolean = false;

  constructor(
    private MiListaProductosService: MiListaProductosService,
    private miDatePipe: DatePipe,
    private notificacion: AlertService
  ) {}

  ngOnInit() {
    $(".rangoFechas").hide();
    this.FormAportesTab();
    this.FormExtracto();
    this.selectedEstado = "-";
  }

  opcionSelected(valueSlect : number) {
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.HabilitaMensate = 0;
    this.SeleccionExt = 0;
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



    if (valueSlect == 2) {
      this.SeleccionExt = 2;
      this.SelectErroneo = false;
      this.validaForm = true;
      this.valueSlect = '2';
      setTimeout(() => {
        this.seleccioneTodo();
      }, 500);
      $("#SelectedExtracto_Aportes").prop('selectedIndex', 2);
    } else if (valueSlect.toString() == '-') {
      this.SelectErroneo = true;
      //no hace nada
    } else {
      this.validaForm = false;
      this.SeleccionExt = 1;
      this.SelectErroneo = false;
      this.valueSlect = '1';
      setTimeout(() => {
        $("#SelectedMovimiento_Aportes").prop('selectedIndex', 1);
      }, 300);
    }
    // this.HabilitaMensate = 1;
  }

  seleccioneTodo() {
    $("#yearInit_Aportes").prop('selectedIndex', 0);
    $("#yearEnd_Aportes").prop('selectedIndex', 0);
    $("#MesInit_Aportes").prop('selectedIndex', 0);
    $("#MesEndt_Aportes").prop('selectedIndex', 0);
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

  SendEmail() {
    this.loading = true;
    this.ValidaPlantillaMail();
    setTimeout(() => {
      this.SendMailAportes();
    }, 7000);
  }

  SendMailAportes() {
    if (this.validaMail == true) {
      this.loading = true;
      this.MiListaProductosService.sendMailProductos(this.ExtactoAportes.value).subscribe(
        result => {
          this.loading = false;
          this.Response(result);

          var Tercero = Number($("#TerceroPrincipal").val());
          //#region Guarda log
          let data = localStorage.getItem("Data");
          var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
          var LogMisProductosData = new LogMisProductos();
          var nuevoItem = new DatosProductos();
          LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
          LogMisProductosData.IdModulo = 69;
          LogMisProductosData.IdOperacion = 48;
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

  ConsultarExtracto() {
    var yearInicial = Number($("#yearInit_Aportes").val());
    var yearFinal = Number($("#yearEnd_Aportes").val());
    var MesInicial = Number($("#MesInit_Aportes").val());
    var MesFinal = Number($("#MesEndt_Aportes").val());
    var selExtracto = $("#SelectedExtracto_Aportes").val();

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
      this.loading = true;
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
        this.loading = false;
        this.MapearEncabezadoTabla(result);
        // #region Guarda log
        let data = localStorage.getItem("Data");
        var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
        var LogMisProductosData = new LogMisProductos();
        var nuevoItem = new DatosProductos();
        LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
        LogMisProductosData.IdModulo = 69;
        LogMisProductosData.IdOperacion = 48;
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
        this.loading = false;
        console.log(error);
      }
      );
    }
  }

  MesSelected(mes : string) {
    var AñoFinal = Number($("#yearEnd_Aportes").val());
    var añoInicial = Number($("#yearInit_Aportes").val());
    var mesFinal = $("#MesEndt_Aportes").val();
    if ((Number(mes) > Number(mesFinal)) && añoInicial == AñoFinal) {
      this.validaMesInicial = true;
      this.validaMesFinal = false;
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
      return null;
    }  else {
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }
    return null;
  }

  MesSelectedEnd(mes : string) {
    var mesInicial = $("#MesInit_Aportes").val();
    var AñoFinal = Number($("#yearEnd_Aportes").val());
    var añoInicial = Number($("#yearInit_Aportes").val());
    if ((Number(mes) < Number(mesInicial)) && AñoFinal == añoInicial) {
      this.validaMesFinal = true;
      this.validaMesInicial = false;
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
      return null;
    } else {
      this.validaMesInicial = false;
      this.validaMesFinal = false;
    }
    return null;
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
    var AñoFinal = $("#yearEnd_Aportes").val();
    if (Number(year) > Number(AñoFinal)) {
      this.validaAnoInicial = true;
      this.validaAnoFinal = false;
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
      return null;
    } else {
      this.validaAnoInicial = false;
      this.validaAnoFinal = false;
      setTimeout(() => {
        $("#MesInit_Aportes").prop('selectedIndex', 0);
      }, 400);
    }
    return null;
    // #endregion
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
    var añoInicial = $("#yearInit_Aportes").val();
    //#region validaciones de campo
    if (Number(year) < Number(añoInicial)) {
      this.validaAnoFinal = true;
      this.validaAnoInicial = false;
      this.Extractos.length = 0;
      this.Movimientos.length = 0;
      return null;
    } else {
      this.validaAnoFinal = false;
      this.validaAnoInicial = false;
      setTimeout(() => {
        $("#MesEndt_Aportes").prop('selectedIndex', 0);
      }, 400);
    }
    return null;
  }

  ValidaAcordeon1(value : number) {
    if (value == 1) {
      $(".beneficiarioss").prop("checked", false);
      $(".fechass").prop("checked", false);
      this.desactiveAcordeonSaldos = true;
    }
    if (value == 2) {
      $(".SaldosAportes").prop("checked", false);
      $(".fechass").prop("checked", false);

      this.desactiveAcordeonBeneficiarios = true;
    }
    if (value == 3) {
      $(".SaldosAportes").prop("checked", false);
      $(".beneficiarioss").prop("checked", false);
      this.desctiveAcordeonFechas = true;
    }
  }

  cerrarTodo() {
    if (this.desactiveAcordeonSaldos) {
      $(".SaldosAportes").prop("checked", false);
    }
    if (this.desactiveAcordeonBeneficiarios) {
      $(".beneficiarioss").prop("checked", false);
    }
    if (this.desctiveAcordeonFechas) {
      $(".fechass").prop("checked", false);
    }
  }

  CambiarColor(fil : number, producto : number) {
    if (producto === 1) {

      $(".filApo_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filApo_" + fil).css("background", "#e5e5e5");
      $(".strCuentaApo_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".strCuentaApo_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior = fil;
      // limpia sombreado anterior
    }
  }

  GetAportesActivos(infoCofig : any) {
    this.terceroId = infoCofig;
    this.MiListaProductosService.GetDataAportesActivos(infoCofig).subscribe(
      (result) => {
        console.log(result);
        var posactivos = 0;
        var posCancelados = 0;
        for (var i = 0; i < result.lstAportes.length; i++) {
          if (
            result.lstAportes[i].dtmCancela != "" &&
            result.lstAportes[i].intEstado != 10
          ) {
            this.DataAportesCancelados[posCancelados] = result.lstAportes[i];
            posCancelados++;
          } else if (
            result.lstAportes[i].dtmCancela == null ||
            result.lstAportes[i].dtmCancela == ""
          ) {
            this.DataAportes[posactivos] = result.lstAportes[i];
            posactivos++;
          }
        }
      },
      (error) => {}
    );
  }

  GetAportesInActivos(infoCofig : any) {
    this.MiListaProductosService.GetDataAportesCancelados(infoCofig).subscribe(
      (result) => {
        this.DataAportes = result.lstAportes;
        console.log(this.DataAportes);
      },
      (error) => {}
    );
  }

  DetalleAporte(data : any) {
    //#region Guarda log
    let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
    var LogMisProductosData = new LogMisProductos();
    var nuevoItem = new DatosProductos();
    LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
    LogMisProductosData.IdModulo = 69;
    LogMisProductosData.IdOperacion = 48;
    LogMisProductosData.IdOpcion = 1; // Detalle
    LogMisProductosData.IdTercero = data.lngTercero;
    LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
    LogMisProductosData.IdCuenta = data.lngIdCuenta;
    nuevoItem.NumeroCuenta = data.strCuenta;
    nuevoItem.FechaInicial = "";
    nuevoItem.FechaFinal = "";
    LogMisProductosData.DatosProductos = nuevoItem;
    this.setLogMisProductos(LogMisProductosData);
    // #endregion
    //#region "buscar cuenta de aportes"
    var cuenta = data.strCuenta;
    var cuentaArray = cuenta.split("-");
    var idOficina = cuentaArray[0];
    var idProducto = cuentaArray[1];
    var consecutivo = cuentaArray[2];
    var digito = cuentaArray[3];
    this.MiListaProductosService.getBuscarCuentaAportes(
      idOficina,
      idProducto,
      consecutivo,
      digito
    ).subscribe(
      (result) => {
        this.UltTrans = result.FechaUltimaTrans;
        this.Matricule = result.FechaApertura;
        this.FechRevaloriza = result.FechaRevalorizacion;
        this.FechCancela = result.FechaCancelacion;
      },
      (error) => {
        console.log(error);
      }
    );

    $(".rangoFechas").hide();
    this.aportesForm.get("Cuenta")?.setValue(data.strCuenta);
    this.aportesForm.get("Producto")?.setValue(data.NameProducto);
    this.aportesForm.get("Oficina")?.setValue(data.NameOficina);
    this.aportesForm.get("Estado")?.setValue(data.NameEstado);
    this.EfectivoCur = data.curEfectivo;
    this.CangeCur = data.curCanje;
    this.SaldoTotalSum_ = this.EfectivoCur + this.CangeCur;
    this.aportesForm.get("OperacionPermitida")?.setValue(data.OperaPermitida);
    if (data.intFormaPago === 0) {
      this.aportesForm.get("FormaPago")?.setValue("Caja");
    } else if (data.intFormaPago === 2) {
      this.aportesForm.get("FormaPago")?.setValue("Debito");
    } else if (data.intFormaPago === 2) {
      this.aportesForm.get("FormaPago")?.setValue("Nomina");
    }
    if (data.intAsesor === 2) {
      this.aportesForm.get("Asesor")?.setValue("Coogranada");
    } else {
      this.aportesForm.get("Asesor")?.setValue(data.Asesor);
    }
    if (
      data.AsesorExterno != null &&
      data.AsesorExterno != undefined &&
      data.AsesorExterno != ""
    ) {
      this.MiListaProductosService.ConsultaAsesorExt(
        data.AsesorExterno
      ).subscribe(
        (resultp) => {
          this.aportesForm.get("AsesorExt")?.setValue(resultp);
        },
        (errorp) => {
          console.log(errorp);
        }
      );
    } else {
      this.aportesForm.get("AsesorExt")?.setValue("");
    }

    this.dataBeneficiarios = data.Beneficiarios;

    //#endregion

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

  formatearFecha(fecha: string) {
    const fechaArray: any[] = fecha.split(/[\/\s\:]/g);

    // Pasamos fecha a milisegundos
    const milliseconds = Date.UTC(
      fechaArray[2],
      fechaArray[1] - 1,
      fechaArray[0],
      fechaArray[3],
      fechaArray[4],
      fechaArray[5]
    );

    const fechaFormateada = this.miDatePipe.transform(
      milliseconds,
      "yyyy-MM-dd"
    );

    return `${fechaFormateada} ${fecha.split(/[\s]/g)[1]}`;
  }
  formatearFecha2(fecha: string) {
    const fechaArray: any[] = fecha.split(/[\/\s\:]/g);

    // Pasamos fecha a milisegundos
    const milliseconds = Date.UTC(
      fechaArray[2],
      fechaArray[1] - 1,
      fechaArray[0],
      fechaArray[3],
      fechaArray[4],
      fechaArray[5]
    );

    const fechaFormateada = this.miDatePipe.transform(
      milliseconds,
      "dd-MM-yyyy"
    );

    return `${fechaFormateada} ${fecha.split(/[\s]/g)[1]}`;
  }

  FormAportesTab() {
    const Cuenta = new FormControl("", [Validators.required]);
    const Producto = new FormControl("", []);
    const Oficina = new FormControl("", []);
    const Estado = new FormControl("", []);
    const SalfoEfectivo = new FormControl("", []);
    const SaldoCanje = new FormControl("", []);
    const SaldoTotal = new FormControl("", []);
    const FechaMatricula = new FormControl("", []);
    const FechaUtlTransaccion = new FormControl("", []);
    const FechaRetiro = new FormControl("", []);
    const FechaRevalorizacion = new FormControl("", []);
    const OperacionPermitida = new FormControl("", []);
    const FormaPago = new FormControl("", []);
    const Asesor = new FormControl("", []);
    const AsesorExt = new FormControl("", []);
    const FechaInicio = new FormControl("", []);
    const MovExtSelector = new FormControl("", []);

    this.aportesForm = new FormGroup({
      Cuenta: Cuenta,
      Producto: Producto,
      Estado: Estado,
      Oficina: Oficina,
      SalfoEfectivo: SalfoEfectivo,
      SaldoCanje: SaldoCanje,
      SaldoTotal: SaldoTotal,
      FechaMatricula: FechaMatricula,
      FechaUtlTransaccion: FechaUtlTransaccion,
      FechaRetiro: FechaRetiro,
      FechaRevalorizacion: FechaRevalorizacion,
      OperacionPermitida: OperacionPermitida,
      FormaPago: FormaPago,
      Asesor: Asesor,
      AsesorExt: AsesorExt,
      MovExtSelector: MovExtSelector,
      FechaInicio: FechaInicio,
    });
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
    const NumeroCuenta = new FormControl("", [Validators.required]);
    this.ExtactoAportes = new FormGroup({
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

  //falta validaciones y consultas


  ResetModal() {
    this.HabilitaMensate = 0;
    this.ExtactoAportes.get("MovExtSelector")?.setValue("-");
    this.validaMesFinal = false;
    this.validaMesInicial = false;
    this.validaAnoFinal = false;
    this.validaAnoFinal = false;
    this.validaForm = false;
    this.NoRegistros = 1;
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.FechaMenorMayor = false;
    this.FechaMayorAmenor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.InicioVacida = false;
    this.FinVacida = false;
    this.seleccioneTodo();
  }

  opcionSelectedFechas(value : number) {

    var FechaFin = $("#fechaend").val();
    var FechaInicio = $("#fechaInit").val();

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

  Consultar() {
    this.SelectionExtOrMov = this.ExtactoAportes.get("MovExtSelector")?.value;
    var FechaInicio = $("#fechaInit").val();
    var FechaFin = $("#fechaend").val();
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
    } else if (FechaFin != null &&
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
      this.FechaMenorMayor = false;
      this.InicioVacida = false;
      this.FinVacida = false;
      console.log(this.ExtactoAportes.value);
      if (
        this.SelectionExtOrMov == 2 &&
        FechaInicio != null &&
        FechaFin != null
      ) {
        let data = localStorage.getItem("Data");
        var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
        this.ExtactoAportes.get("FechaInicio")?.setValue(FechaInicio);
        this.ExtactoAportes.get("FechaFin")?.setValue(FechaFin);
        this.loading = true;
        this.MiListaProductosService.getExtracto(
          this.ExtactoAportes.value
        ).subscribe(
          (result) => {
            this.loading = false;
            this.MapearEncabezadoTabla(result);
            //#region Guarda log

            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 48;
            LogMisProductosData.IdOpcion = 3; // Movimiento
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
            this.loading = false;
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
        this.loading = true;
        this.MiListaProductosService.getMovimiento(
          this.ExtactoAportes.value
        ).subscribe(
          (result) => {
            this.loading = false;
            this.MapearEncabezadoTablaMov(result);

            let data = localStorage.getItem("Data");
            var dataLocalStorage = JSON.parse(window.atob(data == null ? "" : data));
            var LogMisProductosData = new LogMisProductos();
            var nuevoItem = new DatosProductos();
            LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
            LogMisProductosData.IdModulo = 69;
            LogMisProductosData.IdOperacion = 48;
            LogMisProductosData.IdOpcion = 2; // Movimiento
            LogMisProductosData.IdTercero = this.terceroId;
            LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
            LogMisProductosData.IdCuenta = this.idCuenta;
            nuevoItem.NumeroCuenta = this.ExtactoAportes.get("NumeroCuenta")?.value;
            nuevoItem.FechaInicial = FechaInicio != null ? FechaInicio.toString() : "" ;
            nuevoItem.FechaFinal = FechaFin != null ? FechaFin.toString() : "";
            LogMisProductosData.DatosProductos = nuevoItem;
            this.setLogMisProductos(LogMisProductosData);

          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );
      }
    }
  }

  generarPDF() {
    var valida1 = Number($("#SelectedMovimiento_Aportes").val());
    if (valida1 == 1) {
      //pdf movimiento
      this.loading = true;
      this.MiListaProductosService.GenerarPDFMovimientoAportes(
        this.ExtactoAportes.value
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
    var valida = Number($("#SelectedExtracto_Aportes").val());
    if (valida == 2) {
      //pdf Extracto
      this.loading = true;
      this.MiListaProductosService.GenerarPdf(
        this.ExtactoAportes.value
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
  generarEXCEL(): void {
    var valida1 = Number($("#SelectedMovimiento_Aportes").val());
    if (valida1 == 1) {
      this.loading = true;
      this.MiListaProductosService.GenerarXlsMovimientos(
        this.ExtactoAportes.value
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
    var valida = Number($("#SelectedExtracto_Aportes").val());
    if (valida == 2) {
      this.loading = true;
      this.MiListaProductosService.GenerarXlsx(
        this.ExtactoAportes.value
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

  MapearEncabezadoTabla(datos : any) {
    this.TipoAlerta = datos.TipoAlerta;
    console.log("este es el tipo de alerta");
    console.log(this.TipoAlerta);
    if (this.TipoAlerta == "3") {
      $("#extractosDtosAporte").hide();
      $("#movimientosDtosAporte").hide();
      $("#pdf").hide();
      $("#xlsx").hide();
      $(".rangoFechas").show();
      this.HabilitaMensate = 1;
      this.Movimientos.length = 0;
      this.Extractos.length = 0;
    } else {
      this.HabilitaMensate = 0;
      this.NoRegistros = 1;
      this.loading = true;

      this.MiListaProductosService.GenerarPdf(
        this.ExtactoAportes.value
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
          this.linkPdf = URL.createObjectURL(newBolb);
          const url = window.URL.createObjectURL(newBolb);
          document.getElementById("extractosDtosAporte")?.setAttribute("data", url);
          document.getElementById("extractosDtosAporte")?.setAttribute("name", "movimiento");
        },
        (error) => {
          this.loading = false;
          console.log(error);
        }
      );
      $("#extractosDtosAporte").show();
      $("#movimientosDtosAporte").show();
      $("#pdf").show();
      $("#xlsx").show();
      $(".rangoFechas").show();
      this.Movimientos.length = 0;
      this.NombrePersonaExtracto = datos.Nombre;
      this.NumeroDocumento = datos.NumeroDocumento;
      this.Cuenta = datos.Cuenta;
      this.oficinaMatricula = datos.oficinaMatricula;
      this.FechasMovimientos = datos.FechasMovimientos;
      this.DescripcionProducto = datos.DescripcionProducto;

      this.telOficina = datos.telefonoOfice;
      this.estado = datos.estado;
      this.Extractos = datos.DescribeExtracto;
      this.resumenExtracto = datos.resumenTables;

      this.resumenExtracto.forEach((element) => {
        this.saldoInicio_ = element.SaldoAnterior;
        this.Consignaciones_ = element.Consignaciones;
        this.RetirosyND_ = element.RetirosyND;
        this.Intereses_ = element.Intereses;
        this.SaldoFinal_ = element.SaldoFinal;
        this.RetenconFnte = element.RetencionFte;
      });
    }
  }

  MapearEncabezadoTablaMov(datos : any) {
    this.TipoAlerta = datos.TipoAlerta;
    console.log("este es el tipo de alerta");
    console.log(this.TipoAlerta);
    if (this.TipoAlerta == "3") {
      $("#extractosDtosAporte").hide();
      $("#movimientosDtosAporte").hide();
      $("#pdf").hide();
      $("#xlsx").hide();
      this.HabilitaMensate = 1;
    } else {
      this.loading = true;
      this.MiListaProductosService.GenerarPDFMovimientoAportes(
        this.ExtactoAportes.value
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
          this.linkPdf = URL.createObjectURL(newBolb);
          const url = window.URL.createObjectURL(newBolb);

          document.getElementById("movimientosDtosAporte")?.setAttribute("data", url);
          document.getElementById("movimientosDtosAporte")?.setAttribute("name", "movimiento");
        },
        (error) => {
          this.loading = false;
          console.log(error);
        }
      );

      $("#extractosDtosAporte").show();
      $("#movimientosDtosAporte").show();
      $("#pdf").show();
      $("#xlsx").show();
      this.HabilitaMensate = 0;
      this.NoRegistros = 1;
      this.Extractos.length = 0;
      this.NombrePersonaExtracto = datos.Nombre;
      this.NumeroDocumento = datos.NumeroDocumento;
      this.Cuenta = datos.Cuenta;
      this.oficinaMatricula = datos.oficinaMatricula;
      this.FechasMovimientos = datos.FechasMovimientos;
      this.DescripcionProducto = datos.DescripcionProducto;
      this.telOficina = datos.TelefonoOfice;
      this.estado = datos.estado;
      this.TipoAlerta = datos.TipoAlerta;

      this.Movimientos = datos.DescribeMovimiento;
    }
  }

  Limpiar(value?:number) {
    this.ExtactoAportes.get("MovExtSelector")?.setValue("-");
    $("#fechaInit").val("");
    $("#fechaend").val("");

    //limpiar mes y año inicial
    if (value == 1) {
      this.ConsultaYears();
      setTimeout(() => {
        this.seleccioneTodo();
        this.validaAnoInicial = false;
        this.validaAnoFinal = false;
        this.validaMesInicial = false;
        this.validaMesFinal = false;
        // $("#SelectedExtracto_Aportes").val('selectedIndex', 2);
      }, 500);
    }


    //fin
    this.HabilitaMensate = 0;
    this.Extractos.length = 0;
    this.Movimientos.length = 0;
    this.FechaMayorAmenor = false;
    this.FechaMenorMayor = false;
    this.SelectErroneo = false;
    this.inicioNoValida = false;
    this.finNoValida = false;
    this.InicioVacida = false;
    this.FinVacida = false;
  }

  DetalleMovimiento(data : any) {
    $(".rangoFechas").hide();
    this.consecutivo = data.lngConsecutivo;
    this.idCuenta = data.lngIdCuenta;
    this.ExtactoAportes.get("IdTercero")?.setValue(this.terceroId);
    this.ExtactoAportes.get("consecutivo")?.setValue(this.consecutivo);
    this.ExtactoAportes.get("NumeroCuenta")?.setValue(data.strCuenta);
    this.ExtactoAportes.get("NombreProducto")?.setValue(data.NameProducto);
    this.ExtactoAportes.get("TipoProducto")?.setValue("Aportes");
    $("#IdTercero_Aportes").val(this.terceroId);
    $("#consecutivo_Aportes").val(this.consecutivo);
    $("#NumeroCuenta_Aportes").val(data.strCuenta);
    this.fechaAperturaCuenta = moment(new Date(data.dtmMatricula)).format('YYYY-MM-DD');
    this.fechaAperturaActualDisabled = moment(new Date()).format('YYYY-MM-DD');
    $("#fechaInit").val(this.fechaAperturaCuenta);
    $("#fechaend").val(this.fechaAperturaActualDisabled);
    this.ConsultaYears();


  }

}
