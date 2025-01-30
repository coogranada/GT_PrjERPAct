export class ParametrosTransmisionData {
    IdParametro: number;
    NombreSitio: string;
    Servidor: string;
    Estado: number;
    Protocolo: string;
    Usuario: string;
    Contrasena: string;
    Cifrado: string;
    CorreoResponsable: string;
    Frecuencia: number;
    HoraEntrada: string;
    HoraSalida: string;
    RutaLocalEntrada: string;
    RutaLocalSalida: string;
    RutaRemotaEntrada: string;
    RutaRemotaSalida: string;
    GPGRecipient: string;
    RutaLlave: string;
    FechaCreacion: Date;

    constructor(
      IdParametro: number,
      NombreSitio: string,
      Servidor: string,
      Estado: number,
      Protocolo: string,
      Usuario: string,
      Contrasena: string,
      Cifrado: string,
      CorreoResponsable: string,
      Frecuencia: number,
      HoraEntrada: string,
      HoraSalida: string,
      RutaLocalEntrada: string,
      RutaLocalSalida: string,
      RutaRemotaEntrada: string,
      RutaRemotaSalida: string,
      GPGRecipient: string,
      RutaLlave: string,
      FechaCreacion: Date
    ) {
      // Inicializando las propiedades con los parámetros
      this.IdParametro = IdParametro;
      this.NombreSitio = NombreSitio;
      this.Servidor = Servidor;
      this.Estado = Estado;
      this.Protocolo = Protocolo;
      this.Usuario = Usuario;
      this.Contrasena = Contrasena;
      this.Cifrado = Cifrado;
      this.CorreoResponsable = CorreoResponsable;
      this.Frecuencia = Frecuencia;
      this.HoraEntrada = HoraEntrada;
      this.HoraSalida = HoraSalida;
      this.RutaLocalEntrada = RutaLocalEntrada;
      this.RutaLocalSalida = RutaLocalSalida;
      this.RutaRemotaEntrada = RutaRemotaEntrada;
      this.RutaRemotaSalida = RutaRemotaSalida;
      this.GPGRecipient = GPGRecipient;
      this.RutaLlave = RutaLlave;
      this.FechaCreacion = FechaCreacion;
    }
  }
  