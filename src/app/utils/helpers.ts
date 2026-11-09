import { HttpParams } from "@angular/common/http";
import { FormGroup } from "@angular/forms";
import { SISTEMAS_PERMITIDOS } from "../Models/Creditos/GestionCredito/gestion-credito-constants";
import { SISTEMAS } from "./constant/enums";
import { TipoSistemas } from "../Models/Productos/cartera/gestion-credito.enum";

export function buildParams(dto: any): HttpParams {
    let params = new HttpParams();

    Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params = params.set(key, String(value));
        }
    });

    return params;
}

export function diferenciaEnDias(inicio: Date, fin: Date): number {
    const d1 = Math.min(30, inicio.getDate());
    const d2 = Math.min(30, fin.getDate());

    return (fin.getFullYear() - inicio.getFullYear()) * 360 +
        (fin.getMonth() - inicio.getMonth()) * 30 +
        (d2 - d1);
}

export function diferenciaEnMeses(inicio: Date, fin: Date): number {
    return Math.floor(diferenciaEnDias(inicio, fin) / 30);
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K))
  ) as Omit<T, K>;
}

export function concatWithSpace(...args: string[]): string {
  return args.filter(Boolean).map(s => String(s).trim().replace(/\s{2,}/g, ' ')).join(' ');
}

export function obtenerEstadoFormulario(form: FormGroup) {
  return Object.entries(form.controls).reduce(
    (acc, [key, control]) => {
      acc[key] = {
        value: control.value,
        disabled: control.disabled
      };

      return acc;
    },
    {} as Record<string, { value: unknown; disabled: boolean }>
  );
}

export function obtenerSistemasPermitidos(idSistemaProducto: number) {
  const permitidos = SISTEMAS_PERMITIDOS[idSistemaProducto] ?? [];
  return SISTEMAS.filter(x => permitidos.includes(x.id));
}