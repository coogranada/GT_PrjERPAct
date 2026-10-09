import { FormControl } from "@angular/forms"
import {  FormaPagoEnum, GarantiaEnum, PeriodoPagoEnum, TipoSistemas } from "../../Productos/cartera/gestion-credito.enum";
import { CriterioBusquedaAsesoria } from "./gestion-credito-enum";


export interface AsesoriaEncabezadoForm {
    idOficinaAsociado: FormControl<number | null>;
    nombreOficinaAsociado: FormControl<string>;
    asesoria: FormControl<number | null>;
    tipoDocumento: FormControl<string>;
    numeroDocumento: FormControl<string>;
    nombreAsociado: FormControl<string>;
    criterioBusqueda: FormControl<CriterioBusquedaAsesoria>;
    busqueda: FormControl<string>;
    estado: FormControl<string>;
    relacion: FormControl<string>;
    idOficina: FormControl<number | null>;
    nombreOficina: FormControl<string>;
}

export interface NegociacionForm {
    idProducto: FormControl<number | null>;
    producto: FormControl<string>;
    idLinea: FormControl<number | null>;
    linea: FormControl<string>;
    idSistema: FormControl<TipoSistemas | null>;
    sistema: FormControl<string>;
    idFormaPago: FormControl<FormaPagoEnum | null>;
    formaPago: FormControl<string>;
    idPeriodoCapital: FormControl<PeriodoPagoEnum | null>;
    periodoCapital: FormControl<string>;
    idPeriodoInteres: FormControl<PeriodoPagoEnum | null>;
    periodoInteres: FormControl<string>;
    monto: FormControl<number | null>;
    plazo: FormControl<number | null>;
    periodoGracia: FormControl<number | null>;
    idGarantia: FormControl<GarantiaEnum | null>;
    garantia: FormControl<string>;
    idTipoGarantia: FormControl<number | null>;
    tipoGarantia: FormControl<string>;
    idAsesor: FormControl<number | null>;
    nombreAsesor: FormControl<string>;
    idAsesorExterno: FormControl<number | null>;
    nombreAsesorExterno: FormControl<string>;
    tasaPeriodica: FormControl<number | null>;
    tasaNominal: FormControl<number | null>;
    tasaEfectiva: FormControl<number | null>;
    indicador: FormControl<string>;
    puntos: FormControl<number | null>;
    // cuota: FormControl<number | null>;
}

export interface Asesor {
    Nombre: string;
    intAreaTipo: number;
    intIdAsesor: number;
    lngTercero: number;
}

export interface BuscarAsesorRequest {
    strCodigo: number | null;
    strNombre: string | null;
}

export interface BuscarAsesoriasResponse {
    idAsesoria: number;
    idTercero: number;
    documento: string;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    idEstado: number;
    estado: string;
    fechaMatricula: string;
    idLinea: number;
}

export interface BuscarAsesoriasResponseTabla {
    Asesoria: number;
    Documento: number;
    ['Nombre Asociado']: string;
    Estado: string;
    Fecha: Date;
    Linea: string;
}

export interface ConsultarAsesoriaResponse {
    idAsesoria: number;
    idTercero: number;
    idOficinaAsociado: number;
    oficinaAsociado: string;
    idRelacion: number;
    relacion: string;
    idTipoDocumento: number;
    documento: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    idEstado: number;
    estado: string;
    fechaMatricula: string;
    idLinea: number;
    idOficinaAsesoria: number;
    oficinaAsesoria: string;
}

export interface ConsultarNegociacionAsesoriaCreditoResponse {
    idProducto: number;
    producto: string;
    idLinea: number;
    linea: string;
    idSistema: number;
    sistema: string;
    idFormaPago: number;
    formaPago: string;
    idPeriodoCapital: number;
    periodoCapital: string;
    idPeriodoInteres: number;
    periodoInteres: string;
    monto: number;
    plazo: number;
    diasGracia: number;
    idGarantia: number;
    garantia: string;
    idAsesor: number;
    primerNombreAsesor: string;
    segundoNombreAsesor: string;
    primerApellidoAsesor: string;
    segundoApellidoAsesor: string;
    idAsesorExterno: number;
    primerNombreAsesorExterno: string;
    segundoNombreAsesorExterno: string;
    primerApellidoAsesorExterno: string;
    segundoApellidoAsesorExterno: string;
    tasaPeriodica: number;
    tasaNominal: number;
    tasaEfectiva: number;
    idIndicador: number;
    siglaIndicador: string;
    indicador: string;
    puntos: number;
    cuota: number;
}

export interface DeduciblesResponse {
    idProducto: number;
    idLinea: number;
    codigo: number;
    nombre: string;
    obliga: string;
    plazo: number;
    valor: number;
    cuota: number;
    esDiferidos: boolean;
    formula: string;
}

export interface SaldosVigentesResponse {
  intOficina: number;
  intProducto: number;
  lngConsecutivo: number;
  intDigito: number;

  curEfectivo: number;
  curIntVencidos: number;
  curIntMora: number;
  curCanje: number;

  saldoTotalDeuda: number; 

  lngRadicado: number;
  curCuota: number;

  intLinea: number;
  lngIdCuenta: number;
}
