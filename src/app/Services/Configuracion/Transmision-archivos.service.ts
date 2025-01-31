import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
import { ParametrosTransmisionData } from '../../Models/Configuracion/Transmision-archivos.model';

@Injectable()

export class TransmisionArchivosService{
    public url: string ='';


    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    GetParametrosTransmision(): Observable<any> {
        this.url = `${this.environment.Url}/GetParametrosTransmisionAll`;
        return this._http.get<any>(this.url);
    }

    GetHistorialTransmision(Id : number): Observable<any> {
        this.url = `${this.environment.Url}/GetHistorialTransmisionAll?Id=`+Id;
        return this._http.get<any>(this.url);
    }

    GuardarParametrosTransmision(parametroTransmision: ParametrosTransmisionData): Observable<any> {
        this.url = `${this.environment.Url}/GuardarParametrosTransmision`;
        return this._http.post<any>(this.url,parametroTransmision);
    }

    ActualizarParametrosTransmision(parametroTransmision: ParametrosTransmisionData): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarParametrosTransmision`;
        return this._http.post<any>(this.url,parametroTransmision);
    }

    ActualizarHoraEjecucion(): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarHoraEjecucion`;
        return this._http.post<any>(this.url,null);
    }

    EjecutarSFTP(parametroTransmision: ParametrosTransmisionData): Observable<any> {
        this.url = `${this.environment.Url}/SFTP`;
        return this._http.post<any>(this.url,parametroTransmision);
    }

    EjecutarSFTPGPG(parametroTransmision: ParametrosTransmisionData): Observable<any> {
        this.url = `${this.environment.Url}/SFTPGPG`;
        return this._http.post<any>(this.url,parametroTransmision);
    }
    
    EjecutarGRAPH(parametroTransmision: ParametrosTransmisionData): Observable<any> {
        this.url = `${this.environment.Url}/GRAPH`;
        return this._http.post<any>(this.url,parametroTransmision);
    }

    GetTareas(): Observable<any> {
        this.url = `${this.environment.Url}/GetTareas`;
        return this._http.get<any>(this.url);
    }


}