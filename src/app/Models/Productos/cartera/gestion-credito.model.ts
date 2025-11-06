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
    Sigla: string;
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
  NumeroDocumento: string;
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
  OficinaCuenta: string;
  EstaSinCobertura: boolean;
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
  Nombres: string;
  PrimerApellido: string;
  SegundoApellido: string;
  NumeroDocumento: string;
  TelResidencia: string | null;
  TelEmpresa: string | null;
}

export interface GarantiaReal {
  Clase: string;
  Garantia: string;
  ValorCobertura: number;
  ValorRespalda: number;
  VctoPoliza: string; 
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