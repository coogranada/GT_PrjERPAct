import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable()
export class RecursosGeneralesService {
    private url: string = "";
  
    constructor( private _http: HttpClient, private environment: EnvironmentService) { }

    GetPaisesList(): Observable<any> {
        this.url = `${this.environment.Url}/GetPaisesList`;
        return this._http.get<any>(this.url);
    }
    GetDepartamentosList(pais: number): Observable<any> {
        this.url = `${this.environment.Url}/GetDepartamentosList?pais=${pais}`;
        return this._http.get<any>(this.url);
    }
    GetCiudadXId(id: number): Observable<any> {
        this.url = `${this.environment.Url}/GetCiudadId?id=${id}`;
        return this._http.get<any>(this.url);
    }
    GetPaisesXId(id: number): Observable<any> {
        this.url = `${this.environment.Url}/GetPaisesId?id=${id}`;
        return this._http.get<any>(this.url);
    }
    GetDepartamentosXId(id: number): Observable<any> {
        this.url = `${this.environment.Url}/GetDepartamentosId?id=${id}`;
        return this._http.get<any>(this.url);
    }
    GetCiudadList(depar: number): Observable<any> {
        this.url = `${this.environment.Url}/GetCiudadList?depart=${depar}`;
        return this._http.get<any>(this.url);
    }
    GetBarrioXId(depar: number): Observable<any> {
        this.url = `${this.environment.Url}/GetBarriosId?id=${depar}`;
        return this._http.get<any>(this.url);
    }
    GetBarrioList(depar: number): Observable<any> {
        this.url = `${this.environment.Url}/GetBarrios?id=${depar}`;
        return this._http.get<any>(this.url);
    }
}
