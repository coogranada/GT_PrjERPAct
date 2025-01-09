export class Filtro{
  idFiltro: number = 0;
  idValue: number = 0;
  NombreFiltro: string = "";
  ValorInicial: string = "";
  ValorFinal: string = "";
  Validacion: string = "";
}

export class Campo{
  idCampo: number = 0;
  NombreCampoBD: string = "";
  NombreCampo: string = "";
  NombreAs: string = "";
  check: boolean = false;
}
export class Informe{
  Filtros: Filtro[] = [];
  Campos: Campo[] = [];
}
