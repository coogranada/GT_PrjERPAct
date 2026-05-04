import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class UsuariosProveedoresService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  
    getBuscarUsuariosProveedores(Documento: number): Observable<any> {
        this.url = `${this.environment.Url}/GetUsuariosProveedores?Documento=${Documento}`;
        return this._http.get<any>(this.url);
    }
    GurdaRegistrosProveedores(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardaRegistrosProveedores`;
        return this._http.post<any>(this.url, Datos);
    }
    ActualizaRegistrosProveedores(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizaRegistrosProveedores`;
        return this._http.post<any>(this.url, Datos);
    }   
    ConsultarProveedores(): Observable<any> {
        this.url = `${this.environment.Url}/UsuariosProveedores`;
        return this._http.get<any>(this.url);
    }
    ValidaDocumento(Documento: number): Observable<any> {
        this.url = `${this.environment.Url}/ValidaDocumento?Documento=${Documento}`;
        return this._http.get<any>(this.url);
    }
}
