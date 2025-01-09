import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MiListaProductosService {
  private url: string = "";
  private UrlBaseOlivos : string = "";
  private UrlOlAuth : string = "";
  private UrlOlData : string = "";
  private UrlOlContrato : string = "";
  private UrlOlAfiliadosV2 : string = "";
  private UrlOlCuota : string = "";
  
  constructor(private _http: HttpClient,private environment: EnvironmentService) {
    this.UrlBaseOlivos = this.environment.UrlBaseOlivos;
    this.UrlOlAuth = this.UrlBaseOlivos + 'LoginAPI/Authenticate';
    this.UrlOlData = this.UrlBaseOlivos + 'PrevisionApi/GetContratosAll?identificacion=';
    this.UrlOlContrato = this.UrlBaseOlivos + 'PrevisionApi/GetContrato?contrato=';
    this.UrlOlAfiliadosV2 = this.UrlBaseOlivos + 'PrevisionApi/GetCarteraAfiliadosV2?tercero=';
    this.UrlOlCuota = this.UrlBaseOlivos + 'PrevisionApi/GetContratosByTercero?tercero=';
   }
  
  BuscarNaturalesAllNombre(data: number): Observable<any> {
    this.url = `${this.environment.Url}/BuscarNaturalesALLNameMisP?nombre=${data}`;
    return this._http.get<any>(this.url);
  }
  ObtenerEncabezado(documento: number): Observable<any> {
    this.url = `${this.environment.Url}/GetEncabezado?PstrDocumento=${documento}`;
    return this._http.get<any>(this.url);
  }
  ObtenerDataTabs(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/GetEncabezado?PstrDocumento=${tercero}`;
    return this._http.get<any>(this.url);
  }
 
  //#region Aportes

  GetDataAportesActivos(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerInfoAportesActivo?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GetDataSeguros(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ConsultarSeguros?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GenerarPdf(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPDF`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarPdfAhorro(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPDFAhorro`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarPdfAhorroDisponible(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPdfAhorroDisponible`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarPdfExtractoSeguros(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPdfExtractoSeguros`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarPdfAhorrTermino(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPdfAhorroTermino`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarPdfMvtoAtermino(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPdfMvtoAtermino`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarPdfMovimiento(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPDFMovimiento`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarPDFMovimientoAportes(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPDFMovimientoAportes`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarPDFMovimientoSeguro(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPDFMovimientoSeguro`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarPdfMovimientoContractual(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPdfMovimientoContractual`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarXlsx(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlsx`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarXlsMovimientos(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlsMovimientos`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarXlsMovimientosSeguro(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlsMovimientosSeguro`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarXlsxAhorro(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlsxAhorro`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarXlsxAhorroDisponible(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlsxAhoDisponibles`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarXlsxSeguro(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlsxSeguro`;
    return this._http.post<any>(this.url, Datos);
  }

  // pendiente de crear backed para generar xlsx de seguro

  GenerarXlsMovimientosContractuales(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlsMovimientosContractuales`;
    return this._http.post<any>(this.url, Datos);
  }
  GenerarXlsxAhorroTermino(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlsxAhorroTermino`;
    return this._http.post<any>(this.url, Datos);
  }
  GetDataAportesCancelados(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerInfoAportesCancelados?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  //#endregion

  //#region "Cartera"

  GetlstCuentasHijas(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ListaCuentasHijasCartera?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  GenerarXlsxCartera(lngcuenta: number, FechaIni: string, yearFinal: string, MesFinal: string, Oficina: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlxsExtCartera`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('yearFinal', yearFinal)
      .set('MesFinal', MesFinal)
      .set('Oficina', Oficina);
    return this._http.get<any>(this.url, { params: params });
  }
  GenerarXlxsMovimientoCartera(lngcuenta: number, FechaIni: string, FechaFin: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlxsMovimientoCartera`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('FechaFin', FechaFin);
    return this._http.get<any>(this.url, { params: params });
  }
  GenerarXlxsExtractoCarteraCuentaPadre(lngcuenta: number, FechaIni: string, yearFinal: string, MesFinal: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlxsExtCarteraTD`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('yearFinal', yearFinal)
      .set('MesFinal', MesFinal);
    return this._http.get<any>(this.url, { params: params });
  }
  GenerarXlxsMovimientoCarteraCuentaPadre(lngcuenta: number, FechaIni: string, FechaFin: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarXlxsMovimientosCarteraTD`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('FechaFin', FechaFin);
    return this._http.get<any>(this.url, { params: params });
  }
  GenerarPdfCartera(lngcuenta: number, FechaIni: string, yearFinal: string, MesFinal: string, Oficina: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPDFExtCartera`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('yearFinal', yearFinal)
      .set('MesFinal', MesFinal)
      .set('Oficina', Oficina);
    return this._http.get<any>(this.url, { params: params });
  }
  listItemExtCarteraTD(lngcuenta: number, FechaIni: string, yearFinal: string, MesFinal: string, Oficina: string): Observable<any> {
    this.url = `${this.environment.Url}/ListaItemExtCarteraTd`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('yearFinal', yearFinal)
      .set('MesFinal', MesFinal)
      .set('Oficina', Oficina);
    return this._http.get<any>(this.url, { params: params });
  }
  ListaItemMovimimientoCarteraTd(lngcuenta: number, FechaIni: string, FechaFin: string): Observable<any> {
    this.url = `${this.environment.Url}/ListaItemMovimimientoCarteraTd`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('FechaFin', FechaFin);
    return this._http.get<any>(this.url, { params: params });
  }
  getDetalleTarjetaDebito(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/getDetalleTarjetaDebito`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('front', true);
    return this._http.get<any>(this.url, { params: params });
  }
  GenerarPdfCarteraTD(lngcuenta: number, FechaIni: string, yearFinal: string, MesFinal: string, Oficina: string): Observable<any> {
    this.url = `${this.environment.Url}/GeneraPdfExtCarteraCuentaPadre`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('yearFinal', yearFinal)
      .set('MesFinal', MesFinal)
      .set('Oficina', Oficina);
    return this._http.get<any>(this.url, { params: params });
  }
  GeneraPdfMovimientoCarteraCuentaPadre(lngcuenta: number, FechaIni: string, FechaFin: string): Observable<any> {
    this.url = `${this.environment.Url}/GeneraPdfMovimientoCarteraCuentaPadre`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('FechaFin', FechaFin);
    return this._http.get<any>(this.url, { params: params });
  }
  GenerarPDFTarjetaDebito(lngcuenta: number, FechaIni: string, FechaFin: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPDFTarjetaDebito`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('FechaFin', FechaFin);
    return this._http.get<any>(this.url, { params: params });
  }
  sendMailCartera(lngCuenta: number, usuario: string, oficina: string, NombreProducto: string, TipoProducto: string, FechaInicio: string, yearFinal: string, MesFinal: string, EstadoProducto: boolean): Observable<any> {
    this.url = `${this.environment.Url}/sendMailCartera`;
    const params = new HttpParams()
      .set('lngCuenta', lngCuenta)
      .set('usuario', usuario)
      .set('oficina', oficina)
      .set('NombreProducto', NombreProducto)
      .set('TipoProducto', TipoProducto)
      .set('FechaInicio', FechaInicio)
      .set('yearFinal', yearFinal)
      .set('MesFinal', MesFinal)
      .set('EstadoProducto', EstadoProducto);
    return this._http.get<any>(this.url, { params: params });
  }
  sendMailProductos(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/sendMailProductos`;
    return this._http.post<any>(this.url, Datos);
  }
  ConsultaPagoMinPagoTotal(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerPagoMinPagoTotal?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  GetDataCartera(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerProductoCartera?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GetConsultaOtrosConceptosMisProdu(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/MuestraOtrosConceptosMisPro?lngTercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GetConsultaNotificacionesMisProdu(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/MuestraNotificacionesMisProdu?lngTercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GetConsultaContabilidadMisProdu(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/MuestraContabilidadMisProdu?lngTercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GetReferenciasCartera(tercero: number, TipoCliente: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerListaReferenciasCartera`;
    const params = new HttpParams()
      .set('tercero', tercero)
      .set('TipoCliente', TipoCliente);
    return this._http.get<any>(this.url, { params: params });
  }
  GetGarantiaCodeudorCuenta(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerListasGarantiasCartera?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  SetCheckCartera(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ValidadorCheckProduCartera?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  getCalificacion(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerCalificacionCartera?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  getSaldos(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerSaldosCuentaCartera?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  getSaldosTotalesCuentaPadre(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/SaldoTotalCuentaPadre?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  obtieneCuposCreditosCrecreditos(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerCuposProductoCarteracrecupos?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  obtieneCuposCreditosAhocreditos(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerCuposProductoCarteraAhocupos?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  getResumen(lngTercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerTotalesProductoCartera?tercero=${lngTercero}`;
    return this._http.get<any>(this.url);
  }
  getAnalisis(lngTercero: number): Observable<any> {
    this.url = `${this.environment.Url}/getAnalisis?tercero=${lngTercero}`;
    return this._http.get<any>(this.url);
  }
  getCalificacionesAnuales(intIdCuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/getCalificacionesAnuales?intIdCuenta=${intIdCuenta}`;
    return this._http.get<any>(this.url);
  }
  getCalificaAnualmente(intIdCuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/getCalificaAnualmente?intIdCuenta=${intIdCuenta}`;
    return this._http.get<any>(this.url);
  }
  getResumenCalificaciones(lngTercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerResumenCalificacionesCartera?tercero=${lngTercero}`;
    return this._http.get<any>(this.url);
  }
  getResumenCalificacionesCodeudores(lngTercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerResumenCalificacionesCodeudor?tercero=${lngTercero}`;
    return this._http.get<any>(this.url);
  }
  getDatosCartera(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerDatosCuentaCartera?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  getCodeudores(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/getCodeudores?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  getReestructuracionReliquidacion(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerReestructuracionReliquidacion?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  getlstDiferidos(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerReestructuracionReliquidacion?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  getCobrosCartera(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObteneCobrosCartera?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  getFechasCartera(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObteneFechasCartera?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  getCalculaCuota(lngCuenta: number, Cancela: boolean, Ncoutas: number): Observable<any> {
    this.url = `${this.environment.Url}/CalcularCuotasCartera`;
    const params = new HttpParams()
      .set('NumeroCuotas', Ncoutas)
      .set('Cancela', Cancela)
      .set('lngCuenta', lngCuenta);
    return this._http.get<any>(this.url, { params: params });
  }
  getProvisionesCartera(lngcuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerProvisionesProductoCartera?lngCuenta=${lngcuenta}`;
    return this._http.get<any>(this.url);
  }
  getExtractosCartera(lngcuenta: number, FechaIni: string, yearFinal: string, MesFinal: string, Oficina: string): Observable<any> {
    this.url = `${this.environment.Url}/ObtieneExtractoCartera`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('yearFinal', yearFinal)
      .set('MesFinal', MesFinal)
      .set('Oficina', Oficina);
    return this._http.get<any>(this.url, { params: params });
  }
  getMovimientosCartera(lngcuenta: number, FechaIni: string, FechaFin: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarMovimientosCartera`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('FechaFin', FechaFin);
    return this._http.get<any>(this.url, { params: params });
  }
  GenerarPdfMovimientoCartera(lngcuenta: number, FechaIni: string, FechaFin: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPDFMovimientosCartera`;
    const params = new HttpParams()
      .set('lngCuenta', lngcuenta)
      .set('FechaIni', FechaIni)
      .set('FechaFin', FechaFin);
    return this._http.get<any>(this.url, { params: params });
  }
  //#endregion
  //#region Ahorros
  GetDataAhorrosActivos(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerDataAhorros?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GetRadicados(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/GetRadicados?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GetDetalleRadicados(radicado: string, TipoCliente: number): Observable<any> {
    this.url = `${this.environment.Url}/GetDetalleRadicados`;
    const params = new HttpParams()
      .set('radicado', radicado)
      .set('TipoCliente', TipoCliente);
    return this._http.get<any>(this.url, { params: params });
  }
  GetDataAhorrosCancelados(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerInfoAhorrosCancelados?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GetDataContractualActivos(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerInfoContraActivo?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  ConsultarFechaMatricula(lngIdCuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerFechaMatricula?lngIdCuenta=${lngIdCuenta}`;
    return this._http.get<any>(this.url);
  }
  ConsultarYearMes(lngIdCuenta: number): Observable<any> {
    this.url = `${this.environment.Url}/ConsultarYearMes?lngIdCuenta=${lngIdCuenta}`;
    return this._http.get<any>(this.url);
  }
  ConsultaAsesorExt(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ConsultaAsesorExt?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GetDataContractualCancelados(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerInfoContraCancelados?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GetDataATerminoActivos(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerInfoTerminoActivo?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  GetDataATerminoCancelados(tercero: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerInfoTerminoCancelados?tercero=${tercero}`;
    return this._http.get<any>(this.url);
  }
  //#endregion
  BuscarCuenta(idOficina: string, idProducto: string, consecutivo: string, digito: string): Observable<any> {
    this.url = `${this.environment.Url}/BuscarPorCuentaDisponible`;
    const params = new HttpParams()
      .set('PstrIdOficina', idOficina)
      .set('PstrIdProducto', idProducto)
      .set('PstrIdConsecutivo', consecutivo)
      .set('PstrIdDigito', digito);
    return this._http.get<any>(this.url, { params: params });
  }
  GetEstadoCuenta(TipoConsulta: boolean, idTercero: string): Observable<any> {
    this.url = `${this.environment.Url}/GetEstadoCuenta`;
    const params = new HttpParams()
      .set('TipoConsulta', TipoConsulta)
      .set('idTercero', idTercero);
    return this._http.get<any>(this.url, { params: params });
  }
  GetAnalisisCuenta(TipoConsulta: boolean, idTercero: string): Observable<any> {
    this.url = `${this.environment.Url}/GetAnalisisCuenta`;
    const params = new HttpParams()
        .set('TipoConsulta', TipoConsulta)
        .set('idTercero', idTercero);
    return this._http.get<any>(this.url, { params: params });
  } 
  GenerarPDFEstadoCuenta(TipoConsulta: boolean, idTercero: string, Oficina: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPDFEstadoCuenta`;
    const params = new HttpParams()
      .set('TipoConsulta', TipoConsulta)
      .set('idTercero', idTercero)
      .set('Oficina', Oficina);
    return this._http.get<any>(this.url, { params: params });
  }
  GenerarPDFAnalisisCuenta(TipoConsulta: boolean, idTercero: string, Oficina: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarPDFAnalisisCuenta`;
    const params = new HttpParams()
      .set('TipoConsulta', TipoConsulta)
      .set('idTercero', idTercero)
      .set('Oficina', Oficina);
    return this._http.get<any>(this.url, { params: params });
  }
  CenerarXLSXCuentas(TipoConsulta: boolean, idTercero: number): Observable<any> {
    this.url = `${this.environment.Url}/CenerarXLSXCuentas`;
    const params = new HttpParams()
        .set('TipoConsulta', TipoConsulta)
        .set('idTercero', idTercero);
    return this._http.get<any>(this.url, { params: params });
  }
  CenerarXLSXAnalisisCuentas(TipoConsulta: boolean, idTercero: number): Observable<any> {
    this.url = `${this.environment.Url}/CenerarXLSXAnalisisCuentas`;
    const params = new HttpParams()
        .set('TipoConsulta', TipoConsulta)
        .set('idTercero', idTercero);
    return this._http.get<any>(this.url, { params: params });
  }
  ObtenerHistorial(idOficina: string, idProducto: string, consecutivo: string, digito: string): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerHistorialDisponible`;
    const params = new HttpParams()
      .set('PstrIdOficina', idOficina)
      .set('PstrIdProducto', idProducto)
      .set('PstrIdConsecutivo', consecutivo)
      .set('PstrIdDigito', digito);
    return this._http.get<any>(this.url, { params: params });
  }
  getBuscarCuentaAportes(idOficina: string, IdProductoCuenta: string, IdConsecutivo: string, IdDigito: string): Observable<any> {
    this.url = `${this.environment.Url}/BuscarCuenta`;
    const params = new HttpParams()
      .set('PstrIdOficina', idOficina)
      .set('PstrIdProducto', IdProductoCuenta)
      .set('PstrIdConsecutivo', IdConsecutivo)
      .set('PstrIdDigito', IdDigito);
    return this._http.get<any>(this.url, { params: params });
  }

  //#region Cartera
  //#endregion
  GenerarCuentaCupo(idOficina: string, IdProducto: string, IdConsecutivo: string, IdDigito: string): Observable<any> {
    this.url = `${this.environment.Url}/GenerarCuentaCupo`;
    const params = new HttpParams()
      .set('PintIdOficina', idOficina)
      .set('PintIdProducto', IdProducto)
      .set('PintIdConsecutivo', IdConsecutivo)
      .set('PintIdDigito', IdDigito);
    return this._http.get<any>(this.url, { params: params });
  }
  ConveniosTarjetas(): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerConveniosTarjetas`;
    return this._http.get<any>(this.url);
  }
  DiaCortePago(IdConvenio: number): Observable<any> {
    this.url = `${this.environment.Url}/ObtenerCortePago?PintIdConvenio=${IdConvenio}`;
    return this._http.get<any>(this.url);
  } 

  DetalleProductoContraActual(IdOficina: string, IdProductoCuenta: string, IdConsecutivo: string, IdDigito: string): Observable<any> {
    this.url = `${this.environment.Url}/BuscarCuentaContractual`;
    const params = new HttpParams()
      .set('PstrIdOficina', IdOficina)
      .set('PstrIdProducto', IdProductoCuenta)
      .set('PstrIdConsecutivo', IdConsecutivo)
      .set('PstrIdDigito', IdDigito);
    return this._http.get<any>(this.url, { params: params });
  }
  GetDataSeguroVida(idOficina: string, idProducto: string, consecutivo: string, terceroId: string): Observable<any> {
    this.url = `${this.environment.Url}/getInfoSeguroVida`;
    const params = new HttpParams()
      .set('oficina', idOficina)
      .set('producto', idProducto)
      .set('consecutivo', consecutivo)
      .set('tercero', terceroId);
    return this._http.get<any>(this.url, { params: params });
  }
  //#region Seguros
  //#endregion

  //#endregion Totales
  GetTotales(tercero: string, activo: string, numDocumento: string, idUsuario: string, idOficina: string,): Observable<any> {
    this.url = `${this.environment.Url}/GetTotalResult`;
    const params = new HttpParams()
      .set('tercero', tercero)
      .set('activo', activo)
      .set('numDocumento', numDocumento)
      .set('idUsuario', idUsuario)
      .set('idOficina', idOficina);
    return this._http.get<any>(this.url, { params: params });
  }
  ConsultarIndicador(indicador: number): Observable<any> {
    this.url = `${this.environment.Url}/ConsultarIndicador?indicador=${indicador}`;
    return this._http.get<any>(this.url);
  }
  //#endregion
  getExtracto(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GetExtracto`;
    return this._http.post<any>(this.url, Datos);
  }
  setLogMisProductos(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/setLogMisProductos`;
    return this._http.post<any>(this.url, Datos);
  }
  GetExtractoSeguros(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GetExtractoSeguros`;
    return this._http.post<any>(this.url, Datos);
  }
  getMovimiento(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/GetMovimiento`;
    return this._http.post<any>(this.url, Datos);
  }
  getMovimientoSeguro(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/getMovimientoSeguro`;
    return this._http.post<any>(this.url, Datos);
  }
  getCertificadoSaldos(year: number, idTercero: string): Observable<any> {
    this.url = `${this.environment.Url}/CenerarXLSXAnalisisCuentas`;
    const params = new HttpParams()
        .set('year', year)
        .set('tercero', idTercero);
    return this._http.get<any>(this.url, { params: params });
  }
  getCertificadoRetenciones(year: number, idTercero: string,  mesSlect: string): Observable<any> {
    this.url = `${this.environment.Url}/getCertificadoRetenciones`;
    const params = new HttpParams()
      .set('year', year)
      .set('tercero', idTercero)
      .set('mes', mesSlect);
    return this._http.get<any>(this.url, { params: params });
  }
  getCertificadoSaldosPdf(year: number, idTercero: string,  idTerceroUsuario: string,  Oficina: string): Observable<any> {
    this.url = `${this.environment.Url}/getCertificadoSaldosPdf`;
    const params = new HttpParams()
      .set('year', year)
      .set('tercero', idTercero)
      .set('idTerceroUsuario', idTerceroUsuario)
      .set('Oficina', Oficina);
    return this._http.get<any>(this.url, { params: params });
  }
  getCertificadoRetencionPdf(year: number, idTercero: string, mesSlect: string, idTerceroUsuario: string,  Oficina: string): Observable<any> {
    this.url = `${this.environment.Url}/getCertificadoRetencionPdf`;
    const params = new HttpParams()
      .set('year', year)
      .set('tercero', idTercero)
      .set('mes', mesSlect)
      .set('idTerceroUsuario', idTerceroUsuario)
      .set('Oficina', Oficina);
    return this._http.get<any>(this.url, { params: params });
  }
  getImagenesGestionMail(): Observable<any> {
    this.url = `${this.environment.Url}/getImagenesGestionMail`;
    return this._http.get<any>(this.url);
  }  
  validaAnexo(): Observable<any> {
    this.url = `${this.environment.Url}/validaAnexo`;
    return this._http.get<any>(this.url);
  }
  sendMailCertificadoSaldos(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/sendMailCertificadoSaldos`;
    return this._http.post<any>(this.url, Datos);
  }
  SendEmailCertificateRetenciones(Datos: any): Observable<any> {
    this.url = `${this.environment.Url}/SendEmailCertificateRetenciones`;
    return this._http.post<any>(this.url, Datos);
  }
  getInfoAhoTerminos(consecutivo: number, tercero: number, producto: number, oficina: number,  digito: number): Observable<any> {
    this.url = `${this.environment.Url}/getInfoAhoTerminos`;
    const params = new HttpParams()      
      .set('tercero', tercero)
      .set('consecutivo', consecutivo)
      .set('producto', producto)
      .set('oficina', oficina)
      .set('digito', digito);
    return this._http.get<any>(this.url, { params: params });
  }
  getAutorizados(idTercero: number): Observable<any> {
    this.url = `${this.environment.Url}/getAurorizadosAhorros?tercero=${idTercero}`;
    return this._http.get<any>(this.url);
  }
 
  AutenticacionOlivos(user: string, clave: string): Observable<any> {
    const headers = new HttpHeaders({
      'usuario': user,
      'clave': clave
    });
    return this._http.post<any>(this.UrlOlAuth, {}, { headers })
      .pipe(map(response => { return response; })
    );
  }
  getDataOlivos(token: string, tercero: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization-Token': token
    });
  
    const url = `${this.UrlOlData}/${tercero}`;
  
    return this._http.get<any>(url, { headers })
      .pipe(
        map(response => response),
        catchError(error => {
          console.error('Error al obtener los datos:', error);
          return throwError(() => new Error('No se pudo obtener los datos'));
        })
      );
  }
  getCarteraAfiliadosV2(token: string, tercero: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization-Token': token
    });
  
    const url = `${this.UrlOlAfiliadosV2}/${tercero}`;
  
    return this._http.get<any>(url, { headers })
      .pipe(
        map(response => response),
        catchError(error => {
          console.error('Error al obtener la cartera de afiliados:', error);
          return throwError(() => new Error('No se pudo obtener la cartera de afiliados'));
        })
      );
  }
  getDataContratoOlivos(token: string, contrato: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization-Token': token
    });
  
    const url = `${this.UrlOlContrato}/${contrato}`;
  
    return this._http.get<any>(url, { headers })
      .pipe(
        map(response => response),
        catchError(error => {
          console.error('Error al obtener los datos del contrato:', error);
          return throwError(() => new Error('No se pudo obtener los datos del contrato'));
        })
      );
  }
  getDataCuotaOlivos(contrato: string): Observable<any> {
    const headers = new HttpHeaders({
      'usuario': 'ApiCoogranada',
      'clave': 'ApICoogranada2022'
    });
  
    const url = `${this.UrlOlCuota}/${contrato}`;
  
    return this._http.get<any>(url, { headers })
      .pipe(
        map(response => response),
        catchError(error => {
          console.error('Error al obtener los datos de la cuota:', error);
          return throwError(() => new Error('No se pudo obtener los datos de la cuota'));
        })
      );
  }
  getToken(): Observable<any> {
    this.url = `${this.environment.Url}/getToken?usuarioProveedor=ApiCoogranada`;
    return this._http.get<any>(this.url);
  }  
  setToken(token : string) {
    let credenciales = {
      "UsuarioProveedor": "ApiCoogranada",
      "Token": token
    }
    this.url = `${this.environment.Url}/setToken`;
    return this._http.post(this.url, credenciales);
  }
}

