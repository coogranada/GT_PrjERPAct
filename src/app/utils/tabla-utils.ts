export interface MapeoColumna {
    encabezado: string;              // lo que se verá en la tabla
    campos?: string[];               // uno o más campos que se van a concatenar
    obtenerValor?: (item: any) => any; // función personalizada para el valor final
  }

export function transformarDatosParaTabla<T>(
    data: T[],
    columnas: MapeoColumna[]
  ): Record<string, any>[] {
    return data.map(item => {
      const filaTransformada: Record<string, any> = {};
  
      columnas.forEach(col => {
        if (col.obtenerValor) {
          filaTransformada[col.encabezado] = col.obtenerValor(item);
        } else if (col.campos && col.campos.length > 1) {
          // Concatenar varios campos con espacio
          filaTransformada[col.encabezado] = col.campos.map(c => item[c as keyof T]).join(' ');
        } else if (col.campos?.length === 1) {
          filaTransformada[col.encabezado] = item[col.campos[0] as keyof T];
        } else {
          filaTransformada[col.encabezado] = '';
        }
      });
  
      return filaTransformada;
    });
  }