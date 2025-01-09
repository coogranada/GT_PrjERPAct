import { ClientesModel } from '../../../app/Models/Clientes/clientes.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class ScoreAuditoriaService {
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    ConsultarScoreAuditoria(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarScoreAuditoria`;
        return this._http.post<any>(this.url, Datos);
    }  
}
