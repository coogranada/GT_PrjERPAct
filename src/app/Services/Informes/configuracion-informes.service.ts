import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../Enviroment/enviroment.service';


@Injectable({
    providedIn: 'root'
})
export class ConfiguracionInformesService {
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    ObtenerConfiguracionInformes(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerConfiguracionInformes`;
        return this._http.get<any>(this.url);
    }
    
    ObtenerParametrosConfiguracionInfTbl(idParametroInforme : number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerParametrosConfiguracionInfTbl?idConfiguracionInformes=`+idParametroInforme;
        return this._http.get<any>(this.url);
    }

    ObtenerListas(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerListas`;
        return this._http.get<any>(this.url);
    }

    EjecutarInforme(nombreSP: string, accionEjecuta: string, parametros: { [key: string]: any }): Observable<any> {
        this.url = `${this.environment.Url}/EjecutarSP`;
        const body = {
            nombreSP: nombreSP,
            accionEjecuta: accionEjecuta,
            parametros: parametros
        };

        return this._http.post<any>(this.url, body);
    }

}