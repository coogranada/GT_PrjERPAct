import { Estados } from '../../../../../../environments/Estados';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { formatDate, DatePipe } from '@angular/common';
import { DisponiblesService } from '../../../../../Services/Productos/disponible.service';
import { ConfiguracionNotificacion } from '../../../../../../environments/config.noticaciones';
import { OperacionesService } from '../../../../../Services/Maestros/operaciones.service';
import { ModuleValidationService } from '../../../../..//Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map, count } from 'rxjs/operators';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { GeneralesService } from '../../../../../Services/Productos/generales.service';
import moment from "moment";
const ColorPrimario = 'rgb(13,165,80)';
const ColorSecundario = 'rgb(13,165,80,0.7)';
declare var Tiff: any;
declare var $: any;
@Component({
  selector: 'app-disponibles',
  templateUrl: './disponibles.component.html',
  styleUrls: ['./disponibles.component.css'],
  providers: [DisponiblesService, OperacionesService, ModuleValidationService, GeneralesService],
  standalone : false
})
export class DisponiblesComponent implements OnInit {


  @ViewChild('ModalTitulares', { static: false }) private ModalTitulares!: ElementRef;
  @ViewChild('ModalBuscarAsociados', { static: true }) private ModalBuscarAsociados!: ElementRef;
  @ViewChild('ModalAsociados', { static: true }) private ModalAsociados!: ElementRef;
  @ViewChild('ModalAsesores', { static: true }) private ModalAsesores!: ElementRef;
  @ViewChild('ModalAsesoresExterno', { static: true }) private ModalAsesoresExterno!: ElementRef;
  @ViewChild('ModalDisponible', { static: true }) private ModalDisponible!: ElementRef;
  @ViewChild('ModalImagenRegistroFirmas', { static: true }) private ModalImagenRegistroFirmas!: ElementRef;
  @ViewChild('ModalImpresionRegistroFirmas', { static: true }) private ModalImpresionRegistroFirmas!: ElementRef;
  @ViewChild('ModalLineas', { static: true }) private ModalLineas!: ElementRef;
  @ViewChild('ModalCambioEstado', { static: true }) private ModalCambioEstado!: ElementRef;
  @ViewChild('ModalCertificadoCuentaPregunta', { static: true }) private ModalCertificadoCuentaPregunta!: ElementRef;
  @ViewChild('ModalCertificadoCuentaPDF', { static: true }) private ModalCertificadoCuentaPDF!: ElementRef;
  @ViewChild('ModalImpresion', { static: true }) private ModalImpresion!: ElementRef;
  @ViewChild('ModalGarantiasReales', { static: true }) private ModalGarantiasReales!: ElementRef;
  @ViewChild('ModalCancelarCupo', { static: true }) private ModalCancelarCupo!: ElementRef;
  @ViewChild('ModalLibretas', { static: true }) private ModalLibretas!: ElementRef;
  @ViewChild('ModalReglamentoVivienda', { static: true }) private ModalReglamentoVivienda!: ElementRef;


  @ViewChild('tab1', { static: true }) private tab1!: ElementRef;
  @ViewChild('tab2', { static: true }) private tab2!: ElementRef;
  @ViewChild('tab3', { static: true }) private tab3!: ElementRef;
  @ViewChild('tab5', { static: true }) private tab5!: ElementRef;
  @ViewChild('tab6', { static: true }) private tab6!: ElementRef;


  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = ColorPrimario;
  public secondaryColour = ColorSecundario;
  public ColorAnterior: any;

  public datoformaPago : any;
  public datoOperacionPermitida : any;
  public datoAsesorExterno: any = {};
  public DisponibleForm!: FormGroup;
  public DisponibleOperacionFrom!: FormGroup;
  public AsesorFrom!: FormGroup;
  public AdicionarPuntosFrom!: FormGroup;
  public CambioEstadoFrom!: FormGroup;
  public CertificadoFrom!: FormGroup;

  public resultOperaciones : any;
  public resultTitulares : any;
  public resultRelacion : any;
  public resultEstados : any;
  public resultAsociados : any;
  public resultAsesor : any;
  public resultAsesoresExterno : any;
  public resultFormaPago : any;
  public resultProducto : any;
  public resultMedioPago : any;
  public resultMedioPagoOriginal  : any
  public resultConvenioTarjetas : any;
  public resultCanales : any;
  public resultDiaCortePago : any;
  public resultPlazo : any;
  public resultTipoFirma : any;
  public resultOperacionPermitada : any;
  public resultLinea : any;
  public resultPuntosAdicionales : any;
  public resultcargarCanales : any;
  public resultValidaciones : any;
  public resultguardaMedioPago : any;
  public resultGarantia : any;
  public resultInactiveLibretas : any[] = [];
  public resultActiveLibretas : any[] = [];
  public selectedIds: number[] = [];
  public isBtnActivarLibretasDisabled = true;

  public datoCambioEstado : any;
  public datoOficina : any;
  public datoProducto : any;
  public datoConsecutivo : any;
  public datoDigito : any;
  public datoNombreProducto : any;
  public datoMedioPago : any;

  dataCanaleslist: any;
  dataTitulareslist: any;
  dataLibretalist: any;
  dataAsociados: any;
  dataObjet: any;
  dataObjetO: any;
  dataObjetC: any;
  dataObjetLibreta: any;
  dataObjetTarjeta: any;
  dataHistorial: any[] = [];
  dataObjetCd: any[] = [];
  dataObjetR: any[] = [];
  dataModulo : any;
  dataUser : any;
  operacionEscogida = '';
  ArrayCondiciones: any;
  dataAsesor : any;
  dataObservacion: any;
  SaldoCobro : any;
  dataProductos : any;
  isSaving: boolean = false;

  indexCanales : number | null = null;
  indexAutorizado : number | null = null;
  indexGarantia = null;
  DescriTipoFirma = true;
  selectEstado = true;
  inputEstado = false;
  btnGuardar = true;
  btnActualizar = true;
  btnCambiarEstado = false;
  btnRegistroFirma = false;
  btnActualizarAutorizado: boolean = false;
  BloquearDatoAutorizadoBtn2: boolean = false;
  showBtnCanalesActualizar: boolean = false;
  ProductoTarjeta: boolean = false;
  btnActualizarGarantia = true;
  bloquearbtnActalizarGarantia : boolean | null = true;
  btnActualizarCanales = true;
  bloquearbtnCambioEstado = false;
  bloquearbtnActalizar : boolean | null = false;
  bloquearbtnCalcular = false;
  selectOperacionPermitada = true;
  inputOperacionPermitada = false;

  MostrarLibreta = true;
  MostrarTarjeta = true;
  MostrarCupo = true;
  MostrarGarantias = true;
  MostrarDemas = true;

  activaLibreta = false;
  activaTarjeta = false;
  activaCupo = false;
  activaSaldos = false;
  activaAutorizados = false;
  activaHistorial = false;
  activaGarantia = false;

  PagareObligatorio = false;
  TarjetaObligatoria = false;
  ConvenioObligatorio = false;
  PlazoCorteObligatoria = false;

  ExoneradaGmfOld: boolean = false;
  ExentaGmfOld: boolean = false;
  public itemsDataObejct: any[] = [];
  public validar = true;
  public indefinido = undefined;
  public Bloquear = false;
  BloquearDatoAutorizado: boolean = false;
  BloquearExoCobroHasta: Boolean | null = false;
  public BloquearBuscar : boolean | null = false;
  public BloquearBtnRegistroFirma = false;
  public BloquearFormaPago : boolean | null = false;
  public BloquearAsesorExterno : boolean | null = false;
  public BloquearEstado : boolean | null = false;
  public bloquearConsultaCuenta : boolean | null = false;
  public BloquearAsociado : boolean | null = false;
  public BloquaerProducto : boolean | null = false;
  public BloquearMedioPago : boolean | null = false;
  public BloquearCuponInicial : boolean | null = false;
  public BloquearConvenio : boolean | null = false;
  public BloquearNumeroTarjeta : boolean | null = false;
  public BloquearCanales  : boolean | null = false;
  public BloquearPagare  : boolean | null = false;
  public BloquearDiaCortePlazo : boolean | null = false;
  public BloquearLinea  : boolean | null= false;
  public BloquearOperacionPermitida : boolean | null = false;
  public BloquearPuntos  : boolean | null = false;
  public BloquearTimbrarMensaje  : boolean | null = false;
  public BloquearRadicado : boolean | null = false;
  public BloquearGarantiaReal : boolean | null  = false;
  public BloquearGarantia : boolean | null = false;


  public itemsSendRegistro : any = {
    Cuenta: {},
    Ciudad: {},
    FechaApertura: {},
    NombreTitular: {},
    DocumentoTitular: {},
    TelefonoTitular: {},
    NombreAutorizado1: {},
    DocuementoAutorizado1: {},
    TelefoinoAutorizado1: {},
    NombreAutorizado2: {},
    DocuementoAutorizado2: {},
    TelefoinoAutorizado2: {},
    CodicionesAutorizado1: {},
    CodicionesAutorizado2: {},
  };

  cupoAprobadoAnterior: number = 0;
  cuentaPadreAnterior: string = "";
  lineaAnterior: number = 0;
  descripcionLineaAnterior: string = "";
  plazoAnteriror: number = 0;
  checkboxAcordeonCanales: boolean = false;
  listAutorizadoEliminar: any[] = [];
  dataObjetTitulares: any[] = [];
  private CodModulo = 38;
  base64Data: any;
  converted_image: string = "";
  enableBtnActualizar: boolean = false;
  talonario: any = {};
  tarjetaOld: number = 0;
  RadicadoOld: string = "";
  formatDateNow = new DatePipe('en-CO').transform(Date(), 'yyyy/MM/dd');
  FormatDateNow2: string = moment(new Date()).format("YYYY-MM-DD");
  EnableExoneradaGMF: boolean | null = false;
  EnableExentaGMF: boolean | null = false;
  TibrarComentarioOld: boolean = false;
  ExoCobroHastaOld: string | null = null;
  typeExoCobroHasta: string = "text";
  Certificados: any[] = [];
 
  constructor(private DisponiblesServices: DisponiblesService,
    private notif: ToastrService,
    private operacionesService: OperacionesService,
    private generalesService: GeneralesService,
    private moduleValidationService: ModuleValidationService, private el: ElementRef) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })    
    );
    obs.subscribe((resulr) => console.log(resulr));
  }
  ngOnInit() {  
    // console.log(this.formatDateNow)
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.validateForm();
    this.Operaciones();
    this.ObtenerRelacion();
    this.FormaPago();
    this.TipoFirma();
    this.MedioPago();
    this.ConvenioTarjetas();
    this.Canales();
    this.VolverArriba();
    this.ActivarSaldo();  
    $('#select').focus().select();
  }
  ActivarSaldo() {
    this.devolverTab(4);
    this.tab5.nativeElement.click();
    $('#saldos').addClass('activar');
    $('#saldos').addClass('active');
    $('#historial').removeClass('activar');
    $('#historial').removeClass('active');
    $('#autorizados').removeClass('activar');
    $('#autorizados').removeClass('active');
    $('#cupo').removeClass('activar');
    $('#cupo').removeClass('active');
    $('#tarjeta').removeClass('activar');
    $('#tarjeta').removeClass('active');
    $('#libreta').removeClass('activar');
    $('#libreta').removeClass('active');
  }
  BloquearCanalesInputs: boolean = false;
  // INICIO ENCABEZADO
  ValorSeleccionado() {
    this.ImagenTiff = [];
    this.BloquearCanales = false;
    this.BloquearCanalesInputs = false;
    this.enableBtnActualizar = false;
    this.DisponibleForm.controls["Canal"].disable();
    this.DisponibleForm.controls["NumeroOperaciones"].disable();
    this.DisponibleForm.controls["MontoMaximo"].disable();
    this.BloquearAutorizadoTituloInput(1);
    this.btnActualizarAutorizado = false;
    this.BloquearDatoAutorizado = false;
    this.BloquearDatoAutorizadoBtn2 = false;
    this.listAutorizadoEliminar = [];
    this.btnRegistroFirma = false;
    this.btnCambiarEstado = false;
    this.bloquearbtnCambioEstado = false;
    this.btnActualizar = true;
    this.cambioEstadoGenerarPdfBool = false;
    this.BloquearFormaPago = false;
    this.TipoNovedad = "";
    this.bloquearbtnActalizar = false;
    this.checkboxAcordeonCanales = false;
    this.BloquearMedioPago = false;
    this.BloquearCuponInicial = false;
    this.BloquearConvenio = false;
    this.BloquearNumeroTarjeta = false;
    this.BloquearPagare = false;
    this.BloquearDiaCortePlazo = false;
    this.showBtnCanalesActualizar = false;
    this.ListGarantiasRealesAgregadas = [];
    this.AsignarCupo = false;
    this.AsignarCupoLog = {};
    this.EnableExoneradaGMF = false;
    this.EnableExentaGMF = false;
    this.BloquearTimbrarMensaje = false;
    this.BloquearExoCobroHasta = false;
    this.PagareObligatorio = false;
    this.TarjetaObligatoria = false;
    this.ConvenioObligatorio = false;
    this.PlazoCorteObligatoria = false;
    this.typeExoCobroHasta = "text";
    this.resultActiveLibretas = [];
    console.log("Radicado", this.DisponibleForm.get('Radicado')?.value)
    console.log("operacion",this.DisponibleOperacionFrom.get('Codigo')?.value)
    if (this.DisponibleOperacionFrom.get('Codigo')?.value !== '2' && this.DisponibleOperacionFrom.get('Codigo')?.value !== '10' &&
      this.DisponibleOperacionFrom.get('Codigo')?.value !== '40')
      this.BuscarPorCuenta();
    if (this.DisponibleOperacionFrom.get('Codigo')?.value === '2') {          // Buscar
      this.clearFrom();
      this.MedioPago();
      this.resultDiaCortePago = undefined;
      this.resultPlazo = undefined;
      this.BloquearBtnRegistroFirma = false;
      this.generalesService.Autofocus('SelectBuscar');
      this.BloquearBuscar = null;
      this.bloquearConsultaCuenta = null;
      this.MostrarLibreta = true;
      this.MostrarTarjeta = true;
      this.MostrarCupo = true;
      this.MostrarGarantias = true;
      this.MostrarDemas = false;
      this.DescriTipoFirma = true;
      this.selectEstado = true;
      this.inputEstado = false;
      this.selectOperacionPermitada = true;
      this.inputOperacionPermitada = false;
      this.BloquearBuscar = null;
      this.BloquearAsociado = false;
      this.BloquaerProducto = false;
      this.BloquearMedioPago = false;
      this.inputEstado = false;
      this.BloquearAsesorExterno = false;
      this.BloquearRadicado = false;
      this.bloquearbtnActalizar = false;
      this.btnActualizar = true;
      this.btnActualizarCanales = true;
      this.BloquearConvenio = false;
      this.BloquearNumeroTarjeta = false;
      this.BloquearCanales = false;
      this.BloquearPagare = false;
      this.BloquearDiaCortePlazo = false;
      this.BloquearLinea = false;
      this.BloquearOperacionPermitida = false;
      this.BloquearCuponInicial = false;
      this.BloquearPuntos = false;
      this.BloquearGarantiaReal = false;
      this.operacionEscogida = '/Buscar';
      this.devolverTab(4);
      this.tab5.nativeElement.click();
      $('#saldos').addClass('activar');
      $('#saldos').addClass('active');
      $('#historial').removeClass('activar');
      $('#historial').removeClass('active');
      $('#autorizados').removeClass('activar');
      $('#autorizados').removeClass('active');
      $('#cupo').removeClass('activar');
      $('#cupo').removeClass('active');
      $('#tarjeta').removeClass('activar');
      $('#tarjeta').removeClass('active');
      $('#libreta').removeClass('activar');
      $('#libreta').removeClass('active');

    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '21') {  // Cambiar forma de pago
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          const IdTercero = this.DisponibleForm.get('LngTercero')?.value
          this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
            result => {
              const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
              const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

              const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
              const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

              const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);
          
              if (diferenciaEnDias <= 180) { 
                this.generalesService.Autofocus('SelectFormaPago');
                this.BloquearOperacionPermitida = false;
                this.selectOperacionPermitada = true;
                this.inputOperacionPermitada = false;
                this.DescriTipoFirma = true;
                this.BloquearFormaPago = null;
                this.BloquearMedioPago = false;
                this.bloquearConsultaCuenta = false;
                this.inputEstado = false;
                this.selectEstado = true;
                this.btnActualizar = false;
                this.btnActualizarCanales = true;
                this.BloquearAsesorExterno = false;
                this.bloquearbtnActalizar = false;
                this.BloquaerProducto = false;
                this.BloquearAsociado = false;
                this.BloquearConvenio = false;
                this.BloquearNumeroTarjeta = false;
                this.BloquearCanales = false;
                this.BloquearPagare = false;
                this.BloquearDiaCortePlazo = false;
                this.BloquearLinea = false;
                this.BloquearPuntos = false;
                this.BloquearGarantiaReal = false;
                this.BloquearRadicado = false;
                this.FormaPago();
                this.operacionEscogida = '/Cambiar forma de pago';
                this.devolverTab(4);
                this.tab5.nativeElement.click();
                $('#saldos').addClass('activar');
                $('#saldos').addClass('active');
                $('#historial').removeClass('activar');
                $('#historial').removeClass('active');
                $('#autorizados').removeClass('activar');
                $('#autorizados').removeClass('active');
                $('#cupo').removeClass('activar');
                $('#cupo').removeClass('active');
                $('#tarjeta').removeClass('activar');
                $('#tarjeta').removeClass('active');
                $('#libreta').removeClass('activar');
                $('#libreta').removeClass('active');
              } else {
                this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              }
            },
          ); 
        } else {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
        }        
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.', ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      } 
        
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '12') {  // Adicionar y/o eliminar autorizados
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== '') {       
        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          const IdTercero = this.DisponibleForm.get('LngTercero')?.value
          this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
            result => {

              const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
              const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

              const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
              const fechaActualiza = new Date(fechaActualizaString == null ? ""  : fechaActualizaString);

              const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

              if (diferenciaEnDias <= 180) { 
          this.BloquearOperacionPermitida = false;
          this.DescriTipoFirma = true;
          this.inputEstado = false;
          this.selectEstado = true;
          this.BloquearDatoAutorizado = true;
          this.selectOperacionPermitada = true;
          this.inputOperacionPermitada = false;
          this.bloquearConsultaCuenta = false;
          this.BloquearAsesorExterno = false;
          this.btnActualizar = true;
          this.btnActualizarAutorizado = true;
          this.btnActualizarCanales = true;
          this.BloquearMedioPago = false;
          this.BloquaerProducto = false;
          this.BloquearAsociado = false;
          this.BloquearConvenio = false;
          this.BloquearNumeroTarjeta = false;
          this.BloquearCanales = false;
          this.BloquearPagare = false;
          this.BloquearDiaCortePlazo = false;
          this.BloquearLinea = false;
          this.BloquearPuntos = false;
          this.BloquearRadicado = false;
          this.BloquearGarantiaReal = false;
          this.operacionEscogida = '/Adicionar y/o  eliminar autorizados';
          this.devolverTab(5);
          this.tab6.nativeElement.click();
          this.VolverArriba(800);

          this.BloquearAutorizadoTituloInput(2);
          setTimeout(() => {
            this.generalesService.Autofocus('SelectAutorizado');
          }, 800);
          $('#saldos').removeClass('activar');
          $('#saldos').removeClass('active');
          $('#historial').removeClass('activar');
          $('#historial').removeClass('active');
          $('#autorizados').addClass('activar');
          $('#autorizados').addClass('active');
          $('#cupo').removeClass('activar');
          $('#cupo').removeClass('active');
          $('#tarjeta').removeClass('activar');
          $('#tarjeta').removeClass('active');
          $('#libreta').removeClass('activar');
          $('#libreta').removeClass('active');
              } else {
                this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              }
            },
          );       
        } else {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
        }
        
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.', ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }

    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '19') {  // Cambiar asesor externo
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          const IdTercero = this.DisponibleForm.get('LngTercero')?.value
          this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
            result => {

              const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
              const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

              const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
              const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

              const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

              if (diferenciaEnDias <= 180) { 
          this.generalesService.Autofocus('SelectAsesorExterno');
          this.BloquearOperacionPermitida = false;
          this.selectOperacionPermitada = true;
          this.inputOperacionPermitada = false;
          this.DescriTipoFirma = true;
          this.operacionEscogida = '/Cambiar asesor externo';
          this.BloquearAsociado = false;
          this.BloquaerProducto = false;
          this.BloquearEstado = false;
          this.bloquearConsultaCuenta = false;
          this.BloquearBuscar = false;
          this.btnActualizar = false;
          this.btnGuardar = true;
          this.BloquearAsesorExterno = null;
          this.BloquearMedioPago = false;
          this.bloquearbtnActalizar = false;
          this.BloquearRadicado = false;
          this.inputEstado = false;
          this.selectEstado = true;
          this.btnActualizarCanales = true;
          this.BloquearConvenio = false;
          this.BloquearNumeroTarjeta = false;
          this.BloquearCanales = false;
          this.BloquearPagare = false;
          this.BloquearDiaCortePlazo = false;
          this.BloquearLinea = false;
          this.BloquearPuntos = false;
          this.BloquearGarantiaReal = false;
          this.devolverTab(4);
          this.tab5.nativeElement.click();
          $('#saldos').addClass('activar');
          $('#saldos').addClass('active');
          $('#historial').removeClass('activar');
          $('#historial').removeClass('active');
          $('#autorizados').removeClass('activar');
          $('#autorizados').removeClass('active');
          $('#cupo').removeClass('activar');
          $('#cupo').removeClass('active');
          $('#tarjeta').removeClass('activar');
          $('#tarjeta').removeClass('active');
          $('#libreta').removeClass('activar');
          $('#libreta').removeClass('active');
              } else {
                this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              }
            },
          );
        } else {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
        }       
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.',
          ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '9') {   // Cambio de estado
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          const IdTercero = this.DisponibleForm.get('LngTercero')?.value
          this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
            result => {

              const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
              const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

              const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
              const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);
              const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

              if (diferenciaEnDias <= 180) { 
          this.BloquearOperacionPermitida = false;
          this.ObtenerEstado();
          this.selectOperacionPermitada = true;
          this.inputOperacionPermitada = false;
          this.bloquearConsultaCuenta = false;
          this.inputEstado = true;
          this.selectEstado = false;
          this.BloquearEstado = null;
          this.btnCambiarEstado = true;
          this.btnActualizar = true;
          this.btnActualizarCanales = true;
          this.btnGuardar = true;
          this.BloquearAsesorExterno = false;
          this.BloquearMedioPago = false;
          this.bloquearbtnActalizar = false;
          this.BloquearRadicado = false;
          this.DescriTipoFirma = true;
          this.BloquaerProducto = false;
          this.BloquearAsociado = false;
          this.BloquearConvenio = false;
          this.BloquearNumeroTarjeta = false;
          this.BloquearCanales = false;
          this.BloquearPagare = false;
          this.BloquearDiaCortePlazo = false;
          this.BloquearLinea = false;
          this.BloquearPuntos = false;
          this.BloquearGarantiaReal = false;
          this.operacionEscogida = '/ Cambio de estado';
          this.DisponibleForm.get('IdEstado')?.setValue(0);
          this.devolverTab(4);
          this.tab5.nativeElement.click();
          $('#saldos').addClass('activar');
          $('#saldos').addClass('active');
          $('#historial').removeClass('activar');
          $('#historial').removeClass('active');
          $('#autorizados').removeClass('activar');
          $('#autorizados').removeClass('active');
          $('#cupo').removeClass('activar');
          $('#cupo').removeClass('active');
          $('#tarjeta').removeClass('activar');
          $('#tarjeta').removeClass('active');
          $('#libreta').removeClass('activar');
          $('#libreta').removeClass('active');
              } else {
                this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              }
            },
          );
        } else {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
        }       

      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.',ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '10' || this.DisponibleOperacionFrom.get('Codigo')?.value === '40') {  // Apertura de cuenta Mismo titular
      if (this.dataUser.NumeroOficina === '3') {
        this.notif.warning('Advertencia', 'No se puede abrir una cuenta en la oficina de administración.',
          ConfiguracionNotificacion.configRightTop);
        this.BloquearBuscar = false;
        this.bloquearConsultaCuenta = false;
        this.clearFrom();
      } else {
        this.generalesService.Autofocus('SelectDocumento');
        this.clearFrom();
        this.OperacionPermitida();
        this.MapearDatosUsuario();
        this.Encabezado();
        this.BloquearAutorizadoTituloInput(2);
        this.BloquearBtnRegistroFirma = false;
        this.MostrarLibreta = true;
        this.MostrarTarjeta = true;
        this.MostrarCupo = true;
        this.MostrarGarantias = true;
        this.MostrarDemas = false;
        this.BloquearOperacionPermitida = false;
        this.DescriTipoFirma = true;
        this.inputEstado = false;
        this.selectEstado = true;
        this.selectOperacionPermitada = true;
        this.inputOperacionPermitada = false;
        this.BloquearAsociado = null;
        this.BloquearFormaPago = null;
        this.BloquearMedioPago = false;
        this.BloquaerProducto = false;
        this.btnGuardar = false;
        this.BloquearDatoAutorizado = true;
        this.BloquearDatoAutorizadoBtn2 = true;
        const newLocal = this;
        newLocal.BloquearAsesorExterno = null;
        this.BloquearBuscar = false;
        this.BloquearRadicado = false;
        this.bloquearConsultaCuenta = false;
        this.bloquearbtnActalizar = false;
        this.btnActualizarCanales = true;
        this.btnActualizar = true;
        this.BloquearConvenio = false;
        this.BloquearNumeroTarjeta = false;
        this.BloquearCanales = false;
        this.BloquearPagare = false;
        this.BloquearDiaCortePlazo = false;
        this.BloquearLinea = false;
        this.BloquearPuntos = false;
        this.BloquearGarantiaReal = false;
        this.dataObjetTitulares = [];
        if (this.DisponibleOperacionFrom.get('Codigo')?.value == '40') 
          this.operacionEscogida = '/Apertura de cuenta mismo titular';
        else
          this.operacionEscogida = '/Apertura de cuenta';
        this.devolverTab(4);
        this.tab5.nativeElement.click();
        $('#saldos').addClass('activar');
        $('#saldos').addClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
        $('#autorizados').removeClass('activar');
        $('#autorizados').removeClass('active');
        $('#cupo').removeClass('activar');
        $('#cupo').removeClass('active');
        $('#tarjeta').removeClass('activar');
        $('#tarjeta').removeClass('active');
        $('#libreta').removeClass('activar');
        $('#libreta').removeClass('active');
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '32') {  // Cambio de Libreta o Tarjeta
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        const idProducto = this.DisponibleForm.get('IdProducto')?.value;

        this.DisponiblesServices.ValidarDisponibles(idProducto).subscribe(
          result => {
            if (result !== null) {
              this.resultValidaciones = result;

              if (this.resultValidaciones.IdProductoConsecutivo !== null) {

                if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {

                  if (this.DisponibleForm.get('IdMedioPago')?.value == 60 || this.DisponibleForm.get('IdMedioPago')?.value == 70) {
                    this.notif.warning('Advertencia', 'Cuenta sin tarjeta.', ConfiguracionNotificacion.configRightTop);
                    this.DisponibleOperacionFrom.get('Codigo')?.reset();
                    return;
                  }
                  const IdTercero = this.DisponibleForm.get('LngTercero')?.value
                  this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
                    result => {

                      const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
                      const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

                      const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
                      const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

                      const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

                      if (diferenciaEnDias <= 180) {
                        this.BloquearOperacionPermitida = false;
                        this.selectOperacionPermitada = true;
                        this.inputOperacionPermitada = false;
                        this.DescriTipoFirma = true;
                        this.operacionEscogida = '/Cambio de Libreta o Tarjeta';
                        this.BloquearAsociado = false;
                        this.BloquaerProducto = false;
                        this.BloquearEstado = false;
                        this.bloquearConsultaCuenta = false;
                        this.BloquearBuscar = false;
                        this.btnActualizar = false;
                        this.btnGuardar = true;
                        this.BloquearAsesorExterno = false;
                        this.BloquearMedioPago = false;
                        this.bloquearbtnActalizar = false;
                        this.BloquearRadicado = false;
                        this.inputEstado = false;
                        this.selectEstado = true;
                        this.btnActualizarCanales = true;
                        this.BloquearConvenio = false;
                        this.BloquearNumeroTarjeta = false;
                        this.BloquearCanales = false;
                        this.BloquearPagare = false;
                        this.BloquearDiaCortePlazo = false;
                        this.BloquearLinea = false;
                        this.BloquearPuntos = false;
                        this.BloquearGarantiaReal = false;

                        if (this.DisponibleForm.get('IdMedioPago')?.value === 0) {
                          this.BloquearCuponInicial = null;
                          this.BloquearNumeroTarjeta = false;
                          this.devolverTab(1);
                          this.tab1.nativeElement.click();
                          this.VolverArriba(400);
                          $('#saldos').removeClass('activar');
                          $('#saldos').removeClass('active');
                          $('#historial').removeClass('activar');
                          $('#historial').removeClass('active');
                          $('#autorizados').removeClass('activar');
                          $('#autorizados').removeClass('active');
                          $('#cupo').removeClass('activar');
                          $('#cupo').removeClass('active');
                          $('#tarjeta').removeClass('activar');
                          $('#tarjeta').removeClass('active');
                          $('#libreta').addClass('activar');
                          $('#libreta').addClass('active');
                          this.generalesService.Autofocus('SelectLibreta');
                        } else {
                          this.BloquearNumeroTarjeta = null;
                          this.BloquearCuponInicial = null;
                          this.devolverTab(2);
                          this.tab2.nativeElement.click();
                          this.VolverArriba(600);
                          $('#saldos').removeClass('activar');
                          $('#saldos').removeClass('active');
                          $('#historial').removeClass('activar');
                          $('#historial').removeClass('active');
                          $('#autorizados').removeClass('activar');
                          $('#autorizados').removeClass('active');
                          $('#cupo').removeClass('activar');
                          $('#cupo').removeClass('active');
                          $('#tarjeta').addClass('activar');
                          $('#tarjeta').addClass('active');
                          $('#libreta').removeClass('activar');
                          $('#libreta').removeClass('active');
                          this.generalesService.Autofocus('SelectTarjeta');
                        }
                      } else {
                        this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                        this.DisponibleOperacionFrom.get('Codigo')?.reset();
                      }
                    },
                  );
                } else {
                  this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
                  this.DisponibleOperacionFrom.get('Codigo')?.reset();
                }

              } else {
                this.notif.warning('Advertencia', 'Producto no habilitado para cambio de libreta o tarjeta.', ConfiguracionNotificacion.configRightTop);
              }
            }
          },
          error => {
            console.error('Error al validar disponibles:', error);
          }
        );
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.', ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }

    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '33') {  // Correccion de Libreta o Tarjeta
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        const idProducto = this.DisponibleForm.get('IdProducto')?.value;

        this.DisponiblesServices.ValidarDisponibles(idProducto).subscribe(
          result => {
            if (result !== null) {
              this.resultValidaciones = result;

              if (this.resultValidaciones.IdProductoConsecutivo !== null) {

                if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
                  const IdTercero = this.DisponibleForm.get('LngTercero')?.value
                  this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
                    result => {

                      const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
                      const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

                      const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
                      const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

                      const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

                      if (diferenciaEnDias <= 180) {
                        if (this.DisponibleForm.get('IdMedioPago')?.value == 60 || this.DisponibleForm.get('IdMedioPago')?.value == 70) {
                          this.notif.warning('Advertencia', 'Cuenta sin tarjeta.', ConfiguracionNotificacion.configRightTop);
                          this.DisponibleOperacionFrom.get('Codigo')?.reset();
                          return;
                        }
                        this.BloquearOperacionPermitida = false;
                        this.selectOperacionPermitada = true;
                        this.inputOperacionPermitada = false;
                        this.DescriTipoFirma = true;
                        this.operacionEscogida = '/Corrección de Libreta o Tarjeta';
                        this.BloquearAsociado = false;
                        this.BloquaerProducto = false;
                        this.BloquearEstado = false;
                        this.bloquearConsultaCuenta = false;
                        this.BloquearBuscar = false;
                        this.btnActualizar = false;
                        this.BloquearRadicado = false;
                        this.btnGuardar = true;
                        this.BloquearAsesorExterno = false;
                        this.BloquearMedioPago = false;
                        this.bloquearbtnActalizar = false;
                        this.inputEstado = false;
                        this.selectEstado = true;
                        this.btnActualizarCanales = true;
                        this.BloquearConvenio = false;
                        this.BloquearNumeroTarjeta = false;
                        this.BloquearCanales = false;
                        this.BloquearPagare = false;
                        this.BloquearDiaCortePlazo = false;
                        this.BloquearLinea = false;
                        this.BloquearPuntos = false;
                        this.BloquearGarantiaReal = false;

                        if (this.DisponibleForm.get('IdMedioPago')?.value === 0) {
                          this.BloquearCuponInicial = null;
                          this.BloquearNumeroTarjeta = false;
                          this.devolverTab(1);
                          this.tab1.nativeElement.click();
                          this.VolverArriba(400);
                          $('#saldos').removeClass('activar');
                          $('#saldos').removeClass('active');
                          $('#historial').removeClass('activar');
                          $('#historial').removeClass('active');
                          $('#autorizados').removeClass('activar');
                          $('#autorizados').removeClass('active');
                          $('#cupo').removeClass('activar');
                          $('#cupo').removeClass('active');
                          $('#tarjeta').removeClass('activar');
                          $('#tarjeta').removeClass('active');
                          $('#libreta').addClass('activar');
                          $('#libreta').addClass('active');
                          this.generalesService.Autofocus('SelectLibreta');
                        } else {
                          this.BloquearNumeroTarjeta = null;
                          this.BloquearCuponInicial = null;
                          this.devolverTab(2);
                          this.tab2.nativeElement.click();
                          this.VolverArriba(600);
                          $('#saldos').removeClass('activar');
                          $('#saldos').removeClass('active');
                          $('#historial').removeClass('activar');
                          $('#historial').removeClass('active');
                          $('#autorizados').removeClass('activar');
                          $('#autorizados').removeClass('active');
                          $('#cupo').removeClass('activar');
                          $('#cupo').removeClass('active');
                          $('#tarjeta').addClass('activar');
                          $('#tarjeta').addClass('active');
                          $('#libreta').removeClass('activar');
                          $('#libreta').removeClass('active');
                          this.generalesService.Autofocus('SelectTarjeta');
                        }
                      } else {
                        this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                        this.DisponibleOperacionFrom.get('Codigo')?.reset();
                      }
                    },
                  )
                } else {
                  this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
                  this.DisponibleOperacionFrom.get('Codigo')?.reset();
                }
              } else {
                this.notif.warning('Advertencia', 'Producto no habilitado para corrección de libreta o tarjeta.', ConfiguracionNotificacion.configRightTop);
              }
            }
          },
          error => {
            console.error('Error al validar disponibles:', error);
          }
        );
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.', ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }

    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '38') {  // Cambio de medio de pago
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        this.enableBtnActualizar = false;
        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          if (this.DisponibleForm.get('CupoUtilizado')?.value != null && this.DisponibleForm.get('CupoUtilizado')?.value > 0) {
            this.notif.warning('Advertencia', 'No puede usar la operación cambiar medio de pago, primero debe estar el cupo en saldo cero (0).', ConfiguracionNotificacion.configRightTop);
            this.DisponibleOperacionFrom.get('Codigo')?.reset();
            return;
          }
          const IdTercero = this.DisponibleForm.get('LngTercero')?.value
          this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
            result => {
              const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
              const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

              const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
              const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

              const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

              if (diferenciaEnDias <= 180) { 
          this.generalesService.Autofocus('SelectMedioPago');
          this.BloquearOperacionPermitida = false;
          this.selectOperacionPermitada = true;
          this.inputOperacionPermitada = false;
          this.DescriTipoFirma = true;
          this.operacionEscogida = '/Cambio de medio de pago';
          this.BloquearAsociado = false;
          this.BloquaerProducto = false;
          this.BloquearEstado = false;
          this.bloquearConsultaCuenta = false;
          this.BloquearBuscar = false;
          this.btnActualizar = false;
          this.btnGuardar = true;
          this.BloquearAsesorExterno = false;
          this.BloquearMedioPago = null;
          this.bloquearbtnActalizar = false;
          this.inputEstado = false;
          this.selectEstado = true;
          this.btnActualizarCanales = true;
          this.BloquearConvenio = false;
          this.BloquearNumeroTarjeta = false;
          this.BloquearCanales = false;
          this.BloquearPagare = false;
          this.BloquearDiaCortePlazo = false;
          this.BloquearLinea = false;
          this.BloquearPuntos = false;
          this.BloquearGarantiaReal = false;
          this.ValidarDisponibles();// filtra el medio de pago
              } else {
                this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              }
            },
          )
        } else {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
        }
     
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.',ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '34') {  // Asignar cupo
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        const IdTercero = this.DisponibleForm.get('LngTercero')?.value
        this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
          result => {
            const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
            const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

            const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
            const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

            const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

            if (diferenciaEnDias <= 180) { 
        if (this.DisponibleForm.get('CupoUtilizado')?.value != null && this.DisponibleForm.get('CupoUtilizado')?.value > 0) {
          this.notif.warning('Advertencia', ' Cuenta con saldo en cupo utilizado.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
          return;
        }       
        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          if (this.DisponibleForm.get('IdMedioPago')?.value === 50 || this.DisponibleForm.get('IdMedioPago')?.value === 70) {
          this.BloquearOperacionPermitida = false;
          this.selectOperacionPermitada = true;
          this.inputOperacionPermitada = false;
          this.DescriTipoFirma = true;
          this.operacionEscogida = '/Asignar cupo';
          this.Bloquear = false;
          this.BloquearRadicado = null;
          this.BloquearAsociado = false;
          this.BloquaerProducto = false;
          this.BloquearEstado = false;
          this.bloquearConsultaCuenta = false;
          this.BloquearBuscar = false;
          this.btnActualizar = false;
          this.btnGuardar = true;
          this.BloquearAsesorExterno = false;
          this.BloquearMedioPago = false;
          this.bloquearbtnActalizar = false;
          this.inputEstado = false;
          this.selectEstado = true;
          this.btnActualizarCanales = true;
          this.BloquearConvenio = false;
          this.BloquearNumeroTarjeta = false;
          this.BloquearCanales = false;
          this.BloquearDiaCortePlazo = false;
          this.BloquearLinea = false;
          this.BloquearPuntos = false;
          this.BloquearGarantiaReal = false;
          this.VolverAbajo();
          this.devolverTab(3);
          this.tab3.nativeElement.click();
          $('#saldos').removeClass('activar');
          $('#saldos').removeClass('active');
          $('#historial').removeClass('activar');
          $('#historial').removeClass('active');
          $('#autorizados').removeClass('activar');
          $('#autorizados').removeClass('active');
          $('#cupo').addClass('activar');
          $('#cupo').addClass('active');
          $('#tarjeta').removeClass('activar');
          $('#tarjeta').removeClass('active');
          $('#libreta').addClass('activar');
          $('#libreta').addClass('active');
          setTimeout(() => {
            this.generalesService.Autofocus('SelectCupo');
          }, 300);
            
        } else {
          this.notif.warning('Advertencia', 'Medio de pago no válido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
        }
        
        } else {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
              }
            } else {
              this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
            }
          },
        )      
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.',ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }


    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '35') {  // Cancelar cupo
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        const IdTercero = this.DisponibleForm.get('LngTercero')?.value
        this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
          result => {
            const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
            const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

            const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
            const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

            const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

            if (diferenciaEnDias <= 180) { 

        if (this.DisponibleForm.get('CupoUtilizado')?.value != null && this.DisponibleForm.get('CupoUtilizado')?.value > 0) {
          this.notif.warning('Advertencia', ' Cuenta con saldo en cupo utilizado.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
          return;
        }
        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70) {
            this.BloquearOperacionPermitida = false;
            this.selectOperacionPermitada = true;
            this.inputOperacionPermitada = false;
            this.DescriTipoFirma = true;
            this.operacionEscogida = '/cancelar cupo';
            this.BloquearAsociado = false;
            this.BloquaerProducto = false;
            this.BloquearEstado = false;
            this.BloquearRadicado = false;
            this.bloquearConsultaCuenta = false;
            this.BloquearBuscar = false;
            this.btnActualizar = false;
            this.btnGuardar = true;
            this.BloquearAsesorExterno = false;
            this.BloquearMedioPago = false;
            this.bloquearbtnActalizar = false;
            this.inputEstado = false;
            this.selectEstado = true;
            this.btnActualizarCanales = true;
            this.BloquearConvenio = false;
            this.BloquearNumeroTarjeta = false;
            this.BloquearCanales = false;
            this.BloquearDiaCortePlazo = false;
            this.BloquearLinea = false;
            this.BloquearPuntos = false;
            this.BloquearGarantiaReal = false;
            swal.fire({
              title: '¿Desea cancelar cupo?',
              text: '',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Si',
              cancelButtonText: 'No',
              confirmButtonColor: 'rgb(13,165,80)',
              cancelButtonColor: 'rgb(160,0,87)',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then((results) => {
              if (results.value)
                this.CancelarCupo();
              else
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
             });
          } else {
            this.notif.warning('Advertencia', 'Medio de pago no válido.', ConfiguracionNotificacion.configRightTop);
            this.DisponibleOperacionFrom.get('Codigo')?.reset();
          }
        } else {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
              }
            } else {
              this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
            }
          },
        )       
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.',ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '111') { // Marcar y Desmarcar GMF
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {

        if (this.DisponibleForm.get('IdEstado')?.value == 25 || this.DisponibleForm.get('IdEstado')?.value == 10) {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
          return;
        }
        
        // valida que la cuenta no esté marcada como exenta G.M.F
        if (this.DisponibleForm.get('Exenta')?.value === '1' || this.DisponibleForm.get('Exenta')?.value === 1 || this.DisponibleForm.get('Exenta')?.value === true || this.DisponibleForm.get('Exenta')?.value === 'true') {
          this.notif.warning('Advertencia', 'La cuenta está marcada como exenta.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
          return;
        }
        const IdTercero = this.DisponibleForm.get('LngTercero')?.value
        this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
          result => {
            const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
            const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

            const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
            const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

            const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

            if (diferenciaEnDias <= 180) { 
        this.operacionEscogida = '/marcar y desmarcar GMF';
        this.EnableExoneradaGMF = null;
        this.ExoneradaGmfOld = this.DisponibleForm.get('ExoneradaGmf')?.value;
        this.btnActualizar = false;
        setTimeout(() => {
          this.generalesService.Autofocus('volver');
        }, 300);
            } else {
              this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
            }
          },
        )              
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.',ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '109') { // Timbrar mensaje
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {

        if (this.DisponibleForm.get('IdEstado')?.value == 25 || this.DisponibleForm.get('IdEstado')?.value == 10) {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
          return;
        }
        const IdTercero = this.DisponibleForm.get('LngTercero')?.value
        this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
          result => {
            const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
            const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

            const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
            const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

            const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

            if (diferenciaEnDias <= 180) { 
        this.operacionEscogida = '/timbrar mensaje';
        this.BloquearTimbrarMensaje = null;
        this.TibrarComentarioOld = this.DisponibleForm.get('TibrarComentario')?.value;
        this.btnActualizar = false;
        setTimeout(() => {
          this.generalesService.Autofocus('TibrarComentarioId');
        }, 300); 
            } else {
              this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
            }
          },
        ) 
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.',ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '110') { // Adicionar y/o eliminar fecha exoneración
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        if (this.DisponibleForm.get('IdMedioPago')?.value == 0 ) {
          this.notif.warning('Advertencia', 'Medio de pago no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
          return;
        }
        if (this.DisponibleForm.get('IdEstado')?.value == 25 || this.DisponibleForm.get('IdEstado')?.value == 10) {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
          return;
        }
        const IdTercero = this.DisponibleForm.get('LngTercero')?.value
        this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
          result => {
            const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
            const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

            const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
            const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

            const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

            if (diferenciaEnDias <= 180) { 
        this.operacionEscogida = '/exonera cuota de manejo hasta';
        this.typeExoCobroHasta = "date";
        let exoDateUntil = this.DisponibleForm.get('ExoCobroHasta')?.value;
        if (exoDateUntil != "" && exoDateUntil != null)
          this.ExoCobroHastaOld = moment(exoDateUntil).format("YYYY-MM-DD");
        else
          this.ExoCobroHastaOld = "";
        
        this.devolverTab(2);
        this.tab2.nativeElement.click();
        this.VolverArriba(800);
        $('#saldos').removeClass('activar');
        $('#saldos').removeClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
        $('#autorizados').removeClass('activar');
        $('#autorizados').removeClass('active');
        $('#cupo').removeClass('activar');
        $('#cupo').removeClass('active');
        $('#tarjeta').addClass('activar');
        $('#tarjeta').addClass('active');
        $('#libreta').removeClass('activar');
        $('#libreta').removeClass('active');
        this.btnActualizar = false;
        this.BloquearExoCobroHasta = null;
        setTimeout(() => {
          this.generalesService.Autofocus('ExoCobroHastaId');
        }, 400);
            } else {
              this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
            }
          },
        ) 
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.',ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '36') {  // Editar Canales
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
            const IdTercero = this.DisponibleForm.get('LngTercero')?.value
            this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
              result => {
                const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
                const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

                const fechaHoy = new Date(fechaHoyString == null ? ""  : fechaHoyString);
                const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

                const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

                if (diferenciaEnDias <= 180) { 
            this.checkboxAcordeonCanales = true;
            setTimeout(() => {
              $('#SelectCanales').focus().select();
            }, 400);
            this.Canales();
            this.BloquearOperacionPermitida = false;
            this.selectOperacionPermitada = true;
            this.inputOperacionPermitada = false;
            this.DescriTipoFirma = true;
            this.operacionEscogida = '/Editar Canales';
            this.BloquearAsociado = false;
            this.showBtnCanalesActualizar = true;
            this.BloquaerProducto = false;
            this.BloquearEstado = false;
            this.bloquearConsultaCuenta = false;
            this.BloquearBuscar = false;
            this.btnActualizar = false;
            this.btnGuardar = true;
            this.BloquearAsesorExterno = false;
            this.BloquearMedioPago = false;
            this.BloquearRadicado = false;
            this.bloquearbtnActalizar = false;
            this.inputEstado = false;
            this.selectEstado = true;
            this.btnActualizarCanales = false;
            this.BloquearConvenio = false;
            this.BloquearNumeroTarjeta = false;
            this.BloquearCanales = false;
            this.BloquearPagare = false;
            this.BloquearDiaCortePlazo = false;
            this.BloquearLinea = false;
            this.BloquearPuntos = false;
            this.BloquearGarantiaReal = false;
            this.BloquearCanalesInputs = true;
            this.DisponibleForm.controls["Canal"].enable();
            this.DisponibleForm.controls["NumeroOperaciones"].enable();
            this.DisponibleForm.controls["MontoMaximo"].enable();
            this.VolverArriba(860);
            this.devolverTab(2);
            this.tab2.nativeElement.click();
            $('#saldos').removeClass('activar');
            $('#saldos').removeClass('active');
            $('#historial').removeClass('activar');
            $('#historial').removeClass('active');
            $('#autorizados').removeClass('activar');
            $('#autorizados').removeClass('active');
            $('#cupo').removeClass('activar');
            $('#cupo').removeClass('active');
            $('#tarjeta').addClass('activar');
            $('#tarjeta').addClass('active');
            $('#libreta').removeClass('activar');
                  $('#libreta').removeClass('active');
                } else {
                  this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                  this.DisponibleOperacionFrom.get('Codigo')?.reset();
                }
              },
            ) 
          } else {
            this.notif.warning('Advertencia', 'Medio de pago no válido.',
              ConfiguracionNotificacion.configRightTop);
            this.DisponibleOperacionFrom.get('Codigo')?.reset();
          }
        } else {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
        }
        
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.',
          ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }


    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '37') {  // Cambiar operación permitida
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {  
        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          const IdTercero = this.DisponibleForm.get('LngTercero')?.value
          this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
            result => {
              const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
              const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

              const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
              const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

              const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

              if (diferenciaEnDias <= 180) { 
          this.OperacionPermitida();
          this.BloquearOperacionPermitida = null;
          this.selectOperacionPermitada = false;
          this.inputOperacionPermitada = true;
          this.DescriTipoFirma = true;
          this.operacionEscogida = '/Cambiar operación permitida';
          this.BloquearAsociado = false;
          this.BloquaerProducto = false;
          this.BloquearEstado = false;
          this.bloquearConsultaCuenta = false;
          this.BloquearBuscar = false;
          this.btnActualizar = false;
          this.btnGuardar = true;
          this.BloquearAsesorExterno = false;
          this.BloquearRadicado = false;
          this.BloquearMedioPago = false;
          this.bloquearbtnActalizar = false;
          this.inputEstado = false;
          this.selectEstado = true;
          this.btnActualizarCanales = true;
          this.BloquearConvenio = false;
          this.BloquearNumeroTarjeta = false;
          this.BloquearCanales = false;
          this.BloquearPagare = false;
          this.BloquearDiaCortePlazo = false;
          this.BloquearLinea = false;
          this.BloquearPuntos = false;
          this.BloquearGarantiaReal = false;
              } else {
                this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              }
            },
          ) 
        } else {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
        }
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.', ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '25') {  // Imprimir registro de firmas
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          this.BloquearOperacionPermitida = false;
          this.selectOperacionPermitada = true;
          this.inputOperacionPermitada = false;
          this.DescriTipoFirma = true;
          this.ModalImpresionRegistroFirmas.nativeElement.click();
          this.operacionEscogida = '/Imprimir registro de firmas';
          this.BloquearAsociado = false;
          this.BloquaerProducto = false;
          this.BloquearEstado = false;
          this.bloquearConsultaCuenta = false;
          this.BloquearBuscar = false;
          this.btnActualizar = true;
          this.btnGuardar = true;
          this.BloquearAsesorExterno = false;
          this.BloquearMedioPago = false;
          this.bloquearbtnActalizar = false;
          this.inputEstado = false;
          this.selectEstado = true;
          this.btnActualizarCanales = true;
          this.BloquearConvenio = false;
          this.BloquearNumeroTarjeta = false;
          this.BloquearCanales = false;
          this.BloquearPagare = false;
          this.BloquearDiaCortePlazo = false;
          this.BloquearRadicado = false;
          this.BloquearLinea = false;
          this.BloquearPuntos = false;
          this.BloquearGarantiaReal = false;
          this.ImpresionRegistroFrima(); 
        } else 
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.',ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
        this.bloquearConsultaCuenta = false;
        this.BloquearBuscar = false;
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '73') {  // Adicionar y/o  eliminar  garantias
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {

        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          const IdTercero = this.DisponibleForm.get('LngTercero')?.value
          this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
            result => {
              const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
              const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

              const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
              const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

              const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

              if (diferenciaEnDias <= 180) { 
          this.BloquearOperacionPermitida = false;
          this.selectOperacionPermitada = true;
          this.inputOperacionPermitada = false;
          this.DescriTipoFirma = true;
          this.operacionEscogida = '/Adicionar y/o eliminar Garantías';
          this.BloquearAsociado = false;
          this.BloquaerProducto = false;
          this.BloquearEstado = false;
          this.bloquearConsultaCuenta = false;
          this.BloquearBuscar = false;
          this.btnActualizar = true;
          this.btnGuardar = true;
          this.BloquearAsesorExterno = false;
          this.BloquearMedioPago = false;
          this.BloquearRadicado = false;
          this.bloquearbtnActalizar = false;
          this.inputEstado = false;
          this.selectEstado = true;
          this.btnActualizarCanales = true;
          this.BloquearConvenio = false;
          this.BloquearNumeroTarjeta = false;
          this.BloquearCanales = false;
          this.BloquearPagare = false;
          this.BloquearDiaCortePlazo = false;
          this.BloquearLinea = false;
          this.BloquearPuntos = false;
          this.BloquearGarantiaReal = null;
          $('#saldos').removeClass('activar');
          $('#saldos').removeClass('active');
          $('#historial').removeClass('activar');
          $('#historial').removeClass('active');
          $('#autorizados').removeClass('activar');
          $('#autorizados').removeClass('active');
          $('#cupo').removeClass('activar');
          $('#cupo').removeClass('active');
          $('#tarjeta').removeClass('activar');
          $('#tarjeta').removeClass('active');
          $('#garantia').addClass('activar');
          $('#garantia').addClass('active');
          $('#libreta').removeClass('activar');
                $('#libreta').removeClass('active');
              } else {
                this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              }
            },
          )
        } else {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();  
        }
        
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.', ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
        this.bloquearConsultaCuenta = false;
        this.BloquearBuscar = false;
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '79') {  // generear certificado cuenta
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        this.Certificados = [ { id: 1, opcion: "Certificación Coogranada con saldo" },
          { id: 2, opcion: "Certificación Coogranada sin saldo" },
          { id: 3, opcion: "Certificación banco cooperativo Coopcentral" }];
        
        if (this.DisponibleForm.get('IdMedioPago')?.value == '0')
          this.Certificados = this.Certificados.filter(( x: any) => x.id != 3);

        this.ModalCertificadoCuentaPregunta.nativeElement.click();
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
        this.BloquearOperacionPermitida = false;
        this.selectOperacionPermitada = true;
        this.inputOperacionPermitada = false;
        this.DescriTipoFirma = true;
        this.operacionEscogida = '/Generar Certificado Cuenta';
        this.BloquearAsociado = false;
        this.BloquaerProducto = false;
        this.BloquearEstado = false;
        this.bloquearConsultaCuenta = false;
        this.BloquearBuscar = false;
        this.btnActualizar = true;
        this.btnGuardar = true;
        this.BloquearAsesorExterno = false;
        this.BloquearMedioPago = false;
        this.bloquearbtnActalizar = false;
        this.inputEstado = false;
        this.selectEstado = true;
        this.btnActualizarCanales = true;
        this.BloquearConvenio = false;
        this.BloquearNumeroTarjeta = false;
        this.BloquearCanales = false;
        this.BloquearPagare = false;
        this.BloquearDiaCortePlazo = false;
        this.BloquearRadicado = false;
        this.BloquearLinea = false;
        this.BloquearPuntos = false;
        this.BloquearGarantiaReal = false;
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.', ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
        this.bloquearConsultaCuenta = false;
        this.BloquearBuscar = false;
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '75') {  // Activacion Cuenta
      if (this.DisponibleForm.get('IdOficina')?.value !== null
        && this.DisponibleForm.get('IdOficina')?.value !== undefined
        && this.DisponibleForm.get('IdOficina')?.value !== ''
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
        && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
        && this.DisponibleForm.get('IdConsecutivo')?.value !== null
        && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
        && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
        && this.DisponibleForm.get('IdDigito')?.value !== null
        && this.DisponibleForm.get('IdDigito')?.value !== undefined
        && this.DisponibleForm.get('IdDigito')?.value !== ''
      ) {
        // valida estado de cuenta 
        if (this.DisponibleForm.get('IdEstado')?.value !== 25 && this.DisponibleForm.get('IdEstado')?.value !== 10) {
          // valida que que debe actualizar datos        
          
          const IdTercero = this.DisponibleForm.get('LngTercero')?.value;
          this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
            result => {
              const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
              const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');

              const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
              const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

              const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

              if (diferenciaEnDias <= 180) { 
                if (this.DisponibleForm.get('ActivaMovimiento')?.value === 0) { // cuenta inactiva
                  this.BloquearOperacionPermitida = false;
                  this.selectOperacionPermitada = true;
                  this.inputOperacionPermitada = false;
                  this.DescriTipoFirma = true;
                  this.operacionEscogida = '/Activacion Cuenta';
                  this.BloquearAsociado = false;
                  this.BloquaerProducto = false;
                  this.BloquearEstado = false;
                  this.bloquearConsultaCuenta = false;
                  this.BloquearBuscar = false;
                  this.btnActualizar = false;
                  this.btnGuardar = true;
                  this.BloquearAsesorExterno = false;
                  this.BloquearMedioPago = false;
                  this.bloquearbtnActalizar = false;
                  this.inputEstado = false;
                  this.selectEstado = true;
                  this.btnActualizarCanales = true;
                  this.BloquearConvenio = false;
                  this.BloquearNumeroTarjeta = false;
                  this.BloquearCanales = false;
                  this.BloquearPagare = false;
                  this.BloquearDiaCortePlazo = false;
                  this.BloquearRadicado = false;
                  this.BloquearLinea = false;
                  this.BloquearPuntos = false;
                  this.BloquearGarantiaReal = false;
                  swal.fire({
                    title: '¿Desea activar cuenta?',
                    text: '',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                    confirmButtonColor: 'rgb(13,165,80)',
                    cancelButtonColor: 'rgb(160,0,87)',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                  }).then((results) => {
                    if (results.value){
                      this.ActivarCuenta();
                    }else{
                      this.DisponibleOperacionFrom.get('Codigo')?.reset();
                      this.notif.warning('Advertencia', 'La cuenta ya esta activa.', ConfiguracionNotificacion.configRightTop);
                    }
                  });
                } else {
                  this.notif.warning('Advertencia', 'La cuenta ya esta activa.', ConfiguracionNotificacion.configRightTop);
                  this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
                }
              } else {
                this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              }
            });    
        } else {
          this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no valido.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
        }        
      } else {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.', ConfiguracionNotificacion.configRightTop);
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
        this.bloquearConsultaCuenta = false;
        this.BloquearBuscar = false;
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '115') { // Activar libreta
      if (!this.DisponibleForm.get('NumeroDocumento')?.value) {
        this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.', ConfiguracionNotificacion.configRightTop);
        return;
      }
      if (this.DisponibleForm.get('IdMedioPago')?.value !== 0) {
        this.notif.warning('Advertencia', 'Cuenta no tiene medio de pago libreta.', ConfiguracionNotificacion.configRightTop);
        return;
      }
      const idCuenta = this.DisponibleForm.get('IdCuenta')?.value;
      this.DisponiblesServices.ObtenerLibretas(idCuenta, false)
        .subscribe(
          (result : any) => {
            if (result.length === 0) {
              this.notif.warning('Advertencia', 'No hay libretas para activar.', ConfiguracionNotificacion.configRightTop);
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
              return;
            }
            this.resultInactiveLibretas = result;
            this.isBtnActivarLibretasDisabled = true;
            this.selectedIds = [];
            this.ModalLibretas.nativeElement.click();
          },
          (error : any) => {
            console.error(error);
          }
        )
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '117') { // Marcar y Desmarcar exento GMF
        if (this.DisponibleForm.get('IdOficina')?.value !== null
          && this.DisponibleForm.get('IdOficina')?.value !== undefined
          && this.DisponibleForm.get('IdOficina')?.value !== ''
          && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
          && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
          && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
          && this.DisponibleForm.get('IdConsecutivo')?.value !== null
          && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
          && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
          && this.DisponibleForm.get('IdDigito')?.value !== null
          && this.DisponibleForm.get('IdDigito')?.value !== undefined
          && this.DisponibleForm.get('IdDigito')?.value !== ''
        ) {
  
          if (this.DisponibleForm.get('IdEstado')?.value == 25 || this.DisponibleForm.get('IdEstado')?.value == 10) {
            this.notif.warning('Advertencia', 'Cuenta no se puede editar, estado no válido.', ConfiguracionNotificacion.configRightTop);
            this.DisponibleOperacionFrom.get('Codigo')?.reset(); 
            return;
          }
          // valida que sea solo para juridicos
          if (this.DisponibleForm.get('TipoDocumento')?.value != 'Nit') {
            this.notif.warning('Advertencia', 'Cuenta no se puede editar, operación sólo es para personas jurídicas.', ConfiguracionNotificacion.configRightTop);
            this.DisponibleOperacionFrom.get('Codigo')?.reset();
            return;
          }
          // valida que la cuenta no esté marcada como exonerada G.M.F
          if ( this.DisponibleForm.get('ExoneradaGmf')?.value === '1' || this.DisponibleForm.get('ExoneradaGmf')?.value === 1 || this.DisponibleForm.get('ExoneradaGmf')?.value === true || this.DisponibleForm.get('ExoneradaGmf')?.value === 'true') {
            this.notif.warning('Advertencia', 'La cuenta está marcada como exonerada.', ConfiguracionNotificacion.configRightTop);
            this.DisponibleOperacionFrom.get('Codigo')?.reset();
            return;
          }

          const IdTercero = this.DisponibleForm.get('LngTercero')?.value
          this.DisponiblesServices.ValidaFechaActualiza(IdTercero).subscribe(
            result => {
              const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
              const fechaActualizaString = new DatePipe('en-CO').transform(result.FechaActualizacion, 'yyyy/MM/dd');
  
              const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
              const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);
  
              const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);
  
              if (diferenciaEnDias <= 180) { 
          this.operacionEscogida = '/marcar y desmarcar exento GMF';
          this.EnableExentaGMF = null;
          this.ExentaGmfOld = this.DisponibleForm.get('Exenta')?.value;
          this.btnActualizar = false;
          setTimeout(() => {
            this.generalesService.Autofocus('volver1');
          }, 300);
              } else {
                this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              }
            },
          )              
        } else {
          this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.',ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
        }
      }
    this.ResetValorSeleccionado();
  } 

  calcularDiferenciaEnDias(fechaInicio: Date, fechaFin: Date): number {
    let FechaActualiza = formatDate(new Date(fechaFin), 'yyyy,MM,dd', 'en');
    let fechaHoy = formatDate(fechaInicio, 'yyyy,MM,dd', 'en');
    var date1: any = new Date(FechaActualiza);
    var date2: any = new Date(fechaHoy);
    var diffDays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays);  // Diferencia en días enteros
  }
  
  onCheckboxChange(libretaId: number, target: any): void {

    if (target.checked) {
      this.selectedIds.push(libretaId);
    } else {
      this.selectedIds = this.selectedIds.filter(id => id !== libretaId);
    }
    this.isBtnActivarLibretasDisabled = !Boolean(this.selectedIds.length);
  }

  onClickBtnActivarLibretas() {
    this.DisponiblesServices.ActivarLibretas(this.selectedIds).subscribe(
      result => {
        const updatedLibretas = this.resultInactiveLibretas.filter(libreta => this.selectedIds.includes(libreta.LngInicial));
        const logData = updatedLibretas.map(libreta => ({ Inicial: libreta.LngInicial, Final: libreta.LngFinal }));
        this.Guardarlog(logData);
        this.ModalLibretas.nativeElement.click();
        this.DisponibleOperacionFrom.get('Codigo')?.reset();
        this.notif.success('Exitoso', 'La activación de las libretas se realizó correctamente.', ConfiguracionNotificacion.configRightTop);
        this.fetchActiveLibretas();
      },
      error => {
        console.error(error);
      }
    );
  }

  fetchActiveLibretas() {
    const idCuenta = this.DisponibleForm.get('IdCuenta')?.value;
    this.DisponiblesServices.ObtenerLibretas(idCuenta, true).subscribe(
      result => {
        this.resultActiveLibretas = result;
      },
      error => {
        console.error(error);
      }
    );
  }
  
  ImpresionRegistroFrima() {
    this.loading = true;
    let itemsSendCertificado: any = {};
    let autorizados: any[] = [];
    if(this.dataObjetTitulares.length > 0)
      this.dataObjetTitulares.forEach(( x: any) => {
        autorizados.push({
          Nombre: x.Nombre,
          Documento: x.Documento,
          TipoFirma : x.TipoFirma
        });
      });
    itemsSendCertificado.Cuenta = this.DisponibleForm.get('Cuenta')?.value;
    itemsSendCertificado.Ciudad = this.DisponibleForm.get('NombreOficina')?.value;
    itemsSendCertificado.Nombre = this.DisponibleForm.get('Nombre')?.value;
    itemsSendCertificado.Documento = this.DisponibleForm.get('NumeroDocumento')?.value;
    itemsSendCertificado.FechaApertura = this.DisponibleForm.get('FechaApertura')?.value;
    // validacion para enviar mensaje firma unica 
    if (autorizados.length === 0) {
      itemsSendCertificado.TipoFirma = 'Firma unica';
    }     
    itemsSendCertificado.Autorizados = autorizados;
    $("#ModalImpresionRegistroFirmas").show();
    let html : HTMLObjectElement =  document.getElementById("ImpresionRegistroFirmasDisponible") as HTMLObjectElement;
    this.linkPdf = "";
    let pdfinBase64 = null;
    let byteArray = null;
    let newBolb = null;
    let url = null;
    html.data = "";
    html.name = "";
    html.type = "";
    
    this.DisponiblesServices.ImpresionRegistroFirma(itemsSendCertificado).subscribe(
      result => {
        pdfinBase64 = result.FileStream._buffer;
        byteArray = new Uint8Array(atob(pdfinBase64).split("").map((char) => char.charCodeAt(0)));
        newBolb = new Blob([byteArray], { type: "application/pdf" });
        this.linkPdf = pdfinBase64;
        url = window.URL.createObjectURL(newBolb);
        html.data = url;
        html.name ="Registro firma";
        html.type =  "application/pdf";
        this.loading = false;
        this.Guardarlog({},"25")
      },
      error => {
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.error(errorMessage);
        this.loading = false;
      });
  }
  CloseModal() {
    this.DisponibleOperacionFrom.get('Codigo')?.reset();
  }
  ResetValorSeleccionado(tipo : number = 0 ) {
    if (tipo == 1 && this.DisponibleOperacionFrom.get('Codigo')?.value == '2') {
      this.btnRegistroFirma = true;
      this.DisponibleOperacionFrom.get('Codigo')?.reset();
     }
     
  }
  Operaciones() {
    let datas = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(datas == null ? "" : datas));
    const arrayExample = [{
      'IdModulo': this.CodModulo,
      'IdUsuario': this.dataUser.IdUsuario,
      'IdOperaciones': '',
      'IdOperacionesPerfil': '',
      'IdPerfil': this.dataUser.idPerfilUsuario
    }]; 
    this.operacionesService.OperacionesPermitidas(arrayExample[0]).subscribe(
      result => {
        this.resultOperaciones = result;
        this.MostrarDemas = false;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  BuscarPorCuenta() {
    if (this.DisponibleForm.get('IdOficina')?.value !== ''
    && this.DisponibleForm.get('IdOficina')?.value !== undefined
    && this.DisponibleForm.get('IdOficina')?.value !== null
    && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
    && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
    && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
    && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
    && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
    && this.DisponibleForm.get('IdConsecutivo')?.value !== null
    && this.DisponibleForm.get('IdDigito')?.value !== ''
    && this.DisponibleForm.get('IdDigito')?.value !== undefined
    && this.DisponibleForm.get('IdDigito')?.value !== null
  ) {
    this.Bloquear = false;
    this.BloquearFormaPago = false;
    this.BloquearAsociado = false;
    this.BloquearBuscar = false;
    this.bloquearConsultaCuenta = false;
    this.loading = true;
    this.DisponiblesServices.BuscarCuenta(this.DisponibleForm.value).subscribe(
      result => {
        this.loading = false;
        if (result !== null) {
          this.ResetValorSeleccionado(1);
          this.MapearDatosCuenta(result);
          this.BloquearBtnRegistroFirma = true;        
          this.btnActualizarCanales = true;
          this.btnGuardar = true;         

          this.itemsSendRegistro.Cuenta = this.DisponibleForm.get('Cuenta')?.value;
          this.itemsSendRegistro.Ciudad = this.DisponibleForm.get('NombreOficina')?.value;
          this.itemsSendRegistro.FechaApertura = this.DisponibleForm.get('FechaApertura')?.value;
          this.itemsSendRegistro.NombreTitular = this.DisponibleForm.get('Nombre')?.value;
          this.itemsSendRegistro.DocumentoTitular = this.DisponibleForm.get('NumeroDocumento')?.value;
          this.itemsSendRegistro.TelefonoTitular = this.DisponibleForm.get('TelefonoDisponible')?.value;
          if (result.Titulares.length !== 0) {
            result.Titulares.forEach((elementTitulares : any) => {
              if (result.Titulares.length === 1) {
                this.itemsSendRegistro.NombreAutorizado1 = elementTitulares.Nombre;
                this.itemsSendRegistro.DocuementoAutorizado1 = elementTitulares.Documento;
                this.itemsSendRegistro.TelefoinoAutorizado1 = elementTitulares.Telefono;
                this.itemsSendRegistro.CodicionesAutorizado1 = elementTitulares.TipoFirma;
                this.itemsSendRegistro.NombreAutorizado2 = null;
                this.itemsSendRegistro.DocuementoAutorizado2 = null;
                this.itemsSendRegistro.TelefoinoAutorizado2 = null;
                this.itemsSendRegistro.CodicionesAutorizado2 = null;
              }
              return  false;
            });
            result.Titulares.forEach((elementTitulares : any) => {
              if (result.Titulares.length === 2) {
                this.itemsSendRegistro.NombreAutorizado1 = elementTitulares.Nombre;
                this.itemsSendRegistro.DocuementoAutorizado1 = elementTitulares.Documento;
                this.itemsSendRegistro.TelefoinoAutorizado1 = elementTitulares.Telefono;
                this.itemsSendRegistro.CodicionesAutorizado1 = elementTitulares.TipoFirma;
              }
              return  false;
            });
            result.Titulares.forEach((elementTitulares : any) => {
              if (elementTitulares.Documento !== this.itemsSendRegistro.DocuementoAutorizado1) {
                this.itemsSendRegistro.NombreAutorizado2 = elementTitulares.Nombre;
                this.itemsSendRegistro.DocuementoAutorizado2 =  elementTitulares.Documento;
                this.itemsSendRegistro.TelefoinoAutorizado2 = elementTitulares.Telefono;
                this.itemsSendRegistro.CodicionesAutorizado2 = elementTitulares.TipoFirma;
              }
              return  false;
            });
          } else {
            this.itemsSendRegistro.NombreAutorizado1 = null;
            this.itemsSendRegistro.DocuementoAutorizado1 = null;
            this.itemsSendRegistro.TelefoinoAutorizado1 = null;
            this.itemsSendRegistro.CodicionesAutorizado1 = null;
            this.itemsSendRegistro.NombreAutorizado2 = null;
            this.itemsSendRegistro.DocuementoAutorizado2 = null;
            this.itemsSendRegistro.TelefoinoAutorizado2 = null;
            this.itemsSendRegistro.CodicionesAutorizado2 = null;
          }

        } else {
          this.notif.warning('Advertencia', 'La cuenta no existe.', ConfiguracionNotificacion.configRightTop);
          this.clearTitulares();
          this.DisponibleForm.get('IdOficina')?.reset();
          this.DisponibleForm.get('IdProductoCuenta')?.reset();
          this.DisponibleForm.get('IdConsecutivo')?.reset();
          this.DisponibleForm.get('IdDigito')?.reset();          
          this.dataObjet = undefined;
          this.BloquearBuscar = null;
          this.bloquearConsultaCuenta = null;
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
        this.notif.warning('Advertencia', 'La cuenta no existe.', ConfiguracionNotificacion.configRightTop);
        this.clearTitulares();
        this.DisponibleForm.get('IdOficina')?.reset();
        this.DisponibleForm.get('IdProductoCuenta')?.reset();
        this.DisponibleForm.get('IdConsecutivo')?.reset();
        this.DisponibleForm.get('IdDigito')?.reset();
        this.dataObjet = undefined;
        this.BloquearBuscar = null;
        this.bloquearConsultaCuenta = null;
      });
  }
  }
  BuscarCuentaPorDocumento() {
    if (this.DisponibleForm.get('BuscarDocumento')?.value !== null
      && this.DisponibleForm.get('BuscarDocumento')?.value !== undefined
      && this.DisponibleForm.get('BuscarDocumento')?.value !== '') {
      this.loading = true;
      
      this.DisponiblesServices.BuscarPorDocumento({BuscarNombre : "",BuscarDocumento : this.DisponibleForm.controls["BuscarDocumento"].value}).subscribe(
        result => {
          this.loading = false;          
          if (result.length === 0) {
            this.notif.warning('Advertencia', 'No se encontró cuenta de disponible.', ConfiguracionNotificacion.configRightTop);
            this.clearFrom();
          } else if (result.length == 1) {
            this.ResetValorSeleccionado(1);
            this.DisponibleForm.get('BuscarDocumento')?.reset();
            this.clearFrom();
            this.MapearDatosCuenta(result);
            this.btnActualizar = true;
            this.btnActualizarCanales = true;
            this.btnGuardar = true;
            this.bloquearConsultaCuenta = false;
            this.BloquearBuscar = false;
            this.DisponibleForm.get('BuscarDocumento')?.reset();
            this.DisponibleForm.get('BuscarNombre')?.reset();
            this.BloquearBtnRegistroFirma = true;
          this.itemsSendRegistro.Cuenta = this.DisponibleForm.get('Cuenta')?.value;
          this.itemsSendRegistro.Ciudad = this.DisponibleForm.get('NombreOficina')?.value;
          this.itemsSendRegistro.FechaApertura = this.DisponibleForm.get('FechaApertura')?.value;
          this.itemsSendRegistro.NombreTitular = this.DisponibleForm.get('Nombre')?.value;
          this.itemsSendRegistro.DocumentoTitular = this.DisponibleForm.get('NumeroDocumento')?.value;
          this.itemsSendRegistro.TelefonoTitular = this.DisponibleForm.get('TelefonoDisponible')?.value;

            if (result.Titulares.length !== 0) {
              result.Titulares.forEach((elementTitulares : any) => {
                if (result.Titulares.length === 1) {
                  this.itemsSendRegistro.NombreAutorizado1 = elementTitulares.Nombre;
                  this.itemsSendRegistro.DocuementoAutorizado1 = elementTitulares.Documento;
                  this.itemsSendRegistro.TelefoinoAutorizado1 = elementTitulares.Telefono;
                  this.itemsSendRegistro.CodicionesAutorizado1 = elementTitulares.TipoFirma;
                  this.itemsSendRegistro.NombreAutorizado2 = null;
                  this.itemsSendRegistro.DocuementoAutorizado2 = null;
                  this.itemsSendRegistro.TelefoinoAutorizado2 = null;
                  this.itemsSendRegistro.CodicionesAutorizado2 = null;
                }
                return false;
              });
              result.Titulares.forEach(( elementTitulares : any) => {
                if (result.Titulares.length === 2) {
                  this.itemsSendRegistro.NombreAutorizado1 = elementTitulares.Nombre;
                  this.itemsSendRegistro.DocuementoAutorizado1 = elementTitulares.Documento;
                  this.itemsSendRegistro.TelefoinoAutorizado1 = elementTitulares.Telefono;
                  this.itemsSendRegistro.CodicionesAutorizado1 = elementTitulares.TipoFirma;
                }
                return false;
              });
              result.Titulares.forEach(( elementTitulares : any) => {
                if (elementTitulares.Documento !== this.itemsSendRegistro.DocuementoAutorizado1) {
                  this.itemsSendRegistro.NombreAutorizado2 = elementTitulares.Nombre;
                  this.itemsSendRegistro.DocuementoAutorizado2 = elementTitulares.Documento;
                  this.itemsSendRegistro.TelefoinoAutorizado2 = elementTitulares.Telefono;
                  this.itemsSendRegistro.CodicionesAutorizado2 = elementTitulares.TipoFirma;
                }
                return false;
              });
            } else {
              this.itemsSendRegistro.NombreAutorizado1 = null;
              this.itemsSendRegistro.DocuementoAutorizado1 = null;
              this.itemsSendRegistro.TelefoinoAutorizado1 = null;
              this.itemsSendRegistro.CodicionesAutorizado1 = null;
              this.itemsSendRegistro.NombreAutorizado2 = null;
              this.itemsSendRegistro.DocuementoAutorizado2 = null;
              this.itemsSendRegistro.TelefoinoAutorizado2 = null;
              this.itemsSendRegistro.CodicionesAutorizado2 = null;
            }
          } else {
            
            this.dataAsociados = result;
            this.dataAsociados.forEach(( elementAsociado: any) => {
              this.resultMedioPago.forEach(( elementMedioPago: any) => {
                if (elementMedioPago.IdMedioPago === elementAsociado.IdMedioPago ) {
                  elementAsociado.DescripcionMedioPago = elementMedioPago.Descripcion;
              }
              });
            });
           
            this.ModalBuscarAsociados.nativeElement.click();
            this.btnActualizar = true;
            this.btnActualizarCanales = true;
            this.btnGuardar = true;
            this.bloquearConsultaCuenta = null;
            this.DisponibleForm.get('BuscarDocumento')?.reset();
            this.DisponibleForm.get('BuscarNombre')?.reset();
            
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  BuscarCuentaPorNombre() {
    this.loading = true;
    this.DisponiblesServices.BuscarPorNombre(this.DisponibleForm.value).subscribe(
      result => {
        this.loading = false;
        this.DisponibleForm.get('BuscarNombre')?.reset();
        if (result.length > 1) {

          result.forEach(( elementAsociado: any) => {
            this.resultMedioPago.forEach(( elementMedioPago: any) => {
              if (elementMedioPago.IdMedioPago === elementAsociado.IdMedioPago) {
                elementAsociado.DescripcionMedioPago = elementMedioPago.Descripcion;
              }
            });
          });

          this.dataAsociados = result;
          this.DisponibleForm.get('BuscarNombre')?.reset();
          this.DisponibleForm.get('BuscarDocumento')?.reset();
          this.ModalBuscarAsociados.nativeElement.click();
          this.btnActualizarCanales = true;
          this.bloquearConsultaCuenta = null;
          this.btnCambiarEstado = false;
          this.btnActualizar = true;
          this.btnGuardar = true;

          this.itemsSendRegistro.Cuenta = this.DisponibleForm.get('Cuenta')?.value;
          this.itemsSendRegistro.Ciudad = this.DisponibleForm.get('NombreOficina')?.value;
          this.itemsSendRegistro.FechaApertura = this.DisponibleForm.get('FechaApertura')?.value;
          this.itemsSendRegistro.NombreTitular = this.DisponibleForm.get('Nombre')?.value;
          this.itemsSendRegistro.DocumentoTitular = this.DisponibleForm.get('NumeroDocumento')?.value;
          this.itemsSendRegistro.TelefonoTitular = this.DisponibleForm.get('TelefonoDisponible')?.value;

          if (result.Titulares != null && result.Titulares.length !== 0) {
            result.Titulares.forEach(( elementTitulares : any) => {
              if (result.Titulares.length === 1) {
                this.itemsSendRegistro.NombreAutorizado1 = elementTitulares.Nombre;
                this.itemsSendRegistro.DocuementoAutorizado1 = elementTitulares.Documento;
                this.itemsSendRegistro.TelefoinoAutorizado1 = elementTitulares.Telefono;
                this.itemsSendRegistro.CodicionesAutorizado1 = elementTitulares.TipoFirma;
                this.itemsSendRegistro.NombreAutorizado2 = null;
                this.itemsSendRegistro.DocuementoAutorizado2 = null;
                this.itemsSendRegistro.TelefoinoAutorizado2 = null;
                this.itemsSendRegistro.CodicionesAutorizado2 = null;
              }
              return false;
            });
            result.Titulares.forEach(( elementTitulares : any) => {
              if (result.Titulares.length === 2) {
                this.itemsSendRegistro.NombreAutorizado1 = elementTitulares.Nombre;
                this.itemsSendRegistro.DocuementoAutorizado1 = elementTitulares.Documento;
                this.itemsSendRegistro.TelefoinoAutorizado1 = elementTitulares.Telefono;
                this.itemsSendRegistro.CodicionesAutorizado1 = elementTitulares.TipoFirma;
              }
              return false;
            });
            result.Titulares.forEach(( elementTitulares : any) => {
              if (elementTitulares.Documento !== this.itemsSendRegistro.DocuementoAutorizado1) {
                this.itemsSendRegistro.NombreAutorizado2 = elementTitulares.Nombre;
                this.itemsSendRegistro.DocuementoAutorizado2 = elementTitulares.Documento;
                this.itemsSendRegistro.TelefoinoAutorizado2 = elementTitulares.Telefono;
                this.itemsSendRegistro.CodicionesAutorizado2 = elementTitulares.TipoFirma;
              }
              return false;
            });
          } else {
            this.itemsSendRegistro.NombreAutorizado1 = null;
            this.itemsSendRegistro.DocuementoAutorizado1 = null;
            this.itemsSendRegistro.TelefoinoAutorizado1 = null;
            this.itemsSendRegistro.CodicionesAutorizado1 = null;
            this.itemsSendRegistro.NombreAutorizado2 = null;
            this.itemsSendRegistro.DocuementoAutorizado2 = null;
            this.itemsSendRegistro.TelefoinoAutorizado2 = null;
            this.itemsSendRegistro.CodicionesAutorizado2 = null;
          }

        } else if (result.length === 0) {
          this.notif.warning('Advertencia', 'No se encontró registro.', ConfiguracionNotificacion.configRightTop);
          this.clearFrom();
          this.generalesService.Autofocus('SelectBuscar');

        } else if (result.length = 1) {
          this.DisponibleForm.get('BuscarNombre')?.reset();
          
          this.MapearDatosCuenta(result);
          this.btnActualizar = true;
          this.btnActualizarCanales = true;
          this.btnGuardar = true;
          this.bloquearConsultaCuenta = false;
          this.btnCambiarEstado = true;
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
        }
      },
      error => {
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(errorMessage);
      }
    );
  }
  BotonBuscarDisponibles(){
    if (this.DisponibleForm.get('BuscarDocumento')?.value !== null
    && this.DisponibleForm.get('BuscarDocumento')?.value !== undefined
    && this.DisponibleForm.get('BuscarDocumento')?.value !== '') {
      this.BuscarCuentaPorDocumento();
    } else if (this.DisponibleForm.get('BuscarNombre')?.value !== null
      && this.DisponibleForm.get('BuscarNombre')?.value !== undefined
      && this.DisponibleForm.get('BuscarNombre')?.value !== '') {
      this.BuscarCuentaPorNombre();
     }
  }
  async BuscarDatosCuenta(IdOficina : string, IdProductoCuenta : string, IdConsecutivo : string, IdDigito : string) {
    this.loading = true;
    this.ResetValorSeleccionado(1);
    try{
    const result = await this.DisponiblesServices.BuscarCuenta
      ({ 'IdOficina': IdOficina, 'IdProductoCuenta': IdProductoCuenta, 'IdConsecutivo': IdConsecutivo, 'IdDigito': IdDigito }).toPromise()
          this.loading = false;
          this.MapearDatosCuenta(result);;
          this.BloquearBtnRegistroFirma = true;
          this.btnActualizar = true;
          this.btnActualizarCanales = true;
          this.btnGuardar = true;
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
          this.DisponibleForm.get('DocumentoTitular')?.reset();
          this.DisponibleForm.get('NombreTitular')?.reset();
          this.DisponibleForm.get('TipoFirma')?.reset();
          this.DisponibleForm.get('Autorizado')?.reset();
          this.itemsDataObejct = [];
          this.BloquearFormaPago = false;

          this.itemsSendRegistro.Cuenta = this.DisponibleForm.get('Cuenta')?.value;
          this.itemsSendRegistro.Ciudad = this.DisponibleForm.get('NombreOficina')?.value;
          this.itemsSendRegistro.FechaApertura = this.DisponibleForm.get('FechaApertura')?.value;
          this.itemsSendRegistro.NombreTitular = this.DisponibleForm.get('Nombre')?.value;
          this.itemsSendRegistro.DocumentoTitular = this.DisponibleForm.get('NumeroDocumento')?.value;
          this.itemsSendRegistro.TelefonoTitular = this.DisponibleForm.get('TelefonoDisponible')?.value;
            if (result.Titulares.length !== 0) {
              result.Titulares.forEach(( elementTitulares : any) => {
                if (result.Titulares.length === 1) {
                  this.itemsSendRegistro.NombreAutorizado1 = elementTitulares.Nombre;
                  this.itemsSendRegistro.DocuementoAutorizado1 = elementTitulares.Documento;
                  this.itemsSendRegistro.TelefoinoAutorizado1 = elementTitulares.Telefono;
                  this.itemsSendRegistro.CodicionesAutorizado1 = elementTitulares.TipoFirma;
                  this.itemsSendRegistro.NombreAutorizado2 = null;
                  this.itemsSendRegistro.DocuementoAutorizado2 = null;
                  this.itemsSendRegistro.TelefoinoAutorizado2 = null;
                  this.itemsSendRegistro.CodicionesAutorizado2 = null;
                }
                return false;
              });
              result.Titulares.forEach(( elementTitulares : any) => {
                if (result.Titulares.length === 2) {
                  this.itemsSendRegistro.NombreAutorizado1 = elementTitulares.Nombre;
                  this.itemsSendRegistro.DocuementoAutorizado1 = elementTitulares.Documento;
                  this.itemsSendRegistro.TelefoinoAutorizado1 = elementTitulares.Telefono;
                  this.itemsSendRegistro.CodicionesAutorizado1 = elementTitulares.TipoFirma;
                }
                return false;
              });
              result.Titulares.forEach(( elementTitulares : any) => {
                if (elementTitulares.Documento !== this.itemsSendRegistro.DocuementoAutorizado1) {
                  this.itemsSendRegistro.NombreAutorizado2 = elementTitulares.Nombre;
                  this.itemsSendRegistro.DocuementoAutorizado2 = elementTitulares.Documento;
                  this.itemsSendRegistro.TelefoinoAutorizado2 = elementTitulares.Telefono;
                  this.itemsSendRegistro.CodicionesAutorizado2 = elementTitulares.TipoFirma;
                }
                return false;
              });
            } else {
              this.itemsSendRegistro.NombreAutorizado1 = null;
              this.itemsSendRegistro.DocuementoAutorizado1 = null;
              this.itemsSendRegistro.TelefoinoAutorizado1 = null;
              this.itemsSendRegistro.CodicionesAutorizado1 = null;
              this.itemsSendRegistro.NombreAutorizado2 = null;
              this.itemsSendRegistro.DocuementoAutorizado2 = null;
              this.itemsSendRegistro.TelefoinoAutorizado2 = null;
              this.itemsSendRegistro.CodicionesAutorizado2 = null;
            }
        }catch(error) {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.error('Error', errorMessage);
          console.error(errorMessage);
        };
  }
  canalesListOld: any[] = [];
  valorCoberturaTotalGar: number = 0;
  valorRespaldadoTotalGar: number = 0;
  valorDisponibleTotalGar: number = 0;
  MapearDatosCuenta(result : any) {
    this.bloquearConsultaCuenta = false;
    this.BloquearBuscar = false;
    if (result !== null) {
      let datas = localStorage.getItem('Data');
       this.dataUser = JSON.parse(window.atob(datas == null ? "" : datas));
      if (result.length >= 1) {
        this.dataObjet = result;
        this.dataObjetTitulares = [];
        this.dataObjet[0].Titulares.forEach(( x: any) => { this.dataObjetTitulares.push(x) });
        this.dataObjetTitulares.forEach(( x: any) => x.Accion = "DB");
        // Encabezado
        this.DisponibleForm.get('IdCuenta')?.setValue(this.dataObjet[0].IdCuenta);
        this.DisponibleForm.get('Cuenta')?.setValue(this.dataObjet[0].Cuenta);
        this.DisponibleForm.get('IdUsuarioSGF')?.setValue(this.dataUser.IdUsuarioSGF);
        this.DisponibleForm.get('LngTercero')?.setValue(this.dataObjet[0].LngTercero);
        this.DisponibleForm.get('TelefonoDisponible')?.setValue(this.dataObjet[0].TelefonoDisponible);
        this.DisponibleForm.get('DireccionDisponible')?.setValue(this.dataObjet[0].DireccionDisponible);
        this.DisponibleForm.get('TipoDocumento')?.setValue(this.dataObjet[0].TipoDocumento);
        this.DisponibleForm.get('NumeroDocumento')?.setValue(this.dataObjet[0].NumeroDocumento);
        this.DisponibleForm.get('Nombre')?.setValue(this.dataObjet[0].PrimerApellido + ' ' + this.dataObjet[0].SegundoApellido +
          ' ' + this.dataObjet[0].PrimerNombre + ' ' + this.dataObjet[0].SegundoNombre);
        this.DisponibleForm.get('IdAsesor')?.setValue(this.dataObjet[0].IdAsesor);
        if (this.DisponibleForm.get('IdAsesor')?.value === 2) {
          this.DisponibleForm.get('NombreAsesor')?.setValue('Coogranada');
        } else {
          this.DisponibleForm.get('NombreAsesor')?.setValue(this.dataObjet[0].PrimerApellidoAsesor +
            ' ' + this.dataObjet[0].SegundoApellidoAsesor +
            ' ' + this.dataObjet[0].PrimerNombreAsesor + ' ' + this.dataObjet[0].SegundoNombreAsesor);
        }
        this.DisponibleForm.get('NumeroOficina')?.setValue(this.dataObjet[0].IdOficina);
        this.DisponibleForm.get('NombreOficina')?.setValue(this.dataObjet[0].DescripcionOficina);
        this.DisponibleForm.get('IdOficina')?.setValue(this.dataObjet[0].IdOficina);
        this.datoOficina = +this.dataObjet[0].IdOficina;
        this.DisponibleForm.get('IdProducto')?.setValue(this.dataObjet[0].IdProducto);
        this.DisponibleForm.get('DescripcionProducto')?.setValue(this.dataObjet[0].DescripcionProducto);
        this.datoNombreProducto = this.dataObjet[0].DescripcionProducto;
        this.DisponibleForm.get('IdEstado')?.setValue(this.dataObjet[0].IdEstado);
        this.datoCambioEstado = +this.dataObjet[0].IdEstado;
        this.DisponibleForm.get('DescripcionEstado')?.setValue(this.dataObjet[0].DescripcionEstado);
        this.DisponibleForm.get('IdFormaPago')?.setValue(this.dataObjet[0].IdFormaPago);
        this.datoformaPago = +this.dataObjet[0].IdFormaPago;
        this.DisponibleForm.get('DescripcionFormaPago')?.setValue(this.dataObjet[0].DescripcionFormaPago);
        this.DisponibleForm.get('IdProductoCuenta')?.setValue(this.dataObjet[0].IdProducto);
        this.datoProducto = +this.dataObjet[0].IdProducto;
        this.DisponibleForm.get('IdConsecutivo')?.setValue(this.dataObjet[0].IdConsecutivo);
        this.datoConsecutivo = +this.dataObjet[0].IdConsecutivo;
        this.DisponibleForm.get('IdDigito')?.setValue(this.dataObjet[0].IdDigito);
        this.datoDigito = +this.dataObjet[0].IdDigito;
        this.DisponibleForm.get('DescripcionOperacion')?.setValue(this.dataObjet[0].DescripcionOperacion);
        this.DisponibleForm.get('IdOperacion')?.setValue(this.dataObjet[0].IdOperacion);
        this.datoOperacionPermitida = this.dataObjet[0].IdOperacion;
        this.DisponibleForm.get('NumeroOficinaAsociado')?.setValue(this.dataObjet[0].IdOficinaAsociado);
        this.DisponibleForm.get('NombreOficinaAsociado')?.setValue(this.dataObjet[0].DescripcionOficinaAsociado);
        this.DisponibleForm.get('Clase')?.setValue(this.dataObjet[0].IdRelacionTipo);
        this.DisponibleForm.get('IdMedioPago')?.setValue(this.dataObjet[0].IdMedioPago);
        this.datoMedioPago = this.dataObjet[0].IdMedioPago;
        this.AsesorFrom.get('strCodigo')?.setValue(this.dataObjet[0].IdAsesorExterno);
        this.datoAsesorExterno.IdAsesorExterno = +this.dataObjet[0].IdAsesorExterno;
        this.AsesorFrom.get('strNombre')?.setValue(this.dataObjet[0].PrimerNombreAsesorE + ' ' + this.dataObjet[0].SegundoNombreAsesoreE +
          ' ' + this.dataObjet[0].PrimerApellidoAsesorE + ' ' + this.dataObjet[0].SegundoApellidoAsesorE);
        this.datoAsesorExterno.NombreAsesorExterno = this.AsesorFrom.get('strNombre')?.value;
        this.AsesorFrom.get('strNombre')?.setValue(this.AsesorFrom.get('strNombre')?.value.trim());
        // Tabs
        if (this.DisponibleForm.get('IdMedioPago')?.value === 0) {
          //libretas con cupo
          if (this.dataObjet[0].IdCuentaCupo !== 0) {
            this.MostrarLibreta = false;
            this.MostrarTarjeta = true;
            this.MostrarCupo = false;
            this.MostrarGarantias = true;
            this.MostrarDemas = false;
            // Libretas
          } else {
            this.MostrarLibreta = false;
            this.MostrarTarjeta = true;
            this.MostrarCupo = true;
            this.MostrarGarantias = true;
            this.MostrarDemas = false;
          }
          // Tarjetas sin cupo 
        } else if (this.DisponibleForm.get('IdMedioPago')?.value === 10 || this.DisponibleForm.get('IdMedioPago')?.value === 60) {
          this.MostrarLibreta = true;
          this.MostrarTarjeta = false;
          this.MostrarCupo = true;
          this.MostrarGarantias = true;
          this.MostrarDemas = false;
          // Tarjetas con cupo
        } else if (this.DisponibleForm.get('IdMedioPago')?.value === 50 || this.DisponibleForm.get('IdMedioPago')?.value === 70) {
          this.MostrarLibreta = true;
          this.MostrarTarjeta = false;
          this.MostrarCupo = false;
          this.MostrarGarantias = false;
          this.MostrarDemas = false;
        }
        // Fin Encabezado

        if (this.dataObjet[0].ActivaMovimiento === true) {
          this.DisponibleForm.get('ActivaMovimiento')?.setValue(1);
        } else {
          this.DisponibleForm.get('ActivaMovimiento')?.setValue(0);
        }
        if (this.dataObjet[0].Exenta === true) {
          this.DisponibleForm.get('Exenta')?.setValue(1);
        } else {
          this.DisponibleForm.get('Exenta')?.setValue(0);
        }
        if (this.dataObjet[0].ExoneradaGmf === true) {
          this.DisponibleForm.get('ExoneradaGmf')?.setValue(1);
        } else {
          this.DisponibleForm.get('ExoneradaGmf')?.setValue(0);
        }
        if (this.dataObjet[0].TibrarComentario === true) {
          this.DisponibleForm.get('TibrarComentario')?.setValue(1);
        } else {
          this.DisponibleForm.get('TibrarComentario')?.setValue(0);
        }

        // Libreta
        if (this.DisponibleForm.get('IdMedioPago')?.value === 0) {
          if (this.dataObjet[0].IdCuentaCupo !== 0) {
            if (this.dataObjet[0].Cupo !== null) {
              this.DisponibleForm.get('CupoAprobado')?.setValue(this.dataObjet[0].Cupo.CupoAprobado);
              this.cupoAprobadoAnterior = this.dataObjet[0].Cupo.CupoAprobado;
              this.DisponibleForm.get('CupoUtilizado')?.setValue(this.dataObjet[0].Cupo.CupoUtilizado);
              this.DisponibleForm.get('NumeroPagare')?.setValue(this.dataObjet[0].Cupo.NumeroPagare);
              this.DisponibleForm.get('Radicado')?.setValue(this.dataObjet[0].Cupo.Radicado);
              this.RadicadoOld = this.dataObjet[0].Cupo.Radicado;
              this.DisponibleForm.get('IdLinea')?.setValue(this.dataObjet[0].Cupo.IdLinea);
              this.lineaAnterior = this.dataObjet[0].Cupo.IdLinea;
              this.DisponibleForm.get('NombreLinea')?.setValue(this.dataObjet[0].Cupo.NombreLinea);
              this.descripcionLineaAnterior = this.dataObjet[0].Cupo.NombreLinea;
              this.DisponibleForm.get('Monto')?.setValue(this.dataObjet[0].Cupo.CupoUtilizado);
              this.DisponibleForm.get('FechaCredito')?.setValue(
                new DatePipe('en-CO').transform(this.dataObjet[0].Cupo.Fecha, 'yyyy/MM/dd  HH:mm:ss'));
              this.GenerarCuentaCupo(this.dataObjet[0].Cupo.IdOficina, this.dataObjet[0].Cupo.IdProducto,
                this.dataObjet[0].Cupo.IdConsecutivo, this.dataObjet[0].Cupo.IdDigito);
              this.DisponibleForm.get('IdCuentaCupo')?.setValue(this.dataObjet[0].Cupo.IdCuentaCupo);
              this.DisponibleForm.get('PagoMinimo')?.setValue(this.dataObjet[0].PagoMinimo);
              this.DisponibleForm.get('PagoTotal')?.setValue(this.dataObjet[0].PagoTotal);
            }
          }
          if (this.dataObjet[0].Talonarios.length !== 0) {
            this.DisponibleForm.get('Inicial')?.setValue(this.dataObjet[0].Talonarios[0].Inicial);
            this.DisponibleForm.get('Final')?.setValue(this.dataObjet[0].Talonarios[0].Final);
            this.talonario.Inicial = this.dataObjet[0].Talonarios[0].Inicial;
            this.talonario.Final = this.dataObjet[0].Talonarios[0].Final;
            var CobroTotal = 0;
            this.dataObjet[0].Talonarios.forEach(( elementCobro: any) => {
              CobroTotal = (CobroTotal + elementCobro.CobroLibreta);
            });
            this.DisponibleForm.get('LibretaPlastico')?.setValue(CobroTotal);
             this.DisponibleForm.get('MoraCuotaManejo')?.setValue(0);
          } else {
            this.DisponibleForm.get('Inicial')?.setValue("");
            this.DisponibleForm.get('Final')?.setValue("");
          }
        }
        // Fin Libreta

        // tarjeta
        if (this.DisponibleForm.get('IdMedioPago')?.value === 10 || this.DisponibleForm.get('IdMedioPago')?.value === 50 || this.DisponibleForm.get('IdMedioPago')?.value === 60 || this.DisponibleForm.get('IdMedioPago')?.value === 70) {
          this.DisponibleForm.get('IdConvenio')?.setValue(this.dataObjet[0].Tarjetas.IdConvenio);
          this.DisponibleForm.get('NumeroTarjeta')?.setValue(this.dataObjet[0].Tarjetas.NumeroTarjeta);
          this.tarjetaOld = this.dataObjet[0].Tarjetas.NumeroTarjeta;
          this.DisponibleForm.get('CuotaManejo')?.setValue(this.dataObjet[0].Tarjetas.CuotaManejo);
          this.DisponibleForm.get('IdDiaCorte')?.setValue(this.dataObjet[0].Tarjetas.intDiaCorte);
          this.DisponibleForm.get('IdPlazo')?.setValue(this.dataObjet[0].Tarjetas.intPlazo);
          this.DisponibleForm.get('FechaVigenciaTarjeta')?.setValue(new DatePipe('en-CO').transform(this.dataObjet[0].Tarjetas.FechaVigenciaTarjeta, 'yyyy/MM/dd'));
          this.DisponibleForm.get('FechaRediferir')?.setValue(new DatePipe('en-CO').transform(this.dataObjet[0].Tarjetas.FechaRediferir, 'yyyy/MM/dd'));
          this.DisponibleForm.get('FechaCambioPlazo')?.setValue(new DatePipe('en-CO').transform(this.dataObjet[0].Tarjetas.FechaCambioPlazo, 'yyyy/MM/dd'));
          this.DisponibleForm.get('FechaProximoCobro')?.setValue(new DatePipe('en-CO').transform(this.dataObjet[0].Tarjetas.dtmCobro, 'yyyy/MM/dd'));
          this.DisponibleForm.get('ExoCobroHasta')?.setValue(new DatePipe('en-CO').transform(this.dataObjet[0].ExoCobroHasta, 'yyyy/MM/dd'));
          this.DiaCortePago();
          this.Plazo();
          this.DisponibleForm.get('NumeroPagare')?.setValue(this.dataObjet[0].Tarjetas.NumeroPagare);
          this.DisponibleForm.get('MoraCuotaManejo')?.setValue(this.dataObjet[0].Tarjetas.CuotaManejoMora);

          if(this.dataObjet[0].Tarjetas.CuotaManejoMora !== null ){
            this.DisponibleForm.get('LibretaPlastico')?.setValue(this.dataObjet[0].Tarjetas.CobroTarjeta);
          } else {
            this.DisponibleForm.get('LibretaPlastico')?.setValue(0);
          }

          this.DisponibleForm.get('AliasCuenta')?.setValue(this.dataObjet[0].AliasCuenta);
          
          this.dataObjetC = this.dataObjet[0];
          var CodeudorP = this.dataObjet[0].Codeudor;
          this.dataObjetCd = CodeudorP;
          var RealP = this.dataObjet[0].Real;
          if(RealP !== null){
            this.valorCoberturaTotalGar = 0;
            this.valorRespaldadoTotalGar = 0;
            this.valorDisponibleTotalGar = 0;
            const respaldoUnicos = new Set();
            

            this.dataObjetR = RealP;
            this.dataObjetR.forEach(element => {
              const Conbertura = element.ValorCobertura;
              const Resapaldo = element.ValorRespaldado;             
              const Disponible = (Conbertura - Resapaldo);
              element.ValorDisponible = Disponible.toString();

              this.valorCoberturaTotalGar += Number(Conbertura);

              if (!respaldoUnicos.has(Resapaldo)) {
                respaldoUnicos.add(Resapaldo);
                this.valorRespaldadoTotalGar += Number(Resapaldo);
              }

              this.valorDisponibleTotalGar = this.valorCoberturaTotalGar - this.valorRespaldadoTotalGar;
            });
          } else {
            this.dataObjetR.length = 0;
          }
          
        }
        else {
          this.DisponibleForm.get('IdConvenio')?.reset();
          this.DisponibleForm.get('NumeroTarjeta')?.setValue("");
          this.DisponibleForm.get('IdDiaCorte')?.setValue("0");
          this.DisponibleForm.get('IdPlazo')?.setValue("0");
          this.DisponibleForm.get('NumeroPagare')?.setValue("");
        }
        // Fin tarjeta


        // Cupo
        if (this.DisponibleForm.get('IdMedioPago')?.value === 50 || this.DisponibleForm.get('IdMedioPago')?.value === 70) {
          if (this.dataObjet[0].Cupo !== null) {
            this.DisponibleForm.get('CupoAprobado')?.setValue(this.dataObjet[0].Cupo.CupoAprobado);
            this.cupoAprobadoAnterior = this.dataObjet[0].Cupo.CupoAprobado;
            this.DisponibleForm.get('CupoUtilizado')?.setValue(this.dataObjet[0].Cupo.CupoUtilizado);
            this.DisponibleForm.get('NumeroPagare')?.setValue(this.dataObjet[0].Cupo.NumeroPagare);
            this.DisponibleForm.get('Radicado')?.setValue(this.dataObjet[0].Cupo.Radicado);
            this.RadicadoOld = this.dataObjet[0].Cupo.Radicado;
            this.DisponibleForm.get('IdLinea')?.setValue(this.dataObjet[0].Cupo.IdLinea);
            this.lineaAnterior = this.dataObjet[0].Cupo.IdLinea;
            this.DisponibleForm.get('NombreLinea')?.setValue(this.dataObjet[0].Cupo.NombreLinea);
            this.descripcionLineaAnterior = this.dataObjet[0].Cupo.NombreLinea;
            this.DisponibleForm.get('Monto')?.setValue(this.dataObjet[0].Cupo.CupoUtilizado);
            this.DisponibleForm.get('FechaCredito')?.setValue(
            new DatePipe('en-CO').transform(this.dataObjet[0].Cupo.Fecha, 'yyyy/MM/dd  HH:mm:ss'));
            this.GenerarCuentaCupo(this.dataObjet[0].Cupo.IdOficina, this.dataObjet[0].Cupo.IdProducto,
              this.dataObjet[0].Cupo.IdConsecutivo, this.dataObjet[0].Cupo.IdDigito);
            this.DisponibleForm.get('IdCuentaCupo')?.setValue(this.dataObjet[0].Cupo.IdCuentaCupo);
            this.DisponibleForm.get('PagoMinimo')?.setValue(this.dataObjet[0].PagoMinimo);
            this.DisponibleForm.get('PagoTotal')?.setValue(this.dataObjet[0].PagoTotal);
          }
        }

        // Fin cupo

        // saldos

        this.DisponibleForm.get('SaldoInicial')?.setValue(this.dataObjet[0].SaldoInicial);
        if (this.DisponibleForm.get('InteresCausado')?.value === null) {
          this.DisponibleForm.get('InteresCausado')?.setValue(0);
        } else {
          this.DisponibleForm.get('InteresCausado')?.setValue(this.dataObjet[0].InteresCausado);
        }
        this.DisponibleForm.get('SaldoMinimo')?.setValue(this.dataObjet[0].SaldoMinimo);
        this.DisponibleForm.get('ValorExonerado')?.setValue(this.dataObjet[0].SaldoExonerado == null ? 0.0 : this.dataObjet[0].SaldoExonerado );
        this.DisponibleForm.get('InteresdelPeriodo')?.setValue(this.dataObjet[0].InteresPeriodo);
        this.DisponibleForm.get('Canje')?.setValue(this.dataObjet[0].Canje);
        this.DisponibleForm.get('RetiroDelPerido')?.setValue(this.dataObjet[0].RetirosPeriodos);
        this.DisponibleForm.get('RetencionFuentePeriodo')?.setValue(this.dataObjet[0].RetencionPeriodos);
        this.DisponibleForm.get('RetiroPeriodo')?.setValue(this.dataObjet[0].RetirosPeriodos == null ? 0.0 : this.dataObjet[0].RetirosPeriodos);
        this.DisponibleForm.get('Efectivo')?.setValue(this.dataObjet[0].Efectivo);
        this.DisponibleForm.get('SaldoPromedioMesAnterior')?.setValue(this.dataObjet[0].SaldoPromedioMesAnterior);
        this.DisponibleForm.get('InteresMesAnterior')?.setValue(this.dataObjet[0].InteresMesAnterior);
        this.DisponibleForm.get('GMFAdescontar')?.setValue(this.dataObjet[0].GMFAdescontar)

        // fin saldos

        this.ObtenerHistorial();
        this.DisponibleForm.get('FechaApertura')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet[0].FechaApertura, 'yyyy/MM/dd  HH:mm:ss'));
        this.DisponibleForm.get('FechaUltimaTrans')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet[0].FechaUltimaTrans, 'yyyy/MM/dd  HH:mm:ss'));
        if (this.dataObjet.FechaCancelacion != null) {
          this.DisponibleForm.get('FechaCancelacion')?.setValue(
            new DatePipe('en-CO').transform(this.dataObjet[0].FechaCancelacion, 'yyyy/MM/dd  HH:mm:ss'));
        } else {
          this.DisponibleForm.get('FechaCancelacion')?.reset();
        }
        this.DisponibleForm.get('FechaMarcaGMF')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet[0].FechaMarcaGMF, 'yyyy/MM/dd  HH:mm:ss'));
        this.DisponibleForm.get('FechaDesmarcaGMF')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet[0].FechaDesmarcaGMF, 'yyyy/MM/dd  HH:mm:ss'));
        this.SaldoTotal();
        this.DisponibleForm.get('BuscarDocumento')?.reset();
        this.DisponibleForm.get('BuscarNombre')?.reset();
        this.BloquearBuscar = false;
        //this.DisponibleOperacionFrom.get('Codigo')?.reset();
        this.dataObjetO = result;
        this.dataObjet.Titulares = this.dataObjet[0].Titulares;


      } else {
        this.dataObjet = result;
        this.dataObjetTitulares = [];
        this.dataObjet.Titulares.forEach(( x: any) => { this.dataObjetTitulares.push(x) });
        this.dataObjetTitulares.forEach(( x: any) => x.Accion = "DB");
         // Encabezado
        this.DisponibleForm.get('IdCuenta')?.setValue(this.dataObjet.IdCuenta);
        this.DisponibleForm.get('Cuenta')?.setValue(this.dataObjet.Cuenta);
        this.DisponibleForm.get('IdUsuarioSGF')?.setValue(this.dataUser.IdUsuarioSGF);
        this.DisponibleForm.get('LngTercero')?.setValue(this.dataObjet.LngTercero);
        this.DisponibleForm.get('TelefonoDisponible')?.setValue(this.dataObjet.TelefonoDisponible);
        this.DisponibleForm.get('DireccionDisponible')?.setValue(this.dataObjet.DireccionDisponible);
        this.DisponibleForm.get('TipoDocumento')?.setValue(this.dataObjet.TipoDocumento);
        this.DisponibleForm.get('NumeroDocumento')?.setValue(this.dataObjet.NumeroDocumento);
        this.DisponibleForm.get('Nombre')?.setValue(this.dataObjet.PrimerApellido + ' ' + this.dataObjet.SegundoApellido +
          ' ' + this.dataObjet.PrimerNombre + ' ' + this.dataObjet.SegundoNombre);
        this.DisponibleForm.get('IdAsesor')?.setValue(this.dataObjet.IdAsesor);
        if (this.DisponibleForm.get('IdAsesor')?.value === 2) {
          this.DisponibleForm.get('NombreAsesor')?.setValue('Coogranada');
        } else {
          this.DisponibleForm.get('NombreAsesor')?.setValue(this.dataObjet.PrimerApellidoAsesor +
            ' ' + this.dataObjet.SegundoApellidoAsesor +
            ' ' + this.dataObjet.PrimerNombreAsesor + ' ' + this.dataObjet.SegundoNombreAsesor);
        }
        this.DisponibleForm.get('NumeroOficina')?.setValue(this.dataObjet.IdOficina);
        this.DisponibleForm.get('NombreOficina')?.setValue(this.dataObjet.DescripcionOficina);
        this.DisponibleForm.get('IdOficina')?.setValue(this.dataObjet.IdOficina);
        this.datoOficina = +this.dataObjet.IdOficina;
        this.DisponibleForm.get('IdProducto')?.setValue(this.dataObjet.IdProducto);
        this.DisponibleForm.get('DescripcionProducto')?.setValue(this.dataObjet.DescripcionProducto);
        this.datoNombreProducto = this.dataObjet.DescripcionProducto;
        this.DisponibleForm.get('IdEstado')?.setValue(this.dataObjet.IdEstado);
        this.datoCambioEstado = +this.dataObjet.IdEstado;
        this.DisponibleForm.get('DescripcionEstado')?.setValue(this.dataObjet.DescripcionEstado);
        this.DisponibleForm.get('IdFormaPago')?.setValue(this.dataObjet.IdFormaPago);
        this.datoformaPago = +this.dataObjet.IdFormaPago;
        this.DisponibleForm.get('DescripcionFormaPago')?.setValue(this.dataObjet.DescripcionFormaPago);
        this.DisponibleForm.get('IdProductoCuenta')?.setValue(this.dataObjet.IdProducto);
         this.datoProducto = +this.dataObjet.IdProducto;
        this.DisponibleForm.get('IdConsecutivo')?.setValue(this.dataObjet.IdConsecutivo);
        this.datoConsecutivo = +this.dataObjet.IdConsecutivo;
        this.DisponibleForm.get('IdDigito')?.setValue(this.dataObjet.IdDigito);
        this.datoDigito = +this.dataObjet.IdDigito;
        this.DisponibleForm.get('DescripcionOperacion')?.setValue(this.dataObjet.DescripcionOperacion);
        this.DisponibleForm.get('IdOperacion')?.setValue(this.dataObjet.IdOperacion);
        this.datoOperacionPermitida = this.dataObjet.IdOperacion;
        this.DisponibleForm.get('NumeroOficinaAsociado')?.setValue(this.dataObjet.IdOficinaAsociado);
        this.DisponibleForm.get('NombreOficinaAsociado')?.setValue(this.dataObjet.DescripcionOficinaAsociado);
        this.DisponibleForm.get('Clase')?.setValue(this.dataObjet.IdRelacionTipo);
        this.DisponibleForm.get('IdMedioPago')?.setValue(this.dataObjet.IdMedioPago);
        this.datoMedioPago = this.dataObjet.IdMedioPago;
        this.AsesorFrom.get('strCodigo')?.setValue(this.dataObjet.IdAsesorExterno);
        this.datoAsesorExterno.IdAsesorExterno = +this.dataObjet.IdAsesorExterno;
        this.AsesorFrom.get('strNombre')?.setValue(this.dataObjet.PrimerNombreAsesorE + ' ' + this.dataObjet.SegundoNombreAsesoreE +
          ' ' + this.dataObjet.PrimerApellidoAsesorE + ' ' + this.dataObjet.SegundoApellidoAsesorE);
        this.datoAsesorExterno.NombreAsesorExterno = this.AsesorFrom.get('strNombre')?.value;
        this.AsesorFrom.get('strNombre')?.setValue(this.AsesorFrom.get('strNombre')?.value.trim());
        // tabs 
        if (this.DisponibleForm.get('IdMedioPago')?.value === 0) {
          // libreta con cupo
          if (this.dataObjet.IdCuentaCupo !== 0) {
            this.MostrarLibreta = false;
            this.MostrarTarjeta = true;
            this.MostrarCupo = false;
            this.MostrarGarantias = true;
            this.MostrarDemas = false;
            // libreta
          } else {
            this.MostrarLibreta = false;
            this.MostrarTarjeta = true;
            this.MostrarCupo = true;
            this.MostrarGarantias = true;
            this.MostrarDemas = false;
          }
          // Tarjeta
        } else if (this.DisponibleForm.get('IdMedioPago')?.value === 10 || this.DisponibleForm.get('IdMedioPago')?.value === 60) {
          this.MostrarLibreta = true;
          this.MostrarTarjeta = false;
          this.MostrarCupo = true;
          this.MostrarGarantias = true;
          this.MostrarDemas = false;
          // Tarjeta con cupo
        } else if (this.DisponibleForm.get('IdMedioPago')?.value === 50 || this.DisponibleForm.get('IdMedioPago')?.value === 70) {
          this.MostrarLibreta = true;
          this.MostrarTarjeta = false;
          this.MostrarCupo = false;
          this.MostrarGarantias = false;
          this.MostrarDemas = false;
        }
        // Fin Encabezado

        if (this.dataObjet.ActivaMovimiento === true) {
          this.DisponibleForm.get('ActivaMovimiento')?.setValue(1);
        } else {
          this.DisponibleForm.get('ActivaMovimiento')?.setValue(0);
        }
        if (this.dataObjet.Exenta === true) {
          this.DisponibleForm.get('Exenta')?.setValue(1);
        } else {
          this.DisponibleForm.get('Exenta')?.setValue(0);
        }
        if (this.dataObjet.ExoneradaGmf === true) {
          this.DisponibleForm.get('ExoneradaGmf')?.setValue(1);
        } else {
          this.DisponibleForm.get('ExoneradaGmf')?.setValue(0);
        }
        if (this.dataObjet.TibrarComentario === true) {
          this.DisponibleForm.get('TibrarComentario')?.setValue(1);
        } else {
          this.DisponibleForm.get('TibrarComentario')?.setValue(0);
        }

        // Libreta
        if (this.DisponibleForm.get('IdMedioPago')?.value === 0) {
          if (this.dataObjet.IdCuentaCupo !== 0) {
            if (this.dataObjet.Cupo !== null) {
              this.DisponibleForm.get('CupoAprobado')?.setValue(this.dataObjet.Cupo.CupoAprobado);
              this.cupoAprobadoAnterior = this.dataObjet.Cupo.CupoAprobado;
              this.DisponibleForm.get('CupoUtilizado')?.setValue(this.dataObjet.Cupo.CupoUtilizado);
              this.DisponibleForm.get('NumeroPagare')?.setValue(this.dataObjet.Cupo.NumeroPagare);
              this.DisponibleForm.get('Radicado')?.setValue(this.dataObjet.Cupo.Radicado);
              this.RadicadoOld = this.dataObjet.Cupo.Radicado;
              this.DisponibleForm.get('IdLinea')?.setValue(this.dataObjet.Cupo.IdLinea);
              this.lineaAnterior = this.dataObjet.Cupo.IdLinea;
              this.DisponibleForm.get('NombreLinea')?.setValue(this.dataObjet.Cupo.NombreLinea);
              this.descripcionLineaAnterior = this.dataObjet.Cupo.NombreLinea;
              this.DisponibleForm.get('Monto')?.setValue(this.dataObjet.Cupo.CupoUtilizado);
              this.DisponibleForm.get('FechaCredito')?.setValue(
                new DatePipe('en-CO').transform(this.dataObjet.Cupo.Fecha, 'yyyy/MM/dd  HH:mm:ss'));
              this.GenerarCuentaCupo(this.dataObjet.Cupo.IdOficina, this.dataObjet.Cupo.IdProducto,
                this.dataObjet.Cupo.IdConsecutivo, this.dataObjet.Cupo.IdDigito);
              this.DisponibleForm.get('IdCuentaCupo')?.setValue(this.dataObjet.Cupo.IdCuentaCupo);
              this.DisponibleForm.get('PagoMinimo')?.setValue(this.dataObjet.PagoMinimo);
              this.DisponibleForm.get('PagoTotal')?.setValue(this.dataObjet.PagoTotal);
            }
          }
          if (this.dataObjet.Talonarios.length !== 0) {
            this.DisponibleForm.get('Inicial')?.setValue(this.dataObjet.Talonarios[0].Inicial);
            this.DisponibleForm.get('Final')?.setValue(this.dataObjet.Talonarios[0].Final);
            this.talonario.Inicial = this.dataObjet.Talonarios[0].Inicial;
            this.talonario.Final = this.dataObjet.Talonarios[0].Final;
            var CobroTotal = 0;
            this.dataObjet.Talonarios.forEach(( elementCobro: any) => {
              CobroTotal = (CobroTotal + elementCobro.CobroLibreta);
            });
            this.DisponibleForm.get('LibretaPlastico')?.setValue(CobroTotal);
            this.DisponibleForm.get('MoraCuotaManejo')?.setValue(0);
          } else {
            this.DisponibleForm.get('Inicial')?.setValue("");
            this.DisponibleForm.get('Final')?.setValue("");
          }
        }
        // Fin Libreta

        // tarjeta
        if (this.DisponibleForm.get('IdMedioPago')?.value === 10 || this.DisponibleForm.get('IdMedioPago')?.value === 50 || this.DisponibleForm.get('IdMedioPago')?.value === 60 || this.DisponibleForm.get('IdMedioPago')?.value === 70) {
          this.resultPlazo = undefined;
          this.resultDiaCortePago = undefined;
          this.DisponibleForm.get('IdConvenio')?.setValue(this.dataObjet.Tarjetas.IdConvenio);
          this.DisponibleForm.get('NumeroTarjeta')?.setValue(this.dataObjet.Tarjetas.NumeroTarjeta);
          this.tarjetaOld = this.dataObjet.Tarjetas.NumeroTarjeta;
          this.DisponibleForm.get('CuotaManejo')?.setValue(this.dataObjet.Tarjetas.CuotaManejo);
          this.DisponibleForm.get('IdDiaCorte')?.setValue(this.dataObjet.Tarjetas.intDiaCorte);
          this.DisponibleForm.get('IdPlazo')?.setValue(this.dataObjet.Tarjetas.intPlazo);
          this.DisponibleForm.get('FechaVigenciaTarjeta')?.setValue(
            new DatePipe('en-CO').transform(this.dataObjet.Tarjetas.FechaVigenciaTarjeta, 'yyyy/MM/dd'));
          this.DisponibleForm.get('FechaRediferir')?.setValue(
            new DatePipe('en-CO').transform(this.dataObjet.Tarjetas.FechaRediferir, 'yyyy/MM/dd'));
          this.DisponibleForm.get('FechaCambioPlazo')?.setValue(
            new DatePipe('en-CO').transform(this.dataObjet.Tarjetas.FechaCambioPlazo, 'yyyy/MM/dd'));
            this.DisponibleForm.get('FechaProximoCobro')?.setValue(
              new DatePipe('en-CO').transform(this.dataObjet.Tarjetas.dtmCobro, 'yyyy/MM/dd'));
          this.DisponibleForm.get('ExoCobroHasta')?.setValue(
            new DatePipe('en-CO').transform(this.dataObjet.ExoCobroHasta, 'yyyy/MM/dd'));
          this.DiaCortePago();
          this.Plazo();
          this.DisponibleForm.get('NumeroPagare')?.setValue(this.dataObjet.Tarjetas.NumeroPagare);
          this.DisponibleForm.get('MoraCuotaManejo')?.setValue(this.dataObjet.Tarjetas.CuotaManejoMora);
          if(this.dataObjet.Tarjetas.CobroTarjeta !== null ){
            this.DisponibleForm.get('LibretaPlastico')?.setValue(this.dataObjet.Tarjetas.CobroTarjeta);
          } else {
            this.DisponibleForm.get('LibretaPlastico')?.setValue(0);
          }

          this.DisponibleForm.get('AliasCuenta')?.setValue(this.dataObjet.AliasCuenta);
         console.log("codeudor",this.dataObjet.Codeudor)

         this.valorCoberturaTotalGar = 0;
         this.valorRespaldadoTotalGar = 0;
         this.valorDisponibleTotalGar = 0;
         const respaldoUnicos = new Set();

          this.dataObjetC = result;
          this.dataObjetCd = (this.dataObjet.Codeudor);
          this.dataObjetR = (this.dataObjet.Real);
          if (this.dataObjetR.length != 0){  
            this.dataObjetR.forEach(element => {
              const Conbertura = element.ValorCobertura;
              const Resapaldo = element.ValorRespaldado;
              const Disponible = (Conbertura - Resapaldo);
              element.ValorDisponible = Disponible.toString();
            });   
            this.dataObjetR.forEach(element => {

              this.valorCoberturaTotalGar += Number(element.ValorCobertura);

              if (!respaldoUnicos.has(element.ValorRespaldado)) {
                respaldoUnicos.add(element.ValorRespaldado);
                this.valorRespaldadoTotalGar += Number(element.ValorRespaldado);
              }

              this.valorDisponibleTotalGar = this.valorCoberturaTotalGar - this.valorRespaldadoTotalGar;
            }); 
          }

        } else {
          this.DisponibleForm.get('IdConvenio')?.reset()
          this.DisponibleForm.get('NumeroTarjeta')?.setValue("");
          this.DisponibleForm.get('IdDiaCorte')?.setValue("0");
          this.DisponibleForm.get('IdPlazo')?.setValue("0");
        }
        // Fin tarjeta

        if (this.DisponibleForm.get('IdMedioPago')?.value === 60 || this.DisponibleForm.get('IdMedioPago')?.value === 70)
          this.DisponibleForm.get('NumeroTarjeta')?.setValue("");
        // Cupo
        if (this.DisponibleForm.get('IdMedioPago')?.value === 50 || this.DisponibleForm.get('IdMedioPago')?.value === 70) {
          if (this.dataObjet.Cupo !== null) {
            this.DisponibleForm.get('CupoAprobado')?.setValue(this.dataObjet.Cupo.CupoAprobado);
            this.cupoAprobadoAnterior = this.dataObjet.Cupo.CupoAprobado;
            this.DisponibleForm.get('CupoUtilizado')?.setValue(this.dataObjet.Cupo.CupoUtilizado);
            this.DisponibleForm.get('NumeroPagare')?.setValue(this.dataObjet.Cupo.NumeroPagare);
            this.DisponibleForm.get('Radicado')?.setValue(this.dataObjet.Cupo.Radicado);
            this.RadicadoOld = this.dataObjet.Cupo.Radicado;
            this.DisponibleForm.get('IdLinea')?.setValue(this.dataObjet.Cupo.IdLinea);
            this.lineaAnterior = this.dataObjet.Cupo.IdLinea;
            this.DisponibleForm.get('NombreLinea')?.setValue(this.dataObjet.Cupo.NombreLinea);
            this.descripcionLineaAnterior = this.dataObjet.Cupo.NombreLinea;
            this.DisponibleForm.get('Monto')?.setValue(this.dataObjet.Cupo.CupoUtilizado);
            this.DisponibleForm.get('FechaCredito')?.setValue(
              new DatePipe('en-CO').transform(this.dataObjet.Cupo.Fecha, 'yyyy/MM/dd  HH:mm:ss'));
            this.GenerarCuentaCupo(this.dataObjet.Cupo.IdOficina, this.dataObjet.Cupo.IdProducto,
              this.dataObjet.Cupo.IdConsecutivo, this.dataObjet.Cupo.IdDigito);
            this.DisponibleForm.get('IdCuentaCupo')?.setValue(this.dataObjet.Cupo.IdCuentaCupo);
            this.DisponibleForm.get('PagoMinimo')?.setValue(this.dataObjet.PagoMinimo);
            this.DisponibleForm.get('PagoTotal')?.setValue(this.dataObjet.PagoTotal);
          }
        }

        // Fin cupo

        // saldos

        this.DisponibleForm.get('SaldoInicial')?.setValue(this.dataObjet.SaldoInicial);
        if (this.DisponibleForm.get('InteresCausado')?.value === null) {
          this.DisponibleForm.get('InteresCausado')?.setValue(0);
        } else {
          this.DisponibleForm.get('InteresCausado')?.setValue(this.dataObjet.InteresCausado);
        }
        this.DisponibleForm.get('SaldoMinimo')?.setValue(this.dataObjet.SaldoMinimo);
        this.DisponibleForm.get('ValorExonerado')?.setValue(this.dataObjet.SaldoExonerado == null ? 0.0 :this.dataObjet.SaldoExonerado);
        this.DisponibleForm.get('InteresdelPeriodo')?.setValue(this.dataObjet.InteresPeriodo);
        this.DisponibleForm.get('Canje')?.setValue(this.dataObjet.Canje);
        this.DisponibleForm.get('RetiroDelPerido')?.setValue(this.dataObjet.RetirosPeriodos);
        this.DisponibleForm.get('RetencionFuentePeriodo')?.setValue(this.dataObjet.RetencionPeriodos);
        this.DisponibleForm.get('RetiroPeriodo')?.setValue(this.dataObjet.RetirosPeriodos == null ? 0.0 : this.dataObjet.RetirosPeriodos);
        this.DisponibleForm.get('Efectivo')?.setValue(this.dataObjet.Efectivo);
        this.DisponibleForm.get('SaldoPromedioMesAnterior')?.setValue(this.dataObjet.SaldoPromedioMesAnterior);
        this.DisponibleForm.get('InteresMesAnterior')?.setValue(this.dataObjet.InteresMesAnterior);
        this.DisponibleForm.get('GMFAdescontar')?.setValue(this.dataObjet.GMFAdescontar);

        // fin saldos

        // Historial
        this.ObtenerHistorial();
        this.DisponibleForm.get('FechaApertura')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaApertura, 'yyyy/MM/dd  HH:mm:ss'));
        this.DisponibleForm.get('FechaUltimaTrans')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaUltimaTrans, 'yyyy/MM/dd  HH:mm:ss'));
        if (this.dataObjet.FechaCancelacion != null) {
          this.DisponibleForm.get('FechaCancelacion')?.setValue(
            new DatePipe('en-CO').transform(this.dataObjet.FechaCancelacion, 'yyyy/MM/dd  HH:mm:ss'));
        } else {
          this.DisponibleForm.get('FechaCancelacion')?.reset();
        }
        this.DisponibleForm.get('FechaMarcaGMF')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaMarcaGMF, 'yyyy/MM/dd  HH:mm:ss'));
        this.DisponibleForm.get('FechaDesmarcaGMF')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaDesmarcaGMF, 'yyyy/MM/dd  HH:mm:ss'));
        // fin historial


        this.SaldoTotal();
        this.DisponibleForm.get('BuscarDocumento')?.reset();
        this.DisponibleForm.get('BuscarNombre')?.reset();
        this.BloquearBuscar = false;
       // this.DisponibleOperacionFrom.get('Codigo')?.reset();
        this.dataObjetO = result;
        this.dataObjet.Titulares = this.dataObjet.Titulares;
      }
      this.fetchActiveLibretas();
      if (this.DisponibleOperacionFrom.get('Codigo')?.value == 34 && this.AsignarCupo) 
        this.GuardarGarantiasAndLog("guardar");
      
      this.bloquearConsultaCuenta = false;
    } else {
      this.notif.warning('Advertencia', 'La cuenta no existe.', ConfiguracionNotificacion.configRightTop);
      // this.clearCampos();
      this.dataObjet = undefined;
    }
    this.canalesListOld = [];
    if (this.dataObjetC != null && this.dataObjetC.Canales != null) {
      this.dataObjetC.Canales.forEach(( x: any) => {
        this.canalesListOld.push(x) 
      });
    }
    if (this.DisponibleOperacionFrom.get('Codigo')?.value === '110')
      this.DisponibleForm.get('ExoCobroHasta')?.setValue(this.ExoCobroHastaOld)
  }
  ObtenerRelacion() {
    this.DisponiblesServices.ObtenerRelacion().subscribe(
      result => {
        this.resultRelacion = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  BuscarAsociado() {
    this.DisponiblesServices.BuscarAsesor(this.DisponibleForm.get('IdAsesor')?.value, '*').subscribe(
      result => {
        this.loading = false;
        if (result.length === 1) {
          this.MapearDatosAsesor(result);
          this.Asociado();
        }
      });
  }
  Asociado() {
    if (this.DisponibleOperacionFrom.get('Codigo')?.value === '10') {      
      this.DisponibleForm.get('IdFormaPago')?.setValue(0);
      let Documento = '*';
      let Nombre = '*';
      if (this.DisponibleForm.get('NumeroDocumento')?.value !== null
        && this.DisponibleForm.get('NumeroDocumento')?.value !== undefined
        && this.DisponibleForm.get('NumeroDocumento')?.value !== ''
        || this.DisponibleForm.get('Nombre')?.value !== null
        && this.DisponibleForm.get('Nombre')?.value !== undefined
        && this.DisponibleForm.get('Nombre')?.value !== '') {

        if (this.DisponibleForm.get('NumeroDocumento')?.value !== null
          && this.DisponibleForm.get('NumeroDocumento')?.value !== undefined
          && this.DisponibleForm.get('NumeroDocumento')?.value !== '') {
          Documento = this.DisponibleForm.get('NumeroDocumento')?.value;
        } else if (this.DisponibleForm.get('Nombre')?.value !== null
          && this.DisponibleForm.get('Nombre')?.value !== undefined
          && this.DisponibleForm.get('Nombre')?.value !== '') {
          Nombre = this.DisponibleForm.get('Nombre')?.value;
        }
        if (this.DisponibleForm.get('DocumentoAsesor')?.value !== this.DisponibleForm.get('NumeroDocumento')?.value) {

          this.loading = true;
          this.DisponiblesServices.BuscarAsociado(Documento, Nombre).subscribe(
            result => {
              this.loading = false;
              if (result.length === 0) {               
                      this.BloquaerProducto = false;
                      this.BloquearFormaPago = false;
                      this.LimpiarCampos('IdProducto');
                      this.LimpiarCampos('DescripcionProducto');
                      this.DisponibleForm.controls["IdMedioPago"].setValue("9999");
                      this.DisponibleForm.controls["IdConvenio"].setValue("");
                      this.DisponibleForm.controls['NumeroTarjeta'].setValue("");
                      this.DisponibleForm.controls['NumeroPagare'].setValue("");
                      this.DisponibleForm.controls['Inicial'].setValue("");
                      this.DisponibleForm.controls['Final'].setValue("");
                      this.DisponibleForm.controls['IdDiaCorte'].setValue("0");
                      this.DisponibleForm.controls['IdPlazo'].setValue("0");
                      this.resultMedioPago = [];
                      this.BloquearCuponInicial = false;
                      this.BloquearConvenio = false;
                      this.BloquearNumeroTarjeta = false;
                      this.BloquearPagare = false;
                      this.BloquearDiaCortePlazo = false;
                      this.notif.warning('Advertencia', 'No se encontró el asociado.', ConfiguracionNotificacion.configRightTop);                  
              } else if (result.length > 0) {
          if (result.length === 1) {
            this.DisponiblesServices.ValidaFechaActualiza(result[0].lngTercero).subscribe(
              resultV => {
                const fechaHoyString = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
                const fechaActualizaString = new DatePipe('en-CO').transform(resultV.FechaActualizacion, 'yyyy/MM/dd');

                const fechaHoy = new Date(fechaHoyString == null ? "" : fechaHoyString);
                const fechaActualiza = new Date(fechaActualizaString == null ? "" : fechaActualizaString);

                const diferenciaEnDias = this.calcularDiferenciaEnDias(fechaHoy, fechaActualiza);

                if (diferenciaEnDias <= 180) {
                  this.BuscarAsociadoModal(result[0].NumeroDocumento);
                  this.generalesService.Autofocus('SelectProducto');
                } else {
                  this.notif.warning('Advertencia', 'Asociado debe actualizar datos.', ConfiguracionNotificacion.configRightTop);
                  this.DisponibleForm.get('NumeroDocumento')?.reset();
                }
              },
            ); 
                } else {
                  this.resultAsociados = result;
                  this.ModalAsociados.nativeElement.click();
                }
                this.BloquaerProducto = null;
                this.BloquearFormaPago = null;
                this.LimpiarCampos('IdProducto');
                this.LimpiarCampos('DescripcionProducto');
                this.DisponibleForm.controls["IdMedioPago"].setValue("9999");
                this.DisponibleForm.controls["IdConvenio"].setValue("");
                this.DisponibleForm.controls['NumeroTarjeta'].setValue("");
                this.DisponibleForm.controls['NumeroPagare'].setValue("");
                this.DisponibleForm.controls['Inicial'].setValue("");
                this.DisponibleForm.controls['Final'].setValue("");
                this.DisponibleForm.controls['IdDiaCorte'].setValue("0");
                this.DisponibleForm.controls['IdPlazo'].setValue("0");
                this.resultMedioPago = [];
                this.BloquearCuponInicial = false;
                this.BloquearConvenio = false;
                this.BloquearNumeroTarjeta = false;
                this.BloquearPagare = false;
                this.BloquearDiaCortePlazo = false;
              } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                if (result.Mensaje === 'Gerencia de desarrollo.') {
                  swal.fire({
                    title: '<strong>! Advertencia ¡</strong>',
                    text: '',
                    icon: 'error',
                    animation: false,
                    html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                      + result.Mensaje + '.',
                    //customClass: 'animated tada',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  });
                } else if (result.Mensaje === 'Oficial de cumplimiento.') {
                  swal.fire({
                    title: '<strong>! Advertencia ¡</strong>',
                    text: '',
                    icon: 'error',
                    animation: false,
                    html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                      + result.Mensaje + '.',
                    //customClass: 'animated tada',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  });
                } else {
                  this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
                  this.clearFrom();
                  this.MapearDatosUsuario();
                  this.Encabezado();
                  this.OperacionPermitida();
                  this.btnGuardar = false;
                  this.BloquearFormaPago = null;
                  this.BloquearAsociado = null;
                  this.BloquearBuscar = false;
                  this.bloquearConsultaCuenta = false;
                }
                this.clearFrom();
                this.MapearDatosUsuario();
                this.Encabezado();
                this.OperacionPermitida();
                this.btnGuardar = false;
                this.BloquearFormaPago = null;
                this.BloquearAsociado = null;
                this.BloquearBuscar = false;
                this.bloquearConsultaCuenta = false;
              }
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          );
        } else {
          this.notif.warning('Advertencia', 'La apertura debe ser de diferente titular.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleForm.get('NumeroDocumento')?.reset();
        }
      }
    } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '40') {      
      this.DisponibleForm.get('IdFormaPago')?.setValue(0);
      let Documento = '*';
      let Nombre = '*';
      if (this.DisponibleForm.get('NumeroDocumento')?.value !== null
        && this.DisponibleForm.get('NumeroDocumento')?.value !== undefined
        && this.DisponibleForm.get('NumeroDocumento')?.value !== ''
        || this.DisponibleForm.get('Nombre')?.value !== null
      && this.DisponibleForm.get('Nombre')?.value !== undefined
      && this.DisponibleForm.get('Nombre')?.value !== '') {

        if (this.DisponibleForm.get('NumeroDocumento')?.value !== null
          && this.DisponibleForm.get('NumeroDocumento')?.value !== undefined
          && this.DisponibleForm.get('NumeroDocumento')?.value !== '') {
          Documento = this.DisponibleForm.get('NumeroDocumento')?.value;
        } else if (this.DisponibleForm.get('Nombre')?.value !== null
          && this.DisponibleForm.get('Nombre')?.value !== undefined
          && this.DisponibleForm.get('Nombre')?.value !== '') {
          Nombre = this.DisponibleForm.get('Nombre')?.value;
        }
        if (this.DisponibleForm.get('DocumentoAsesor')?.value === this.DisponibleForm.get('NumeroDocumento')?.value) {

          this.loading = true;
          this.DisponiblesServices.BuscarAsociado(Documento, Nombre).subscribe(
            result => {
              this.loading = false;
              if (result.length === 0) {
                this.notif.warning('Advertencia', 'No se encontró el asociado.', ConfiguracionNotificacion.configRightTop);
              } else if (result.length === 1) {
                this.DisponibleForm.get('NumeroDocumento')?.setValue(result[0].NumeroDocumento);
                this.DisponibleForm.get('Nombre')?.setValue(result[0].PrimerApellido + ' ' +
                  result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
                this.DisponibleForm.get('NumeroOficinaAsociado')?.setValue(result[0].IdOficina);
                this.DisponibleForm.get('NombreOficinaAsociado')?.setValue(result[0].NombreOficina);
                this.DisponibleForm.get('Clase')?.setValue(result[0].IdRelacionTipo);
                this.DisponibleForm.get('LngTercero')?.setValue(result[0].lngTercero);
                this.DisponibleForm.get('Edad')?.setValue(result[0].Edad);
                this.BloquaerProducto = null;
                this.BloquearFormaPago = null;
                this.generalesService.Autofocus('SelectProducto');
              } else if (result.length > 1) {
                this.resultAsociados = result;
                this.ModalAsociados.nativeElement.click();

                this.BloquaerProducto = null;
                this.BloquearFormaPago = null;
              } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                if (result.Mensaje === 'Gerencia de desarrollo.') {
                  swal.fire({
                    title: '<strong>! Advertencia ¡</strong>',
                    text: '',
                    icon: 'error',
                    animation: false,
                    html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                      + result.Mensaje + '.',
                    //customClass: 'animated tada',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  });
                } else if (result.Mensaje === 'Oficial de cumplimiento.') {
                  swal.fire({
                    title: '<strong>! Advertencia ¡</strong>',
                    text: '',
                    icon: 'error',
                    animation: false,
                    html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                      + result.Mensaje + '.',
                    //customClass: 'animated tada',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  });
                } else {
                  this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
                  this.clearFrom();
                  this.MapearDatosUsuario();
                  this.Encabezado();
                  this.OperacionPermitida();
                  this.btnGuardar = false;
                  this.BloquearFormaPago = null;
                  this.BloquearAsociado = null;
                  this.BloquearBuscar = false;
                  this.bloquearConsultaCuenta = false;
                }
                this.clearFrom();
                this.MapearDatosUsuario();
                this.Encabezado();
                this.OperacionPermitida();
                this.btnGuardar = false;
                this.BloquearFormaPago = null;
                this.BloquearAsociado = null;
                this.BloquearBuscar = false;
                this.bloquearConsultaCuenta = false;
              }
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          );
        } else {
          this.notif.warning('Advertencia', 'La apertura debe ser del mismo titular.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleForm.get('NumeroDocumento')?.reset();
        }
      }
    }
  } 
  Encabezado() {
    this.DisponiblesServices.Encabezado().subscribe(
      result => {
        this.DisponibleForm.get('DescripcionEstado')?.setValue(result[0].DescripcionEstado);
        this.DisponibleForm.get('DescripcionFormaPago')?.setValue(result[1].DescripcionFormaPago);
        this.DisponibleForm.get('IdFormaPago')?.setValue(result[1].IdFormaPago);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  Producto() {
    this.enableBtnActualizar = false;
    this.MostrarLibreta = true;
    this.MostrarTarjeta = true;
    this.MostrarCupo = true;
    this.MostrarGarantias = true;
    this.ActivarSaldo();
    this.CondicionesProducto();
  }
  BuscarProducto() {
    if (this.ArrayCondiciones !== undefined) {
      let IdProducto = '*';
      let Descripcion = '*';
      if (this.DisponibleForm.get('IdProducto')?.value !== null
        && this.DisponibleForm.get('IdProducto')?.value !== undefined
        && this.DisponibleForm.get('IdProducto')?.value !== '') {
        this.DisponibleForm.get('DescripcionProducto')?.setValue('');
        IdProducto = this.DisponibleForm.get('IdProducto')?.value;
      } else if (this.DisponibleForm.get('DescripcionProducto')?.value !== null
        && this.DisponibleForm.get('DescripcionProducto')?.value !== undefined
        && this.DisponibleForm.get('DescripcionProducto')?.value !== '') {
        Descripcion = this.DisponibleForm.get('DescripcionProducto')?.value;
      }
      this.loading = true;
      this.DisponiblesServices.BuscarProducto(IdProducto, Descripcion).subscribe(
        result => {
          this.loading = false;
          if (result.length === 0) {
            this.notif.warning('Advertencia', 'No se encontró el producto.', ConfiguracionNotificacion.configRightTop);
            this.DisponibleForm.get('IdProducto')?.reset();
          } else if (result.length === 1) {
            if (result[0].IdProducto === 102) {
              if (this.DisponibleForm.get('Clase')?.value === 10) {
                const fechaHoy = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
                const fechaVigencia = new DatePipe('en-CO').transform(this.ArrayCondiciones.FechaVigencia, 'yyyy/MM/dd');
                if (fechaHoy != null && fechaVigencia != null && fechaHoy <= fechaVigencia) {
                  this.DisponibleForm.get('IdProducto')?.setValue(result[0].IdProducto);
                  this.DisponibleForm.get('DescripcionProducto')?.setValue(result[0].DescripcionProducto);
                  this.DisponibleForm.get('IdMedioPago')?.setValue("9999");
                  this.BloquearMedioPago = null;
                  this.TimbrarMensaje();
                  this.ValidarDisponibles();

                } else {
                  this.notif.warning('Alerta', 'El producto no está vigente, o no es válido para la relación.', ConfiguracionNotificacion.configRightTop);
                  this.DisponibleForm.get('IdProducto')?.reset();
                  this.DisponibleForm.get('DescripcionProducto')?.reset();
                  this.DisponibleForm.get('IdMedioPago')?.setValue("9999")
                  this.BloquearMedioPago = false;
                }
              } else {
                this.notif.warning('Advertencia', 'El número de producto ingresado solo es para menores.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleForm.get('IdProducto')?.reset();
                this.DisponibleForm.get('IdMedioPago')?.setValue("9999")
                this.BloquearMedioPago = false;
              }
            } else {
              if (result[0].IdProducto === 101 || result[0].IdProducto === 112) {
                const Edad = this.DisponibleForm.get('Edad')?.value;
                if (+Edad <= 14) {
                  const fechaHoy = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
                  const fechaVigencia = new DatePipe('en-CO').transform(this.ArrayCondiciones.FechaVigencia, 'yyyy/MM/dd');
                  if (fechaHoy != null && fechaVigencia != null && fechaHoy <= fechaVigencia) {
                    this.DisponibleForm.get('IdProducto')?.setValue(result[0].IdProducto);
                    this.DisponibleForm.get('DescripcionProducto')?.setValue(result[0].DescripcionProducto);
                    this.DisponibleForm.get('IdMedioPago')?.setValue("9999");
                    this.BloquearMedioPago = null;
                    this.TimbrarMensaje();
                    this.ValidarDisponibles();

                  } else {
                    this.notif.warning('Alerta', 'El producto no está vigente, o no es válido para la relación.', ConfiguracionNotificacion.configRightTop);
                    this.DisponibleForm.get('IdProducto')?.reset();
                    this.DisponibleForm.get('DescripcionProducto')?.reset();
                    this.DisponibleForm.get('IdMedioPago')?.setValue("9999")
                    this.BloquearMedioPago = false;
                  }
                } else {
                  if (this.DisponibleForm.get('Clase')?.value === 5) {
                    const fechaHoy = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
                    const fechaVigencia = new DatePipe('en-CO').transform(this.ArrayCondiciones.FechaVigencia, 'yyyy/MM/dd');
                    if (fechaHoy != null && fechaVigencia != null && fechaHoy <= fechaVigencia) {
                      this.DisponibleForm.get('IdProducto')?.setValue(result[0].IdProducto);
                      this.DisponibleForm.get('DescripcionProducto')?.setValue(result[0].DescripcionProducto);
                      this.DisponibleForm.get('IdMedioPago')?.setValue("9999");
                      this.BloquearMedioPago = null;
                      this.TimbrarMensaje();
                      this.ValidarDisponibles();

                    } else {
                      this.notif.warning('Alerta', 'El producto no está vigente, o no es válido para la relación.', ConfiguracionNotificacion.configRightTop);
                      this.DisponibleForm.get('IdProducto')?.reset();
                      this.DisponibleForm.get('DescripcionProducto')?.reset();
                      this.DisponibleForm.get('IdMedioPago')?.setValue("9999")
                      this.BloquearMedioPago = false;
                    }
                  } else {
                    this.notif.warning('Advertencia', 'El número de producto ingresado no es para menores.', ConfiguracionNotificacion.configRightTop);
                    this.DisponibleForm.get('IdProducto')?.reset();
                  }
                }
              } else {
                if (this.DisponibleForm.get('Clase')?.value === 5 || this.DisponibleForm.get('Clase')?.value === 15) {
                  const fechaHoy = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
                  const fechaVigencia = new DatePipe('en-CO').transform(this.ArrayCondiciones.FechaVigencia, 'yyyy/MM/dd');
                  if (fechaHoy != null && fechaVigencia != null && fechaHoy <= fechaVigencia) {
                    this.DisponibleForm.get('IdProducto')?.setValue(result[0].IdProducto);
                    this.DisponibleForm.get('DescripcionProducto')?.setValue(result[0].DescripcionProducto);
                    this.DisponibleForm.get('IdMedioPago')?.setValue("9999");
                    this.BloquearMedioPago = null;
                    this.TimbrarMensaje();
                    this.ValidarDisponibles();

                  } else {
                    this.notif.warning('Alerta', 'El producto no está vigente, o no es válido para la relación.', ConfiguracionNotificacion.configRightTop);
                    this.DisponibleForm.get('IdProducto')?.reset();
                    this.DisponibleForm.get('DescripcionProducto')?.reset();
                    this.DisponibleForm.get('IdMedioPago')?.setValue("9999")
                    this.BloquearMedioPago = false;
                  }
                } else {

                  this.notif.warning('Advertencia', 'El número de producto ingresado no es para menores.', ConfiguracionNotificacion.configRightTop);
                  this.DisponibleForm.get('IdProducto')?.reset();
                }
              }
            }
          } else if (result.length > 1) {
            this.resultProducto = result;
            this.ModalDisponible.nativeElement.click();
            this.DisponibleForm.get('IdMedioPago')?.setValue("9999");
            this.BloquearMedioPago = false;
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    } else {
      let IdProducto = '*';
      let Descripcion = '*';
      if (this.DisponibleForm.get('IdProducto')?.value !== null
        && this.DisponibleForm.get('IdProducto')?.value !== undefined
        && this.DisponibleForm.get('IdProducto')?.value !== '') {
        this.DisponibleForm.get('DescripcionProducto')?.setValue('');
        IdProducto = this.DisponibleForm.get('IdProducto')?.value;
      } else if (this.DisponibleForm.get('DescripcionProducto')?.value !== null
        && this.DisponibleForm.get('DescripcionProducto')?.value !== undefined
        && this.DisponibleForm.get('DescripcionProducto')?.value !== '') {
        Descripcion = this.DisponibleForm.get('DescripcionProducto')?.value;
      }
      this.loading = true;
      this.DisponiblesServices.BuscarProducto(IdProducto, Descripcion).subscribe(
        result => {
          this.loading = false;
          if (result.length === 0) {
            this.notif.warning('Advertencia', 'No se encontró el producto.', ConfiguracionNotificacion.configRightTop);
            this.DisponibleForm.get('IdProducto')?.reset();
          } else if (result.length === 1) {
            this.resultProducto = result;
            this.ModalDisponible.nativeElement.click();
            this.DisponibleForm.get('IdMedioPago')?.setValue("9999")
            this.BloquearMedioPago = false;
          } else if (result.length > 1) {
            this.resultProducto = result;
            this.ModalDisponible.nativeElement.click();
            this.DisponibleForm.get('IdMedioPago')?.setValue("9999")
            this.BloquearMedioPago = false;
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  CondicionesProducto() {
    this.DisponibleForm.get('IdRelacionTipo')?.setValue(this.DisponibleForm.get('Clase')?.value);
    this.DisponiblesServices.CondicionesProducto(this.DisponibleForm.value).subscribe(
      result => {
        if (result !== null) {
          this.ArrayCondiciones = result;
          this.BuscarProducto();
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
          this.DisponibleForm.get('IdProducto')?.reset();
          this.DisponibleForm.get('IdMedioPago')?.setValue("9999");
          this.BloquearMedioPago = false;
        }
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  ValidarDisponibles() {
    this.DisponiblesServices.ValidarDisponibles(this.DisponibleForm.get('IdProducto')?.value).subscribe(
      result => {
        if (result !== null) {
          this.resultValidaciones = result;
          this.DisponiblesServices.MedioPago().subscribe(
            result => {
              this.resultMedioPago = result;
              this.resultMedioPagoOriginal = [...result]
              if (this.resultValidaciones.TipoMedioPago === 'Libreta') 
                this.resultMedioPago = this.resultMedioPago.filter(( x: any) => x.IdMedioPago == 0);
              else if (this.resultValidaciones.TipoMedioPago === 'Tarjeta')
                this.resultMedioPago = this.resultMedioPago.filter(( x: any) => x.IdMedioPago != 0);
              else if (+this.DisponibleForm.get('IdMedioPago')?.value === 50 || +this.DisponibleForm.get('IdMedioPago')?.value === 70 )
                this.resultMedioPago = this.resultMedioPago.filter((x: any) => x.IdMedioPago === 50 || x.IdMedioPago === 70 );

                setTimeout(() => {
                 
                }, 300);
              this.generalesService.Autofocus('SelectMedioPago');
              this.BloquearMedioPago = null;
            });
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
          this.DisponibleForm.get('IdProducto')?.reset();
          this.DisponibleForm.get('IdMedioPago')?.setValue("9999");
          this.BloquearMedioPago = false;
          
        }
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  MapearDatosProductos(datos : any) {
    this.ArrayCondiciones = undefined;
    this.DisponibleForm.get('IdProducto')?.setValue(datos.IdProducto);
    this.DisponibleForm.get('DescripcionProducto')?.setValue(datos.DescripcionProducto);
    this.CondicionesProducto();
  }
  changeOperacionPermitida() {   
    if(this.DisponibleForm.get('IdOperacion')?.value != "")
      this.enableBtnActualizar = true;
    else
     this.enableBtnActualizar = false;
  }
  OperacionPermitida() {
    this.DisponiblesServices.OperacionPermitida().subscribe(
      result => {
        this.resultOperacionPermitada = result;
        this.DisponibleForm.get('DescripcionOperacion')?.setValue(result[0].DescripcionOperacion);
        $('#SelectOperacionPermitida').focus().select();
      },error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  ObtenerEstado() {
    this.loading = true;
    let datas = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(datas == null ? "" : datas));
    const arrayExample = {
      'IdOperacion': 9,
      'IdPerfil': this.dataUser.idPerfilUsuario,
      'IdModulo': '38'
    };
    this.operacionesService.ObtenerEstadosXOperacionesData(arrayExample).subscribe(
      result => {
        this.resultEstados = result;
        $('#SelectEstadoCuenta').focus().select();
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  BuscarAsesor() {
    let IdAsesor = '*';
    let NombreAsesor = '*';
    if (this.DisponibleForm.get('IdAsesor')?.value !== null
      && this.DisponibleForm.get('IdAsesor')?.value !== undefined
      && this.DisponibleForm.get('IdAsesor')?.value !== '') {
      this.DisponibleForm.get('NombreAsesor')?.setValue('');
      IdAsesor = this.DisponibleForm.get('IdAsesor')?.value;
    } else if (this.DisponibleForm.get('NombreAsesor')?.value !== null
      && this.DisponibleForm.get('NombreAsesor')?.value !== undefined
      && this.DisponibleForm.get('NombreAsesor')?.value !== '') {
      NombreAsesor = this.DisponibleForm.get('NombreAsesor')?.value;
    }

    if (IdAsesor === '*' && NombreAsesor === '*') {
      this.notif.warning('Alerta', 'Debe ingresar el documento o el nombre del asesor.', ConfiguracionNotificacion.configRightTop);
    } else {
      this.DisponiblesServices.BuscarAsesor(IdAsesor, NombreAsesor).subscribe(
        result => {
          if (result.length === 1) {
            this.MapearDatosAsesor(result);
          } else if (result.length > 1) {
            this.resultAsesor = result;
            this.ModalAsesores.nativeElement.click();
          } else if (result === null || result.length === 0) {
            this.notif.warning('Alerta', 'No se encontró al asesor.', ConfiguracionNotificacion.configRightTop);
          }
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  MapearDatosAsesor(datos : any) {
    if (datos.length >= 1) {
      this.DisponibleForm.get('IdAsesor')?.setValue(datos[0].IdAsesor);
      this.DisponibleForm.get('NombreAsesor')?.setValue(datos[0].Nombre);
      this.DisponibleForm.get('DocumentoAsesor')?.setValue(datos[0].Documento);
    } else {
      this.DisponibleForm.get('IdAsesor')?.setValue(datos.IdAsesor);
      this.DisponibleForm.get('NombreAsesor')?.setValue(datos.Nombre);
      this.DisponibleForm.get('DocumentoAsesor')?.setValue(datos.Documento);
    }
  }
  BuscarAsociadoModal(Documento = '*') {
    let Nombre = '*'; 
    if (this.DisponibleForm.get('NumeroDocumento')?.value !== null
      && this.DisponibleForm.get('NumeroDocumento')?.value !== undefined
      && this.DisponibleForm.get('NumeroDocumento')?.value !== ''
    ) {
      this.DisponibleForm.get('Nombre')?.setValue('');
      Documento = this.DisponibleForm.get('NumeroDocumento')?.value;
    } else if (this.DisponibleForm.get('Nombre')?.value !== null
      && this.DisponibleForm.get('Nombre')?.value !== undefined
      && this.DisponibleForm.get('Nombre')?.value !== ''
    ) {
      Nombre = this.DisponibleForm.get('Nombre')?.value;
    }
    this.DisponiblesServices.BuscarAsociado(Documento, Nombre).subscribe(
      result => {
        this.dataObjet = undefined;
        if (result.length === 0) {
          this.notif.warning('Advertencia', 'No se encontró el asociado.', ConfiguracionNotificacion.configRightTop);
          this.btnGuardar = false;
        } else if (result.length === 1) {
          this.DisponibleForm.get('NumeroDocumento')?.setValue(result[0].NumeroDocumento);
          this.DisponibleForm.get('Nombre')?.setValue(result[0].PrimerApellido + ' ' +
            result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
          this.DisponibleForm.get('NumeroOficinaAsociado')?.setValue(result[0].IdOficina);
          this.DisponibleForm.get('NombreOficinaAsociado')?.setValue(result[0].NombreOficina);
          this.DisponibleForm.get('Clase')?.setValue(result[0].IdRelacionTipo);
          this.DisponibleForm.get('Edad')?.setValue(result[0].Edad);
          this.DisponibleForm.get('IdTipoDocumento')?.setValue(result[0].IdTipoDocumento);
        } else if (result.length > 1) {
          this.resultAsociados = result;
          this.ModalAsociados.nativeElement.click();
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          if (result.Mensaje === 'Persona Vetada') {
            swal.fire({
              title: 'Persona vetada',
              text: '',
              icon: 'error',
              confirmButtonColor: 'rgb(160,0,87)',
              allowOutsideClick: false,
              allowEscapeKey: false
            });
            this.clearFrom();
            this.MapearDatosUsuario();
            this.Encabezado();
            this.OperacionPermitida();
            this.btnGuardar = false;
            this.BloquearFormaPago = null;
            this.BloquearAsociado = null;
            this.BloquearBuscar = false;
            this.bloquearConsultaCuenta = false;
          } else {
            this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
            this.clearFrom();
            this.MapearDatosUsuario();
            this.Encabezado();
            this.OperacionPermitida();
            this.btnGuardar = false;
            this.BloquearFormaPago = null;
            this.BloquearAsociado = null;
            this.BloquearBuscar = false;
            this.bloquearConsultaCuenta = false;
          }
        }
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  BuscarAsesorExternoCodigo() {
    if (this.AsesorFrom.get('strCodigo')?.value !== null
      && this.AsesorFrom.get('strCodigo')?.value !== undefined
      && this.AsesorFrom.get('strCodigo')?.value !== ''
      || this.AsesorFrom.get('strNombre')?.value !== null
      && this.AsesorFrom.get('strNombre')?.value !== undefined
      && this.AsesorFrom.get('strNombre')?.value !== '') {
      this.loading = true;
      this.DisponiblesServices.BuscarAsesorExterno(this.AsesorFrom.value).subscribe(
        result => {
          if (result.length === 1) {
            this.AsesorFrom.get('strCodigo')?.setValue(result[0].intIdAsesor);
            this.AsesorFrom.get('strNombre')?.setValue(result[0].Nombre);
          } else if (result.length > 1) {
            this.resultAsesoresExterno = result;
            this.ModalAsesoresExterno.nativeElement.click();
          } else if (result === null || result.length === 0) {
            this.notif.warning('Advertencia', 'No se encontró al asesor externo.', ConfiguracionNotificacion.configRightTop);
            this.AsesorFrom.get('strCodigo')?.reset();
            this.AsesorFrom.get('strNombre')?.reset();
          }
          if (this.DisponibleOperacionFrom.get('Codigo')?.value === '19') {
            this.enableBtnActualizar = true;
          } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '10'|| this.DisponibleOperacionFrom.get('Codigo')?.value === '40') {
            this.btnGuardar = false;
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.notif.warning('Advertencia', 'El valor ingresado no tiene el formato correcto.',
            ConfiguracionNotificacion.configRightTopNoClose);
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  BuscarAsesorExternoTodos() {
    if (this.AsesorFrom.get('strCodigo')?.value === '       '
      || this.AsesorFrom.get('strCodigo')?.value === null
      && this.AsesorFrom.get('strNombre')?.value === '       '
      || this.AsesorFrom.get('strNombre')?.value === null) {
      this.AsesorFrom.get('strCodigo')?.setValue('');
      this.AsesorFrom.get('strNombre')?.setValue('');
    }
    this.loading = true;
    this.DisponiblesServices.BuscarAsesorExterno(this.AsesorFrom.value).subscribe(
      result => {
        if (result.length > 1) {
          this.resultAsesoresExterno = result;
          this.ModalAsesoresExterno.nativeElement.click();

          if (this.DisponibleOperacionFrom.get('Codigo')?.value === '19') {
            this.enableBtnActualizar = true;
          } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '10' || this.DisponibleOperacionFrom.get('Codigo')?.value === '40') {
            this.btnGuardar = false;
          }
        } else {
          if (result.length !== 0) {
            this.AsesorFrom.get('strNombre')?.reset();
            this.AsesorFrom.get('strCodigo')?.reset();
            result.forEach(( elementt: any) => {
              this.AsesorFrom.get('strNombre')?.setValue(elementt.Nombre);
              this.AsesorFrom.get('strCodigo')?.setValue(elementt.intIdAsesor);
            });
          } else {
            this.AsesorFrom.get('strNombre')?.setValue('');
            this.AsesorFrom.get('strCodigo')?.setValue('');
            this.notif.warning('Advertencia', 'No se encontró el asesor externo.', ConfiguracionNotificacion.configRightTop);
          }
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.notif.warning('Advertencia', 'El valor ingresado no tiene el formato correcto.', ConfiguracionNotificacion.configRightTopNoClose);
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  MapearDatosAsesorExterno(datos : any) {
    this.AsesorFrom.get('strCodigo')?.setValue(datos.intIdAsesor);
    this.AsesorFrom.get('strNombre')?.setValue(datos.Nombre);
    this.focusActualizar();
  }
  FormaPago() {
    this.DisponiblesServices.FormaPago().subscribe(
      result => {
        this.resultFormaPago = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  FormaPagoSeleccionada() {
    if (this.DisponibleForm.get('IdFormaPago')?.value === '0') {
      if (this.DisponibleOperacionFrom.get('Codigo')?.value === '21') {
        this.enableBtnActualizar = true;
      }      
    } else if (this.DisponibleForm.get('IdFormaPago')?.value === '2') {
      this.ÖbtenerConvenio();
    }
  }
  ÖbtenerConvenio() {
    this.DisponiblesServices.ObtenerConvenioContractual(this.DisponibleForm.value).subscribe(
      result => {
        if (result.length === 1) {
          if (this.DisponibleOperacionFrom.get('Codigo')?.value === '21') {
            this.enableBtnActualizar = true;
          }
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
          this.DisponibleForm.get('IdFormaPago')?.setValue('0');
          // this.enableBtnActualizar = false;
        } else {
          // this.enableBtnActualizar = true;
        }
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  selectEstadoActivo() {
    this.bloquearbtnCambioEstado = true;
  }
  EstadoSeleccionado() {
    if (this.DisponibleForm.get('IdOficina')?.value !== null
      && this.DisponibleForm.get('IdOficina')?.value !== undefined
      && this.DisponibleForm.get('IdOficina')?.value !== ''
      && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
      && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
      && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
      && this.DisponibleForm.get('IdConsecutivo')?.value !== null
      && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
      && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
      && this.DisponibleForm.get('IdDigito')?.value !== null
      && this.DisponibleForm.get('IdDigito')?.value !== undefined
      && this.DisponibleForm.get('IdDigito')?.value !== ''
    ) {
      if (+this.DisponibleForm.get('IdEstado')?.value !== this.datoCambioEstado) {
        if (this.datoCambioEstado != 45 && this.DisponibleForm.get('IdEstado')?.value == 10) {
          this.notif.warning('Advertencia', 'La cuenta debe estar nueva para anular.', ConfiguracionNotificacion.configRightTop);
          this.bloquearbtnCambioEstado = false;
          return;
        }
        if (this.datoCambioEstado != 5 && (this.DisponibleForm.get('IdEstado')?.value == 20 || this.DisponibleForm.get('IdEstado')?.value == 30)){
          if (this.DisponibleForm.get('IdEstado')?.value == 20) {
            this.notif.warning('Advertencia', 'La cuenta debe estar activa para bloquear.', ConfiguracionNotificacion.configRightTop);
            this.bloquearbtnCambioEstado = false;
          }            
          else
            this.notif.warning('Advertencia', 'La cuenta debe estar activa para embargar.', ConfiguracionNotificacion.configRightTop);
            this.bloquearbtnCambioEstado = false;
          return;
        }
        if ((this.datoCambioEstado == 20 || this.datoCambioEstado == 30) && this.DisponibleForm.get('IdEstado')?.value != 5) {
          this.notif.warning('Advertencia', 'Cuenta debe estar bloqueada o embargada para activar.', ConfiguracionNotificacion.configRightTop);
          this.bloquearbtnCambioEstado = false;
          return;
        }

        if (this.DisponibleForm.get('IdEstado')?.value === '20') {
            if (this.datoCambioEstado == 5) {
              this.Observaciones(this.DisponibleForm.get('IdEstado')?.value);
              this.ModalCambioEstado.nativeElement.click();
              this.CambioEstadoFrom.get('IdTipoObservacion')?.setValue("0");
              setTimeout(() => {
                $('#TipoObservacionId').focus().select();
              }, 200);
             
            } else {
              this.notif.warning('Advertencia', 'Cuenta debe estar activa para bloquear.', ConfiguracionNotificacion.configRightTop);
              this.bloquearbtnCambioEstado = false;
            }
          } else {
            this.cambiarEstado();
          }
      } else {
        this.notif.warning('Advertencia', 'Debe cambiar estado cuenta', ConfiguracionNotificacion.configRightTop);
        this.bloquearbtnCambioEstado = false;
      }
    } else {
      this.notif.warning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.', ConfiguracionNotificacion.configRightTop);
    }
  }
  Observaciones(IdEstado : string) {
    this.DisponiblesServices.Observaciones(IdEstado).subscribe(
      result => {
        this.dataObservacion = result;
        console.log(this.dataObservacion);
      },
      error => {
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.error(errorMessage);
      }
    );
  }
  cambioEstadoGenerarPdfBool: boolean = false;
  estadoObservacion: number = 0;
  changeEstadoObservacion() {
  if ((this.CambioEstadoFrom.get('IdTipoObservacion')?.value == 8 || this.CambioEstadoFrom.get('IdTipoObservacion')?.value == 12) || (this.DisponibleForm.controls['IdMedioPago'].value == 10 || this.DisponibleForm.controls['IdMedioPago'].value == 50)) {
      this.estadoObservacion = this.CambioEstadoFrom.get('IdTipoObservacion')?.value;
      this.cambioEstadoGenerarPdfBool = true;
    } 
    else
      this.cambioEstadoGenerarPdfBool = false;
  }
  GuardarObservaciones() {
    if (this.CambioEstadoFrom.get('IdTipoObservacion')?.value !== null
      && this.CambioEstadoFrom.get('IdTipoObservacion')?.value !== undefined
      && this.CambioEstadoFrom.get('IdTipoObservacion')?.value !== ''
      && this.CambioEstadoFrom.get('IdTipoObservacion')?.value !== "0"
    ) {
      // validar que si  es cobro juridico que si tenga  tenga un credito
      const cuenta = this.DisponibleForm.get('IdCuenta')?.value;
      this.CambioEstadoFrom.get('lngCuenta')?.setValue(cuenta);
      this.DisponiblesServices.GuardarObservacion(this.CambioEstadoFrom.value).subscribe(
        result => {
          this.CambioEstadoFrom.reset();
          this.cambiarEstado();
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    } else {
      this.notif.warning('Advertencia', 'Debe seleccionar una observación.', ConfiguracionNotificacion.configRightTop);
    }
  }
  cambiarEstado() {

    if (this.DisponibleForm.get('IdOficina')?.value !== this.datoOficina) {
      this.DisponibleForm.get('IdOficina')?.setValue(this.datoOficina);
    }
    if (this.DisponibleForm.get('IdProductoCuenta')?.value !== this.datoProducto ||
      this.DisponibleForm.get('IdProducto')?.value !== this.datoProducto ) {
      this.DisponibleForm.get('IdProductoCuenta')?.setValue(this.datoProducto);
      this.DisponibleForm.get('IdProducto')?.setValue(this.datoProducto);
      this.DisponibleForm.get('DescripcionProducto')?.setValue(this.datoNombreProducto);
    }
    if (this.DisponibleForm.get('IdConsecutivo')?.value !== this.datoConsecutivo) {
      this.DisponibleForm.get('IdConsecutivo')?.setValue(this.datoConsecutivo);
    }
    if (this.DisponibleForm.get('IdDigito')?.value !== this.datoDigito) {
      this.DisponibleForm.get('IdDigito')?.setValue(this.datoDigito);
    }

    let tempListEstados: any[] = [
      { id: 45, descripcion:"Nuevo" },
      { id: 5, descripcion:  "Activa" },
      { id: 10, descripcion: "Anulada" },
      { id: 20, descripcion: "Bloqueado" },
      { id: 30, descripcion: "Embargada" }]
    
    let estadoLog: any = {
      EstadoAnterior: tempListEstados.filter(( x: any) => x.id == this.datoCambioEstado)[0].descripcion,
      EstadoActualiza :  tempListEstados.filter(( x: any) => x.id == this.DisponibleForm.get('IdEstado')?.value)[0].descripcion,
    }
    var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
    var IdCuenta = +this.DisponibleForm.get('IdCuenta')?.value;
        if (this.DisponibleForm.get('IdEstado')?.value === '20') {      // Bloquear
        this.obtenerIdObseCambioEstado();
        this.datoCambioEstado = +this.DisponibleForm.get('IdEstado')?.value;

        this.DisponiblesServices.getBloquearCuenta(this.DisponibleForm.value).subscribe(
          result => {
            if (result.AlertasDto !== null) {
              this.notif.warning('Advertencia', result.AlertasDto.Mensaje, ConfiguracionNotificacion.configRightTop);
              this.inputEstado = true;
              this.selectEstado = false;
              this.bloquearbtnCambioEstado = false;
              this.DisponibleForm.get('IdEstado')?.setValue(0);
            } else {
              this.notif.success('Exitoso', 'El cambio estado se realizó correctamente.', ConfiguracionNotificacion.configRightTop);
              this.btnCambiarEstado = false;
              this.Guardarlog(estadoLog);
              if (this.cambioEstadoGenerarPdfBool) {
                let motivo: any = this.dataObservacion.filter(( x: any) => x.IdTipoObservacion == this.estadoObservacion)[0];  
                setTimeout(() => {
                  if(motivo != null && ( motivo.IdTipoObservacion == 8 || motivo.IdTipoObservacion == 12))
                    this.NovedadesAhorrosPDF("Cambio estado", motivo == null ? "" : motivo.Descripcion );
                  this.ObtenerHistorial();
                }, 1000);
              }
              this.BuscarPorCuenta();
              // Notificador
              if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
                this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 7, '16').subscribe(
                  result => {
                  },
                  error => {
                    const errorMessage = <any>error;
                    console.log(errorMessage);
                  }
                );
              }  
              // fin notificador
              this.CambioEstadoFrom.reset();
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
              this.DisponibleForm.get('IdObseCambioEstado')?.reset();
            }
          },
          error => {
          const errorMessage = <any>error;
          this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
           console.error(errorMessage);
           this.DisponibleOperacionFrom.get('Codigo')?.reset();
          }
        );
      } else if (this.DisponibleForm.get('IdEstado')?.value === '5') {  // Desbloquear
        this.DisponiblesServices.getDesbloquearCuenta(this.DisponibleForm.value).subscribe(
          result => {
            if (result.AlertasDto !== null) {
              this.notif.warning('Advertencia', result.AlertasDto.Mensaje, ConfiguracionNotificacion.configRightTop);
              this.inputEstado = true;
              this.selectEstado = false;
              this.bloquearbtnCambioEstado = false;
              this.DisponibleForm.get('IdEstado')?.setValue(0);
            } else {
              this.notif.success('Exitoso', 'El cambio estado se realizó correctamente.', ConfiguracionNotificacion.configRightTop);
              this.btnCambiarEstado = false;
              this.Guardarlog(estadoLog);
              this.BuscarPorCuenta();
              // Notificador
              if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
                this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 7, '00').subscribe(
                  result => {
                  },
                  error => {
                    const errorMessage = <any>error;
                    console.log(errorMessage);
                  }
                );
              }
              // fin notificador             
              this.CambioEstadoFrom.reset();
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
              this.DisponibleForm.get('IdObseCambioEstado')?.reset();
              setTimeout(() => {
                this.ObtenerHistorial();
              }, 1200);
            }
          },
          error => {
            const errorMessage = <any>error;
            this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
            console.error(errorMessage);
            this.DisponibleOperacionFrom.get('Codigo')?.reset();
            }
        );
      } else if (this.DisponibleForm.get('IdEstado')?.value === '10') { // Anular
        this.DisponiblesServices.getAnularCuenta(this.DisponibleForm.value).subscribe(
          result => {
            if (result.AlertasDto !== null) {
              this.notif.warning('Advertencia', result.AlertasDto.Mensaje, ConfiguracionNotificacion.configRightTop);
              this.inputEstado = true;
              this.selectEstado = false;
              this.bloquearbtnCambioEstado = false;
              this.DisponibleForm.get('IdEstado')?.setValue(0);
            } else {
              this.notif.success('Exitoso', 'El cambio estado se realizó correctamente.', ConfiguracionNotificacion.configRightTop);
              this.btnCambiarEstado = false;
              this.Guardarlog(estadoLog);
              this.BuscarPorCuenta();
              // Notificador
              if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
                this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 10, '00').subscribe(
                  result => {
                  },
                  error => {
                    const errorMessage = <any>error;
                    console.log(errorMessage);
                  }
                );
              }
              // fin notificador  
              // liberar tarjeta o libreta
              if (this.DisponibleForm.get('IdMedioPago')?.value !== 60 && this.DisponibleForm.get('IdMedioPago')?.value !== 70){
                swal.fire({
                  title: '¿Desea liberar tarjeta y/o libreta de cuenta anulada?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Sí',
                  cancelButtonText: 'No',
                  confirmButtonColor: 'rgb(13,165,80)',
                  cancelButtonColor: 'rgb(160,0,87)',
                  allowOutsideClick: false,
                  allowEscapeKey: false
                }).then((result) => {
                  if (result.isConfirmed) {
                    const medioPago = this.DisponibleForm.get('IdMedioPago')?.value;
                    const NumeroTarjeta = this.DisponibleForm.get('Inicial')?.value;
                    switch (medioPago) {
                      case 50:
                      case 10:
                        this.LiberarTarjeta(NumeroTarjeta);
                        this.notif.success('Exitoso', 'La liberación de tarjeta se realizó correctamente.',
                          ConfiguracionNotificacion.configRightTop
                        );
                        break;
                      case 0:
                        this.LiberarLibreta(NumeroTarjeta);
                        this.notif.success('Exitoso', 'La liberación de libreta se realizó correctamente.',
                          ConfiguracionNotificacion.configRightTop
                        );
                        break;
                      default:
                        this.notif.warning('Atención', 'El tipo de medio de pago no es válido para liberar.',
                          ConfiguracionNotificacion.configRightTop
                        );
                        break;
                    }
                  }
                });
              }                       
              this.CambioEstadoFrom.reset();
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
              this.DisponibleForm.get('IdObseCambioEstado')?.reset();
              setTimeout(() => {
                this.ObtenerHistorial();
              }, 1200);
            }
          },
          error => {
            const errorMessage = <any>error;
            this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
            console.error(errorMessage);
            this.DisponibleOperacionFrom.get('Codigo')?.reset();
          }
        );
      } else if (this.DisponibleForm.get('IdEstado')?.value === '30') { // Embargar
        this.DisponiblesServices.getEmbargarCuenta(this.DisponibleForm.value).subscribe(
          result => {
            if (result.AlertasDto !== null) {
              this.notif.warning('Advertencia', result.AlertasDto.Mensaje, ConfiguracionNotificacion.configRightTop);
              this.inputEstado = true;
              this.selectEstado = false;
              this.bloquearbtnCambioEstado = false;
              this.DisponibleForm.get('IdEstado')?.setValue(0);
            } else {
              this.notif.success('Exitoso', 'El cambio estado se realizó correctamente.', ConfiguracionNotificacion.configRightTop);
              this.btnCambiarEstado = false;
              this.Guardarlog(estadoLog);
              this.BuscarPorCuenta();
              // Notificador
              if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
                this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 7, '10').subscribe(
                  result => {
                  },
                  error => {
                    const errorMessage = <any>error;
                    console.log(errorMessage);
                  }
                );
              }
              // fin notificador             
              this.CambioEstadoFrom.reset();
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
              this.DisponibleForm.get('IdObseCambioEstado')?.reset();
              setTimeout(() => {
                this.ObtenerHistorial();
              }, 1200);
            }
          },
          error => {
            const errorMessage = <any>error;
            this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
            console.error(errorMessage);
            this.DisponibleOperacionFrom.get('Codigo')?.reset();
          }
        );
    }
    this.selectEstado = true;
    this.inputEstado = false;
  }
  LiberarTarjeta(NumeroTarjeta: any) {
    //var NumeroTarjeta = this.DisponibleForm.get('NumeroTarjeta')?.value;
    this.DisponiblesServices.LiberarTarjeta(+NumeroTarjeta).subscribe(
      result => {
        //this.DisponibleForm.get('NumeroTarjeta')?.setValue(0);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  LiberarLibreta(NumeroLibreta: any) {
    var NumeroLibreta = this.DisponibleForm.get('Inicial')?.value;
    this.DisponiblesServices.LiberarLibreta(+NumeroLibreta).subscribe(
      result => {
        //this.DisponibleForm.get('Inicial')?.setValue(0);
        //this.DisponibleForm.get('Final')?.setValue(0);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  obtenerIdObseCambioEstado() {
    this.DisponiblesServices.obtenerIdObseCambioEstado(this.DisponibleForm.get('IdCuenta')?.value).subscribe(
      result => {
        this.DisponibleForm.get('IdObseCambioEstado')?.setValue(result.IdObseCambioEstado);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  MapearDatosUsuario() {
    let datas = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(datas == null ? "" : datas));
    this.DisponibleForm.get('NombreOficina')?.setValue(this.dataUser.Oficina);
    this.DisponibleForm.get('NumeroOficina')?.setValue(this.dataUser.NumeroOficina);
    this.DisponibleForm.get('IdAsesor')?.setValue(this.dataUser.IdAsesor);
    this.DisponibleForm.get('NombreAsesor')?.setValue(this.dataUser.Nombre);
  }
  MedioPago() {
    this.DisponiblesServices.MedioPago().subscribe(
      result => {
        this.resultMedioPago = result;
        this.resultguardaMedioPago = result;
        
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  SeleccionMedioPago() {
  const cupoAprobado: string = `${this.DisponibleForm.get('CupoAprobado')?.value ?? ''}`;
  const medioPagoAnterior : string = `${this.datoMedioPago ?? ''}`;
  this.PagareObligatorio = false;
  this.TarjetaObligatoria = false;
  this.ConvenioObligatorio = false;
  this.PlazoCorteObligatoria = false;

  //DFRAMIREZ 25-06-2025 se comenta validación, para permitir cambios MP sin importar que tenga cupo aprobado
  //if((medioPagoAnterior === '50' || medioPagoAnterior  === '70') && (cupoAprobado !== '' )){
  //  this.notif.warning('Advertencia', 'No se puede cambiar medio de pago, cuenta tiene cupo.', ConfiguracionNotificacion.configRightTop);
  //  this.VolverArriba(400);
  //  this.DisponibleForm.get('IdMedioPago')?.setValue(this.datoMedioPago);
  //  this.enableBtnActualizar = false;
  //  return;
  //}

    if (this.DisponibleForm.get('IdMedioPago')?.value === '0') {         // libreta
      if (this.DisponibleOperacionFrom.get('Codigo')?.value === '10' || this.DisponibleOperacionFrom.get('Codigo')?.value === '40') {
       // this.dataObjetC = undefined;
        this.ValidacionMediopagoInputs();
        this.MostrarLibreta = false;
        this.MostrarTarjeta = true;
        this.MostrarCupo = true;
        this.MostrarGarantias = true;
        if (this.resultValidaciones.IdProductoConsecutivo !== null){
        
          this.BloquearCuponInicial = null;
          this.VolverAbajo();
          setTimeout(() => {
            this.devolverTab(1);
            this.tab1.nativeElement.click();
            $('#saldos').removeClass('activar');
            $('#saldos').removeClass('active');
            $('#historial').removeClass('activar');
            $('#historial').removeClass('active');
            $('#autorizados').removeClass('activar');
            $('#autorizados').removeClass('active');
            $('#cupo').removeClass('activar');
            $('#cupo').removeClass('active');
            $('#tarjeta').removeClass('activar');
            $('#tarjeta').removeClass('active');
            $('#libreta').addClass('activar');
            $('#libreta').addClass('active');
          }, 200);
          setTimeout(() => {
            this.generalesService.Autofocus('SelectLibreta');
          }, 300);
         
        } else{
          this.BloquearCuponInicial = false;
          this.ActivarSaldo();
        }
        
      } else {
        this.notif.warning('Advertencia', 'No se puede cambiar a libreta.', ConfiguracionNotificacion.configRightTop);
        this.VolverArriba(400);
        this.DisponibleForm.get('IdMedioPago')?.setValue(this.datoMedioPago);
        this.enableBtnActualizar = false;
        return;
      }
    } else if (this.DisponibleForm.get('IdMedioPago')?.value == '10' || this.DisponibleForm.get('IdMedioPago')?.value == '60') { // sin cupo
      this.ValidacionMediopagoInputs();
      this.MostrarLibreta = true;
      this.MostrarTarjeta = false;
      this.MostrarCupo = true;
      this.MostrarGarantias = true;
      this.MostrarDemas = false; 
      this.BloquearConvenio = null;
      this.BloquearNumeroTarjeta = null;
      this.BloquearPagare = null;
      this.BloquearDiaCortePlazo = false;
      this.BloquearCanales = false;
      this.PagareObligatorio = false;
      if (this.DisponibleForm.get('IdMedioPago')?.value == '10') {
        this.TarjetaObligatoria = true;
        this.ConvenioObligatorio = true;
      } else {
        this.ConvenioObligatorio = true;
        this.TarjetaObligatoria = false;
      }
      this.Volver();  
      
      this.DisponibleForm.get('IdPlazo')?.setValue("0");
      this.DisponibleForm.get('IdDiaCorte')?.setValue("0");
      if (this.DisponibleOperacionFrom.get('Codigo')?.value == '10' || this.DisponibleOperacionFrom.get('Codigo')?.value === '40'|| this.datoMedioPago == 0) {
        this.resultCanales = [];
        this.dataObjetC = { Canales: []};
        this.CargarCanales();
      }
        
      if (this.DisponibleForm.get('IdMedioPago')?.value == '60') {
        this.DisponibleForm.get('NumeroTarjeta')?.setValue("");
        this.BloquearNumeroTarjeta = false;
        this.ValidacionMediopagoInputs();
      } 

      if(this.DisponibleOperacionFrom.get('Codigo')?.value === '38'){
        if ((medioPagoAnterior == '10'|| medioPagoAnterior == '50') && (this.DisponibleForm.get('IdMedioPago')?.value == '10' || this.DisponibleForm.get('IdMedioPago')?.value == '50') ) {
          this.DisponibleForm.get('NumeroTarjeta')?.setValue(this.tarjetaOld);
        }
      }

      if(!(this.DisponibleForm.get('IdConvenio')?.value > 0))
        this.DisponibleForm.get('IdConvenio')?.setValue(0);
      setTimeout(() => {
        this.generalesService.Autofocus('selectIdConvenio');
      }, 300);

      setTimeout(() => {
        this.devolverTab(2);
        this.tab2.nativeElement.click();
        $('#saldos').removeClass('activar');
        $('#saldos').removeClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
        $('#autorizados').removeClass('activar');
        $('#autorizados').removeClass('active');
        $('#cupo').removeClass('activar');
        $('#cupo').removeClass('active');
        $('#tarjeta').addClass('activar');
        $('#tarjeta').addClass('active');
        $('#libreta').removeClass('activar');
        $('#libreta').removeClass('active');
      }, 200);
      
    } else if (this.DisponibleForm.get('IdMedioPago')?.value == '50' || this.DisponibleForm.get('IdMedioPago')?.value == '70') { // con cupo
      this.ValidacionMediopagoInputs();
      this.enableBtnActualizar = false;
      this.MostrarLibreta = true;
      this.MostrarTarjeta = false;
      this.MostrarCupo = false;
      this.MostrarGarantias = false;
      this.MostrarDemas = false;
      this.BloquearCanales = false
      this.PagareObligatorio = true;
      if (this.DisponibleForm.get('IdMedioPago')?.value == '50') {
        this.TarjetaObligatoria = true;
        this.ConvenioObligatorio = true;
        this.PagareObligatorio = true;
        this.PlazoCorteObligatoria = true;

        if(this.DisponibleOperacionFrom.get('Codigo')?.value === '38'){
          if (medioPagoAnterior == '10' || medioPagoAnterior == '50'){
            this.DisponibleForm.get('NumeroTarjeta')?.setValue(this.tarjetaOld);
          }
        }
        

      } else {
        this.TarjetaObligatoria = false;
        this.ConvenioObligatorio = true;
        this.PagareObligatorio = true;
        this.PlazoCorteObligatoria = true;
      }
      this.Volver();

      if(this.DisponibleOperacionFrom.get('Codigo')?.value === '38'){
        if (medioPagoAnterior == '50'|| medioPagoAnterior == '70') {
          this.BloquearConvenio = false;
          this.BloquearDiaCortePlazo = false;
          this.BloquearPagare = false;
        }else{
          this.BloquearConvenio = null;
          this.BloquearDiaCortePlazo = null;
          this.BloquearPagare = null;;
        }
      }else{
        this.BloquearConvenio = null;
        this.BloquearDiaCortePlazo = null;
        this.BloquearPagare = null; 
      }
      this.BloquearNumeroTarjeta = null;
      if (this.DisponibleOperacionFrom.get('Codigo')?.value == '10'|| this.DisponibleOperacionFrom.get('Codigo')?.value === '40' || this.datoMedioPago == 0) {
        this.resultCanales = [];
        this.dataObjetC = { Canales: []};
        this.CargarCanales();
      }
         
      if (this.DisponibleForm.get('IdMedioPago')?.value == '70') {
        this.DisponibleForm.get('NumeroTarjeta')?.setValue("");
        this.BloquearNumeroTarjeta = false;
        this.ValidacionMediopagoInputs();
      } 
      if(!(this.DisponibleForm.get('IdConvenio')?.value > 0))
        this.DisponibleForm.get('IdConvenio')?.setValue(0);
      setTimeout(() => {
      this.generalesService.Autofocus('selectIdConvenio');
      }, 300);
      setTimeout(() => {
        this.devolverTab(2);
        this.tab2.nativeElement.click();
        $('#saldos').removeClass('activar');
        $('#saldos').removeClass('active');
        $('#historial').removeClass('activar');
        $('#historial').removeClass('active');
        $('#autorizados').removeClass('activar');
        $('#autorizados').removeClass('active');
        $('#cupo').removeClass('activar');
        $('#cupo').removeClass('active');
        $('#tarjeta').addClass('activar');
        $('#tarjeta').addClass('active');
        $('#libreta').removeClass('activar');
        $('#libreta').removeClass('active');
      }, 200);
    }   
  }
  focusActualizar(){
    this.generalesService.Autofocus('strNombre');    
    this.VolverArriba(300);
  }
  ValidacionMediopagoInputs() {
    if (this.DisponibleOperacionFrom.get('Codigo')?.value == 10 || this.DisponibleOperacionFrom.get('Codigo')?.value == 40 || this.DisponibleOperacionFrom.get('Codigo')?.value == 38) {
      if (this.DisponibleForm.get('IdProducto')?.value === 109 || this.DisponibleForm.get('IdProducto')?.value === 110) {
        
        this.enableBtnActualizar = true;
      }
      if ((this.DisponibleForm.get('IdMedioPago')?.value == 10 && this.DisponibleForm.get('IdConvenio')?.value != 0 && this.DisponibleForm.get('NumeroTarjeta')?.value != "") ||
        (this.DisponibleForm.get('IdMedioPago')?.value == 50 && this.DisponibleForm.get('IdConvenio')?.value != 0 && this.DisponibleForm.get('NumeroTarjeta')?.value != "" && this.DisponibleForm.get('NumeroPagare')?.value != "" && this.DisponibleForm.get('IdDiaCorte')?.value != "0" && this.DisponibleForm.get('IdPlazo')?.value != "0") ||
        (this.DisponibleForm.get('IdMedioPago')?.value == 60 && this.DisponibleForm.get('IdConvenio')?.value != 0) ||
        (this.DisponibleForm.get('IdMedioPago')?.value == 70 && this.DisponibleForm.get('IdConvenio')?.value != 0 && this.DisponibleForm.get('NumeroPagare')?.value != "" && this.DisponibleForm.get('IdDiaCorte')?.value != "0" && this.DisponibleForm.get('IdPlazo')?.value != "0")) {
  
        this.enableBtnActualizar = true;
      } 
    }
    else {
      return false;
    } 
    return true;   
  }
  GenerarCertificado(){
    if(this.CertificadoFrom.get('SaldoCertificado')?.value == 1 || this.CertificadoFrom.get('SaldoCertificado')?.value == 2 || this.CertificadoFrom.get('SaldoCertificado')?.value == 3) {
      this.loading = true;
      let itemsSendCertificado: any = {};
      itemsSendCertificado.MedioPago = (this.DisponibleForm.get('IdMedioPago')?.value);
      itemsSendCertificado.Documento = this.DisponibleForm.get('NumeroDocumento')?.value;
      itemsSendCertificado.TipoDocumento = this.DisponibleForm.get('TipoDocumento')?.value;
      itemsSendCertificado.Nombre = this.DisponibleForm.get('Nombre')?.value;
      itemsSendCertificado.DescripcionProducto = this.DisponibleForm.get('DescripcionProducto')?.value;
      itemsSendCertificado.NroCuenta = this.DisponibleForm.get('Cuenta')?.value;
      itemsSendCertificado.FechaApertura = this.DisponibleForm.get('FechaApertura')?.value;
      itemsSendCertificado.Estado = this.DisponibleForm.get('DescripcionEstado')?.value;
      itemsSendCertificado.Codigo = this.DisponibleForm.get('AliasCuenta')?.value == null ? "" : this.DisponibleForm.get('AliasCuenta')?.value == null;
      itemsSendCertificado.FormatoId = this.CertificadoFrom.get('SaldoCertificado')?.value;
      itemsSendCertificado.SaldoTotal = this.DisponibleForm.get('Efectivo')?.value;
      itemsSendCertificado.TerceroId = Number(this.DisponibleForm.get('LngTercero')?.value);
      $("#ImpresionCertificadoDisponible").show();
      this.ModalCertificadoCuentaPDF.nativeElement.click();
      let html : HTMLObjectElement =  document.getElementById("ImpresionCertificadoDisponible") as HTMLObjectElement;
      this.linkPdf = "";
      let pdfinBase64 = null;
      let byteArray = null;
      let newBolb = null;
      let url = null;
      html.data = "";
      html.name = "";
      html.type = "";
      this.DisponiblesServices.GenerarPDFCertificado(itemsSendCertificado).subscribe(
        result => {
          pdfinBase64 = result.FileStream._buffer;
          byteArray = new Uint8Array(atob(pdfinBase64).split("").map((char) => char.charCodeAt(0)));
          newBolb = new Blob([byteArray], { type: "application/pdf" });
          this.linkPdf = pdfinBase64;
          url = window.URL.createObjectURL(newBolb);
          html.data = url;
          html.name ="Certificado cuenta";
          html.type =  "application/pdf";
          this.loading = false;
          this.Guardarlog({},"79")
          this.CertificadoFrom.get('SaldoCertificado')?.setValue(0);           
        },
        error => {
          const errorMessage = <any>error;
          this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
          console.error(errorMessage);
          this.loading = false;
        });
    } else
      this.notif.warning('Advertencia', 'Debe seleccionar una opción.', ConfiguracionNotificacion.configRightTop);
  }
  generarCertificadoCuenta() {
    this.loading = true;
    var NumeroDocumento = this.DisponibleForm.get('Cuenta')?.value;
    const linkSource = `data:application/pdf;base64,${this.linkPdf}`;
    const downloadLink = document.createElement("a");
    let fileName: string = this.NombreArchivoCertificadoCuenta(NumeroDocumento,".pdf");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
    this.loading = false;
  }
  NombreArchivoCertificadoCuenta(NumeroDocumento : string,pdf : string) { 
    let fileName: string = "";
    if (this.CertificadoFrom.get('SaldoCertificado')?.value == 1) 
      fileName = "CertificadoCuentaCoogranadaConSaldo_" + NumeroDocumento + pdf;
    else if (this.CertificadoFrom.get('SaldoCertificado')?.value == 2) 
      fileName = "CertificadoCuentaCoogranadaSinSaldo_" + NumeroDocumento + pdf;
    else if (this.CertificadoFrom.get('SaldoCertificado')?.value == 3) 
      fileName = "CertificadoCuentaBancoCoopcentral_" + NumeroDocumento + pdf;
    return fileName;
  }
  SendEmail() {
    this.loading = true;
    let itemsSendCertificado: any = {};
    itemsSendCertificado.MedioPago = (this.DisponibleForm.get('IdMedioPago')?.value);
    itemsSendCertificado.Documento = this.DisponibleForm.get('NumeroDocumento')?.value;
    itemsSendCertificado.TipoDocumento = this.DisponibleForm.get('TipoDocumento')?.value;
    itemsSendCertificado.Nombre = this.DisponibleForm.get('Nombre')?.value;
    itemsSendCertificado.DescripcionProducto = this.DisponibleForm.get('DescripcionProducto')?.value;
    itemsSendCertificado.NroCuenta = this.CertificadoFrom.get('SaldoCertificado')?.value == 3 ? "" : this.DisponibleForm.get('Cuenta')?.value;    
    itemsSendCertificado.FechaApertura = this.DisponibleForm.get('FechaApertura')?.value;
    itemsSendCertificado.Estado = this.DisponibleForm.get('DescripcionEstado')?.value;
    itemsSendCertificado.Codigo = this.DisponibleForm.get('AliasCuenta')?.value == null ? "" : this.DisponibleForm.get('AliasCuenta')?.value == null;
    itemsSendCertificado.FormatoId = this.CertificadoFrom.get('SaldoCertificado')?.value;
    itemsSendCertificado.SaldoTotal = this.DisponibleForm.get('Efectivo')?.value;
    itemsSendCertificado.TerceroId = Number(this.DisponibleForm.get('LngTercero')?.value);
    itemsSendCertificado.FileName = this.NombreArchivoCertificadoCuenta("", "");
    let datas = localStorage.getItem("Data")
    let dataLocalStorage = JSON.parse(window.atob(datas == null ? "" : datas));
    itemsSendCertificado.UsuarioERP = dataLocalStorage.IdUsuario;
    this.DisponiblesServices.SendMailPDFCertificado(itemsSendCertificado).subscribe(
      result => { 
        this.loading = false;
        this.ResponseEmail(result);
      },
      error => {
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.error(errorMessage);
        this.loading = false;
       });
  }
  ResponseEmail(obj : any) {
    if (obj.id == "0" ||  obj.id == 0) {
      swal.fire({
        title: "Exitoso",
        text: "",
        html: obj.mjs,
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "rgb(13,165,80)",
        cancelButtonColor: "rgb(160,0,87)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    } else if (obj.id == "1" || obj.id == 1) {
      swal.fire({
        title: "Advertencia",
        text: "",
        html: obj.mjs,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "rgb(13,165,80)",
        cancelButtonColor: "rgb(160,0,87)",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  }

  GuardarDisponible() {
    if (this.isSaving) return;

    const mediopago = this.DisponibleForm.get('IdMedioPago')?.value;
    const numeroTarjeta = this.DisponibleForm.get('NumeroTarjeta')?.value;
    const numeroPagare = this.DisponibleForm.get('NumeroPagare')?.value;
    const plazo = this.DisponibleForm.get('IdPlazo')?.value;
    const diaCorte = this.DisponibleForm.get('IdDiaCorte')?.value;

    if ((mediopago === '10' || mediopago === '50') && (!numeroTarjeta || numeroTarjeta.trim()==='')) {
      this.notif.warning('Advertencia', 'Debe ingresar el número de la tarjeta para el medio de pago seleccionado.', ConfiguracionNotificacion.configRightTop);
    } else if((mediopago === '50') && (!numeroPagare || numeroPagare.trim()==='' || !plazo || plazo.trim()==='' || !diaCorte || diaCorte.trim()==='' )) {
      this.notif.warning('Advertencia', 'Debe ingresar los campos obligatorios para el medio de pago seleccionado.', ConfiguracionNotificacion.configRightTop);
    } else if((mediopago === '70') && (!numeroPagare || numeroPagare.trim()==='' || !plazo || plazo.trim()==='' || !diaCorte || diaCorte.trim()==='' )) {
      this.notif.warning('Advertencia', 'Debe ingresar los campos obligatorios para el medio de pago seleccionado.', ConfiguracionNotificacion.configRightTop);
    }else{
    this.isSaving = true;
    this.BloquearConvenio = false;
    this.BloquearNumeroTarjeta = false;
    this.BloquearDiaCortePlazo = false;
    this.BloquearPagare = false;

    let aperturaCuentaLog: any = {
      IdOficinaAsociado: this.DisponibleForm.controls['NumeroOficinaAsociado'].value,
      OficinaAsociado: this.DisponibleForm.controls['NombreOficinaAsociado'].value,
      Relacion: this.resultRelacion.filter(( x: any) => x.Clase == this.DisponibleForm.controls['Clase'].value)[0] == null ? "" : this.resultRelacion.filter(( x: any) => x.Clase == this.DisponibleForm.controls['Clase'].value)[0].Descripcion,
      AsociadoDocumento: this.DisponibleForm.controls['NumeroDocumento'].value,
      AsociadoNombre: this.DisponibleForm.controls['Nombre'].value,
      Oficina: this.DisponibleForm.controls['NombreOficina'].value,
      IdProducto: this.DisponibleForm.controls['IdProducto'].value,
      Producto: this.DisponibleForm.controls['DescripcionProducto'].value,
      OperacionPermitida: this.DisponibleForm.controls['DescripcionOperacion'].value,
      IdAsesor: this.DisponibleForm.controls['IdAsesor'].value,
      Asesor: this.DisponibleForm.controls['NombreAsesor'].value,
      EstadoCuenta: this.DisponibleForm.controls['DescripcionEstado'].value,
      IdAsesorExterno: this.AsesorFrom.controls['strCodigo'].value == null ? "" : this.AsesorFrom.controls['strCodigo'].value,
      AsesorExterno: this.AsesorFrom.controls['strNombre'].value == null ? "" : this.AsesorFrom.controls['strNombre'].value,
      FormaPago: this.resultFormaPago.filter(( x: any) => x.IdFormaPago == this.DisponibleForm.controls['IdFormaPago'].value)[0] == null ? "" : this.resultFormaPago.filter(( x: any) => x.IdFormaPago == this.DisponibleForm.controls['IdFormaPago'].value)[0].DescripcionFormaPago,
      MedioPago: this.resultMedioPago.filter(( x: any) => x.IdMedioPago == this.DisponibleForm.controls['IdMedioPago'].value)[0] == null ? "" : this.resultMedioPago.filter(( x: any) => x.IdMedioPago == this.DisponibleForm.controls['IdMedioPago'].value)[0].Descripcion,
    }
    this.DisponibleForm.get('IdUsuarioSGF')?.setValue(this.dataUser.IdUsuarioSGF);
    if (this.dataObjetTitulares.length != 0)
      this.DisponibleForm.get('Titulares')?.setValue(this.dataObjetTitulares);
    if (this.DisponibleForm.get('IdMedioPago')?.value == '0') {
      this.dataObjetLibreta = {
        Talonarios: []
      };
      this.dataObjetLibreta.Talonarios.push({
        'Inicial': this.DisponibleForm.get('Inicial')?.value,
        'Final': this.DisponibleForm.get('Final')?.value,
      });
      aperturaCuentaLog.CuponInicial = this.DisponibleForm.get('Inicial')?.value;
      aperturaCuentaLog.CuponFinal = this.DisponibleForm.get('Final')?.value;

      this.dataLibretalist = this.dataObjetLibreta.Talonarios;
      this.DisponibleForm.get('Talonarios')?.setValue(this.dataLibretalist);
    } else{
      aperturaCuentaLog.Convenio = this.resultConvenioTarjetas.filter(( x: any) => x.IdConvenio == this.DisponibleForm.get('IdConvenio')?.value)[0] == null ? "" : this.resultConvenioTarjetas.filter(( x: any) => x.IdConvenio == this.DisponibleForm.get('IdConvenio')?.value)[0].DescripcionConvenio;
      if(this.DisponibleForm.get('IdMedioPago')?.value == '60' || this.DisponibleForm.get('IdMedioPago')?.value == '70')
        aperturaCuentaLog.NumeroTarjeta = "Sin Tarjeta";
      else
        aperturaCuentaLog.NumeroTarjeta = this.DisponibleForm.get('NumeroTarjeta')?.value;
      if(this.DisponibleForm.get('IdMedioPago')?.value == '50' || this.DisponibleForm.get('IdMedioPago')?.value == '70') {
        let DiaCortePago: any = this.resultDiaCortePago.filter(( x: any) => x.intDiaCorte == this.DisponibleForm.get('IdDiaCorte')?.value)[0];
        aperturaCuentaLog.DiaCortePago = DiaCortePago == null ? "" : DiaCortePago.intDiaCorte + " - " + DiaCortePago.intDiaPago;
        aperturaCuentaLog.Plazo = this.DisponibleForm.get('IdPlazo')?.value;
      }
      aperturaCuentaLog.NumeroPagare = this.DisponibleForm.get('NumeroPagare')?.value == null || this.DisponibleForm.get('NumeroPagare')?.value == "" ? "Sin Pagare" : this.DisponibleForm.get('NumeroPagare')?.value;
    }
    if (this.dataObjetC !== undefined) {
      this.dataCanaleslist = this.dataObjetC.Canales;
    
      this.DisponibleForm.get('Canales')?.setValue(this.dataCanaleslist);
    }
    this.dataAsesor = this.AsesorFrom.get('strCodigo')?.value;
    this.DisponibleForm.get('IdAsesorExterno')?.setValue(this.dataAsesor);
      if (this.DisponibleForm.get('IdTipoDocumento')?.value === 3 && this.dataObjetTitulares.length === 0 ){
        this.notif.warning('Advertencia', 'Debe ingresar al menos un autorizado cuando el titular es jurídico.', ConfiguracionNotificacion.configRightTop);
        this.isSaving = false;
        return;
      }
    if (this.DisponibleForm.get('Clase')?.value === 10) {
      if (this.dataObjetTitulares.length !== 0) {

        if (this.AsesorFrom.get('strCodigo')?.value !== null
          && this.AsesorFrom.get('strCodigo')?.value !== undefined
          && this.AsesorFrom.get('strCodigo')?.value !== '') {

          this.DisponiblesServices.GuardarDisponible(this.DisponibleForm.value).subscribe(
            result => {
              this.loading = false;
              this.BloquearDatoAutorizado = false;
              this.BloquearDatoAutorizadoBtn2 = false;
              this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
              this.DisponibleForm.get('FechaApertura')?.setValue(result.FechaApertura);
              this.BloquearAsociado = false;
              this.BloquaerProducto = false;
              this.BloquearAsesorExterno = false;
              this.BloquearFormaPago = false;
              this.BloquearCuponInicial = false;
              this.BloquearMedioPago = false;
              this.BloquearDiaCortePlazo = false;
              this.BloquearLinea = false;
              this.BloquearTimbrarMensaje = false;
              this.notif.success('Exitoso', 'La cuenta se guardó correctamente.', ConfiguracionNotificacion.configRightTop);
              this.isSaving = false;
              this.btnGuardar = true;
              this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito)
              .then(() => {
                setTimeout(() => {
                  // impresión reglamento de vivienda 109
                  if(this.DisponibleForm.get('IdProducto')?.value === 109){
                    this.GenerarReglamentoVivienda();
                  }
                  // impresion  de formato de novedad de ahorro en apertura de cuentas excepto libretas
                  if (this.DisponibleForm.get('IdMedioPago')?.value == "10" || this.DisponibleForm.get('IdMedioPago')?.value == "50" || this.DisponibleForm.get('IdMedioPago')?.value == "60" || this.DisponibleForm.get('IdMedioPago')?.value == "70") {
                    this.NovedadesAhorrosPDF('Apertura cuenta');
                  }
                }, 1000);
              });
              // Notificador
              var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
              var IdCuenta = +result.IdCuenta;
              if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
                this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 5, '00').subscribe( //ysalazar
                  result => {
                  },
                  error => {
                    const errorMessage = <any>error;
                    console.log(errorMessage);
                  }
                );
              }
              // fin notificador
              this.Guardarlog(aperturaCuentaLog);
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
              this.itemsDataObejct = [];
              this.devolverTab(4);
              this.tab5.nativeElement.click();
              $('#saldos').addClass('activar');
              $('#saldos').addClass('active');
              $('#historial').removeClass('activar');
              $('#historial').removeClass('active');
              $('#autorizados').removeClass('activar');
              $('#autorizados').removeClass('active');
              $('#cupo').removeClass('activar');
              $('#cupo').removeClass('active');
              $('#tarjeta').removeClass('activar');
              $('#tarjeta').removeClass('active');
              $('#libreta').removeClass('activar');
              $('#libreta').removeClass('active'); 
            },
            error => {
              this.isSaving = false;
              this.loading = false;
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          );
        } else {
          this.isSaving = false;
          swal.fire({
            title: '¿Desea agregar un asesor externo?',
            text: '',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            confirmButtonColor: 'rgb(13,165,80)',
            cancelButtonColor: 'rgb(160,0,87)',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((results) => {
            if (results.value) {
              setTimeout(() => {
                this.generalesService.Autofocus('SelectAsesorExterno');
              }, 1000);
            } else {
              this.DisponiblesServices.GuardarDisponible(this.DisponibleForm.value).subscribe(
                result => {
                  this.loading = false;
                  this.BloquearDatoAutorizado = false;
                  this.BloquearDatoAutorizadoBtn2 = false;
                  this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
                  this.DisponibleForm.get('FechaApertura')?.setValue(result.FechaApertura);
                  this.BloquearAsociado = false;
                  this.BloquaerProducto = false;
                  this.BloquearAsesorExterno = false;
                  this.BloquearFormaPago = false;
                  this.BloquearCuponInicial = false;
                  this.BloquearMedioPago = false;
                  this.BloquearConvenio = false;
                  this.BloquearNumeroTarjeta = false;
                  this.BloquearCanales = false;
                  this.BloquearPagare = false;
                  this.BloquearDiaCortePlazo = false;
                  this.BloquearLinea = false;
                  this.BloquearTimbrarMensaje = false;
                  this.notif.success('Exitoso', 'La cuenta se guardó correctamente.', ConfiguracionNotificacion.configRightTop);
                  this.isSaving = false;
                  this.btnGuardar = true;
                  this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito)
                  .then(() => {
                    setTimeout(() => {
                      // impresión reglamento de vivienda 109
                      if (this.DisponibleForm.get('IdProducto')?.value === 109) {
                        this.GenerarReglamentoVivienda();
                      }
                      // impresion  de formato de novedad de ahorro en apertura de cuentas excepto libretas
                      if (this.DisponibleForm.get('IdMedioPago')?.value == "10" || this.DisponibleForm.get('IdMedioPago')?.value == "50" || this.DisponibleForm.get('IdMedioPago')?.value == "60" || this.DisponibleForm.get('IdMedioPago')?.value == "70") {
                        this.NovedadesAhorrosPDF('Apertura cuenta');
                      }
                    }, 1000);
                  });
                  // Notificador
                  var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
                  var IdCuenta = +result.IdCuenta;
                  if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
                    this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 5, '00').subscribe( //ysalazar
                      result => {
                      },
                      error => {
                        const errorMessage = <any>error;
                        console.log(errorMessage);
                      }
                    );
                  }
                  // fin notificador
                  this.Guardarlog();
                  this.DisponibleOperacionFrom.get('Codigo')?.reset();
                  this.itemsDataObejct = [];
                  this.devolverTab(4);
                  this.tab5.nativeElement.click();
                  $('#saldos').addClass('activar');
                  $('#saldos').addClass('active');
                  $('#historial').removeClass('activar');
                  $('#historial').removeClass('active');
                  $('#autorizados').removeClass('activar');
                  $('#autorizados').removeClass('active');
                  $('#cupo').removeClass('activar');
                  $('#cupo').removeClass('active');
                  $('#tarjeta').removeClass('activar');
                  $('#tarjeta').removeClass('active');
                  $('#libreta').removeClass('activar');
                  $('#libreta').removeClass('active');
                },
                error => {
                  this.isSaving = false;
                  this.loading = false;
                  const errorMessage = <any>error;
                  console.log(errorMessage);
                }
              );
            }

          });
        }
      } else {
        this.notif.warning('Advertencia', 'Debe ingresar al menos un autorizado cuando el titular es menor.', ConfiguracionNotificacion.configRightTop);
        this.isSaving = false;
      }
    } else {
      if (this.AsesorFrom.get('strCodigo')?.value !== null
        && this.AsesorFrom.get('strCodigo')?.value !== undefined
        && this.AsesorFrom.get('strCodigo')?.value !== '') {

        this.DisponiblesServices.GuardarDisponible(this.DisponibleForm.value).subscribe(
          result => {
            this.loading = false;
            this.BloquearDatoAutorizado = false;
            this.BloquearDatoAutorizadoBtn2 = false;
            this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
            this.DisponibleForm.get('FechaApertura')?.setValue(result.FechaApertura);
            this.BloquearAsociado = false;
            this.BloquaerProducto = false;
            this.BloquearAsesorExterno = false;
            this.BloquearFormaPago = false;
            this.BloquearCuponInicial = false;
            this.BloquearMedioPago = false;
            this.BloquearDiaCortePlazo = false;
            this.BloquearLinea = false;
            this.BloquearTimbrarMensaje = false;
            this.notif.success('Exitoso', 'La cuenta se guardó correctamente.', ConfiguracionNotificacion.configRightTop);
            this.isSaving = false;
            this.btnGuardar = true;
            this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito)
              .then(() => {
                setTimeout(() => {
                  // impresión reglamento de vivienda 109
                  if (this.DisponibleForm.get('IdProducto')?.value === 109) {
                    this.GenerarReglamentoVivienda();
                  }
                  // impresion  de formato de novedad de ahorro en apertura de cuentas excepto libretas
                  if (this.DisponibleForm.get('IdMedioPago')?.value == "10" || this.DisponibleForm.get('IdMedioPago')?.value == "50" || this.DisponibleForm.get('IdMedioPago')?.value == "60" || this.DisponibleForm.get('IdMedioPago')?.value == "70") {
                    this.NovedadesAhorrosPDF('Apertura cuenta');
                  }
                }, 1000);
              });

            // Notificador
            var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
            var IdCuenta = +result.IdCuenta;
            if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
              this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 5, '00').subscribe( //ysalazar
                result => {
                },
                error => {
                  const errorMessage = <any>error;
                  console.log(errorMessage);
                }
              );
            }
            // fin notificador
            this.Guardarlog(aperturaCuentaLog);
            this.DisponibleOperacionFrom.get('Codigo')?.reset();
            this.itemsDataObejct = [];
            this.devolverTab(4);
            this.tab5.nativeElement.click();
            $('#saldos').addClass('activar');
            $('#saldos').addClass('active');
            $('#historial').removeClass('activar');
            $('#historial').removeClass('active');
            $('#autorizados').removeClass('activar');
            $('#autorizados').removeClass('active');
            $('#cupo').removeClass('activar');
            $('#cupo').removeClass('active');
            $('#tarjeta').removeClass('activar');
            $('#tarjeta').removeClass('active');
            $('#libreta').removeClass('activar');
            $('#libreta').removeClass('active');
          },
          error => {
            this.isSaving = false;
            this.loading = false;
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      } else {
        this.isSaving = false;
        swal.fire({
          title: '¿Desea agregar un asesor externo?',
          text: '',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          confirmButtonColor: 'rgb(13,165,80)',
          cancelButtonColor: 'rgb(160,0,87)',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((results) => {
          if (results.value) {
            setTimeout(() => {
              this.generalesService.Autofocus('SelectAsesorExterno');
            }, 1000);
          } else {
            this.DisponiblesServices.GuardarDisponible(this.DisponibleForm.value).subscribe(
              result => {
                this.loading = false;
                this.BloquearDatoAutorizado = false;
                this.BloquearDatoAutorizadoBtn2 = false;
                this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.DisponibleForm.get('FechaApertura')?.setValue(result.FechaApertura);
                this.BloquearAsociado = false;
                this.BloquaerProducto = false;
                this.BloquearAsesorExterno = false;
                this.BloquearFormaPago = false;
                this.BloquearCuponInicial = false;
                this.BloquearMedioPago = false;
                this.BloquearConvenio = false;
                this.BloquearNumeroTarjeta = false;
                this.BloquearCanales = false;
                this.BloquearPagare = false;
                this.BloquearDiaCortePlazo = false;
                this.BloquearLinea = false;
                this.BloquearTimbrarMensaje = false;
                this.notif.success('Exitoso', 'La cuenta se guardó correctamente.', ConfiguracionNotificacion.configRightTop);
                this.isSaving = false;
                this.btnGuardar = true;
                this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito)
                .then(() => {
                  setTimeout(() => {
                    // impresión reglamento de vivienda 109
                    if (this.DisponibleForm.get('IdProducto')?.value === 109) {
                      this.GenerarReglamentoVivienda();
                    }
                    // impresion  de formato de novedad de ahorro en apertura de cuentas excepto libretas
                    if (this.DisponibleForm.get('IdMedioPago')?.value == "10" || this.DisponibleForm.get('IdMedioPago')?.value == "50" || this.DisponibleForm.get('IdMedioPago')?.value == "60" || this.DisponibleForm.get('IdMedioPago')?.value == "70") {
                      this.NovedadesAhorrosPDF('Apertura cuenta');
                    }
                  }, 1000);
                });
                // Notificador
                var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
                var IdCuenta = +result.IdCuenta;
                if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
                  this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 5, '00').subscribe( //ysalazar
                    result => {
                    },
                    error => {
                      const errorMessage = <any>error;
                      console.log(errorMessage);
                    }
                  );
                }
                // fin notificador
                this.Guardarlog(aperturaCuentaLog);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
                this.itemsDataObejct = [];
                this.devolverTab(4);
                this.tab5.nativeElement.click();
                $('#saldos').addClass('activar');
                $('#saldos').addClass('active');
                $('#historial').removeClass('activar');
                $('#historial').removeClass('active');
                $('#autorizados').removeClass('activar');
                $('#autorizados').removeClass('active');
                $('#cupo').removeClass('activar');
                $('#cupo').removeClass('active');
                $('#tarjeta').removeClass('activar');
                $('#tarjeta').removeClass('active');
                $('#libreta').removeClass('activar');
                $('#libreta').removeClass('active');
              },
              error => {
                this.isSaving = false;
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          }
        });
      }
    }
  }
  }
  selectCanalChange() {
    this.BloquearCanales = true;
  }
  expandedCanal: boolean = true;
  TipoNovedad: string = "";
  AsignarCupo: boolean = false;
  ActualizarDisponible() {
    if (this.DisponibleForm.get('IdOficina')?.value !== null
      && this.DisponibleForm.get('IdOficina')?.value !== undefined
      && this.DisponibleForm.get('IdOficina')?.value !== ''
      && this.DisponibleForm.get('IdProductoCuenta')?.value !== null
      && this.DisponibleForm.get('IdProductoCuenta')?.value !== undefined
      && this.DisponibleForm.get('IdProductoCuenta')?.value !== ''
      && this.DisponibleForm.get('IdConsecutivo')?.value !== null
      && this.DisponibleForm.get('IdConsecutivo')?.value !== undefined
      && this.DisponibleForm.get('IdConsecutivo')?.value !== ''
      && this.DisponibleForm.get('IdDigito')?.value !== null
      && this.DisponibleForm.get('IdDigito')?.value !== undefined
      && this.DisponibleForm.get('IdDigito')?.value !== '') {

      if (this.DisponibleOperacionFrom.get('Codigo')?.value === '12') {         // Actualizar titulares disponibles
        if (this.DisponibleForm.get('Clase')?.value === 10) {
          if (this.dataObjetTitulares.length !== 0) {
            this.dataTitulareslist = this.dataObjetTitulares;
            this.DisponibleForm.get('Titulares')?.setValue(this.dataTitulareslist);
            this.loading = true;
            this.DisponiblesServices.ActualizarTitulares(this.DisponibleForm.value).subscribe(
              result => {
                this.VolverArriba(10);
                this.loading = false;
                this.clearTitulares();
                this.BloquearAutorizadoTituloInput(1);
                this.BloquearDatoAutorizadoBtn2 = false;
                this.BloquearDatoAutorizado = false;
                this.DescriTipoFirma = true;
                this.notif.success('Exitoso', 'Se adicionó y/o eliminó autorizado correctamente.', ConfiguracionNotificacion.configRightTop);
                this.btnGuardar = true;
                this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
               
                this.bloquearbtnActalizar = false;
                this.bloquearbtnCalcular = false;
                this.selectEstado = true;
                this.inputEstado = false;
                let tempAutorizaLog: any[] = [];
                if (this.dataTitulareslist.length > 0) {
                  this.dataTitulareslist.forEach(( x: any) => {
                    if (x.Accion != "DB")
                      tempAutorizaLog.push({
                        Accion: x.Accion,
                        Documento: x.Documento,
                        Nombre: x.Nombre,
                        TipoTitular: x.TipoTitular,
                        TipoFirma: x.TipoFirma
                      });
                  });
                }
                if (this.listAutorizadoEliminar.length > 0) {
                  this.listAutorizadoEliminar.forEach(( x: any) => {
                    tempAutorizaLog.push({
                      Accion: "Eliminar",
                      Documento: x.Documento,
                      Nombre: x.Nombre,
                      TipoTitular: x.TipoTitular,
                      TipoFirma: x.TipoFirma,
                      FechaMatricula: new DatePipe('en-CO').transform(x.FechaMatricula, 'yyyy/MM/dd  HH:mm:ss')
                    });
                  });
                }

                this.Guardarlog(tempAutorizaLog);
                setTimeout(( x: any) => {
                  this.ObtenerHistorial();
                }, 300)
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          } else {
            this.notif.warning('Advertencia', 'Debe ingresar al menos un autorizado cuando el titular es menor.', ConfiguracionNotificacion.configRightTop);
          }
        } else {
          this.dataTitulareslist = this.dataObjetTitulares
          this.DisponibleForm.get('Titulares')?.setValue(this.dataTitulareslist);
          this.loading = true;
          this.DisponiblesServices.ActualizarTitulares(this.DisponibleForm.value).subscribe(
            result => {
              this.loading = false;
              this.clearTitulares();
              this.VolverArriba(10);
              this.BloquearAutorizadoTituloInput(1);
              this.BloquearDatoAutorizadoBtn2 = false;
              this.BloquearDatoAutorizado = false;
              this.DescriTipoFirma = true;
              this.notif.success('Exitoso', 'Se adicionó y/o eliminó autorizado correctamente.', ConfiguracionNotificacion.configRightTop);
              this.btnGuardar = true;
              this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
              this.btnActualizar = true;
              this.bloquearbtnActalizar = false;
              this.bloquearbtnCalcular = false;
              this.selectEstado = true;
              this.inputEstado = false;
              let tempAutorizaLog: any[] = [];
              if (this.dataTitulareslist.length > 0) {
                this.dataTitulareslist.forEach(( x: any) => {
                  if (x.Accion != "DB")
                    tempAutorizaLog.push({
                      Accion: x.Accion,
                      Documento: x.Documento,
                      Nombre: x.Nombre,
                      TipoTitular: x.TipoTitular,
                      TipoFirma: x.TipoFirma
                    });
                });
              }
              if (this.listAutorizadoEliminar.length > 0) {
                this.listAutorizadoEliminar.forEach(( x: any) => {
                  tempAutorizaLog.push({
                    Accion: "Eliminar",
                    Documento: x.Documento,
                    Nombre: x.Nombre,
                    TipoTitular: x.TipoTitular,
                    TipoFirma: x.TipoFirma,
                    FechaMatricula: new DatePipe('en-CO').transform(x.FechaMatricula, 'yyyy/MM/dd  HH:mm:ss')
                  });
                });
              }
              
              this.Guardarlog(tempAutorizaLog);
              setTimeout(() => {
                this.ObtenerHistorial();
              }, 300);
              
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          );
        }
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '19') {  // Actualizar el asesor externo

        if ((+this.AsesorFrom.get('strCodigo')?.value !== this.datoAsesorExterno.IdAsesorExterno)
          && (this.AsesorFrom.get('strCodigo')?.value !== this.datoAsesorExterno.IdAsesorExterno)) {
          const IdAsesor = this.AsesorFrom.get('strCodigo')?.value;
          const NombreAsesor = this.AsesorFrom.get('strNombre')?.value;

          if (IdAsesor !== null && IdAsesor !== '' && IdAsesor !== undefined &&
            NombreAsesor !== null && NombreAsesor !== '' && NombreAsesor !== undefined) {
            this.dataAsesor = this.AsesorFrom.get('strCodigo')?.value;
            this.DisponibleForm.get('IdAsesorExterno')?.setValue(this.dataAsesor);

            this.loading = true;
            this.DisponiblesServices.EditarAsesorExterno(this.DisponibleForm.value).subscribe(
              result => {
                this.loading = false;
                this.BloquearAsociado = false;
                this.notif.success('Exitoso', 'El cambio asesor externo se realizó correctamente.', ConfiguracionNotificacion.configRightTop);
                this.btnGuardar = true;
                let asesorExternoLog: any = {
                  IdAsesorExternoAnterior: this.datoAsesorExterno.IdAsesorExterno == null || this.datoAsesorExterno.IdAsesorExterno == 0 ? "" : this.datoAsesorExterno.IdAsesorExterno,
                  NombreAsesorExternoAnterior: this.datoAsesorExterno.NombreAsesorExterno == null ? "" : this.datoAsesorExterno.NombreAsesorExterno,
                  IdAsesorExternoActualiza: IdAsesor,
                  NombreAsesorExternoActualiza: NombreAsesor,
                }
                this.Guardarlog(asesorExternoLog);
                setTimeout(() => {
                  this.ObtenerHistorial();
                }, 1000);
                this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
                this.BloquearAsesorExterno = false;
                this.bloquearbtnActalizar = false;
                this.BloquearCuponInicial = false;
                this.BloquearMedioPago = false;
                this.BloquearCanales = false;
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              });

            this.ObtenerHistorial();
          } else if ((IdAsesor === null || IdAsesor === '' || IdAsesor === undefined) &&
            (NombreAsesor === null || NombreAsesor === '' || NombreAsesor === undefined)) {
            this.dataAsesor = this.AsesorFrom.get('strCodigo')?.value;
            this.DisponibleForm.get('IdAsesorExterno')?.setValue(this.dataAsesor);

            this.loading = true;
            this.DisponiblesServices.EditarAsesorExterno(this.DisponibleForm.value).subscribe(
              result => {
                this.loading = false;
                this.BloquearAsociado = false;
                this.notif.success('Exitoso', 'El cambio asesor externo se realizó correctamente.', ConfiguracionNotificacion.configRightTop);
                this.btnGuardar = true;
                let asesorExternoLog: any = {
                  IdAsesorExternoAnterior: this.datoAsesorExterno.IdAsesorExterno == null ? "" : this.datoAsesorExterno.IdAsesorExterno,
                  NombreAsesorExternoAnterior: this.datoAsesorExterno.NombreAsesorExterno == null ? "" : this.datoAsesorExterno.NombreAsesorExterno,
                  IdAsesorExternoActualiza: IdAsesor == null ? "" : IdAsesor,
                  NombreAsesorExternoActualiza: NombreAsesor == null ? "" : NombreAsesor,
                }
                this.Guardarlog(asesorExternoLog);
                setTimeout(() => {
                  this.ObtenerHistorial();
                }, 1000);
                this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
                this.BloquearAsesorExterno = false;
                this.bloquearbtnActalizar = false;
                this.BloquearCuponInicial = false;
                this.BloquearMedioPago = false;
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              });
          } else {
            this.notif.warning('Advertencia', 'Debe seleccionar un asesor válido.', ConfiguracionNotificacion.configRightTop);
          }

        } else {
          this.notif.warning('Advertencia', 'Debe cambiar asesor externo.', ConfiguracionNotificacion.configRightTop);
          this.enableBtnActualizar = false;
        }
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '21') {  // Actualizar forma de pago
        if (+this.DisponibleForm.get('IdFormaPago')?.value !== this.datoformaPago) {
          let formaPagoLog: any = {
            FormaPagoAnterior: this.resultFormaPago.filter(( x: any) => x.IdFormaPago == this.datoformaPago)[0].DescripcionFormaPago,
            FormaPagoActualiza: this.resultFormaPago.filter(( x: any) => x.IdFormaPago == this.DisponibleForm.get('IdFormaPago')?.value)[0].DescripcionFormaPago,
          }
          this.datoformaPago = +this.DisponibleForm.get('IdFormaPago')?.value;

          if (this.DisponibleForm.get('IdMedioPago')?.value === '0' || this.DisponibleForm.get('IdMedioPago')?.value === 0) {
            this.dataObjetLibreta = {
              Talonarios: []
            };
            this.dataObjetLibreta.Talonarios.push({
              'Inicial': this.DisponibleForm.get('Inicial')?.value,
              'Final': this.DisponibleForm.get('Final')?.value,
            });
            this.dataLibretalist = this.dataObjetLibreta.Talonarios;
            this.DisponibleForm.get('Talonarios')?.setValue(this.dataLibretalist);
          }

          this.loading = true;
          this.DisponiblesServices.ActualizarDisponible(this.DisponibleForm.value).subscribe(
            result => {
              this.loading = false;
              this.BloquearAsociado = false;
              this.notif.success('Exitoso', 'El cambio de forma de pago se actualizó correctamente.', ConfiguracionNotificacion.configRightTop);
              this.btnGuardar = true;
              this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
              this.btnActualizar = true;
              this.enableBtnActualizar = false;
              this.btnActualizarCanales = true;
              this.selectEstado = true;
              this.inputEstado = false;
              this.BloquearFormaPago = false;
              this.bloquearbtnActalizar = false;
              this.Guardarlog(formaPagoLog);
              setTimeout(() => {
                this.ObtenerHistorial();
              }, 1000);
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
              this.itemsDataObejct = [];
              this.BuscarPorCuenta();
              this.BloquearCuponInicial = false;
              this.BloquearMedioPago = false;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          );
          this.ObtenerHistorial();
        } else {
          this.notif.warning('Advertencia', 'Debe cambiar forma de pago', ConfiguracionNotificacion.configRightTop);
          this.bloquearbtnActalizar = false;
        }
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '32') {  // Cambio de libreta o tarjeta

        if (this.DisponibleForm.get('IdMedioPago')?.value === '0' || this.DisponibleForm.get('IdMedioPago')?.value === 0) {
          if (this.DisponibleForm.get('Inicial')?.value !== null
            && this.DisponibleForm.get('Inicial')?.value !== undefined
            && this.DisponibleForm.get('Inicial')?.value !== '') {
            this.loading = true;
            this.DisponiblesServices.ActualizarLibretaTarjeta(this.DisponibleForm.value).subscribe(
              result => {
                this.loading = false;
                this.BloquearAsociado = false;
                this.notif.success('Exitoso', 'El cambio de libreta o tarjeta se actualizó correctamente.',
                  ConfiguracionNotificacion.configRightTop);
                this.BloquearNumeroTarjeta = false;
                this.btnGuardar = true;
                this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
                this.btnActualizarCanales = true;
                this.selectEstado = true;
                this.inputEstado = false;
                this.bloquearbtnActalizar = false;
                this.BloquearCanales = false;
                let cambioLibretaTarjeta: any = {
                  CuponInicialAnterior: this.talonario.Inicial,
                  CuponFinalAnterior: this.talonario.Final,
                  CuponIncialActualiza: Number(this.DisponibleForm.get('Inicial')?.value),
                  CuponFinalActualiza: Number(this.DisponibleForm.get('Final')?.value)
                }
                this.Guardarlog(cambioLibretaTarjeta);
                if (this.DisponibleForm.get('IdMedioPago')?.value !== 0){ // no se genera para libretas
                  setTimeout(() => {
                    this.ObtenerHistorial();
                    this.NovedadesAhorrosPDF('Cambio de libreta', "", true);
                  }, 1000);
              }
                // Notificador
                var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
                var IdCuenta = +result.IdCuenta;
                if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
                  this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 6, '00').subscribe( //ysalazar
                    result => {
                    },
                    error => {
                      const errorMessage = <any>error;
                      console.log(errorMessage);
                    }
                  );
                }
                // fin notificador                
                this.itemsDataObejct = [];
                this.BuscarPorCuenta();
                this.BloquearCuponInicial = false;
                this.BloquearMedioPago = false;
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          }
        } else {
          if (this.DisponibleForm.get('NumeroTarjeta')?.value !== null
            && this.DisponibleForm.get('NumeroTarjeta')?.value !== undefined
            && this.DisponibleForm.get('NumeroTarjeta')?.value !== '') {
            this.loading = true;
            this.DisponiblesServices.ActualizarLibretaTarjeta(this.DisponibleForm.value).subscribe(
              result => {
                this.loading = false;
                this.BloquearAsociado = false;
                this.notif.success('Exitoso', 'El cambio de libreta o tarjeta se actualizó correctamente.', ConfiguracionNotificacion.configRightTop);
                this.BloquearNumeroTarjeta = false;
                this.btnGuardar = true;
                this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
                this.btnActualizarCanales = true;
                this.selectEstado = true;
                this.inputEstado = false;
                this.bloquearbtnActalizar = false;
                this.BloquearCanales = false;
                let cambioTarjetaLog: any = {
                  NumeroTarjetaAnterior: this.tarjetaOld,
                  NumeroTarjetaActuliza: Number(this.DisponibleForm.get('NumeroTarjeta')?.value)
                }
                this.Guardarlog(cambioTarjetaLog);
                this.itemsDataObejct = [];
                this.BuscarPorCuenta();
                this.BloquearCuponInicial = false;
                this.BloquearMedioPago = false;
                if (this.DisponibleForm.get('IdMedioPago')?.value !== 0){ // no se genera para libretas
                  setTimeout(() => {
                    this.NovedadesAhorrosPDF('Cambio de tarjeta', "", true);
                    this.ObtenerHistorial();
                  }, 1000);
              }
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          }
        }
        
      
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '33') {  // Correccion de libreta o tarjeta

        if (this.DisponibleForm.get('IdMedioPago')?.value === '0' || this.DisponibleForm.get('IdMedioPago')?.value === 0) {
          if (this.DisponibleForm.get('Inicial')?.value !== null
            && this.DisponibleForm.get('Inicial')?.value !== undefined
            && this.DisponibleForm.get('Inicial')?.value !== '') {
            this.loading = true;
            this.DisponiblesServices.ActualizarLibretaTarjetaSinCobro(this.DisponibleForm.value).subscribe(
              result => {
                this.loading = false;
                this.BloquearAsociado = false;
                this.notif.success('Exitoso', 'Cambio de libreta o tarjeta se realizó correctamente.', ConfiguracionNotificacion.configRightTop);
                this.BloquearNumeroTarjeta = false;
                this.btnGuardar = true;
                this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
                this.btnActualizarCanales = true;
                this.selectEstado = true;
                this.inputEstado = false;
                this.bloquearbtnActalizar = false;
                this.BloquearCanales = false;
                let correccionLibretaTarjeta: any = {
                  CuponInicialAnterior: this.talonario.Inicial,
                  CuponFinalAnterior: this.talonario.Final,
                  CuponIncialActualiza: Number(this.DisponibleForm.get('Inicial')?.value),
                  CuponFinalActualiza: Number(this.DisponibleForm.get('Final')?.value)
                }
                // Notificador
                var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
                var IdCuenta = +result.IdCuenta;
                if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
                  this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 6, '00').subscribe( //ysalazar
                    result => {
                    },
                    error => {
                      const errorMessage = <any>error;
                      console.log(errorMessage);
                    }
                  );
                }
                // fin notificador
                this.Guardarlog(correccionLibretaTarjeta);
                this.itemsDataObejct = [];
                this.BuscarPorCuenta();
                this.BloquearCuponInicial = false;
                this.BloquearMedioPago = false;
                setTimeout(() => {
                  this.NovedadesAhorrosPDF('Corrección de libreta', "", true);
                  this.ObtenerHistorial();
                }, 3000);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          }
        } else {
          if (this.DisponibleForm.get('NumeroTarjeta')?.value !== null
            && this.DisponibleForm.get('NumeroTarjeta')?.value !== undefined
            && this.DisponibleForm.get('NumeroTarjeta')?.value !== '' || this.TipoNovedad != "") {
            this.loading = true;
            this.DisponiblesServices.ActualizarLibretaTarjetaSinCobro(this.DisponibleForm.value).subscribe(
              result => {
                this.loading = false;
                this.BloquearAsociado = false;
                this.notif.success('Exitoso', 'Cambio de libreta o tarjeta se realizó correctamente.', ConfiguracionNotificacion.configRightTop);
                this.BloquearNumeroTarjeta = false;
                this.btnGuardar = true;
                this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
                this.btnActualizarCanales = true;
                this.selectEstado = true;
                this.inputEstado = false;
                this.bloquearbtnActalizar = false;
                this.BloquearCanales = false;
                let correccionTarjetaLog: any = {
                  NumeroTarjetaAnterior: this.tarjetaOld,
                  NumeroTarjetaActuliza: Number(this.DisponibleForm.get('NumeroTarjeta')?.value)
                }
                if (this.TipoNovedad == "")
                  this.Guardarlog(correccionTarjetaLog);
                this.itemsDataObejct = [];
                this.BuscarPorCuenta();
                this.BloquearCuponInicial = false;
                this.BloquearMedioPago = false;
                setTimeout(() => {
                  this.ObtenerHistorial();
                  this.NovedadesAhorrosPDF(this.TipoNovedad == "" ? 'Corrección de tarjeta' : this.TipoNovedad, "", true);
                }, 3000);
                this.DisponibleOperacionFrom.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          }
        }
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '37') {  // Cambio operacion permitida
        if (+this.DisponibleForm.get('IdOperacion')?.value !== this.datoOperacionPermitida) {

          if (this.DisponibleForm.get('IdMedioPago')?.value === '0' || this.DisponibleForm.get('IdMedioPago')?.value === 0) {
            this.dataObjetLibreta = {
              Talonarios: []
            };
            this.dataObjetLibreta.Talonarios.push({
              'Inicial': this.DisponibleForm.get('Inicial')?.value,
              'Final': this.DisponibleForm.get('Final')?.value,
            });
            this.dataLibretalist = this.dataObjetLibreta.Talonarios;
            this.DisponibleForm.get('Talonarios')?.setValue(this.dataLibretalist);
          }

          this.loading = true;
          this.DisponiblesServices.ActualizarOperacionPermitida(this.DisponibleForm.value).subscribe(
            result => {
              this.loading = false;
              this.BloquearAsociado = false;
              this.notif.success('Exitoso', 'El cambio de operacion permitida se actualizó correctamente.', ConfiguracionNotificacion.configRightTop);
              this.btnGuardar = true;
              this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
              this.btnActualizar = true;
              this.btnActualizarCanales = true;
              this.BloquearCanales = false;
              this.selectEstado = true;
              this.inputEstado = false;
              this.bloquearbtnActalizar = false;
              let OperacionPremitidaLog: any = {
                OperaciónPermitidaAnterior: this.resultOperacionPermitada.filter(( x: any) => x.IdOperacion == this.datoOperacionPermitida)[0].DescripcionOperacion,
                OperacionPermitidaActualiza: this.resultOperacionPermitada.filter(( x: any) => x.IdOperacion == Number(this.DisponibleForm.get('IdOperacion')?.value))[0].DescripcionOperacion,
              }
              // Notificador
              var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
              var IdCuenta = +result.IdCuenta;
              if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
                this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 5, '00').subscribe( //ysalazar
                  result => {
                  },
                  error => {
                    const errorMessage = <any>error;
                    console.log(errorMessage);
                  }
                );
              }
              // fin notificador
              this.Guardarlog(OperacionPremitidaLog);
              this.DisponibleOperacionFrom.get('Codigo')?.reset();
              this.itemsDataObejct = [];
              setTimeout(() => {
                this.ObtenerHistorial();
                this.BuscarPorCuenta();
              }, 1000);
             
              this.BloquearCuponInicial = false;
              this.BloquearMedioPago = false;
              this.BloquearOperacionPermitida = false;
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              console.log(errorMessage);
            }
          );
        } else {
          this.notif.warning('Advertencia', 'Debe cambiar operacion permitida.', ConfiguracionNotificacion.configRightTop);
          this.bloquearbtnActalizar = false;
        }
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '36') {  // Editar canales
        if (this.dataObjetC.Canales.length < 1) {
          this.notif.warning('Advertencia', 'Debe ingresar al menos un canal.', ConfiguracionNotificacion.configRightTop);
          return;
        }
        if (this.dataObjetC !== undefined) {
          this.dataCanaleslist = this.dataObjetC.Canales;
          this.DisponibleForm.get('Canales')?.setValue(this.dataCanaleslist);
        }
        this.loading = true;
        this.DisponiblesServices.ActualizarCanales(this.DisponibleForm.value).subscribe(
          result => {
            this.loading = false;
            this.showBtnCanalesActualizar = false;
            this.BloquearAsociado = false;
            this.notif.success('Exitoso', 'La edición de canales se actualizó correctamente.', ConfiguracionNotificacion.configRightTop);
            // Notificador
            var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
            var IdCuenta = +result.IdCuenta;
            this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 9, '00').subscribe(
              result => {
              },
              error => {
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
            // fin notificador
            this.btnGuardar = true;
            this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
            this.btnActualizar = true;
            this.btnActualizarCanales = true;
            this.selectEstado = true;
            this.inputEstado = false;
            this.bloquearbtnActalizar = false;
            this.BloquearCanales = false;
            let canalesLog: any[] = [];
            if (this.dataObjetC.Canales.length > 0) {
              this.canalesListOld.forEach(( x: any) => { delete x.$id, delete x.Cuenta, delete x.DescripcionCanal });
              this.dataObjetC.Canales.forEach(( x: any) => { delete x.$id, delete x.Cuenta, delete x.DescripcionCanal });
              let tempPosOld: any = this.canalesListOld.filter(( x: any) => x.Canal == "02")[0];
              let tempPos: any = this.dataObjetC.Canales.filter(( x: any) => x.Canal == "02")[0];
              let tempWebOld: any = this.canalesListOld.filter(( x: any) => x.Canal == "04")[0];
              let tempWeb: any = this.dataObjetC.Canales.filter(( x: any) => x.Canal == "04")[0];
              let tempBancaMovilOld: any = this.canalesListOld.filter(( x: any) => x.Canal == "05")[0];
              let tempBancaMovil: any = this.dataObjetC.Canales.filter(( x: any) => x.Canal == "05")[0];
              let tempATMOld: any = this.canalesListOld.filter(( x: any) => x.Canal == "01")[0];
              let tempATM: any = this.dataObjetC.Canales.filter(( x: any) => x.Canal == "01")[0];


                
              if ((tempPosOld != tempPos && tempPosOld != null && tempPos != null) || (tempPosOld == null && tempPos != null))
                canalesLog.push(tempPosOld == null ? { Accion: "Adicion", Canal: tempPos.Canal, Descripcion: tempPos.Descripcion, nroOperaciones: tempPos.NumeroOperaciones, Cupo: tempPos.MontoMaximo } : { Accion: "Editar", CanalAnterior: tempPosOld.Canal, DescripcionAnterior: tempPosOld.Descripcion, nroOperacionesAnterior: tempPosOld.NumeroOperaciones, CupoAnterior: tempPosOld.MontoMaximo, CanalActualizar: tempPos.Canal, DescripcionActualiza: tempPos.Descripcion, NroOperacionesActualiza: tempPos.NumeroOperaciones, CupoActualiza: tempPos.MontoMaximo });
              else if (tempPosOld != null && tempPos == null)
                canalesLog.push({ Accion: "Eliminar", Canal: tempPosOld.Canal, Descripcion: tempPosOld.Descripcion, nroOperaciones: tempPosOld.NumeroOperaciones, Cupo: tempPosOld.MontoMaximo });
              if ((tempWebOld != tempWeb && tempWebOld != null && tempWeb != null) || (tempWebOld == null && tempWeb != null))
                canalesLog.push(tempWebOld == null ? { Accion: "Adicion", Canal: tempWeb.Canal, Descripcion: tempWeb.Descripcion, nroOperaciones: tempWeb.NumeroOperaciones, Cupo: tempWeb.MontoMaximo } : { Accion: "Editar", CanalAnterior: tempWebOld.Canal, DescripcionAnterior: tempWebOld.Descripcion, nroOperacionesAnterior: tempWebOld.NumeroOperaciones, CupoAnterior: tempWebOld.MontoMaximo, CanalActualizar: tempWeb.Canal, DescripcionActualiza: tempWeb.Descripcion, NroOperacionesActualiza: tempWeb.NumeroOperaciones, CupoActualiza: tempWeb.MontoMaximo });
              else if (tempWebOld != null && tempWeb == null)
                canalesLog.push({ Accion: "Eliminar", Canal: tempWebOld.Canal, Descripcion: tempWebOld.Descripcion, nroOperaciones: tempWebOld.NumeroOperaciones, Cupo: tempWebOld.MontoMaximo });
              if ((tempBancaMovilOld != tempBancaMovil && tempBancaMovilOld != null && tempBancaMovil != null) || (tempBancaMovilOld == null && tempBancaMovil != null))
                canalesLog.push(tempBancaMovilOld == null ? { Accion: "Adicion", Canal: tempBancaMovil.Canal, Descripcion: tempBancaMovil.Descripcion, nroOperaciones: tempBancaMovil.NumeroOperaciones, Cupo: tempBancaMovil.MontoMaximo } : { Accion: "Editar", CanalAnterior: tempBancaMovilOld.Canal, DescripcionAnterior: tempBancaMovilOld.Descripcion, nroOperacionesAnterior: tempBancaMovilOld.NumeroOperaciones, CupoAnterior: tempBancaMovilOld.MontoMaximo, CanalActualizar: tempBancaMovil.Canal, DescripcionActualiza: tempBancaMovil.Descripcion, NroOperacionesActualiza: tempBancaMovil.NumeroOperaciones, CupoActualiza: tempBancaMovil.MontoMaximo });
              else if (tempBancaMovilOld != null && tempBancaMovil == null)
                canalesLog.push({ Accion: "Eliminar", Canal: tempBancaMovilOld.Canal, Descripcion: tempBancaMovilOld.Descripcion, nroOperaciones: tempBancaMovilOld.NumeroOperaciones, Cupo: tempBancaMovilOld.MontoMaximo });
              if ((tempATMOld != tempATM && tempATMOld != null && tempATM != null) || (tempATMOld == null && tempATM != null))
                canalesLog.push(tempATMOld == null ? { Accion: "Adicion", Canal: tempATM.Canal, Descripcion: tempATM.Descripcion, nroOperaciones: tempATM.NumeroOperaciones, Cupo: tempATM.MontoMaximo } : { Accion: "Editar", CanalAnterior: tempATMOld.Canal, DescripcionAnterior: tempATMOld.Descripcion, nroOperacionesAnterior: tempATMOld.NumeroOperaciones, CupoAnterior: tempATMOld.MontoMaximo, CanalActualizar: tempATM.Canal, DescripcionActualiza: tempATM.Descripcion, NroOperacionesActualiza: tempATM.NumeroOperaciones, CupoActualiza: tempATM.MontoMaximo });
              else if (tempATMOld != null && tempATM == null)
                canalesLog.push({ Accion: "Eliminar", Canal: tempATMOld.Canal, Descripcion: tempATMOld.Descripcion, nroOperaciones: tempATMOld.NumeroOperaciones, Cupo: tempATMOld.MontoMaximo });
            }
            if (canalesLog.length == 0)
              canalesLog.push({ Accion: "No hubo edición de registros " });
                
            this.Guardarlog(canalesLog);
            setTimeout(() => {
              this.ObtenerHistorial();
              this.NovedadesAhorrosPDF('Editar canales');
            }, 1000);
            this.itemsDataObejct = [];
            this.BuscarPorCuenta();          
            this.BloquearCuponInicial = false;
            this.BloquearMedioPago = false;
            this.BloquearOperacionPermitida = false;

            this.BloquearCanalesInputs = false;
            this.DisponibleForm.controls["Canal"].disable();
            this.DisponibleForm.controls["NumeroOperaciones"].disable();
            this.DisponibleForm.controls["MontoMaximo"].disable();
            this.DisponibleForm.controls["Canal"].setValue("");
            this.DisponibleForm.controls["NumeroOperaciones"].setValue("");
            this.DisponibleForm.controls["MontoMaximo"].setValue("");
            this.DisponibleOperacionFrom.get('Codigo')?.reset();

          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '38') {  // Cambiar medio pago
        const mediopago: string = `${this.DisponibleForm.get('IdMedioPago')?.value ?? ''}`;
        const numeroTarjeta: string = `${this.DisponibleForm.get('NumeroTarjeta')?.value ?? ''}`;
        const numeroPagare: string = `${this.DisponibleForm.get('NumeroPagare')?.value ?? ''}`;
        const plazo: string = `${this.DisponibleForm.get('IdPlazo')?.value ?? ''}`;
        const diaCorte: string = `${this.DisponibleForm.get('IdDiaCorte')?.value ?? ''}`;
        const medioPagoAnterior : string = `${this.datoMedioPago ?? ''}`;

        if ((mediopago === '10' || mediopago === '50') && (!numeroTarjeta || numeroTarjeta.trim()==='')) {
          this.notif.warning('Advertencia', 'Debe ingresar el número de la tarjeta para el medio de pago seleccionado.', ConfiguracionNotificacion.configRightTop);
          return;
        } else if((mediopago === '50') && (!numeroPagare || numeroPagare.trim()==='' || !plazo || plazo.trim()==='' || !diaCorte || diaCorte.trim()==='' )) {
          this.notif.warning('Advertencia', 'Debe ingresar los campos obligatorios para el medio de pago seleccionado.', ConfiguracionNotificacion.configRightTop);
          return;
        } else if((mediopago === '70') && (!numeroPagare || numeroPagare.trim()==='' || !plazo || plazo.trim()==='' || !diaCorte || diaCorte.trim()==='' )) {
          this.notif.warning('Advertencia', 'Debe ingresar los campos obligatorios para el medio de pago seleccionado.', ConfiguracionNotificacion.configRightTop);
          return;
        } else if(medioPagoAnterior === this.DisponibleForm.get('IdMedioPago')?.value ){
          this.notif.warning('Advertencia', 'Debe cambiar el medio de pago.', ConfiguracionNotificacion.configRightTop);
          return;
        } else{
    
        if (this.DisponibleForm.get('IdMedioPago')?.value === '0') {
          this.notif.warning('Advertencia', 'Cuando medio de pago es libreta no se puede cambiar.', ConfiguracionNotificacion.configRightTop);
          this.enableBtnActualizar = false;
          return;
        }
        if (this.dataObjetC !== undefined) {
          this.dataCanaleslist = this.dataObjetC.Canales;
          this.DisponibleForm.get('Canales')?.setValue(this.dataCanaleslist);
        }
        let MedioPagoLog: any = {
          MedioPagoAnterior: this.resultMedioPago.filter(( x: any) => x.IdMedioPago == this.datoMedioPago)[0].Descripcion,
          MedioPagoActualiza: this.resultMedioPago.filter(( x: any) => x.IdMedioPago == this.DisponibleForm.get('IdMedioPago')?.value)[0].Descripcion,
          Convenio: this.resultConvenioTarjetas.filter(( x: any) => x.IdConvenio == this.DisponibleForm.get('IdConvenio')?.value)[0].DescripcionConvenio
        }
        if (this.DisponibleForm.get('NumeroPagare')?.value != "")
          MedioPagoLog.NumeroPagare = this.DisponibleForm.get('NumeroPagare')?.value;
        else
          MedioPagoLog.NumeroPagare = "Sin Pagare";
        if (this.tarjetaOld != Number(this.DisponibleForm.get('NumeroTarjeta')?.value)) {
          MedioPagoLog.NumeroTarjetaAnterior = this.tarjetaOld;
          MedioPagoLog.NumeroTarjetaActuliza = Number(this.DisponibleForm.get('NumeroTarjeta')?.value);
        }
        else if (this.DisponibleForm.get('NumeroTarjeta')?.value != "")
          MedioPagoLog.NumeroTarjeta = this.DisponibleForm.get('NumeroTarjeta')?.value;
        if (this.DisponibleForm.get('IdDiaCorte')?.value != "0") {
          let tempDiaPago: any = this.resultDiaCortePago.filter(( x: any) => x.intDiaCorte == this.DisponibleForm.get('IdDiaCorte')?.value)[0];
          MedioPagoLog.DiaCortePago = tempDiaPago.intDiaCorte + " - " + tempDiaPago.intDiaPago;
        }
        if (this.DisponibleForm.get('IdPlazo')?.value != "0")
          MedioPagoLog.Plazo = this.resultPlazo.filter(( x: any) => x.intPlazo == this.DisponibleForm.get('IdPlazo')?.value)[0].intPlazo;

        let payload: any = this.DisponibleForm.value;
        payload.IdMedioPagoAnterior = this.datoMedioPago;

        if (this.DisponibleForm.get('IdMedioPago')?.value === '10' || this.DisponibleForm.get('IdMedioPago')?.value === '60') {
          if (this.DisponibleForm.get('IdConvenio')?.value !== null
            && this.DisponibleForm.get('IdConvenio')?.value !== ' '
            && this.DisponibleForm.get('IdConvenio')?.value !== undefined
            && ((this.DisponibleForm.get('NumeroTarjeta')?.value !== null
              && this.DisponibleForm.get('NumeroTarjeta')?.value !== ' '
              && this.DisponibleForm.get('NumeroTarjeta')?.value !== undefined && this.DisponibleForm.get('IdMedioPago')?.value === '10') || (this.DisponibleForm.get('IdMedioPago')?.value === '60'))) {
                           
            this.loading = true;
            payload.FechaCambioPlazo = 'NULL';
            payload.FechaRediferir = 'NULL';
           
            this.DisponiblesServices.ActualizarMedioPago(payload).subscribe(
              result => {
                this.loading = false;
                this.BloquearAsociado = false;
                this.BloquearDiaCortePlazo = false;
                this.BloquearMedioPago = false;
                this.notif.success('Exitoso', 'El medio de pago se actualizó correctamente.', ConfiguracionNotificacion.configRightTop);
                this.btnGuardar = true;
                this.btnActualizar = true;
                this.btnActualizarCanales = true;
                this.selectEstado = true;
                this.inputEstado = false;
                this.BloquearFormaPago = false;
                this.bloquearbtnActalizar = false;
                this.BloquearCanales = false;
                this.Guardarlog(MedioPagoLog);
                this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.itemsDataObejct = [];
                this.BloquearCuponInicial = false;
                this.BloquearMedioPago = false;
                this.BloquearOperacionPermitida = false;
                this.BloquearConvenio = false;
                this.BloquearNumeroTarjeta = false;
                this.BloquearPagare = false;
                // Notificador
                var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
                var IdCuenta = +result.IdCuenta;
                this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 5, '00').subscribe(
                  result => {
                  },
                  error => {
                    const errorMessage = <any>error;
                    console.log(errorMessage);
                  }
                );
            // fin notificador
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
            
          } else {
            this.notif.warning('Advertencia', 'Los datos están incompletos.', ConfiguracionNotificacion.configRightTop);
            return;
          }
        }
        else if (this.DisponibleForm.get('IdMedioPago')?.value === '50' || this.DisponibleForm.get('IdMedioPago')?.value === '70') {
          if (this.DisponibleForm.get('IdConvenio')?.value !== null
            && this.DisponibleForm.get('IdConvenio')?.value !== ' '
            && this.DisponibleForm.get('IdConvenio')?.value !== undefined
            && ((this.DisponibleForm.get('NumeroTarjeta')?.value !== null
              && this.DisponibleForm.get('NumeroTarjeta')?.value !== ' '
              && this.DisponibleForm.get('NumeroTarjeta')?.value !== undefined && this.DisponibleForm.get('IdMedioPago')?.value === '50') || (this.DisponibleForm.get('IdMedioPago')?.value === '70'))
            && this.DisponibleForm.get('IdDiaCorte')?.value !== null
            && this.DisponibleForm.get('IdDiaCorte')?.value != '0'
            && this.DisponibleForm.get('IdDiaCorte')?.value !== undefined
            && this.DisponibleForm.get('IdPlazo')?.value !== null
            && this.DisponibleForm.get('IdPlazo')?.value != '0'
            && this.DisponibleForm.get('IdPlazo')?.value !== undefined) {
            this.loading = true;
            const fechaActual = new Date();
            const formatoFecha = fechaActual.getFullYear() + '/' + 
                     String(fechaActual.getMonth() + 1).padStart(2, '0') + '/' + 
                     String(fechaActual.getDate()).padStart(2, '0');

            payload.FechaCambioPlazo = formatoFecha;
            payload.FechaRediferir = formatoFecha;
            this.DisponiblesServices.ActualizarMedioPago(payload).subscribe(
              result => {
                this.loading = false;
                this.BloquearAsociado = false;
                this.BloquearDiaCortePlazo = false;
                this.BloquearMedioPago = false;
                this.notif.success('Exitoso', 'El medio de pago se actualizó correctamente.', ConfiguracionNotificacion.configRightTop);
                this.btnGuardar = true;
                this.btnActualizar = true;
                this.btnActualizarCanales = true;
                this.selectEstado = true;
                this.inputEstado = false;
                this.BloquearFormaPago = false;
                this.bloquearbtnActalizar = false;
                this.BloquearCanales = false;
                this.Guardarlog(MedioPagoLog);
                this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.itemsDataObejct = [];
                this.BloquearCuponInicial = false;
                this.BloquearMedioPago = false;
                this.BloquearOperacionPermitida = false;
                this.BloquearConvenio = false;
                this.BloquearNumeroTarjeta = false;
                this.BloquearPagare = false;
                // Notificador
                var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
                var IdCuenta = +result.IdCuenta;
                this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 8, '00').subscribe(
                  result => {
                  },
                  error => {
                    const errorMessage = <any>error;
                    console.log(errorMessage);
                  }
                );
            // fin notificador
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
            
          } else {
            this.notif.warning('Advertencia', 'Los datos están incompletos.', ConfiguracionNotificacion.configRightTop);
            return;
          }
        }
        setTimeout(() => {
          //cuando hay cambio de tarjetas ysalazar 30/05/2025
          const MedioPagoAnterior = this.datoMedioPago;
          const tarjetaAhora = this.DisponibleForm.get('NumeroTarjeta')?.value;
          const MedioPagoAhora = this.DisponibleForm.get('IdMedioPago')?.value;
          if (MedioPagoAnterior === 0) {// Medio de pago anterior Libreta

            if (MedioPagoAhora !== 60 || MedioPagoAhora !== 70)
            this.DisponiblesServices.ActualizarLibretaTarjetaSinCobro(this.DisponibleForm.value).subscribe(
              result => {                
                },
              error => {
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );

            // liberar libreta
            if ((this.DisponibleForm.get('IdEstado')?.value == 45)) {
              const libretaAhora = this.DisponibleForm.get('Inicial')?.value;
              if (this.talonario.Inicial !== libretaAhora) {
                this.validarLiberacion(true);
              } else {
                this.validarLiberacion(false);
              }
            }
            
          } else if (MedioPagoAnterior === 10 || MedioPagoAnterior === 50 ){ // Medio de pago anterior tarjeta sin cupo o con cupo
            if (this.tarjetaOld !== tarjetaAhora) {
              this.DisponiblesServices.ActualizarLibretaTarjeta(this.DisponibleForm.value).subscribe(
                result => {
                  swal.fire({
                    title: '<strong>¡Advertencia!</strong>',
                    text: '',
                    icon: 'warning', 
                    animation: false,
                    html: 'Se ha identificado cambio en el número de tarjeta, recuerde generar el cobro del plástico al asociado.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  })
                },
                error => {
                  const errorMessage = <any>error;
                  console.log(errorMessage);
                }
              );
            }
            
          }else if (MedioPagoAnterior === 60  || MedioPagoAnterior === 70 ){ // Medio de pago anterior sin tarjeta sin cupo y con cupo
            this.DisponiblesServices.ActualizarLibretaTarjetaSinCobro(this.DisponibleForm.value).subscribe(
              result => {
              },
              error => {
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          }
          this.BuscarPorCuenta();
          this.ObtenerHistorial();
          this.NovedadesAhorrosPDF('Cambio medio de pago');
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
          
        }, 1200);
      }
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '34') {  // Asignar cupo 
        this.loading = true;
        let payload: any = this.DisponibleForm.value;
        payload.Real = this.ListGarantiasRealesAgregadas;
        payload.Codeudor = this.dataObjetCd;
        this.DisponiblesServices.AsignarCupo(payload).subscribe(
          result => {
            this.AsignarCupo = true;
            this.loading = false;
            this.BloquearAsociado = false;
            this.notif.success('Exitoso', 'El asignar cupo se actualizó correctamente.', ConfiguracionNotificacion.configRightTop);
            this.btnGuardar = true;
            this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
            this.DisponibleForm.get('IdCuentaCupo')?.setValue(result.IdCuentaCupo);
            this.btnActualizar = true;
            this.btnActualizarCanales = true;
            this.BloquearCanales = false;
            this.selectEstado = true;
            this.inputEstado = false;
            this.bloquearbtnActalizar = false;
            this.enableBtnActualizar = false;
            this.GuardarGarantiasAndLog("guardar");
              setTimeout(() => {
              this.ObtenerHistorial();
              this.itemsDataObejct = [];
              this.BuscarPorCuenta();
            }, 200);
              
            this.BloquearCuponInicial = false;
            this.BloquearMedioPago = false;
            this.BloquearOperacionPermitida = false;
            this.BloquearPagare = false;
            this.BloquearRadicado = false;
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
        
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '75') {  // Activar cuenta
        this.loading = true;
        this.DisponiblesServices.ActivarCuenta(this.DisponibleForm.get('IdCuenta')?.value).subscribe(
          result => {
            this.loading = false;
            this.BloquearAsociado = false;
            this.notif.success('Exitoso', 'Activación cuenta se realizó correctamente', ConfiguracionNotificacion.configRightTop);
            this.btnGuardar = true;
            this.Guardarlog({});
            this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
            this.btnActualizar = true;
            this.BloquearAsesorExterno = false;
            this.bloquearbtnActalizar = false;
            this.BloquearCuponInicial = false;
            this.BloquearMedioPago = false;
            this.BloquearCanales = false;
            setTimeout(() => {
              this.ObtenerHistorial();
              this.NovedadesAhorrosPDF('Activación Cuenta');
            }, 1000);

            this.DisponibleOperacionFrom.get('Codigo')?.reset();
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            console.log(errorMessage);
          });

        this.ObtenerHistorial();
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '111') { // Marcar y desmarcar GMF
        if (this.ExoneradaGmfOld == this.DisponibleForm.get('ExoneradaGmf')?.value) {
          this.notif.warning('Advertencia', 'Debe cambiar exonerada G.M.F.', ConfiguracionNotificacion.configRightTop);
          return;
        }
        // valida que la cuenta no esté marcada como exenta G.M.F
        if (this.DisponibleForm.get('Exenta')?.value === '1' || this.DisponibleForm.get('Exenta')?.value === 1 || this.DisponibleForm.get('Exenta')?.value === true || this.DisponibleForm.get('Exenta')?.value === 'true') {
          this.notif.warning('Advertencia', 'La cuenta está marcada como exenta.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
          this.DisponibleForm.get('ExoneradaGmf')?.setValue(this.ExoneradaGmfOld );
          this.EnableExoneradaGMF = false;
          this.btnActualizar = true;
          return;
        }
        this.loading = true;
        this.EnableExoneradaGMF = false;
        this.btnActualizar = true;
        let payload: any = {
          IdCuenta: this.DisponibleForm.get('IdCuenta')?.value,
          blnExoneradaGMF : this.DisponibleForm.get('ExoneradaGmf')?.value
        }
        this.DisponiblesServices.MarcarODesmarcarGMF(payload).subscribe(( x: any) => {
          this.loading = false;
          this.BuscarPorCuenta();
          this.notif.success('Exitoso', 'Se marca/desmarca GMF correctamente.', ConfiguracionNotificacion.configRightTop);
          this.Guardarlog({ExoneradaGMFActualiza : this.DisponibleForm.get('ExoneradaGmf')?.value});
          setTimeout(() => {
            this.ObtenerHistorial();            
          }, 1000);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
         }, error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        })
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '109') { // Timbrar mensaje
        if (this.TibrarComentarioOld == this.DisponibleForm.get('TibrarComentario')?.value) {
          this.notif.warning('Advertencia','Debe cambiar timbrar mensaje.', ConfiguracionNotificacion.configRightTop);
          return;
        }
        this.loading = true;
        this.BloquearTimbrarMensaje = false;
        this.btnActualizar = true;
        let payload: any = {
          IdCuenta: this.DisponibleForm.get('IdCuenta')?.value,
          TimbrarMensajeBln : this.DisponibleForm.get('TibrarComentario')?.value
        }
        this.DisponiblesServices.TimbrarMensaje(payload).subscribe(( x: any) => {
          this.loading = false;
          this.notif.success('Exitoso', 'Se editó timbrar mensaje correctamente.', ConfiguracionNotificacion.configRightTop);
          this.Guardarlog({TimbrarMensajeActualiza  : this.DisponibleForm.get('TibrarComentario')?.value});
          setTimeout(() => {
            this.ObtenerHistorial();
          }, 1000);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
         }, error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        })
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '110') { // Exonera cuota de manejo  hasta
        if (this.ExoCobroHastaOld == this.DisponibleForm.get('ExoCobroHasta')?.value) {
          this.notif.warning('Advertencia','Debe cambiar fecha exonerada cuota manejo hasta.', ConfiguracionNotificacion.configRightTop);
          return;
        };
        console.log("ExoCobroHasta",this.DisponibleForm.get('ExoCobroHasta')?.value)
         this.loading = true;
         this.BloquearExoCobroHasta = false;
         this.btnActualizar = true;
        let payload: any = {
          IdCuenta: this.DisponibleForm.get('IdCuenta')?.value,
          ExoneraCuotaManejoHasta : this.DisponibleForm.get('ExoCobroHasta')?.value 
        }
        if (this.DisponibleForm.get('ExoCobroHasta')?.value == "" || this.DisponibleForm.get('ExoCobroHasta')?.value == null)
          payload.Empty = true;
        else 
          payload.Empty = false;

         this.DisponiblesServices.ExoneraCuotaManejoHasta(payload).subscribe(( x: any) => {
           this.loading = false;
           let log: any = {
             ExoneradoCuotaManejoAnterior: this.ExoCobroHastaOld == null ? "" : this.ExoCobroHastaOld,
             ExoneradoCuotaManejoActualiza  : this.DisponibleForm.get('ExoCobroHasta')?.value == null ? "" : this.DisponibleForm.get('ExoCobroHasta')?.value
           }
           this.notif.success('Exitoso', 'Se exonera cuota correctamente.', ConfiguracionNotificacion.configRightTop);
           this.Guardarlog(log);
           setTimeout(() => {
             this.ObtenerHistorial();
             this.VolverArriba();
           }, 1000);
           this.DisponibleOperacionFrom.get('Codigo')?.reset();
          }, error => {
           this.loading = false;
           const errorMessage = <any>error;
           console.log(errorMessage);
        })
      } else if (this.DisponibleOperacionFrom.get('Codigo')?.value === '117') { // Marcar y desmarcar exento GMF
        if (this.ExentaGmfOld == this.DisponibleForm.get('Exenta')?.value) {
          this.notif.warning('Advertencia', 'Debe cambiar exento G.M.F.', ConfiguracionNotificacion.configRightTop);
          return;
        }
        // valida que la cuenta no esté marcada como exonerada G.M.F
        if (this.DisponibleForm.get('ExoneradaGmf')?.value === '1' || this.DisponibleForm.get('ExoneradaGmf')?.value === 1 || this.DisponibleForm.get('ExoneradaGmf')?.value === true || this.DisponibleForm.get('ExoneradaGmf')?.value === 'true') {
          this.notif.warning('Advertencia', 'La cuenta está marcada como exonerada.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
          this.DisponibleForm.get('Exenta')?.setValue(this.ExentaGmfOld);
          this.EnableExentaGMF = false;
          this.btnActualizar = true;
          return;
        }
        this.loading = true;
        this.EnableExentaGMF = false;
        this.btnActualizar = true;
        let payload: any = {
          IdCuenta: this.DisponibleForm.get('IdCuenta')?.value,
          blnExenta : this.DisponibleForm.get('Exenta')?.value
        }
        this.DisponiblesServices.MarcarODesmarcarExentoGMF(payload).subscribe(( x: any) => {
          this.loading = false;
          this.notif.success('Exitoso', 'Se marca/desmarca exento GMF correctamente.', ConfiguracionNotificacion.configRightTop);
          this.Guardarlog({ExentoGMFActualiza : this.DisponibleForm.get('Exenta')?.value});
          setTimeout(() => {
            this.ObtenerHistorial();
          }, 1000);
          this.DisponibleOperacionFrom.get('Codigo')?.reset();
         }, error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        })
      }
    } else 
      this.notif.warning('Advertencia','Debe buscar una cuenta para realizar esta operación.', ConfiguracionNotificacion.configRightTop);
  }

  validarLiberacion(cambios: boolean) {
    if (cambios) {
      const estado = this.DisponibleForm.get('IdEstado')?.value;
      const medioPago = this.datoMedioPago; 

      if (estado == 45) {
        switch (medioPago) {
          case 10:
          case 50:
          case 0:
            swal.fire({
              title: '¿Desea liberar libreta de cuenta?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Sí',
              cancelButtonText: 'No',
              confirmButtonColor: 'rgb(13,165,80)',
              cancelButtonColor: 'rgb(160,0,87)',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then((result) => {
              if (result.isConfirmed) {
                this.LiberarLibreta(this.talonario.Inicial);
                this.notif.success(
                  'Exitoso',
                  'La liberación de libreta se realizó correctamente.',
                  ConfiguracionNotificacion.configRightTop
                );
              }
            });
            break;
        }
      }
    }
  }
  
  NombreAsesor() {
    let NombreCompleto: string = "";
    let setNombres: string[] = this.dataUser.Nombre.split(" ");
    if (setNombres.length > 0) {
       setNombres.forEach(( x: any) => {
        NombreCompleto = NombreCompleto + " " + x.substring(0,1).toUpperCase() + x.slice(1).toLowerCase()
      })
    } else {
      return this.dataUser.Nombre
    }
    return NombreCompleto;
  }  
  TimbrarMensaje() {
    if (this.DisponibleForm.get('IdProducto')?.value === 106) {
      this.BloquearTimbrarMensaje = null;
      this.DisponibleForm.get('TibrarComentario')?.setValue(0);
    } else {
      this.BloquearTimbrarMensaje = false;
      this.DisponibleForm.get('TibrarComentario')?.setValue(0);
    }
  }
  ActivarCuenta() {
    this.loading = true;
    this.DisponiblesServices.ActivarCuenta(this.DisponibleForm.get('IdCuenta')?.value).subscribe(
      result => {
        this.loading = false;
        this.BloquearAsociado = false;
        this.notif.success('Exitoso', 'Activación cuenta se realizó correctamente', ConfiguracionNotificacion.configRightTop);
        this.btnGuardar = true;
        this.Guardarlog({});
        this.DisponibleForm.get('IdCuenta')?.setValue(result.IdCuenta);
        this.btnActualizar = true;
        this.BloquearAsesorExterno = false;
        this.bloquearbtnActalizar = false;
        this.BloquearCuponInicial = false;
        this.BloquearMedioPago = false;
        this.BloquearCanales = false;
        this.BuscarPorCuenta();
        setTimeout(() => {
          this.ObtenerHistorial();
          this.NovedadesAhorrosPDF('Activación Cuenta');
        }, 1000);

        this.DisponibleOperacionFrom.get('Codigo')?.reset();
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      });

    this.ObtenerHistorial();
  }
  linkPdf: any;
  showRegistroFirma: boolean = false;

  loadTiffScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Tiff) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/tiff@latest/tiff.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject('No se pudo cargar tiff.min.js');
      document.body.appendChild(script);
    });
  }

  showPdf() {
    this.loading = true;
    const NumeroDocumento = this.DisponibleForm.get('NumeroDocumento')?.value;
    let NumeroCuenta: string = this.DisponibleForm.get('Cuenta')?.value;
    NumeroCuenta = NumeroCuenta.replace(/-/g, "");
    this.showRegistroFirma = false;
    if (document.querySelector("object") != null) {
      document.querySelector("object")!.data = "";
      document.querySelector("object")!.name = "";
      document.querySelector("object")!.type = "";
    }
    this.converted_image = "";
    this.DisponiblesServices.DescargarRegistroFirmas(NumeroDocumento, NumeroCuenta).subscribe(
      result => {
        this.loading = false;        
        let base64: string[] = result.split("$$//");
        if (base64.length == 2) {
            this.base64Data = base64[1];
            base64[0] = base64[0].replace(".", "").toLowerCase();
          if (base64[0] == "tif" || base64[0] == "tiff") {
            this.ImagenTiff = base64;
            this.showRegistroFirma = true;
            let base64Tiff: any = this.base64Data;
            const bynaryData: any = Uint8Array.from(atob(base64Tiff), (x: any) => x.charCodeAt(0));
            this.loadTiffScript().then(() => {
              const Tiff = (window as any).Tiff;
              const tiff: any = new Tiff({ buffer: bynaryData });
              const canvas: any = tiff.toCanvas();
              let jpgBase64Data: any = canvas.toDataURL("image/jpeg").replace(/^data:image\/jpeg;base64,/, "");
              jpgBase64Data = "data:image/jpeg;base64," + jpgBase64Data;
              this.converted_image = jpgBase64Data;
              this.ModalImagenRegistroFirmas.nativeElement.click();
            }).catch((error) => {
              console.error("Error cargando el script de Tiff.js:", error);
            });
          } else if (base64[0] == "pdf") {
            $("#PdfRegistroFirma").show();
            this.ModalImagenRegistroFirmas.nativeElement.click();
           const pdfinBase64: string = base64[1];
            const byteArray = new Uint8Array(
              atob(pdfinBase64)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const newBlob = new Blob([byteArray], { type: "application/pdf" });            
            const url = URL.createObjectURL(newBlob);
            this.linkPdf = url; 
            const pdfObject = document.querySelector("object");
            if (pdfObject) {
              pdfObject.data = url;
              pdfObject.name = "Impresion";
              pdfObject.type = "application/pdf";
            } else {
              console.error("No se encontró el elemento <object> para mostrar el PDF.");
            }
          } else {
            this.showRegistroFirma = true;
            this.converted_image = "data:image/*;base64," + this.base64Data;
            this.ModalImagenRegistroFirmas.nativeElement.click();
          }
        }
        else
          this.notif.warning('Advertencia',result +".", ConfiguracionNotificacion.configRightTop);
        this.loading = false;
      }, error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(errorMessage);
      });
  }
  ImagenTiff: string[] = [];
  DescargarTiff() {
    let NumeroCuenta: string = this.DisponibleForm.get('Cuenta')?.value;
      const linkSource = "data:image/" + this.ImagenTiff[0] + ";base64," + this.ImagenTiff[1];
      const downloadLink = document.createElement("a");
      const fileName = "RegistroFirmas_" + NumeroCuenta + "." + this.ImagenTiff[0];
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
  }
  NovedadesAhorrosPDF(TipoNovedad : string,motivo : string  = "", entregaTarjetaBool : boolean = false ) {
    let itemsSendNovedad: any = {};

    if (motivo != "")
      itemsSendNovedad.MotivoNovedad = motivo;
    itemsSendNovedad.EntregaTarjeta = entregaTarjetaBool;
    itemsSendNovedad.Nombre = this.DisponibleForm.get('Nombre')?.value;
    itemsSendNovedad.Documento = this.DisponibleForm.get('NumeroDocumento')?.value;
    itemsSendNovedad.TipoDocumento = this.DisponibleForm.get('TipoDocumento')?.value;
    itemsSendNovedad.Telefono = this.DisponibleForm.get('TelefonoDisponible')?.value;
    itemsSendNovedad.Direccion = this.DisponibleForm.get('DireccionDisponible')?.value;
    itemsSendNovedad.Oficina = this.DisponibleForm.get('NombreOficina')?.value;
    itemsSendNovedad.TipoProducto = this.DisponibleForm.get('DescripcionProducto')?.value;
    itemsSendNovedad.NumeroCuenta = this.DisponibleForm.get('Cuenta')?.value;
    itemsSendNovedad.TipoNovedad = TipoNovedad;
    itemsSendNovedad.FechaUltimaTransaccion = this.DisponibleForm.get('FechaUltimaTrans')?.value;

    itemsSendNovedad.NumeroTarjeta = "";
    itemsSendNovedad.Plazo = 0;
    itemsSendNovedad.DiaCorte = "";

    
    const canales: any[] = this.dataObjetC == null || this.dataObjetC.Canales == null ? [] : this.dataObjetC.Canales;
    canales.forEach(( x: any) => { delete x.$id, delete x.Cuenta, delete x.DescripcionCanal });
      const tempPos: any = canales.filter(( x: any) => x.Canal == "02")[0];
      const tempWeb: any = canales.filter(( x: any) => x.Canal == "04")[0];
      const tempBancaMovil: any = canales.filter(( x: any) => x.Canal == "05")[0];
      const tempATM: any = canales.filter(( x: any) => x.Canal == "01")[0];
  
      itemsSendNovedad.Canales = [];
      itemsSendNovedad.Canales.push(tempPos == null ? { Canal: "02",  NumeroOperaciones: "N/A", MontoMaximo: "N/A" } : {Canal:tempPos.Canal, NumeroOperaciones: tempPos.NumeroOperaciones, MontoMaximo: tempPos.MontoMaximo });
      itemsSendNovedad.Canales.push(tempWeb == null ? { Canal: "04", NumeroOperaciones: "N/A", MontoMaximo: "N/A" } : { Canal: tempWeb.Canal, NumeroOperaciones: tempWeb.NumeroOperaciones, MontoMaximo: tempWeb.MontoMaximo });
      itemsSendNovedad.Canales.push(tempBancaMovil == null ? { Canal: "05", NumeroOperaciones: "N/A", MontoMaximo: "N/A" } : { Canal: tempBancaMovil.Canal, NumeroOperaciones: tempBancaMovil.NumeroOperaciones, MontoMaximo: tempBancaMovil.MontoMaximo  });
      itemsSendNovedad.Canales.push(tempATM == null ? { Canal: "01",  NumeroOperaciones: "N/A", MontoMaximo: "N/A" } : {Canal:tempATM.Canal, NumeroOperaciones: tempATM.NumeroOperaciones, MontoMaximo: tempATM.MontoMaximo });
  
    itemsSendNovedad.LibreTarjetaSin =  "Tarjeta";
    if (this.DisponibleForm.controls['IdMedioPago'].value == 0) {
      itemsSendNovedad.NumeroTarjeta = this.DisponibleForm.get('Inicial')?.value + ' / ' + this.DisponibleForm.get('Final')?.value;
      itemsSendNovedad.LibreTarjetaSin =  "Libreta";
    }
    else if (this.DisponibleForm.get('IdMedioPago')?.value == '10')
      itemsSendNovedad.NumeroTarjeta = this.DisponibleForm.get('NumeroTarjeta')?.value;
    else if (this.DisponibleForm.get('IdMedioPago')?.value == '50' || this.DisponibleForm.get('IdMedioPago')?.value == '70') {
      itemsSendNovedad.Plazo = this.DisponibleForm.get('IdPlazo')?.value;
      if(this.DisponibleForm.get('IdDiaCorte')?.value !== '0' ){
        let Corte: any = this.resultDiaCortePago.filter(( x: any) => x.intDiaCorte == this.DisponibleForm.get('IdDiaCorte')?.value)[0];
        itemsSendNovedad.DiaCorte = Corte.intDiaCorte + " - " + Corte.intDiaPago;
      }else{
        itemsSendNovedad.DiaCorte = "";
      }
      if (this.DisponibleForm.get('IdMedioPago')?.value == '50')
        itemsSendNovedad.NumeroTarjeta = this.DisponibleForm.get('NumeroTarjeta')?.value;   
    }
    itemsSendNovedad.FechaUltimaTransaccion = this.DisponibleForm.get('FechaUltimaTrans')?.value;
    itemsSendNovedad.NombreAsesor = this.NombreAsesor();

    $("#ImpresionDisponible").show();
    this.ModalImpresion.nativeElement.click();
    let html : HTMLObjectElement =  document.getElementById("ImpresionDisponible") as HTMLObjectElement;
    this.linkPdf = "";
    let pdfinBase64 = null;
    let byteArray = null;
    let newBolb = null;
    let url = null;
    this.loading = true;
    html.data = "";
    html.name = "";
    html.type = "";

    this.DisponiblesServices.NovedadesAhorrosPDF(itemsSendNovedad).subscribe(
      result => {
        pdfinBase64 = result.FileStream._buffer;
        byteArray = new Uint8Array(atob(pdfinBase64).split("").map((char) => char.charCodeAt(0)));
        newBolb = new Blob([byteArray], { type: "application/pdf" });
        this.linkPdf = URL.createObjectURL(newBolb);
        url = window.URL.createObjectURL(newBolb);
        html.data = url;
        html.name ="Impresion";
        html.type =  "application/pdf";
        this.loading = false;
      },
      error => {
        this.loading = false
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(errorMessage);
      }
    );
  }
  // FIN ENCABEZADO
  devolverTab(tab : number) {
    switch (tab) {
      case 1:
        this.activaLibreta = true;
        this.activaTarjeta = false;
        this.activaCupo = false;
        this.activaSaldos = false;
        this.activaAutorizados = false;
        this.activaHistorial = false;
        this.activaGarantia = false;
        break;
      case 2:
        this.activaLibreta = false;
        this.activaTarjeta = true;
        this.activaCupo = false;
        this.activaSaldos = false;
        this.activaAutorizados = false;
        this.activaHistorial = false;
        this.activaGarantia = false;
        break;
      case 3:
        this.activaLibreta = false;
        this.activaTarjeta = false;
        this.activaCupo = true;
        this.activaSaldos = false;
        this.activaAutorizados = false;
        this.activaHistorial = false;
        this.activaGarantia = false;
        break;
      case 4:
        this.activaLibreta = false;
        this.activaTarjeta = false;
        this.activaCupo = false;
        this.activaSaldos = true;
        this.activaAutorizados = false;
        this.activaHistorial = false;
        this.activaGarantia = false;
        break;
      case 5:
        this.activaLibreta = false;
        this.activaTarjeta = false;
        this.activaCupo = false;
        this.activaSaldos = false;
        this.activaAutorizados = true
        this.activaHistorial = false;
        break;
      case 6:
        this.activaLibreta = false;
        this.activaTarjeta = false;
        this.activaCupo = false;
        this.activaSaldos = false;
        this.activaAutorizados = false;
        this.activaHistorial = true;
        this.activaGarantia = false;
        break;
    }
  }
  // TAB LIBRETA
  ConsultaLibretas() {
    this.VolverArriba(400);
    if (this.DisponibleForm.get('Inicial')?.value == "" || this.DisponibleForm.get('Inicial')?.value == null) {
      this.enableBtnActualizar = false;
      this.DisponibleForm.get('Inicial')?.reset();
      this.DisponibleForm.get('Final')?.reset();
      return;
    }  
    const CuponInicial = this.DisponibleForm.get('Inicial')?.value;
    this.DisponiblesServices.ConsultarLibreta(CuponInicial).subscribe(
      result => {
        if (result !== null) {
          if(+this.dataUser.NumeroOficina === result.IdOficina) {
            if (result.IdEstado === 45) {
              if (this.DisponibleForm.get('IdProducto')?.value != 102) {
                this.dataProductos = 101
              } else {
                this.dataProductos = 102
              }
              if (result.IdProducto === this.dataProductos) {    
                 if(this.talonario.Inicial == this.DisponibleForm.get('Inicial')?.value)
                  this.enableBtnActualizar = false;
                 else {
                   this.generalesService.Autofocus('btnActualizarId');
                    this.enableBtnActualizar = true;
                }
                this.DisponibleForm.get('Final')?.setValue(result.Final);
                this.Cupon();
              } else {
                this.enableBtnActualizar = false;
                this.notif.warning('Advertencia','El número de libreta no corresponde al producto.',ConfiguracionNotificacion.configRightTop);
                this.DisponibleForm.get('Inicial')?.reset();
                this.DisponibleForm.get('Final')?.reset();
              }
            } else {
              this.enableBtnActualizar = false;
              if (result.IdEstado === 5) {
                this.notif.warning('Advertencia','El número de libreta ya fue asignado.',ConfiguracionNotificacion.configRightTop);
              this.DisponibleForm.get('Inicial')?.reset();
              this.DisponibleForm.get('Final')?.reset();
              } else if (result.IdEstado === 10) {
                this.notif.warning('Advertencia','El número de libreta esta anulado.',ConfiguracionNotificacion.configRightTop);
              this.DisponibleForm.get('Inicial')?.reset();
              this.DisponibleForm.get('Final')?.reset();
              } else if (result.IdEstado === 47){
                this.notif.warning('Advertencia','El número de libreta no está disponible.',ConfiguracionNotificacion.configRightTop);
              this.DisponibleForm.get('Inicial')?.reset();
              this.DisponibleForm.get('Final')?.reset();
              }
             
            } 
          } else {
            this.enableBtnActualizar = false;
            this.notif.warning('Advertencia','El número de libreta tiene otra oficina asignada.',ConfiguracionNotificacion.configRightTop);
            this.DisponibleForm.get('Inicial')?.reset();
            this.DisponibleForm.get('Final')?.reset();
          }
        } else
        {
          this.enableBtnActualizar = false;
          this.notif.warning('Advertencia', 'El número de libreta no está asignado.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleForm.get('Inicial')?.reset();
          this.DisponibleForm.get('Final')?.reset();

        }
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  Cupon() {
    this.dataObjetLibreta = {
      Talonarios: []
    };
    this.dataObjetLibreta.Talonarios.push({
      'Inicial': this.DisponibleForm.get('Inicial')?.value,
      'Final': this.DisponibleForm.get('Final')?.value,
    });
    this.dataLibretalist = this.dataObjetLibreta.Talonarios;
    this.DisponibleForm.get('Talonarios')?.setValue(this.dataLibretalist);
  }
  // FIN TAB LIBRETA
  // TAB TARJETA
  ConvenioTarjetas() {
    this.DisponiblesServices.ConveniosTarjetas().subscribe(
      result => {
        this.resultConvenioTarjetas = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  SeleccionConvenio() {
    if (this.DisponibleForm.get('IdConvenio')?.value !== null) {
      this.DiaCortePago();
      this.Plazo();
      this.FechaVigencia();
      setTimeout(() => {
        this.ValidacionMediopagoInputs();
      }, 500);
    }
  }
  DiaCortePago() {
    const Convenio = this.DisponibleForm.get('IdConvenio')?.value;
    this.DisponiblesServices.DiaCortePago(Convenio).subscribe(
      result => {
        this.resultDiaCortePago = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  Plazo() {
    const Convenio = this.DisponibleForm.get('IdConvenio')?.value;
    this.DisponiblesServices.Plazo(Convenio).subscribe(
      result => {
        this.resultPlazo = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  FechaVigencia() {
    const Convenio = this.DisponibleForm.get('IdConvenio')?.value;
    this.DisponiblesServices.FechaVigencia(Convenio).subscribe(
      result => {
        this.DisponibleForm.get('FechaVigenciaTarjeta')?.setValue(
          new DatePipe('en-CO').transform(result.FechaVigenciaTarjeta, 'yyyy/MM/dd'));
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  Canales() {
    this.DisponiblesServices.Canales().subscribe(
      result => {
        this.resultCanales = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  AgregarCanales() {
    if (this.DisponibleForm.get('Canal')?.value !== null
      && this.DisponibleForm.get('Canal')?.value !== undefined
      && this.DisponibleForm.get('Canal')?.value !== ''
      && this.DisponibleForm.get('NumeroOperaciones')?.value !== null
      && this.DisponibleForm.get('NumeroOperaciones')?.value !== undefined
      && this.DisponibleForm.get('NumeroOperaciones')?.value !== ''
      && this.DisponibleForm.get('MontoMaximo')?.value !== null
      && this.DisponibleForm.get('MontoMaximo')?.value !== undefined
      && this.DisponibleForm.get('MontoMaximo')?.value !== '') {

      const MontoMaximo = this.DisponibleForm.get('MontoMaximo')?.value;
      const nroOperaciones = this.DisponibleForm.get('NumeroOperaciones')?.value;


      if (this.dataObjetC.Canales.length !== 0)
        {
          if (this.editarCanal != null && this.indexCanales != null && this.editarCanal.Canal == this.DisponibleForm.get('Canal')?.value &&
          this.editarCanal.NumeroOperaciones == this.DisponibleForm.get('NumeroOperaciones')?.value && this.editarCanal.MontoMaximo == this.DisponibleForm.get('MontoMaximo')?.value) {
          this.notif.warning('Advertencia', 'Debe cambiar el canal.', ConfiguracionNotificacion.configRightTop);
          return;
          }
        }     
        if (this.indexCanales !== null) {
          this.dataObjetC.Canales.splice(this.indexCanales, 1);
      }

      if(+nroOperaciones < 1){
        this.notif.warning('Advertencia', 'El número de operaciones debe ser mayor a cero.', ConfiguracionNotificacion.configRightTop);
      }else if(+MontoMaximo < 0.01){
        this.notif.warning('Advertencia', 'El valor de cupo por canal debe ser mayor a cero.', ConfiguracionNotificacion.configRightTop);
      }else{
      let tempFindExist: any = this.dataObjetC.Canales.filter(( x: any) => x.Canal == this.DisponibleForm.get('Canal')?.value)[0];
      if (tempFindExist != null) {
        this.notif.warning('Advertencia', 'El canal ya existe.', ConfiguracionNotificacion.configRightTop);
        this.DisponibleForm.get('Canal')?.setValue("");
        this.DisponibleForm.get('NumeroOperaciones')?.setValue("");
        this.DisponibleForm.get('MontoMaximo')?.setValue("");
        return;
      }

      let canal: any = this.resultCanales.filter(( x: any) => x.Canal == this.DisponibleForm.get('Canal')?.value)[0];
   
      if (this.dataObjetC !== undefined) {
        this.dataObjetC.Canales.push({
          'Canal': this.DisponibleForm.get('Canal')?.value,
          'Descripcion': canal.DescripcionCanal,
          'NumeroOperaciones': Number(this.DisponibleForm.get('NumeroOperaciones')?.value),
          'MontoMaximo': this.DisponibleForm.get('MontoMaximo')?.value,
        });
        this.indexCanales = null;
        this.editarCanal = null;
        this.bloquearbtnActalizar = true;
        this.BloquearCanales = false;
      } else {
        this.dataObjetC = {
          Canales: []
        };
        this.dataObjetC.Canales.push({
          'Canal': this.DisponibleForm.get('Canal')?.value,
          'Descripcion': canal.DescripcionCanal,
          'NumeroOperaciones': Number(this.DisponibleForm.get('NumeroOperaciones')?.value),
          'MontoMaximo': this.DisponibleForm.get('MontoMaximo')?.value,
        });
        this.indexCanales = null;
        this.editarCanal = null;
        this.bloquearbtnActalizar = true;
        this.BloquearCanales = false;
      }
    }
      this.clearCanales();
    } else {
      this.notif.warning('Advertencia', 'Los datos están incompletos.', ConfiguracionNotificacion.configRightTop);
      return;
    }
  }
  clearCanales() {
    this.DisponibleForm.get('Canal')?.reset();
    this.DisponibleForm.get('NumeroOperaciones')?.reset();
    this.DisponibleForm.get('MontoMaximo')?.reset();
    this.indexCanales = null;
    this.editarCanal = null;
  }
  CargarCanales() {
    this.DisponiblesServices.CargarCanales().subscribe(
      result => {
        this.resultcargarCanales = result;
        this.resultcargarCanales.forEach((elementCanales : any) => {
          if (elementCanales.$id >= 1) {
            if (this.dataObjetC !== undefined) {
              this.dataObjetC.Canales.push({
                'Canal': elementCanales.Canal,
                'Descripcion': elementCanales.Descripcion,
                'NumeroOperaciones': elementCanales.NumeroOperaciones,
                'MontoMaximo': elementCanales.MontoMaximo,
              });
            } else {
              this.dataObjetC = {
                Canales: []
              };
              this.dataObjetC.Canales.push({
                'Canal': elementCanales.Canal,
                'Descripcion': elementCanales.Descripcion,
                'NumeroOperaciones': elementCanales.NumeroOperaciones,
                'MontoMaximo': elementCanales.MontoMaximo,
              });
            }
          }
          });
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  editarCanal: any = null;
  IndiceAEditarCanal(index : number, datos : any) {
    this.DisponibleForm.get('Canal')?.setValue(datos.Canal);
    this.DisponibleForm.get('NumeroOperaciones')?.setValue(datos.NumeroOperaciones);
    this.DisponibleForm.get('MontoMaximo')?.setValue(datos.MontoMaximo);
    this.indexCanales = index;
    this.editarCanal = datos;
    this.bloquearbtnActalizar = false;
    this.BloquearCanales = true;
  }
  IndiceAEliminarCanal(index : number) {
    this.bloquearbtnActalizar = true;
    this.dataObjetC.Canales.splice(index, 1);
  }
  ConsultarTarjeta() {
  
    if (this.DisponibleForm.get('NumeroTarjeta')?.value == this.tarjetaOld &&( (this.DisponibleOperacionFrom.get('Codigo')?.value === '10') || (this.DisponibleOperacionFrom.get('Codigo')?.value === '40') || (this.DisponibleOperacionFrom.get('Codigo')?.value === '38'))){
      this.ValidacionMediopagoInputs();
      return;
    }
      
    this.DisponiblesServices.ConsultarTarjeta(this.DisponibleForm.get('NumeroTarjeta')?.value).subscribe(
      result => {
        if (result !== null) {
          if(+this.dataUser.NumeroOficina === result.IdOficina) {
            if (result.IdEstado === 45) {
              this.ProductoTarjeta = false;           
              if (result.IdProducto === 102) {
                if (this.DisponibleForm.get('IdProducto')?.value === result.IdProducto) {
                  this.ProductoTarjeta = true;
                  this.ValidacionMediopagoInputs();
                }
              } else if (result.IdProducto === 101) {
                this.ProductoTarjeta = true;
                this.ValidacionMediopagoInputs();
              }
              if (this.ProductoTarjeta == true) { 
                if(this.tarjetaOld == this.DisponibleForm.get('NumeroTarjeta')?.value)
                  this.enableBtnActualizar = false;
                else {
                  if (this.DisponibleOperacionFrom.get('Codigo')?.value == '10' || this.DisponibleOperacionFrom.get('Codigo')?.value == '40' || this.DisponibleOperacionFrom.get('Codigo')?.value == '38') 
                    this.ValidacionMediopagoInputs();
                   else {
                    this.generalesService.Autofocus('btnActualizarId');
                    this.enableBtnActualizar = true;
                    this.VolverArriba(600);
                  }   
                }   
              }
              else {
                this.enableBtnActualizar = false;
                this.notif.warning('Advertencia','El número de tarjeta no corresponde al producto.',ConfiguracionNotificacion.configRightTop);
                this.DisponibleForm.get('NumeroTarjeta')?.reset();
              }
            } else {
              this.enableBtnActualizar = false;
              if (result.IdEstado === 5) {
               this.notif.warning('Advertencia','El número de tarjeta ya fue asignado.',ConfiguracionNotificacion.configRightTop);
              this.DisponibleForm.get('NumeroTarjeta')?.reset(); 
              } else if (result.IdEstado === 10) {
                this.notif.warning('Advertencia', 'El número de tarjeta esta anulado.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleForm.get('NumeroTarjeta')?.reset(); 
              } else if (result.IdEstado === 47){
                this.notif.warning('Advertencia', 'El número de tarjeta no está disponible.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleForm.get('NumeroTarjeta')?.reset(); 
              } else if (result.IdEstado === 55) {
                this.notif.warning('Advertencia', 'El número de tarjeta no es valido.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleForm.get('NumeroTarjeta')?.reset();
              }            
            } 
          } else {
            this.enableBtnActualizar = false;
            this.notif.warning('Advertencia','El número de tarjeta tiene otra oficina asignada.',ConfiguracionNotificacion.configRightTop);
            this.DisponibleForm.get('NumeroTarjeta')?.reset();
          }
        } else
        {
          this.enableBtnActualizar = false;
          this.notif.warning('Advertencia', 'El número de tarjeta no está asignado.', ConfiguracionNotificacion.configRightTop);
          this.DisponibleForm.get('NumeroTarjeta')?.reset();

        }
        
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  // FIN TAB TARJETA

  // TAB CUPO

  lineas() {
    let IdLinea = '*';
    let NombreLinea = '*';
    if (this.DisponibleForm.get('IdLinea')?.value !== null
      && this.DisponibleForm.get('IdLinea')?.value !== undefined
      && this.DisponibleForm.get('IdLinea')?.value !== '') {
      this.DisponibleForm.get('NombreLinea')?.setValue('');
      IdLinea = this.DisponibleForm.get('IdLinea')?.value;
    } else if (this.DisponibleForm.get('NombreLinea')?.value !== null
      && this.DisponibleForm.get('NombreLinea')?.value !== undefined
      && this.DisponibleForm.get('NombreLinea')?.value !== '') {
        NombreLinea = this.DisponibleForm.get('NombreLinea')?.value;
    }

    if (IdLinea === '*' && NombreLinea === '*') {
      this.notif.warning('Alerta', 'Debe ingresar numero de linea o nombre de la linea.', ConfiguracionNotificacion.configRightTop);
    } else {
      this.DisponiblesServices.BuscarLinea(IdLinea, NombreLinea).subscribe(
        result => {
          if (result.length === 1) {
            this.MapearDatosLinea(result);
          } else if (result.length > 1) {
            this.resultLinea = result;
            this.ModalLineas.nativeElement.click();
          } else if (result === null || result.length === 0) {
            this.notif.warning('Alerta', 'No se encontró linea de crédito.', ConfiguracionNotificacion.configRightTop);
          }
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }
  MapearDatosLinea(datos : any) {
    if (datos.length >= 1) {
      this.DisponibleForm.get('IdLinea')?.setValue(datos[0].intCodigo);
      this.DisponibleForm.get('NombreLinea')?.setValue(datos[0].strNombre);
    } else {
      this.DisponibleForm.get('IdLinea')?.setValue(datos.intCodigo);
      this.DisponibleForm.get('NombreLinea')?.setValue(datos.strNombre);
    }
  }
  GenerarCuentaCupo(IdOficina : string, IdProducto : string, IdConsecutivo : string, IdDigito : string) {
    this.DisponiblesServices.GenerarCuentaCupo(IdOficina, IdProducto, IdConsecutivo, IdDigito).subscribe(
      result => {
        this.DisponibleForm.get('CuentaCupo')?.setValue(result);
        this.cuentaPadreAnterior = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  BuscarRadicado() {
    if (this.DisponibleForm.get('Radicado')?.value !== null
      && this.DisponibleForm.get('Radicado')?.value !== ' '
      && this.DisponibleForm.get('Radicado')?.value !== undefined) {
      if (this.DisponibleForm.get('Radicado')?.value == this.RadicadoOld) {
        this.enableBtnActualizar = false;
        return;
      }
      this.enableBtnActualizar = false;
      this.DisponiblesServices.BuscarRadicado(Number(this.DisponibleForm.get('Radicado')?.value), Number(this.DisponibleForm.get('LngTercero')?.value)).subscribe(
        result => {
          if (result !== null && result.Mensaje == null) {
            this.MapearDatosRadicado(result);
            if (result.IdGarantia == 5 || result.IdGarantia == 10) {
              this.DisponibleForm.get('IdGarantia')?.setValue(result.IdGarantia)
              //this.DisponibleForm.get('DescripcionGarantia')?.setValue(result.IdGarantia)
              this.DisponibleForm.get('IdPlazo')?.setValue(result.IdPlazo);
              this.CargarGarantias(result.IdGarantia);
              this.BloquearGarantia = true;
            }
          } else {
            this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTopNoClose);
            this.DisponibleForm.get('Radicado')?.setValue("");
          }
        },
        error => {
          const errorMessage = <any>error;
          this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
          console.error(errorMessage);
        }
      );
    } else {
      this.notif.warning('Advertencia', 'Debe ingresar un número de radicado.', ConfiguracionNotificacion.configRightTop);
    }
  }
  MapearDatosRadicado(Datos : any) {
    this.DisponibleForm.get('CupoAprobado')?.setValue(Datos.CupoAprobado);
    this.DisponibleForm.get('IdLinea')?.setValue(Datos.IdLinea);
    this.DisponibleForm.get('NombreLinea')?.setValue(Datos.NombreLinea);
    this.DisponibleForm.get('IdPlazo')?.setValue(Datos.IdPlazo);
  }
  CancelarCupo() {
    this.loading = true;
    this.ValidarDisponibles();
    setTimeout(() => {
      this.resultMedioPago = [...this.resultMedioPagoOriginal]; // reseteo el campo medios pago para que luego de guardar setee correctamente 
    }, 500); 
    this.DisponibleForm.get('IdPlazo')?.setValue("0");
    this.DisponibleForm.get('IdDiaCorte')?.setValue("0");

    let payload: any = this.DisponibleForm.value;
    payload.Real = this.dataObjetR;
    payload.Codeudor = this.dataObjetCd;
    payload.Canales = this.dataObjetC.Canales;
    payload.CupoAprobado = 0; // DFRAMIREZ, se envia cero para que permita cancelación 
    $("#ModalCancelarCupo").modal("hide");
    this.DisponiblesServices.CancelarCupo(payload).subscribe(( x: any) => {
      let log: any = {};
      let garantiaList: any = [];
      log.CupoCancelado = payload.CupoAprobado;
    
      this.dataObjetR.forEach(( x: any) => {
        let garantia: any = {
          TipoGarantia: x.TipoGarantia,
          NumeroMatricula: x.NumeroMatricula,
          Descripcion: x.Descripcion,
          ValorRespaldado: x.ValorRespaldado,
          ValorCobertura: x.ValorCobertura,
          ValorDisponible: x.ValorDisponible
        }
        garantiaList.push(garantia);
      });
      if (garantiaList.length > 0)
        log.GarantiasReales = garantiaList;
      this.activaCupo = false;
      this.activaTarjeta = true;
      this.devolverTab(2);
      this.tab2.nativeElement.click();
      $('#saldos').removeClass('activar');
      $('#saldos').removeClass('active');
      $('#historial').removeClass('activar');
      $('#historial').removeClass('active');
      $('#autorizados').removeClass('activar');
      $('#autorizados').removeClass('active');
      $('#cupo').removeClass('activar');
      $('#cupo').removeClass('active');
      $('#tarjeta').addClass('activar');
      $('#tarjeta').addClass('active');
      $('#libreta').removeClass('activar');
      $('#libreta').removeClass('active');
      this.notif.success('Exitoso', 'La cancelación de cupo se guardó correctamente.', ConfiguracionNotificacion.configRightTop);
      this.Guardarlog(log);
      // Notificador
      var IdTercero = +this.DisponibleForm.get('LngTercero')?.value;
      var IdCuenta = +this.DisponibleForm.get('IdCuenta')?.value;
      if (this.DisponibleForm.get('IdMedioPago')?.value == 50 || this.DisponibleForm.get('IdMedioPago')?.value == 70 || this.DisponibleForm.get('IdMedioPago')?.value == 10 || this.DisponibleForm.get('IdMedioPago')?.value == 60) {
        this.DisponiblesServices.CreaNotificacion(IdTercero, IdCuenta, 11, '00').subscribe( //ysalazar
          result => {
          },
          error => {
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }
      // fin notificador
      this.NovedadesAhorrosPDF("Cancelar cupo");
      this.DisponibleOperacionFrom.get('Codigo')?.reset();
      this.BloquearMedioPago = false;
      setTimeout(() => {
        this.BuscarPorCuenta();
        this.ObtenerHistorial();
        this.loading = true;
      }, 1200);
    }, err => { })
  }
  // FIN TAB CUPO
  // TAB GARANTIA
  valorRespaldadoTotal: number = 0;
  valoresRespaldoUnicos: Set<number> = new Set();
  valorCoberturaTotal: number = 0;
  valorDisponibleTotal: number = 0;

  ListGarantiasReales: any[] = [];
  ListGarantiasRealesAgregadas: any[] = [];
  GarantiaRealBajar(index: number) {
    const garantia = this.ListGarantiasReales[index];
    this.valorCoberturaTotal += Number(garantia.ValorCobertura);

    if (!this.valoresRespaldoUnicos.has(garantia.ValorRespaldado)) {
      this.valoresRespaldoUnicos.add(garantia.ValorRespaldado);
      this.valorRespaldadoTotal += Number(garantia.ValorRespaldado);
    }
  
    this.valorDisponibleTotal = (this.valorCoberturaTotal - this.valorRespaldadoTotal);

    this.ListGarantiasRealesAgregadas.push(this.ListGarantiasReales[index]);
    this.ListGarantiasReales = this.ListGarantiasReales.filter(( x: any) => x.NumeroMatricula != this.ListGarantiasReales[index].NumeroMatricula);
  }
  GarantiaRealSubir(index: number) {
    const garantia = this.ListGarantiasRealesAgregadas[index];
    this.valorCoberturaTotal -= Number(garantia.ValorCobertura);

    const valorRespaldado = Number(garantia.ValorRespaldado);
    const countValorRespaldado = this.ListGarantiasRealesAgregadas.filter(
      (x) => Number(x.ValorRespaldado) === valorRespaldado
    ).length;

    if (countValorRespaldado === 1  && this.valoresRespaldoUnicos.has(valorRespaldado)) {
      this.valoresRespaldoUnicos.delete(valorRespaldado);
      this.valorRespaldadoTotal -= valorRespaldado;
    }
  
    this.valorDisponibleTotal = (this.valorCoberturaTotal - this.valorRespaldadoTotal);

    this.ListGarantiasReales.push(this.ListGarantiasRealesAgregadas[index]);
    this.ListGarantiasRealesAgregadas = this.ListGarantiasRealesAgregadas.filter(( x: any) => x.NumeroMatricula != this.ListGarantiasRealesAgregadas[index].NumeroMatricula);
    
    if(this.ListGarantiasRealesAgregadas.length <= 0){
      this.valorRespaldadoTotal = 0;
      this.valorDisponibleTotal = 0;
      this.valoresRespaldoUnicos.clear(); 
    }

  }
  limpiarvaloresGarantias(){
    this.valorRespaldadoTotal = 0;
    this.valorCoberturaTotal = 0;
    this.valorDisponibleTotal = 0;

    this.valoresRespaldoUnicos.clear();
  
    this.ListGarantiasReales = [];
    this.ListGarantiasRealesAgregadas = [];
  }
  GuardarGarantiasList() {
    //let suma: number = 0;
    //this.ListGarantiasRealesAgregadas.forEach(( x: any) => {
    //  suma = suma + Number(x.ValorDisponible);
    //});
    if (this.valorDisponibleTotal >= Number(this.DisponibleForm.get('CupoAprobado')?.value)) {
      this.dataObjetR = this.ListGarantiasRealesAgregadas;
      $("#ModalGarantiasReales").modal("hide");
      this.enableBtnActualizar = true;
    }else {
      this.enableBtnActualizar = true;
      this.notif.warning('Advertencia', 'Garantía no cubre el valor del cupo aprobado.', ConfiguracionNotificacion.configRightTop);
    }
    this.valorCoberturaTotalGar = this.valorCoberturaTotal;
    this.valorRespaldadoTotalGar = this.valorRespaldadoTotal;
    this.valorDisponibleTotalGar = this.valorDisponibleTotal;
  }
  CargarGarantias(idGarantia: number) {
    this.limpiarvaloresGarantias();
    const newLocal = this;
    newLocal.DisponiblesServices.CargarGarantia(this.DisponibleForm.get('LngTercero')?.value, this.DisponibleForm.controls['Radicado'].value).subscribe(
      result => {
        this.ListGarantiasReales = result.reales;
        this.resultGarantia = result.reales;
        this.dataObjetCd = result.codeudores;
        //dataObjetR
        if (this.ListGarantiasReales.length > 0 && idGarantia == 5) {
          this.ListGarantiasReales.forEach(( x: any) => {
            x.ValorDisponible = Number(x.ValorCobertura) - Number(x.ValorRespaldado)
          });
          this.ListGarantiasRealesAgregadas.forEach(( x: any) => {
            this.ListGarantiasReales = this.ListGarantiasReales.filter(( xx: any) => xx.NumeroMatricula != x.NumeroMatricula);
          });
          this.ModalGarantiasReales.nativeElement.click();
        } else if (idGarantia == 10)
          this.enableBtnActualizar = true;
        else if (this.ListGarantiasReales.length == 0 && idGarantia == 5) {
          let Text: string = "Radicado con garantía admisible y no se encontraron registros con el asociado.";
          swal.fire({
            title: '<strong>! Advertencia ¡</strong>',
            text: '',
            icon: 'error',
            animation: false,
            html: Text,
            //customClass: 'animated tada',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: 'rgb(160, 0, 87)'
          });
        }

      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  AsignarCupoLog: any = {};
  GuardarGarantiasAndLog(value: string) {
    if (value == "guardar") {
      this.AsignarCupoLog.CupoAprobado = this.DisponibleForm.get('CupoAprobado')?.value;
      this.AsignarCupoLog.Radicado = this.DisponibleForm.get('Radicado')?.value;
      this.AsignarCupoLog.CuentaPadre = this.DisponibleForm.get('CuentaCupo')?.value;
      this.AsignarCupoLog.Linea = this.DisponibleForm.get('NombreLinea')?.value;
      this.AsignarCupoLog.Plazo = this.DisponibleForm.get('IdPlazo')?.value;

      if (this.ListGarantiasRealesAgregadas.length > 0)
        this.AsignarCupoLog.Garantia = this.ListGarantiasRealesAgregadas;
      else
        this.AsignarCupoLog.Garantia = "No se cargaron garantias";

      this.NovedadesAhorrosPDF('Asignar Cupo');
      this.Guardarlog(this.AsignarCupoLog);
      setTimeout(() => {
        this.AsignarCupo = false;
        this.DisponibleOperacionFrom.get('Codigo')?.reset();

        if (this.ListGarantiasRealesAgregadas.length > 0) {
          let payload: any = this.DisponibleForm.value;
          payload.Real = this.ListGarantiasRealesAgregadas;
          this.DisponiblesServices.GuardarGarantia(payload).subscribe(( x: any) => {
          });

          this.BuscarPorCuenta();
        }
      }, 400);
    }

    if (value == "log" && this.RadicadoOld != null && this.RadicadoOld != "0") {
      this.AsignarCupoLog.CupoAprobadoAnterior = this.cupoAprobadoAnterior;
      this.AsignarCupoLog.RadicadoAnterior = this.RadicadoOld;
      this.AsignarCupoLog.CuentaPadreAnterior = this.cuentaPadreAnterior;
      this.AsignarCupoLog.LineaAnterior = this.lineaAnterior;
      this.AsignarCupoLog.PlazoAnterior = this.descripcionLineaAnterior;
    }

  }

  // FIN TAB GARANTIA 
  // INICIO SALDOS
  SeleccionPuntos() {
    this.bloquearbtnCalcular = true;
  }
  ObtenerPuntosAdicionales() {
    // this.ContractualServices.ObtenerPuntosAdicionales(this.datoProducto).subscribe(
    //   result => {
    //     this.resultPuntosAdicionales = result;
    //   },
    //   error => {
    //     const errorMessage = <any>error;
    //     console.log(errorMessage);
    //   }
    // );
  }
  SumaPuntos() {
    if (this.AdicionarPuntosFrom.get('AdicionarPunto')?.value !== '--Seleccione--') {
      const Punto = +this.AdicionarPuntosFrom.get('AdicionarPunto')?.value.PuntosAdicionales;
      // const Tasa = +this.contractualFrom.get('TasaEfectiva')?.value;
      // this.contractualFrom.get('TasaEfectiva')?.setValue((Punto + Tasa).toFixed(6));
      // this.ObtenerTasaNominal();
      this.AdicionarPuntosFrom.get('AdicionarPunto')?.setValue(Punto);
      this.bloquearbtnActalizar = true;
      this.bloquearbtnCalcular = false;
    } else {
      this.notif.warning('Advertencia', 'Debe seleccionar puntos a adicionar.', ConfiguracionNotificacion.configRightTop);
    }
  }
  // FIN SALDOS

  // TAB AUTORIZADOS 
  BloquearAutorizadoTituloInput(tipo: number) {
    if (tipo == 1) {
      this.DisponibleForm.controls["DocumentoTitular"].disable();
      this.DisponibleForm.controls["NombreTitular"].disable();
      this.DisponibleForm.controls["Tipo"].disable();
      this.DisponibleForm.controls["TipoFirma"].disable();
    } else {
      this.DisponibleForm.controls["DocumentoTitular"].enable();
      this.DisponibleForm.controls["NombreTitular"].enable();
      this.DisponibleForm.controls["Tipo"].enable();
      this.DisponibleForm.controls["TipoFirma"].enable();
    }
    
  }
  BuscarTitularDocumento() {
    if (this.DisponibleForm.get('DocumentoTitular')?.value !== null
      && this.DisponibleForm.get('DocumentoTitular')?.value !== undefined
      && this.DisponibleForm.get('DocumentoTitular')?.value !== '') {
      if (this.DisponibleForm.get('NumeroDocumento')?.value !== this.DisponibleForm.get('DocumentoTitular')?.value.trim()) {
        if (this.dataObjetTitulares.length == 0) {
          this.loading = true;
          this.DisponiblesServices.BuscarTitular(this.DisponibleForm.get('DocumentoTitular')?.value, '*').subscribe(
            result => {
              this.loading = false;
              if (result === null) {
                this.notif.warning('Alerta', 'No se encontró el registro.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleForm.get('DocumentoTitular')?.reset();
              } else if (result.IdRelacion === 10) {
                this.notif.warning('Alerta', 'El autorizado no puede ser menor.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleForm.get('DocumentoTitular')?.reset();
              } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                this.DisponibleForm.get('DocumentoTitular')?.reset();
                if (result.Mensaje === 'Gerencia de desarrollo.') {
                  swal.fire({
                    title: '<strong>! Advertencia ¡</strong>',
                    text: '',
                    icon: 'error',
                    animation: false,
                    html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                      + result.Mensaje + '.',
                    //customClass: 'animated tada',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  });
                } else if (result.Mensaje === 'Oficial de cumplimiento.') {
                  swal.fire({
                    title: '<strong>! Advertencia ¡</strong>',
                    text: '',
                    icon: 'error',
                    animation: false,
                    html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                      + result.Mensaje + '.',
                    //customClass: 'animated tada',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  });
                } else {
                  if (result.IdEstado === 32) {
                    this.notif.warning('Alerta', 'Autorizado con estado fallecido.', ConfiguracionNotificacion.configRightTop);
                    this.DisponibleForm.get('DocumentoTitular')?.reset();
                  } else {
                    this.BloquearDatoAutorizadoBtn2 = true;
                    this.DisponibleForm.get('DocumentoTitular')?.setValue(result.Documento);
                    this.DisponibleForm.get('NombreTitular')?.setValue(result.PrimerApellido + ' ' +
                      result.SegundoApellido + ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
                  }
                }
              }
            },
            error => {
              this.loading = false;
              this.notif.warning('Alerta', 'Número de documento incorrecto.', ConfiguracionNotificacion.configRightTop);
           }
          );
        } else {
           this.validar = false;
              const CedulaDigitada = this.DisponibleForm.get('DocumentoTitular')?.value.trim();
              this.dataObjetTitulares.forEach(elementB => {
                if (elementB.Documento === CedulaDigitada) {
                  this.validar = true;
                }
              });
          if (this.validar) {
            this.notif.warning('Advertencia', 'El autorizado ya fue ingresado.', ConfiguracionNotificacion.configRightTop);
            this.DisponibleForm.get('DocumentoTitular')?.reset();
            this.clearTitulares();
          } else {
            this.loading = true;
            this.DisponiblesServices.BuscarTitular(this.DisponibleForm.get('DocumentoTitular')?.value, '*').subscribe(
              result => {
                this.loading = false;
                if (result === null) {
                  this.notif.warning('Alerta', 'No se encontró el registro.', ConfiguracionNotificacion.configRightTop);
                  this.DisponibleForm.get('DocumentoTitular')?.reset();
                } else if (result.IdRelacion === 10) {
                  this.notif.warning('Alerta', 'El autorizado no puede ser menor.', ConfiguracionNotificacion.configRightTop);
                  this.DisponibleForm.get('DocumentoTitular')?.reset();
                } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                  this.DisponibleForm.get('DocumentoTitular')?.reset();
                  if (result.Mensaje === 'Gerencia de desarrollo.') {
                    swal.fire({
                      title: '<strong>! Advertencia ¡</strong>',
                      text: '',
                      icon: 'error',
                      animation: false,
                      html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                        + result.Mensaje + '.',
                      //customClass: 'animated tada',
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor: 'rgb(160, 0, 87)'
                    });                    
                  } else if (result.Mensaje === 'Oficial de cumplimiento.') {
                    swal.fire({
                      title: '<strong>! Advertencia ¡</strong>',
                      text: '',
                      icon: 'error',
                      animation: false,
                      html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                        + result.Mensaje + '.',
                      //customClass: 'animated tada',
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor: 'rgb(160, 0, 87)'
                    });                    
                  } else {
                    if (result.IdEstado === 32) {
                      this.notif.warning('Alerta', 'Autorizado con estado fallecido.', ConfiguracionNotificacion.configRightTop);
                      this.DisponibleForm.get('DocumentoTitular')?.reset();
                    } else {
                      this.BloquearDatoAutorizadoBtn2 = true;
                      this.DisponibleForm.get('DocumentoTitular')?.setValue(result.Documento);
                      this.DisponibleForm.get('NombreTitular')?.setValue(result.PrimerApellido + ' ' +
                        result.SegundoApellido + ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
                    }
                   }
                } 
              },
              error => {
                this.loading = false;
                this.notif.warning('Alerta', 'Número de documento incorrecto.', ConfiguracionNotificacion.configRightTop);
              }
            );
          }
        }
      } else {
        this.notif.warning('Alerta', 'El autorizado debe ser diferente al titular.',
          ConfiguracionNotificacion.configRightTop);
        this.clearTitulares();
      }
        
      }
  }
  BuscarTitularNombre() {

    if (this.DisponibleForm.get('NombreTitular')?.value !== null
      && this.DisponibleForm.get('NombreTitular')?.value !== undefined
      && this.DisponibleForm.get('NombreTitular')?.value !== '') {
        if (this.dataObjetTitulares.length == 0) {
          this.loading = true;
          this.DisponiblesServices.BuscarTitular('*', this.DisponibleForm.get('NombreTitular')?.value).subscribe(
            result => {
              
              this.loading = false;
              if (result.length === 0) {
                this.DisponibleForm.get('NombreTitular')?.setValue("");
                this.notif.warning('Alerta', 'No se encontró el registro.', ConfiguracionNotificacion.configRightTop);
              } else if (result.length > 1) {
                this.resultTitulares = result;
                this.ModalTitulares.nativeElement.click();
                this.DisponibleForm.get('NombreTitular')?.setValue("");
              } else if (result === null) {
                this.DisponibleForm.get('NombreTitular')?.setValue("");
                this.notif.warning('Alerta', 'No se encontró el registro.', ConfiguracionNotificacion.configRightTop);
              } else {
                if (result[0].IdRelacion === 10) {
                  this.notif.warning('Alerta', 'El autorizado no puede ser menor.', ConfiguracionNotificacion.configRightTop);
                } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                  if (result.Mensaje === 'Gerencia de desarrollo.') {
                    swal.fire({
                      title: '<strong>! Advertencia ¡</strong>',
                      text: '',
                      icon: 'error',
                      animation: false,
                      html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                        + result.Mensaje + '.',
                      //customClass: 'animated tada',
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor: 'rgb(160, 0, 87)'
                    });
                  } else if (result.Mensaje === 'Oficial de cumplimiento.') {
                    swal.fire({
                      title: '<strong>! Advertencia ¡</strong>',
                      text: '',
                      icon: 'error',
                      animation: false,
                      html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                        + result.Mensaje + '.',
                      //customClass: 'animated tada',
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor: 'rgb(160, 0, 87)'
                    });
                  } else {
                    if (result[0].IdEstado === 32) {
                      this.notif.warning('Alerta', 'Autorizado con estado fallecido.', ConfiguracionNotificacion.configRightTop);
                      this.DisponibleForm.get('DocumentoTitular')?.reset();
                    } else {
                      if (this.DisponibleForm.get('NumeroDocumento')?.value !== result[0].NumeroDocumento) {
                        this.BloquearDatoAutorizadoBtn2 = true;
                        this.DisponibleForm.get('DocumentoTitular')?.setValue(result[0].NumeroDocumento);
                        this.DisponibleForm.get('NombreTitular')?.setValue(result[0].PrimerApellido + ' ' +
                          result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
                      } else {
                        this.notif.warning('Alerta', 'El autorizado debe ser diferente al titular.',ConfiguracionNotificacion.configRightTop);
                        this.clearTitulares();
                      }
                    }
                  }
                }
              }
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
              console.log(errorMessage);
            }
          );
        
      } else {
            this.loading = true;
            this.DisponiblesServices.BuscarTitular('*', this.DisponibleForm.get('NombreTitular')?.value).subscribe(
              result => {
                this.loading = false;
                if (result.length === 0 || result === null) {
                  this.DisponibleForm.get('NombreTitular')?.setValue("");
                  this.notif.warning('Alerta', 'No se encontró el registro.', ConfiguracionNotificacion.configRightTop);
                } else if (result.length > 1) {
                  this.resultTitulares = result;
                  this.ModalTitulares.nativeElement.click();
                  this.DisponibleForm.get('NombreTitular')?.setValue("");
                } else {
                  if (result[0].IdRelacion === 10) {
                    this.DisponibleForm.get('NombreTitular')?.setValue("");
                    this.notif.warning('Alerta', 'El autorizado no puede ser menor.', ConfiguracionNotificacion.configRightTop);
                  } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                    if (result.Mensaje === 'Gerencia de desarrollo.') {
                      swal.fire({
                        title: '<strong>! Advertencia ¡</strong>',
                        text: '',
                        icon: 'error',
                        animation: false,
                        html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                          + result.Mensaje + '.',
                        //customClass: 'animated tada',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'Ok',
                        confirmButtonColor: 'rgb(160, 0, 87)'
                      });
                    } else if (result.Mensaje === 'Oficial de cumplimiento.') {
                      swal.fire({
                        title: '<strong>! Advertencia ¡</strong>',
                        text: '',
                        icon: 'error',
                        animation: false,
                        html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                          + result.Mensaje + '.',
                       // customClass: 'animated tada',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'Ok',
                        confirmButtonColor: 'rgb(160, 0, 87)'
                      });
                    } else {
                      if (result[0].IdEstado === 32) {
                        this.DisponibleForm.get('NombreTitular')?.setValue("");
                        this.notif.warning('Alerta', 'Autorizado con estado fallecido.', ConfiguracionNotificacion.configRightTop); 
                      } else {
                        if (this.DisponibleForm.get('NumeroDocumento')?.value !== result[0].NumeroDocumento) {
                          this.validar = false;
                         
                          const CedulaDigitada = result[0].NumeroDocumento;
                          this.dataObjetTitulares.forEach(elementB => {
                            if (elementB.Documento == CedulaDigitada)
                              this.validar = true;
                          });
                          if (this.validar) {
                            this.notif.warning('Advertencia', 'El autorizado ya fue ingresado.', ConfiguracionNotificacion.configRightTop);
                            this.DisponibleForm.get('DocumentoTitular')?.reset();
                            this.clearTitulares();
                          } else {
                            this.BloquearDatoAutorizadoBtn2 = true;
                            this.DisponibleForm.get('DocumentoTitular')?.setValue(result[0].NumeroDocumento);
                            this.DisponibleForm.get('NombreTitular')?.setValue(result[0].PrimerApellido + ' ' +
                              result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
                          }                          
                        } else {
                          this.notif.warning('Alerta', 'El autorizado debe ser diferente al titular.', ConfiguracionNotificacion.configRightTop);
                          this.clearTitulares();
                        }
                      }
                    }
                  }
                }
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
                console.log(errorMessage);
              }
            );
      }
    // if (this.DisponibleForm.get('NumeroDocumento')?.value !== this.DisponibleForm.get('DocumentoTitular')?.value) {
    //   if (this.dataObjet === undefined) {
    //     this.loading = true;
    //     this.DisponiblesServices.BuscarTitular('*', this.DisponibleForm.get('NombreTitular')?.value).subscribe(
    //       result => {
    //         this.loading = false;
    //         if (result.length === 0) {
    //           this.notif.warning('Alerta', 'No se encontró el titular.', ConfiguracionNotificacion.configRightTop);
    //         } else if (result.length === 1) {
    //           if (result[0].IdRelacion === 10) {
    //             this.notif.warning('Alerta', 'El autorizado no puede ser menor.', ConfiguracionNotificacion.configRightTop);
    //           } else {
    //             this.DisponibleForm.get('DocumentoTitular')?.setValue(result[0].Documento);
    //             this.DisponibleForm.get('NombreTitular')?.setValue(result[0].PrimerApellido + ' ' +
    //               result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
    //           }
    //         } else if (result.length > 1) {
    //           this.resultTitulares = result;
    //           this.ModalTitulares.nativeElement.click();
    //           this.DisponibleForm.get('NombreTitular')?.reset();
    //         }
    //       },
    //       error => {
    //         this.loading = false;
    //         const errorMessage = <any>error;
    //         console.log(errorMessage);
    //       }
    //     );
    //   } else {
    //     this.validar = false;
    //     const CedulaDigitada = this.DisponibleForm.get('DocumentoTitular')?.value;
    //     this.dataObjet.Titulares.forEach(elementB => {
    //       if (elementB.strDocumento === CedulaDigitada) {
    //         this.validar = true;
    //       }
    //     });
    //     if (this.validar) {
    //       this.notif.warning('Advertencia', 'El titular ya fue ingresado.', ConfiguracionNotificacion.configRightTop);
    //       this.clearTitulares();
    //     } else {
    //       this.loading = true;
    //       this.DisponiblesServices.BuscarTitular('*', this.DisponibleForm.get('NombreTitular')?.value).subscribe(
    //         result => {
    //           this.loading = false;
    //           if (result.length === 0) {
    //             this.notif.warning('Alerta', 'No se encontró el titular.', ConfiguracionNotificacion.configRightTop);
    //           } else if (result.length === 1) {
    //             if (result[0].IdRelacion === 10) {
    //               this.notif.warning('Alerta', 'El autorizado no puede ser menor.', ConfiguracionNotificacion.configRightTop);
    //             } else {
    //               this.DisponibleForm.get('DocumentoTitular')?.setValue(result[0].Documento);
    //               this.DisponibleForm.get('NombreTitular')?.setValue(result[0].PrimerApellido + ' ' +
    //                 result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
    //             }
    //           } else if (result.length > 1) {
    //             this.resultTitulares = result;
    //             this.ModalTitulares.nativeElement.click();
    //             this.DisponibleForm.get('NombreTitular')?.reset();
    //           }
    //         },
    //         error => {
    //           this.loading = false;
    //           const errorMessage = <any>error;
    //           console.log(errorMessage);
    //         }
    //       );
    //     }
    //   }
    // } else {
    //   this.notif.warning('Alerta', 'El autorizado debe ser diferente al titular.', ConfiguracionNotificacion.configRightTop);
    //   this.clearTitulares();
    //   }
    }
  }
  BuscarTitularModal(Documento = '*') {
    const Nombre = '*';
    this.loading = true;
    this.DisponiblesServices.BuscarTitular(Documento, Nombre).subscribe(
      result => {
        this.loading = false;
        if (result === null) {
          this.notif.warning('Alerta', 'No se encontró el registro.', ConfiguracionNotificacion.configRightTop);
        } else if (result.IdRelacion === 10) {
          this.notif.warning('Alerta', 'El autorizado no puede ser menor.', ConfiguracionNotificacion.configRightTop);
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          if (result.Mensaje === 'Gerencia de desarrollo.') {
            swal.fire({
              title: '<strong>! Advertencia ¡</strong>',
              text: '',
              icon: 'error',
              animation: false,
              html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                + result.Mensaje + '.',
              //customClass: 'animated tada',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: 'rgb(160, 0, 87)'
            });
          } else if (result.Mensaje === 'Oficial de cumplimiento.') {
            swal.fire({
              title: '<strong>! Advertencia ¡</strong>',
              text: '',
              icon: 'error',
              animation: false,
              html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                + result.Mensaje + '.',
              //customClass: 'animated tada',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: 'rgb(160, 0, 87)'
            });
          } else {
            if (result.IdEstado === 32) {
              this.notif.warning('Alerta', 'El autorizado con estado fallecido.', ConfiguracionNotificacion.configRightTop);
              this.DisponibleForm.get('DocumentoTitular')?.reset();
            }
            else if (this.DisponibleForm.get('NumeroDocumento')?.value !== result.Documento.trim()) {
              this.validar = false;
              const CedulaDigitada = result.Documento;
              this.dataObjetTitulares.forEach(elementB => {
                if (elementB.Documento === CedulaDigitada) {
                  this.validar = true;
                }
              });
              if (this.validar) {
                this.notif.warning('Advertencia', 'El autorizado ya fue ingresado.', ConfiguracionNotificacion.configRightTop);
                this.DisponibleForm.get('DocumentoTitular')?.reset();
                this.clearTitulares();
              } else {
                this.BloquearDatoAutorizadoBtn2 = true;
                this.DisponibleForm.get('DocumentoTitular')?.setValue(result.Documento);
                this.DisponibleForm.get('NombreTitular')?.setValue(result.PrimerApellido + ' ' +
                  result.SegundoApellido + ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
              }  
            } else {
              this.notif.warning('Alerta', 'El autorizado debe ser diferente al titular.',ConfiguracionNotificacion.configRightTop);
              this.clearTitulares();
            }
          }
        } 
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.log(errorMessage);
      }
    );
    // let Nombre = '*';
    // Nombre = this.DisponibleForm.get('NombreTitular')?.value;
    // this.loading = true;
    // this.DisponiblesServices.BuscarTitular(Documento, Nombre).subscribe(
    //   result => {
    //     this.loading = false;
    //     if (result === null) {
    //         this.notif.warning('Alerta', 'No se encontró el titular.', ConfiguracionNotificacion.configRightTop);
    //     } else {
    //     if (result.IdRelacion === 10) {
    //       this.notif.warning('Alerta', 'El autorizado no puede ser menor.', ConfiguracionNotificacion.configRightTop);
    //     } else {
    //       if (this.DisponibleForm.get('NumeroDocumento')?.value !== result.Documento) {
    //         this.DisponibleForm.get('DocumentoTitular')?.setValue(result.Documento);
    //         this.DisponibleForm.get('NombreTitular')?.setValue(result.PrimerApellido + ' ' +
    //           result.SegundoApellido + ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
    //       } else {
    //         this.notif.warning('Alerta', 'El autorizado debe ser diferente al titular.',
    //           ConfiguracionNotificacion.configRightTop);
    //         this.clearTitulares();
    //       }          
    //     }
    //   }
    //   },
    //   error => {
    //     this.loading = false;
    //     const errorMessage = <any>error;
    //     console.log(errorMessage);
    //   }
    // );
  }
  clearTitulares() {
    this.DisponibleForm.get('DocumentoTitular')?.reset();
    this.DisponibleForm.get('NombreTitular')?.reset();
    this.DisponibleForm.get('TipoFirma')?.reset();
    this.DisponibleForm.get('Tipo')?.reset();
  }
  Autorizado() {
    this.DisponibleForm.get('Tipo')?.setValue('A');
  }
  AgregarTitulares() {
    let Accion: string = "Adicionar";
    let FechaMatricula = formatDate(new Date(), 'yyyy/MM/dd  HH:mm', 'en');
    if (this.DisponibleForm.get('DocumentoTitular')?.value !== null
      && this.DisponibleForm.get('DocumentoTitular')?.value !== undefined
      && this.DisponibleForm.get('DocumentoTitular')?.value !== ''
      && this.DisponibleForm.get('NombreTitular')?.value !== null
      && this.DisponibleForm.get('NombreTitular')?.value !== undefined
      && this.DisponibleForm.get('NombreTitular')?.value !== ''
      && this.DisponibleForm.get('Tipo')?.value !== null
      && this.DisponibleForm.get('Tipo')?.value !== undefined
      && this.DisponibleForm.get('Tipo')?.value !== ''
      && this.DisponibleForm.get('TipoFirma')?.value !== null
      && this.DisponibleForm.get('TipoFirma')?.value !== undefined
      && this.DisponibleForm.get('TipoFirma')?.value !== '') {

      this.DisponibleForm.controls["DocumentoTitular"].enable();
      this.DisponibleForm.controls["NombreTitular"].enable();
      this.bloquearbtnActalizar = false;
      if (this.indexAutorizado !== null) {

        let temp: string[] = this.dataObjetTitulares[this.indexAutorizado].TipoFirma.toString().split(':  ');
        if (temp.length == 1) {
          temp.push('')
        }

        if (this.dataObjetTitulares[this.indexAutorizado].Documento == this.DisponibleForm.get('DocumentoTitular')?.value
          && this.dataObjetTitulares[this.indexAutorizado].Nombre == this.DisponibleForm.get('NombreTitular')?.value
          && this.dataObjetTitulares[this.indexAutorizado].TipoTitular == this.DisponibleForm.get('Tipo')?.value
          && temp[0] == this.DisponibleForm.get('TipoFirma')?.value
          && temp[1].trim() == this.DisponibleForm.get('Observacion')?.value.toString().trim()) {
          this.notif.warning('Advertencia', ' Debe cambiar el autorizado.', ConfiguracionNotificacion.configRightTop);
          return;
        }
        if (this.dataObjetTitulares[this.indexAutorizado].Accion == "DB" || this.dataObjetTitulares[this.indexAutorizado].Accion == "Actualizar") {
          // FechaMatricula = this.dataObjetTitulares[this.indexAutorizado].FechaMatricula;
          Accion = "Actualizar";
        }

        this.dataObjetTitulares.splice(this.indexAutorizado, 1);

      }
      if (this.DisponibleForm.get('Observacion')?.value === null) {
        this.DisponibleForm.get('Observacion')?.setValue('');
      }
      if (this.dataObjetTitulares !== undefined) {

        var TipoFirmaFinal;
        if (this.DisponibleForm.get('TipoFirma')?.value === 'Otro') {
          TipoFirmaFinal = this.DisponibleForm.get('TipoFirma')?.value + ':  ' + this.DisponibleForm.get('Observacion')?.value
        } else {
          TipoFirmaFinal = this.DisponibleForm.get('TipoFirma')?.value;
        }

        this.dataObjetTitulares.push({
          'Accion': Accion,
          'Documento': this.DisponibleForm.get('DocumentoTitular')?.value,
          'Nombre': this.DisponibleForm.get('NombreTitular')?.value,
          'FechaMatricula': FechaMatricula,
          'TipoTitular': this.DisponibleForm.get('Tipo')?.value,
          'TipoFirma': TipoFirmaFinal,
        });
        this.indexAutorizado = null;
        this.bloquearbtnActalizar = true;
        this.DisponibleForm.get('Tipo')?.setValue(0);
        this.DisponibleForm.get('Observacion')?.setValue('');
      } else {
        this.dataObjetTitulares = [];

        var TipoFirmaFinal;
        if (this.DisponibleForm.get('TipoFirma')?.value === 'Otro') {
          TipoFirmaFinal = this.DisponibleForm.get('TipoFirma')?.value + ':  ' + this.DisponibleForm.get('Observacion')?.value
        } else {
          TipoFirmaFinal = this.DisponibleForm.get('TipoFirma')?.value;
        }

        this.dataObjetTitulares.push({
          'Accion': Accion,
          'Documento': this.DisponibleForm.get('DocumentoTitular')?.value,
          'Nombre': this.DisponibleForm.get('NombreTitular')?.value,
          'FechaMatricula': FechaMatricula,
          'TipoTitular': this.DisponibleForm.get('Tipo')?.value,
          'TipoFirma': TipoFirmaFinal,
        });
        this.indexAutorizado = null;
        this.bloquearbtnActalizar = null;
        this.DisponibleForm.get('Tipo')?.setValue(0);
        this.DisponibleForm.get('Observacion')?.setValue('');
      }
      this.clearTitulares();
    } else {
      this.notif.warning('Advertencia', 'Los datos están incompletos.', ConfiguracionNotificacion.configRightTop);
      return;
    }    
  }
  IndiceAEditar(index : number, datos : any) {
    this.DisponibleForm.controls["DocumentoTitular"].disable();
    this.DisponibleForm.controls["NombreTitular"].disable();
    let arrayTipoFirma: any[];
    this.BloquearDatoAutorizadoBtn2 = true;
    this.DisponibleForm.get('DocumentoTitular')?.setValue(datos.Documento);
    this.DisponibleForm.get('NombreTitular')?.setValue(datos.Nombre);
    this.DisponibleForm.get('Tipo')?.setValue('A');
    arrayTipoFirma = datos.TipoFirma.split(': ');

    if (arrayTipoFirma[0] === 'Otro') {
      this.DisponibleForm.get('TipoFirma')?.setValue(arrayTipoFirma[0]);
      this.DisponibleForm.get('Observacion')?.setValue(arrayTipoFirma[1]);
      this.DescriTipoFirma = false;
    } else {
      this.DisponibleForm.get('TipoFirma')?.setValue(arrayTipoFirma[0]);
      this.DescriTipoFirma = true;
    }
    this.indexAutorizado = index;
    this.bloquearbtnActalizar = false;
  }
  IndiceAEliminar(index : number) {
    if (this.dataObjetTitulares[index].Accion != "Adicionar") {
      this.listAutorizadoEliminar.push(
        {
          Documento: this.dataObjetTitulares[index].Documento,
          Nombre: this.dataObjetTitulares[index].Nombre,
          FechaMatricula: this.dataObjetTitulares[index].FechaMatricula,
          TipoTitular: this.dataObjetTitulares[index].TipoTitular,
          TipoFirma: this.dataObjetTitulares[index].TipoFirma,
        });
    }
    this.dataObjetTitulares.splice(index, 1);
    this.bloquearbtnActalizar = true;
    this.DisponibleForm.controls["DocumentoTitular"].setValue("");
    this.DisponibleForm.controls["NombreTitular"].setValue("");
    this.DisponibleForm.controls["Tipo"].setValue("0");
    this.DisponibleForm.controls["TipoFirma"].setValue("");
    this.DisponibleForm.controls["Observacion"].setValue("");
    this.indexAutorizado = null;
    this.DescriTipoFirma = true;
    this.BloquearDatoAutorizadoBtn2 = false;
  }
  TipoFirma() {
    this.DisponiblesServices.TipoFirma().subscribe(
      result => {
        this.resultTipoFirma = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  FirmaSeleccionada() {
    const data = this.DisponibleForm.get('TipoFirma')?.value;
    if (data === 'Otro') {
      this.DescriTipoFirma = false;
      this.DisponibleForm.get('Observacion')?.reset();
    } else {
      this.DescriTipoFirma = true;
      this.DisponibleForm.get('Observacion')?.reset();
    }
  }
  // FIN TAB AUTORIZADO
  // INICIO TAB SALDOS
  SaldoTotal() {
    const Canje = +this.DisponibleForm.get('Canje')?.value;
    const Efectivo = +this.DisponibleForm.get('Efectivo')?.value;
    this.DisponibleForm.get('SaldoTotal')?.setValue(Canje + Efectivo);
  }
  // FIN TAB SALDOS

 // TAB HISTORIAL
  ObtenerHistorial() {
  const IdOficina = this.DisponibleForm.get('IdOficina')?.value;
  const IdProductoCuenta = this.DisponibleForm.get('IdProductoCuenta')?.value;
  const IdConsecutivo = this.DisponibleForm.get('IdConsecutivo')?.value;
  const IdDigito = this.DisponibleForm.get('IdDigito')?.value;
  this.loading = true;
  this.DisponiblesServices.ObtenerHistorial
    ({ 'IdOficina': IdOficina, 'IdProductoCuenta': IdProductoCuenta, 'IdConsecutivo': IdConsecutivo, 'IdDigito': IdDigito }).subscribe(
      result => {
        console.log("historial",result)
        this.loading = false;
        this.dataHistorial = result;
        let operaciones: number[] = [];
        this.dataHistorial.forEach(( element: any) => {
          if (element.Operacion == 9 || element.Operacion == 32 || element.Operacion == 33 || element.Operacion == 34
            || element.Operacion == 35 || element.Operacion == 36 || element.Operacion == 38 || element.Operacion == 75) {
            if (operaciones.filter(( x: any) => x == element.Operacion).length == 0) {
              operaciones.push(element.Operacion);
              element.FormatDate = new DatePipe('en-CO').transform(element.FechaHistorial, 'yyyy/MM/dd');
            }  
          }
          if (element.Operacion == 10 || element.Operacion == 13 || element.Operacion == 40 || element.Operacion == 103)
            element.Detalles = "";
          else if (element.Detalles != null && element.Detalles != "") {
            const tempchar: string = '"'            
            element.Detalles = element.Detalles.toString().replace(/{/g, "").replace(/}/g, "").replace(/\[/g, "").replace(/\]/g, "");
            element.Detalles = element.Detalles.toString().replace(new RegExp(tempchar, 'g'), '');
            element.Detalles = element.Detalles.toString().replace(new RegExp(',', 'g'), '  ');

            if (element.Operacion == 115) {
              element.Detalles = element.Detalles.replace(/(Final:\d+)(?=\s)/g, '$1 /');
            }  
          }             
        });  
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
// FIN TAB HISTORIAL
  LimpiarCampos(Datos : string) {
    if (Datos === 'IdAsesor') {
      this.DisponibleForm.get('NombreAsesor')?.reset();
    } else if (Datos === 'NombreAsesor') {
      this.DisponibleForm.get('IdAsesor')?.reset();
    } else if (Datos === 'IdProducto') {
      this.DisponibleForm.get('DescripcionProducto')?.reset();
    } else if (Datos === 'DescripcionProducto') {
      this.DisponibleForm.get('IdProducto')?.reset();
    } else if (Datos === 'NumeroDocumento') {
      this.DisponibleForm.get('Nombre')?.reset();
    } else if (Datos === 'Nombre') {
      this.DisponibleForm.get('NumeroDocumento')?.reset();
    } else if (Datos === 'BuscarDocumento') {
      this.DisponibleForm.get('BuscarNombre')?.reset();
    } else if (Datos === 'BuscarNombre') {
      this.DisponibleForm.get('BuscarDocumento')?.reset();
    } else if (Datos === 'strCodigo') {
      this.AsesorFrom.get('strNombre')?.reset();
    } else if (Datos === 'strNombre') {
      this.AsesorFrom.get('strCodigo')?.reset();
    }
  }
  LimpiarCamposTab(Datos : string) {
    if (Datos === 'DocumentoTitular') {
      this.DisponibleForm.get('NombreTitular')?.reset();
    } else if (Datos === 'NombreTitular') {
      this.DisponibleForm.get('DocumentoTitular')?.reset();
    }
  }
  clearFrom() {
    this.DisponibleForm.reset();
    this.AsesorFrom.reset();
    this.AdicionarPuntosFrom.reset();
    // this.AutorizacionFrom.reset();
    this.CambioEstadoFrom.reset();
    this.dataObjetC = undefined;
    this.dataObjet = undefined;
    this.itemsDataObejct = [];
    this.btnGuardar = true;
    this.btnCambiarEstado = false;
    this.btnActualizar = true;
    this.BloquearDatoAutorizado = false;
    this.btnActualizarAutorizado = false;
    this.BloquearDatoAutorizadoBtn2 = false;
    this.btnActualizarCanales = true;
    this.dataHistorial = [];
    this.dataObjetCd = [];
    this.dataObjetR = [];
    this.dataHistorial = [];
    this.dataObjetCd = [];
    this.dataObjetR = [];


  }
  clearFromDisponibles() {
    this.btnRegistroFirma = false;
    this.dataObjet = [];
    this.dataObjet = undefined;
    this.itemsDataObejct = [];
    this.resultEstados = undefined;
    this.DisponibleOperacionFrom.reset();
    this.DisponibleForm.reset();
    this.AdicionarPuntosFrom.reset();
    this.AsesorFrom.reset();
    this.PagareObligatorio = false;
    this.TarjetaObligatoria = false;
    this.ConvenioObligatorio = false;
    this.PlazoCorteObligatoria = false;
    this.CambioEstadoFrom.reset();
    this.btnGuardar = true;
    this.btnCambiarEstado = false;
    this.btnActualizar = true;
    this.BloquearDatoAutorizado = false;
    this.btnActualizarAutorizado = false;
    this.BloquearDatoAutorizadoBtn2 = false;
    this.btnActualizarCanales = true;
    this.dataHistorial = [];
    this.dataObjetCd = [];
    this.dataObjetR = [];
    this.inputEstado = false;
    this.selectEstado = true;
    this.MostrarLibreta = true;
    this.MostrarTarjeta = true;
    this.MostrarCupo = true;
    this.MostrarGarantias = true;
    this.MostrarDemas = false;
    this.selectOperacionPermitada = true;
    this.inputOperacionPermitada = false;
    this.BloquearAsociado = false;
    this.BloquearFormaPago = false;
    this.BloquaerProducto = false;
    this.BloquearAsesorExterno = false;
    this.BloquearMedioPago = false;
    this.BloquearLinea = false;
    this.BloquearDiaCortePlazo = false;
    this.BloquearBuscar = false;
    this.bloquearConsultaCuenta = false;
    this.Bloquear = false;
    this.BloquearOperacionPermitida = false;
    this.dataHistorial = [];
    this.dataObjetCd = [];
    this.dataObjetR = [];
    this.devolverTab(4);
    this.tab5.nativeElement.click();
    $('#saldos').addClass('activar');
    $('#saldos').addClass('active');
    $('#historial').removeClass('activar');
    $('#historial').removeClass('active');
    $('#autorizados').removeClass('activar');
    $('#autorizados').removeClass('active');
    $('#cupo').removeClass('activar');
    $('#cupo').removeClass('active');
    $('#tarjeta').removeClass('activar');
    $('#tarjeta').removeClass('active');
    $('#libreta').removeClass('activar');
    $('#libreta').removeClass('active');
  }
  VolverArriba(scroll : number = 0) {
    $('html, body').animate({ scrollTop: scroll }, 'slow');
    return false;
  }
  VolverAbajo() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    return false;
  }
  Volver() {
    const posicion = $('#volver').offset().top + $('#volver').outerHeight(true) ;
    $('html, body').animate({
        scrollTop: (posicion)
    }, 500);
  }
  Guardarlog(objet: any = null, operacion: any = null) {
    if (objet == null) 
      objet = this.DisponibleForm.value;
    if (operacion == null)
      operacion = this.DisponibleOperacionFrom.get('Codigo')?.value;

    this.loading = true;
    if (this.DisponibleOperacionFrom.get('Codigo')?.value === '10' || this.DisponibleOperacionFrom.get('Codigo')?.value === '40') {
      this.generalesService.GuardarlogProductos(objet,operacion,this.DisponibleForm.get('IdCuenta')?.value, this.DisponibleForm.get('LngTercero')?.value, 38).subscribe(
        result => {
          this.loading = false;
          console.log(result);
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
    } else {
      this.generalesService.GuardarlogTerminoDisponibles(objet, operacion,
      this.DisponibleForm.get('IdCuenta')?.value, this.DisponibleForm.get('LngTercero')?.value, 38,this.DisponibleForm.value.IdObseCambioEstado).subscribe(
        result => {
          this.loading = false;
          console.log(result);
          this.ObtenerHistorial();
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        });
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
  ValidaFecha() {
    const selectedDate = this.DisponibleForm.get('ExoCobroHasta')?.value;
    if (selectedDate < this.FormatDateNow2) {
      this.notif.warning('Advertencia', 'Fecha no puede ser inferior a la fecha actual.', ConfiguracionNotificacion.configRightTop);
      this.DisponibleForm.get('ExoCobroHasta')?.reset();  // Limpiar la fecha seleccionada
      this.generalesService.Autofocus('ExoCobroHastaId');
    } else{
      this.enableBtnActualizar = true
    }
  }
  ChangeCheck(value : string) {
    if (value == 'ExoneradaGmf' && this.ExoneradaGmfOld != this.DisponibleForm.get('ExoneradaGmf')?.value)      
    this.enableBtnActualizar = true
    else if (value == 'Exenta' && this.ExentaGmfOld != this.DisponibleForm.get('Exenta')?.value) 
      this.enableBtnActualizar = true   
   else if (value == 'TibrarComentario' && this.TibrarComentarioOld != this.DisponibleForm.get('TibrarComentario')?.value) 
      this.enableBtnActualizar = true  
    else if (value == 'ExoCobroHasta' && this.ExoCobroHastaOld != this.DisponibleForm.get('ExoCobroHasta')?.value) {
      this.ValidaFecha();
    }
      // this.enableBtnActualizar = true  
  } 
  checkValidity() {
    if (this.DisponibleForm.get('NumeroOperaciones')?.valid) {
      console.log("El campo es válido");
    } else {
      this.DisponibleForm.get('NumeroOperaciones')?.reset();
    }
  }
  validateForm() {
    const IdAsesor = new FormControl('', [Validators.required]);
    const NombreAsesor = new FormControl('', [Validators.required]);
    const IdProducto = new FormControl('', []);
    const DescripcionProducto = new FormControl('', [Validators.required]);
    const Nombre = new FormControl('', [Validators.required]);
    const NumeroDocumento = new FormControl('', [Validators.required]);
    const BuscarDocumento = new FormControl('', []);
    const BuscarNombre = new FormControl('', []);
    const DocumentoTitular = new FormControl({value:"",disabled:true}, [Validators.pattern('[0-9]*')]);
    const NombreTitular = new FormControl({value:"",disabled:true}, []);
    const Titular = new FormControl('', []);
    const Autorizado = new FormControl('', []);
    const Observacion = new FormControl('', []);
    const ObservacionCuenta = new FormControl({value:"",disabled:true}, []);
    const Codigo = new FormControl('', [Validators.required]);
    const IdDigito = new FormControl('', [Validators.pattern('[0-9]*')]);
    const IdConsecutivo = new FormControl('', [Validators.pattern('[0-9]*')]);
    const IdProductoCuenta = new FormControl('', [Validators.pattern('[0-9]*')]);
    const IdOficina = new FormControl('', [Validators.pattern('[0-9]*')]);
    const NumeroOficinaAsociado = new FormControl('', [Validators.required]);
    const NombreOficinaAsociado = new FormControl('', [Validators.required]);
    const NombreOficina = new FormControl('', [Validators.required]);
    const NumeroOficina = new FormControl('', [Validators.required]);
    const DescripcionOperacion = new FormControl('', [Validators.required]);
    const Clase = new FormControl('', [Validators.required]);
    const IdEstado = new FormControl('', []);
    const DescripcionEstado = new FormControl('', [Validators.required]);
    const IdFormaPago = new FormControl('', []);
    const DescripcionFormaPago = new FormControl('', [Validators.required]);
    const InteresCausado = new FormControl('', []);
    const SaldoInicial = new FormControl('', []);
    const SaldoMinimo = new FormControl('', []);
    const ValorExonerado = new FormControl('', []);
    const InteresdelPeriodo = new FormControl('', []);
    const Canje = new FormControl('', []);
    const RetiroDelPerido = new FormControl('', []);
    const RetencionFuentePeriodo = new FormControl('', []);
    const Efectivo = new FormControl('', []);
    const SaldoTotal = new FormControl('', []);
    const GMFAdescontar = new FormControl('', []);
    const FechaApertura = new FormControl('', []);
    const FechaUltimaTrans = new FormControl('', []);
    const FechaCancelacion = new FormControl('', []);
    const FechaMarcaGMF = new FormControl('', []);
    const FechaDesmarcaGMF = new FormControl('', []);
    const strCodigo = new FormControl('', [Validators.pattern('[0-9]*')]);
    const strNombre = new FormControl('', []);
    const strTipo = new FormControl('', []);
    const Canal = new FormControl({value:"",disabled:true});
    const DescripcionCanal = new FormControl('', []);
    const NumeroOperaciones = new FormControl({ value: "", disabled: true }, [Validators.pattern('^[0-9]+$')]);
    const MontoMaximo = new FormControl({value:"",disabled:true}, []);
    const IdMedioPago = new FormControl('', []);
    const IdConvenio = new FormControl('', []);
    const IdCuenta = new FormControl('', []);
    const IdUsuarioSGF = new FormControl('', []);
    const ActivaMovimiento = new FormControl('', []);
    const Exenta = new FormControl('', []);
    const ExoneradaGmf = new FormControl('', []);
    const Inicial = new FormControl('', [Validators.pattern('[0-9]*')]);
    const Final = new FormControl('', []);
    const FechaVigenciaTarjeta = new FormControl('', []);
    const NumeroTarjeta = new FormControl('', [Validators.pattern('[0-9]*')]);
    const CuotaManejo = new FormControl('', []);
    const FechaRediferir = new FormControl('', []);
    const IdPlazo = new FormControl('', []);
    const FechaCambioPlazo = new FormControl('', []);
    const IdDiaCorte = new FormControl('', []);
    const CupoAprobado = new FormControl('', []);
    const CupoUtilizado = new FormControl('', []);
    const NumeroPagare = new FormControl('', [Validators.pattern('[0-9]*')]);
    const Radicado = new FormControl('', [Validators.pattern('[0-9]*')]);
    const Tipo = new FormControl({value:"",disabled:true}, []);
    const TipoFirma = new FormControl({value:"",disabled:true}, []);
    const IdLinea = new FormControl('', []);
    const NombreLinea = new FormControl('', []);
    const Monto = new FormControl('', []);
    const FechaCredito = new FormControl('', []);
    const FechaProximoCobro = new FormControl('', []);
    const LibretaPlastico = new FormControl('', []);
    const MoraCuotaManejo = new FormControl('', []);
    const IdRelacionTipo = new FormControl('', []);
    const Cuenta = new FormControl('', []);
    const TelefonoDisponible = new FormControl('', []);
    const Titulares = new FormControl('', []);
    const Talonarios = new FormControl('', []);
    const IdAsesorExterno = new FormControl('', []);
    const IdOperacion = new FormControl('', []);
    const Canales = new FormControl('', []);
    const LngTercero = new FormControl('', []);
    const AdicionarPunto = new FormControl('', []);
    const TibrarComentario = new FormControl('', []);
    const TasaEfectiva = new FormControl('', []);
    const TasaNominal = new FormControl('', []);
    const IdIndicador = new FormControl('', []);
    const Puntos = new FormControl('', []);
    const CuentaCupo = new FormControl('', []);
    const IdCuentaCupo = new FormControl('', []);
    const lngTercero = new FormControl('', []);
    const lngCuenta = new FormControl('', []);
    const IdTipoObservacion = new FormControl('', []);
    const NumeroMatricula = new FormControl('', []);
    const DescripcionMatricula = new FormControl('', []);
    const ValorCobertura = new FormControl('', []);
    const ValorRespaldo = new FormControl('', []);
    const PagoTotal = new FormControl('', []);
    const PagoMinimo = new FormControl('', []);
    const DireccionDisponible = new FormControl('', []);
    const TipoDocumento = new FormControl('', []);
    const IdTipoDocumento = new FormControl('', []);
    const SaldoPromedioMesAnterior = new FormControl('', []);
    const InteresMesAnterior = new FormControl('', []);
    const SaldoCertificado = new FormControl('', []);
    const IdGarantia = new FormControl('', []);
    const DescripcionGarantia = new FormControl('', []);
    const IdGarantiaConsecutivo = new FormControl('', []);
    const DocumentoAsesor = new FormControl('', []);
    const IdObseCambioEstado = new FormControl('', []);
    const RetiroPeriodo = new FormControl('', []);
    const AliasCuenta = new FormControl('', []);
    const ExoCobroHasta = new FormControl('', []);
    const Edad = new FormControl('', []);

    this.DisponibleForm = new FormGroup({
      IdAsesor: IdAsesor,
      NombreAsesor: NombreAsesor,
      IdProducto: IdProducto,
      DescripcionProducto: DescripcionProducto,
      Nombre: Nombre,
      NumeroDocumento: NumeroDocumento,
      BuscarDocumento: BuscarDocumento,
      BuscarNombre: BuscarNombre,
      DocumentoTitular: DocumentoTitular,
      NombreTitular: NombreTitular,
      Titular: Titular,
      Autorizado: Autorizado,
      Observacion: Observacion,
      ObservacionCuenta: ObservacionCuenta,
      IdDigito: IdDigito,
      IdConsecutivo: IdConsecutivo,
      IdProductoCuenta: IdProductoCuenta,
      IdOficina: IdOficina,
      NumeroOficinaAsociado: NumeroOficinaAsociado,
      NombreOficinaAsociado: NombreOficinaAsociado,
      NombreOficina: NombreOficina,
      NumeroOficina: NumeroOficina,
      DescripcionOperacion: DescripcionOperacion,
      Clase: Clase,
      IdEstado: IdEstado,
      DescripcionEstado: DescripcionEstado,
      IdFormaPago: IdFormaPago,
      DescripcionFormaPago: DescripcionFormaPago,
      InteresCausado: InteresCausado,
      SaldoInicial: SaldoInicial,
      SaldoMinimo: SaldoMinimo,
      ValorExonerado: ValorExonerado,
      InteresdelPeriodo: InteresdelPeriodo,
      Canje: Canje,
      RetiroDelPerido: RetiroDelPerido,
      RetencionFuentePeriodo: RetencionFuentePeriodo,
      Efectivo: Efectivo,
      SaldoTotal: SaldoTotal,
      GMFAdescontar: GMFAdescontar,
      FechaApertura: FechaApertura,
      FechaUltimaTrans: FechaUltimaTrans,
      FechaCancelacion: FechaCancelacion,
      FechaMarcaGMF: FechaMarcaGMF,
      FechaDesmarcaGMF: FechaDesmarcaGMF,
      Canal: Canal,
      DescripcionCanal: DescripcionCanal,
      NumeroOperaciones: NumeroOperaciones,
      MontoMaximo: MontoMaximo,
      IdMedioPago: IdMedioPago,
      IdConvenio: IdConvenio,
      IdCuenta: IdCuenta,
      IdUsuarioSGF: IdUsuarioSGF,
      ActivaMovimiento: ActivaMovimiento,
      Exenta: Exenta,
      ExoneradaGmf: ExoneradaGmf,
      Inicial: Inicial,
      Final: Final,
      FechaVigenciaTarjeta: FechaVigenciaTarjeta,
      NumeroTarjeta: NumeroTarjeta,
      CuotaManejo: CuotaManejo,
      FechaRediferir: FechaRediferir,
      IdPlazo: IdPlazo,
      FechaCambioPlazo: FechaCambioPlazo,
      IdDiaCorte: IdDiaCorte,
      CupoAprobado: CupoAprobado,
      CupoUtilizado: CupoUtilizado,
      NumeroPagare: NumeroPagare,
      Radicado: Radicado,
      Tipo: Tipo,
      TipoFirma: TipoFirma,
      IdLinea: IdLinea,
      NombreLinea: NombreLinea,
      Monto: Monto,
      FechaCredito: FechaCredito,
      FechaProximoCobro: FechaProximoCobro,
      LibretaPlastico: LibretaPlastico,
      MoraCuotaManejo: MoraCuotaManejo,
      IdRelacionTipo: IdRelacionTipo,
      Cuenta: Cuenta,
      TelefonoDisponible: TelefonoDisponible,
      DireccionDisponible: DireccionDisponible,
      Titulares: Titulares,
      Talonarios: Talonarios,
      IdAsesorExterno: IdAsesorExterno,
      IdOperacion: IdOperacion,
      Canales: Canales,
      LngTercero: LngTercero,
      TibrarComentario: TibrarComentario,
      TasaNominal: TasaNominal,
      TasaEfectiva: TasaEfectiva,
      IdIndicador: IdIndicador,
      Puntos: Puntos,
      CuentaCupo: CuentaCupo,
      IdCuentaCupo: IdCuentaCupo,
      NumeroMatricula: NumeroMatricula,
      DescripcionMatricula: DescripcionMatricula,
      ValorCobertura: ValorCobertura,
      ValorRespaldo: ValorRespaldo,
      PagoMinimo: PagoMinimo,
      PagoTotal: PagoTotal,
      TipoDocumento: TipoDocumento,
      IdTipoDocumento: IdTipoDocumento,
      SaldoPromedioMesAnterior: SaldoPromedioMesAnterior,
      InteresMesAnterior: InteresMesAnterior,
      IdGarantia: IdGarantia,
      DescripcionGarantia: DescripcionGarantia,
      IdGarantiaConsecutivo: IdGarantiaConsecutivo,
      DocumentoAsesor: DocumentoAsesor,
      IdObseCambioEstado: IdObseCambioEstado, 
      RetiroPeriodo: RetiroPeriodo,
      AliasCuenta: AliasCuenta,
      ExoCobroHasta: ExoCobroHasta,
      Edad: Edad,

    });

    this.DisponibleOperacionFrom = new FormGroup({
      Codigo: Codigo,
    });

    this.AsesorFrom = new FormGroup({
      strCodigo: strCodigo,
      strNombre: strNombre,
      strTipo: strTipo
    });

    this.AdicionarPuntosFrom = new FormGroup({
      AdicionarPunto: AdicionarPunto,
    });

    this.CambioEstadoFrom = new FormGroup({
      lngTercero: lngTercero,
      lngCuenta: lngCuenta,
      IdTipoObservacion: IdTipoObservacion
    });

      this.CertificadoFrom = new FormGroup({
        SaldoCertificado: SaldoCertificado,
    });

  }
  GenerarReglamentoVivienda() {
    $("#ImpresionReglamentoViviendaDisponible").show();
    this.ModalReglamentoVivienda.nativeElement.click();
    let html: HTMLObjectElement = document.getElementById("ImpresionReglamentoViviendaDisponible") as HTMLObjectElement;
    this.linkPdf = "";
    let pdfinBase64 = null;
    let byteArray = null;
    let newBolb = null;
    let url = null;
    html.data = "";
    html.name = "";
    html.type = "";

    this.DisponiblesServices.GenerarReglamentoVivienda('asd', 'asd', 'asd').subscribe(
      result => {
        pdfinBase64 = result.FileStream._buffer;
        byteArray = new Uint8Array(atob(pdfinBase64).split("").map((char) => char.charCodeAt(0)));
        newBolb = new Blob([byteArray], { type: "application/pdf" });
        this.linkPdf = pdfinBase64;
        url = window.URL.createObjectURL(newBolb);
        html.data = url;
        html.name = "Reglamento Ahorro Programado Vivienda";
        html.type = "application/pdf";
        this.loading = false;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.error('Error', errorMessage, ConfiguracionNotificacion.configRightTopNoClose);
        console.error(errorMessage);
        this.loading = false;
      });
  }

  generarReglamentoVivienda() {
    this.loading = true;
    const linkSource = `data:application/pdf;base64,${this.linkPdf}`;
    const downloadLink = document.createElement("a");
    let fileName: string ="REGLAMENTO AHORRO PROGRAMADO PARA VIVIENDA.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
    this.loading = false;
  }

}
