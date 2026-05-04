import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class AreasService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }
    
    getArea(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerAreas`;
        return this._http.get<any>(this.url);
    }
    setAreas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarAreas`;
        return this._http.post<any>(this.url, Datos);
    }
    updateAreas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarAreas`;
        return this._http.post<any>(this.url, Datos);
    }
}
