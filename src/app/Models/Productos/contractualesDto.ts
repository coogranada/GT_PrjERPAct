export class AdicionarPuntosDto{
    PuntosAdicionalesAnterior: string = "";
    PuntosAdicionalesActualiza: string  = "";
}

export class AdicionarEliminarAutorizadoDto{
    Accion: string = "";
    Documento: string = "";
    Nombre: string = "";
    TipoTitular: string = "";
    TipoFirma: string = "";
    FechaMatricula: string = "";
}
export class AperturaCuentaDto{
    OficinaAsociado : string = "";
    Documento   : string = "";
    Nombre : string = "";
    Oficina : string = "";
    producto : string = "";
    OperacionPermitida : string = "";
    Asesor : string = "";
    EstadoCuenta : string = "";
    AsesorExterno : string = "";
    FormaPago : string = "";
    NroTitulo : string = "";
    NroSorteo : string = "";
    Plazo : string = "";
    CuotaMes : string = "";
    ValorTotalPlan : string = "";
    Periodo : string = "";
    TipoCuentaDestino : string = "";
    CuentaAhorros : string = "";
    Indicardor : string = "";
    Puntos : string = "";
    PuntosAdicionales : string = "";
    TasaEfectiva : string = "";
    TasaNominal: string = "";
    Autorizados: any;
}
export class AsesorExternoDto{
    IdAsesorExternoAnterior : string = "";
    AsesorExternoAnterior : string = "";
    IdAsesorExternoActualiza : string = "";
    AsesorExternoActualiza : string = "";
}
export class CambiarEstadoDto{
    EstadoAnterior : string = "";
    EstadoActualiza : string = "";
}
export class CambiarFormaPagoDto{
    FormaPagoAnterior : string = "";
    FormaPagoActualiza : string = "";
}
export class CambiarNumeroTituloDto{
    NumeroTituloAnterior : string = "";
    NumeroTituloActualiza : string = "";
}
export class CambioCuentaTipoDestino{
    TipoCuentaDestinoAnterior : string = "";
    CuentaAhorrosAnterior : string = "";
    TipoCuentaDestinoActualiza : string = "";
    CuentaAhorroActualiza : string = "";
}