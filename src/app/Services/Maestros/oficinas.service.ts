import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class OficinasService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  
    getOficinas(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerOficinas`;
        return this._http.get<any>(this.url);
    }
    setOficinas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarOficinas`;
        return this._http.post<any>(this.url, Datos);
    }
    updateOficinas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarOficinas`;
        return this._http.post<any>(this.url, Datos);
    }
}
