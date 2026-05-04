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
    
    
    ObtenerParametrosConfiguracionInformesSP(nombreSp : string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerParametrosConfiguracionInf?nombreSP=`+nombreSp;
        return this._http.get<any>(this.url);
    }

    ValidarExistenciaSP(nombreSp : string): Observable<any> {
        this.url = `${this.environment.Url}/ValidarExistenciaSP?nombreSP=`+nombreSp;
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

    ListarColumnas(nombreSP : string): Observable<any> {
        this.url = `${this.environment.Url}/ListarColumnas?nombreSP=`+nombreSP;
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

    EjecutarInformeUno(nombreSP: string, accionEjecuta: string, parametros: { [key: string]: any }, columnasSeleccionadas : any): Observable<any> {
        this.url = `${this.environment.Url}/EjecutarSPUno`;
        const body = {
            nombreSP: nombreSP,
            accionEjecuta: accionEjecuta,
            parametros: parametros,
            columnasSeleccionadas: columnasSeleccionadas
        };

        return this._http.post<any>(this.url, body);
    }

    GuardarConfiguracion(configuracionInformes:any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarConfiguracion`;
        const body = configuracionInformes;

        return this._http.post<any>(this.url, body);
    }

    ActualizarConfiguracion(configuracionInformes:any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarConfiguracion`;
        const body = configuracionInformes;

        return this._http.post<any>(this.url, body);
    }

    EliminarConfiguracion(configuracionInformes:any): Observable<any> {
        this.url = `${this.environment.Url}/EliminarConfiguracion`;
        const body = configuracionInformes;

        return this._http.post<any>(this.url, body);
    }
    
    GuardarParametrosConfiguracion(idParametro: number, parametros: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarParametrosConfiguracion?IdParametro=`+idParametro;
        const body = parametros

        return this._http.post<any>(this.url, body);
    }


}