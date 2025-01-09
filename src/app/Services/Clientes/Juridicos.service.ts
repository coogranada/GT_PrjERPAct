import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class JuridicosService {
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    GuardarJuridicosAll(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarJuridico`;
        return this._http.post<any>(this.url, Datos);
    }
    BuscarJuridicosAll(nit: string, razon: string): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarJuridico`;
        const params = new HttpParams()
        .set('nit', nit)
        .set('razon', razon);
        return this._http.get<any>(this.url,{params: params });
    }
    BuscarJuridicoList(razon: string): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarJuridicoList?razon=${razon}`;
        return this._http.get<any>(this.url);
    }  
    EditarInfoJuridico(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditInfoJuridico`;
        return this._http.post<any>(this.url, Datos);
    }  
    EditContactoJuridico(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditContactoJuridico`;
        return this._http.post<any>(this.url, Datos);
    } 
    EditFinancieroJuridico(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditFinancieroJuridico`;
        return this._http.post<any>(this.url, Datos);
    } 
    EditPatrimonioJuridico(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditPatrimonioJuridico`;
        return this._http.post<any>(this.url, Datos);
    }  
    EditRepresentanteJuridico(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditRepresentanteJuridico`;
        return this._http.post<any>(this.url, Datos);
    }  
    EditContRepresentante(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditContRepresentante`;
        return this._http.post<any>(this.url, Datos);
    } 
    EditAccionistas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditAccionistas`;
        return this._http.post<any>(this.url, Datos);
    } 
    EditReferencias(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditReferenciasJuridico`;
        return this._http.post<any>(this.url, Datos);
    } 
    EditEntrevista(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditEntrevistaJuridico`;
        return this._http.post<any>(this.url, Datos);
    } 
    CambiarEstado(juridico: string, info: string, asesor: string, observa: string): Observable<any> {
        this.url = `${this.environment.Url}/CambiarEstadoJuridico`;
        const params = new HttpParams()
        .set('juridico', juridico)
        .set('info', info)
        .set('asesor', asesor)
        .set('obseva', observa);
        return this._http.get<any>(this.url,{params: params });
    }  
    CambiarNit(juridico: string, info: string, asesor: string): Observable<any> {
        this.url = `${this.environment.Url}/CambiarNit`;
        const params = new HttpParams()
        .set('juridico', juridico)
        .set('info', info)
        .set('asesor', asesor);
        return this._http.get<any>(this.url,{params: params });
    } 
    CambiarOficina(juridico: string, info: number, asesor: string): Observable<any> {
        this.url = `${this.environment.Url}/CambiarOficinaJuridico`;
        const params = new HttpParams()
        .set('juridico', juridico)
        .set('info', info)
        .set('asesor', asesor);
        return this._http.get<any>(this.url,{params: params });
    } 
    CambiarRelacion(juridico: string, info: string, docu: string, asesor: string, objeto: string): Observable<any> {
        this.url = `${this.environment.Url}/CambiarEstadoJuridico`;
        const params = new HttpParams()
        .set('juridico', juridico)
        .set('info', info)
        .set('docu', docu)
        .set('asesor', asesor)
        .set('objeto', objeto);
        return this._http.get<any>(this.url,{params: params });
    } 
    CambiarRazonSocial(juridico: string, info: string,  doc: string, asesor: string): Observable<any> {
        this.url = `${this.environment.Url}/CambiarRazonSocial`;
        const params = new HttpParams()
        .set('juridico', juridico)
        .set('info', info)
        .set('documento', doc)
        .set('asesor', asesor);
        return this._http.get<any>(this.url,{params: params });
    }  
    CambiarAsesor(juridico: string, info: string, asesor: string): Observable<any> {
        this.url = `${this.environment.Url}/CambiarAsesorJuridico`;
        const params = new HttpParams()
        .set('juridico', juridico)
        .set('info', info)
        .set('asesor', asesor);
        return this._http.get<any>(this.url,{params: params });
    }
    CambiarAsesorExterno(juridico: string, info: string, asesor: string): Observable<any> {
        this.url = `${this.environment.Url}/CambiarAsesorExternoJuridico`;
        const params = new HttpParams()
        .set('juridico', juridico)
        .set('info', info)
        .set('asesor', asesor);
        return this._http.get<any>(this.url,{params: params });
    }
    CambiarFechaJuridico(juridico: string): Observable<any> {
        this.url = `${this.environment.Url}/CambiarFechaJuridico?juridico=${juridico}`;
        return this._http.get<any>(this.url);
    }  
    MarcarTratamiento(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/MarcarTratamientoJuridico`;
        return this._http.post<any>(this.url, Datos);
    } 
    DesmarcarTratamiento(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/DesmarcarTratamientoJuridico`;
        return this._http.post<any>(this.url, Datos);
    }
    ReingresoJuridico(juridico: string, estado: number, asesor: string): Observable<any> {
        this.url = `${this.environment.Url}/ReingresoJuridico`;
        const params = new HttpParams()
        .set('juridico', juridico)
        .set('info', estado)
        .set('asesor', asesor);
        return this._http.get<any>(this.url,{params: params });
    }
    GetTratamientoDatosJuridicoLog(juridico: string): Observable<any> {
        this.url = `${this.environment.Url}/GetTratamientoDatosJuridicoLog?juridico=${juridico}`;
        return this._http.get<any>(this.url);
    }
    GuardarRetiroJuridico(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarSolicitudRetiro`;
        return this._http.post<any>(this.url, Datos);
    } 
    GetRetirosJuridicoLog(juridico: string): Observable<any> {
        this.url = `${this.environment.Url}/GetRetirosJuridicoLog?juridico=${juridico}`;
        return this._http.get<any>(this.url);
    }
    GetRetirosJuridicoLogxId(juridico: string, retiro: string): Observable<any> {
        this.url = `${this.environment.Url}/GetRetirosJuridicoLogXId`;
        const params = new HttpParams()
        .set('juridico', juridico)
        .set('retiro', retiro);
        return this._http.get<any>(this.url,{params: params });
    }
    GetDateReingresoJuridico(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/GetDateReingresoJuridico?juridico=${tercero}`;
        return this._http.get<any>(this.url);
    }  
    GetReingresosJuridico(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/GetReingresosJuridico?juridico=${tercero}`;
        return this._http.get<any>(this.url);
    }    
    CancelarSolicitudRetiroJuridico(juridico: string, asesor: string , fecha: string): Observable<any> {
        this.url = `${this.environment.Url}/CancelarSolicitudRetiroJuridicos`;
        const params = new HttpParams()
        .set('juridico', juridico)
        .set('Asesor', asesor)
        .set('fechaCancela', fecha);
        return this._http.get<any>(this.url,{params: params });
    }
    MarcarExentoGFM(tercero: string, fecha: string): Observable<any> {
        this.url = `${this.environment.Url}/MarcarExentoGMF`;
        const params = new HttpParams()
        .set('juridico', tercero)
        .set('fecha', fecha);
        return this._http.get<any>(this.url,{params: params });
    }
    DesmarcarExentoGMF(tercero: string, fecha: string): Observable<any> {
        this.url = `${this.environment.Url}/DesmarcarExentoGMF`;
        const params = new HttpParams()
        .set('juridico', tercero)
        .set('fecha', fecha);
        return this._http.get<any>(this.url,{params: params });
    }
    ObtenerContactosPrincpales(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerContactosPpalJuridico?juridico=${tercero}`;
        return this._http.get<any>(this.url);
    } 
    EditarCorrespondecia(tercero: string, marcado: string): Observable<any> {
        this.url = `${this.environment.Url}/EditarCorrespondeciaJuridicos`;
        const params = new HttpParams()
        .set('juridico', tercero)
        .set('marca', marcado);
        return this._http.get<any>(this.url,{params: params });
    }
    TieneCuentas(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/TieneCuentas?idTercero=${tercero}`;
        return this._http.get<any>(this.url);
    } 
}
