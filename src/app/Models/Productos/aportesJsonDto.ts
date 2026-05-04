export class AdicionarEliminar {
    Accion: string;
    DocumentoBeneficiario: string;
    NombreBeneficiario: string;
    Porcentaje: string;
    Parentesco: string;
    constructor(Accion : string , Documento : string , Nombre : string, Porcentaje : string,Parentesco : string ) {
        this.Accion = Accion,
        this.DocumentoBeneficiario = Documento,
        this.NombreBeneficiario = Nombre,
        this.Porcentaje = Porcentaje,
        this.Parentesco = Parentesco
    }
}
export class AperturaCuentaDto{
    Documento: string = "";
    Nombre: string = "";
    Oficina: string = "";
    IdProducto: number = 0;
    Producto: string = "";
    OperacionPermitida: string = "";
    IdAsesor: number = 0;
    Asesor: string = "";
    Estado: string = "";
    IdAsesorExterno: number = 0;
    AsesorExterno: string = "";
    FormaPago: string = ""; 
    Beneficiarios: any;
}
export class CambiarAsesorDto{
    IdAsesorExternoAnterior: string = "";
    AsesorExternoAnterior: string = "";
    IdAsesorExternoActualiza: string = "";
    AsesorExternoActualiza: string = "";
}
export class CambiarFormaPagoDto{
    FormaPagoAnterior: string = "";
    FormaPagoActualiza: string = "";
}