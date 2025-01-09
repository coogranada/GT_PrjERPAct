export class ExportExcelModel {
    Codigo: number = 0;
    FechaSolicitud: number = 0;
    Remitente: number = 0;
    Destinatario: string = "";
    Modulo: string = "";
    Operacion: string = "";
    Estado: string = "";
    Documento: string = "";
    Observacion: string = "";
    ObservacionGestion: string = "";
    FechaActualizacion: string = "";
    Cuenta: string = "";
}

export class ExportExcelModelMovimientos {
    MES: string = "";
    DIA: string = "";
    OFICINA: string = "";
    TIPO_DE_TRANSACCION: string = "";
    NUMERO_TRANSACCION: string = "";
    RETIROS: string = "";
    DEPOSITO: string = "";
}