import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable()

export class InformePerfilService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  

    ObtenerInformesPermitidosP(IdPerfil : number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInformesPermitidosP?IdPerfil=`+IdPerfil;
        return this._http.get<any>(this.url);
    }

    ObtenerInformesDenegadosP(IdPerfil : number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInformesDenegadosP?IdPerfil=`+IdPerfil;
        return this._http.get<any>(this.url);
    }

    AdicionarAccesoInfo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AdicionarAccesoInfo`;
        return this._http.post<any>(this.url, Datos);
    }

    EliminarAccesoInfo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EliminarAccesoInfo`;
        return this._http.post<any>(this.url, Datos);
    }

    AdicionarAccesoInfoMas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AdicionarAccesoInfoMas`;
        return this._http.post<any>(this.url, Datos);
    }

    EliminarAccesoInfoMas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EliminarAccesoInfoMas`;
        return this._http.post<any>(this.url, Datos);
    }

}