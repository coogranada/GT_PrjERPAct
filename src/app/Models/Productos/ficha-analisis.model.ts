export class FADeudor{
  lngRadicado : string = "";
  IdTercero : string = "";
  Monto : string = "";
  Destino : string = "";
  Linea : string = "";
  FormaPago : string = "";
  Plazo : string = "";
  Cuota : string = "";
  Tasa : string = "";
  Garantia : string = "";
  VlrAvaluo : string = "";
  DetalleGarantia : string = "";
  SeguroGarantia : string = "";
  DescCobSeguro : string = "";
  SeguroDeudor : string = "";
  DescCobSeguroDeudor : string = "";
  DescripcionInversion : string = "";
  Nombre : string = "";
  Documento : string = "";
  Correo : string = "";
  AsociadoDesde : string = "";
  VlrAportes : string = "";
  Empresa : string = "";
  ActividadEconomica : string = "";
  Antiguedad : string = "";
  Ocupacion : string = "";
  PromCoogranada : string = "";
  PromOtras : string = "";
  PuntajeExpirian : string = "";
  ResultadoScoring : string = "";
  PuntajeTrans : string = "";
  Activos : string = "";
  Pasivos : string = "";
  Patrimonio : string = "";
  MaxOpCancelReal : string = "";
  MaxOpCancelFinan : string = "";
  MaxOpCancelFinanCoogra : string = "";
  IngresoMensual : string = "";
  PrcSolvencia : string = "";
  UtilidadNetaA : string = "";
  CapPagoDir : string = "";
  CapPagoTot : string = "";
  RentabilidadActivo : string = "";
  EndeudamientoDir : string = "";
  EndeudamientoTot : string = "";
  RentabilidadPatrimonio : string = "";
  AnalisisEstFinan : string = "";
  DescActivos : string = "";
  AnalistaEncargado : string = "";
  RecomendacionAnalista : string = "";
  ConceptoFinal : string = "";
  ExtinguidasPrin : string = "";
  ExtinguidasCode : string = "";
  VigentesPrin : string = "";
  VigentesCode : string = "";
  CheckList : string = "";
  IdAsesorModifica : string = "";
  IdOficina : string = "";
  IdUsuarioERP : string = "";
}
export class LogFichaAnalisis
{
  IdOficina: number = 0;
  IdUsuarioERP: number = 0;
	IdOperacion :number = 0;
  IdAsesorModifica: number = 0;
  JsonDto: string = "";
  Radicado: number = 0;
}
export class ObligacionesVigentes
{
  Titulo: string = "";
  Calidad: string = "";
  Otorgado: number = 0;
  Cantidad: number = 0;
  Utilidad: number = 0;
  Cuota: number = 0;
  Mora: number = 0;
}
export class ObligacionesExtinguidas
{
  Titulo: string = "";
  Calidad: string = "";
  Otorgado: number = 0;
  Cantidad: number = 0;
  Utilidad: number = 0;
  Cuota: number = 0;
  Mora: string = "0-29";
}

export class CheckList
{
  InfoActualizadaSGF : string = "";
  CondicionesCredito : string = "";
  FormatoAsegurabilidad : string = "";
  ListaRestrictiva : string = "";
  Scoring : string = "";
  Avaluo : string = "";
  EstudiosTitulos : string = "";
  PolizaIncendios : string = "";
  EstadoDeCuenta : string = ""
}
export class DtosAttachFiles
{
  Documento : string = "";
  usuario : string = "";
  Radicado : string = "";
  idWorkFlow : string = "";
  base64 : string = "";
}

