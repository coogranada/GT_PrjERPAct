import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable,map } from 'rxjs';
@Injectable()
export class TarjetaHabientesService {
  private url: string = "";
  constructor(private _http: HttpClient,private environment: EnvironmentService) { }

  ConsultarAsociado(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/ConsultarAsociado`;
    return this._http.post<any>(this.url, Datos);
  } 
  ConsultarCuentas(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/ConsultarCuentas`;
    return this._http.post<any>(this.url, Datos);
  } 
  ConsultarTarjetas(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/ConsultarTarjetas`;
    return this._http.post<any>(this.url, Datos);
  } 
  ConsultarTarjetasCuentas(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/ConsultarTarjetasCuentas`;
    return this._http.post<any>(this.url, Datos);
  }
  ConsultarCanales(Datos: any): Observable<any> {
   this.url = `${this.environment.Url}/ConsultarCanales`;
   return this._http.post<any>(this.url, Datos);
  } 
  DesbloquerarTarjeta(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/DesbloquerarTarjeta`;
      return this._http.post<any>(this.url, Datos);
  }
}
