import { FormControl } from "@angular/forms";
import { Novedad } from "./cambiar-tasa-context";

export interface CuentaCarteraResumen {
  IdOficinaCuenta: number;
  IdProducto: number;
  IdConsecutivo: number;
  IdDigito: number;
  IdCuenta: number;
  CodigoCuentaFormateado: string;
  PrimerNombre: string;
  SegundoNombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  IdEstado: number;
  Estado: string;
  Pagare: number;
  FechaMatricula: string;
  IdLinea: number;
}

export interface CuentaCarteraDetalle {
  Encabezado: GestionCreditoEncabezado;
  SaldoSeguroHipotecario: SeguroHipotecario;
}

export interface GestionCreditoEncabezado {
  IdTercero: number;
  TipoCliente: number;
  IdOficinaCliente: number;
  OficinaCliente: string;
  IdTipoDocumento: number;
  NumeroDocumento: string;
  IdProducto: number;
  IdConsecutivo: number;
  IdDigito: number;
  NombreProducto: string;
  Linea: string;
  ManejoCupo: boolean;
  Radicado: number;
  IdAsesor: number;
  Asesor: string;
  IdAsesorExterno?: number | null;
  AsesorExterno?: string | null;
  IdTipoAlivio?: number | null;
  IdRelacionCliente: number;
  NombreRelacionCliente: string;
  IdOperacionPermitida: number;
  NombreOperacionPermitida: string;
  IdFormaPago: number;
  IdOficinaCuenta: number;
  OficinaCuenta: string;
  EstaSinCobertura: boolean;
  Sigla: string;
  TipoPagare: string;
  CreditoPadre: boolean;
  IdCuenta: number;
  CodigoCuentaFormateado: string;
  PrimerNombre: string;
  SegundoNombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  IdEstado: number;
  Estado: string;
  Pagare: number;
  FechaMatricula: string;
  IdLinea: number;
  TasaLinea: number;
  PlazoMaximoLinea: number | null;
}

export interface SeguroHipotecario {
  Codigo: string;
  Nombre: string;
  Saldo: number;
}

export interface CuentaFormateada {
  oficina: string;
  producto: string;
  consecutivo: string;
  digito: string;
}

export interface GarantiaPersonalCod {
  IdTercero: number;
  Nombres: string;
  PrimerApellido: string;
  SegundoApellido: string;
  NumeroDocumento: string;
  TelResidencia: string | null;
  TelEmpresa: string | null;
  FechaMatricula: string;
}

export interface CodeudorDraft {
  idTercero: number;
  documento: string;
  nombreCompleto: string;
}

export interface GarantiaReal {
  Clase: any;
  Garantia: any;
  ValorCobertura: any;
  ValorRespalda?: any;
  VctoPoliza: any;
  GarantiaId: number;
}

export interface GarantiasResponse {
  lstCodeudores: GarantiaPersonalCod[] | null;
  lstGarantiaReal: GarantiaReal[] | null;
}

export interface Diferido {
  Codigo: number;
  CuotaPactada: number;
  Nombre: string;
  Plazo: number
  SaldoDeducible: number
  SaldoInicialDeducible: number
  ValorCuota: number
  ValorPagado: number
}

export interface Provision {
  curAportes: number;
  curCapital: number;
  curCostas: number;
  curCubApo: number;
  curCubHip: number;
  curCubOtr: number;
  curHipotecas: number;
  curInteres: number;
  curOtras: number;
  curProCap: number;
  curProCos: string;
  curProINT: number;
  curProvisionAdicional: number;
  dtmFecha: string;
  intDiasMora: number;
  strCalificacion: string;
}

export interface Referencia {
  Celular: string;
  DescripcionReferencia: string;
  NombreCompleto: string;
  NombreEmpresa: string;
  TelefonoEmpresa: string;
  TelefonoResidencia: string;
  TipoReferencia: number;
}

export interface FechasCredito {
  Apertura: string;
  CambioFechaPago: string;
  CambioTasa: string;
  Cancelacion: string;
  CartaPrejuridico: string;
  Contingencia: string;
  EntradaPrejuridico: string;
  InicioPeriodoGracia: string;
  ProximoPago: string;
  UltTransaccion: string;
  Vencimiento: string;
  dtmDoumentaTD: string;
  dtmUltimaTransTD: string;
}

export interface HistorialOperacion {
  Descripcion: string;
  Detalles: string;
  FechaHistorial: string;
  IdCuenta: number;
  IdTiposObservaciones: number;
  IdUsuario: number;
  NombreCompleto: string;
  NombreOficina: string;
  Operacion: number;
  TiposObservaciones: string | null;
}

export interface CupoInfo {
  Bloqueos: number;
  CupoAprobado: number;
  CupoDisponible: number;
  CupoUtilizado: number;
  DtmActualizacion: string;
  DtmAprobacionCupo: string;
  DtmDocumentacion: string | null;
  DtmMatricula: string;
  DtmRetiro: string;
  DtmVencimiento: string;
  NumeroCupo: number;
  DiaMaxMora: number;
  MaxCuotaMora: number;
}

export interface CalcularCuota {
  nro: number;
  abonoCapital: number;
  interesCorriente: number;
  interesMora: number;
  diasMora: number;
  tasa: number;
  fechaMora: string;
  cuotaDeducibles: number;
  cuotaSeguro: number;
}

export interface ObservacionRadicado {
  intEstadoTipo: number;
  strDescripcion: string;
  EsExcepcion: boolean;
}


export interface ActualizarPagareDto {
  Oficina: number;
  Producto: number;
  Consecutivo: number;
  Digito: number;
  NuevoPagare: number;
  Usuario: number;
  Autoriza: number;
  Novedad: number;
  TipoPagare: number
}

export interface ActualizarPagareCupoDto extends ActualizarPagareDto {
  IdCuenta: number;
}

export interface ResultadoOperacionDto {
  $id?: string;
  Exitoso: boolean;
  Mensaje: string;
}


export interface PersonaNaturalBusquedaDto {
  IdTercero: number;
  NumeroDocumento: string;
  NombreCompleto: number;
  FechaMod: string;
}

export type BaseRequestAlCalcular = {
  idCuenta: number;
  idNovedad: Novedad;
};

export type CalcularDatosAlCambiarTasa =
  | { tasaNominal: number }
  | { puntos: number }


export type CalcularDatosAlCambiarPlazo = { plazo: number }

export type CalcularDatosAlCambiarSistema = { idSistema: number, idPeriodoCapital: number, idPeriodoInteres: number }

export type CalcularDatosReeliquidacion = CalcularDatosAlCambiarTasa | CalcularDatosAlCambiarPlazo | CalcularDatosAlCambiarSistema;

export type CalcularDatosRequest = 
  | BaseRequestAlCalcular
  | BaseRequestAlCalcular & (
  | CalcularDatosAlCambiarTasa
  | CalcularDatosAlCambiarPlazo
  | CalcularDatosAlCambiarSistema
);

export interface ConPlazo {
  plazo: number;
  idSistema?: number;
  idPeriodoCapital?: number;
  idPeriodoInteres?: number;
  periodoGracia: number;
};

export interface ConTasa {
  tasaNominal: number;
  puntos: number;
};

export type CalcularDatosReestRequest = BaseRequestAlCalcular & (
  | ConPlazo
  | ConTasa
);

export interface ResultCalcularCambioDatos {
  TasaEfectiva: number;
  TasaNominal: number;
  Cuota: number;
  Plazo: number;
  Monto: number;
  MesesGraciaCalculada: number;
}

export interface LogCambiarCodeudores {
  Anteriores: CodeudorDraft[],
  Actuales: CodeudorDraft[],
}

export interface CambiarInfoCreditoLog {
  Sistema?: string;
  PeriodoCapital?: string;
  PeriodoInteres?: string;
  Plazo: number;
  Monto: string;
  Cuota: string;
  CuotaLibranza: string;
  TasaPeriodica?: string;
  TasaEfectiva?: string;
  TasaNominal?: string;
  Puntos?: number;
  PeriodoGracia: number;
  SaldoProyectado: string;
  SaldoCapital: string;
  SaldoDeuda: string;
  CuotasPagas: number;
  CuotasPendientes: number;
  CuotasMora: number;
  FechaProximoPago: string;
  FechaContingencia: string;
  FechaInicioPeriodoGracia: string;
  FechaVencimiento: string;
  FechaCambioTasa?: string;
  FechaDePago: string;
}

export interface DetallesLogCredito {
  Anterior: CambiarInfoCreditoLog,
  Actualiza: CambiarInfoCreditoLog
}

export interface DatosForm {
  Sistema: string;
  IdSistema: number;
  Formula: 'HADP' | 'HCCC';
  PeriodoCapital: string;
  PeriodoInteres: string;
  Plazo: number;
  Garantia: string;
  TipoGarantia: string;
  PeriodoGracia: number;
  TasaPeriodicaL: number;
  TasaLiquidada: number;
  EfectivaLiquidada: number;
  TasaPeriodicaP: number;
  TasaPactada: number;
  EfectivaPactada: number;
  DescripcionAlivio: string;
  Indicador: string;
  SiglaIndicador: string;
  Puntos: number;
  IdPeriodoInteres: number;
  IdPeriodoCapital: number;
}

export interface ICambiarInfoCreditoForm {
  sistema: FormControl<string | null>;
  sistemaSelect: FormControl<number | null>;
  periodoCapital: FormControl<string | null>;
  periodoCapitalSelect: FormControl<number | null>;
  periodoInteres: FormControl<string | null>;
  periodoInteresSelect: FormControl<number | null>;
  monto: FormControl<number | null>;

  tasaNominal: FormControl<number | null>;
  tasaEfectiva: FormControl<number | null>;
  plazo: FormControl<number | null>;
  plazoSelect: FormControl<number | null>;
  cuota: FormControl<number | null>;

  indicador: FormControl<string | null>;
  siglaIndicador: FormControl<string | null>;
  puntos: FormControl<number | null>;
  periodoGracia: FormControl<number | null>;
  reestrucutradoIndicador: FormControl<number | null>;
  acta: FormControl<number | null>;
}

export interface PeriodoPago {
  IdFrecuenciaPago: number;
  DescripcionFrecuenciaPago: string;
}

export interface LogGestionCreditoRequest {
  idOperacion: number;
  idModulo: number;
  jsonDto: any;
  idCuenta: number;
  idTercero: number;
  idObsCambioEstado?: string;
  aplicativo?: string;
}

export interface Reestructurados {
  Monto: number;
  Saldo: number;
  Cuota: number;
  Plazo: number;
  Tasa: number;
  Fecha: Date;
  Novedad: string;
  CalAct: string;
  CalAnt: string;
  Acta: number;
  Contador: number;
}

export interface Reliquidados {
  Monto: number;
  Saldo: number;
  Cuota: number;
  Plazo: number;
  Tasa: number;
  Fecha: Date;
  Novedad: string;
  FechaDesembolso: Date;
  TasaNominal: number;
  CuotaLibranza: number | null;
  Puntos: number | null;
  PeriodoGracia: number | null;
  FechaInicioGracia: Date | null;
}

export interface ReesRelResponse {
  Reestructuracion: Reestructurados[];
  Reliquidacion: Reliquidados[];
}


export interface LineaCambioListDto {
  IdLinea: number;
  NombreLinea: string;
}

export interface CambiarLineaCreditoDto {
  idCredito: number;
  nuevaLinea: number;
}

export interface ManejarSeguroCreditoDto {
  oficina: number;
  producto: number;
  consecutivo: number;
  digito: number;
  manejaSeguro: number;
  usuario: number;
  autoriza: number;
  novedad: number;
}

export interface CambiarFormaPagoDto {
  oficina: number;
  producto: number;
  consecutivo: number;
  digito: number;
  formaPagoActual: number;
  formaPagoNueva: number;
  ofiDtno?: number | null;
  proDtno?: number | null;
  conDtno?: number | null;
  digDtno?: number | null;
  usuario: number;
  autoriza: number;
  novedad: number;
}

export interface DebitoAutomaticoCreditoDto {
  NumeroCuenta : string;
  NumeroDocumento : string;
  Nombre  : string;
  Estado : string;
  SaldoCanje: number; 
  SaldoEfectivo: number; 
  SaldoTotal: number; 
}

export interface UltimaCalificacionDto {
    dtmFecha: Date
    strCumplimiento: string
    strRecalificacion: string
    strReestructurados: string
    strCualitativa: string
    strModelo: string
}

export interface CambiarCalificacionDto {
    idCuenta: number
    cumplimiento: string
    recalificacion: string
    reestructurado?: string
    cualitativa: string
    causal: number
    usuario: number
}

export interface GarantiaDisponible {
  Consecutivo: number;
  Matricula: string;
  Tipo: string;
  Clase: any;
  Descripcion: string;
  Respalda: any;
  Cobertura: string;
  IdTercero: number;
  CantidadCreditos: number;
  GrupoGarantia?: string | null;
}

export interface GarantiaRealAsignada {
  Consecutivo: number;
  Matricula: string;
  Tipo: string;
  Clase: any;
  Descripcion: string;
  Respalda?: any;
  Cobertura: string;
  IdTercero: any;
  TotalDeuda: number;
  CantidadCreditos: number;
  GrupoGarantia?: string | null;
  mostrarDetalle?: boolean;
  detalleCreditos?: any[];
}

export interface CambiarGarantiaDto {
  garantia: number;
  tipo: any;
  clase: any;
  valor: string;
  fecha?: string | null;
}

export interface CambiarGarantiasRequestDto {
  oficina: number;
  producto: number;
  consecutivo: number;
  digito: number;
  usuario: number;
  agregar: CambiarGarantiaDto[];
  eliminar: CambiarGarantiaDto[];
}

export interface DetalleGarantiaCreditoDto {
  Garantia: number;
  IdCuenta: number;
  Cuenta: string | null;
  Linea: number;
  NombreLinea: string | null;
  IdDeudor: string | null;
  NombreDeudor: string | null;
  ValorCredito: number;
  strMatricula: string | null;
}

export interface ObtenerCodeudorBasicoModel {
  IdTercero: number;
  NumeroDocumento : string;
  NombreCompleto : string;
}