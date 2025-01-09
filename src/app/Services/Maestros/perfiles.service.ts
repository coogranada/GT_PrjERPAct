import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class PerfilesService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  
    getPerfiles(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPerfiles`;
        return this._http.get<any>(this.url);
    }
    setPerfiles(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarPerfiles`;
        return this._http.post<any>(this.url, Datos);
    }
    updatePerfiles(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarPerfiles`;
        return this._http.post<any>(this.url, Datos);
    }
}
