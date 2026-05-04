import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class LlavesService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  

    CifrarLlaves(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/CifrarLlaves`;
        return this._http.post<any>(this.url, Datos);
    } 
    GetLlaves(): Observable<any> {
        this.url = `${this.environment.Url}/GetLlaves`;
        return this._http.get<any>(this.url);
    }
    GetGenerarLlaves() : Observable<any> {
        this.url = this.environment.Url + '/GenerarLlaves';
        return this._http.get<any>(this.url);
    }
    CambiarLlavesPublicas(llavePA :string, llavePB : string): Observable<any> {
        this.url = this.environment.Url + '/CambiarLlavesPublicas/' + llavePA + "/" + llavePB;
        return this._http.get<any>(this.url);
    }
    GuardarLlaves(llave : any): Observable<any> {
        this.url = this.environment.Url + '/GuardarLlaves';
        return this._http.post<any>(this.url,llave);
    }
    GetProveedores(): Observable<any> {
        this.url = this.environment.Url + '/GetProveedores';
        return this._http.get<any>(this.url);
    }
}
