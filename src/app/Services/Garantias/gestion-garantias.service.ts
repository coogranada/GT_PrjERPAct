import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvironmentService } from '../Enviroment/enviroment.service';
import {
    ConsultarCreditosGarantiasResponse,
    GarantiaDisponible,
    GarantiaAsignada,
    CodeudorBasico
} from '../../Models/Garantias/gestion-garantias.model';

@Injectable({
    providedIn: 'root'
})
export class GestionGarantiasService {

    private readonly urlBase: string;

    constructor(private readonly http: HttpClient, 
                private readonly environment: EnvironmentService )
    {
        this.urlBase = `${this.environment.UrlCore}/api/GestionGarantias`;
    }

    consultarCreditos( numeroDocumento: string, cancelados: boolean = false
    ): Observable<ConsultarCreditosGarantiasResponse[]> {

        const url = `${this.urlBase}/consultarCreditos`;

        const params = new HttpParams()
            .set('numeroDocumento', numeroDocumento.trim())
            .set('cancelados', cancelados);

        return this.http.get<ConsultarCreditosGarantiasResponse[]>(
            url,
            { params }
        );
    }

    obtenerGarantiasDisponibles(
        idTercero: number,
        idCuenta?: number
    ): Observable<GarantiaDisponible[]> {

        const url =
            `${this.urlBase}/obtenerGarantiasDisponibles`;

        let params = new HttpParams()
            .set('idTercero', idTercero.toString());

        // idCuenta es opcional en el endpoint.
        if (idCuenta != null) {
            params = params.set(
                'idCuenta',
                idCuenta.toString()
            );
        }

        return this.http.get<GarantiaDisponible[]>(
            url,
            { params }
        );
    }

    obtenerGarantiasAsignadas(
        idCuenta: number
    ): Observable<GarantiaAsignada[]> {

        const url =
            `${this.urlBase}/obtenerGarantiasAsignadas`;

        const params = new HttpParams()
            .set('idCuenta', idCuenta.toString());

        return this.http.get<GarantiaAsignada[]>(
            url,
            { params }
        );
    }

    getCodeudoresBasico( idCuenta: number ): Observable<CodeudorBasico[]> {
        const url = `${this.environment.UrlCore}/api/GestionGarantias/obtenerCodeudoresBasico`;
        const params = new HttpParams().set('idCuenta', idCuenta.toString());
    
        return this.http.get<CodeudorBasico[]>(url, { params });
    }
}