import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class ClientesService {
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    GetInfoAsociados(idTercero: string): Observable<any> {
        this.url = `${this.environment.Url}/GetInfoAsociados?tercero=${idTercero}`;
        return this._http.get<any>(this.url);
    }
    GuardarTerceroBasico(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarTerceroBasico`;
        return this._http.post<any>(this.url, Datos);
    }   
    GuardarNaturalesBasico(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarNaturalesAll`;
        return this._http.post<any>(this.url, Datos);
    }
    ReplicarWorkManager(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ReplicarWorkManager`;
        return this._http.post<any>(this.url, Datos);
    }     
    GuardarPasivo(tercero: string, pasivo: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarNaturalesALL`;
        const params = new HttpParams()
        .set('tercero', tercero)
        .set('pasivo', pasivo);
        return this._http.get<any>(this.url,{params: params });
    }
    BuscarNaturalesALLLaboral(data: string, define: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarNaturalesALLLaboral`;
        const params = new HttpParams()
        .set('objeto', data)
        .set('definir', define);
        return this._http.get<any>(this.url,{params: params });
    }
    BuscarNaturalLaboral(data: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarNaturalLaboral?tercero=${data}`;
        return this._http.get<any>(this.url);
    }  
    BuscarNaturalesAll(data : any) {
        this.url = this.environment.Url + '/BuscarNaturalesALL?cedula=' + data;
        return this._http.get(this.url)
    } 
    BuscarNaturalesAllNombre(data: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarNaturalesALLName?nombre=${data}`;
        return this._http.get<any>(this.url);
    }
    CambiarEstadoNatural(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/CambiarEstadoNatural`;
        return this._http.post<any>(this.url, Datos);
    }
    ActivarDocumentoBloqueado(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ActivarDocumentoBloqueado`;
        return this._http.post<any>(this.url, Datos);
    }
    CambiarRelacion(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/CambiarRelacion`;
        return this._http.post<any>(this.url, Datos);
    }
    CambiarTipoDocumento(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/CambiarTipoDocumento`;
        return this._http.post<any>(this.url, Datos);
    }
    CambiarNombreApellido(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/CambiarNombreApellido`;
        return this._http.post<any>(this.url, Datos);
    }
    MarcarDesmarcarPPES(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/MarcarDesmarcarPPES`;
        return this._http.post<any>(this.url, Datos);
    }
    EditarEntrevistaPeps(tercero: number, Rpta1: boolean,Rpta2: boolean,Rpta3: boolean,Rpta4: boolean,Rpta5: boolean): Observable<any> {
        this.url = `${this.environment.Url}/EditarEntrevistaPeps`;
        const params = new HttpParams()
            .set('idTercero', tercero)
            .set('repsta1', Rpta1)
            .set('repsta2', Rpta2)
            .set('repsta3', Rpta3)
            .set('repsta4', Rpta4)
            .set('repsta5', Rpta5);
        return this._http.get<any>(this.url,{params: params });
    }
    EditarSegmento(idSeg: string, idTercero: string): Observable<any> {
        this.url = `${this.environment.Url}/EditarSegmento`;
        const params = new HttpParams()
        .set('idSegmento', idSeg)
        .set('idTercero', idTercero);
        return this._http.get<any>(this.url,{params: params });
    }    
    ObtenerSegmento(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerSegmento`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerSegmentoxId(id: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerSegmentoXId?idSegmento=${id}`;
        return this._http.get<any>(this.url);
    }
    ValidarVetados(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarVetado`;
        return this._http.post<any>(this.url, Datos);
    }
    EditarBasicoFinanciero(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarBasico`;
        return this._http.post<any>(this.url, Datos);
    }
    EditarFinanciero(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarFinanciero`;
        return this._http.post<any>(this.url, Datos);
    }
    EditarContactos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarContactos`;
        return this._http.post<any>(this.url, Datos);
    }
    EditarActivos(data: string, tercero: string): Observable<any> { //DUDA
        this.url = `${this.environment.Url}/EditarActivos`;
        const params = new HttpParams()
        .set('tercero', tercero)
        .set('data', data);
        return this._http.get<any>(this.url,{params: params });
    }  
    EditarPasivos(data: string, tercero: string): Observable<any> { //DUDA
        this.url = `${this.environment.Url}/EditarPasivos`;
        const params = new HttpParams()
        .set('tercero', tercero)
        .set('data', data);
        return this._http.get<any>(this.url,{params: params });
    }
    EditarConyugue(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarConyugue`;
        return this._http.post<any>(this.url, Datos);
    }
    EliminarConyugue(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/EliminarConyugue?tercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    EliminarLaborales(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/EliminarLaborales?tercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    EditarLaboral(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarLaboral`;
        return this._http.post<any>(this.url, Datos);
    }
    AgregarLaboralEdit(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/RegistrarLaboralEdit`;
        return this._http.post<any>(this.url, Datos);
    }
    EditarReferencias(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarReferencias`;
        return this._http.post<any>(this.url, Datos);
    }
    EditarEntrevista(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarEntrevista`;
        return this._http.post<any>(this.url, Datos);
    }
    EditarPPES(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarPPES`;
        return this._http.post<any>(this.url, Datos);
    }
    EliminarPPES(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/EliminarPEPS?tercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    EditarSeguros(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarSeguros`;
        return this._http.post<any>(this.url, Datos);
    }
    EditarTratamiento(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EditarTratamiento`;
        return this._http.post<any>(this.url, Datos);
    }
    EditarFechaModificacion(tercero: string | null): Observable<any> {
        this.url = `${this.environment.Url}/EditarFechaModificacion?tercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    CancelarSolicitudRetiro(tercero: string | null, asesor: string,fecha: string): Observable<any> {
        this.url = `${this.environment.Url}/CancelarSolicitudRetiro`;
        const params = new HttpParams()
        .set('Tercero', tercero == null ? 0 : tercero )
        .set('Asesor', asesor)
        .set('fechaCancela', fecha);
        return this._http.get<any>(this.url,{params: params });
    }
    EditarAsesorExterno(tercero: string, asesor: string): Observable<any> {
        this.url = `${this.environment.Url}/EditarAsesorExternoNatural`;
        const params = new HttpParams()
            .set('idTercero', tercero)
            .set('idAsesor', asesor);
        return this._http.get<any>(this.url,{params: params });
    }
    EditarAsesor(tercero: string, asesor: string): Observable<any> {
        this.url = `${this.environment.Url}/EditarAsesorNatural`;
        const params = new HttpParams()
            .set('idTercero', tercero)
            .set('idAsesor', asesor);
        return this._http.get<any>(this.url,{params: params });
    }
    EditarOficina(tercero: string, oficina: string): Observable<any> {
        this.url = `${this.environment.Url}/EditarOficinaNatural`;
        const params = new HttpParams()
            .set('idTercero', tercero)
            .set('idOficina', oficina);
        return this._http.get<any>(this.url,{params: params });
    }   
    GetHistoralLogSeguro(data: string): Observable<any> {
        this.url = `${this.environment.Url}/GetHistoralLogSeguro?idTercero=${data}`;
        return this._http.get<any>(this.url);
    }
    VolverACargarSeguros(data: string): Observable<any> {
        this.url = `${this.environment.Url}/VolverACargarSeguros?idTercer=${data}`;
        return this._http.get<any>(this.url);
    }
    GetAsesor(idAsesor: string): Observable<any> {
        this.url = `${this.environment.Url}/ConsultarAsesor?idAsesor=${idAsesor}`;
        return this._http.get<any>(this.url);
    }
    GetMotivosRetiro(): Observable<any> {
        this.url = `${this.environment.Url}/GetMotivosRetiro`;
        return this._http.get<any>(this.url);
    }
    GuardarRetiro(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarRetiro`;
        return this._http.post<any>(this.url, Datos);
    }
    GetRetirosLog(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/GetRetirosLog?idTercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    GuardarReingreso(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarReingreso`;
        return this._http.post<any>(this.url, Datos);
    }
    CambiarMotivoReingreso(tercero: number, motivo: number): Observable<any> {
        this.url = `${this.environment.Url}/CambiaMotivoIngreso`;
        const params = new HttpParams()
            .set('tercero', tercero)
            .set('motivo', motivo);
        return this._http.get<any>(this.url,{params: params });
    } 
    GetReingresosLog(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/GetReingresoLog?idTercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    GetDateRetiro(tercero: number): Observable<any> {
        this.url = `${this.environment.Url}/GetDateRetiro?idTercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    GetRetirosLogXId(tercero: string, solicitud: string): Observable<any> {
        this.url = `${this.environment.Url}/GetRetirosLogXId`;
        const params = new HttpParams()
            .set('idTercero', tercero)
            .set('idSolicitud', solicitud);
        return this._http.get<any>(this.url,{params: params });
    } 
    GetDateReingreso(tercero: number): Observable<any> {
        this.url = `${this.environment.Url}/GetDateReingreso?idTercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    TieneCuentas(tercero: number): Observable<any> {
        this.url = `${this.environment.Url}/TieneCuentas?idTercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    TieneCuentasJuridico(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/TieneCuentasJuridico?idTercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    MarcarDebitoAutomatico(sinNo: string, tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/MarcarDebitoAutomatico`;
        const params = new HttpParams()
            .set('siNo', sinNo)
            .set('idTercero', tercero);
        return this._http.get<any>(this.url,{params: params });
    }
    ObtenerContactosPrincpales(tercero: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerContactosPrincpales?idTercero=${tercero}`;
        return this._http.get<any>(this.url);
    }
    EditarCorrespondecia(tercero: string, marcado: number): Observable<any> {
        this.url = `${this.environment.Url}/EditarCorrespondecia`;
        const params = new HttpParams()
            .set('idTercero', tercero)
            .set('marcado', marcado);
        return this._http.get<any>(this.url,{params: params });
    }
    GetPersonsXDocument(document: string): Observable<any> {
        this.url = `${this.environment.Url}/GetPersonXDocumento?document=${document}`;
        return this._http.get<any>(this.url);
    }
    BuscarConyugeAll(data: string): Observable<any> {
        this.url = `${this.environment.Url}/BuscarConyugeAll?cedula=${data}`;
        return this._http.get<any>(this.url);
    }
    ActualizaAsesorMod(IdAsesor: string, IdTercero: string): Observable<any> {
        this.url = `${this.environment.Url}/ActualizaAsesorMod`;
        const params = new HttpParams()
            .set('IdAsesor', IdAsesor)
            .set('IdTercero', IdTercero);
        return this._http.get<any>(this.url,{params: params });
    }   
    CambiarRegimenTributario(terceroId: string) {
        this.url = this.environment.Url + '/CambiarRegimenTributario';
        const params = new HttpParams()
            .set('terceroId', terceroId);
        return this._http.get<any>(this.url, { params });
    }
}
