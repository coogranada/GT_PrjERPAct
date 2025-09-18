import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperacionesService } from '../../../../Services/Maestros/operaciones.service';
import { TipoBusquedaResumen } from '../../../../Models/Productos/cartera/gestion-credito.enum';
import { CarteraService } from '../../../../Services/Productos/cartera.service';
import { CuentaCarteraResumen, CuentaFormateada } from '../../../../Models/Productos/cartera/gestion-credito.model';
import { DisponiblesService } from '../../../../Services/Productos/disponible.service';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { MiListaProductosService } from '../../../../Services/Informes/mi-lista-productos.service';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionNotificacion } from '../../../../../environments/config.noticaciones';
import Swal from 'sweetalert2';
import { DetalleCartera } from '../../../../Models/Informes/MisProductos/mis-producto.model';
import { TablaVirtualComponent } from '../../../Tabla-virtual/tabla-virtual/tabla-virtual.component';
import { MapeoColumna, transformarDatosParaTabla } from '../../../../utils/tabla-utils';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-gestion-credito',
  templateUrl: './gestion-credito.component.html',
  styleUrl: './gestion-credito.component.css',
  providers: [DisponiblesService],
  standalone: false
})
export class GestionCreditoComponent {

  @ViewChild('ModalBuscarAsociados', { static: true }) private ModalBuscarAsociados!: ElementRef;
  @ViewChild('cerrarModal', { static: true }) private cerrarModal!: ElementRef;
  @ViewChild(TablaVirtualComponent) tablaVirtual!: TablaVirtualComponent

  private codModulo = 45;
  public dataUser : any;
  public gestionCreditoForm!: FormGroup;
  public gestionCreditoOperacionForm!: FormGroup;
  public AsesorExternoForm!: FormGroup;
  public DatosForm!: FormGroup;
  public SaldosForm!: FormGroup;
  public resultOperaciones : any;
  public bloquearConsultaCuenta : boolean = false;
  public BloquearBuscar = false;
  public Bloquear = false;
  public BloquearBtnRegistroFirma = false;
  public BloquearAsociado = false;
  public BloquaerProducto = false;
  public BloquearTimbrarMensaje = false;
  public EnableExoneradaGMF: boolean  = false;
  public EnableExentaGMF: boolean = false;

  private readonly NOMBRES_CAMPOS_NUMERO_CUENTA: string[] = ['IdOficinaCuenta', 'IdProductoCuenta', 'IdConsecutivo', 'IdDigito'];  
  private readonly NOMBRES_CAMPOS_BUSQUEDA: string[] = [...this.NOMBRES_CAMPOS_NUMERO_CUENTA, 'BuscarDocumento', 'BuscarNombre', 'pagare'];  
  public tiposRelacion: any[] = [];
  public cuentasResumenData: CuentaCarteraResumen[] = [];
  public currentIdCuenta: number | undefined;
  public resultOperacionesPermitadas: any[] = [];
  public resultFormasPago: any[] = [];
  public resultEstadosCuenta: any[] = [];
  public loading = false;
  public datosTransformados: any[] = [];
  public encabezadosTablaModalAlBuscar: string[] = [];

  // TABS
  activaDatos: boolean = true;
  activaSaldos: boolean = false;
  public carteraInfo = new DetalleCartera();

  public ValidaPactado: boolean = true;
  // FIN TABS 

  constructor( 
    private operacionesService: OperacionesService,
    private carteraService: CarteraService,
    private disponiblesServices: DisponiblesService,
    private miListaProductosService: MiListaProductosService,
    private notif: ToastrService
  ) {}

  ngOnInit() {
    this.validateForm();
    this.loadOperaciones();
    this.ObtenerFormasPago();
    // Activa tab datos  
    this.devolverTab(1);
    $('#Datos').addClass('activar');
    $('#Datos').addClass('active');
  }

  validateForm() {
    const OficinaCambio = new FormControl({ value: '', disabled: true }, []);
    const IdAsesor = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const NombreAsesor = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const IdProducto = new FormControl({ value: '', disabled: true }, []);
    const DescripcionProducto = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const Nombre = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const NumeroDocumento = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const BuscarDocumento = new FormControl({ value: '', disabled: true }, []);
    const BuscarNombre = new FormControl({ value: '', disabled: true }, [
      Validators.minLength(6),
      Validators.maxLength(100),
      Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s'-]+$")
    ]);
    const DocumentoTitular = new FormControl({value:"",disabled:true}, [Validators.pattern('[0-9]*')]);
    const NombreTitular = new FormControl({value:"",disabled:true}, []);
    const Titular = new FormControl({ value: '', disabled: true }, []);
    const Autorizado = new FormControl({ value: '', disabled: true }, []);
    const Observacion = new FormControl({ value: '', disabled: true }, []);
    const ObservacionCuenta = new FormControl({ value: '', disabled: true }, []);
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
    const DescripcionOperacion = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const Clase = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const IdEstadoCuenta = new FormControl({ value: '', disabled: true }, []);
    const NombreEstadoCuenta = new FormControl({ value: '', disabled: true }, []);
    const DescripcionEstado = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const IdFormaPago = new FormControl({ value: '', disabled: true }, []);
    const DescripcionFormaPago = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const InteresCausado = new FormControl({ value: '', disabled: true }, []);
    const SaldoInicial = new FormControl({ value: '', disabled: true }, []);
    const SaldoMinimo = new FormControl({ value: '', disabled: true }, []);
    const ValorExonerado = new FormControl({ value: '', disabled: true }, []);
    const InteresdelPeriodo = new FormControl({ value: '', disabled: true }, []);
    const Canje = new FormControl({ value: '', disabled: true }, []);
    const RetiroDelPerido = new FormControl({ value: '', disabled: true }, []);
    const RetencionFuentePeriodo = new FormControl({ value: '', disabled: true }, []);
    const Efectivo = new FormControl({ value: '', disabled: true }, []);
    const SaldoTotal = new FormControl({ value: '', disabled: true }, []);
    const GMFAdescontar = new FormControl({ value: '', disabled: true }, []);
    const FechaApertura = new FormControl({ value: '', disabled: true }, []);
    const FechaUltimaTrans = new FormControl({ value: '', disabled: true }, []);
    const FechaCancelacion = new FormControl({ value: '', disabled: true }, []);
    const FechaMarcaGMF = new FormControl({ value: '', disabled: true }, []);
    const FechaDesmarcaGMF = new FormControl({ value: '', disabled: true }, []);
    const IdAsesorExterno = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
    const NombreAsesorExterno = new FormControl({ value: '', disabled: true }, []);
    const strTipo = new FormControl({ value: '', disabled: true }, []);
    const Canal = new FormControl({value:"",disabled:true});
    const DescripcionCanal = new FormControl({ value: '', disabled: true }, []);
    const NumeroOperaciones = new FormControl({ value: '', disabled: true }, [Validators.pattern('^[0-9]+$')]);
    const MontoMaximo = new FormControl({ value: '', disabled: true }, []);
    const IdMedioPago = new FormControl({ value: '', disabled: true }, []);
    const IdConvenio = new FormControl({ value: '', disabled: true }, []);
    const IdCuenta = new FormControl({ value: '', disabled: true }, []);
    const IdUsuarioSGF = new FormControl({ value: '', disabled: true }, []);
    const IdUsuarioERP = new FormControl({ value: '', disabled: true }, []);
    const ActivaMovimiento = new FormControl({ value: '', disabled: true }, []);
    const Exenta = new FormControl({ value: '', disabled: true }, []);
    const ExoneradaGmf = new FormControl({ value: '', disabled: true }, []);
    const Inicial = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
    const Final = new FormControl({ value: '', disabled: true }, []);
    const FechaVigenciaTarjeta = new FormControl({ value: '', disabled: true }, []);
    const NumeroTarjeta = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
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
    const Linea = new FormControl({ value: '', disabled: true }, []);
    const Monto = new FormControl({ value: '', disabled: true }, []);
    const FechaCredito = new FormControl({ value: '', disabled: true }, []);
    const FechaProximoCobro = new FormControl({ value: '', disabled: true }, []);
    const LibretaPlastico = new FormControl({ value: '', disabled: true }, []);
    const MoraCuotaManejo = new FormControl({ value: '', disabled: true }, []);
    const pagare = new FormControl({ value: '', disabled: true }, [Validators.pattern('^[0-9]*$')]);
    const IdRelacionCliente = new FormControl({ value: '', disabled: true }, []);
    const NombreRelacionCliente = new FormControl({ value: '', disabled: true }, []);
    const estaReestructurado = new FormControl({ value: false, disabled: true }, []);
    const estaReliquidado = new FormControl({ value: false, disabled: true }, []);
    const estaPagoAbogado = new FormControl({ value: false, disabled: true }, []);
    const estaCastigado = new FormControl({ value: false, disabled: true }, []);
    const estaSinCobertura = new FormControl({ value: false, disabled: true }, []);
    const Cuenta = new FormControl({ value: '', disabled: true }, []);
    const TelefonoDisponible = new FormControl({ value: '', disabled: true }, []);
    const Titulares = new FormControl({ value: '', disabled: true }, []);
    const Talonarios = new FormControl({ value: '', disabled: true }, []);
    const IdOperacionPermitida = new FormControl({ value: '', disabled: true }, []);
    const NombreOperacionPermitida = new FormControl({ value: '', disabled: true }, []);
    const Canales = new FormControl({ value: '', disabled: true }, []);
    const LngTercero = new FormControl({ value: '', disabled: true }, []);
    const AdicionarPunto = new FormControl({ value: '', disabled: true }, []);
    const TibrarComentario = new FormControl({ value: '', disabled: true }, []);
    const TasaEfectiva = new FormControl({ value: '', disabled: true }, []);
    const TasaNominal = new FormControl({ value: '', disabled: true }, []);
    const IdIndicador = new FormControl({ value: '', disabled: true }, []);
    const Puntos = new FormControl({ value: '', disabled: true }, []);
    const CuentaCupo = new FormControl({ value: '', disabled: true }, []);
    const IdCuentaCupo = new FormControl({ value: '', disabled: true }, []);
    const lngTercero = new FormControl({ value: '', disabled: true }, []);
    const lngCuenta = new FormControl({ value: '', disabled: true }, []);
    const IdTipoObservacion = new FormControl({ value: '', disabled: true }, []);
    const NumeroMatricula = new FormControl({ value: '', disabled: true }, []);
    const DescripcionMatricula = new FormControl({ value: '', disabled: true }, []);
    const ValorCobertura = new FormControl({ value: '', disabled: true }, []);
    const ValorRespaldo = new FormControl({ value: '', disabled: true }, []);
    const PagoTotal = new FormControl({ value: '', disabled: true }, []);
    const PagoMinimo = new FormControl({ value: '', disabled: true }, []);
    const DireccionDisponible = new FormControl({ value: '', disabled: true }, []);
    const TipoDocumento = new FormControl({ value: '', disabled: true }, []);
    const IdTipoDocumento = new FormControl({ value: '', disabled: true }, []);
    const SaldoPromedioMesAnterior = new FormControl({ value: '', disabled: true }, []);
    const InteresMesAnterior = new FormControl({ value: '', disabled: true }, []);
    const SaldoCertificado = new FormControl({ value: '', disabled: true }, []);
    const IdGarantia = new FormControl({ value: '', disabled: true }, []);
    const DescripcionGarantia = new FormControl({ value: '', disabled: true }, []);
    const IdGarantiaConsecutivo = new FormControl({ value: '', disabled: true }, []);
    const DocumentoAsesor = new FormControl({ value: '', disabled: true }, []);
    const IdObseCambioEstado = new FormControl({ value: '', disabled: true }, []);
    const RetiroPeriodo = new FormControl({ value: '', disabled: true }, []);
    const AliasCuenta = new FormControl({ value: '', disabled: true }, []);
    const ExoCobroHasta = new FormControl({ value: '', disabled: true }, []);
    const Edad = new FormControl({ value: '', disabled: true }, []);

    this.gestionCreditoForm = new FormGroup({
      OficinaCambio: OficinaCambio,
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
      CodigoCuentaFormateado,
      IdOficinaCuenta,
      NumeroOficinaAsociado: NumeroOficinaAsociado,
      NombreOficinaAsociado: NombreOficinaAsociado,
      NombreOficina: NombreOficina,
      NumeroOficina: NumeroOficina,
      DescripcionOperacion: DescripcionOperacion,
      Clase: Clase,
      IdEstadoCuenta,
      NombreEstadoCuenta,
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
      IdUsuarioERP: IdUsuarioERP,
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
      Radicado,
      Tipo: Tipo,
      TipoFirma: TipoFirma,
      IdLinea,
      Linea,
      Monto: Monto,
      FechaCredito: FechaCredito,
      FechaProximoCobro: FechaProximoCobro,
      LibretaPlastico: LibretaPlastico,
      MoraCuotaManejo: MoraCuotaManejo,
      pagare,
      IdRelacionCliente,
      NombreRelacionCliente,
      estaReestructurado,
      estaReliquidado,
      estaPagoAbogado,
      estaCastigado,
      estaSinCobertura,
      Cuenta: Cuenta,
      TelefonoDisponible: TelefonoDisponible,
      DireccionDisponible: DireccionDisponible,
      Titulares: Titulares,
      Talonarios: Talonarios,
      IdAsesorExterno: IdAsesorExterno,
      IdOperacionPermitida,
      NombreOperacionPermitida,
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

    this.gestionCreditoOperacionForm = new FormGroup({
      Codigo: Codigo,
    });

    this.AsesorExternoForm = new FormGroup({
      IdAsesorExterno,
      NombreAsesorExterno,
      strTipo
    });

    // this.AdicionarPuntosFrom = new FormGroup({
    //   AdicionarPunto: AdicionarPunto,
    // });

    // this.CambioEstadoFrom = new FormGroup({
    //   lngTercero: lngTercero,
    //   lngCuenta: lngCuenta,
    //   IdTipoObservacion: IdTipoObservacion
    // });

    //   this.CertificadoFrom = new FormGroup({
    //     SaldoCertificado: SaldoCertificado,
    // });


    // TABS


    const Sistema = new FormControl({ value: '', disabled: true }, []);
    const PeriodoCapital = new FormControl({ value: '', disabled: true }, []);
    const PeriodoInteres = new FormControl({ value: '', disabled: true }, []);
    const Plazo = new FormControl({ value: '', disabled: true }, []);
    const Garantia = new FormControl({ value: '', disabled: true }, []);
    const TipoGarantia = new FormControl({ value: '', disabled: true }, []);
    const PeriodoGracia = new FormControl({ value: '', disabled: true }, []);
    const TasaPeriodicaL = new FormControl({ value: '', disabled: true }, []);
    const TasaLiquidada = new FormControl({ value: '', disabled: true }, []);
    const EfectivaLiquidada = new FormControl({ value: '', disabled: true }, []);;
    const TasaPeriodicaP = new FormControl({ value: '', disabled: true }, []);
    const TasaPactada = new FormControl({ value: '', disabled: true }, []);
    const EfectivaPactada = new FormControl({ value: '', disabled: true }, []);

    this.DatosForm = new FormGroup({
      Sistema: Sistema,
      PeriodoCapital: PeriodoCapital,
      PeriodoInteres: PeriodoInteres,
      Plazo: Plazo,
      Garantia: Garantia,
      TipoGarantia:TipoGarantia,
      PeriodoGracia: PeriodoGracia,
      TasaPeriodicaL: TasaPeriodicaL,
      TasaLiquidada: TasaLiquidada,
      EfectivaLiquidada: EfectivaLiquidada,
      TasaPeriodicaP: TasaPeriodicaP,
      TasaPactada: TasaPactada,
      EfectivaPactada: EfectivaPactada
    });

    const CoutasPagas = new FormControl({ value: '', disabled: true }, []);
    const CoutasPendientes = new FormControl({ value: '', disabled: true }, []);
    const CoutasMora = new FormControl({ value: '', disabled: true }, []);

    this.SaldosForm = new FormGroup({
      CoutasPagas: CoutasPagas,
      CoutasPendientes: CoutasPendientes,
      CoutasMora: CoutasMora,      
    });

    // FIN TABS

  }

  onFilaSeleccionada(data: any) {
    console.log({data});
    
    this.buscarCuentaDetalle(data);
    this.cerrarModal.nativeElement.click();
  }

  esFechaISO(valor: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(valor);
  }
 
  pad(numero: number): string {
    return numero < 10 ? '0' + numero : numero.toString();
  }

  formatearValor = (valor: any, columna?: string): string => {
    // if (columna && columna.endsWith('_M')) {
    //   const numero = Number(valor);
    //   if (!isNaN(numero)) {
    //     return numero.toLocaleString('es-CL', {
    //       style: 'currency',
    //       currency: 'CLP'
    //     });
    //   }
    //   return valor;
    // }
 
    // if (typeof valor === 'string' && this.esFechaISO(valor)) {
    //   const fecha = new Date(valor);
    //   return `${fecha.getFullYear()}/${this.pad(fecha.getMonth() + 1)}/${this.pad(fecha.getDate())} ${this.pad(fecha.getHours())}:${this.pad(fecha.getMinutes())}:${this.pad(fecha.getSeconds())}`;
    // }
 
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

  ObtenerFormasPago() {
    this.disponiblesServices.FormaPago().pipe(
      catchError(error => {
        console.error('Error al obtener formaPago:', error);
        return of(null);
      })
    ).subscribe(
      result => {
        this.resultFormasPago = result;
      }
    );
  }

  onChangeOperacion() {
    if (this.gestionCreditoOperacionForm.get('Codigo')?.value === '2') { // Buscar
      this.reestablecerCamposEncabezado();
      this.habilitarCamposBusqueda();
    }
  }

  habilitarCamposBusqueda() {
    for(const nombreCampo of this.NOMBRES_CAMPOS_BUSQUEDA) {
      this.gestionCreditoForm.get(nombreCampo)?.enable();
    }
  }

  deshabilitarCamposBusqueda() {
    for(const nombreCampo of this.NOMBRES_CAMPOS_BUSQUEDA) {
      this.gestionCreditoForm.get(nombreCampo)?.disable();
    }
  }

  reestablecerCamposEncabezado(...args: string[]) {
    if(!args.length) {
      this.gestionCreditoForm.reset();
    } else {
      for (const nombreCampo of args) {
        this.gestionCreditoForm.get(nombreCampo)?.reset();
      }
    }
  }

  onBlurCampoNumeroCuenta() {
    const valoresCamposNumeroCuenta = this.NOMBRES_CAMPOS_NUMERO_CUENTA.map(nombre => this.gestionCreditoForm.get(nombre)?.value?.trim());
    if(valoresCamposNumeroCuenta.every(valor => /^\d+$/.test(valor))) {
      const [oficina, producto, consecutivo, digito] = valoresCamposNumeroCuenta;
      this.buscarCuentaResumen(TipoBusquedaResumen.NumeroCuenta, { oficina, producto, consecutivo, digito });
    }
  }

  onClickBuscarCuentaPorCliente() {
    const documento = this.gestionCreditoForm.get('BuscarDocumento')?.value?.trim();
    const nombre = this.gestionCreditoForm.get('BuscarNombre')?.value?.trim();
    if(documento) this.buscarCuentaResumen(TipoBusquedaResumen.Documento, documento);
    else if(nombre && this.gestionCreditoForm.controls['BuscarNombre'].valid) this.buscarCuentaResumen(TipoBusquedaResumen.Nombre, nombre);
  }

  onClickCuentaInfo(cuentaResumen: CuentaCarteraResumen) {
    this.buscarCuentaDetalle(cuentaResumen);
  }

  onClickBuscarPorPagare() {
    const pagare = this.gestionCreditoForm.get('pagare')?.value;
    if(pagare) this.buscarCuentaResumen(TipoBusquedaResumen.Pagare, pagare);

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
    this.loading = true;
    consulta$.pipe(
      catchError(error => {
        console.error('Error al obtener cuentaResumen:', error);
        return of(null);
      })
    ).subscribe(
      result => {
        this.loading = false;
        if(!result) {
          this.notif.warning('Advertencia', 'No encontrado.', ConfiguracionNotificacion.configRightTop);
        } else if(result.length === 0) {
          this.notif.warning('Advertencia', 'No encontrado.', ConfiguracionNotificacion.configRightTop);
        } else if(result.length === 1) {
          this.buscarCuentaDetalle(result[0]);
        } else if(result.length > 1) {
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

  buscarCuentaDetalle(cuentaResumen: CuentaCarteraResumen) {
    this.loading = true;
    forkJoin({
      cuentaDetalle: this.carteraService.buscarCuentaDetalle(cuentaResumen.IdCuenta).pipe(
        catchError(error => {
          console.error('Error al obtener cuentaDetalle:', error);
          return of(null);
        })
      ),
      checkCartera: this.miListaProductosService.SetCheckCartera(cuentaResumen.IdCuenta).pipe( //Petición para obtener los estados del credito
        catchError(error => {
          console.error('Error al obtener checkCartera:', error);
          return of(null);
        })
      )
    }).subscribe(({ cuentaDetalle, checkCartera }) => {
      this.loading = false;
      if (cuentaDetalle) {
        this.gestionCreditoForm.get('IdCuenta')?.setValue(cuentaResumen.IdCuenta);
        this.gestionCreditoForm.get('IdOficinaCuenta')?.setValue(cuentaResumen.IdOficinaCuenta);
        this.gestionCreditoForm.get('IdProductoCuenta')?.setValue(cuentaResumen.IdProducto);
        this.gestionCreditoForm.get('IdConsecutivo')?.setValue(cuentaResumen.IdConsecutivo);
        this.gestionCreditoForm.get('IdDigito')?.setValue(cuentaResumen.IdDigito);
        this.gestionCreditoForm.get('NumeroOficinaAsociado')?.setValue(cuentaDetalle.Encabezado.IdOficinaCliente);
        this.gestionCreditoForm.get('NombreOficinaAsociado')?.setValue(cuentaDetalle.Encabezado.OficinaCliente);
        this.gestionCreditoForm.get('NumeroDocumento')?.setValue(cuentaDetalle.Encabezado.NumeroDocumento);
        const { PrimerApellido: pa, SegundoApellido: sa, PrimerNombre: pn, SegundoNombre: sn } = cuentaResumen;
        this.gestionCreditoForm.get('Nombre')?.setValue(this.concatWithSpace(pa, sa, pn, sn));
        this.gestionCreditoForm.get('IdProducto')?.setValue(cuentaResumen.IdProducto);
        this.gestionCreditoForm.get('DescripcionProducto')?.setValue(cuentaDetalle.Encabezado.NombreProducto);
        this.gestionCreditoForm.get('IdLinea')?.setValue(cuentaResumen.IdLinea);
        this.gestionCreditoForm.get('Linea')?.setValue(cuentaDetalle.Encabezado.Linea);
        this.gestionCreditoForm.get('IdAsesor')?.setValue(cuentaDetalle.Encabezado.IdAsesor);
        this.gestionCreditoForm.get('NombreAsesor')?.setValue(cuentaDetalle.Encabezado.Asesor);
        this.gestionCreditoForm.get('IdAsesorExterno')?.setValue(cuentaDetalle.Encabezado.IdAsesorExterno);
        this.gestionCreditoForm.get('NombreAsesorExterno')?.setValue(cuentaDetalle.Encabezado.AsesorExterno);
        this.gestionCreditoForm.get('Radicado')?.setValue(cuentaDetalle.Encabezado.Radicado);
        this.gestionCreditoForm.get('pagare')?.setValue(cuentaResumen.Pagare);
        this.gestionCreditoForm.get('IdRelacionCliente')?.setValue(cuentaDetalle.Encabezado.IdRelacionCliente);
        this.gestionCreditoForm.get('NombreRelacionCliente')?.setValue(cuentaDetalle.Encabezado.NombreRelacionCliente);
        this.gestionCreditoForm.get('NumeroOficina')?.setValue(cuentaResumen.IdOficinaCuenta);
        this.gestionCreditoForm.get('NombreOficina')?.setValue(cuentaDetalle.Encabezado.OficinaCuenta);
        this.gestionCreditoForm.get('IdEstadoCuenta')?.setValue(cuentaResumen.IdEstado);
        this.gestionCreditoForm.get('NombreEstadoCuenta')?.setValue(cuentaResumen.Estado);
        this.gestionCreditoForm.get('IdOperacionPermitida')?.setValue(cuentaDetalle.Encabezado.IdOperacionPermitida);
        this.gestionCreditoForm.get('NombreOperacionPermitida')?.setValue(cuentaDetalle.Encabezado.NombreOperacionPermitida);
        this.gestionCreditoForm.get('IdFormaPago')?.setValue(cuentaDetalle.Encabezado.IdFormaPago);
        this.gestionCreditoForm.get('estaSinCobertura')?.setValue(cuentaDetalle.Encabezado.EstaSinCobertura);
        this.reestablecerCamposEncabezado('BuscarDocumento', 'BuscarNombre');
        this.gestionCreditoOperacionForm.reset();
        this.deshabilitarCamposBusqueda();
        
        const saldo = cuentaDetalle.SaldoSeguroHipotecario?.Saldo;
        const formatoCOP = new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 2
        });
        if(saldo && saldo > 0) {
          Swal.fire({
            icon: 'warning',
            title: '<strong>! Advertencia ¡</strong>',
            html: `Posee deuda de seguro de garantía hipotecaria por valor de ${formatoCOP.format(saldo)}`,
            animation: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: 'rgb(160, 0, 87)'
          });
        }
          // TABS
        this.BuscarDatosCartera(+cuentaResumen.IdCuenta);
        this.BuscarSaldosCartera(+cuentaResumen.IdCuenta)
      }

      if (checkCartera) {
        this.gestionCreditoForm.get('estaReestructurado')?.setValue(checkCartera.Reestructurado);
        this.gestionCreditoForm.get('estaReliquidado')?.setValue(checkCartera.Reliquidado);
        this.gestionCreditoForm.get('estaPagoAbogado')?.setValue(checkCartera.Abogado);
        this.gestionCreditoForm.get('estaCastigado')?.setValue(checkCartera.Catigada);
      }
    });
  }

  LimpiarCampos(campo: string) {

  }

  BuscarAsociado() {

  }

  Producto() {

  }

  ChangeCheck(campo: string) {

  }

  SeleccionMedioPago() {

  }

  FormaPagoSeleccionada() {

  }

  BuscarAsesorExternoTodos() {

  }

  BuscarAsesorExternoCodigo() {
    
  }

  selectEstadoActivo() {
    
  }

  BuscarProducto() {
    
  }

// TABS 
  devolverTab(tab: number) {
    if (tab === 1) {
      this.activaDatos = true;
      this.activaSaldos = false;
    } else if (tab === 2) {
      this.activaDatos = false;
      this.activaSaldos = true;
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
  BuscarDatosCartera(IdCuenta : number){
    this.carteraService.getDatosCartera(IdCuenta).subscribe(
      result => {
        this.DatosForm.get('Sistema')?.setValue(result.Sistema);
        this.DatosForm.get('PeriodoCapital')?.setValue(result.PeriodoCapital);
        this.DatosForm.get('PeriodoInteres')?.setValue(result.PeriodoInteres);
        this.DatosForm.get('Plazo')?.setValue(result.Plazo);
        this.DatosForm.get('Garantia')?.setValue(result.Garantia);
        this.DatosForm.get('TipoGarantia')?.setValue(result.TipoGarantia);

        this.carteraInfo.Monto = result.Monto;
        this.carteraInfo.Cuota = result.Cuota;
        this.carteraInfo.CuotaLibranza = result.CuotaLibranza;

        this.DatosForm.get('PeriodoGracia')?.setValue(result.PeriodoGracia);
        this.DatosForm.get('FormaPago')?.setValue(result.FormaPago);
        this.DatosForm.get('EstadoDatos')?.setValue(result.Estado);     

        this.DatosForm.get('TasaPeriodicaL')?.setValue(result.TasaPeriodicaL);
        this.DatosForm.get('TasaLiquidada')?.setValue(result.TasaLiquidada);
        this.DatosForm.get('EfectivaLiquidada')?.setValue(result.TasaEfectivaL);
        this.DatosForm.get('TasaPeriodicaP')?.setValue(result.TasaPeriodicaP);
        this.DatosForm.get('TasaPactada')?.setValue(result.TasaPactada);
        this.DatosForm.get('EfectivaPactada')?.setValue(result.TasaEfectivaP);
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }  
  BuscarSaldosCartera(IdCuenta: number) {
    this.carteraService.getSaldosCartera(IdCuenta).subscribe(
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

        this.SaldosForm.get('CoutasPagas')?.setValue(result.CuotasPagas);       
        this.SaldosForm.get('CoutasPendientes')?.setValue(result.CuotasPendientes); 
        this.SaldosForm.get('CoutasMora')?.setValue(result.CuotasMora);
       
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }   

// FIN DATOS 
// FIN TABS

}
