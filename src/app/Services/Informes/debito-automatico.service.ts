import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebitosAutomaticosService {
  private url: string = "";
  constructor(private _http: HttpClient,private environment: EnvironmentService) { }

  ObtenerDebitos(IdCuenta: string): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerDebitoRegistrados?PstrIdCuenta=${IdCuenta}`;
    return this._http.get<any>(this.url);
  }
  ObtenerCuentas(Documento: string): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerCuentasDebitos?PstrDocumento=${Documento}`;
    return this._http.get<any>(this.url);
  }
}
