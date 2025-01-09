import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class EstadosOperacionesService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    ObtenerOperaciones(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerOperaciones`;
        return this._http.get<any>(this.url);
    }
    ObtenerEstados(): Observable<any> {
        this.url = `${this.environment.Url}/GetEstado`;
        return this._http.get<any>(this.url);
    }
    ObtenerOperacionXEstado(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerOperacionXEstado`;
        return this._http.get<any>(this.url);
    }
    GuardarEstadosXOperacion(Datos: any): Observable<any> {
       this.url = `${this.environment.Url}/GuardarEstadosXOperacion`;
    return this._http.post<any>(this.url, Datos);
    }
    EliminarOperacionXEstado(data: string): Observable<any> {
        this.url = `${this.environment.Url}/EliminarOperacionXEstado?idOperacionXEstado=${data}`;
        return this._http.get<any>(this.url);
    }
}
