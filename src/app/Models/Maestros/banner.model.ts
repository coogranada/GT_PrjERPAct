export class BannerArrayModel {
    IdImagenBanner: number = 0;
    Base64String: String = "";
    UsuarioModifico: string = "";
    FechaCreacion: Date | null = null;
    FechaModificacion: Date | null = null;
    urlImg: string = "";
}
export class BannerModel {
    Base64String: String = "";
    urlImg: string = "";
    
}
export class UsuariosImagenModel {
    IdImagenUsuario: number = 0;
    Base64String: string | null = "";
    IdUsuario: number = 0;
    UsuarioModifico: string = "";
    FechaCreacion: Date | null = null;
    FechaModificacion: Date | null = null;
}
export class LogBannerModel {
    IdLogBanner: number = 0;
    IdTercero: number = 0;
    FechaModificacion: Date | null = null;
}
export class CardUserModel {
    ImgUser: string | null = "";
    NombreUsuario: string = "";
    Usuario: string = "";
    Identificacion: number = 0;
    Cumpleanos: string = "";
    Extencion: Date | null = null;
    Celular:  Date | null = null;
    Correo: string = "";
    Area: string = "";
    Cargo: string = "";
    Oficina: string = "";
}