import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class OperacionesModulosService {
  public url: string = "";
  constructor(private _http: HttpClient,private environment: EnvironmentService) { }  
  ObtenerModulos(): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerModulosOperacionesModulos`;
    return this._http.get<any>(this.url);
  }
  ObtenerOperacionesDenegadas(PModulo: number): Observable<any> {
    this.url = `${this.environment.Url}/OperacionesDenegadasPorModuloOperacionesModulos?PsrtModulo=${PModulo}`;
    return this._http.get<any>(this.url);
  }
  ObtenerOperacionesPermitidas(PModulo: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerOperacionesPermitidasOperacionesModulos?PsrtModulo=${PModulo}`;
    return this._http.get<any>(this.url);
  }
  Guardar(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GuardarOperacionXModuloOperacionesModulos`;
    return this._http.post<any>(this.url, Datos);
  }
  Eliminar(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/EliminarOperacionXModuloOperacionesModulos`;
    return this._http.post<any>(this.url, Datos);
  }
  ObtenerUsuarios(PstrIdModulo: number, PstrIdOperacion: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerUsuariosOperacionesModulos`;
    const params = new HttpParams()
        .set('PstrModulo', PstrIdModulo)
        .set('PstrOperacion', PstrIdOperacion);
    return this._http.get<any>(this.url, { params: params });
  }
}
