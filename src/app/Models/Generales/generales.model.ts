export interface TiposDocumentoResponse {
    Clase: number;
    Descripcion: string;
}

export interface AsociadoResponse {
    TipoDocumento: number;
    NumeroDocumento: string;
    PrimerApellido: string;
    SegundoApellido: string;
    PrimerNombre: string;
    SegundoNombre: string;
}