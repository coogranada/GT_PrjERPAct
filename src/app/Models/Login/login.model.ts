export class LoginModel {
   Usuario: string = "";
   Clave: string = "";
}
export class SessionUser {
   IdSesionxUsuario: number = 0;
   Estado: boolean = false;
   IdUsuario: number = 0;
   FechaInicioSesion: string | null = "";
   Oficina: string = "";
}
