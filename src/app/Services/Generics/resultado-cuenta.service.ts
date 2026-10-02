import { Injectable } from '@angular/core';

export interface CuentaParseada {
  oficina: string;
  producto: string;
  consecutivo: string;
  digito: string;
}

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  parsearCuenta(texto: string): CuentaParseada | null {

    const partes = texto.trim().split('-');

    if (
      partes.length !== 4 ||
      !/^\d{1,3}$/.test(partes[0]) ||
      !/^\d{1,3}$/.test(partes[1]) ||
      !/^\d{1,7}$/.test(partes[2]) ||
      !/^\d{1}$/.test(partes[3])
    ) {
      return null;
    }

    return {
      oficina: partes[0],
      producto: partes[1],
      consecutivo: partes[2],
      digito: partes[3]
    };
  }
}