import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class PermisosService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  
    getPerfiles(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPerfilesActivos`;
        return this._http.get<any>(this.url);
    }
    getPermitidos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPermitidos`;
        return this._http.post<any>(this.url, Datos);
    }
    getDenegados(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerDenegados`;
        return this._http.post<any>(this.url, Datos);
    }
    AgregarDenegados(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AgregarDenegados`;
        return this._http.post<any>(this.url, Datos);
    }
    EliminarPermitidos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EliminarPermitidos`;
        return this._http.post<any>(this.url, Datos);
    }
}
