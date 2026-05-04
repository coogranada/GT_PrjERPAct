export enum TipoDocumento {
  Cedula = '1',
  CedulaExtranjeria = '2',
  Nit = '3',
  TarjetaIdentidad = '4',
  Nuip = '5',
  RegistroCivil = '7',
  Otro = '8',
  Pasaporte = '9',
  PTP = '10',
  PPT = '11',
}

export const TipoDocumentoDescripcion: Record<TipoDocumento, string> = {
  [TipoDocumento.Cedula]: 'CC',
  [TipoDocumento.CedulaExtranjeria]: 'CE',
  [TipoDocumento.Nit]: 'NIT',
  [TipoDocumento.TarjetaIdentidad]: 'TI',
  [TipoDocumento.Nuip]: 'NUIP',
  [TipoDocumento.RegistroCivil]: 'RC',
  [TipoDocumento.Otro]: 'OTR',
  [TipoDocumento.Pasaporte]: 'PAS',
  [TipoDocumento.PTP]: 'PTP',
  [TipoDocumento.PPT]: 'PPT',
};