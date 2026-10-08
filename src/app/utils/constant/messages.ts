// messages.ts

export const ERP_MESSAGES = {
    REGISTRO_NO_ENCONTRADO: 'No se encontró registro.',
    FORMATO_CUENTA_INVALIDO: 'La cuenta debe tener el formato 000-000-0000000-0.',
    FECHA_MAYOR_ACTUAL: 'La fecha no puede ser mayor a la fecha actual.',
    FECHA_MENOR_PERMITIDA: 'La fecha no puede ser menor al 01/01/2000.',
    FILTRO_DUPLICADO: 'Filtro seleccionado ya existe.',
    ACTUALIZACION_DEMORADA: 'Asociado no se ha actualizado en los últimos 6 meses.',
    CUENTA_REQUERIDA: 'Debe buscar una cuenta para realizar esta operación.',
    CAMBIO_EXITOSO: 'El cambio de {0} se realizó correctamente.',
    CAMBIO_NO_REALIZADO: 'El cambio de {0} no se realizó correctamente.',
    PERSONA_VETADA_CONTACTO: 'Se encontraron coincidencias en la lista de <b>personas vetadas</b> por favor comuníquese con </b>',
    ASOCIADO_NO_ENCONTRADO: 'No se encontró el asociado.',
    CONSULTA_CREDITOS_ASOCIADOS_ERROR: 'No fue posible consultar los créditos asociados.',
    CAMPOS_REQUERIDOS: 'Debe seleccionar campos.',
    ERROR_INESPERADO: 'Ha ocurrido un error inesperado.',
    CUENTA_ESTADO_NO_VALIDO: 'Cuenta no se puede editar, estado no válido.',
    GARANTIA_NO_CUBRE_CREDITO: 'Garantía no cubre el valor del crédito.',
    VALOR_INGRESADO_FORMATO_INCORRECTO: 'El valor ingresado no tiene el formato correcto.',
};

export const ERP_TOAST = {
    WARNING: 'Advertencia',
    ERROR: 'Error',
    SUCCESS: 'Exitoso'
};