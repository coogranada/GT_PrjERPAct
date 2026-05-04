import { ClientesModel } from '../../../app/Models/Clientes/clientes.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()

export class CargaEmpresaService {
    public itemsEmpresa: any;
    public objClients = new ClientesModel();
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) {
        this.objClients.Nombre = '*';
        this.objClients.Nit = '*';
        this.objClients.Codigo = 0;
     }
    GetEmpresas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GetEmpresas`;
        return this._http.post<any>(this.url, Datos);
      }
}
