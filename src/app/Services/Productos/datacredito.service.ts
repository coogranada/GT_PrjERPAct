import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable,map } from 'rxjs';
@Injectable()
export class DatacreditoService {
  private url: string = "";
  constructor(private _http: HttpClient,private environment: EnvironmentService) { }
  private option = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Accept': 'application/json' })};

  ObtenerMotivosConsulta(): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerMotivosConsulta`;
    return this._http.get<any>(this.url);
  }
  ObtenerTipoIdentificacionDataC(): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerTipoIdentificacionDataC`;
    return this._http.get<any>(this.url);
  }
  ObtenerInformacionDataCredito(data : any): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerInformacionDataCredito`;
    return this._http.post<any>(this.url, data);
  }
  ObtenerInformacionxDocumento(Documento : string): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerInformacionxDocumento?Documento=`+Documento;
    return this._http.get<any>(this.url);
  }
}
