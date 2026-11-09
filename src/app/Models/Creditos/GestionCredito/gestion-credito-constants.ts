import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { PeriodoPagoEnum, TipoSistemas } from "../../Productos/cartera/gestion-credito.enum";
import { CriterioBusquedaAsesoria } from "./gestion-credito-enum";

export const CRITERIOS_BUSQUEDA_ASESORIA = {
    [CriterioBusquedaAsesoria.PorAsesoria]: 'asesoria',
    [CriterioBusquedaAsesoria.PorRadicado]: 'radicado',
    [CriterioBusquedaAsesoria.PorDocumento]: 'documento',
    [CriterioBusquedaAsesoria.PorNombre]: 'nombre',
}

export const SISTEMAS = [
    { id: TipoSistemas.CuotaFija, descripcion: 'Cuota Fija' },
    { id: TipoSistemas.CuotaFijaTasaVariable, descripcion: 'Cuota Fija Tasa Variable' },
    { id: TipoSistemas.CuotaVariable, descripcion: 'Cuota Variable' },
    { id: TipoSistemas.CuotaVariableTasaVariable, descripcion: 'Cuota Variable Tasa Variable' },
]

export const PERIODOS_MESES = {
    30: 1,
    35: 2,
    40: 3,
    45: 4,
    50: 6,
    55: 12,
    60: 0
};

export const SISTEMAS_PERMITIDOS: Record<number, number[]> = {
    1: [1, 2],
    2: [1, 2],
    3: [3],
    4: [3, 4],
};

export const periodosCompatiblesValidator: ValidatorFn = (
    group: AbstractControl
): ValidationErrors | null => {

    const periodoCapital = group.get('selectPeriodoCapital')?.value;
    const periodoInteres = group.get('selectPeriodoInteres')?.value;

    if (!periodoCapital || !periodoInteres) {
        return null;
    }

    if (periodoInteres === PeriodoPagoEnum.AlVencimiento) {
        return null;
    }

    const mesesCapital =
        PERIODOS_MESES[periodoCapital as keyof typeof PERIODOS_MESES];

    const mesesInteres =
        PERIODOS_MESES[periodoInteres as keyof typeof PERIODOS_MESES];

    if (!mesesCapital || !mesesInteres) {
        return null;
    }

    if (mesesInteres > mesesCapital) {
        return {
            interesMayorQueCapital: true
        };
    }

    if (mesesCapital % mesesInteres !== 0) {
        return {
            periodoNoEsMultiplo: true
        };
    }

    return null;
};

