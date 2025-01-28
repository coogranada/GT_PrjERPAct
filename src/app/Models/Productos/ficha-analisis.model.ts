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
  VlrAvaluo : number| string = "";
  DetalleGarantia : number | string = "";
  SeguroGarantia : number | string = "";
  DescCobSeguro : number | string = "";
  SeguroDeudor : number | string = "";
  DescCobSeguroDeudor : number | string = "";
  DescripcionInversion : number |string = "";
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
  PromOtras : number | string = "";
  PuntajeExpirian : number | string = "";
  ResultadoScoring : number | string = "";
  PuntajeTrans : string = "";
  Activos : string = "";
  Pasivos : string = "";
  Patrimonio : number | string = "";
  MaxOpCancelReal : string = "";
  MaxOpCancelFinan : string = "";
  MaxOpCancelFinanCoogra : string = "";
  IngresoMensual : string = "";
  PrcSolvencia : string = "";
  UtilidadNetaA : number | string = "";
  CapPagoDir : number | string = "";
  CapPagoTot : number | string = "";
  RentabilidadActivo : number | string = "";
  EndeudamientoDir : string = "";
  EndeudamientoTot : string = "";
  RentabilidadPatrimonio : number | string = "";
  AnalisisEstFinan : number | string = "";
  DescActivos : number | string = "";
  AnalistaEncargado : number | string = "";
  RecomendacionAnalista : number | string = "";
  ConceptoFinal : number | string = "";
  ExtinguidasPrin : number | string | null = "";
  ExtinguidasCode : number | string | null = "";
  VigentesPrin : string | null = "";
  VigentesCode : string | null = "";
  CheckList : any = false;
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

