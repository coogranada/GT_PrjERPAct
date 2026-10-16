
import {CriterioBusquedaAsesoria, TipoSistemas} from '../../Models/Productos/cartera/gestion-credito.enum';

export const PERIODOS_MESES = {
    30: 1,
    35: 2,
    40: 3,
    45: 4,
    50: 6,
    55: 12,
    60: 0
};

export const SISTEMAS = [
    {
        id: TipoSistemas.CuotaFija,
        descripcion: 'Cuota Fija'
    },
    {
        id: TipoSistemas.CuotaFijaTasaVariable,
        descripcion: 'Cuota Fija Tasa Variable'
    },
    {
        id: TipoSistemas.CuotaVariable,
        descripcion: 'Cuota Variable'
    },
    {
        id: TipoSistemas.CuotaVariableTasaVariable,
        descripcion: 'Cuota Variable Tasa Variable'
    }
];

export const CRITERIOS_BUSQUEDA_ASESORIA = {
    [CriterioBusquedaAsesoria.PorAsesoria]: 'asesoria',
    [CriterioBusquedaAsesoria.PorRadicado]: 'radicado',
    [CriterioBusquedaAsesoria.PorDocumento]: 'documento',
    [CriterioBusquedaAsesoria.PorNombre]: 'nombre',
}

export const ERP_VALIDACIONES = {
    ES_IGUAL: 'Es Igual',
    ENTRE: 'Entre'
};