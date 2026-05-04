import { Injectable } from '@angular/core';
import { BusquedaConfig } from '../../Models/Genericos/busqueda-generica.model';

@Injectable({
  providedIn: 'root'
})
export class BusquedaGenericaService {


  ejecutar<T>(config: BusquedaConfig<T>): void {

    const id = config.idInput ? config.idInput.toString().trim() : '';
    const nombre = config.nombreInput
      ? config.nombreInput.toString().trim().toLowerCase()
      : '';

    // CASO 2: no escribió nada
    if (!id && !nombre) {
      if (config.buttonSearch) {
        config.onMultiple([...config.lista]);
      }
      return;
    }

    const resultados = config.lista.filter(item =>
      (id && config.getId(item).startsWith(id)) ||
      (nombre && config.getNombre(item).toLowerCase().includes(nombre))
    );

    // CASO 1: una coincidencia
    if (resultados.length === 1) {
      config.onConfirm(resultados[0]);
      return;
    }

    // CASO 3: varias → solo por nombre
    if (nombre) {
      const porNombre = config.lista.filter(item =>
        config.getNombre(item).toLowerCase().includes(nombre)
      );

      if (porNombre.length === 1) {
        config.onConfirm(porNombre[0]);
        return;
      }

      if (porNombre.length > 1) {
        config.onMultiple(porNombre);
        return;
      }
    }

    // CASO 4: ninguna
    config.onNotFound?.();
  }
}
