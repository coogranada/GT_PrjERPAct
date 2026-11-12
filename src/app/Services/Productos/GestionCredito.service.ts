import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { EnvironmentService } from "../Enviroment/enviroment.service";
import { FormaPago } from "../../Models/Productos/cartera/gestion-credito.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BuscarAsesoriasResponse, CalcularCreditoRequest, CalcularCreditoResponse, CombinacionResponse, ConsultarAsesoriaResponse, ConsultarNegociacionAsesoriaCreditoResponse, DeduciblesResponse, LineaResponse, ProductoCredito, SaldosVigentesResponse, TiposGarantiasResponse } from "../../Models/Creditos/GestionCredito/gestion-credito.model";
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
        this.url = `${this.environment.UrlCore}/api/GestionCredito/consultarNegociacion?idAsesoria=${idAsesoria}`;
        return this.http.get<ConsultarNegociacionAsesoriaCreditoResponse>(this.url);
    }

    obtenerDeducibles(idAsesoria: number) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/obtenerDeducibles?idAsesoria=${idAsesoria}`;
        return this.http.get<DeduciblesResponse[]>(this.url);
    }

    obtenerSaldosVigentes(idAsesoria: number) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/obtenerSaldosVigentes?idAsesoria=${idAsesoria}`;
        return this.http.get<SaldosVigentesResponse[]>(this.url);
    }

    buscarProductosCredito(idProducto: number | null, descripcionProducto: string | null = null) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/buscarProductosCredito`;
        let params = new HttpParams();
        if(idProducto) params = params.set('idProducto', idProducto);
        if(descripcionProducto) params = params.set('descripcionProducto', descripcionProducto);
        return this.http.get<ProductoCredito[]>(this.url, { params });
    }

    buscarLineas(idProducto: number, idLinea: number | null, descripcionLinea: string | null = null) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/buscarLineas`;
        let params = new HttpParams().set('idProducto', idProducto);
        if(idLinea) params = params.set('idLinea', idLinea);
        if(descripcionLinea) params = params.set('descripcionLinea', descripcionLinea);
        return this.http.get<LineaResponse[]>(this.url, { params });
    }

     buscarTiposGarantias(idTipoGarantia: number | null, tipoGarantia: string | null = null) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/buscarTiposGarantias`;
        let params = new HttpParams();
        if(idTipoGarantia) params = params.set('idTipoGarantia', idTipoGarantia);
        if(tipoGarantia) params = params.set('tipoGarantia', tipoGarantia);
        return this.http.get<TiposGarantiasResponse[]>(this.url, { params });
    }

    obtenerCombinacionesPermitidas(idLinea: number) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/obtenerCombinacionesPermitidas`;
        let params = new HttpParams().set('idLinea', idLinea);
        return this.http.get<CombinacionResponse[]>(this.url, { params });
    }

    calcularCredito(request: CalcularCreditoRequest) {
        this.url = `${this.environment.UrlCore}/api/GestionCredito/calcularCredito`;
        const params = new HttpParams({ fromObject: request as any });
        return this.http.get<CalcularCreditoResponse>(this.url, { params });
    }
}