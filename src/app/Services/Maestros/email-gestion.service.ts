import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class GestionEmailService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    setImagenMail(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/setImagenMail`;
      return this._http.post<any>(this.url, Datos);
    }
    UpdateMailxBloques(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/UpdateMailxBloques`;
      return this._http.post<any>(this.url, Datos);
    }
    setImagenMailCertificado(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/setImagenMailCertificado`;
      return this._http.post<any>(this.url, Datos);
    }
    getImagenesGestionMail(): Observable<any> {
      this.url = `${this.environment.Url}/getImagenesGestionMail`;
      return this._http.get<any>(this.url);
    }
}