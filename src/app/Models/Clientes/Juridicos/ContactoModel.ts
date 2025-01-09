export class ContactoModel {
    IdJuridicoContacto: number = 0;
    IdTipoContacto: number = 0;
    Descripcion: string = "";
    IdTercero: number = 0;
    IdPais: number = 0;
    IdDepartamento: number = 0;
    IdCiudad: number = 0;
    IdBarrio: number = 0;
    ContactoPrincipal: boolean = false;
    Correspondencia: boolean = false;
    DescripcionIds: string = "";
}

export class ContactoModelNatu {
    IdDatoContacto: number = 0;
    IdTipoContacto: number = 0;
    Descripcion: string = "";
    IdTercero: number = 0;
    IdPais: number | null = 0;
    IdDepartamento: number = 0;
    IdCiudad: number | null = 0;
    IdBarrio: number = 0;
    ContactoPrincipal: boolean = false;
    Correspondencia: boolean = false;
    DescripcionIds: string = "";
    Usuario: string = "";
    Oficina: string = "";
}