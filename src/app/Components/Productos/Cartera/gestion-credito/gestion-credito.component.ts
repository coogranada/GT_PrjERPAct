import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperacionesService } from '../../../../Services/Maestros/operaciones.service';
import { TipoBusquedaResumen } from '../../../../Models/Productos/cartera/gestion-credito.enum';
import { CarteraService } from '../../../../Services/Productos/cartera.service';
import { CuentaCarteraResumen, CuentaFormateada } from '../../../../Models/Productos/cartera/gestion-credito.model';
import { DisponiblesService } from '../../../../Services/Productos/disponible.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gestion-credito',
  templateUrl: './gestion-credito.component.html',
  styleUrl: './gestion-credito.component.css',
  providers: [CarteraService, DisponiblesService],
  standalone: false
})
export class GestionCreditoComponent {

  @ViewChild('ModalBuscarAsociados', { static: true }) private ModalBuscarAsociados!: ElementRef;

  private codModulo = 45;
  public dataUser : any;
  public gestionCreditoForm!: FormGroup;
  public gestionCreditoOperacionForm!: FormGroup;
  public AsesorExternoForm!: FormGroup;
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
  public bloqtemp = false;
  public booltemp = true;
  public cuentasResumenData: CuentaCarteraResumen[] = [];
  public currentIdCuenta: number | undefined;
  public resultOperacionesPermitadas: any[] = [];
  public resultFormasPago: any[] = [];
  public resultEstadosCuenta: any[] = [];
  // TABS
  activaDatos = false;

  public ValidaPactado: boolean = true;
  // FIN TABS 

  constructor( private operacionesService: OperacionesService, private carteraService: CarteraService, private DisponiblesServices: DisponiblesService) {}

  ngOnInit() {
    this.validateForm();
    this.loadOperaciones();
    this.ObtenerRelacion();
    this.ObtenerOperacionesPermitidas();
    this.ObtenerFormasPago();
    this.ObtenerEstadosCuenta();
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
    const BuscarNombre = new FormControl({ value: '', disabled: true }, []);
    const DocumentoTitular = new FormControl({value:"",disabled:true}, [Validators.pattern('[0-9]*')]);
    const NombreTitular = new FormControl({value:"",disabled:true}, []);
    const Titular = new FormControl({ value: '', disabled: true }, []);
    const Autorizado = new FormControl({ value: '', disabled: true }, []);
    const Observacion = new FormControl({ value: '', disabled: true }, []);
    const ObservacionCuenta = new FormControl({ value: '', disabled: true }, []);
    const Codigo = new FormControl({ value: '', disabled: false }, [Validators.required]);
    const IdDigito = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
    const IdConsecutivo = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
    const IdProductoCuenta = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
    const CodigoCuentaFormateado = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
    const IdOficinaCuenta = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
    const NumeroOficinaAsociado = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const NombreOficinaAsociado = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const NombreOficina = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const NumeroOficina = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const DescripcionOperacion = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const Clase = new FormControl({ value: '', disabled: true }, [Validators.required]);
    const IdEstado = new FormControl({ value: '', disabled: true }, []);
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
    const pagare = new FormControl({ value: '', disabled: true }, []);
    const IdRelacionCliente = new FormControl({ value: '', disabled: true }, []);
    const Cuenta = new FormControl({ value: '', disabled: true }, []);
    const TelefonoDisponible = new FormControl({ value: '', disabled: true }, []);
    const Titulares = new FormControl({ value: '', disabled: true }, []);
    const Talonarios = new FormControl({ value: '', disabled: true }, []);
    const IdOperacionPermitida = new FormControl({ value: '', disabled: true }, []);
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
      IdEstado,
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
      Cuenta: Cuenta,
      TelefonoDisponible: TelefonoDisponible,
      DireccionDisponible: DireccionDisponible,
      Titulares: Titulares,
      Talonarios: Talonarios,
      IdAsesorExterno: IdAsesorExterno,
      IdOperacionPermitida,
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

  ObtenerRelacion() {
    this.DisponiblesServices.ObtenerRelacion().subscribe(
      result => {
        this.tiposRelacion = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  ObtenerEstadosCuenta() {
    // this.loading = true;
    let datas = localStorage.getItem('Data');
    this.dataUser = JSON.parse(window.atob(datas == null ? "" : datas));
    const arrayExample = {
      'IdOperacion': 9,
      'IdPerfil': this.dataUser.idPerfilUsuario,
      'IdModulo': '38'
    };
    this.operacionesService.ObtenerEstadosXOperacionesData(arrayExample).subscribe(
      result => {
        this.resultEstadosCuenta = result;
        $('#SelectEstadoCuenta').focus().select();
      },
      error => {
        // this.loading = false;
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  ObtenerOperacionesPermitidas() {
    this.DisponiblesServices.OperacionPermitida().subscribe(
      result => {
        this.resultOperacionesPermitadas = result;
        // this.DisponibleForm.get('DescripcionOperacion')?.setValue(result[0].DescripcionOperacion);
        // $('#SelectOperacionPermitida').focus().select();
      },error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  ObtenerFormasPago() {
    this.DisponiblesServices.FormaPago().subscribe(
      result => {
        this.resultFormasPago = result;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  onChangeOperacion() {
    // if (this.gestionCreditoOperacionForm.get('Codigo')?.value !== '2' && this.gestionCreditoOperacionForm.get('Codigo')?.value !== '10' &&
    //   this.gestionCreditoOperacionForm.get('Codigo')?.value !== '40')
      // this.BuscarPorCuenta();
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
    if(valoresCamposNumeroCuenta.every(Boolean)) {
      const [oficina, producto, consecutivo, digito] = valoresCamposNumeroCuenta;
      this.buscarCuentaResumen(TipoBusquedaResumen.NumeroCuenta, { oficina, producto, consecutivo, digito });
    }
  }

  onClickBuscarCuentaPorCliente() {
    const documento = this.gestionCreditoForm.get('BuscarDocumento')?.value?.trim();
    const nombre = this.gestionCreditoForm.get('BuscarNombre')?.value?.trim();
    if(documento) this.buscarCuentaResumen(TipoBusquedaResumen.Documento, documento);
    else if(nombre) this.buscarCuentaResumen(TipoBusquedaResumen.Nombre, nombre);
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
    consulta$.subscribe(
      result => {
        if(!result) {
          alert('algo salió mal');
        } else if(result.length === 0) {
          alert('No encontrado');
        } else if(result.length === 1) {
          this.buscarCuentaDetalle(result[0]);
        } else if(result.length > 1) {
          this.cuentasResumenData = result;
          this.ModalBuscarAsociados.nativeElement.click();
        }
      }
    );

  }

  buscarCuentaDetalle(cuentaResumen: CuentaCarteraResumen) {
    this.carteraService.buscarCuentaDetalle(cuentaResumen.IdCuenta).subscribe(
      result => {
        if(result) {
          const [idOficina, idProducto, idConsecutivo, idDigito] = cuentaResumen.CodigoCuentaFormateado.split('-');
          this.gestionCreditoForm.get('IdCuenta')?.setValue(cuentaResumen.IdCuenta);
          this.gestionCreditoForm.get('IdOficinaCuenta')?.setValue(cuentaResumen.IdOficinaCuenta);
          this.gestionCreditoForm.get('IdProductoCuenta')?.setValue(cuentaResumen.IdProducto);
          this.gestionCreditoForm.get('IdConsecutivo')?.setValue(cuentaResumen.IdConsecutivo);
          this.gestionCreditoForm.get('IdDigito')?.setValue(cuentaResumen.IdDigito);
          this.gestionCreditoForm.get('NumeroOficinaAsociado')?.setValue(result.IdOficinaCliente);
          this.gestionCreditoForm.get('NombreOficinaAsociado')?.setValue(result.OficinaCliente);
          this.gestionCreditoForm.get('NumeroDocumento')?.setValue(result.NumeroDocumento);
          const { PrimerApellido: pa, SegundoApellido: sa, PrimerNombre: pn, SegundoNombre: sn } = cuentaResumen;
          this.gestionCreditoForm.get('Nombre')?.setValue(this.concatWithSpace(pa, sa, pn, sn));
          this.gestionCreditoForm.get('IdProducto')?.setValue(cuentaResumen.IdProducto);
          this.gestionCreditoForm.get('DescripcionProducto')?.setValue(result.NombreProducto);
          this.gestionCreditoForm.get('IdLinea')?.setValue(cuentaResumen.IdLinea);
          this.gestionCreditoForm.get('Linea')?.setValue(result.Linea);
          this.gestionCreditoForm.get('IdAsesor')?.setValue(result.IdAsesor);
          this.gestionCreditoForm.get('NombreAsesor')?.setValue(result.Asesor);
          this.gestionCreditoForm.get('IdAsesorExterno')?.setValue(result.IdAsesorExterno);
          this.gestionCreditoForm.get('NombreAsesorExterno')?.setValue(result.AsesorExterno);
          this.gestionCreditoForm.get('Radicado')?.setValue(result.Radicado);
          this.gestionCreditoForm.get('pagare')?.setValue(cuentaResumen.Pagare);
          this.gestionCreditoForm.get('IdRelacionCliente')?.setValue(result.IdRelacionCliente);
          this.gestionCreditoForm.get('NumeroOficina')?.setValue(cuentaResumen.IdOficinaCuenta);
          this.gestionCreditoForm.get('NombreOficina')?.setValue(result.OficinaCuenta);
          this.gestionCreditoForm.get('IdEstado')?.setValue(cuentaResumen.IdEstado);
          this.gestionCreditoForm.get('IdOperacionPermitida')?.setValue(result.IdOperacionPermitida);
          this.gestionCreditoForm.get('IdFormaPago')?.setValue(result.IdFormaPago);
          this.reestablecerCamposEncabezado('BuscarDocumento', 'BuscarNombre');
          this.gestionCreditoOperacionForm.reset();
          this.deshabilitarCamposBusqueda();

          
        }
      }
    );


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
    switch (tab) {
      case 1:
        this.activaDatos = true;
        break;
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

// FIN DATOS 
// FIN TABS

}
