import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
import { TipoBusquedaResumen } from '../../Models/Productos/cartera/gestion-credito.enum';
import { CuentaCarteraDetalle, CuentaCarteraResumen, CuentaFormateada, Diferido, GarantiasResponse, Provision } from '../../Models/Productos/cartera/gestion-credito.model';

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

    // TABS 
    getDatosCartera(IdCuenta: number): Observable<any> {
        this.url = `${this.environment.Url}/BuscarDatosCartera?IdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
     getSaldosCartera(IdCuenta: number): Observable<any> {
         this.url = `${this.environment.Url}/BuscarSaldosCartera?IdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
      }
    getCalificacionCartera(IdCuenta: number): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCalificacionCartera?IdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }

    // GARANTIAS
    getGarantias(IdCuenta: number): Observable<GarantiasResponse> {
        this.url = `${this.environment.Url}/getGarantias?idCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    // FIN GARANTIAS


    //DIFERIDOS
    getDeducibles(IdCuenta: number): Observable<Diferido[]> {
        this.url = `${this.environment.Url}/getDiferidos?idCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    //FIN DIFERIDOS


    //PROVISION
    getProvisiones(IdCuenta: number): Observable<Provision[]> {
        this.url = `${this.environment.Url}/getProvisiones?idCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    //FIN PROVISION
}
