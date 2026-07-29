import { Component, ElementRef, EventEmitter, Output, signal, viewChild, ViewChild } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, Validators } from '@angular/forms';
import { OperacionesService } from '../../../../Services/Maestros/operaciones.service';
import { FormaPagoEnum, Tabs, TipoBusquedaResumen, TipoSistemas } from '../../../../Models/Productos/cartera/gestion-credito.enum';
import { CarteraService } from '../../../../Services/Productos/cartera.service';
import { ActualizarPagareDto, CalcularCuota, CambiarCalificacionDto, CambiarFormaPagoDto, CambiarLineaCreditoDto, CodeudorDraft, CuentaCarteraDetalle, CuentaCarteraResumen, CuentaFormateada, DebitoAutomaticoCreditoDto, Diferido, FechasCredito, GarantiaDisponible, GarantiaPersonalCod, GarantiaReal, HistorialOperacion, LineaCambioListDto, LogCambiarCodeudores, ManejarSeguroCreditoDto, ObservacionRadicado, Provision, Referencia, ResultadoOperacionDto, CambiarInfoCreditoLog, CambiarGarantiaDto, CambiarGarantiasRequestDto, DetalleGarantiaCreditoDto, GarantiaRealAsignada, ObtenerCodeudorBasicoModel, PeriodoPago, GarantiaCompartida, CrearInsolvencia, DevolverReest, TipoSeguimientoInsolvencia, InsolvenciaHistoricoDto, InsolvenciaAcuerdoPagoDto, InstanciaInsolvencia } from '../../../../Models/Productos/cartera/gestion-credito.model';
import { catchError, concatMap, finalize, firstValueFrom, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { MiListaProductosService } from '../../../../Services/Informes/mi-lista-productos.service';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones';
import Swal from 'sweetalert2';
import { DetalleCartera, DetalleRadicado, EncabezadoRadicado } from '../../../../Models/Informes/MisProductos/mis-producto.model';
import { TablaVirtualComponent } from '../../../Tabla-virtual/tabla-virtual/tabla-virtual.component';
import { MapeoColumna, transformarDatosParaTabla } from '../../../../utils/tabla-utils';
import { DecimalPipe, formatDate } from '@angular/common';
import { ContractualService } from '../../../../Services/Productos/contractual.service';
import { event } from 'jquery';
import { GeneralesService } from '../../../../Services/Productos/generales.service';
import { formateadoresPorOperacion } from '../../../../utils/historial-formatters';
import { HttpErrorResponse } from '@angular/common/http';
import { CambiarInfoCreditoContext, Novedad, Operacion } from '../../../../Models/Productos/cartera/cambiar-tasa-context';
import { CambiarInfoCreditoForm } from './cambiar-infocredito-form/cambiar-infocredito-form.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { BusquedaGenericaService } from '../../../../Services/Generics/busqueda-generica.service';
import { ERROR_MESSAGES, ErrorCode, PERIODOS_MESES } from '../../../../utils/constants';
import { LoadingService } from '../../../../Services/shared/loading.service';
import { diferenciaEnDias, diferenciaEnMeses, omit } from '../../../../utils/helpers';
import { CambiarGarantiasModalComponent } from '../../../shared/cambiar-garantias-modal/cambiar-garantias-modal.component';

@Component({
  selector: 'app-gestion-credito',
  templateUrl: './gestion-credito.component.html',
  styleUrl: './gestion-credito.component.css',
  providers: [ContractualService],
  standalone: false
})
export class GestionCreditoComponent {
  @ViewChild('ModalBuscarAsociados', { static: true }) private ModalBuscarAsociados!: ElementRef;
   @ViewChild('ModalDebitoAutomatico', { static: true }) private ModalDebitoAutomatico!: ElementRef;
  @ViewChild('cerrarModal', { static: true }) private cerrarModal!: ElementRef;
  @ViewChild(TablaVirtualComponent) tablaVirtual!: TablaVirtualComponent;
  @ViewChild('abrirModalDetalleRadicado', { static: true }) private abrirModalDetalleRadicado!: ElementRef;
  @ViewChild('planDePagosPdf', { static: true }) private planDePagosPdf!: ElementRef;
  @ViewChild('openModalPlanDePagos', { static: true }) private openModalPlanDePagos!: ElementRef;
  @ViewChild('openCambiarCodeudoresModal', { static: true }) private openCambiarCodeudoresModal!: ElementRef;
  @ViewChild(CambiarInfoCreditoForm, { static: false }) private cambiarTasaModal?: CambiarInfoCreditoForm;
  
  @ViewChild('lineaInput') lineaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('pagareInput') pagareInput!: ElementRef<HTMLInputElement>;
  @ViewChild('btnModalCambiarLinea', { static: true }) btnModalCambiarLinea!: ElementRef;
  @ViewChild('ModalRegistrarDebitoAutomatico', { static: true }) private ModalRegistrarDebitoAutomatico!: ElementRef;
  @ViewChild('openCambiarGarantiasModal', { static: true }) private openCambiarGarantiasModal!: ElementRef;
  @ViewChild('modalGarantias') modalGarantias!: CambiarGarantiasModalComponent;
  @ViewChild('openProcesoInsolvenciaModal', { static: true }) private openProcesoInsolvenciaModal!: ElementRef;

  private codModulo = 45;
  public dataUser: any;
  detalleCuenta!: CuentaCarteraDetalle;
  checkCartera: any;
  radicados: any;
  observacionesRadicado: ObservacionRadicado[] = [];
  public gestionCreditoForm!: FormGroup;
  public gestionCreditoOperacionForm!: FormGroup;
  public AsesorExternoForm!: FormGroup;
  public DatosForm!: FormGroup;
  public SaldosForm!: FormGroup;
  public CobrosForm!: FormGroup;
  cupoForm!: FormGroup;
  public CuotaForm!: FormGroup;
  public codeudorForm!: FormGroup;
  public resultOperaciones: any;
  public bloquearConsultaCuenta: boolean = false;
  public BloquearBuscar = false;
  public Bloquear = false;
  public BloquearBtnRegistroFirma = false;
  public BloquearAsociado = false;
  public BloquaerProducto = false;
  public BloquearTimbrarMensaje = false;
  public EnableExoneradaGMF: boolean = false;
  public EnableExentaGMF: boolean = false;
  periodosPago: PeriodoPago[] = [];

  //pagare
  public cambiarPagare: boolean = false;
  public campoPagareHabilitado: boolean = false;
  public mostrarBotonesActualizarPagare: boolean = false;
  public mostrarBotonesLimpiar: boolean = false;
  public esCreditoPadre: boolean = false;
  public readonly ID_CAMBIAR_PAGARE = 126;
  public pagareActual?: number;
  public tipoPagareActual?: number;
  public tipoPagareInicial!: number;
  tipoPagareDescripcionActual = '';
  public tiposPagare = [
  { id: 1, descripcion: 'Desmaterializado' },
  { id: 2, descripcion: 'Fisico' }
  ];

  //linea
  public cambiarLinea: boolean = false;
  public campoLineaHabilitado: boolean = false;
  public lineaActual?: number;
  public nombreLineaActual?: string;
  public mostrarBotonesActualizarLinea: boolean = false;
  public lineasDisponibles: LineaCambioListDto[] = [];
  public lineasFiltradas: LineaCambioListDto[] = [];
  public columnasLineas =  ['Linea', 'Nombre'];
  public lineasParaTabla: any[] = [];
  public lineaSeleccionada: LineaCambioListDto | null = null;

  //Forma Pago
  public formaPagoActual?: number;
  public formaPagoInicial?: number;
  public cambiarFormaPago: boolean = false;
  public mostrarBotonesActualizarFormaPago = false;
  public campoFormaPagoHabilitado: boolean = false;
  private debitoAnterior: DebitoAutomaticoCreditoDto | null = null;
  public debitoAutomaticoFrom!: FormGroup;
  public resultCuentaDebito: any;
  public documentoSugDebito?: string;
  public BloquearCuentaOrigen: boolean | null = false;
  public BloquearNombreDebito: boolean | null = false;
  
  //Calificación
  public calificacionForm!: FormGroup;
  public calificacionInicial: any;
  public resultCausales: any[] = [];
  public resultListaCalificaciones: any[] = [];

  //Insolvencia
  public resultCausalesInsolvencia: any[] = [];
  public insolvenciaForm!: FormGroup;
  public tiposSeguimientoInsolvencia: TipoSeguimientoInsolvencia[] = [];
  public historicoInsolvencia: InsolvenciaHistoricoDto[] = []
  public detalleAcuerdo?: InsolvenciaAcuerdoPagoDto;
  public isDisabledLimpiarInsolvenciaButton = true;
  public isDisabledGuardarInsolvenciaButton = true;
  public mapaNumeracionInsolvencias: Record<string, number> = {};
  public isSavingInsolvencia = false;
  public instanciasInsolvencia: InstanciaInsolvencia[] = [];
  public fechaMaxima = new Date().toISOString().split('T')[0];

//Garantias
  public datosCuenta: any;
  public garantiasForm!: FormGroup;
  public isDisabledConfirmarGarantiasButton: boolean = true;
  public isDisabledLimpiarGarantiasButton: boolean = true;
  public mostrarGarantiasCodeudor: boolean = false;
  public isDisabledSaveGarantiasButton: boolean = true;
  public garantiasEliminar: GarantiaRealAsignada[] = [];
  public garantiasAgregar: GarantiaRealAsignada[] = [];
  public garantiasCompartidas: GarantiaCompartida[] = [];
  public garantiasRealesAsignadas: GarantiaRealAsignada[] = [];
  public garantiasCompartidasBackend: GarantiaCompartida[] = [];
  public listGarantiasDisponiblesCodeudor: GarantiaDisponible[] = [];
  public listGarantiasDisponiblesDeudor: GarantiaDisponible[] = [];
  public codeudoresBasico: ObtenerCodeudorBasicoModel [] = []
  public garantiasRealesAsignadasInicial: GarantiaRealAsignada[] = [];
  public mostrarDetalleGarantia = false;
  public valorCoberturaCompartidas: number = 0;
  public mostrarModal = false;


  private readonly NOMBRES_CAMPOS_NUMERO_CUENTA: string[] = ['IdOficinaCuenta', 'IdProductoCuenta', 'IdConsecutivo', 'IdDigito'];
  private readonly NOMBRES_CAMPOS_BUSQUEDA: string[] = [...this.NOMBRES_CAMPOS_NUMERO_CUENTA, 'BuscarDocumento', 'BuscarNombre', 'pagare'];
  public tiposRelacion: any[] = [];
  public cuentasResumenData: CuentaCarteraResumen[] = [];
  public currentIdCuenta: number | undefined;
  public resultOperacionesPermitadas: any[] = [];
  public resultFormasPago: any[] = [];
  public resultEstadosCuenta: any[] = [];
  public datosTransformados: any[] = [];
  public encabezadosTablaModalAlBuscar: string[] = [];
  garantiasPersonalesCod: GarantiaPersonalCod[] = [];
  codeudoresDraft: CodeudorDraft[] = [];
  garantiasReales: GarantiaReal[] = [];
  isDisabledConfirmarButton = true;
  codeudoresAnteriores: CodeudorDraft[]= [];
  estadoCargaTabs: Partial<Record<Tabs, boolean>> = {
    [Tabs.Garantias]: false,
    [Tabs.Deducibles]: false,
    [Tabs.Provision]: false,
    [Tabs.Referencias]: false,
    [Tabs.Cupo]: false,
    [Tabs.Historial]: false
  };

  deducibles: Diferido[] = [];
  selectedRows: Record<string, null | number> = {
    codeudores: null,
    reales: null,
    deducibles: null,
    provisiones: null,
    refPersonales: null,
    refComerciales: null,
    codeudoresDraft: null
  }
  saldoDeducibleTotal = 0;
  valorCuotaTotal = 0;
  saldoInicialDeducibleTotal = 0;
  cuotaPactadaTotal = 0;
  valorPagadoTotal = 0;
  provisiones: Provision[] = [];
  refPersonales: Referencia[] = [];
  refComcerciales: Referencia[] = [];
  historial: HistorialOperacion[] = [];
  encabezadoRadicado: EncabezadoRadicado | null = null;
  detalleRadicado: DetalleRadicado | null = null;

  ColorAnterior: any;
  Tabs = Tabs;
  tabActivo: Tabs = Tabs.Datos;
  activaDatos: boolean = true;
  activaSaldos: boolean = false;
  estaTabValorCuotaActivo: boolean = false;
  estaTabGarantiasActivo: boolean = false;
  estaTabDeduciblesActivo: boolean = false;
  _datoCuota = true;
  _datoCuotaCalcular = true;
  isCuota = false;
  isCancelacion = false;
  option: number = 0;
  _datoCostasJudiciales = true;

  // totales cuota
  totalCapital: number = 0;
  totalInteres: number = 0;
  totalInteresMora: number = 0;
  totalDeducibles: number = 0;
  CostasJudiciales: number = 0;
  total: number = 0;
  
   public BloquearCalcularCuota = true; 
  public ValidaPactado: boolean = false;
  public carteraInfo = new DetalleCartera();
  public lstCalificacion: any[] = [];
  public lstCalcularCuota: any[] = [];
  public lstAnalisisCalificacion: any[] = [];
  public lstSimularPago: any[] = [];
  public lstReestructuracion: any[] = [];
  public lstReliquidacion: any[] = [];
  public resultDebito: any[] = [];
  cambiarInfoCreditoContext!: CambiarInfoCreditoContext;
  estaAbiertoModalCambios = false;
  operacionActual: string = '';
  blobUrlPlanDePagoPDF = '';
  cuotaTabBloqueado: boolean = false;


  constructor(
    private operacionesService: OperacionesService,
    private carteraService: CarteraService,
    private contractualService: ContractualService,
    private miListaProductosService: MiListaProductosService,
    private notif: ToastrService,
    private generalesService: GeneralesService,
    private busquedaService: BusquedaGenericaService,
    private loading: LoadingService
  ) { }

  ngOnInit() {
    this.validateForm();
    this.loadOperaciones();
    this.getFormasPago();
    
  }
  validateForm() {
    const IdAsesor = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const NombreAsesor = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const IdProducto = new FormControl({ value: '', disabled: true }, []);
    const DescripcionProducto = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const Nombre = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const IdTipoDocumento = new FormControl({ value: '', disabled: true }, []);
    const NumeroDocumento = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const BuscarDocumento = new FormControl({ value: '', disabled: true }, []);
    const BuscarNombre = new FormControl({ value: '', disabled: true }, [
      Validators.minLength(6),
      Validators.maxLength(100),
      Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s'-]+$")
    ]);
    const Codigo = new FormControl({ value: '', disabled: false }, [Validators.required]);
    const IdDigito = new FormControl({ value: '', disabled: true }, [Validators.pattern('^[0-9]*$')]);
    const IdConsecutivo = new FormControl({ value: '', disabled: true }, [Validators.pattern('^[0-9]*$')]);
    const IdProductoCuenta = new FormControl({ value: '', disabled: true }, [Validators.pattern('^[0-9]*$')]);
    const CodigoCuentaFormateado = new FormControl({ value: '', disabled: true }, [Validators.pattern('^[0-9]*$')]);
    const IdOficinaCuenta = new FormControl({ value: '', disabled: true }, [Validators.pattern('^[0-9]*$')]);
    const NumeroOficinaAsociado = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const NombreOficinaAsociado = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const NombreOficina = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const NumeroOficina = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const IdEstadoCuenta = new FormControl({ value: '', disabled: true }, []);
    const NombreEstadoCuenta = new FormControl({ value: '', disabled: true }, []);
    const IdFormaPago = new FormControl({ value: '', disabled: true }, []);
    const DescripcionFormaPago = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const IdAsesorExterno = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
    const NombreAsesorExterno = new FormControl({ value: '', disabled: true }, []);
    const IdCuenta = new FormControl({ value: '', disabled: true }, []);
    const CuotaManejo = new FormControl({ value: '', disabled: true }, []);
    const FechaRediferir = new FormControl({ value: '', disabled: true }, []);
    const IdPlazo = new FormControl({ value: '', disabled: true }, []);
    const FechaCambioPlazo = new FormControl({ value: '', disabled: true }, []);
    const IdDiaCorte = new FormControl({ value: '', disabled: true }, []);
    const CupoAprobado = new FormControl({ value: '', disabled: true }, []);
    const CupoUtilizado = new FormControl({ value: '', disabled: true }, []);
    const NumeroPagare = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
    const Radicado = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
    const Tipo = new FormControl({ value: '', disabled: true }, []);
    const TipoFirma = new FormControl({ value: '', disabled: true }, []);
    const IdLinea = new FormControl({ value: '', disabled: true }, []);
    const Sigla = new FormControl({ value: '', disabled: true }, []);
    const Linea = new FormControl({ value: '', disabled: true }, []);
    const ManejoCupo = new FormControl({ value: false, disabled: true }, []);
    const Monto = new FormControl({ value: '', disabled: true }, []);
    const FechaCredito = new FormControl({ value: '', disabled: true }, []);
    const FechaProximoCobro = new FormControl({ value: '', disabled: true }, []);
    const LibretaPlastico = new FormControl({ value: '', disabled: true }, []);
    const pagare = new FormControl({ value: '', disabled: true }, [Validators.pattern('^[0-9]*$')]);
    const IdRelacionCliente = new FormControl({ value: '', disabled: true }, []);
    const NombreRelacionCliente = new FormControl({ value: '', disabled: true }, []);
    const estaReestructurado = new FormControl({ value: false, disabled: true }, []);
    const estaReliquidado = new FormControl({ value: false, disabled: true }, []);
    const estaCastigado = new FormControl({ value: false, disabled: true }, []);
    const estaSinCobertura = new FormControl({ value: false, disabled: true }, []);
    const esModificado = new FormControl({ value: false, disabled: true }, []);
    const tieneExcepciones = new FormControl({ value: false, disabled: true }, []);
    const Cuenta = new FormControl({ value: '', disabled: true }, []);
    const IdOperacionPermitida = new FormControl({ value: '', disabled: true }, []);
    const NombreOperacionPermitida = new FormControl({ value: '', disabled: true }, []);
    const IdTercero = new FormControl({ value: '', disabled: true }, []);
    const TipoCliente = new FormControl({ value: '', disabled: true }, []);
    const fechaApertura = new FormControl({ value: '', disabled: true }, []);
    const fechaUltimaTrans = new FormControl({ value: '', disabled: true }, []);
    const fechaCancelacion = new FormControl({ value: '', disabled: true }, []);
    const fechaVencimiento = new FormControl({ value: '', disabled: true }, []);
    const cambioFechaPago = new FormControl({ value: '', disabled: true }, []);
    const fechaProximoPago = new FormControl({ value: '', disabled: true }, []);
    const fechaContingencia = new FormControl({ value: '', disabled: true }, []);
    const fechaInicioPeriodoGracia = new FormControl({ value: '', disabled: true }, []);
    const fechaCambioTasa = new FormControl({ value: '', disabled: true }, []);
    const TipoPagare = new FormControl({ value: '', disabled: true }, []);
    const ValorCobertura = new FormControl({ value: '', disabled: true }, []);
    const esCreditoPadre = new FormControl({ value: false, disabled: true }, []);

    this.gestionCreditoForm = new FormGroup({
      IdAsesor: IdAsesor,
      NombreAsesor: NombreAsesor,
      IdProducto: IdProducto,
      DescripcionProducto: DescripcionProducto,
      Nombre: Nombre,
      IdTipoDocumento,
      NumeroDocumento: NumeroDocumento,
      BuscarDocumento: BuscarDocumento,
      BuscarNombre: BuscarNombre,
      IdDigito: IdDigito,
      IdConsecutivo: IdConsecutivo,
      IdProductoCuenta: IdProductoCuenta,
      CodigoCuentaFormateado,
      IdOficinaCuenta,
      NumeroOficinaAsociado: NumeroOficinaAsociado,
      NombreOficinaAsociado: NombreOficinaAsociado,
      NombreOficina: NombreOficina,
      NumeroOficina: NumeroOficina,
      IdEstadoCuenta,
      NombreEstadoCuenta,
      IdFormaPago: IdFormaPago,
      DescripcionFormaPago: DescripcionFormaPago,
      IdCuenta: IdCuenta,
      CuotaManejo: CuotaManejo,
      FechaRediferir: FechaRediferir,
      IdPlazo: IdPlazo,
      FechaCambioPlazo: FechaCambioPlazo,
      IdDiaCorte: IdDiaCorte,
      CupoAprobado: CupoAprobado,
      CupoUtilizado: CupoUtilizado,
      NumeroPagare: NumeroPagare,
      Radicado,
      Tipo: Tipo,
      TipoFirma: TipoFirma,
      IdLinea,
      Sigla,
      Linea,
      ManejoCupo,
      Monto: Monto,
      FechaCredito: FechaCredito,
      FechaProximoCobro: FechaProximoCobro,
      LibretaPlastico: LibretaPlastico,
      pagare,
      IdRelacionCliente,
      NombreRelacionCliente,
      estaReestructurado,
      estaReliquidado,
      estaCastigado,
      estaSinCobertura,
      esModificado,
      tieneExcepciones,
      Cuenta: Cuenta,
      IdAsesorExterno,
      NombreAsesorExterno,
      IdOperacionPermitida,
      NombreOperacionPermitida,
      IdTercero,
      TipoCliente,
      fechaApertura,
      fechaUltimaTrans,
      fechaCancelacion,
      fechaVencimiento,
      cambioFechaPago,
      fechaProximoPago,
      fechaContingencia,
      fechaInicioPeriodoGracia,
      fechaCambioTasa,
      TipoPagare,
      ValorCobertura: ValorCobertura,
      esCreditoPadre
    });

    this.gestionCreditoOperacionForm = new FormGroup({
      Codigo: Codigo,
    });

    // TABS

    const Sistema = new FormControl({ value: '', disabled: true }, []);
    const IdSistema = new FormControl({ value: '', disabled: true }, []);
    const Formula = new FormControl({ value: '', disabled: true }, []);
    const PeriodoCapital = new FormControl({ value: '', disabled: true }, []);
    const PeriodoInteres = new FormControl({ value: '', disabled: true }, []);
    const Plazo = new FormControl({ value: '', disabled: true }, []);
    const Garantia = new FormControl({ value: '', disabled: true }, []);
    const TipoGarantia = new FormControl({ value: '', disabled: true }, []);
    const PeriodoGracia = new FormControl({ value: '', disabled: true }, []);
    const TasaPeriodicaL = new FormControl({ value: '', disabled: true }, []);
    const TasaLiquidada = new FormControl({ value: '', disabled: true }, []);
    const EfectivaLiquidada = new FormControl({ value: '', disabled: true }, []);
    const TasaPeriodicaP = new FormControl({ value: '', disabled: true }, []);
    const TasaPactada = new FormControl({ value: '', disabled: true }, []);
    const EfectivaPactada = new FormControl({ value: '', disabled: true }, []);
    const DescripcionAlivio = new FormControl({ value: '', disabled: true }, []);
    const Indicador = new FormControl({ value: '', disabled: true }, []);
    const SiglaIndicador = new FormControl({ value: '', disabled: true }, []);
    const Puntos = new FormControl({ value: '', disabled: true }, []);
    const IdPeriodoCapital = new FormControl({ value: '', disabled: true }, []);
    const IdPeriodoInteres = new FormControl({ value: '', disabled: true }, []);

    this.DatosForm = new FormGroup({
      Sistema: Sistema,
      IdSistema: IdSistema,
      Formula,
      PeriodoCapital: PeriodoCapital,
      PeriodoInteres: PeriodoInteres,
      Plazo: Plazo,
      Garantia: Garantia,
      TipoGarantia: TipoGarantia,
      PeriodoGracia: PeriodoGracia,
      TasaPeriodicaL: TasaPeriodicaL,
      TasaLiquidada: TasaLiquidada,
      EfectivaLiquidada: EfectivaLiquidada,
      TasaPeriodicaP: TasaPeriodicaP,
      TasaPactada: TasaPactada,
      EfectivaPactada: EfectivaPactada,
      DescripcionAlivio: DescripcionAlivio,
      Indicador,
      SiglaIndicador,
      Puntos,
      IdPeriodoInteres,
      IdPeriodoCapital
    });

    const CuotasPagas = new FormControl({ value: '', disabled: true }, []);
    const CuotasPendientes = new FormControl({ value: '', disabled: true }, []);
    const CuotasMora = new FormControl({ value: '', disabled: true }, []);

    this.SaldosForm = new FormGroup({
      CuotasPagas: CuotasPagas,
      CuotasPendientes: CuotasPendientes,
      CuotasMora: CuotasMora,
    });

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

    this.CobrosForm = new FormGroup({
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
    });

    this.cupoForm = new FormGroup({
      cupoAprobado: new FormControl({ value: '', disabled: true }, []),
      cupoUtilizado: new FormControl({ value: '', disabled: true }, []),
      cupoDisponible: new FormControl({ value: '', disabled: true }, []),
      idCartera: new FormControl({ value: '', disabled: true }, []),
      fechaMatricula: new FormControl({ value: '', disabled: true }, []),
      fechaAprobacion: new FormControl({ value: '', disabled: true }, []),
      fechaDocumentacion: new FormControl({ value: '', disabled: true }, []),
      fechaActualizacion: new FormControl({ value: '', disabled: true }, []),
      fechaVencimiento: new FormControl({ value: '', disabled: true }, []),
      fechaRetiro: new FormControl({ value: '', disabled: true }, []),
      idConsecutivo: new FormControl({ value: '', disabled: true }, []),
      idLinea: new FormControl({ value: '', disabled: true }, []),
      nombreLinea: new FormControl({ value: '', disabled: true }, []),
      numeroPagare: new FormControl({ value: '', disabled: true }, []),
      radicado: new FormControl({ value: '', disabled: true }, []),
      numeroCupo: new FormControl({ value: '', disabled: true }, []),
      pagoMinimo: new FormControl({ value: '', disabled: true }, []),
      pagoTotal: new FormControl({ value: '', disabled: true }, []),
      cuentaCupo: new FormControl({ value: '', disabled: true }, []),
      diaMaxMora: new FormControl({ value: '', disabled: true }, []),
      maxCuotaMora: new FormControl({ value: '', disabled: true }, []),
      bloqueos: new FormControl({ value: '', disabled: true }, []),
    });

    const NumeroCuota = new FormControl({ value: '', disabled: true }, []);
    const EfectivoSimularPago =new FormControl({ value: '', disabled: true }, []);

    this.CuotaForm = new FormGroup({
      NumeroCuota: NumeroCuota,
      EfectivoSimularPago: EfectivoSimularPago

    });


    // FIN TABS

    this.codeudorForm = new FormGroup({
      documento: new FormControl({ value: '', disabled: false }, [
        Validators.minLength(6)
      ]),
      nombre: new FormControl({ value: '', disabled: true }, []),
      celular: new FormControl({ value: '', disabled: true }, []),
      idTercero: new FormControl({ value: '', disabled: true }, [])
    });
    
    this.debitoAutomaticoFrom = new FormGroup({
      DocumentoDebito: new FormControl(''),
      NombreDebito: new FormControl({ value: '', disabled: true }, []),
      IdCuentaOrigen: new FormControl(''),
      IdOficinaDebito: new FormControl(''),
      IdProductoDebito: new FormControl(''),
      IdConsecutivoDebito: new FormControl(''),
      IdDigitoDebito: new FormControl('')
    });

    this.calificacionForm = new FormGroup({
      IdCausal: new FormControl(''),
      DtmFecha: new FormControl({value: '', disabled: true}),
      Cumplimiento: new FormControl({value: '', disabled: true}),
      Recalificacion: new FormControl(''),
      Reestructurado: new FormControl(''),
      Cualitativa: new FormControl(''),
      Modelo: new FormControl({value: '', disabled: true}),
    });

    this.insolvenciaForm = new FormGroup({
      IdCausal: new FormControl(''),
      IdTipoSeguimiento: new FormControl(''),
      IdInstancia: new FormControl(''),
      FechaAdmision: new FormControl(''),
      FechaNotificacion: new FormControl(''),
      FechaInicioNegociacion: new FormControl(''),
      FechaAprobacionAcuerdo: new FormControl(''),
      FechaTerminacionAcuerdo: new FormControl(''),
      FechaIncumplimientoAcuerdo: new FormControl(''),
      FechaLiquidacion: new FormControl(''),
    
      ValorReconocido: new FormControl(''),
      CapitalReconocido: new FormControl(''),
      InteresesReconocidos: new FormControl(''),
      CondonacionesAprobadas: new FormControl(''),
      NuevasCondicionesPago: new FormControl(''),
      NumeroCuotasPactadas: new FormControl('')
    });

    this.insolvenciaForm.valueChanges.subscribe(() => {
      this.validarBotonesInsolvencia();
    });

    this.garantiasForm = new FormGroup({
      codeudorSeleccionado: new FormControl('', Validators.required)
    });
  }

  onFilaSeleccionada(data: CuentaCarteraResumen) {
    this.buscarCuentaDetalle(data.IdCuenta);
    this.cerrarModal.nativeElement.click();
  }

  esFechaISO(valor: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(valor);
  }

  pad(numero: number): string {
    return numero < 10 ? '0' + numero : numero.toString();
  }

  selectRow(tableName: string, rowIndex: number) {
    this.selectedRows[tableName] = rowIndex;
  }

  formatearValor = (valor: any, columna?: string): string => {
    return valor !== null && valor !== undefined ? String(valor) : '';
  };
  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const nearBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 10;
    if (nearBottom) {
      this.tablaVirtual.loadMore();
    }
  }

  loadOperaciones() {
    let datas = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(datas == null ? "" : datas));
    const arrayExample = [{
      'IdModulo': this.codModulo,
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
        console.log(errorMessage);
      }
    );
  }

  getFormasPago() {
    this.contractualService.getFormaPago().pipe(
      catchError(error => {
        console.error('Error al obtener formas de pago:', error);
        return of(null);
      })
    ).subscribe(
      result => {
        this.resultFormasPago = result;
        
      }
    );
  }

  getCausalCalificacion() {
    this.carteraService.getCausalCalificacion().pipe(
      catchError(error => {
        console.error('Error al obtener causales:', error);
        return of(null);
      })
    ).subscribe(
      result => {
        this.resultCausales = result;
        
      }
    );
  }

  getListaCalificaciones() {
    this.carteraService.getListaCalificaciones().pipe(
      catchError(error => {
        console.error('Error al obtener calificaciones:', error);
        return of(null);
      })
    ).subscribe(
      result => {
        this.resultListaCalificaciones = result;
        
      }
    );
  }

  limpiarFormulario(search: boolean) {
    if(!search) {     
      if(this.campoPagareHabilitado){
        this.restaurarPagare(true);
        this.mostrarBotonesActualizarPagare = false;
      }
      if(this.campoLineaHabilitado){
        this.restaurarLinea(true);
        this.mostrarBotonesActualizarLinea = false;
      }
      if(this.campoFormaPagoHabilitado){
        this.restaurarFormaPago(true);
        this.mostrarBotonesActualizarFormaPago = false
      }
    }

    this.reestablecerCamposEncabezado();
    this.habilitarCamposBusqueda();
    this.resetTabs();

    this.mostrarBotonesLimpiar = false;
    this.esCreditoPadre = false;
    this.cambiarLinea = false;
    this.cambiarPagare = false;
    this.cambiarFormaPago = false;
    this.isCuotaTabInitialized = false;

    if (this.campoLineaHabilitado){
      this.nombreLineaActual = undefined;
      this.lineaActual = undefined;
    }
    
    if (this.campoPagareHabilitado){
      this.tipoPagareActual = undefined;
      this.pagareActual = undefined;
    }
    if (this.campoFormaPagoHabilitado) {
      this.formaPagoInicial = undefined
      this.formaPagoActual = undefined;
    }
  }

  private validarEstadoCuenta(): boolean {
    if (this.gestionCreditoForm.get('fechaCancelacion')?.value?.trim()) {
      this.notif.warning(
        'Advertencia', 'Cuenta no se puede editar, estado no válido.',
        ConfiguracionNotificacion.configRightTop
      );
      this.gestionCreditoOperacionForm.get('Codigo')?.setValue('');
      return false;
    }
    return true;
  }

  private validarSigla(sigla: string, mensaje: string): boolean {
    if(this.gestionCreditoForm.get('Sigla')?.value === sigla ){
      this.notif.warning(
        'Advertencia',
        mensaje,
        ConfiguracionNotificacion.configRightTop
      );
      this.gestionCreditoOperacionForm.get('Codigo')?.reset();
      return true;
    }
    return false
  }
  
  private validarCreditoPadre(): boolean {
    if (
      !this.gestionCreditoForm.get('esCreditoPadre')?.value &&
      this.gestionCreditoForm.get('Sigla')?.value === 'CTD'
    ) {
      this.gestionCreditoOperacionForm.get('Codigo')?.reset();
      this.notif.warning(
        'Advertencia',
        'Cuenta no se puede editar, crédito hijo.',
        ConfiguracionNotificacion.configRightTop
      );
      this.esCreditoPadre = false;
      return false; 
    }
    this.esCreditoPadre = true; 
    return true; 
  }

  async onChangeOperacion() {
    if (this.campoLineaHabilitado) this.restaurarLinea(false);
    if (this.campoPagareHabilitado) this.restaurarPagare(false);
    if (this.campoFormaPagoHabilitado) this.restaurarFormaPago(false);

    const operacionCodigo = this.gestionCreditoOperacionForm.get('Codigo')?.value;
    this.operacionActual = this.resultOperaciones.find((op: any) => op.IdOperaciones == operacionCodigo)?.ERP_tblOperacion?.Descripcion;
    
    if (operacionCodigo === '2') { // Buscar
      this.limpiarFormulario(true);
      this.cuotaTabBloqueado = false;
    } else{
      if(operacionCodigo === '124'){
        this.cuotaTabBloqueado = false;
      }else{
      this.cuotaTabBloqueado = true; // bloqueo del tab de calcular cuota
      this.onSaldosTabClick(); // que se pare siempre en ese tab en el buscar de entrada
      }
      

      if (this.advertenciaOperacionSinCuenta()) return;

      await this.getHistorial();
      if (operacionCodigo !== '124' && !this.validarEstadoCuenta()) return;

      if (operacionCodigo === '124') {
        if(this.validarSigla('CTD', 'No se puede realizar esta operación, tarjeta débito.')) return;
        this.generarPDFPlanDePagos();
      } else if (operacionCodigo === '125') { // Cambiar codeudores
        if (this.gestionCreditoForm.get('Sigla')?.value === 'CTD')
          if (!this.validarCreditoPadre()) return;

        await this.getGarantias();
        this.codeudoresDraft = this.garantiasPersonalesCod.map(codeudor => {

          const { IdTercero, NumeroDocumento, Nombres: n, PrimerApellido: pa, SegundoApellido: sa } = codeudor;
          return {
            idTercero: IdTercero,
            nombreCompleto: this.concatWithSpace(pa, sa, n),
            documento: NumeroDocumento
          }
        });
        this.codeudoresAnteriores = this.codeudoresDraft;

        this.openCambiarCodeudoresModal.nativeElement.click();
      } else if (operacionCodigo === '126') {
        this.habilitarPagare();
      } else if (operacionCodigo === '129') {
        this.habilitarCambioLinea();
        return;
      } else if (operacionCodigo === '130') { //Cambiar tasa
        await this.BuscarSaldosCartera();
        const error = this.validarEdicionCredito(operacionCodigo);
        if (error) {
          this.notif.warning('Advertencia', error, ConfiguracionNotificacion.configRightTop);
          this.gestionCreditoOperacionForm.get('Codigo')?.reset();
          return;
        }
        this.cambiarInfoCreditoContext = this.buildCambiarInfoCreditoContext();
        this.estaAbiertoModalCambios = true;
      } else if (operacionCodigo === '131') {
        this.confirmarInclusionExclusion();
      } else if (operacionCodigo === '132') { //Cambiar cuota
        await this.BuscarSaldosCartera();
        const error = this.validarEdicionCredito(operacionCodigo);
        if (error) {
          this.notif.warning('Advertencia', error, ConfiguracionNotificacion.configRightTop);
          this.gestionCreditoOperacionForm.get('Codigo')?.reset();
          return;
        }
        this.cambiarInfoCreditoContext = this.buildCambiarInfoCreditoContext();
        this.estaAbiertoModalCambios = true;
      } else if (operacionCodigo === '135') { //Cambiar plazo
        await this.BuscarSaldosCartera();
        const error = this.validarEdicionCredito(operacionCodigo);
        if (error) {
          this.notif.warning('Advertencia', error, ConfiguracionNotificacion.configRightTop);
          this.gestionCreditoOperacionForm.get('Codigo')?.reset();
          return;
        }
        this.cambiarInfoCreditoContext = this.buildCambiarInfoCreditoContext();
        this.estaAbiertoModalCambios = true;
      } else if (operacionCodigo === '139') { //Cambiar sistema
        await this.BuscarSaldosCartera();
        const error = this.validarEdicionCredito(operacionCodigo) ?? this.validarEdicionCreditoAlCambiarSistema();
        if (error) {
          this.notif.warning('Advertencia', error, ConfiguracionNotificacion.configRightTop);
          this.gestionCreditoOperacionForm.get('Codigo')?.reset();
          return;
        }
        if(this.periodosPago.length === 0) this.periodosPago = await this.getPeriodosPago() ?? [];
        this.cambiarInfoCreditoContext = this.buildCambiarInfoCreditoContext();
        this.estaAbiertoModalCambios = true;
      } else if (operacionCodigo === '140') { //Reesructurar
        await this.habilitarReestructurar();
      } else if (operacionCodigo === '143') { //Devolver reestructuración
        await this.devolverReestructurado();
      } else if (operacionCodigo === '21') {
        this.habilitarCambioFormaPago();
      } else if (operacionCodigo === '133') {
        this.habilitarCambiarCalificacion();
      } else if (operacionCodigo === '134') {
        this.habilitarCambiarGarantia();
      } else if (operacionCodigo === '145') {
        this.habilitarProcesoInsolvencia()
      }
    }
  }

  //Inicio Proceso Insolvencia

  habilitarProcesoInsolvencia() {
    this.getCausalInsolvencia();
    this.getTiposSeguimientoInsolvencia();
    this.cargarHistoricoInsolvencia();
    this.getInstanciasInsolvencia();
    this.validarInsolvencia()

    this.openProcesoInsolvenciaModal.nativeElement.click();
  }

  validarInsolvencia() {
    const idCuenta = Number(this.gestionCreditoForm.get('IdCuenta')?.value);

    this.carteraService.validarInsolvencia(idCuenta).subscribe(esInsolvente => {
        if (esInsolvente) {
          this.carteraService.getMotivoInsolvencia(idCuenta).subscribe(motivo => {
              if (motivo) {
                this.insolvenciaForm.patchValue({
                  IdCausal: motivo.intMotivo
                });
                this.insolvenciaForm.get('IdCausal')?.disable();
              }
            });

          this.carteraService.getInstanciaInsolvencia(idCuenta).subscribe(instancia => {
              if (instancia) {
                this.insolvenciaForm.patchValue({
                  IdInstancia: instancia.intTipoInstancia
                  
                });
                console.log(instancia);
                this.insolvenciaForm.get('IdInstancia')?.disable();
              }
            });
        }
        else {
          this.insolvenciaForm.patchValue({IdCausal: '', IdInstancia: ''});
          this.insolvenciaForm.get('IdCausal')?.enable();
          this.insolvenciaForm.get('IdInstancia')?.enable();
        }
      });
  }

  getCausalInsolvencia() {
    this.carteraService.getCausalInsolvencia().pipe(
      catchError(error => {
        console.error('Error al obtener causales:', error);
        return of(null);
      })
    ).subscribe(
      result => {
        this.resultCausalesInsolvencia = result;
      }
    );
  }

  onClickLimpiarInsolvencia(): void {
  
    this.insolvenciaForm.reset();
  
    this.insolvenciaForm.patchValue({
      IdTipoSeguimiento: '',
      FechaAdmision: '',
      FechaNotificacion: '',
      FechaInicioNegociacion: '',
      FechaAprobacionAcuerdo: '',
      FechaTerminacionAcuerdo: '',
      FechaIncumplimientoAcuerdo: '',
      FechaLiquidacion: '',
      ValorReconocido: '',
      CapitalReconocido: '',
      InteresesReconocidos: '',
      CondonacionesAprobadas: '',
      NuevasCondicionesPago: '',
      NumeroCuotasPactadas: ''
    });
  
    this.validarInsolvencia();
  
    this.insolvenciaForm.markAsPristine();
    this.insolvenciaForm.markAsUntouched();
  
    this.isDisabledLimpiarInsolvenciaButton = true;
    this.isDisabledGuardarInsolvenciaButton = true;
  }

  onClickCancelarInsolvencia() {
    this.onClickLimpiarInsolvencia();
    this.gestionCreditoOperacionForm.get('Codigo')?.setValue('');
  }

  onChangeDetalleInsolvencia(): void {
  
    const tipoSeguimiento = Number(
      this.insolvenciaForm.get('IdTipoSeguimiento')?.value
    );
  
    const idCuenta = Number(
      this.gestionCreditoForm.get('IdCuenta')?.value
    );
  
    /* Validación local: no repetidos y orden secuencial. */
    if (tipoSeguimiento) {
      const detallesActuales = this.obtenerDetallesInsolvenciaActual();
      const tiposRegistrados = detallesActuales.map(x => Number(x.intTipoSeguimiento));

      if (tiposRegistrados.includes(tipoSeguimiento)) {
      
        this.notif.warning(
          'Advertencia',
          'El detalle ya fue registrado para esta insolvencia.',
          ConfiguracionNotificacion.configRightTop
        );
      
        this.insolvenciaForm.patchValue({
          IdTipoSeguimiento: ''
        });
      
        return;
      }
    
      /* Primer detalle debe ser Admisión (1) */
      if (tiposRegistrados.length === 0) {
      
        if (tipoSeguimiento !== 1) {
        
          this.notif.warning(
            'Advertencia',
            'El primer detalle debe ser Fecha de admisión a insolvencia.',
            ConfiguracionNotificacion.configRightTop
          );
        
          this.insolvenciaForm.patchValue({
            IdTipoSeguimiento: ''
          });
        
          return;
        }
      }
      else {
      
        const ultimoTipo = Math.max(...tiposRegistrados);
      
        /* Debe registrar el siguiente paso */
        if (tipoSeguimiento !== (ultimoTipo + 1)) {
        
          this.notif.warning(
            'Advertencia',
            `El proceso de insolvencia se encuentra en el seguimiento ${ultimoTipo + 1}.`,
            ConfiguracionNotificacion.configRightTop
          );
        
          this.insolvenciaForm.patchValue({
            IdTipoSeguimiento: ''
          });
        
          return;
        }
      }
    }
  
    /* Validaciones actuales de insolvencia */
    this.carteraService.validarInsolvencia(idCuenta)
      .subscribe((esInsolvente: boolean) => {
      
        if (!esInsolvente && tipoSeguimiento === 9) {
        
          this.notif.warning(
            'Advertencia',
            'El crédito no se encuentra marcado como insolvente.',
            ConfiguracionNotificacion.configRightTop
          );
        
          this.insolvenciaForm.patchValue({
            IdTipoSeguimiento: ''
          });
        
          return;
        }
      });
  }

  private obtenerFechaEvento(): string | undefined {

    const tipo = Number(
      this.insolvenciaForm.get('IdTipoSeguimiento')?.value
    );

    switch (tipo) {

      case 1:
        return this.insolvenciaForm.get('FechaAdmision')?.value;

      case 2:
        return this.insolvenciaForm.get('FechaNotificacion')?.value;

      case 3:
        return this.insolvenciaForm.get('FechaInicioNegociacion')?.value;

      case 4:
        return this.insolvenciaForm.get('FechaAprobacionAcuerdo')?.value;

      case 5:
        return this.insolvenciaForm.get('FechaTerminacionAcuerdo')?.value;

      case 6:
        return this.insolvenciaForm.get('FechaIncumplimientoAcuerdo')?.value;

      case 7:
        return this.insolvenciaForm.get('FechaLiquidacion')?.value;

      default:
        return undefined;
    }
  }

  onClickGuardarInsolvencia(): void {
  
    if (!this.insolvenciaForm.get('IdCausal')?.value) {
      this.notif.warning(
        'Advertencia',
        'Debe seleccionar una causal de insolvencia.',
        ConfiguracionNotificacion.configRightTop
      );
      return;
    }

    if (!this.insolvenciaForm.get('IdInstancia')?.value) {
      this.notif.warning(
        'Advertencia',
        'Debe seleccionar una instancia de insolvencia.',
        ConfiguracionNotificacion.configRightTop
      );
      return;
    }

    const fechaEvento = this.obtenerFechaEvento();
    if (!this.validarFechaNoFutura(fechaEvento)) {
      this.notif.warning(
        'Advertencia',
        'La fecha del evento no puede ser posterior a la fecha actual.',
        ConfiguracionNotificacion.configRightTop
      );
      return;
    }
  
    const dto: CrearInsolvencia = {
      idCuenta: Number(this.gestionCreditoForm.get('IdCuenta')?.value),
    
      oficina: Number(
        this.gestionCreditoForm.get('IdOficinaCuenta')?.value
      ),
    
      producto: Number(
        this.gestionCreditoForm.get('IdProductoCuenta')?.value
      ),
    
      consecutivo: Number(
        this.gestionCreditoForm.get('IdConsecutivo')?.value
      ),
    
      estadoActual: Number(
        this.gestionCreditoForm.get('IdEstadoCuenta')?.value
      ),
    
      formaPago: Number(
        this.gestionCreditoForm.get('IdFormaPago')?.value
      ),
    
      motivo: Number(
        this.insolvenciaForm.get('IdCausal')?.value
      ),
    
      tipoInstancia: Number(
        this.insolvenciaForm.get('IdInstancia')?.value
      ),
    
      usuario: this.dataUser.IdUsuario,
    
      edoTaquilla: 0,
    
      tipoSeguimiento: Number(
        this.insolvenciaForm.get('IdTipoSeguimiento')?.value
      ),
    
      fechaEvento: this.obtenerFechaEvento(),
    
      valorReconocido: Number(
        this.insolvenciaForm.get('ValorReconocido')?.value || 0
      ),
    
      capitalReconocido: Number(
        this.insolvenciaForm.get('CapitalReconocido')?.value || 0
      ),
    
      interesesReconocidos: Number(
        this.insolvenciaForm.get('InteresesReconocidos')?.value || 0
      ),
    
      condonacionesAprobadas: Number(
        this.insolvenciaForm.get('CondonacionesAprobadas')?.value || 0
      ),
    
      nuevasCondicionesPago:
        this.insolvenciaForm.get('NuevasCondicionesPago')?.value,
    
      numeroCuotasPactadas: Number(
        this.insolvenciaForm.get('NumeroCuotasPactadas')?.value || 0
      )
    };
    console.log(dto);
    
    this.isSavingInsolvencia = true;
    this.loading.show();

    this.carteraService.crearInsolvencia(dto).subscribe({
        next: (resp) => {
          if (resp.Exitoso) {
            this.notif.success(
              resp.Mensaje,
              'Proceso de insolvencia',
              ConfiguracionNotificacion.configRightTop
            );
            const idCuenta = Number(
              this.gestionCreditoForm.get('IdCuenta')?.value
            );
            this.buscarCuentaDetalle(idCuenta);
            
            this.onClickCancelarInsolvencia();
          
            document.getElementById('btnCerrarProcesoInsolvencia')?.click();
          
            this.loading.hide();
            this.isSavingInsolvencia = false;

            this.onCambiosTabClick();
            window.scrollTo({top: document.body.scrollHeight,behavior: 'smooth'});

          } else {
            this.notif.warning(
              'Advertencia',
              resp.Mensaje,
              ConfiguracionNotificacion.configRightTop
            );
            this.loading.hide();
            this.isSavingInsolvencia = false;
          }
        },
        error: (error) => {
          this.notif.error(
            error?.error?.Message ??
            'Error al registrar la insolvencia.',
            'Error',
            ConfiguracionNotificacion.configRightTop
          );
          this.loading.hide();
          this.isSavingInsolvencia = false;
        }
      });
      
  }

  getTiposSeguimientoInsolvencia(): void {
    this.carteraService.getTiposSeguimientoInsolvencia()
      .pipe(
        catchError(error => {
          console.error('Error al obtener tipos de seguimiento:', error);
          return of([]);
        })
      )
      .subscribe(result => {
        this.tiposSeguimientoInsolvencia = result;
      });
  }

  cargarHistoricoInsolvencia() {
    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    this.carteraService
        .getHistoricoInsolvencia(idCuenta)
        .subscribe({
            next: data => {
                this.historicoInsolvencia = data;
                this.filtrarDetallePermitido();
                this.construirNumeracionInsolvencias();
            }
        });
  }

obtenerNumeroInsolvencia(
  item: InsolvenciaHistoricoDto
): number {

  const key =
    new Date(item.dtmFechaCreacionInsolvencia)
      .toISOString();

  return this.mapaNumeracionInsolvencias[key] ?? 0;
}

obtenerNumeroDetalle(
  item: InsolvenciaHistoricoDto
): string {

  const numeroInsolvencia =
    this.obtenerNumeroInsolvencia(item);

  return `${numeroInsolvencia}.${item.intTipoSeguimiento}`;
}

  verDetalleAcuerdo(item: InsolvenciaHistoricoDto) {

      if (!item.TieneDetalle) {
          return;
      }

      if (
          this.detalleAcuerdo &&
          this.detalleAcuerdo.lngIdSeguimiento === item.lngIdSeguimiento
      ) {
          this.detalleAcuerdo = undefined;
          return;
      }

      this.carteraService
          .getDetalleAcuerdoPago(item.lngIdSeguimiento)
          .subscribe({
              next: data => {
                  this.detalleAcuerdo = data;
              }
          });
  }

  private validarBotonesInsolvencia(): void {

    // LIMPIAR:
    // Se habilita cuando cualquier campo cambia
    this.isDisabledLimpiarInsolvenciaButton = !this.insolvenciaForm.dirty;

    // GUARDAR:
    // Se habilita únicamente cuando todos los datos requeridos
    // para el detalle seleccionado estén diligenciados

    const tipo = Number( this.insolvenciaForm.get('IdTipoSeguimiento')?.value );

    const causal = this.insolvenciaForm.get('IdCausal')?.value;
    const instancia = this.insolvenciaForm.get('IdInstancia')?.value;
      
    let formularioCompleto = !!causal && !!instancia && !!tipo;

    switch (tipo) {

      case 1:
        formularioCompleto =
          formularioCompleto &&
          !!this.insolvenciaForm.get('FechaAdmision')?.value;
        break;

      case 2:
        formularioCompleto =
          formularioCompleto &&
          !!this.insolvenciaForm.get('FechaNotificacion')?.value;
        break;

      case 3:
        formularioCompleto =
          formularioCompleto &&
          !!this.insolvenciaForm.get('FechaInicioNegociacion')?.value;
        break;

      case 4:
        formularioCompleto =
          formularioCompleto &&
          !!this.insolvenciaForm.get('FechaAprobacionAcuerdo')?.value;
        break;

      case 5:
        formularioCompleto =
          formularioCompleto &&
          !!this.insolvenciaForm.get('FechaTerminacionAcuerdo')?.value;
        break;

      case 6:
        formularioCompleto =
          formularioCompleto &&
          !!this.insolvenciaForm.get('FechaIncumplimientoAcuerdo')?.value;
        break;

      case 7:
        formularioCompleto =
          formularioCompleto &&
          !!this.insolvenciaForm.get('FechaLiquidacion')?.value;
        break;

      case 8:
        formularioCompleto =
          formularioCompleto &&
          !!this.insolvenciaForm.get('ValorReconocido')?.value &&
          !!this.insolvenciaForm.get('CapitalReconocido')?.value &&
          !!this.insolvenciaForm.get('InteresesReconocidos')?.value &&
          !!this.insolvenciaForm.get('NumeroCuotasPactadas')?.value;
        break;

      case 9:
        formularioCompleto = formularioCompleto;
        break;

      default:
        formularioCompleto = false;
        break;
    }

    this.isDisabledGuardarInsolvenciaButton =
      !(this.insolvenciaForm.dirty && formularioCompleto);
  }

  private obtenerDetallesInsolvenciaActual(): InsolvenciaHistoricoDto[] {

    if (!this.historicoInsolvencia.length) {
      return [];
    }

    const ultimaFecha = this.historicoInsolvencia
      .reduce((max, item) =>
        new Date(item.dtmFechaCreacionInsolvencia) >
        new Date(max.dtmFechaCreacionInsolvencia)
          ? item
          : max
      ).dtmFechaCreacionInsolvencia;

    return this.historicoInsolvencia.filter(
      x =>
        new Date(x.dtmFechaCreacionInsolvencia).getTime() ===
        new Date(ultimaFecha).getTime()
    );
  }

  private filtrarDetallePermitido(): void {

    const detallesActuales =
      this.obtenerDetallesInsolvenciaActual();

    const ultimo =
      detallesActuales.length
        ? Math.max(...detallesActuales.map(x => x.intTipoSeguimiento))
        : 0;

    const siguiente = ultimo + 1;

    this.tiposSeguimientoInsolvencia =
      this.tiposSeguimientoInsolvencia.filter(
        x => x.intTipoSeguimiento === siguiente
      );
  }

  private construirNumeracionInsolvencias(): void {

    this.mapaNumeracionInsolvencias = {};

    const fechasUnicas = [
      ...new Set(
        this.historicoInsolvencia
          .map(x =>
            new Date(x.dtmFechaCreacionInsolvencia).toISOString()
          )
      )
    ].sort();

    fechasUnicas.forEach((fecha, index) => {
      this.mapaNumeracionInsolvencias[fecha] = index + 1;
    });
  }

  private validarFechaNoFutura(fecha?: string): boolean {
  
    if (!fecha) {
      return true;
    }
  
    const partes = fecha.split('-');
  
    const fechaIngresada = new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      Number(partes[2])
    );
  
    const hoy = new Date();
  
    const fechaActual = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );
  
    return fechaIngresada.getTime() <= fechaActual.getTime();
  }

  getInstanciasInsolvencia(): void {
    this.carteraService
      .getInstanciasInsolvencia()
      .pipe(
        catchError(error => {
          console.error(
            'Error al obtener instancias de insolvencia:',
            error
          );
          return of([]);
        })
      )
      .subscribe(result => {
        this.instanciasInsolvencia = result;
      });
  }

  
  //Fin Proceso Insolvencia


  //Inicio cambiar garantias
  
  habilitarCambiarGarantia() {
    this.loading.show();
    if (this.gestionCreditoForm.get('Sigla')?.value === 'CTD')
      if (!this.validarCreditoPadre()) return;
    
    this.getDatosSimulacion();
    this.getCodeudorBasico(); 
    
    const idTercero = this.gestionCreditoForm.get('IdTercero')?.value;

    this.getGarantiasAsignadas().pipe( concatMap(
      () => this.getGarantiasDisponibles(idTercero, false))).subscribe({
      next: () => {
        this.getGAarantiasCompartidas();
        this.mostrarModal = true;

        setTimeout(() => { this.modalGarantias.abrir(); });

        this.loading.hide();  
      }, error: () => {
      this.loading.hide();
    }
    });
  }

  getDatosSimulacion(){
    this.datosCuenta = {
      idTercero: this.gestionCreditoForm.get('IdTercero')?.value,
      idCuenta: this.gestionCreditoForm.get('IdCuenta')?.value,
      idOficina: this.gestionCreditoForm.get('IdOficinaCuenta')?.value,
      idProducto: this.gestionCreditoForm.get('IdProductoCuenta')?.value,
      idConsecutivo: this.gestionCreditoForm.get('IdConsecutivo')?.value,
      idDigito: this.gestionCreditoForm.get('IdDigito')?.value,
      linea: this.gestionCreditoForm.get('IdLinea')?.value || '',
      nombreLinea: this.gestionCreditoForm.get('Linea')?.value || '',
      documento: this.gestionCreditoForm.get('NumeroDocumento')?.value ||
        this.gestionCreditoForm.get('IdTercero')?.value ||
        '',
      nombre: this.gestionCreditoForm.get('NombreDeudor')?.value ||
        this.gestionCreditoForm.get('Nombre')?.value ||
        ''
    };  
  }

  getCodeudorBasico() {
    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value

    this.loading.show();
    this.carteraService.getCodeudoresBasico(idCuenta).subscribe({
        next: (data) => {
          this.codeudoresBasico = data ?? [];
          this.loading.hide();
        },
        error: (err) => {
          console.error(err);
          this.notif.warning('Advertencia', 'No se encontró registro.', ConfiguracionNotificacion.configRightTop);
          this.garantiasForm.reset();        
          this.loading.hide();
        }
      });
  }

  getGarantiasDisponibles(idTercero: number, codeudor: boolean) {
    this.loading.show();

    return this.carteraService.getGarantiasDisponibles(idTercero).pipe(
      tap((data: any) => {

        if (codeudor) {
          this.listGarantiasDisponiblesCodeudor = data ?? [];
        } else {
          this.listGarantiasDisponiblesDeudor = data ?? [];
        }

        this.loading.hide();
      })
    );
  }

  getGarantiasAsignadas() {
    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    this.loading.show();
  
    return this.carteraService.getGarantiasAsignadas(idCuenta).pipe(
      tap((data: any) => {
        this.garantiasRealesAsignadas = data ?? [];
        this.garantiasRealesAsignadasInicial = JSON.parse(
          JSON.stringify(this.garantiasRealesAsignadas)
        );
      }),
      finalize(() => this.loading.hide())
    );
  }

  getGAarantiasCompartidas(){
    const idTercero = this.gestionCreditoForm.get('IdTercero')?.value;
    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    this.carteraService.getGarantiasCompartidas(idCuenta, idTercero)
    .subscribe({ next: (data) => {
        this.garantiasCompartidasBackend = data ?? [];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onClickCerrarModalGarantias() {
    this.garantiasForm.reset();
    this.gestionCreditoOperacionForm.get('Codigo')?.reset();
    this.garantiasAgregar = [];
    this.garantiasEliminar = [];
    this.garantiasRealesAsignadas = [];
    this.isDisabledConfirmarGarantiasButton = true;
    this.isDisabledLimpiarGarantiasButton = true;
    this.isDisabledSaveGarantiasButton = true;
    this. mostrarGarantiasCodeudor = false;
    this.mostrarDetalleGarantia = false;
    ($('#cambiarGarantias') as any).modal('hide');
    this.mostrarModal = false;
  }

  validarSaldo(totales: any): boolean {

    console.log(totales.cobertura, totales.respalda, '😘');

    if (!this.garantiasCompartidas || this.garantiasCompartidas.length === 0) {
      this.notif.warning('Advertencia', 'Garantía no cubre el valor del crédito.', ConfiguracionNotificacion.configRightTop);
      return false;
    }

    if ((totales.cobertura - totales.respalda) <= 0) {
      this.notif.warning('Advertencia', 'Garantía no cubre el valor del crédito.', ConfiguracionNotificacion.configRightTop);
      return false;
    }

    return true;
  }

  onChangeCodeudor(id: number) {
    if (!id) return;
  
    this.getGarantiasDisponibles(id, true)
      .subscribe({
        next: () => {
          this.mostrarGarantiasCodeudor = true;
        },
        error: (err) => console.error(err)
      });
  }

  private construirLogCambioGarantia() {
    const formatear = (lista: GarantiaRealAsignada[]) =>
      lista.map(g => ({
        IdInterno: g.Consecutivo,
        Id: g.Matricula,
        Tipo: g.Tipo,
        ValorCobertura: g.Cobertura
      }));
    
    return {
      Anterior: {
        Garantias: formatear(this.garantiasRealesAsignadasInicial)
      },
      Actualiza: {
        Garantias: formatear(this.garantiasRealesAsignadas),
        Agregadas: formatear(this.garantiasAgregar),
        Eliminadas: formatear(this.garantiasEliminar)
      }
    };
  }

  onClickConfirmarCambiosGarantia(data: any): void {


    const { asignadas, agregar, eliminar, compartidas, totales } = data;

    this.garantiasRealesAsignadas = asignadas;
    this.garantiasAgregar = agregar;
    this.garantiasEliminar = eliminar;
    this.garantiasCompartidas = compartidas;

    if (!this.validarSaldo(totales)) return;


    const {
      IdOficinaCuenta,
      IdProductoCuenta,
      IdConsecutivo,
      IdDigito
    } = this.gestionCreditoForm.value;

    const usuario = this.dataUser?.IdUsuario;

    const dto: CambiarGarantiasRequestDto = {
      oficina: IdOficinaCuenta,
      producto: IdProductoCuenta,
      consecutivo: IdConsecutivo,
      digito: IdDigito,
      usuario: usuario,
      agregar: this.garantiasAgregar.map(g => ({
        oficina: IdOficinaCuenta,
        producto: IdProductoCuenta,
        clase: g.Clase,
        consecutivo: IdConsecutivo,
        digito: IdDigito,
        garantia: g.Consecutivo,
        tipo: g.Tipo,
        valor: g.Cobertura,
        usuario: usuario,
        fecha: null
      })),

      eliminar: this.garantiasEliminar.map(g => ({
        oficina: IdOficinaCuenta,
        producto: IdProductoCuenta,
        clase: g.Clase,
        consecutivo: IdConsecutivo,
        digito: IdDigito,
        garantia: g.Consecutivo,
        tipo: g.Tipo,
        valor: g.Cobertura,
        usuario: usuario,
        fecha: new Date().toISOString().split('T')[0]
      }))
    };
    
    const jsonLog = this.construirLogCambioGarantia();

    this.loading.show();

    this.carteraService.cambiarGarantias(dto)
    .pipe(finalize(() => this.loading.hide()))
    .subscribe({
      next: (res) => {
        if (!res?.Exitoso) {
          this.notif.warning('Advertencia', res.Mensaje, ConfiguracionNotificacion.configRightTop);
          return;
        }
        this.guardarLogGestionCredito(jsonLog);
        this.notif.success('Exitoso', 'El cambio de garantía se realizó correctamente.', ConfiguracionNotificacion.configRightTop);
        this.cerrarModalYRefrescarCambiarGarantia();
      },
      error: () => {
        this.notif.error('Error', 'No se pudo guardar', ConfiguracionNotificacion.configRightTop);
      }
    });
  }

  private cerrarModalYRefrescarCambiarGarantia() {
    this.onClickCerrarModalGarantias()
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    this.getGarantias();
    this.BuscarSaldosCartera();
    this.tabActivo = Tabs.Garantias;
    this.resetEstadoCargaTabs();
    this.cuotaTabBloqueado = false;
  }


  //Fin cambiar garantías


  //Inicio cambiar calificación

  onClickConfirmarCambiosUltimaCalificacion() {

    if (!this.validarFormularioCalificacion()) return;

    const form = this.calificacionForm.getRawValue();
    const dto = this.construirDtoCambioCalificacion(form);
    const jsonLog = this.construirLogCambioCalificacion(form);
    this.ejecutarCambioCalificacion(dto, jsonLog);

  }

  private validarFormularioCalificacion(): boolean {

    if (!this.huboCambioCalificacion) return false;

    const form = this.calificacionForm.getRawValue();
    if (!form.IdCausal || Number(form.IdCausal) === 0) {
      this.notif.warning('Advertencia', 'Debe seleccionar Causal.', ConfiguracionNotificacion.configRightTop);
      return false;
    }

    const cambio =
      form.Cumplimiento !== this.calificacionInicial.Cumplimiento ||
      form.Recalificacion !== this.calificacionInicial.Recalificacion ||
      form.Reestructurado !== this.calificacionInicial.Reestructurado ||
      form.Cualitativa !== this.calificacionInicial.Cualitativa ||
      form.Modelo !== this.calificacionInicial.Modelo;

    if (!cambio) {
      this.notif.warning('Advertencia', 'Debe cambiar calificación.', ConfiguracionNotificacion.configRightTop);
      return false;
    }

    return true;
  }

  private construirDtoCambioCalificacion(form: any): CambiarCalificacionDto {
    return {
      idCuenta: Number(this.gestionCreditoForm.get('IdCuenta')?.value),
      cumplimiento: form.Cumplimiento,
      recalificacion: form.Recalificacion,
      reestructurado: form.Reestructurado,
      cualitativa: form.Cualitativa,
      causal: Number(form.IdCausal),
      usuario: this.dataUser.IdUsuario
    };
  }

  private construirLogCambioCalificacion(form: any) {

    const causalSeleccionado = this.resultCausales.find(
      c => c.IdFormaPago === Number(form.IdCausal)
    );

    return {
      Anterior: {
        Cumplimiento: this.calificacionInicial.Cumplimiento,
        Recalificacion: this.calificacionInicial.Recalificacion,
        Reestructurado: this.calificacionInicial.Reestructurado,
        Cualitativa: this.calificacionInicial.Cualitativa,
        Modelo: this.calificacionInicial.Modelo,
        Fecha: this.calificacionInicial.Fecha
      },
      Actualiza: {
        Cumplimiento: form.Cumplimiento,
        Recalificacion: form.Recalificacion,
        Reestructurado: form.Reestructurado,
        Cualitativa: form.Cualitativa,
        Modelo: form.Modelo,
        Fecha: form.DtmFecha,
        Causal: {
          Id: Number(form.IdCausal),
          Descripcion: causalSeleccionado?.DescripcionFormaPago ?? ''
        }
      }
    };
  }

  private ejecutarCambioCalificacion(dto: CambiarCalificacionDto, jsonLog: any) {
    this.loading.show();

    this.carteraService.cambiarUltimaCalificacion(dto)
      .pipe(finalize(() => this.loading.hide()))
      .subscribe({
        next: (resp) => this.handleSuccessCambioCalificacion(resp, jsonLog),
        error: (err) => this.handleErrorCambioCalificacion(err)
      });
  }

  private handleErrorCambioCalificacion(err: HttpErrorResponse) {
    this.notif.error(
      'Error',
      'El cambio de calificación no se realizó correctamente.',
      ConfiguracionNotificacion.configRightTop
    );
  }

  private handleSuccessCambioCalificacion(resp: ResultadoOperacionDto, jsonLog: any) {

    if (!resp.Exitoso) {
      this.notif.warning(
        'Advertencia',
        resp.Mensaje ?? 'El cambio de calificación no se realizó correctamente.',
        ConfiguracionNotificacion.configRightTop
      );
      return;
    }

    this.guardarLogGestionCredito(jsonLog);

    this.notif.success(
      'Exito',
      resp.Mensaje ?? 'El cambio de calificación se realizó correctamente.',
      ConfiguracionNotificacion.configRightTop
    );

    this.cerrarModalYRefrescar();
  }

  private cerrarModalYRefrescar() {
    (<any>$('#modalCambiarCalificacion')).modal('hide');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    this.BuscarCalificacion();
    this.tabActivo = Tabs.Calificacion;
    this.resetEstadoCargaTabs();
    this.gestionCreditoOperacionForm.get('Codigo')?.reset();
    this.calificacionForm.reset();
    this.cuotaTabBloqueado = false;
  }

  habilitarCambiarCalificacion() {
    if (this.gestionCreditoForm.get('Sigla')?.value === 'CTD') 
      if (!this.validarCreditoPadre()) return; 

    this.calificacionForm.reset({
      IdCausal: '',
      DtmFecha: '',
      Cumplimiento: '',
      Recalificacion: '',
      Reestructurado: '',
      Cualitativa: '',
      Modelo: ''
    });

    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;

    this.loading.show();

    this.carteraService.getUltimaCalificacion(idCuenta)
      .pipe(finalize(() => this.loading.hide()))
      .subscribe({
        next: (ultima) => {
          if (ultima) {
            const limpiar = (v: any) =>
              v === 'null' || v === null || v === undefined
                ? ''
                : v.toString().trim();

            this.calificacionForm.patchValue({
              DtmFecha: new Date(ultima.dtmFecha).toISOString().split('T')[0],
              Cumplimiento: limpiar(ultima.strCumplimiento),
              Recalificacion: limpiar(ultima.strRecalificacion),
              Reestructurado: limpiar(ultima.strReestructurados),
              Cualitativa: limpiar(ultima.strCualitativa),
              Modelo: limpiar(ultima.strModelo)
            });
          }
          
          if(!this.calificacionForm.get('DtmFecha')?.value){
            this.gestionCreditoOperacionForm.get('Codigo')?.setValue('');
            this.notif.warning('Advertencia',
              'No se encontró la calificación.',
              ConfiguracionNotificacion.configRightTop
            )
            return
          }

          this.calificacionInicial = this.calificacionForm.getRawValue();

          (<any>$('#modalCambiarCalificacion')).modal('show');
        }
     });
  }

  onClickCerrarModalCalificacion() {
    (<any>$('#modalCambiarCalificacion')).modal('hide');

    setTimeout(() => {
      this.calificacionForm.reset();
      this.gestionCreditoOperacionForm.get('Codigo')?.reset();
      this.cuotaTabBloqueado = false;
    }, 200);
  }

  onClickLimpiarModalCalificacion() {
    this.calificacionForm.reset(this.calificacionInicial);
  }
  //Fin calificacion

  private async habilitarReestructurar() {
    await this.BuscarSaldosCartera();
    await this.buscarReestructuracionReliquidacion();
    const hoy = new Date();

    const seHizoReestructuracionHoy = this.lstReestructuracion.some(r => {
      const fecha = new Date(r.Fecha);
      return fecha.toDateString() === hoy.toDateString();
    });

    if(seHizoReestructuracionHoy) {
      this.notif.warning('Advertencia', "El crédito ya fué reestructurado hoy.", ConfiguracionNotificacion.configRightTop);
      this.gestionCreditoOperacionForm.get('Codigo')?.reset();
      return;
    }

    const error = this.validarEdicionCredito(this.gestionCreditoOperacionForm.get('Codigo')?.value) ?? this.validarEdicionCreditoAlCambiarSistema();
    if (error) {
      this.notif.warning('Advertencia', error, ConfiguracionNotificacion.configRightTop);
      this.gestionCreditoOperacionForm.get('Codigo')?.reset();
      return;
    }

    if(this.periodosPago.length === 0) this.periodosPago = await this.getPeriodosPago() ?? [];
    this.cambiarInfoCreditoContext = this.buildCambiarInfoCreditoContext();
    this.estaAbiertoModalCambios = true;
  }

  private async devolverReestructurado() {
    await this.buscarReestructuracionReliquidacion();
    const hoy = new Date();

    const ultimaReest = this.lstReestructuracion.find(r => {
      const fecha = new Date(r.Fecha);
      return fecha.toDateString() === hoy.toDateString();
    });

    if (!ultimaReest) {
      this.notif.warning('Advertencia', "Hoy no se ha realizado reestructuración al crédito.", ConfiguracionNotificacion.configRightTop);
      this.gestionCreditoOperacionForm.get('Codigo')?.reset();
      return;
    }

    const fechaUltimaReest = new Date(ultimaReest.Fecha);
    const fechaUltimaTransaccion = new Date(this.gestionCreditoForm.get('fechaUltimaTrans')?.value);

    if(fechaUltimaTransaccion >= fechaUltimaReest) {
      this.notif.warning('Advertencia', "Se realizó una transacción después de la reestructuración.", ConfiguracionNotificacion.configRightTop);
      this.gestionCreditoOperacionForm.get('Codigo')?.reset();
      return;
    }

    let data: string | null = localStorage.getItem('Data');
    const datosUsuario = JSON.parse(window.atob(data ?? ""));
    if (datosUsuario?.NumeroOficina != this.gestionCreditoForm.get('NumeroOficina')?.value) {
      this.notif.warning('Advertencia', ERROR_MESSAGES.OTRA_OFICINA, ConfiguracionNotificacion.configRightTop);
      this.gestionCreditoOperacionForm.get('Codigo')?.reset();
      return;
    }

    Swal.fire({
      title: 'Advertencia',
      text: '',
      html: '¿Está seguro que desea devolver reestructurado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((results) => {
      if (results.value) {

        const dataStr = localStorage.getItem('Data');
        let infoUsuario;
        if (dataStr) {
          infoUsuario = JSON.parse(window.atob(dataStr));

        }
        const IdCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
        const NombreUsuario: string = infoUsuario.Usuario;

        this.loading.show();
        this.carteraService.devolverReestructuracion({ IdCuenta, NombreUsuario }).subscribe({
          next: () => {
            this.onFinalizarActualizacionCredito({ idNovedad: Novedad.DevolverReestructuracion, idOperacion: Operacion.DevolverReestructuracion });
            this.loading.hide();


          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            this.loading.hide();
          }
        });

      } else {
        this.gestionCreditoOperacionForm.reset();
      }
    });

  }




  private async getPeriodosPago(): Promise<PeriodoPago[] | null> {
    try {
      return await firstValueFrom(
        this.carteraService.getPeriodosPago()
      );
    } catch (error) {
      console.error('Error al obtener periodos pago:', error);
      return null;
    }
  }

  //Inicio cambioFormaPago
  habilitarCambioFormaPago() {
    if (!this.cambiarFormaPago) return;
    if(this.validarSigla('CTD', 'No se puede realizar esta operación, tarjeta débito.')) return;

    const control = this.gestionCreditoForm.get('IdFormaPago');
    if (!control) return;

    this.formaPagoActual = control.value;
    this.formaPagoInicial = this.formaPagoActual;
    control.enable();

    this.mostrarBotonesActualizarFormaPago = true;
    this.campoFormaPagoHabilitado = true;
  }

  restaurarFormaPago(cancelar: boolean) {
    if (this.cambiarFormaPago) {
      this.campoFormaPagoHabilitado = false;
      const control = this.gestionCreditoForm.get('IdFormaPago');
      
      control?.disable();
      control?.setValue(this.formaPagoActual);
      
      this.mostrarBotonesActualizarFormaPago = false; 
      this.cuotaTabBloqueado = false;
      if(cancelar) {
        this.gestionCreditoOperacionForm.get('Codigo')?.setValue('');
      }
    }
  }

  CerrarModalDebito() {
    if (this.debitoAutomaticoFrom.get('DocumentoDebito')?.value === null
      && this.debitoAutomaticoFrom.get('NombreDebito')?.value === null
      && this.debitoAutomaticoFrom.get('IdCuentaOrigen')?.value === null
    ) {
      this.gestionCreditoForm.get('IdFormaPago')?.setValue(this.formaPagoInicial);
      this.debitoAutomaticoFrom.reset();
    } else {
      Swal.fire({
        title: 'Infomacion no se guardó',
        text: '',
        icon: 'warning',
        confirmButtonColor: 'rgb(160,0,87)',
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      this.debitoAutomaticoFrom.reset();
      this.gestionCreditoForm.get('IdFormaPago')?.setValue(this.formaPagoInicial);
    }
  }

  validarConvenioNomina() {
    const idTercero = this.gestionCreditoForm.get('IdTercero')?.value;
    
    if (!idTercero) {
      this.notif.warning(
        'Advertencia',
        'No se encontró tercero.',
        ConfiguracionNotificacion.configRightTop
      );
      return;
    }

    if(this.validarSigla('CROT', 'No se puede realizar esta operación, crédito rotativo.')) {
      this.gestionCreditoForm.get('IdFormaPago')?.setValue(this.formaPagoInicial);
      return;
    } 
  
    this.carteraService.obtenerConvenioNomina(idTercero).subscribe({
      next: (tieneConvenio) => {

        if (!tieneConvenio) {
          this.gestionCreditoForm.get('IdFormaPago')?.setValue(this.formaPagoInicial);
          this.notif.warning(
            'Advertencia',
            'No posee convenio de nómina.',
            ConfiguracionNotificacion.configRightTop
          );
          return;
        }
      },
      error: () => {
        this.notif.error(
          'Error',
          'Error al obtener convenio de nómina.',
          ConfiguracionNotificacion.configRightTop
        );
      }
    });
  }

  onChangeFormaPago() {
    const formaPagoId = Number(this.gestionCreditoForm.get('IdFormaPago')?.value);
  
    const formaPago = this.resultFormasPago.find(
      f => f.IdFormaPago === formaPagoId
    );
  
    if (!formaPago) return;

    if (!this.huboCambioFormaPago) {
      this.notif.warning(
        'Advertencia',
        'Debe cambiar forma de pago.',
        ConfiguracionNotificacion.configRightTop);
        return;
    }
    
    switch (formaPagoId) {
      case FormaPagoEnum.Debito:
        this.documentoSugDebito = this.gestionCreditoForm.get('NumeroDocumento')?.value;
        this.ModalRegistrarDebitoAutomatico.nativeElement.click();
        this.debitoAutomaticoFrom.get('DocumentoDebito')?.patchValue(this.documentoSugDebito);
        this.buscarAsociadoCuentaOrigen();
        break;
      case FormaPagoEnum.Nomina:
        this.debitoAutomaticoFrom.reset();
        this.validarConvenioNomina();
        break;
      case FormaPagoEnum.Caja:
      default:
        this.debitoAutomaticoFrom.reset();
        break;
    }
  }

  GuardarModalDebito() {
    if (this.debitoAutomaticoFrom.get('DocumentoDebito')?.value !== null
      && this.debitoAutomaticoFrom.get('DocumentoDebito')?.value !== undefined
      && this.debitoAutomaticoFrom.get('DocumentoDebito')?.value !== ''
      && this.debitoAutomaticoFrom.get('NombreDebito')?.value !== null
      && this.debitoAutomaticoFrom.get('NombreDebito')?.value !== undefined
      && this.debitoAutomaticoFrom.get('NombreDebito')?.value !== ''
      && this.debitoAutomaticoFrom.get('IdCuentaOrigen')?.value !== null
      && this.debitoAutomaticoFrom.get('IdCuentaOrigen')?.value !== undefined
      && this.debitoAutomaticoFrom.get('IdCuentaOrigen')?.value !== ''
      && this.debitoAutomaticoFrom.get('IdCuentaOrigen')?.value !== '0'
    ) {
      (<any>$('#ModalRegistrarDebitoAutomatico')).modal('hide');

    } else {
      this.notif.warning('Advertencia', 
        'Debe diligenciar los datos para guardar el débito.',
         ConfiguracionNotificacion.configRightTop);
    }
  }

  clearInfoDebito(){
    this.debitoAutomaticoFrom.get('NombreDebito')?.reset();
    this.debitoAutomaticoFrom.get('IdCuentaOrigen')?.reset(); 
  }

  buscarAsociadoCuentaOrigen() {
    this.debitoAutomaticoFrom.get('IdCuentaOrigen')?.reset(); 
    let Documento = '*';
    let Nombre = '*';
    if (this.debitoAutomaticoFrom.get('DocumentoDebito')?.value !== null
      && this.debitoAutomaticoFrom.get('DocumentoDebito')?.value !== undefined
      && this.debitoAutomaticoFrom.get('DocumentoDebito')?.value !== ''
    ) {
      this.debitoAutomaticoFrom.get('NombreDebito')?.setValue('');
      Documento = this.debitoAutomaticoFrom.get('DocumentoDebito')?.value;
    } else if (this.debitoAutomaticoFrom.get('NombreDebito')?.value !== null
      && this.debitoAutomaticoFrom.get('NombreDebito')?.value !== undefined
      && this.debitoAutomaticoFrom.get('NombreDebito')?.value !== ''
    ) {
      Nombre = this.debitoAutomaticoFrom.get('NombreDebito')?.value;
    }
    this.loading.show();
    this.contractualService.BuscarAsociadoDebito(Documento, Nombre).subscribe(
      result => {
        this.loading.hide();
        if (result.length === 0) {
          this.notif.warning('Advertencia', 'No se encontró el asociado.', ConfiguracionNotificacion.configRightTop);
          this.resultCuentaDebito = undefined;
        } else if (result.length === 1) {
          this.debitoAutomaticoFrom.get('DocumentoDebito')?.setValue(result[0].NumeroDocumento);
          this.debitoAutomaticoFrom.get('NombreDebito')?.setValue(result[0].PrimerApellido + ' ' +
            result[0].SegundoApellido + ' ' + result[0].PrimerNombre + ' ' + result[0].SegundoNombre);
          this.BloquearCuentaOrigen = null;
          this.BuscarCuentaDebito();
        } else if (result.length > 1) {
        } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
          if (result.Mensaje === 'Gerencia de desarrollo') {
            Swal.fire({
              title: '<strong>! Advertencia ¡</strong>',
              text: '',
              icon: 'error',
              animation: false,
              html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                + result.Mensaje + '.',
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          } else if (result.Mensaje === 'Oficial de cumplimiento') {
            Swal.fire({
              title: '<strong>! Advertencia ¡</strong>',
              text: '',
              icon: 'error',
              animation: false,
              html: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>'
                + result.Mensaje + '.',
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          }
        }
      },
      error => {
        this.loading.hide();
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  BuscarCuentaDebito() {
    if (this.debitoAutomaticoFrom.get('DocumentoDebito')?.value !== null
      && this.debitoAutomaticoFrom.get('DocumentoDebito')?.value !== undefined
      && this.debitoAutomaticoFrom.get('DocumentoDebito')?.value !== '') {
        this.loading.show();
      this.contractualService.getBuscarCuentaDebito(this.debitoAutomaticoFrom.value).subscribe(
        result => {
          this.loading.hide();
          if (result.length >= 1) {
            this.resultCuentaDebito = result;            
            this.debitoAutomaticoFrom.get('IdOficinaDebito')?.setValue(result[0].IdOficina);
            this.debitoAutomaticoFrom.get('IdProductoDebito')?.setValue(result[0].IdProducto);
            this.debitoAutomaticoFrom.get('IdConsecutivoDebito')?.setValue(result[0].IdConsecutivo);
            this.debitoAutomaticoFrom.get('IdDigitoDebito')?.setValue(result[0].IdDigito);
          } else if (result.Mensaje !== undefined || result.Mensaje !== null) {
            this.notif.warning('Advertencia', result.Mensaje, ConfiguracionNotificacion.configRightTop);
            this.debitoAutomaticoFrom.get('DocumentoDebito')?.reset();
            this.debitoAutomaticoFrom.get('NombreDebito')?.reset();
            this.resultCuentaDebito = undefined;
          }
        },
        error => {
          this.loading.hide();
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );
    }
  }

  private buildDebitoParams(formaPagoNueva: number): Partial<CambiarFormaPagoDto> {

    if (formaPagoNueva !== FormaPagoEnum.Debito) {
      return {
        ofiDtno: null,
        proDtno: null,
        conDtno: null,
        digDtno: null,
      };
    }

    return {
      ofiDtno: this.debitoAutomaticoFrom.get('IdOficinaDebito')?.value,
      proDtno: this.debitoAutomaticoFrom.get('IdProductoDebito')?.value,
      conDtno: this.debitoAutomaticoFrom.get('IdConsecutivoDebito')?.value,
      digDtno: this.debitoAutomaticoFrom.get('IdDigitoDebito')?.value,
    };
  }

  actualizarFormaPago() {
    const formaPagoNueva = Number(this.gestionCreditoForm.get('IdFormaPago')?.value);
    const formaPagoActual = Number(this.formaPagoActual);
    
    if (!this.huboCambioFormaPago) {
      this.notif.warning(
        'Advertencia',
        'Debe cambiar forma de pago.',
        ConfiguracionNotificacion.configRightTop)
        ;
        return;
    }
    
    const debitoParams = this.buildDebitoParams(formaPagoNueva);
  
    const dto: CambiarFormaPagoDto = {
      oficina: this.gestionCreditoForm.get('IdOficinaCuenta')?.value,
      producto: this.gestionCreditoForm.get('IdProductoCuenta')?.value,
      consecutivo: this.gestionCreditoForm.get('IdConsecutivo')?.value,
      digito: this.gestionCreditoForm.get('IdDigito')?.value,
    
      formaPagoActual,
      formaPagoNueva,
    
      usuario: this.dataUser.IdUsuario,
      autoriza: this.dataUser.IdUsuario,
      novedad: 0,
    
      ...debitoParams
    };
  
    let flujo$: Observable<any>;
  
    if (formaPagoActual === FormaPagoEnum.Debito) {
      const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    
      flujo$ = this.carteraService.getDebito(idCuenta).pipe(
        switchMap((debito: DebitoAutomaticoCreditoDto | null) => {
          this.debitoAnterior = debito;
          return this.carteraService.cambiarFormaPago(dto);
        })
      );
    } else {
      flujo$ = this.carteraService.cambiarFormaPago(dto);
    }

    this.loading.show();
    flujo$.pipe(
      finalize(() => this.loading.hide())
    )
    .subscribe({
      next: resp => this.procesarResCambiarFormaPago(resp, formaPagoNueva),
      error: err => {
        this.notif.error(
          'Error',
          err?.Mensaje ?? 'El cambio de forma de pago no se realizó correctamente.',
          ConfiguracionNotificacion.configRightTop
        );
      }
    });
    this.cuotaTabBloqueado = false;
  }

  private procesarResCambiarFormaPago(resp: ResultadoOperacionDto,nuevaFormaPago: number) {
    if (!resp || !resp.Exitoso) {
      this.errorActualizarPagare(resp);
      return;
    }
    
    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    const formaPagoActual = Number(this.formaPagoActual);
    let jsonLog: any;

    if (nuevaFormaPago === FormaPagoEnum.Debito) {
      const cuentaSeleccionada = this.debitoAutomaticoFrom.get('IdCuentaOrigen')?.value;

      jsonLog = {
        Anterior: { FormaPago: formaPagoActual },
        Actualiza: {
          FormaPago: nuevaFormaPago,
          Debito: {
            DocumentoDebito: this.debitoAutomaticoFrom.get('DocumentoDebito')?.value,
            NombreDebito: this.debitoAutomaticoFrom.get('NombreDebito')?.value,
            Cuenta: cuentaSeleccionada?.CuentaD,
          }
        }
      };
    }
    else if (formaPagoActual === FormaPagoEnum.Debito && this.debitoAnterior) {
      jsonLog = {
        Anterior: {
          FormaPago: formaPagoActual,
          Debito: {
            DocumentoDebito: this.debitoAnterior.NumeroDocumento,
            NombreDebito: this.debitoAnterior.Nombre,
            Cuenta: this.debitoAnterior.NumeroCuenta,
          }
        },
        Actualiza: { FormaPago: nuevaFormaPago }
      };
    }
    else {
      jsonLog = {
        Anterior: { FormaPago: formaPagoActual },
        Actualiza: { FormaPago: nuevaFormaPago }
      };
    }

    this.guardarLogGestionCredito(jsonLog);
    this.BuscarDatosCartera(idCuenta);

    this.formaPagoActual = nuevaFormaPago;
    this.formaPagoInicial = nuevaFormaPago;
    this.gestionCreditoForm.get('IdFormaPago')?.disable();
    this.mostrarBotonesActualizarFormaPago = false;
    this.campoFormaPagoHabilitado = false;
    this.gestionCreditoOperacionForm.get('Codigo')?.reset();

    this.notif.success(
      'Exitoso',
      'El cambio de forma de pago se realizó correctamente.',
      ConfiguracionNotificacion.configRightTop
    );
    this.cuotaTabBloqueado = false;
  }

  onChangeCuentaDebito() {
    const cuentaSeleccionada = this.debitoAutomaticoFrom.get('IdCuentaOrigen')?.value;

    if (!cuentaSeleccionada) return;

    if (!cuentaSeleccionada.ActivaMovimiento) {

      this.notif.warning(
        'Advertencia',
        'Cuenta inactiva por movimiento.',
        ConfiguracionNotificacion.configRightTop
      );

      this.debitoAutomaticoFrom.get('IdCuentaOrigen')?.setValue(null);

      return;
    }

    this.debitoAutomaticoFrom.get('IdOficinaDebito')?.setValue(cuentaSeleccionada.IdOficina);
    this.debitoAutomaticoFrom.get('IdProductoDebito')?.setValue(cuentaSeleccionada.IdProducto);
    this.debitoAutomaticoFrom.get('IdConsecutivoDebito')?.setValue(cuentaSeleccionada.IdConsecutivo);
    this.debitoAutomaticoFrom.get('IdDigitoDebito')?.setValue(cuentaSeleccionada.IdDigito);
  }
  //Fin cambioFormaPago


  //Inicio InclusionExclusion
  confirmarInclusionExclusion(): void {

    if(this.validarSigla('CROT', 'No se puede realizar esta operación, crédito rotativo.'))
      return;

    if(this.validarSigla('CTD', 'No se puede realizar esta operación, tarjeta débito.'))
      return;


    const estaSinCobertura = this.gestionCreditoForm.get('estaSinCobertura')?.value;

    const texto = estaSinCobertura
      ? '¿Desea realizar la inclusión del seguro?'
      : '¿Desea realizar la exclusión del seguro?';

    Swal.fire({
      title: 'Advertencia',
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: 'rgb(13,165,80)',
      cancelButtonColor: 'rgb(160,0,87)',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(result => {
      if (result.isConfirmed) {
        this.confirmarManejoSeguro(estaSinCobertura);
      } else {
        this.gestionCreditoOperacionForm.get('Codigo')?.reset();
        this.cuotaTabBloqueado = false;
      }
    });
  }

  confirmarManejoSeguro(estaSinCobertura: boolean): void {

    const valorAnterior = estaSinCobertura ? 1 : 0;
    const valorActual   = estaSinCobertura ? 0 : 1;

    const dto: ManejarSeguroCreditoDto = {
      oficina: this.gestionCreditoForm.get('IdOficinaCuenta')?.value,
      producto: this.gestionCreditoForm.get('IdProductoCuenta')?.value,
      consecutivo: this.gestionCreditoForm.get('IdConsecutivo')?.value,
      digito: this.gestionCreditoForm.get('IdDigito')?.value,
      manejaSeguro: valorActual,
      usuario: this.dataUser.IdUsuario,
      autoriza: this.dataUser.IdUsuario,
      novedad: 212
    };

    const jsonLog = {
      Anterior: { manejaSeguro: valorAnterior },
      Actualiza: { manejaSeguro: valorActual }
    };

    this.loading.show();
    this.carteraService.manejarSeguroCredito(dto).pipe(finalize( () => this.loading.hide()))
    .subscribe({
      next: (resp) => {
        if (resp.Exitoso) {
          this.notif.success('Exitoso', 
            'El cambio de inclusión/exclusión de seguro se realizó correctamente.', 
            ConfiguracionNotificacion.configRightTop
          );
          this.getDeducibles();
          this.cuotaTabBloqueado = false;
          this.guardarLogGestionCredito(jsonLog);
          this.gestionCreditoForm.get('estaSinCobertura')?.setValue(valorActual === 1);
          this.gestionCreditoOperacionForm.get('Codigo')?.reset();          
        }
      }
    });
  }
  //Fin InclusionExclusion


  advertenciaOperacionSinCuenta(): boolean {
    if (!this.gestionCreditoForm.get('IdCuenta')?.value) {
      this.notif.warning(
        'Advertencia',
        'Debe buscar una cuenta para realizar esta operación.',
        ConfiguracionNotificacion.configRightTop
      );
      this.gestionCreditoOperacionForm.get('Codigo')?.reset();
      return true;
    }
    return false;
  }

  habilitarCamposBusqueda() {
    for (const nombreCampo of this.NOMBRES_CAMPOS_BUSQUEDA) {
      this.gestionCreditoForm.get(nombreCampo)?.enable();
    }
  }

  deshabilitarCamposBusqueda() {
    for (const nombreCampo of this.NOMBRES_CAMPOS_BUSQUEDA) {
      this.gestionCreditoForm.get(nombreCampo)?.disable();
    }
  }

  habilitarCambioLinea() {
    if(this.validarSigla('CROT', 'No se puede realizar esta operación, crédito rotativo.'))
      return;

    if(this.validarSigla('CTD', 'No se puede realizar esta operación, tarjeta débito.'))
      return;

    if (this.gestionCreditoForm.get('Sigla')?.value === 'CTD') 
        if (!this.validarCreditoPadre()) return;

    this.habilitarControlCambioLinea();
  }

  habilitarControlCambioLinea() {
    if(!this.cambiarLinea) return;

    const control = this.gestionCreditoForm.get('IdLinea');
    const controlNombre = this.gestionCreditoForm.get('Linea');
    this.lineaActual = control?.value;
    this.nombreLineaActual = controlNombre?.value;
    if(!control) return;
    if(!controlNombre) return;

    control.enable();
    control.enable();
    control.setErrors(null);
    control.updateValueAndValidity();
    control.setValue(null);
    setTimeout(() => { this.lineaInput?.nativeElement.focus();}); 
    controlNombre.enable();
    controlNombre.setErrors(null);
    controlNombre.updateValueAndValidity();
    controlNombre.setValue('');

    this.mostrarBotonesActualizarLinea = true;
    this.campoLineaHabilitado = true;
  }

  restaurarLinea(cancelar: boolean) {
    if(this.cambiarLinea && this.lineaActual && this.nombreLineaActual) {
      const control = this.gestionCreditoForm.get('IdLinea');
      const controlNombre = this.gestionCreditoForm.get('Linea');

      control?.clearValidators();
      control?.setErrors(null);
      control?.disable();
      control?.setValue(this.lineaActual);

      controlNombre?.clearValidators();
      controlNombre?.setErrors(null);
      controlNombre?.disable();
      controlNombre?.setValue(this.nombreLineaActual);

      this.mostrarBotonesActualizarLinea = false;
      this.cuotaTabBloqueado = false;
      if(cancelar) {
        this.gestionCreditoOperacionForm.get('Codigo')?.setValue('');
      }
      this.campoLineaHabilitado = false;
    }
  }

  cargarLineasParaCambio(): void {
    const claseTipo = this.gestionCreditoForm.get('IdProducto')?.value;
    const lineaActual = this.gestionCreditoForm.get('IdLinea')?.value;

    this.loading.show();
    this.carteraService.obtenerLineasCambio(claseTipo, lineaActual).subscribe({
      next: (resp) => {
        this.lineasDisponibles = resp;
        this.lineasFiltradas = resp;

        this.lineasParaTabla = resp.map(linea => ({
          Linea: linea.IdLinea,
          Nombre: linea.NombreLinea
        }));

        this.loading.hide();
      },
      error: () => {
        this.loading.hide();
        this.notif.error('Error', 'Error al obtener las líneas.', ConfiguracionNotificacion.configRightTop);
      }
    });
  }
  
  abrirModalCambioLinea(): void {
    this.loading.show();
    this.lineaSeleccionada = null;
    this.cargarLineasParaCambio();
    (<any>$('#ModalCambiarLinea')).modal('show');
    this.loading.hide();
  }

  onLineaSeleccionadaCambio(linea: any) {
    this.loading.show();
    this.confirmarLinea(linea);
    if (!linea) return;

    const controlId = this.gestionCreditoForm.get('IdLinea');
    const controlNombre = this.gestionCreditoForm.get('Linea');

    controlId?.setValue(linea.Linea);
    controlNombre?.setValue(linea.Nombre);
    this.loading.hide();
    (<any>$('#ModalCambiarLinea')).modal('hide');
  }

  LimpiarCampos(Datos : any) {
    if (Datos === 'IdLinea') {
      this.gestionCreditoForm.get('Linea')?.reset();
    } else if (Datos === 'Linea') {
      this.gestionCreditoForm.get('IdLinea')?.reset();
    } 
  }

  buscarLineaCambio(buttonSearch: boolean) {
    if (!this.campoLineaHabilitado) return;

    const controlIdLinea = this.gestionCreditoForm.get('IdLinea')?.value;
    const controlLinea = this.gestionCreditoForm.get('Linea')?.value;

    if (
      Number(controlIdLinea) === Number(this.lineaActual) ||
      controlLinea === this.nombreLineaActual
    ) {
      this.notif.warning('Advertencia','Debe cambiar línea.',
        ConfiguracionNotificacion.configRightTop
      );
      return;
    }

    this.busquedaService.ejecutar({
      lista: this.lineasDisponibles,
      idInput: controlIdLinea,
      nombreInput: controlLinea,
      buttonSearch,

      getId: l => l.IdLinea.toString(),
      getNombre: l => l.NombreLinea,
      onConfirm: l => this.confirmarLinea(l),
      onMultiple: items => {
        this.lineasFiltradas = items;
        this.lineasParaTabla = items.map(l => ({
          Linea: l.IdLinea,
          Nombre: l.NombreLinea
        }));
        (<any>$('#ModalCambiarLinea')).modal('show');
      },
      onNotFound: () => {
        this.notif.warning(
          'Advertencia',
          'No se encontró registro.',
          ConfiguracionNotificacion.configRightTop
        );
      }
    });
  }

  confirmarLinea(linea: LineaCambioListDto) {
    this.gestionCreditoForm.patchValue({
      IdLinea: linea.IdLinea,
      Linea: linea.NombreLinea
    });
    this.lineaSeleccionada = linea;
  }

  habilitarPagare() {
    if (this.gestionCreditoForm.get('Sigla')?.value === 'CTD') 
        if (!this.validarCreditoPadre()) return;

    this.habilitarControlPagare();
  }

  private habilitarControlPagare() {
    if (!this.cambiarPagare) return;

    const control = this.gestionCreditoForm.get('pagare');
    const controlTipo = this.gestionCreditoForm.get('TipoPagare');
    this.pagareActual = control?.value;
    this.tipoPagareActual = controlTipo?.value;

    if (!control) return;
    if (!controlTipo) return;

    control.enable();
    control.setValidators([
      Validators.required,
      Validators.pattern('^[0-9]*$')
    ]);
    control.setErrors(null);
    control.updateValueAndValidity();

    controlTipo.enable();
    controlTipo.setErrors(null);
    controlTipo.updateValueAndValidity();
    controlTipo?.setValue(this.tipoPagareInicial);

    this.mostrarBotonesActualizarPagare = true;
    this.campoPagareHabilitado = true;
    setTimeout(() => { this.pagareInput?.nativeElement.focus();}); 
  }

  restaurarPagare(cancelar: boolean) {
    if (this.cambiarPagare && this.pagareActual) {
      this.cuotaTabBloqueado = false;
      const control = this.gestionCreditoForm.get('pagare');
      const tipoPagareControl = this.gestionCreditoForm.get('TipoPagare');
        
      control?.clearValidators();
      control?.setValidators([Validators.pattern('^[0-9]*$')]);
      control?.setErrors(null);
      control?.disable();
      control?.setValue(this.pagareActual);

      tipoPagareControl?.disable();
      tipoPagareControl?.setValue(this.tipoPagareActual);

      this.mostrarBotonesActualizarPagare = false;
      this.campoPagareHabilitado = false;
      if(cancelar) {
        this.gestionCreditoOperacionForm.get('Codigo')?.setValue('');
      }
    }
  }

  reestablecerCamposEncabezado(...args: string[]) {
    if (!args.length) {
      this.gestionCreditoForm.reset();
    } else {
      for (const nombreCampo of args) {
        this.gestionCreditoForm.get(nombreCampo)?.reset();
      }
    }
    this.encabezadoRadicado = null;
  }

  onBlurCampoNumeroCuenta() {
    const valoresCamposNumeroCuenta = this.NOMBRES_CAMPOS_NUMERO_CUENTA.map(nombre => this.gestionCreditoForm.get(nombre)?.value?.trim());
    if (valoresCamposNumeroCuenta.every(valor => /^\d+$/.test(valor))) {
      const [oficina, producto, consecutivo, digito] = valoresCamposNumeroCuenta;
      this.buscarCuentaResumen(TipoBusquedaResumen.NumeroCuenta, { oficina, producto, consecutivo, digito });
    }
  }

  onClickBuscarCuentaPorCliente() {
    const documento = this.gestionCreditoForm.get('BuscarDocumento')?.value?.trim();
    const nombre = this.gestionCreditoForm.get('BuscarNombre')?.value?.trim();
    if (documento) this.buscarCuentaResumen(TipoBusquedaResumen.Documento, documento);
    else if (nombre && this.gestionCreditoForm.controls['BuscarNombre'].valid) this.buscarCuentaResumen(TipoBusquedaResumen.Nombre, nombre);
  }

  onClickBuscarPorPagare() {
    const pagare = this.gestionCreditoForm.get('pagare')?.value;
    if (pagare) this.buscarCuentaResumen(TipoBusquedaResumen.Pagare, pagare);

  }

  concatWithSpace(...args: string[]): string {
    return args.filter(Boolean).map(s => String(s).trim().replace(/\s{2,}/g, ' ')).join(' ');
  }

  buscarCuentaResumen(filtro: TipoBusquedaResumen, valor: string | CuentaFormateada) {
    let consulta$: Observable<CuentaCarteraResumen[]>;
    if (filtro === TipoBusquedaResumen.NumeroCuenta) {
      consulta$ = this.carteraService.buscarCuentaResumenPorNumeroCuenta(valor as CuentaFormateada);
    } else {
      consulta$ = this.carteraService.buscarCuentasResumen(filtro, valor as string);
    }
    this.loading.show();
    consulta$.pipe(
      catchError(error => {
        console.error('Error al obtener cuentaResumen:', error);
        return of(null);
      })
    ).subscribe(
      result => {
        this.loading.hide();
        if (!result) {
          this.notif.warning('Advertencia', 'No se encontró registro.', ConfiguracionNotificacion.configRightTop);
        } else if (result.length === 0) {
          this.notif.warning('Advertencia', 'No se encontró registro.', ConfiguracionNotificacion.configRightTop);
        } else if (result.length === 1) {
          this.buscarCuentaDetalle(result[0].IdCuenta);
        } else if (result.length > 1) {
          this.cuentasResumenData = result;

          const columnasConfiguradas: MapeoColumna[] = [
            { encabezado: 'Cuenta', campos: ['CodigoCuentaFormateado'] },
            { encabezado: 'Nombre Asociado', campos: ['PrimerApellido', 'SegundoApellido', 'PrimerNombre', 'SegundoNombre'] },
            { encabezado: 'Pagaré', campos: ['Pagare'] },
            { encabezado: 'Pagare', campos: ['Pagare'] },
            { encabezado: 'Estado', campos: ['Estado'] },
            { encabezado: 'Fecha', campos: ['FechaMatricula'], obtenerValor: i => formatDate(i.FechaMatricula, 'yyyy/MM/dd', 'es-CO') },
            { encabezado: 'Linea', campos: ['IdLinea'] },
            { encabezado: 'IdLinea', campos: ['IdLinea'] },
            { encabezado: 'IdCuenta', campos: ['IdCuenta'] },
            { encabezado: 'IdDigito', campos: ['IdDigito'] },
            { encabezado: 'IdEstado', campos: ['IdEstado'] },
            { encabezado: 'IdConsecutivo', campos: ['IdConsecutivo'] },
            { encabezado: 'IdOficinaCuenta', campos: ['IdOficinaCuenta'] },
            { encabezado: 'IdProducto', campos: ['IdProducto'] },
            { encabezado: 'PrimerApellido', campos: ['PrimerApellido'] },
            { encabezado: 'PrimerNombre', campos: ['PrimerNombre'] },
            { encabezado: 'SegundoApellido', campos: ['SegundoApellido'] },
            { encabezado: 'SegundoNombre', campos: ['SegundoNombre'] },

          ];
          this.datosTransformados = transformarDatosParaTabla(result, columnasConfiguradas);
          this.encabezadosTablaModalAlBuscar = ['Cuenta', 'Nombre Asociado', 'Pagaré', 'Estado', 'Fecha', 'Linea'];
          this.ModalBuscarAsociados.nativeElement.click();
        }
      }
    );
  }

  private async getDetalle(idCuenta: number): Promise<CuentaCarteraDetalle | null> {
    try {
      return await firstValueFrom(
        this.carteraService.buscarCuentaDetalle(idCuenta)
      );
    } catch (error) {
      console.error('Error al obtener detalle:', error);
      return null;
    }
  }

  private async getCheckCartera(idCuenta: number): Promise<any | null> {
    try {
      return await firstValueFrom(
        this.miListaProductosService.SetCheckCartera(idCuenta)
      );
    } catch (error) {
      console.error('Error al obtener check cartera:', error);
      return null;
    }
  }

  private async getRadicados(idTercero: number): Promise<any | null> {
    try {
      return await firstValueFrom(
        this.miListaProductosService.GetRadicados(idTercero)
      );
    } catch (error) {
      console.error('Error al obtener radicados:', error);
      return null;
    }
  }

  private async getObservacionesRadicado(radicado: number): Promise<ObservacionRadicado[] | null> {
    try {
      return await firstValueFrom(
        this.carteraService.getObservacionesRadicado(radicado)
      );
    } catch (error) {
      console.error('Error al obtener observaciones radicados:', error);
      return null;
    }
  }

  private mapearDetalleCuenta() {
    const { Encabezado, SaldoSeguroHipotecario } = this.detalleCuenta;
    this.gestionCreditoForm.patchValue({
      IdCuenta: Encabezado.IdCuenta,
      CodigoCuentaFormateado: Encabezado.CodigoCuentaFormateado,
      IdOficinaCuenta: Encabezado.IdOficinaCuenta,
      IdProductoCuenta: Encabezado.IdProducto,
      IdConsecutivo: Encabezado.IdConsecutivo,
      IdDigito: Encabezado.IdDigito,
      NumeroOficinaAsociado: Encabezado.IdOficinaCliente,
      NombreOficinaAsociado: Encabezado.OficinaCliente,
      NumeroDocumento: Encabezado.NumeroDocumento,
      IdProducto: Encabezado.IdProducto,
      DescripcionProducto: Encabezado.NombreProducto,
      Sigla: Encabezado.Sigla,
      IdLinea: Encabezado.IdLinea,
      Linea: Encabezado.Linea,
      IdAsesor: Encabezado.IdAsesor,
      NombreAsesor: Encabezado.Asesor,
      IdAsesorExterno: Encabezado.IdAsesorExterno,
      NombreAsesorExterno: Encabezado.AsesorExterno,
      Radicado: Encabezado.Radicado,
      pagare: Encabezado.Pagare,
      IdRelacionCliente: Encabezado.IdRelacionCliente,
      NombreRelacionCliente: Encabezado.NombreRelacionCliente,
      NumeroOficina: Encabezado.IdOficinaCuenta,
      NombreOficina: Encabezado.OficinaCuenta,
      IdEstadoCuenta: Encabezado.IdEstado,
      NombreEstadoCuenta: Encabezado.Estado,
      IdOperacionPermitida: Encabezado.IdOperacionPermitida,
      NombreOperacionPermitida: Encabezado.NombreOperacionPermitida,
      IdFormaPago: Encabezado.IdFormaPago,
      estaSinCobertura: Encabezado.EstaSinCobertura,
      IdTercero: Encabezado.IdTercero,
      TipoCliente: Encabezado.TipoCliente,
      IdTipoDocumento: Encabezado.IdTipoDocumento,
      ManejoCupo: Encabezado.ManejoCupo,
      TipoPagare: Encabezado.TipoPagare,
      esCreditoPadre: Encabezado.CreditoPadre
    });
    const { PrimerApellido, SegundoApellido, PrimerNombre, SegundoNombre } = Encabezado;
    this.gestionCreditoForm.get('Nombre')?.setValue(this.concatWithSpace(PrimerApellido, SegundoApellido, PrimerNombre, SegundoNombre));
    const saldo = SaldoSeguroHipotecario?.Saldo;
    if (saldo && saldo > 0) {
      Swal.fire({
        icon: 'warning',
        title: '<strong>! Advertencia ¡</strong>',
        html: `Posee deuda de seguro de garantía hipotecaria por valor de ${this.formatoCOP(saldo)}`,
        animation: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: 'rgb(160, 0, 87)'
      });
    }

    if (this.checkCartera) {
      this.gestionCreditoForm.patchValue({
        estaReestructurado: this.checkCartera.Reestructurado,
        estaReliquidado: this.checkCartera.Reliquidado,
        estaCastigado: this.checkCartera.Catigada
      });
    }
  }

  private mapearInformacionRadicado() {
    const radicado = this.gestionCreditoForm.get('Radicado')?.value;
    if (this.radicados) {
      this.encabezadoRadicado = this.radicados.find((r: any) => r.Radicado == radicado);
      if (!this.encabezadoRadicado) {
        this.gestionCreditoForm.get('Radicado')?.setValue(0);
      }
    } else {
      this.gestionCreditoForm.get('Radicado')?.setValue(0);
    }

    if (this.observacionesRadicado?.some(o => o.EsExcepcion)) {
      this.gestionCreditoForm.get('tieneExcepciones')?.setValue(true);
    }
  }

  async buscarCuentaDetalle(idCuenta: number) {
    this.loading.show();
    this.devolverTab(Tabs.Datos);
    this.resetEstadoCargaTabs();
    const detalle = await this.getDetalle(idCuenta);
    if (!detalle) {
      this.loading.hide();
      return;
    }
    this.BuscarDatosCartera(idCuenta);
    this.detalleCuenta = detalle;
    
    const [
      checkCartera,
      radicados,
      observacionesRadicado
    ] = await Promise.all([
      this.getCheckCartera(idCuenta),
      this.getRadicados(detalle.Encabezado.IdTercero),
      detalle.Encabezado.Radicado
        ? this.getObservacionesRadicado(detalle.Encabezado.Radicado)
        : Promise.resolve(null)
    ]);

    this.checkCartera = checkCartera;
    this.radicados = radicados;
    this.observacionesRadicado = observacionesRadicado ?? [];

    this.loading.hide();

    this.ValidaPactado = false;
    this.mapearDetalleCuenta();
    this.setTipoPagareActual(detalle.Encabezado.TipoPagare);
    this.reestablecerCamposEncabezado('BuscarDocumento', 'BuscarNombre');
    this.gestionCreditoOperacionForm.reset();
    this.deshabilitarCamposBusqueda();
    this.cambiarPagare = true;
    this.cambiarLinea = true;
    this.cambiarFormaPago = true;
    this.cargarLineasParaCambio();
    this.getListaCalificaciones();
    this.getCausalCalificacion();
    this.mostrarBotonesLimpiar = true;
    this.mapearInformacionRadicado();
  }

  private formatoCOP(dinero: number) {
    const formato = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
    return formato.format(dinero);
  } 
  
  actualizarPagare() {
    const nuevoPagare = this.gestionCreditoForm.get('pagare')?.value;
    let nuevoTipoPagareId = this.gestionCreditoForm.get('TipoPagare')?.value;
  
    if (!this.huboCambio) {
      this.notif.warning(
        'Advertencia',
        'Debe cambiar el tipo y/o número de pagaré.',
         ConfiguracionNotificacion.configRightTop)
        ;
      return;
    }

    const dtoBase: ActualizarPagareDto = {
      Oficina: this.gestionCreditoForm.get('IdOficinaCuenta')?.value,
      Producto: this.gestionCreditoForm.get('IdProductoCuenta')?.value,
      Consecutivo: this.gestionCreditoForm.get('IdConsecutivo')?.value,
      Digito: this.gestionCreditoForm.get('IdDigito')?.value,
      NuevoPagare: nuevoPagare,
      Usuario: this.dataUser.IdUsuario,
      Autoriza: this.dataUser.IdUsuario,
      Novedad: 61,
      TipoPagare: Number(nuevoTipoPagareId)
    };

    this.loading.show();
    if (this.esCreditoPadre) {
       const dtoCupo = {
         ...dtoBase, IdCuenta: this.gestionCreditoForm.get('IdCuenta')?.value
       };
      this.carteraService.cambiarPagareCupo(dtoCupo).pipe(
      finalize(() => this.loading.hide())
      ).subscribe({
        next: resp => this.procesarRespuestaPagare(resp, nuevoPagare),
        error: resp => this.errorActualizarPagare(resp)
      });

      return;
    }

    this.carteraService.cambiarPagare(dtoBase).pipe(
      finalize(() => this.loading.hide())
      ).subscribe({
      next: resp => this.procesarRespuestaPagare(resp, nuevoPagare),
      error: resp => this.errorActualizarPagare(resp)
    });
  }

  onBlurPagare(): void {
    const control = this.gestionCreditoForm.get('pagare');
    if (!control) return;

    const valor = control.value;

    if (valor !== null && valor !== undefined && valor !== '') {
      const valorNormalizado = valor.toString().replace(/^0+/, '');
      control.setValue(valorNormalizado === '' ? '' : valorNormalizado);
    }
  }


  private setTipoPagareActual(descripcionTipo: string) {
    const tipo = this.tiposPagare.find(
      t => t.descripcion === descripcionTipo
    );

    if (!tipo) {
      console.warn('Tipo de pagaré no encontrado:', descripcionTipo);
      return;
    }

    this.tipoPagareInicial = tipo.id;
    this.tipoPagareDescripcionActual = tipo.descripcion;
    this.gestionCreditoForm.get('TipoPagare')?.setValue(tipo.id);
  }

  get descripcionTipoPagare(): string {
    const id = this.gestionCreditoForm.get('TipoPagare')?.value;
    return this.tiposPagare.find(t => t.id === id)?.descripcion ?? '';
  }
  
  get huboCambio(): boolean {
    const nuevoPagare = Number(this.gestionCreditoForm.get('pagare')?.value);
    const nuevoTipoPagare = Number(this.gestionCreditoForm.get('TipoPagare')?.value);

    const cambioPagare = nuevoPagare !== Number(this.pagareActual);
    const cambioTipo = nuevoTipoPagare !== Number(this.tipoPagareInicial);

    return cambioPagare || cambioTipo;
  }

  get huboCambioFormaPago(): boolean {
    const nuevaFormaPago = Number(this.gestionCreditoForm.get('IdFormaPago')?.value);

    const cambioFormaPago = nuevaFormaPago !== Number(this.formaPagoActual);
    return cambioFormaPago
  }

  get huboCambioCalificacion(): boolean {
    const actual = this.calificacionForm.getRawValue();
    return JSON.stringify(actual) !== JSON.stringify(this.calificacionInicial);
  }

  private existeLineaEnLista(idLinea: number, nombreLinea: string): boolean {
    return this.lineasDisponibles.some(
      l => Number(l.IdLinea) === Number(idLinea) && l.NombreLinea === nombreLinea
    );
  }

  get huboCambioLinea(): boolean {
    const idLineaCtrl = this.gestionCreditoForm.get('IdLinea');
    const lineaCtrl = this.gestionCreditoForm.get('Linea');

    if (!idLineaCtrl || !lineaCtrl) return false;
    const nuevoId = Number(idLineaCtrl.value);

    const nuevoNombre = lineaCtrl.value;
    
    if (!nuevoId) return false;

    if (!this.existeLineaEnLista(nuevoId, nuevoNombre)) {
      return false;
    }

    return nuevoId !== Number(this.lineaActual);
  }

  actualizarLinea() {
    const nuevaLinea = this.gestionCreditoForm.get('IdLinea')?.value;
    const nuevoNombreLinea = this.gestionCreditoForm.get('Linea')?.value;

    if (!nuevoNombreLinea || !nuevaLinea )  {
      this.notif.warning(
        'Advertencia',
        'Debe seleccionar una línea válida.',
        ConfiguracionNotificacion.configRightTop
      )
      return
    }

    if (this.lineaActual === nuevaLinea || this.nombreLineaActual === nuevoNombreLinea) {
      this.notif.warning(
        'Advertencia',
        'Debe cambiar línea.',
        ConfiguracionNotificacion.configRightTop
      )
      return
    }

    const dto: CambiarLineaCreditoDto = {
      idCredito: this.gestionCreditoForm.get('IdCuenta')?.value,
      nuevaLinea: this.gestionCreditoForm.get('IdLinea')?.value
    };
    this.loading.show()
    this.carteraService.cambiarLineaCredito(dto).pipe(
      finalize(() => this.loading.hide())
      ).subscribe({
      next: resp => this.procesarRespuestaLinea(resp),
      error: err => this.procesarErrorLinea(err),
    });
  }
  
  private procesarRespuestaLinea(resp: ResultadoOperacionDto,) {

    if (!resp || !resp.Exitoso) {
      this.procesarErrorLinea(resp);
      return;
    }

    const jsonLog = {
      Anterior: {
        id: this.lineaActual,
        linea: this.nombreLineaActual
      },
      Actualiza:{
        id: this.gestionCreditoForm.get('IdLinea')?.value,
        linea: this.gestionCreditoForm.get('Linea')?.value,
      } 
    }

    this.guardarLogGestionCredito(jsonLog);
    this.cargarLineasParaCambio();
    
    const controlLinea = this.gestionCreditoForm.get('IdLinea');
    const controlNombre = this.gestionCreditoForm.get('Linea');

    this.lineaActual = Number(controlLinea?.value);
    this.nombreLineaActual = controlNombre?.value

    controlLinea?.disable();
    controlNombre?.disable();

    this.mostrarBotonesActualizarLinea = false;
    this.campoLineaHabilitado = false;

    this.gestionCreditoOperacionForm.get('Codigo')?.reset();
    this.notif.success(
      'Exitoso',
      'El cambio de línea se realizó correctamente.',
      ConfiguracionNotificacion.configRightTop
    );
    this.cuotaTabBloqueado = false;
  } 

  private procesarRespuestaPagare(resp: ResultadoOperacionDto, nuevoPagare: number) {

    if (!resp || !resp.Exitoso) {
      this.errorActualizarPagare(resp);
      return;
    }

    const jsonLog = {
        Anterior: {
          pagare: this.pagareActual,
          tipo: this.tipoPagareActual,
        },
        Actualiza: {
          pagare: this.gestionCreditoForm.get('pagare')?.value,
          tipo: this.gestionCreditoForm.get('TipoPagare')?.value
        } 
    }

    this.guardarLogGestionCredito(jsonLog);

    this.pagareActual = nuevoPagare;
    const nuevoTipoId = Number(this.gestionCreditoForm.get('TipoPagare')?.value);
    this.tipoPagareInicial = nuevoTipoId;
    this.tipoPagareActual = nuevoTipoId;

    this.gestionCreditoForm.get('pagare')?.disable();
    this.gestionCreditoForm.get('TipoPagare')?.disable();

    this.mostrarBotonesActualizarPagare = false;
    this.campoPagareHabilitado = false;
    
    this.gestionCreditoOperacionForm.get('Codigo')?.reset();

    this.notif.success(
      'Exitoso',
      'El cambio del tipo y/o número de pagaré se realizó correctamente.',
      ConfiguracionNotificacion.configRightTop
    );
    this.cuotaTabBloqueado = false;
  } 

  private errorActualizarPagare(resp: ResultadoOperacionDto) {
    this.notif.warning(
      'Advertencia',
      resp?.Mensaje ?? 'El cambio del tipo y/o número de pagaré no se realizó correctamente.',
      ConfiguracionNotificacion.configRightTop
    );
    this.cuotaTabBloqueado = false;
  }

  private procesarErrorLinea(resp: ResultadoOperacionDto){
    this.notif.warning(
      'Advertencia',
      resp?.Mensaje ?? 'El cambio de línea no se realizó correctamente.',
      ConfiguracionNotificacion.configRightTop
    );
    this.cuotaTabBloqueado = false;
  }

  guardarLogGestionCredito(jsonDto: any, codigoOperacion?: string) {
    const formValue = this.gestionCreditoForm.getRawValue();
    const operacion = codigoOperacion ?? this.gestionCreditoOperacionForm.get('Codigo')?.value;
    if (!operacion) {
      return;
    }
    
    this.loading.show();
    this.generalesService.LogGestionCredito({
      idOperacion: operacion,
      idModulo: this.codModulo,
      jsonDto: jsonDto,
    
      idCuenta: formValue.IdCuenta,
      idTercero: formValue.IdTercero,
    
      idObsCambioEstado: formValue.IdObseCambioEstado?.toString() ?? null,
    }).pipe(finalize( () => this.loading.hide() )).subscribe({
      next: (resp) => {
        if (!resp.Exitoso) {
          this.notif.error(
            'Error',
            resp.Mensaje,
            ConfiguracionNotificacion.configRightTop
          );
        } else {
          this.getHistorial();
        }
      },
      error: () => {
        this.notif.error(
          'Error',
          'Error al registrar el log.',
          ConfiguracionNotificacion.configRightTop
        );
      }
    });
  }

  // TABS
  devolverTab(tab: Tabs): void {
    this.tabActivo = tab;
  }

  resetEstadoCargaTabs() {
    for (const key of Object.keys(this.estadoCargaTabs) as Array<keyof typeof this.estadoCargaTabs>) {
      this.estadoCargaTabs[key] = false;

    }
  }

  resetFilasSeleccionadas() {
    this.selectedRows = {
      codeudores: null,
      reales: null,
      deducibles: null,
      provisiones: null,
      refPersonales: null,
      refComerciales: null
    }
  }

  resetTabs() {
    this.resetEstadoCargaTabs();
    this.tabActivo = Tabs.Datos;
    this.resetTabGarantias();
    this.deducibles = [];
    this.provisiones = [];
    this.resetTabReferencias();
    this.resetTabHistorial();

    this.resetFilasSeleccionadas();
    this.DatosForm.reset();
    this.SaldosForm.reset();
    this.CobrosForm.reset();
    this.CuotaForm.reset();
    this.carteraInfo = new DetalleCartera();
    this.lstCalificacion = [];
    this.lstAnalisisCalificacion = [];
    this.lstReestructuracion = [];
    this.lstReliquidacion = [];
    this.cupoForm.reset();
    this.lstCalcularCuota = [];
    this.bloquearConsultaCuenta = true;
    this._datoCuota = true; 
    this._datoCuotaCalcular = true;
    this.isCuota = false;
    this.isCancelacion = false;
    this._datoCostasJudiciales = true;
     this.lstSimularPago = [];
    
  }

  CambiarColor(fil: any, producto: any) {
    if (producto === 1) {
      $(".ahoCumpli_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".ahoCumpli_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior = fil;
    }
    if (producto === 2) {
      $(".ahoCalid_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".ahoCalid_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior = fil;
    }
    if (producto === 3) {
      $(".filRes_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filRes_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior = fil;
    }
    if (producto === 4) {
      $(".filRel_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filRel_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior = fil;
    }
    if (producto === 5) {
      $(".filCuota_" + this.ColorAnterior).css("background", "#FFFFFF");
      $(".filCuota_" + fil).css("background", "#e5e5e5");
      this.ColorAnterior = fil;
    }
  }
  //DATOS
  Cambiavistatasas() {
    if (this.ValidaPactado) {
      this.ValidaPactado = false;
    } else {
      this.ValidaPactado = true;
    }
  }

  async BuscarDatosCartera(IdCuenta: number) {
    try {
      const result = await firstValueFrom(
        this.carteraService.getDatosCartera(IdCuenta)
      );

      this.DatosForm.get('Sistema')?.setValue(result.Sistema);
      this.DatosForm.get('IdSistema')?.setValue(result.IdSistema);
      this.DatosForm.get('PeriodoCapital')?.setValue(result.PeriodoCapital);
      this.DatosForm.get('PeriodoInteres')?.setValue(result.PeriodoInteres);
      this.DatosForm.get('Plazo')?.setValue(result.Plazo);
      this.DatosForm.get('Garantia')?.setValue(result.Garantia);
      this.DatosForm.get('TipoGarantia')?.setValue(result.TipoGarantia);
      this.carteraInfo.Monto = result.Monto;
      this.carteraInfo.Cuota = result.Cuota;
      this.carteraInfo.CuotaLibranza = result.CuotaLibranza;
      this.DatosForm.get('PeriodoGracia')?.setValue(result.PeriodoGracia);
      this.DatosForm.get('DescripcionAlivio')?.setValue(result.DescripcionAlivio);
      this.DatosForm.get('FormaPago')?.setValue(result.FormaPago);
      this.DatosForm.get('EstadoDatos')?.setValue(result.Estado);
      this.DatosForm.get('TasaPeriodicaL')?.setValue(result.TasaPeriodicaL);
      this.DatosForm.get('TasaLiquidada')?.setValue(result.TasaLiquidada);
      this.DatosForm.get('EfectivaLiquidada')?.setValue(result.TasaEfectivaL);
      this.DatosForm.get('TasaPeriodicaP')?.setValue(result.TasaPeriodicaP);
      this.DatosForm.get('TasaPactada')?.setValue(result.TasaPactada);
      this.DatosForm.get('EfectivaPactada')?.setValue(result.TasaEfectivaP);
      this.DatosForm.get('Indicador')?.setValue(result.Indicador);
      this.DatosForm.get('SiglaIndicador')?.setValue(result.SiglaIndicador);
      this.DatosForm.get('Puntos')?.setValue(result.Puntos);
      this.DatosForm.get('IdPeriodoInteres')?.setValue(result.IdPeriodoInteres);
      this.DatosForm.get('IdPeriodoCapital')?.setValue(result.IdPeriodoCapital);
      this.DatosForm.get('Formula')?.setValue(result.Formula);

    } catch (error) {
      const errorMessage = <any>error;
      console.log(errorMessage);
    }
  }
  // FIN DATOS

  // SALDOS
  onSaldosTabClick() {
    this.onTabChange(Tabs.Saldos, () => this.BuscarSaldosCartera());
  }

  async BuscarSaldosCartera() {
    const IdCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    if (!IdCuenta) return;

    this.loading.show();
    try {
      const result = await firstValueFrom(
        this.carteraService.getSaldosCartera(IdCuenta)
      );

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

      this.SaldosForm.get('CuotasPagas')?.setValue(result.CuotasPagas);
      this.SaldosForm.get('CuotasPendientes')?.setValue(result.CuotasPendientes);
      this.SaldosForm.get('CuotasMora')?.setValue(result.CuotasMora);

      this.ActivarCalcularCuota();

    } catch (error) {
      const errorMessage = <any>error;
      console.log(errorMessage);
    } finally {
      this.loading.hide();
    }
  }
// FIN SALDOS

// CALCULAR CUOTA

getFormaPagoSeleccionada() {
  const id = this.gestionCreditoForm.get('IdFormaPago')?.value;
  return this.resultFormasPago?.find(f => f.IdFormaPago === id);
}

ObtenerDebitoAutomatico() {
  const IdCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    this.carteraService.getDebito(IdCuenta).subscribe(
      result => {
          this.resultDebito = Array.isArray(result) ? result : [result];
          this.ModalDebitoAutomatico.nativeElement.click();   
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
}

isCuotaTabInitialized = false;
onCuotaTabClick() {
  this.onTabChange(Tabs.ValorCuota, () => {

    if (!this.isCuotaTabInitialized) {

      //Estado de checkboxes
      this.option = 1;
      this.isCuota = true;
      this.isCancelacion = false;

      // Lógica que marca visualmente el checkbox
      this.onCheckboxChange(1, true);

      //Inicializa campo de número de cuota
      const numeroCuotaCtrl = this.CuotaForm.get('NumeroCuota');
      numeroCuotaCtrl?.enable();
      numeroCuotaCtrl?.setValue(1);

      //Limpiar resultados previos
      this.lstCalcularCuota = [];
      this._datoCuota = false;
      this._datoCuotaCalcular = false;
      this._datoCostasJudiciales = true;

      // Marcar como inicializado
      this.isCuotaTabInitialized = true;
    }

    // Esto siempre se ejecuta al entrar al tab
    this.BuscarSaldosCartera();
    this.ActivarCalcularCuota();
  });
}
puedeCalcular(): boolean { 
  if (this.option === 1) {
    const numeroCuota = this.CuotaForm.get('NumeroCuota')?.value;
    return numeroCuota && numeroCuota > 0;
  }
  if (this.option === 2) {
    return true;
  }
  return false;
}

onCuotaCheck() {
  this.lstCalcularCuota = [];
  this._datoCuota = false;
  this._datoCuotaCalcular = false;

  this.onCheckboxChange(1, true);

  this.CuotaForm.get('NumeroCuota')?.enable();
  this.CuotaForm.get('NumeroCuota')?.setValue(1);

  this._datoCostasJudiciales = true;
}

onCancelacionCheck() {
  this.lstCalcularCuota = [];
  this._datoCuota = true;
  this._datoCuotaCalcular = false;
  this.onCheckboxChange(2, true);
}

onCheckboxChange(option: number, checked: boolean) {
    if (option === 1) {
      this.isCuota = checked;
      this.option = 1;
      if (checked) this.isCancelacion = false;
    } else if (option === 2) {
      this.isCancelacion = checked;
      if (checked) this.isCuota = false;
      this.option = 2;
    }
}

soloNumeros(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

ValidarNumeroCuota() {
    // 2-valida que numero cutoas no sea mayor a cuotas pendientes
    const NumeroCuota = +this.CuotaForm.get('NumeroCuota')?.value;
    const CuotasPediente = this.SaldosForm.get('CuotasPendientes')?.value;
    if (NumeroCuota > CuotasPediente) {
      this.notif.warning('Advertencia', 'El número de cuota debe ser menor que las cuotas pendientes.', ConfiguracionNotificacion.configRightTop);
      this.CuotaForm.get('NumeroCuota')?.reset();
    }
     // 4- Valida sistema
    const SistemaTres = TipoSistemas.CuotaFijaTasaVariable;
    const SistemaCuatro = TipoSistemas.CuotaVariableTasaVariable;
    let intSistema = this.DatosForm.get('IdSistema')?.value;
    let intNroCuotas = +this.CuotaForm.get('NumeroCuota')?.value;
    let intCuotasMora = this.SaldosForm.get('CuotasMora')?.value;

    if (intSistema === SistemaTres || intSistema === SistemaCuatro) {
      if (intNroCuotas > intCuotasMora + 1) {
        intNroCuotas = intCuotasMora + 1;
         this.notif.warning('Advertencia', 'Número de cuotas no valido para este crédito.', ConfiguracionNotificacion.configRightTop);
         this.CuotaForm.get('NumeroCuota')?.reset();
          this.lstCalcularCuota = [];
      }
    }
}

ActivarCalcularCuota() {
    // 1-valida que credito no sea un cupo para poder activar los campos
    const isCupo = this.gestionCreditoForm.get('Sigla')?.value;
    if (isCupo !== 'CTD') {
      this.BloquearCalcularCuota = false;
      this.CuotaForm.get('EfectivoSimularPago')?.enable();

      const isEstadoCancelado = this.gestionCreditoForm.get('IdEstadoCuenta')?.value;
      const bloquearPorEstado = [25, 26].includes(isEstadoCancelado);
      
      this.BloquearCalcularCuota = bloquearPorEstado;
        if (bloquearPorEstado) {
        this.CuotaForm.get('EfectivoSimularPago')?.disable();
        } else {
        this.CuotaForm.get('EfectivoSimularPago')?.enable();
        }

    } else {
      this.BloquearCalcularCuota = true;
      this.CuotaForm.get('EfectivoSimularPago')?.disable();
    }
}

CalcularCuota() {
    // 3-Declara variables
    let intNroCuotas = +this.CuotaForm.get('NumeroCuota')?.value;
    if (this.option === 1 && (!intNroCuotas || intNroCuotas <= 0)) {
    this.notif.warning(
      'Advertencia',
      'Debe ingresar número de cuotas.',
      ConfiguracionNotificacion.configRightTop
    );
    return;
    }

    const IdCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    const NumeroCuotas = this.CuotaForm.get('NumeroCuota')?.value;

    this.lstCalcularCuota = [];
    this.totalCapital = 0;
    this.totalInteres = 0;
    this.totalInteresMora = 0;
    this.totalDeducibles = 0;
    this.CostasJudiciales = 0;
    this.total = 0;
   
    if (this.option === 1) {
      // 5-Calcular cuota sin y con mora
      if (intNroCuotas !== 0) {
        this.carteraService.CalcularCuota(IdCuenta, NumeroCuotas).subscribe(
          result => {
            this.lstCalcularCuota = result;

            for (let item of this.lstCalcularCuota) {
              this.totalCapital += item.Capital || 0;
              this.totalInteres += item.Intereses || 0;
              this.totalInteresMora += item.Mora || 0;
              this.totalDeducibles += item.TotalDeducibles || 0;
              this.total += item.TotalCuota || 0;
            }
          },
          error => {
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      } else {
        this.notif.warning('Advertencia', 'Debe ingresar número de cuotas.', ConfiguracionNotificacion.configRightTop);
      }


    } else {
      // 5-Calcular cancelacion total de credito
      this.carteraService.CalcularCuotaCancelacion(IdCuenta).subscribe(
        result => {
          const isEstadoCancelado = this.gestionCreditoForm.get('IdEstadoCuenta')?.value;
          if (isEstadoCancelado == 1) {
            this._datoCostasJudiciales = false;
          } else {
            this._datoCostasJudiciales = true;
          }
          this.lstCalcularCuota = result;

          for (let item of this.lstCalcularCuota) {
            this.totalCapital += item.Capital || 0;
            this.totalInteres += item.Intereses || 0;
            this.totalInteresMora += item.Mora || 0;
            this.totalDeducibles += item.TotalDeducibles || 0;
            this.CostasJudiciales += item.CostasJudiciales || 0;
            this.total += item.TotalCuota || 0;
          }
        },
        error => {
          const errorMessage = <any>error;
          console.log(errorMessage);
        }
      );

    }

}

// FIN CALCULAR CUTOTA
  
// SIMULLAR PAGO 

CalcularSimularPago(){
    this.lstSimularPago = [];
    const IdCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    const valorIngresado = this.CuotaForm.get('EfectivoSimularPago')?.value;
    const valorSaldo =  this.carteraInfo.SaldoDeuda;
    // valida que saldo ingresado no  sea mayor que el saldo de la deuda
    if(+valorSaldo < +valorIngresado){
        this.notif.warning('Advertencia', 'Valor ingresado no valido.', ConfiguracionNotificacion.configRightTop);
        this.CuotaForm.get('EfectivoSimularPago')?.reset();
          this.lstSimularPago = [];
          return;
    } 
     if (valorIngresado !== 0) {
        this.carteraService.SimularPago(IdCuenta, valorIngresado).subscribe(
          result => {
            this.lstSimularPago = result;
          },
          error => {
            const errorMessage = <any>error;
            console.log(errorMessage);
          }
        );
      } else {
        this.notif.warning('Advertencia', 'Debe ingresar efectivo.', ConfiguracionNotificacion.configRightTop);
      }



}

// FIN SIMULAR PAGO 

// GARANTIAS

  onGarantiasTabClick() {
    this.onTabChange(Tabs.Garantias, () => this.getGarantias());
  }

  onTabChange(tab: Tabs, callback?: () => void) {
    this.tabActivo = tab;

    if (!this.estadoCargaTabs[tab]) {
      callback?.();
      this.estadoCargaTabs[tab] = true;
    }

  }

  async getGarantias(): Promise<void> {
    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    if (!idCuenta) return;

    this.loading.show();

    try {
      const garantiasData = await firstValueFrom(
        this.carteraService.getGarantias(idCuenta)
      );

      if (garantiasData) {
        const { lstCodeudores, lstGarantiaReal } = garantiasData;
        this.garantiasPersonalesCod = lstCodeudores ?? [];
        this.garantiasReales = lstGarantiaReal ?? []
      }
    } finally {
      this.loading.hide();
    }
  }

  resetTabGarantias() {
    this.garantiasPersonalesCod = [];
    this.garantiasReales = [];
  }

  // FIN GARANTIAS

  //DIFERIDOS
  onDeduciblesTabClick() {
    this.onTabChange(Tabs.Deducibles, () => this.getDeducibles());
  }

  getDeducibles() {
    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    if (!idCuenta) return;

    this.loading.show();
    this.carteraService.getDeducibles(this.gestionCreditoForm.get('IdCuenta')?.value).pipe(
      catchError(error => {
        console.error('Error al obtener deducibles:', error);
        this.notif.error('Error', 'Error al obtener deducibles.', ConfiguracionNotificacion.configRightTop);
        return of(null);
      })
    ).subscribe(
      deduciblesData => {
        this.loading.hide();
        if (!deduciblesData) {
          return;
        }

        this.deducibles = deduciblesData;
        this.saldoDeducibleTotal = deduciblesData.reduce((acc, value) => acc + value.SaldoDeducible, 0);
        this.valorCuotaTotal = deduciblesData.reduce((acc, value) => acc + value.ValorCuota, 0);
        this.saldoInicialDeducibleTotal = deduciblesData.reduce((acc, value) => acc + value.SaldoInicialDeducible, 0);
        this.cuotaPactadaTotal = deduciblesData.reduce((acc, value) => acc + value.CuotaPactada, 0);
        this.valorPagadoTotal = deduciblesData.reduce((acc, value) => acc + value.ValorPagado, 0);

      }
    );
  }

  //FIN DIFERIDOS

  //CALIFICACION

  onCalificacionTabClick() {
    this.onTabChange(Tabs.Calificacion, () => this.BuscarCalificacion());
  }

  BuscarCalificacion() {
    const IdCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    if (!IdCuenta) return;
    this.carteraService.getCalificacionCartera(IdCuenta).subscribe(
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
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    )
  }
  // FIN CALIFICACION


  //PROVISION

  onProvisionTabClick() {
    this.onTabChange(Tabs.Provision, () => this.getProvisiones());
  }
  getProvisiones() {
    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    if (!idCuenta) return;

    this.loading.show();
    this.carteraService.getProvisiones(this.gestionCreditoForm.get('IdCuenta')?.value).pipe(
      catchError(error => {
        console.error('Error al obtener provisiones:', error);
        this.notif.error('Error', 'Error al obtener provisiones.', ConfiguracionNotificacion.configRightTop);
        return of(null);
      })
    ).subscribe(
      provisionesData => {
        this.loading.hide();
        if (!provisionesData) {
          return;
        }

        this.provisiones = provisionesData;
      }
    );
  }

  //FIN PROVISION

  // COBROS

  onCobrosTabClick() {
    this.onTabChange(Tabs.Cobros, () => this.BuscarCobrosCartera());
  }

  BuscarCobrosCartera() {
    const IdCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    if (!IdCuenta) return;
    this.carteraService.getCobrosCartera(IdCuenta).subscribe(
      result => {
        if (result.Prejuridicos !== null) {
          this.CobrosForm.get('CuotasMoraPre')?.setValue(result.Prejuridicos.CoutasMora);
          this.CobrosForm.get('VecesPre')?.setValue(result.Prejuridicos.Veces);
          this.carteraInfo.SaldoCapitalPre = result.Prejuridicos.SaldoCapital;
          this.CobrosForm.get('FechaMatriculaPre')?.setValue(result.Prejuridicos.FechaMatricula);
          this.CobrosForm.get('FechaRetiroPre')?.setValue(result.Prejuridicos.FechaRetiro);
        } else {
          this.carteraInfo.SaldoCapitalPre = 0;
        }
        if (result.Juridicos !== null) {
          this.CobrosForm.get('EstadoJuridico')?.setValue(result.Juridicos.Estado);
          this.CobrosForm.get('Abogado')?.setValue(result.Juridicos.Abogado);
          this.carteraInfo.SaldoJuridico = result.Juridicos.Saldo;
          this.carteraInfo.CostasJudiciales = result.Juridicos.CostasJudiciales;
          this.CobrosForm.get('CuotasMoraJuridico')?.setValue(result.Juridicos.CoutasMora);
          this.CobrosForm.get('VecesJuridico')?.setValue(result.Juridicos.Veces);
          this.CobrosForm.get('FechaMatriculaJuridico')?.setValue(result.Juridicos.FechaMatricula);
          this.CobrosForm.get('FechaRetiroJuridico')?.setValue(result.Juridicos.FechaRetiro);//
          this.CobrosForm.get('NumNombreJuzgado')?.setValue(result.Juridicos.Juzgado);
        } else {
          this.carteraInfo.SaldoJuridico = 0;
          this.carteraInfo.CostasJudiciales = 0;
        }
        if (result.Castigos !== null) {
          this.carteraInfo.IntMoraCastigo = result.Castigos.IntMora;
          this.carteraInfo.CorrientesCatigo = result.Castigos.Corrientes;
          this.carteraInfo.SaldoCapitalCastigo = result.Castigos.SaldoCapital;
          this.carteraInfo.CostasJudicialesCastigo = result.Castigos.CostasJudiciales;
          this.CobrosForm.get('FechaCastigo')?.setValue(result.Castigos.FechaCastigo);
        } else {
          this.carteraInfo.IntMoraCastigo = 0;
          this.carteraInfo.CorrientesCatigo = 0;
          this.carteraInfo.SaldoCapitalCastigo = 0;
          this.carteraInfo.CostasJudicialesCastigo = 0;
        }
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    )
  }

  // FIN COBROS


  // TAB CAMBIOS
  onCambiosTabClick() {
    this.onTabChange(Tabs.Cambios, () => this.buscarReestructuracionReliquidacion());
  }
  async buscarReestructuracionReliquidacion(): Promise<void> {
    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    if (!idCuenta) return;
    this.loading.show();
    try {
      this.cargarHistoricoInsolvencia();
      const result = await firstValueFrom(
        this.carteraService.getReestructuracionReliquidacion(idCuenta)
      );

      this.lstReestructuracion = result.Reestructuracion ?? [];
      this.lstReliquidacion = result.Reliquidacion ?? [];

      this.lstReestructuracion.sort((a, b) =>
        new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
      );

      this.lstReliquidacion.sort((a, b) =>
        new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
      );

    } catch (error) {
      console.error('Error al obtener reestructuración/reliquidación', error);
    } finally {
      this.loading.hide();
    }
  }
  // FIN CAMBIOS

  //REFERENCIAS
  onReferenciasTabClick() {
    this.onTabChange(Tabs.Referencias, () => this.getReferencias());
  }

  getReferencias() {
    const idTercero = this.gestionCreditoForm.get('IdTercero')?.value;
    if (!idTercero) return;
    this.loading.show();

    this.miListaProductosService.GetReferenciasCartera(idTercero, this.gestionCreditoForm.get('TipoCliente')?.value).pipe(
      catchError(error => {
        console.error('Error al obtener referencias:', error);
        return of(null);
      })
    ).subscribe(
      (result: Referencia[] | null) => {
        this.loading.hide();
        if (!result) {
          return;
        }
        this.refPersonales = result.filter(ref => [2, 4].includes(ref.TipoReferencia));
        this.refComcerciales = result.filter(ref => [1, 3].includes(ref.TipoReferencia));
      }
    );
  }

  resetTabReferencias() {
    this.refPersonales = [];
    this.refComcerciales = [];
  }
  //FIN REFERENCIAS


  //HISTORIAL
  onHistorialTabClick() {
    this.onTabChange(Tabs.Historial, () => this.getHistorial());
  }

  async getHistorial(): Promise<void> {
    const { IdCuenta, IdProductoCuenta } = this.gestionCreditoForm.value;
    if(!IdCuenta) return;
    this.loading.show();

    try {
      const { fechas, historialOperaciones } = await firstValueFrom(
        forkJoin({
          fechas: this.miListaProductosService.getFechasCartera(IdCuenta).pipe(
            catchError(error => {
              console.error('Error al obtener fechas:', error);
              return of(null);
            })
          ),
          historialOperaciones: this.carteraService.getHistorial(IdCuenta, IdProductoCuenta).pipe(
            catchError(error => {
              console.error('Error al obtener historial operaciones:', error);
              return of(null);
            })
          )
        })
      );

      if (fechas) {
        this.gestionCreditoForm.patchValue({
          fechaApertura: fechas.Apertura,
          fechaUltimaTrans: fechas.UltTransaccion,
          fechaCancelacion: fechas.Cancelacion,
          fechaVencimiento: fechas.Vencimiento,
          cambioFechaPago: fechas.CambioFechaPago,
          fechaProximoPago: fechas.ProximoPago,
          fechaContingencia: fechas.Contingencia,
          fechaInicioPeriodoGracia: fechas.InicioPeriodoGracia,
          fechaCambioTasa: fechas.CambioTasa
        });
      }

      if (historialOperaciones) {
        const DEFAULT_OPERACION = 0;
        this.historial = historialOperaciones.map(registroHist => {
          const formateador =
            formateadoresPorOperacion[registroHist.Operacion] ??
            formateadoresPorOperacion[DEFAULT_OPERACION];

          return formateador(registroHist);
        });
      }

    } finally {
      this.loading.hide();
    }
  }

  resetTabHistorial() {
    this.historial = [];
    this.gestionCreditoForm.get('fechaApertura')?.reset();
    this.gestionCreditoForm.get('fechaUltimaTrans')?.reset();
    this.gestionCreditoForm.get('fechaCancelacion')?.reset();
    this.gestionCreditoForm.get('fechaVencimiento')?.reset();
    this.gestionCreditoForm.get('cambioFechaPago')?.reset();
    this.gestionCreditoForm.get('fechaProximoPago')?.reset();
    this.gestionCreditoForm.get('fechaContingencia')?.reset();
    this.gestionCreditoForm.get('fechaInicioPeriodoGracia')?.reset();
    this.gestionCreditoForm.get('fechaCambioTasa')?.reset();
  }
  //FIN HISTORIAL

  // FIN TABS


  onClickRadicado() {
    const idTercero = this.gestionCreditoForm.get('IdTercero')?.value;
    const radicado = this.gestionCreditoForm.get('Radicado')?.value;
    const numeroDocumento = this.gestionCreditoForm.get('NumeroDocumento')?.value;
    const origen = 'RADICADO';
    if (!idTercero || !radicado) return;

    this.loading.show();
    forkJoin({
      detalleRadicado: this.miListaProductosService.GetDetalleRadicados(radicado, this.gestionCreditoForm.get('TipoCliente')?.value, origen).pipe(
        catchError(error => {
          console.error('Error al obtener detalle del radicado:', error);
          return of(null);
        })
      ),
      encabezadoMiLista: this.miListaProductosService.ObtenerEncabezado(numeroDocumento).pipe(
        catchError(error => {
          console.error('Error al obtener encabezado MiLista:', error);
          return of(null);
        })
      )
    }).subscribe(({ detalleRadicado, encabezadoMiLista }) => {
      this.loading.hide();
      if (detalleRadicado && this.encabezadoRadicado) {
        this.encabezadoRadicado.apertura = this.encabezadoRadicado.Apertura;
        this.encabezadoRadicado.cancelacion = this.encabezadoRadicado.Cancelacion;
        this.encabezadoRadicado.AsesorExterno = this.encabezadoRadicado.asesorExterno;
        if (encabezadoMiLista) this.encabezadoRadicado.Telefono = encabezadoMiLista.Celular;

        this.detalleRadicado = {
          encabezadoRadicado: this.encabezadoRadicado,
          negociacionRadicado: detalleRadicado.Negociacion,
          saldoCancelar: detalleRadicado.SaldoCancelar,
          decisionRadicado: detalleRadicado.Decision,
          deducibles: detalleRadicado.Deducibles,
          saldoVigenteRadicado: detalleRadicado.SaldosVigentes,
          codeudoresRadicado: detalleRadicado.codeudoresRadicado,
          referenciaRadicado: detalleRadicado.referencias,
          observaciones: detalleRadicado.Observaciones,
          tipoCliente: this.gestionCreditoForm.get('TipoCliente')?.value
        }
        this.detalleRadicado.negociacionRadicado.ValorDiferido = detalleRadicado.ValorDiferido;
        this.detalleRadicado.negociacionRadicado.ValorMensualDiferido = detalleRadicado.ValorMensualDiferido;
        this.detalleRadicado.negociacionRadicado.ValorMensualDiferido = detalleRadicado.ValorMensualDiferido;
        this.abrirModalDetalleRadicado.nativeElement.click();
      }
    });
  }

  onCupoTabClick() {
    this.onTabChange(Tabs.Cupo, () => this.getCupos());
  }

  getCupos() {
    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    const manejoCupo = this.gestionCreditoForm.get('ManejoCupo')?.value;
    if (!idCuenta || manejoCupo === false) return;
    this.loading.show();

    this.carteraService.getCuposInfo(idCuenta).pipe(
      catchError(error => {
        console.error('Error al obtener cupos info:', error);
        return of(null);
      })
    ).subscribe(
      (result) => {
        this.loading.hide();
        if (!result) {
          return;
        }

        this.cupoForm.get('numeroCupo')?.setValue(result.NumeroCupo);
        this.cupoForm.get('cupoAprobado')?.setValue(result.CupoAprobado);
        this.cupoForm.get('cupoDisponible')?.setValue(result.CupoDisponible);
        this.cupoForm.get('cupoUtilizado')?.setValue(result.CupoUtilizado);
        this.cupoForm.get('fechaMatricula')?.setValue(result.DtmMatricula);
        this.cupoForm.get('fechaAprobacion')?.setValue(result.DtmAprobacionCupo);
        this.cupoForm.get('fechaActualizacion')?.setValue(result.DtmActualizacion);
        this.cupoForm.get('fechaVencimiento')?.setValue(result.DtmVencimiento);
        this.cupoForm.get('fechaRetiro')?.setValue(result.DtmRetiro);
        this.cupoForm.get('fechaDocumentacion')?.setValue(result.DtmDocumentacion);
        this.cupoForm.get('diaMaxMora')?.setValue(result.DiaMaxMora);
        this.cupoForm.get('maxCuotaMora')?.setValue(result.MaxCuotaMora);
        this.cupoForm.get('bloqueos')?.setValue(result.Bloqueos);

        if (result.DtmRetiro) {
          this.cupoForm.get('cupoAprobado')?.setValue(0);
        }

      }
    );
  }

  generarPDFPlanDePagos() {
    this.loading.show();
    this.carteraService.getPDFPlanDePagos(this.gestionCreditoForm.get('IdCuenta')?.value).pipe(
      catchError(error => {
        console.error('Error al generar plan de pagos PDF:', error);
        return of(null);
      })
    ).subscribe(
      (blob) => {
        this.gestionCreditoOperacionForm.get('Codigo')?.reset();
        this.loading.hide();
        this.blobUrlPlanDePagoPDF = window.URL.createObjectURL(blob);
        this.planDePagosPdf.nativeElement.setAttribute('src', this.blobUrlPlanDePagoPDF);
        this.openModalPlanDePagos.nativeElement.click();
      }
    );

  }

  descargarPlanDePagos() {
    const fileName = this.gestionCreditoForm.get('CodigoCuentaFormateado')?.value;
    const a = document.createElement('a');
    a.href = this.blobUrlPlanDePagoPDF;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(this.blobUrlPlanDePagoPDF);
  }

  onBlurDocumentoDeudor() {
    const documentoABuscar = this.codeudorForm.get('documento')?.value?.trim();
    const documentoDeudor = this.gestionCreditoForm.get('NumeroDocumento')?.value?.trim();
    if (documentoABuscar === documentoDeudor) {
      this.notif.warning('Advertencia', 'Deudor no puede ser agregado como codeudor.', ConfiguracionNotificacion.configRightTop);
      this.codeudorForm.reset();
      return;
    }

    const yaEsCodeudor = this.codeudoresDraft.some(cod => cod.documento == documentoABuscar);
    if(yaEsCodeudor) {
      this.codeudorForm.reset();
      this.notif.warning('Advertencia', 'No se pueden agregar codeudores duplicados.', ConfiguracionNotificacion.configRightTop);
      return;
    }

    if (!this.codeudorForm.get('documento')?.valid || !documentoABuscar || !documentoDeudor) return;

    this.loading.show();
    this.carteraService.getPersonaNaturalValidaComoCodeudor(documentoABuscar, documentoDeudor).subscribe({
      next: (personaNatural) => {
        this.loading.hide();
        const fechaActualizacion: Date = new Date(personaNatural?.FechaMod);
        const hoy: Date = new Date();
        const meses: number = diferenciaEnMeses(fechaActualizacion, hoy);
        if (meses >= 6) {
          this.notif.warning('Advertencia', 'Asociado no se ha actualizado en los últimos 6 meses.', ConfiguracionNotificacion.configRightTop);
          this.codeudorForm.reset();
          return;
        }

        this.codeudorForm.get('documento')?.setValue(personaNatural.NumeroDocumento);
        this.codeudorForm.get('nombre')?.setValue(personaNatural.NombreCompleto);
        this.codeudorForm.get('idTercero')?.setValue(personaNatural.IdTercero);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
        this.loading.hide();
        if (error.status === 404) {
          this.notif.warning('Advertencia', 'No se encontró registro.', ConfiguracionNotificacion.configRightTop);
          this.codeudorForm.reset();
          return;
        }

        const errorCode = error.error?.ErrorCode as ErrorCode;
        if (ERROR_MESSAGES[errorCode]) {
          this.notif.warning('Advertencia', ERROR_MESSAGES[errorCode], ConfiguracionNotificacion.configRightTop);
          this.codeudorForm.reset();
          return;
        }

        this.notif.error('Error', 'Error inesperado.', ConfiguracionNotificacion.configRightTop);
      }
    });

  }

  onChangeDocumentoCodeudor() {
    this.codeudorForm.get('nombre')?.reset();
  }

  onClickAgregarCodeudor() {
    if(!this.codeudorForm.get('documento')?.valid) return;

    const documento = this.codeudorForm.get('documento')?.value?.trim();
    const yaEsCodeudor = this.codeudoresDraft.some(cod => cod.documento == documento);
    if(yaEsCodeudor) {
      this.notif.warning('Advertencia', 'No se pueden agregar codeudores duplicados.', ConfiguracionNotificacion.configRightTop);
      return;
    }

    const nuevoCodeudor: CodeudorDraft = {
      idTercero: this.codeudorForm.get('idTercero')?.value,
      nombreCompleto: this.codeudorForm.get('nombre')?.value?.trim(),
      documento 
    };
    
    this.codeudoresDraft = [...this.codeudoresDraft, nuevoCodeudor];
    this.codeudorForm.reset();
    this.isDisabledConfirmarButton = false;
  }
  
  onClickEliminarCodeudor(idTercero: number) {
    if(this.garantiasPersonalesCod.length && this.codeudoresDraft.length === 1) {
      this.notif.warning('Advertencia', 'Debe tener al menos un codeudor.', ConfiguracionNotificacion.configRightTop);
      return;
    }

    this.codeudoresDraft = this.codeudoresDraft.filter(cod => cod.idTercero !== idTercero);
    this.isDisabledConfirmarButton = false;
  }

  onClickConfirmarCambiosCodeudor() {
    if(this.garantiasPersonalesCod.length === 0 && this.codeudoresDraft.length === 0) {
      this.openCambiarCodeudoresModal.nativeElement.click();
      this.gestionCreditoOperacionForm.get('Codigo')?.reset();
      this.codeudorForm.reset();
      this.isDisabledConfirmarButton = true;
      return;
    }

    const codeudoresIds = this.codeudoresDraft.map(cod => cod.idTercero);
    const idCuenta = this.gestionCreditoForm.get('IdCuenta')?.value;
    const pagare = this.gestionCreditoForm.get('pagare')?.value;
    if(!idCuenta || !pagare) return;
    this.loading.show();
    this.carteraService.actualizarCodeudores(codeudoresIds, idCuenta, pagare).pipe(
      catchError(error => {
        console.error('Error al actualizar codeudores:', error);
        return of(null);
      })
    ).subscribe(
      (result) => {
        this.loading.hide();
        if(result) {
          this.notif.success('Exitoso', 'El cambio de codeudores se realizó correctamente.', ConfiguracionNotificacion.configRightTop);

          const logCambios: LogCambiarCodeudores = {
            Anteriores: this.codeudoresAnteriores,
            Actuales: this.codeudoresDraft
          }
          this.guardarLogGestionCredito(logCambios);
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          this.getGarantias();
          this.tabActivo = Tabs.Garantias;
          this.resetEstadoCargaTabs();
          this.openCambiarCodeudoresModal.nativeElement.click();
          this.gestionCreditoOperacionForm.get('Codigo')?.reset();
          this.codeudorForm.reset();
          this.isDisabledConfirmarButton = true;
        }

      }
    );
  }

  onClickCerrarModalCodeudores() {
    this.codeudorForm.reset();
    this.gestionCreditoOperacionForm.get('Codigo')?.reset();
    this.isDisabledConfirmarButton = true;
    this.codeudoresDraft = this.garantiasPersonalesCod.map(codeudor => {

        const { IdTercero, NumeroDocumento, Nombres: n, PrimerApellido: pa, SegundoApellido: sa } = codeudor;
        return {
          idTercero: IdTercero,
          nombreCompleto: this.concatWithSpace(n, pa, sa),
          documento: NumeroDocumento
        }

      });
  }

  // Inicio Cambiar tasa

  creditoEsTasaVariable() {
    const idTipoSistema = this.DatosForm.get('IdSistema')?.value
    return idTipoSistema === TipoSistemas.CuotaFijaTasaVariable || idTipoSistema === TipoSistemas.CuotaVariableTasaVariable;
  }

  private sumarMeses(fecha: Date, meses: number): Date {
    const nueva = new Date(fecha);
    nueva.setMonth(nueva.getMonth() + meses);
    return nueva;
  }

  private alcanzaPeriodo(fechaVencimiento: Date, periodo: keyof typeof PERIODOS_MESES): boolean {
    const hoy = new Date();

    const dias = diferenciaEnDias(hoy, fechaVencimiento);
    if (dias < 30) return false;

    const meses = PERIODOS_MESES[periodo];
    const siguientePeriodo = this.sumarMeses(hoy, meses);
    return siguientePeriodo <= fechaVencimiento;
  }

  private validarPeriodos(fechaVencimiento: Date, idPeriodoInteres: keyof typeof PERIODOS_MESES, idPeriodoCapital: keyof typeof PERIODOS_MESES): boolean {
    return (
      this.alcanzaPeriodo(fechaVencimiento, idPeriodoInteres) &&
      this.alcanzaPeriodo(fechaVencimiento, idPeriodoCapital)
    );
  }

  private validarEdicionCreditoAlCambiarSistema(): string | null {
    if (this.creditoEsTasaVariable()) {
      return ERROR_MESSAGES.CREDITO_NO_CUMPLE;
    }

    return null;
  }


  private validarEdicionCredito(operacionId: Operacion): string | null {
    let data: string | null = localStorage.getItem('Data');
    const datosUsuario = JSON.parse(window.atob(data ?? ""));

    if (datosUsuario?.NumeroOficina != this.gestionCreditoForm.get('NumeroOficina')?.value) {
      return ERROR_MESSAGES.OTRA_OFICINA;
    }

    if(this.creditoEsTasaVariable() && !this.DatosForm.get('Indicador')?.value) {
      return 'El crédito no cumple con las condiciones.';
    }

    if (this.gestionCreditoForm.get('fechaCancelacion')?.value?.trim()) {
      return ERROR_MESSAGES.CUENTA_CANCELADA;
    }

    const fechaVencimiento = new Date(this.gestionCreditoForm.get('fechaVencimiento')?.value?.trim());
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (operacionId !== Operacion.ReestructurarCambioPlazo && fechaVencimiento < hoy) {
      return ERROR_MESSAGES.CUENTA_VENCIDA;
    }

    if (this.gestionCreditoForm.get('Sigla')?.value === 'CTD') {
      return ERROR_MESSAGES.CUPO_TARJETA_DEBITO;
    }

    const interesesAlDia = this.carteraInfo.InteresMora + this.carteraInfo.TotalInteres <= 0;
    if (!interesesAlDia) {
      return ERROR_MESSAGES.INTERESES_AL_DIA;
    }

    if (this.detalleCuenta.Encabezado.TasaLinea === null) {
      return ERROR_MESSAGES.TASA_USURA;
    }

    if (operacionId !== Operacion.CambiarSistema && operacionId !== Operacion.ReestructurarCambioPlazo) {
      const idPeriodoInteres = this.DatosForm.get('IdPeriodoInteres')?.value;
      const idPeriodoCapital = this.DatosForm.get('IdPeriodoCapital')?.value;
      const periodosValidosParaCambio = this.validarPeriodos(fechaVencimiento, idPeriodoInteres, idPeriodoCapital);
      if (!periodosValidosParaCambio) {
        return ERROR_MESSAGES.PERIODOS_NO_CUMPLEN;
      }
    }

    if (operacionId === Operacion.CambiarSistema) {
      const hoy = new Date();
      const dias = diferenciaEnDias(hoy, fechaVencimiento);
      if (dias < 30) return ERROR_MESSAGES.PERIODOS_NO_CUMPLEN;
    }

    if(operacionId !== Operacion.ReestructurarCambioPlazo) {
      this.lstReliquidacion
    }

    
    return null;
  }

  onCloseModalCambiosCredito() {
    this.estaAbiertoModalCambios = false;
    this.gestionCreditoOperacionForm.get('Codigo')?.reset();
  }

  private getDatosLogAlCambiarInfoCredito(): CambiarInfoCreditoLog {
    const pipe = new DecimalPipe('en-US');
    let TasaPeriodica = this.DatosForm.get('TasaPeriodicaL')?.value;
    if(TasaPeriodica != null) TasaPeriodica = pipe.transform(TasaPeriodica, '1.4-4') + ' %';
    let TasaEfectiva = this.DatosForm.get('EfectivaLiquidada')?.value;
    if(TasaEfectiva != null) TasaEfectiva = pipe.transform(TasaEfectiva, '1.4-4') + ' %';
    let TasaNominal = this.DatosForm.get('TasaLiquidada')?.value;
    if(TasaNominal != null) TasaNominal = pipe.transform(TasaNominal, '1.4-4') + ' %';
    let Puntos = this.DatosForm.get('Puntos')?.value;
    if(Puntos != null) Puntos = pipe.transform(Puntos, '1.4-4') + ' %';

    return {
      Sistema: this.DatosForm.get('Sistema')?.value,
      PeriodoCapital: this.DatosForm.get('PeriodoCapital')?.value,
      PeriodoInteres: this.DatosForm.get('PeriodoInteres')?.value,
      Plazo: this.DatosForm.get('Plazo')?.value,
      Monto: this.formatoCOP(this.carteraInfo.Monto),
      Cuota: this.formatoCOP(this.carteraInfo.Cuota),
      CuotaLibranza: this.formatoCOP(this.carteraInfo.CuotaLibranza),
      TasaPeriodica,
      TasaEfectiva,
      TasaNominal,
      Puntos,
      PeriodoGracia: this.DatosForm.get('PeriodoGracia')?.value,
      SaldoProyectado: this.formatoCOP(this.carteraInfo.SaldoProyectado),
      SaldoCapital: this.formatoCOP(this.carteraInfo.SaldoCapital),
      SaldoDeuda: this.formatoCOP(this.carteraInfo.SaldoDeuda),
      CuotasPagas: this.SaldosForm.get('CuotasPagas')?.value,
      CuotasPendientes: this.SaldosForm.get('CuotasPendientes')?.value,
      CuotasMora: this.SaldosForm.get('CuotasMora')?.value,
      FechaProximoPago: this.gestionCreditoForm.get('fechaProximoPago')?.value,
      FechaContingencia: this.gestionCreditoForm.get('fechaContingencia')?.value,
      FechaInicioPeriodoGracia: this.gestionCreditoForm.get('fechaInicioPeriodoGracia')?.value,
      FechaVencimiento: this.gestionCreditoForm.get('fechaVencimiento')?.value,
      FechaCambioTasa: this.gestionCreditoForm.get('fechaCambioTasa')?.value,
      FechaDePago: this.gestionCreditoForm.get('cambioFechaPago')?.value
    }
  }

  async onFinalizarActualizacionCredito({idNovedad, idOperacion}: { idNovedad: number; idOperacion: string }) {
    const Anterior = this.getDatosLogAlCambiarInfoCredito();
    await this.buscarCuentaDetalle(this.detalleCuenta.Encabezado.IdCuenta);
    await this.getHistorial();
    await this.BuscarSaldosCartera();
    const Actualiza = this.getDatosLogAlCambiarInfoCredito();
    let novedad = '';
    const TASAS_KEYS: (keyof CambiarInfoCreditoLog)[] = ['TasaEfectiva', 'TasaNominal', 'TasaPeriodica', 'Puntos', 'FechaCambioTasa'];
    const SISTEMA_KEYS: (keyof CambiarInfoCreditoLog)[] = ['Sistema', 'PeriodoCapital', 'PeriodoInteres'];

    if (idOperacion === Operacion.ReestructurarCambioPlazo) {
      const logCambiarPlazo = {
        Anterior: omit(Anterior, TASAS_KEYS),
        Actualiza: omit(Actualiza, TASAS_KEYS)
      };
      this.guardarLogGestionCredito(logCambiarPlazo, Operacion.ReestructurarCambioPlazo);
      novedad = 'La reestructuración';
    } else if (idNovedad === Novedad.CambiarTasa) {
      const logCambiarTasa = { Anterior: omit(Anterior, SISTEMA_KEYS), Actualiza: omit(Actualiza, SISTEMA_KEYS) };
      this.guardarLogGestionCredito(logCambiarTasa, Operacion.CambiarTasa);
      novedad = 'El cambio de tasa';

    } else if (idNovedad === Novedad.CambiarCuota) {
      const logCambiarCuota = {
        Anterior: omit(Anterior, TASAS_KEYS.concat(SISTEMA_KEYS)),
        Actualiza: omit(Actualiza, TASAS_KEYS.concat(SISTEMA_KEYS))
      };
      this.guardarLogGestionCredito(logCambiarCuota, Operacion.CambiarCuota);
      novedad = 'El cambio de la cuota';
    } else if (idNovedad === Novedad.CambiarPlazo) {
      const logCambiarPlazo = {
        Anterior: omit(Anterior, TASAS_KEYS),
        Actualiza: omit(Actualiza, TASAS_KEYS)
      };
      this.guardarLogGestionCredito(logCambiarPlazo, Operacion.CambiarPlazo);
      novedad = 'El cambio de plazo';
    } else if(idNovedad === Novedad.CambiarSistema) {
      const logCambiarSistema = {
        Anterior: omit(Anterior, TASAS_KEYS),
        Actualiza: omit(Actualiza, TASAS_KEYS)
      };
      this.guardarLogGestionCredito(logCambiarSistema, Operacion.CambiarSistema);
      novedad = 'El cambio de sistema';
    } else if (idNovedad === Novedad.DevolverReestructuracion) {
      const logDevolverReest = {
        Anterior: omit(Anterior, TASAS_KEYS),
        Actualiza: omit(Actualiza, TASAS_KEYS)
      };
      this.guardarLogGestionCredito(logDevolverReest, Operacion.DevolverReestructuracion);
      novedad = 'La devolución';
    }

    this.gestionCreditoOperacionForm.get('Codigo')?.reset();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    this.notif.success('Exitoso', `${novedad} se realizó correctamente.`, ConfiguracionNotificacion.configRightTop);
  }

  private buildCambiarInfoCreditoContext(): CambiarInfoCreditoContext {
    return {
      detalleCredito: {
        ...this.detalleCuenta,
        monto: this.carteraInfo.Monto,
        cuota: this.carteraInfo.Cuota,
        fechaVencimiento: new Date(this.gestionCreditoForm.get('fechaVencimiento')?.value?.trim()),
      },
      datosFormData: this.DatosForm.getRawValue(),
      operacion: this.gestionCreditoOperacionForm.get('Codigo')?.value,
      periodosPago: this.periodosPago
    };
  }
  // Fin Cambiar tasa
 
}
