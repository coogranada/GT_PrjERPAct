import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneracionArchivosService {
  public url: string = '';
  constructor(private _http: HttpClient,private environment: EnvironmentService) { }

  GetParametrosArchivos(): Observable<any> {
      this.url = `${this.environment.Url}/GetParametrosArchivos`;
      return this._http.get<any>(this.url);
  }
  PostParametrosArchivos(payload : any): Observable<any> {
    this.url = `${this.environment.Url}/PostParametrosArchivos`;
    return this._http.post<any>(this.url,payload);
  }
  PostLogParametrosArchivos(payload : any): Observable<any> {
    this.url = `${this.environment.Url}/PostLogParametrosArchivos`;
    return this._http.post<any>(this.url,payload);
  }
}
