import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class ClientesGetListService {
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }
    GetInfoGenNit(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/GetInfoGenNit?tercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    GetAsesorExterno(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GetAsesorExterno`;
        return this._http.post<any>(this.url, Datos);
    }
    GetAsesor(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GetAsesor`;
        return this._http.post<any>(this.url, Datos);
    }    
    GetOperaciones(userName: string): Observable<any> {
        this.url = `${this.environment.Url}/GetOperaciones?userName=${userName}`;
        return this._http.get<any>(this.url);
    }
    GetTerceros(data: string): Observable<any> {
        this.url = `${this.environment.Url}/GetTerceros?documento=${data}`;
        return this._http.get<any>(this.url);
    }
    GetGenNits(documento: string): Observable<any> {
        this.url = `${this.environment.Url}/GetGenNits?documento=${documento}`;
        return this._http.get<any>(this.url);
    }
    GetTipoDocumento(): Observable<any> {
        this.url = `${this.environment.Url}/GetTipoDocumento`;
        return this._http.get<any>(this.url);
    }
    GetCiudad(filtro: string): Observable<any> {
        this.url = `${this.environment.Url}/GetCiudad?filtro=${filtro}`;
        return this._http.get<any>(this.url);
    } 
    GetEmpresas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GetEmpresas`;
        return this._http.post<any>(this.url, Datos);
    }
    GetEmpresasConyuge(Documento: string): Observable<any> {
        this.url = `${this.environment.Url}/GetEmpresasConyuge?strDocuemnto=${Documento}`;
        return this._http.get<any>(this.url);
    } 
    GetUnicaEmpresa(codigo: string): Observable<any> {
        this.url = `${this.environment.Url}/GetUnicaEmpresa?codigo=${codigo}`;
        return this._http.get<any>(this.url);
    } 
    GetEps(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GetEPS`;
        return this._http.post<any>(this.url, Datos);
    }
    GetAsociados(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GetAsociados`;
        return this._http.post<any>(this.url, Datos);
    }
    GetEstado(): Observable<any> {
        this.url = `${this.environment.Url}/GetEstado`;
        return this._http.get<any>(this.url);
    }
    GetTipoEmpleo(): Observable<any> {
        this.url = `${this.environment.Url}/GetTipoEmpleo`;
        return this._http.get<any>(this.url);
    }
    GetTipoOcupacion(idEmpleo: string): Observable<any> {
        this.url = `${this.environment.Url}/GetTipoOcupacion?idEmpleo=${idEmpleo}`;
        return this._http.get<any>(this.url);
    }
    GetMotivoIngreso(): Observable<any> {
        this.url = `${this.environment.Url}/GetMotivoIngreso`;
        return this._http.get<any>(this.url);
    }
    GetProfesion(): Observable<any> {
        this.url = `${this.environment.Url}/GetProfesion`;
        return this._http.get<any>(this.url);
    }
    GetActividadEconomica(ocupacion: string): Observable<any> {
        this.url = `${this.environment.Url}/GetActividadEconomica?idOcupacion=${ocupacion}`;
        return this._http.get<any>(this.url);
    }  
    GetObservacionAll(data: string): Observable<any> {
        this.url = `${this.environment.Url}/GetObservacionAll?idModulo=${data}`;
        return this._http.get<any>(this.url);
    } 
    //#endregion

    //#region Metodos - Financieros
   
    GetConceptos(idCategoria: string): Observable<any> {
        this.url = `${this.environment.Url}/GetConceptos?idCategoria=${idCategoria}`;
        return this._http.get<any>(this.url);
    } 
    GetConceptosAll(): Observable<any> {
        this.url = `${this.environment.Url}/GetConceptosAll`;
        return this._http.get<any>(this.url);
    }
    //#endregion

    //#region Metodos - Contactos
    GetTipoContacto(): Observable<any> {
        this.url = `${this.environment.Url}/GetTipoContacto`;
        return this._http.get<any>(this.url);
    }
    GetVias(): Observable<any> {
        this.url = `${this.environment.Url}/GetVias`;
        return this._http.get<any>(this.url);
    }
    GetLetras(): Observable<any> {
        this.url = `${this.environment.Url}/GetLetras`;
        return this._http.get<any>(this.url);
    }   
    GetCardinales(): Observable<any> {
        this.url = `${this.environment.Url}/GetCardinales`;
        return this._http.get<any>(this.url);
    }  
    GetImuebles(): Observable<any> {
        this.url = `${this.environment.Url}/GetImuebles`;
        return this._http.get<any>(this.url);
    }     
    //#endregion

    //#region Metodos de ACTIVOS
    GetTiposActivos(): Observable<any> {
        this.url = `${this.environment.Url}/GetTiposActivos`;
        return this._http.get<any>(this.url);
    }
    GetActivos(data: string): Observable<any> {
        this.url = `${this.environment.Url}/GetActivos?IdTipoActivo=${data}`;
        return this._http.get<any>(this.url);
    } 
    GetActivosAll(): Observable<any> {
        this.url = `${this.environment.Url}/GetActivosAll`;
        return this._http.get<any>(this.url);
    }
    GetMarcas(): Observable<any> {
        this.url = `${this.environment.Url}/GetMarcas`;
        return this._http.get<any>(this.url);
    }   
  
    //#endregion

    //#region  Metodos de LABORAL
    GetCargos(): Observable<any> {
        this.url = `${this.environment.Url}/GetCargos`;
        return this._http.get<any>(this.url);
    } 
    GetPeriodosPago(): Observable<any> {
        this.url = `${this.environment.Url}/GetPeriodosPago`;
        return this._http.get<any>(this.url);
    }  
    GetTiposContratos(): Observable<any> {
        this.url = `${this.environment.Url}/GetTiposContratos`;
        return this._http.get<any>(this.url);
    }  
    GetConvenios(intConvenio: number): Observable<any> {
        this.url = `${this.environment.Url}/GetConvenios?intConvenios=${intConvenio}`;
        return this._http.get<any>(this.url);
    }
    //#endregion

    //#region Metodos de REFERENCIA
    GetParentescos(): Observable<any> {
        this.url = `${this.environment.Url}/GetParentescos`;
        return this._http.get<any>(this.url);
    }    
    
    //#endregion

    //#region Metodos de ENTREVISTA
    GetPreguntas(): Observable<any> {
        this.url = `${this.environment.Url}/GetPreguntas`;
        return this._http.get<any>(this.url);
    }
    GetPreguntasHijas(data: string): Observable<any> {
        this.url = `${this.environment.Url}/GetPreguntasHijas?IdPreguntaPadre=${data}`;
        return this._http.get<any>(this.url);
    }
    GetPaises(filtro: string): Observable<any> {
        this.url = `${this.environment.Url}/GetPaises?filtro=${filtro}`;
        return this._http.get<any>(this.url);
    }
    GetDivisas(): Observable<any> {
        this.url = `${this.environment.Url}/GetDivisas`;
        return this._http.get<any>(this.url);
    }
    GetParentescosPeps(): Observable<any> {
        this.url = `${this.environment.Url}/GetParentescosPeps`;
        return this._http.get<any>(this.url);
    }
    //#endregion

    //#region Metodos de SEGUROs
    GetSeguros(): Observable<any> {
        this.url = `${this.environment.Url}/GetSeguro`;
        return this._http.get<any>(this.url);
    }
    GetEstadosSeguro(): Observable<any> {
        this.url = `${this.environment.Url}/GetEstadosSeguro`;
        return this._http.get<any>(this.url);
    }
    //#endregion
    
    //#region Consulta de Transacciones
    GetConsultarTrasabilida(documento: string, modulo: number): Observable<any> {
        this.url = `${this.environment.Url}/GetConsultarTrasabilida`;
        const params = new HttpParams()
        .set('document', documento)
        .set('modulo', modulo);
        return this._http.get<any>(this.url,{params: params });
    }    

    //#endregion
    //#endregion

    //#region Juridicos
    GetConceptosJuridicos(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/GetConceptosJuridicos?idCategoria=${tercero}`;
        return this._http.get<any>(this.url);
    }
    GetObjetoSocial(): Observable<any> {
        this.url = `${this.environment.Url}/GetObjetoSocial`;
        return this._http.get<any>(this.url);
    }
    GetTipoSociedad(): Observable<any> {
        this.url = `${this.environment.Url}/GetTipoSociedad`;
        return this._http.get<any>(this.url);
    }
    GetListCiiu(): Observable<any> {
        this.url = `${this.environment.Url}/GetListCIIU`;
        return this._http.get<any>(this.url);
    }
    GetRepresentate(cedula: string): Observable<any> {
        this.url = `${this.environment.Url}/GetRepresentante?documento=${cedula}`;
        return this._http.get<any>(this.url);
    }
    BuscarAccinista(Documento: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarTitularContractual?documento=${Documento}`;
        return this._http.get<any>(this.url);
    }
    GetAccionistas(cedula: string): Observable<any> {
        this.url = `${this.environment.Url}/GetAccionistas?documento=${cedula}`;
        return this._http.get<any>(this.url);
    }
    GetMotivosRetiro(): Observable<any> {
        this.url = `${this.environment.Url}/GetMotivosRetiro`;
        return this._http.get<any>(this.url);
    }
    //#endregion
    getNacionalidad(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerNacionalidad`;
        return this._http.get<any>(this.url);
    }
}
