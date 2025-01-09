import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class ImagenesBannerServices {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  
    
    getImagenesBanner(): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarImagenBanner`;
        return this._http.get<any>(this.url);
    }
    setImagenBanner(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarImagenBanner`;
        return this._http.post<any>(this.url, Datos);
    }
    setLogImagenBanner(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarLogBanner`;
        return this._http.post<any>(this.url, Datos);
    }
    setImagenUser(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarImagenesUsuario`;
        return this._http.post<any>(this.url, Datos);
    }
    updateImagenUsere(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarImagenesUsuario`;
        return this._http.post<any>(this.url, Datos);
    }
    ConsultarImgenUser(data: string): Observable<any> {
        this.url = `${this.environment.Url}/ConsltarImagenesUsuario?idUsuario=${data}`;
        return this._http.get<any>(this.url);
    }
    BuscarUsuarioXId(data: number): Observable<any> {
        this.url = `${this.environment.Url}/BuscarUsuarioXId?idUsuario=${data}`;
        return this._http.get<any>(this.url);
    }
    BuscarUsuarioXUsuario(data: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarUsuarioXUsuario?user=${data}`;
        return this._http.get<any>(this.url);
    }
    BuscarUsuarioXDocumento(data: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarUsuarioXDocumento?documento=${data}`;
        return this._http.get<any>(this.url);
    }    
    BuscarUsuarioAll(tipo: number, dato: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarUsuarioAll`;
        const params = new HttpParams()
            .set('tipoConsulta', tipo)
            .set('dato', dato);
        return this._http.get<any>(this.url, { params: params });
    }
}
