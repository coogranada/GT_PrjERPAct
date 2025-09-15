import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
import { TipoBusquedaResumen } from '../../Models/Productos/cartera/gestion-credito.enum';
import { CuentaCarteraDetalle, CuentaCarteraResumen, CuentaFormateada } from '../../Models/Productos/cartera/gestion-credito.model';

@Injectable({
    providedIn: 'root'
})
export class CarteraService {
    private url: string = "";

    constructor(private _http: HttpClient,private environment: EnvironmentService ) { }

    buscarCuentasResumen(filtro: TipoBusquedaResumen, valor: string): Observable<CuentaCarteraResumen[]> {
        this.url = `${this.environment.Url}/BuscarCuentasResumen?filtro=${filtro}&valor=${valor}`;
        return this._http.get<CuentaCarteraResumen[]>(this.url);
    }

    buscarCuentaResumenPorNumeroCuenta({ oficina, producto, consecutivo, digito }: CuentaFormateada): Observable<CuentaCarteraResumen[]> {
        this.url = `${this.environment.Url}/BuscarCuentasResumen?oficina=${oficina}&producto=${producto}&consecutivo=${consecutivo}&digito=${digito}`;
        return this._http.get<CuentaCarteraResumen[]>(this.url);
    }

    buscarCuentaDetalle(idCuenta: number): Observable<CuentaCarteraDetalle> {
        this.url = `${this.environment.Url}/buscarCuentaDetalle?idCuenta=${idCuenta}`;
        return this._http.get<CuentaCarteraDetalle>(this.url);
    }

}



