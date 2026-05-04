import { Pipe, PipeTransform } from '@angular/core';
import { TipoDocumento, TipoDocumentoDescripcion } from '../../Models/Generales/tipos-documento.enum';

@Pipe({
  name: 'tipoDocumento'
})
export class TipoDocumentoPipe implements PipeTransform {
  transform(value: string): string {
    return TipoDocumentoDescripcion[value as TipoDocumento] || '';
  }
}