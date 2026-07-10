import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChequeDTO } from '../../../Models/Transacciones/TransaccionesCaja/Cheque.model';

@Injectable({
  providedIn: 'root'
})
export class ValidadoraService {

  private apiUrl = 'http://localhost:5001/print';

  constructor(private http: HttpClient) { }

  printData(data: any, validadoraStr: string) {
    const partes = validadoraStr.split('_');
    const tipo = partes[0];     // TMU295 o TMU675
    const puerto = partes[1];   // 0 o COM

    this.http.post(this.apiUrl + '/print', {
      tipo: tipo,
      puerto: puerto,
      data: {
        Fecha: String(data.Fecha),
        Cajero: data.Cajero,
        Cuenta: data.Cuenta,
        Efectivo: data.Efectivo,
        Cheque: data.Cheque,
        Transaccion: String(data.Transaccion),
        NombreTransaccion: data.NombreTransaccion,
        NombreProducto: data.NombreProducto
      }
    }).subscribe({
      next: r => console.log('OK', r),
      error: e => console.error('ERROR', e)
    });
  }

  printDataRelCheque(data: ChequeDTO[], validadoraStr: string) {
    const partes = validadoraStr.split('_');
    const tipo = partes[0];     // TMU295 o TMU675
    const puerto = partes[1];   // 0 o COM

    var cheque = data.map(c => ({
      IdBanco: String(c.idBanco),
      Banco: String(c.idBanco),
      NumeroCheque: String(c.numeroCheque),
      CuentaCorriente: String(c.cuentaCorriente),
      Valor: c.valorCheque,
      Remesa: String(c.descripcionRemesa)
    }));

    this.http.post(this.apiUrl + '/PrintRelCheque' , {
      tipo: tipo,
      puerto: puerto,
      relacioncheques: cheque
    }).subscribe({
      next: r => console.log('OK', r),
      error: e => console.error('ERROR', e)
    });
  }

  checkService(): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.get(this.apiUrl + '/health')
        .subscribe({
          next: () => resolve(true),
          error: () => resolve(false)
        });
    });
  }

}