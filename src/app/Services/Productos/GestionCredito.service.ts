import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { EnvironmentService } from "../Enviroment/enviroment.service";
import { FormaPago } from "../../Models/Productos/cartera/gestion-credito.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BuscarAsesoriasResponse, ConsultarAsesoriaResponse, ConsultarNegociacionAsesoriaCreditoResponse, DeduciblesResponse, SaldosVigentesResponse } from "../../Models/Creditos/GestionCredito/gestion-credito.model";
import { CriterioBusquedaAsesoria } from "../../Models/Creditos/GestionCredito/gestion-credito-enum";
import { CRITERIOS_BUSQUEDA_ASESORIA } from "../../Models/Creditos/GestionCredito/gestion-credito-constants";

@Injectable({
    providedIn: 'root'
})
export class GestionCreditoService {
    private url: string = "";
    private formasPago$?: Observable<FormaPago[]>;
    constructor(private http: HttpClient, private environment: EnvironmentService) { }

    getFormasPago(): Observable<FormaPago[]> {
        this.url = `${this.environment.Url}/ObtenerFormaPagoContractual`;

        if (!this.formasPago$) {
            this.formasPago$ = this.http
                .get<FormaPago[]>(this.url)
                .pipe(
                    shareReplay(1)
                );
        }

        return this.formasPago$;
    }

    buscarAsesorias(criterioBusqueda: CriterioBusquedaAsesoria, valorBusqueda: string) {
        const criterio = CRITERIOS_BUSQUEDA_ASESORIA[criterioBusqueda];
        this.url = `${this.environment.UrlCore}/api/GestionCredito/buscarAsesorias?${criterio}=${valorBusqueda}`;
        return this.http.get<BuscarAsesoriasResponse[]>(this.url);
    }

    consultarAsesoria(idAsesoria: number) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/consultarAsesoria?idAsesoria=${idAsesoria}&rawError=true`;
        return this.http.get<ConsultarAsesoriaResponse>(this.url);
    }

    consultarNegociacion(idAsesoria: number) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/consultarNegociacion?idAsesoria=${idAsesoria}&rawError=true`;
        return this.http.get<ConsultarNegociacionAsesoriaCreditoResponse>(this.url);
    }

    obtenerDeducibles(idAsesoria: number) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/obtenerDeducibles?idAsesoria=${idAsesoria}&rawError=true`;
        return this.http.get<DeduciblesResponse[]>(this.url);
    }

    obtenerSaldosVigentes(idAsesoria: number) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/obtenerSaldosVigentes?idAsesoria=${idAsesoria}&rawError=true`;
        return this.http.get<SaldosVigentesResponse[]>(this.url);
    }

    obtenerCalificaciones(idAsesoria: number) {
        this.url = `${this.environment.Url}/getCalificaAnualmente?idAsesoria=${idAsesoria}&rawError=true`;
        return this.http.get<SaldosVigentesResponse[]>(this.url);
    }

    buscarProductosCredito(idProducto: number | null, descripcionProducto: string | null = null) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/BuscarProductosCredito`;
        const params = new HttpParams().set('rawError', true);
        if(idProducto) params.set('idProducto', idProducto);
        if(descripcionProducto) params.set('descripcionProducto', descripcionProducto);
        return this.http.get<SaldosVigentesResponse[]>(this.url, { params });
    }
}