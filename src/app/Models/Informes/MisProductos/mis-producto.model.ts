export class dataBeneficiariosOlivos {
  FechaAfiliacion: string = "";
  TipoDocumento: string = "";
  NumeroDocumento: string = "";
  Nombre: string = "";
  parentesco: string = "";
  FechaNacimiento: string = "";
  FechaFallecimiento: string = "";
  FechaRetiro: string = "";
}
export class dataBeneficiariosMascotasOlivos {
  FechaAfiliacion: string = "";
  Nombre: string = "";
  raza: string = "";
  color: string = "";
  animal: string = "";
  FechaFallecimiento: string = "";
  FechaRetiro: string = "";
}
export class AutorizadosModel{
    Documento: string = "";
    Nombre: string = "";
    FechaMatricula: string = "";
    Tipo: string = "";
    TipoFirma: string = "";
}
export class CertificadoSaldos{
    AportesSociales: string = "";
    BaseGravamenMovimientosFinancieros: string = "";
    CertificadoDepositoAhorro: string = "";
    CertificadoDepositoContractual: string = "";
    CertificadoDepositoTermino: string = "";
    Ciudad: string = "";
    Creditos: string = "";
    CuentasAhorro: string = "";
    Direccion: string = "";
    GravamenMovimientosFinancieros: string = "";
    NombreTitular: string = "";
    NumeroDocumento: string = "";
    OtrosDiferentesAvivienda: string = "";
    RendimientosFinancierosDevengados: string = "";
    RetencionEnFuente: string = "";
    RetencionPorGravamenMovFinancieros: string = "";
    Vivienda: string = "";
    NombreRetenedor: string = "";
    DocumentoRetenedor: string = "";
    DireccionRetenedor: string = "";
    CiudadRtenedor: string = "";
}
export class TitularRetenciones{
    Direccion: string = "";
    Ciudad: string = "";
    NumeroDocumento: string  = "";
    NombreTitular: string = "";
    TotalRetenciones: string = "";
    NombreRetenedor: string = "";
    DocumentoRetenedor: string = "";
    DireccionRetenedor: string = "";
    CiudadRtenedor: string = "";
}
export class DataEmailSaldos {
  yearGravable: string = "";
  idTerceroCertificate: number = 0;
  TerceroUsuario: number = 0;
  UsuarioModifica: string = "";
  base64MailSaldos: string = "";
  Oficina: string = "";
}
export class DataEmailCertificado {
  yearGravable: string = "";
  idTerceroCertificate: number = 0;
  Anexo: number = 0;
  TerceroUsuario: number = 0;
  UsuarioModifica: string = "";
  base64MailSaldos: string = "";
  Oficina: string = "";
}
export class cuerpoCertificadoSaldos{
    articulo: string = "";
    decreto: string = "";
    fecha: string = "";
    porcentaje: string = "";
}
export class DetalleDisponibleModel {
    Cuenta: string = "";
    Producto: string = "";
    Estado: string = "";
    Oficina: string = "";
    OperacionPermitida: string = "";
    FormaPago: string = "";
    MedioPago: string = "";
    Asesor: string = "";
    AsesorExt: string = "";
    ActivaMvto: boolean = false;
    Exenta: boolean = false;
    Exonerada: boolean = false;
    Timbrar: boolean = false;
    SaldoEfectivo: string = "";
    saldoCanje: string = "";
    Saldototal: string = "";
    FechaMatricula: string = "";
    FechaUltimaTransaccion: string = "";
    FechaCancela: string = "";
}
export class SaldosDisponibles {
    SaldoEfectivo: string = "";
    SaldoCanje: string = "";
    SaldoTotal: string = "";
    RetencioFuente: string = "";
    InteresCausado: string = "";
    SaldoMinimo: string = "";
    InteresXPuntos: string = "";
    InteresXPagar: string = "";
    ValorXSorteo: string = "";
    InteresLiquidado: string = "";
    saldoInicial: string = "";
    libretaPlastico: string = "";
    SaldoExonerado: string = "";
    moraCuotaManejo: string = "";
    tarjetaoPlastico: string = "";
    SaldoPromedioMesAnterior: string = "";
    InteresMesAnterior: string = "";
    RetirosPeriodos: string = "";
    AliasCuenta: string = "";
}
export class Libreta{
  curInicial: string = "";
  curFinal: string = "";
}
export class Tarjeta {
  CobroTarjeta: string = "";
  CuotaManejo: number = 0;
  CuotaManejoMora: number = 0;
  DescripcionConvenio: string = "";
  DiasVigencia: number = 0;
  FechaCambioPlazo: string = "";
  FechaRediferir: string = "";
  FechaVigencia: string = "";
  IdConvenio: number = 0;
  NumeroPagare: number = 0;
  PagoTotal: number = 0;
  NumeroTarjeta: string = "";
  dtmCobro: string = "";
  intDiaCorte: number = 0;
  intDiaPago: number = 0;
  intPlazo: number = 0;
  Convenio: string = "";
  DiaCortePago: string = "";
}
export class Cupo {
  CupoAprobado: number = 0;
  CupoUtilizado: number = 0;
  IdCartera: number = 0;
  Fecha: string = "";
  IdConsecutivo: number = 0;
  IdLinea: number = 0;
  NombreLinea: string = "";
  NumeroPagare: number = 0;
  Radicado: number = 0;
  intCodigo: number = 0;
  PagoMinimo: number = 0;
  PagoTotal: number = 0;
  CuentaCupo: number = 0;
}
export class encabezadoAhoTermino{
    NumeroCuenta: string = "";
    NombreProducto: string = "";
    EstadoProducto: string = "";
    OficinaProducto: string = "";
    OperacionPermitida: string = "";
    Edad: string = "";
    NumeroTitulo: string = "";
    Asesor: string = "";
    AsesorExterno: string = "";
    FechaConstitucion: string = "";
}
export class NegociacionAtermino{
    intPlazo: number = 0;
    ValorTitulo: number = 0;
    FrecuenciaPago: string = "";
    DestinoIntereses: string = "";
    CuentaAhorros: string = "";
    Indicador: string = "";
    Puntos: string = "";
    PuntosAdicionales: string = "";
    tasaAdicional: string = "";
}
export class SaldosAtermino{
    curIntCausado: string = "";
    curIntxPagar: string = "";
    interesPagado: string = "";
    curCanje: string = "";
    curEfectivo: string = "";
    SaldoTotal: number = 0;
    RetencionFuentePeriodo: string = "";
}
export class FechasAtermino {
  Apertura: Date | null = null;
  UltimaTransaccion: Date | null = null;;
  Cancela: string = "";
  dtmUltLiquidacion: string = "";
  dtmProLiquidacion: string = "";
  dtmVencimiento: string = "";
}
export class DetalleContractualModel {
    Cuenta: string = "";
    Producto: string = "";
    Estado: string = "";
    Oficina: string = "";
    OperacionPermitida: string = "";
    FormaPago: string = "";
    NroTitulo: string = "";
    NroSorteo: string = "";
    Asesor: string = "";
    AsesorExt: string = "";
    ActivaMvto: boolean = false;
    Exenta: boolean = false;
    Exonerada: boolean = false;
    Timbrar: boolean = false;
    SaldoEfectivo: string = "";
    saldoCanje: string = "";
    Saldototal: string = "";
    FechaMatricula: string = "";
    FechaUltimaTransaccion: string = "";
    FechaCancela: string = "";
    FechaVencimiento: string = "";
    cuentaAhorros: string = "";
    TipoCuentaDestino: string = "";
    Periodo: string = "";
    Plazo: string = "";
    CuotaMes: string = "";
    ValorPlan: string = "";
    Indicador: string = "";
    Puntos: string = "";
    PuntosAdicionales: string = "";
    TasaEfectiva: number = 0;
    TasaNominal: number = 0;
}
export class DetalleCartera {
// pagos
  PagoTotal: number = 0;
  PagoMini: number = 0;
  TotalCapitalCal: number = 0;
  TotalInteresesCal: number = 0;
  TotalMoraCal: number = 0;
  TotalDiferidosCal: number = 0;
  TotalPagarCal: number = 0;
  Monto: number = 0;
  Cuota: number = 0;
  CuotaLibranza: number = 0;
  AbonoCanje: number = 0;
  InteresContingente: number = 0;
  CapitalMora: number = 0;
  InteresAnticipado: number = 0;
  InteresCorriente: number = 0;
  SaldoProyectado: number = 0;
  InteresMora: number = 0;
  TotalInteres: number = 0;
  SaldoCapital: number = 0;
  SaldoDeuda: number = 0;
  InteresCorrienteMora: number = 0;
  SaldoCapitalPre: number = 0;
  SaldoJuridico: number = 0;
  CostasJudiciales: number = 0;
  IntMoraCastigo: number = 0;
  CorrientesCatigo: number = 0;
  SaldoCapitalCastigo: number = 0;
  CostasJudicialesCastigo: number = 0;
  CupoAprobadoTD: number = 0;
  CupoUtilizadoTD: number = 0;
  CupoDisponibleTD: number = 0;
  CupoAprobadoCN: number = 0;
  CupoUtilizadoCN: number = 0;
  CupoDisponibleCN: number = 0;
  TotalCreComerciaCartera: number = 0;
  TotalCreConsumoCartera: number = 0;
  TotalCreViviendaCartera: number = 0;
  TotalMicroEmpCartera: number = 0;
}
export class DatosProducto{
  DatosEncabezado: any[] = [];
}
export class LogMisProductos{
  IdOficina: number = 0;
  IdUsuarioERP: number = 0;
  IdModulo: number = 0;
  IdOperacion: number = 0;
  IdOpcion: number = 0;
  IdTercero: number = 0;
  IdCuenta: number = 0;
  DatosProductos: DatosProductos | null = null;
}
export class DatosProductos{
  NumeroCuenta: string = "";
  FechaInicial: string = "";
  FechaFinal: string = "";
  idOpcion: number = 0;
  CuentaHija: Boolean = false;
        //Opciones
        //0 para Ojito,
        //1 para movimientos,
        //2 para extractos,
        //3 para cuentas hijas
        //4 para botòn ver detalle
        //5 saldos y retenciones
        //6 retencion en la fte
        //7 extracto TD
}
export class MesxYear{
  idMes: number = 0;
  DescripcionMes: string = "";
}
export class SaldosContractuales {
    SaldoEfectivo: string = "";
    SaldoCanje: string = "";
    SaldoTotal: string = "";
    RetencioFuente: string = "";
    InteresCausado: string = "";
    SaldoMinimo: string = "";
    InteresXPuntos: string = "";
    InteresXPagar: string = "";
    ValorXSorteo: string = "";
    InteresLiquidado: string = "";
}
export class InfoSeguro {
  strCuenta: string = "";
  lngPoliza: number = 0;
  lngCertificado: string = "";
  lngIdCuenta: number = 0;
  CapitalMora: number = 0;
  CuotasPendientes: number = 0;
  dtmNacimiento: string = "";
  FechaConstitucion: string = "";
  curSeguro: string = "";
  curCargo: string = "";
  intFormaPago: number = 0;
  intPeriodoPago: number = 0;
  intPlazo: number = 0;
  Numero: number = 0;
  valorTotal: number = 0;
  curCuota: string = "";
  dtmProximoPago: string = "";
  dtmVencimiento: string = "";
  dtmPlazo: string = "";
  curSaldoAnterior: number = 0;
  curCanje: string = "";
  curProyectado: string = "";
  curEfectivo: string = "";
  curPeriodo: string = "";
  intCuotasPagas: number = 0;
  intCuotasMora: number = 0;
  intMeses: number = 0;
  intAsesor: number = 0;
  intEdoTaquilla: string = "";
  curExento: string = "";
  dtmMatricula: string = "";
  dtmUltimaTrans: string = "";
  dtmCancela: any;
  dtmMora: string = "";
  dtmPagoMora: string = "";
  dtmUltimoCargo: string = "";
  dtmEnvioCarta: string = "";
  curCuotaProyectada: string = "";
  edad: string = "";
  validaJuridico: Boolean = false;
  NombreAsesor: string = "";
  TipoAlerta: string = "";
  DescripcionProducto: string = "";
  DescripcionEstado: string = "";
  DescribeEstado: string = "";
  DescribeOficina: string = "";
  FormaPago: string = "";
  Periodo: string = "";
  Tarifa: string = "";
  TarifaExequial: string = "";
  CompaniaAseguradora: string = "";
  strPlaca: string = "";
  intModelo: number = 0;
  curCobertura: number = 0;
  Marca: string = "";
  strObservacion: string = "";
}
export class EncabezadoRadicado{
  Radicado: number = 0;
  NombreProducto: string = "";
  NombreLinea: string = "";
  Estado: string = "";
  apertura: string = "";
  aprobacion: string = "";
  cancelacion: string = "";
  Oficina: string = "";
  Telefono: string = "";
  NombreAsesor: string = "";
  AsesorExterno: string = "";
  obsComite: string = "";
  obsAsesor: string = "";
}


export class NegociacionRadicado{
  curMonto: number = 0;
  intSistema: number = 0;
  intPerCapital: number = 0;
  intPerInteres: number = 0;
  FormaPago: string = "";
  sngTasa: number = 0;
  intDiasGracia: number = 0;
  curCuota: number = 0;
  intGarantia: number = 0;
  intPlazo: number = 0;
  strGarantia: string = "";
  strSistema: string = "";
  PeriodoCapital: string = "";
  PeriodoInteres: string = "";
  Comite: string = "";
  strUsuario: string = "";
  dtmAprobacion: string = "";
  ValorDiferido: number = 0;
  ValorMensualDiferido: number = 0;
}

export class DecicionRadicado{
  intProducto: number = 0;
  intPlazo: number = 0;
  sngTasa: number = 0;
  intPerCapital: number = 0;
  intGarantia: number = 0;
  intForPago: number = 0;
  intDiasGracia: number = 0;
  intLinea: number = 0;
  curMonto: number = 0;
  curCuota: number = 0;
  NombreLinea: string = "";
}
