import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../Enviroment/enviroment.service';

@Injectable({
  providedIn: 'root'
})
  



export class ConciliaconCompensacionService {
    public url: string='';

    constructor(
        private _http: HttpClient,
        private environment: EnvironmentService) { }


    GuardarComcont(Datos: any): Observable<any> {
        this.url = this.environment.Url + '/GuardarComcont';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
    
        return this._http.post<any>(this.url, Datos, { headers });
    }

    GuardarAutCon(Datos: any): Observable<any> {
        this.url = this.environment.Url + '/GuardarAutCon';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        
        return this._http.post<any>(this.url, Datos, { headers });
    }
    

    GetResumenCompensacion(fechaIdentificadaComContStr: string, cuentaStr: string) {
        this.url = this.environment.Url + '/GetResumenCompensacion?strFecha=' + fechaIdentificadaComContStr+'&strCuenta='+cuentaStr;
        return this._http.get(this.url);
    }

    GetNovCredibanco() {
        this.url = this.environment.Url + '/GetNovCredibanco';
        return this._http.get(this.url);
    }

    GetMvtoInternacional() {
        this.url = this.environment.Url + '/GetMvtoInternacional';
        return this._http.get(this.url);
    }

    GetDetalleCompensacion(fechaIdentificadaComContStr: string, cuentaStr: string) {
        this.url = this.environment.Url + '/GetDetalleCompensacion?strFecha=' + fechaIdentificadaComContStr+'&strCuenta='+cuentaStr;
        return this._http.get(this.url);
    }

    GuardarCompensacion(Datos: any): Observable<any>{
        this.url = this.environment.Url + '/GuardarCompensacion';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.post(this.url, Datos, {headers});
    }

    GuardarLogCompensacion(Datos: any): Observable<any>{
        this.url = this.environment.Url + '/GuardarLogCompensacion';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.post(this.url, Datos, {headers});
    }

    GenerarPDFCompensacion(Datos: any): Observable<any> {
        this.url = this.environment.Url + '/GenerarPDFCompensacion';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.post(this.url, Datos, {headers});
    }

    GetCompensacionDia(dtFecha: string) {
        this.url = this.environment.Url + '/GetCompensacionDia?dtfecha=' + dtFecha;
        return this._http.get(this.url);
    }

    GetAutcon() {
        this.url = this.environment.Url + '/GetAutcon';
        return this._http.get(this.url);
    }

    GetCompensacionMes(dtFecha: string) {
        this.url = this.environment.Url + '/GetCompensacionMes?dtfecha='+ dtFecha;
        return this._http.get(this.url);
    }

    GetDispensadoMes(dtFecha: string) {
        this.url = this.environment.Url + '/GetDispensadoMes?dtfecha='+ dtFecha;
        return this._http.get(this.url);
    }


    

}
