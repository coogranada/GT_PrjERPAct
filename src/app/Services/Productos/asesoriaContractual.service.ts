import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()

export class AsesoriaContractualService {
    private url: string = "";

    constructor(private _http: HttpClient, private environment: EnvironmentService) { }
    CondicionesProducto(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/CondicionesProductoContractualAsesoria`;
        return this._http.post<any>(this.url, Datos);
    } 
    BuscarProducto(Producto: string, Descripcion: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarProductoContractualAsesoria`;
        const params = new HttpParams()
            .set('PstrProducto', Producto)
            .set('PstrDescripcionProducto', Descripcion);
        return this._http.get<any>(this.url,{params: params });
    } 
    ObtenerRelacion(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerRelacionContractualAsesoria`;
        return this._http.get<any>(this.url);
    }
    BuscarAsesor(Codigo: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarAsesorContractualAsesoria`;
        const params = new HttpParams()
            .set('strCodigo', Codigo)
            .set('strNombre', Nombre);
        return this._http.get<any>(this.url,{params: params });
    } 
    BuscarAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AsesorExternoContractualAsesoria`;
        return this._http.post<any>(this.url, Datos);
    } 
    Periodo(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPeriodoContractualAsesoria`;
        return this._http.get<any>(this.url);
    }
    ObtenerTasa(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTasaContractualAsesoria`;
        return this._http.post<any>(this.url, Datos);
    } 
    BuscarAsesoria(Documento: string, Nombre: string, NumeroAsesoria: string): Observable<any> {
        this.url = this.environment.Url + '/BuscarAsesoria'//?PstrNumeroDocuento=' + Documento +
       // '&PstrNombre=' + Nombre + '&PstrNumeroAsesoria=' + NumeroAsesoria;
        // this.url = `${this.environment.Url}/BuscarAsesorContractualAsesoria`;
        const params = new HttpParams()
            .set('PstrNumeroDocuento', Documento)
            .set('PstrNombre', Nombre)
            .set('PstrNumeroAsesoria', NumeroAsesoria);
        return this._http.get<any>(this.url,{params: params });
    } 
    BuscarNombreXDocumento(Documento: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarXDocumento?strDocumento=${Documento}`;
        return this._http.get<any>(this.url);
    } 
    BuscarNombreXNombre(Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarXNombre?strNombre=${Nombre}`;
        return this._http.get<any>(this.url);
    } 
    ObtenerIntereses(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerIntereses`;
        return this._http.post<any>(this.url, Datos);
    } 
    ObtenerInteresesSemilla(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInteresesSemilla`;
        return this._http.post<any>(this.url, Datos);
    } 
    ObtenerRetencion(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerRetencion`;
        return this._http.post<any>(this.url, Datos);
    } 
    EditarAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarAsesorExternoAsesoria`;
        return this._http.post<any>(this.url, Datos);
    }
    GuardarAsesoriaContractual(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarAsesoriaContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    ActualizarAsesoriaContractual(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarAsesoriaContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerHistorial(NumeroAsesoria: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerHistorialAsesoria?NumeroAsesoria=${NumeroAsesoria}`;
        return this._http.get<any>(this.url);
    } 
}
