import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
declare var $: any;
@Injectable()

export class GeneralesService {
    private url: string = "";
  constructor(private _http: HttpClient,private environment: EnvironmentService) { }

    Guardarlog(formValue : any, idOperacion : number, lngCuenta : number | null = 0, tercero : number | null = 0 , modulo : number , numeroDoc: string | null = null): Observable<any> {
        let data : string | null = localStorage.getItem('Data')
        const dataUser = JSON.parse(window.atob(data == null ? "" : data));
        const FechaActual = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
        const parametersLOG : any = {
            IdLog: 0,
            IdOficina: +dataUser.NumeroOficina,
            IdUsuarioERP: +dataUser.IdUsuario,
            IdModulo: +modulo,
            IdOperacion: +idOperacion,
            FechaModificacion: FechaActual,
            IdCuenta: Number(lngCuenta),
            IdTercero: Number(tercero),
            JsonDto: JSON.stringify(formValue),
            IdAsesor: +dataUser.lngTercero,
            IdObseCambioEstado: formValue.IdObseCambioEstado,
            IdJuridico: formValue.IdJuridico,
            NumeroDocumento: numeroDoc
        };
        this.url = this.environment.Url + '/GuardarLog';
        return this._http.post<any>(this.url, parametersLOG);
    }
    GuardarlogContractual(formValue : any , idOperacion :number, lngCuenta: number, tercero : number, modulo : number, numeroDoc: string | null = null,IdObseCambioEstado : number) : Observable<any> {
        let data : string | null = localStorage.getItem('Data')
        const dataUser = JSON.parse(window.atob(data == null ? "" : data));
        const FechaActual = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
        const parametersLOG : any = {
            IdLog: 0,
            IdOficina: +dataUser.NumeroOficina,
            IdUsuarioERP: +dataUser.IdUsuario,
            IdModulo: +modulo,
            IdOperacion: +idOperacion,
            FechaModificacion: FechaActual,
            IdCuenta: +lngCuenta,
            IdTercero: +tercero,
            JsonDto: JSON.stringify(formValue),
            IdAsesor: +dataUser.lngTercero,
            IdObseCambioEstado: IdObseCambioEstado,
            IdJuridico: formValue.IdJuridico,
            NumeroDocumento: numeroDoc
        };
        this.url = this.environment.Url + '/GuardarLog';
        return this._http.post<any>(this.url, parametersLOG, );
    }
    GuardarlogTerminoDisponibles( formValue : any, idOperacion : number, lngCuenta: number, tercero : number, modulo : number,IdObseCambioEstado : number) : Observable<any> {
        let data : string | null = localStorage.getItem('Data')
        const dataUser = JSON.parse(window.atob(data == null ? ""  : data));
        const FechaActual = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
        const parametersLOG : any = {
            IdLog: 0,
            IdOficina: +dataUser.NumeroOficina,
            IdUsuarioERP: +dataUser.IdUsuario,
            IdModulo: +modulo,
            IdOperacion: +idOperacion,
            FechaModificacion: FechaActual,
            IdCuenta: +lngCuenta,
            IdTercero: +tercero,
            JsonDto: JSON.stringify(formValue),
            IdAsesor: +dataUser.lngTercero,
            IdObseCambioEstado: IdObseCambioEstado,
            IdJuridico: null
        };
        this.url = this.environment.Url + '/GuardarLog';
        return this._http.post<any>(this.url, parametersLOG);
    }
    GuardarlogGestionOperaciones(modelGestion: any) : Observable<any> {
        let parametersLOG : any = null;
        if (modelGestion.ObjCuenta === undefined || modelGestion.ObjCuenta === null) {
            parametersLOG = {
                IdLogGestionOperacion: 0,
                FechaSolicitud: modelGestion.FechaSolicitud,
                IdUsuarioSolicita: modelGestion.IdUsuarioSolicita,
                IdUsuarioRecibe: modelGestion.IdUsuarioRecibe,
                IdModulo: modelGestion.IdModulo,
                IdOperacion: modelGestion.IdOperacion,
                IdEstado: modelGestion.IdEstado,
                IdCuenta: modelGestion.Cuenta,
                IdPersona: modelGestion.Documento,
                Observacion: modelGestion.Observacion,
                FechaActualizacion: null,
                ObservacionGestion: modelGestion.ObservacionGestion
            };
        }  else {
            parametersLOG = {
                IdLogGestionOperacion: 0,
                FechaSolicitud: modelGestion.FechaSolicitud,
                IdUsuarioSolicita: modelGestion.IdUsuarioSolicita,
                IdUsuarioRecibe: modelGestion.IdUsuarioRecibe,
                IdModulo: modelGestion.IdModulo,
                IdOperacion: modelGestion.IdOperacion,
                IdEstado: modelGestion.IdEstado,
                IdCuenta: modelGestion.ObjCuenta.IdCuenta,
                IdPersona: modelGestion.Documento,
                Observacion: modelGestion.Observacion,
                FechaActualizacion: null,
                ObservacionGestion: null
            };
        }
        const dataregistro = JSON.stringify(parametersLOG);
        this.url = this.environment.Url + '/GuardarLogGestionOperaciones';
        return this._http.post<any>(this.url, dataregistro);
    }
    GuardarlogProductos( formValue : any, idOperacion : number, lngCuenta : number, tercero : number, modulo : number, numeroDoc: string | null = null): Observable<any> {
        let data : string | null = localStorage.getItem('Data');
        const dataUser = JSON.parse(window.atob(data == null ? "" : data));
        const FechaActual = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');;
        const parametersLOG = {
            IdLog: 0,
            IdOficina: +dataUser.NumeroOficina,
            IdUsuarioERP: +dataUser.IdUsuario,
            IdModulo: +modulo,
            IdOperacion: +idOperacion,
            FechaModificacion: FechaActual,
            IdCuenta: +lngCuenta,
            IdTercero: +tercero,
            JsonDto: JSON.stringify(formValue),
            IdAsesor: +dataUser.lngTercero,
            IdObseCambioEstado: formValue.IdObseCambioEstado,
            IdJuridico: formValue.IdJuridico,
            NumeroDocumento: numeroDoc
        };
        this.url = this.environment.Url + '/GuardarLog';
        return this._http.post<any>(this.url, parametersLOG);
    }
    GuardarlogAsesoria( formValue : any, idOperacion : number, FechaApertura : Date | null | string, modulo : number,NumeroAsesoria : number = 0 ) : Observable<any> {
        let data : string | null = localStorage.getItem('Data');
        const dataUser = JSON.parse(window.atob(data == null ? "" : data));
        const FechaActual = FechaApertura;
        const parametersLOG = {
            IdLogAsesoria: 0,
            IdOficina: +dataUser.NumeroOficina,
            IdUsuarioERP: +dataUser.IdUsuario,
            IdModulo: +modulo,
            IdOperacion: +idOperacion,
            FechaModificacion: FechaActual,
            JsonDto: JSON.stringify(formValue),
            IdAsesor: +dataUser.lngTercero,
            NumeroAsesoria:  NumeroAsesoria == 0 ? formValue.NumeroAsesoria : NumeroAsesoria
        };
        this.url = this.environment.Url + '/GuardarLogAsesoria';
        return this._http.post<any>(this.url, parametersLOG);
    }
    Autofocus(nameInput : string) {
        $('#' + nameInput + '').prop('disabled', false);
            $('#' + nameInput + '').focus();
    }
    AgregarDisabled(nameInput : string) {
        $('#' + nameInput + '').prop('disabled', 'disabled');
    }
}
