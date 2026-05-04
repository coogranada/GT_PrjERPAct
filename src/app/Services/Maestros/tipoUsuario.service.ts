import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class TipoUsuariosService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  
    getTipoUsuario(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTipoUsuario`;
        return this._http.get<any>(this.url);
    }
    setTipoUsuario(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarTipoUsuario`;
        return this._http.post<any>(this.url, Datos);
    }
    updateTipoUsuario(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTipoUsuario`;
        return this._http.post<any>(this.url, Datos);
    }
}
