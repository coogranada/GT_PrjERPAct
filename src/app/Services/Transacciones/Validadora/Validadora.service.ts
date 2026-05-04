import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidadoraService {

  private apiUrl = 'http://localhost:5000/print';

  constructor(private http: HttpClient) { }

  printData(data: any, validadoraStr: string) {
    const partes = validadoraStr.split('_');
    const tipo = partes[0];     // TMU295 o TMU675
    const puerto = partes[1];   // 0 o COM

    this.http.post(this.apiUrl, {
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

  checkService(): Promise<boolean> {
  return new Promise((resolve) => {
    this.http.get(this.apiUrl+'/health')
      .subscribe({
        next: () => resolve(true),
        error: () => resolve(false)
      });
  });
}

}