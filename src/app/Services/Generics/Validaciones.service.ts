export const ERP_REGEX = {
  EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  NUMERO: /^[0-9]*$/,
  DECIMAL_1: /^[0-9]+(.[0-9]{0,1})?$/,
  DECIMAL_2: /^[0-9]+(.[0-9]{0,2})?$/,
  DECIMAL_3: /^[0-9]+(.[0-9]{0,3})?$/,
  NUMERO_NEGATIVO: /^-?[0-9]*$/,
  DECIMAL_NEGATIVO_1: /^-?[0-9]+(.[0-9]{0,1})?$/,
  DECIMAL_NEGATIVO_2: /^-?[0-9]+(.[0-9]{0,2})?$/,
  DECIMAL_NEGATIVO_3: /^-?[0-9]+(.[0-9]{0,3})?$/,
  NIT: /(^[0-9]+-{0,1}[0-9]{0,1})/,
  RUTA_IMAGEN: /^[a-zA-Z0-9.-]+\.(jpg|png)$/i
};

export const ERP_MENSAJES = {
  FILTRO_DUPLICADO: 'Filtro seleccionado ya existe.',
  CAMPOS_REQUERIDOS: 'Debe seleccionar campos.',
  USUARIO_NO_EXISTE: 'El usuario no existe en el sistema.',
  SIN_REGISTROS: 'No se encuentran registros.',
  MODULO_REQUERIDO: 'Debe seleccionar primero un módulo.',
  OPERACION_REQUERIDA: 'Debe eliminar primero la operación.',
  MODULO_SIN_OPERACION: 'Módulo sin operación.',
  ERROR_CONSULTAR: 'Error al consultar.',
  ERROR_GENERAR_INFORME: 'Error al generar el informe.',
  FECHA_INVALIDA: 'La fecha no es válida.'
};


export const ERP_ALERTAS = {
  OFICINA_REQUERIDA: 'La oficina es obligatoria.',
  USUARIO_REQUERIDO: 'El usuario es obligatorio.',
  MODULO_REQUERIDO: 'El modulo es obligatorio.',
  OPERACION_REQUERIDA: 'La operación es obligatoria.'
};

export const ERP_VALIDACIONES = {
  ES_IGUAL: 'Es Igual',
  ENTRE: 'Entre'
};

export const ERP_FILTROS = {
  OFICINA: 3,
  USUARIO: 4,

  ASESORIA_OFICINA: 18,
  ASESORIA_USUARIO: 19,
  ASESORIA_MODULO: 20,
  ASESORIA_OPERACION: 21,

  BANNER_USUARIO: 22,

  FECHA_ASESORIA: -2,
  FECHA_BANNER: -3,
  FECHA_AUTENTICACION: -4
};

export const ERP_TOAST = {
  TITULO_ADVERTENCIA: 'Advertencia',
  TITULO_ERROR: 'Error',
  TITULO_EXITO: 'Éxito'
};