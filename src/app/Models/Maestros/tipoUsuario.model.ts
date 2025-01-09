export class TipoUsuarioModel {
    lista: {
        NombreEstado: string,
        IdLista: number,
        Valor: string,
        Descripcion: string,
        IdEstado: number,
        CodListProveedor: string
   } | undefined;
   IdTipoUsuario: number = 0;
   Nombre: string = "";
   Descripcion: string = "";
   IdEstado: boolean = false;
}

