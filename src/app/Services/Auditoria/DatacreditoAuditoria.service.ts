import { ClientesModel } from '../../../app/Models/Clientes/clientes.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class DatacreditoAuditoriaService {
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    ConsultarAuditoriaDatacredito(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarAuditoriaDatacredito`;
        return this._http.post<any>(this.url, Datos);
    }  

    ConsultarAuditoriaFacturaDatacredito(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarAuditoriaFacturaDatacredito`;
        return this._http.post<any>(this.url, Datos);
    }  
}