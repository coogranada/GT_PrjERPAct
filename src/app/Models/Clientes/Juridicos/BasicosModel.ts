export class BasicosModel {
    IdJuridicoInfo: number = 0;
    IdCiudad: number | null = 0;
    IdOficina: number = 0;
    IdRelacion: number = 0;
    IdEstado: number = 0;
    IdActividadEconomica: number = 0;
    IdJuridico: number = 0;
    FechaConstitucion: Date | null = null;
    CIIU: string = "";
    ConocioCoogranada: number = 0;
    Estrato: number = 0;
    IdObjetoSocial: number = 0;
    IdTipoLocal: number = 0;
    IdTipoSociedad: number = 0;
    DebitoAutomatico: Boolean = false;
    IdAsesorExterno: number = 0;
    Proveedor: string = "";

    IdAsesorMatriculo: number = 0;
    FechaMatricula: string = "";

    IdAsesorModifica: number = 0;
    FechaModificacion: string | null = "";

    IdAsesorRetira: number = 0;
    FechaRetiro: string | null = "";
    OtroPor: string = "";
    IdRepresentante: number = 0;
    IdPais: number | null = 0;
}
