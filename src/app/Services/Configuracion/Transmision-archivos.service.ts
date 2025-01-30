import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable()

export class TransmisionArchivosService{
    public url: string ='';


    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    GetParametrosTransmision(): Observable<any> {
        this.url = `${this.environment.Url}/GetParametrosTransmisionAll`;
        return this._http.get<any>(this.url);
    }

}