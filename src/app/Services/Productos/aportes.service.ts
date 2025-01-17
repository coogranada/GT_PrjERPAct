import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class AportesService {
    private url: string = "";

    constructor(private _http: HttpClient,private environment: EnvironmentService ) { }

    getNovedades(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/OperacionesPermitidas`;
        return this._http.post<any>(this.url, Datos);
    } 
    getBuscarProducto(Producto: string, Descripcion: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarProducto`;
        const params = new HttpParams()
            .set('PstrProducto', Producto)
            .set('PstrDescripcionProducto', Descripcion);
        return this._http.get<any>(this.url,{params: params });
    } 
    getFormaPago(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerFormaPago`;
        return this._http.get<any>(this.url);
    }
    getOperacionPermitida(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerOperacionPermitida`;
        return this._http.get<any>(this.url);
    }
    BuscarAsociado(Documento: string, Nombre: string, Oficina: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarAsociadoAportes`;
        const params = new HttpParams()
            .set('strDocumento', Documento)
            .set('strNombre', Nombre)
            .set('strIdOficina', Oficina);
        return this._http.get<any>(this.url,{params: params });
    } 
    BuscarBeneficiario(Documento: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarBeneficiario?strDocumento=${Documento}`;
        return this._http.get<any>(this.url);
    }    
    getEncabezado(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerEncabezadoProducto`;
        return this._http.get<any>(this.url);
    }
    getBuscarCuenta(Cuenta: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuenta`;
        const params = new HttpParams()
            .set('PstrIdOficina', Cuenta.IdOficina)
            .set('PstrIdProducto', Cuenta.IdProductoCuenta )
            .set('PstrIdConsecutivo', Cuenta.IdConsecutivo )
            .set('PstrIdDigito', Cuenta.IdDigito);
        return this._http.get<any>(this.url,{params: params });
    } 
    getBuscarPorDocumento(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuentaporAsociado`;
        return this._http.post<any>(this.url, Datos);
    } 
    getBuscarPorNombre(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuentaporAsociado`;
        return this._http.post<any>(this.url, Datos);
    } 
    getParentesco(): Observable<any> {
        this.url = `${this.environment.Url}/GetParentescos`;
        return this._http.get<any>(this.url);
    }
    getTipoDocumento() : Observable<any> {
        this.url = this.environment.Url + '/ObtenerTipoDocumentoAportes';
        return this._http.get<any>(this.url)
    }    
    getGuardarAportes(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarAportes`;
        return this._http.post<any>(this.url, Datos);
    } 
    getActualizaBeneficiarios(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarBeneficiarioAportes`;
        return this._http.post<any>(this.url, Datos);
    }
    getBuscarAsesor(Codigo: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarAsesorAportes`;
        const params = new HttpParams()
            .set('strCodigo', Codigo)
            .set('strNombre', Nombre);
        return this._http.get<any>(this.url,{params: params });
    } 
    ObtenerHistorial(Cuenta: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerHistorialAportes`;
        const params = new HttpParams()
            .set('PstrIdOficina', Cuenta.IdOficina)
            .set('PstrIdProducto', Cuenta.IdProductoCuenta )
            .set('PstrIdConsecutivo', Cuenta.IdConsecutivo )
            .set('PstrIdDigito', Cuenta.IdDigito);
        return this._http.get<any>(this.url,{params: params });
    } 
    getEditarFormaPago(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarFormaPago`;
        return this._http.post<any>(this.url, Datos);
    }
    getEditarAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarAsesorExternoAportes`;
        return this._http.post<any>(this.url, Datos);
    }    
    getBuscarAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AsesorExternoAportes`;
        return this._http.post<any>(this.url, Datos);
    }
    Observaciones(data: string): Observable<any> {
        this.url = `${this.environment.Url}/GetObservacionAll?idModulo=${data}`;
        return this._http.get<any>(this.url);
    }
    getÖbtenerConvenioAportes(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerConvenioAportes`;
        return this._http.post<any>(this.url, Datos);
    }
    getAnularCuenta(data : any) : Observable<any>{
        this.url = this.environment.Url + '/AnularCuentaAportes';
        return this._http.post<any>(this.url, data)
    }
}



