import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { EnvironmentService } from "../Enviroment/enviroment.service";
import { FormaPago } from "../../Models/Productos/cartera/gestion-credito.model";
import { HttpClient } from "@angular/common/http";
import { BuscarAsesoriasResponse, ConsultarAsesoriaResponse, ConsultarNegociacionAsesoriaCreditoResponse, DeduciblesResponse, SaldosVigentesResponse } from "../../Models/Creditos/GestionCredito/gestion-credito.model";
import { CriterioBusquedaAsesoria } from "../../Models/Productos/cartera/gestion-credito.enum";
import { CRITERIOS_BUSQUEDA_ASESORIA } from "../../utils/constants";

@Injectable({
    providedIn: 'root'
})
export class GestionCreditoService {
    private url: string = "";
    // private cacheBuscarAsesorias = new Map<string, Observable<BuscarAsesoriasResponse[]>>();
    private formasPago$?: Observable<FormaPago[]>;
    private cacheAsesoria = new Map<string, Observable<ConsultarAsesoriaResponse>>();


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
        // return this.http.get<ConsultarAsesoriaResponse>(this.url);
        const key = idAsesoria.toString();

        if (!this.cacheAsesoria.has(key)) {
            this.cacheAsesoria.set(
                key,
                this.http.get<ConsultarAsesoriaResponse>(this.url).pipe(
                    shareReplay(1)
                )
            );
        }
        return this.cacheAsesoria.get(key);
    }

    consultarNegociacion(idAsesoria: number) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/consultarNegociacion?idAsesoria=${idAsesoria}&rawError=true`;
        return this.http.get<ConsultarNegociacionAsesoriaCreditoResponse>(this.url);
        // const key = idAsesoria.toString();

        // if (!this.cacheAsesoria.has(key)) {
        //     this.cacheAsesoria.set(
        //         key,
        //         this.http.get<ConsultarAsesoriaResponse>(this.url).pipe(
        //             shareReplay(1)
        //         )
        //     );
        // }
        // return this.cacheAsesoria.get(key);
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
}