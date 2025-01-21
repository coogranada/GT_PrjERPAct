import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModuleValidationService } from '../../../../Services/Enviroment/moduleValidation.service';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { OperacionesService } from '../../../../Services/Maestros/operaciones.service';
import { TerminoAhorrosService } from '../../../../Services/Productos/terminoAhorros.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { DatePipe, formatDate } from '@angular/common';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import swal from 'sweetalert2';
import { NgxToastService } from 'ngx-toast-notifier';
declare var $: any;

@Component({
  selector: 'app-termino',
  templateUrl: './termino.component.html',
  styleUrls: ['./termino.component.css'],
  providers: [ModuleValidationService, OperacionesService, TerminoAhorrosService, GeneralesService],
  standalone : false
})
export class TerminoComponent implements OnInit {
  private CodModulo = 19;
  linkPdf: string = "";
  constructor(private moduleValidationService: ModuleValidationService,
    private el: ElementRef,
    private notif: NgxToastService,
    private operacionesService: OperacionesService,
    private TerminoService: TerminoAhorrosService,
    private generalesService: GeneralesService) {
    const obs = fromEvent(this.el.nativeElement, 'click').pipe(
      map((e: any) => {
        this.moduleValidationService.validarLocalPermisos(this.CodModulo);
      })
    );
    obs.subscribe((resulr) => console.log(resulr));
  }

  @ViewChild('ModalBuscarAsociados', { static: true }) private ModalBuscarAsociados!: ElementRef;
  @ViewChild('ModalAsociados', { static: true }) private ModalAsociados!: ElementRef;
  @ViewChild('ModalProductoTermino', { static: true }) private ModalProductoTermino!: ElementRef;
  @ViewChild('ModalCalcularAsesoria', { static: true }) private ModalCalcularAsesoria!: ElementRef;
  @ViewChild('ModalTitulares', { static: true }) private ModalTitulares!: ElementRef;
  @ViewChild('ModalAsesoresExterno', { static: true }) private ModalAsesoresExterno!: ElementRef;
  @ViewChild('ModalImpresion', { static: true }) private ModalImpresion!: ElementRef;
  @ViewChild('Cerrar', { static: true }) private Cerrar!: ElementRef;
  @ViewChild('ModalCambioEstado', { static: true }) private ModalCambioEstado!: ElementRef;
  @ViewChild('tab1', { static: true }) private tab1!: ElementRef;
  @ViewChild('tab4', { static: true }) private tab4!: ElementRef;
  @ViewChild('tab3', { static: true }) private tab3!: ElementRef;
  @ViewChild('tab6', { static: true }) private tab6!: ElementRef;
  @ViewChild('tab7', { static: true }) private tab7!: ElementRef;
  @ViewChild('ModalBuscarPersonasCesionTitulo', { static: true }) private ModalBuscarPersonasCesionTitulo!: ElementRef;

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent!: NgxLoadingComponent;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  public TerminoOperacionForm!: FormGroup;
  public TerminoForm!: FormGroup;
  public AsesorForm!: FormGroup;
  public AdicionarPuntosFrom!: FormGroup;
  public CambioEstadoFrom!: FormGroup;
  public ReciprocidadCreditoFrom!: FormGroup;
  public InteresForm!: FormGroup;
  // para guardar asesoria termino
  public AsesoriaSendForm!: FormGroup;

  ListCuentaReciprocidad: any[] = [];
  ListCuentaAgregadasReciprocidad: any[] = [];

  primaryColour = 'rgb(13,165,80)';
  secondaryColour = 'rgb(13,165,80,0.7)';
  public itemsSend = {
    Cuenta: {},
    NombreApellidos: {},
    Cedula: {},
    Telefono: {},
    Direccion: {},
    Ciudad: {},
    ValorLetras: {},
    Valor: {},
    FechaApertura: {},
    FechaVecimiento: {},
    PlazoDias: {},
    Modalidad: {},
    TNominal: {},
    TEfectiva: {},
    FrecuenciaPago: {},

  };
  dataObservacion: any;
  dataObjet: any;
  dataObjetBeneficiarios: any[] = [];
  dataObjetTitulares: any[] = [];
  dataObjetRenovacion: any;
  dataObjetCesionTitulo: any[] = [];
  dataObjetReciprocidad: any;
  dataObjetReciprocidadR: any[] = [];
  dataHistorial: any[] = [];
  dataAsociados: any;
  operacionEscogida = '';
  ArrayCondiciones: any;
  dataTitulareslist: any;
  dataBeneficiarioslist: any;


  MostrasAlertaAsociado = false;
  MostrasAlertaProducto = false;

  dataUser : any;
  dataAsesor : any;
  dataFrecuencia : any;


  selectOperacionPermitada = true;
  inputOperacionPermitada = false;
  selectEstado = true;
  inputEstado = false;
  selectCuenta = true;
  inputCuenta = false;
  selectFrecuencia = true;
  inputFrecuencia = false;
  inputValor = false;
  inputValorSinDecimal = true;
  oTitulo = false;
  btnGuardar = true;
  btnActualizarTab = true;
  btnCalcularTasa = true;
  btnAsesoria = true;
  DescriTipoFirma = true;
  indexAutorizado : number = -1;
  indexBeneficiarios : number= -1;
  bloquearbtnActalizar = false;
  btnActualizarTitulares = true;
  btnOpcionesActualizarTitulares = true;
  btnOpcionActualizarBeneficiario = true;
  btnActualizarBeneficiario = true;
  btnActualizarCesionTitulo = false;
  btnActualizar: boolean = true;
  bloquearbtnCalcular = false;

  public resultOperaciones : any;
  public resultRelacion : any;
  public resultFormaPago : any;
  public resultOperacionPermitada : any;
  public resultEstados : any;
  public resultLiquidacion : any;
  public resultPuntosAdicionales : any;
  public resultCuentaNegociacion : any;
  public resultAsociados : any;
  public resultProducto : any;
  public resultFrecuenciaPago : any;
  public resultTipoDocumento : any;
  public resultTitulares : any;
  public resultTipoFirma : any;
  public resultParentesco : any;
  public resultAsesoresExterno : any;

  public bloquear : boolean | null = false;
  public bloquearCuenta : boolean | null = false;
  public bloquearBuscar : boolean | null = false;
  public bloquearAsociado  : boolean | null = false;
  public bloquearNroTitulo  : boolean | null = false;
  public bloquearProducto  : boolean | null = false;
  public bloquearAsesorExterno  : boolean | null = false;
  public bloquearDatosTitulares  : boolean | null = false;
  public bloquearNegociacion  : boolean | null = false;
  public bloquearliquidacion  : boolean | null = false;
  public bloquearCuentaNegociacion  : boolean | null = false;
  public bloquearDocumentoBenf: boolean = false;
  public bloquearNombreBenf  : boolean | null = false;
  public bloquearBtnActualizarTitular : boolean | null = false;
  public bloquearPuntos : boolean | null = false;
  bloquearActualizar: boolean = false;
  bloquearbtnCambioEstado: boolean = false;
  bloquearEstado: boolean  | null = false;
  btnCambiarEstado: boolean | null = true;
  public validar  : boolean | null = true;
  public indefinido = undefined;
  public datoOficina : any;
  public datoProducto : any;
  public datoConsecutivo : any;
  public datoDigito : any;
  public datoTasaNominal : any;
  public datoTasaEfectiva : any;
  public datoTasaAdicional : any;
  public datoNombreProducto : any;
  public datoAsesorExterno : any;
  public datoCambioEstado : any;
  public datoLiquidacion : any;
  public datoPlazo : any;
  public datoValortitulo : any;
  public datoAutorizacionTasa : any;
  public datoPuntosAdicionales : any;
  public datoFechaApertura : any;
  public datoFechaRenovacion : any;




  public ColorAnterior1: any;
  public ColorAnterior2: any;
  public ColorAnterior3: any;
  public ColorAnterior4: any;
  public ColorAnterior5: any;
  public ColorAnterior6: any;

  BenificiariosElminar: any[] = [];

  // tabs
  activaNegociacion = false;
  activaSaldos = false;
  activaBeneficiario = false;
  activaAutorizados = false;
  activaRenovaciones = false;
  activaCesionTitulo = false;
  activaReciprocidad = false;
  activaHistorial = false;

  TipoBuscadaPersonas: number = 0;

  private returnFormatNum(num : string): string {
    num = num.toString();
    num = num.slice(0, (num.indexOf('.')) + 5);
    return num;
  }

  ngOnInit() {
    this.moduleValidationService.ValidatePermissionsModule(this.CodModulo);
    this.validateForm();
    this.validateAsesoria();
    this.Operaciones();
    this.ObtenerRelacion();
    this.TipoFirma();
    this.Liquidacion();
    this.NombresCapitaliceBasico();
    this.ObtenerTipoDocumento();
    this.Parentesco();
    $('#select').focus().select();
    $('#negociacion').addClass('activar');
    $('#negociacion').addClass('active');
  }


  // ENCABEZADO

  Operaciones() {
    let data = localStorage.getItem('Data')
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
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
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  ObtenerRelacion() {
    this.TerminoService.ObtenerRelacion().subscribe(
      result => {
        this.resultRelacion = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  OperacionPermitida() {
    this.TerminoService.OperacionPermitida().subscribe(
      result => {
        this.resultOperacionPermitada = result;
        this.TerminoForm.get('DescripcionOperacion')?.setValue(result[0].DescripcionOperacion);
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  ObtenerEstado() {
    let data = localStorage.getItem('Data')
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    const arrayExample = {
      'IdOperacion': 9,
      'IdPerfil': this.dataUser.idPerfilUsuario,
      'IdModulo': '19'
    };
    this.loading = true;
    this.operacionesService.ObtenerEstadosXOperacionesData(arrayExample).subscribe(
      result => {
        setTimeout(() => {
          this.resultEstados = result;
          this.TerminoForm.get('IdEstado')?.setValue("0");
          $('#SelectEstadoCuenta').focus().select();
          this.loading = false;
        }, 1000);
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  btnDeleteReciprocidad: boolean = false;
  bloquearCesionTitulo: boolean = false;
  ValorSeleccionado() {
    this.tab1.nativeElement.click();
    this.TabSeleccion("negociacion");
    this.btnActualizarCesionTitulo = false;
    this.personaCesionTityloBool = false;
    this.personaCesionTitylo = null;
    this.TipoBuscadaPersonas = 0;
    this.bloquearActualizar = false;
    this.btnCambiarEstado = true;
    this.bloquearEstado = false;
    this.bloquearbtnCambioEstado = false;
    this.bloquearAsesorExterno = false;
    this.ListCuentaAgregadasReciprocidad = [];
    this.isShowResiprocidadCredito = false;
    this.bloquearliquidacion = false;
    this.bloquearDocumentoBenf = false;
    this.btnActualizarBeneficiario = true;
    this.bloquearCesionTitulo = false;
    this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
    this.TerminoForm.controls["CesionTituloNombre"].setValue("");
    this.TerminoForm.controls["CesionTituloDocumento"].disable();
    this.TerminoForm.controls["CesionTituloNombre"].disable();
    this.TerminoForm.get('Porcentaje')?.setValue("");
    this.TerminoForm.get('DatosParentesco')?.setValue("");
    this.TerminoForm.get('DocumentoBeneficiario')?.setValue("");
    this.TerminoForm.get('Porcentaje')?.disable();
    this.TerminoForm.get('DatosParentesco')?.disable();
    this.TerminoForm.get('DocumentoBeneficiario')?.disable();
    this.btnDeleteReciprocidad = false
    this.btnActualizarBorrarReciprocidad = false;
    this.btnActualizar = true;
    this.bloquearbtnActalizar = false;
    this.LimpiarBeneficiarior();
    this.LimpiarCesion();
    this.clearTitulares();
    this.disableCesionTitulo = false;
    this.bloquearDatosTitulares = false;
    this.bloquearBtnActualizarTitular = false;
    this.BloquearAutorizadoTituloInput(1);
    this.btnActualizarTitulares = true;
    this.DescriTipoFirma = true;
    this.btnActualizarBeneficiarios = false;
    this.btnOpcionActualizarBeneficiario = true;
    this.TerminoForm.get('DocumentoBeneficiario')?.disable();
    this.listAutorizadoEliminar = [];
    if (this.TerminoOperacionForm.get('Codigo')?.value !== '2' && this.TerminoOperacionForm.get('Codigo')?.value !== '10' &&
      this.TerminoOperacionForm.get('Codigo')?.value !== '40' && this.TerminoOperacionForm.get('Codigo')?.value !== '13' &&
      this.TerminoOperacionForm.get('Codigo')?.value !== '103')
      this.BuscarPorCuenta();
    if (this.TerminoOperacionForm.get('Codigo')?.value === '2') {          //Buscar
      this.BenificiariosElminar = [];
      this.ClearFrom();
      this.operacionEscogida = '/Buscar';
      this.generalesService.Autofocus('SelectBuscar');
      this.bloquearBuscar = null;
      this.bloquearCuenta = null;
      this.bloquearAsociado = false;
      this.bloquearNroTitulo = false;
      this.bloquearProducto = false;
      this.bloquearDatosTitulares = false;
      this.bloquearDocumentoBenf = false;
      this.MostrasAlertaAsociado = false;
      this.selectOperacionPermitada = true;
      this.inputOperacionPermitada = false;
      this.btnAsesoria = true;
      this.selectEstado = true;
      this.inputEstado = false;
      this.selectFrecuencia = true;
      this.inputFrecuencia = false;
      this.DescriTipoFirma = true;
      this.bloquearbtnActalizar = false;
      this.btnActualizarTitulares = true;
      this.btnActualizarBeneficiario = true;
      this.bloquearNegociacion = false;
      this.bloquearBtnActualizarTitular = false;
      this.bloquearPuntos = false;
      this.devolverTab(1);
      this.tab1.nativeElement.click();
      $('#saldos').removeClass('activar');
      $('#saldos').removeClass('active');
      $('#Beneficiarios').removeClass('activar');
      $('#Beneficiarios').removeClass('active');
      $('#autorizados').removeClass('activar');
      $('#autorizados').removeClass('active');
      $('#renovaciones').removeClass('activar');
      $('#renovaciones').removeClass('active');
      $('#cesionAhorro').removeClass('activar');
      $('#cesionAhorro').removeClass('active');
      $('#reciprocidad').removeClass('activar');
      $('#reciprocidad').removeClass('active');
      $('#historial').removeClass('activar');
      $('#historial').removeClass('active');
      $('#negociacion').addClass('activar');
      $('#negociacion').addClass('active');
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '10') {  //Apertura cuenta 
      if (this.dataUser.NumeroOficina === '3') {
        this.notif.onWarning('Advertencia', 'No se puede abrir una cuenta en la oficina de administración.');
        this.ClearFrom();
      } else {
        this.generalesService.Autofocus('SelectAsociado');
        this.ClearFrom();
        this.OperacionPermitida();
        this.MapearDatosUsuario();
        if (this.TerminoForm.get('IdAsesor')?.value !== null
          && this.TerminoForm.get('IdAsesor')?.value !== undefined
          && this.TerminoForm.get('IdAsesor')?.value !== ' ') {
          this.operacionEscogida = '/Apertura de cuenta';
          this.Encabezado();
          this.inputEstado = false;
          this.selectEstado = true;
          this.selectFrecuencia = true;
          this.inputFrecuencia = false;
          this.bloquearCuenta = false;
          this.bloquearBuscar = false;
          this.bloquearAsociado = null;
          this.bloquearNroTitulo = null;
          this.bloquearProducto = false;
          this.bloquearAsesorExterno = null;
          this.bloquearDatosTitulares = false;
          this.bloquearDocumentoBenf = true;
          this.btnGuardar = false;
          this.DescriTipoFirma = true;
          this.bloquearbtnActalizar = false;
          this.btnActualizarTitulares = true;
          this.btnOpcionesActualizarTitulares = false;
          this.btnActualizarBeneficiario = true;
          this.btnOpcionActualizarBeneficiario = false;
          this.bloquearBtnActualizarTitular = false;
          this.btnAsesoria = false;
          this.bloquearPuntos = false;
          this.TerminoForm.get('DocumentoBeneficiario')?.enable();
          this.BloquearAutorizadoTituloInput(2);
          this.devolverTab(1);
          this.tab1.nativeElement.click();
          $('#saldos').removeClass('activar');
          $('#saldos').removeClass('active');
          $('#Beneficiarios').removeClass('activar');
          $('#Beneficiarios').removeClass('active');
          $('#autorizados').removeClass('activar');
          $('#autorizados').removeClass('active');
          $('#renovaciones').removeClass('activar');
          $('#renovaciones').removeClass('active');
          $('#cesionAhorro').removeClass('activar');
          $('#cesionAhorro').removeClass('active');
          $('#reciprocidad').removeClass('activar');
          $('#reciprocidad').removeClass('active');
          $('#historial').removeClass('activar');
          $('#historial').removeClass('active');
          $('#negociacion').addClass('activar');
          $('#negociacion').addClass('active');
        }
      }
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '40') {  // Apertura de cuenta mismo titular
      if (this.dataUser.NumeroOficina === '3') {
        this.notif.onWarning('Advertencia', 'No se puede abrir una cuenta en la oficina de administración.');
        this.bloquearBuscar = false;
        this.ClearFrom();
      } else {
        this.generalesService.Autofocus('SelectAsociado');
        this.ClearFrom();
        this.OperacionPermitida();
        this.MapearDatosUsuario();
        if (this.TerminoForm.get('IdAsesor')?.value !== null
          && this.TerminoForm.get('IdAsesor')?.value !== undefined
          && this.TerminoForm.get('IdAsesor')?.value !== ' ') {
          this.operacionEscogida = '/Apertura de cuenta mismo titular';
          this.Encabezado();
          this.inputEstado = false;
          this.selectEstado = true;
          this.selectFrecuencia = true;
          this.inputFrecuencia = false;
          this.bloquearCuenta = false;
          this.bloquearBuscar = false;
          this.bloquearAsociado = null;
          this.bloquearNroTitulo = null;
          this.bloquearProducto = false;
          this.bloquearAsesorExterno = null;
          this.bloquearDatosTitulares = false;
          this.bloquearDocumentoBenf = true;
          this.btnGuardar = false;
          this.DescriTipoFirma = true;
          this.bloquearbtnActalizar = false;
          this.btnActualizarTitulares = true;
          this.btnOpcionesActualizarTitulares = false;
          this.btnActualizarBeneficiario = true;
          this.btnOpcionActualizarBeneficiario = false;
          this.bloquearBtnActualizarTitular = false;
          this.btnAsesoria = false;
          this.bloquearPuntos = false;
          this.TerminoForm.get('DocumentoBeneficiario')?.enable();
          this.BloquearAutorizadoTituloInput(2);
          this.devolverTab(1);
          this.tab1.nativeElement.click();
          $('#saldos').removeClass('activar');
          $('#saldos').removeClass('active');
          $('#Beneficiarios').removeClass('activar');
          $('#Beneficiarios').removeClass('active');
          $('#autorizados').removeClass('activar');
          $('#autorizados').removeClass('active');
          $('#renovaciones').removeClass('activar');
          $('#renovaciones').removeClass('active');
          $('#cesionAhorro').removeClass('activar');
          $('#cesionAhorro').removeClass('active');
          $('#reciprocidad').removeClass('activar');
          $('#reciprocidad').removeClass('active');
          $('#historial').removeClass('activar');
          $('#historial').removeClass('active');
          $('#negociacion').addClass('activar');
          $('#negociacion').addClass('active');
        } else {
          this.notif.onWarning('Advertencia', 'Debe tener Id asesor para poder abrir un cuenta.');
          this.ClearFrom();
        }
      }
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '12') {  // Adicionar y/o  eliminar autorizados
      if (this.TerminoForm.get('IdOficina')?.value !== null
        && this.TerminoForm.get('IdOficina')?.value !== undefined
        && this.TerminoForm.get('IdOficina')?.value !== ''
        && this.TerminoForm.get('IdProductoCuenta')?.value !== null
        && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
        && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
        && this.TerminoForm.get('IdConsecutivo')?.value !== null
        && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
        && this.TerminoForm.get('IdConsecutivo')?.value !== ''
        && this.TerminoForm.get('IdDigito')?.value !== null
        && this.TerminoForm.get('IdDigito')?.value !== undefined
        && this.TerminoForm.get('IdDigito')?.value !== ''
      ) {
        if (this.TerminoForm.get('IdEstado')?.value !== 25 && this.TerminoForm.get('IdEstado')?.value !== 10 && this.TerminoForm.get('IdEstado')?.value !== 45) {
          this.DescriTipoFirma = true;
          this.inputEstado = false;
          this.selectEstado = true;
          this.BloquearAutorizadoTituloInput(2);
          this.bloquearCuentaNegociacion = false;
          this.bloquearNroTitulo = false;
          this.MostrasAlertaAsociado = false;
          this.MostrasAlertaProducto = false;
          this.bloquearliquidacion = false;
          this.bloquearPuntos = false;
          this.bloquearAsesorExterno = false;
          this.btnActualizar = true;
          this.btnActualizarTitulares = false;
          this.TerminoForm.controls["DocumentoTitular"].enable();
          this.TerminoForm.controls["NombreTitular"].enable();
          this.btnOpcionesActualizarTitulares = false;
          this.btnActualizarTab = true;
          this.btnCalcularTasa = true;
          this.btnCambiarEstado = true;
          this.dataObservacion = undefined;
          this.bloquearbtnActalizar = false;
          this.bloquearbtnCalcular = false;
          this.bloquearbtnCambioEstado = false;
          this.bloquearBtnActualizarTitular = false;
          this.btnAsesoria = true;
          this.operacionEscogida = '/Adicionar y/o  eliminar autorizados';
          this.VolverAbajo();
          this.devolverTab(4);
          this.tab4.nativeElement.click();
          $('#saldos').removeClass('activar');
          $('#saldos').removeClass('active');
          $('#Beneficiarios').removeClass('activar');
          $('#Beneficiarios').removeClass('active');
          $('#autorizados').addClass('activar');
          $('#autorizados').addClass('active');
          $('#renovaciones').removeClass('activar');
          $('#renovaciones').removeClass('active');
          $('#cesionAhorro').removeClass('activar');
          $('#cesionAhorro').removeClass('active');
          $('#reciprocidad').removeClass('activar');
          $('#reciprocidad').removeClass('active');
          $('#historial').removeClass('activar');
          $('#historial').removeClass('active');
          $('#negociacion').removeClass('activar');
          $('#negociacion').removeClass('active');
          this.generalesService.Autofocus('SelectTitular');
        } else {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede editar, estado no válido.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.TerminoOperacionForm.get('Codigo')?.reset();
      }
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '28') {  // Adicionar puntos
      if (this.TerminoForm.get('IdOficina')?.value !== null
        && this.TerminoForm.get('IdOficina')?.value !== undefined
        && this.TerminoForm.get('IdOficina')?.value !== ''
        && this.TerminoForm.get('IdProductoCuenta')?.value !== null
        && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
        && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
        && this.TerminoForm.get('IdConsecutivo')?.value !== null
        && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
        && this.TerminoForm.get('IdConsecutivo')?.value !== ''
        && this.TerminoForm.get('IdDigito')?.value !== null
        && this.TerminoForm.get('IdDigito')?.value !== undefined
        && this.TerminoForm.get('IdDigito')?.value !== '') {
        if (this.TerminoForm.get('IdEstado')?.value !== 25 && this.TerminoForm.get('IdEstado')?.value !== 10) {
          // valida que el producto se aperturo el mismo mes y año
          const FechaApertura: Date = new Date(this.datoFechaApertura);
          const FechaRenovacion: Date = new Date(this.datoFechaRenovacion);
          const FechaActual: Date = new Date();         
          const MesActual: Number = FechaActual.getMonth() + 1;
          const yearActual: Number = FechaActual.getFullYear();
          const MesApertura: Number = FechaApertura.getMonth() +1;
          const yearApertura: Number = FechaApertura.getFullYear();     
          const MesRenovacion: Number = FechaRenovacion.getMonth() + 1;
          const yearRenovacion: Number = FechaRenovacion.getFullYear();   
          console.log('MesApertura', MesApertura);
          console.log('MesActual', MesActual);
          console.log('yearApertura', yearApertura);
          console.log('yearActual', yearActual);
          
          if (this.datoFechaRenovacion !== null) {
            if (MesRenovacion !== MesActual || yearRenovacion !== yearActual) {
              this.notif.onWarning('Advertencia', 'Fecha incorrecta para adicionar puntos.');
              this.TerminoOperacionForm.get('Codigo')?.reset();
            } else {
              this.operacionEscogida = '/Adicionar puntos';
              this.generalesService.Autofocus('SelectAdicionarPuntos');
              this.ObtenerPuntosAdicionales();
              this.BuscarCuentaParaPuntos();
              this.bloquearBuscar = false;
              this.DescriTipoFirma = true;
              this.bloquearNroTitulo = false;
              this.selectEstado = true;
              this.MostrasAlertaAsociado = false;
              this.MostrasAlertaProducto = false;
              this.inputEstado = false;
              this.selectCuenta = true;
              this.inputCuenta = false;
              this.bloquearDatosTitulares = false;
              this.bloquearAsociado = false;
              this.bloquearNegociacion = false;
              this.bloquearProducto = false;
              this.bloquearCuentaNegociacion = false;
              this.bloquearliquidacion = false;
              this.inputEstado = false;
              this.bloquearPuntos = null;
              this.bloquearAsesorExterno = false;
              this.dataObservacion = undefined;
              this.bloquearbtnActalizar = false;
              this.bloquearbtnCalcular = false;
              this.bloquearbtnCambioEstado = false;
              this.btnActualizar = true;
              this.btnActualizarTitulares = true;
              this.btnOpcionesActualizarTitulares = true;
              this.btnActualizarTab = false;
              this.btnCalcularTasa = false;
              this.btnCambiarEstado = true;
              this.btnAsesoria = true;
              this.VolverAbajo();
              this.devolverTab(1);
              this.tab1.nativeElement.click();
              $('#saldos').removeClass('activar');
              $('#saldos').removeClass('active');
              $('#Beneficiarios').removeClass('activar');
              $('#Beneficiarios').removeClass('active');
              $('#autorizados').removeClass('activar');
              $('#autorizados').removeClass('active');
              $('#renovaciones').removeClass('activar');
              $('#renovaciones').removeClass('active');
              $('#cesionAhorro').removeClass('activar');
              $('#cesionAhorro').removeClass('active');
              $('#reciprocidad').removeClass('activar');
              $('#reciprocidad').removeClass('active');
              $('#historial').removeClass('activar');
              $('#historial').removeClass('active');
              $('#negociacion').addClass('activar');
              $('#negociacion').addClass('active');
            }

          } else {
            if (MesApertura !== MesActual || yearApertura !== yearActual) {
              this.notif.onWarning('Advertencia', 'Fecha incorrecta para adicionar puntos.');
              this.TerminoOperacionForm.get('Codigo')?.reset(); 
            } else {
              this.operacionEscogida = '/Adicionar puntos';
              this.generalesService.Autofocus('SelectAdicionarPuntos');
              this.ObtenerPuntosAdicionales();
              this.BuscarCuentaParaPuntos();
              this.bloquearBuscar = false;
              this.DescriTipoFirma = true;
              this.bloquearNroTitulo = false;
              this.selectEstado = true;
              this.MostrasAlertaAsociado = false;
              this.MostrasAlertaProducto = false;
              this.inputEstado = false;
              this.selectCuenta = true;
              this.inputCuenta = false;
              this.bloquearDatosTitulares = false;
              this.bloquearAsociado = false;
              this.bloquearNegociacion = false;
              this.bloquearProducto = false;
              this.bloquearCuentaNegociacion = false;
              this.bloquearliquidacion = false;
              this.inputEstado = false;
              this.bloquearPuntos = null;
              this.bloquearAsesorExterno = false;
              this.dataObservacion = undefined;
              this.bloquearbtnActalizar = false;
              this.bloquearbtnCalcular = false;
              this.bloquearbtnCambioEstado = false;
              this.btnActualizar = true;
              this.btnActualizarTitulares = true;
              this.btnOpcionesActualizarTitulares = true;
              this.btnActualizarTab = false;
              this.btnCalcularTasa = false;
              this.btnCambiarEstado = true;
              this.btnAsesoria = true;
              this.VolverAbajo();
              this.devolverTab(1);
              this.tab1.nativeElement.click();
              $('#saldos').removeClass('activar');
              $('#saldos').removeClass('active');
              $('#Beneficiarios').removeClass('activar');
              $('#Beneficiarios').removeClass('active');
              $('#autorizados').removeClass('activar');
              $('#autorizados').removeClass('active');
              $('#renovaciones').removeClass('activar');
              $('#renovaciones').removeClass('active');
              $('#cesionAhorro').removeClass('activar');
              $('#cesionAhorro').removeClass('active');
              $('#reciprocidad').removeClass('activar');
              $('#reciprocidad').removeClass('active');
              $('#historial').removeClass('activar');
              $('#historial').removeClass('active');
              $('#negociacion').addClass('activar');
              $('#negociacion').addClass('active');            
            }
          }         
        } else {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede editar, estado no válido.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.TerminoOperacionForm.get('Codigo')?.reset();
      }
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '13') {  // Reimprimir 
      if (this.TerminoForm.get('IdOficina')?.value !== null
        && this.TerminoForm.get('IdOficina')?.value !== undefined
        && this.TerminoForm.get('IdOficina')?.value !== ''
        && this.TerminoForm.get('IdProductoCuenta')?.value !== null
        && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
        && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
        && this.TerminoForm.get('IdConsecutivo')?.value !== null
        && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
        && this.TerminoForm.get('IdConsecutivo')?.value !== ''
        && this.TerminoForm.get('IdDigito')?.value !== null
        && this.TerminoForm.get('IdDigito')?.value !== undefined
        && this.TerminoForm.get('IdDigito')?.value !== ''
      ) {
        // if (this.TerminoForm.get('IdOficina')?.value != this.dataUser.NumeroOficina) {
        //   this.notif.onWarning('Advertencia', 'No se puede reimprimir en otra oficina.');
        //   this.TerminoOperacionForm.get('Codigo')?.setValue("");
        //   return;
        // }
        if (this.TerminoForm.get('IdEstado')?.value !== 25 && this.TerminoForm.get('IdEstado')?.value !== 10 && this.TerminoForm.get('IdEstado')?.value !== 45) {
          if (this.itemsSend.Telefono == null) {
            this.notif.onWarning('Advertencia', 'Debe actualizar teléfono de contacto.');
            this.loading = false;
            return;
          }
          
          this.DescriTipoFirma = true;
          this.GenerarImpresion();
          $("#ImpresionTermino").show();
          this.ModalImpresion.nativeElement.click();
          this.MostrasAlertaAsociado = false;
          this.MostrasAlertaProducto = false;
          this.selectEstado = true;
          this.inputEstado = false;
          this.selectCuenta = true;
          this.inputCuenta = false;
          this.bloquearBuscar = false;
          this.bloquearAsociado = false;
          this.bloquearNegociacion = false;
          this.bloquearProducto = false;
          this.bloquearCuentaNegociacion = false;
          this.bloquearliquidacion = false;
          this.bloquearAsesorExterno = false;
          this.bloquearbtnActalizar = false;
          this.btnActualizarTitulares = true;
          this.btnOpcionesActualizarTitulares = true;
          this.bloquearBtnActualizarTitular = false;
          this.btnAsesoria = true;
          this.bloquearPuntos = false;
          this.operacionEscogida = '/Reimprimir';
          let reimprimirLog: any = {
            Cuenta: this.itemsSend.Cuenta,
            Documento: this.itemsSend.Cedula,
            Nombre: this.itemsSend.NombreApellidos,
            Telefono: this.itemsSend.Telefono,
            Ciudad: this.itemsSend.Ciudad,
            Direccion: this.itemsSend.Direccion,
            Valor: this.itemsSend.Valor,
            ValorLetras: this.itemsSend.ValorLetras,
            FechaApertura: this.itemsSend.FechaApertura,
            FechaVecimiento: this.itemsSend.FechaVecimiento,
            PlazoDias: this.itemsSend.PlazoDias,
            Modalidad: this.itemsSend.Modalidad,
            TasaNominal: this.itemsSend.TNominal,
            TasaEfectiva: this.itemsSend.TEfectiva,
            FrecuenciaPago: this.itemsSend.FrecuenciaPago
          }
          this.Guardarlog({ Reimprimir: reimprimirLog });
          setTimeout(() => {
            this.ObtenerHistorial();
          }, 500);

        } else {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede reimprimir, estado no válido.');
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
      }

    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '19') {  // Cambiar asesor externo
      if (this.TerminoForm.get('IdOficina')?.value !== null
        && this.TerminoForm.get('IdOficina')?.value !== undefined
        && this.TerminoForm.get('IdOficina')?.value !== ''
        && this.TerminoForm.get('IdProductoCuenta')?.value !== null
        && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
        && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
        && this.TerminoForm.get('IdConsecutivo')?.value !== null
        && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
        && this.TerminoForm.get('IdConsecutivo')?.value !== ''
        && this.TerminoForm.get('IdDigito')?.value !== null
        && this.TerminoForm.get('IdDigito')?.value !== undefined
        && this.TerminoForm.get('IdDigito')?.value !== ''
      ) {
        if (this.TerminoForm.get('IdEstado')?.value !== 25 && this.TerminoForm.get('IdEstado')?.value !== 10) {
          this.DescriTipoFirma = true;
          this.generalesService.Autofocus('SelectAsesorExterno');
          this.operacionEscogida = '/Cambiar asesor externo';
          this.bloquearAsociado = true;
          this.bloquearNroTitulo = false;
          this.MostrasAlertaAsociado = false;
          this.MostrasAlertaProducto = false;
          this.bloquear = true;
          this.bloquearProducto = true;
          this.bloquearBuscar = false;
          this.btnActualizar = false;
          this.btnGuardar = true;
          this.bloquearAsesorExterno = null;
          this.bloquearbtnActalizar = false;
          this.bloquearliquidacion = false;
          this.inputEstado = false;
          this.selectEstado = true;
          this.btnActualizarTitulares = true;
          this.btnOpcionesActualizarTitulares = true;
          this.btnActualizarTab = true;
          this.btnCalcularTasa = true;
          this.bloquearDatosTitulares = false;
          this.btnAsesoria = true;
          this.bloquearPuntos = false;
        } else {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede editar, estado no válido.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.TerminoOperacionForm.get('Codigo')?.reset();
      }
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '9') {   // Cambio de estado
      if (this.TerminoForm.get('IdOficina')?.value !== null
        && this.TerminoForm.get('IdOficina')?.value !== undefined
        && this.TerminoForm.get('IdOficina')?.value !== ''
        && this.TerminoForm.get('IdProductoCuenta')?.value !== null
        && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
        && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
        && this.TerminoForm.get('IdConsecutivo')?.value !== null
        && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
        && this.TerminoForm.get('IdConsecutivo')?.value !== ''
        && this.TerminoForm.get('IdDigito')?.value !== null
        && this.TerminoForm.get('IdDigito')?.value !== undefined
        && this.TerminoForm.get('IdDigito')?.value !== ''
      ) {
        if (this.TerminoForm.get('IdEstado')?.value !== 25 && this.TerminoForm.get('IdEstado')?.value !== 10) {
          if (this.TerminoForm.get('IdEstado')?.value === 20) {
            this.bloquearbtnCambioEstado = true;
          }
          this.ObtenerEstado();
          this.bloquearNroTitulo = false;
          this.bloquearCuentaNegociacion = false;
          this.bloquearliquidacion = false;
          this.MostrasAlertaAsociado = false;
          this.MostrasAlertaProducto = false;
          this.inputEstado = true;
          this.selectEstado = false;
          this.bloquearEstado = null;
          this.btnCambiarEstado = false;
          this.btnActualizar = true;
          this.btnActualizarTitulares = true;
          this.btnOpcionesActualizarTitulares = true;
          this.btnActualizarTab = true;
          this.btnCalcularTasa = true;
          this.btnGuardar = true;
          this.bloquearAsesorExterno = false;
          this.bloquearbtnActalizar = false;
          this.DescriTipoFirma = true;
          this.bloquearDatosTitulares = false;
          this.btnAsesoria = true;
          this.bloquearPuntos = false;
          this.operacionEscogida = '/ Cambio de estado';
        } else {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede editar, estado no válido.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.TerminoOperacionForm.get('Codigo')?.reset();
      }
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '44') {  // Cambiar Nro Titulo     
      if (this.TerminoForm.get('IdOficina')?.value !== null
        && this.TerminoForm.get('IdOficina')?.value !== undefined
        && this.TerminoForm.get('IdOficina')?.value !== ''
        && this.TerminoForm.get('IdProductoCuenta')?.value !== null
        && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
        && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
        && this.TerminoForm.get('IdConsecutivo')?.value !== null
        && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
        && this.TerminoForm.get('IdConsecutivo')?.value !== ''
        && this.TerminoForm.get('IdDigito')?.value !== null
        && this.TerminoForm.get('IdDigito')?.value !== undefined
        && this.TerminoForm.get('IdDigito')?.value !== ''
      ) {
        if (this.TerminoForm.get('IdOficina')?.value != this.dataUser.NumeroOficina && this.dataUser.NumeroOficina != 3) {
          this.notif.onWarning('Advertencia', 'La cuenta pertenece a otra oficina.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
          return;
        }
        if (this.TerminoForm.get('IdEstado')?.value !== 25) {
          if (this.TerminoForm.get('IdEstado')?.value === 10) {
            if (this.TerminoForm.get('NroTitulo')?.value !== null
              && this.TerminoForm.get('NroTitulo')?.value !== undefined
              && this.TerminoForm.get('NroTitulo')?.value !== '') {
              swal.fire({
                title: '¿Desea liberar titulo de cuenta anulada?',
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
                  this.LiberarTitulo();
                  this.TerminoOperacionForm.get('Codigo')?.reset();
                  this.notif.onSuccess('Exitoso', 'La liberacion de titulo se realizo correctamente.');
                }                 
                else
                  this.TerminoOperacionForm.get('Codigo')?.reset();
              });
            } else {
              this.notif.onWarning('Advertencia', 'Cuenta anulada sin titulo');
              this.TerminoOperacionForm.get('Codigo')?.reset();
            }            
          } else {
            this.DescriTipoFirma = true;
            this.MostrasAlertaAsociado = false;
            this.MostrasAlertaProducto = false;
            this.bloquearNroTitulo = null;
            this.selectEstado = true;
            this.inputEstado = false;
            this.selectCuenta = true;
            this.inputCuenta = false;
            this.bloquearBuscar = false;
            this.bloquearAsociado = false;
            this.bloquearNegociacion = false;
            this.bloquearCuentaNegociacion = false;
            this.bloquearliquidacion = false;
            this.dataObservacion = undefined;
            this.bloquearbtnActalizar = false;
            this.bloquearbtnCambioEstado = false;
            this.btnActualizar = false;
            this.btnCambiarEstado = true;
            this.btnActualizarTitulares = true;
            this.btnOpcionesActualizarTitulares = true;
            this.bloquearDatosTitulares = false;
            this.btnAsesoria = true;
            this.bloquearPuntos = false;
            this.operacionEscogida = '/Cambiar Número Título';
            this.generalesService.Autofocus('NumTitulo');
            this.ObtenerHistorial();
          }         
        } else {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede editar, estado no válido.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.TerminoOperacionForm.get('Codigo')?.reset();
      }
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '27') {  // Cambiar tipo de cuenta destino
      if (this.TerminoForm.get('IdOficina')?.value !== null
        && this.TerminoForm.get('IdOficina')?.value !== undefined
        && this.TerminoForm.get('IdOficina')?.value !== ''
        && this.TerminoForm.get('IdProductoCuenta')?.value !== null
        && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
        && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
        && this.TerminoForm.get('IdConsecutivo')?.value !== null
        && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
        && this.TerminoForm.get('IdConsecutivo')?.value !== ''
        && this.TerminoForm.get('IdDigito')?.value !== null
        && this.TerminoForm.get('IdDigito')?.value !== undefined
        && this.TerminoForm.get('IdDigito')?.value !== ''
      ) {
        if (this.TerminoForm.get('IdEstado')?.value !== 25 && this.TerminoForm.get('IdEstado')?.value !== 10) {
          this.DescriTipoFirma = true;
          this.bloquearNroTitulo = false;
          this.bloquearCuentaNegociacion = null;
          this.bloquearliquidacion = null;
          this.MostrasAlertaProducto = false;
          this.MostrasAlertaAsociado = false;
          this.inputEstado = false;
          this.selectEstado = true;
          this.btnActualizarTab = false;
          this.btnActualizarTitulares = true;
          this.btnOpcionesActualizarTitulares = true;
          this.btnActualizar = true;
          this.btnCalcularTasa = true;
          this.btnCambiarEstado = true;
          this.bloquearAsesorExterno = false;
          this.bloquearbtnActalizar = false;
          this.bloquearbtnCambioEstado = false;
          this.bloquearDatosTitulares = false;
          this.btnAsesoria = true;
          this.bloquearPuntos = false;
          this.operacionEscogida = '/Cambiar Tipo Cuenta Destino';
          this.tab1.nativeElement.click();
          this.TabSeleccion("negociacion");
          this.generalesService.Autofocus('SelectCuentaDestino');
          this.SeleccionLiquidacion();

        } else {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede editar, estado no válido.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.TerminoOperacionForm.get('Codigo')?.reset();
      }
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '11') {  // Adicionar y/o eliminar beneficiario
      if (this.TerminoForm.get('IdOficina')?.value !== null
        && this.TerminoForm.get('IdOficina')?.value !== undefined
        && this.TerminoForm.get('IdOficina')?.value !== ''
        && this.TerminoForm.get('IdProductoCuenta')?.value !== null
        && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
        && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
        && this.TerminoForm.get('IdConsecutivo')?.value !== null
        && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
        && this.TerminoForm.get('IdConsecutivo')?.value !== ''
        && this.TerminoForm.get('IdDigito')?.value !== null
        && this.TerminoForm.get('IdDigito')?.value !== undefined
        && this.TerminoForm.get('IdDigito')?.value !== ''
      ) {
        if (this.TerminoForm.get('IdEstado')?.value !== 25 && this.TerminoForm.get('IdEstado')?.value !== 10 && this.TerminoForm.get('IdEstado')?.value !== 45) {
          this.btnActualizarBeneficiario = false;
          this.TerminoForm.get('DocumentoBeneficiario')?.enable();
          this.tab3.nativeElement.click();
          this.TabSeleccion("Beneficiarios");
          this.operacionEscogida = '/ Adicionar y/o Eliminar Beneficiario';
          this.btnOpcionActualizarBeneficiario = false;
          this.generalesService.Autofocus('BeneficiarioSeguroDocumento');
        } else {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede editar, estado no válido.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.TerminoOperacionForm.get('Codigo')?.reset();
      }
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '100') {  // Adicionar y/o eliminar cesion CDAT
      if (this.TerminoForm.get('IdOficina')?.value !== null
        && this.TerminoForm.get('IdOficina')?.value !== undefined
        && this.TerminoForm.get('IdOficina')?.value !== ''
        && this.TerminoForm.get('IdProductoCuenta')?.value !== null
        && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
        && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
        && this.TerminoForm.get('IdConsecutivo')?.value !== null
        && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
        && this.TerminoForm.get('IdConsecutivo')?.value !== ''
        && this.TerminoForm.get('IdDigito')?.value !== null
        && this.TerminoForm.get('IdDigito')?.value !== undefined
        && this.TerminoForm.get('IdDigito')?.value !== ''
      ) {
        if (this.TerminoForm.get('IdEstado')?.value !== 25 && this.TerminoForm.get('IdEstado')?.value !== 10 && this.TerminoForm.get('IdEstado')?.value !== 45) {
          this.TerminoForm.controls["CesionTituloDocumento"].enable();
          this.TerminoForm.controls["CesionTituloNombre"].enable();
          this.tab6.nativeElement.click();
          this.bloquearCesionTitulo = true;
          this.disableCesionTitulo = true;
          this.bloquearPuntos = false;
          this.TabSeleccion("CesionTitulo");
          this.operacionEscogida = '/ Adicionar y/o eliminar cesion titulo';
          this.generalesService.Autofocus('SelectCesionTitulo');
        } else {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede editar, estado no válido.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.TerminoOperacionForm.get('Codigo')?.reset();
      }
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '103') {  // Reimprimir Capitalizacion
      if (this.TerminoForm.get('IdOficina')?.value !== null
        && this.TerminoForm.get('IdOficina')?.value !== undefined
        && this.TerminoForm.get('IdOficina')?.value !== ''
        && this.TerminoForm.get('IdProductoCuenta')?.value !== null
        && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
        && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
        && this.TerminoForm.get('IdConsecutivo')?.value !== null
        && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
        && this.TerminoForm.get('IdConsecutivo')?.value !== ''
        && this.TerminoForm.get('IdDigito')?.value !== null
        && this.TerminoForm.get('IdDigito')?.value !== undefined
        && this.TerminoForm.get('IdDigito')?.value !== ''
      ) {
        if (this.TerminoForm.get('IdEstado')?.value == 25 || this.TerminoForm.get('IdEstado')?.value == 10) {
          this.notif.onWarning('Advertencia', 'No se puede reimprimir capitalización, estado no válido.');
          this.TerminoOperacionForm.get('Codigo')?.setValue("");
          return;
        }
        if (this.dataObjet != undefined && this.dataObjet != null && this.dataObjet.TasaAdicional != null && this.dataObjet.TasaAdicional != 0) {
          this.DescriTipoFirma = true;
          this.ImpresionCapitalizacionPDF(true);
          this.MostrasAlertaAsociado = false;
          this.MostrasAlertaProducto = false;
          this.selectEstado = true;
          this.inputEstado = false;
          this.selectCuenta = true;
          this.inputCuenta = false;
          this.bloquearBuscar = false;
          this.bloquearAsociado = false;
          this.bloquearNegociacion = false;
          this.bloquearProducto = false;
          this.bloquearCuentaNegociacion = false;
          this.bloquearliquidacion = false;
          this.bloquearAsesorExterno = false;
          this.bloquearbtnActalizar = false;
          this.btnActualizarTitulares = true;
          this.btnOpcionesActualizarTitulares = true;
          this.bloquearBtnActualizarTitular = false;
          this.btnAsesoria = true;
          this.bloquearPuntos = false;
          this.operacionEscogida = '/Reimprimir Capitalizacion';
          setTimeout(() => { this.ObtenerHistorial() }, 1000)
        } else {
          this.TerminoOperacionForm.get('Codigo')?.setValue("");
          this.notif.onWarning('Advertencia', 'Cuenta sin capitalización.');
        }
      } else {
        this.TerminoOperacionForm.get('Codigo')?.setValue("");
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
      }

    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '104') {  // Corregir Reciprocidad
      if (this.TerminoForm.get('IdOficina')?.value !== null
        && this.TerminoForm.get('IdOficina')?.value !== undefined
        && this.TerminoForm.get('IdOficina')?.value !== ''
        && this.TerminoForm.get('IdProductoCuenta')?.value !== null
        && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
        && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
        && this.TerminoForm.get('IdConsecutivo')?.value !== null
        && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
        && this.TerminoForm.get('IdConsecutivo')?.value !== ''
        && this.TerminoForm.get('IdDigito')?.value !== null
        && this.TerminoForm.get('IdDigito')?.value !== undefined
        && this.TerminoForm.get('IdDigito')?.value !== ''
      ) {
        if (this.TerminoForm.get('IdEstado')?.value == 25 || this.TerminoForm.get('IdEstado')?.value == 10 && this.TerminoForm.get('IdEstado')?.value !== 45) {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede editar, estado no válido.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
          return;
        }
        if (this.dataObjetReciprocidad == undefined) {
          this.notif.onWarning('Advertencia', 'No hay registros a corregir.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
          return;
        }
        let tempBloqueoXMuerte: any = this.dataHistorial.filter(( x: any) => x.Operacion == 9)[0];
        if (tempBloqueoXMuerte != null && tempBloqueoXMuerte.IdTiposObservaciones == 2) {
          this.notif.onWarning('Advertencia', 'Cuenta no se puede corregir, estado bloqueado por muerte de asociado.');
          this.TerminoOperacionForm.get('Codigo')?.reset();
          return;
        }
        this.ListBajarAHistorial = [];
        this.ListEliminaReciprocidad = [];
        this.btnDeleteReciprocidad = true;
        this.DescriTipoFirma = true;
        this.MostrasAlertaAsociado = false;
        this.MostrasAlertaProducto = false;
        this.selectEstado = true;
        this.inputEstado = false;
        this.selectCuenta = true;
        this.inputCuenta = false;
        this.bloquearBuscar = false;
        this.bloquearAsociado = false;
        this.bloquearNegociacion = false;
        this.bloquearProducto = false;
        this.bloquearCuentaNegociacion = false;
        this.bloquearliquidacion = false;
        this.bloquearAsesorExterno = false;
        this.bloquearbtnActalizar = false;
        this.btnActualizarTitulares = true;
        this.btnOpcionesActualizarTitulares = true;
        this.bloquearBtnActualizarTitular = false;
        this.btnAsesoria = true;
        this.bloquearPuntos = false;

        this.operacionEscogida = '/Corregir Reciprocidad';
        this.tab7.nativeElement.click();
        this.TabSeleccion("Reciprocidad");
        let element = document.getElementById('reciprocidad');
        if (element)
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        this.ObtenerHistorial();
      } else {
        this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
        this.TerminoOperacionForm.get('Codigo')?.reset();
      }
    }
    this.ResetValorSeleccionado();
  }
  ResetValorSeleccionado(tipo: number = 0) {
    if (this.TerminoOperacionForm.get('Codigo')?.value != '2'
      && this.TerminoOperacionForm.get('Codigo')?.value != '10'
      && this.TerminoOperacionForm.get('Codigo')?.value != '40'
      && this.TerminoOperacionForm.get('Codigo')?.value != '12'
      && this.TerminoOperacionForm.get('Codigo')?.value != '28'
      && this.TerminoOperacionForm.get('Codigo')?.value != '44'
      && this.TerminoOperacionForm.get('Codigo')?.value != '19'
      && this.TerminoOperacionForm.get('Codigo')?.value != '9'
      && this.TerminoOperacionForm.get('Codigo')?.value != '27'
      && this.TerminoOperacionForm.get('Codigo')?.value != '11'
      && this.TerminoOperacionForm.get('Codigo')?.value != '100'
      && this.TerminoOperacionForm.get('Codigo')?.value != '103'
      && this.TerminoOperacionForm.get('Codigo')?.value != '104')
      this.TerminoOperacionForm.get('Codigo')?.reset();
    if (tipo == 1 && this.TerminoOperacionForm.get('Codigo')?.value == '2')
      this.TerminoOperacionForm.get('Codigo')?.reset();
  }

  devolverTab(tab : number) {
    switch (tab) {
      case 1:
        this.activaNegociacion = true;
        this.activaSaldos = false;
        this.activaBeneficiario = false;
        this.activaAutorizados = false;
        this.activaRenovaciones = false;
        this.activaCesionTitulo = false;
        this.activaReciprocidad = false;
        this.activaHistorial = false;
        break;
      case 2:
        this.activaNegociacion = false;
        this.activaSaldos = true;
        this.activaBeneficiario = false;
        this.activaAutorizados = false;
        this.activaRenovaciones = false;
        this.activaCesionTitulo = false;
        this.activaReciprocidad = false;
        this.activaHistorial = false;
        break;
      case 3:
        this.activaNegociacion = false;
        this.activaSaldos = false;
        this.activaBeneficiario = true;
        this.activaAutorizados = false;
        this.activaRenovaciones = false;
        this.activaCesionTitulo = false;
        this.activaReciprocidad = false;
        this.activaHistorial = false;
        break;
      case 4:
        this.activaNegociacion = false;
        this.activaSaldos = false;
        this.activaBeneficiario = false;
        this.activaAutorizados = true;
        this.activaRenovaciones = false;
        this.activaCesionTitulo = false;
        this.activaReciprocidad = false;
        this.activaHistorial = false;
        break;
      case 5:
        this.activaNegociacion = false;
        this.activaSaldos = false;
        this.activaBeneficiario = false;
        this.activaAutorizados = false;
        this.activaRenovaciones = true;
        this.activaCesionTitulo = false;
        this.activaReciprocidad = false;
        this.activaHistorial = false;
        break;
      case 6:
        this.activaNegociacion = false;
        this.activaSaldos = false;
        this.activaBeneficiario = false;
        this.activaAutorizados = false;
        this.activaRenovaciones = false;
        this.activaCesionTitulo = true;
        this.activaReciprocidad = false;
        this.activaHistorial = false;
        break;
      case 7:
        this.activaNegociacion = false;
        this.activaSaldos = false;
        this.activaBeneficiario = false;
        this.activaAutorizados = false;
        this.activaRenovaciones = false;
        this.activaCesionTitulo = false;
        this.activaReciprocidad = true;
        this.activaHistorial = false;
        break;
      case 8:
        this.activaNegociacion = false;
        this.activaSaldos = false;
        this.activaBeneficiario = false;
        this.activaAutorizados = false;
        this.activaRenovaciones = false;
        this.activaCesionTitulo = false;
        this.activaReciprocidad = false;
        this.activaHistorial = true;
        break;
    }
  }
  TabSeleccion(name: string) {
    $('#negociacion').removeClass('activar');
    $('#negociacion').removeClass('active');
    $('#Beneficiarios').removeClass('activar');
    $('#Beneficiarios').removeClass('active');
    $('#renovaciones').removeClass('activar');
    $('#renovaciones').removeClass('active');
    $('#cesionAhorro').removeClass('activar');
    $('#cesionAhorro').removeClass('active');
    $('#reciprocidad').removeClass('activar');
    $('#reciprocidad').removeClass('active');
    $('#historial').removeClass('activar');
    $('#historial').removeClass('active');
    $('#saldos').removeClass('activar');
    $('#saldos').removeClass('active');
    $('#autorizados').removeClass('activar');
    $('#autorizados').removeClass('active');

    if (name == "negociacion") {
      $('#negociacion').addClass('activar');
      $('#negociacion').addClass('active');
    } else if (name == "Beneficiarios") {
      $('#Beneficiarios').addClass('activar');
      $('#Beneficiarios').addClass('active');
    } else if (name == "CesionTitulo") {
      $('#cesionAhorro').addClass('activar');
      $('#cesionAhorro').addClass('active');
    } else if (name == "Reciprocidad") {
      $('#reciprocidad').addClass('activar');
      $('#reciprocidad').addClass('active');
    }
  }
  BuscarPorCuenta() {
    if (this.TerminoForm.get('IdOficina')?.value !== ''
      && this.TerminoForm.get('IdOficina')?.value !== undefined
      && this.TerminoForm.get('IdOficina')?.value !== null
      && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
      && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
      && this.TerminoForm.get('IdProductoCuenta')?.value !== null
      && this.TerminoForm.get('IdConsecutivo')?.value !== ''
      && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
      && this.TerminoForm.get('IdConsecutivo')?.value !== null
      && this.TerminoForm.get('IdDigito')?.value !== ''
      && this.TerminoForm.get('IdDigito')?.value !== undefined
      && this.TerminoForm.get('IdDigito')?.value !== null) {
      this.loading = true;
      this.TerminoService.BuscarCuenta(this.TerminoForm.value).subscribe(
        result => {
          if (result !== null) {
            this.loading = false;
            this.bloquearBuscar = false;
            this.bloquearCuenta = false;
            this.ResetValorSeleccionado(1);
            this.MapearDatosCuenta(result);
          } else {
            this.loading = false;
            this.notif.onWarning('Advertencia', 'La cuenta no existe.');
            this.TerminoForm.get('IdOficina')?.reset();
            this.TerminoForm.get('IdProductoCuenta')?.reset();
            this.TerminoForm.get('IdConsecutivo')?.reset();
            this.TerminoForm.get('IdDigito')?.reset();
            this.dataObjet = undefined;
            this.bloquearBuscar = null;
            this.ClearFromTermino();
          }
        },
        error => {
          this.loading = false;
          this.notif.onWarning('Advertencia', 'La cuenta no es valida.');
          this.TerminoForm.get('IdOficina')?.reset();
          this.TerminoForm.get('IdProductoCuenta')?.reset();
          this.TerminoForm.get('IdConsecutivo')?.reset();
          this.TerminoForm.get('IdDigito')?.reset();
          this.dataObjet = undefined;
          this.bloquearBuscar = null;
          this.ClearFromTermino();
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );

    }
  }
  MapearDatosCuenta(result : any) {
    if (result !== null) {
      let data = localStorage.getItem('Data')
      this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
      if (result.length >= 1) {
        this.dataObjet = result;
        // Encabezado 
        this.TerminoForm.get('IdCuenta')?.setValue(this.dataObjet.IdCuenta);
        this.TerminoForm.get('Cuenta')?.setValue(this.dataObjet.Cuenta);
        this.TerminoForm.get('IdUsuarioSGF')?.setValue(this.dataUser.IdUsuarioSGF);
        this.TerminoForm.get('LngTercero')?.setValue(this.dataObjet.LngTercero);
        this.TerminoForm.get('TipoDocumento')?.setValue(this.dataObjet.TipoDocumento);
        this.TerminoForm.get('NumeroDocumento')?.setValue(this.dataObjet.NumeroDocumento);
        this.TerminoForm.get('Nombre')?.setValue(this.dataObjet.PrimerApellido + ' ' + this.dataObjet.SegundoApellido +
          ' ' + this.dataObjet.PrimerNombre + ' ' + this.dataObjet.SegundoNombre);
        this.TerminoForm.get('IdAsesor')?.setValue(this.dataObjet.IdAsesor);
        if (this.TerminoForm.get('IdAsesor')?.value === 2) {
          this.TerminoForm.get('NombreAsesor')?.setValue('Coogranada');
        } else {
          this.TerminoForm.get('NombreAsesor')?.setValue(this.dataObjet.PrimerApellidoAsesor +
            ' ' + this.dataObjet.SegundoApellidoAsesor +
            ' ' + this.dataObjet.PrimerNombreAsesor + ' ' + this.dataObjet.SegundoNombreAsesor);
        }
        this.TerminoForm.get('NumeroOficina')?.setValue(this.dataObjet.IdOficina);
        this.TerminoForm.get('NombreOficina')?.setValue(this.dataObjet.DescripcionOficina);
        this.TerminoForm.get('IdOficina')?.setValue(this.dataObjet.IdOficina);
        this.datoOficina = this.dataObjet.IdOficina;
        this.TerminoForm.get('IdProducto')?.setValue(this.dataObjet.IdProducto);
        this.datoProducto = this.dataObjet.IdProducto;
        this.TerminoForm.get('DescripcionProducto')?.setValue(this.dataObjet.DescripcionProducto);
        this.datoNombreProducto = this.dataObjet.DescripcionProducto;
        this.TerminoForm.get('IdEstado')?.setValue(this.dataObjet.IdEstado);
        this.datoCambioEstado = this.dataObjet.IdEstado;
        this.TerminoForm.get('DescripcionEstado')?.setValue(this.dataObjet.DescripcionEstado);
        this.TerminoForm.get('IdProductoCuenta')?.setValue(this.dataObjet.IdProducto);
        this.TerminoForm.get('IdConsecutivo')?.setValue(this.dataObjet.IdConsecutivo);
        this.datoConsecutivo = this.dataObjet.IdConsecutivo;
        this.TerminoForm.get('IdDigito')?.setValue(this.dataObjet.IdDigito);
        this.datoDigito = this.dataObjet.IdDigito;
        this.TerminoForm.get('DescripcionOperacion')?.setValue(this.dataObjet.DescripcionOperacion);
        this.TerminoForm.get('IdOperacion')?.setValue(this.dataObjet.IdOperacion);
        this.TerminoForm.get('NumeroOficinaAsociado')?.setValue(this.dataObjet.IdOficinaAsociado);
        this.TerminoForm.get('NombreOficinaAsociado')?.setValue(this.dataObjet.DescripcionOficinaAsociado);
        this.TerminoForm.get('Clase')?.setValue(this.dataObjet.IdRelacionTipo);
        this.AsesorForm.get('strCodigo')?.setValue(this.dataObjet.IdAsesorExterno);
        this.datoAsesorExterno = +this.dataObjet.IdAsesorExterno;
        this.AsesorForm.get('strNombre')?.setValue(this.dataObjet.PrimerNombreAsesorE + ' ' + this.dataObjet.SegundoNombreAsesoreE +
          ' ' + this.dataObjet.PrimerApellidoAsesorE + ' ' + this.dataObjet.SegundoApellidoAsesorE);

        this.TerminoForm.get('Edad')?.setValue(this.dataObjet.Edad + ' Años');
        this.TerminoForm.get('NroTitulo')?.setValue(this.dataObjet.NroTitulo);
        this.TerminoForm.get('NroTituloAnterior')?.setValue(this.dataObjet.NroTitulo);
        this.TerminoForm.get('DireccionTermino')?.setValue(this.dataObjet.DireccionTermino);
        this.TerminoForm.get('CiudadTermino')?.setValue(this.dataObjet.CiudadTermino);
        this.TerminoForm.get('TelefonoTermino')?.setValue(this.dataObjet.TelefonoTermino);

        // Negociacion

        this.TerminoForm.get('PlazoDias')?.setValue(this.dataObjet.Plazo);
        this.datoPlazo = +this.dataObjet.Plazo;
        this.TerminoForm.get('ValorTotal')?.setValue(this.dataObjet.SaldoInicial);
        this.datoValortitulo = this.dataObjet.SaldoInicial;
        this.TerminoForm.get('DescripcionFrecuenciaPago')?.setValue(this.dataObjet.DescripcionFrecuenciaPago);
        this.TerminoForm.get('IdFrecuenciaPago')?.setValue(this.dataObjet.IdFrecuenciaPago);
        this.TerminoForm.get('IdLiquidacion')?.setValue(this.dataObjet.IdLiquidacion);
        this.datoLiquidacion = +this.dataObjet.IdLiquidacion;
        this.TerminoForm.get('CuentaDestino')?.setValue(this.dataObjet.CuentaDestino);
        this.TerminoForm.get('IdCuentaDestino')?.setValue(this.dataObjet.IdCuentaDestino);
        if (this.dataObjet.PuntosA !== null) {
          this.TerminoService.ObtenerPuntosAdicionales(0).subscribe(
            resultP => {
              this.resultPuntosAdicionales = resultP;
              this.resultPuntosAdicionales.forEach(( elementPuntos  : any) => {
                if (elementPuntos.IdPuntosAdicionales === this.dataObjet.PuntosA.IdPuntosAdicionales) {
                  this.AdicionarPuntosFrom.get('AdicionarPunto')?.setValue(elementPuntos);
                  this.datoPuntosAdicionales = elementPuntos;
                }
              });
            },
            error => {
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          );
        }
        const numberNominal = this.returnFormatNum(this.dataObjet.TasaNominal.toFixed(4));
        this.TerminoForm.get('TasaNominal')?.setValue(numberNominal + "%");
        const numberEfectiva = this.dataObjet.TasaEfectiva.toFixed(4);
        this.TerminoForm.get('TasaEfectiva')?.setValue(numberEfectiva + "%");
        if (this.dataObjet.TasaAdicional !== null) {
          const numberAdicional = this.dataObjet.TasaAdicional.toFixed(4);
          this.TerminoForm.get('TasaAdicional')?.setValue(numberAdicional + "%");
        } else {
          const numberAdicional = 0.0.toFixed(4);
          this.TerminoForm.get('TasaAdicional')?.setValue(numberAdicional + "%");
        }
        this.TerminoForm.get('Tasa')?.setValue(this.dataObjet.Tasa);

        this.datoTasaEfectiva = this.returnFormatNumSeis(this.dataObjet.TasaEfectiva);
        this.datoAutorizacionTasa = this.returnFormatNumSeis(this.dataObjet.TasaEfectiva);
        // Saldos
        if (this.dataObjet.RetencionFuentePeriodo === null) {
          this.TerminoForm.get('RetencionFuentePeriodo')?.setValue(0);
        } else {
          this.TerminoForm.get('RetencionFuentePeriodo')?.setValue(this.dataObjet.RetencionFuentePeriodo);
        }
        this.TerminoForm.get('InteresCausado')?.setValue(this.dataObjet.InteresCausado);
        this.TerminoForm.get('Canje')?.setValue(this.dataObjet.Canje);
        this.TerminoForm.get('InteresxPagar')?.setValue(this.dataObjet.InteresxPagar);
        this.TerminoForm.get('Efectivo')?.setValue(this.dataObjet.Efectivo);
        this.TerminoForm.get('InteresPagado')?.setValue(this.dataObjet.InteresPagado);
        this.TerminoForm.get('SaldoTotal')?.setValue(this.dataObjet.Canje + this.dataObjet.Efectivo);

        // Benefeciarios   
        if (this.dataObjet.BeneficiarioTermino.length !== 0) {
          this.dataObjetBeneficiarios = this.dataObjet.BeneficiarioTermino;
          this.dataObjetBeneficiarios = this.dataObjetBeneficiarios.sort((a, b) => {
            const A = new Date(a.FechaMatricula).getTime();
            const B = new Date(b.FechaMatricula).getTime();
            if (A > B)
              return -1;
            if (A < B)
              return 1;
            return 0;
          });
          this.dataObjetBeneficiarios.forEach(elementBeneficiarios => {
            elementBeneficiarios.Accion = "DB";
            this.resultParentesco.forEach(( elementParentesco : any) => {
              if (elementBeneficiarios.IdParentesco === elementParentesco.Clase) {
                elementBeneficiarios.DatosParentesco = elementParentesco;
              }
            });
          });
        } else {
          this.dataObjetBeneficiarios = [];
        }

        // Titulares
        if (this.dataObjet.Titulares.length !== 0) {
          this.dataObjetTitulares = this.dataObjet.Titulares;
          this.dataObjetTitulares.forEach(( x: any) => x.Accion = "DB");
          this.dataObjetTitulares = this.dataObjetTitulares.sort((a, b) => {
            const A = new Date(a.FechaMatricula).getTime();
            const B = new Date(b.FechaMatricula).getTime();
            if (A > B)
              return -1;
            if (A < B)
              return 1;
            return 0;
          });
        } else {
          this.dataObjetTitulares = [];
        }

        // Renovacion
        if (this.dataObjet.Renovaciones.length !== 0) {
          this.dataObjetRenovacion = this.dataObjet.Renovaciones;
        } else {
          this.dataObjetRenovacion = undefined;
        }

        // 
        if (this.dataObjet.SesionTitulo.length !== 0) {
          this.dataObjetCesionTitulo = this.dataObjet.SesionTitulo;
          this.dataObjetCesionTitulo = this.dataObjetCesionTitulo.sort((a, b) => {
            const A = new Date(a.FechaMatricula).getTime();
            const B = new Date(b.FechaMatricula).getTime();
            if (A > B)
              return -1;
            if (A < B)
              return 1;
            return 0;
          });
          this.dataObjetCesionTitulo.forEach(( x: any) => x.Accion = "DB");

        } else {
          this.dataObjetCesionTitulo = [];
        }

        // Reciprocidad
        if (this.dataObjet.Reciprocidad.length !== 0) {
          this.dataObjetReciprocidad = this.dataObjet.Reciprocidad;
        } else {
          this.dataObjetReciprocidad = undefined;
        }

        // Historial de Rcieprocidad 
        if (this.dataObjet.ReciprocidadR.length !== 0) {
          this.dataObjetReciprocidadR = this.dataObjet.ReciprocidadR;
        } else {
          this.dataObjetReciprocidadR = [];
        }


        // Fechas  
        this.TerminoForm.get('FechaApertura')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaApertura, 'yyyy/MM/dd  HH:mm:ss')
        );
        this.datoFechaApertura = this.dataObjet.FechaApertura;
        this.TerminoForm.get('FechaVencimiento')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaVencimiento, 'yyyy/MM/dd  HH:mm:ss')
        );
        if (this.dataObjet.FechaUltimaLiquidacion != null) {
          this.TerminoForm.get('FechaUltliqIntereses')?.setValue(
            new DatePipe('en-CO').transform(this.dataObjet.FechaUltimaLiquidacion, 'yyyy/MM/dd  HH:mm:ss')
          );
        }
        this.TerminoForm.get('FechaProxliqIntereses')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaProLiquidacion, 'yyyy/MM/dd  HH:mm:ss')
        );
        this.TerminoForm.get('FechaUltimaTrans')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaUltimaTrans, 'yyyy/MM/dd  HH:mm:ss')
        );
        this.TerminoForm.get('FechaCancelacion')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaCancelacion, 'yyyy/MM/dd  HH:mm:ss')
        );
        this.datoFechaRenovacion = (new DatePipe('en-CO').transform(this.dataObjet.FechaRenovacion, 'yyyy/MM/dd  HH:mm:ss')
        );


        this.ObtenerHistorial();
        // Datos para impresion 

        this.TerminoService.ConvertNumeroALetras(Number(this.TerminoForm.get('ValorTotal')?.value)).subscribe(( x: any) => {
          this.itemsSend.ValorLetras = x;
        }, err => {
          const errorMessage = <any>err;
          console.log(errorMessage);
        })

        this.itemsSend.Cuenta = this.TerminoForm.get('Cuenta')?.value;
        this.itemsSend.NombreApellidos = this.TerminoForm.get('Nombre')?.value;
        this.itemsSend.Cedula = this.TerminoForm.get('NumeroDocumento')?.value;
        this.itemsSend.Telefono = this.TerminoForm.get('TelefonoTermino')?.value;
        this.itemsSend.Direccion = this.TerminoForm.get('DireccionTermino')?.value;
        this.itemsSend.Ciudad = this.TerminoForm.get('CiudadTermino')?.value;
        this.itemsSend.Valor = this.TerminoForm.get('ValorTotal')?.value;
        this.itemsSend.FechaApertura = this.TerminoForm.get('FechaApertura')?.value;
        this.itemsSend.FechaVecimiento = this.TerminoForm.get('FechaVencimiento')?.value;
        this.itemsSend.PlazoDias = this.TerminoForm.get('PlazoDias')?.value;
        this.itemsSend.Modalidad = 'Vencido'; // Pendiente Por definir
        this.itemsSend.TNominal = this.TerminoForm.get('TasaNominal')?.value;
        this.itemsSend.TEfectiva = this.TerminoForm.get('TasaEfectiva')?.value;
        this.itemsSend.FrecuenciaPago = this.TerminoForm.get('DescripcionFrecuenciaPago')?.value;


      } else {
        this.dataObjet = result;
        // Encabezado 
        this.TerminoForm.get('IdCuenta')?.setValue(this.dataObjet.IdCuenta);
        this.TerminoForm.get('Cuenta')?.setValue(this.dataObjet.Cuenta);
        this.TerminoForm.get('IdUsuarioSGF')?.setValue(this.dataUser.IdUsuarioSGF);
        this.TerminoForm.get('LngTercero')?.setValue(this.dataObjet.LngTercero);
        this.TerminoForm.get('TipoDocumento')?.setValue(this.dataObjet.TipoDocumento);
        this.TerminoForm.get('NumeroDocumento')?.setValue(this.dataObjet.NumeroDocumento);
        this.TerminoForm.get('Nombre')?.setValue(this.dataObjet.PrimerApellido + ' ' + this.dataObjet.SegundoApellido +
          ' ' + this.dataObjet.PrimerNombre + ' ' + this.dataObjet.SegundoNombre);
        this.TerminoForm.get('IdAsesor')?.setValue(this.dataObjet.IdAsesor);
        if (this.TerminoForm.get('IdAsesor')?.value === 2) {
          this.TerminoForm.get('NombreAsesor')?.setValue('Coogranada');
        } else {
          this.TerminoForm.get('NombreAsesor')?.setValue(this.dataObjet.PrimerApellidoAsesor +
            ' ' + this.dataObjet.SegundoApellidoAsesor +
            ' ' + this.dataObjet.PrimerNombreAsesor + ' ' + this.dataObjet.SegundoNombreAsesor);
        }
        this.TerminoForm.get('NumeroOficina')?.setValue(this.dataObjet.IdOficina);
        this.TerminoForm.get('NombreOficina')?.setValue(this.dataObjet.DescripcionOficina);
        this.TerminoForm.get('IdOficina')?.setValue(this.dataObjet.IdOficina);
        this.datoOficina = this.dataObjet.IdOficina;
        this.TerminoForm.get('IdProducto')?.setValue(this.dataObjet.IdProducto);
        this.datoProducto = this.dataObjet.IdProducto;
        this.TerminoForm.get('DescripcionProducto')?.setValue(this.dataObjet.DescripcionProducto);
        this.datoNombreProducto = this.dataObjet.DescripcionProducto;
        this.TerminoForm.get('IdEstado')?.setValue(this.dataObjet.IdEstado);
        this.datoCambioEstado = this.dataObjet.IdEstado;
        this.TerminoForm.get('DescripcionEstado')?.setValue(this.dataObjet.DescripcionEstado);
        this.TerminoForm.get('IdProductoCuenta')?.setValue(this.dataObjet.IdProducto);
        this.TerminoForm.get('IdConsecutivo')?.setValue(this.dataObjet.IdConsecutivo);
        this.datoConsecutivo = this.dataObjet.IdConsecutivo;
        this.TerminoForm.get('IdDigito')?.setValue(this.dataObjet.IdDigito);
        this.datoDigito = this.dataObjet.IdDigito;
        this.TerminoForm.get('DescripcionOperacion')?.setValue(this.dataObjet.DescripcionOperacion);
        this.TerminoForm.get('IdOperacion')?.setValue(this.dataObjet.IdOperacion);
        this.TerminoForm.get('NumeroOficinaAsociado')?.setValue(this.dataObjet.IdOficinaAsociado);
        this.TerminoForm.get('NombreOficinaAsociado')?.setValue(this.dataObjet.DescripcionOficinaAsociado);
        this.TerminoForm.get('Clase')?.setValue(this.dataObjet.IdRelacionTipo);
        this.AsesorForm.get('strCodigo')?.setValue(this.dataObjet.IdAsesorExterno);
        this.datoAsesorExterno = +this.dataObjet.IdAsesorExterno;
        this.AsesorForm.get('strNombre')?.setValue(this.dataObjet.PrimerNombreAsesorE + ' ' + this.dataObjet.SegundoNombreAsesoreE +
          ' ' + this.dataObjet.PrimerApellidoAsesorE + ' ' + this.dataObjet.SegundoApellidoAsesorE);

        this.TerminoForm.get('Edad')?.setValue(this.dataObjet.Edad + ' Años');
        this.TerminoForm.get('NroTitulo')?.setValue(this.dataObjet.NroTitulo);
        this.TerminoForm.get('NroTituloAnterior')?.setValue(this.dataObjet.NroTitulo);
        this.TerminoForm.get('DireccionTermino')?.setValue(this.dataObjet.DireccionTermino);
        this.TerminoForm.get('CiudadTermino')?.setValue(this.dataObjet.CiudadTermino);
        this.TerminoForm.get('TelefonoTermino')?.setValue(this.dataObjet.TelefonoTermino);

        // Negociacion

        this.TerminoForm.get('PlazoDias')?.setValue(this.dataObjet.Plazo);
        this.datoPlazo = +this.dataObjet.Plazo;
        this.TerminoForm.get('ValorTotal')?.setValue(this.dataObjet.SaldoInicial);
        this.datoValortitulo = this.dataObjet.SaldoInicial;
        this.TerminoForm.get('DescripcionFrecuenciaPago')?.setValue(this.dataObjet.DescripcionFrecuenciaPago);
        this.TerminoForm.get('IdFrecuenciaPago')?.setValue(this.dataObjet.IdFrecuenciaPago);
        this.TerminoForm.get('IdLiquidacion')?.setValue(this.dataObjet.IdLiquidacion);
        this.datoLiquidacion = +this.dataObjet.IdLiquidacion;
        this.TerminoForm.get('CuentaDestino')?.setValue(this.dataObjet.CuentaDestino);
        this.TerminoForm.get('IdCuentaDestino')?.setValue(this.dataObjet.IdCuentaDestino);
        if (this.dataObjet.PuntosA !== null) {
          this.TerminoService.ObtenerPuntosAdicionales(0).subscribe(
            resultP => {
              this.resultPuntosAdicionales = resultP;
              this.resultPuntosAdicionales.forEach(( elementPuntos  : any) => {
                if (elementPuntos.IdPuntosAdicionales === this.dataObjet.PuntosA.IdPuntosAdicionales) {
                  this.AdicionarPuntosFrom.get('AdicionarPunto')?.setValue(elementPuntos);
                  this.datoPuntosAdicionales = elementPuntos;
                }
              });
            },
            error => {
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          );
        }
        const numberNominal = this.returnFormatNum(this.dataObjet.TasaNominal.toFixed(4));
        this.TerminoForm.get('TasaNominal')?.setValue(numberNominal + "%");
        const numberEfectiva = this.dataObjet.TasaEfectiva.toFixed(4);
        this.TerminoForm.get('TasaEfectiva')?.setValue(numberEfectiva + "%");
        if (this.dataObjet.TasaAdicional !== null) {
          const numberAdicional = this.dataObjet.TasaAdicional.toFixed(4);
          this.TerminoForm.get('TasaAdicional')?.setValue(numberAdicional + "%");
        } else {
          const numberAdicional = 0.0.toFixed(4);
          this.TerminoForm.get('TasaAdicional')?.setValue(numberAdicional + "%");
        }
        this.TerminoForm.get('Tasa')?.setValue(this.dataObjet.Tasa);

        this.datoTasaEfectiva = this.returnFormatNumSeis(this.dataObjet.TasaEfectiva);
        this.datoAutorizacionTasa = this.returnFormatNumSeis(this.dataObjet.TasaEfectiva);

        // Saldos     
        if (this.dataObjet.RetencionFuentePeriodo === null) {
          this.TerminoForm.get('RetencionFuentePeriodo')?.setValue(0);
        } else {
          this.TerminoForm.get('RetencionFuentePeriodo')?.setValue(this.dataObjet.RetencionFuentePeriodo);
        }
        this.TerminoForm.get('InteresCausado')?.setValue(this.dataObjet.InteresCausado);
        this.TerminoForm.get('Canje')?.setValue(this.dataObjet.Canje);
        this.TerminoForm.get('InteresxPagar')?.setValue(this.dataObjet.InteresxPagar);
        this.TerminoForm.get('Efectivo')?.setValue(this.dataObjet.Efectivo);
        this.TerminoForm.get('InteresPagado')?.setValue(this.dataObjet.InteresPagado);
        this.TerminoForm.get('SaldoTotal')?.setValue(this.dataObjet.Canje + this.dataObjet.Efectivo);

        // Benefeciarios   
        if (this.dataObjet.BeneficiarioTermino.length !== 0) {
          this.dataObjetBeneficiarios = this.dataObjet.BeneficiarioTermino;
         this.dataObjetBeneficiarios = this.dataObjetBeneficiarios.sort((a, b) => {
            const A = new Date(a.FechaMatricula).getTime();
            const B = new Date(b.FechaMatricula).getTime();
            if (A > B)
              return -1;
            if (A < B)
              return 1;
            return 0;
          });
          this.dataObjetBeneficiarios.forEach(elementBeneficiarios => {
            elementBeneficiarios.Accion = "DB";
            this.resultParentesco.forEach(( elementParentesco : any) => {
              if (elementBeneficiarios.IdParentesco === elementParentesco.Clase) {
                elementBeneficiarios.DatosParentesco = elementParentesco;
              }
            });
          });
        } else {
          this.dataObjetBeneficiarios = [];
        }

        // Titulares
        if (this.dataObjet.Titulares.length !== 0) {
          this.dataObjetTitulares = this.dataObjet.Titulares;
          this.dataObjetTitulares.forEach(( x: any) => x.Accion = "DB");
          this.dataObjetTitulares = this.dataObjetTitulares.sort((a, b) => {
            const A = new Date(a.FechaMatricula).getTime();
            const B = new Date(b.FechaMatricula).getTime();
            if (A > B)
              return -1;
            if (A < B)
              return 1;
            return 0;
          });
        } else {
          this.dataObjetTitulares = [];
        }

        // Renovacion
        if (this.dataObjet.Renovaciones.length !== 0) {
          this.dataObjetRenovacion = this.dataObjet.Renovaciones;
        } else {
          this.dataObjetRenovacion = undefined;
        }

        // 
        if (this.dataObjet.SesionTitulo.length !== 0) {
          this.dataObjetCesionTitulo = this.dataObjet.SesionTitulo;
          this.dataObjetCesionTitulo = this.dataObjetCesionTitulo.sort((a, b) => {
            const A = new Date(a.FechaMatricula).getTime();
            const B = new Date(b.FechaMatricula).getTime();
            if (A > B)
              return -1;
            if (A < B)
              return 1;
            return 0;
          });
          this.dataObjetCesionTitulo.forEach(( x: any) => x.Accion = "DB");

        } else {
          this.dataObjetCesionTitulo = [];
        }

        // Reciprocidad
        if (this.dataObjet.Reciprocidad.length !== 0) {
          this.dataObjetReciprocidad = this.dataObjet.Reciprocidad;
          this.dataObjetReciprocidad.forEach(( x: any) => x.FechaRetiro = null);
        } else
          this.dataObjetReciprocidad = undefined;

        // Historial de Rcieprocidad 
        if (this.dataObjet.ReciprocidadR.length !== 0)
          this.dataObjetReciprocidadR = this.dataObjet.ReciprocidadR;
        else
          this.dataObjetReciprocidadR = [];

        // Fechas  
        this.TerminoForm.get('FechaApertura')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaApertura, 'yyyy/MM/dd  HH:mm:ss')
        );
        this.datoFechaApertura = this.dataObjet.FechaApertura;
        this.TerminoForm.get('FechaVencimiento')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaVencimiento, 'yyyy/MM/dd  HH:mm:ss')
        );
        if (this.dataObjet.FechaUltimaLiquidacion != null) {
          this.TerminoForm.get('FechaUltliqIntereses')?.setValue(
            new DatePipe('en-CO').transform(this.dataObjet.FechaUltimaLiquidacion, 'yyyy/MM/dd  HH:mm:ss')
          );
        }
        this.TerminoForm.get('FechaProxliqIntereses')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaProLiquidacion, 'yyyy/MM/dd  HH:mm:ss')
        );
        this.TerminoForm.get('FechaUltimaTrans')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaUltimaTrans, 'yyyy/MM/dd  HH:mm:ss')
        );
        this.TerminoForm.get('FechaCancelacion')?.setValue(
          new DatePipe('en-CO').transform(this.dataObjet.FechaCancelacion, 'yyyy/MM/dd  HH:mm:ss')
        );

        this.datoFechaRenovacion = (new DatePipe('en-CO').transform(this.dataObjet.FechaRenovacion, 'yyyy/MM/dd  HH:mm:ss')
        );

        this.ObtenerHistorial();
        // Datos para impresion 

        this.TerminoService.ConvertNumeroALetras(Number(this.TerminoForm.get('ValorTotal')?.value)).subscribe(( x: any) => {
          this.itemsSend.ValorLetras = x;
        }, err => {
          const errorMessage = <any>err;
          console.log(errorMessage);
        })

        this.itemsSend.Cuenta = this.TerminoForm.get('Cuenta')?.value;
        this.itemsSend.NombreApellidos = this.TerminoForm.get('Nombre')?.value;
        this.itemsSend.Cedula = this.TerminoForm.get('NumeroDocumento')?.value;
        this.itemsSend.Telefono = this.TerminoForm.get('TelefonoTermino')?.value;
        this.itemsSend.Direccion = this.TerminoForm.get('DireccionTermino')?.value;
        this.itemsSend.Ciudad = this.TerminoForm.get('CiudadTermino')?.value;
        this.itemsSend.Valor = this.TerminoForm.get('ValorTotal')?.value;
        this.itemsSend.FechaApertura = this.TerminoForm.get('FechaApertura')?.value;
        this.itemsSend.FechaVecimiento = this.TerminoForm.get('FechaVencimiento')?.value;
        this.itemsSend.PlazoDias = this.TerminoForm.get('PlazoDias')?.value;
        this.itemsSend.Modalidad = 'Vencido'; // Pendiente Por definir
        this.itemsSend.TNominal = this.TerminoForm.get('TasaNominal')?.value;
        this.itemsSend.TEfectiva = this.TerminoForm.get('TasaEfectiva')?.value;
        this.itemsSend.FrecuenciaPago = this.TerminoForm.get('DescripcionFrecuenciaPago')?.value;


      }
    }
  }

  private returnFormatNumSeis(num : string): string {
    num = num.toString();
    num = num.slice(0, (num.indexOf('.')) + 7);
    return num;
  }
  BotonBuscarTermino() {
    if (this.TerminoForm.get('BuscarDocumento')?.value !== null
      && this.TerminoForm.get('BuscarDocumento')?.value !== undefined
      && this.TerminoForm.get('BuscarDocumento')?.value !== '') {
      this.BuscarCuentaPorAsociado();
    } else if (this.TerminoForm.get('BuscarNombre')?.value !== null
      && this.TerminoForm.get('BuscarNombre')?.value !== undefined
      && this.TerminoForm.get('BuscarNombre')?.value !== '') {
      this.BuscarCuentaPorAsociado();
    }
  }
  BuscarCuentaPorAsociado() {
    this.loading = true;
    this.TerminoService.BuscarPorAsociado(this.TerminoForm.value).subscribe(
      result => {
        this.loading = false;
        this.TerminoForm.get('BuscarNombre')?.reset();
        if (result.length > 0) {
          this.dataAsociados = result;
          this.TerminoForm.get('BuscarNombre')?.reset();
          this.TerminoForm.get('BuscarDocumento')?.reset();
          this.ModalBuscarAsociados.nativeElement.click();
          //this.bloquearCuenta = true;
          this.btnCambiarEstado = true;
          this.btnActualizar = true;
          this.btnActualizarTitulares = true;
          this.btnOpcionesActualizarTitulares = true;
          this.btnGuardar = true;
        } else if (result.length === 0) {
          this.notif.onWarning('Advertencia', 'No se encontró registro.');
          this.ClearFrom();
          this.generalesService.Autofocus('SelectBuscar');
        } else if (result.length = 1) {
          this.TerminoForm.get('BuscarDocumento')?.reset();
          this.ClearFrom();
          this.MapearDatosCuenta(result);
          this.bloquearCuenta = false;
          this.bloquearBuscar = false;
          this.btnCambiarEstado = true;
          this.btnActualizar = true;
          this.btnActualizarTitulares = true;
          this.btnOpcionesActualizarTitulares = true;
          this.btnGuardar = true;
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  BuscarDatosCuenta(IdOficina : string, IdProductoCuenta : string, IdConsecutivo : string, IdDigito : string) {
    this.TerminoService.BuscarCuenta
      ({ 'IdOficina': IdOficina, 'IdProductoCuenta': IdProductoCuenta, 'IdConsecutivo': IdConsecutivo, 'IdDigito': IdDigito }).subscribe(
        result => {
          this.bloquearCuenta = true;
          this.MapearDatosCuenta(result);
          this.bloquearBuscar = false;
          this.btnActualizar = true;
          this.btnActualizarTitulares = true;
          this.btnOpcionesActualizarTitulares = true;
          this.btnGuardar = true;

          if (this.TerminoOperacionForm.get('Codigo')?.value === '10' || this.TerminoOperacionForm.get('Codigo')?.value === '40') {
            //validar cuando llega cero 
            if (this.TerminoForm.get('TasaAdicional')?.value != '0.0000%') {
              this.ImpresionCapitalizacionPDF();
            }
          }

          this.TerminoOperacionForm.get('Codigo')?.reset();
        },
        error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
  }
  MapearDatosUsuario() {
    let data = localStorage.getItem('Data')
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    this.TerminoForm.get('NombreOficina')?.setValue(this.dataUser.Oficina);
    this.TerminoForm.get('NumeroOficina')?.setValue(this.dataUser.NumeroOficina);
    this.TerminoForm.get('IdAsesor')?.setValue(this.dataUser.IdAsesor);
    this.TerminoForm.get('NombreAsesor')?.setValue(this.dataUser.Nombre);

  }
  Encabezado() {
    this.TerminoService.Encabezado().subscribe(
      result => {
        result.forEach(( element : any) => {
          if (element.DescripcionEstado !== null) {
            this.TerminoForm.get('DescripcionEstado')?.setValue(result[0].DescripcionEstado);
          }
        });

      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  MapearDatosAsesor(datos : any) {
    if (datos.length >= 1) {
      this.TerminoForm.get('IdAsesor')?.setValue(datos[0].IdAsesor);
      this.TerminoForm.get('NombreAsesor')?.setValue(datos[0].Nombre);
      this.TerminoForm.get('DocumentoAsesor')?.setValue(datos[0].Documento);
    } else {
      this.TerminoForm.get('IdAsesor')?.setValue(datos.IdAsesor);
      this.TerminoForm.get('NombreAsesor')?.setValue(datos.Nombre);
      this.TerminoForm.get('DocumentoAsesor')?.setValue(datos.Documento);
    }
  }
  BuscarAsociado() {
    if ((this.TerminoForm.get('NumeroDocumento')?.value == null || this.TerminoForm.get('NumeroDocumento')?.value.trim() == "") && (this.TerminoForm.get('Nombre')?.value == null || this.TerminoForm.get('Nombre')?.value.trim() == "")) {
      console.log(this.TerminoForm.get('NumeroDocumento')?.value ,this.TerminoForm.get('Nombre')?.value)
      return;
    }
      
    this.TerminoService.BuscarAsesor(this.TerminoForm.get('IdAsesor')?.value, '*').subscribe(
      result => {
        this.loading = false;
        if (result.length === 1) {
          this.MapearDatosAsesor(result);
          this.Asociado();
        }
      });
  }
  Asociado() {
    if (this.TerminoOperacionForm.get('Codigo')?.value === '10') {
      let Documento = '*';
      let Nombre = '*';
      if (this.TerminoForm.get('NumeroDocumento')?.value !== null
        && this.TerminoForm.get('NumeroDocumento')?.value !== undefined
        && this.TerminoForm.get('NumeroDocumento')?.value !== ''
        || this.TerminoForm.get('Nombre')?.value !== null
        && this.TerminoForm.get('Nombre')?.value !== undefined
        && this.TerminoForm.get('Nombre')?.value !== '') {

        if (this.TerminoForm.get('NumeroDocumento')?.value !== null
          && this.TerminoForm.get('NumeroDocumento')?.value !== undefined
          && this.TerminoForm.get('NumeroDocumento')?.value !== '') {
          Documento = this.TerminoForm.get('NumeroDocumento')?.value;
        } else if (this.TerminoForm.get('Nombre')?.value !== null
          && this.TerminoForm.get('Nombre')?.value !== undefined
          && this.TerminoForm.get('Nombre')?.value !== '') {
          Nombre = this.TerminoForm.get('Nombre')?.value;
        }
        if (this.TerminoForm.get('DocumentoAsesor')?.value !== this.TerminoForm.get('NumeroDocumento')?.value) {

          this.loading = true;
          this.TerminoService.BuscarAsociado(Documento, Nombre).subscribe(
            result => {
              this.loading = false;
              if (result.length === 0) {
                this.notif.onWarning('Advertencia', 'No se encontró el asociado.');
                this.TerminoForm.get('NumeroDocumento')?.reset();
                this.TerminoForm.get('Nombre')?.reset();
              } else if (result.length === 1) {
                if (this.TerminoForm.get('DocumentoAsesor')?.value !== result[0].NumeroDocumento) {
                  this.BuscarAsociadoModal(result[0].NumeroDocumento);
                  this.bloquearDatosTitulares = null;
                  this.bloquearProducto = null;
                  this.MostrasAlertaAsociado = false;
                  this.generalesService.Autofocus('SelectProducto');
                } else {
                  this.notif.onWarning('Advertencia', 'La apertura debe ser de diferente titular.');
                  this.TerminoForm.get('NumeroDocumento')?.reset();
                  this.bloquearProducto = false;
                }
              } else if (result.length > 1) {
                this.resultAsociados = result;
                this.ModalAsociados.nativeElement.click();
                this.bloquearDatosTitulares = null;
                this.bloquearProducto = null;
              } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                if (result.Mensaje === 'Gerencia de desarrollo.') {
                  swal.fire({
                    title: '<strong>! Advertencia ¡</strong>',
                    text: '',
                    icon: 'error',
                    animation: false,
                    html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                      + result.Mensaje + '.',
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
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  });
                } else {
                  this.notif.onWarning('Advertencia', result.Mensaje);
                  this.ClearFrom();
                  this.MapearDatosUsuario();
                  this.Encabezado();
                  this.OperacionPermitida();
                  this.btnGuardar = false;
                  this.bloquearAsociado = null;
                  this.bloquearBuscar = false;
                  this.bloquear = false;
                }
                this.ClearFrom();
                this.MapearDatosUsuario();
                this.Encabezado();
                this.OperacionPermitida();
                this.btnGuardar = false;
                this.bloquearAsociado = null;
                this.bloquearBuscar = false;
                this.bloquearCuenta = false;
              }
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          );
        } else {
          this.notif.onWarning('Advertencia', 'La apertura debe ser de diferente titular.');
          this.TerminoForm.get('NumeroDocumento')?.reset();
          this.bloquearProducto = false;
        }
      }
    } else if (this.TerminoOperacionForm.get('Codigo')?.value === '40') {
      let Documento = '*';
      let Nombre = '*';
      if (this.TerminoForm.get('NumeroDocumento')?.value !== null
        && this.TerminoForm.get('NumeroDocumento')?.value !== undefined
        && this.TerminoForm.get('NumeroDocumento')?.value !== ''
        || this.TerminoForm.get('Nombre')?.value !== null
        && this.TerminoForm.get('Nombre')?.value !== undefined
        && this.TerminoForm.get('Nombre')?.value !== '') {

        if (this.TerminoForm.get('NumeroDocumento')?.value !== null
          && this.TerminoForm.get('NumeroDocumento')?.value !== undefined
          && this.TerminoForm.get('NumeroDocumento')?.value !== '') {
          Documento = this.TerminoForm.get('NumeroDocumento')?.value;
        } else if (this.TerminoForm.get('Nombre')?.value !== null
          && this.TerminoForm.get('Nombre')?.value !== undefined
          && this.TerminoForm.get('Nombre')?.value !== '') {
          Nombre = this.TerminoForm.get('Nombre')?.value;
        }     
          this.loading = true;
          this.TerminoService.BuscarAsociado(Documento, Nombre).subscribe(
            result => {
              this.loading = false;
              if (result.length === 0) {
                this.notif.onWarning('Advertencia', 'No se encontró el asociado.');
                this.TerminoForm.get('NumeroDocumento')?.reset();
                this.TerminoForm.get('Nombre')?.reset();
              } else if (result.length === 1) {
                if (this.TerminoForm.get('DocumentoAsesor')?.value === result[0].NumeroDocumento) {
                  this.TerminoForm.get('NumeroDocumento')?.setValue(result[0].NumeroDocumento);
                  this.TerminoForm.get('Nombre')?.setValue(result[0].PrimerApellido + ' ' +
                    result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
                  this.TerminoForm.get('NumeroOficinaAsociado')?.setValue(result[0].IdOficina);
                  this.TerminoForm.get('NombreOficinaAsociado')?.setValue(result[0].NombreOficina);
                  this.TerminoForm.get('Clase')?.setValue(result[0].IdRelacionTipo);
                  this.TerminoForm.get('LngTercero')?.setValue(result[0].lngTercero);
                  this.TerminoForm.get('Edad')?.setValue(result[0].Edad);
                  this.TerminoForm.get('IdTipoDocumento')?.setValue(result[0].TipoDocumento);
                  this.bloquearDatosTitulares = null;
                  this.bloquearProducto = null;
                  this.generalesService.Autofocus('SelectProducto');
                  
                } else {
                  this.notif.onWarning('Advertencia', 'La apertura debe ser del mismo titular.');
                  this.TerminoForm.get('NumeroDocumento')?.reset();
                }
           
              } else if (result.length > 1) {
                this.resultAsociados = result;
                this.ModalAsociados.nativeElement.click();
                this.bloquearDatosTitulares = null;
                this.bloquearProducto = null;
              } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                if (result.Mensaje === 'Gerencia de desarrollo.') {
                  swal.fire({
                    title: '<strong>! Advertencia ¡</strong>',
                    text: '',
                    icon: 'error',
                    animation: false,
                    html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                      + result.Mensaje + '.',
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
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  });
                } else {
                  this.notif.onWarning('Advertencia', result.Mensaje);
                  this.ClearFrom();
                  this.MapearDatosUsuario();
                  this.Encabezado();
                  this.OperacionPermitida();
                  this.btnGuardar = false;
                  this.bloquearAsociado = null;
                  this.bloquearBuscar = false;
                  this.bloquearCuenta = false;
                }
                this.ClearFrom();
                this.MapearDatosUsuario();
                this.Encabezado();
                this.OperacionPermitida();
                this.btnGuardar = false;
                this.bloquearAsociado = null;
                this.bloquearBuscar = false;
                this.bloquearCuenta = false;
              }
            },
            error => {
              this.loading = false;
              const errorMessage = <any>error;
              this.notif.onDanger('Error', errorMessage);
              console.log(errorMessage);
            }
          );
        
      }
    }
  }
  BuscarAsociadoModal(Documento = '*') {
    let Nombre = '*';
    if (this.TerminoForm.get('NumeroDocumento')?.value !== null
      && this.TerminoForm.get('NumeroDocumento')?.value !== undefined
      && this.TerminoForm.get('NumeroDocumento')?.value !== ''
    ) {
      this.TerminoForm.get('Nombre')?.setValue('');
      Documento = this.TerminoForm.get('NumeroDocumento')?.value;
    } else if (this.TerminoForm.get('Nombre')?.value !== null
      && this.TerminoForm.get('Nombre')?.value !== undefined
      && this.TerminoForm.get('Nombre')?.value !== ''
    ) {
      Nombre = this.TerminoForm.get('Nombre')?.value;
    }
    this.loading = true;
    this.TerminoService.BuscarAsociado(Documento, Nombre).subscribe(
      result => {
        this.loading = false;
        this.dataObjet = undefined;
        if (result.length === 0) {
          this.notif.onWarning('Advertencia', 'No se encontró el asociado.');
          this.TerminoForm.get('NumeroDocumento')?.reset();
          this.TerminoForm.get('Nombre')?.reset();
          this.btnGuardar = false;
        } else if (result.length === 1) {
          if (this.TerminoOperacionForm.get('Codigo')?.value === '10') {
            if (this.TerminoForm.get('DocumentoAsesor')?.value === result[0].NumeroDocumento) 
            {
              this.notif.onWarning('Advertencia', 'La apertura debe ser de diferente titular.');
              this.TerminoForm.get('NumeroDocumento')?.reset(); 
              this.bloquearProducto = false;
            }else {
              this.TerminoForm.get('NumeroDocumento')?.setValue(result[0].NumeroDocumento);
              this.TerminoForm.get('Nombre')?.setValue(result[0].PrimerApellido + ' ' +
              result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
              this.TerminoForm.get('NumeroOficinaAsociado')?.setValue(result[0].IdOficina);
              this.TerminoForm.get('NombreOficinaAsociado')?.setValue(result[0].NombreOficina);
              this.TerminoForm.get('Clase')?.setValue(result[0].IdRelacionTipo);
              this.TerminoForm.get('LngTercero')?.setValue(result[0].lngTercero);
              this.TerminoForm.get('Edad')?.setValue(result[0].Edad);
              this.TerminoForm.get('IdTipoDocumento')?.setValue(result[0].TipoDocumento);
              this.MostrasAlertaAsociado = false;
            }        
          } else if (this.TerminoOperacionForm.get('Codigo')?.value === '40') {
            if (this.TerminoForm.get('DocumentoAsesor')?.value === result[0].NumeroDocumento) {
              this.TerminoForm.get('NumeroDocumento')?.setValue(result[0].NumeroDocumento);
              this.TerminoForm.get('Nombre')?.setValue(result[0].PrimerApellido + ' ' +
                result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
              this.TerminoForm.get('NumeroOficinaAsociado')?.setValue(result[0].IdOficina);
              this.TerminoForm.get('NombreOficinaAsociado')?.setValue(result[0].NombreOficina);
              this.TerminoForm.get('Clase')?.setValue(result[0].IdRelacionTipo);
              this.TerminoForm.get('LngTercero')?.setValue(result[0].lngTercero);
              this.TerminoForm.get('Edad')?.setValue(result[0].Edad);
              this.TerminoForm.get('IdTipoDocumento')?.setValue(result[0].TipoDocumento);
              this.MostrasAlertaAsociado = false;
            } else {
              this.notif.onWarning('Advertencia', 'La apertura debe ser del mismo titular.');
              this.TerminoForm.get('NumeroDocumento')?.reset();
            }        
          }          
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
            this.ClearFrom();
            this.MapearDatosUsuario();
            this.Encabezado();
            this.OperacionPermitida();
            this.btnGuardar = false;
            this.bloquearAsociado = null;
            this.bloquearBuscar = false;
            this.bloquearCuenta = false;
          } else {
            this.notif.onWarning('Advertencia', result.Mensaje);
            this.ClearFrom();
            this.MapearDatosUsuario();
            this.Encabezado();
            this.OperacionPermitida();
            this.btnGuardar = false;
            this.bloquearAsociado = null;
            this.bloquearBuscar = false;
            this.bloquearCuenta = false;
          }
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  Producto() {
    if (this.TerminoForm.get('IdProducto')?.value !== null
      && this.TerminoForm.get('IdProducto')?.value !== undefined
      && this.TerminoForm.get('IdProducto')?.value !== '') {
      this.oTitulo = false;
      this.CondicionesProducto();
    }
  }
  CondicionesProducto() {
    this.TerminoForm.get('IdRelacionTipo')?.setValue(this.TerminoForm.get('Clase')?.value);
    this.TerminoService.CondicionesProducto(this.TerminoForm.value).subscribe(
      result => {
        if (result !== null) {
          this.ArrayCondiciones = result;
          this.BuscarProducto();
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          this.notif.onWarning('Advertencia', result.Mensaje);
          this.TerminoForm.get('IdProducto')?.reset();
        }
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  BuscarProducto() {
    if (this.ArrayCondiciones !== undefined) {
      let IdProducto = '*';
      let Descripcion = '*';
      if (this.TerminoForm.get('IdProducto')?.value !== null
        && this.TerminoForm.get('IdProducto')?.value !== undefined
        && this.TerminoForm.get('IdProducto')?.value !== '') {
        this.TerminoForm.get('DescripcionProducto')?.setValue('');
        IdProducto = this.TerminoForm.get('IdProducto')?.value;
      } else if (this.TerminoForm.get('DescripcionProducto')?.value !== null
        && this.TerminoForm.get('DescripcionProducto')?.value !== undefined
        && this.TerminoForm.get('DescripcionProducto')?.value !== '') {
        Descripcion = this.TerminoForm.get('DescripcionProducto')?.value;
      }
      this.loading = true;
      this.TerminoService.BuscarProducto(IdProducto, Descripcion).subscribe(
        result => {
          this.loading = false;
          if (result.length === 0) {
            this.notif.onWarning('Advertencia', 'No se encontró el producto.');
            this.TerminoForm.get('IdProducto')?.reset();
          } else if (result.length === 1) {
            const fechaHoy = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
            const fechaVigencia = new DatePipe('en-CO').transform(this.ArrayCondiciones.FechaVigencia, 'yyyy/MM/dd');
            if ( fechaHoy != null && fechaVigencia != null && fechaHoy <= fechaVigencia) {
              const producto = result[0].IdProducto;
              const edad = this.TerminoForm.get('Edad')?.value;
              if (producto === 302) {
                if (this.TerminoForm.get('IdTipoDocumento')?.value === 3) {
                  this.TerminoForm.get('IdProducto')?.setValue("");
                  this.TerminoForm.get('DescripcionProducto')?.setValue("");
                  this.notif.onWarning('Advertencia', 'Producto no valido para un asociado jurídico.');
                  return;
                }
                if (edad >= 75) {
                  this.TerminoForm.get('IdProducto')?.setValue(result[0].IdProducto);
                  this.TerminoForm.get('DescripcionProducto')?.setValue(result[0].DescripcionProducto);
                  this.MostrasAlertaProducto = false;
                } else {
                  this.notif.onWarning('Advertencia', 'Edad del asociado no valida para este producto.');
                  this.TerminoForm.get('IdProducto')?.reset();
                  this.TerminoForm.get('DescripcionProducto')?.reset();
                }
              } else {
                this.TerminoForm.get('IdProducto')?.setValue(result[0].IdProducto);
                this.TerminoForm.get('DescripcionProducto')?.setValue(result[0].DescripcionProducto);
                this.MostrasAlertaProducto = false;
              }
              if (this.TerminoOperacionForm.get('Codigo')?.value === '10'
                || this.TerminoOperacionForm.get('Codigo')?.value === '40') {
                this.TerminoForm.get('PlazoDias')?.reset();
                this.TerminoForm.get('ValorTotal')?.reset();
                this.TerminoForm.get('TasaNominal')?.reset();
                this.TerminoForm.get('TasaEfectiva')?.reset();
                this.TerminoForm.get('TasaAdicional')?.reset();
                this.bloquearNegociacion = null;
                this.bloquearliquidacion = null;
                this.bloquearCuentaNegociacion = null;
                this.inputFrecuencia = true;
                this.selectFrecuencia = false;
                this.inputValor = true;
                this.inputValorSinDecimal = false;
                this.btnAsesoria = false;
              }
            } else {
              this.notif.onWarning('Advertencia', 'El producto no está vigente.');
              this.TerminoForm.get('IdProducto')?.reset();
              this.TerminoForm.get('DescripcionProducto')?.reset();
            }
          } else if (result.length > 1) {
            this.bloquearNegociacion = null;
            this.bloquearliquidacion = null;
            this.bloquearCuentaNegociacion = null;
            this.inputFrecuencia = true;
            this.selectFrecuencia = false;
            this.inputValor = true;
            this.inputValorSinDecimal = false;
            this.btnAsesoria = false;
            this.resultProducto = result;
            this.ModalProductoTermino.nativeElement.click();

            this.TerminoForm.get('PlazoDias')?.reset();
            this.TerminoForm.get('ValorTotal')?.reset();
            this.TerminoForm.get('TasaNominal')?.reset();
            this.TerminoForm.get('TasaEfectiva')?.reset();
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    } else {
      let IdProducto = '*';
      let Descripcion = '*';
      if (this.TerminoForm.get('IdProducto')?.value !== null
        && this.TerminoForm.get('IdProducto')?.value !== undefined
        && this.TerminoForm.get('IdProducto')?.value !== '') {
        this.TerminoForm.get('DescripcionProducto')?.setValue('');
        IdProducto = this.TerminoForm.get('IdProducto')?.value;
      } else if (this.TerminoForm.get('DescripcionProducto')?.value !== null
        && this.TerminoForm.get('DescripcionProducto')?.value !== undefined
        && this.TerminoForm.get('DescripcionProducto')?.value !== '') {
        Descripcion = this.TerminoForm.get('DescripcionProducto')?.value;
      }
      this.loading = true;
      this.TerminoService.BuscarProducto(IdProducto, Descripcion).subscribe(
        result => {
          this.loading = false;
          if (result.length === 0) {
            this.notif.onWarning('Advertencia', 'No se encontró el producto.');
            this.TerminoForm.get('IdProducto')?.reset();
          } else if (result.length === 1) {
            const fechaHoy = new DatePipe('en-CO').transform(new Date(), 'yyyy/MM/dd');
            const fechaVigencia = new DatePipe('en-CO').transform(this.ArrayCondiciones.FechaVigencia, 'yyyy/MM/dd');
            if (fechaHoy != null && fechaVigencia && fechaHoy <= fechaVigencia) {
              this.TerminoForm.get('IdProducto')?.setValue(result[0].IdProducto);
              this.TerminoForm.get('DescripcionProducto')?.setValue(result[0].DescripcionProducto);
              if (this.TerminoOperacionForm.get('Codigo')?.value === '10'
                || this.TerminoOperacionForm.get('Codigo')?.value === '40') {
                this.TerminoForm.get('PlazoDias')?.reset();
                this.TerminoForm.get('ValorTotal')?.reset();
                this.TerminoForm.get('TasaNominal')?.reset();
                this.TerminoForm.get('TasaEfectiva')?.reset();
                this.bloquearNegociacion = null;
                this.bloquearliquidacion = null;
                this.bloquearCuentaNegociacion = null;
              }
            } else {
              this.notif.onWarning('Advertencia', 'El producto no está vigente.');
              this.TerminoForm.get('IdProducto')?.reset();
              this.TerminoForm.get('DescripcionProducto')?.reset();
            }
          } else if (result.length > 1) {
            this.bloquearNegociacion = null;
            this.bloquearliquidacion = null;
            this.bloquearCuentaNegociacion = null;
            this.resultProducto = result;
            this.ModalProductoTermino.nativeElement.click();

            this.TerminoForm.get('PlazoDias')?.reset();
            this.TerminoForm.get('ValorTotal')?.reset();
            this.TerminoForm.get('TasaNominal')?.reset();
            this.TerminoForm.get('TasaEfectiva')?.reset();
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    }
  }
  MapearDatosProductos(datos : any) {
    this.ArrayCondiciones = undefined;
    this.TerminoForm.get('IdProducto')?.setValue(datos.IdProducto);
    this.TerminoForm.get('DescripcionProducto')?.setValue(datos.DescripcionProducto);
    this.MostrasAlertaProducto = false;
    this.CondicionesProducto();
  }
  ValidarTitulo() {
    this.bloquearbtnActalizar = true;
    if (this.TerminoOperacionForm.get('Codigo')?.value === '10' || this.TerminoOperacionForm.get('Codigo')?.value === '40') {
      const oficina = this.TerminoForm.get('NumeroOficina')?.value;
      this.datoOficina = oficina;
    }
    let data = localStorage.getItem('Data')
    this.dataUser = JSON.parse(window.atob(data == null ? "" : data));
    if (this.TerminoForm.get('NroTitulo')?.value !== null
      && this.TerminoForm.get('NroTitulo')?.value !== undefined
      && this.TerminoForm.get('NroTitulo')?.value !== '') {

      this.TerminoService.ValidarTitulo(this.TerminoForm.get('NroTitulo')?.value).subscribe(
        result => {
          if (result !== null) {
            if (result.IdOficina === +this.datoOficina) {
              if (result.IdEstado === 10) {
                this.notif.onWarning('Advertencia', 'El número de título esta anulado.');
                this.TerminoForm.get('NroTitulo')?.reset();
              } else if (result.IdEstado === 47) {
                this.notif.onWarning('Advertencia', 'El número de título no está disponible.');
                this.TerminoForm.get('NroTitulo')?.reset();
              }
              else if (result.IdEstado != 45) {
                this.notif.onWarning('Advertencia', 'El número de título ya fue asignado.');
                this.TerminoForm.get('NroTitulo')?.reset();
              }
            } else {
              this.notif.onWarning('Advertencia', 'El número de título tiene otra oficina asignada.');
              this.TerminoForm.get('NroTitulo')?.reset();
            }
          } else {
            this.notif.onWarning('Advertencia', 'El número de título no está asignado.');
            this.TerminoForm.get('NroTitulo')?.reset();
          }
        },
        error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    }

  }
  BuscarAsesorExternoCodigo() {
    if (this.AsesorForm.get('strCodigo')?.value !== null
      && this.AsesorForm.get('strCodigo')?.value !== undefined
      && this.AsesorForm.get('strCodigo')?.value !== ''
      || this.AsesorForm.get('strNombre')?.value !== null
      && this.AsesorForm.get('strNombre')?.value !== undefined
      && this.AsesorForm.get('strNombre')?.value !== '') {
      this.loading = true;
      this.TerminoService.BuscarAsesorExterno(this.AsesorForm.value).subscribe(
        result => {
          this.loading = false;
          // this.bloquearbtnActalizar = true;
          if (result.length === 1) {
            this.AsesorForm.get('strCodigo')?.setValue(result[0].intIdAsesor);
            this.AsesorForm.get('strNombre')?.setValue(result[0].Nombre);
          } else if (result.length > 1) {
            this.resultAsesoresExterno = result;
            this.ModalAsesoresExterno.nativeElement.click();
          } else if (result === null || result.length === 0) {
            this.notif.onWarning('Advertencia', 'No se encontró el asesor externo.');
            this.AsesorForm.get('strCodigo')?.reset();
            this.AsesorForm.get('strNombre')?.reset();
          }
          if (this.TerminoOperacionForm.get('Codigo')?.value === '19') {
            this.bloquearbtnActalizar = true;
          } else if (this.TerminoOperacionForm.get('Codigo')?.value === '10'
            || this.TerminoOperacionForm.get('Codigo')?.value === '40') {
            this.btnGuardar = false;
          }
        },
        error => {
          this.loading = false;
          this.notif.onWarning('Advertencia', 'El valor ingresado no tiene el formato correcto');
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    }
  }
  BuscarAsesorExternoTodos() {
    if (this.AsesorForm.get('strCodigo')?.value === '       '
      || this.AsesorForm.get('strCodigo')?.value === null
      && this.AsesorForm.get('strNombre')?.value === '       '
      || this.AsesorForm.get('strNombre')?.value === null) {
      this.AsesorForm.get('strCodigo')?.setValue('');
      this.AsesorForm.get('strNombre')?.setValue('');
    }

    this.TerminoService.BuscarAsesorExterno(this.AsesorForm.value).subscribe(
      result => {
        if (result.length > 1) {
          this.resultAsesoresExterno = result;
          this.ModalAsesoresExterno.nativeElement.click();

          if (this.TerminoOperacionForm.get('Codigo')?.value === '19') {
            this.bloquearbtnActalizar = true;
          } else if (this.TerminoOperacionForm.get('Codigo')?.value === '10'
            || this.TerminoOperacionForm.get('Codigo')?.value === '40') {
            this.btnGuardar = false;
          }
        } else {
          if (result.length !== 0) {
            this.AsesorForm.get('strNombre')?.reset();
            this.AsesorForm.get('strCodigo')?.reset();
            result.forEach(( elementt : any) => {
              this.AsesorForm.get('strNombre')?.setValue(elementt.Nombre);
              this.AsesorForm.get('strCodigo')?.setValue(elementt.intIdAsesor);
            });
          } else {
            this.AsesorForm.get('strNombre')?.setValue('');
            this.AsesorForm.get('strCodigo')?.setValue('');
            this.notif.onWarning('Advertencia', 'No se encontró el asesor externo.');
          }
        }
      },
      error => {
        this.notif.onWarning('Advertencia', 'El valor ingresado no tiene el formato correcto.');
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  MapearDatosAsesorExterno(datos : any) {
    console.log("datos", datos)
    this.AsesorForm.get('strCodigo')?.setValue(datos.intIdAsesor);
    this.AsesorForm.get('strNombre')?.setValue(datos.Nombre);
  }
  GuardarTermino() { 

    // Valida plazo
    if (this.TerminoForm.get('PlazoDias')?.value !== undefined
      && this.TerminoForm.get('PlazoDias')?.value !== null) {
      if (JSON.parse(this.TerminoForm.get('PlazoDias')?.value) >= this.ArrayCondiciones.PlazoMinimo
        && JSON.parse(this.TerminoForm.get('PlazoDias')?.value) <= this.ArrayCondiciones.PlazoMaximo && (Number(this.TerminoForm.get('PlazoDias')?.value) % 30) == 0) {
  
        // Guarda termino

        if (this.dataObjetBeneficiarios.length > 0) {
          let sumaPorcentaje = 0;
          let totalSuma;
          this.dataObjetBeneficiarios.forEach(( element : any) => {
            sumaPorcentaje = sumaPorcentaje + +element.Porcentaje;
          });
          totalSuma = sumaPorcentaje + +this.TerminoForm.get('Porcentaje')?.value;
          if (totalSuma === 100) {
            if (this.TerminoForm.get('IdLiquidacion')?.value === '1') {
              if (this.TerminoForm.get('IdCuentaDestino')?.value === undefined
                || this.TerminoForm.get('IdCuentaDestino')?.value === "0"
                || this.TerminoForm.get('IdCuentaDestino')?.value === null) {
                this.notif.onWarning('Advertencia', 'Debe ingresar una cuenta destino.');
                return;
              }
            }
            const FrecuenciaPago = +this.TerminoForm.get('IdFrecuenciaPago')?.value;
            this.devolverFrecuencia(FrecuenciaPago);
            this.TerminoForm.get('Variable')?.setValue(this.dataFrecuencia);
            this.TerminoForm.get('IdUsuarioSGF')?.setValue(this.dataUser.IdUsuarioSGF);
            const TEfectiva = this.TerminoForm.get('TasaEfectiva')?.value;
            const TNominal = this.TerminoForm.get('TasaNominal')?.value;
            this.TerminoForm.get('TasaEfectiva')?.setValue(this.datoTasaEfectiva);
            this.TerminoForm.get('TasaNominal')?.setValue(this.datoTasaNominal);

            if (this.dataObjetTitulares.length != 0) {
              this.dataTitulareslist = this.dataObjetTitulares;
              this.TerminoForm.get('Titulares')?.setValue(this.dataTitulareslist);
            }

            if (this.dataObjetBeneficiarios.length > 0) {
              this.dataBeneficiarioslist = this.dataObjetBeneficiarios;
              this.TerminoForm.get('BeneficiarioTermino')?.setValue(this.dataBeneficiarioslist);
            }
            this.dataAsesor = this.AsesorForm.get('strCodigo')?.value;
            this.TerminoForm.get('IdAsesorExterno')?.setValue(this.dataAsesor);

            let itemsLogApertura: any = {};
            itemsLogApertura.OficinaAsociado = this.TerminoForm.get('NombreOficinaAsociado')?.value;
            itemsLogApertura.Relacion = this.resultRelacion.filter(( x: any) => x.Clase == this.TerminoForm.get('Clase')?.value)[0].Descripcion,
            itemsLogApertura.Documento = this.TerminoForm.get('NumeroDocumento')?.value;
            itemsLogApertura.Nombre = this.TerminoForm.get('Nombre')?.value;
            itemsLogApertura.Oficina = this.TerminoForm.get('NombreOficina')?.value;
            itemsLogApertura.IdProducto = this.TerminoForm.get('IdProducto')?.value;
            itemsLogApertura.Producto = this.TerminoForm.get('DescripcionProducto')?.value;
            itemsLogApertura.OperacionPermitida = this.TerminoForm.get('DescripcionOperacion')?.value;
            itemsLogApertura.IdAsesor = this.TerminoForm.get('IdAsesor')?.value;
            itemsLogApertura.Asesor = this.TerminoForm.get('NombreAsesor')?.value;
            itemsLogApertura.Estado = this.TerminoForm.get('DescripcionEstado')?.value;
            if (this.AsesorForm.get('strCodigo')?.value !== null && this.AsesorForm.get('strCodigo')?.value !== undefined && this.AsesorForm.get('strCodigo')?.value !== '') {
              itemsLogApertura.IdAsesorExterno = this.AsesorForm.get('strCodigo')?.value;
              itemsLogApertura.AsesorExterno = this.AsesorForm.get('strNombre')?.value;
            }
            itemsLogApertura.Edad = this.TerminoForm.get('Edad')?.value;
            itemsLogApertura.NumeroTitulo = this.TerminoForm.get('NroTitulo')?.value;
            itemsLogApertura.Plazo = this.TerminoForm.get('PlazoDias')?.value;


            itemsLogApertura.ValorTitulo = this.GetNumberToMoneda(Number(this.TerminoForm.get('ValorTotal')?.value)),
            itemsLogApertura.FrecuenciaPago = this.resultFrecuenciaPago.filter(( x: any) => x.IdFrecuenciaPago == this.TerminoForm.get('IdFrecuenciaPago')?.value)[0].DescripcionFrecuenciaPago;
            itemsLogApertura.TipoCuentaDestino = this.resultLiquidacion.filter(( x: any) => x.IdLiquidacion == this.TerminoForm.get('IdLiquidacion')?.value)[0].DescripcionLiquidacion;
            itemsLogApertura.CtaAhorros = this.TerminoForm.get('IdCuentaDestino')?.value == null ? null : this.resultCuentaNegociacion.filter(( x: any) => x.IdCuenta == this.TerminoForm.get('IdCuentaDestino')?.value)[0].CuentaD;

            itemsLogApertura.TasaEfetiva = TEfectiva;
            itemsLogApertura.TasaNominal = TNominal;
            itemsLogApertura.TasaAportes = this.TerminoForm.get('TasaAdicional')?.value;


            if (this.dataObjetBeneficiarios.length > 0) {
              itemsLogApertura.BeneficiarioSeguro;
              this.dataObjetBeneficiarios.forEach(( element : any) => {
                itemsLogApertura.DocumentoBeneficiario = element.NumeroDocumento;
                itemsLogApertura.NombreBeneficiario = element.PrimerApellido + ' ' + element.SegundoApellido + ' ' + element.SegundoNombre + ' ' + element.PrimerNombre;
                itemsLogApertura.Porcentaje = +element.Porcentaje;;
                itemsLogApertura.Parenteso = element.DatosParentesco;

              });
            }
            if (this.dataObjetTitulares.length != 0) {
              itemsLogApertura.Autorizado = 'Autorizados'
              this.dataObjetTitulares.forEach(( element : any) => {
                itemsLogApertura.DocumentoAutorizado = element.Documento;
                itemsLogApertura.NombreAutorizado = element.Nombre;
                itemsLogApertura.Tipo = element.TipoTitular
                itemsLogApertura.TipoFirma = element.TipoFirma;

              });
            }
            if (this.InteresForm.get('TotalInteresNeto')?.value !== null
              && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
              && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
              itemsLogApertura.Asesoria = 'Asesoria';
              itemsLogApertura.Interes = this.InteresForm.get('TotalInteresBruto')?.value;
              itemsLogApertura.Aportes = this.InteresForm.get('TotalAportes')?.value;
              itemsLogApertura.Retencion = this.InteresForm.get('TotalRetencion')?.value;
            }

            if (this.TerminoForm.get('Clase')?.value === 10) {
              if (this.dataObjetTitulares.length != 0) {

                if (this.AsesorForm.get('strCodigo')?.value !== null
                  && this.AsesorForm.get('strCodigo')?.value !== undefined
                  && this.AsesorForm.get('strCodigo')?.value !== '') {

                  var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                  TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                  if (TasaAdicionalSin !== this.datoTasaAdicional) {
                    this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                  }
                  this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                  if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                    && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                    && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                    this.InteresForm.reset();
                    this.ReCalcularAsesoria();
                  }
                  this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                    result => {
                      this.loading = false;
                      this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                      this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                      this.bloquearDatosTitulares = false;
                      this.bloquearAsociado = false;
                      this.bloquearProducto = false;
                      this.bloquearAsesorExterno = false;
                      this.bloquearNroTitulo = false;
                      this.bloquearNegociacion = false;
                      this.bloquearCuentaNegociacion = false;
                      this.bloquearDocumentoBenf = false;
                      this.bloquearNombreBenf = false;
                      this.bloquearliquidacion = false;
                      this.btnAsesoria = true;
                      this.VolverArriba();
                      this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                      this.Guardarlog(itemsLogApertura);
                      this.btnOpcionActualizarBeneficiario = true;
                      this.btnOpcionesActualizarTitulares = true;
                      this.btnGuardar = true;
                      this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                      if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                        && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                        && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                        this.GuardarAsesoria();
                      }
                      this.devolverTab(1);
                      this.tab1.nativeElement.click();
                      $('#saldos').removeClass('activar');
                      $('#saldos').removeClass('active');
                      $('#Beneficiarios').removeClass('activar');
                      $('#Beneficiarios').removeClass('active');
                      $('#autorizados').removeClass('activar');
                      $('#autorizados').removeClass('active');
                      $('#renovaciones').removeClass('activar');
                      $('#renovaciones').removeClass('active');
                      $('#cesionAhorro').removeClass('activar');
                      $('#cesionAhorro').removeClass('active');
                      $('#reciprocidad').removeClass('activar');
                      $('#reciprocidad').removeClass('active');
                      $('#historial').removeClass('activar');
                      $('#historial').removeClass('active');
                      $('#negociacion').addClass('activar');
                      $('#negociacion').addClass('active');
                    },
                    error => {
                      this.loading = false;
                      const errorMessage = <any>error;
                      this.notif.onDanger('Error', errorMessage);
                      console.log(errorMessage);
                    }
                  );
                } else {
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
                      this.generalesService.Autofocus('SelectAsesorExterno');
                      this.VolverArriba();
                    } else {

                      var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                      TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                      if (TasaAdicionalSin !== this.datoTasaAdicional) {
                        this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                      }
                      this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                      if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                        && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                        && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                        this.InteresForm.reset();
                        this.ReCalcularAsesoria();
                      }
                      this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                        result => {
                          this.loading = false;
                          this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                          this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                          this.bloquearDatosTitulares = false;
                          this.bloquearAsociado = false;
                          this.bloquearProducto = false;
                          this.bloquearAsesorExterno = false;
                          this.bloquearNroTitulo = false;
                          this.bloquearNegociacion = false;
                          this.bloquearCuentaNegociacion = false;
                          this.bloquearDocumentoBenf = false;
                          this.bloquearNombreBenf = false;
                          this.bloquearliquidacion = false;
                          this.btnAsesoria = true;
                          this.VolverArriba();
                          this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                          this.Guardarlog(itemsLogApertura);
                          this.btnOpcionActualizarBeneficiario = true;
                          this.btnOpcionesActualizarTitulares = true;
                          this.btnGuardar = true;
                          this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                          if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                            && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                            && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                            this.GuardarAsesoria();
                          }
                          this.devolverTab(1);
                          this.tab1.nativeElement.click();
                          $('#saldos').removeClass('activar');
                          $('#saldos').removeClass('active');
                          $('#Beneficiarios').removeClass('activar');
                          $('#Beneficiarios').removeClass('active');
                          $('#autorizados').removeClass('activar');
                          $('#autorizados').removeClass('active');
                          $('#renovaciones').removeClass('activar');
                          $('#renovaciones').removeClass('active');
                          $('#cesionAhorro').removeClass('activar');
                          $('#cesionAhorro').removeClass('active');
                          $('#reciprocidad').removeClass('activar');
                          $('#reciprocidad').removeClass('active');
                          $('#historial').removeClass('activar');
                          $('#historial').removeClass('active');
                          $('#negociacion').addClass('activar');
                          $('#negociacion').addClass('active');
                        },
                        error => {
                          this.loading = false;
                          const errorMessage = <any>error;
                          this.notif.onDanger('Error', errorMessage);
                          console.log(errorMessage);
                        }
                      );
                    }

                  });
                }
              } else {
                this.notif.onWarning('Advertencia', 'Debe ingresar al menos un autorizado cuando el titular es menor.');
              }
            } else {
              if (this.TerminoForm.get('IdTipoDocumento')?.value === 3) {
                if (this.dataObjetTitulares.length != 0) {
                  if (this.AsesorForm.get('strCodigo')?.value !== null
                    && this.AsesorForm.get('strCodigo')?.value !== undefined
                    && this.AsesorForm.get('strCodigo')?.value !== '') {


                    var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                    TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                    if (TasaAdicionalSin !== this.datoTasaAdicional) {
                      this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                    }
                    this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                    if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                      && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                      && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                      this.InteresForm.reset();
                      this.ReCalcularAsesoria();
                    }
                    this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                      result => {
                        this.loading = false;
                        this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                        this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                        this.bloquearDatosTitulares = false;
                        this.bloquearAsociado = false;
                        this.bloquearProducto = false;
                        this.bloquearAsesorExterno = false;
                        this.bloquearNroTitulo = false;
                        this.bloquearNegociacion = false;
                        this.bloquearCuentaNegociacion = false;
                        this.bloquearDocumentoBenf = false;
                        this.bloquearNombreBenf = false;
                        this.bloquearliquidacion = false;
                        this.btnAsesoria = true;
                        this.VolverArriba();
                        this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                        this.Guardarlog(itemsLogApertura);
                        this.btnOpcionActualizarBeneficiario = true;
                        this.btnOpcionesActualizarTitulares = true;
                        this.btnGuardar = true;
                        this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                        if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                          && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                          && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                          this.GuardarAsesoria();
                        }
                        this.devolverTab(1);
                        this.tab1.nativeElement.click();
                        $('#saldos').removeClass('activar');
                        $('#saldos').removeClass('active');
                        $('#Beneficiarios').removeClass('activar');
                        $('#Beneficiarios').removeClass('active');
                        $('#autorizados').removeClass('activar');
                        $('#autorizados').removeClass('active');
                        $('#renovaciones').removeClass('activar');
                        $('#renovaciones').removeClass('active');
                        $('#cesionAhorro').removeClass('activar');
                        $('#cesionAhorro').removeClass('active');
                        $('#reciprocidad').removeClass('activar');
                        $('#reciprocidad').removeClass('active');
                        $('#historial').removeClass('activar');
                        $('#historial').removeClass('active');
                        $('#negociacion').addClass('activar');
                        $('#negociacion').addClass('active');
                      },
                      error => {
                        this.loading = false;
                        const errorMessage = <any>error;
                        this.notif.onDanger('Error', errorMessage);
                        console.log(errorMessage);
                      }
                    );
                  } else {
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
                        this.generalesService.Autofocus('SelectAsesorExterno');
                      } else {

                        var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                        TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                        if (TasaAdicionalSin !== this.datoTasaAdicional) {
                          this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                        }
                        this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                        if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                          && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                          && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                          this.InteresForm.reset();
                          this.ReCalcularAsesoria();
                        }


                        this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                          result => {
                            this.loading = false;
                            this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                            this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                            this.bloquearDatosTitulares = false;
                            this.bloquearAsociado = false;
                            this.bloquearProducto = false;
                            this.bloquearAsesorExterno = false;
                            this.bloquearNroTitulo = false;
                            this.bloquearNegociacion = false;
                            this.bloquearCuentaNegociacion = false;
                            this.bloquearDocumentoBenf = false;
                            this.bloquearNombreBenf = false;
                            this.bloquearliquidacion = false;
                            this.btnAsesoria = true;
                            this.VolverArriba();
                            this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                            this.Guardarlog(itemsLogApertura);
                            this.btnOpcionActualizarBeneficiario = true;
                            this.btnOpcionesActualizarTitulares = true;
                            this.btnGuardar = true;
                            this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                            if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                              && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                              && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                              this.GuardarAsesoria();
                            }
                            this.devolverTab(1);
                            this.tab1.nativeElement.click();
                            $('#saldos').removeClass('activar');
                            $('#saldos').removeClass('active');
                            $('#Beneficiarios').removeClass('activar');
                            $('#Beneficiarios').removeClass('active');
                            $('#autorizados').removeClass('activar');
                            $('#autorizados').removeClass('active');
                            $('#renovaciones').removeClass('activar');
                            $('#renovaciones').removeClass('active');
                            $('#cesionAhorro').removeClass('activar');
                            $('#cesionAhorro').removeClass('active');
                            $('#reciprocidad').removeClass('activar');
                            $('#reciprocidad').removeClass('active');
                            $('#historial').removeClass('activar');
                            $('#historial').removeClass('active');
                            $('#negociacion').addClass('activar');
                            $('#negociacion').addClass('active');
                          },
                          error => {
                            this.loading = false;
                            const errorMessage = <any>error;
                            this.notif.onDanger('Error', errorMessage);
                            console.log(errorMessage);
                          }
                        );
                      }

                    });
                  }
                } else {
                  this.notif.onWarning('Advertencia', 'Debe ingresar al menos un autorizado cuando el titular es juridico.');
                }
              }
              else {
                if (this.AsesorForm.get('strCodigo')?.value !== null
                  && this.AsesorForm.get('strCodigo')?.value !== undefined
                  && this.AsesorForm.get('strCodigo')?.value !== '') {


                  var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                  TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                  if (TasaAdicionalSin !== this.datoTasaAdicional) {
                    this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                  }
                  this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                  if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                    && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                    && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                    this.InteresForm.reset();
                    this.ReCalcularAsesoria();
                  }


                  this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                    result => {
                      this.loading = false;
                      this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                      this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                      this.bloquearDatosTitulares = false;
                      this.bloquearAsociado = false;
                      this.bloquearProducto = false;
                      this.bloquearAsesorExterno = false;
                      this.bloquearNroTitulo = false;
                      this.bloquearNegociacion = false;
                      this.bloquearCuentaNegociacion = false;
                      this.bloquearDocumentoBenf = false;
                      this.bloquearNombreBenf = false;
                      this.bloquearliquidacion = false;
                      this.btnAsesoria = true;
                      this.VolverArriba();
                      this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                      this.Guardarlog(itemsLogApertura);
                      this.btnOpcionActualizarBeneficiario = true;
                      this.btnOpcionesActualizarTitulares = true;
                      this.btnGuardar = true;
                      this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                      if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                        && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                        && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                        this.GuardarAsesoria();
                      }
                      this.devolverTab(1);
                      this.tab1.nativeElement.click();
                      $('#saldos').removeClass('activar');
                      $('#saldos').removeClass('active');
                      $('#Beneficiarios').removeClass('activar');
                      $('#Beneficiarios').removeClass('active');
                      $('#autorizados').removeClass('activar');
                      $('#autorizados').removeClass('active');
                      $('#renovaciones').removeClass('activar');
                      $('#renovaciones').removeClass('active');
                      $('#cesionAhorro').removeClass('activar');
                      $('#cesionAhorro').removeClass('active');
                      $('#reciprocidad').removeClass('activar');
                      $('#reciprocidad').removeClass('active');
                      $('#historial').removeClass('activar');
                      $('#historial').removeClass('active');
                      $('#negociacion').addClass('activar');
                      $('#negociacion').addClass('active');
                    },
                    error => {
                      this.loading = false;
                      const errorMessage = <any>error;
                      this.notif.onDanger('Error', errorMessage);
                      console.log(errorMessage);
                    }
                  );
                } else {
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
                      this.generalesService.Autofocus('SelectAsesorExterno');
                      this.VolverArriba();
                    } else {

                      var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                      TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                      if (TasaAdicionalSin !== this.datoTasaAdicional) {
                        this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                      }
                      this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                      if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                        && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                        && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                        this.InteresForm.reset();
                        this.ReCalcularAsesoria();
                      }


                      this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                        result => {
                          this.loading = false;
                          this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                          this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                          this.bloquearDatosTitulares = false;
                          this.bloquearAsociado = false;
                          this.bloquearProducto = false;
                          this.bloquearAsesorExterno = false;
                          this.bloquearNroTitulo = false;
                          this.bloquearNegociacion = false;
                          this.bloquearCuentaNegociacion = false;
                          this.bloquearDocumentoBenf = false;
                          this.bloquearNombreBenf = false;
                          this.bloquearliquidacion = false;
                          this.btnAsesoria = true;
                          this.VolverArriba();
                          this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                          this.Guardarlog(itemsLogApertura);
                          this.btnOpcionActualizarBeneficiario = true;
                          this.btnOpcionesActualizarTitulares = true;
                          this.btnGuardar = true;
                          this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                          if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                            && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                            && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                            this.GuardarAsesoria();
                          }
                          this.devolverTab(1);
                          this.tab1.nativeElement.click();
                          $('#saldos').removeClass('activar');
                          $('#saldos').removeClass('active');
                          $('#Beneficiarios').removeClass('activar');
                          $('#Beneficiarios').removeClass('active');
                          $('#autorizados').removeClass('activar');
                          $('#autorizados').removeClass('active');
                          $('#renovaciones').removeClass('activar');
                          $('#renovaciones').removeClass('active');
                          $('#cesionAhorro').removeClass('activar');
                          $('#cesionAhorro').removeClass('active');
                          $('#reciprocidad').removeClass('activar');
                          $('#reciprocidad').removeClass('active');
                          $('#historial').removeClass('activar');
                          $('#historial').removeClass('active');
                          $('#negociacion').addClass('activar');
                          $('#negociacion').addClass('active');
                        },
                        error => {
                          this.loading = false;
                          const errorMessage = <any>error;
                          this.notif.onDanger('Error', errorMessage);
                          console.log(errorMessage);
                        }
                      );
                    }

                  });
                }
              }
            }
          } else {
            this.notif.onWarning('Advertencia', 'La suma del porcentaje debe ser igual al 100%.');
          }
        } else {
          if (this.TerminoForm.get('IdLiquidacion')?.value === '1') {
            if (this.TerminoForm.get('IdCuentaDestino')?.value === undefined
              || this.TerminoForm.get('IdCuentaDestino')?.value === "0"
              || this.TerminoForm.get('IdCuentaDestino')?.value === null) {
              this.notif.onWarning('Advertencia', 'Debe ingresar una cuenta destino.');
              return
            }
          }
          const FrecuenciaPago = +this.TerminoForm.get('IdFrecuenciaPago')?.value;
          this.devolverFrecuencia(FrecuenciaPago);
          this.TerminoForm.get('Variable')?.setValue(this.dataFrecuencia);
          this.TerminoForm.get('IdUsuarioSGF')?.setValue(this.dataUser.IdUsuarioSGF);
          const TEfectiva = this.TerminoForm.get('TasaEfectiva')?.value;
          const TNominal = this.TerminoForm.get('TasaNominal')?.value;
          this.TerminoForm.get('TasaEfectiva')?.setValue(this.datoTasaEfectiva);
          this.TerminoForm.get('TasaNominal')?.setValue(this.datoTasaNominal);

          if (this.dataObjetTitulares.length != 0) {
            this.dataTitulareslist = this.dataObjetTitulares;
            this.TerminoForm.get('Titulares')?.setValue(this.dataTitulareslist);
          }

          if (this.dataObjetBeneficiarios.length > 0) {
            this.dataBeneficiarioslist = this.dataObjetBeneficiarios;
            this.TerminoForm.get('BeneficiarioTermino')?.setValue(this.dataBeneficiarioslist);
          }
          this.dataAsesor = this.AsesorForm.get('strCodigo')?.value;
          this.TerminoForm.get('IdAsesorExterno')?.setValue(this.dataAsesor);


          let itemsLogApertura: any = {};
          itemsLogApertura.OficinaAsociado = this.TerminoForm.get('NombreOficinaAsociado')?.value;
          itemsLogApertura.Relacion = this.resultRelacion.filter(( x: any) => x.Clase == this.TerminoForm.get('Clase')?.value)[0].Descripcion,
          itemsLogApertura.Documento = this.TerminoForm.get('NumeroDocumento')?.value;
          itemsLogApertura.Nombre = this.TerminoForm.get('Nombre')?.value;
          itemsLogApertura.Oficina = this.TerminoForm.get('NombreOficina')?.value;
          itemsLogApertura.IdProducto = this.TerminoForm.get('IdProducto')?.value;
          itemsLogApertura.Producto = this.TerminoForm.get('DescripcionProducto')?.value;
          itemsLogApertura.OperacionPermitida = this.TerminoForm.get('DescripcionOperacion')?.value;
          itemsLogApertura.IdAsesor = this.TerminoForm.get('IdAsesor')?.value;
          itemsLogApertura.Asesor = this.TerminoForm.get('NombreAsesor')?.value;
          itemsLogApertura.Estado = this.TerminoForm.get('DescripcionEstado')?.value;
          if (this.AsesorForm.get('strCodigo')?.value !== null && this.AsesorForm.get('strCodigo')?.value !== undefined && this.AsesorForm.get('strCodigo')?.value !== '') {
            itemsLogApertura.IdAsesorExterno = this.AsesorForm.get('strCodigo')?.value;
            itemsLogApertura.AsesorExterno = this.AsesorForm.get('strNombre')?.value;
          }
          itemsLogApertura.Edad = this.TerminoForm.get('Edad')?.value;
          itemsLogApertura.NumeroTitulo = this.TerminoForm.get('NroTitulo')?.value;
          itemsLogApertura.Plazo = this.TerminoForm.get('PlazoDias')?.value;


          itemsLogApertura.ValorTitulo = this.GetNumberToMoneda(Number(this.TerminoForm.get('ValorTotal')?.value)),
            itemsLogApertura.FrecuenciaPago = this.resultFrecuenciaPago.filter(( x: any) => x.IdFrecuenciaPago == this.TerminoForm.get('IdFrecuenciaPago')?.value)[0].DescripcionFrecuenciaPago;
          itemsLogApertura.TipoCuentaDestino = this.resultLiquidacion.filter(( x: any) => x.IdLiquidacion == this.TerminoForm.get('IdLiquidacion')?.value)[0].DescripcionLiquidacion;
          itemsLogApertura.CtaAhorros = this.TerminoForm.get('IdCuentaDestino')?.value == null ? null : this.resultCuentaNegociacion.filter(( x: any) => x.IdCuenta == this.TerminoForm.get('IdCuentaDestino')?.value)[0].CuentaD;

          itemsLogApertura.TasaEfetiva = TEfectiva;
          itemsLogApertura.TasaNominal = TNominal;
          itemsLogApertura.TasaAportes = this.TerminoForm.get('TasaAdicional')?.value;


          if (this.dataObjetBeneficiarios.length > 0) {
            itemsLogApertura.BeneficiarioSeguro;
            this.dataObjetBeneficiarios.forEach(( element : any) => {
              itemsLogApertura.DocumentoBeneficiario = element.NumeroDocumento;
              itemsLogApertura.NombreBeneficiario = element.PrimerApellido + ' ' + element.SegundoApellido + ' ' + element.SegundoNombre + ' ' + element.PrimerNombre;
              itemsLogApertura.Porcentaje = +element.Porcentaje;;
              itemsLogApertura.Parenteso = element.DatosParentesco;

            });
          }
          if (this.dataObjetTitulares.length != 0) {
            itemsLogApertura.Autorizado = 'Autorizados'
            this.dataObjetTitulares.forEach(( element : any) => {
              itemsLogApertura.DocumentoAutorizado = element.Documento;
              itemsLogApertura.NombreAutorizado = element.Nombre;
              itemsLogApertura.Tipo = element.TipoTitular
              itemsLogApertura.TipoFirma = element.TipoFirma;

            });
          }
          if (this.InteresForm.get('TotalInteresNeto')?.value !== null
            && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
            && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
            itemsLogApertura.Asesoria = 'Asesoria';
            itemsLogApertura.Interes = this.InteresForm.get('TotalInteresBruto')?.value;
            itemsLogApertura.Aportes = this.InteresForm.get('TotalAportes')?.value;
            itemsLogApertura.Retencion = this.InteresForm.get('TotalRetencion')?.value;
          }

          if (this.TerminoForm.get('Clase')?.value === 10) {
            if (this.dataObjetTitulares.length != 0) {

              if (this.AsesorForm.get('strCodigo')?.value !== null
                && this.AsesorForm.get('strCodigo')?.value !== undefined
                && this.AsesorForm.get('strCodigo')?.value !== '') {

                var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                if (TasaAdicionalSin !== this.datoTasaAdicional) {
                  this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                }
                this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                  && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                  && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                  this.InteresForm.reset();
                  this.ReCalcularAsesoria();
                }
                this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                  result => {
                    this.loading = false;
                    this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                    this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                    this.bloquearDatosTitulares = false;
                    this.bloquearAsociado = false;
                    this.bloquearProducto = false;
                    this.bloquearAsesorExterno = false;
                    this.bloquearNroTitulo = false;
                    this.bloquearNegociacion = false;
                    this.bloquearCuentaNegociacion = false;
                    this.bloquearDocumentoBenf = false;
                    this.bloquearNombreBenf = false;
                    this.bloquearliquidacion = false;
                    this.btnAsesoria = true;
                    this.VolverArriba();
                    this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                    this.Guardarlog(itemsLogApertura);
                    this.btnOpcionActualizarBeneficiario = true;
                    this.btnOpcionesActualizarTitulares = true;
                    this.btnGuardar = true;
                    this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                    if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                      && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                      && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                      this.GuardarAsesoria();
                    }
                    this.devolverTab(1);
                    this.tab1.nativeElement.click();
                    $('#saldos').removeClass('activar');
                    $('#saldos').removeClass('active');
                    $('#Beneficiarios').removeClass('activar');
                    $('#Beneficiarios').removeClass('active');
                    $('#autorizados').removeClass('activar');
                    $('#autorizados').removeClass('active');
                    $('#renovaciones').removeClass('activar');
                    $('#renovaciones').removeClass('active');
                    $('#cesionAhorro').removeClass('activar');
                    $('#cesionAhorro').removeClass('active');
                    $('#reciprocidad').removeClass('activar');
                    $('#reciprocidad').removeClass('active');
                    $('#historial').removeClass('activar');
                    $('#historial').removeClass('active');
                    $('#negociacion').addClass('activar');
                    $('#negociacion').addClass('active');
                  },
                  error => {
                    this.loading = false;
                    const errorMessage = <any>error;
                    this.notif.onDanger('Error', errorMessage);
                    console.log(errorMessage);
                  }
                );
              } else {
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
                    this.generalesService.Autofocus('SelectAsesorExterno');
                    this.VolverArriba();
                  } else {

                    var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                    TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                    if (TasaAdicionalSin !== this.datoTasaAdicional) {
                      this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                    }
                    this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                    if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                      && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                      && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                      this.InteresForm.reset();
                      this.ReCalcularAsesoria();
                    }
                    this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                      result => {
                        this.loading = false;
                        this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                        this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                        this.bloquearDatosTitulares = false;
                        this.bloquearAsociado = false;
                        this.bloquearProducto = false;
                        this.bloquearAsesorExterno = false;
                        this.bloquearNroTitulo = false;
                        this.bloquearNegociacion = false;
                        this.bloquearCuentaNegociacion = false;
                        this.bloquearDocumentoBenf = false;
                        this.bloquearNombreBenf = false;
                        this.bloquearliquidacion = false;
                        this.btnAsesoria = true;
                        this.VolverArriba();
                        this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                        this.Guardarlog(itemsLogApertura);
                        this.btnOpcionActualizarBeneficiario = true;
                        this.btnOpcionesActualizarTitulares = true;
                        this.btnGuardar = true;
                        this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                        if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                          && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                          && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                          this.GuardarAsesoria();
                        }
                        this.devolverTab(1);
                        this.tab1.nativeElement.click();
                        $('#saldos').removeClass('activar');
                        $('#saldos').removeClass('active');
                        $('#Beneficiarios').removeClass('activar');
                        $('#Beneficiarios').removeClass('active');
                        $('#autorizados').removeClass('activar');
                        $('#autorizados').removeClass('active');
                        $('#renovaciones').removeClass('activar');
                        $('#renovaciones').removeClass('active');
                        $('#cesionAhorro').removeClass('activar');
                        $('#cesionAhorro').removeClass('active');
                        $('#reciprocidad').removeClass('activar');
                        $('#reciprocidad').removeClass('active');
                        $('#historial').removeClass('activar');
                        $('#historial').removeClass('active');
                        $('#negociacion').addClass('activar');
                        $('#negociacion').addClass('active');
                      },
                      error => {
                        this.loading = false;
                        const errorMessage = <any>error;
                        this.notif.onDanger('Error', errorMessage);
                        console.log(errorMessage);
                      }
                    );
                  }

                });
              }
            } else {
              this.notif.onWarning('Advertencia', 'Debe ingresar al menos un autorizado cuando el titular es menor.');
            }
          } else {
            if (this.TerminoForm.get('IdTipoDocumento')?.value === 3) {
              if (this.dataObjetTitulares.length != 0) {
                if (this.AsesorForm.get('strCodigo')?.value !== null
                  && this.AsesorForm.get('strCodigo')?.value !== undefined
                  && this.AsesorForm.get('strCodigo')?.value !== '') {


                  var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                  TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                  if (TasaAdicionalSin !== this.datoTasaAdicional) {
                    this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                  }
                  this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                  if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                    && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                    && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                    this.InteresForm.reset();
                    this.ReCalcularAsesoria();
                  }
                  this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                    result => {
                      this.loading = false;
                      this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                      this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                      this.bloquearDatosTitulares = false;
                      this.bloquearAsociado = false;
                      this.bloquearProducto = false;
                      this.bloquearAsesorExterno = false;
                      this.bloquearNroTitulo = false;
                      this.bloquearNegociacion = false;
                      this.bloquearCuentaNegociacion = false;
                      this.bloquearDocumentoBenf = false;
                      this.bloquearNombreBenf = false;
                      this.bloquearliquidacion = false;
                      this.btnAsesoria = true;
                      this.VolverArriba();
                      this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                      this.Guardarlog(itemsLogApertura);
                      this.btnOpcionActualizarBeneficiario = true;
                      this.btnOpcionesActualizarTitulares = true;
                      this.btnGuardar = true;
                      this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                      if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                        && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                        && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                        this.GuardarAsesoria();
                      }
                      this.devolverTab(1);
                      this.tab1.nativeElement.click();
                      $('#saldos').removeClass('activar');
                      $('#saldos').removeClass('active');
                      $('#Beneficiarios').removeClass('activar');
                      $('#Beneficiarios').removeClass('active');
                      $('#autorizados').removeClass('activar');
                      $('#autorizados').removeClass('active');
                      $('#renovaciones').removeClass('activar');
                      $('#renovaciones').removeClass('active');
                      $('#cesionAhorro').removeClass('activar');
                      $('#cesionAhorro').removeClass('active');
                      $('#reciprocidad').removeClass('activar');
                      $('#reciprocidad').removeClass('active');
                      $('#historial').removeClass('activar');
                      $('#historial').removeClass('active');
                      $('#negociacion').addClass('activar');
                      $('#negociacion').addClass('active');
                    },
                    error => {
                      this.loading = false;
                      const errorMessage = <any>error;
                      this.notif.onDanger('Error', errorMessage);
                      console.log(errorMessage);
                    }
                  );
                } else {
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
                      this.generalesService.Autofocus('SelectAsesorExterno');
                    } else {

                      var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                      TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                      if (TasaAdicionalSin !== this.datoTasaAdicional) {
                        this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                      }
                      this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                      if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                        && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                        && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                        this.InteresForm.reset();
                        this.ReCalcularAsesoria();
                      }
                      this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                        result => {
                          this.loading = false;
                          this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                          this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                          this.bloquearDatosTitulares = false;
                          this.bloquearAsociado = false;
                          this.bloquearProducto = false;
                          this.bloquearAsesorExterno = false;
                          this.bloquearNroTitulo = false;
                          this.bloquearNegociacion = false;
                          this.bloquearCuentaNegociacion = false;
                          this.bloquearDocumentoBenf = false;
                          this.bloquearNombreBenf = false;
                          this.bloquearliquidacion = false;
                          this.btnAsesoria = true;
                          this.VolverArriba();
                          this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                          this.Guardarlog(itemsLogApertura);
                          this.btnOpcionActualizarBeneficiario = true;
                          this.btnOpcionesActualizarTitulares = true;
                          this.btnGuardar = true;
                          this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                          if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                            && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                            && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                            this.GuardarAsesoria();
                          }
                          this.devolverTab(1);
                          this.tab1.nativeElement.click();
                          $('#saldos').removeClass('activar');
                          $('#saldos').removeClass('active');
                          $('#Beneficiarios').removeClass('activar');
                          $('#Beneficiarios').removeClass('active');
                          $('#autorizados').removeClass('activar');
                          $('#autorizados').removeClass('active');
                          $('#renovaciones').removeClass('activar');
                          $('#renovaciones').removeClass('active');
                          $('#cesionAhorro').removeClass('activar');
                          $('#cesionAhorro').removeClass('active');
                          $('#reciprocidad').removeClass('activar');
                          $('#reciprocidad').removeClass('active');
                          $('#historial').removeClass('activar');
                          $('#historial').removeClass('active');
                          $('#negociacion').addClass('activar');
                          $('#negociacion').addClass('active');
                        },
                        error => {
                          this.loading = false;
                          const errorMessage = <any>error;
                          this.notif.onDanger('Error', errorMessage);
                          console.log(errorMessage);
                        }
                      );
                    }

                  });
                }
              } else {
                this.notif.onWarning('Advertencia', 'Debe ingresar al menos un autorizado cuando el titular es juridico.');
              }
            }
            else {
              if (this.AsesorForm.get('strCodigo')?.value !== null
                && this.AsesorForm.get('strCodigo')?.value !== undefined
                && this.AsesorForm.get('strCodigo')?.value !== '') {


                var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                if (TasaAdicionalSin !== this.datoTasaAdicional) {
                  this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                }
                this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                  && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                  && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                  this.InteresForm.reset();
                  this.ReCalcularAsesoria();
                }
                this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                  result => {
                    this.loading = false;
                    this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                    this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                    this.bloquearDatosTitulares = false;
                    this.bloquearAsociado = false;
                    this.bloquearProducto = false;
                    this.bloquearAsesorExterno = false;
                    this.bloquearNroTitulo = false;
                    this.bloquearNegociacion = false;
                    this.bloquearCuentaNegociacion = false;
                    this.bloquearDocumentoBenf = false;
                    this.bloquearNombreBenf = false;
                    this.bloquearliquidacion = false;
                    this.btnAsesoria = true;
                    this.VolverArriba();
                    this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                    this.Guardarlog(itemsLogApertura);
                    this.btnOpcionActualizarBeneficiario = true;
                    this.btnOpcionesActualizarTitulares = true;
                    this.btnGuardar = true;
                    this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                    if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                      && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                      && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                      this.GuardarAsesoria();
                    }
                    this.devolverTab(1);
                    this.tab1.nativeElement.click();
                    $('#saldos').removeClass('activar');
                    $('#saldos').removeClass('active');
                    $('#Beneficiarios').removeClass('activar');
                    $('#Beneficiarios').removeClass('active');
                    $('#autorizados').removeClass('activar');
                    $('#autorizados').removeClass('active');
                    $('#renovaciones').removeClass('activar');
                    $('#renovaciones').removeClass('active');
                    $('#cesionAhorro').removeClass('activar');
                    $('#cesionAhorro').removeClass('active');
                    $('#reciprocidad').removeClass('activar');
                    $('#reciprocidad').removeClass('active');
                    $('#historial').removeClass('activar');
                    $('#historial').removeClass('active');
                    $('#negociacion').addClass('activar');
                    $('#negociacion').addClass('active');
                  },
                  error => {
                    this.loading = false;
                    const errorMessage = <any>error;
                    this.notif.onDanger('Error', errorMessage);
                    console.log(errorMessage);
                  }
                );
              } else {
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
                    this.generalesService.Autofocus('SelectAsesorExterno');
                    this.VolverArriba();
                  } else {

                    var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
                    TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
                    if (TasaAdicionalSin !== this.datoTasaAdicional) {
                      this.TerminoForm.get('TasaAdicional')?.setValue(this.datoTasaAdicional);
                    }
                    this.TerminoForm.get('FechaApertura')?.setValue(formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'));

                    if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                      && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                      && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                      this.InteresForm.reset();
                      this.ReCalcularAsesoria();
                    }
                    this.TerminoService.GuardarTermino(this.TerminoForm.value).subscribe(
                      result => {
                        this.loading = false;
                        this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                        this.TerminoForm.get('FechaApertura')?.setValue(result.FechaApertura);
                        this.bloquearDatosTitulares = false;
                        this.bloquearAsociado = false;
                        this.bloquearProducto = false;
                        this.bloquearAsesorExterno = false;
                        this.bloquearNroTitulo = false;
                        this.bloquearNegociacion = false;
                        this.bloquearCuentaNegociacion = false;
                        this.bloquearDocumentoBenf = false;
                        this.bloquearNombreBenf = false;
                        this.bloquearliquidacion = false;
                        this.btnAsesoria = true;
                        this.VolverArriba();
                        this.notif.onSuccess('Exitoso', 'La cuenta se guardó correctamente.');
                        this.Guardarlog(itemsLogApertura);
                        this.btnOpcionActualizarBeneficiario = true;
                        this.btnOpcionesActualizarTitulares = true;
                        this.btnGuardar = true;
                        this.BuscarDatosCuenta(result.IdOficina, result.IdProducto, result.IdConsecutivo, result.IdDigito);
                        if (this.InteresForm.get('TotalInteresNeto')?.value !== null
                          && this.InteresForm.get('TotalInteresNeto')?.value !== undefined
                          && this.InteresForm.get('TotalInteresNeto')?.value !== '') {
                          this.GuardarAsesoria();
                        }
                        this.devolverTab(1);
                        this.tab1.nativeElement.click();
                        $('#saldos').removeClass('activar');
                        $('#saldos').removeClass('active');
                        $('#Beneficiarios').removeClass('activar');
                        $('#Beneficiarios').removeClass('active');
                        $('#autorizados').removeClass('activar');
                        $('#autorizados').removeClass('active');
                        $('#renovaciones').removeClass('activar');
                        $('#renovaciones').removeClass('active');
                        $('#cesionAhorro').removeClass('activar');
                        $('#cesionAhorro').removeClass('active');
                        $('#reciprocidad').removeClass('activar');
                        $('#reciprocidad').removeClass('active');
                        $('#historial').removeClass('activar');
                        $('#historial').removeClass('active');
                        $('#negociacion').addClass('activar');
                        $('#negociacion').addClass('active');
                      },
                      error => {
                        this.loading = false;
                        const errorMessage = <any>error;
                        this.notif.onDanger('Error', errorMessage);
                        console.log(errorMessage);
                      }
                    );
                  }

                });
              }
            }
          }
        }

      } else {
        this.notif.onWarning('Advertencia', 'El plazo ingresado no es permitido para este producto.');
        this.TerminoForm.get('ValorTotal')?.reset();
        this.TerminoForm.get('PlazoDias')?.reset();
        return
      }    
    }      
  }
  GuardarAsesoria() {
    this.AsesoriaSendForm.get('IdFrecuenciaPago')?.setValue(this.TerminoForm.get('IdFrecuenciaPago')?.value);
    this.AsesoriaSendForm.get('Plazo')?.setValue(this.TerminoForm.get('PlazoDias')?.value);
    this.AsesoriaSendForm.get('TasaNominal')?.setValue(this.TerminoForm.get('TasaNominal')?.value);
    this.AsesoriaSendForm.get('TasaAdicional')?.setValue(this.TerminoForm.get('TasaAdicional')?.value);
    this.AsesoriaSendForm.get('NumeroOficina')?.setValue(this.TerminoForm.get('NumeroOficina')?.value);
    this.AsesoriaSendForm.get('IdProducto')?.setValue(this.TerminoForm.get('IdProducto')?.value);
    this.AsesoriaSendForm.get('IdAsesor')?.setValue(this.TerminoForm.get('IdAsesor')?.value);
    this.AsesoriaSendForm.get('NumeroDocumento')?.setValue(this.TerminoForm.get('NumeroDocumento')?.value);
    this.AsesoriaSendForm.get('ValorTitulo')?.setValue(this.TerminoForm.get('ValorTotal')?.value);
    this.AsesoriaSendForm.get('Retencion')?.setValue(this.InteresForm.get('TotalRetencion')?.value);
    this.AsesoriaSendForm.get('Intereses')?.setValue(this.InteresForm.get('TotalInteresBruto')?.value - this.InteresForm.get('Aportes')?.value);
    this.AsesoriaSendForm.get('Aportes')?.setValue(this.InteresForm.get('Aportes')?.value);
    this.AsesoriaSendForm.get('IdRelacion')?.setValue(this.TerminoForm.get('Clase')?.value);


    this.TerminoService.GuardarAsesoria(this.AsesoriaSendForm.value).subscribe(
      result => {
        ;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
        this.notif.onDanger('Error', errorMessage);
      }
    );
  }
  Guardarlog(objet: any = null) {
    if (objet == null)
      objet = this.TerminoForm.value;

    this.loading = true;
    if (this.TerminoOperacionForm.get('Codigo')?.value === '10') {
      this.generalesService.GuardarlogProductos(objet, this.TerminoOperacionForm.get('Codigo')?.value,
        this.TerminoForm.get('IdCuenta')?.value, this.TerminoForm.get('LngTercero')?.value, 19).subscribe(
          result => {
            this.loading = false;
            console.log(result);
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
    } else {
      this.generalesService.GuardarlogTerminoDisponibles(objet, this.TerminoOperacionForm.get('Codigo')?.value,
        this.TerminoForm.get('IdCuenta')?.value, this.TerminoForm.get('LngTercero')?.value, 19, this.TerminoForm.value.IdObseCambioEstado).subscribe(
          result => {
            this.loading = false;
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
    }
  }
  LiberarTitulo() {
    this.BuscarPorCuenta(); 
    if (this.TerminoForm.get('NroTitulo')?.value !== null
      && this.TerminoForm.get('NroTitulo')?.value !== undefined
      && this.TerminoForm.get('NroTitulo')?.value !== '') {
      this.TerminoService.ActualizarTitulo(this.TerminoForm.get('NroTitulo')?.value).subscribe(
        result => {
          this.TerminoForm.get('NroTitulo')?.reset();
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
          this.notif.onDanger('Error', errorMessage);
        }
      );
    } else {
      this.notif.onWarning('Advertencia', 'Cuenta anulada sin titulo');
      this.TerminoOperacionForm.get('Codigo')?.reset();
    }    
  }
  // NEGOCIACION
  Liquidacion() {
    this.TerminoService.Liquidacion().subscribe(
      result => {
        this.resultLiquidacion = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  ObtenerPuntosAdicionales() {
    this.TerminoService.ObtenerPuntosAdicionales(0).subscribe(
      result => {
        this.resultPuntosAdicionales = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  BuscarCuentaParaPuntos() {
    this.TerminoService.BuscarCuenta(this.TerminoForm.value).subscribe(
      result => {
        const numberNominal = this.returnFormatNum(result.ltTasa[0].TasaNominal);
        this.TerminoForm.get('TasaNominal')?.setValue(numberNominal + " %");
        const numberEfectiva = this.returnFormatNum(result.ltTasa[0].TasaEfectiva);
        this.TerminoForm.get('TasaEfectiva')?.setValue(numberEfectiva + " %");
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  SeleccionPuntos() {
    this.bloquearbtnCalcular = true;
  }
  SumaPuntos() {
    this.TerminoForm.get('TasaEfectiva')?.reset();
    this.TerminoForm.get('TasaEfectiva')?.setValue(this.datoTasaEfectiva + "%");
    this.TerminoForm.get('TasaNominal')?.reset();
    this.TerminoForm.get('TasaNominal')?.setValue(this.datoTasaEfectiva + "%");

    if (this.AdicionarPuntosFrom.get('AdicionarPunto')?.value !== '--Seleccione--') {
      const Punto = +this.AdicionarPuntosFrom.get('AdicionarPunto')?.value.PuntosAdicionales;

      this.TerminoForm.get('Plazo')?.setValue(this.TerminoForm.get('PlazoDias')?.value);
      this.TerminoForm.get('AdicionarP')?.setValue(Punto);

      this.TerminoService.ObtenerTasaConPuntos(this.TerminoForm.value).subscribe(
        result => {
          this.loading = false;
          this.MapearTasa(result);
          this.bloquearActualizar = true;
          this.bloquearbtnCalcular = false;
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );   
        
    } else {
      this.notif.onWarning('Advertencia', 'Debe seleccionar puntos a adicionar.');
    }
  }
  ObtenerTasaNominal() {
    this.loading = true;
    const objectComplet = this.AdicionarPuntosFrom.value.AdicionarPunto;
    const puntosAdd = this.AdicionarPuntosFrom.value.AdicionarPunto.PuntosAdicionales;
    this.TerminoForm.get('AdicionarP')?.setValue(puntosAdd);
    var TasaEfectivaSin = this.TerminoForm.get('TasaEfectiva')?.value;
    TasaEfectivaSin = TasaEfectivaSin.replace("%", "");
    this.TerminoForm.get('TasaEfectiva')?.setValue(Number(TasaEfectivaSin));
    this.TerminoService.ObtenerTasaNominal(this.TerminoForm.value).subscribe(
      result => {
        this.loading = false;
        this.AdicionarPuntosFrom.get('AdicionarPunto')?.setValue(objectComplet);
        const numberNominal = this.returnFormatNum((result.TasaNominal));
        this.TerminoForm.get('TasaNominal')?.setValue(numberNominal + "%");
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
  BuscarCuentaNegociacion() {
    if (this.TerminoForm.get('NumeroDocumento')?.value !== null
      && this.TerminoForm.get('NumeroDocumento')?.value !== undefined
      && this.TerminoForm.get('NumeroDocumento')?.value !== '') {
      this.loading = true;
      this.TerminoService.BuscarCuentaDisponible(this.TerminoForm.value).subscribe(
        result => {
          this.loading = false;
          if (result.length >= 1) {
            this.resultCuentaNegociacion = result;
          } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
            this.notif.onWarning('Advertencia', result.Mensaje);
            this.TerminoForm.get('IdLiquidacion')?.setValue('0');
            this.selectCuenta = true;
            this.inputCuenta = false;
            this.bloquearbtnActalizar = true;
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    } else {
      this.notif.onWarning('Advertencia', 'Debe ingresar el documento del asociado.');
      this.TerminoForm.get('IdLiquidacion')?.reset();
    }
  }
  ImpresionCuentaDestinoPDF() {
    this.CuentaDestinoPdf();
    $("#ImpresionTermino").show();
    this.ModalImpresion.nativeElement.click();
  }
  CuentaDestinoPdf() {
    let payload: any = {
      Nombre: this.TerminoForm.controls["Nombre"].value,
      TipoDocumento: this.dataObjet.TipoDocumento,
      Documento: this.dataObjet.NumeroDocumento,
      TipoAhorro: this.dataObjet.DescripcionProducto,
      Cuenta: this.dataObjet.Cuenta,
      CuentaDesembolso: this.TerminoForm.controls['IdLiquidacion'].value == '0' ? "" : this.resultCuentaNegociacion.filter(( x: any) => x.IdCuenta == this.TerminoForm.controls['IdCuentaDestino'].value)[0].Cuenta,
      TipoPdf: "Término",
      TitiloPdf: "FORMATO MODIFICACIÓN PRODUCTO TÉRMINO CUENTA DESTINO",
      CiudadPdf: "",
      OficinaPdf: this.dataUser.Oficina
    }
    this.linkPdf = "";
    let pdfinBase64 = null;
    let byteArray = null;
    let newBolb = null;
    let url = null;
    document.querySelector("object")!.data = "";
    document.querySelector("object")!.name = "";
    document.querySelector("object")!.type = "";
    this.loading = true;
    this.TerminoService.CuentaDestinoPDF(payload).subscribe(result => {
      pdfinBase64 = result.FileStream._buffer;
      byteArray = new Uint8Array(
        atob(pdfinBase64)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      newBolb = new Blob([byteArray], { type: "application/pdf" });
      this.linkPdf = URL.createObjectURL(newBolb);
      url = window.URL.createObjectURL(newBolb);
      document.querySelector("object")!.data = url;
      document.querySelector("object")!.name = "Impresion";
      document.querySelector("object")!.type = "application/pdf";
      this.loading = false
    },
      error => {
        this.loading = false
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  ObtenerFrecuenciaPago() {
    if (this.TerminoForm.get('PlazoDias')?.value !== ''
      && this.TerminoForm.get('PlazoDias')?.value !== undefined
      && this.TerminoForm.get('PlazoDias')?.value !== null) {
      let Plazo = this.TerminoForm.get('PlazoDias')?.value;
      this.TerminoService.ObtenerFrecuenciaPago(Plazo).subscribe(
        result => {
          this.resultFrecuenciaPago = result;
        },
        error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    }
  }
  ObtenerTasa() {
    if (this.TerminoForm.get('PlazoDias')?.value !== ''
      && this.TerminoForm.get('PlazoDias')?.value !== undefined
      && this.TerminoForm.get('PlazoDias')?.value !== null
      && this.TerminoForm.get('ValorTotal')?.value !== ''
      && this.TerminoForm.get('ValorTotal')?.value !== undefined
      && this.TerminoForm.get('ValorTotal')?.value !== null
      && this.TerminoForm.get('IdFrecuenciaPago')?.value !== ''
      && this.TerminoForm.get('IdFrecuenciaPago')?.value !== undefined
      && this.TerminoForm.get('IdFrecuenciaPago')?.value !== null) {

      this.TerminoForm.get('Plazo')?.setValue(this.TerminoForm.get('PlazoDias')?.value);
      this.loading = true;
      this.TerminoService.ObtenerTasa(this.TerminoForm.value).subscribe(
        result => {
          this.loading = false;
          if (result.TasaEfectiva === 0) {
            this.notif.onWarning('Advertencia', 'Tasa no valida.');
          } else {
            this.MapearTasa(result);
          }
        },
        error => {
          this.loading = false;
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.log(errorMessage);
        }
      );
    }
  }
  MapearTasa(result : any) {
    if (result.TasaEfectiva !== null && result.TasaEfectiva !== 0) {
      const numberNominal = this.returnFormatNum(result.TasaNominal);
      this.TerminoForm.get('TasaNominal')?.setValue(numberNominal + "%");
      this.datoTasaNominal = +result.TasaNominal;
      const numberEfectiva = this.returnFormatNum(result.TasaEfectiva.toFixed(4));
      this.TerminoForm.get('TasaEfectiva')?.setValue(numberEfectiva + " %");
      this.datoTasaEfectiva = result.TasaEfectiva.toFixed(6);
      const numberTasaAdicional = this.returnFormatNum(result.TasaAdicional.toFixed(4));
      this.TerminoForm.get('TasaAdicional')?.setValue(numberTasaAdicional + " %");
      this.datoTasaAdicional = result.TasaAdicional.toFixed(6);
    } else {
      this.notif.onWarning('Advertencia', 'No existe tasa para los datos ingresados.');
      this.TerminoForm.get('IdFrecuenciaPago')?.reset();
      this.TerminoForm.get('ValorTotal')?.reset();
      this.TerminoForm.get('PlazoDias')?.reset();

    }
  }
  SeleccionLiquidacion() {
    this.bloquearActualizar = true;
    if (this.TerminoForm.get('IdLiquidacion')?.value == '0') {
      this.bloquearCuentaNegociacion = false;
      this.TerminoForm.get('IdCuentaDestino')?.reset();
      this.TerminoForm.get('CuentaDestino')?.reset();
      this.selectCuenta = true;
      this.inputCuenta = false;
      this.bloquearbtnActalizar = true;
    } else {
      this.bloquearCuentaNegociacion = null;
      this.selectCuenta = false;
      this.inputCuenta = true;
      this.BuscarCuentaNegociacion();
      this.bloquearbtnActalizar = true;
    }
  }
  ValidarPlazo() {
    if (this.TerminoForm.get('PlazoDias')?.value !== undefined
      && this.TerminoForm.get('PlazoDias')?.value !== null) {
      if (JSON.parse(this.TerminoForm.get('PlazoDias')?.value) >= this.ArrayCondiciones.PlazoMinimo
        && JSON.parse(this.TerminoForm.get('PlazoDias')?.value) <= this.ArrayCondiciones.PlazoMaximo && (Number(this.TerminoForm.get('PlazoDias')?.value) % 30) == 0) {
        this.TerminoForm.get('IdFrecuenciaPago')?.setValue(-1);
        this.ObtenerFrecuenciaPago();
      } else {
        this.notif.onWarning('Advertencia', 'El plazo ingresado no es permitido para este producto.');
        this.TerminoForm.get('ValorTotal')?.reset();
        this.TerminoForm.get('PlazoDias')?.reset();
        return
      }
    }
  }
  ValidarValorTotal() {
    if (this.TerminoForm.get('PlazoDias')?.value !== undefined
      && this.TerminoForm.get('PlazoDias')?.value !== null
      && this.TerminoForm.get('PlazoDias')?.value !== 0) {
      if (this.TerminoForm.get('ValorTotal')?.value >= this.ArrayCondiciones.sngMontoApe) {

      } else {
        this.notif.onWarning('Advertencia', 'El valor total tiene un monto no permitido para este producto.');
        this.TerminoForm.get('ValorTotal')?.reset();
      }
    }
  }
  //CALCULAR INTERESES
  CalcularAsesoria() {
    if (this.TerminoForm.get('IdFrecuenciaPago')?.value == undefined || this.TerminoForm.get('IdFrecuenciaPago')?.value == null || Number(this.TerminoForm.get('IdFrecuenciaPago')?.value) == -1) {
      this.notif.onWarning('Advertencia', 'Datos incompletos para calcular asesoria.');
      return;
    }
    if (this.TerminoForm.get('PlazoDias')?.value !== ''
      && this.TerminoForm.get('PlazoDias')?.value !== undefined
      && this.TerminoForm.get('PlazoDias')?.value !== null
      && this.TerminoForm.get('ValorTotal')?.value !== ''
      && this.TerminoForm.get('ValorTotal')?.value !== undefined
      && this.TerminoForm.get('ValorTotal')?.value !== null) {

      if (this.TerminoForm.get('TasaEfectiva')?.value !== ''
        && this.TerminoForm.get('TasaEfectiva')?.value !== undefined
        && this.TerminoForm.get('TasaEfectiva')?.value !== null
        && this.TerminoForm.get('TasaNominal')?.value !== ''
        && this.TerminoForm.get('TasaNominal')?.value !== undefined
        && this.TerminoForm.get('TasaNominal')?.value !== null) {

        this.TerminoForm.get('TasaEfectiva')?.setValue(this.datoTasaEfectiva);
        this.TerminoForm.get('TasaNominal')?.setValue(this.datoTasaNominal);
        const FrecuenciaPago = +this.TerminoForm.get('IdFrecuenciaPago')?.value;
        this.devolverFrecuencia(FrecuenciaPago);
        this.TerminoForm.get('Variable')?.setValue(this.dataFrecuencia);

        this.TerminoService.ObtenerIntereses(this.TerminoForm.value).subscribe(
          result => {
            if (result !== null) {
              this.MapearIntereses(result);
              this.ModalCalcularAsesoria.nativeElement.click();
              this.TerminoForm.get('TasaEfectiva')?.setValue(this.TerminoForm.get('TasaEfectiva')?.value);
              this.TerminoForm.get('TasaNominal')?.setValue(this.TerminoForm.get('TasaNominal')?.value);
              this.TerminoForm.get('TasaAdicional')?.setValue(this.TerminoForm.get('TasaAdicional')?.value);
            }
          },
          error => {
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );

      } else {
        this.notif.onWarning('Advertencia', 'Datos incompletos para calcular asesoria.');
      }

    } else {
      this.notif.onWarning('Advertencia', 'Datos incompletos para calcular asesoria.');
    }
  }
  ReCalcularAsesoria() {
    if (this.TerminoForm.get('PlazoDias')?.value !== ''
      && this.TerminoForm.get('PlazoDias')?.value !== undefined
      && this.TerminoForm.get('PlazoDias')?.value !== null
      && this.TerminoForm.get('ValorTotal')?.value !== ''
      && this.TerminoForm.get('ValorTotal')?.value !== undefined
      && this.TerminoForm.get('ValorTotal')?.value !== null) {

      if (this.TerminoForm.get('TasaEfectiva')?.value !== ''
        && this.TerminoForm.get('TasaEfectiva')?.value !== undefined
        && this.TerminoForm.get('TasaEfectiva')?.value !== null
        && this.TerminoForm.get('TasaNominal')?.value !== ''
        && this.TerminoForm.get('TasaNominal')?.value !== undefined
        && this.TerminoForm.get('TasaNominal')?.value !== null) {

        this.TerminoForm.get('TasaEfectiva')?.setValue(this.datoTasaEfectiva);
        this.TerminoForm.get('TasaNominal')?.setValue(this.datoTasaNominal);
        const FrecuenciaPago = +this.TerminoForm.get('IdFrecuenciaPago')?.value;
        this.devolverFrecuencia(FrecuenciaPago);
        this.TerminoForm.get('Variable')?.setValue(this.dataFrecuencia);
        this.TerminoService.ObtenerIntereses(this.TerminoForm.value).subscribe(
          result => {
            if (result !== null) {
              this.MapearIntereses(result);
              this.TerminoForm.get('TasaEfectiva')?.setValue(this.TerminoForm.get('TasaEfectiva')?.value);
              this.TerminoForm.get('TasaNominal')?.setValue(this.TerminoForm.get('TasaNominal')?.value);
              this.TerminoForm.get('TasaAdicional')?.setValue(this.TerminoForm.get('TasaAdicional')?.value);
              
            }
          },
          error => {
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      }
    }
  }
  MapearIntereses(result : any) {
    this.InteresForm.get('InteresBruto')?.setValue(result.InteresBruto.toFixed(0));
    this.InteresForm.get('Aportes')?.setValue(result.Aportes.toFixed(0));
    this.ObtenerRetencion();

    const TasaNominal = this.returnFormatNum(this.TerminoForm.get('TasaNominal')?.value);
    const TasaNominalFinal = TasaNominal + "%"
    this.TerminoForm.get('TasaNominal')?.setValue(TasaNominalFinal);
    const TasaEfectiva = this.returnFormatNum(this.TerminoForm.get('TasaEfectiva')?.value);
    const TasaEfectivaFinal = TasaEfectiva + "%"
    this.TerminoForm.get('TasaEfectiva')?.setValue(TasaEfectivaFinal);

  }
  ObtenerRetencion() {
    if (this.InteresForm.get('InteresBruto')?.value !== ''
      && this.InteresForm.get('InteresBruto')?.value !== undefined
      && this.InteresForm.get('InteresBruto')?.value !== null) {
      this.loading = true;     

      this.TerminoForm.get('TasaEfectiva')?.setValue(this.datoTasaEfectiva);
      this.TerminoForm.get('TasaNominal')?.setValue(this.datoTasaNominal);
      this.TerminoForm.get('TotalInteres')?.setValue(this.InteresForm.get('InteresBruto')?.value);

      this.TerminoService.ObtenerRetencion(this.TerminoForm.value).subscribe(
        result => {
          this.loading = false;
          const retencion = result;
          this.InteresForm.get('Retencion')?.setValue(retencion)
          const plazo = this.TerminoForm.get('PlazoDias')?.value
          const FrecuenciaPago = +this.TerminoForm.get('IdFrecuenciaPago')?.value;
          this.devolverFrecuencia(FrecuenciaPago);
          const variable = (plazo / this.dataFrecuencia)
          if (this.dataFrecuencia === 1) {
            const InteresPeriodo = this.InteresForm.get('InteresBruto')?.value;
            this.InteresForm.get('TotalInteresBruto')?.setValue(InteresPeriodo);
            const RetencionPeriodo = this.InteresForm.get('Retencion')?.value;
            this.InteresForm.get('TotalRetencion')?.setValue(RetencionPeriodo);
            const AportesPeriodo = this.InteresForm.get('Aportes')?.value;
            this.InteresForm.get('TotalAportes')?.setValue(AportesPeriodo);
            this.InteresForm.get('InteresNeto')?.setValue(InteresPeriodo - RetencionPeriodo - AportesPeriodo);
            const Interes = this.InteresForm.get('TotalInteresBruto')?.value;
            const Retencion = this.InteresForm.get('TotalRetencion')?.value;
            const Aportes = this.InteresForm.get('TotalAportes')?.value;
            this.InteresForm.get('TotalInteresNeto')?.setValue(Interes - Retencion - Aportes);
          } else {
            const InteresPeriodo = this.InteresForm.get('InteresBruto')?.value;
            this.InteresForm.get('TotalInteresBruto')?.setValue(InteresPeriodo * variable);
            const RetencionPeriodo = this.InteresForm.get('Retencion')?.value;
            this.InteresForm.get('TotalRetencion')?.setValue(RetencionPeriodo * variable);
            const AportesPeriodo = this.InteresForm.get('Aportes')?.value;
            this.InteresForm.get('TotalAportes')?.setValue(AportesPeriodo * variable);
            this.InteresForm.get('InteresNeto')?.setValue(InteresPeriodo - RetencionPeriodo - AportesPeriodo);
            const Interes = this.InteresForm.get('TotalInteresBruto')?.value;
            const Retencion = this.InteresForm.get('TotalRetencion')?.value;
            const Aportes = this.InteresForm.get('TotalAportes')?.value;
            this.InteresForm.get('TotalInteresNeto')?.setValue(Interes - Retencion - Aportes);
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
  devolverFrecuencia(Id : number) {
    switch (Id) {
      case 30:
        this.dataFrecuencia = 30;
        break;
      case 35:
        this.dataFrecuencia = 60;
        break;
      case 40:
        this.dataFrecuencia = 90;
        break;
      case 45:
        this.dataFrecuencia = 120;
        break;
      case 50:
        this.dataFrecuencia = 180;
        break;
      case 55:
        this.dataFrecuencia = 360;
        break;
      case 60:
        this.dataFrecuencia = 1;
        break;
    }
    this.TerminoForm.get('Variable')?.setValue(this.dataFrecuencia);
  }
  // BENEFICIARIO
  ObtenerTipoDocumento() {
    this.TerminoService.ObtenerTipoDocumento().subscribe(
      result => {
        this.resultTipoDocumento = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  BuscarBenefeciario() {
    let DocValue: string = this.TerminoForm.get('DocumentoBeneficiario')?.value;
    if (DocValue == null || DocValue == "")
        return
    const DocBeneficiario = this.TerminoForm.get('DocumentoBeneficiario')?.value.toString().trim();
    let temp: any = this.dataObjetBeneficiarios.filter(( x: any) => x.NumeroDocumento == DocBeneficiario)[0];
    if (temp != null) {
      this.TerminoForm.get('DocumentoBeneficiario')?.setValue("");
      this.notif.onWarning('Advertencia', 'El beneficiario ya fue ingresado.');
      this.TerminoForm.get('DocumentoBeneficiario')?.reset();
      return;
    }
    if (this.TerminoForm.get('DocumentoBeneficiario')?.valid === true) {
      if (this.TerminoForm.get('DocumentoBeneficiario')?.value !== null
        && this.TerminoForm.get('DocumentoBeneficiario')?.value !== undefined
        && this.TerminoForm.get('DocumentoBeneficiario')?.value !== ''
      ) {
        if (this.TerminoForm.get('DocumentoBeneficiario')?.value.trim() !== this.TerminoForm.get('NumeroDocumento')?.value) {
          if (this.dataObjetBeneficiarios.length == 0) {
            this.loading = true;
            this.TerminoService.BuscarBeneficiario(this.TerminoForm.get('DocumentoBeneficiario')?.value).subscribe(
              result => {
                console.log("beneficiaroio usuar", result)
                this.loading = false;
                if (result != null && result.Mensaje != null && (result.Mensaje == "Gerencia de desarrollo." || result.Mensaje == "Oficial de cumplimiento.")) {
                  this.AlertVetado(result.Mensaje);
                  this.TerminoForm.get('DocumentoBeneficiario')?.reset();
                }
                else if (result === null) {
                  const PrimerNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                  const SegundoNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                  const PrimerApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                  const SegundoApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);

                  this.TerminoForm.removeControl("PrimerNombre");
                  this.TerminoForm.removeControl("SegundoNombre");
                  this.TerminoForm.removeControl("PrimerApellido");
                  this.TerminoForm.removeControl("SegundoApellido");

                  this.TerminoForm.addControl("PrimerNombre", PrimerNombre);
                  this.TerminoForm.addControl("SegundoNombre", SegundoNombre);
                  this.TerminoForm.addControl("PrimerApellido", PrimerApellido);
                  this.TerminoForm.addControl("SegundoApellido", SegundoApellido);
                  this.notif.onWarning('Advertencia', 'No se encontró el beneficiario. Ingrese los datos para crearlo.');
                  this.bloquearNombreBenf = null;
                  this.bloquearDocumentoBenf = true;
                  this.TerminoForm.get('PrimerNombre')?.reset();
                  this.TerminoForm.get('SegundoNombre')?.reset();
                  this.TerminoForm.get('PrimerApellido')?.reset();
                  this.TerminoForm.get('SegundoApellido')?.reset();
                  this.TerminoForm.get('IdTipoDocumento')?.reset();
                  this.TerminoForm.get('Porcentaje')?.setValue("");
                  this.TerminoForm.get('DatosParentesco')?.setValue("");
                  this.TerminoForm.get('Porcentaje')?.enable();
                  this.TerminoForm.get('DatosParentesco')?.enable();
                } else {
                  if (result.IdEstado === 32) {
                    this.notif.onWarning('Alerta', 'Beneficiario con estado fallecido.');
                    this.TerminoForm.get('DocumentoBeneficiario')?.reset();

                  } else {
                    this.bloquearDocumentoBenf = true;
                    const PrimerNombre = new FormControl('');
                    const SegundoNombre = new FormControl('');
                    const PrimerApellido = new FormControl('');
                    const SegundoApellido = new FormControl('');
                    this.TerminoForm.removeControl("PrimerNombre");
                    this.TerminoForm.removeControl("SegundoNombre");
                    this.TerminoForm.removeControl("PrimerApellido");
                    this.TerminoForm.removeControl("SegundoApellido");
                    
                    this.TerminoForm.addControl("PrimerNombre", PrimerNombre);
                    this.TerminoForm.addControl("SegundoNombre", SegundoNombre);
                    this.TerminoForm.addControl("PrimerApellido", PrimerApellido);
                    this.TerminoForm.addControl("SegundoApellido", SegundoApellido);

                    this.TerminoForm.get('PrimerNombre')?.setValue(result.PrimerNombre);
                    this.TerminoForm.get('SegundoNombre')?.setValue(result.SegundoNombre);
                    this.TerminoForm.get('PrimerApellido')?.setValue(result.PrimerApellido);
                    this.TerminoForm.get('SegundoApellido')?.setValue(result.SegundoApellido);
                    this.TerminoForm.get('IdTipoDocumento')?.setValue(result.IdTipoDocumento);
                    this.TerminoForm.get('Porcentaje')?.setValue("");
                    this.TerminoForm.get('DatosParentesco')?.setValue("");
                    this.TerminoForm.get('Porcentaje')?.enable();
                    this.TerminoForm.get('DatosParentesco')?.enable();
                    this.bloquearNombreBenf = false;
                  }
                }
              },
              error => {
                this.loading = false;
                this.notif.onWarning('Alerta', 'Número de documento incorrecto.');
              }
            );
          } else {
            this.validar = false;
            const CedulaDigitada = this.TerminoForm.get('DocumentoBeneficiario')?.value;
            this.dataObjetBeneficiarios.forEach(elementB => {
              if (elementB.NumeroDocumento === CedulaDigitada) {
                this.validar = true;
              }
            });
            if (this.validar) {
              this.notif.onWarning('Advertencia', 'El beneficiario ya fue ingresado.');
              this.TerminoForm.get('DocumentoBeneficiario')?.reset();
              this.clearBeneficiario();
            } else {
              this.TerminoService.BuscarBeneficiario(this.TerminoForm.get('DocumentoBeneficiario')?.value).subscribe(
                result => {
                  if (result != null && result.Mensaje != null && (result.Mensaje == "Gerencia de desarrollo." || result.Mensaje == "Oficial de cumplimiento."))
                    this.AlertVetado(result.Mensaje);
                  else if (result === null) {
                    const PrimerNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                    const SegundoNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                    const PrimerApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
                    const SegundoApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);

                    this.TerminoForm.removeControl("PrimerNombre");
                    this.TerminoForm.removeControl("SegundoNombre");
                    this.TerminoForm.removeControl("PrimerApellido");
                    this.TerminoForm.removeControl("SegundoApellido");

                    this.TerminoForm.addControl("PrimerNombre", PrimerNombre);
                    this.TerminoForm.addControl("SegundoNombre", SegundoNombre);
                    this.TerminoForm.addControl("PrimerApellido", PrimerApellido);
                    this.TerminoForm.addControl("SegundoApellido", SegundoApellido);
                    this.loading = false;
                    this.notif.onWarning('Advertencia', 'No se encontró el beneficiario. Ingrese los datos para crearlo.');
                    this.bloquearNombreBenf = null;
                    this.bloquearDocumentoBenf = true;

                    this.TerminoForm.get('PrimerNombre')?.reset();
                    this.TerminoForm.get('SegundoNombre')?.reset();
                    this.TerminoForm.get('PrimerApellido')?.reset();
                    this.TerminoForm.get('SegundoApellido')?.reset();
                    this.TerminoForm.get('Porcentaje')?.reset();
                    this.TerminoForm.get('DatosParentesco')?.reset();
                    this.TerminoForm.get('Porcentaje')?.enable();
                    this.TerminoForm.get('DatosParentesco')?.enable();
                  } else {
                    if (result.IdEstado === 32) {
                      this.notif.onWarning('Alerta', 'Beneficiario con estado fallecido.');
                      this.TerminoForm.get('DocumentoBeneficiario')?.reset();

                    } else {
                      const PrimerNombre = new FormControl('');
                      const SegundoNombre = new FormControl('');
                      const PrimerApellido = new FormControl('');
                      const SegundoApellido = new FormControl('');

                      this.TerminoForm.removeControl("PrimerNombre");
                      this.TerminoForm.removeControl("SegundoNombre");
                      this.TerminoForm.removeControl("PrimerApellido");
                      this.TerminoForm.removeControl("SegundoApellido");

                      this.TerminoForm.addControl("PrimerNombre", PrimerNombre);
                      this.TerminoForm.addControl("SegundoNombre", SegundoNombre);
                      this.TerminoForm.addControl("PrimerApellido", PrimerApellido);
                      this.TerminoForm.addControl("SegundoApellido", SegundoApellido);
  
                      this.bloquearDocumentoBenf = true;
                      this.TerminoForm.get('PrimerNombre')?.setValue(result.PrimerNombre);
                      this.TerminoForm.get('SegundoNombre')?.setValue(result.SegundoNombre);
                      this.TerminoForm.get('PrimerApellido')?.setValue(result.PrimerApellido);
                      this.TerminoForm.get('SegundoApellido')?.setValue(result.SegundoApellido);
                      this.TerminoForm.get('IdTipoDocumento')?.setValue(result.IdTipoDocumento);
                      this.TerminoForm.get('Porcentaje')?.setValue("");
                      this.TerminoForm.get('DatosParentesco')?.setValue("");
                      this.TerminoForm.get('Porcentaje')?.enable();
                      this.TerminoForm.get('DatosParentesco')?.enable();
                      this.bloquearNombreBenf = false;
                    }
                  }
                },
                error => {
                  const errorMessage = <any>error;
                  this.notif.onDanger('Error', errorMessage);
                  console.log(errorMessage);
                }
              );
            }
          }
        } else {
          this.notif.onWarning('Advertencia', 'El beneficiario debe ser diferente al titular.');
          this.TerminoForm.get('DocumentoBeneficiario')?.reset();
        }
      }
    }
  }
  AlertVetado(Mensaje: string) {
    this.bloquearNombreBenf = false;
    this.bloquearDocumentoBenf = false;
    this.TerminoForm.get('PrimerNombre')?.reset();
    this.TerminoForm.get('SegundoNombre')?.reset();
    this.TerminoForm.get('PrimerApellido')?.reset();
    this.TerminoForm.get('SegundoApellido')?.reset();
    this.TerminoForm.get('IdTipoDocumento')?.reset();
    this.TerminoForm.get('Porcentaje')?.setValue("");
    this.TerminoForm.get('DatosParentesco')?.setValue("");
    this.TerminoForm.get('Porcentaje')?.disable();
    this.TerminoForm.get('DatosParentesco')?.disable();
    this.TerminoForm.get('DocumentoBeneficiario')?.setValue("");
    this.TerminoForm.get('CesionTituloDocumento')?.setValue("");
    this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
    this.TerminoForm.controls["CesionTituloNombre"].setValue("");
    swal.fire({
      title: '<strong>! Advertencia ¡</strong>',
      text: '',
      icon: 'error',
      animation: false,
      html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
        + Mensaje + '.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: 'rgb(160, 0, 87)'
    });
  }
  clearBeneficiario() {
    this.TerminoForm.get('DocumentoBeneficiario')?.reset();
    this.TerminoForm.get('DatosParentesco')?.reset();
    this.TerminoForm.get('PrimerApellido')?.reset();
    this.TerminoForm.get('SegundoApellido')?.reset();
    this.TerminoForm.get('PrimerNombre')?.reset();
    this.TerminoForm.get('SegundoNombre')?.reset();
    this.TerminoForm.get('Porcentaje')?.reset();
    this.TerminoForm.get('IdTipoDocumento')?.reset();
    this.TerminoForm.get('DocumentoBeneficiario')?.enable();
    this.indexBeneficiarios = -1;
  }
  ValidacionPuntoComa($event : any) {
    const Numero = $event;
    const key = Numero.keyCode;

    if (key === 46 || key === 44) {
      Numero.preventDefault();
    }
  }
  ValidarDocumento() {
    const valor = this.TerminoForm.get('DocumentoBeneficiario')?.value;
    if (valor < 0 || valor === null) {
      this.TerminoForm.get('DocumentoBeneficiario')?.setValue(0);
    }
    if (this.TerminoForm.get('DocumentoBeneficiario')?.valid === false) {
      this.TerminoForm.get('IdTipoDocumento')?.reset();
      this.TerminoForm.get('DocumentoBeneficiario')?.reset();
      this.TerminoForm.get('PrimerApellido')?.reset();
      this.TerminoForm.get('SegundoApellido')?.reset();
      this.TerminoForm.get('PrimerNombre')?.reset();
      this.TerminoForm.get('SegundoNombre')?.reset();
      this.TerminoForm.get('DatosParentesco')?.reset();
      this.TerminoForm.get('Porcentaje')?.reset();
    }
  }
  NombresCapitaliceBasico() {
    let self = this;
    $('#priApe').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
    $('#segApe').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
    $('#priNom').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
    $('#segNom').keyup(function () {
      $(self).val($(self).val().substr(0, 1).toUpperCase() + $(self).val().substr(1).toLowerCase());
    });
  }
  validarValorCampo(campoJquery : string, campoAngular : string) {
    const lentghCampo = $('#' + campoJquery + '').val();
    if (lentghCampo.length > 0) {
      if ($('#' + campoJquery + '').val().trim() === '') {
        this.notif.onWarning('Advertencia', 'El campo no puede contener espacios.');
        this.TerminoForm.get('' + campoAngular + '')?.reset();
      }
    }
    if (!this.TerminoForm.controls[campoAngular].valid)
      this.TerminoForm.controls[campoAngular].setValue("");
  }
  Parentesco() {
    this.loading = true;
    this.TerminoService.Parentesco().subscribe(
      result => {
        this.loading = false;
        this.resultParentesco = result;
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  ValidarNumero() {
    const valor = this.TerminoForm.get('Porcentaje')?.value;
    if (valor < 0 || valor === null) {
      this.TerminoForm.get('Porcentaje')?.setValue(0);
    }
  }
  AgregarBeneficiario() {
    if (this.TerminoForm.controls['PrimerNombre'].valid == false
      || this.TerminoForm.controls['SegundoNombre'].valid == false
      || this.TerminoForm.controls['PrimerApellido'].valid == false
      || this.TerminoForm.controls['SegundoApellido'].valid == false)
    {
      this.notif.onWarning('Advertencia', 'Datos incorrectos.');
      return;
    } 
    let Accion: string = "Crear";
    let IdBeneficiario: number = 0;
    let fechaMatricula = formatDate(new Date(), 'yyyy/MM/dd  HH:mm', 'en'); 
    if (this.TerminoForm.get('DatosParentesco')?.value !== null
      && this.TerminoForm.get('DatosParentesco')?.value !== undefined
      && this.TerminoForm.get('DatosParentesco')?.value !== ''
      && this.TerminoForm.get('Porcentaje')?.value !== null
      && this.TerminoForm.get('Porcentaje')?.value !== undefined
      && this.TerminoForm.get('Porcentaje')?.value !== ''
      && this.TerminoForm.get('DocumentoBeneficiario')?.value !== null
      && this.TerminoForm.get('DocumentoBeneficiario')?.value !== undefined
      && this.TerminoForm.get('DocumentoBeneficiario')?.value !== ''
      && ((this.TerminoForm.get('PrimerApellido')?.value !== null && this.TerminoForm.get('PrimerApellido')?.value !== undefined && this.TerminoForm.get('PrimerApellido')?.value !== '') || this.TerminoForm.get('IdTipoDocumento')?.value == 3)
      && this.TerminoForm.get('PrimerNombre')?.value !== null
      && this.TerminoForm.get('PrimerNombre')?.value !== undefined
      && this.TerminoForm.get('PrimerNombre')?.value !== ''
      && this.TerminoForm.get('IdTipoDocumento')?.value !== null
      && this.TerminoForm.get('IdTipoDocumento')?.value !== undefined
      && this.TerminoForm.get('IdTipoDocumento')?.value !== '') {
      if (!(this.TerminoForm.get('Porcentaje')?.value > 0)) {
        this.notif.onWarning('Advertencia', 'El porcentaje debe ser mayor que 0.');
        return;
      }
      if (this.indexBeneficiarios != -1) {
        if (this.dataObjetBeneficiarios[this.indexBeneficiarios].Porcentaje == this.TerminoForm.get('Porcentaje')?.value && this.dataObjetBeneficiarios[this.indexBeneficiarios].DatosParentesco == this.TerminoForm.get('DatosParentesco')?.value && this.dataObjetBeneficiarios[this.indexBeneficiarios].NumeroDocumento == this.TerminoForm.get('DocumentoBeneficiario')?.value) {
          this.notif.onWarning('Advertencia', ' Debe cambiar el beneficiario.');
          return;
        }
        if (this.dataObjetBeneficiarios[this.indexBeneficiarios].Accion == "DB" || this.dataObjetBeneficiarios[this.indexBeneficiarios].Accion == "Actualizar") {
          IdBeneficiario = this.dataObjetBeneficiarios[this.indexBeneficiarios].IdBeneficiarioTermino;
          Accion = "Actualizar";
          fechaMatricula = this.dataObjetBeneficiarios[this.indexBeneficiarios].FechaMatricula
        }
        let tempList: any[] = this.dataObjetBeneficiarios;
        tempList = tempList.filter(( x: any) => x != this.dataObjetBeneficiarios[this.indexBeneficiarios])
        let Sum: number = 0;
        tempList.forEach(( element : any) => {
          Sum = Sum + +element.Porcentaje;
        });
        Sum = Sum + +this.TerminoForm.get('Porcentaje')?.value;
        if (Sum > 100) {
          this.notif.onWarning('Advertencia', 'La suma del porcentaje supera el 100%.');
          return
        }
        this.dataObjetBeneficiarios.splice(this.indexBeneficiarios, 1);
      }
      let totalSuma = 0;
      let sumaPorcentaje = 0;
      if (this.TerminoForm.get('Porcentaje')?.value === 0) {
        this.notif.onWarning('Advertencia', 'El porcentaje debe tener un valor diferente a cero (0).');
      } else {

        this.dataObjetBeneficiarios.forEach(( element : any) => {
          sumaPorcentaje = sumaPorcentaje + +element.Porcentaje;
        });
        totalSuma = sumaPorcentaje + +this.TerminoForm.get('Porcentaje')?.value;
        if (totalSuma <= 100) {
          this.btnActualizarBeneficiarios = true;
          this.dataObjetBeneficiarios.push({
            'Accion': Accion,
            'IdCuenta': Number(this.TerminoForm.get('IdCuenta')?.value),
            'IdBeneficiarioTermino': IdBeneficiario,
            'IdTipoDocumento': Number(this.TerminoForm.get('IdTipoDocumento')?.value),
            'DescripcionTipoDocumento': this.resultTipoDocumento.filter(( x: any) => x.Clase == this.TerminoForm.get('IdTipoDocumento')?.value)[0].Descripcion,
            'NumeroDocumento': this.TerminoForm.get('DocumentoBeneficiario')?.value,
            'Porcentaje': this.TerminoForm.get('Porcentaje')?.value,
            'PrimerNombre': this.TerminoForm.get('PrimerNombre')?.value,
            'SegundoNombre': this.TerminoForm.get('SegundoNombre')?.value,
            'PrimerApellido': this.TerminoForm.get('PrimerApellido')?.value,
            'SegundoApellido': this.TerminoForm.get('SegundoApellido')?.value,
            'IdParentesco': this.TerminoForm.get('DatosParentesco')?.value,
            'DatosParentesco': this.resultParentesco.filter(( x: any) => x.Clase == this.TerminoForm.get('DatosParentesco')?.value)[0].Descripcion,
            'FechaMatricula': fechaMatricula
          });
          this.indexBeneficiarios = -1;
          this.clearBeneficiario();
          this.bloquearNombreBenf = false;
          this.bloquearbtnActalizar = true;
          this.bloquearDocumentoBenf = false;
          this.TerminoForm.get('DocumentoBeneficiario')?.enable();
          this.TerminoForm.get('DatosParentesco')?.disable();
          this.TerminoForm.get('Porcentaje')?.disable();
          this.TerminoForm.get('IdTipoDocumento')?.disable();
        } else {
          this.notif.onWarning('Advertencia', 'La suma del porcentaje supera el 100%.');
        }
        this.clearTitulares();
      }
    } else {
      this.notif.onWarning('Advertencia', 'Los datos están incompletos.');
    }
  }
  LimpiarBeneficiarior() {
    if (this.dataObjetBeneficiarios.filter(( x: any) => x.Accion == "Actualizar" || x.Accion == "Crear")[0] != null)
      this.btnActualizarBeneficiarios = true;

    this.indexBeneficiarios = -1;
    this.clearBeneficiario();
  }
  btnActualizarBeneficiarios: boolean = false;
  ActualizarBeneficiaroios() {
    let sum: any = 0;
    this.dataObjetBeneficiarios.forEach(( x: any) => { sum = sum + Number(x.Porcentaje) });
    if (sum != 100 && this.dataObjetBeneficiarios.length > 0) {
      this.notif.onWarning('Advertencia', 'La suma del porcentaje debe ser igual al 100%.');
      return;
    }
    this.loading = true;
    this.btnActualizarBeneficiarios = false;
    this.BenificiariosElminar.forEach(( x: any) => this.dataObjetBeneficiarios.push(x));
    this.TerminoService.ActualizarBeneficiarios(this.dataObjetBeneficiarios).subscribe(( x: any) => {
      this.bloquearDocumentoBenf = false;
      this.btnActualizarBeneficiario = true;
      this.notif.onSuccess('Exitoso', 'Se adicionó y/o eliminó beneficiario correctamente.');
      this.btnOpcionActualizarBeneficiario = true;
      this.clearBeneficiario();
      let beneficiariosLog: any[] = [];
      this.dataObjetBeneficiarios.forEach(( x: any) => {
        beneficiariosLog.push({
          Accion: x.Accion == "Crear" ? "Adicionar" : x.Accion,
          TipoDocumento: x.DescripcionTipoDocumento,
          Documento: x.NumeroDocumento,
          Nombre: x.PrimerApellido + " " + (x.SegundoApellido == null ? '' : x.SegundoApellido) + " " + x.PrimerNombre + " " + (x.SegundoNombre == null ? '':x.SegundoNombre),
          Porcentaje: x.Porcentaje + "%",
          Parentesco: x.DatosParentesco.Descripcion == null ? x.DatosParentesco : x.DatosParentesco.Descripcion,
          FechaMatricula: new DatePipe('en-CO').transform(x.FechaMatricula, 'yyyy/MM/dd  HH:mm:ss')
        });
      });
      beneficiariosLog = beneficiariosLog.filter(( x: any) => x.Accion != "DB");
      beneficiariosLog.forEach(( x: any) => {
        if (x.Accion == "Adicionar" || x.Accion == "Actualizar")
          delete x.FechaMatricula;
      });
      this.Guardarlog(beneficiariosLog);
      this.TerminoOperacionForm.get('Codigo')?.reset();
      setTimeout(() => {
        this.ObtenerHistorial();
        this.BuscarPorCuenta();
      }, 300);
      this.TerminoForm.get('DocumentoBeneficiario')?.disable();
      this.loading = false;
      this.BenificiariosElminar = [];
      this.dataObjetBeneficiarios = [];
    }, err => {
      this.loading = false;
      const errorMessage = <any>err;
      this.notif.onDanger('Error', errorMessage);
      console.log(errorMessage);
      this.BenificiariosElminar = [];
      this.dataObjetBeneficiarios = this.dataObjetBeneficiarios.filter(( x: any) => x.Accion != "Eliminar");
    })
  }
  IndiceAEliminarBenf(index : number) {
    if (this.dataObjetBeneficiarios[index].Accion == "DB" || this.dataObjetBeneficiarios[index].Accion == "Actualizar")
      this.BenificiariosElminar.push({
        'Accion': "Eliminar",
        'IdBeneficiarioTermino': this.dataObjetBeneficiarios[index].IdBeneficiarioTermino,
        'NumeroDocumento': this.dataObjetBeneficiarios[index].NumeroDocumento,
        'Porcentaje': this.dataObjetBeneficiarios[index].Porcentaje,
        'PrimerNombre': this.dataObjetBeneficiarios[index].PrimerNombre,
        'SegundoNombre': this.dataObjetBeneficiarios[index].SegundoNombre,
        'PrimerApellido': this.dataObjetBeneficiarios[index].PrimerApellido,
        'SegundoApellido': this.dataObjetBeneficiarios[index].SegundoApellido,
        'DatosParentesco': this.resultParentesco.filter(( x: any) => x.Clase == this.dataObjetBeneficiarios[index].IdParentesco)[0].Descripcion,
        'FechaMatricula' : this.dataObjetBeneficiarios[index].FechaMatricula
      });

    this.btnActualizarBeneficiarios = true;
    this.dataObjetBeneficiarios.splice(index, 1);
    this.bloquearbtnActalizar = true;
    this.indexBeneficiarios = -1;
    this.bloquearDocumentoBenf = true;
  }
  IndiceAEditarBenf(index : number, datos : any) {
    this.btnActualizarBeneficiarios = false;
    this.TerminoForm.get('IdTipoDocumento')?.setValue(datos.IdTipoDocumento);
    this.TerminoForm.get('DocumentoBeneficiario')?.setValue(datos.NumeroDocumento);
    this.TerminoForm.get('PrimerApellido')?.setValue(datos.PrimerApellido);
    this.TerminoForm.get('SegundoApellido')?.setValue(datos.SegundoApellido);
    this.TerminoForm.get('PrimerNombre')?.setValue(datos.PrimerNombre);
    this.TerminoForm.get('SegundoNombre')?.setValue(datos.SegundoNombre);
    this.TerminoForm.get('PrimerNombre')?.setValue(datos.PrimerNombre);

    this.TerminoForm.get('DatosParentesco')?.setValue(datos.IdParentesco);
    this.TerminoForm.get('Porcentaje')?.setValue(datos.Porcentaje);
    this.TerminoForm.get('DatosParentesco')?.enable();
    this.TerminoForm.get('Porcentaje')?.enable();
    this.TerminoForm.get('DocumentoBeneficiario')?.disable();
    this.bloquearNombreBenf = false;
    this.indexBeneficiarios = index;
    this.bloquearDocumentoBenf = true;
  }
  // AUTORIZADO
  BloquearAutorizadoTituloInput(tipo: number) {
    if (tipo == 1) {
      this.TerminoForm.controls["DocumentoTitular"].disable();
      this.TerminoForm.controls["NombreTitular"].disable();
      this.TerminoForm.controls["Tipo"].disable();
      this.TerminoForm.controls["TipoFirma"].disable();
    } else {
      this.TerminoForm.controls["DocumentoTitular"].enable();
      this.TerminoForm.controls["NombreTitular"].enable();
      this.TerminoForm.controls["Tipo"].enable();
      this.TerminoForm.controls["TipoFirma"].enable();
    }

  }
  BuscarTitularDocumento() {
    if (this.TerminoForm.get('DocumentoTitular')?.value !== null
      && this.TerminoForm.get('DocumentoTitular')?.value !== undefined
      && this.TerminoForm.get('DocumentoTitular')?.value !== '') {
      if (this.TerminoForm.get('NumeroDocumento')?.value !== this.TerminoForm.get('DocumentoTitular')?.value.trim()) {
        if (this.dataObjetTitulares.length == 0) {
          this.loading = true;
          this.TerminoService.BuscarTitular(this.TerminoForm.get('DocumentoTitular')?.value, '*').subscribe(
            result => {
              this.loading = false;
              if (result === null) {
                this.notif.onWarning('Alerta', 'No se encontró el registro.');
                this.TerminoForm.get('DocumentoTitular')?.reset();
              } else if (result.IdRelacion === 10) {
                this.notif.onWarning('Alerta', 'El autorizado no puede ser menor.');
                this.TerminoForm.get('DocumentoTitular')?.reset();
              } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                this.TerminoForm.get('DocumentoTitular')?.reset();
                if (result.Mensaje === 'Gerencia de desarrollo.') {
                  swal.fire({
                    title: '<strong>! Advertencia ¡</strong>',
                    text: '',
                    icon: 'error',
                    animation: false,
                    html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                      + result.Mensaje + '.',
                    
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
                    
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  });
                } else {
                  if (result.IdEstado === 32) {
                    this.notif.onWarning('Alerta', 'Autorizado con estado fallecido.');
                    this.TerminoForm.get('DocumentoTitular')?.reset();
                  } else {
                    this.bloquearDatosTitulares = null;
                    this.TerminoForm.get('DocumentoTitular')?.setValue(result.Documento);
                    this.TerminoForm.get('NombreTitular')?.setValue(result.PrimerApellido + ' ' +
                      result.SegundoApellido + ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
                  }
                }
              }
            },
            error => {
              this.loading = false;
              this.notif.onWarning('Alerta', 'Número de documento incorrecto.');
            }
          );
        } else {
          this.validar = false;
          const CedulaDigitada = this.TerminoForm.get('DocumentoTitular')?.value.trim();
          this.dataObjetTitulares.forEach(elementB => {
            if (elementB.Documento === CedulaDigitada) {
              this.validar = true;
            }
          });
          if (this.validar) {
            this.notif.onWarning('Advertencia', 'El autorizado ya fue ingresado.');
            this.TerminoForm.get('DocumentoTitular')?.reset();
            this.clearTitulares();
          } else {
            this.loading = true;
            this.TerminoService.BuscarTitular(this.TerminoForm.get('DocumentoTitular')?.value, '*').subscribe(
              result => {
                this.loading = false;
                if (result === null) {
                  this.notif.onWarning('Alerta', 'No se encontró el registro.');
                  this.TerminoForm.get('DocumentoTitular')?.reset();
                } else if (result.IdRelacion === 10) {
                  this.notif.onWarning('Alerta', 'El autorizado no puede ser menor.');
                  this.TerminoForm.get('DocumentoTitular')?.reset();
                } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                  this.TerminoForm.get('DocumentoTitular')?.reset();
                  if (result.Mensaje === 'Gerencia de desarrollo.') {
                    swal.fire({
                      title: '<strong>! Advertencia ¡</strong>',
                      text: '',
                      icon: 'error',
                      animation: false,
                      html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                        + result.Mensaje + '.',
                      
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
                      
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor: 'rgb(160, 0, 87)'
                    });
                  } else {
                    if (result.IdEstado === 32) {
                      this.notif.onWarning('Alerta', 'Autorizado con estado fallecido.');
                      this.TerminoForm.get('DocumentoTitular')?.reset();
                    } else {
                      this.bloquearDatosTitulares = null;
                      this.TerminoForm.get('DocumentoTitular')?.setValue(result.Documento);
                      this.TerminoForm.get('NombreTitular')?.setValue(result.PrimerApellido + ' ' +
                        result.SegundoApellido + ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
                    }
                  }
                }
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.log(errorMessage);
              }
            );
          }
        }
      } else {
        this.notif.onWarning('Alerta', 'El autorizado debe ser diferente al titular.');
        this.clearTitulares();
      }
    }
  }
  clearTitulares() {
    this.TerminoForm.controls["DocumentoTitular"].enable();
    this.TerminoForm.controls["NombreTitular"].enable();
    this.btnOpcionesActualizarTitulares = false;
    this.TerminoForm.get('DocumentoTitular')?.reset();
    this.TerminoForm.get('NombreTitular')?.reset();
    this.TerminoForm.get('Tipo')?.reset();
    this.TerminoForm.get('TipoFirma')?.reset();
    this.TerminoForm.get('Observacion')?.setValue('');
    this.DescriTipoFirma = true;
    this.bloquearDatosTitulares = false;
  }
  BuscarTitularNombre() {
    if (this.TerminoForm.get('NombreTitular')?.value !== null
      && this.TerminoForm.get('NombreTitular')?.value !== undefined
      && this.TerminoForm.get('NombreTitular')?.value !== '') {
      if (this.dataObjetTitulares.length == 0) {
        this.loading = true;
        this.TerminoService.BuscarTitular('*', this.TerminoForm.get('NombreTitular')?.value).subscribe(
          result => {
            this.loading = false;
            if (result.length === 0) {
              this.notif.onWarning('Alerta', 'No se encontró el registro.');
            } else if (result.length > 1) {
              this.resultTitulares = result;
              this.ModalTitulares.nativeElement.click();
              this.TerminoForm.get('NombreTitular')?.reset();
            } else if (result === null) {
              this.notif.onWarning('Alerta', 'No se encontró el registro.');
            } else {
              if (result.IdRelacion === 10) {
                this.notif.onWarning('Alerta', 'El autorizado no puede ser menor.');
              } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                if (result.Mensaje === 'Gerencia de desarrollo.') {
                  swal.fire({
                    title: '<strong>! Advertencia ¡</strong>',
                    text: '',
                    icon: 'error',
                    animation: false,
                    html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                      + result.Mensaje + '.',
                    
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
                    
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  });
                } else {
                  if (result.IdEstado === 32) {
                    this.notif.onWarning('Alerta', 'Autorizado con estado fallecido.');
                    this.TerminoForm.get('DocumentoTitular')?.reset();
                  } else {
                    if (this.TerminoForm.get('NumeroDocumento')?.value !== result.Documento) {
                      this.bloquearDatosTitulares = null;
                      this.TerminoForm.get('DocumentoTitular')?.setValue(result.Documento);
                      this.TerminoForm.get('NombreTitular')?.setValue(result.PrimerApellido + ' ' +
                        result.SegundoApellido + ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
                    } else {
                      this.notif.onWarning('Alerta', 'El autorizado debe ser diferente al titular.');
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
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );

      } else {
        this.loading = true;
        this.TerminoService.BuscarTitular('*', this.TerminoForm.get('NombreTitular')?.value).subscribe(
          result => {
            this.loading = false;
            if (result.length === 0) {
              this.notif.onWarning('Alerta', 'No se encontró el registro.');
            } else if (result.length > 1) {
              this.resultTitulares = result;
              this.ModalTitulares.nativeElement.click();
              this.TerminoForm.get('NombreTitular')?.reset();
            } else if (result === null) {
              this.notif.onWarning('Alerta', 'No se encontró el registro.');
            } else {
              if (result.IdRelacion === 10) {
                this.notif.onWarning('Alerta', 'El autorizado no puede ser menor.');
              } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
                if (result.Mensaje === 'Gerencia de desarrollo.') {
                  swal.fire({
                    title: '<strong>! Advertencia ¡</strong>',
                    text: '',
                    icon: 'error',
                    animation: false,
                    html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                      + result.Mensaje + '.',
                    
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
                    
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'rgb(160, 0, 87)'
                  });
                } else {
                  if (result.IdEstado === 32) {
                    this.notif.onWarning('Alerta', 'Autorizado con estado fallecido.');
                    this.TerminoForm.get('DocumentoTitular')?.reset();
                  } else {
                    if (this.TerminoForm.get('NumeroDocumento')?.value !== result.Documento) {
                      this.validar = false;
                      const CedulaDigitada = result.Documento;
                      this.dataObjetTitulares.forEach(elementB => {
                        if (elementB.Documento === CedulaDigitada) {
                          this.validar = true;
                        }
                      });
                      if (this.validar) {
                        this.notif.onWarning('Advertencia', 'El autorizado ya fue ingresado.');
                        this.TerminoForm.get('DocumentoTitular')?.reset();
                        this.clearTitulares();
                      } else {
                        this.bloquearDatosTitulares = null;
                        this.TerminoForm.get('DocumentoTitular')?.setValue(result.Documento);
                        this.TerminoForm.get('NombreTitular')?.setValue(result.PrimerApellido + ' ' +
                          result.SegundoApellido + ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
                      }
                    } else {
                      this.notif.onWarning('Alerta', 'El autorizado debe ser diferente al titular.');
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
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
      }
    }
  }
  BuscarTitularModal(Documento = '*') {
    const Nombre = '*';
    this.loading = true;
    this.TerminoService.BuscarTitular(Documento, Nombre).subscribe(
      result => {
        this.loading = false;
        if (result === null) {
          this.notif.onWarning('Alerta', 'No se encontró el registro.');
        } else if (result.IdRelacion === 10) {
          this.notif.onWarning('Alerta', 'El autorizado no puede ser menor.');
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          if (result.Mensaje === 'Gerencia de desarrollo.') {
            swal.fire({
              title: '<strong>! Advertencia ¡</strong>',
              text: '',
              icon: 'error',
              animation: false,
              html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                + result.Mensaje + '.',
              
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
              
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: 'rgb(160, 0, 87)'
            });
          } else {
            if (result.IdEstado === 32) {
              this.notif.onWarning('Alerta', 'El autorizado con estado fallecido.');
              this.TerminoForm.get('DocumentoTitular')?.reset();
            }
            else if (this.TerminoForm.get('NumeroDocumento')?.value !== result.Documento.trim()) {
              this.validar = false;
              const CedulaDigitada = result.Documento;
              this.dataObjetTitulares.forEach(elementB => {
                if (elementB.Documento === CedulaDigitada) {
                  this.validar = true;
                }
              });
              if (this.validar) {
                this.notif.onWarning('Advertencia', 'El autorizado ya fue ingresado.');
                this.TerminoForm.get('DocumentoTitular')?.reset();
                this.clearTitulares();
              } else {
                this.bloquearDatosTitulares = null;
                this.TerminoForm.get('DocumentoTitular')?.setValue(result.Documento);
                this.TerminoForm.get('NombreTitular')?.setValue(result.PrimerApellido + ' ' +
                  result.SegundoApellido + ' ' + result.PrimerNombre + ' ' + result.SegundoNombre);
              }
            } else {
              this.notif.onWarning('Alerta', 'El autorizado debe ser diferente al titular.');
              this.clearTitulares();
            }
          }
        }
      },
      error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  Autorizado() {
    this.TerminoForm.get('Tipo')?.setValue('A');
  }
  FirmaSeleccionada() {
    const data = this.TerminoForm.get('TipoFirma')?.value;
    if (data === 'Otro') {
      this.DescriTipoFirma = false;
      this.TerminoForm.get('Observacion')?.setValue('');
    } else {
      this.DescriTipoFirma = true;
      this.TerminoForm.get('Observacion')?.setValue('');
    }
  }
  TipoFirma() {
    this.TerminoService.TipoFirma().subscribe(
      result => {
        this.resultTipoFirma = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  AgregarTitulares() {
    let Accion: string = "Adicionar";
    let FechaMatricula = formatDate(new Date(), 'yyyy/MM/dd  HH:mm', 'en'); 
    if (this.TerminoForm.get('DocumentoTitular')?.value !== null
      && this.TerminoForm.get('DocumentoTitular')?.value !== undefined
      && this.TerminoForm.get('DocumentoTitular')?.value !== ''
      && this.TerminoForm.get('NombreTitular')?.value !== null
      && this.TerminoForm.get('NombreTitular')?.value !== undefined
      && this.TerminoForm.get('NombreTitular')?.value !== ''
      && this.TerminoForm.get('Tipo')?.value !== null
      && this.TerminoForm.get('Tipo')?.value !== undefined
      && this.TerminoForm.get('Tipo')?.value !== ''
      && this.TerminoForm.get('TipoFirma')?.value !== null
      && this.TerminoForm.get('TipoFirma')?.value !== undefined
      && this.TerminoForm.get('TipoFirma')?.value !== '') {
      
      this.TerminoForm.controls["DocumentoTitular"].enable();
      this.TerminoForm.controls["NombreTitular"].enable();
      this.btnOpcionesActualizarTitulares = false;
      if (this.indexAutorizado !== -1) {

        let temp: string[] = this.dataObjetTitulares[this.indexAutorizado].TipoFirma.toString().split(':  ');
        if (temp.length == 1) {
          temp.push('')
        }

        if (this.dataObjetTitulares[this.indexAutorizado].Documento == this.TerminoForm.get('DocumentoTitular')?.value
          && this.dataObjetTitulares[this.indexAutorizado].Nombre == this.TerminoForm.get('NombreTitular')?.value
          && this.dataObjetTitulares[this.indexAutorizado].TipoTitular == this.TerminoForm.get('Tipo')?.value
          && temp[0] == this.TerminoForm.get('TipoFirma')?.value
          && temp[1].trim() == this.TerminoForm.get('Observacion')?.value.toString().trim()) {
          this.notif.onWarning('Advertencia', ' Debe cambiar el autorizado.');
          return;
        }
        if (this.dataObjetTitulares[this.indexAutorizado].Accion == "DB" || this.dataObjetTitulares[this.indexAutorizado].Accion == "Actualizar") {
          // FechaMatricula = this.dataObjetTitulares[this.indexAutorizado].FechaMatricula;
          Accion = "Actualizar";
        }
          
        this.dataObjetTitulares.splice(this.indexAutorizado, 1);

      }
      if (this.TerminoForm.get('Observacion')?.value === null) {
        this.TerminoForm.get('Observacion')?.setValue('');
      }
      if (this.dataObjetTitulares !== undefined) {

        var TipoFirmaFinal;
        if (this.TerminoForm.get('TipoFirma')?.value === 'Otro') {
          TipoFirmaFinal = this.TerminoForm.get('TipoFirma')?.value + ':  ' + this.TerminoForm.get('Observacion')?.value
        } else {
          TipoFirmaFinal = this.TerminoForm.get('TipoFirma')?.value;
        }

        this.dataObjetTitulares.push({
          'Accion': Accion,
          'Documento': this.TerminoForm.get('DocumentoTitular')?.value,
          'Nombre': this.TerminoForm.get('NombreTitular')?.value,
          'FechaMatricula': FechaMatricula,
          'TipoTitular': this.TerminoForm.get('Tipo')?.value,
          'TipoFirma': TipoFirmaFinal,
        });
        this.indexAutorizado = -1;
        this.bloquearBtnActualizarTitular = null;
        this.TerminoForm.get('Tipo')?.setValue(0);
        this.TerminoForm.get('Observacion')?.setValue('');
      } else {
        this.dataObjetTitulares = [];

        var TipoFirmaFinal;
        if (this.TerminoForm.get('TipoFirma')?.value === 'Otro') {
          TipoFirmaFinal = this.TerminoForm.get('TipoFirma')?.value + ':  ' + this.TerminoForm.get('Observacion')?.value
        } else {
          TipoFirmaFinal = this.TerminoForm.get('TipoFirma')?.value;
        }

        this.dataObjetTitulares.push({
          'Accion': Accion,
          'Documento': this.TerminoForm.get('DocumentoTitular')?.value,
          'Nombre': this.TerminoForm.get('NombreTitular')?.value,
          'FechaMatricula': FechaMatricula,
          'TipoTitular': this.TerminoForm.get('Tipo')?.value,
          'TipoFirma': TipoFirmaFinal,
        });
        this.indexAutorizado = -1;
        this.bloquearBtnActualizarTitular = null;
        this.TerminoForm.get('Tipo')?.setValue(0);
        this.TerminoForm.get('Observacion')?.setValue('');
      }
      this.clearTitulares();
    } else {
      this.notif.onWarning('Advertencia', 'Los datos están incompletos.');
    }
  }
  IndiceAEditar(index : number, datos : any) {
    this.TerminoForm.controls["DocumentoTitular"].disable();
    this.TerminoForm.controls["NombreTitular"].disable();
    this.btnOpcionesActualizarTitulares = true;
    let arrayTipoFirma: any[];
    this.bloquearDatosTitulares = null;
    this.bloquearBtnActualizarTitular = false;
    this.TerminoForm.get('DocumentoTitular')?.setValue(datos.Documento);
    this.TerminoForm.get('NombreTitular')?.setValue(datos.Nombre);
    this.TerminoForm.get('Tipo')?.setValue('A');
    arrayTipoFirma = datos.TipoFirma.split(': ');

    if (arrayTipoFirma[0] === 'Otro') {
      this.TerminoForm.get('TipoFirma')?.setValue(arrayTipoFirma[0]);
      this.TerminoForm.get('Observacion')?.setValue(arrayTipoFirma[1]);
      this.DescriTipoFirma = false;
    } else {
      this.TerminoForm.get('TipoFirma')?.setValue(arrayTipoFirma[0]);
      this.DescriTipoFirma = true;
    }
    this.indexAutorizado = index;
    this.bloquearBtnActualizarTitular = false;
    this.bloquearbtnCalcular = false;
  }
  listAutorizadoEliminar: any[] = [];
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
    this.bloquearBtnActualizarTitular = null;
    this.TerminoForm.controls["DocumentoTitular"].setValue("");
    this.TerminoForm.controls["NombreTitular"].setValue("");
    this.TerminoForm.controls["Tipo"].setValue("0");
    this.TerminoForm.controls["TipoFirma"].setValue("");
    this.TerminoForm.controls["Observacion"].setValue("");
    this.indexAutorizado = -1;
    this.DescriTipoFirma = true;
    this.bloquearDatosTitulares = false;
    this.bloquearBtnActualizarTitular = null;
  }
  // CESION TITULO
  BuscarPersonaCesionTituloBlur(tipo: number) {
    this.bloquearCesionTitulo = true;
    const DocCesion = this.TerminoForm.controls["CesionTituloDocumento"].value.trim();
    if (tipo == 1 && this.TerminoForm.controls["CesionTituloDocumento"].value != "") {
      if (!this.TerminoForm.controls['CesionTituloDocumento'].valid) {
        this.TerminoForm.controls['CesionTituloDocumento'].setValue("");
      } else if (DocCesion == this.TerminoForm.controls["NumeroDocumento"].value) {
        this.notif.onWarning('Advertencia', 'La persona debe ser diferente al titular.');
        this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
        this.TerminoForm.controls["CesionTituloNombre"].setValue("");
        this.TipoBuscadaPersonas = 0;
      } else if (this.dataObjetCesionTitulo.filter(( x: any) => x.NumeroDocumento == DocCesion)[0] != null) {
        this.notif.onWarning('Advertencia', 'La persona ya fue ingresada.');
        this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
        this.TerminoForm.controls["CesionTituloNombre"].setValue("");
        this.TipoBuscadaPersonas = 0;
      } else {
        this.ObtenerPersonasByDocumento(this.TerminoForm.controls["CesionTituloDocumento"].value);
        this.TipoBuscadaPersonas = tipo;
        this.TerminoForm.controls["CesionTituloNombre"].setValue("");
      }
    } else if (tipo == 2 && this.TerminoForm.controls["CesionTituloNombre"].value != "")
      this.TipoBuscadaPersonas = tipo;
  }
  BuscarPersonaCesionTitulo() {
    if (this.TipoBuscadaPersonas == 0 || (this.TerminoForm.controls["CesionTituloDocumento"].value == "" && this.TerminoForm.controls["CesionTituloNombre"].value == ""))
      this.notif.onWarning('Advertencia', 'No se ingresaron parametros de busqueda.');
    else if (this.TipoBuscadaPersonas == 1)
      this.BuscarPersonaCesionTituloBlur(1);
    else if (this.TipoBuscadaPersonas == 2) {
      this.ObtenerPersonasByNombre(this.TerminoForm.controls["CesionTituloNombre"].value);
    }
  }
  ObtenerPersonasByDocumento(doc: string) {
    this.loading = true;
    this.personaCesionTitylo = null;
    this.personaCesionTityloBool = false;
    this.TerminoService.ObtenerPersonasByDocumentoCesionTermino(doc).subscribe(( x: any) => {
      this.loading = false;
      if (x == null) {
        this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
        this.notif.onWarning('Advertencia', 'No se encuentra el documento.');
      } else if (x != null && x.Mensaje != null && (x.Mensaje == "Gerencia de desarrollo." || x.Mensaje == "Oficial de cumplimiento."))
        this.AlertVetado(x.Mensaje);
      else if (x.IdRelacion == 10)
        this.NoMenores();
      else {
        if (x.IdEstado == 32) {
          this.notif.onWarning('Alerta', 'Persona con estado fallecido.');
          this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
          this.TerminoForm.controls["CesionTituloNombre"].setValue("");
          this.TipoBuscadaPersonas = 0;
        } else {
          this.personaCesionTityloBool = true;
          this.personaCesionTitylo = x;
          this.TerminoForm.controls["CesionTituloNombre"].setValue(x.PrimerNombre + " " + x.SegundoNombre + " " + x.PrimerApellido + " " + x.SegundoApellido);
        }
      }
    }, err => {
      this.loading = false;
      this.notif.onWarning('Alerta', 'Número de documento incorrecto.');

    })
  }
  ListPersonaCesionTitylo: any[] = [];
  personaCesionTitylo: any = null;
  personaCesionTityloBool: boolean = false;
  ObtenerPersonasByNombre(nombre: string) {
    this.loading = true;
    this.personaCesionTitylo = null;
    this.personaCesionTityloBool = false;
    this.ListPersonaCesionTitylo = [];
    this.TerminoService.ObtenerPersonasByNombreCesionTermino(nombre).subscribe(( x: any) => {
      this.loading = false;

      if (x != null && x.Mensaje != null && (x.Mensaje == "Gerencia de desarrollo." || x.Mensaje == "Oficial de cumplimiento."))
        this.AlertVetado(x.Mensaje);
      else if (x.length == 0) {
        this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
        this.TerminoForm.controls["CesionTituloNombre"].setValue("");
        this.notif.onWarning('Advertencia', 'No se encontró registro.');
      } else if (x.length == 1 && x[0].IdRelacion == 10)
        this.NoMenores();
      else if (x.length == 1) {
        this.SeleccionPersonaCesionTitulo(x[0]);
      } else {
        this.ListPersonaCesionTitylo = x;
        this.ModalBuscarPersonasCesionTitulo.nativeElement.click();
      }
    }, err => {
      this.loading = false;
      const errorMessage = <any>err;
      this.notif.onDanger('Error', errorMessage);
      console.log(errorMessage);
    })
  }
  NoMenores() {
    this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
    this.TerminoForm.controls["CesionTituloNombre"].setValue("");
    this.notif.onWarning('Advertencia', ' La persona no puede ser menor.');
    return;
  }
  SeleccionPersonaCesionTitulo(persona: any) {
    if (persona.IdRelacion == 10)
      this.NoMenores();
    else if (persona.NumeroDocumento == this.TerminoForm.controls["NumeroDocumento"].value) {
      this.notif.onWarning('Advertencia', 'La persona debe ser diferente al titular.');
      this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
      this.TerminoForm.controls["CesionTituloNombre"].setValue("");
    } else if (this.dataObjetCesionTitulo.filter(( x: any) => x.NumeroDocumento == persona.NumeroDocumento)[0] != null) {
      this.notif.onWarning('Advertencia', 'La persona ya fue ingresada.');
      this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
      this.TerminoForm.controls["CesionTituloNombre"].setValue("");
      this.TipoBuscadaPersonas = 0;
      this.personaCesionTitylo = null;
      this.personaCesionTityloBool = false;
    } else
      this.BuscarVetado(persona.NumeroDocumento, persona, 1);
  }
  BuscarVetado(doc: string, persona: any, tipo: number) {
    this.loading = true;
    this.TerminoService.BuscarVetadoTermino(doc).subscribe(( x: any) => {
      this.loading = false;
      if (x != true && x.Mensaje != null && (x.Mensaje == "Gerencia de desarrollo." || x.Mensaje == "Oficial de cumplimiento."))
        this.AlertVetado(x.Mensaje);
      else if (x == true && tipo == 1) {
        if (persona.IdEstado == 32) {
          this.notif.onWarning('Alerta', 'Persona con estado fallecido.');
          this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
          this.TerminoForm.controls["CesionTituloNombre"].setValue("");
          this.TipoBuscadaPersonas = 0;
        } else {
          this.personaCesionTityloBool = true;
          this.personaCesionTitylo = persona;
          this.TerminoForm.controls["CesionTituloDocumento"].setValue(persona.NumeroDocumento);
          this.TerminoForm.controls["CesionTituloNombre"].setValue(persona.PrimerNombre + " " + persona.SegundoNombre + " " + persona.PrimerApellido + " " + persona.SegundoApellido);
        }
      }
    }, err => {
      this.loading = false;
      const errorMessage = <any>err;
      this.notif.onDanger('Error', errorMessage);
      console.log(errorMessage);
    })
  }
  indexCesionTitulo: any = null;
  AgregarCesionTitulo() {
    let Accion: string = "Crear";
    let IdCesionTitulo: number = 0;
    let FechaMatricula = formatDate(new Date(), 'yyyy/MM/dd  HH:mm:ss', 'en'); 
    if (this.indexCesionTitulo != null) {
      if (this.dataObjetCesionTitulo[this.indexCesionTitulo].NumeroDocumento == this.personaCesionTitylo.NumeroDocumento) {
        this.notif.onWarning('Advertencia', 'Debe cambiar la persona.');
        return;
      }
      if (this.dataObjetCesionTitulo[this.indexCesionTitulo].Accion == "DB" || this.dataObjetCesionTitulo[this.indexCesionTitulo].Accion == "Actualizar") {
        IdCesionTitulo = this.dataObjetCesionTitulo[this.indexCesionTitulo].IdCesionTitulo;
        Accion = "Actualizar";
        FechaMatricula = this.dataObjetCesionTitulo[this.indexCesionTitulo].FechaMatricula;
      }
      this.dataObjetCesionTitulo.splice(this.indexCesionTitulo, 1);
    }
    this.dataObjetCesionTitulo.push({
      'Accion': Accion,
      'IdCesionTitulo': IdCesionTitulo,
      'IdPersonas': this.personaCesionTitylo.IdPersonas,
      'IdCuenta': this.TerminoForm.get('IdCuenta')?.value,
      'IdTercero': this.personaCesionTitylo.IdTercero,
      'NumeroDocumento': this.personaCesionTitylo.NumeroDocumento,
      'PrimerNombre': this.personaCesionTitylo.PrimerNombre,
      'SegundoNombre': this.personaCesionTitylo.SegundoNombre,
      'PrimerApellido': this.personaCesionTitylo.PrimerApellido,
      'SegundoApellido': this.personaCesionTitylo.SegundoApellido,
      'FechaMatricula': FechaMatricula
    });
    this.TerminoForm.controls["CesionTituloNombre"].setValue("");
    this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
    this.indexCesionTitulo = null;
    this.personaCesionTitylo = null;
    this.personaCesionTityloBool = false;
    this.btnActualizarCesionTitulo = true;
  }
  CesionTituloEliminar: any[] = [];
  IndiceAEliminarCesionTitulo(index : number) {
    if (this.dataObjetCesionTitulo[index].Accion == "DB" || this.dataObjetCesionTitulo[index].Accion == "Actualizar")
      this.CesionTituloEliminar.push({
        'Accion': "Eliminar",
        'IdCesionTitulo': this.dataObjetCesionTitulo[index].IdCesionTitulo,
        'IdPersonas': this.dataObjetCesionTitulo[index].IdPersonas,
        'IdCuenta': this.dataObjetCesionTitulo[index].IdCuenta,
        'IdTercero': this.dataObjetCesionTitulo[index].IdTercero,
        'NumeroDocumento': this.dataObjetCesionTitulo[index].NumeroDocumento,
        'PrimerNombre': this.dataObjetCesionTitulo[index].PrimerNombre,
        'SegundoNombre': this.dataObjetCesionTitulo[index].SegundoNombre,
        'PrimerApellido': this.dataObjetCesionTitulo[index].PrimerApellido,
        'SegundoApellido': this.dataObjetCesionTitulo[index].SegundoApellido,
        'FechaMatricula': this.dataObjetCesionTitulo[index].FechaMatricula
      });
    this.LimpiarCesion();
    this.btnActualizarCesionTitulo = true;
    this.dataObjetCesionTitulo.splice(index, 1);
  }
  disableCesionTitulo: boolean = false;
  ActualizarCesionTitulo() {
    this.loading = true;
    this.btnActualizarCesionTitulo = false;
    this.CesionTituloEliminar.forEach(( x: any) => this.dataObjetCesionTitulo.push(x));
    this.TerminoService.ActualizarCesionTituloTermino(this.dataObjetCesionTitulo).subscribe(( x: any) => {
      this.notif.onSuccess('Exitoso', 'Se adicionó y/o eliminó cesion de CDAT.');
      this.TerminoForm.controls["CesionTituloNombre"].setValue("");
      this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
      this.TerminoForm.controls["CesionTituloDocumento"].disable();
      this.TerminoForm.controls["CesionTituloNombre"].disable();
      this.indexCesionTitulo = null;
      this.personaCesionTitylo = null;
      this.personaCesionTityloBool = false;
      this.bloquearCesionTitulo = false;
      this.disableCesionTitulo = false;
      let titularesLog: any[] = [];
      this.dataObjetCesionTitulo.forEach(( x: any) => {
        titularesLog.push({
          Accion: x.Accion == "Crear" ? "Adicionar" : x.Accion,
          Documento: x.NumeroDocumento,
          Nombre: x.PrimerApellido + " " + x.SegundoApellido + " " + x.PrimerNombre + " " + x.SegundoNombre,
          FechaMatricula: new DatePipe('en-CO').transform(x.FechaMatricula, 'yyyy/MM/dd  HH:mm:ss')
        });
      });
      titularesLog = titularesLog.filter(( x: any) => x.Accion != "DB");
      titularesLog.forEach(( x: any) => {
        if (x.Accion == "Adicionar" || x.Accion == "Actualizar")
          delete x.FechaMatricula;
      });
      this.Guardarlog(titularesLog);
      this.TerminoOperacionForm.get('Codigo')?.reset();
      setTimeout(() => {
        this.ObtenerHistorial();
        this.BuscarPorCuenta();
      }, 300);
      this.loading = false;
      this.CesionTituloEliminar = [];
      this.dataObjetCesionTitulo = [];
    }, err => {
      this.loading = false;
      const errorMessage = <any>err;
      this.notif.onDanger('Error', errorMessage);
      console.log(errorMessage);
      this.CesionTituloEliminar = [];
      this.dataObjetCesionTitulo = this.dataObjetCesionTitulo.filter(( x: any) => x.Accion != "Eliminar");
    })
  }
  LimpiarCesion() {
    this.TerminoForm.controls["CesionTituloNombre"].setValue("");
    this.TerminoForm.controls["CesionTituloDocumento"].setValue("");
    this.indexCesionTitulo = null;
    this.personaCesionTitylo = null;
    this.personaCesionTityloBool = false;
  }
  // RECIPROCIDAD
  btnActualizarBorrarReciprocidad: boolean = false;
  ListEliminaReciprocidad: any[] = [];
  ListBajarAHistorial: any[] = [];
  selectBorrarReciprocidad(reciprocidad : any, i : number) {
    this.btnActualizarBorrarReciprocidad = true;
    this.ListEliminaReciprocidad.push(reciprocidad);
    this.dataObjetReciprocidad = this.dataObjetReciprocidad.filter(( x: any) => x.IdReciprocidadTermino != reciprocidad.IdReciprocidadTermino);
  }
  selectBajarAHistorialReciprocidad(reciprocidad : any, i : any) {
    this.btnActualizarBorrarReciprocidad = true;
    this.ListBajarAHistorial.push(reciprocidad);
    this.dataObjetReciprocidad = this.dataObjetReciprocidad.filter(( x: any) => x.IdReciprocidadTermino != reciprocidad.IdReciprocidadTermino);
    this.dataObjetReciprocidadR.push(reciprocidad);
  }
  selectSubirDeHistorialReciprocidad(reciprocidad : any, i : number) {
    this.dataObjetReciprocidadR = this.dataObjetReciprocidadR.filter(( x: any) => x.IdReciprocidadTermino != reciprocidad.IdReciprocidadTermino);
    this.ListBajarAHistorial = this.ListBajarAHistorial.filter(( x: any) => x.IdReciprocidadTermino != reciprocidad.IdReciprocidadTermino);
    this.dataObjetReciprocidad.push(reciprocidad);
  }
  GetNumberToMoneda(num: number) {
    let strNumber : string = num.toLocaleString('es-CO');
    const strSplit : string[] = strNumber.split('.');
    let strResult : string = "";
        strSplit.forEach((x, index) => {
            if(index % 2 == 0  )
            strResult = strResult + "." + x;
            else
                strResult = strResult + "'" + x;
        });
     return "$" + strResult.substring(1,strResult.length);
    }
  serviceReciprocidadSetDateList() {
    this.loading = true;
    this.TerminoService.ReciprocidadSetDateList(this.ListBajarAHistorial).subscribe(( x: any) => {
      this.loading = false;
      this.notif.onSuccess('Exitoso', 'El corregir reciprocidad se realizó correctamente.');
      this.TerminoService.GuardarObservacion({
        "IdObseCambioEstado": 0,
        "lngCuenta": Number(this.TerminoForm.get('IdCuenta')?.value),
        "lngTercero": null,
        "IdTipoObservacion": 7,
        "Observacion": null
      }).subscribe(( x: any) => {
        this.TerminoService.obtenerIdObseCambioEstado(this.TerminoForm.get('IdCuenta')?.value).subscribe(
          result => {
            this.TerminoForm.get('IdObseCambioEstado')?.setValue(result.IdObseCambioEstado);
            let ListaLog: any[] = [];
            this.ListBajarAHistorial.forEach(( x: any) => {
              ListaLog.push({
                Documento: x.NumeroDocumento,
                Nombre: x.PrimerApellido + " " + x.SegundoApellido + " " + x.PrimerNombre + " " + x.SegundoNombre,
                FechaMatricula: new DatePipe('en-CO').transform(x.FechaMatricula, 'yyyy/MM/dd  HH:mm:ss'),
                Monto: this.GetNumberToMoneda(Number(x.Monto)),
                Saldo: this.GetNumberToMoneda(Number(x.Saldo))
              });
            });
            let reciprocidadBajarHistorialLog: any = {
              Accion: "Bajar a historial reciprocidad",
              Lista: ListaLog
            }
            this.Guardarlog(reciprocidadBajarHistorialLog);
            setTimeout(() => {
              this.TerminoForm.get('IdObseCambioEstado')?.reset();
              this.loading = false;
            }, 1000);
          },
          error => {
            this.loading = false;
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
      }, error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      })
    }, err => {
      this.loading = false;
      const errorMessage = <any>err;
      this.notif.onDanger('Error', errorMessage);
      console.log(errorMessage);
    })
  }
  btnActualizarReciprocidad() {
    this.btnActualizarBorrarReciprocidad = true;
    this.btnDeleteReciprocidad = false;
    if (this.ListEliminaReciprocidad.length > 0)
      this.serviceEliminarReciprocidad();
    if (this.ListBajarAHistorial.length > 0) {
      setTimeout(() => {
        this.serviceReciprocidadSetDateList()
      }, 800);
    }
    if (this.dataObjetReciprocidad.length == 0) {
      setTimeout(() => {
        this.TerminoOperacionForm.get('Codigo')?.setValue('9');
        this.TerminoForm.get('IdEstado')?.setValue("5");
        this.cambiarEstado();
      }, 1600);
    } else {
      setTimeout(() => {
        this.TerminoOperacionForm.get('Codigo')?.reset();
        this.ObtenerHistorial();
        this.BuscarPorCuenta();
      }, 1600);
    }
  }
  serviceEliminarReciprocidad() {
    this.loading = true;
    this.TerminoService.EliminarCuentaReciprocidadTermino(this.ListEliminaReciprocidad).subscribe(( x: any) => {
      this.notif.onSuccess('Exitoso', 'El corregir reciprocidad se realizó correctamente.');
      this.TerminoService.GuardarObservacion({
        "IdObseCambioEstado": 0,
        "lngCuenta": Number(this.TerminoForm.get('IdCuenta')?.value),
        "lngTercero": null,
        "IdTipoObservacion": 6,
        "Observacion": null
      }).subscribe(( x: any) => {
        this.TerminoService.obtenerIdObseCambioEstado(this.TerminoForm.get('IdCuenta')?.value).subscribe(
          result => {
            this.TerminoForm.get('IdObseCambioEstado')?.setValue(result.IdObseCambioEstado);
            let listaLog: any[] = [];
            this.ListEliminaReciprocidad.forEach(( x: any) => {
              listaLog.push({
                Documento: x.NumeroDocumento,
                Nombre: x.PrimerApellido + " " + x.SegundoApellido + " " + x.PrimerNombre + " " + x.SegundoNombre,
                FechaMatricula: new DatePipe('en-CO').transform(x.FechaMatricula, 'yyyy/MM/dd  HH:mm:ss'),
                Monto: this.GetNumberToMoneda(Number(x.Monto)),
                Saldo: this.GetNumberToMoneda(Number(x.Saldo))
              });
            });
            let reciprocidadEliminadoLog: any = {
              Accion: "Eliminar reciprocidad",
              Lista: listaLog
            }
            this.Guardarlog(reciprocidadEliminadoLog);
            setTimeout(() => {
              this.TerminoForm.get('IdObseCambioEstado')?.reset();
              this.loading = false;
            }, 1000);
          },
          error => {
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.error(errorMessage);
          }
        );
      }, error => {
        this.loading = false;
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      })
    }, error => {
      this.loading = false;
      const errorMessage = <any>error;
      this.notif.onDanger('Error', errorMessage);
      console.error(errorMessage);
    })

  }
  selectEstadoActivo() {
    this.bloquearbtnCambioEstado = true;
  }
  EstadoSeleccionado() {
    let tempBloqueoXMuerte: any = this.dataHistorial.filter(( x: any) => x.Operacion == 9)[0];
    if (this.TerminoForm.get('IdEstado')?.value === '20' && tempBloqueoXMuerte != null && tempBloqueoXMuerte.IdTiposObservaciones == 2) {
      this.notif.onWarning('Advertencia', 'cuenta bloqueada por muerte asociado no se puede volver a bloquear.');
      return;
    }
    this.InitFormReCiprocidadCredito();

    if (this.TerminoForm.get('IdOficina')?.value !== null
      && this.TerminoForm.get('IdOficina')?.value !== undefined
      && this.TerminoForm.get('IdOficina')?.value !== ''
      && this.TerminoForm.get('IdProductoCuenta')?.value !== null
      && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
      && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
      && this.TerminoForm.get('IdConsecutivo')?.value !== null
      && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
      && this.TerminoForm.get('IdConsecutivo')?.value !== ''
      && this.TerminoForm.get('IdDigito')?.value !== null
      && this.TerminoForm.get('IdDigito')?.value !== undefined
      && this.TerminoForm.get('IdDigito')?.value !== ''
    ) {
      if (+this.TerminoForm.get('IdEstado')?.value !== this.datoCambioEstado || (this.TerminoForm.get('IdEstado')?.value == this.datoCambioEstado && this.TerminoForm.get('IdEstado')?.value == "20")) {
        if (this.datoCambioEstado == "20" && this.TerminoForm.get('IdEstado')?.value != "20" && this.TerminoForm.get('IdEstado')?.value != "5") {
          if (this.TerminoForm.get('IdEstado')?.value == 30)
            this.notif.onWarning('Advertencia', 'La cuenta debe estar activa para embargar.');
          if (this.TerminoForm.get('IdEstado')?.value == 10)
            this.notif.onWarning('Advertencia', 'La cuenta debe estar nueva para anular.');
          return;
        }
        if (this.TerminoForm.get('IdEstado')?.value === '20' || this.TerminoForm.get('IdEstado')?.value === 20) {
          if (this.datoCambioEstado !== 45 && this.datoCambioEstado !== 30) {
            this.isShowResiprocidadCredito = false;
            this.CambioEstadoFrom.controls["IdTipoObservacion"].setValue(0);
            this.Observaciones(this.TerminoForm.get('IdEstado')?.value);
            this.ModalCambioEstado.nativeElement.click();
          } else {
            this.notif.onWarning('Advertencia', 'La cuenta debe estar activa para bloquear.');
            this.bloquearbtnCambioEstado = false;
          }
        } else {
          this.cambiarEstado();
        }
      } else {
        this.notif.onWarning('Advertencia', 'Debe cambiar estado cuenta.');
        this.bloquearbtnCambioEstado = false;
      }
    } else {
      this.notif.onWarning('Advertencia', 'Debe buscar una cuenta para realizar esta operación.');
    }
  }
  Observaciones(IdEstado : string) {
    this.TerminoService.Observaciones(IdEstado).subscribe(
      result => {
        this.dataObservacion = result;
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.error(errorMessage);
      }
    );
  }
  cambiarEstado() {
    if (this.TerminoForm.get('IdOficina')?.value !== this.datoOficina) {
      this.TerminoForm.get('IdOficina')?.setValue(this.datoOficina);
    }
    if (this.TerminoForm.get('IdProductoCuenta')?.value !== this.datoProducto ||
      this.TerminoForm.get('IdProducto')?.value !== this.datoProducto) {
      this.TerminoForm.get('IdProductoCuenta')?.setValue(this.datoProducto);
      this.TerminoForm.get('IdProducto')?.setValue(this.datoProducto);
      this.TerminoForm.get('DescripcionProducto')?.setValue(this.datoNombreProducto);
    }
    if (this.TerminoForm.get('IdConsecutivo')?.value !== this.datoConsecutivo) {
      this.TerminoForm.get('IdConsecutivo')?.setValue(this.datoConsecutivo);
    }
    if (this.TerminoForm.get('IdDigito')?.value !== this.datoDigito) {
      this.TerminoForm.get('IdDigito')?.setValue(this.datoDigito);
    }

    let tempListEstados: any[] = [
      { id: 45, descripcion: "Nuevo" },
      { id: 5, descripcion: "Activa" },
      { id: 10, descripcion: "Anulada" },
      { id: 20, descripcion: "Bloqueado" },
      { id: 30, descripcion: "Embargada" }]

    let estadoLog: any = {
      EstadoAnterior: tempListEstados.filter(( x: any) => x.id == this.datoCambioEstado)[0].descripcion,
      EstadoActualiza: tempListEstados.filter(( x: any) => x.id == this.TerminoForm.get('IdEstado')?.value)[0].descripcion,
    }

    if (this.TerminoForm.get('IdEstado')?.value == '20') {        // Bloquear

      this.obtenerIdObseCambioEstado();
      this.datoCambioEstado = +this.TerminoForm.get('IdEstado')?.value;

      this.TerminoService.getBloquearCuenta(this.TerminoForm.value).subscribe(
        result => {
          if (result.AlertasDto !== null) {
            this.notif.onWarning('Advertencia', result.AlertasDto.Mensaje);
            this.inputEstado = true;
            this.selectEstado = false;
            this.btnCambiarEstado = false;
            this.bloquearbtnCambioEstado = false;
            this.TerminoForm.get('IdEstado')?.setValue(0);
          } else {
            this.notif.onSuccess('Exitoso', 'El cambio estado se realizó correctamente.');
            console.log("lista", this.ListCuentaAgregadasReciprocidad)
            debugger
            this.GuardarCuentasReciprocidad();
            let listLog: any[] = [];
            this.ListCuentaAgregadasReciprocidad.forEach(( x: any) => {
              listLog.push({
                Documento: x.NumeroDocumento,
                Nombre : x.PrimerApellido + " " + x.SegundoApellido + " " + x.PrimerNombre + " " + x.SegundoNombre
              });
            });
            if (this.ListCuentaAgregadasReciprocidad.length > 0) {
              estadoLog.Observacion = {
                Crea_Reciprocidad: listLog
              };
            }


            setTimeout(() => {
              this.Guardarlog(estadoLog);
              this.BuscarPorCuenta();
              this.CambioEstadoFrom.reset();
              this.TerminoOperacionForm.get('Codigo')?.reset();
              this.TerminoForm.get('IdObseCambioEstado')?.reset();
              this.ListCuentaAgregadasReciprocidad = [];
            }, 600);
            setTimeout(() => {
              this.ObtenerHistorial();
            }, 1200);
          }
        },
        error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.error(errorMessage);
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      );
      this.btnCambiarEstado = true;
      this.selectEstado = true;
      this.inputEstado = false;
    } else if (this.TerminoForm.get('IdEstado')?.value === '5') {  // Activo
      this.TerminoService.getDesbloquearCuenta(this.TerminoForm.value).subscribe(
        result => {
          if (result.AlertasDto !== null) {
            this.notif.onWarning('Advertencia', result.AlertasDto.Mensaje);
            this.inputEstado = true;
            this.selectEstado = false;
            this.btnCambiarEstado = false;
            this.bloquearbtnCambioEstado = false;
            this.TerminoForm.get('IdEstado')?.setValue(0);
          } else {
            if (this.dataObjetReciprocidad != null && this.dataObjetReciprocidad.length > 0 && this.datoCambioEstado == 20) {
              let listLog: any[] = [];
              this.dataObjetReciprocidad.forEach(( x: any) => {
                listLog.push({
                  Documento: x.NumeroDocumento,
                  Nombre: x.PrimerApellido + " " + x.SegundoApellido + " " + x.PrimerNombre + " " + x.SegundoNombre,
                  FechaMatricula : new DatePipe('en-CO').transform(x.FechaMatricula, 'yyyy/MM/dd  HH:mm:ss'),
                  Monto: this.GetNumberToMoneda(Number(x.Monto)),
                  Saldo: this.GetNumberToMoneda(Number(x.Saldo))
                });
              });
              estadoLog.Observacion = { Bajar_Historial_ReciprocidaReciprocidad: listLog };
            }
            if (this.TerminoForm.get('IdEstado')?.value === '5' && this.datoCambioEstado == 20)
              this.ReciprocidadSetDate();
            this.notif.onSuccess('Exitoso', 'El cambio estado se realizó correctamente.');
            this.Guardarlog(estadoLog);
            this.BuscarPorCuenta();
            this.CambioEstadoFrom.reset();
            this.TerminoOperacionForm.get('Codigo')?.reset();
            this.TerminoForm.get('IdObseCambioEstado')?.reset();
            setTimeout(() => {
              this.ObtenerHistorial();
            }, 1200);
          }
        },
        error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.error(errorMessage);
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      );
      this.btnCambiarEstado = true;
      this.selectEstado = true;
      this.inputEstado = false;
    } else if (this.TerminoForm.get('IdEstado')?.value === '10') { // Anular
      this.TerminoService.getAnularCuenta(this.TerminoForm.value).subscribe(
        result => {
          if (result.AlertasDto !== null) {
            this.notif.onWarning('Advertencia', result.AlertasDto.Mensaje);
            this.inputEstado = true;
            this.selectEstado = false;
            this.btnCambiarEstado = false;
            this.bloquearbtnCambioEstado = false;
            this.TerminoForm.get('IdEstado')?.setValue(0);
          } else {            
            this.notif.onSuccess('Exitoso', 'El cambio estado se realizó correctamente.');
            this.Guardarlog(estadoLog);
            this.BuscarPorCuenta();  
            this.LiberarTitulo();
            this.CambioEstadoFrom.reset();
            this.TerminoOperacionForm.get('Codigo')?.reset();
            this.TerminoForm.get('IdObseCambioEstado')?.reset();            
            setTimeout(() => {
              this.ObtenerHistorial();
            }, 1200);
          }
        },
        error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.error(errorMessage);
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      );
      this.btnCambiarEstado = true;
      this.selectEstado = true;
      this.inputEstado = false;
    } else if (this.TerminoForm.get('IdEstado')?.value === '30') { // Embargar
      this.TerminoService.getEmbargarCuenta(this.TerminoForm.value).subscribe(
        result => {
          if (result.AlertasDto !== null) {
            this.notif.onWarning('Advertencia', result.AlertasDto.Mensaje);
            this.inputEstado = true;
            this.selectEstado = false;
            this.btnCambiarEstado = false;
            this.bloquearbtnCambioEstado = false;
            this.TerminoForm.get('IdEstado')?.setValue(0);
          } else {
            this.notif.onSuccess('Exitoso', 'El cambio estado se realizó correctamente.');
            this.Guardarlog(estadoLog);
            this.BuscarPorCuenta();
            this.CambioEstadoFrom.reset();
            this.TerminoOperacionForm.get('Codigo')?.reset();
            this.TerminoForm.get('IdObseCambioEstado')?.reset();
            setTimeout(() => {
              this.ObtenerHistorial();
            }, 1200);
          }
        },
        error => {
          const errorMessage = <any>error;
          this.notif.onDanger('Error', errorMessage);
          console.error(errorMessage);
          this.TerminoOperacionForm.get('Codigo')?.reset();
        }
      );
      this.btnCambiarEstado = true;
      this.selectEstado = true;
      this.inputEstado = false;
    }
  }
  ReciprocidadSetDate() {
    this.TerminoService.ReciprocidadSetDate(this.TerminoForm.get('IdCuenta')?.value).subscribe(( x: any) => {
      console.log("respuesta ", x)
    }, err => {
      const errorMessage = <any>err;
      this.notif.onDanger('Error', errorMessage);
      console.error(errorMessage);
    })
  }
  obtenerIdObseCambioEstado() {
    this.TerminoService.obtenerIdObseCambioEstado(this.TerminoForm.get('IdCuenta')?.value).subscribe(
      result => {
        this.TerminoForm.get('IdObseCambioEstado')?.setValue(result.IdObseCambioEstado);
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
      }
    );
  }
  GuardarObservaciones(valueBool: boolean) {
    if (valueBool) {
      if (this.CambioEstadoFrom.get('IdTipoObservacion')?.value !== null && this.CambioEstadoFrom.get('IdTipoObservacion')?.value !== undefined && this.CambioEstadoFrom.get('IdTipoObservacion')?.value !== '') {
        const observacionSend = this.CambioEstadoFrom.get('IdTipoObservacion')?.value;
        this.TerminoForm.get('IdTipoObservacionSend')?.setValue(observacionSend);
        const cuenta = this.TerminoForm.get('IdCuenta')?.value;
        this.CambioEstadoFrom.get('lngCuenta')?.setValue(cuenta);
        this.TerminoService.GuardarObservacion(this.CambioEstadoFrom.value).subscribe(
          result => {
            this.CambioEstadoFrom.reset();
            this.isShowResiprocidadCredito = false;
            this.cambiarEstado();
          },
          error => {
            const errorMessage = <any>error;
            this.notif.onDanger('Error', errorMessage);
            console.log(errorMessage);
          }
        );
      }
      else
        this.notif.onWarning('Advertencia', 'Debe seleccionar una observación.');
    }
    else
      this.notif.onWarning('Advertencia', 'Debe agregar una cuenta.');
  }

  isShowResiprocidadCredito: boolean = false;
  CambioEstadoChange() {
    this.InitFormReCiprocidadCredito();

    if (this.CambioEstadoFrom.get('IdTipoObservacion')?.value == 4) {
      this.isShowResiprocidadCredito = true;
      this.ObtenerCuentaReciprocidadTermino();
    }
    else
      this.isShowResiprocidadCredito = false;

  }

  InitFormReCiprocidadCredito() {
    this.ReciprocidadCreditoFrom = new FormGroup({
      documento: new FormControl(this.TerminoForm.get('NumeroDocumento')?.value, [Validators.required]),
      nombre: new FormControl(this.TerminoForm.get('Nombre')?.value, [Validators.required]),
      IdCuenta: new FormControl(0, [Validators.required]),
    });
    this.ListCuentaReciprocidad = [];
  }
  AgregarResiprocidadCredito() {
    if (this.ReciprocidadCreditoFrom.controls["IdCuenta"].value == "0")
      this.notif.onWarning('Advertencia', 'No se ha seleccionado una cuenta.');
    else {
      if (this.ListCuentaAgregadasReciprocidad.filter(( x: any) => x.IdCuenta == this.ReciprocidadCreditoFrom.controls["IdCuenta"].value)[0] == null) {
        if (this.dataObjetReciprocidad !== undefined) {
          let temp: any = this.ListCuentaReciprocidad.filter(( x: any) => x.IdCuenta == this.ReciprocidadCreditoFrom.controls["IdCuenta"].value)[0];
          if (this.dataObjetReciprocidad.filter(( x: any) => x.Cuenta == temp.Cuenta)[0] == null)
            this.ListCuentaAgregadasReciprocidad.push(temp);
          else
            this.notif.onWarning('Advertencia', 'Cuenta ya fue ingresada.');
        }
        else
          this.ListCuentaAgregadasReciprocidad.push(this.ListCuentaReciprocidad.filter(( x: any) => x.IdCuenta == this.ReciprocidadCreditoFrom.controls["IdCuenta"].value)[0]);
      }
      else
        this.notif.onWarning('Advertencia', 'Cuenta ya fue ingresada .');
    }
  }
  ObtenerCuentaReciprocidadTermino() {
    this.ReciprocidadCreditoFrom.controls["IdCuenta"].setValue("0");
    this.ReciprocidadCreditoFrom.controls["nombre"].setValue("");
    if (this.TerminoForm.get('NumeroDocumento')?.value != null && this.TerminoForm.get('NumeroDocumento')?.value != "") {
      this.loading = true;
      this.TerminoService.ObtenerCuentaReciprocidadTermino(Number(this.ReciprocidadCreditoFrom.get('documento')?.value)).subscribe(( x: any) => {
        this.ListCuentaReciprocidad = x;
        if (this.ListCuentaReciprocidad.length > 0)
          this.ReciprocidadCreditoFrom.controls["nombre"].setValue(this.ListCuentaReciprocidad[0].PrimerApellido + " " + this.ListCuentaReciprocidad[0].SegundoApellido + " " + this.ListCuentaReciprocidad[0].PrimerNombre + " " + this.ListCuentaReciprocidad[0].SegundoNombre);
        else
          this.notif.onWarning('Advertencia', 'registro no existe.');
        this.loading = false;
      }, err => {
        this.ListCuentaReciprocidad = [];
        this.loading = false;
        const errorMessage = <any>err;
        this.notif.onDanger('Error', errorMessage);
      });
    }
    else
      this.notif.onWarning('Advertencia', 'Debe ingresar una cedula.');
  }
  BorrarCuentasAgregadasReciprocidadTermino(element: any) {
    this.ListCuentaAgregadasReciprocidad = this.ListCuentaAgregadasReciprocidad.filter(( x: any) => x.IdCuenta != element.IdCuenta);
  }
  GuardarCuentasReciprocidad() {
    if (this.ListCuentaAgregadasReciprocidad.length > 0) {
      let coun: number = 1;
      this.ListCuentaAgregadasReciprocidad.forEach(( x: any) => {
        x.IdCuentaCredito = x.IdCuenta
        x.IdCuenta = this.TerminoForm.get('IdCuenta')?.value;
        x.$id = coun;
        coun = coun + 1;
      });
      this.loading = true;
      this.TerminoService.GuardarCuentaReciprocidadTermino(this.ListCuentaAgregadasReciprocidad).subscribe(( x: any) => {
        this.isShowResiprocidadCredito = false;
        this.loading = false;
      }, err => {
        this.loading = false;
        const errorMessage = <any>err;
        this.notif.onDanger('Error', errorMessage);
      });
    }
  }

  // HISTORIAL
  ObtenerHistorial() {
    const IdOficina = this.TerminoForm.get('IdOficina')?.value;
    const IdProductoCuenta = this.TerminoForm.get('IdProductoCuenta')?.value;
    const IdConsecutivo = this.TerminoForm.get('IdConsecutivo')?.value;
    const IdDigito = this.TerminoForm.get('IdDigito')?.value;
    this.TerminoService.ObtenerHistorial({ 'IdOficina': IdOficina, 'IdProductoCuenta': IdProductoCuenta, 'IdConsecutivo': IdConsecutivo, 'IdDigito': IdDigito }).subscribe(
      result => {
        this.dataHistorial = result;
        this.dataHistorial.forEach(( element : any) => {
          if (element.Operacion == 10 || element.Operacion == 13 || element.Operacion == 40 || element.Operacion == 103)
            element.Detalles = "";
          else if (element.Detalles != null && element.Detalles != "") {
            const tempchar: string = '"'
            element.Detalles = element.Detalles.toString().replace(/{/g, "").replace(/}/g, "").replace(/\[/g, "").replace(/\]/g, "");
            element.Detalles = element.Detalles.toString().replace(new RegExp(tempchar, 'g'), '');
            element.Detalles = element.Detalles.toString().replace(new RegExp(',', 'g'), '  ');
          }
        });
      },
      error => {
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      });
  }
  verHistorial() {
    console.log(this.dataHistorial)
  }
  // GENERAL
  ClearFrom() {
    this.TerminoForm.reset();
    this.AsesorForm.reset();
    this.AdicionarPuntosFrom.reset();
    this.InteresForm.reset();
    this.selectEstado = true;
    this.inputEstado = false;
    this.selectCuenta = true;
    this.inputCuenta = false;
    this.selectFrecuencia = true;
    this.inputFrecuencia = false;
    this.inputValor = false;
    this.inputValorSinDecimal = true;
    this.oTitulo = false;
    this.btnGuardar = true;
    this.btnActualizarTab = true;
    this.btnCalcularTasa = true;
    this.dataObjetBeneficiarios = [];
    this.dataObjetTitulares = [];
    this.dataObjetRenovacion = [];
    this.dataObjetCesionTitulo = [];
    this.dataObjetReciprocidad = [];
    this.dataObjetReciprocidadR = [];
    this.dataHistorial = [];
  }
  LimpiarCampos(Datos : string) {
    if (Datos === 'BuscarDocumento') {
      this.TerminoForm.get('BuscarNombre')?.reset();
    } else if (Datos === 'BuscarNombre') {
      this.TerminoForm.get('BuscarDocumento')?.reset();
    } else if (Datos === 'strCodigo') {
      this.AsesorForm.get('strNombre')?.reset();
    } else if (Datos === 'strNombre') {
      this.AsesorForm.get('strCodigo')?.reset();
    } else if (Datos === 'IdProducto') {
      this.TerminoForm.get('DescripcionProducto')?.reset();
    } else if (Datos === 'DescripcionProducto') {
      this.TerminoForm.get('IdProducto')?.reset();
    } else if (Datos === 'NumeroDocumento') {
      this.TerminoForm.get('Nombre')?.reset();
    } else if (Datos === 'Nombre') {
      this.TerminoForm.get('NumeroDocumento')?.reset();
    }
  }
  LimpiarCamposTab(Datos : string) {
    if (Datos === 'DocumentoTitular')
      this.TerminoForm.get('NombreTitular')?.reset();
    else if (Datos === 'NombreTitular')
      this.TerminoForm.get('DocumentoTitular')?.reset();
    else if (Datos === 'CesionTituloDocumento')
      this.TerminoForm.get('CesionTituloDocumento')?.reset();
    else if (Datos === 'CesionTituloNombre')
      this.TerminoForm.get('CesionTituloNombre')?.reset();

  }
  CambiarColor(fil : number, producto : number) {
    if (producto === 1) {

      $(".FilBenef" + this.ColorAnterior1).css("background", "#FFFFFF");
      $(".FilBenef" + fil).css("background", "#e5e5e5");

      this.ColorAnterior1 = fil;
    }

    if (producto === 2) {

      $(".FilTitul" + this.ColorAnterior2).css("background", "#FFFFFF");
      $(".FilTitul" + fil).css("background", "#e5e5e5");

      this.ColorAnterior2 = fil;
    }
    if (producto === 3) {

      $(".FilRenov" + this.ColorAnterior3).css("background", "#FFFFFF");
      $(".FilRenov" + fil).css("background", "#e5e5e5");

      this.ColorAnterior3 = fil;
    }
    if (producto === 4) {

      $(".FilSesi" + this.ColorAnterior4).css("background", "#FFFFFF");
      $(".FilSesi" + fil).css("background", "#e5e5e5");

      this.ColorAnterior4 = fil;
    }
    if (producto === 5) {

      $(".FilRecip" + this.ColorAnterior5).css("background", "#FFFFFF");
      $(".FilRecip" + fil).css("background", "#e5e5e5");

      this.ColorAnterior5 = fil;
    }
    if (producto === 6) {

      $(".filApo_" + this.ColorAnterior6).css("background", "#FFFFFF");
      $(".filApo_" + fil).css("background", "#e5e5e5");

      this.ColorAnterior6 = fil;
    }

    if (producto === 7) {

      $(".FilRecipR" + this.ColorAnterior6).css("background", "#FFFFFF");
      $(".FilRecipR" + fil).css("background", "#e5e5e5");

      this.ColorAnterior6 = fil;
    }

  }
  ClearFromTermino() {
    this.ClearFrom();
    this.clearBeneficiario;
    this.clearTitulares;
    this.dataObjetBeneficiarios = [];
    this.dataObjetTitulares = [];
    this.dataObjetRenovacion = [];
    this.dataObjetCesionTitulo = [];
    this.dataObjetReciprocidad = [];
    this.dataObjetReciprocidadR = [];
    this.dataHistorial = [];
    this.TerminoOperacionForm.get('Codigo')?.reset();
    this.bloquearDatosTitulares = false;
    this.bloquearAsociado = false;
    this.bloquearProducto = false;
    this.bloquearAsesorExterno = false;
    this.bloquearNroTitulo = false;
    this.btnCambiarEstado = true;
    this.btnActualizar = true;
    this.btnGuardar = true;
    this.bloquearNegociacion = false;
    this.bloquearCuentaNegociacion = false;
    this.bloquearDocumentoBenf = false;
    this.bloquearNombreBenf = false;
    this.bloquearliquidacion = false;
    this.devolverTab(1);
    this.tab1.nativeElement.click();
    $('#saldos').removeClass('activar');
    $('#saldos').removeClass('active');
    $('#Beneficiarios').removeClass('activar');
    $('#Beneficiarios').removeClass('active');
    $('#autorizados').removeClass('activar');
    $('#autorizados').removeClass('active');
    $('#renovaciones').removeClass('activar');
    $('#renovaciones').removeClass('active');
    $('#cesionAhorro').removeClass('activar');
    $('#cesionAhorro').removeClass('active');
    $('#reciprocidad').removeClass('activar');
    $('#reciprocidad').removeClass('active');
    $('#historial').removeClass('activar');
    $('#historial').removeClass('active');
    $('#negociacion').addClass('activar');
    $('#negociacion').addClass('active');

  }
  VolverArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
  VolverAbajo() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    return false;
  }
  GenerarImpresion() {
    this.linkPdf = "";
    let pdfinBase64 = null;
    let byteArray = null;
    let newBolb = null;
    let url = null;
    this.loading = true;
    document.querySelector("object")!.data = "";
    document.querySelector("object")!.name = "";
    document.querySelector("object")!.type = "";
    this.itemsSend.Ciudad = this.itemsSend.Ciudad == null ? "" : this.itemsSend.Ciudad;
    this.itemsSend.Telefono = this.itemsSend.Telefono == null ? "" : this.itemsSend.Telefono;
    this.TerminoService.GenerarImpresionTermino(this.itemsSend).subscribe(
      result => {
        pdfinBase64 = result.FileStream._buffer;
        byteArray = new Uint8Array(
          atob(pdfinBase64)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        newBolb = new Blob([byteArray], { type: "application/pdf" });
        this.linkPdf = URL.createObjectURL(newBolb);
        url = window.URL.createObjectURL(newBolb);
        document.querySelector("object")!.data = url;
        document.querySelector("object")!.name = "Impresion";
        document.querySelector("object")!.type = "application/pdf";
        this.loading = false;
      },
      error => {
        this.loading = false
        const errorMessage = <any>error;
        this.notif.onDanger('Error', errorMessage);
        console.log(errorMessage);
      }
    );
  }
  LimpiaOperacion() {
    this.TerminoOperacionForm.get('Codigo')?.reset();
  }
  ActualizarTermino() {

    if (this.TerminoForm.get('IdOficina')?.value !== null
      && this.TerminoForm.get('IdOficina')?.value !== undefined
      && this.TerminoForm.get('IdOficina')?.value !== ''
      && this.TerminoForm.get('IdProductoCuenta')?.value !== null
      && this.TerminoForm.get('IdProductoCuenta')?.value !== undefined
      && this.TerminoForm.get('IdProductoCuenta')?.value !== ''
      && this.TerminoForm.get('IdConsecutivo')?.value !== null
      && this.TerminoForm.get('IdConsecutivo')?.value !== undefined
      && this.TerminoForm.get('IdConsecutivo')?.value !== ''
      && this.TerminoForm.get('IdDigito')?.value !== null
      && this.TerminoForm.get('IdDigito')?.value !== undefined
      && this.TerminoForm.get('IdDigito')?.value !== '') {

      if (this.TerminoForm.get('IdOficina')?.value !== this.datoOficina) {
        this.TerminoForm.get('IdOficina')?.setValue(this.datoOficina);
      }
      if (this.TerminoForm.get('IdProductoCuenta')?.value !== this.datoProducto ||
        this.TerminoForm.get('IdProducto')?.value !== this.datoProducto) {
        this.TerminoForm.get('IdProductoCuenta')?.setValue(this.datoProducto);
        this.TerminoForm.get('IdProducto')?.setValue(this.datoProducto);
        this.TerminoForm.get('DescripcionProducto')?.setValue(this.datoNombreProducto);
      }
      if (this.TerminoForm.get('IdConsecutivo')?.value !== this.datoConsecutivo) {
        this.TerminoForm.get('IdConsecutivo')?.setValue(this.datoConsecutivo);
      }
      if (this.TerminoForm.get('IdDigito')?.value !== this.datoDigito) {
        this.TerminoForm.get('IdDigito')?.setValue(this.datoDigito);
      }
      if (this.TerminoOperacionForm.get('Codigo')?.value === '19') {          // Actualizar el asesor externo

        if ((this.AsesorForm.get('strCodigo')?.value !== this.datoAsesorExterno)
          && (this.AsesorForm.get('strCodigo')?.value !== this.datoAsesorExterno)) {
          const IdAsesor = this.AsesorForm.get('strCodigo')?.value;
          const NombreAsesor = this.AsesorForm.get('strNombre')?.value;

          if (IdAsesor !== null && IdAsesor !== '' && IdAsesor !== undefined &&
            NombreAsesor !== null && NombreAsesor !== '' && NombreAsesor !== undefined) {
            let tempAsesorLog: any = {
              IdAsesorExternoAnterior: this.datoAsesorExterno,
              NombreAsesorExternoAnterior: this.dataObjet.PrimerNombreAsesorE + ' ' + this.dataObjet.SegundoNombreAsesoreE +
                ' ' + this.dataObjet.PrimerApellidoAsesorE + ' ' + this.dataObjet.SegundoApellidoAsesorE,
              IdAsesorExternoActualiza: this.AsesorForm.get('strCodigo')?.value,
              NombreAsesorExternoActualiza: NombreAsesor
            }
            this.dataAsesor = this.AsesorForm.get('strCodigo')?.value;
            this.TerminoForm.get('IdAsesorExterno')?.setValue(this.dataAsesor);

            this.datoAsesorExterno = +this.AsesorForm.get('strCodigo')?.value;

            this.loading = true;
            this.TerminoService.getEditarAsesorExterno(this.TerminoForm.value).subscribe(
              result => {
                this.loading = false;
                this.bloquear = false;
                this.bloquearNroTitulo = false;
                this.bloquearNegociacion = false;
                this.bloquearAsociado = false;
                this.bloquearBuscar = false;
                this.bloquearCuentaNegociacion = false;
                this.bloquearliquidacion = false;
                this.bloquearAsesorExterno = false;
                this.bloquearPuntos = false;
                // this.bloquearCuentaOrigen = false;
                this.notif.onSuccess('Exitoso', 'El cambio de asesor externo se actualizó correctamente.');
                this.btnGuardar = true;
                this.Guardarlog(tempAsesorLog);
                this.ObtenerHistorial();
                this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
                this.TerminoOperacionForm.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.log(errorMessage);
              });

            this.ObtenerHistorial();
          } else if ((IdAsesor === null || IdAsesor === '' || IdAsesor === undefined) &&
            (NombreAsesor === null || NombreAsesor === '' || NombreAsesor === undefined)) {
            let tempAsesorLog: any = {
              IdAsesorExternoAnterior: this.datoAsesorExterno,
              NombreAsesorExternoAnterior: this.dataObjet.PrimerNombreAsesorE + ' ' + this.dataObjet.SegundoNombreAsesoreE +
                ' ' + this.dataObjet.PrimerApellidoAsesorE + ' ' + this.dataObjet.SegundoApellidoAsesorE,
              IdAsesorExternoActualiza: this.AsesorForm.get('strCodigo')?.value == null || this.AsesorForm.get('strCodigo')?.value == "" ? 0 : this.AsesorForm.get('strCodigo')?.value,
              NombreAsesorExternoActualiza: NombreAsesor == null ? "" : NombreAsesor
            }
            this.dataAsesor = this.AsesorForm.get('strCodigo')?.value;
            this.TerminoForm.get('IdAsesorExterno')?.setValue(this.dataAsesor);

            this.datoAsesorExterno = +this.AsesorForm.get('strCodigo')?.value;

            this.loading = true;
            this.TerminoService.getEditarAsesorExterno(this.TerminoForm.value).subscribe(
              result => {
                this.loading = false;
                this.bloquear = false;
                this.bloquearNegociacion = false;
                this.bloquearAsociado = false;
                this.bloquearBuscar = false;
                this.bloquearCuentaNegociacion = false;
                this.bloquearliquidacion = false;
                this.bloquearAsesorExterno = false;
                this.bloquearPuntos = false;
                // this.bloquearCuentaOrigen = false;
                this.notif.onSuccess('Exitoso', 'El Cambio de asesor externo se actualizó correctamente.');
                this.btnGuardar = true;
                this.Guardarlog(tempAsesorLog);
                this.ObtenerHistorial();
                this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
                this.TerminoOperacionForm.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.log(errorMessage);
              });
            this.ObtenerHistorial();
          } else {
            this.notif.onWarning('Advertencia', 'Debe seleccionar un asesor válido.');
          }

        } else {
          this.notif.onWarning('Advertencia', 'Debe cambiar asesor externo.');
          this.bloquearbtnActalizar = false;
          this.bloquearbtnCalcular = false;
        }
      } else if (this.TerminoOperacionForm.get('Codigo')?.value === '44') {   // Actualizar nro titulo
        if (this.TerminoForm.get('NroTitulo')?.value !== null
          && this.TerminoForm.get('NroTitulo')?.value !== undefined
          && this.TerminoForm.get('NroTitulo')?.value !== '') {
          if (this.TerminoForm.get('NroTitulo')?.value !== this.TerminoForm.get('NroTituloAnterior')?.value) {
            this.loading = true;
            console.log({ "1 ": this.TerminoForm.get('NroTitulo')?.value, "2 ": Number(this.TerminoForm.get('IdCuenta')?.value), "3": this.TerminoForm.get('NroTituloAnterior')?.value })
            let tempNumTituloLog: any = {
              NumeroTituloAnterior: Number(this.TerminoForm.get('NroTituloAnterior')?.value),
              NumeroTituloActualiza: Number(this.TerminoForm.get('NroTitulo')?.value)
            }
            this.TerminoService.ActualizarNroTitulo(Number(this.TerminoForm.get('NroTitulo')?.value), Number(this.TerminoForm.get('IdCuenta')?.value), this.TerminoForm.get('NroTituloAnterior')?.value == null ? 0 : this.TerminoForm.get('NroTituloAnterior')?.value).subscribe(
              result => {
                this.loading = false;
                this.bloquear = false;
                this.btnActualizar = true;
                this.bloquearNroTitulo = false;
                this.bloquearNegociacion = false;
                this.bloquearEstado = false;
                this.bloquearAsociado = false;;
                this.bloquearBuscar = false;
                this.bloquearCuentaNegociacion = false;
                this.bloquearliquidacion = false;
                this.bloquearAsesorExterno = false;
                this.bloquearPuntos = false;
                this.notif.onSuccess('Exitoso', 'El cambio de número título se actualizó correctamente.');
                this.btnGuardar = true;
                this.btnActualizar = true;
                this.btnActualizarTitulares = true;
                this.btnOpcionesActualizarTitulares = true;
                this.bloquearbtnActalizar = false;
                this.bloquearbtnCalcular = false;
                this.selectEstado = true;
                this.inputEstado = false;
                this.Guardarlog(tempNumTituloLog);
                this.TerminoOperacionForm.get('Codigo')?.reset();
                this.ObtenerHistorial();
                this.BuscarPorCuenta();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.log(errorMessage);
              }
            );
          } else {
            this.notif.onWarning('Advertencia', 'Debe cambiar número título.');
            this.bloquearbtnActalizar = false;
          }
        } else {
          this.notif.onWarning('Advertencia', 'Debe ingresar número título.');
        }
      } else if (this.TerminoOperacionForm.get('Codigo')?.value === '27') {   // Actualizar Tipo cuenta Destino

        let cambiatTipoCuentaDestinoLog: any = {
          TipoCuentaDestinoAnterior: this.resultLiquidacion.filter(( x: any) => x.IdLiquidacion == this.datoLiquidacion)[0].DescripcionLiquidacion,
          CuentaAnterior: this.dataObjet.IdCuentaDestino == null ? null : this.resultCuentaNegociacion.filter(( x: any) => x.IdCuenta == this.dataObjet.IdCuentaDestino)[0].CuentaD,
          TipoCuentaDestinoActualiza: this.resultLiquidacion.filter(( x: any) => x.IdLiquidacion == this.TerminoForm.get('IdLiquidacion')?.value)[0].DescripcionLiquidacion,
          CuentaActualiza: this.TerminoForm.get('IdCuentaDestino')?.value == null ? null : this.resultCuentaNegociacion.filter(( x: any) => x.IdCuenta == this.TerminoForm.get('IdCuentaDestino')?.value)[0].CuentaD,
        }
        if (this.TerminoForm.get('IdLiquidacion')?.value == '1') { // Cuenta ahorros
          if (this.TerminoForm.get('IdCuentaDestino')?.value !== undefined
            && this.TerminoForm.get('IdCuentaDestino')?.value != "0"
            && this.TerminoForm.get('IdCuentaDestino')?.value !== null) {

            if (+this.TerminoForm.get('IdLiquidacion')?.value !== this.datoLiquidacion || this.TerminoForm.get('IdCuentaDestino')?.value != this.dataObjet.IdCuentaDestino) {

              if (this.TerminoForm.get('PlazoDias')?.value !== this.datoPlazo) {
                this.TerminoForm.get('PlazoDias')?.setValue(this.datoPlazo);
              }
              if (this.TerminoForm.get('ValorTotal')?.value !== this.datoValortitulo) {
                this.TerminoForm.get('ValorTotal')?.setValue(this.datoValortitulo);
              }
              var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
              TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
              this.TerminoForm.get('TasaAdicional')?.setValue(TasaAdicionalSin);
              this.loading = true;
              this.TerminoService.getActualizarTermino(this.TerminoForm.value).subscribe(
                result => {
                  this.loading = false;
                  this.bloquear = false;
                  this.bloquearNroTitulo = false;
                  this.bloquearNegociacion = false;
                  this.bloquearCuenta = false;
                  this.bloquearEstado = false;
                  this.bloquearDatosTitulares = false;
                  this.bloquearAsociado = false;
                  this.bloquearProducto = false;
                  this.bloquearBuscar = false;
                  this.bloquearCuentaNegociacion = false;
                  this.bloquearliquidacion = false;
                  this.bloquearAsesorExterno = false;
                  this.bloquearPuntos = false;
                  this.notif.onSuccess('Exitoso', 'El cambio de tipo cuenta destino se actualizó correctamente.');
                  this.btnGuardar = true;
                  this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                  this.btnActualizar = true;
                  this.btnActualizarTab = true;
                  this.btnActualizarTitulares = true;
                  this.btnOpcionesActualizarTitulares = true;
                  this.bloquearbtnActalizar = false;
                  this.bloquearbtnCalcular = false;
                  this.selectEstado = true;
                  this.inputEstado = false;
                  this.selectCuenta = true;
                  this.inputCuenta = false;
                  if (cambiatTipoCuentaDestinoLog.CuentaAnterior == null)
                    delete cambiatTipoCuentaDestinoLog.CuentaAnterior;
                  this.Guardarlog(cambiatTipoCuentaDestinoLog);
                  this.TerminoOperacionForm.get('Codigo')?.reset();
                  this.BuscarPorCuenta();
                  this.ObtenerHistorial();
                  this.ImpresionCuentaDestinoPDF();
                },
                error => {
                  this.loading = false;
                  const errorMessage = <any>error;
                  this.notif.onDanger('Error', errorMessage);
                  console.log(errorMessage);
                }
              );
            } else {
              this.notif.onWarning('Advertencia', 'Debe cambiar tipo cuenta destino');
              this.bloquearbtnActalizar = false;
              this.bloquearbtnCalcular = false;
            }
          } else {
            this.notif.onWarning('Advertencia', 'Debe seleccionar una cuenta ahorros.');
          }
        } else if (this.TerminoForm.get('IdLiquidacion')?.value == '0') {  // cuenta x pagar
          if (+this.TerminoForm.get('IdLiquidacion')?.value !== this.datoLiquidacion) {

            if (this.TerminoForm.get('PlazoDias')?.value !== this.datoPlazo) {
              this.TerminoForm.get('PlazoDias')?.setValue(this.datoPlazo);
            }
            if (this.TerminoForm.get('ValorTotal')?.value !== this.datoValortitulo) {
              this.TerminoForm.get('ValorTotal')?.setValue(this.datoValortitulo);
            }

            var TasaAdicionalSin = this.TerminoForm.get('TasaAdicional')?.value;
            TasaAdicionalSin = TasaAdicionalSin.replace("%", "");
            this.TerminoForm.get('TasaAdicional')?.setValue(TasaAdicionalSin);

            this.loading = true;
            this.TerminoService.getActualizarTermino(this.TerminoForm.value).subscribe(
              result => {
                this.loading = false;
                this.bloquear = false;
                this.bloquearNroTitulo = false;
                this.bloquearNegociacion = false;
                this.bloquearCuenta = false;
                this.bloquearEstado = false;
                this.bloquearDatosTitulares = false;
                this.bloquearAsociado = false;
                this.bloquearProducto = false;
                this.bloquearBuscar = false;
                this.bloquearCuentaNegociacion = false;
                this.bloquearliquidacion = false;
                this.bloquearAsesorExterno = false;
                this.bloquearPuntos = false;
                this.notif.onSuccess('Exitoso', 'El cambio de tipo cuenta destino se actualizó correctamente.');
                this.btnGuardar = true;
                this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = false;
                this.btnActualizarTab = true;
                this.btnActualizarTitulares = true;
                this.btnOpcionesActualizarTitulares = true;
                this.bloquearbtnActalizar = false;
                this.bloquearbtnCalcular = false;
                this.selectEstado = true;
                this.inputEstado = false;
                this.selectCuenta = true;
                this.inputCuenta = false;
                if (cambiatTipoCuentaDestinoLog.CuentaAnterior == null)
                  delete cambiatTipoCuentaDestinoLog.CuentaAnterior;
                if (cambiatTipoCuentaDestinoLog.CuentaActualiza == null)
                  delete cambiatTipoCuentaDestinoLog.CuentaActualiza;
                this.Guardarlog(cambiatTipoCuentaDestinoLog);
                this.TerminoOperacionForm.get('Codigo')?.reset();
                this.BuscarPorCuenta();
                this.ObtenerHistorial();
                this.ImpresionCuentaDestinoPDF();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                this.notif.onDanger('Error', errorMessage);
                console.log(errorMessage);
              }
            );
          } else {
            this.notif.onWarning('Advertencia', 'Debe cambiar tipo cuenta destino.');
            this.bloquearbtnActalizar = false;
            this.bloquearbtnCalcular = false;
          }
        }
      } else if (this.TerminoOperacionForm.get('Codigo')?.value === '12') {  // Actualizar titulares termino
        if (this.TerminoForm.get('Clase')?.value === 10) {
          if (this.dataObjetTitulares.length !== 0) {
            this.dataTitulareslist = this.dataObjetTitulares;
            this.TerminoForm.get('Titulares')?.setValue(this.dataTitulareslist);
            this.loading = true;
            this.TerminoService.ActualizarTitularesTermino(this.TerminoForm.value).subscribe(
              result => {
                this.loading = false;
                this.clearTitulares();
                this.BloquearAutorizadoTituloInput(1);
                this.bloquear = false;
                this.bloquearNroTitulo = false;
                this.bloquearNegociacion = false;
                this.bloquearBuscar = false;
                this.bloquearEstado = false;
                this.bloquearDatosTitulares = false;
                this.bloquearAsociado = false;
                this.bloquearProducto = false;
                this.bloquearCuentaNegociacion = false;
                this.bloquearliquidacion = false;
                this.bloquearAsesorExterno = false;
                this.bloquearPuntos = false;
                this.DescriTipoFirma = true;
                this.notif.onSuccess('Exitoso', 'Se adicionó y/o eliminó autorizados correctamente.');
                this.btnGuardar = true;
                this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
                this.btnActualizarTitulares = true;
                this.btnOpcionesActualizarTitulares = true;
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
                this.ObtenerHistorial();
                this.TerminoOperacionForm.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
            this.ObtenerHistorial();
          } else {
            this.notif.onWarning('Advertencia', 'Debe ingresar al menos un autorizado cuando el titular es menor.');
          }
        } else {
          if (this.TerminoForm.get('IdTipoDocumento')?.value === 3) {
            if (this.dataObjetTitulares.length != 0) {
              this.dataTitulareslist = this.dataObjetTitulares;
              this.TerminoForm.get('Titulares')?.setValue(this.dataTitulareslist);
              this.loading = true;
              this.TerminoService.ActualizarTitularesTermino(this.TerminoForm.value).subscribe(
                result => {
                  this.loading = false;
                  this.clearTitulares();
                  this.BloquearAutorizadoTituloInput(1);
                  this.bloquear = false;
                  this.bloquearNroTitulo = false;
                  this.bloquearNegociacion = false;
                  this.bloquearBuscar = false;
                  this.bloquearEstado = false;
                  this.bloquearDatosTitulares = false;
                  this.bloquearAsociado = false;
                  this.bloquearProducto = false;
                  this.bloquearCuentaNegociacion = false;
                  this.bloquearliquidacion = false;
                  this.bloquearAsesorExterno = false;
                  this.bloquearPuntos = false;
                  this.DescriTipoFirma = true;
                  this.notif.onSuccess('Exitoso', 'Se adicionó y/o eliminó autorizados correctamente.');
                  this.btnGuardar = true;
                  this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                  this.btnActualizar = true;
                  this.btnActualizarTitulares = true;
                  this.btnOpcionesActualizarTitulares = true;
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
                      })
                    });
                  }
                  this.Guardarlog(tempAutorizaLog);
                  this.ObtenerHistorial();
                  this.TerminoOperacionForm.get('Codigo')?.reset();
                },
                error => {
                  this.loading = false;
                  const errorMessage = <any>error;
                  console.log(errorMessage);
                }
              );
              this.ObtenerHistorial();              
            } else {              
              this.notif.onWarning('Advertencia', 'Debe ingresar al menos un autorizado cuando el titular es juridico.');
            }
          }
          else { 
            this.dataTitulareslist = this.dataObjetTitulares
            this.TerminoForm.get('Titulares')?.setValue(this.dataTitulareslist);
            this.loading = true;
            this.TerminoService.ActualizarTitularesTermino(this.TerminoForm.value).subscribe(
              result => {
                this.loading = false;
                this.clearTitulares();
                this.BloquearAutorizadoTituloInput(1);
                this.bloquear = false;
                this.bloquearNroTitulo = false;
                this.bloquearNegociacion = false;
                this.bloquearBuscar = false;
                this.bloquearEstado = false;
                this.bloquearDatosTitulares = false;
                this.bloquearAsociado = false;
                this.bloquearProducto = false;
                this.bloquearCuentaNegociacion = false;
                this.bloquearliquidacion = false;
                this.bloquearAsesorExterno = false;
                this.bloquearPuntos = false;
                this.DescriTipoFirma = true;
                this.notif.onSuccess('Exitoso', 'Se adicionó y/o eliminó autorizados correctamente.');
                this.btnGuardar = true;
                this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
                this.btnActualizarTitulares = true;
                this.btnOpcionesActualizarTitulares = true;
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
                    })
                  });
                }
                this.Guardarlog(tempAutorizaLog);
                this.ObtenerHistorial();
                this.TerminoOperacionForm.get('Codigo')?.reset();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
            this.ObtenerHistorial();
          }         
        }
      } else if (this.TerminoOperacionForm.get('Codigo')?.value === '28') {  // Adicionar puntos
        var TasaEfectivaSin = this.TerminoForm.get('TasaEfectiva')?.value;
        TasaEfectivaSin = TasaEfectivaSin.replace("%", "");
        if (+Number(TasaEfectivaSin) !== this.datoAutorizacionTasa) {
          this.datoAutorizacionTasa = +Number(TasaEfectivaSin);

          const objectComplet = this.AdicionarPuntosFrom.value.AdicionarPunto;
          this.AdicionarPuntosFrom.get('AdicionarPunto')?.setValue(objectComplet.PuntosAdicionales);

          const TasaIncial = +this.datoTasaEfectiva;
          const PuntosAdicionales = +this.AdicionarPuntosFrom.get('AdicionarPunto')?.value.PuntosAdicionales;
          const Suma = ((TasaIncial + PuntosAdicionales).toFixed(4)).toString();
          var TasaEfectivaSin = this.TerminoForm.get('TasaEfectiva')?.value;
          TasaEfectivaSin = TasaEfectivaSin.replace("%", "");
          // if (TasaEfectivaSin === Suma) {

            this.loading = true;

            var TasaEfectivaSin = this.TerminoForm.get('TasaEfectiva')?.value;
            TasaEfectivaSin = TasaEfectivaSin.replace("%", "");
            this.TerminoForm.get('TasaEfectiva')?.setValue(Number(TasaEfectivaSin));

            var TasaNominalSin = this.TerminoForm.get('TasaNominal')?.value;
            TasaNominalSin = TasaNominalSin.replace("%", "");
          this.TerminoForm.get('TasaNominal')?.setValue(Number(TasaNominalSin)); 

          let puntosActualizaU;
          if (this.datoPuntosAdicionales === undefined) {
            puntosActualizaU = 0;
          }
          else {
            puntosActualizaU = this.datoPuntosAdicionales.PuntosAdicionales;
          }          
          let PuntosAdicionalesA =  this.AdicionarPuntosFrom.get('AdicionarPunto')?.value;

          // logAdicionarPuntos
          let tempPuntos: any =
          {  
            PuntosAdicionalesAnterior: puntosActualizaU,
            PuntosAdicionalesActualiza: PuntosAdicionalesA  
          }
          
            this.TerminoService.ActualizarTasaTermino(this.TerminoForm.value).subscribe(
              result => {
                this.loading = false;
                this.bloquear = false;
                this.bloquearNroTitulo = false;
                this.bloquearNegociacion = false;
                this.bloquearEstado = false;
                this.bloquearDatosTitulares = false;
                this.bloquearAsociado = false;
                this.bloquearProducto = false;
                this.bloquearBuscar = false;
                this.bloquearCuentaNegociacion = false;
                this.bloquearliquidacion = false;
                this.bloquearAsesorExterno = false;
                this.bloquearPuntos = false;
                this.notif.onSuccess('Exitoso', 'La adición de puntos se actualizó correctamente.');
                this.VolverArriba();
                this.bloquearPuntos = false;
                this.btnGuardar = true;
                this.TerminoForm.get('IdCuenta')?.setValue(result.IdCuenta);
                this.btnActualizar = true;
                this.btnActualizarTitulares = true;
                this.btnOpcionesActualizarTitulares = true;
                this.selectEstado = true;
                this.inputEstado = false;
                this.bloquearbtnActalizar = false;
                this.bloquearbtnCalcular = false;
                this.btnActualizarTab = true;
                this.btnCalcularTasa = true;
                this.bloquearPuntos = false;
                this.Guardarlog(tempPuntos);
                this.TerminoOperacionForm.get('Codigo')?.reset();
                this.ObtenerHistorial();
                this.BuscarPorCuenta();
              },
              error => {
                this.loading = false;
                const errorMessage = <any>error;
                console.log(errorMessage);
              }
            );
          // } else {
          //   this.notif.onWarning('Advertencia', 'Tasa incorrecta por favor verificar.');
          // }
        } else {
          this.notif.onWarning('Advertencia', 'Debe cambiar tasa.');
          this.bloquearbtnActalizar = false;
          this.bloquearbtnCalcular = false;
        }
      }
    } else {
      this.notif.onWarning('Advertencia',
        'Debe buscar una cuenta para realizar esta operación.');
    }
  }
  //Imprimir Capitalizacion

  ImpresionCapitalizacionPDF(ReimprimirBool: boolean = false) {
    this.CapitalizacionPdf(ReimprimirBool);
    $("#ImpresionTermino").show();
    this.ModalImpresion.nativeElement.click();
  }
  CapitalizacionPdf(ReimprimirBool: boolean = false) {
    let payload: any = {
      Cuenta: this.dataObjet.Cuenta,
      Documento: this.dataObjet.NumeroDocumento,
      Nombre: this.TerminoForm.controls["Nombre"].value,
      TipoDocumento: this.dataObjet.TipoDocumento,
      TipoAhorro: this.dataObjet.DescripcionProducto,
      CuentaDesembolso: "",
      TipoPdf: "",
      TitiloPdf: "",
      CiudadPdf: "",
      CiudadExpedicion: this.dataObjet.CiudadExpTermino,
      TasaAporte: this.dataObjet.TasaAdicional.toFixed(4) + "%",
      FechaApertura: this.TerminoForm.controls["FechaApertura"].value,
      ReimprimirBool: ReimprimirBool
    }
    this.linkPdf = "";
    let pdfinBase64 = null;
    let byteArray = null;
    let newBolb = null;
    let url = null;
    document.querySelector("object")!.data = "";
    document.querySelector("object")!.name = "";
    document.querySelector("object")!.type = "";
    this.loading = true;
    this.TerminoService.GenerarPDFCapitalizacionTermino(payload).subscribe(result => {
      pdfinBase64 = result.FileStream._buffer;
      byteArray = new Uint8Array(
        atob(pdfinBase64).split("").map((char) => char.charCodeAt(0))
      );
      newBolb = new Blob([byteArray], { type: "application/pdf" });
      this.linkPdf = URL.createObjectURL(newBolb);
      url = window.URL.createObjectURL(newBolb);
      document.querySelector("object")!.data = url;
      document.querySelector("object")!.name = "Impresion";
      document.querySelector("object")!.type = "application/pdf";
      this.loading = false;

      delete payload.CuentaDesembolso;
      delete payload.TipoPdf;
      delete payload.TitiloPdf;
      delete payload.CiudadPdf;
      delete payload.ReimprimirBool;
      if (this.TerminoOperacionForm.get('Codigo')?.value != "" && this.TerminoOperacionForm.get('Codigo')?.value != null) {
        if (this.TerminoOperacionForm.get('Codigo')?.value === '103')
          this.Guardarlog({ Reimprimir_Capitalizacion: payload });
        else
          this.Guardarlog({ Imprimir_Capitalizacion: payload });
      }
      setTimeout(() => {
        this.TerminoOperacionForm.get('Codigo')?.setValue("");
      }, 500);

    },
      error => {
        this.loading = false
        const errorMessage = <any>error;
        console.log(errorMessage);
      });
  }
  validateForm() {
    const Codigo = new FormControl('', [Validators.required]);
    const IdDigito = new FormControl('', [Validators.pattern('[0-9]*')]);
    const IdConsecutivo = new FormControl('', [Validators.pattern('[0-9]*')]);
    const IdProductoCuenta = new FormControl('', [Validators.pattern('[0-9]*')]);
    const IdOficina = new FormControl('', [Validators.pattern('[0-9]*')]);
    const NumeroOficinaAsociado = new FormControl('', [Validators.required]);
    const NombreOficinaAsociado = new FormControl('', [Validators.required]);
    const Clase = new FormControl('', [Validators.required]);
    const Nombre = new FormControl('', [Validators.required]);
    const NumeroDocumento = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    const NombreOficina = new FormControl('', [Validators.required]);
    const NumeroOficina = new FormControl('', [Validators.required]);
    const IdProducto = new FormControl('', []);
    const DescripcionProducto = new FormControl('', [Validators.required]);
    const IdOperacion = new FormControl('', []);
    const DescripcionOperacion = new FormControl('', [Validators.required]);
    const IdAsesor = new FormControl('', [Validators.required]);
    const NombreAsesor = new FormControl('', [Validators.required]);
    const IdEstado = new FormControl('', []);
    const DescripcionEstado = new FormControl('', [Validators.required]);
    const strCodigo = new FormControl('', [Validators.pattern('[0-9]*')]);
    const strNombre = new FormControl('', []);
    const strTipo = new FormControl('', []);
    const NroTitulo = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    const NroTituloAnterior = new FormControl('', []);
    const IdAsesorExterno = new FormControl('', []);
    const IdCuenta = new FormControl('', []);
    const Cuenta = new FormControl('', []);
    const IdUsuarioSGF = new FormControl('', []);
    const LngTercero = new FormControl('', []);
    const PlazoDias = new FormControl('', []);
    const Plazo = new FormControl('', []);
    const ValorTotal = new FormControl('', []);
    const IdFrecuenciaPago = new FormControl('', [Validators.required]);
    const DescripcionFrecuenciaPago = new FormControl('', []);
    const IdLiquidacion = new FormControl('', [Validators.required]);
    const CuentaDestino = new FormControl('', []);
    const AdicionarPunto = new FormControl('', []);
    const TasaEfectiva = new FormControl('', []);
    const TasaNominal = new FormControl('', []);
    const TasaAdicional = new FormControl('', []);
    const Tasa = new FormControl('', []);
    const RetencionFuentePeriodo = new FormControl('', []);
    const InteresCausado = new FormControl('', []);
    const Canje = new FormControl('', []);
    const InteresxPagar = new FormControl('', []);
    const InteresPagado = new FormControl('', []);
    const SaldoTotal = new FormControl('', []);
    const Efectivo = new FormControl('', []);
    const Edad = new FormControl('', []);
    const FechaApertura = new FormControl('', []);
    const FechaVencimiento = new FormControl('', []);
    const FechaUltliqIntereses = new FormControl('', []);
    const FechaProxliqIntereses = new FormControl('', []);
    const FechaUltimaTrans = new FormControl('', []);
    const FechaCancelacion = new FormControl('', []);
    const IdObseCambioEstado = new FormControl('', []);
    const BuscarDocumento = new FormControl('', []);
    const BuscarNombre = new FormControl('', []);
    const TipoDocumento = new FormControl('', []);

    const DocumentoAsesor = new FormControl('', []);
    const IdRelacionTipo = new FormControl('', []);
    const IdCuentaDestino = new FormControl('', []);

    const PuntosAdicionalesAsesoria = new FormControl('', []);
    const InteresNeto = new FormControl('', []);
    const TotalInteresNeto = new FormControl('', []);
    const Retencion = new FormControl('', []);
    const TotalRetencion = new FormControl('', []);
    const InteresBruto = new FormControl('', []);
    const TotalInteresBruto = new FormControl('', []);
    const Aportes = new FormControl('', []);
    const TotalAportes = new FormControl('', []);
    const AdicionarP = new FormControl('', []);
    const TotalInteres = new FormControl('', []);


    const IdTipoDocumento = new FormControl('', []);
    const DocumentoBeneficiario = new FormControl({ value: "", disabled: true }, [Validators.pattern('^[a-zA-Zñáéíóú 0-9]*')]);
    const PrimerNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const SegundoNombre = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const PrimerApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const SegundoApellido = new FormControl('', [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    const DatosParentesco = new FormControl({ value: "", disabled: true }, []);
    const Porcentaje = new FormControl({ value: "", disabled: true }, [Validators.pattern('^[0-9]*')]);
    const BeneficiarioTermino = new FormControl('', []);

    const DocumentoTitular = new FormControl({ value: "", disabled: true }, []);
    const NombreTitular = new FormControl({ value: "", disabled: true }, []);
    const Tipo = new FormControl({ value: "", disabled: true }, []);
    const TipoFirma = new FormControl({ value: "", disabled: true }, []);
    const Observacion = new FormControl("", []);
    const Titulares = new FormControl('', []);

    const TelefonoTermino = new FormControl('', []);
    const DireccionTermino = new FormControl('', []);
    const CiudadTermino = new FormControl('', []);
    const lngTercero = new FormControl('', []);
    const lngCuenta = new FormControl('', []);
    const IdTipoObservacion = new FormControl('', []);
    const IdTipoObservacionSend = new FormControl('', []);
    const Variable = new FormControl('', []);


    this.TerminoOperacionForm = new FormGroup({
      Codigo: Codigo,
    });
    const CesionTituloDocumento = new FormControl({ value: "", disabled: !this.bloquearCesionTitulo }, []);
    const CesionTituloNombre = new FormControl({ value: "", disabled: !this.bloquearCesionTitulo }, [Validators.pattern('[a-zA-Zñáéíóú ]*')]);
    this.TerminoForm
    this.TerminoForm = new FormGroup({
      IdDigito: IdDigito,
      IdConsecutivo: IdConsecutivo,
      IdProductoCuenta: IdProductoCuenta,
      IdOficina: IdOficina,
      NumeroOficinaAsociado: NumeroOficinaAsociado,
      NombreOficinaAsociado: NombreOficinaAsociado,
      Clase: Clase,
      Nombre: Nombre,
      NumeroDocumento: NumeroDocumento,
      NombreOficina: NombreOficina,
      NumeroOficina: NumeroOficina,
      IdProducto: IdProducto,
      DescripcionProducto: DescripcionProducto,
      IdOperacion: IdOperacion,
      DescripcionOperacion: DescripcionOperacion,
      IdAsesor: IdAsesor,
      NombreAsesor: NombreAsesor,
      IdEstado: IdEstado,
      DescripcionEstado: DescripcionEstado,
      NroTitulo: NroTitulo,
      NroTituloAnterior: NroTituloAnterior,
      IdAsesorExterno: IdAsesorExterno,
      IdCuenta: IdCuenta,
      Cuenta: Cuenta,
      IdUsuarioSGF: IdUsuarioSGF,
      LngTercero: LngTercero,
      PlazoDias: PlazoDias,
      Plazo: Plazo,
      ValorTotal: ValorTotal,
      IdFrecuenciaPago: IdFrecuenciaPago,
      DescripcionFrecuenciaPago: DescripcionFrecuenciaPago,
      IdLiquidacion: IdLiquidacion,
      CuentaDestino: CuentaDestino,
      TasaEfectiva: TasaEfectiva,
      TasaNominal: TasaNominal,
      TasaAdicional: TasaAdicional,
      Tasa: Tasa,
      RetencionFuentePeriodo: RetencionFuentePeriodo,
      InteresCausado: InteresCausado,
      Canje: Canje,
      InteresxPagar: InteresxPagar,
      InteresPagado: InteresPagado,
      SaldoTotal: SaldoTotal,
      Efectivo: Efectivo,
      Edad: Edad,
      FechaApertura: FechaApertura,
      FechaVencimiento: FechaVencimiento,
      FechaUltliqIntereses: FechaUltliqIntereses,
      FechaProxliqIntereses: FechaProxliqIntereses,
      FechaUltimaTrans: FechaUltimaTrans,
      FechaCancelacion: FechaCancelacion,
      IdObseCambioEstado: IdObseCambioEstado,
      BuscarDocumento: BuscarDocumento,
      BuscarNombre: BuscarNombre,
      TipoDocumento: TipoDocumento,

      DocumentoAsesor: DocumentoAsesor,
      IdRelacionTipo: IdRelacionTipo,
      IdCuentaDestino: IdCuentaDestino,

      PuntosAdicionalesAsesoria: PuntosAdicionalesAsesoria,

      IdTipoDocumento: IdTipoDocumento,
      DocumentoBeneficiario: DocumentoBeneficiario,
      PrimerNombre: PrimerNombre,
      SegundoNombre: SegundoNombre,
      PrimerApellido: PrimerApellido,
      SegundoApellido: SegundoApellido,
      DatosParentesco: DatosParentesco,
      Porcentaje: Porcentaje,
      BeneficiarioTermino: BeneficiarioTermino,

      DocumentoTitular: DocumentoTitular,
      NombreTitular: NombreTitular,
      Tipo: Tipo,
      TipoFirma: TipoFirma,
      Observacion: Observacion,
      Titulares: Titulares,

      TelefonoTermino: TelefonoTermino,
      DireccionTermino: DireccionTermino,
      CiudadTermino: CiudadTermino,

      AdicionarP: AdicionarP,

      CesionTituloDocumento: CesionTituloDocumento,
      CesionTituloNombre: CesionTituloNombre,

      TotalInteres: TotalInteres,
      IdTipoObservacionSend: IdTipoObservacionSend,
      Variable: Variable,


    });
    this.CambioEstadoFrom = new FormGroup({
      lngTercero: lngTercero,
      lngCuenta: lngCuenta,
      IdTipoObservacion: IdTipoObservacion
    });
    this.AsesorForm = new FormGroup({
      strCodigo: strCodigo,
      strNombre: strNombre,
      strTipo: strTipo
    });



    this.AdicionarPuntosFrom = new FormGroup({
      AdicionarPunto: AdicionarPunto,
    });
    this.InteresForm = new FormGroup({
      InteresNeto: InteresNeto,
      TotalInteresNeto: TotalInteresNeto,
      Retencion: Retencion,
      TotalRetencion: TotalRetencion,
      InteresBruto: InteresBruto,
      TotalInteresBruto: TotalInteresBruto,
      Aportes: Aportes,
      TotalAportes: TotalAportes,
    });
  }
  // para guardar asesoria
  validateAsesoria() {
    const NumeroOficina = new FormControl('', []);
    const IdProducto = new FormControl('', []);
    const IdAsesor = new FormControl('', []);
    const NumeroDocumento = new FormControl('', []);
    const NumeroAsesoria = new FormControl('', []);
    const Plazo = new FormControl('', []);
    const ForLiquidacion = new FormControl('', []);
    const Periodo = new FormControl('', []);
    const IdIndicador = new FormControl('', []);
    const Puntos = new FormControl('', []);
    const ValorTitulo = new FormControl('', []);
    const Retencion = new FormControl('', []);
    const Intereses = new FormControl('', []);
    const Herencia = new FormControl('', []);
    const TasaAdicional = new FormControl('', []);
    const PuntosAdicionales = new FormControl('', []);
    const Aportes = new FormControl('', []);
    const IdRelacion = new FormControl('', []);
    const IdEstado = new FormControl('', []);
    const IdFrecuenciaPago = new FormControl('', []);
    const TasaNominal = new FormControl('', []);


    this.AsesoriaSendForm = new FormGroup({
      NumeroOficina: NumeroOficina,
      IdProducto: IdProducto,
      IdAsesor: IdAsesor,
      NumeroDocumento: NumeroDocumento,
      NumeroAsesoria: NumeroAsesoria,
      Plazo: Plazo,
      ForLiquidacion: ForLiquidacion,
      Periodo: Periodo,
      IdIndicador: IdIndicador,
      Puntos: Puntos,
      ValorTitulo: ValorTitulo,
      Retencion: Retencion,
      Intereses: Intereses,
      Herencia: Herencia,
      TasaAdicional: TasaAdicional,
      PuntosAdicionales: PuntosAdicionales,
      Aportes: Aportes,
      IdRelacion: IdRelacion,
      IdEstado: IdEstado,
      IdFrecuenciaPago: IdFrecuenciaPago,
      TasaNominal: TasaNominal
    });
  }
  btnMostrar() {
    if (this.dataObjet != undefined)
      console.log("tasa ", this.dataObjet.TasaAdicional)
    else
      console.log("no hay")
  }
}
