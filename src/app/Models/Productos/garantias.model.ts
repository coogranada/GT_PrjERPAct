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

export interface GarantiaDisponible {
  Consecutivo: number;
  Matricula: string;
  Tipo: string;
  Clase: string;
  Descripcion: string;
  Respalda: number;
  Cobertura: string;
  IdTercero: number;
  CantidadCreditos: number;
  GrupoGarantia?: string | null;
}

export interface GarantiaRealAsignada {
  Consecutivo: number;
  Matricula: string;
  Tipo: string;
  Clase: string;
  Descripcion: string;
  Respalda?: number;
  Cobertura: string;
  IdTercero: number;
  TotalDeuda: number;
  CantidadCreditos: number;
  GrupoGarantia?: string | null;
  mostrarDetalle?: boolean;
  detalleCreditos?: any[];
}

export interface GarantiaCompartida {
  lngConsecutivo: number;
  IdGarantia: string;
  IdGarantiaBase?: number | null;
  IdGarantiaBaseExterna: string;
  CreditoIntermedio?: string | null;
  Clase: string;
  Cobertura: number;
  Respalda: number;
  Tipo: string;
  lngTercero: number;
  CantidadCreditos: number;
  GrupoGarantia?: string;
  Descripcion: string;
}

export interface CambiarGarantiaDto {
  garantia: number;
  tipo: string;
  clase: string;
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
  NumeroDocumento: string;
  NombreCompleto: string;
}

export interface ResultadoOperacionDto {
  $id?: string;
  Exitoso: boolean;
  Mensaje: string;
}