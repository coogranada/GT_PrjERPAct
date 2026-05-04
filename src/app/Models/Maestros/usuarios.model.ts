export class UsuariosModel {
     strDocumento: string = "";
     strNombre: string = "";
     intIdUsuario: number = 0;
     strUsuario: string = "";
     intIdArea: number = 0;
     strArea: string = "";
     intIdCargo: number = 0;
     strCargo: string = "";
     intIdOficina: number = 0;
     strOficina: string = "";
     strNumeroOficina: string = "";
     intIdTipoUsuario: number = 0;
     strTipoUsuario: string = "";
     strEmail: string = "";
     dtFechaNacimiento: string = "";
     intIdTipoDocumento: number = 0;
     strTipoDocumento: string = "";
     strExtension: string = "";
     strSW: string = "";
     strMensaje: string = "";
     intIdEstado: string = "";
     ltPerfiles: {
        objLista: {
            intIdLista: number,
            strValor: string,
            strDescripcion: string,
            intIdTipoLista: number,
            strCodListProveedor: string,
            intIdEstado: number,
            strNombreEstado: string
        }
        IdPerfil: number,
        IdEstado: number,
        Descripcion: string,
        Nombre: string,
    } | undefined;
    intIdAsesor: number = 0;
}