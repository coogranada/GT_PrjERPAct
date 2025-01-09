import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable()

export class DisponiblesService {
    private url: string = "";

    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    BuscarAsociado(Documento: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarProductoContractual`;
        const params = new HttpParams()
            .set('strDocumento', Documento)
            .set('strNombre', Nombre);
        return this._http.get<any>(this.url, { params: params });
    }
    BuscarCuenta(Cuenta: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarPorCuentaDisponible`;
        const params = new HttpParams()
            .set('PstrIdOficina', Cuenta.IdOficina)
            .set('PstrIdProducto', Cuenta.IdProductoCuenta)
            .set('PstrIdConsecutivo', Cuenta.IdConsecutivo)
            .set('PstrIdDigito', Cuenta.IdDigito);
        return this._http.get<any>(this.url, { params: params });
    }
    BuscarPorDocumento(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuentaporAsociadoDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    BuscarPorNombre(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuentaporAsociadoDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerRelacion(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerRelacionDisponible`;
        return this._http.get<any>(this.url);
    }
    Encabezado(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerEncabezadoDisponibles`;
        return this._http.get<any>(this.url);
    }
    CargarCanales(): Observable<any> {
        this.url = `${this.environment.Url}/CargarCanalesDisponibles`;
        return this._http.get<any>(this.url);
    }
    OperacionPermitida(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerOperacionPermitidaDisponible`;
        return this._http.get<any>(this.url);
    }  
    BuscarAsesor(Codigo: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarAsesorDisponible`;
        const params = new HttpParams()
            .set('strCodigo', Codigo)
            .set('strNombre', Nombre);
        return this._http.get<any>(this.url, { params: params });
    }
    BuscarAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AsesorExternoDisponible`;
        return this._http.post<any>(this.url, Datos);
    } 
    FormaPago(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerFormaPagoDisponible`;
        return this._http.get<any>(this.url);
    }  
    BuscarProducto(Producto: string, Descripcion: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarProductoContractual`;
        const params = new HttpParams()
            .set('PstrProducto', Producto)
            .set('PstrDescripcionProducto', Descripcion);
        return this._http.get<any>(this.url, { params: params });
    }  
    MedioPago(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerMedioPagoDisponible`;
        return this._http.get<any>(this.url);
    }  
    ConveniosTarjetas(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerConveniosTarjetas`;
        return this._http.get<any>(this.url);
    }
    Canales(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerCanales`;
        return this._http.get<any>(this.url);
    }  
    DiaCortePago(IdConvenio: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerCortePago?PintIdConvenio=${IdConvenio}`;
        return this._http.get<any>(this.url);
    }
    Plazo(IdConvenio: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPlazo?PintIdConvenio=${IdConvenio}`;
        return this._http.get<any>(this.url);
    }
    FechaVigencia(IdConvenio: string): Observable<any> {
        this.url = `${this.environment.Url}/FechaVigencia?PintIdConvenio=${IdConvenio}`;
        return this._http.get<any>(this.url);
    }
    TipoFirma(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTipoFirmaDisponible`;
        return this._http.get<any>(this.url);
    }  
    ObtenerHistorial(Cuenta: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerHistorialDisponible`;
        const params = new HttpParams()
            .set('PstrIdOficina', Cuenta.IdOficina)
            .set('PstrIdProducto', Cuenta.IdProductoCuenta)
            .set('PstrIdConsecutivo', Cuenta.IdConsecutivo)
            .set('PstrIdDigito', Cuenta.IdDigito);
        return this._http.get<any>(this.url, { params: params });
    }
    ObtenerConvenioContractual(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerConvenioDisponible`;
        return this._http.post<any>(this.url, Datos);
    } 
    BuscarTitular(Documento: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarTitularDisponible`;
        const params = new HttpParams()
            .set('PstrDocumento', Documento)
            .set('PstrNombre', Nombre);
        return this._http.get<any>(this.url, { params: params });
    } 
    CondicionesProducto(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/CondicionesProductoDisponible`;
        return this._http.post<any>(this.url, Datos);
    } 
    ValidarDisponibles(IdProducto: string): Observable<any> {
        this.url = `${this.environment.Url}/ValidarDisponibles?intIdProducto=${IdProducto}`;
        return this._http.get<any>(this.url);
    }
    ConsultarLibreta(CuponInicial: string): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarLibreta?PintCuponInicial=${CuponInicial}`;
        return this._http.get<any>(this.url);
    }
    GuardarDisponible(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    ConsultarTarjeta(NumeroTarjeta: string): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarTarjeta?PintNumeroTarjeta=${NumeroTarjeta}`;
        return this._http.get<any>(this.url);
    }
    ActualizarTitulares(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTitularesDisponibles`;
        return this._http.post<any>(this.url, Datos);
    }
    EditarAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarAsesorExternoDisponibles`;
        return this._http.post<any>(this.url, Datos);
    }
    ActualizarDisponible(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    ActualizarLibretaTarjeta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarLibretaTarjeta`;
        return this._http.post<any>(this.url, Datos);
    }
    ActualizarLibretaTarjetaSinCobro(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarLibretaTarjetaSinCobro`;
        return this._http.post<any>(this.url, Datos);
    }
    ActualizarOperacionPermitida(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarOperacionPermitida`;
        return this._http.post<any>(this.url, Datos);
    }
    ActualizarCanales(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarCanales`;
        return this._http.post<any>(this.url, Datos);
    }
    ActualizarMedioPago(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarMedioPago`;
        return this._http.post<any>(this.url, Datos);
    }
    BuscarLinea(IdLinea: string, NombreLinea: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarLinea`;
        const params = new HttpParams()
            .set('strIdLinea', IdLinea)
            .set('strNombreLinea', NombreLinea);
        return this._http.get<any>(this.url, { params: params });
    } 
    GenerarCuentaCupo(IdOficina: string, IdProducto: string, IdConsecutivo: string,IdDigito: string): Observable<any> {
        this.url = `${this.environment.Url}/GenerarCuentaCupo`;
        const params = new HttpParams()
            .set('PintIdOficina', IdOficina)
            .set('PintIdProducto', IdProducto)
            .set('PintIdConsecutivo', IdConsecutivo)
            .set('PintIdDigito', IdDigito);
        return this._http.get<any>(this.url, { params: params });
    }
    Observaciones(IdEstado: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerObservacionCambioEstadoDisponible?PintIdEstado=${IdEstado}`;
        return this._http.get<any>(this.url);
    }
    getBloquearCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BloquearCuentaDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    getDesbloquearCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/DesbloquearCuentaDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    getAnularCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AnularCuentaDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    getEmbargarCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EmbargarCuentaDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    obtenerIdObseCambioEstado(IdCuenta: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerIdObservacionCambioEstadoDisponible?PintIdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    GuardarObservacion(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarObservacionCambioEstadoDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    BuscarRadicado(Radicado: number, IdTercero: number): Observable<any> {
        this.url = `${this.environment.Url}/BuscarRadicadoDisponible`;
        const params = new HttpParams()
            .set('PintRadicado', Radicado)
            .set('IdTercero', IdTercero);
        return this._http.get<any>(this.url, { params: params });
    } 
    DescargarRegistroFirmas(Documeto: string, Cuenta: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarRegistroFirmas`;
        const params = new HttpParams()
            .set('PstrNumeroDocumento', Documeto)
            .set('PstrNumeroCuenta', Cuenta);
        return this._http.get<any>(this.url, { params: params });
    } 
    GenerarPDFCertificado(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GenerarPDFCertificado`;
        return this._http.post<any>(this.url, Datos);
    }
    SendMailPDFCertificado(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/SendMailPDFCertificado`;
        return this._http.post<any>(this.url, Datos);
    }
    ActivarCuenta(Cuenta: string): Observable<any> {
        this.url = `${this.environment.Url}/ActivarCuenta?IdCuenta=${Cuenta}`;
        return this._http.get<any>(this.url);
    }
    AsignarCupo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AsignarCupo`;
        return this._http.post<any>(this.url, Datos);
    }
    CancelarCupo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/CancelarCupo`;
        return this._http.post<any>(this.url, Datos);
    }
    GuardarGarantiaDisponible(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarGarantiaDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    CargarGarantia(IdTercero: string, radicado: string): Observable<any> {
        this.url = `${this.environment.Url}/CargarGarantiaDisponible`;
        const params = new HttpParams()
            .set('strIdTercero', IdTercero)
            .set('radicado', radicado);
        return this._http.get<any>(this.url, { params: params });
    } 
    GuardarGarantia(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarGarantiaDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    NovedadesAhorrosPDF(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/PDFNovedadesAhorrorDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    MarcarODesmarcarGMF(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/MarcarODesmarcarGMF`;
        return this._http.post<any>(this.url, Datos);
    }
    TimbrarMensaje(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/TimbrarMensaje`;
        return this._http.post<any>(this.url, Datos);
    }
    ExoneraCuotaManejoHasta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ExoneraCuotaManejoHasta`;
        return this._http.post<any>(this.url, Datos);
    }
    ImpresionRegistroFirma(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ImpresionRegistroFirmasDisponible`;
        return this._http.post<any>(this.url, Datos);
    }
    CreaNotificacion(IdTercero: number, IdCuenta: number, IdNotificacion: number,strTarjeta: string): Observable<any> {
        this.url = `${this.environment.Url}/CreaNotificacion`;
        const params = new HttpParams()
            .set('PintIdTercero', IdTercero)
            .set('PintIdCuenta', IdCuenta)
            .set('PintNotificador', IdNotificacion)
            .set('strEstadoTarjetas', strTarjeta);
        return this._http.get<any>(this.url, { params: params });
    }
    ValidaFechaActualiza(IdTercero: string): Observable<any> {
        this.url = `${this.environment.Url}/ValidaFechaActualiza?strIdTercero=${IdTercero}`;
        return this._http.get<any>(this.url);
    }
}
