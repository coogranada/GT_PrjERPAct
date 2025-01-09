import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Campo, Filtro, Informe } from '../../Models/Informes/informe-clientes/informe-clientes.model';

@Injectable({
  providedIn: 'root'
})
export class InformeJuridicoService {

  constructor(private http: HttpClient, private envirment: EnvironmentService) { }
  
    GetCantidadRegistros(In: Informe): Observable<number>{
      return this.http.post<number>(this.envirment.Url + "/InformeJuridicos/getCantidadRegistros",In)
    }
    GenerateInformesJuridicos(In: Informe): Observable<any>{
      return this.http.post<any>(this.envirment.Url + "/InformeJuridicos/GenerarXLSXInforme",In)
    }
    GetCampos() {
      let Campos: Campo[] = [];
      this.CreaCampos(Campos);
      return Campos;
    }
    GetFiltros(oficinaOrAdmin : number, isOficina : boolean) {
      let Filtros: Filtro[] = [];
      this.CrateFiltros(Filtros);
      if (oficinaOrAdmin != 3)
        Filtros = Filtros.filter(x => x.idFiltro != 9);
      
      if (isOficina == true)
        Filtros = Filtros.filter(x => x.idFiltro == 9);
      
      return Filtros;
    }
    private CreaCampos(Campos: Campo[]) {

      this.AddCampo(Campos,1, "Tipo relación", "ISNULL(dbo.ERP_FNDescribe(24000,JI.IdRelacion), '') AS TipoRelacion", "TipoRelacion");
      this.AddCampo(Campos,2, "Tipo documento", "ISNULL(dbo.ERP_FNDescribe(8000,P.IdTipoDocumento), '') AS TipoDocumento","TipoDoc");
      this.AddCampo(Campos,3, "Número documento", " ISNULL(P.NumeroDocumento, '') AS NumeroDoc","NumeroDoc");
      this.AddCampo(Campos,4, "Razón social", "ISNULL(P.PrimerNombre, '') AS RazonSocial ","RazonSocial");
      this.AddCampo(Campos,5, "Fecha constitución", "ISNULL(JI.FechaConstitucion, '') AS FechaConstitucion","FechaConstitucion"); 
      this.AddCampo(Campos,6, "Estrato", "ISNULL(JI.Estrato, '') AS Estrato ","Estrato");
      this.AddCampo(Campos,7, "Ciiu", "ISNULL(JI.CIIU, '') AS CIIU ","CIIU");
      this.AddCampo(Campos,8, "Actividad económica", "ISNULL(dbo.ERP_FNDescribeActEconomica(JI.CIIU), '') AS ActividadEconomica ","ActividadEconomica");
      this.AddCampo(Campos,9, "País", "ISNULL(dbo.ERP_FNDescribePais(JI.IdPais), '') AS Pais ","Pais");
      this.AddCampo(Campos,10, "Departamento", "ISNULL(dbo.ERP_FNDescripcionDepartamentoByIdCuidad(JI.IdCiudad), '') AS Departamento ","Departamento");
      this.AddCampo(Campos,11, "Ciudad", " ISNULL(dbo.ERP_FNDescripcionCiudad(JI.IdCiudad), '') AS Ciudad ","Ciudad");
      this.AddCampo(Campos,12, "Barrio", "ISNULL((select b.Descripcion from  ERP_tblBarrios AS B where B.IdBarrio = D.IdBarrio),'') AS Barrio","Barrio");
      this.AddCampo(Campos,13, "Dirección", " ISNULL( D.Descripcion, '') AS Direccion", "Direccion");
      this.AddCampo(Campos,14, "Tipo local", "ISNULL(( CASE WHEN JI.IdTipoLocal = 1 THEN 'Propio' WHEN JI.IdTipoLocal = 2 THEN  'Arriendo' ELSE '' END),'') AS TipoLocal","TipoLocal");
      this.AddCampo(Campos,15, "Objeto social", "ISNULL(( CASE WHEN JI.idObjetoSocial = 1 THEN 'Con Animo de Lucro' ELSE 'Sin Animo de Lucro' END),'')  AS ObjetoSocial ","ObjetoSocial");
      this.AddCampo(Campos,16, "Tipo sociedad", "ISNULL(dbo.ERP_FNDescribeTipoSociedad(JI.IdTipoSociedad),'')  AS TipoSociedad ","TipoSociedad");
      this.AddCampo(Campos,17, "Teléfono", "ISNULL(dbo.ERP_FNTelefonoJuridico( JI.IdTercero),'')  AS Telefono ","Telefono");
      this.AddCampo(Campos,18, "Nro. celular", "ISNULL(dbo.fn_ERPCelular(JI.IdTercero), '') AS Celular ","Celular");
      this.AddCampo(Campos,19, "Email", "ISNULL(dbo.fn_ERPEmail(JI.IdTercero), '') AS Email","Email");
      this.AddCampo(Campos,20, "Ingresos operativos", " ISNULL(dbo.ERP_FNValorJuridicosConceptos(JI.IdTercero,1,1),0)  AS IngresosOperativos","IngresosOperativos");
      this.AddCampo(Campos,21, "Otros ingresos", "ISNULL(dbo.ERP_FNValorJuridicosConceptos(JI.IdTercero,1,2),0)  AS OtrosIngresos","OtrosIngresos");
      this.AddCampo(Campos,22, "Costos de administracion", "ISNULL(dbo.ERP_FNValorJuridicosConceptos(JI.IdTercero,2,3),0)  AS GastosAdmin","GastosAdmin");
      this.AddCampo(Campos,23, "Gastos financieros","ISNULL(dbo.ERP_FNValorJuridicosConceptos(JI.IdTercero,2,4),0)  AS GastosFinancieros","GastosFinancieros");
      this.AddCampo(Campos,24, "Otros gastos", "ISNULL(dbo.ERP_FNValorJuridicosConceptos(JI.IdTercero,2,5),0)  AS OtrosGastos","OtrosGastos");
      this.AddCampo(Campos,25, "Activos corrientes", "ISNULL(TP.ActivosCorrientes,0) AS ActivosCorrientes","ActivosCorrientes");
      this.AddCampo(Campos,26, "Activos no corrientes", "ISNULL(TP.ActivosNoCorrientes,0) AS ActivosNoCorrientes","ActivosNoCorrientes");
      this.AddCampo(Campos,27, "Otros activos", " ISNULL(TP.OtrosActivos,0) AS OtrosActivos","OtrosActivos");
      this.AddCampo(Campos,28, "Pasivos obligaciones financieras", "ISNULL(TP.ObligacionesFinancieras,0) AS PasivosObligacionesFinancieras","PasivosObligacionesFinancieras");
      this.AddCampo(Campos,29, "Pasivos cuentas por pagar", "ISNULL(TP.CuentasPorPagar,0) AS PasivosCuentasPorPagar","PasivosCuentasPorPagar");
      this.AddCampo(Campos,30, "Otros pasivos", "ISNULL(TP.OtrosPasivos,0) AS PasivosOtroPasivos","PasivosOtroPasivos");
      this.AddCampo(Campos,31, "Documento representante", "ISNULL(Per.NumeroDocumento ,'') AS DocumentoRepresentante","DocumentoRepresentante");
      this.AddCampo(Campos,32, "Tipo documento representante", "ISNULL(dbo.ERP_FNDescribe(8000,Per.IdTipoDocumento), '') AS TDRepresentante","TDRepresentante");
      this.AddCampo(Campos,33, "Nombre representante", " ISNULL(per.PrimerNombre + ' ' +  per.SegundoNombre + ' ' + per.PrimerApellido + ' ' + per.SegundoApellido ,'') AS NombreRepresentante","NombreRepresentante");
      this.AddCampo(Campos,34, "¿Realiza operaciones en moneda extranjera?", "ISNULL( [dbo].ERP_FNEntrevistaREspuesta(JI.IdTercero, 6), '') AS RealizaOperacionesMonedaExtranjera","RealizaOperacionesMonedaExtranjera");
      this.AddCampo(Campos,35, "Moneda operaciones extranjera", "ISNULL((select M.Nombre FROM ERP_tblEntrevista As E inner join erp_tblMOnedas as M  ON   CONVERT(varchar,E.Respuesta) = CONVERT(varchar,M.Id) WHERE E.idtercero = JI.IdTercero and  NumeroPregunta =  25), '')    AS MonedaOperacionesExtranjera","MonedaOperacionesExtranjera");
      this.AddCampo(Campos,36, "Marcado tratamiento datos", "ISNULL((SELECT CASE WHEN DJ.Acepto = 0 THEN 'NO' WHEN DJ.Acepto = 1 THEN 'SI' ELSE '' END ), '')  AS MarcadoTramiteDatos","MarcadoTramiteDatos"); /////
      this.AddCampo(Campos,37, "Marcado exento GMF", "ISNULL((SELECT CASE WHEN JI.ExentoGMF = 0 THEN 'NO' WHEN JI.ExentoGMF = 1 THEN 'SI' ELSE '' END ), '')  AS ExentoGMF","ExentoGMF");
      this.AddCampo(Campos,38, "Oficina", "ISNULL(dbo.fn_genNomOficina(JI.IdOficina), '') AS Oficina","Oficina");
      this.AddCampo(Campos,39, "Estado", "ISNULL(dbo.ERP_FNDescribe(10500,JI.idEstado), '') AS Estado","Estado");
      this.AddCampo(Campos,40, "Fecha creación", "ISNULL(P.FechaMatricula,'')  AS FechaMatricula", "FechaMatricula");
      this.AddCampo(Campos,41, "Asesor crea", "  ISNULL(dbo.ERP_FNDescribeAsesor((select AD.lngTercero from admAsesores AS AD  where intIdAsesor = JI.IdAsesorMatriculo)),'')  AS AsesorCrea","AsesorCrea");
      this.AddCampo(Campos,42, "Asesor externo", " ISNULL(dbo.ERP_FNDescribeAsesor((select AD.lngTercero from admAsesores AS AD  where intIdAsesor = JI.IdAsesorExterno)),'')  AS AsesorExterno","AsesorExterno");
      this.AddCampo(Campos,43, "Fecha modificación", "ISNULL(JI.FechaModificacion,'')", "FechaUltimaActualizacion");
      this.AddCampo(Campos,44, "Asesor modifica", " ISNULL(dbo.ERP_FNDescribeAsesor((select AD.lngTercero from admAsesores AS AD  where intIdAsesor = JI.IdAsesorModifica)),'')  AS AsesorActualizacion","AsesorActualizacion");
      this.AddCampo(Campos,45, "Fecha retiro", "ISNULL(JI.FechaRetiro, '') AS FechaRetiro","FechaRetiro");
      this.AddCampo(Campos,46, "Aportes sociales", "ISNULL(FraC.curEfectivo,'0') As AportesSociales", "AportesSociales");
      this.AddCampo(Campos,47, "Fecha apertura aportes", "ISNULL(FraC.dtmMatricula,'') As AportesSociales", "AportesSociales");
      
      

      
    }
    private AddCampo(Campos :Campo[],id : number,NombreCampo : string,NombreCampoBD:string,nombreAs : string) {
      var campo = new Campo();
      campo.idCampo = id;
      campo.NombreCampoBD = NombreCampoBD;
      campo.NombreCampo = NombreCampo;
      campo.NombreAs = nombreAs
      Campos.push(campo);
    }
    private CrateFiltros(Filtros: Filtro[]) {
      this.AddFiltro(Filtros, 1, "Fecha de creación");
      this.AddFiltro(Filtros, 2, "Tipo relación");
      this.AddFiltro(Filtros, 3, "Actividad económica");
      this.AddFiltro(Filtros, 4, "Departamento");
      this.AddFiltro(Filtros, 5, "Ciudad");
      this.AddFiltro(Filtros, 6, "Barrio");
      this.AddFiltro(Filtros, 7, "Fecha de retiro");
      this.AddFiltro(Filtros, 8, "Como conoció a Coogranada");
      this.AddFiltro(Filtros, 9, "Oficina");
      this.AddFiltro(Filtros, 10, "Usuario");
      this.AddFiltro(Filtros, 11, "Fecha ultima actualización");
      this.AddFiltro(Filtros, 12, "Fecha apertura aportes");
    }
    private AddFiltro(Filtros: Filtro[], id : number,nombreF :string) {
      let filtro = new Filtro();
      filtro.idFiltro = id;
      filtro.NombreFiltro = nombreF;
      Filtros.push(filtro);
    } 
}
