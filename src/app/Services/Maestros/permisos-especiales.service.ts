import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()

export class PermisosEspecialesService {
  public url: string = "";
  constructor(private _http: HttpClient,private environment: EnvironmentService) { }  

  BuscarUsuarios(): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerUsuariosPermisosEspeciales`;
    return this._http.get<any>(this.url);
  }
  ObtenerUsuario(PstrUsuario: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerUsuarioPermisosEspeciales?PstrUsuario=${PstrUsuario}`;
    return this._http.get<any>(this.url);
  }
  ObtenerModulos(PstrUsuario: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerModulosPermisosEspeciales?PstrUsuario=${PstrUsuario}`;
    return this._http.get<any>(this.url);
  }
  ObtenerOperacionesDenegadas(PsrtModulo: number, PstrUsuario: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerOperacionesDenegadasPermisosEspeciales`;
    const params = new HttpParams()
        .set('PsrtModulo', PsrtModulo)
        .set('PstrUsuario', PstrUsuario);
    return this._http.get<any>(this.url, { params: params });
  }
  ObtenerOperacionesPermitidas(PsrtModulo: number, PstrUsuario: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerOperacionesPermitidasPermisosEspeciales`;
    const params = new HttpParams()
        .set('PsrtModulo', PsrtModulo)
        .set('PstrUsuario', PstrUsuario);
    return this._http.get<any>(this.url, { params: params });
  }
  Guardar(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GuardarPermisosEspeciales`;
    return this._http.post<any>(this.url, Datos);
  }
  Eliminar(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/EliminarPermisosEspeciales`;
    return this._http.post<any>(this.url, Datos);
  }
}
