import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable()

export class ContractualService {
    private url: string = "";

    constructor(private _http: HttpClient,private environment: EnvironmentService ) { }
    getBuscarProducto(Producto: string, Descripcion: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarProductoContractual`;
        const params = new HttpParams()
            .set('PstrProducto', Producto)
            .set('PstrDescripcionProducto', Descripcion);
        return this._http.get<any>(this.url, { params: params });
    }
    getBuscarAsesor(Codigo: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarAsesorContractual`;
        const params = new HttpParams()
            .set('strCodigo', Codigo)
            .set('strNombre', Nombre);
        return this._http.get<any>(this.url, { params: params });
    }
    getFormaPago(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerFormaPagoContractual`;
        return this._http.get<any>(this.url);
    }
    TipoFirma(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTipoFirmaContractual`;
        return this._http.get<any>(this.url);
    }
    getOperacionPermitida(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerOperacionPermitidaContractual`;
        return this._http.get<any>(this.url);
    }
    ObtenerRelacion(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerRelacionContractual`;
        return this._http.get<any>(this.url);
    }
    getEncabezado(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerEncabezadoContractual`;
        return this._http.get<any>(this.url);
    }
    BuscarAsociado(Documento: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarAsociadoContractual`;
        const params = new HttpParams()
            .set('strDocumento', Documento)
            .set('strNombre', Nombre);
        return this._http.get<any>(this.url, { params: params });
    }
    BuscarPorIdCuenta(IdCuenta: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarPorIdCuenta?intIdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    BuscarTitular(Documento: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarTitularContractual`;
        const params = new HttpParams()
            .set('PstrDocumento', Documento)
            .set('PstrNombre', Nombre);
        return this._http.get<any>(this.url, { params: params });
    }
    getParentesco(): Observable<any> {
        this.url = `${this.environment.Url}/GetParentescos`;
        return this._http.get<any>(this.url);
    }
    getBuscarCuenta(Cuenta: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuentaContractual`;
        const params = new HttpParams()
            .set('PstrIdOficina', Cuenta.IdOficina)
            .set('PstrIdProducto', Cuenta.IdProductoCuenta)
            .set('PstrIdConsecutivo',  Cuenta.IdConsecutivo)
            .set('PstrIdDigito', Cuenta.IdDigito);
        return this._http.get<any>(this.url, { params: params });
    }
    getBuscarPorDocumento(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuentaporAsociadoContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    getBuscarPorNombre(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuentaporAsociadoContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerHistorial(Cuenta: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerHistorialContractual`;
        const params = new HttpParams()
            .set('PstrIdOficina', Cuenta.IdOficina)
            .set('PstrIdProducto', Cuenta.IdProductoCuenta)
            .set('PstrIdConsecutivo',  Cuenta.IdConsecutivo)
            .set('PstrIdDigito', Cuenta.IdDigito);
        return this._http.get<any>(this.url, { params: params });
    }
    getBuscarCuentaAhorros(Cuenta: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarPorCuentaDisponible`;
        const params = new HttpParams()
            .set('PstrIdOficina', Cuenta.IdOficinaNegociacion)
            .set('PstrIdProducto', Cuenta.IdProductoCuentaNegociacion)
            .set('PstrIdConsecutivo', Cuenta.IdConsecutivoNegociacion);
        return this._http.get<any>(this.url, { params: params });
    }
    getBuscarAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AsesorExternoContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    getBuscarPorDocumentoNegociacion(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuentaporAsociadoContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    getPeriodo(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPeriodoContractual`;
        return this._http.get<any>(this.url);
    }
    getIndicador(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerIndicadorContractual`;
        return this._http.get<any>(this.url);
    }
    ObtenerTasa(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTasaContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    getLiquidacion(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerLiquidacionContractual`;
        return this._http.get<any>(this.url);
    }
    getValidarSorteo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ValidarSorteo`;
        return this._http.post<any>(this.url, Datos);
    }
    getBuscarCuentaDisponible(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuentaDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    getGuardarContractual(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    getActualizarContractual(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    getActualizarTasaContractual(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTasaContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    Observaciones(IdEstado: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerObservacionCambioEstado?PintIdEstado=${IdEstado}`;
        return this._http.get<any>(this.url);
    }
    GuardarObservacion(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarObservacionCambioEstado`;
        return this._http.post<any>(this.url, Datos);
    }
    getBloquearCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BloquearCuentaContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    getDesbloquearCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/DesbloquearCuentaContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    getAnularCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AnularCuentaContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    getEmbargarCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EmbargarCuentaContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    getCondicionesProducto(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/CondicionesProductoContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    BuscarAsociadoDebito(Documento: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarAsociadoDebito`;
        const params = new HttpParams()
            .set('strDocumento', Documento)
            .set('strNombre', Nombre);
        return this._http.get<any>(this.url, { params: params });
    }
    getBuscarCuentaDebito(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuentaDebito`;
        return this._http.post<any>(this.url, Datos);
    }
    getActualizarTitulares(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTitulares`;
        return this._http.post<any>(this.url, Datos);
    }
    getObtenerTasaNominal(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTasaNominal`;
        return this._http.post<any>(this.url, Datos);
    }
    getObtenerConvenioContractual(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerConvenioContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    getGuardarContractualConDebito(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarContractualConDebito`;
        return this._http.post<any>(this.url, Datos);
    }
    obtenerIdObseCambioEstado(IdCuenta: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerIdObservacionCambioEstado?PintIdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    getEditarAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarAsesorExternoContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerPuntosAdicionales(IdProducto: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPuntosAdicionales?PintIdProducto=${IdProducto}`;
        return this._http.get<any>(this.url);
    }
    ValidarTitulo(NroTitulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ValidarTitulo?PintNroTitulo=${NroTitulo}`;
        return this._http.get<any>(this.url);
    }
    getEliminarDebitoAutomatico(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EliminarDebitoAutomatico`;
        return this._http.post<any>(this.url, Datos);
    }
    ActualizarTitulo(NroTitulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTituloContractual?PintNroTitulo=${NroTitulo}`;
        return this._http.get<any>(this.url);
    }
    LiberarSorteo(Sorteo: string, IdCuenta: string): Observable<any> {
        this.url = `${this.environment.Url}/LiberarSorteoContractual`;
        const params = new HttpParams()
            .set('PintSorteo', Sorteo)
            .set('PintIdCuenta', IdCuenta);
        return this._http.get<any>(this.url, { params: params });
    }
    ActualizarNroTitulo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarNroTitulo`;
        return this._http.post<any>(this.url, Datos);
    }
    GenerarImpresion(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GenerarPDFImpresionContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    GetDatosDebito(idCuenta: number) : Observable<any> {
        this.url = `${this.environment.Url}/GenerarPDFImpresionContractual/${idCuenta}`;
        return this._http.get<any>(this.url);
    }
}
