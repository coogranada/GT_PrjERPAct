import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class fichaAnalisisService {
  private url: string = "";

  constructor(private _http: HttpClient,private environment: EnvironmentService) { }
  BuscarRadicado(NroRadicado: string): Observable<any> {
    this.url = `${this.environment.Url}/BuscarRadicado?NroRadicado=${NroRadicado}`;
    return this._http.get<any>(this.url);
  }
  BuscarRadicadoOpBuscar(NroRadicado: string): Observable<any> {
    this.url = `${this.environment.Url}/BuscarRadicadoOpBuscar?NroRadicado=${NroRadicado}`;
    return this._http.get<any>(this.url);
  }
  BuscarInfoCodeudor(NroRadicado: string): Observable<any> {
    this.url = `${this.environment.Url}/BuscarInfoCodeudor?NroRadicado=${NroRadicado}`;
    return this._http.get<any>(this.url);
  }
  BuscarInfoCodeudorOpBuscar(NroRadicado: string): Observable<any> {
    this.url = `${this.environment.Url}/BuscarInfoCodeudorOpBuscar?NroRadicado=${NroRadicado}`;
    return this._http.get<any>(this.url);
  }
  BuscarInfoFinanciera(IdAsociado: string): Observable<any> {
    this.url = `${this.environment.Url}/BuscarInfoFinanciera?IdAsociado=${IdAsociado}`;
    return this._http.get<any>(this.url);
  }
  setFADeudor(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/setFADeudor`;
    return this._http.post<any>(this.url, Datos);
  } 
  setFACodeudor(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/setFACodeudor`;
    return this._http.post<any>(this.url, Datos);
  } 
  setLogFichaAnalisis(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/setLogFichaAnalisis`;
    return this._http.post<any>(this.url, Datos);
  }
  getFALog(NroRadicado: string): Observable<any> {
    this.url = `${this.environment.Url}/getLogFichaAnalisis?NroRadicado=${NroRadicado}`;
    return this._http.get<any>(this.url);
  }
  getFichaAnalisisPorDocumento(operacion: string, documento: string): Observable<any> {
    this.url = `${this.environment.Url}/getFichaAnalisisPorDocumento`;
    const params = new HttpParams()
        .set('operacion', operacion)
        .set('documento', documento);
    return this._http.get<any>(this.url, { params: params });
  } 
  actualizarFichaAnalisis(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/actualizarFichaAnalisis`;
    return this._http.post<any>(this.url, Datos);
  }
  actualizarFichaDeAnalisisDeNaturales(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/actualizarFichaDeAnalisisDeNaturales`;
    return this._http.post<any>(this.url, Datos);
  }
  actualizarCodeudorFichaAnalisis(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/actualizarCodeudorFichaAnalisis`;
    return this._http.post<any>(this.url, Datos);
  }
  actualizarCodeudorFichaDeAnalisisDeNaturales(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/actualizarCodeudorFichaDeAnalisisDeNaturales`;
    return this._http.post<any>(this.url, Datos);
  }
  EnvioFichaAnalisisWorkManager(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/EnvioFichaAnalisisWorkManager`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarPDFFichaAnalisis(NroRadicado: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPDFFichaAnalisis?NroRadicado=${NroRadicado}`;
    return this._http.get<any>(this.url);
  }
  actualizarColEnvioAlWM(NroRadicado: string, estado: number): Observable<any> {
    this.url = `${this.environment.Url}/ActualizarColEnvioAlWM`;
    const params = new HttpParams()
        .set('nroRadicado', NroRadicado)
        .set('estado', estado);
    return this._http.get<any>(this.url, { params: params });
  }
}
