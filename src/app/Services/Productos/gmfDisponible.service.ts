import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable()

export class GmfDisponibleService {
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    ObtenerTipoIdentificacion(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTiposIdentificacionGMF`;
        return this._http.get<any>(this.url);
    }
    ObtenerTipoCuentas(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTiposCuentas`;
        return this._http.get<any>(this.url);
    }
    ObtenerEstadosCuenta(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerEstadosCuenta`;
        return this._http.get<any>(this.url);
    }
    ObtenerDepartamentos(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerDepartamentos`;
        return this._http.get<any>(this.url);
    }
    ObtenerCiudades(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerCiudades`;
        return this._http.get<any>(this.url);
    }
    ObtenerSucursales(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerSucursales`;
        return this._http.get<any>(this.url);
    }
    ConsultarGMF(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarGMF`;
        return this._http.post<any>(this.url, Datos);
    } 
    ConsultarInfoAsociado(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarInfoAsociado`;
        return this._http.post<any>(this.url, Datos);
    } 
    DesmarcacionGMF(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/DesmarcacionGMF`;
        return this._http.post<any>(this.url, Datos);
    } 
    MarcacionGMF(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/MarcacionGMF`;
        return this._http.post<any>(this.url, Datos);
    }
}
