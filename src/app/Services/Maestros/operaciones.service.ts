import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
@Injectable()
export class OperacionesService {
    public url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }  
   
    OperacionesPermitidas(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/OperacionesPermitidas`;
        return this._http.post<any>(this.url, Datos, {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })})
    }
    OperacionesPermitidasNaturales(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/OperacionesPermitidasNaturales`;
        return this._http.post<any>(this.url, Datos);
    }
    OperacionesDenegadasPerfil(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/OperacionesDenegadasXPerfil`;
        return this._http.post<any>(this.url, Datos);
    }
    OperacionesPermitidasPerfil(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/OperacionesPermitidasXPerfil`;
        return this._http.post<any>(this.url, Datos);
    }
    GuardarOperacionXPerfil(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/GuardarOperacionXPerfil`;
        return this._http.post<any>(this.url, Datos);
    }
    EliminarOperacionXPerfil(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/EliminarOperacionXPerfil`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerEstadosXOperaciones(data: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerEstadosXOperaciones?idOperacion=${data}`;
        return this._http.get<any>(this.url);
    }
    ObtenerEstadosXOperacionesData(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerEstadosXOperaciones`;
        return this._http.post<any>(this.url, Datos);
    }
    ObtenerUsuarios(PstrIdPerfil: number, PstrIdModulo: number, PstrIdOperacion: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerUsuariosOperaciones`;
        const params = new HttpParams()
            .set('PstrPerfil', PstrIdPerfil)
            .set('PstrModulo', PstrIdModulo)
            .set('PstrOperacion', PstrIdOperacion);
        return this._http.get<any>(this.url, { params: params });
    }
    EliminarUsuXModXOpe(PstrIdPerfil: number, PstrIdModulo: number, PstrIdOperacion: number): Observable<any> {
        this.url = `${this.environment.Url}/EliminarPermisosEspeciales`;
        const params = new HttpParams()
            .set('PstrPerfil', PstrIdPerfil)
            .set('PstrModulo', PstrIdModulo)
            .set('PstrOperacion', PstrIdOperacion);
        return this._http.get<any>(this.url, { params: params });
    }   
    PermisoXPerfilAndXModulo(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/PermisoXPerfilAndXModulo`;
        return this._http.post<any>(this.url, Datos);
    }
}
