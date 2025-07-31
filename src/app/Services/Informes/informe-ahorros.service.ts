import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Filtro } from '../../Models/Informes/informe-ahorros/informe-ahorros.model';

@Injectable({
    providedIn: 'root'
})
export class InformeAhorrosService {
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    ObtenerConfiguracionInformes(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerConfiguracionInformes`;
        return this._http.get<any>(this.url);
    }
    
    ObtenerParametrosConfiguracionInfTbl(idParametroInforme : number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerParametrosConfiguracionInfTbl?idConfiguracionInformes=`+idParametroInforme;
        return this._http.get<any>(this.url);
    }

    ObtenerListas(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerListas`;
        return this._http.get<any>(this.url);
    }

    EjecutarInforme(nombreSP: string, accionEjecuta: string, parametros: { [key: string]: any }): Observable<any> {
        this.url = `${this.environment.Url}/EjecutarSP`;
        const body = {
            nombreSP: nombreSP,
            accionEjecuta: accionEjecuta,
            parametros: parametros
          };

        return this._http.post<any>(this.url, body);
    }

    GetFiltros(oficinaOrAdmin: number, isOficina: boolean) {
        let Filtros: Filtro[] = [];
        this.CrateFiltros(Filtros);
        if (oficinaOrAdmin != 3)
            Filtros = Filtros.filter(x => x.idFiltro != 2);

        if (isOficina == true)
            Filtros = Filtros.filter(x => x.idFiltro == 2);

        return Filtros;
    }


    private CrateFiltros(Filtros: Filtro[]) {
        this.AddFiltro(Filtros, 1, "Fecha de activación");
        this.AddFiltro(Filtros, 2, "Oficina");
    }

    private AddFiltro(Filtros: Filtro[], id: number, nombreF: string) {
        let filtro = new Filtro();
        filtro.idFiltro = id;
        filtro.NombreFiltro = nombreF;
        Filtros.push(filtro);
    }

}