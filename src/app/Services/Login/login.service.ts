import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { catchError, Observable, throwError } from 'rxjs';
import { StorageSecurity } from '../../utils/storage-security.util';

@Injectable()
export class LoginService {

    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    userAuthentication(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/Authentication`;
        return this._http.post<any>(this.url, Datos);
    }  
    RefreshToken(refreshToken: string): Observable<any> {
        this.url = `${this.environment.Url}/RefreshToken`;
        return this._http.post<any>(this.url, { refreshToken });
    }
    PerfilesUsuario(data: string): Observable<any> {
        this.url = `${this.environment.Url}/PerfilesUsuario?usuario=${data}`;
        return this._http.get<any>(this.url);
    }
    validationUserAuthenticado(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/ValidationCodeUser`;
        return this._http.post<any>(this.url, Datos);
    } 
    CerrarSesionInactividad(): Observable<any> {
        const resulStore = StorageSecurity.getData();
        this.url = `${this.environment.Url}/CerrarSesion`;
        return this._http.post<any>(
        this.url,
        resulStore);
    } 
    ObtenerPermisoUsuario(usuario: string): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerPermisosPorUsuario?idUsuario=${usuario}`;
        return this._http.get<any>(this.url);
    }
    GetSesionAllUsers(): Observable<any> {
        this.url = `${this.environment.Url}/GetSesionAllUsers`;
        return this._http.get<any>(this.url);
    }
    SetSesionUser(Datos: any): Observable<any> {
        this.url = `${this.environment.Url}/SetSesionUser`;
        return this._http.post<any>(this.url, Datos);
    }  
    SesionOtroDispositivo(usuarioId: string,browser :string): Observable<any> {
        this.url = this.environment.Url + '/SesionOtroDispositivo/' + usuarioId + "/" + browser;
        return this._http.get<any>(this.url);
    }
    CerrarSesionUser(data: string): Observable<any> {
        this.url = `${this.environment.Url}/CerrarSesionUser?user=${data}`;
        return this._http.get<any>(this.url);
    }
    GetSesionXUsuario(data: string): Observable<any> {
        this.url = `${this.environment.Url}/GetSesionXUsuario?user=${data}`;
        return this._http.get<any>(this.url);
    }
    CerrarSesionUsersAll(): Observable<any> {
        this.url = `${this.environment.Url}/CerrarSesionUsersAll`;
        return this._http.get<any>(this.url);
    }
}
