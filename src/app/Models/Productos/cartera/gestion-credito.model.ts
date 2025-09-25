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
  IdOficinaCliente: number;
  OficinaCliente: string;
  NumeroDocumento: string;
  NombreProducto: string;
  Linea: string;
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