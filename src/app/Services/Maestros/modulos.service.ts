import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class ModulosService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  
    getModulos(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerModulos`;
        return this._http.get<any>(this.url);
    }
    setModulos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarModulos`;
        return this._http.post<any>(this.url, Datos);
    }
    updateModulos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarModulos`;
        return this._http.post<any>(this.url, Datos);
    }
}
