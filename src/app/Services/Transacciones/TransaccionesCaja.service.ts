import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class TransaccionesCajaService {
    private url: string = "";

    constructor(private _http: HttpClient, private environment: EnvironmentService) { }
    ObtenerListaCatProductos(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerListaCatProductos`;
        return this._http.get<any>(this.url);
    }

    BuscarProductosTransa(codProducto: number, Documento: string, Tipo: number): Observable<any> {
        if (codProducto === 4) {
            return this.ObtenerProductoAporteTransa(Documento);
        } else if (codProducto === 1 || codProducto === 2 || codProducto === 3) {
            return this.ObtenerProductosAhorroTransa(Documento, Tipo);
        } else if (codProducto === 9) {
            return this.ObtenerProductoSeguroTransa(Documento);
        } else if (codProducto === 10) {
            return this.ObtenerProductosCarteraTransa(Documento);
        } else if (codProducto === 11) {
            return this.ObtenerProductosConveniosTransa(Documento);
        } else {
            return of([]);
        }
    }


    ObtenerProductosAhorroTransa(Documento: string, Tipo: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerProductosAhorroTransa?Documento=` + Documento + `&Tipo=` + Tipo;
        return this._http.get<any>(this.url);
    }

    ObtenerProductoAporteTransa(Documento: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerProductoAporteTransa?Documento=` + Documento;
        return this._http.get<any>(this.url);
    }

    ObtenerProductosCarteraTransa(Documento: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerProductosCarteraTransa?Documento=` + Documento;
        return this._http.get<any>(this.url);
    }

    ObtenerProductoSeguroTransa(Documento: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerProductoSeguroTransa?Documento=` + Documento;
        return this._http.get<any>(this.url);
    }

    ObtenerProductosConveniosTransa(Documento: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerResumenContrato?Documento=` + Documento;
        return this._http.get<any>(this.url);
    }

    ObtenerEncabezadoTransa(Documento: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerEncabezadoTransa?Documento=` + Documento;
        return this._http.get<any>(this.url);
    }

    ObtenerEncabezadoNombreTransa(Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerEncabezadoNombreTransa?Nombre=` + Nombre;
        return this._http.get<any>(this.url);
    }

    RecaudarOlivos(Solicitud: any): Observable<any> {
        this.url = `${this.environment.Url}/RecaudarOlivos`;
        return this._http.post<any>(this.url, Solicitud);
    }

    GenerarPDFTransaccion(data: any): Observable<any> {
        this.url = `${this.environment.Url}/GenerarPDFTransaccion`;
        return this._http.post<any>(this.url, data);
    }

    ObtenerTransaccionxPerfil(IdPerfil: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTransaccionxPerfil`;
        return this._http.post<any>(this.url, IdPerfil);
    }

    ObtenerAutorizadosTransa(IdCuenta: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerAutorizados?lngCuenta=` + IdCuenta;
        return this._http.get<any>(this.url);
    }

    ValidarEstadoTaquilla(IdOficina: number, IdUsuario: number): Observable<any> {
        const params = {
            IdOficina: IdOficina.toString(),
            IdUsuario: IdUsuario.toString()
        };

        return this._http.get<any>(
            `${this.environment.Url}/ValidarEstadoTaquilla`,
            { params }
        );
    }

     ObtenerCuentaTesoreria(IdOficina: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerCuentaTesoreria?IdOficina=` + IdOficina;
        return this._http.get<any>(this.url);
    }

    ObtenerProductoCuentaTransa(IdOficina: string, IdProducto: string, Consecutivo: string, Digito: string, IdOficinaActual: string): Observable<any> {
        const params = {
            PstrIdOficina: IdOficina,
            PstrIdProducto: IdProducto,
            PstrIdConsecutivo: Consecutivo,
            PstrIdDigito: Digito,
            PstrOficinaActual: IdOficinaActual
        };

        return this._http.get<any>(
            `${this.environment.Url}/ObtenerProductoCuentaTransa`,
            { params }
        );
    }
    
    ObtenerOtrasTransacciones(IdPerfil: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerOtrasTransacciones`;
        return this._http.post<any>(this.url, IdPerfil);
    }

    GuardarTransaccion(Solicitud: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarTransaccion`;
        return this._http.post<any>(this.url, Solicitud);
    }

    ValidarAutorizaNovedad(Usuario: string, IdNovedad: number): Observable<any> {
        const params = {
            Usuario: Usuario,
            IdNovedad: IdNovedad
        };

        return this._http.get<any>(
            `${this.environment.Url}/ValidarAutorizaNovedad`,
            { params }
        );
    }

    ObtenerValidadora(IdUsuario: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerValidadora?IdUsuario=` + IdUsuario;
        return this._http.get<any>(this.url);
    }

}