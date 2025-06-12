export class ParametrosArchivosData {
    IdParametrosArchivos: number;
    NombreTarea: string;
    NombreSP: string;
    DiaInicial: Date;
    DiaFinal: Date;
    NombreSalida: string;
    FormatoFecha: string;
    TipoDeArchivo: string;
    Separador: string;
    Frecuencia: string;
    DiaGenera: string;
    HoraGenera: string;
    RutaLocalSalida: string;
    UltFechaGeneracion?: Date;
    Estado: boolean;
    FechaMatricula: Date;
    FechaRetiro?: Date;
    CorreoResponsable: string;
    selected: boolean;
  
    constructor(
      IdParametrosArchivos: number,
      NombreTarea: string,
      NombreSP: string,
      DiaInicial: Date,
      DiaFinal: Date,
      NombreSalida: string,
      FormatoFecha: string,
      TipoDeArchivo: string,
      Separador: string,
      Frecuencia: string,
      DiaGenera: string,
      HoraGenera: string,
      RutaLocalSalida: string,
      UltFechaGeneracion: Date | undefined,
      Estado: boolean,
      FechaMatricula: Date,
      FechaRetiro: Date | undefined,
      CorreoResponsable: string,
      selected: boolean
    ) {
      this.IdParametrosArchivos = IdParametrosArchivos;
      this.NombreTarea = NombreTarea;
      this.NombreSP = NombreSP;
      this.DiaInicial = DiaInicial;
      this.DiaFinal = DiaFinal;
      this.NombreSalida = NombreSalida;
      this.FormatoFecha = FormatoFecha;
      this.TipoDeArchivo = TipoDeArchivo;
      this.Separador = Separador;
      this.Frecuencia = Frecuencia;
      this.DiaGenera = DiaGenera;
      this.HoraGenera = HoraGenera;
      this.RutaLocalSalida = RutaLocalSalida;
      this.UltFechaGeneracion = UltFechaGeneracion;
      this.Estado = Estado;
      this.FechaMatricula = FechaMatricula;
      this.FechaRetiro = FechaRetiro;
      this.CorreoResponsable = CorreoResponsable;
      this.selected = false;
    }
  }
  