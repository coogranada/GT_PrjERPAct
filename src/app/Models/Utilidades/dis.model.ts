export class DisData {
    Codigo: string;
    FechaMovimiento: string;
    Cajero: string;
    Constante: string;
    Valor: number;

    constructor(Codigo: string,
        FechaMovimiento: string,
        Cajero: string,
        Constante: string,
        Valor: number) {
        this.Codigo = Codigo;
        this.FechaMovimiento = FechaMovimiento;
        this.Cajero = Cajero;
        this.Constante = Constante;
        this.Valor = Valor;
    }
}