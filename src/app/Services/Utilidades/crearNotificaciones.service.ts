import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class CrearNotificacionesService {
  public url: string = "";
  constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    ObtenerCuentas(PNumeroDocumento: number): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerCuentasNotificaciones?PsrtNumeroDocumento=${PNumeroDocumento}`;
      return this._http.get<any>(this.url);
    }
    FiltrarCuentas(Documento: number): Observable<any> {
      this.url = `${this.environment.Url}/FiltrarCuentasNotificaciones?PsrtNumeroDocumento=${Documento}`;
      return this._http.get<any>(this.url);
    }
    ObtenerTarjeta(PCuenta: number): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerTarjetasNotificaciones?PsrtCuenta=${PCuenta}`;
      return this._http.get<any>(this.url);
    }
    ObtenerTipoNotificaciones(): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerTiposNotificacionNotificaciones`;
      return this._http.get<any>(this.url);
    }
    ObtenerEstadosTarjetas(): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerEstadosTarjetasNotificaciones`;
      return this._http.get<any>(this.url);
    }
    ObtenerEstadosCuentas(): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerEstadosCuentasNotificaciones`;
      return this._http.get<any>(this.url);
    }
    CrearNotificacion(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/CrearNotificacionNotificaciones`;
      return this._http.post<any>(this.url, Datos);
    }
}
