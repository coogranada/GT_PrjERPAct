import { Injectable } from '@angular/core';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()

export class DiferenciasSaldosService {
  private url: string = "";

  constructor(
      private _http: HttpClient,
      private environment: EnvironmentService) { }

  ConsultarDiferencias(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/ConsultarDiferencias`;
    return this._http.post<any>(this.url, Datos);
  }
  CrearNotificaciones(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/CrearNotificacionesDiferencias`;
    return this._http.post<any>(this.url, Datos);
  }
}
