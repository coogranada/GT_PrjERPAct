import { ConsecutivosLog } from '../../../app/Models/Configuracion/Maestro_productos/ConsecutivosLog.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable()

export class ConsecutivoTituloService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }
   
    GuardarConsecutivoTitulo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarConsecutivoTitulo`;
        return this._http.post<any>(this.url, Datos);
    }
    ActualizarConsecutivoTitulo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarConsecutivoTitulo`;
        return this._http.post<any>(this.url, Datos);
    }
    Oficinas(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerOficinasUsuarios`;
        return this._http.get<any>(this.url);
    }
    BuscarTitulo(NroTituloInicial: number, NroTituloFinal: number): Observable<any> {
        this.url = `${this.environment.Url}/BuscarTitulo`;
        const params = new HttpParams()
            .set('PintNroTitiloInicial', NroTituloInicial)
            .set('PintNroTituloFinal', NroTituloFinal);
        return this._http.get<any>(this.url, { params: params });
    }
    BuscarTituloTermino(NroTituloInicial: number, NroTituloFinal: number): Observable<any> {
        this.url = `${this.environment.Url}/BuscarTituloTermino`;
        const params = new HttpParams()
            .set('PintNroTitiloInicial', NroTituloInicial)
            .set('PintNroTituloFinal', NroTituloFinal);
        return this._http.get<any>(this.url, { params: params });
    }
    ValidarTitulo(NroTituloInicial: string): Observable<any> {
        this.url = `${this.environment.Url}/ValidarTituloInicial?PintNroTitiloInicial=${NroTituloInicial}`;
        return this._http.get<any>(this.url);
    }
    ObterneConsecutivos(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerModulosConsecutivos`;
        return this._http.get<any>(this.url);
    }
    ObtenerDocumentosConsecutivos(IdModulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerDocumentosConsecutivos?IdModulo=${IdModulo}`;
        return this._http.get<any>(this.url);
    }
    ObtenerDocumentosDisponibles(IdProducto: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerDocumentosDisponibles?IdProducto=${IdProducto}`;
        return this._http.get<any>(this.url);
    }
    ObtenerColillasDisponibles(IdProducto: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerColillasDisponibles?IdProducto=${IdProducto}`;
        return this._http.get<any>(this.url);
    }
    ObtenerProductosConsecutivos(IdModulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerProductosConsecutivos?IdModulo=${IdModulo}`;
        return this._http.get<any>(this.url);
    }
    ObtenerEstadoConsecutivos(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerEstadosConsecutivos`;
        return this._http.get<any>(this.url);
    }
    ObtenerMotivoAnulacionConsecutivos(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerMotivoAnulacionConsecutivos`;
        return this._http.get<any>(this.url);
    }  
    ObtenerNroTituloConsecutivos(intNroTitulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerNroTituloConsecutivos?intNroTitulo=${intNroTitulo}`;
        return this._http.get<any>(this.url);
    }   
    AnularNroTituloConsecutivos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AnularNroTituloConsecutivos`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInfoRangoTitulosConsecutivos(NroTituloInicial: number, NroTituloFinal: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInfoRangoTitulosConsecutivos`;
        const params = new HttpParams()
        .set('intNroTituloInicial', NroTituloInicial)
        .set('intNroTituloFinal', NroTituloFinal);
        return this._http.get<any>(this.url,{params: params });
    } 
    GuardarRangoTituloTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarTitulosTermino`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerNroTituloTermino(intNroTitulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerNroTituloTermino?intNroTitulo=${intNroTitulo}`;
        return this._http.get<any>(this.url);
    } 
    AnularNroTituloTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AnularNroTituloTermino`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInfoRangoTitulosTermino(NroTituloInicial: number, NroTituloFinal: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInfoRangoTitulosTermino`;
        const params = new HttpParams()
        .set('intNroTituloInicial', NroTituloInicial)
        .set('intNroTituloFinal', NroTituloFinal);
        return this._http.get<any>(this.url,{params: params });
    }  
    ObtenerTitulosTerminoRegistrar(FechaInicial: string, FechaFinal: string, idOficina: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTitulosTerminoRegistrar`;
        const params = new HttpParams()
        .set('dateFechaInicial', FechaInicial)
        .set('dateFechaFinal', FechaFinal)
        .set('idOficina', idOficina);
        return this._http.get<any>(this.url,{params: params });
    }      
    ActualizarRangoTituloTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTitulosTermino`;
        return this._http.post<any>(this.url, Datos);
    }
    ConfirmarRangoTituloTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConfirmarRangoTituloTermino`;
        return this._http.post<any>(this.url, Datos);
    }
    ConfirmarRangoTituloConsecutivos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConfirmarRangoTituloContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    GuardarDisponibles(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarDisponibles`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInfoDisponibles(NroTituloInicial: number, NroTituloFinal: number, intIdProducto: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInfoDisponibles`;
        const params = new HttpParams()
        .set('intNroTituloInicial', NroTituloInicial)
        .set('intNroTituloFinal', NroTituloFinal)
        .set('intIdProducto', intIdProducto);
        return this._http.get<any>(this.url,{params: params });
    } 
    GuardarTarjetasDisponibles(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarTarjetasDisponibles`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInfoTarjetasDisponibles(NroTituloInicial: number, NroTituloFinal: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInfoTarjetasDisponibles`;
        const params = new HttpParams()
        .set('intNroTituloInicial', NroTituloInicial)
        .set('intNroTituloFinal', NroTituloFinal);
        return this._http.get<any>(this.url,{params: params });
    } 
    ActualizarTitulosRegistrar(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTitulosRegistrar`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerNroLibretaDisponible(intNroTitulo: number, Producto: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInfoTarjetasDisponibles`;
        const params = new HttpParams()
        .set('intNroTitulo', intNroTitulo)
        .set('IdProducto', Producto);
        return this._http.get<any>(this.url,{params: params });
    } 
    ObtenerNroTarjetasDisponible(intNroTitulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerNroTarjetasDisponible?intNroTitulo=${intNroTitulo}`;
        return this._http.get<any>(this.url);
    } 
    BuscarLibretasDisponibles(NroTituloInicial: number, NroTituloFinal: number, Producto: number): Observable<any> {
        this.url = `${this.environment.Url}/BuscarLibretasDisponibles`;
        const params = new HttpParams()
        .set('intNroTitulo', NroTituloInicial)
        .set('intNroTitulo', NroTituloFinal)
        .set('IdProducto', Producto);
        return this._http.get<any>(this.url,{params: params });
    } 
    ObtenerInfoLibretasDisponibles(NroTituloInicial: number, Producto: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInfoLibretasDisponibles`;
        const params = new HttpParams()
        .set('intNroTitiloInicial', NroTituloInicial)
        .set('IdProducto', Producto);
        return this._http.get<any>(this.url,{params: params });
    } 
    ObtenerInfoTarjetaDisponibles(NroTituloInicial: number, NroTituloFinal: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInfoTarjetaDisponibles`;
        const params = new HttpParams()
        .set('NroTituloInicial', NroTituloInicial)
        .set('NroTituloFinal', NroTituloFinal);
        return this._http.get<any>(this.url,{params: params });
    } 
    AnularLibretaDisponibles(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AnularLibretaDisponibles`;
        return this._http.post<any>(this.url, Datos);
    }
    AnularTarjetaDisponibles(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AnularTarjetaDisponibles`;
        return this._http.post<any>(this.url, Datos);
    }  
    ActualizarLibretasDisponibles(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarLibretasDisponibles`;
        return this._http.post<any>(this.url, Datos);
    }  
    ActualizarTarjetasDisponibles(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTarjetasDisponibles`;
        return this._http.post<any>(this.url, Datos);
    } 
    ConfirmarRangoLibretas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConfirmarRangoLibretas`;
        return this._http.post<any>(this.url, Datos);
    } 
    ConfirmarRangoTarjetas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConfirmarRangoTarjetas`;
        return this._http.post<any>(this.url, Datos);
    }  
    ObtenerLibretasRegistrar(FechaInicial: string, FechaFinal: string, idOficina: string, idProducto: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerLibretasRegistrar`;
        const params = new HttpParams()
        .set('dateFechaInicial', FechaInicial)
        .set('dateFechaFinal', FechaFinal)
        .set('idOficina', idOficina)
        .set('idProducto', idProducto);
        return this._http.get<any>(this.url,{params: params });
    }
    LimpiarParaRegistrarEntregas(FechaInicial: string, FechaFinal: string, idOficina: number, documento: string): Observable<any> {
        this.url = `${this.environment.Url}/LimpiarParaRegistrarEntregas`;
        const params = new HttpParams()
        .set('dateFechaInicial', FechaInicial)
        .set('dateFechaFinal', FechaFinal)
        .set('idOficina', idOficina)
        .set('documento', documento);
        return this._http.get<any>(this.url,{params: params });
    }   
    ObtenerTarjetasRegistrar(FechaInicial: string, FechaFinal: string, idOficina: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerTarjetasRegistrar`;
        const params = new HttpParams()
        .set('dateFechaInicial', FechaInicial)
        .set('dateFechaFinal', FechaFinal)
        .set('idOficina', idOficina);
        return this._http.get<any>(this.url,{params: params });
    }
    ActualizarLibretasRegistrar(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarLibretasRegistrar`;
        return this._http.post<any>(this.url, Datos);
    } 
    ActualizarTarjetasRegistrar(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarTarjetasRegistrar`;
        return this._http.post<any>(this.url, Datos);
    }   
    GuardarPagare(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarPagare`;
        return this._http.post<any>(this.url, Datos);
    } 
    BuscarTituloPagare(NroTituloInicial: number, NroTituloFinal: number): Observable<any> {
        this.url = `${this.environment.Url}/BuscarTituloPagare`;
        const params = new HttpParams()
        .set('intNroTitiloInicial', NroTituloInicial)
        .set('intNroTituloFinal', NroTituloFinal);
        return this._http.get<any>(this.url,{params: params });
    }
    ObtenerNroTituloPagare(intNroTitulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerNroTituloPagare?intNroTitulo=${intNroTitulo}`;
        return this._http.get<any>(this.url);
    }    
    AnularNroTituloPagare(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/AnularNroTituloPagare`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInfoRangoPagare(NroTituloInicial: number, NroTituloFinal: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInfoRangoPagare`;
        const params = new HttpParams()
        .set('intNroTituloInicial', NroTituloInicial)
        .set('intNroTituloFinal', NroTituloFinal);
        return this._http.get<any>(this.url,{params: params });
    } 
    ActualizarPagare(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActualizarPagare`;
        return this._http.post<any>(this.url, Datos);
    }
    ConfirmarRangoPagare(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConfirmarRangoPagare`;
        return this._http.post<any>(this.url, Datos);
    }
    RegistrarLog(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardaLogConsecutivos`;
        return this._http.post<any>(this.url, Datos);
    }   
}