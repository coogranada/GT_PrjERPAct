import { CuentaCarteraDetalle, DatosForm, PeriodoPago } from "./gestion-credito.model";

export interface CambiarInfoCreditoContext {
    detalleCredito: CuentaCarteraDetalle & {
        monto: number;
        cuota: number;
        fechaVencimiento: Date;
    };
    datosFormData: DatosForm;
    operacion: Operacion;
    periodosPago: PeriodoPago[];
}

export enum Operacion {
    CambiarTasa = '130',
    CambiarCuota = '132',
    CambiarPlazo = '135',
    CambiarSistema = '139',
    ReestructurarCambioPlazo = '140',
    DevolverReestructuracion = '143',
}

export enum Novedad {
    CambiarTasa = 93,
    CambiarPlazo = 94,
    CambiarCuota = 111,
    CambiarSistema = 262,
    DevolverReestructuracion = 112
}
