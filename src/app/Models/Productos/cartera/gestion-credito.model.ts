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