import { TipoSistemas } from "../Models/Productos/cartera/gestion-credito.enum";

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

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
    [ErrorCode.PERSONA_VETADA]: 'Se encontraron coincidencias en la lista de personas vetadas.',
    [ErrorCode.PERSONA_FALLECIDA]: 'Persona con estado fallecido.',
    [ErrorCode.PERSONA_MENOR]: 'El codeudor no puede ser menor.',
    [ErrorCode.ACTUALIZACION_DEMORADA]: 'Asociado no se ha actualizado en los últimos 6 meses.',
    [ErrorCode.CUPO_TARJETA_DEBITO]: 'No se puede realizar esta operación, tarjeta débito.',
    [ErrorCode.INTERESES_AL_DIA]: 'Debe ponerse al día con los intereses.',
    [ErrorCode.CUENTA_CANCELADA]: 'Cuenta no se puede editar, estado no válido.',
    [ErrorCode.CUENTA_VENCIDA]: 'Cuenta no se puede editar, crédito vencido.',
    [ErrorCode.TASA_USURA]: 'Las tasas de la línea no cumplen con las condiciones.',
    [ErrorCode.PERIODOS_NO_CUMPLEN]: 'Periodos no cumplen con las condiciones.',
    [ErrorCode.SALDO_MONTO_NO_CUMPLE]: 'No puede cambiar cuota. Crédito no cumple con las condiciones.',
    [ErrorCode.CREDITO_NO_CUMPLE]: 'Crédito no cumple con las condiciones.',
    [ErrorCode.OTRA_OFICINA]: 'La cuenta pertenece a otra oficina.',
    [ErrorCode.PLAZO_NUEVO_MAYOR]: 'El nuevo plazo debe ser mayor al faltante.',
};

export const PERIODOS_MESES = {
    30: 1,
    35: 2,
    40: 3,
    45: 4,
    50: 6,
    55: 12,
    60: 0
};

export const SISTEMAS = [
    { id: TipoSistemas.CuotaFija, descripcion: 'Cuota Fija' },
    { id: TipoSistemas.CuotaVariable, descripcion: 'Cuota Variable' }
]