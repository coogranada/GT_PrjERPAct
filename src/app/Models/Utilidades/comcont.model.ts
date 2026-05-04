export class ComContData {
    FechaT: string;
    CodigoConcepto: string;
    C1: string;
    CodigoEntidad: string;
    Nit: string;
    Entidad: string;
    XCobrar: number;
    XPagar: number;
    FechaC: Date;
  
    constructor(FechaT: string, CodigoConcepto: string, C1: string, CodigoEntidad: string, Nit: string, Entidad: string, XCobrar: number, XPagar: number, FechaC: Date) {
      this.FechaT = FechaT;
      this.CodigoConcepto = CodigoConcepto;
      this.C1 = C1;
      this.CodigoEntidad = CodigoEntidad;
      this.Nit = Nit;
      this.Entidad = Entidad;
      this.XCobrar = XCobrar;
      this.XPagar = XPagar;
      this.FechaC = FechaC;
    }
  }