export enum TipoBusquedaResumen {
    Documento = 1,
    Nombre = 2,
    Pagare = 3,
    IdCuenta = 4,
    NumeroCuenta = 5
}

export enum Tabs {
    Datos = 'datos',
    Saldos = 'saldos',
    ValorCuota = 'valorCuota',
    Garantias = 'garantias',
    Deducibles = 'deducibles',
    Provision = 'provision',
    Calificacion = 'calificacion',
    Cobros = 'Cobros', 
    Cambios = 'Cambios',
    Referencias = 'referencias',
    Cupo = 'cupo',
    Historial = 'historial',
}
export enum TipoSistemas {
    CuotaFija = 1,
    CuotaVariable = 2,
    CuotaFijaTasaVariable = 3,
    CuotaVariableTasaVariable = 4,
}

export enum FormaPagoEnum {
  Caja = 0,
  Debito = 1,
  Nomina = 2
}

export enum GarantiaEnum {
  Admisible = 5,
  NoAdmisible = 10,
}

export enum PeriodoPagoEnum {
    Dia = 5,
    Semana = 10,
    Decada = 15,
    Catorcena = 20,
    Quincena = 25,
    Mes = 30,
    Bimestre = 35,
    Trimestre = 40,
    Cuatrimestre = 45,
    Semestre = 50,
    Anio = 55,
    AlVencimiento = 60
}

export enum ErrorCode {
    PERSONA_VETADA = 'PERSONA_VETADA',
    PERSONA_FALLECIDA = 'PERSONA_FALLECIDA',
    PERSONA_MENOR = 'PERSONA_MENOR',
    ACTUALIZACION_DEMORADA = 'ACTUALIZACION_DEMORADA',
    CUPO_TARJETA_DEBITO = 'CUPO_TARJETA_DEBITO',
    INTERESES_AL_DIA = 'INTERESES_AL_DIA',
    CUENTA_CANCELADA = 'CUENTA_CANCELADA',
    CUENTA_VENCIDA = 'CUENTA_VENCIDA',
    TASA_USURA = 'TASA_USURA',
    PERIODOS_NO_CUMPLEN = 'PERIODOS_NO_CUMPLEN',
    SALDO_MONTO_NO_CUMPLE = 'SALDO_MONTO_NO_CUMPLE',
    CREDITO_NO_CUMPLE = 'CREDITO_NO_CUMPLE',
    OTRA_OFICINA = 'OTRA_OFICINA',
    PLAZO_NUEVO_MAYOR = 'PLAZO_NUEVO_MAYOR',

}