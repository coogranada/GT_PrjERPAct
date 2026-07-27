import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable, retry } from 'rxjs';
import { TipoBusquedaResumen } from '../../Models/Productos/cartera/gestion-credito.enum';
import { ActualizarPagareCupoDto, ActualizarPagareDto, BaseRequestAlCalcular, CalcularDatosRequest, CambiarCalificacionDto, CambiarFormaPagoDto, CambiarGarantiaDto, CambiarGarantiasRequestDto, CambiarLineaCreditoDto, CuentaCarteraDetalle, CuentaCarteraResumen, CuentaFormateada, CupoInfo, DebitoAutomaticoCreditoDto, DetalleGarantiaCreditoDto, Diferido, GarantiaCompartida, GarantiaDisponible, GarantiaRealAsignada, GarantiasResponse, HistorialOperacion, LineaCambioListDto, ManejarSeguroCreditoDto, ObservacionRadicado, ObtenerCodeudorBasicoModel, PeriodoPago, PersonaNaturalBusquedaDto, Provision, ReesRelResponse, ResultadoOperacionDto, ResultCalcularCambioDatos, UltimaCalificacionDto, CrearInsolvencia, DevolverReest, TipoSeguimientoInsolvencia, InsolvenciaHistoricoDto, InsolvenciaAcuerdoPagoDto, MotivoInsolvencia, InstanciaInsolvencia } from '../../Models/Productos/cartera/gestion-credito.model';
import { buildParams } from '../../utils/helpers';

@Injectable({
    providedIn: 'root'
})
export class CarteraService {
    private url: string = "";

    constructor(private _http: HttpClient, private environment: EnvironmentService) { }

    buscarCuentasResumen(filtro: TipoBusquedaResumen, valor: string): Observable<CuentaCarteraResumen[]> {
        this.url = `${this.environment.Url}/BuscarCuentasResumen?filtro=${filtro}&valor=${valor}`;
        return this._http.get<CuentaCarteraResumen[]>(this.url);
    }

    buscarCuentaResumenPorNumeroCuenta({ oficina, producto, consecutivo, digito }: CuentaFormateada): Observable<CuentaCarteraResumen[]> {
        this.url = `${this.environment.Url}/BuscarCuentasResumen?oficina=${oficina}&producto=${producto}&consecutivo=${consecutivo}&digito=${digito}`;
        return this._http.get<CuentaCarteraResumen[]>(this.url);
    }

    buscarCuentaDetalle(idCuenta: number): Observable<CuentaCarteraDetalle> {
        this.url = `${this.environment.Url}/buscarCuentaDetalle?idCuenta=${idCuenta}`;
        return this._http.get<CuentaCarteraDetalle>(this.url);
    }

    // TABS 
    getDatosCartera(IdCuenta: number): Observable<any> {
        this.url = `${this.environment.Url}/BuscarDatosCartera?IdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    getSaldosCartera(IdCuenta: number): Observable<any> {
        this.url = `${this.environment.Url}/BuscarSaldosCartera?IdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }   
    getCalificacionCartera(IdCuenta: number): Observable<any> {
        this.url = `${this.environment.Url}/BuscarCalificacionCartera?IdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    getCobrosCartera(IdCuenta: number): Observable<any> {
        this.url = `${this.environment.Url}/ObteneCobrosCartera?lngCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    getReestructuracionReliquidacion(IdCuenta: number) {
        this.url = `${this.environment.Url}/BuscarReestructuracionReliquidacion?IdCuenta=${IdCuenta}`;
        return this._http.get<ReesRelResponse>(this.url);
    }

    // CALCULAR CUOTA

    CalcularCuota(IdCuenta: number, NumeroCuotas: number): Observable<any> {
        this.url = `${this.environment.Url}/CalcularCuota?IdCuenta=${IdCuenta}&NumeroCuotas=${NumeroCuotas}`;
        return this._http.get<any>(this.url);
    }
    CalcularCuotaCancelacion(IdCuenta: number): Observable<any> {
        this.url = `${this.environment.Url}/CalcularCuotaCancelacion?IdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    getDebito(IdCuenta: number): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerDebitoCredito?IdCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    } 

    // FIN CALCULAR CUOTA 

    // SIMILUAR PAGO 

     SimularPago(IdCuenta: number, Efectivo: number): Observable<any> {
        this.url = `${this.environment.Url}/SimularPago?IdCuenta=${IdCuenta}&Efectivo=${Efectivo}`;
        return this._http.get<any>(this.url);
    }

    // FIN SIMULAR PAGO 

    // GARANTIAS
    getGarantias(IdCuenta: number): Observable<GarantiasResponse> {
        this.url = `${this.environment.Url}/getGarantias?idCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    // FIN GARANTIAS


    //DIFERIDOS
    getDeducibles(IdCuenta: number): Observable<Diferido[]> {
        this.url = `${this.environment.Url}/getDiferidos?idCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    //FIN DIFERIDOS


    //PROVISION
    getProvisiones(IdCuenta: number): Observable<Provision[]> {
        this.url = `${this.environment.Url}/getProvisiones?idCuenta=${IdCuenta}`;
        return this._http.get<any>(this.url);
    }
    //FIN PROVISION



    //CUPOS
    getCuposInfo(IdCuenta: number): Observable<CupoInfo | null> {
        this.url = `${this.environment.Url}/GetCuposInfo?idCuenta=${IdCuenta}`;
        return this._http.get<CupoInfo | null>(this.url);
    }
    //FIN CUPOS


    //HISTORIAL
    getHistorial(idCuenta: number, idProducto: number) {
        this.url = `${this.environment.Url}/getHistorial?idCuenta=${idCuenta}&idProducto=${idProducto}`;
        return this._http.get<HistorialOperacion[]>(this.url);
    }
    //FIN  HISTORIAL

    getObservacionesRadicado(radicado: number): Observable<ObservacionRadicado[]> {
        this.url = `${this.environment.Url}/GetObservacionesRadicado?radicado=${radicado}`;
        return this._http.get<any>(this.url);
    }

    getPDFPlanDePagos(idCuenta: number): Observable<any> {
        this.url = `${this.environment.Url}/getPDFPlanDePagos?idCuenta=${idCuenta}`;
        return this._http.get<any>(this.url, { responseType: 'blob' as 'json' });
    }

    cambiarPagare(dto: ActualizarPagareDto): Observable<ResultadoOperacionDto> {
        const url = `${this.environment.Url}/CambiarPagare`;
        return this._http.post<ResultadoOperacionDto>(url, dto);
    }

    actualizarCodeudores(codeudoresIds: number[], idCuenta: number, pagare: number): Observable<void> {
        this.url = `${this.environment.Url}/ActualizarCodeudores`;
        return this._http.post<void>(this.url, { idCuenta, codeudoresIds, pagare });
    }  

    getPersonaNaturalValidaComoCodeudor(documentoCodeudor: string, documentoDeudor: string) {
        this.url = `${this.environment.Url}/ObtenerPersonaNaturalValidaComoCodeudor?documentoCodeudor=${documentoCodeudor}&documentoDeudor=${documentoDeudor}&rawError=true`;
        return this._http.get<PersonaNaturalBusquedaDto>(this.url);
    }

    getNuevoPlazo(idCuenta: number) {
        this.url = `${this.environment.Url}/ObtenerNuevoPlazo?idCuenta=${idCuenta}&rawError=true`;
        return this._http.get<number[]>(this.url);
    }

    getPeriodosPago() {
        this.url = `${this.environment.Url}/ObtenerFrecuenciaPagoTermino?intPlazo=720`;
        return this._http.get<PeriodoPago[]>(this.url);
    }

    calcularCambioDatos(dto: CalcularDatosRequest) {
        const params = buildParams({
            ...dto,
            rawError: true
        });

        this.url = `${this.environment.Url}/CalcularCambioDatos`;
        return this._http.get<ResultCalcularCambioDatos>(this.url, { params });
    }

    calcularCambioReestructuracion(dto: CalcularDatosRequest) {
        const params = buildParams({
            ...dto,
            rawError: true
        });

        this.url = `${this.environment.Url}/CalcularCambioReestructuracion`;
        return this._http.get<ResultCalcularCambioDatos>(this.url, { params });
    }

    actualizarCredito(dto: CalcularDatosRequest): Observable<void> {
        this.url = `${this.environment.Url}/ActualizarCredito`;
        return this._http.post<void>(this.url, dto);
    } 

    actualizarCreditoReest(dto: CalcularDatosRequest & { acta: number }): Observable<void> {
        this.url = `${this.environment.Url}/ActualizarCreditoReestructuracion`;
        return this._http.post<void>(this.url, dto);
    } 

    devolverReestructuracion(dto: DevolverReest): Observable<void> {
        this.url = `${this.environment.Url}/DevolverReestructuracion`;
        return this._http.post<void>(this.url, dto);
    } 

    cambiarPagareCupo(dto: ActualizarPagareCupoDto): Observable<ResultadoOperacionDto> {
        const url = `${this.environment.Url}/CambiarPagare`;
        return this._http.post<ResultadoOperacionDto>(url, dto);
    }

    obtenerLineasCambio(claseTipo: number,lineaActual: number): Observable<LineaCambioListDto[]> {        
        const url = `${this.environment.Url}/ObtenerLineasCambio`;
        const params = new HttpParams()
            .set('claseTipo', claseTipo)
            .set('lineaActual', lineaActual);
    return this._http.get<LineaCambioListDto[]>(url, { params });
    }

    cambiarLineaCredito(dto: CambiarLineaCreditoDto): Observable<ResultadoOperacionDto> {
        const url = `${this.environment.Url}/CambiarLineaCredito`;
        return this._http.post<ResultadoOperacionDto>(url, dto);
    }

    manejarSeguroCredito(dto: ManejarSeguroCreditoDto): Observable<ResultadoOperacionDto> {
        const url = `${this.environment.Url}/ManejarSeguroCredito`;
        return this._http.post<ResultadoOperacionDto>(url, dto);
    }

    cambiarFormaPago(dto: CambiarFormaPagoDto): Observable<ResultadoOperacionDto> {
        const url = `${this.environment.Url}/CambiarFormaPago`;
        return this._http.post<ResultadoOperacionDto>(url, dto);
    }

    obtenerConvenioNomina(idTercero: number): Observable<boolean> {
        const url = `${this.environment.Url}/ObtenerConvenioNomina?idTercero=${idTercero}`;
        return this._http.get<boolean>(url);
    }

    getCausalCalificacion(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerCausalCalificacion`;
        return this._http.get<any>(this.url);
    }

    getCausalInsolvencia(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerCausalInsolvencia`;
        return this._http.get<any>(this.url);
    }
    
    getListaCalificaciones(): Observable<any> {
        this.url = `${this.environment.Url}/ObtenerListaCalificaciones`;
        return this._http.get<any>(this.url);
    }

    getUltimaCalificacion(idCuenta: number): Observable<UltimaCalificacionDto> {
        this.url = `${this.environment.Url}/ObtenerUltimaCalificacion?idCuenta=${idCuenta}`;
        return this._http.get<UltimaCalificacionDto>(this.url);
    }

    cambiarUltimaCalificacion(dto: CambiarCalificacionDto): Observable<ResultadoOperacionDto> {
        const url = `${this.environment.Url}/CambiarUltimaCalificacion`;
        return this._http.post<ResultadoOperacionDto>(url, dto);
    }

    getGarantiasDisponibles(idTercero: number): Observable<GarantiaDisponible[]> {
        const url = `${this.environment.Url}/ObtenerGarantiasDisponibles`;
        let params = new HttpParams().set('idTercero', idTercero);
        return this._http.get<GarantiaDisponible[]>(url, { params });
    }
    
    getGarantiasAsignadas(idCuenta: number): Observable<GarantiaRealAsignada[]> {
        const url = `${this.environment.Url}/ObtenerGarantiasAsignadas`;
        let params = new HttpParams().set('idCuenta', idCuenta);
        return this._http.get<GarantiaRealAsignada[]>(url, { params });
    }

    cambiarGarantias(dto: CambiarGarantiasRequestDto): Observable<ResultadoOperacionDto> {
      const url = `${this.environment.Url}/CambiarGarantias`;
      return this._http.post<ResultadoOperacionDto>(url, dto);
    }

    obtenerDetalleGarantiaCreditos(garantia: number, tipo: string): Observable<DetalleGarantiaCreditoDto[]> {
      const url = `${this.environment.Url}/ObtenerDetalleGarantiaCreditos`;
      const params = new HttpParams().set('garantia', garantia).set('tipo', tipo);
      return this._http.get<DetalleGarantiaCreditoDto[]>(url, { params });
    }
    
    getCodeudoresBasico(idCuenta: number): Observable<ObtenerCodeudorBasicoModel[]> {
        const url = `${this.environment.Url}/ObtenerCodeudoresBasico`;
        let params = new HttpParams().set('idCuenta', idCuenta);
        return this._http.get<ObtenerCodeudorBasicoModel[]>(url, { params });
    }

    getGarantiasCompartidas(idCuenta: number, idTercero: number) {
        const url = `${this.environment.Url}/ObtenerGarantiasCompartidas`;
        
        const params = new HttpParams()
            .set('idCuenta', idCuenta)
            .set('idTercero', idTercero);
        
        return this._http.get<GarantiaCompartida[]>(url, { params });
    }

    crearInsolvencia(insovencia: CrearInsolvencia): Observable<ResultadoOperacionDto> {
      const url = `${this.environment.Url}/CrearInsolvencia`;
      return this._http.post<ResultadoOperacionDto>(
        url,
        insovencia
      );
    }

    validarInsolvencia(idCuenta: number): Observable<boolean> {
        const url = `${this.environment.Url}/ValidarInsolvencia?idCuenta=${idCuenta}`;
        return this._http.get<boolean>(url);
    }

    getTiposSeguimientoInsolvencia(): Observable<TipoSeguimientoInsolvencia[]> {
        this.url = `${this.environment.Url}/ObtenerTiposSeguimientoInsolvencia`;
        return this._http.get<TipoSeguimientoInsolvencia[]>(this.url);
    }

    getHistoricoInsolvencia(idCuenta: number): Observable<InsolvenciaHistoricoDto[]> {
        const url =`${this.environment.Url}/ObtenerHistoricoInsolvencia?idCuenta=${idCuenta}`;
        return this._http.get<InsolvenciaHistoricoDto[]>(url);
    }

    getDetalleAcuerdoPago(idSeguimiento: number): Observable<InsolvenciaAcuerdoPagoDto> {
        const url =`${this.environment.Url}/ObtenerDetalleAcuerdoPago?idSeguimiento=${idSeguimiento}`;
        return this._http.get<InsolvenciaAcuerdoPagoDto>(url);
    }

    getMotivoInsolvencia(idCuenta: number): Observable<MotivoInsolvencia> {
        const url = `${this.environment.Url}/ObtenerMotivoInsolvencia?idCuenta=${idCuenta}`;
        return this._http.get<MotivoInsolvencia>(url);
    }

    getInstanciasInsolvencia(): Observable<InstanciaInsolvencia[]> {
        const url = `${this.environment.Url}/ObtenerInstanciasInsolvencia`;
        return this._http.get<InstanciaInsolvencia[]>(url);
    }

    getInstanciaInsolvencia(idCuenta: number): Observable<InstanciaInsolvencia> {
        const url =`${this.environment.Url}/ObtenerInstanciaInsolvencia?idCuenta=${idCuenta}`;
        return this._http.get<InstanciaInsolvencia>(url);
    }

}
