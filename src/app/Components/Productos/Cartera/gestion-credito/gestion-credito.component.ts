import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperacionesService } from '../../../../Services/Maestros/operaciones.service';

@Component({
  selector: 'app-gestion-credito',
  templateUrl: './gestion-credito.component.html',
  styleUrl: './gestion-credito.component.css',
  standalone: false
})
export class GestionCreditoComponent {

  private codModulo = 45;
  public dataUser : any;
  public gestionCreditoForm!: FormGroup;
  public gestionCreditoOperacionForm!: FormGroup;
  public AsesorFrom!: FormGroup;
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

  public bloqtemp = false;
  public booltemp = true;

  constructor( private operacionesService: OperacionesService ) {}

  ngOnInit() {
    this.validateForm();
    this.loadOperaciones();
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
    const IdOficina = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
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
    const strCodigo = new FormControl({ value: '', disabled: true }, [Validators.pattern('[0-9]*')]);
    const strNombre = new FormControl({ value: '', disabled: true }, []);
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
    const NombreLinea = new FormControl({ value: '', disabled: true }, []);
    const Monto = new FormControl({ value: '', disabled: true }, []);
    const FechaCredito = new FormControl({ value: '', disabled: true }, []);
    const FechaProximoCobro = new FormControl({ value: '', disabled: true }, []);
    const LibretaPlastico = new FormControl({ value: '', disabled: true }, []);
    const MoraCuotaManejo = new FormControl({ value: '', disabled: true }, []);
    const IdRelacionTipo = new FormControl({ value: '', disabled: true }, []);
    const Cuenta = new FormControl({ value: '', disabled: true }, []);
    const TelefonoDisponible = new FormControl({ value: '', disabled: true }, []);
    const Titulares = new FormControl({ value: '', disabled: true }, []);
    const Talonarios = new FormControl({ value: '', disabled: true }, []);
    const IdAsesorExterno = new FormControl({ value: '', disabled: true }, []);
    const IdOperacion = new FormControl({ value: '', disabled: true }, []);
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

    this.gestionCreditoOperacionForm = new FormGroup({
      Codigo: Codigo,
    });

    this.AsesorFrom = new FormGroup({
      strCodigo: strCodigo,
      strNombre: strNombre,
      strTipo: strTipo
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
        console.log({result});
        
        this.resultOperaciones = result;
        // this.MostrarDemas = false;
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  onChangeOperacion() {
    if (this.gestionCreditoOperacionForm.get('Codigo')?.value !== '2' && this.gestionCreditoOperacionForm.get('Codigo')?.value !== '10' &&
      this.gestionCreditoOperacionForm.get('Codigo')?.value !== '40')
      // this.BuscarPorCuenta();
    if (this.gestionCreditoOperacionForm.get('Codigo')?.value === '2') { // Buscar
    

    }
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
}
