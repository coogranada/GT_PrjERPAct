import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ExcelService } from '../../../Services/General/excel.service';
import { ClientesGetListService } from '../../../Services/Clientes/clientesGetList.service';
import { RequiredData } from '../../../Models/Generales/RequiredData.model';
import { OficinasService } from '../../../Services/Maestros/oficinas.service';
import { MiListaProductosService } from '../../../Services/Informes/mi-lista-productos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperacionesService } from '../../../Services/Maestros/operaciones.service';
import { AportesTabComponent } from './Tabs/aportes-tab/aportes-tab.component';
import { AhorrosTabComponent } from './Tabs/ahorros-tab/ahorros-tab.component';
import { CarteraTabComponent } from './Tabs/cartera-tab/cartera-tab.component';
import { SegurosTabComponent } from './Tabs/seguros-tab/seguros-tab.component';
import { ConveniosComponent } from './Tabs/convenios/convenios.component';
import { CoodeudorTabComponent } from './Tabs/coodeudor-tab/coodeudor-tab.component';
import { UtilidadesTabComponent } from './Tabs/utilidades-tab/utilidades-tab.component';
import { TotalesModel } from '../../../Models/Productos/General.models';
import { ContabilidadTabComponent } from './Tabs/contabilidad-tab/contabilidad-tab.component';
import { OtrosConpTabComponent } from './Tabs/otros-conp-tab/otros-conp-tab.component'
import { NotificacionesTabComponent } from './Tabs/notificaciones-tab/notificaciones-tab.component'
import { RadicadosComponent } from './Tabs/radicados/radicados.component';
import { GeneralesService } from '../../../Services/Productos/generales.service';
import { formatDate, registerLocaleData } from '@angular/common';
import swal from "sweetalert2";
import { 
  LogMisProductos,
  DatosProductos,
} from "../../../Models/Informes/MisProductos/mis-producto.model";
import { AlertService } from '../../../Services/Alert/alert.service';
import { LoadingService } from '../../../Services/shared/loading.service';

const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';


@Component({
  selector: "app-mi-lista-productos",
  templateUrl: "./mi-lista-productos.component.html",
  styleUrls: ["./mi-lista-productos.component.css"],
  providers: [
    ExcelService,
    ClientesGetListService,
    MiListaProductosService,
    OperacionesService,
    GeneralesService,
  ],
  standalone : false
})
export class MiListaProductosComponent implements OnInit {
  //#region Variables
  public activarBasico = false;
  public activarContacto = false;
  public activarFinanciero = false;
  public activarPatrimonio = false;
  public activarRepLegal = false;
  public activarContactoRep = false;
  public activarAccionista = false;
  public activarReferencias = false;
  public activarEntrevista = false;
  public activarHistorial = false;
  public activarConvenio = false;
  private DataRequired = new RequiredData();
  public tipoDocumento : any;
  public DataRelacion: any;
  public dataOficinas: any;
  public dataEstados: any;
  public misProductosFrom: any;
  public dataEncabezado: any;
  public terceroConsultado: any;
  public validarActivo: any;
  public validaEstadoCuenta: boolean = true;
  public disabledTabs: boolean = true;
  public numDocumento: any;
  public disbaleBusqueda: any = null;
  public disbaleEstadodeCuenta : boolean | null = true;
  dataTercero: any;
  @ViewChild("pdfTable", { static: false }) pdfTable!: ElementRef;
  public USERS = [];
  titulo = "Generar PDF con Angular JS 5";
  public Totales = new TotalesModel();
  //#endregion
  //#region Variables ocultar
  private resultDataStore : any;
  public mostrarTabAportes: boolean = false;
  public mostrarTabAhorros: boolean = false;
  public mostrarTabCartera: boolean = false;
  public mostrarTabCarteratarjetadebito: boolean  = false;
  public mostrarTabSeguros: boolean = false;
  public mostrarTabCodeudor: boolean = false;
  public mostrarTabContabilidad: boolean = false;
  public mostrarTabRadicado: boolean = false;
  public mostrarTabOtros: boolean = false;
  public mostrarTabNotificaciones: boolean = false;
  public mostrarTabUtilidades: boolean = false;
  public mostrarConvenios: boolean = false;
  public mostrarAnalisis: boolean = false;
  public mostrarEstadoCuent: boolean = false;
  public seleccionDatos: boolean  = false;
  public OpcionEstadoCuenta: boolean = false;
  public OpcionAnalisisCuenta: boolean = false;

  private moduloLocal = 69;
  public infoTrue = false;
  public linkPdf: any;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public terceroAny: any;
  public btnLupa = false;
  public btnBorrador = true;
  public arrayExample : any[] = [];
  public dataOperaciones: any;
  //#endregion
  //#region Variables Comunicacion Tabs
  @ViewChild('aportesComponent', { static: false }) aportesComponent!: AportesTabComponent;
  @ViewChild('ahorrosComponent', { static: false }) ahorrosComponent!: AhorrosTabComponent;
  @ViewChild('carteraComponent', { static: false }) carteraComponent!: CarteraTabComponent;
  @ViewChild('segurosComponent', { static: false }) segurosComponent!: SegurosTabComponent;
  @ViewChild('otrosConpComponent', { static: false }) otrosConpComponent!: OtrosConpTabComponent;
  @ViewChild('convenioComponent', { static: false }) convenioComponent!: ConveniosComponent;
  @ViewChild('contabilidadComponent', { static: false }) contabilidadComponent!: ContabilidadTabComponent;
  @ViewChild('notificacionesTabComponent', { static: false }) notificacionesTabComponent!: NotificacionesTabComponent;
  @ViewChild('BuscarAsociados', { static: true }) private BuscarAsociados!: ElementRef;
  @ViewChild("radicadoComponent", { static: false })radicadoComponent!: RadicadosComponent;
  @ViewChild("coodeudorTabComponent", { static: false })coodeudorTabComponent!: CoodeudorTabComponent;
  @ViewChild('utilidadesComponent', { static: false }) utilidadesComponent!: UtilidadesTabComponent;


  //#endregion
  constructor(
    private excelService: ExcelService,
    private clientesGetListService: ClientesGetListService,
    private notif: AlertService,
    private oficinasService: OficinasService,
    private MiListaProductosService: MiListaProductosService,
    private operacionesService: OperacionesService,
    private generalesService: GeneralesService,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    this.IrArriba();
    let datas = localStorage.getItem("Data");
    this.resultDataStore = JSON.parse(window.atob(datas == null ? "" : datas));
    this.arrayExample = [
        {
          IdModulo: this.moduloLocal,
          IdUsuario: this.resultDataStore.IdUsuario,
          IdPerfil: this.resultDataStore.UsuarioPerfil,
        },
      ];
    this.validarActivo = 1;
    this.Totales.TotalAhorros = 0;
    this.Totales.TotalAportes = 0;
    this.Totales.TotalCartera = 0;
    this.Totales.TotalCoodeudor = 0;
    this.Totales.TotalSeguro = 0;
    this.Totales.TotalTarjeta = 0;
    this.GetOperaciones();
    this.validateMisProductos();
    this.GetTipoDocumento();
    this.GetTipoRelacion();
    this.GetOficinas();
    this.GetEstados();
    this.seleccionDatos = true;
    this.misProductosFrom.get("ProductosActivos")?.setValue(true);
    this.misProductosFrom.get("ProductosCancelados")?.setValue(false);

  }

  //#region Metodos de carga

  GetTipoDocumento() {
    const dataDocumento : any[] = [];
    this.clientesGetListService.GetTipoDocumento().subscribe(
      (result : any[]) => {
        result.forEach((element) => {
          if (element.Clase !== 8) {
            dataDocumento.push(element);
          }
        });
        this.tipoDocumento = dataDocumento;
      },
      (error) => {
        const errorMessage = <any>error;
        this.notif.onDanger(
          "Error",
          errorMessage);
        console.log(errorMessage);
      }
    );
  }

  GetTipoRelacion() {
    this.DataRelacion = this.DataRequired.RelacionData;
  }

  GetOficinas() {
    this.oficinasService.getOficinas().subscribe(
      (resultOfi) => {
        this.dataOficinas = resultOfi;
      },
      (error) => {
        this.notif.onDanger(
          "Error",
          error);
        console.error(error);
      }
    );
  }

  GetEstados() {
    this.clientesGetListService.GetEstado().subscribe(
      (result) => {
        this.dataEstados = result;
      },
      (error) => {
        const errorMessage = <any>error;
        this.notif.onDanger(
          "Error",
          errorMessage);
        console.error(errorMessage);
      }
    );
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

  //#endregion

  //#region Metodos Funcionales

  organizarTab(tab : number) {
    this.RemoverActiveTabs();
    switch (tab) {
      case 1:
        this.activarBasico = true;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        this.activarConvenio = false;
        break;
      case 2:
        $("#juridicoTab").removeClass("activar");
        $("#juridicoTab").removeClass("active");
        this.activarBasico = false;
        this.activarContacto = true;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        this.activarConvenio = false;
        break;
      case 3:
        $("#juridicoTab").removeClass("activar");
        $("#juridicoTab").removeClass("active");
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = true;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        this.activarConvenio = false;
        break;
      case 4:
        $("#juridicoTab").removeClass("activar");
        $("#juridicoTab").removeClass("active");
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = true;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        this.activarConvenio = false;
        break;
      case 5:
        $("#juridicoTab").removeClass("activar");
        $("#juridicoTab").removeClass("active");
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = true;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        this.activarConvenio = false;
        break;
      // case 6:
      //   $('#juridicoTab').removeClass('activar');
      //   $('#juridicoTab').removeClass('active');
      //   this.activarBasico = false;
      //   this.activarContacto = false;
      //   this.activarFinanciero = false;
      //   this.activarPatrimonio = false;
      //   this.activarRepLegal = false;
      //   this.activarContactoRep = true;
      //   this.activarAccionista = false;
      //   this.activarReferencias = false;
      //   this.activarEntrevista = false;
      //   this.activarHistorial = false;
      //   break;
      case 7:
        $("#juridicoTab").removeClass("activar");
        $("#juridicoTab").removeClass("active");
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = true;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        this.activarConvenio = false;
        break;
      case 8:
        $("#juridicoTab").removeClass("activar");
        $("#juridicoTab").removeClass("active");
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = true;
        this.activarEntrevista = false;
        this.activarHistorial = false;
        this.activarConvenio = false;
        break;
      case 9:
        $("#juridicoTab").removeClass("activar");
        $("#juridicoTab").removeClass("active");
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = true;
        this.activarHistorial = false;
        this.activarConvenio = false;
        break;
      case 10:
        $("#juridicoTab").removeClass("activar");
        $("#juridicoTab").removeClass("active");
        this.activarBasico = false;
        this.activarContacto = false;
        this.activarFinanciero = false;
        this.activarPatrimonio = false;
        this.activarRepLegal = false;
        this.activarContactoRep = false;
        this.activarAccionista = false;
        this.activarReferencias = false;
        this.activarEntrevista = false;
        this.activarHistorial = true;
        this.activarConvenio = false;
        break;
        case 11:
          $("#juridicoTab").removeClass("activar");
          $("#juridicoTab").removeClass("active");
          this.activarBasico = false;
          this.activarContacto = false;
          this.activarFinanciero = false;
          this.activarPatrimonio = false;
          this.activarRepLegal = false;
          this.activarContactoRep = false;
          this.activarAccionista = false;
          this.activarReferencias = false;
          this.activarEntrevista = false;
          this.activarHistorial = false;
          this.activarConvenio = true;
          break;
    }
  }

  RemoverActiveTabs() {
    $("#contactoTab").removeClass("activar");
    $("#contactoTab").removeClass("active");

    $("#financieroTab").removeClass("activar");
    $("#financieroTab").removeClass("active");

    $("#patrimonioTab").removeClass("activar");
    $("#patrimonioTab").removeClass("active");

    $("#repLegalTab").removeClass("activar");
    $("#repLegalTab").removeClass("active");

    $("#contactoTabRep").removeClass("activar");
    $("#contactoTabRep").removeClass("active");

    $("#accionistasTab").removeClass("activar");
    $("#accionistasTab").removeClass("active");

    $("#referenciaTab").removeClass("activar");
    $("#referenciaTab").removeClass("active");

    $("#entrevistaTab").removeClass("activar");
    $("#entrevistaTab").removeClass("active");

    $("#hitorialTab").removeClass("activar");
    $("#hitorialTab").removeClass("active");

  }

  closedTabSearch() {
    $("#AportesTab").removeClass("activar");
    $("#AportesTab").removeClass("active");
    $("#aportesTab").removeClass("active");

    $("#AhorrosTab").removeClass("activar");
    $("#AhorrosTab").removeClass("active");
    $("#ahorrosTab").removeClass("active");

    $("#CarteraTab").removeClass("activar");
    $("#CarteraTab").removeClass("active");
    $("#carteraTab").removeClass("active");

    $("#SegurosTab").removeClass("activar");
    $("#SegurosTab").removeClass("active");
    $("#segurosTab").removeClass("active");

    $("#CodeudorTab").removeClass("activar");
    $("#CodeudorTab").removeClass("active");
    $("#codeudorTab").removeClass("active");

    $("#RadicadosTab").removeClass("activar");
    $("#RadicadosTab").removeClass("active");
    $("#radicadosTab").removeClass("active");

    $("#ContabilidadTab").removeClass("activar");
    $("#ContabilidadTab").removeClass("active");
    $("#contabilidadTab").removeClass("active");

    $("#Otros-conceptosTab").removeClass("activar");
    $("#Otros-conceptosTab").removeClass("active");
    $("#otros-conceptosTab").removeClass("active");

    $("#NotificacionTab").removeClass("activar");
    $("#NotificacionTab").removeClass("active");
    $("#notificacionTab").removeClass("active");

    $("#UtilidadesTab").removeClass("activar");
    $("#UtilidadesTab").removeClass("active");
    $("#utilidadesTab").removeClass("active");

    $("#ConveniosTab").removeClass("activar");
    $("#ConveniosTab").removeClass("active");
    $("#conveniosTab").removeClass("active");
  }

  generarPDF() {
    var data : any = document.getElementById("pdfTable");
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 495;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save("MYPdf.pdf"); // Generated PDF
    });
  }



  BotonBuscarMisProductos() {
    if (this.misProductosFrom.get("Documento").value !== null
      && this.misProductosFrom.get("Documento").value !== undefined
      && this.misProductosFrom.get("Documento").value !== '') {
      this.ConsultarInformacionAsociado();
    } else if(this.misProductosFrom.get("Nombre").value !== null
    && this.misProductosFrom.get("Nombre").value !== undefined
      && this.misProductosFrom.get("Nombre").value !== '') {
      this.BuscarNaturalAllName();
    }
  }
  handleKeyDown(event: any) {
    if (event.keyCode == 13) {
      this.BotonBuscarMisProductos();
    }
  }


  ConsultarInformacionAsociado() {
    this.ConsultarEncabezado(this.misProductosFrom.get("Documento").value);
    this.disbaleBusqueda = true;
  }

  ConsultarInformacionAsociadopornombre(documento : any) {
    this.misProductosFrom.get("Documento")?.setValue(documento);

    this.ConsultarEncabezado(documento);
    this.disbaleBusqueda = true;
  }

  ConsultarEncabezado(documento : any) {
    if (
      this.misProductosFrom.get("ProductosActivos").value !== "" &&
      this.misProductosFrom.get("ProductosCancelados").value !== ""
    ) {
      if (documento !== "" && documento !== null && documento !== undefined) {
        this.numDocumento = documento;
        this.MiListaProductosService.ObtenerEncabezado(documento).subscribe(
          (resultEnca) => {
            // revisa fecha para actualizar datos
            let FechaActualiza = formatDate(new Date(resultEnca.FechaActualiza), 'yyyy,MM,dd', 'en');
            let fechaHoy = formatDate(new Date(), 'yyyy,MM,dd', 'en');
            var date1: any = new Date(FechaActualiza);
            var date2: any = new Date(fechaHoy);
            var diffDays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));           
            if (diffDays >= 180) {              
              swal.fire({
                title: 'Advertencia',
                text: '',
                html: 'Asociado debe actualizar datos',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Entiendo',
                confirmButtonColor: 'rgb(13,165,80)',
                cancelButtonColor: 'rgb(160,0,87)',
                allowOutsideClick: false,
                allowEscapeKey: false
              }).then((results) => {
                if (results.value) {
                  if (resultEnca.TipoDocumento != null) {
                    this.btnLupa = true;
                    this.btnBorrador = false;
                    this.disbaleBusqueda = true;
                    this.disbaleEstadodeCuenta = null;
                    this.carteraComponent.TipoCliente = resultEnca.Consulta;
                    this.radicadoComponent.TipoCliente = resultEnca.Consulta;
                    // limpia variables de sombreado
                    this.carteraComponent.LimpiarVariables();
                    this.disabledTabs = false;
                    // fin limpia variable de sombreado

                    this.closedTabSearch();
                    this.terceroAny = resultEnca.IdTercero;
                    $("#TerceroPrincipal").val(resultEnca.IdTercero);
                    $("#activosProduct").click();
                    this.aportesComponent.DataAportesCancelados.length = 0;
                    this.aportesComponent.DataAportes.length = 0;
                    this.ahorrosComponent.DataDisponible.length = 0;
                    this.ahorrosComponent.DataDisponibleCancelado.length = 0;
                    this.ahorrosComponent.AutorizadosAhorros.length = 0;
                    this.coodeudorTabComponent.ActivosCodeudores.length = 0;
                    this.coodeudorTabComponent.CanceladosCodeudores.length = 0;
                    this.ahorrosComponent.DataContractualCancelado.length = 0;
                    this.ahorrosComponent.DataContractual.length = 0;
                    this.ahorrosComponent.AutorizadosAhorros.length = 0;
                    this.ahorrosComponent.AutorizadosAhorrosCancelados.length = 0;
                    this.ahorrosComponent.ActivaCargando = true;
                    this.segurosComponent.ActivaCargando = true;
                    this.convenioComponent.ActivaCargando = true;
                    this.coodeudorTabComponent.ActivaCargando = true;
                    this.ahorrosComponent.DataATerminoCancelado.length = 0;
                    this.ahorrosComponent.DataATermino.length = 0;
                    this.notificacionesTabComponent.ListNotificacionesMisPro.length = 0;

                    //resetea tablas de cartera
                    this.carteraComponent.CreditoComercialActivos.length = 0;
                    this.carteraComponent.CreditoConsumoActivos.length = 0;
                    this.carteraComponent.CreditoViviendaActivos.length = 0;
                    this.carteraComponent.MicrocreditoEmpActivos.length = 0;
                    this.carteraComponent.CreditoComercialCancelados.length = 0;
                    this.carteraComponent.CreditoConsumoCancelados.length = 0;
                    this.carteraComponent.CreditoViviendaCancelados.length = 0;
                    this.carteraComponent.MicrocreditoEmpCancelados.length = 0;

                    // this.aportesComponent.HabilitaMensate = 1;
                    // this.ahorrosComponent.validaMostrar = 1;
                    $("#OpcionSe").val("-");
                    $("#anexoSelected").val("-");
                    $("#YearSelected").val("");
                    $("#MesSelected").val("");
                    $("#segundoDiv").hide();
                    $("#primerBotons").show();
                    $("#anexoCertificate").hide();
                    $("#segundoBotons").hide();
                    $("#primerDiv").hide();
                    if (this.ahorrosComponent.ahoDisponiblesA) {
                      $(".ahoDisponibles").prop("checked", false);
                    }
                    if (this.ahorrosComponent.AhoContractualesA) {
                      $(".ahoContractualesA").prop("checked", false);
                    }
                    if (this.ahorrosComponent.ahoAterminoA) {
                      $(".ahoAtermino").prop("checked", false);
                    }
                    if (this.ahorrosComponent.AutorizadosAhorrosA) {
                      $(".autoizaAho").prop("checked", false);
                    }
                    this.segurosComponent.cerrarAcordeon();
                    this.convenioComponent.cerrarTodo();
                    this.terceroConsultado = resultEnca;
                    var data = this.seleccionDatos;
                    // this.ValidarSeleccion(data);
                    // this.ObtenerTotales(resultEnca.IdTercero);
                    this.MappearEncabezado(resultEnca);
                    if (this.seleccionDatos) {
                      this.GetInfoActivos(resultEnca.IdTercero, documento);
                    } else {
                      this.GetInfoActivos(resultEnca.IdTercero, documento);
                    }
                    this.aportesComponent.ExtactoAportes.get(
                      "MovExtSelector"
                    )?.setValue("-");
                    this.aportesComponent.ExtactoAportes.get("FechaInicio")?.reset();
                    this.aportesComponent.ExtactoAportes.get("FechaFin")?.reset();
                    this.aportesComponent.Extractos.length = 0;
                    this.aportesComponent.Movimientos.length = 0;
                    this.aportesComponent.NoRegistros = 1;
                    //this.carteraComponent.DataCarteraActivos.length = 0;
                    //this.carteraComponent.DataCarteraCancelados.length = 0;
                    this.carteraComponent.CreditoComercialActivos.length = 0;
                    this.carteraComponent.CreditoConsumoActivos.length = 0;
                    this.carteraComponent.CreditoViviendaActivos.length = 0;
                    this.carteraComponent.MicrocreditoEmpActivos.length = 0;
                    this.carteraComponent.CreditoComercialCancelados.length = 0;
                    this.carteraComponent.CreditoConsumoCancelados.length = 0;
                    this.carteraComponent.CreditoViviendaCancelados.length = 0;
                    this.carteraComponent.MicrocreditoEmpCancelados.length = 0;
                    this.carteraComponent.CerrarAcordeonesIniciales();


                    this.otrosConpComponent.ListTagOtrosConcep.length = 0



                  } else {
                    this.closedTabSearch();
                    this.aportesComponent.DataAportesCancelados.length = 0;
                    this.aportesComponent.DataAportes.length = 0;
                    //this.carteraComponent.DataCarteraActivos.length = 0;
                    //this.carteraComponent.DataCarteraCancelados.length = 0;
                    this.carteraComponent.CreditoComercialActivos.length = 0;
                    this.carteraComponent.CreditoConsumoActivos.length = 0;
                    this.carteraComponent.CreditoViviendaActivos.length = 0;
                    this.carteraComponent.MicrocreditoEmpActivos.length = 0;
                    this.carteraComponent.CreditoComercialCancelados.length = 0;
                    this.carteraComponent.CreditoConsumoCancelados.length = 0;
                    this.carteraComponent.CreditoViviendaCancelados.length = 0;
                    this.carteraComponent.MicrocreditoEmpCancelados.length = 0;
                    this.carteraComponent.CerrarAcordeonesIniciales();

                    this.ahorrosComponent.DataDisponible.length = 0;
                    this.ahorrosComponent.DataContractualCancelado.length = 0;
                    this.ahorrosComponent.DataContractual.length = 0;
                    this.ahorrosComponent.AutorizadosAhorros.length = 0;
                    this.ahorrosComponent.AutorizadosAhorrosCancelados.length = 0;
                    this.ahorrosComponent.DataDisponibleCancelado.length = 0;
                    this.ahorrosComponent.AutorizadosAhorros.length = 0;
                    this.ahorrosComponent.DataATerminoCancelado.length = 0;
                    this.ahorrosComponent.DataATermino.length = 0;
                    // this.ahorrosComponent.validaMostrar = 1;
                    this.ahorrosComponent.esconderNotRegistros = true;
                    this.coodeudorTabComponent.ActivosCodeudores.length = 0;
                    this.coodeudorTabComponent.CanceladosCodeudores.length = 0;

                    $("#TerceroPrincipal").val(0);
                    $("#OpcionSe").val("-");
                    $("#anexoSelected").val("-");
                    $("#YearSelected").val("");
                    $("#MesSelected").val("");
                    $("#segundoDiv").hide();
                    $("#primerBotons").show();
                    $("#segundoBotons").hide();
                    $("#anexoCertificate").hide();
                    $("#primerDiv").hide();
                    if (this.ahorrosComponent.ahoDisponiblesA) {
                      $(".ahoDisponibles").prop("checked", false);
                    }
                    if (this.ahorrosComponent.AhoContractualesA) {
                      $(".ahoContractualesA").prop("checked", false);
                    }
                    if (this.ahorrosComponent.ahoAterminoA) {
                      $(".ahoAtermino").prop("checked", false);
                    }
                    if (this.ahorrosComponent.AutorizadosAhorrosA) {
                      $(".autoizaAho").prop("checked", false);
                    }
                    this.segurosComponent.cerrarAcordeon();
                    this.convenioComponent.cerrarTodo();
                    this.aportesComponent.ExtactoAportes.get(
                      "MovExtSelector"
                    )?.setValue("-");
                    this.aportesComponent.ExtactoAportes.get("FechaInicio")?.reset();
                    this.aportesComponent.ExtactoAportes.get("FechaFin")?.reset();
                    this.aportesComponent.Extractos.length = 0;
                    this.aportesComponent.Movimientos.length = 0;
                    this.aportesComponent.NoRegistros = 1;
                    this.aportesComponent.DataAportesCancelados.length = 0;
                    this.misProductosFrom.reset();
                    this.misProductosFrom.get("ProductosActivos")?.setValue(true);
                    this.misProductosFrom.get("ProductosCancelados")?.setValue(false);
                    this.misProductosFrom.get("Documento")?.setValue(documento);
                    this.Totales.TotalAhorros = 0;
                    this.Totales.TotalAportes = 0;
                    this.Totales.TotalCartera = 0;
                    this.Totales.TotalCoodeudor = 0;
                    this.Totales.TotalSeguro = 0;
                    this.Totales.TotalTarjeta = 0;
                    this.notif.onWarning("Advertencia", "No se encontró registro.");
                    this.btnLupa = false;
                    this.btnBorrador = true;
                    this.disbaleBusqueda = null;
                    this.disabledTabs = true;
                    this.LimpiarFormulario();
                    this.misProductosFrom.get('Documento')?.reset();
                    this.generalesService.Autofocus('NumeroDocumento');
                  }
                }
              });
            } else{
              if (resultEnca.TipoDocumento != null) {
                this.btnLupa = true;
                this.btnBorrador = false;
                this.disbaleBusqueda = true;
                this.disbaleEstadodeCuenta = null;
                this.carteraComponent.TipoCliente = resultEnca.Consulta;
                this.radicadoComponent.TipoCliente = resultEnca.Consulta;
                // limpia variables de sombreado
                this.carteraComponent.LimpiarVariables();
                this.disabledTabs = false;
                // fin limpia variable de sombreado

                this.closedTabSearch();
                this.terceroAny = resultEnca.IdTercero;
                $("#TerceroPrincipal").val(resultEnca.IdTercero);
                $("#activosProduct").click();
                this.aportesComponent.DataAportesCancelados.length = 0;
                this.aportesComponent.DataAportes.length = 0;
                this.ahorrosComponent.DataDisponible.length = 0;
                this.ahorrosComponent.DataDisponibleCancelado.length = 0;
                this.ahorrosComponent.AutorizadosAhorros.length = 0;
                this.coodeudorTabComponent.ActivosCodeudores.length = 0;
                this.coodeudorTabComponent.CanceladosCodeudores.length = 0;
                this.ahorrosComponent.DataContractualCancelado.length = 0;
                this.ahorrosComponent.DataContractual.length = 0;
                this.ahorrosComponent.AutorizadosAhorros.length = 0;
                this.ahorrosComponent.AutorizadosAhorrosCancelados.length = 0;
                this.ahorrosComponent.ActivaCargando = true;
                this.segurosComponent.ActivaCargando = true;
                this.convenioComponent.ActivaCargando = true;
                this.coodeudorTabComponent.ActivaCargando = true;
                this.ahorrosComponent.DataATerminoCancelado.length = 0;
                this.ahorrosComponent.DataATermino.length = 0;
                this.notificacionesTabComponent.ListNotificacionesMisPro.length = 0;

                //resetea tablas de cartera
                this.carteraComponent.CreditoComercialActivos.length = 0;
                this.carteraComponent.CreditoConsumoActivos.length = 0;
                this.carteraComponent.CreditoViviendaActivos.length = 0;
                this.carteraComponent.MicrocreditoEmpActivos.length = 0;
                this.carteraComponent.CreditoComercialCancelados.length = 0;
                this.carteraComponent.CreditoConsumoCancelados.length = 0;
                this.carteraComponent.CreditoViviendaCancelados.length = 0;
                this.carteraComponent.MicrocreditoEmpCancelados.length = 0;

                // this.aportesComponent.HabilitaMensate = 1;
                // this.ahorrosComponent.validaMostrar = 1;
                $("#OpcionSe").val("-");
                $("#anexoSelected").val("-");
                $("#YearSelected").val("");
                $("#MesSelected").val("");
                $("#segundoDiv").hide();
                $("#primerBotons").show();
                $("#anexoCertificate").hide();
                $("#segundoBotons").hide();
                $("#primerDiv").hide();
                if (this.ahorrosComponent.ahoDisponiblesA) {
                  $(".ahoDisponibles").prop("checked", false);
                }
                if (this.ahorrosComponent.AhoContractualesA) {
                  $(".ahoContractualesA").prop("checked", false);
                }
                if (this.ahorrosComponent.ahoAterminoA) {
                  $(".ahoAtermino").prop("checked", false);
                }
                if (this.ahorrosComponent.AutorizadosAhorrosA) {
                  $(".autoizaAho").prop("checked", false);
                }
                this.segurosComponent.cerrarAcordeon();
                this.convenioComponent.cerrarTodo();
                this.terceroConsultado = resultEnca;
                var data = this.seleccionDatos;
                // this.ValidarSeleccion(data);
                // this.ObtenerTotales(resultEnca.IdTercero);
                this.MappearEncabezado(resultEnca);
                if (this.seleccionDatos) {
                  this.GetInfoActivos(resultEnca.IdTercero, documento);
                } else {
                  this.GetInfoActivos(resultEnca.IdTercero, documento);
                }
                this.aportesComponent.ExtactoAportes.get(
                  "MovExtSelector"
                )?.setValue("-");
                this.aportesComponent.ExtactoAportes.get("FechaInicio")?.reset();
                this.aportesComponent.ExtactoAportes.get("FechaFin")?.reset();
                this.aportesComponent.Extractos.length = 0;
                this.aportesComponent.Movimientos.length = 0;
                this.aportesComponent.NoRegistros = 1;
                //this.carteraComponent.DataCarteraActivos.length = 0;
                //this.carteraComponent.DataCarteraCancelados.length = 0;
                this.carteraComponent.CreditoComercialActivos.length = 0;
                this.carteraComponent.CreditoConsumoActivos.length = 0;
                this.carteraComponent.CreditoViviendaActivos.length = 0;
                this.carteraComponent.MicrocreditoEmpActivos.length = 0;
                this.carteraComponent.CreditoComercialCancelados.length = 0;
                this.carteraComponent.CreditoConsumoCancelados.length = 0;
                this.carteraComponent.CreditoViviendaCancelados.length = 0;
                this.carteraComponent.MicrocreditoEmpCancelados.length = 0;
                this.carteraComponent.CerrarAcordeonesIniciales();


                this.otrosConpComponent.ListTagOtrosConcep.length = 0



              } else {
                this.closedTabSearch();
                this.aportesComponent.DataAportesCancelados.length = 0;
                this.aportesComponent.DataAportes.length = 0;
                //this.carteraComponent.DataCarteraActivos.length = 0;
                //this.carteraComponent.DataCarteraCancelados.length = 0;
                this.carteraComponent.CreditoComercialActivos.length = 0;
                this.carteraComponent.CreditoConsumoActivos.length = 0;
                this.carteraComponent.CreditoViviendaActivos.length = 0;
                this.carteraComponent.MicrocreditoEmpActivos.length = 0;
                this.carteraComponent.CreditoComercialCancelados.length = 0;
                this.carteraComponent.CreditoConsumoCancelados.length = 0;
                this.carteraComponent.CreditoViviendaCancelados.length = 0;
                this.carteraComponent.MicrocreditoEmpCancelados.length = 0;
                this.carteraComponent.CerrarAcordeonesIniciales();

                this.ahorrosComponent.DataDisponible.length = 0;
                this.ahorrosComponent.DataContractualCancelado.length = 0;
                this.ahorrosComponent.DataContractual.length = 0;
                this.ahorrosComponent.AutorizadosAhorros.length = 0;
                this.ahorrosComponent.AutorizadosAhorrosCancelados.length = 0;
                this.ahorrosComponent.DataDisponibleCancelado.length = 0;
                this.ahorrosComponent.AutorizadosAhorros.length = 0;
                this.ahorrosComponent.DataATerminoCancelado.length = 0;
                this.ahorrosComponent.DataATermino.length = 0;
                // this.ahorrosComponent.validaMostrar = 1;
                this.ahorrosComponent.esconderNotRegistros = true;
                this.coodeudorTabComponent.ActivosCodeudores.length = 0;
                this.coodeudorTabComponent.CanceladosCodeudores.length = 0;

                $("#TerceroPrincipal").val(0);
                $("#OpcionSe").val("-");
                $("#anexoSelected").val("-");
                $("#YearSelected").val("");
                $("#MesSelected").val("");
                $("#segundoDiv").hide();
                $("#primerBotons").show();
                $("#segundoBotons").hide();
                $("#anexoCertificate").hide();
                $("#primerDiv").hide();
                if (this.ahorrosComponent.ahoDisponiblesA) {
                  $(".ahoDisponibles").prop("checked", false);
                }
                if (this.ahorrosComponent.AhoContractualesA) {
                  $(".ahoContractualesA").prop("checked", false);
                }
                if (this.ahorrosComponent.ahoAterminoA) {
                  $(".ahoAtermino").prop("checked", false);
                }
                if (this.ahorrosComponent.AutorizadosAhorrosA) {
                  $(".autoizaAho").prop("checked", false);
                }
                this.segurosComponent.cerrarAcordeon();
                this.convenioComponent.cerrarTodo();
                this.aportesComponent.ExtactoAportes.get(
                  "MovExtSelector"
                )?.setValue("-");
                this.aportesComponent.ExtactoAportes.get("FechaInicio")?.reset();
                this.aportesComponent.ExtactoAportes.get("FechaFin")?.reset();
                this.aportesComponent.Extractos.length = 0;
                this.aportesComponent.Movimientos.length = 0;
                this.aportesComponent.NoRegistros = 1;
                this.aportesComponent.DataAportesCancelados.length = 0;
                this.misProductosFrom.reset();
                this.misProductosFrom.get("ProductosActivos")?.setValue(true);
                this.misProductosFrom.get("ProductosCancelados")?.setValue(false);
                this.misProductosFrom.get("Documento")?.setValue(documento);
                this.Totales.TotalAhorros = 0;
                this.Totales.TotalAportes = 0;
                this.Totales.TotalCartera = 0;
                this.Totales.TotalCoodeudor = 0;
                this.Totales.TotalSeguro = 0;
                this.Totales.TotalTarjeta = 0;
                this.notif.onWarning("Advertencia", "No se encontró registro.");
                this.btnLupa = false;
                this.btnBorrador = true;
                this.disbaleBusqueda = null;
                this.disabledTabs = true;
                this.LimpiarFormulario();
                this.misProductosFrom.get('Documento')?.reset();
                this.generalesService.Autofocus('NumeroDocumento');
              }
            } 
          },
          (error) => {
            this.notif.onDanger(
              "Error",
              error);
            console.error(error);
          }
        );
      } else {
        this.closedTabSearch();
        this.notif.onWarning(
          "Advertencia",
          "Debe ingresar un numero de documento.");
        this.disabledTabs = true;
        this.misProductosFrom.reset();
        this.misProductosFrom.get("ProductosActivos")?.setValue(true);
        this.aportesComponent.DataAportesCancelados.length = 0;
        this.aportesComponent.DataAportes.length = 0;
        //this.carteraComponent.DataCarteraActivos.length = 0;
        //this.carteraComponent.DataCarteraCancelados.length = 0;

        this.carteraComponent.CreditoComercialActivos.length = 0;
        this.carteraComponent.CreditoConsumoActivos.length = 0;
        this.carteraComponent.CreditoViviendaActivos.length = 0;
        this.carteraComponent.MicrocreditoEmpActivos.length = 0;
        this.carteraComponent.CreditoComercialCancelados.length = 0;
        this.carteraComponent.CreditoConsumoCancelados.length = 0;
        this.carteraComponent.CreditoViviendaCancelados.length = 0;
        this.carteraComponent.MicrocreditoEmpCancelados.length = 0;
        this.carteraComponent.CerrarAcordeonesIniciales();
        this.ahorrosComponent.DataDisponible.length = 0;
        this.ahorrosComponent.DataDisponibleCancelado.length = 0;
        this.ahorrosComponent.AutorizadosAhorros.length = 0;
        this.ahorrosComponent.DataContractualCancelado.length = 0;
        this.ahorrosComponent.DataATerminoCancelado.length = 0;
        this.ahorrosComponent.DataATermino.length = 0;
        this.ahorrosComponent.AutorizadosAhorros.length = 0;
        this.ahorrosComponent.AutorizadosAhorrosCancelados.length = 0;
        // this.ahorrosComponent.validaMostrar = 1;
        this.coodeudorTabComponent.ActivosCodeudores.length = 0;
        this.coodeudorTabComponent.CanceladosCodeudores.length = 0;
        $("#TerceroPrincipal").val(0);
        $("#OpcionSe").val("-");
        $("#anexoSelected").val("-");
        $("#YearSelected").val("");
        $("#MesSelected").val("");
        $("#segundoDiv").hide();
        $("#primerBotons").show();
        $("#segundoBotons").hide();
        $("#primerDiv").hide();
        $("#anexoCertificate").hide();
        this.ahorrosComponent.esconderNotRegistros = true;
        if (this.ahorrosComponent.ahoDisponiblesA) {
          $(".ahoDisponibles").prop("checked", false);
        }
        if (this.ahorrosComponent.AhoContractualesA) {
          $(".ahoContractualesA").prop("checked", false);
        }
        if (this.ahorrosComponent.ahoAterminoA) {
          $(".ahoAtermino").prop("checked", false);
        }
        if (this.ahorrosComponent.AutorizadosAhorrosA) {
          $(".autoizaAho").prop("checked", false);
        }
        this.segurosComponent.cerrarAcordeon();
        this.convenioComponent.cerrarTodo();

        //validar si muestra o no el cartel de registros dobles mañana
        this.Totales.TotalAhorros = 0;
        this.Totales.TotalAportes = 0;
        this.Totales.TotalCartera = 0;
        this.Totales.TotalCoodeudor = 0;
        this.Totales.TotalSeguro = 0;
        this.Totales.TotalTarjeta = 0;
        this.ahorrosComponent.DataContractual.length = 0;
        this.ahorrosComponent.AutorizadosAhorros.length = 0;
        this.ahorrosComponent.AutorizadosAhorrosCancelados.length = 0;
        this.aportesComponent.ExtactoAportes.get("MovExtSelector")?.setValue(
          "-"
        );
        this.aportesComponent.ExtactoAportes.get("FechaInicio")?.reset();
        this.aportesComponent.ExtactoAportes.get("FechaFin")?.reset();
        this.aportesComponent.Extractos.length = 0;
        this.aportesComponent.Movimientos.length = 0;
        this.aportesComponent.NoRegistros = 1;
      }
    } else {
      this.Totales.TotalAhorros = 0;

      this.Totales.TotalAportes = 0;
      this.Totales.TotalCartera = 0;
      this.Totales.TotalCoodeudor = 0;
      this.Totales.TotalSeguro = 0;
      this.Totales.TotalTarjeta = 0;
      this.notif.onWarning(
        "Advertencia",
        "Debe seleccionar el estado de los productos a consultar.");
    }
  }
  LimpiarFormulario() {
    this.disabledTabs = true;
    const Documento = this.misProductosFrom.get('Documento').value;
    this.closedTabSearch();
    // limpia aportes
    this.aportesComponent.DataAportesCancelados.length = 0;
    this.aportesComponent.DataAportes.length = 0;
    this.aportesComponent.ExtactoAportes.get(
      "MovExtSelector"
    )?.setValue("-");
    this.aportesComponent.ExtactoAportes.get("FechaInicio")?.reset();
    this.aportesComponent.ExtactoAportes.get("FechaFin")?.reset();
    this.aportesComponent.Extractos.length = 0;
    this.aportesComponent.Movimientos.length = 0;
    this.aportesComponent.NoRegistros = 1;
    this.aportesComponent.DataAportesCancelados.length = 0;
    // limpia ahorros
    this.ahorrosComponent.DataDisponible.length = 0;
    this.ahorrosComponent.DataContractualCancelado.length = 0;
    this.ahorrosComponent.DataContractual.length = 0;
    this.ahorrosComponent.AutorizadosAhorros.length = 0;
    this.ahorrosComponent.AutorizadosAhorrosCancelados.length = 0;
    this.ahorrosComponent.DataDisponibleCancelado.length = 0;
    this.ahorrosComponent.AutorizadosAhorros.length = 0;
    this.ahorrosComponent.DataATerminoCancelado.length = 0;
    this.ahorrosComponent.DataATermino.length = 0;
    // this.ahorrosComponent.validaMostrar = 1;
    this.ahorrosComponent.esconderNotRegistros = true;
    if (this.ahorrosComponent.ahoDisponiblesA) {
      $(".ahoDisponibles").prop("checked", false);
    }
    if (this.ahorrosComponent.AhoContractualesA) {
      $(".ahoContractualesA").prop("checked", false);
    }
    if (this.ahorrosComponent.ahoAterminoA) {
      $(".ahoAtermino").prop("checked", false);
    }
    if (this.ahorrosComponent.AutorizadosAhorrosA) {
      $(".autoizaAho").prop("checked", false);
    }
    // limpia cartera
    this.carteraComponent.CreditoComercialActivos.length = 0;
    this.carteraComponent.CreditoConsumoActivos.length = 0;
    this.carteraComponent.CreditoViviendaActivos.length = 0;
    this.carteraComponent.MicrocreditoEmpActivos.length = 0;
    this.carteraComponent.CreditoComercialCancelados.length = 0;
    this.carteraComponent.CreditoConsumoCancelados.length = 0;
    this.carteraComponent.CreditoViviendaCancelados.length = 0;
    this.carteraComponent.MicrocreditoEmpCancelados.length = 0;
    this.carteraComponent.CerrarAcordeonesIniciales();

    // limpia seguros
    this.segurosComponent.cerrarAcordeon();
    this.convenioComponent.cerrarTodo();
    this.convenioComponent.ServicioExequialData.length = 0;
    this.convenioComponent.ServicioExequialCancelado.length = 0;
    this.segurosComponent.DataSeguros.length = 0;
    this.segurosComponent.DataSegurosCancelados.length = 0;
    this.segurosComponent.ConvenioActivo.length = 0;
    this.segurosComponent.SeguroVehiculoCancelado.length = 0;
    this.segurosComponent.ConvenioCancelado.length = 0;
    this.segurosComponent.SeguroVehiculo.length = 0;

    // limpia codeudores
    this.coodeudorTabComponent.ActivosCodeudores.length = 0;
    this.coodeudorTabComponent.CanceladosCodeudores.length = 0;

    // limpia radicados
    this.radicadoComponent.Radicado.length = 0;

    // limpia contabilidad
    this.contabilidadComponent.ListTagContabilidad.length = 0;

    // limpia otras operaciones  PENDIENTE

    // limpia notificaciones
    this.notificacionesTabComponent.ListNotificacionesMisPro.length = 0;



    // Limpia general
    $("#TerceroPrincipal").val(0);
    $("#OpcionSe").val("-");
    $("#anexoSelected").val("-");
    $("#YearSelected").val("");
    $("#MesSelected").val("");
    $("#segundoDiv").hide();
    $("#primerBotons").show();
    $("#segundoBotons").hide();
    $("#anexoCertificate").hide();
    $("#primerDiv").hide();
    this.misProductosFrom.reset();
    this.misProductosFrom.get("ProductosActivos")?.setValue(true);
    this.misProductosFrom.get("ProductosCancelados")?.setValue(false);
    this.misProductosFrom.get("Documento")?.setValue(Documento);
    this.Totales.TotalAhorros = 0;
    this.Totales.TotalAportes = 0;
    this.Totales.TotalCartera = 0;
    this.Totales.TotalCoodeudor = 0;
    this.Totales.TotalSeguro = 0;
    this.Totales.TotalTarjeta = 0;
  }

  LimpiarFormularioBorrador() {
    this.LimpiarFormulario();
    this.misProductosFrom.get('Documento')?.reset();
    this.btnLupa = false;
    this.btnBorrador = true;
    this.disbaleBusqueda = null;
    this.disbaleEstadodeCuenta = true;
    this.generalesService.Autofocus('NumeroDocumento');
    this.convenioComponent.LimpiarRespuestas();
  }


  private GetInfoCancelados(resultEnca: any) {
    //this.aportesComponent.GetAportesInActivos(resultEnca.IdTercero);
    this.ahorrosComponent.GetDisponiblesInActivos(resultEnca.IdTercero);
    this.ahorrosComponent.GetContractualesInActivos(resultEnca.IdTercero);
    this.ahorrosComponent.GetATerminoInActivos(resultEnca.IdTercero);

  }

  private GetInfoActivos(resultEnca: any, NumeroDocumento : any) {
    this.aportesComponent.GetAportesActivos(resultEnca);
    this.ahorrosComponent.GetDisponiblesActivos(resultEnca);
    this.ahorrosComponent.getAutorizados(resultEnca);
    this.ahorrosComponent.setTercero(resultEnca);
    this.segurosComponent.GetSeguros(resultEnca);
    this.convenioComponent.getConvenios(resultEnca);
    this.carteraComponent.SetlngTercero(resultEnca);
    this.carteraComponent.getCartera(resultEnca, NumeroDocumento);
    this.radicadoComponent.GetRadicados(resultEnca);
    this.otrosConpComponent.SetlngTercero(resultEnca);
    this.otrosConpComponent.getOtrosConceptos(resultEnca);
    this.notificacionesTabComponent.SetlngTercero(resultEnca);
    this.notificacionesTabComponent.getNotificaciones(resultEnca);
    this.coodeudorTabComponent.getCodeudores(resultEnca);
    this.contabilidadComponent.SetlngTercero(resultEnca);
    this.contabilidadComponent.getContabilidad(resultEnca);
    this.contabilidadComponent.getContabilidadSubSalud(resultEnca);
    //this.convenioComponent.getLosOlivos(NumeroDocumento);
  }

  ConsultarInfoTabs(tercero : number) {
    this.MiListaProductosService.ObtenerDataTabs(tercero).subscribe(
      (resultTabs) => {
        // this.EnviarInformcionTabs(resultTabs);
      },
      (error) => {
        this.notif.onDanger(
          "Error",
          error);
        console.error(error);
      }
    );
  }

  ValidarSeleccion(data : any) {
    this.convenioComponent.cerrarAcordeon(4);
    this.RemoverActiveTabs();
    if (data === "si" || data == true) {
      this.seleccionDatos = true;
      this.validarActivo = 1;
      this.validaEstadoCuenta = true;
      this.misProductosFrom.get("ProductosActivos")?.setValue(true);
      this.misProductosFrom.get("ProductosCancelados")?.setValue(false);
      this.aportesComponent.ValidadorCheck = true;
      this.ahorrosComponent.ValidadaActivo = true;
      this.convenioComponent.ValidadaActivo = true;
      this.segurosComponent.ValidadaActivo = true;
      this.coodeudorTabComponent.ValidadaActivo = true;
      this.carteraComponent.ValidadorCheck = true;
      this.radicadoComponent.ValidadorCheck = true;

      if (this.terceroAny != null && this.terceroAny != undefined) {
        this.ObtenerTotales(this.terceroAny);
        // var mostrar = this.ahorrosComponent.validaMostrar;
        // if (mostrar != 1) {
          // this.ahorrosComponent.GetDisponiblesActivos(this.terceroAny);
          // this.segurosComponent.GetSeguros(this.terceroAny);
          // this.radicadoComponent.GetRadicados(this.terceroAny);
          // this.coodeudorTabComponent.getCodeudores(this.terceroAny);
          var tercero  = $("#TerceroPrincipal").val();
          var numDoc = $("#NumeroDocumento").val();
          this.GetInfoActivos(tercero,numDoc)
        // }
      }
      this.ahorrosComponent.validaMostrar = 0;
      //
    } else {
      this.validarActivo = 2;
      this.seleccionDatos = false;
      this.validaEstadoCuenta = false;
      this.misProductosFrom.get("ProductosActivos")?.setValue(false);
      this.misProductosFrom.get("ProductosCancelados")?.setValue(true);
      this.aportesComponent.ValidadorCheck = false;
      this.radicadoComponent.ValidadorCheck = false;
      this.ahorrosComponent.ValidadaActivo = false;
      this.carteraComponent.ValidadorCheck = false;
      this.segurosComponent.ValidadaActivo = false;
      this.convenioComponent.ValidadaActivo = false;
      this.coodeudorTabComponent.ValidadaActivo = false;
      if (this.terceroAny != null && this.terceroAny != undefined) {
        this.ObtenerTotales(this.terceroAny);
        var mostrar = this.ahorrosComponent.validaMostrar;
        // if (mostrar != 1) {
          // this.ahorrosComponent.GetDisponiblesActivos(this.terceroAny);
          // this.segurosComponent.GetSeguros(this.terceroAny);
          // this.radicadoComponent.GetRadicados(this.terceroAny);
          // this.coodeudorTabComponent.getCodeudores(this.terceroAny);
          var tercero  = $("#TerceroPrincipal").val();
          var numDoc = $("#NumeroDocumento").val();
          this.GetInfoActivos(tercero,numDoc)
        // }
      }
      this.ahorrosComponent.validaMostrar = 0;
    }
  }

  ObtenerTotales(tercero : string) {
    let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
    console.log("-------------------------LocalStorage-------------------------------")
    console.log(dataLocalStorage)
    console.log("--------------------------------------------------------")
    var idUsuario = dataLocalStorage.IdUsuario;
    var idOficina = dataLocalStorage.NumeroOficina;

    this.MiListaProductosService.GetTotales(
      tercero,
      this.validarActivo,
      this.numDocumento,
      idUsuario,
      idOficina
    ).subscribe(
      (result) => {
        this.Totales.TotalAhorros = result.TotalAhorros;
        this.Totales.TotalAportes = result.TotalAportes;
        this.Totales.TotalCartera = result.TotalCreditos;
        this.Totales.TotalCoodeudor = result.TotalCoodeudor;
        this.Totales.TotalSeguro = result.TotalSeguros;
        this.Totales.TotalTarjeta = result.TotalTarjetaDebito;
      },
      (error) => {

      }
    );
  }

  cerrarModal(){
    this.infoTrue = false;
  }

  ConsultaEstadoCuenta() {

    this.OpcionAnalisisCuenta = false;
    this.OpcionEstadoCuenta = false;
    var Tercero = Number($("#TerceroPrincipal").val());
    // result.dismiss === Swal.DismissReason.cancel  cerrar
    if (this.mostrarEstadoCuent && this.mostrarAnalisis) {
      swal.fire({
        title: 'Seleccione una opción:\n',
        input: "select",
        icon: 'question',
        iconHtml: '?',
        inputOptions: {
          EstadoCuenta: "Estado de cuenta",
          AnalisisCuenta: "Análisis cuenta"
        },
        inputPlaceholder: "--Seleccione--",
        showCancelButton: true,
        confirmButtonColor: "#269051",
        cancelButtonColor: "#852662",
        confirmButtonText: "Generar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value === "EstadoCuenta") {
              this.OpcionEstadoCuenta = true;
              this.OpcionAnalisisCuenta = false;
              this.EstadoCuenta(Tercero.toString());
              swal.close();
            } else if (value === "AnalisisCuenta") {
              this.OpcionAnalisisCuenta = true;
              this.OpcionEstadoCuenta = false;
              this.AnalisisCuenta(Tercero.toString());
              swal.close();
            } else {
              this.notif.onWarning('Advertencia', 'Seleccione una opción valida');
              swal.close();
              // resolve("");
            }
          });
        }
      });
    } else if (this.mostrarEstadoCuent) {
      swal.fire({
        title: 'Seleccione una opción:\n',
        input: "select",
        icon: 'question',
        iconHtml: '?',
        inputOptions: {
          EstadoCuenta: "Estado de cuenta"
        },
        inputPlaceholder: "--Seleccione--",
        showCancelButton: true,
        confirmButtonColor: "#269051",
        cancelButtonColor: "#852662",
        confirmButtonText: "Generar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value === "EstadoCuenta") {
              this.EstadoCuenta(Tercero.toString());
              this.OpcionEstadoCuenta = true;
              this.OpcionAnalisisCuenta = false;
              swal.close();
            }else {
              this.notif.onWarning('Advertencia', 'Seleccione una opción valida');
              swal.close();
              // resolve("");
            }
          });
        }
      });
    } else if (this.mostrarAnalisis) {
      swal.fire({
        title: 'Seleccione una opción:\n',
        input: "select",
        icon: 'question',
        iconHtml: '?',
        inputOptions: {
          AnalisisCuenta: "Análisis Cuenta"
        },
        inputPlaceholder: "--Seleccione--",
        showCancelButton: true,
        confirmButtonColor: "#269051",
        cancelButtonColor: "#852662",
        confirmButtonText: "Generar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value === "AnalisisCuenta") {
              this.OpcionAnalisisCuenta = true;
              this.OpcionEstadoCuenta = false;
              this.AnalisisCuenta(Tercero.toString());
              swal.close();
            } else {
              this.notif.onWarning('Advertencia', 'Seleccione una opción valida');
              swal.close();
            }
          });
        }
      });
    }

  }

  EstadoCuenta(Tercero : string) {
    this.loading.show();
    let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));

        this.MiListaProductosService.GetEstadoCuenta(this.validaEstadoCuenta,Tercero).subscribe(
          result => {
            if (result.EstadoCuenta.length !== 0) {
              this.loading.hide();
              this.infoTrue = result.validaInformacion;
              if (this.infoTrue) {
                // muestra modal
                this.loading.show(); 
                $("#BotonEstadoCuenta").click();
                this.MiListaProductosService.GenerarPDFEstadoCuenta(
                  this.validaEstadoCuenta, Tercero, dataLocalStorage.Oficina
                ).subscribe(
                  (result) => {
                    this.loading.hide();
                    const pdfinBase64 = result.FileStream._buffer;
                    this.linkPdf = pdfinBase64;
                    const byteArray = new Uint8Array(atob(pdfinBase64).split("").map((char) => char.charCodeAt(0)));
                    const newBolb = new Blob([byteArray], { type: "application/pdf" });
                    const url = window.URL.createObjectURL(newBolb);
                    document.getElementById("EsatadoCuenta")?.setAttribute("data", url);
                    document.getElementById("EsatadoCuenta")?.setAttribute("name", "movimiento");
                    //#region Guarda log
                    let datas = localStorage.getItem("Data");
                    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
                    var LogMisProductosData = new LogMisProductos();
                    var nuevoItem = new DatosProductos();
                    LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
                    LogMisProductosData.IdModulo = 69;
                    LogMisProductosData.IdOperacion = 87;
                    LogMisProductosData.IdOpcion = 10; // Estado cuenta 
                    LogMisProductosData.IdTercero = Tercero;
                    LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
                    nuevoItem.FechaInicial = "";
                    nuevoItem.FechaFinal = "";
                    LogMisProductosData.DatosProductos = nuevoItem;
                    this.setLogMisProductos(LogMisProductosData);
                    // #endregion

                  },
                  (error) => {
                    this.loading.hide();
                    console.log(error);
                  }
                );

              } else {
                this.loading.hide();
                this.notif.onWarning('Advertencia', 'No se encontraron productos y/o saldos contables');
              }
            } else {
              this.loading.hide();
              this.notif.onWarning('Advertencia', 'No se encontraron productos y/o saldos contables');
            }
          
          },  
        error => {
          this.loading.hide();
          const errorMessage = <any>error;
          this.notif.onDanger("Error", errorMessage);
        }
    )   

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

  AnalisisCuenta(Tercero : string) {
    this.loading.show();
    let datas = localStorage.getItem("Data");
    var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));

          this.MiListaProductosService.GetAnalisisCuenta(this.validaEstadoCuenta,Tercero).subscribe(
            result => {
              if (result.AnalisisCuentaCartera.length !== 0) {
                this.loading.hide();
                this.infoTrue = result.validaInformacion;
                if (this.infoTrue) {
                  // muestra modal
                  this.loading.show();
                  $("#BotonEstadoCuenta").click();
                  this.MiListaProductosService.GenerarPDFAnalisisCuenta(
                    this.validaEstadoCuenta, Tercero, dataLocalStorage.Oficina
                  ).subscribe(
                    (result) => {
                      this.loading.hide();
                      const pdfinBase64 = result.FileStream._buffer;
                      this.linkPdf = pdfinBase64;
                      const byteArray = new Uint8Array(atob(pdfinBase64).split("").map((char) => char.charCodeAt(0)));
                      const newBolb = new Blob([byteArray], { type: "application/pdf" });
                      const url = window.URL.createObjectURL(newBolb);
                      document.getElementById("EsatadoCuenta")?.setAttribute("data", url);
                      document.getElementById("EsatadoCuenta")?.setAttribute("name", "movimiento");

                      //#region Guarda log
                      let datas = localStorage.getItem("Data");
                     var dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
                      var LogMisProductosData = new LogMisProductos();
                      var nuevoItem = new DatosProductos();
                      LogMisProductosData.IdOficina = parseInt(dataLocalStorage.NumeroOficina);
                      LogMisProductosData.IdModulo = 69;
                      LogMisProductosData.IdOperacion = 72;
                      LogMisProductosData.IdOpcion = 11; // Analisis cuenta 
                      LogMisProductosData.IdTercero = Tercero;
                      LogMisProductosData.IdUsuarioERP = dataLocalStorage.IdUsuario;
                      nuevoItem.FechaInicial = "";
                      nuevoItem.FechaFinal = "";
                      LogMisProductosData.DatosProductos = nuevoItem;
                      this.setLogMisProductos(LogMisProductosData);
                      // #endregion
                    },
                    (error) => {
                      this.loading.hide();
                      console.log(error);
                    }
                  );
                } else {
                  this.loading.hide();
                  this.notif.onWarning('Advertencia', 'No se encontraron productos y/o saldos contables');
                }  
              } else {
                this.loading.hide();
                this.notif.onWarning('Advertencia', 'No se encontraron productos y/o saldos contables');

              }
                     
        },
        error => {
          this.loading.hide();
          const errorMessage = <any>error;
          this.notif.onDanger("Error", errorMessage);
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

  SendEmail(): void {
  this.loading.show();
  const datas = localStorage.getItem("Data");
  const dataLocalStorage = JSON.parse(
    window.atob(datas == null ? "" : datas)  );

  const tercero = Number(
    $("#TerceroPrincipal").val()
  );
  let nombreEstadoCuenta = "";
  let tipoReporte = "";

  if (this.OpcionEstadoCuenta) {

    nombreEstadoCuenta =
      this.validaEstadoCuenta
        ? "ESTADO GENERAL DE CUENTAS ACTIVAS"
        : "ESTADO GENERAL DE CUENTAS CANCELADAS";

    tipoReporte = "EC";

  } else {

    nombreEstadoCuenta =
      this.validaEstadoCuenta
        ? "ANÁLISIS DE CUENTAS ACTIVAS"
        : "ANÁLISIS DE CUENTAS CANCELADAS";

    tipoReporte = "AC";
  }

  this.MiListaProductosService
    .sendMailCartera(
      tercero,
      "Coogranada",
      dataLocalStorage.Oficina,
      nombreEstadoCuenta,
      tipoReporte,
      null,
      null,
      null,
      this.validaEstadoCuenta
    )
    .subscribe(
      result => {
        try {
          this.Response(result);
          //#region Guarda log
          const logMisProductosData =
            new LogMisProductos();

          const nuevoItem =
            new DatosProductos();

          logMisProductosData.IdOficina =
            parseInt(
              dataLocalStorage.NumeroOficina
            );

          logMisProductosData.IdModulo = 69;
          logMisProductosData.IdOperacion = 87;
          logMisProductosData.IdOpcion = 12;
          logMisProductosData.IdTercero = tercero;
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
          html:
            "Ha ocurrido un error enviando el email.",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor:
            "rgb(13,165,80)",
          cancelButtonColor:
            "rgb(160,0,87)",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    );
}


  generarEXCEL(): void {
    this.loading.show();
    var Tercero = Number($("#TerceroPrincipal").val());
    if (this.OpcionEstadoCuenta) {
      this.MiListaProductosService.CenerarXLSXCuentas(
        this.validaEstadoCuenta,Tercero
      ).subscribe(
        (result) => {
          var NumeroDocumento = $("#NumeroDocumento").val();
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "EstadoCuenta_" + NumeroDocumento + ".xlsx";
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
    } else {
      this.MiListaProductosService.CenerarXLSXAnalisisCuentas(
        this.validaEstadoCuenta,Tercero
      ).subscribe(
        (result) => {
          var NumeroDocumento = $("#NumeroDocumento").val();
          var baseg4 = result;
          const linkSource = `data:application/xlsx;base64,${baseg4}`;
          const downloadLink = document.createElement("a");
          const fileName = "AnalisisCuenta_" + NumeroDocumento + ".xlsx";
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



  generarPDFEstadoCuenta() {
    var NumeroDocumento = $("#NumeroDocumento").val();
    const linkSource = `data:application/pdf;base64,${this.linkPdf}`;
    const downloadLink = document.createElement("a");
    var fileName = "";
    if (this.OpcionEstadoCuenta) {
      fileName = "EstadoCuenta_" + NumeroDocumento + ".pdf";
    } else {
      fileName = "AnalisisCuenta_" + NumeroDocumento + ".pdf";
    }
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    this.loading.hide();
    downloadLink.click();
  }

  MappearEncabezado(data : any) {
    this.radicadoComponent.TelefonoAsociado = data.Celular;
    this.misProductosFrom.get("TipoDocumento")?.setValue(data.TipoDocumento);
    this.misProductosFrom.get("TipoRelacion")?.setValue(data.TipoRelacion);
    this.misProductosFrom.get("Estado")?.setValue(data.Estado);
    this.misProductosFrom.get("Oficina")?.setValue(data.Oficina);
    this.misProductosFrom.get("Telefono")?.setValue(data.Telefono);
    this.misProductosFrom.get("Celular")?.setValue(data.Celular);
    this.misProductosFrom.get("Nombre")?.setValue(data.Nombre);
  }

  ValidarOperaciones(operaciones : any[]) {
    $("#MostrarCertificadoSaldos").val(0);
    $("#MostrarCertificadoRetencion").val(0);
    operaciones.forEach((element) => {
       if (element.IdOperaciones == 59) { // detalle ahorro
         this.ahorrosComponent.mostrarDetalleAhorros = true;
      }
      if (element.IdOperaciones == 58) { // detalle aportes
        this.aportesComponent.MostrarDetalleAportes = true;
      }
      if (element.IdOperaciones == 60) { // detalle cartera
        this.carteraComponent.MostrarDetalleCartera = true;
      }
      if (element.IdOperaciones == 63) { // detalle otro
        this.convenioComponent.MostrarDetalleConvenio = true;
      }
      if (element.IdOperaciones == 62) { // detalle radicado
        this.radicadoComponent.MostarDetalleRadicado = true;
      }
      if (element.IdOperaciones == 61) { // detalle seguro
        this.segurosComponent.MostrarDetalleSeguro = true;
      }
      if (element.IdOperaciones == 65) { // extracto ahorro
        this.ahorrosComponent.mostrarExtractoAhorros = true;
      }
      if (element.IdOperaciones == 64) { // extracto aporte
        this.aportesComponent.MostrarExtractoAportes = true;
      }
      if (element.IdOperaciones == 66) { // extracto cartera
        this.carteraComponent.MostrarExtractoCartera = true;
      }
      if (element.IdOperaciones == 69) { // extracto otros
        this.convenioComponent.MostrarExtractoConvenio = true;
      }
      if (element.IdOperaciones == 83) { // resumen radicados
        this.radicadoComponent.MostrarResumenRadicado = true;
      }
      if (element.IdOperaciones == 67) { // extractos seguros
        this.segurosComponent.MostrarExtractoSeguro = true;
      }
      if (element.IdOperaciones == 49) {
        // Tab ahorro
        this.mostrarTabAhorros = true;
      }
      if (element.IdOperaciones == 48) {
        // Tab aportes
        this.mostrarTabAportes = true;
      }
      if (element.IdOperaciones == 50) {
        // Tab cartera
        this.mostrarTabCartera = true;
        this.mostrarTabCarteratarjetadebito = true;
      }
      if (element.IdOperaciones == 52) {
        // Tab codeudor
        this.mostrarTabCodeudor = true;
      }
      if (element.IdOperaciones == 54) {
        // Tab contabilidad
        this.mostrarTabContabilidad = true;
      }
      if (element.IdOperaciones == 56) {
        // Tab notificaciones
        this.mostrarTabNotificaciones = true;
      }
      if (element.IdOperaciones == 55) {
        // Tab otros
        this.mostrarTabOtros = true;
      }
      if (element.IdOperaciones == 53) {
        // Tab radicados
        this.mostrarTabRadicado = true;
      }
      if (element.IdOperaciones == 51) {
        // Tab seguros
        this.mostrarTabSeguros = true;
      }
      if (element.IdOperaciones == 57) {
        // Tab utilidades
        this.mostrarTabUtilidades = true;
      }
      if (element.IdOperaciones == 72) {
        this.mostrarAnalisis = true;
      }

      if(element.IdOperaciones == 87){
        this.mostrarEstadoCuent = true;
      }

      if (element.IdOperaciones == 80) {
        this.mostrarConvenios = true;
      }
      if (element.IdOperaciones == 70) { // Ver calificaciones cartera
        this.carteraComponent.MostrarCalificacionCartera = true;
      }
      if (element.IdOperaciones == 84) { // Ver calificaciones cartera
        this.carteraComponent.MostrarCuentasHijas = true;
      }
      if (element.IdOperaciones == 71) { // Ver calificaciones codeudor
        this.coodeudorTabComponent.MostarResumenCodeudor = true;
      }

      if (element.IdOperaciones == 85) { // cerificado de saldos y retenciones
        this.utilidadesComponent.MostrarCertificadoSaldos = true;
        this.utilidadesComponent.valueSlect = "-";
      }

      if (element.IdOperaciones == 86) { // certificado de retenciones en la fuente
        this.utilidadesComponent.MostrarCertificadoRetencion = true;
        this.utilidadesComponent.valueSlect = "-";
      }



    });
  }

  //#endregion

  //#region Inicializacion
  validateMisProductos() {
    const Documento = new FormControl("", [Validators.required]);

    const TipoDocumento = new FormControl("", []);
    const TipoRelacion = new FormControl("", []);
    const Estado = new FormControl("", []);
    const Oficina = new FormControl("", []);
    const Telefono = new FormControl("", []);
    const Celular = new FormControl("", []);

    const ProductosActivos = new FormControl("", []);
    const ProductosCancelados = new FormControl("", []);
    const Nombre = new FormControl("", []);

    this.misProductosFrom = new FormGroup({
      Documento: Documento,
      Nombre: Nombre,
      TipoDocumento: TipoDocumento,
      TipoRelacion: TipoRelacion,
      Estado: Estado,
      Oficina: Oficina,
      Telefono: Telefono,
      Celular: Celular,
      ProductosActivos: ProductosActivos,
      ProductosCancelados: ProductosCancelados,
    });
  }
  //#endregion

  //Busca por nombre

  BuscarNaturalAllName() {
    this.loading.show();
    const strNombreBusqueda = this.misProductosFrom.get("Nombre").value;
    if (
      strNombreBusqueda === "" ||
      strNombreBusqueda === null ||
      strNombreBusqueda === undefined
    ) {
      //this.disableForm = true;
      this.loading.hide();
    } else {
      this.MiListaProductosService.BuscarNaturalesAllNombre(strNombreBusqueda).subscribe(
        result => {

          if (result.length > 0) {
            this.loading.hide();
            this.dataTercero = result;
            this.BuscarAsociados.nativeElement.click();
            this.btnLupa = true;
            this.btnBorrador = false;
            this.disbaleBusqueda = true;
            this.disbaleEstadodeCuenta = null;

          } else {
            this.loading.hide();
            this.notif.onWarning('Advertencia', 'No se encontró  registro');
            this.btnLupa = false;
            this.btnBorrador = true;
            this.disbaleBusqueda = null;
            this.LimpiarFormulario();
            this.generalesService.Autofocus('Nombre');
          }

        },
        (error) => {
          console.error("ERROR - BuscarNaturalesAllName - " + error);
        }
      );
    }
  }

  limpiarNombre(campo : string) {
    this.misProductosFrom.get(campo)?.reset();
    this.disbaleBusqueda = null;
  }
  limpiarCampoNombre(campo : string) {
    this.misProductosFrom.get(campo)?.reset();
    this.disbaleBusqueda = null;
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
