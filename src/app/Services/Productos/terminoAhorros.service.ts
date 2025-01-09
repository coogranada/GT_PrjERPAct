import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()

export class TerminoAhorrosService {
   private url: string = "";
   constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    ObtenerRelacion(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerRelacionTermino`;
        return this._http.get<any>(this.url);
    }
    OperacionPermitida(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerOperacionPermitidaTermino`;
        return this._http.get<any>(this.url);
    }
    BuscarCuenta(Cuenta: any): Observable<any> {
      this.url = `${this.environment.Url}/BuscarPorCuentaTermino`;
      const params = new HttpParams()
          .set('PstrIdOficina', Cuenta.IdOficina)
          .set('PstrIdProducto', Cuenta.IdProductoCuenta)
          .set('PstrIdConsecutivo', Cuenta.IdConsecutivo)
          .set('PstrIdDigito', Cuenta.IdDigito);
      return this._http.get<any>(this.url, { params: params });
    }
    Liquidacion(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerLiquidacionTermino`;
        return this._http.get<any>(this.url);
    }    
    ObtenerPuntosAdicionales(IdProducto: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPuntosAdicionalesTermino?PintIdProducto=${IdProducto}`;
        return this._http.get<any>(this.url);
    }
    ObtenerHistorial(Cuenta: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerHistorialTermino`;
        const params = new HttpParams()
            .set('PstrIdOficina', Cuenta.IdOficina)
            .set('PstrIdProducto', Cuenta.IdProductoCuenta)
            .set('PstrIdConsecutivo', Cuenta.IdConsecutivo)
            .set('PstrIdDigito', Cuenta.IdDigito);
        return this._http.get<any>(this.url, { params: params });
    }
    BuscarPorAsociado(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCuentaporAsociadoTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    BuscarCuentaDisponible(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/BuscarCuentaDisponibleTermino`;
    return this._http.post<any>(this.url, Datos);
    }
    Encabezado(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerEncabezadoTermino`;
        return this._http.get<any>(this.url);
    }  
    BuscarAsesor(Codigo: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarAsesorTermino`;
        const params = new HttpParams()
            .set('strCodigo', Codigo)
            .set('PstrNombre', Nombre);
        return this._http.get<any>(this.url, { params: params });
    } 
    BuscarAsociado(Documento: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarAsesorTermino`;
        const params = new HttpParams()
            .set('strDocumento', Documento)
            .set('PstrNombre', Nombre);
        return this._http.get<any>(this.url, { params: params });
    } 
    CondicionesProducto(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/CondicionesProductoTermino`;
      return this._http.post<any>(this.url, Datos);
    } 
    BuscarProducto(Producto: string, Descripcion: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarProductoTermino`;
        const params = new HttpParams()
            .set('PstrProducto', Producto)
            .set('PstrDescripcionProducto', Descripcion);
        return this._http.get<any>(this.url, { params: params });
    } 
    ObtenerFrecuenciaPago(Plazo: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerFrecuenciaPagoTermino?intPlazo=${Plazo}`;
        return this._http.get<any>(this.url);
    }
    ObtenerTasa(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerTasaTermino`;
      return this._http.post<any>(this.url, Datos);
    } 
    ObtenerTasaConPuntos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTasaConPuntos`;
        return this._http.post<any>(this.url, Datos);
    } 
    ObtenerIntereses(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInteresesTerminoAsesoria`;
        return this._http.post<any>(this.url, Datos);
    } 
    ObtenerRetencion(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerRetencionAsesoriaTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    ValidarTitulo(NroTitulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ValidarTituloTermino?PintNroTitulo=${NroTitulo}`;
        return this._http.get<any>(this.url);
    }
    BuscarTitular(Documento: string, Nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarTitularTermino`;
        const params = new HttpParams()
            .set('PstrDocumento', Documento)
            .set('PstrNombre', Nombre);
        return this._http.get<any>(this.url, { params: params });
    }
    ObtenerTipoDocumento(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTipoDocumentoTermino`;
        return this._http.get<any>(this.url);
    }
    TipoFirma(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTipoFirmaTermino`;
        return this._http.get<any>(this.url);
    }
    ActualizarTitularesTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTitularesTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    BuscarBeneficiario(Documento: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarBeneficiarioTermino?strDocumento=${Documento}`;
        return this._http.get<any>(this.url);
    }
    Parentesco(): Observable<any> {
        this.url = `${this.environment.Url}/GetParentescos`;
        return this._http.get<any>(this.url);
    }
    GuardarTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarTermino`;
        return this._http.post<any>(this.url, Datos);
    }
    BuscarAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AsesorExternoTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    GenerarImpresionTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GenerarPDFImpresionTermino`;
        return this._http.post<any>(this.url, Datos);
    }   
    ConvertNumeroALetras(num: number): Observable<any> {
        this.url = `${this.environment.Url}/ConvertirNumeroALetras/=${num}`; // revisar
        return this._http.get<any>(this.url);
    }
    getEditarAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarAsesorExternoTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    Observaciones(IdEstado: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerObservacionCambioEstadoTermino?PintIdEstado=${IdEstado}`;
        return this._http.get<any>(this.url);
    }
    getBloquearCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/BloquearCuentaTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    getDesbloquearCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/DesbloquearCuentaTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    getAnularCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AnularCuentaTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    getEmbargarCuenta(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EmbargarCuentaTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    obtenerIdObseCambioEstado(IdCuenta: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerIdObservacionCambioEstadoTermino?PintIdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    GuardarObservacion(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarObservacionCambioEstadoTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    ActualizarTitulo(NroTitulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTituloTermino?PintNroTitulo=${NroTitulo}`;
        return this._http.get<any>(this.url);
    }
    ActualizarNroTitulo(idNroTutilo : number , idCuenta : number,idnumeroTituloAnt : number): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarNroTituloTermino`;
        const params = new HttpParams()
            .set('/', idNroTutilo)
            .set('/', idCuenta)
            .set('/', idnumeroTituloAnt);
        return this._http.get<any>(this.url, { params: params }); // revisar
    }   
    ObtenerCuentaReciprocidadTermino(cedula: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerCuentaReciprocidadTermino?=${cedula}`; // revisar
        return this._http.get<any>(this.url);
    }
    GuardarCuentaReciprocidadTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarCuentaReciprocidadTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    getActualizarTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    CuentaDestinoPDF(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GenerarFormatoCuentaDestinoPDFTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    ReciprocidadSetDate(idCuenta: string): Observable<any> {
        this.url = `${this.environment.Url}/ReciprocidadSetDateTermino/=${idCuenta}`; // revisar
        return this._http.get<any>(this.url);
    }
    ReciprocidadSetDateList(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ReciprocidadSetDateListTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    ActualizarBeneficiarios(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarBeneficiarioTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    ActualizarCesionTituloTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarCesionTituloTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    ObtenerPersonasByDocumentoCesionTermino(doc: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPersonasByDocumentoCesionTermino/=${doc}`; // revisar
        return this._http.get<any>(this.url);
    }
    ObtenerPersonasByNombreCesionTermino(nombre: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPersonasByNombreCesionTermino/=${nombre}`; // revisar
        return this._http.get<any>(this.url);
    } 
    GenerarPDFCapitalizacionTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GenerarPDFCapitalizacionTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    ObtenerTasaNominal(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTasaNominalTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    ActualizarTasaTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTasaTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    EliminarCuentaReciprocidadTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EliminarCuentaReciprocidadTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    BuscarVetadoTermino(doc: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarVetadoTermino/=${doc}`;
        return this._http.get<any>(this.url);
    } 
    GuardarAsesoria(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarAsesoriaTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
}
