import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';

@Injectable()

export class InformeConsecutivoTituloService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }
    ObterneConsecutivos(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerModulosConsecutivos`;
        return this._http.get<any>(this.url);
    }
    ObtenerDocumentosConsecutivos(IdModulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerDocumentosConsecutivos?IdModulo=${IdModulo}`;
        return this._http.get<any>(this.url);
    }  
    ObtenerProductosConsecutivos(IdModulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerProductosConsecutivos?IdModulo=${IdModulo}`;
        return this._http.get<any>(this.url);
    }   
    ObtenerDocumentosDisponibles(IdModulo: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerDocumentosDisponibles?IdModulo=${IdModulo}`;
        return this._http.get<any>(this.url);
    }     
    Oficinas(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerOficinasUsuarios`;
        return this._http.get<any>(this.url);
    }
    ObtenerEstadoConsecutivos(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerEstados`;
        return this._http.get<any>(this.url);
    }
    ObtenerUsuarios(): Observable<any> {
        this.url = `${this.environment.Url}/InformesObtenerUsuarios`;
        return this._http.get<any>(this.url);
    }
    ObtenerUsuariosTermino(): Observable<any> {
        this.url = `${this.environment.Url}/InformesObtenerUsuariosTermino`;
        return this._http.get<any>(this.url);
    }
    ObtenerUsuariosContractual(): Observable<any> {
        this.url = `${this.environment.Url}/InformesObtenerUsuariosContractual`;
        return this._http.get<any>(this.url);
    }
    ObtenerUsuariosLibretas(): Observable<any> {
        this.url = `${this.environment.Url}/InformesObtenerUsuariosLibretas`;
        return this._http.get<any>(this.url);
    }
    ObtenerUsuariosTarjetas(): Observable<any> {
        this.url = `${this.environment.Url}/InformesObtenerUsuariosTarjetas`;
        return this._http.get<any>(this.url);
    }
    ObtenerUsuariosPagare(): Observable<any> {
        this.url = `${this.environment.Url}/InformesObtenerUsuariosPagare`;
        return this._http.get<any>(this.url);
    }   
    ObtenerInformeTermino(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInformeTituloTermino`;
        return this._http.post<any>(this.url, Datos);
    } 
    ObtenerInformeContractual(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInformeTituloContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeCartera(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInformeTituloCartera`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeLogConsectivo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInformeLogConsectivo`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeTarjetas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInformeTituloTarjetas`;
        return this._http.post<any>(this.url, Datos);
    }
    GetInformeLogConsecutivos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GetInformeLogConsecutivos`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeTituloContractual(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerInformeTituloContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeTituloCartera(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GetInformeCartera`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeTituloLibretas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GetInformeLibretas`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeTituloTarjetas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GetInformeTarjetas`;
        return this._http.post<any>(this.url, Datos);
    }
    GenerarXlsxLogConsecutivos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GenerarXlsxLogConsecutivos`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeTituloTerminoNuevo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/NuevosInformeTermino`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeTerminoNuevos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerResumenNuevosTituloTermino`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeContractualNuevos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerResumenNuevosTituloContractual`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeCarteraNuevos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerResumenNuevosTituloCartera`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeTituloLibretasNuevo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/NuevosInformeLibretas`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeLibretasNuevos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerResumenNuevosTituloLibretas`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeTarjetasNuevo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/NuevosInformeTarjetas`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerInformeTarjetasNuevos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerResumenNuevosTituloTarjetas`;
        return this._http.post<any>(this.url, Datos);
    }
    GenerarXlsxConsecutivoNuevos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GenerarXlsxConsecutivoNuevos`;
        return this._http.post<any>(this.url, Datos);
    }
    GenerarXlsxLibretasNuevos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GenerarXlsxLibretasNuevos`;
        return this._http.post<any>(this.url, Datos);
    }
    GenerarXlsxTarjetasNuevos(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GenerarXlsxTarjetasNuevos`;
        return this._http.post<any>(this.url, Datos);
    }
}