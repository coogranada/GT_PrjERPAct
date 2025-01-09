import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()

export class GestionesService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    Obtener(PIdUsuario: string): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerGestiones?PintIdUsuario=${PIdUsuario}`;
      return this._http.get<any>(this.url);
    }  
    ObtenerAll(): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerGestionesAll`;
      return this._http.get<any>(this.url);
    } 
    Guardar(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/GuardarGestiones`;
      return this._http.post<any>(this.url, Datos);
    }  
    ObtenerEstados(): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerEstadosGestiones`;
      return this._http.get<any>(this.url);
    }
    ObtenerUsuariosAutorizados(PIdOperacion: string, PIdModulo: string): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerUsuariosAutorizados`;
      const params = new HttpParams()
        .set('PintIdOperacion', PIdOperacion)
        .set('PintIdModulo', PIdModulo);
      return this._http.get<any>(this.url,{params: params });
    }
    ObtenerUsuariosAutorizadosAll(): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerUsuariosAutorizadosAll`;
      return this._http.get<any>(this.url);
    }  
    ObtenerOperaciones(PModulo: string): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerOperacionesPermitidasOperacionesModulos?PsrtModulo=${PModulo}`;
      return this._http.get<any>(this.url);
    }
    GenerarCuenta(PIdOficina: string, PProducto: string, PConsecutivo: string, PDigito: string): Observable<any> {
      this.url = `${this.environment.Url}/GenerarCuentaGestiones`;
      const params = new HttpParams()
        .set('PintIdOficina', PIdOficina)
        .set('PintProducto', PProducto)
        .set('PintConsecutivo', PConsecutivo)
        .set('PintDigito', PDigito);
      return this._http.get<any>(this.url,{params: params });
    }
    GestionarGestion(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/GestionarGestion`;
      return this._http.post<any>(this.url, Datos);
    }  
    GetTrazabilidad(opera: string): Observable<any> {
      this.url = `${this.environment.Url}/GetTrazabilidadGestionOperaciones?opera=${opera}`;
      return this._http.get<any>(this.url);
    } 
}
