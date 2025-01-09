import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class UsuariosService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  
    getUsuario(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerUsuarios`;
        return this._http.get<any>(this.url);
    }
    getTipoIdentificacion(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTipoIdentificacion`;
        return this._http.get<any>(this.url);
    }
    getAreasActivas(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerAreasActivas`;
        return this._http.get<any>(this.url);
    }
    getCargosActivos(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerCargosActivos`;
        return this._http.get<any>(this.url);
    }
    getOficinas(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerOficinasUsuarios`;
        return this._http.get<any>(this.url);
    }
    getPerfilesActivos(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPerfilesActivos`;
        return this._http.get<any>(this.url);
    }
    setUsuario(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarUsuarios`;
        return this._http.post<any>(this.url, Datos);
    }  
    getBuscarUsuario(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarUsuarios`;
        return this._http.post<any>(this.url, Datos);
    } 
    updateUsuario(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarUsuarios`;
        return this._http.post<any>(this.url, Datos);
    } 
    GetConsultarUsuarios(): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarUsuarios`;
        return this._http.get<any>(this.url);
    }
    ActualizarOficinaUsuario(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarOficinaUsuario`;
        return this._http.post<any>(this.url, Datos);
    } 
    GetIpUltimaSesion(id: number): Observable<any> {
        this.url = `${this.environment.Url}/GetIpUltomaSesion/${id}`;
        return this._http.get<any>(this.url);
    }
    InsertIpUltimaSesion(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/InsertIpUltimaSesion`;
        return this._http.post<any>(this.url, Datos);
    } 
}
