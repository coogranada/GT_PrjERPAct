import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvironmentService } from '../Enviroment/enviroment.service';

import {
    GarantiaDisponible,
    GarantiaCompartida,
    GarantiaRealAsignada,
    GarantiasResponse,
    DetalleGarantiaCreditoDto,
    GarantiaPersonalCod,
    CambiarGarantiasRequestDto,
    ResultadoOperacionDto
} from '../../Models/Productos/garantias.model';

@Injectable({
    providedIn: 'root'
})
export class GarantiasService {

    constructor(
        private http: HttpClient,
        private environment: EnvironmentService
    ) { }

    getGarantias(idCuenta: number): Observable<GarantiasResponse> {
        const url = `${this.environment.Url}/getGarantias?idCuenta=${idCuenta}`;
        return this.http.get<GarantiasResponse>(url);
    }

    getGarantiasDisponibles(
        idTercero: number,
        idCuenta?: number
    ): Observable<GarantiaDisponible[]> {

        const url = `${this.environment.Url}/ObtenerGarantiasDisponibles`;

        let params = new HttpParams()
            .set('idTercero', idTercero.toString());

        if (idCuenta != null) {
            params = params.set('idCuenta', idCuenta.toString());
        }

        return this.http.get<GarantiaDisponible[]>(url, { params });
    }

    getGarantiasAsignadas(
        idCuenta: number
    ): Observable<GarantiaRealAsignada[]> {

        const url = `${this.environment.Url}/ObtenerGarantiasAsignadas`;

        const params = new HttpParams()
            .set('idCuenta', idCuenta);

        return this.http.get<GarantiaRealAsignada[]>(url, { params });
    }

    getGarantiasAsignadasDisponibles(
        idCuenta: number
    ): Observable<GarantiaRealAsignada[]> {

        const url = `${this.environment.Url}/ObtenerGarantiasDisponiblesAsignadas`;

        const params = new HttpParams()
            .set('idCuenta', idCuenta);

        return this.http.get<GarantiaRealAsignada[]>(url, { params });
    }

    getGarantiasCompartidas(
        idCuenta: number,
        idTercero: number
    ): Observable<GarantiaCompartida[]> {

        const url = `${this.environment.Url}/ObtenerGarantiasCompartidas`;

        const params = new HttpParams()
            .set('idCuenta', idCuenta)
            .set('idTercero', idTercero);

        return this.http.get<GarantiaCompartida[]>(url, { params });
    }

    getGarantiasDerivadas(
        garantia: number,
        tipo: string,
        idCuentaActual: number
    ): Observable<GarantiaCompartida[]> {

        const url = `${this.environment.Url}/ObtenerGarantiasDerivadas`;

        const params = new HttpParams()
            .set('garantia', garantia)
            .set('tipo', tipo)
            .set('idCuentaActual', idCuentaActual);

        return this.http.get<GarantiaCompartida[]>(url, { params });
    }

    obtenerDetalleGarantiaCreditos(
        garantia: number,
        tipo: string
    ): Observable<DetalleGarantiaCreditoDto[]> {

        const url = `${this.environment.Url}/ObtenerDetalleGarantiaCreditos`;

        const params = new HttpParams()
            .set('garantia', garantia)
            .set('tipo', tipo);

        return this.http.get<DetalleGarantiaCreditoDto[]>(url, { params });
    }

    getCodeudoresGarantias(
        idCuenta: number
    ): Observable<GarantiaPersonalCod[]> {

        const url = `${this.environment.Url}/ObtenerCodeudoresGarantias`;

        const params = new HttpParams()
            .set('idCuenta', idCuenta);

        return this.http.get<GarantiaPersonalCod[]>(url, { params });
    }

    cambiarGarantias(dto: CambiarGarantiasRequestDto): Observable<ResultadoOperacionDto> {
        const url = `${this.environment.Url}/CambiarGarantias`;
        return this.http.post<ResultadoOperacionDto>(url, dto);
    }

}