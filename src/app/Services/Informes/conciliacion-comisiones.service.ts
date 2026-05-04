import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConciliacionComisionesService {
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }
    
    ObtenerConceptos(): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerConceptosComisiones`;
      return this._http.get<any>(this.url);
    }
    ObtenerConciliacionComisiones(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerConciliacionComisiones`;
      return this._http.post<any>(this.url, Datos);
    }
}
