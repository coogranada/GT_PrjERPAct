import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class CargosService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }
    getCargos(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerCargos`;
        return this._http.get<any>(this.url);
    }
    setCargos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarCargos`;
        return this._http.post<any>(this.url, Datos);
    }
    updateCargos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarCargos`;
        return this._http.post<any>(this.url, Datos);
    } 
}
