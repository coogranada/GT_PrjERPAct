// tslint:disable-next-line:class-name
export class GestionModel {
    IdUsuarioSolicita: number = 0;
    NombreUsuarioSolicita: string = "";
    IdUsuarioRecibe: number = 0;
    NombreUsuarioRecibe: string = "";
    IdModulo: number = 0;
    IdOperacion: number = 0;
    NombreOperacion: string = "";
    IdEstado: number = 0;
    NombreEstado: string = "";
    Documento: string = "";
    Observacion: string = "";
    ObjCuenta:  { // se debe enviar esta informacion de la cuenta
        IdOficina: number;
        IdProducto: number;
        IdConsecutivo: number;
        IdDigito: number;
    } | undefined;
    Cuenta: string = ""; // Cuenta generada con 0 y seprador -
    urlModulo: string | undefined = "";
}
export class GestionModelLog {
    IdUsuarioSolicita: number = 0;
    NombreUsuarioSolicita: string = "";
    IdUsuarioRecibe: number = 0;
    NombreUsuarioRecibe: string = "";
    IdModulo: number = 0;
    IdOperacion: number = 0;
    NombreOperacion: string = "";
    IdEstado: number = 0;
    NombreEstado: string = "";
    Documento: string = "";
    Observacion: string = "";
    ObjCuenta : {
        IdCuenta: number;
        IdOficina: number;
        IdProducto: number;
        IdConsecutivo: number;
        IdDigito: number;
    } | undefined;
    Cuenta: string = ""; // Cuenta generada con 0 y seprador -
    ObservacionGestion: string = "";
    FechaSolicitud: string = "";
    IdGestionOperacion: number = 0;
}

export class GestiarModel {
    IdGestionOperacion: number = 0;
    IdEstado: number = 0;
    ObservacionGestion: string = "";
    FechaActualizacion: string | null = "";
    IdUsuarioRecibe: number = 0;
    IdUsuarioEnvie: number  = 0;
    CancelacionDto: any = {};
    ReasinacionDto: any = {};
    GestionDto: any = {};
}

export class GestionarCancelacionDto {
    UsuarioSolicita: string = "";
    UsuarioRecibe: string = "";
    IdUsuarioRecibe: number = 0;
    FechaSolicitud: string = "";
    IdGestionOperacion: number = 0;
    Estado: string = "";
    NombreOperacion: string = "";
    Cuenta: string = "";
    Documento: string = "";
    Observacion: string = "";
}

export class GestionarReasignacionDto {
    UsuarioSolicita: string = "";
    UsuarioRecibeViejo: string = "";
    IdUsuarioRecibeViejo: number = 0;
    UsuarioRecibeNuevo: string = "";
    IdUsuarioRecibeNuevo: number = 0;
    FechaSolicitud: string = "";
    IdGestionOperacion: number = 0;
    Estado: string = "";
    NombreOperacion: string = "";
    Cuenta: string = "";
    Documento: string = "";
    Observacion: string = "";
    urlModulo: string | undefined = "";
}

export class GestionesGestionadasDto {
    UsuarioSolicita: string = "";
    UsuarioRecibe: string = "";
    IdUsuarioRecibe: number = 0;
    FechaSolicitud: string = "";
    IdGestionOperacion: number = 0;
    Estado: string = "";
    NombreOperacion: string = "";
    Cuenta: string = "";
    Documento: string = "";
    Observacion: string = "";
}
