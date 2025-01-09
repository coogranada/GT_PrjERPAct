import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../Enviroment/enviroment.service';
import { Observable } from 'rxjs';
import { Campo, Filtro } from '../../Models/Informes/informe-clientes/informe-clientes.model';

@Injectable()
export class InformeClientesService {
    private url: string = "";
    constructor(private _http: HttpClient,private environment: EnvironmentService) { }
    GenerarInformeNaturales(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/getCantidadRegistros`;
      return this._http.post<any>(this.url, Datos);
    }
    GenerarXLSXInforme(Datos: any): Observable<any> {
      this.url = `${this.environment.Url}/GenerarXLSXInforme`;
      return this._http.post<any>(this.url, Datos);
    }
    ValidatUsuario(usuario: string): Observable<any> {
      this.url = `${this.environment.Url}/ValidaUsuario?usuario=${usuario}`;
      return this._http.get<any>(this.url);
    }
    getOcupaciones(tipoEmpleo: number): Observable<any> {
      this.url = `${this.environment.Url}/getOcupaciones/${tipoEmpleo}`;
      return this._http.get<any>(this.url);
    }
    getOficinas(): Observable<any> {
      this.url = `${this.environment.Url}/ObtenerOficinasUsuarios`;
      return this._http.get<any>(this.url);
    } 
    GetFiltros(oficinaOrAdmin: number, isOficina: boolean) : Filtro[] {
      let Filtros: Filtro[] = [];
      Filtros = this.CreateFiltros(Filtros);

      if (oficinaOrAdmin != 3)
          Filtros = Filtros.filter(x => x.idFiltro != 22);
        
      if (isOficina == true)
          Filtros = Filtros.filter(x => x.idFiltro == 22);
        
      return Filtros;
    }
    GetCampos(): Campo[] {
      let Campos: Campo[] = [];
      Campos = this.CreateCampos(Campos);
      return Campos;
    }
    private CreateCampos(Campos : Campo[]): Campo[] {
      this.AddCampo(Campos,1, "ISNULL(dbo.ERP_FNDescribe(24000,N.IdRelacion), '') AS TipoRelacion", "Tipo relación");
      this.AddCampo(Campos,2, "ISNULL(dbo.ERP_FNDescribe(8000,P.IdTipoDocumento), '') AS TipoDocumento", "Tipo documento");
      this.AddCampo(Campos,3, "ISNULL(P.NumeroDocumento, '') AS NumeroDocumento", "Número documento");
      this.AddCampo(Campos,4, "ISNULL(P.PrimerApellido, '') AS PrimerApellido", "Primer apellido");
      this.AddCampo(Campos,5, "ISNULL(P.SegundoApellido, '') AS SegundoApellido", "Segundo apellido");
      this.AddCampo(Campos,6, "ISNULL(P.PrimerNombre, '') AS PrimerNombre", "Primer nombre");
      this.AddCampo(Campos,7, "ISNULL(P.SegundoNombre, '') AS SegundoNombre", "Segundo nombre");
      this.AddCampo(Campos,8, "ISNULL(T.FechaNacimiento, '') AS FechaNacimiento", "Fecha nacimiento");
      this.AddCampo(Campos,9, "ISNULL(dbo.ERP_FNDescribePais(T.IdPaisNto), '') AS PaisNacimiento", "País nacimiento");
      this.AddCampo(Campos,10, "ISNULL(dbo.ERP_FNDescripcionDepartamentoByIdCuidad(T.IdCiudadNto), '') as DepartamentoNacimiento ", "Departamento de nacimiento ");
      this.AddCampo(Campos,11, "ISNULL(dbo.ERP_FNDescripcionCiudad(T.IdCiudadNto), '') AS CiudadNacimiento", "Ciudad nacimiento");
      this.AddCampo(Campos,12, "ISNULL(dbo.ERP_FNDescribeNacionalidad(N.IdNacionalidad), '') AS Nacionalidad", "Nacionalidad");
      this.AddCampo(Campos,13, "ISNULL(T.FechaExpDocumento, '') AS FechaExpDocumento", "Fecha expedición");
      this.AddCampo(Campos,14, "ISNULL(dbo.ERP_FNDescribePais(T.IdPaisExpe), '') AS PaisExpedicion", "País expedición");
      this.AddCampo(Campos,15, "ISNULL(dbo.ERP_FNDescripcionDepartamentoByIdCuidad(T.IdCiudadExpeDto), '') as DepartamentoExpedicion", "Departamento expedición");
      this.AddCampo(Campos,16, "ISNULL(dbo.ERP_FNDescripcionCiudad(T.IdCiudadExpeDto), '') AS CiudadExpedicion", "Ciudad expedición");
      this.AddCampo(Campos,17, "ISNULL(CASE T.IdGenero WHEN 0 THEN 'Femenino' WHEN 1 THEN 'Masculino' END , '') AS Genero", "Género");
      this.AddCampo(Campos,18, "ISNULL(dbo.ERP_FNDescribe(13000,N.IdEstadoCivil), '') AS EstadoCivil", "Estado civil");
      this.AddCampo(Campos,19, "ISNULL(N.Estrato, '') AS Estrato", "Estrato");
      this.AddCampo(Campos,20, "ISNULL(dbo.ERP_FNDescribeEps(N.IdEPS), '') AS Eps", "EPS");
      this.AddCampo(Campos,21, "ISNULL(dbo.ERP_FNDescribe(32000,N.IdTipoVivienda), '') AS TipoVivienda", "Tipo vivienda");
      this.AddCampo(Campos,22, "ISNULL(N.Fecha_Vive, '') AS Fecha_Vive", "Vive desde");
      this.AddCampo(Campos,23, "ISNULL(N.NumHijos, 0) AS NumHijos ", "Número de hijos");
      this.AddCampo(Campos,24, "ISNULL(N.NumHijosEstudian, '') AS NumHijosEstudian", "Número de hijos que estudian");
      this.AddCampo(Campos,25, "ISNULL(N.NumPersCargo, '') AS NumPersCargo", "Tiene personas a cargo");
      this.AddCampo(Campos,26, "ISNULL(( CASE WHEN N.MadreCabezaFamilia = 0 THEN 'No' ELSE 'Si' END), '') AS CabezaFamilia", "Cabeza de familia");
      this.AddCampo(Campos,27, "ISNULL(dbo.ERP_FNDescribe(21000,N.IdTituloProfesional), '') AS Profesion", "Profesión");
      this.AddCampo(Campos,28, "ISNULL(dbo.fn_admPtipos(18000, N.IdNivelEstudio),' ') as NivelEstudios", "Nivel de estudios");
      this.AddCampo(Campos,29, "ISNULL(dbo.ERP_FNDescribeTipoEmpleo(N.IdTipoEmpleo), '') AS TipoEmpleo", "Tipo empleo");
      this.AddCampo(Campos,30, "ISNULL(dbo.ERP_FNDescribeOcupacion(N.IdTipoOcupacion), '') AS TipoOcupacion", "Tipo ocupación");
      this.AddCampo(Campos,31, "ISNULL((SELECT STR(intId) + ' - ' + strDescripcion  FROM admCiiu WHERE intId = n.IdActividadEconomica), '') AS CIIU", "Actividad económica");
      this.AddCampo(Campos,32, "ISNULL(CASE WHEN N.Dependiente = 0 THEN 'Independiente'  WHEN N.Dependiente is null THEN '' ELSE  'Dependiente' END, '') AS Dependiente", "Dependiente");
      this.AddCampo(Campos,33, "ISNULL(dbo.fn_ERPCelular(T.IdTercero), '') as Celular", "Celular");
      this.AddCampo(Campos,34, "ISNULL(dbo.fn_ERPEmail(T.IdTercero), '') AS Email", "Email");
      this.AddCampo(Campos,35, "ISNULL(dbo.fn_ERPDirRes(T.IdTercero), '') as DireccionResidencia", "Dirección residencia");
      this.AddCampo(Campos,36, "ISNULL(dbo.ERP_FNPaisResidencia(T.IdTercero), '') as PaisResidencia", "País residencia");
      this.AddCampo(Campos,37, "ISNULL(dbo.ERP_FNDepartamentoResidencia(T.IdTercero), '') as DepartamentoResidencia", "Departamento residencia");
      this.AddCampo(Campos,38, "ISNULL(dbo.ERP_FNCiudadResidencia(T.IdTercero), '') as CuidadResidencia", "Cuidad residencia");
      this.AddCampo(Campos,39, "ISNULL((select top 1 B.Descripcion from 	ERP_tblDatosContacto Contactods INNER JOIN ERP_tblBarrios AS B ON (B.IdBarrio = Contactods.IdBarrio) where   IdTipoContacto = 1 AND IdTercero = T.IdTercero),'') AS BarrioResidencia", "Barrio residencia");
      this.AddCampo(Campos,40, "ISNULL(dbo.fn_ERPTelRes(T.IdTercero), '')  as TelefonoResidencia", "Teléfono residencia");
      this.AddCampo(Campos,41, "ISNULL(dbo.fn_ERPDirLab(T.IdTercero), '') as  DireccionTrabajo", "Dirección laboral");
      this.AddCampo(Campos,42, "ISNULL(dbo.ERP_FNPaisTrabaja(T.IdTercero), '') as PaisTrabajo", "País laboral");
      this.AddCampo(Campos,43, "ISNULL(dbo.ERP_FNDepartamentoTrabaja(T.IdTercero), '') as DepartamentoTrabajo", "Departamento laboral");
      this.AddCampo(Campos,44, "ISNULL(dbo.ERP_FNCiudadTrabaja(T.IdTercero), '') as CiudadTrabajo", "Ciudad laboral");
      this.AddCampo(Campos,45, "ISNULL(dbo.fn_ERPTelLab(T.IdTercero), '') as TelefonoTrabajo", "Teléfono laboral");
      this.AddCampo(Campos,46, "ISNULL((SELECT strNit FROM admEmpresas WHERE lngCodigo = X.IdEmpresa), '') AS NitEmpresa", "Nit empresa");
      this.AddCampo(Campos,47, "ISNULL((case when x.EmpresaDescripcion is null then ((SELECT strNombre FROM admEmpresas WHERE lngCodigo = X.IdEmpresa)) else  x.EmpresaDescripcion END),'') as NombreEmpresa ", "Nombre empresa");
      this.AddCampo(Campos,48, "ISNULL(dbo.fn_admPTipos(4000, X.IdCargo), '') AS Cargo" , "Cargo");
      this.AddCampo(Campos,49, "ISNULL(dbo.fn_admPTipos(7000, X.IdTipoContratoLaboral), '') AS TipoContrato", "Tipo contrato");
      this.AddCampo(Campos,50, "ISNULL(X.Fecha ,'') AS FechaAntiguedadLaboral", "Fecha antigüedad laboral");
      this.AddCampo(Campos,51, "ISNULL(X.IdConvenio, '') AS Convenio", "Convenio");
      this.AddCampo(Campos, 52, "(ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 1 AND IdConceptoFinan =  10 GROUP BY IdConceptoFinan), 0) " +
                              "+  ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 1 AND IdConceptoFinan = 11 GROUP BY IdConceptoFinan), 0)) AS IngresosSalariosVentas", "Ingresos salarios ventas");
      this.AddCampo(Campos,53, "ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 1 AND IdConceptoFinan =  3 GROUP BY IdConceptoFinan),0) AS Comisiones", "Ingresos por comisiones");
      this.AddCampo(Campos,54, "ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 1 AND IdConceptoFinan =  1 GROUP BY IdConceptoFinan), 0) AS Arriendos", "Ingresos por arriendos");
      this.AddCampo(Campos,55, "ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 1 AND IdConceptoFinan =  9 GROUP BY IdConceptoFinan),0) AS OtrosIngresos", "Otros ingresos");

      this.AddCampo(Campos,56, "(ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 1 AND IdConceptoFinan =  9 GROUP BY IdConceptoFinan),0) " +
                        " +  ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 1 AND IdConceptoFinan =  3 GROUP BY IdConceptoFinan),0) " +
                        " +  ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 1 AND IdConceptoFinan =  11 GROUP BY IdConceptoFinan),0) " +
                        " +  ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 1 AND IdConceptoFinan =  1 GROUP BY IdConceptoFinan),0) " +
                        " +  ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 1 AND IdConceptoFinan =  10 GROUP BY IdConceptoFinan), 0)) as  IngfinancierostotalesMensuales ", "Ingresos totales mensuales");  
      this.AddCampo(Campos,57, "ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 1 AND IdConceptoFinan =  12 GROUP BY IdConceptoFinan),0) AS CostosGastos", "Costos gastos");
      this.AddCampo(Campos,58, "ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 2 AND IdConceptoFinan =  2 GROUP BY IdConceptoFinan), 0) AS ValorArriendo", " Gastos por arriendos");
      this.AddCampo(Campos,59, "ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 2 AND IdConceptoFinan =  6 GROUP BY IdConceptoFinan), 0) AS ObligacionesFinancieras", "Obligaciones financieras");
      this.AddCampo(Campos,60, "ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 2 AND  IdConceptoFinan =  5 GROUP BY IdConceptoFinan), 0) AS GastosFamiliares", "Gastos familiares");
      this.AddCampo(Campos,61, "ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 2 AND IdConceptoFinan =  8 GROUP BY IdConceptoFinan), 0) AS OtrosEgresos", "Otros egresos"); 
      this.AddCampo(Campos,62, "ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 2 AND IdConceptoFinan =  7 GROUP BY IdConceptoFinan), 0) AS OtrosEgresos", "Otras Obligaciones"); 
      this.AddCampo(Campos,63, "(( ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 2 AND IdConceptoFinan =  2 GROUP BY IdConceptoFinan), 0)  " +
                        " + ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 2 AND IdConceptoFinan =  6 GROUP BY IdConceptoFinan), 0) " +
                        " + ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 2 AND IdConceptoFinan =  5 GROUP BY IdConceptoFinan), 0)  " +
                        " + ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 2 AND IdConceptoFinan =  7 GROUP BY IdConceptoFinan), 0) " +
                        " + ISNULL((SELECT SUM(Valor) FROM ERP_tblAsocDatosFinancieros WHERE IdTercero = T.IdTercero AND IdCategoria = 2 AND IdConceptoFinan =  8 GROUP BY IdConceptoFinan), 0) ) ) as EgresosTotalesMensuales", "Egresos totales mensuales");        
      this.AddCampo(Campos,64, "ISNULL((SELECT SUM(AvaluoComercial) from ERP_tblAsocPatrimonio where IdTercero = T.IdTercero),0) As Total_Activos", "Total activos");
      this.AddCampo(Campos,65, "ISNULL(N.TotalPasivos, 0) AS TotalPasivos", "Total pasivos");
      this.AddCampo(Campos,66, "ISNULL((SELECT SUM(AvaluoComercial) from ERP_tblAsocPatrimonio where IdTercero = T.IdTercero),0) - ISNULL(N.TotalPasivos,0)  AS TotalPatrimonio", "Total patrimonio");
      this.AddCampo(Campos,67, "ISNULL( dbo.[ERP_FNTipoDocConyugeByIdTercero](T.IdTercero) ,'') as TipoDocConyuge", "Tipo documento cónyuge");          
      this.AddCampo(Campos,68, "ISNULL([dbo].[ERP_FNDocConyugeByIdTercero](T.IdTercero),'') as DocConyuge", "Documento cónyuge");          
      this.AddCampo(Campos,69, "ISNULL(dbo.[ERP_FNNombreConyugeByIdTercero](T.IdTercero),'') as NombreConyuge", "Nombre cónyuge");        
      this.AddCampo(Campos,70, "ISNULL(dbo.fn_genCedula(N.IdTutor), '') AS DocumentoTutor", "Documento tutor");
      this.AddCampo(Campos,71, "ISNULL(dbo.fn_genNombre(N.IdTutor), '') AS NombreTutor", "Nombre tutor");
      this.AddCampo(Campos,72, "ISNULL( CASE TMPE.[20] WHEN 'true' THEN 'SI' ELSE  'NO' END, '') AS PersonaExpuestaPoliticaPublicamente", "¿Es una persona expuesta politica o publicamente?");
      this.AddCampo(Campos,73, "ISNULL( CASE TMPE.[21] WHEN 'true' THEN 'SI' ELSE  'NO' END, '') AS ManejaRecursosPublicos", "¿Maneja recursos publicos? ");
      this.AddCampo(Campos,74, "ISNULL( CASE TMPE.[22] WHEN 'true' THEN 'SI' ELSE  'NO' END, '') AS PorSuCargoActividadEjerceAlgunGradoPoderPublico", "¿Por su cargo o actividad ejerce algún grado de poder público? ");
      this.AddCampo(Campos,75, "ISNULL( CASE TMPE.[26] WHEN 'true' THEN 'SI' ELSE  'NO' END, '') AS PorSuActividadOficioGozaReconocimientoPublico", "¿Por su actividad u oficio, goza usted de reconocimiento público? ");
      this.AddCampo(Campos,76, "ISNULL( CASE TMPE.[23] WHEN 'true' THEN 'SI' ELSE  'NO' END, '') AS ExisteVinculoUstedPersonaPublicamenteExpuesta", "¿Existe algún vínculo entre usted y una persona considerada públicamente expuesta? ");
      this.AddCampo(Campos,77, "ISNULL( CASE TMPE.[6] WHEN  'true' THEN 'SI' ELSE  'NO' END, '') AS RealizaOperacioneseMonedaExtranjera", "¿Realiza operaciones en moneda extranjera? ");
      this.AddCampo(Campos,78, "ISNULL( CASE TMPE.[17] WHEN 'true' THEN 'SI' ELSE  'NO' END, '') AS PoseeCuentasMonedaExtranejra", "¿Posee cuentas en moneda extranjera?");
      this.AddCampo(Campos,79, "ISNULL(TMPE.[29],'') AS Cuenta", "Cuenta");
      this.AddCampo(Campos,80, "ISNULL((SELECT M.Nombre FROM erp_tblMOnedas AS M  WHERE M.Id = TMPE.[19]) , '')  AS Moneda", "Moneda");
      this.AddCampo(Campos,81, "ISNULL( CASE N.PersPEP WHEN 0 THEN 'NO' WHEN 1 THEN 'SI' END, '') AS Peps", "PEPS");
      this.AddCampo(Campos,82, "ISNULL(dbo.fn_genNomOficina(N.IdOficina), '') AS Oficina", "Oficina");
      this.AddCampo(Campos,83, "ISNULL(dbo.ERP_FNDescribe(10500,T.IdEstado), '') AS Estado", "Estado");
      this.AddCampo(Campos,84, "ISNULL(P.FechaMatricula, '') AS FechaCreacion", "Fecha creación");
      this.AddCampo(Campos,85, "ISNULL(dbo.fn_genNomAsesor(N.IdAsesorCrea),'') AS NomAsesorCrea", "Asesor crea");
      this.AddCampo(Campos,86, "ISNULL(dbo.ERP_FNDescribe(5000,N.IdMotivoIngreso), '') AS MotivoIngreso", "Motivo ingreso");
      this.AddCampo(Campos,87, "ISNULL(CASE N.MetodoConocio  WHEN 1 THEN 'Radio' WHEN 2 THEN 'Televisión' WHEN 3 THEN 'Volante' WHEN 4 THEN 'Referido' WHEN 5 THEN 'Web' WHEN 6 THEN 'Por' WHEN 7 THEN 'Otro' END, '') AS MotivoIngreso", "Como conoció a Coogranada");
      this.AddCampo(Campos,88, "ISNULL(dbo.fn_genNombre(T.IdAsesorExterno),'') AS AsesorExterno", "Asesor externo");
      this.AddCampo(Campos,89, "ISNULL(N.FechaMod ,'')  AS FechaModificacion", "Fecha modificación");
      this.AddCampo(Campos,90, "ISNULL(dbo.fn_genNomAsesor(N.IdAsesorMod),'') AS NomAsesorMod", "Asesor modifica");
      this.AddCampo(Campos,91, "ISNULL((select top 1 curEfectivo + curCanje from fraCuentas where  lngTercero =  T.IdTercero  and intProducto = 400 order by dtmUltimaTrans desc), 0) As AportesSociales", "Aportes sociales");
      this.AddCampo(Campos,92, "ISNULL((select top 1 dtmMatricula from fraCuentas where  lngTercero =  T.IdTercero  and intProducto = 400 order by dtmUltimaTrans desc), 0) As AportesSociales", "Fecha apertura aportes");
      return Campos;
    }
    private AddCampo(Campos : Campo[],idCampo : number,NombreCampoBD : string,NombreCampo : string)
    {
      let campo = new Campo();
      campo.idCampo = idCampo;
      campo.NombreCampoBD = NombreCampoBD
      campo.NombreCampo = NombreCampo
      Campos.push(campo);
    }
    private CreateFiltros(Filtros: Filtro[]): Filtro[] {
      this.AddFiltro(Filtros, 1, "Fecha creación");
      this.AddFiltro(Filtros, 2, "Tipo relación");
      this.AddFiltro(Filtros, 3, "Tipo documento");
      this.AddFiltro(Filtros, 4, "Estado");
      this.AddFiltro(Filtros, 5, "Género");
      this.AddFiltro(Filtros, 6, "Estado civil");
      this.AddFiltro(Filtros, 7, "Como conoció a Coogranada");
      this.AddFiltro(Filtros, 8, "Motivo ingreso");
      this.AddFiltro(Filtros, 9, "Estrato");
      this.AddFiltro(Filtros, 10, "Tipo de empleo");
      this.AddFiltro(Filtros, 11, "Tipo de ocupación");
      this.AddFiltro(Filtros, 13, "Profesión");
      this.AddFiltro(Filtros, 14, "Rango de edad");
      this.AddFiltro(Filtros, 17, "Fecha de retiro");
      this.AddFiltro(Filtros, 18, "País residencia");
      this.AddFiltro(Filtros, 19, "Departamento residencia");
      this.AddFiltro(Filtros, 20, "Ciudad residencia");
      this.AddFiltro(Filtros, 21, "Barrio residencia");
      this.AddFiltro(Filtros, 22, "Oficina");
      this.AddFiltro(Filtros, 24, "Peps");
      this.AddFiltro(Filtros, 25, "Administra recursos públicos");
      this.AddFiltro(Filtros, 26, "Fecha ultima actualización");
      return Filtros;
    }
    private AddFiltro(Filtros: Filtro[], idFiltro: number, NombreFiltro: string): Filtro[]{
      let filtro : Filtro = new Filtro();
      filtro.idFiltro = idFiltro;
      filtro.NombreFiltro = NombreFiltro;
      Filtros.push(filtro);
      return Filtros;
    }
}
