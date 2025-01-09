import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Campo, Filtro, Informe } from '../../Models/Informes/informe-clientes/informe-clientes.model';

@Injectable({
  providedIn: 'root'
})
  
export class InformeLogService {
 
  constructor(private http: HttpClient, private envirment: EnvironmentService) { }

  GetOpciones() : Observable<any[]>{
    return this.http.get<any[]>(this.envirment.Url + "/InformeAuditoria/GetOpciones")
  }
  GetOpcionesMisProductos(idOperacion: number) : Observable<any[]>{
    return this.http.get<any[]>(this.envirment.Url + "/InformeAuditoria/GetOpcionesMisProductos/" + idOperacion);
  }
  GetModulos(idTipoConsulta : number): Observable<any[]>{
    return this.http.get<any[]>(this.envirment.Url + "/InformeAuditoria/GetModulos/" + idTipoConsulta)
  }
  GetOperaciones(idModulo :string ): Observable<any[]>{
    return this.http.get<any[]>(this.envirment.Url + "/InformeAuditoria/GetOperaciones/" + idModulo)
  }
  GetOperacionesMisProductos() : Observable<any[]>{
    return this.http.get<any[]>(this.envirment.Url + "/InformeAuditoria/GetOperacionesMisProductos/");
  }
  GetCantidadRegistros(In: Informe): Observable<number>{
    return this.http.post<number>(this.envirment.Url + "/InformeAuditoria/getCantidadRegistros",In)
  }
  GenerateInformesJuridicos(In: Informe): Observable<any>{
    return this.http.post<any>(this.envirment.Url + "/InformeAuditoria/GenerarXLSXInforme",In)
  }
  GetInformeLogs(In: Informe): Observable<any>{
    return this.http.post<any>(this.envirment.Url + "/InformeAuditoria/GetInformeLogs",In)
  }


  GetFiltros(oficinaOrAdmin : number, isOficina : boolean) {
    let Filtros: Filtro[] = [];
    this.CrateFiltros(Filtros);
    Filtros = this.GetOrderAlf(Filtros);
    if (oficinaOrAdmin != 3)
      Filtros = Filtros.filter(x => x.idFiltro != 3);
    if (isOficina == true)
      Filtros = Filtros.filter(x => x.idFiltro == 3);
    
    return Filtros;
  }
  GetFiltrosFichaAnalisis(oficinaOrAdmin: number, isOficina: boolean): Filtro[] {
    let Filtros: Filtro[] = [];
    this.CrateFiltrosFichaAnalisis(Filtros);
    Filtros = this.GetOrderAlf(Filtros);
    if (oficinaOrAdmin != 3)
      Filtros = Filtros.filter(x => x.idFiltro != 3);
    if (isOficina == true)
      Filtros = Filtros.filter(x => x.idFiltro == 3);
    
    return Filtros;
  }
  GetFiltrosProductosVirtuales(): Filtro[] {
    let Filtros: Filtro[] = [];
    this.CrateProductosVirtuales(Filtros);
    Filtros = this.GetOrderAlf(Filtros);

    return Filtros;
  }
  CrateProductosVirtuales(Filtros: Filtro[]) {
     this.AddFiltro(Filtros,2, "Operación");
    this.AddFiltro(Filtros,4, "Usuario");
  }
  CrateFiltrosFichaAnalisis(Filtros: Filtro[]) {
    this.AddFiltro(Filtros,3, "Oficina modifica");
    this.AddFiltro(Filtros,2, "Operación");
    this.AddFiltro(Filtros,24,"Oficina radicado");
    this.AddFiltro(Filtros,4, "Usuario");
  }
  GetOrderAlf(filtros: Filtro[])
  {
    filtros = filtros.sort((a, b) => a.NombreFiltro.localeCompare(b.NombreFiltro));
    return filtros;
  }
  GetFiltrosGestionClientesLog() {
    let Filtros: Filtro[] = [];
    this.CrateFiltrosGestionClientesLog(Filtros);
    Filtros = this.GetOrderAlf(Filtros);
    return Filtros;
  }
  GetFiltrosMisProductos() {
    let Filtros: Filtro[] = [];
    this.CrateFiltrosMisProductos(Filtros);
    Filtros = this.GetOrderAlf(Filtros);
    return Filtros;
  }
  GetFiltrosAsesorias() {
    let Filtros: Filtro[] = [];
    this.CrateFiltrosAsesorias(Filtros);
    Filtros = this.GetOrderAlf(Filtros);
    return Filtros;
  }
  GetFiltrosBanners(): Filtro[] {
    let Filtros: Filtro[] = [];
    this.CrateFiltrosBanners(Filtros);
    Filtros = this.GetOrderAlf(Filtros);
    return Filtros;
  }
  GetFiltrosAutenticacionErp(): Filtro[] {
    let Filtros: Filtro[] = [];
    this.CrateFiltrosAutenticacionErp(Filtros);
    Filtros = this.GetOrderAlf(Filtros);
    return Filtros;
  }
  CrateFiltrosBanners(Filtros: Filtro[]) {
    this.AddFiltro(Filtros, 22, "Usuario");
  }
  private CrateFiltrosAsesorias(Filtros: Filtro[]) {
    this.AddFiltro(Filtros, 18, "Oficina");
    this.AddFiltro(Filtros, 19, "Usuario");
    this.AddFiltro(Filtros, 20, "Modulo");
    this.AddFiltro(Filtros, 21, "Operación");
  }
  private CrateFiltrosMisProductos(Filtros: Filtro[]) {
    this.AddFiltro(Filtros, 11, "Oficina");
    this.AddFiltro(Filtros, 12, "Usuario");
    this.AddFiltro(Filtros, 13, "Cuenta");
    this.AddFiltro(Filtros, 14, "Documento");
    this.AddFiltro(Filtros, 16, "Operación");
    this.AddFiltro(Filtros, 17, "Opción");

    return Filtros;
  }
  private CrateFiltrosGestionClientesLog(Filtros: Filtro[]) {
    this.AddFiltro(Filtros, 5, "Marcación de Peps");
    this.AddFiltro(Filtros, 6, "Desmarcación de Peps ");
    this.AddFiltro(Filtros, 7, "Solicitud de retiro");
    this.AddFiltro(Filtros, 8, "Reingreso");
    this.AddFiltro(Filtros, 9, "Marcación tratamiento de datos");
    this.AddFiltro(Filtros, 10,"Matricula seguros");
    this.AddFiltro(Filtros, 23,"Desmarcación tratamiento de datos");
  }
  CrateFiltrosAutenticacionErp(Filtros: Filtro[]) {
    this.AddFiltro(Filtros, 3, "Oficina");
    this.AddFiltro(Filtros, 4, "Usuario");
  }
  GetCampos() {
    let Campos: Campo[] = [];
    this.CreaCampos(Campos);
    return Campos;
  }
  GetCamposFichaAnalisis(): Campo[] {
    let Campos: Campo[] = [];
    this.CreaCamposFichaAnalisis(Campos);
    return Campos;
  }
  GetCamposProductosVirtuales(): Campo[] {
    let Campos: Campo[] = [];
    this.CreaCamposProductosVirtuales(Campos);
    return Campos;
  }
  CreaCamposProductosVirtuales(Campos : Campo[]): Campo[] {
    this.AddCampo(Campos,30, "Operación", "ISNULL(DBO.ERP_FN_NombreOperacion(Logs.IdOperacion),'') As nombreOperacion", "nombreOperacion");
    this.AddCampo(Campos,31, "Número proceso", " ISNULL(logs.NumeroProceso,'') AS NumeroProceso", "NumeroProceso");
    this.AddCampo(Campos,32, "Documento", " ISNULL(per.NumeroDocumento,'') AS Documento", "Documento");
    this.AddCampo(Campos,33, "Nombre", "ISNULL(Per.PrimerNombre + ' ' + Per.SegundoNombre + ' ' + Per.PrimerApellido + ' ' +Per.SegundoApellido , '') AS nombre", "Oficina");
    this.AddCampo(Campos,34, "Usuario", "ISNULL(P.PrimerNombre + ' ' + P.SegundoNombre + ' ' + P.PrimerApellido + ' ' +P.SegundoApellido , '') AS Asesor", "nombreAnalista");
    this.AddCampo(Campos,35, "Fecha modifica", "ISNULL(logs.FechaModificacion,'') AS FechaModificacion", "fechaModifica");
    this.AddCampo(Campos,36, "Json", "ISNULL(logs.JsonDto,'') AS JsonDto", "json");
    return Campos;
  }
  CreaCamposFichaAnalisis(Campos: Campo[]) {
    this.AddCampo(Campos,29, "Oficina radicado", "ISNULL(dbo.fn_genNomOficina(Radicado.intOficina), '') AS Oficina","Oficina");
    this.AddCampo(Campos,30, "Operación", "ISNULL(DBO.ERP_FN_NombreOperacion(Logs.IdOperacion),'') As nombreOperacion", "nombreOperacion");
    this.AddCampo(Campos,31, "Número radicado", "ISNULL(convert(varchar(20),Logs.Radicado),'') as numeroRadicado", "numeroRadicado");
    this.AddCampo(Campos,32, "Usuario", "ISNULL(Per.PrimerNombre + ' ' + Per.SegundoNombre + ' ' + Per.PrimerApellido + ' ' +Per.SegundoApellido , '') AS analista", "nombreAnalista");
    this.AddCampo(Campos,33, "Oficina modifica", "ISNULL(dbo.fn_genNomOficina(Logs.IdOficina), '') AS Oficina","Oficina");
    this.AddCampo(Campos,34, "Fecha modifica", "ISNULL(logs.FechaModificacion,'') AS fechaModifica", "fechaModifica");
    this.AddCampo(Campos,35, "Json", "ISNULL(Logs.JsonDto,'') as json", "json");
  }
  GetCamposMisProductos() {
    let Campos: Campo[] = [];
    this.CreaCamposMisProductos(Campos);
    return Campos;
  }
  GetCamposAsesorias() {
    let Campos: Campo[] = [];
    this.CreaCamposAsesorias(Campos);
    return Campos;
  }
  GetCamposBanners(): Campo[] {
    let Campos: Campo[] = [];
    this.CreaCamposBanners(Campos);
    return Campos
  }
  GetCamposAutenticacionErp(): Campo[] {
    let Campos: Campo[] = [];
    this.CreaCamposAutenticacionErp(Campos);
    return Campos
  }
  
  private CreaCamposBanners(Campos: Campo[]) {
    this.AddCampo(Campos,1, "Nombre", "ISNULL(Per.PrimerNombre + ' ' + Per.SegundoNombre + ' ' + Per.PrimerApellido + ' ' +Per.SegundoApellido , '') AS nombre", "nombre");
    this.AddCampo(Campos,1, "Fecha", "ISNULL(Banner.FechaModificacion,'') AS Fecha", "Fecha");
  }
  private CreaCamposAsesorias(Campos: Campo[]) {
    this.AddCampo(Campos,1, "Oficina", "ISNULL(dbo.fn_genNomOficina(Ase.IdOFicina), '') AS Oficina","Oficina");
    this.AddCampo(Campos,2, "Modulo", "ISNULL(DBO.ERP_FN_NombreModulo(Ase.IdModulo),'') As nombreModulo", "nombreModulo");
    this.AddCampo(Campos,3, "Operación", "ISNULL(DBO.ERP_FN_NombreOperacion(Ase.IdOperacion),'') As nombreOperacion","nombreOperacion");
    this.AddCampo(Campos,4, "Numero asesoria", "ISNULL(Ase.NumeroAsesoria,'') As nombreModulo", "numAsesoria");
    this.AddCampo(Campos,5, "Documento", "ISNULL(Contra.strDocumento,'') AS Doc", "Doc");
    this.AddCampo(Campos,6, "Nombre", "ISNULL(Per.PrimerNombre + ' ' + Per.SegundoNombre + ' ' + Per.PrimerApellido + ' ' +Per.SegundoApellido , '') AS nombre ", "nombreOperacion");
    this.AddCampo(Campos,7, "Usuario", "ISNULL(REPLACE(U.Nombre,',',' '),'') AS usuario", "usuario");
    this.AddCampo(Campos,8, "Fecha", "ISNULL(Ase.FechaModificacion,'') As FechaModificacion","FechaModificacion");
    this.AddCampo(Campos,9, "JSON", "ISNULL(Ase.JsonDto,'') As JSONDTO","JSONDTO");
  }
  private CreaCamposMisProductos(Campos: Campo[]) {
    this.AddCampo(Campos, 1, "Oficina", "ISNULL(dbo.fn_genNomOficina(MisPro.IdOficina), '') AS Oficina", "Oficina");
    this.AddCampo(Campos, 2, "Operación", "ISNULL(DBO.ERP_FN_NombreOperacion(MisPro.IdOperacion),'') As nombreOperacion", "nombreOperacion");
    this.AddCampo(Campos, 3, "Opción", "ISNULL(Op.Descripcion,'') AS Opcion","Opcion");
    this.AddCampo(Campos, 4, "Cuenta", "ISNULL([dbo].[fn_genCuenta](CONVERT(smallint, F.intOficina), CONVERT(smallint, F.intProducto), CONVERT(int, F.lngConsecutivo), CONVERT(smallint, F.intDigito)),'') AS Cuenta", "Cuenta");
    this.AddCampo(Campos, 5, "Documento", "ISNULL(P.NumeroDocumento,'') AS Doc", "Doc");
    this.AddCampo(Campos, 6, "Nombre", "ISNULL(P.PrimerNombre + ' ' + P.SegundoNombre + ' ' + P.PrimerApellido + ' ' + P.SegundoApellido,'') AS Nombre", "Nombre");
    this.AddCampo(Campos, 7, "Usuario", "ISNULL(REPLACE(U.Nombre, ',', ' '),'') AS Usuario", "Usuario");
    this.AddCampo(Campos, 8, "Fecha", "ISNULL(MisPro.dtmFecha,'') As nombreOperacion", "nombreOperacion");
    this.AddCampo(Campos, 9, "JSON", "ISNULL(MisPro.JsonDto,'') As json", "json");
  }
  GetCamposGestionClientesLog(IdFilter: number) {
    let Campos: Campo[] = [];
    this.CreaCamposGestionClentesLog(Campos,IdFilter);
    return Campos;
  }
  private CreaCamposGestionClentesLog(Campos: Campo[], IdFilter: number) {
    this.AddCampo(Campos, 9, "Tipo documento", "ISNULL(dbo.ERP_FNDescribe(8000,P.IdTipoDocumento), '') AS TipoDoc", "TipoDoc");
    this.AddCampo(Campos, 10, "Documento", "ISNULL(P.NumeroDocumento,'') AS Doc", "Doc");
    this.AddCampo(Campos, 11, "Nombre", "ISNULL(P.PrimerNombre + ' ' + P.SegundoNombre + ' ' + P.PrimerApellido + ' ' + P.SegundoApellido,'') AS Nombre", "Nombre"); 
    if (IdFilter == 5 || IdFilter == 6)
    {
      if(IdFilter == 5 )
        this.AddCampo(Campos, 12, "Fecha marcación", "ISNULL(PEPS.FechaMarcacion, '') AS FechaMarca", "FechaMarca");
      else
        this.AddCampo(Campos, 13, "Fecha desmarcación", "ISNULL(PEPS.FechaDesmarcacion, '') AS FechaDesMarca", "FechaDesMarca");
      this.AddCampo(Campos, 14, "Asesor", "ISNULL(Per.PrimerNombre + ' ' + Per.SegundoNombre + ' ' + Per.PrimerApellido + ' ' +Per.SegundoApellido , '') AS Asesor", "Asesor");
    }
    else if (IdFilter == 7) {
      this.AddCampo(Campos, 15, "Fecha retiro", "ISNULL(R.FechaRetiro,'') AS FechaRetiro", "FechaRetiro");
      this.AddCampo(Campos, 16, "Asesor", "ISNULL(Per.PrimerNombre + ' ' + Per.SegundoNombre + ' ' + Per.PrimerApellido + ' ' +Per.SegundoApellido , '') AS Asesor", "Asesor");
      this.AddCampo(Campos, 17, "Motivo de retiro", "ISNULL(Ra.Descripcion,'') AS Motivo", "Motivo"); 
      this.AddCampo(Campos, 18, "Descripción", "ISNULL(R.DescripcionOtro,'') AS Descripcion", "Descripcion"); 
    }
    else if (IdFilter == 8) {
      this.AddCampo(Campos, 19, "Fecha de reingreso", "ISNULL(R.FechaReingreso,'') AS FechaRetiro", "FechaRetiro");
      this.AddCampo(Campos, 20, "Asesor", "ISNULL(Per.PrimerNombre + ' ' + Per.SegundoNombre + ' ' + Per.PrimerApellido + ' ' +Per.SegundoApellido , '') AS Asesor", "Asesor"); 
    }
    else if (IdFilter == 9 || IdFilter == 23) {
      this.AddCampo(Campos, 21, "Acepta", "ISNULL(CASE R.Acepto WHEN 1 THEN 'SI' WHEN 0 THEN 'NO' END,'') AS Acepta", "Acepta");
      if (IdFilter == 9)
        this.AddCampo(Campos, 22, "Fecha acepta", "ISNULL(R.FechaAceptacion,'') AS FechaAcepta", "FechaAcepta"); 
      else  
        this.AddCampo(Campos, 23, "Fecha no acepta", "ISNULL(R.FechaNoAceptacion,'') AS FechaNoAcepta", "FechaNoAcepta");
      
      this.AddCampo(Campos, 24, "Asesor", "ISNULL(Per.PrimerNombre + ' ' + Per.SegundoNombre + ' ' + Per.PrimerApellido + ' ' +Per.SegundoApellido , '') AS Asesor ", "Asesor");
    }
    else if (IdFilter == 10) {
      this.AddCampo(Campos, 25, "Estado", "ISNULL(E.Nombre,'') AS Estado", "Estado");
      this.AddCampo(Campos, 26, "Seguro", "ISNULL([dbo].[fn_admPtipos](19800,R.IdSeguro),'') AS Seguro", "Seguro"); 
      this.AddCampo(Campos, 27, "Monto asegurado", "ISNULL(R.MontoAsegurado,'') AS MontoAsegurado", "MontoAsegurado");
      this.AddCampo(Campos, 28, "Fecha matricula", "ISNULL(R.FechaCreacion,'') AS FechaCreacion", "FechaCreacion");
      this.AddCampo(Campos, 29, "Fecha respuesta aseguradora", "ISNULL(R.FechaRptaAseguradora,'') AS FechaRes", "FechaRes");
      this.AddCampo(Campos, 30, "Fecha modificación", "ISNULL(R.FechaModificacion,'') AS FechaModif", "FechaModif"); 
    } 
  }
  CreaCamposAutenticacionErp(Campos: Campo[]) {
    this.AddCampo(Campos, 25, "Oficina", "ISNULL(dbo.fn_genNomOficina(Logs.IdOficina), '') AS Oficina", "Oficina");
    this.AddCampo(Campos, 26, "Usuario", "ISNULL(U.strUsuario,'') AS Usuario", "Usuario"); 
    this.AddCampo(Campos, 27, "Nombre", "ISNULL(P.PrimerNombre + ' ' + P.SegundoNombre + ' ' + P.PrimerApellido + ' ' + P.SegundoApellido,'') AS Nombre", "Nombre");
    this.AddCampo(Campos, 28, "Fecha conexion", "ISNULL(Logs.FechaConexion,'') AS FechaConexion", "FechaConexion");
    this.AddCampo(Campos, 29, "Ip", "ISNULL(Logs.IpConexion,'') AS IpConexion", "IpConexion");
    this.AddCampo(Campos, 30, "Json", "ISNULL(Logs.JsonDto,'') AS JsonDto", "JsonDto"); 
  }
  private CrateFiltros(Filtros: Filtro[],operacion : string = "") {
    this.AddFiltro(Filtros, 1, "Modulo");
    this.AddFiltro(Filtros, 2, "Operación");
    this.AddFiltro(Filtros, 3, "Oficina");
    this.AddFiltro(Filtros, 4, "Usuario");
  }
  private AddFiltro(Filtros: Filtro[], id : number,nombreF :string) {
    let filtro = new Filtro();
    filtro.idFiltro = id;
    filtro.NombreFiltro = nombreF;
    Filtros.push(filtro);
  }
  private CreaCampos(Campos : Campo[]) {
    this.AddCampo(Campos,1, "Oficina", "ISNULL(dbo.fn_genNomOficina(Logs.IdOficina), '') AS Oficina","Oficina");
    this.AddCampo(Campos,2, "Modulo", "ISNULL(DBO.ERP_FN_NombreModulo(Logs.IdModulo),'') As nombreModulo","nombreModulo");
    this.AddCampo(Campos,3, "Operación", "ISNULL(DBO.ERP_FN_NombreOperacion(Logs.IdOperacion),'') As nombreOperacion", "nombreOperacion");
    this.AddCampo(Campos,4, "Documento", "ISNULL(Per.NumeroDocumento,'') AS Doc", "Doc");
    this.AddCampo(Campos,5, "Cuenta", "ISNULL([dbo].[fn_genCuenta](CONVERT(smallint, F.intOficina), CONVERT(smallint, F.intProducto), CONVERT(int, F.lngConsecutivo), CONVERT(smallint, F.intDigito)),'') AS Cuenta", "Cuenta");
    this.AddCampo(Campos,6, "Asesor", "ISNULL(P.PrimerNombre + ' ' + P.SegundoNombre + ' ' + P.PrimerApellido + ' ' +P.SegundoApellido , '') AS Asesor ","Asesor");
    this.AddCampo(Campos,7, "Fecha modifica", "ISNULL(Logs.FechaModificacion,'') As FechaModifica ","FechaModifica");
    this.AddCampo(Campos,8, "JSON", "ISNULL(Logs.JsonDto,'') AS JSONDto","JSONDto");
  }
  private AddCampo(Campos :Campo[],id : number,NombreCampo : string,NombreCampoBD:string,nombreAs : string) {
    var campo = new Campo();
    campo.idCampo = id;
    campo.NombreCampoBD = NombreCampoBD;
    campo.NombreCampo = NombreCampo;
    campo.NombreAs = nombreAs
    Campos.push(campo);
  }
}
