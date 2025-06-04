import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable()

export class GeneracionArchivosService{
    public url: string ='';

    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    GetParametrosArchivos(): Observable<any> {
        this.url = `${this.environment.Url}/GetParametrosArchivosAll`;
        return this._http.get<any>(this.url);
    }

}