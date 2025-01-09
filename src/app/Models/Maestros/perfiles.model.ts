export class PerfilesModel {
    lista: {
        NombreEstado: string,
        IdLista: number,
        Valor: string,
        Descripcion: string,
        IdEstado: number,
        CodListProveedor: string
   } | undefined;
   IdPerfil: number = 0;
   Nombre: string = "";
   Descripcion: string = "";
   IdEstado: boolean = false;
}
