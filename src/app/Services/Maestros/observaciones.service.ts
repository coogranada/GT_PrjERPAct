import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class ObservacionesService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  
    ObservacionesDenegadas(data: string): Observable<any> {
        this.url = `${this.environment.Url}/ObservacionesDenegadas?idModulo=${data}`;
        return this._http.get<any>(this.url);
    }   
    ObservacionesPermitidas(data: string): Observable<any> {
        this.url = `${this.environment.Url}/ObservacionesPermitidas?idModulo=${data}`;
        return this._http.get<any>(this.url);
    }   
    GuardarObservacionesXModulo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarObservaciones`;
        return this._http.post<any>(this.url, Datos);
    }
    EliminarObservacionesXModulo(data: string): Observable<any> {
        this.url = `${this.environment.Url}/EliminarObservaciones?idTipocObservacion=${data}`;
        return this._http.get<any>(this.url);
    }    
    GuardarObservacion(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarObservacion`;
        return this._http.post<any>(this.url, Datos);
    }
}
