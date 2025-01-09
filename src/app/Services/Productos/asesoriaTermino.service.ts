import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable()
export class AsesoriaTerminoService {
 
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }
    BuscarAsesoria(documento: string, nombre: string, numeroAsesoria: string) : Observable<any> {
        this.url = this.environment.Url + "/BuscarAsesoriaTermino/" + documento + "/" + nombre + "/" + numeroAsesoria;
        return this._http.get<any>(this.url);
    }
    GetHistorial(numeroAsesoria : number) : Observable<any> {
        this.url = this.environment.Url + '/GetHistorialAsesoriaTermino/' + numeroAsesoria;
        return this._http.get<any>(this.url);
    }
    GenerarImpresionTermino(itemsSend: any) : Observable<any> {
        this.url = this.environment.Url + '/GetImpresionAsesoriaTermino/';
        return this._http.post<any>(this.url,itemsSend);
      }
      BuscarNombreXDocumento(Documento: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarXDocumentoTermino?strDocumento=${Documento}`;
        return this._http.get<any>(this.url);
    } 
    BuscarNombreXNombre(Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarXNombreTermino?strNombre=${Nombre}`;
        return this._http.get<any>(this.url);
    } 
    ObtenerRelacion(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerRelacionTerminoAsesoria`;
        return this._http.get<any>(this.url);
    }
    BuscarAsesor(Codigo: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarAsesorTerminoAsesoria`;
        const params = new HttpParams()
            .set('strCodigo', Codigo)
            .set('strNombre', Nombre);
        return this._http.get<any>(this.url,{params: params });
    } 
    BuscarAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AsesorExternoTerminoAsesoria`;
        return this._http.post<any>(this.url, Datos);
    } 
    EditarAsesorExterno(Datos: any): Observable<any> {
        this.url = this.environment.Url + '/EditarAsesorExternoAsesoriaTermino';
        return this._http.post<any>(this.url, Datos);
    }
    CondicionesProducto(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/CondicionesProductoTerminoAsesoria`;
        return this._http.post<any>(this.url, Datos);
    } 
    BuscarProducto(Producto: string, Descripcion: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarProductoTerminoAsesoria`;
        const params = new HttpParams()
            .set('PstrProducto', Producto)
            .set('PstrDescripcionProducto', Descripcion);
        return this._http.get<any>(this.url,{params: params });
    } 
    ObtenerFrecuenciaPago(plazo : number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerFrecuenciaPagoTermino`;
        const params = new HttpParams().set('intPlazo', plazo);
        return this._http.get<any>(this.url,{params: params });
    }
    ObtenerPuntosAdicionales(IdProducto: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPuntosAdicionalesTermino?PintIdProducto=${IdProducto}`;
        return this._http.get<any>(this.url);
    }
    ObtenerTasa(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTasaTerminoAsesoria`;
        return this._http.post<any>(this.url, Datos);
    } 
    ObtenerIntereses(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInteresesTerminoAsesoria`;
        return this._http.post<any>(this.url, Datos);
    } 
    ObtenerRetencionAsesoriaTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerRetencionAsesoriaTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    GuardarAsesoria(Datos: any): Observable<any> {
        this.url = this.environment.Url + '/GuardarAsesoriaTermino';
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerTasaConPuntos(Datos: any): Observable<any> {
        this.url = this.environment.Url + '/ObtenerTasaConPuntos';
        return this._http.post<any>(this.url, Datos);
    }
}