import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
import { ParametrosArchivosData } from '../../Models/Configuracion/Generacion-archivos.model';

@Injectable()

export class GeneracionArchivosService{
    public url: string ='';

    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    GetParametrosArchivos(): Observable<any> {
        this.url = `${this.environment.Url}/GetParametrosArchivosAll`;
        return this._http.get<any>(this.url);
    }

    GetHistorialArchivos(Id : number): Observable<any> {
        this.url = `${this.environment.Url}/GetHistorialArchivosAll?Id=`+Id;
        return this._http.get<any>(this.url);
    }

    GetTareas(): Observable<any> {
        this.url = `${this.environment.Url}/GetTareas1`;
        return this._http.get<any>(this.url);
    }

    GuardarParametrosArchivos(parametrosArchivos: ParametrosArchivosData): Observable<any> {
        this.url = `${this.environment.Url}/GuardarParametrosArchivos`;
        return this._http.post<any>(this.url,parametrosArchivos);
    }

    ActualizarParametrosArchivos(parametrosArchivos: ParametrosArchivosData): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarParametrosArchivos`;
        return this._http.post<any>(this.url,parametrosArchivos);
    }
    
    GenerarArchivos(parametrosArchivos: ParametrosArchivosData): Observable<any> {
        this.url = `${this.environment.Url}/GenerarArchivos`;
        return this._http.post<any>(this.url,parametrosArchivos);
    }

    ActualizarParametrosArchivosMasivo(parametrosArchivos: ParametrosArchivosData[]): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarParametrosArchivosMasivo`;
        return this._http.post<any>(this.url,parametrosArchivos);
    }

}