import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()

export class AplicacionesColaborativasService {
  private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }
    ConsultarAccesoSGF(POficina: string): Observable<any> {
      this.url = `${this.environment.Url}/ConsultarAccesoSGF?PsrtOficina=${POficina}`;
      return this._http.get<any>(this.url);
    }
}
