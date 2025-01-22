import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable,map } from 'rxjs';
@Injectable()
export class ScoreSimuladorService {
  private url: string = "";
  constructor(private _http: HttpClient,private environment: EnvironmentService) { }
  private option = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Accept': 'application/json' })};

  ObtenerCodigosInformacionacion(): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerCodigosInformacion`;
    return this._http.get<any>(this.url);
  }
  ObtenerMotivosConsulta(): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerMotivosConsulta`;
    return this._http.get<any>(this.url);
  }
  ObtenerTiposIdentificacion(): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerTiposIdentificacion`;
    return this._http.get<any>(this.url);
  }
  ConsultarScore(PobjScore: any): Observable<any> {
    this.url = `${this.environment.Url}/ConsultarScore`;
    return this._http.post<any>(this.url, PobjScore);
  }
  MostrarReporte(data: any): Observable<any> {
    this.url = `${this.environment.Url}/MostrarReporte`;
    return this._http.post<any>(this.url, data);
  }
}
