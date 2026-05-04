import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable()
export class GMFAuditoriaService {
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    ConsultarGMFAuditoria(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarGMFAuditoria`;
        return this._http.post<any>(this.url, Datos);
      }
      ConsultarReporteGMF(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarReporteGMF`;
          return this._http.post<any>(this.url, Datos);
        }
}
