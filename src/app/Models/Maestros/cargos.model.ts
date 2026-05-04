export class CargosModel {
    lista: {
        NombreEstado: string,
        IdLista: number,
        Valor: string,
        Descripcion: string,
        IdEstado: number,
        CodListProveedor: string
   } | undefined;
   IdCargo: number = 0;
   Nombre: string = "";
   Descripcion: string = "";
   IdEstado: boolean = false;
}
