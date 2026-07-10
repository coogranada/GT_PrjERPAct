export interface ChequeDTO {
 idBanco: number;
 nombreBanco: string;
 cuentaCorriente: string;
 numeroCheque: string;
 idRemesa: number;
 descripcionRemesa: string;
 valorCheque: number;
}

export interface ChequeRetDTO {
 cuentaBanco: number;
 nombreBanco: string;
 beneficiario: string;
 numeroCheque: number;
 valorCheque: number;
 idBanco: number;
 observacion: string;
}
