export interface ConsultarCreditosGarantiasResponse {
    idTercero: number;
    numeroDocumento: string;
    nombreAsociado: string;
    idCuenta: number;
    idOficinaCuenta: number;
    idProducto: number;
    idConsecutivo: number;
    idDigito: number;
    cuenta: string;
    idLinea: number;
    linea: string;
    codigoNombreLinea: string;
    sigla: string | null;
    saldoDeuda: number;
    plazo: number;
    idEstado: number;
    estado: string;
    fechaApertura: string;
    fechaCancelacion: string | null;
    idGarantiaCredito: number | null;
    idTipoGarantia: number | null;
    esCreditoPadreCTD: boolean;
    cantidadCreditosHijos: number;
    saldoPadreCTD: number | null;
    saldoHijosCTD: number | null;
    cupoAprobadoCTD: number | null;
}

export interface GarantiaDisponible {
    consecutivo: number;
    matricula: string;
    tipo: string;
    respalda: number;
    cobertura: number;
    clase: string;
    cantidadCreditos: number;
    grupoGarantia: string;
    descripcion: string;
    fechaUltimoAvaluo: string | null;
    fechaMatricula: string | null;
    propietariosGarantia: string;
}

export interface GarantiaAsignada {
    consecutivo: number;
    matricula: string;
    tipo: string;
    respalda: number;
    cobertura: number;
    totalDeuda: number;
    clase: string;
    cantidadCreditos: number;
    grupoGarantia: string;
    idTercero: number;
    descripcion: string;
    fechaUltimoAvaluo: string | null;
    fechaMatricula: string | null;
    propietariosGarantia: string;
}

export interface CodeudorBasico {
    idTercero: number;
    numeroDocumento: string;
    nombreCompleto: string;
}

